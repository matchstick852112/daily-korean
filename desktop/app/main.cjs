// Mac 分享版外壳：窗口里只加载打包进来的 www（app://korean/），不联网取页面；AI 伙伴由主进程直连 DeepSeek
const {app, BrowserWindow, Menu, ipcMain, nativeTheme, net, protocol, session, systemPreferences} = require('electron');
const fs = require('node:fs');
const {execFile, spawn} = require('node:child_process');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

const WWW = app.isPackaged ? path.join(__dirname, 'www') : path.join(__dirname, '..', '..', 'www'); // 开发时直接读项目里的 www
const HOME = 'app://korean/index.html';
// 固定的 app:// 来源：学习进度（localStorage）存得稳，麦克风也算安全来源
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {standard: true, secure: true, supportFetchAPI: true}}]);

if (!app.requestSingleInstanceLock()) app.quit();
let win = null;

function serve() {
  protocol.handle('app', req => {
    const file = path.normalize(path.join(WWW, decodeURIComponent(new URL(req.url).pathname)));
    if (!file.startsWith(WWW + path.sep)) return new Response('', {status: 404});
    return net.fetch(pathToFileURL(file).toString());
  });
}

// 只放行跟读录音要的麦克风，其他权限一律拒绝
function permissions() {
  session.defaultSession.setPermissionRequestHandler((_wc, perm, done, details) => {
    const audioOnly = perm === 'media' && (details.mediaTypes || []).every(t => t === 'audio');
    if (!audioOnly) return done(false);
    systemPreferences.askForMediaAccess('microphone').then(done, () => done(false));
  });
}

// DeepSeek 凭据打包时写进 korean-private.json，只在这里读取，不交给网页
function tutorConfig() {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'korean-private.json'), 'utf8')); } catch { return null; }
}
const jobs = new Map();
const ours = e => e.senderFrame?.url.startsWith('app://korean/');
const PYTHON = '/opt/homebrew/bin/python3.11';
const run = (cmd, args, options) => new Promise((resolve, reject) => {
  const p = execFile(cmd, args, {timeout:45000, maxBuffer:1024 * 1024, ...options}, (err, stdout, stderr) => err ? reject(err) : resolve(stdout));
  p.stdin.end(options.input);
});
const EDGE_TTS = `
import asyncio, edge_tts, sys
asyncio.run(edge_tts.Communicate(sys.stdin.read(), 'ko-KR-SunHiNeural', rate='-5%').save(sys.argv[1]))
`;
let edgeRun = 0;
const edgeJobs = new Map();
async function synthEdge(text) {
  if (text.length > 800) throw Error('long');
  const file = path.join(app.getPath('temp'), 'korean-edge-' + process.pid + '-' + (++edgeRun) + '.mp3');
  try {
    await run(PYTHON, ['-c', EDGE_TTS, file], {input:text, timeout:45000, maxBuffer:1024 * 1024});
    const audio = fs.readFileSync(file);
    if (audio.length < 1000) throw Error('empty');
    return audio;
  } finally {
    fs.rm(file, {force:true}, () => {});
  }
}
function tutor() {
  ipcMain.handle('tutor:status', e => {
    const c = ours(e) && tutorConfig();
    return {configured: !!c?.key, model_label: c?.display_name, personal: false};
  });
  ipcMain.handle('tutor:request', async (e, {requestId, body} = {}) => {
    const c = ours(e) && tutorConfig();
    if (!c?.key) return {error: '这个版本没有开通 AI 伙伴。'};
    if (!requestId || !body || jobs.size >= 2 || jobs.has(requestId)) return {error: '还有请求正在处理，请稍后再试。'};
    const job = new AbortController(); jobs.set(requestId, job);
    const timer = setTimeout(() => job.abort(), 150000);
    try {
      const r = await net.fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST', redirect: 'error', signal: job.signal,
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + c.key},
        body: JSON.stringify({...body, model: c.model})
      });
      if (!r.ok) return {error: r.status === 401 ? '内置连接凭据需要更新，请重新打包。' : r.status === 402 ? 'DeepSeek账户余额不足，请补充后重试。' : r.status === 429 ? 'DeepSeek暂时繁忙，请稍后重试。' : 'DeepSeek暂未完成请求，请稍后重试。'};
      return {data: await r.json()};
    } catch {
      return {error: job.cancelled ? '已停止这次请求。' : '未能连接DeepSeek。请检查网络后重试。'};
    } finally { clearTimeout(timer); jobs.delete(requestId); }
  });
  ipcMain.handle('tutor:cancel', (_e, {requestId} = {}) => {
    const job = jobs.get(requestId);
    if (job) { job.cancelled = true; job.abort(); }
  });
}

