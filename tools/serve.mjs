// 浏览器预览用的本机中转：只监听 127.0.0.1，静态页面 + /api/chat 转发到 DeepSeek 官方接口。
// 连接凭据读取方式与探索队 server/model-config.mjs 相同，只在本进程内存中使用，不写入网页、不打印。
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';

const PORT = Number(process.env.PORT || 5192);
const ROOT = path.join(import.meta.dirname, '..', 'www');
const MODEL = 'deepseek-flash'; // 官方文档：对应 DeepSeek-V4.1-Flash-1017
const BASE = 'https://api.deepseek.com';

function apiKey(env = process.env) {
  const file = env.EXPLORERS_DEEPSEEK_ENV_FILE || '/Users/mac/uad-rag/.env';
  const saved = fs.existsSync(file) ? parseEnv(fs.readFileSync(file, 'utf8')) : {};
  const valid = v => typeof v === 'string' && v.length > 20 && /^[\x21-\x7e]+$/.test(v);
  return [env.EXPLORERS_DEEPSEEK_API_KEY, saved.LLM_BINDING_API_KEY, saved.VLM_API_KEY].find(valid);
}
const KEY = apiKey();

const TYPES = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg'};
const send = (res, code, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, {'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff'});
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};

function readBody(req, limit = 64_000) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// 只接受 system + 最近 30 轮对话，模型和参数由服务端固定
function cleanMessages(raw) {
  if (!Array.isArray(raw) || !raw.length || raw.length > 61) throw Error('对话格式不正确');
  return raw.map(m => {
    if (!['system', 'user', 'assistant'].includes(m?.role) || typeof m.content !== 'string' || m.content.length > 8000) throw Error('对话格式不正确');
    return {role: m.role, content: m.content};
  });
}

async function chat(req, res) {
  if (!KEY) return send(res, 503, {error: '没有找到 DeepSeek 连接凭据（与探索队同一配置）。'});
  let messages;
  try { messages = cleanMessages(JSON.parse(await readBody(req)).messages); }
  catch { return send(res, 400, {error: '请求格式不正确'}); }
  const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 45_000);
  req.on('close', () => { if (!res.writableEnded) ctrl.abort(); });
  try {
    const r = await fetch(BASE + '/chat/completions', {
      method: 'POST', signal: ctrl.signal,
      headers: {'content-type': 'application/json', authorization: 'Bearer ' + KEY},
      body: JSON.stringify({model: MODEL, messages, max_tokens: 1200, temperature: 0.7, response_format: {type: 'json_object'}, thinking: {type: 'disabled'}})
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const msg = r.status === 401 ? '连接凭据无效' : r.status === 402 ? 'DeepSeek 账户余额不足' : r.status === 429 ? '请求太频繁，稍后再试' : 'DeepSeek 暂时没有响应（' + r.status + '）';
      return send(res, 502, {error: msg});
    }
    const choice = data.choices?.[0];
    send(res, 200, {content: choice?.message?.content || '', finish: choice?.finish_reason, model: data.model, usage: data.usage});
  } catch (e) {
    send(res, 504, {error: e.name === 'AbortError' ? '等太久了，请重试' : '网络连接失败'});
  } finally { clearTimeout(timer); }
}

async function edgeSpeech(req, res) {
  if (!/^(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(req.headers.host || '')) return send(res, 403, {error:'forbidden'});
  let text;
  try { text = JSON.parse(await readBody(req)).text; } catch { return send(res, 400, {error:'bad text'}); }
  if (typeof text !== 'string' || !text.trim() || text.length > 800) return send(res, 400, {error:'bad text'});
  const {spawn} = await import('node:child_process');
  const file = `/tmp/korean-edge-${process.pid}-${Date.now()}.mp3`;
  const p = spawn('/opt/homebrew/bin/python3.11', ['-c', 'import asyncio,edge_tts,sys;asyncio.run(edge_tts.Communicate(sys.stdin.read(),"ko-KR-SunHiNeural",rate="-5%").save(sys.argv[1]))', file], {stdio:['pipe','ignore','ignore']});
  p.on('error', () => send(res, 502, {error:'speech failed'}));
  p.on('exit', async code => {
    if (code !== 0) return send(res, 502, {error:'speech failed'});
    const audio = await fs.promises.readFile(file).catch(() => null);
    fs.rm(file, {force:true}, () => {});
    if (!audio) return send(res, 502, {error:'speech failed'});
    res.writeHead(200, {'content-type':'audio/mpeg', 'content-length':audio.length, 'cache-control':'no-store'});
    res.end(audio);
  });
  p.stdin.end(text.trim());
}

http.createServer(async (req, res) => {
  // 防 DNS 重绑定：只认本机 Host
  if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host || '')) return send(res, 403, {error: 'forbidden'});
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname === '/api/status') return send(res, 200, {configured: Boolean(KEY), model: MODEL, label: 'DeepSeek V4.1 Flash · 1017'});
  if (url.pathname === '/api/chat') return req.method === 'POST' ? chat(req, res) : send(res, 405, {error: 'POST only'});
  if (url.pathname === '/api/tts') return req.method === 'POST' ? edgeSpeech(req, res) : send(res, 405, {error: 'POST only'});
  const file = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname.slice(1));
  const full = path.join(ROOT, file);
  if (!full.startsWith(ROOT + path.sep) || path.extname(full) === '.mjs' || !fs.existsSync(full) || !fs.statSync(full).isFile()) return send(res, 404, 'not found', 'text/plain');
  send(res, 200, fs.readFileSync(full), TYPES[path.extname(full)] || 'application/octet-stream');
}).listen(PORT, '127.0.0.1', () => console.log(`学韩语预览：http://127.0.0.1:${PORT}  ·  DeepSeek ${KEY ? '已配置' : '未配置'}`));