// 朗读用 macOS 自带的 say：Chromium 的 Web Speech 在 Mac 上会吞开头、卡顿、连读中断
let voice = null;
function koVoice() { // 装了高音质 Yuna 就用高音质的；say 遇到没装的声音会静音，所以先查清单
  return voice ??= new Promise(done => execFile('osascript', ['-l', 'JavaScript', '-e',
    'ObjC.import("AppKit"); const v = $.NSSpeechSynthesizer.availableVoices, out = []; for (let i = 0; i < v.count; i++) out.push(v.objectAtIndex(i).js); out.join("\\n")'],
    (err, out) => {
      const ids = err ? [] : out.split('\n');
      done(['premium', 'enhanced', 'compact'].map(q => `com.apple.voice.${q}.ko-KR.Yuna`).find(id => ids.includes(id)) || 'Yuna');
    }));
}
let speaking = null, sayRun = 0;
function stopSpeaking() { if (speaking) { speaking.cancelled = true; speaking.proc.kill(); speaking = null; } }
function speech() {
  ipcMain.handle('speech:edge', async (e, {requestId, text} = {}) => {
    if (!ours(e)) return {error:'请求已取消。'};
    // 每次生成使用独立状态，上一次停止不会取消下一段语音。
    const job = {cancelled:false}; edgeJobs.set(requestId, job);
    try {
      const audio = await synthEdge(String(text || '').trim());
      return job.cancelled ? {error:'cancelled'} : {data:audio};
    } catch {
      return {error:'暂时不能生成自然朗读，请再试一次。'};
    } finally { edgeJobs.delete(requestId); }
  });
  ipcMain.handle('speech:edge-stop', (_e, {requestId} = {}) => { const job=edgeJobs.get(requestId); if(job) { job.cancelled=true; edgeJobs.delete(requestId); } });
  ipcMain.handle('speech:speak', async (e, {text, rate} = {}) => {
    text = String(text || '').trim();
    if (!ours(e) || !text || text.length > 400) return {error: '这段太长了，没法朗读。'};
    const run = ++sayRun;
    stopSpeaking();
    const v = await koVoice();
    if (run !== sayRun) return {data: {cancelled: true}}; // 等声音清单时又点了别的
    const wpm = Math.round(175 * Math.min(Math.max(Number(rate) || 0.9, 0.3), 2)); // 175 是 say 的默认语速
    return new Promise(done => {
      const job = {proc: spawn('say', ['-v', v, '-r', String(wpm), '-f', '-'], {stdio: ['pipe', 'ignore', 'ignore']})};
      speaking = job;
      job.proc.on('error', () => done({error: '韩语语音没能播放。'}));
      job.proc.on('exit', code => {
        if (speaking === job) speaking = null;
        done(job.cancelled ? {data: {cancelled: true}} : code === 0 ? {data: {cancelled: false}} : {error: '韩语语音没能播放。'});
      });
      job.proc.stdin.end(text);
    });
  });
  ipcMain.handle('speech:stop', () => { sayRun++; stopSpeaking(); });
  app.on('before-quit', stopSpeaking);
}

// 大窗口/全屏时按 1440×900 的排版整体放大，不让内容缩在左上角；菜单里的放大缩小在此基础上再调
let userScale = 1;
function fitZoom() {
  if (!win) return;
  const {width, height} = win.getContentBounds();
  const fit = Math.min(Math.max(Math.min(width / 1440, height / 900), 1), 1.75);
  const f = Math.round(fit * userScale * 20) / 20;
  if (Math.abs(win.webContents.getZoomFactor() - f) > 0.01) win.webContents.setZoomFactor(f);
}
const zoomBy = k => () => { userScale = k ? Math.min(Math.max(userScale * k, 0.6), 2) : 1; fitZoom(); };

const go = tab => () => win?.webContents.executeJavaScript(`deskGo(${JSON.stringify(tab)})`).catch(() => {});
function menu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {label: '学韩语', submenu: [
      {role: 'about', label: '关于学韩语'},
      {type: 'separator'},
      {label: '设置…', accelerator: 'Cmd+,', click: go('settings')},
      {type: 'separator'},
      {role: 'hide', label: '隐藏学韩语'},
      {role: 'hideOthers', label: '隐藏其他'},
      {role: 'unhide', label: '全部显示'},
      {type: 'separator'},
      {role: 'quit', label: '退出学韩语'}
    ]},
    {label: '编辑', submenu: [
      {role: 'undo', label: '撤销'}, {role: 'redo', label: '重做'}, {type: 'separator'},
      {role: 'cut', label: '剪切'}, {role: 'copy', label: '拷贝'}, {role: 'paste', label: '粘贴'}, {role: 'selectAll', label: '全选'}
    ]},
    {label: '前往', submenu: [
      {label: '今日', accelerator: 'Cmd+1', click: go('home')},
      {label: '复习', accelerator: 'Cmd+2', click: go('review')},
      {label: '课程', accelerator: 'Cmd+3', click: go('course')},
      {label: 'AI 伙伴', accelerator: 'Cmd+4', click: go('talk')}
    ]},
    {label: '显示', submenu: [
      {label: '实际大小', accelerator: 'Cmd+0', click: zoomBy(0)}, {label: '放大', accelerator: 'Cmd+=', click: zoomBy(1.1)}, {label: '缩小', accelerator: 'Cmd+-', click: zoomBy(1 / 1.1)},
      {type: 'separator'}, {role: 'togglefullscreen', label: '进入全屏幕'}
    ]},
    {label: '窗口', submenu: [{role: 'minimize', label: '最小化'}, {role: 'zoom', label: '缩放'}, {type: 'separator'}, {role: 'close', label: '关闭窗口'}]}
  ]));
}

function open() {
  nativeTheme.themeSource = 'light'; // 每日韩语只做浅色
  win = new BrowserWindow({
    width: 1240, height: 820, minWidth: 1000, minHeight: 680, show: false, title: '每日韩语',
    titleBarStyle: 'hiddenInset', trafficLightPosition: {x: 20, y: 20},
    backgroundColor: '#F6F5F1',
    webPreferences: {preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, sandbox: true, spellcheck: false}
  });
  win.once('ready-to-show', () => { fitZoom(); win.show(); });
  win.on('resize', fitZoom);
  win.webContents.on('did-finish-load', fitZoom);
  win.webContents.setWindowOpenHandler(() => ({action: 'deny'}));
  win.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('app://korean/')) e.preventDefault(); });
  win.on('closed', () => { win = null; });
  win.loadURL(HOME);
}

app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(() => {
  app.setAboutPanelOptions({applicationName: '学韩语', applicationVersion: app.getVersion(), credits: '首尔大学韩国语 1A–6B + 维他命韩国语 1–6 · Mac 分享版'});
  serve(); permissions(); tutor(); speech(); menu(); open();
});
app.on('window-all-closed', () => app.quit());
