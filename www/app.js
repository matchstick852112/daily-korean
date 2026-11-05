/* 学韩语 · 应用逻辑（首尔大学韩国语 + 维他命韩语）。界面与按钮样式沿用设计原型 v0.1（设计方案-v0.1/原型/index.html） */

/* ---------- 图标：SF Symbols 风格线性图标，24 格，1.9 线宽 ---------- */
const IC = {
  calendar:'<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3.5 10h17"/>',
  house:'<path d="M3.5 10.2 12 3.5l8.5 6.7V19a1.5 1.5 0 0 1-1.5 1.5h-4.2v-5.8H9.2v5.8H5A1.5 1.5 0 0 1 3.5 19z"/>',
  review:'<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.6 4.2v4.3h-4.3"/>',
  book:'<path d="M12 6.2C10.4 4.9 8.2 4.4 4.5 4.5v13.8c3.7-.1 5.9.4 7.5 1.7 1.6-1.3 3.8-1.8 7.5-1.7V4.5c-3.7-.1-5.9.4-7.5 1.7z"/><path d="M12 6.2V20"/>',
  sparkles:'<path d="M10.5 3.5l1.6 4.6 4.6 1.6-4.6 1.6-1.6 4.6-1.6-4.6-4.6-1.6 4.6-1.6z"/><path d="M17.8 14.2l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
  play:'<path d="M8 5.6v12.8a.9.9 0 0 0 1.4.8l10-6.4a.9.9 0 0 0 0-1.6l-10-6.4A.9.9 0 0 0 8 5.6z" fill="currentColor" stroke="none"/>',
  chevR:'<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
  chevL:'<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
  mic:'<rect x="9" y="3" width="6" height="11.5" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
  stop:'<rect x="6.5" y="6.5" width="11" height="11" rx="2.5" fill="currentColor" stroke="none"/>',
  pause:'<path d="M8 6v12M16 6v12" stroke-width="3.5"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  up:'<path d="M12 19V5.5M6 11l6-6 6 6"/>',
  lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  plane:'<path d="M12 3c.8 0 1.4.7 1.4 1.5v4.8l7.1 4.3v1.9l-7.1-2.1v4.1l2 1.5V21L12 20l-3.4 1v-2l2-1.5v-4.1l-7.1 2.1v-1.9l7.1-4.3V4.5C10.6 3.7 11.2 3 12 3z"/>',
  bag:'<path d="M5.2 8h13.6l-.9 11.6a1.5 1.5 0 0 1-1.5 1.4H7.6a1.5 1.5 0 0 1-1.5-1.4z"/><path d="M9 8V6.8a3 3 0 0 1 6 0V8"/>',
  pin:'<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  tag:'<path d="M3.5 12.4V4.8a1.3 1.3 0 0 1 1.3-1.3h7.6c.35 0 .7.14.92.38l7.2 7.2a1.3 1.3 0 0 1 0 1.840l-7.6 7.6a1.3 1.3 0 0 1-1.84 0l-7.2-7.2a1.3 1.3 0 0 1-.38-.92z"/><circle cx="8.2" cy="8.2" r="1.4"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  plus:'<path d="M12 5.5v13M5.5 12h13"/>',
  speaker:'<path d="M4 9.3h3.3L12 5.5v13l-4.7-3.8H4z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.6a7.6 7.6 0 0 1 0 10.8"/>',
  sliders:'<path d="M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9"/><circle cx="15" cy="7.5" r="2"/><circle cx="9" cy="16.5" r="2"/>',
  bulb:'<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.4 10.9c.6.4.9 1 .9 1.7v.4h5v-.4c0-.7.3-1.3.9-1.7A6 6 0 0 0 12 3z"/>',
  pencil:'<path d="M4.5 19.5h3.8L18.6 9.2a2 2 0 0 0 0-2.8l-1-1a2 2 0 0 0-2.8 0L4.5 15.7z"/><path d="m13.5 6.5 4 4"/>',
  bubble:'<path d="M4.5 6.8A2.8 2.8 0 0 1 7.3 4h9.4a2.8 2.8 0 0 1 2.8 2.8v7a2.8 2.8 0 0 1-2.8 2.8h-6L6 20v-3.4a2.8 2.8 0 0 1-1.5-2.5z"/>'
};
const ic = (n,s=20,w=1.9)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

/* ---------- 课程目录：两套教材，做好的册可学，其余只列目录 ----------
   每课的 n 是存档用的唯一编号：首尔 1 级沿用课本课号（1A 1–8、1B 9–16），2 级起是 级×100+课号；维他命按 9000 + 册号×1000 + 课序编号 */
const SERIES = [
  {id:'seoul', name:'首尔大学韩国语', short:'首尔', books:[['1A','1 级 · 入门'],['1B','1 级 · 入门'],['2A','2 级'],['2B','2 级'],['3A','3 级'],['3B','3 级'],['4A','4 级'],['4B','4 级'],['5A','5 级'],['5B','5 级'],['6A','6 级'],['6B','6 级']]},
  {id:'vitamin', name:'维他命韩语', short:'维他命', books:[['V1','1 册'],['V2','2 册'],['V3','3 册'],['V4','4 册'],['V5','5 册'],['V6','6 册']]}
];
const LEVEL_NOTE = {1:'1A + 1B ≈ 国际通用标准课程 1 级 / TOPIK I 1 级', 2:'2A + 2B ≈ TOPIK I 2 级', 3:'3A + 3B ≈ TOPIK II 3 级', 4:'4A + 4B ≈ TOPIK II 4 级', 5:'5A + 5B ≈ TOPIK II 5 级', 6:'6A + 6B ≈ TOPIK II 6 级'};
for(const L of LESSONS){ L.book ??= '1A'; L.num ??= L.n; }
const seriesOf = b=>SERIES.find(s=>s.books.some(x=>x[0]===b));
const bookName = b=>b[0]==='V' ? `维他命 ${b.slice(1)}` : b;
const lessonsIn = b=>LESSONS.filter(L=>L.book===b);
const seriesLessons = b=>seriesOf(b)?.books.flatMap(b=>lessonsIn(b[0])) || []; // 一套教材按册、按课排好的全部课
const trackOf = L=>seriesLessons(L.book);
const lname = L=>L.book[0]==='V' ? `${bookName(L.book)} · ${L.num}` : `${L.book} 第 ${L.num} 课`;
const STEPS = ['先听懂','认词','语法','跟读','换词说','用出来','自我评价'];
const stepsOf = L=>L.drill ? [...STEPS.slice(0,6),'练习本','自我评价'] : STEPS; // 有练习本题的课多一步
const STRAND = {'先听懂':'listen','认词':'lang','语法':'lang','跟读':'speak','换词说':'speak','用出来':'flu','练习本':'lang','自我评价':'lang'}; // 四种练习：听懂 / 词和语法 / 开口说 / 练流利
const TABS = [['home','house','今日学习'],['plan','calendar','学习计划'],['review','review','复习'],['course','book','课程'],['talk','sparkles','AI 伙伴']];
const TOPICS = ['随便聊','自我介绍','周末','吃的','追剧','旅行'];
const NEW_PER_DAY = {15:10, 25:20, 40:30};
const lessonOf = n=>LESSONS.find(l=>l.n===n);

/* ---------- 本机存档（只在这台设备上） ---------- */
const STORE = 'ko1a.v1';
const DEF = {start:null, minutes:25, rate:1, showZh:true, cur:0, prog:{}, hg:{}, cando:{}, cards:[], log:{}, newDay:{d:'',c:0}};
function load(){ try{ return {...DEF, ...JSON.parse(localStorage.getItem(STORE)||'{}')}; }catch{ return {...DEF}; } }
let P = load();
// 以前学完 1A 记作 99；后面有了新课，就接着往下
if(P.cur===99){ const nx=seriesLessons('1A').find(L=>!P.prog[L.n]?.done); if(nx) P.cur=nx.n; }
function save(){ try{ localStorage.setItem(STORE, JSON.stringify(P)); }catch{} }
const today = ()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const prog = n=>P.prog[n]||(P.prog[n]={step:0,done:false});

/* 学习时长：按当前页面归到四种练习之一，单段最多记 10 分钟，避免开着不动也累计 */
let mark = null;
function track(strand){
  const now = Date.now();
  if(mark){ const s=Math.min((now-mark.t)/1000, 600); const day=P.log[today()]||(P.log[today()]={}); day[mark.s]=(day[mark.s]||0)+s; save(); }
  mark = strand ? {s:strand, t:now} : null;
}
document.addEventListener('visibilitychange', ()=>{ if(document.hidden){ track(null); stopSpoken(); } else track(strandOfView()); });
function weekMinutes(){
  const out = {listen:0,speak:0,lang:0,flu:0};
  for(let i=0;i<7;i++){ const d=new Date(Date.now()-i*864e5); const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    for(const s in out) out[s]+=(P.log[k]?.[s]||0)/60; }
  return out;
}
const todayMinutes = ()=>Object.values(P.log[today()]||{}).reduce((a,b)=>a+b,0)/60;

/* ---------- 复习：FSRS 排程（ts-fsrs，与探索队同一套） ---------- */
const F = window.FSRS;
const SCHED = F.fsrs({enable_fuzz:true});
const revive = c=>({...c, due:new Date(c.due), last_review:c.last_review?new Date(c.last_review):undefined});
function addCards(list){
  const have = new Set(P.cards.map(c=>c.id));
  for(const c of list) if(!have.has(c.id)) P.cards.push({...c, f:F.createEmptyCard(new Date())});
  save();
}
function lessonCards(L){
  const src = lname(L);
  const lines = L.dialogues.flatMap(d=>d.lines.map((l,i)=>({id:`l${L.n}-${d.p}-${i}`, type:'说', front:l.z, back:l.k, src:`${src} · 第 ${d.p} 页`})));
  const words = L.words.map(w=>({id:`w${L.n}-${w.k}`, type:w.h?'汉字词':'听', front:w.k, back:(w.h?w.h+' · ':'')+w.z, src:`${src} · 词`, listen:true}));
  return [...words, ...lines];
}
function dueCards(){
  const now = new Date();
  if(P.newDay.d!==today()) P.newDay = {d:today(), c:0};
  const old = P.cards.filter(c=>c.f.state!==F.State.New && new Date(c.f.due)<=now);
  const fresh = P.cards.filter(c=>c.f.state===F.State.New).slice(0, Math.max(0,(NEW_PER_DAY[P.minutes]||20)-P.newDay.c));
  return [...old, ...fresh];
}
function gap(d){
  const m = (d-Date.now())/6e4;
  if(m<60) return `${Math.max(1,Math.round(m))} 分钟后`;
  if(m<1440) return `${Math.round(m/60)} 小时后`;
  return `${Math.round(m/1440)} 天后`;
}

/* ---------- 声音：安卓/iOS 用系统原生韩语语音和语音识别；浏览器里用 Web Speech ---------- */
const CAP = window.capacitorExports;
const NATIVE = !!CAP?.Capacitor.isNativePlatform();
const Speech = NATIVE ? CAP.registerPlugin('KoSpeech') : null;
const Say = Speech || window.KO_DESK?.speech || null; // 朗读：Mac 版走 macOS 自带的 say，不用 Chromium 的 Web Speech
const Tutor = NATIVE ? CAP.registerPlugin('KoTutor') : window.KO_DESK?.tutor || null;
const DESK = !!window.KO_DESK; // Mac 分享版（Electron 外壳）：左侧导航 + 宽内容区；AI 经主进程直连 DeepSeek
document.documentElement.classList.toggle('desk', DESK);
const rateOf = slow=>(slow?0.6:0.9)*P.rate;
// Mac 上韩语语音有好几个（Eddy、Grandma…），优先用标准女声 Yuna
function koVoice(){ const vs=speechSynthesis.getVoices().filter(v=>v.lang && v.lang.startsWith('ko')); return vs.find(v=>/Yuna|유나/.test(v.name))||vs[0]; }
function webSay(t,slow){
  return new Promise(r=>{ const u=new SpeechSynthesisUtterance(t); u.lang='ko-KR'; u.rate=rateOf(slow); const v=koVoice(); if(v) u.voice=v; u.onend=r; u.onerror=r; speechSynthesis.speak(u); });
}
let sayRun = 0, cachedAudio = null, trackAudio = null, speechKey = '', speechText = '', speechPaused = false, speechState = 'idle';
const speechButtonKey = t=>{let h=2166136261;for(const c of String(t||'')){h^=c.codePointAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(36)};
function syncSpeechControls(){
  const active=speechState!=='idle';
  const player=document.querySelector('#speech-player');
  if(player){
    player.hidden=!active;
    document.querySelector('#speech-player-text').textContent=speechText;
    document.querySelector('#speech-player-state').textContent={loading:'正在准备语音',playing:'正在播放',paused:'已暂停'}[speechState]||'';
    document.querySelector('#speech-player-icon').innerHTML=ic(speechState==='paused'?'speaker':'play',17);
    document.querySelector('#speech-player-toggle').innerHTML=ic(speechState==='playing'?'pause':'play',20);
    document.querySelector('#speech-player-toggle').setAttribute('aria-label',speechState==='playing'?'暂停播放':'继续播放');
    document.querySelector('#speech-player-close').innerHTML=ic('close',18);
  }
  document.querySelectorAll('[data-speech-key]').forEach(b=>{
    const on=active&&b.dataset.speechKey===speechKey;
    b.classList.toggle('is-playing',on&&!speechPaused);
    b.classList.toggle('is-paused',on&&speechPaused);
    b.setAttribute('aria-pressed',String(on&&!speechPaused));
    b.setAttribute('aria-label',on?(speechPaused?'继续播放':'暂停播放'):'播放语音');
    if(b.classList.contains('play')) b.innerHTML=ic(on&&!speechPaused?'play':'speaker',14);
    if(b.classList.contains('act')) b.innerHTML=`${ic('speaker',16,1.8)}${on?(speechPaused?'继续':'暂停'):'播放'}`;
    if(b.classList.contains('daily-listen')){
      const label=b.querySelector('.speech-label');
      if(label) label.textContent=on?(speechPaused?'继续原音':'暂停原音'):'听原音';
    }
  });
}
function setSpeechState(state){
  speechState=state; speechPaused=state==='paused'; syncSpeechControls();
}
const cachedSrc = t=>{ const id = window.KO_TTS?.[String(t||'').trim()]; return id ? `tts/audio/${id}.mp3` : ''; };
const edgeAudioCache = new Map();
let edgeSeq = 0;
const activeEdge = new Map();
function stopEdgeSpeech(){
  for(const [id,ctrl] of activeEdge){ ctrl.abort(); if(DESK) Say.edgeStop?.({requestId:id}).catch?.(()=>{}); }
  activeEdge.clear();
}
async function dynamicEdgeAudio(text){
  const key=String(text||'').trim();
  if(edgeAudioCache.has(key)) return edgeAudioCache.get(key);
  const id='edge'+(++edgeSeq), ctrl=new AbortController(); activeEdge.set(id,ctrl);
  try{
    let blob;
    if(DESK){
      const r=await Say.edge({requestId:id,text:key});
      blob=new Blob([r],{type:'audio/mpeg'});
    }else{
      const r=await fetch('/api/tts',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text:key}),signal:ctrl.signal});
      if(!r.ok) throw Error('tts');
      blob=await r.blob();
    }
    if(ctrl.signal.aborted) throw Error('cancelled');
    const url=URL.createObjectURL(blob); edgeAudioCache.set(key,url);
    while(edgeAudioCache.size>30){ const old=edgeAudioCache.keys().next().value; URL.revokeObjectURL(edgeAudioCache.get(old)); edgeAudioCache.delete(old); }
    return url;
  }finally{ activeEdge.delete(id); }
}
function stopSpoken(){
  sayRun++; speechKey=''; speechText=''; speechPaused=false; speechState='idle';
  trackAudio?.pause(); cachedAudio?.pause();
  if(trackAudio?._url) URL.revokeObjectURL(trackAudio._url);
  if(cachedAudio?._url) URL.revokeObjectURL(cachedAudio._url);
  trackAudio=null; cachedAudio=null;
  if(Say) Say.stop?.()?.catch?.(()=>{}); else speechSynthesis?.cancel();
  stopEdgeSpeech();
  syncSpeechControls();
}
async function audioFromFile(src){
  // Electron's app:// loader does not reliably stream MP3 to media elements;
  // fetching the same packaged bytes and playing a Blob keeps playback offline.
  const r = await fetch(src); if(!r.ok) throw Error('audio-not-found');
  const blob = await r.blob(); return URL.createObjectURL(blob);
}
function playCached(t,slow,src=cachedSrc(t)){
  if(!src) return Promise.resolve(false);
  return audioFromFile(src).then(url=>new Promise(resolve=>{
    cachedAudio?.pause();
    if(cachedAudio?._url) URL.revokeObjectURL(cachedAudio._url);
    const a=cachedAudio=Object.assign(new Audio(url),{_url:url,_own:true}); a.playbackRate=slow?0.8:1;
    a.onended=()=>{setSpeechState('idle');resolve(true)};
    a.onpause=()=>{if(speechState==='playing')setSpeechState('paused');resolve(true)};
    a.onplay=()=>setSpeechState('playing');
    a.onerror=()=>{setSpeechState('idle');resolve(false)}; a.play().catch(()=>{setSpeechState('idle');resolve(false)});
  })).catch(()=>false);
}
async function speak(t,slow){
  const key=speechButtonKey(t), requestRun=sayRun+1;
  if(key===speechKey&&cachedAudio){
    if(speechState==='paused'){
      cachedAudio.onpause=null;
      await cachedAudio.play().catch(()=>{});
      setSpeechState('playing');
    }else{
      cachedAudio.onpause=null; cachedAudio.pause(); setSpeechState('paused');
    }
    return;
  }
  if(key===speechKey&&speechState==='loading'){ setSpeechState('paused'); return; }
  stopSpoken();
  speechKey=key; speechText=String(t); setSpeechState('loading');
  if(await playCached(t,slow)) return; // 先放打包好的录音，秒开；没有的句子才现场生成
  if(requestRun!==sayRun) return;
  if(speechPaused){ stopSpoken(); return; }
  if(!NATIVE){
    try{ if(await playCached(t,slow,await dynamicEdgeAudio(t))) return; }catch{}
  }
  if(Say){ try{ setSpeechState('playing'); await Say.speak({text:t, rate:rateOf(slow)}); setSpeechState('idle'); }catch(e){ setSpeechState('idle'); toast(e.message||'语音没能播放'); } return; }
  if(!('speechSynthesis' in window)) return toast('这个浏览器不支持朗读');
  setSpeechState('playing'); await webSay(t,slow); setSpeechState('idle');
}
async function playAIReply(t){
  return speak(t,false);
}
// 维他命课本录音：www/audio/册/音轨号.mp3
function playTrack(id){
  const same = trackAudio && !trackAudio.paused && trackAudio._id===id;
  stopSpoken();
  trackAudio?.pause(); trackAudio=null;
  if(same) return; // 正在放的再点一下就停
  audioFromFile(`audio/${id}.mp3`).then(url=>{
    if(trackAudio) URL.revokeObjectURL(trackAudio._url);
    const a=trackAudio=Object.assign(new Audio(url),{_id:id,_url:url});
    a.play().catch(()=>{ toast('录音没能播放，请重试'); });
  }).catch(()=>toast('找不到这条课本录音'));
}
async function speakAll(lines){
  stopSpoken(); const run=sayRun;
  for(const l of lines){
    if(run!==sayRun) return;
    await speak(l,false);
  }
}
let rec=null, chunks=[], myAudio=null;
async function toggleRec(btn){
  if(rec && rec.state==='recording'){ rec.stop(); return; }
  try{
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    rec = new MediaRecorder(stream); chunks=[];
    rec.ondataavailable=e=>chunks.push(e.data);
    rec.onstop=()=>{ stream.getTracks().forEach(t=>t.stop()); if(myAudio) URL.revokeObjectURL(myAudio); myAudio=URL.createObjectURL(new Blob(chunks,{type:rec.mimeType})); render(); };
    rec.start(); btn.classList.add('rec-on'); btn.innerHTML=`${ic('stop',18)}停止录音`;
  }catch(e){ toast('没有拿到麦克风权限，可以先只跟着读出声。'); }
}

/* ---------- 小工具 ---------- */
const $ = s=>document.querySelector(s);
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const play = t=>`<button class="play" aria-label="播放语音" aria-pressed="false" data-speech-key="${speechButtonKey(t)}" data-say="${esc(t)}">${ic('speaker',14)}</button>`;
const deco = (cls,css,txt='')=>`<span class="deco ${cls}" style="${css}">${txt}</span>`;
const src = t=>`<p class="src">${ic('book',14,1.8)}<span>${t}</span></p>`;
const goBtn = (label,on,cls='')=>`<button class="btn go ${cls}" onclick="${on}"><span>${label}</span><span class="knob">${ic('chevR',18,2.2)}</span></button>`;
function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('on'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),2600); }
const pages = L=>`${bookName(L.book)} 第 ${L.pages[0]}–${L.pages[1]} 页`;
const pg = (L,p)=>`${bookName(L.book)} 第 ${p} 页`;

/* ---------- 界面状态（不存档） ---------- */
const S = {tab:P.start?'home':'onboard', pick:null, ln:1, book:lessonOf(P.cur)?.book||'1A', di:0, dPick:null, q:{}, gi:0, qi:0, gPick:null, si:0, sShow:false, rShow:false, hu:null, hq:null, topic:'随便聊', reset:false};

/* ---------- 起点 ---------- */
function onboard(){
  const opts=[
    ['zero','ㄱ','var(--green)','完全没学过','从韩文字母开始（1A 第 28 页）'],
    ['hangul','가','var(--lilac)','会拼读，但几乎不会说','从 1A 第 1 课开始'],
    ['some','한','var(--orange)','学过一些','自己选从哪一课开始']
  ];
  const made = SERIES[0].books.filter(b=>lessonsIn(b[0]).length);
  const pickLesson = S.pick==='some' ? `${made.length>1?`<div class="seg">${made.map(b=>`<button class="${S.book===b[0]?'on':''}" onclick="S.book='${b[0]}';render()">${b[0]}</button>`).join('')}</div>`:''}<div class="group">${lessonsIn(S.book).map(L=>`<button class="row-i ${S.ln===L.n?'cur':''}" onclick="S.ln=${L.n};render()"><span class="sq"><span class="num">${L.num}</span></span><span class="tx"><span class="hl" style="display:block">${L.k}</span><span class="fn">${L.zh}</span></span><span class="ck">${S.ln===L.n?ic('check',16,2.4):''}</span></button>`).join('')}</div>` : '';
  return `<div class="onb-hero candy c-yellow">
    ${deco('star','width:120px;height:120px;background:var(--orange);right:-20px;top:30px')}
    ${deco('circle','width:54px;height:54px;background:#111;right:28px;bottom:22px')}
    ${deco('hangul','font-size:150px;left:-10px;bottom:-40px','말')}
    <span class="chip dark">首尔大学韩国语 · 日常会话</span>
    <h1>用韩语<br>开口 <span class="mic-pill">${[10,18,12,22,9,16,11].map(h=>`<i style="height:${h}px"></i>`).join('')}<b>${ic('mic',18,2)}</b></span><br>聊起来</h1>
    <p class="sub" style="max-width:230px">每天一小段，学完一课就能用韩语办成一件事。</p>
  </div>
  <main>
  <h3 class="sec-t">你现在会什么？</h3>
  <div class="opts">${opts.map(o=>`<button class="choice ${S.pick===o[0]?'on':''}" aria-pressed="${S.pick===o[0]}" onclick="S.pick='${o[0]}';render()"><span class="e" style="background:${o[2]}">${o[1]}</span><span class="tx"><span class="hl" style="display:block">${o[3]}</span><span class="fn">${o[4]}</span></span><span class="ck">${S.pick===o[0]?ic('check',14,2.6):''}</span></button>`).join('')}</div>
  ${pickLesson}
  <h3 class="sec-t">每天大概能学多久？</h3>
  <div class="seg">${[15,25,40].map(m=>`<button class="${P.minutes===m?'on':''}" onclick="P.minutes=${m};render()">${m} 分钟</button>`).join('')}</div>
  <p class="fn" style="margin:0 4px">按你给的时长安排每天的新复习卡数量，之后随时能在设置里改。</p>
  <button class="btn go" ${S.pick?'':'disabled'} onclick="finishOnboard()"><span>开始学习</span><span class="knob">${ic('chevR',18,2.2)}</span></button>
  </main>`;
}
function finishOnboard(){
  P.start = S.pick;
  P.cur = S.pick==='zero' ? 0 : S.pick==='hangul' ? 1 : S.ln;
  if(P.cur>=1) for(const u of HANGUL.units) P.hg[u.id]=true;
  save(); go('home');
}

/* ---------- 今日 ---------- */
function legacyHome(){
  const due = dueCards().length;
  const d = new Date();
  const L = lessonOf(P.cur);
  const hgDone = HANGUL.units.filter(u=>P.hg[u.id]).length;
  const hero = P.cur===0
    ? `<span class="chip">继续 · 韩文字母</span><p class="hero-k">${HANGUL.k}</p>
       <p class="sub" style="font-weight:600">${HANGUL.zh} · 已学 ${hgDone}/${HANGUL.units.length} 组</p>
       <div class="prog">${HANGUL.units.map(u=>`<i class="${P.hg[u.id]?'on':''}"></i>`).join('')}</div>${goBtn(hgDone?'继续学':'开始学',"openHangul()")}`
    : L ? (()=>{ const ss=stepsOf(L), st=prog(L.n).step; return `<span class="chip">继续 · ${lname(L)}</span><p class="hero-k">${L.k}</p>
       <p class="sub" style="font-weight:600">${L.zh} · 第 ${st+1}/${ss.length} 步：${ss[st]}</p>
       <div class="prog">${ss.map((_,i)=>`<i class="${i<st?'on':''}"></i>`).join('')}</div>${goBtn(st?'继续学':'开始学',`openLesson(${L.n})`)}`; })()
    : `<span class="chip">做好的课已全部学完</span><p class="hero-k">수고했어요!</p><p class="sub" style="font-weight:600;margin-bottom:18px">辛苦了。接下来每天做复习，再和 AI 伙伴多聊。</p>${goBtn('看课程',"go('course')")}`;
  const w = weekMinutes(); const total = Object.values(w).reduce((a,b)=>a+b,0);
  const rows = [['听懂内容','listen','var(--lilac)'],['开口说','speak','var(--orange)'],['词和语法','lang','var(--yellow)'],['练流利','flu','var(--green)']];
  const max = Math.max(...Object.values(w), 1);
  const low = rows.reduce((a,r)=>w[r[1]]<w[a[1]]?r:a, rows[0]);
  const tip = total<5 ? '学满一周后，这里会告诉你哪种练习偏少。'
    : {listen:'听得偏少，明天先整段听对话，再看原文。', speak:'开口说偏少，明天多做一轮跟读和换词说。', lang:'词和语法偏少，记得每天把复习做完。', flu:'练流利偏少，学完一课后和 AI 伙伴演一遍场景。'}[low[1]];
  const mins = Math.round(todayMinutes());
  return `<header class="top"><div class="grow"><p class="eyebrow">안녕하세요 · ${d.getMonth()+1} 月 ${d.getDate()} 日</p><h1 class="lt">今天学 <span class="num">${P.minutes}</span> 分钟</h1></div><button class="icon-btn" aria-label="设置" onclick="go('settings')">${ic('sliders',20)}</button></header><main>
  <div class="card candy c-lilac">
    ${deco('hangul','font-size:130px;right:-8px;top:-14px', P.cur===0?'ㄱ':'안')}
    ${deco('flower','width:70px;height:70px;background:var(--orange);right:22px;bottom:84px;opacity:.9')}
    ${hero}
  </div>
  <div class="tiles">
    <button class="tile candy c-yellow" onclick="go('review')">
      ${deco('circle','width:90px;height:90px;background:rgba(255,255,255,.45);right:-24px;top:-24px')}
      <b>复习</b><span class="big num">${due}</span><span>${due?'张 · 先做这个':P.cards.length?'今天做完了':'学完一课后出现'}</span></button>
    <button class="tile candy c-green" onclick="go('talk')">
      ${deco('star','width:74px;height:74px;background:rgba(0,0,0,.1);right:-10px;top:-6px')}
      <b>AI 伙伴</b><span class="big">${ic('sparkles',40,1.7)}</span><span>随便聊 · 随时用中文问</span></button>
  </div>
  <div class="card">
    <h3 class="hl">这周的四种练习</h3>
    <p class="fn" style="margin-top:2px">听、说、拆语言点、练流利，四样时间大致平分最有效。今天已学 <span class="num">${mins}</span> 分钟。</p>
    <div class="strands">
      ${rows.map(r=>`<div class="strand"><span>${r[0]}</span><div class="bar-t"><i style="width:${Math.round(w[r[1]]/max*100)}%;background:${r[2]}"></i></div><span class="fn num" style="text-align:right">${Math.round(w[r[1]])} 分</span></div>`).join('')}
    </div>
    <div class="fb no" style="margin-top:16px">${tip}</div>
  </div>
  </main>`;
}

/* ---------- 课程 ---------- */
function course(){
  const b = S.book, ser = seriesOf(b), ls = lessonsIn(b), hg = b==='1A';
  const hgAll = HANGUL.units.every(u=>P.hg[u.id]);
  const done = ls.filter(L=>prog(L.n).done).length + (hg&&hgAll?1:0), total = ls.length + (hg?1:0);
  const nextV = ser.id==='vitamin' ? ls.find(L=>!prog(L.n).done)?.n : null; // 维他命没有主线「当前」，标出这一册下一课
  const rowState = n=>(n===P.cur||n===nextV)?'cur':(n===0?hgAll:prog(n).done)?'done':'';
  const row = (n,num,k,zh,can,p,on)=>{ const st=rowState(n); return `<button class="row-i ${st}" onclick="${on}">
    <span class="sq">${st==='done'?ic('check',20,2.4):`<span class="num"${String(num).length>2?' style="font-size:14px"':''}>${num}</span>`}</span>
    <span class="tx"><span class="hl" style="display:block">${k} <span class="fn" style="font-weight:400">${zh}</span></span><span class="fn">学完：${can}</span></span>
    <span class="side">${st==='cur'?'<span class="badge">当前</span>':''}<span class="fn num">${p} 页</span></span><span class="chev">${ic('chevR',16,2.2)}</span></button>`; };
  const lv = ser.id==='seoul' ? +b[0] : +b.slice(1);
  const shelf = SERIES.map(sr=>`<p class="group-h">${sr.name} · ${sr.books.length} 册</p>
  <div class="group">${sr.books.map(x=>{ const n=lessonsIn(x[0]).length, on=x[0]===b;
    return `<button class="row-i ${n?'':'locked'} ${on?'cur':''}" onclick="${n?`S.book='${x[0]}';render(true);scrollTo(0,0)`:"toast('这一册还没做成课程')"}"><span class="sq"><span class="num" style="font-size:15px">${x[0]}</span></span><span class="tx"><span class="hl" style="display:block">${sr.name} ${x[0][0]==='V'?x[0].slice(1):x[0]}</span><span class="fn">${x[1]}${n?` · ${n} 课`:''}</span></span>${on?'<span class="side"><span class="badge">在看</span></span>':''}<span class="chev">${n?ic('chevR',16,2.2):ic('lock',16,2)}</span></button>`; }).join('')}</div>`).join('');
  return `<header class="top"><div class="grow"><p class="eyebrow">${ser.id==='seoul'?'主线教材 · 共 12 册':'补充教材 · 共 6 册'}</p><h1 class="lt">${ser.name} ${ser.id==='seoul'?b:b.slice(1)}</h1></div></header><main>
  <div class="col side"><div class="card candy ${ser.id==='seoul'?'c-yellow':'c-green'}">${deco('hangul','font-size:110px;right:0;top:-16px',String(lv))}
  <span class="chip dark">${seriesOf(b).books.find(x=>x[0]===b)[1]}</span><p class="sub" style="margin-top:12px;font-weight:600;max-width:270px">${ser.id==='seoul'?LEVEL_NOTE[lv]:`对应 TOPIK ${lv<=2?'I':'II'} ${lv} 级 · 韩英对照，中文为 App 翻译`}</p>
  <div class="bar-t" style="margin-top:14px"><i style="width:${Math.round(done/Math.max(total,1)*100)}%;background:#111"></i></div><p class="fn" style="margin-top:8px">这一册 ${done}/${total} 完成</p></div>${DESK?'<p class="note">每一课都能直接点开学，系统只标出建议的下一课。</p>':''}</div>
  <div class="col"><div class="group">
  ${hg?row(0,'ㅎ',HANGUL.k,HANGUL.zh,'能认读和拼出韩文字母',HANGUL.pages[0],'openHangul()'):''}
  ${ls.map(L=>row(L.n,L.num,L.k,L.zh,L.cando_items[0].replace(/^能/,''),L.pages[0],`openLesson(${L.n})`)).join('')}
  </div>
  ${DESK?'':'<p class="note">每一课都能直接点开学，系统只标出建议的下一课。</p>'}
  ${shelf}</div>
  </main>`;
}

/* ---------- 韩文字母 ---------- */
const CHO='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ', JUNG='ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ', JONG=' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ';
const syl = (c,v,b='')=>String.fromCharCode(0xAC00+(CHO.indexOf(c)*21+JUNG.indexOf(v))*28+Math.max(0,JONG.indexOf(b)));
// 单个字母不好直接念，就念它组成的音节：母音配 ㅇ，子音配 ㅏ，收音念 아+收音
function letterSound(u,ch){ const c=ch.split(' ')[0]; return u.id==='b'?syl('ㅇ','ㅏ',c):JUNG.includes(c)?syl('ㅇ',c):syl(c,'ㅏ'); }
function openHangul(i){ S.hu = i??null; S.hq=null; go('hangul'); }
function hangul(){
  if(S.hu===null){
    return `<header class="nav"><div class="bar"><button class="icon-btn" aria-label="返回" onclick="go('home')">${ic('chevL',22,2.2)}</button>
      <div class="mid"><p class="fn">1A 第 ${HANGUL.pages[0]}–${HANGUL.pages[1]} 页</p><p class="hl">${HANGUL.k}</p></div><span style="width:44px;flex:none"></span></div></header><main>
    <div class="col side"><div class="card candy c-yellow">${deco('hangul','font-size:120px;right:-6px;top:-18px','한')}<h2 class="t2">韩文是怎么来的</h2><p class="sub" style="max-width:290px;margin-top:6px">${HANGUL.intro}</p></div>
    <div class="card"><h3 class="hl">一个方块就是一个音节</h3><p class="fn" style="margin:4px 0 12px">${HANGUL.syllable.note}</p>
    <div class="rule">${HANGUL.syllable.types.map(t=>`<div><span class="fn">${t[0]}</span><br><b>${t[1]}</b></div>`).join('')}</div><div style="margin-top:12px">${src(`1A 第 ${HANGUL.syllable.p} 页`)}</div></div></div>
    <div class="col"><div class="group">${HANGUL.units.map((u,i)=>`<button class="row-i ${P.hg[u.id]?'done':''}" onclick="openHangul(${i})"><span class="sq">${P.hg[u.id]?ic('check',20,2.4):`<span>${u.letters[0][0].split(' ')[0]}</span>`}</span><span class="tx"><span class="hl" style="display:block">${u.t}</span><span class="fn">${u.letters.map(l=>l[0]).join(' ').slice(0,30)}</span></span><span class="side"><span class="fn num">${u.p} 页</span></span><span class="chev">${ic('chevR',16,2.2)}</span></button>`).join('')}</div>
    <div class="card"><h3 class="hl">${HANGUL.signs.t}</h3><p class="fn" style="margin:4px 0 6px">${HANGUL.signs.z}</p>
    ${HANGUL.signs.items.map(s=>`<div class="line"><div class="say"><div class="k">${s.k}</div><div class="z">${s.z}</div></div>${play(s.k)}</div>`).join('')}<div style="margin-top:8px">${src(`1A 第 ${HANGUL.signs.p} 页`)}</div></div></div>
    </main>`;
  }
  const u = HANGUL.units[S.hu];
  if(!S.hq) newHangulQuiz(u);
  const q = S.hq, picked = q.pick!==null, ok = q.pick===q.ans;
  return `<header class="nav"><div class="bar"><button class="icon-btn" aria-label="返回" onclick="openHangul()">${ic('chevL',22,2.2)}</button>
    <div class="mid"><p class="fn">韩文字母 · <span class="num">${S.hu+1}/${HANGUL.units.length}</span></p><p class="hl">${u.t}</p></div><span style="width:44px;flex:none"></span></div></header><main>
  <div class="card candy c-lilac">${deco('hangul','font-size:110px;right:0;top:-14px',u.letters[0][0].split(' ')[0])}<h2 class="t2">点字母听发音</h2><p class="sub" style="max-width:280px;margin-top:4px">${u.tip}</p></div>
  <div class="words">${u.letters.map(l=>`<button class="word" data-say="${letterSound(u,l[0])}"><span class="k">${l[0]}${ic('speaker',16,1.8)}</span><span class="z">[${l[1]}] · 念作 ${letterSound(u,l[0])}</span></button>`).join('')}</div>
  <div class="card"><h3 class="hl">读一读这些词</h3><p class="fn" style="margin:2px 0 6px">先自己读，再点播放核对。</p>
  ${u.words.map(w=>`<div class="line"><div class="say"><div class="k">${w.k}</div><div class="z">${w.z}</div></div>${play(w.k)}</div>`).join('')}</div>
  <div class="card"><p class="eyebrow">听一听，是哪个词？</p>
  <div class="row" style="margin:6px 0 14px"><button class="btn soft" data-say="${esc(u.words[q.ans].k)}">${ic('play',16)}播放</button></div>
  <div class="ask">${q.opts.map(o=>`<button class="opt ${picked&&(o===q.ans)?'right':picked&&o===q.pick?'wrong':''}" ${picked?'disabled':''} onclick="S.hq.pick=${o};render()">${picked&&o===q.ans?ic('check',18,2.4):''}${u.words[o].k}</button>`).join('')}</div>
  ${picked?`<div class="fb ${ok?'ok':'no'}" style="margin-top:10px">${ok?'对。':'是 '+u.words[q.ans].k+'。'}${u.words[q.ans].z}</div><button class="btn soft" style="margin-top:10px" onclick="S.hq=null;render()">再来一题</button>`:''}
  </div>
  ${src(`1A 第 ${u.p} 页`)}
  <div class="row" style="margin-top:4px">${goBtn(S.hu<HANGUL.units.length-1?'这一组会了，下一组':'字母学完了','finishHangulUnit()')}</div>
  </main>`;
}
function newHangulQuiz(u){
  const idx=[...u.words.keys()].sort(()=>Math.random()-.5).slice(0,3);
  S.hq={opts:idx, ans:idx[Math.floor(Math.random()*3)], pick:null};
}
function finishHangulUnit(){
  P.hg[HANGUL.units[S.hu].id]=true;
  if(S.hu<HANGUL.units.length-1){ S.hu++; S.hq=null; }
  else { if(P.cur===0) P.cur=1; S.hu=null; toast('字母学完了，下一步是第 1 课'); }
  save(); render(true); scrollTo(0,0);
}

/* ---------- 一课的七步 ---------- */
function openLesson(n){ S.ln=n; S.book=lessonOf(n).book; S.q={}; S.di=0; S.dPick=null; S.gi=0; S.qi=0; S.gPick=null; S.si=0; S.sShow=false; myAudio=null; go('lesson'); }
const curL = ()=>lessonOf(S.ln);
function lessonStep(){
  const L = curL(), sn = stepsOf(L)[prog(L.n).step];
  const G = L.book[0]==='V' ? '문법' : '文法與表現';
  if(sn==='先听懂'){
    return `<div class="card candy c-yellow">${deco('star','width:80px;height:80px;background:rgba(255,255,255,.5);right:-14px;top:-14px')}<p class="eyebrow" style="color:#111;font-weight:600">学完这一课，你能——</p><p class="sub" style="font-weight:510;max-width:290px">${L.cando}</p></div>
    ${L.dialogues.map((d,i)=>{ const a=S.q[i]; return `<div class="card"><p class="eyebrow">${d.t}</p><h2 class="t2">先整段听一遍，别看字</h2><p class="fn" style="margin:2px 0 16px">${d.scene}先抓大意，听不全也没关系。</p>
    ${d.audio?`<div class="row"><button class="btn" onclick="playTrack('${d.audio}')">${ic('play',16)}播放课本录音</button><button class="btn soft" onclick="speakAll(curL().dialogues[${i}].lines.map(l=>l.k))">${ic('speaker',16,1.8)}慢一点的朗读</button></div>`:`<button class="btn" onclick="speakAll(curL().dialogues[${i}].lines.map(l=>l.k))">${ic('play',16)}播放对话</button>`}
    <h3 class="hl" style="margin:22px 0 10px">${d.q.ask}</h3>
    <div class="ask">${d.q.opts.map((o,j)=>`<button class="opt ${a===j?(j===d.q.ans?'right':'wrong'):''}" onclick="S.q[${i}]=${j};render()">${a===j&&j===d.q.ans?ic('check',18,2.4):''}${o}</button>`).join('')}</div>
    ${a===undefined?'':a===d.q.ans?`<div class="fb ok" style="margin-top:10px">对。原句是 <span class="mk">${esc(d.q.hint)}</span></div>`:`<div class="fb no" style="margin-top:10px">再听一遍，留意这一句：${esc(d.q.hint)}</div>`}
    </div>
    <details class="card"><summary><span>听完了，看原文和中文</span>${ic('chevR',16,2.2)}</summary>
    <div style="margin-top:14px">${d.lines.map(l=>`<div class="line"><span class="who">${l.who}</span><div class="say"><div class="k">${esc(l.k)}</div><div class="z">${l.z}</div></div>${play(l.k)}</div>`).join('')}</div>
    <div style="margin-top:10px">${src(pg(L,d.p))}</div></details>`; }).join('')}`;
  }
  if(sn==='认词'){
    return `<div class="card candy c-lilac">${deco('hangul','font-size:96px;right:4px;top:-10px','漢')}<h2 class="t2">这一课的词</h2><p class="sub" style="max-width:270px">韩语里约 57% 的词来自汉字。<b>紫底的是汉字</b>，读音常和中文很像，先靠它猜意思。点卡片听发音。</p></div>
    <div class="words">${L.words.map(w=>`<button class="word" data-say="${esc(w.k)}"><span class="k">${w.k}${ic('speaker',16,1.8)}</span><span class="z">${w.h?`<span class="hz">${w.h}</span>`:''}${w.z}</span></button>`).join('')}</div>
    <div class="card sub"><b>小规律：</b>${L.tip}</div>
    ${src(pages(L)+' · 어휘')}`;
  }
  if(sn==='语法'){ // 每课两三条，各配小练习
    const g=L.grammar[S.gi], q=g.quiz[S.qi], done=S.gPick!==null, ok=S.gPick===q.ans;
    const lastQ = S.qi===g.quiz.length-1;
    return `<div class="seg" style="margin:0 2px">${L.grammar.map((x,i)=>`<button class="${S.gi===i?'on':''}" onclick="S.gi=${i};S.qi=0;S.gPick=null;render()">语法 ${i+1}</button>`).join('')}</div>
    <div class="card candy c-yellow">${deco('circle','width:100px;height:100px;background:rgba(255,255,255,.4);right:-30px;top:-30px')}<p class="eyebrow" style="color:#111;font-weight:600">${g.t}</p><h2 class="t2" style="margin-bottom:12px">${g.zh}</h2>
    <div class="rule">${g.rule.map(r=>`<div><span class="fn">${r[0]}</span><br><b>${r[1]}</b><br><span class="fn" style="color:#111">${r[2]}</span></div>`).join('')}</div>
    <p class="sub" style="margin-top:12px">${g.note}</p>
    <div style="margin-top:12px">${src(`${pg(L,g.p)} · ${G}`)}</div></div>
    <div class="card"><p class="eyebrow">小练习 <span class="num">${S.qi+1}/${g.quiz.length}</span></p>
    <p class="big-ko">${q.pre} <span class="blank">${done?S.gPick:'?'}</span>${q.post}</p>
    <div class="row">${q.opts.map(o=>`<button class="opt ${done&&o===S.gPick?(ok?'right':'wrong'):''}" ${done?'disabled':''} onclick="S.gPick='${esc(o)}';render()">${o}</button>`).join('')}</div>
    ${done?`<div class="fb ${ok?'ok':'no'}" style="margin-top:10px">${ok?'对。':'应该是 '+q.ans+'。'}${q.why}</div>
    ${!lastQ?`<button class="btn soft" style="margin-top:10px" onclick="S.qi++;S.gPick=null;render()">下一题</button>`:S.gi<L.grammar.length-1?`<button class="btn soft" style="margin-top:10px" onclick="S.gi++;S.qi=0;S.gPick=null;render();scrollTo(0,0)">下一条语法</button>`:''}`:''}
    </div>`;
  }
  if(sn==='跟读'){
    const lines = L.dialogues.flatMap(d=>d.lines);
    return `<div class="card candy c-orange">${deco('hangul','font-size:110px;right:0;top:-18px;color:rgba(255,255,255,.22)','↗')}<h2 class="t2">一句一句跟着读</h2><p class="sub" style="max-width:260px">听一句，马上跟着说（影子跟读）。录下来和原音比一比。</p></div>
    <div class="card"><p class="eyebrow">本课发音点</p><h3 class="hl">${L.pron.t}</h3><p class="fn" style="margin:4px 0 6px">${L.pron.note||''}</p>
    ${L.pron.lines.map(t=>`<div class="line"><div class="say"><div class="k">${esc(t)}</div></div>${play(t)}</div>`).join('')}<div style="margin-top:8px">${src(`${pg(L,L.pron.p)} · 발음`)}</div></div>
    <div class="card">${lines.map(l=>`<div class="line"><span class="who">${l.who}</span><div class="say"><div class="k">${esc(l.k)}${l.k.endsWith('?')?' <b style="color:var(--orange)">↗</b>':''}</div><div class="z">${l.z}</div></div>${play(l.k)}</div>`).join('')}</div>
    <div class="card"><h3 class="hl">录一遍全段，自己听</h3><div class="row" style="margin-top:12px"><button class="btn tint" onclick="toggleRec(this)">${ic('mic',18,2)}录音</button>${myAudio?`<button class="btn soft" onclick="new Audio(myAudio).play()">${ic('play',14)}听我的</button>`:''}</div>
    <p class="fn" style="margin-top:8px">录音只在这一页临时保留，不上传、不存档。</p></div>`;
  }
  if(sn==='换词说'){
    const s=L.swap.items[S.si];
    return `<div class="card candy c-lilac"><p class="eyebrow" style="color:#111;font-weight:600">换词说 <span class="num">${S.si+1}/${L.swap.items.length}</span></p>
    ${deco('flower','width:90px;height:90px;background:var(--yellow);right:-20px;top:-20px')}
    <div class="persona" style="margin-top:6px"><div class="av">${s.name[0]}</div><div><b style="font-size:21px;letter-spacing:-.015em">${s.name} / ${s.nat}</b><br><span class="fn">${s.zh}</span></div></div>
    <p class="sub" style="margin-top:16px">照着课本的对话，换上这组词，<b>先大声说出来</b>：${L.swap.frame}。</p>
    ${S.sShow?`<div class="reveal"><p class="fn">参考说法</p><div class="row" style="align-items:flex-start;margin-top:4px"><p style="font-size:18px;line-height:1.5;flex:4;font-weight:600">${esc(s.a)}</p>${play(s.a)}</div></div>`
    :`<div style="margin-top:16px">${goBtn('我说完了，看参考','S.sShow=true;render()')}</div>`}
    </div>
    ${S.sShow?`<div class="grade">${[['没说出来','g1'],['差不多','g2'],['很顺','g3']].map(g=>`<button class="${g[1]}" onclick="nextSwap()">${g[0]}</button>`).join('')}</div>`:''}
    ${src(`${pg(L,L.swap.p)} · 연습`)}`;
  }
  if(sn==='用出来'){ // 接 AI 对练
    const t=L.task;
    return `<div class="card candy c-green">${deco('star','width:90px;height:90px;background:rgba(0,0,0,.09);right:-14px;top:-10px')}<p class="eyebrow" style="color:#111;font-weight:600">课题 · ${t.t}</p><h2 class="t2" style="max-width:280px">${t.brief}</h2><p class="sub">${t.sub}</p></div>
    <div class="card"><h3 class="hl">和 AI 演一遍</h3><p class="fn" style="margin:2px 0 14px">AI 扮演 ${t.ai}，只用学过的话。说错了它会给一条最值得改的建议。</p>
    ${statusLine()}<div style="margin-top:14px">${goBtn('开始对练',`openChat('scene','lesson',${L.n})`)}</div></div>
    ${src(`${pg(L,t.p)} · 과제`)}`;
  }
  if(sn==='开口练习') return dailyLessonPractice(L);
  if(sn==='练习本'){ // 练习本里的题，一题一题做
    const q=L.drill.items[S.di], done=S.dPick!==null, ok=S.dPick===q.ans, lastQ=S.di===L.drill.items.length-1;
    return `<div class="card candy c-lilac">${deco('hangul','font-size:96px;right:4px;top:-10px','練')}<h2 class="t2">练习本</h2><p class="sub" style="max-width:270px">课本配套练习本里的题，做完再看自我评价。</p></div>
    <div class="card"><p class="eyebrow">第 <span class="num">${S.di+1}/${L.drill.items.length}</span> 题${q.ask?` · ${q.ask}`:''}</p>
    ${q.pre||q.post?`<p class="big-ko">${esc(q.pre||'')} <span class="blank">${done?esc(S.dPick):'?'}</span>${esc(q.post||'')}</p>`:''}
    <div class="${q.opts.some(o=>o.length>8)?'ask':'row'}">${q.opts.map(o=>`<button class="opt ${done&&o===S.dPick?(ok?'right':'wrong'):''}" ${done?'disabled':''} onclick="S.dPick=this.dataset.o;render()" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div>
    ${done?`<div class="fb ${ok?'ok':'no'}" style="margin-top:10px">${ok?'对。':'应该是 '+esc(q.ans)+'。'}${q.why||''}</div>
    ${!lastQ?`<button class="btn soft" style="margin-top:10px" onclick="S.di++;S.dPick=null;render()">下一题</button>`:''}`:''}
    </div>
    ${src(`${L.drill.src||bookName(L.book)+' 練習本'} 第 ${L.drill.p} 页`)}`;
  }
  // 自我评价
  if(!prog(L.n).carded){ addCards(lessonCards(L)); prog(L.n).carded=true; save(); }
  const n = L.words.length + L.dialogues.reduce((a,d)=>a+d.lines.length,0);
  return `<div class="card"><h2 class="t2">这一课，你现在能——</h2><p class="fn" style="margin:2px 0 8px">对照课本的自我评价，诚实选。</p>
  ${L.cando_items.map((t,i)=>{ const k=`${L.n}-${i}`; return `<div class="cando"><p>${t}</p><div class="seg">${['能','还不行'].map(o=>`<button class="${P.cando[k]===o?'on':''}" onclick="P.cando['${k}']='${o}';save();render()">${o}</button>`).join('')}</div></div>`; }).join('')}
  </div>
  <div class="card candy c-peach">${deco('hangul','font-size:96px;right:0;top:-14px','文')}<p class="eyebrow" style="color:#111;font-weight:600">文化漫步</p><h3 class="hl">${L.culture.t}</h3><p class="sub" style="margin-top:6px">${L.culture.z}</p><div style="margin-top:10px">${src(pg(L,L.culture.p))}</div></div>
  <div class="card candy c-yellow"><h3 class="hl">已加入复习</h3><p class="sub">对话里的句子和这一课的词，共 ${n} 张。按记忆曲线安排，不用自己记什么时候复习。</p></div>
  ${src(bookName(L.book)+' · 자기 평가')}`;
}
function lesson(){
  const L = curL(), ss = stepsOf(L), st = prog(L.n).step, last = st===ss.length-1;
  return `<header class="nav"><div class="bar"><button class="icon-btn" aria-label="返回" onclick="go('home')">${ic('chevL',22,2.2)}</button>
    <div class="mid"><p class="fn">${lname(L)} · <span class="num">${st+1}/${ss.length}</span> ${ss[st]}</p><p class="hl">${L.k}</p></div><span style="width:44px;flex:none"></span></div>
    <div class="steps">${ss.map((_,i)=>`<i class="${i<=st?'on':''}"></i>`).join('')}</div></header>
  <main>${lessonStep()}
  <div class="row" style="margin-top:4px">${st?`<button class="btn soft" style="flex:0 0 34%" onclick="setStep(-1)">上一步</button>`:''}${last?goBtn('完成这一课','finishLesson()'):goBtn('下一步','setStep(1)')}</div>
  </main>`;
}
function setStep(d){ const p=prog(S.ln); p.step=Math.max(0,Math.min(stepsOf(curL()).length-1,p.step+d)); S.di=0; S.dPick=null; S.gi=0; S.qi=0; S.gPick=null; S.si=0; S.sShow=false; save(); render(true); scrollTo(0,0); }
function nextSwap(){ const L=curL(); if(S.si<L.swap.items.length-1){S.si++;S.sShow=false;render(true);} else setStep(1); }
function legacyFinishLesson(){
  const p=prog(S.ln); p.done=true; p.step=0;
  const L=curL(), ls=trackOf(L);
  if(P.cur===S.ln){ const next=ls.slice(ls.indexOf(L)+1).find(x=>!prog(x.n).done); P.cur=next?next.n:99; }
  save(); toast(`${lname(L)}完成`); go(L.book[0]==='V'?'course':'home');
}

/* ---------- 复习 ---------- */
const dailyLegacyGrade = (id,r)=>{
  const c=P.cards.find(x=>x.id===id); if(!c) return;
  if(c.f.state===F.State.New) P.newDay.c++;
  c.f = SCHED.next(revive(c.f), new Date(), r).card;
  S.rShow=false; save(); render(true);
};
function legacyReview(){
  const list = dueCards();
  if(!list.length) return `<header class="top"><h1 class="lt">复习</h1></header><main><div class="card candy c-green" style="text-align:center;padding:36px 20px">${deco('star','width:120px;height:120px;background:rgba(255,255,255,.35);left:-30px;top:-30px')}<div class="done-ic">${ic('check',30,2.6)}</div><h2 class="t2">${P.cards.length?'今天的复习做完了':'还没有复习卡'}</h2><p class="sub" style="margin:4px 0 20px">${P.cards.length?'下次什么时候复习，已经按你刚才的回答排好。':'学完一课的自我评价后，那一课的句子和词会自动加进来。'}</p>${goBtn('回到今日',"go('home')")}</div></main>`;
  const c=list[0];
  const label={'说':'用韩语说','听':'听，说出意思','汉字词':'汉字词，猜意思'}[c.type];
  const prev = SCHED.repeat(revive(c.f), new Date());
  const grades = [['忘了',F.Rating.Again,'g1'],['想起来了',F.Rating.Good,'g2'],['很轻松',F.Rating.Easy,'g3']];
  return `<header class="top"><div class="grow"><p class="eyebrow">复习 · 还有 <span class="num">${list.length}</span> 张</p><h1 class="lt">先在心里回想</h1></div></header><main>
  <div class="card candy c-lilac" style="min-height:280px;display:flex;flex-direction:column;gap:12px">
    ${deco('hangul','font-size:160px;right:-14px;bottom:-40px','?')}
    <span class="chip dark">${label}</span>
    ${c.listen?`<div class="row" style="align-items:flex-start"><p class="big-ko" style="flex:4;margin:0">${c.type==='听'&&!S.rShow?'<span class="sub" style="font-weight:510">（先只听不看）</span>':esc(c.front)}</p>${play(c.front)}</div>`:`<p style="font-size:24px;line-height:1.4;font-weight:700;letter-spacing:-.015em">${esc(c.front)}</p>`}
    ${S.rShow?`<div class="reveal" style="margin-top:4px"><div class="row" style="align-items:flex-start"><p class="${c.type==='说'?'big-ko':''}" style="flex:4;margin:0;${c.type==='说'?'':'font-size:20px;font-weight:700'}">${esc(c.back)}</p>${c.type==='说'?play(c.back):''}</div><div style="margin-top:8px">${src(esc(c.src))}</div></div>`:''}
  </div>
  ${S.rShow?`<div class="grade">${grades.map((g,i)=>`<button class="${g[2]}" onclick="grade('${c.id}',${g[1]})">${g[0]}<span>${gap(prev[g[1]].card.due)}</span>${DESK?`<kbd>${i+1}</kbd>`:''}</button>`).join('')}</div>`
  :goBtn('想好了，看答案'+(DESK?' <kbd>空格</kbd>':''),'S.rShow=true;render()','reveal-go')}
  </main>`;
}
function grade(id,r){
  const c=P.cards.find(x=>x.id===id); if(!c) return;
  if(c.f.state===F.State.New) P.newDay.c++;
  c.f = SCHED.next(revive(c.f), new Date(), r).card;
  S.rShow=false; save(); render(true);
}

/* ---------- 设置 ---------- */
function settings(){
  const ed = AI.ready===null?'':AI.personal?'个人自用版':DESK?'Mac 分享版':NATIVE?'分享版':'浏览器预览';
  return `<header class="nav"><div class="bar"><button class="icon-btn" aria-label="返回" onclick="go('home')">${ic('chevL',22,2.2)}</button>
    <div class="mid"><p class="hl">设置</p></div><span style="width:44px;flex:none"></span></div></header><main>
  <div class="card"><h3 class="hl">每天学多久</h3><p class="fn" style="margin:2px 0 12px">决定每天放进复习的新卡数量（10 / 20 / 30 张）。</p>
  <div class="seg">${[15,25,40].map(m=>`<button class="${P.minutes===m?'on':''}" onclick="P.minutes=${m};save();render()">${m} 分钟</button>`).join('')}</div></div>
  <div class="card"><h3 class="hl">朗读速度</h3><p class="fn" style="margin:2px 0 12px">课程与 AI 伙伴都用 Edge 自然女声；仅备用朗读使用系统语音。</p>
  <div class="seg">${[[.8,'慢一点'],[1,'正常'],[1.15,'快一点']].map(r=>`<button class="${P.rate===r[0]?'on':''}" onclick="P.rate=${r[0]};save();render();speak('안녕하세요? 만나서 반가워요.')">${r[1]}</button>`).join('')}</div>
  ${NATIVE?`<button class="btn soft" style="margin-top:12px" onclick="Speech.openSettings().catch(()=>toast('没能打开系统语音设置'))">听不到韩语？打开系统语音设置</button>`:''}</div>
  <div class="card"><h3 class="hl">AI 伙伴</h3><div style="margin-top:8px">${statusLine()}</div></div>
  <div class="card"><h3 class="hl">重新选起点</h3><p class="fn" style="margin:2px 0 12px">已学的进度和复习卡都会保留。</p><button class="btn soft" onclick="S.pick=null;go('onboard')">重新选</button></div>
  <div class="card"><h3 class="hl">清空这台设备上的记录</h3><p class="fn" style="margin:2px 0 12px">进度、复习卡、学习时长全部删除，不能恢复。</p>
  <button class="btn tint" onclick="${S.reset?'resetAll()':'S.reset=true;render()'}">${S.reset?'确认清空':'清空记录'}</button></div>
  <p class="note">学韩语 · 首尔大学韩国语 + 维他命韩语 · v0.4.3${ed?' · '+ed:''}</p>
  </main>`;
}
function resetAll(){ try{ localStorage.removeItem(STORE); }catch{} P=load(); S.reset=false; S.pick=null; go('onboard'); }

/* ---------- AI 伙伴：个人版经原生插件直连 DeepSeek（凭据只在原生资源里）；分享版不带凭据；浏览器预览走本机中转 ---------- */
const AI = {ready:null, why:'', label:'DeepSeek V4.1 Flash · 1017', personal:false};
async function checkAI(){
  AI.ready=null;
  if(['talk','lesson','settings'].includes(S.tab)) render();
  try{
    if(Tutor){ const j=await Promise.race([Tutor.status(),new Promise((_,reject)=>setTimeout(()=>reject(Error('timeout')),6000))]); AI.ready=!!j.configured; AI.personal=!!j.personal; AI.label=j.model_label||AI.label; AI.why=j.configured?'':'share'; }
    else if(location.protocol==='file:'){ AI.ready=false; AI.why='file'; }
    else { const j=await (await fetch('/api/status')).json(); AI.ready=!!j.configured; AI.label=j.label||AI.label; AI.why=j.configured?'':'nokey'; }
  }catch{ AI.ready=false; AI.why=Tutor?'share':'noserver'; }
  if(['talk','lesson','settings'].includes(S.tab)) render();
}
const AI_WHY = {
  share:'暂时没能确认 AI 连接，请重试',
  file:'现在是直接打开的文件。要真聊天，先运行 npm run dev',
  noserver:'本机中转没有启动（npm run dev）',
  nokey:'本机没找到 DeepSeek 连接凭据（与探索队同一配置）'
};
function statusLine(){
  if(AI.ready===null) return `<p class="status"><i></i>正在检查连接…</p>`;
  return AI.ready ? `<p class="status ok"><i></i>已连接 ${esc(AI.label)}</p>` : `<p class="status bad"><i></i>${AI_WHY[AI.why]} <button class="status-retry" onclick="checkAI()">重试</button></p>`;
}
const opened = L=>prog(L.n).done || prog(L.n).step>=5;
function talk(){
  return `<header class="top"><div class="grow"><p class="eyebrow">用学过的话聊天，卡住了就用中文问</p><h1 class="lt">AI 伙伴</h1></div></header><main>
  <div class="col side"><div class="card candy c-green">${deco('circle','width:120px;height:120px;background:rgba(255,255,255,.3);right:-30px;top:-30px')}${deco('hangul','font-size:100px;right:10px;bottom:-26px','말')}
    <span class="chip dark">${ic('bubble',14,2)}自由对话</span>
    <h2 class="t2" style="margin-top:12px;max-width:270px">用韩语随便聊，<br>不会说就打中文问</h2>
    <p class="sub" style="max-width:270px">比如「周末怎么说」「为什么这里用 이에요」。AI 会讲清楚，再接着陪你聊。</p>
    <div class="topics" role="radiogroup" aria-label="话题">${TOPICS.map(t=>`<button class="topic ${S.topic===t?'on':''}" role="radio" aria-checked="${S.topic===t}" onclick="S.topic='${t}';render()">${t}</button>`).join('')}</div>
    <div style="margin-top:16px">${goBtn('开始聊',"openChat('free','talk')")}</div>
  </div>
  <div style="padding:0 4px">${statusLine()}</div></div>
  <div class="col"><p class="group-h">场景对练 · 学到每课的「用出来」时开放</p>
  <div class="group scene-grid">${LESSONS.filter(L=>opened(L)||L.book===(lessonOf(P.cur)?.book||'1A')).map(L=>{ const o=opened(L); return `<button class="row-i ${o?'':'locked'}" onclick="${o?`openChat('scene','talk',${L.n})`:"toast('学到这一课的「用出来」时开放')"}"><span class="sq" style="background:${L.task.c};color:#111">${ic(L.task.icon,22,1.8)}</span><span class="tx"><span class="hl" style="display:block">${L.task.t}</span><span class="fn">${lname(L)} · ${L.task.sub}</span></span><span class="chev">${o?ic('chevR',16,2.2):ic('lock',16,2)}</span></button>`; }).join('')}</div></div>
  <p class="note">${Tutor?'对话直接发给 DeepSeek，网页代码里没有连接凭据。':'对话经这台 Mac 上的中转发给 DeepSeek，网页里没有连接凭据。'}</p>
  </main>`;
}

// 学习者进度：学到哪一课 + 最近 8 课的「已学」清单，AI 只用这些范围里的话
function learnedText(L){
  if(!L) return '学习者刚学完韩文字母，还不会句子；请只用最简单的问候语，多给中文提示。';
  const ls = trackOf(L), i = ls.indexOf(L), recent = ls.slice(Math.max(0,i-7), i+1);
  return `学习者进度：${seriesOf(L.book).name} ${lname(L)}${i>7?`（之前的 ${i-7} 课也学过）`:''}。最近学的内容：` + recent.map(x=>`${lname(x)}：${x.learned}`).join('；') + '。';
}
function sysPrompt(c){
  const L = c.n ? lessonOf(c.n) : null;
  // 自由对话：取主线上学到最远的一课；主线还没开始，再看维他命
  const far = ls=>ls.filter(x=>prog(x.n).done||prog(x.n).step>0||x.n===P.cur).pop();
  const upto = L || far(seriesLessons('1A')) || far(seriesLessons('V1')) || null;
  const role = L
    ? `场景对练：${L.task.brief}\n${L.task.role}`
    : `自由对话：你是聊天伙伴「하나」，韩国人，友善、有耐心。话题：${c.topic}。`;
  return ['你在一个韩语学习 App 里陪中文母语的成人学习者练习。'+learnedText(upto)+dDifficultyText(), role,
    '规则：',
    '1. 学习者用韩语说话（哪怕夹中文、有错）→ mode 为 "chat"：用简单的해요체，1–2 个短句，尽量只用已学的词；每次最多用 1 个新词，并写进 new_words；常常反问一句，让对方接着说。ko 是你说的韩语，zh 是它自然的中文翻译。',
    '2. 学习者用中文提问（意思、语法、怎么说）→ mode 为 "explain"：zh 用简短中文讲清楚，不超过 80 字；examples 给 1–2 个韩语例句和中文；ko 放一句能接着聊的简单韩语，可以为空。',
    '3. 学习者的韩语有明显错误时，fix 填 {"original":"他的原句","better":"改好的整句","why":"一句中文说原因"}。只挑最值得改的一处；没错、或只是缺标点和空格，fix 为 null。',
    '4. suggest 给 2 个学习者下一句可以说的韩语短句，用已学内容。',
    '5. 方括号里的内容是 App 发给你的指令，不是学习者说的话。',
    '6. 该收尾时就收尾：场景任务已经做完并且双方道过别，或者学习者明显要结束对话（또 봐요、다음에 봐요、잘 가요 之类；开场打招呼的 안녕 不算）→ 只回一句简短的告别，不再反问，end 为 true，suggest 为空数组。其余时候 end 为 false。',
    '只输出 JSON：{"mode":"chat","ko":"","zh":"","examples":[{"ko":"","zh":""}],"new_words":[{"ko":"","zh":""}],"fix":null,"suggest":["",""],"end":false}'
  ].join('\n');
}
const arr = v=>Array.isArray(v)?v:[];
const str = v=>typeof v==='string'?v.trim():'';
function parseReply(s){
  try{
    const d=JSON.parse(s);
    return {mode:d.mode==='explain'?'explain':'chat', ko:str(d.ko), zh:str(d.zh),
      examples:arr(d.examples).filter(e=>e&&str(e.ko)).slice(0,3),
      new_words:arr(d.new_words).filter(w=>w&&str(w.ko)).slice(0,3),
      fix:d.fix&&str(d.fix.better)?d.fix:null,
      suggest:d.end===true?[]:arr(d.suggest).map(str).filter(Boolean).slice(0,3), end:d.end===true};
  }catch{ return {mode:'chat',ko:String(s||''),zh:'',examples:[],new_words:[],fix:null,suggest:[]}; }
}

let CHAT = null;
function openChat(kind,back,n){
  if(!AI.ready) return toast(AI.ready===null?'正在检查连接，稍等一下':AI_WHY[AI.why]);
  CHAT = {kind, back, n:kind==='scene'?n:0, topic:S.topic, msgs:[], busy:false, error:null, req:null};
  go('chat');
  const L = CHAT.n ? lessonOf(CHAT.n) : null;
  send(L ? `[开始场景。请你作为${L.task.ai}先开口。]`
         : `[开始聊天。话题：${CHAT.topic}。请你先用一两句简单的韩语打招呼，开启这个话题。]`, true);
}
function leaveChat(){ stopMic(); if(CHAT?.req&&Tutor) Tutor.cancel({requestId:CHAT.req}).catch(()=>{}); const b=CHAT?.back||'talk'; CHAT=null; go(b); }

function chat(){
  const c=CHAT, L=c.n?lessonOf(c.n):null;
  const title = L?L.task.t:'自由对话';
  const sub = L?`AI 扮演 ${L.task.ai} · ${lname(L)}`:`话题：${c.topic}`;
  return `<header class="nav"><div class="bar"><button class="icon-btn" aria-label="返回" onclick="leaveChat()">${ic('chevL',22,2.2)}</button>
    <div class="mid"><p class="hl">${title}</p><p class="fn">${sub}</p></div>
    <button class="icon-btn zh ${P.showZh?'on':''}" aria-pressed="${P.showZh}" aria-label="显示中文" onclick="P.showZh=!P.showZh;save();this.classList.toggle('on',P.showZh);this.setAttribute('aria-pressed',P.showZh);drawThread(true)">中</button></div></header>
  <main><div id="thread" class="thread" aria-live="polite"></div></main>
  <form class="composer" id="composer"><div class="in">
    ${(Speech||SR)?`<button type="button" class="mic" id="mic" aria-label="说韩语">${ic('mic',22,1.9)}</button>`:''}
    <textarea id="msg" rows="1" placeholder="用韩语聊，或用中文问" enterkeyhint="send" aria-label="输入消息"></textarea>
    <button class="send" id="send" aria-label="发送" disabled>${ic('up',20,2.4)}</button>
  </div></form>`;
}

function aiBubble(m,i){
  const d=m.data;
  const fix = d.fix?`<div class="fix"><p class="lab">${ic('pencil',14,2)}这样说更自然</p>${d.fix.original?`<s>${esc(d.fix.original)}</s>`:''}<div class="bt"><p>${esc(d.fix.better)}</p>${play(d.fix.better)}</div>${d.fix.why?`<p class="fn">${esc(d.fix.why)}</p>`:''}</div>`:'';
  const words = d.new_words.length?`<div class="nw">${d.new_words.map(w=>`<span><b>${esc(w.ko)}</b>${esc(str(w.zh))}</span>`).join('')}</div>`:'';
  const body = d.mode==='explain'
    ? `<p class="lab fn">${ic('bulb',14,2)}讲解</p><p class="zh-b">${esc(d.zh)}</p>${d.examples.map(e=>`<div class="ex"><div><p class="ko-m">${esc(e.ko)}</p><p class="zh-s">${esc(str(e.zh))}</p></div>${play(e.ko)}</div>`).join('')}${d.ko?`<div class="ex"><div><p class="fn">接着聊</p><p class="ko-m">${esc(d.ko)}</p></div>${play(d.ko)}</div>`:''}`
    : `<p class="ko-m">${esc(d.ko)}</p>${P.showZh&&d.zh?`<p class="zh-s">${esc(d.zh)}</p>`:''}`;
  const acts = d.mode==='chat'&&d.ko ? `<div class="acts"><button class="act" aria-pressed="false" data-speech-key="${speechButtonKey(d.ko)}" data-say="${esc(d.ko)}">${ic('speaker',16,1.8)}播放</button>${d.zh?`<button class="act" data-save="${i}" ${m.saved?'disabled':''}>${ic(m.saved?'check':'plus',16,2)}${m.saved?'已加入复习':'加入复习'}</button>`:''}</div>` : '';
  return `<div class="ai">${fix}<div class="bub them">${body}${words}</div>${acts}</div>`;
}

function drawThread(keepScroll){
  const el=$('#thread'); if(!el||!CHAT) return;
  const c=CHAT;
  let h = c.msgs.map((m,i)=>m.hidden?'':m.role==='user'?`<div class="bub me">${esc(m.text)}</div>`:aiBubble(m,i)).join('');
  if(c.busy) h+=`<div class="ai"><div class="bub them typing" aria-label="对方正在输入"><i></i><i></i><i></i></div></div>`;
  if(c.error) h+=`<div class="err"><p>${esc(c.error)}</p><button onclick="ask()">重试</button></div>`;
  const last=[...c.msgs].reverse().find(m=>m.role==='assistant');
  if(!c.busy&&!c.error&&last?.data.end) h+=`<div class="card" style="margin-top:8px"><h3 class="hl">这一场练完了</h3><p class="fn" style="margin:2px 0 12px">想换个说法就再来一遍，也可以接着打字聊。</p><div class="row"><button class="btn soft" onclick="openChat(CHAT.kind,CHAT.back,CHAT.n)">再练一遍</button>${goBtn('返回','leaveChat()')}</div></div>`;
  else if(!c.busy&&!c.error&&last?.data.suggest.length) h+=`<div class="sugg" aria-label="可以这样回">${last.data.suggest.map(s=>`<button class="sg" data-fill="${esc(s)}">${esc(s)}</button>`).join('')}</div>`;
  el.innerHTML=h;
  if(!keepScroll) requestAnimationFrame(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
}

// 发一次 DeepSeek 请求，返回模型输出的 JSON 文本；对话和表达练习共用
async function aiRequest(messages, requestId){
  if(Tutor){
    const j = await Tutor.request({requestId, body:{messages, max_tokens:1200, temperature:0.7, response_format:{type:'json_object'}, thinking:{type:'disabled'}}});
    return j?.choices?.[0]?.message?.content || '';
  }
  const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages})});
  const j=await r.json().catch(()=>({}));
  if(!r.ok) throw Error(j.error||'连接失败（'+r.status+'）');
  return j.content;
}
function send(text,hidden){
  text=(text||'').trim();
  if(!CHAT||!text||CHAT.busy) return;
  CHAT.msgs.push({role:'user',text,hidden:!!hidden});
  ask();
}
async function ask(){
  const c=CHAT; if(!c) return;
  c.busy=true; c.error=null; drawThread(); syncComposer();
  let hist=c.msgs.slice(-20).map(m=>({role:m.role,content:m.role==='user'?m.text:m.raw}));
  while(hist.length&&hist[0].role!=='user') hist.shift();
  const messages=[{role:'system',content:sysPrompt(c)},...hist];
  try{
    c.req = 'r'+Date.now();
    const content = await aiRequest(messages, c.req);
    const data=parseReply(content);
    c.msgs.push({role:'assistant',raw:content,data});
    if(data.fix) dNoteFix(c.n, data.fix, 'chat');
    if(data.ko) playAIReply(data.ko);
  }catch(e){ c.error = e.message&&!/fetch/i.test(e.message) ? e.message : (Tutor?'没能连上 DeepSeek，检查一下网络再试':'连不上本机中转，确认 npm run dev 还在运行'); }
  c.busy=false; c.req=null;
  if(c===CHAT){ drawThread(); syncComposer(); }
}

/* 说韩语：原生用系统语音识别（ko-KR），浏览器用 Web Speech */
const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
let recog=null, listening=false, partialSub=null;
function stopMic(){
  if(Speech){ if(listening) Speech.stopListening().catch(()=>{}); listening=false; partialSub?.then(h=>h.remove()); partialSub=null; return; }
  if(recog){ recog.onend=null; recog.stop(); recog=null; }
}
async function toggleMic(){
  const box=$('#msg'), base=box.value.trim(), mic=$('#mic');
  const put = t=>{ box.value=(base?base+' ':'')+t; syncComposer(); };
  if(Speech){
    if(listening){ Speech.stopListening().catch(()=>{}); return; }
    listening=true; mic.classList.add('on');
    partialSub = Speech.addListener('partial', e=>put(e.text||''));
    try{ const r=await Speech.listen({lang:'ko-KR'}); if(r?.text) put(r.text); }
    catch(e){ if(e.message) toast(e.message); }
    listening=false; partialSub?.then(h=>h.remove()); partialSub=null; $('#mic')?.classList.remove('on');
    return;
  }
  if(recog){ recog.stop(); return; }
  recog=new SR(); recog.lang='ko-KR'; recog.interimResults=true;
  recog.onresult=e=>put([...e.results].map(r=>r[0].transcript).join(''));
  recog.onerror=e=>{ if(e.error==='not-allowed') toast('没有拿到麦克风权限'); else if(e.error!=='aborted'&&e.error!=='no-speech') toast('语音识别没成功，可以直接打字'); };
  recog.onend=()=>{ recog=null; $('#mic')?.classList.remove('on'); };
  recog.start(); mic.classList.add('on');
}
function syncComposer(){
  const box=$('#msg'); if(!box) return;
  box.style.height='44px'; box.style.height=Math.min(box.scrollHeight+1,132)+'px';
  $('#send').disabled = !box.value.trim() || !!CHAT?.busy;
}
function bindComposer(){
  const box=$('#msg'), form=$('#composer');
  box.addEventListener('input',syncComposer);
  box.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){ e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener('submit',e=>{ e.preventDefault(); if(CHAT?.busy) return; stopMic(); const t=box.value; box.value=''; syncComposer(); send(t); });
  $('#mic')?.addEventListener('click',toggleMic);
}

/* ---------- 点击委托：朗读、填入建议、加入复习 ---------- */
document.addEventListener('click',e=>{
  if(e.target.closest('#tabs button,.daily-plan-pill,.daily-text-btn,.row-i')) stopSpoken();
  const say=e.target.closest('[data-say]'); if(say){ speak(say.dataset.say); return; }
  const fill=e.target.closest('[data-fill]');
  if(fill){ const b=$('#msg'); b.value=fill.dataset.fill; syncComposer(); b.focus(); return; }
  const sv=e.target.closest('[data-save]');
  if(sv&&CHAT){ const m=CHAT.msgs[+sv.dataset.save]; if(!m||m.saved) return;
    const d=new Date();
    addCards([{id:'ai'+Date.now(), type:'说', front:m.data.zh, back:m.data.ko, src:`AI 伙伴 · ${d.getMonth()+1} 月 ${d.getDate()} 日`}]);
    m.saved=true; drawThread(true); toast('已加入复习'); }
});

/* ---------- 页面切换：每次切换记一条历史，安卓返回键会回到上一页 ---------- */
function strandOfView(){
  if(S.tab==='lesson') return STRAND[stepsOf(curL())[prog(S.ln).step]];
  if(S.tab==='review'||S.tab==='hangul') return 'lang';
  if(S.tab==='chat') return 'flu';
  return null;
}
function go(t, fromHistory){
  if(S.tab==='chat' && t!=='chat' && CHAT){ stopMic(); CHAT=null; }
  if(t==='chat' && !CHAT) t='talk';
  S.tab=t; S.rShow=false; S.reset=false;
  if(!fromHistory) history.pushState({t}, '');
  render(true); scrollTo(0,0);
}
addEventListener('popstate', e=>{ const t=e.state?.t||(P.start?'home':'onboard'); go(t==='onboard'&&P.start?'home':t, true); });
function render(anim){
  const app=$('#app');
  app.innerHTML={onboard,home,plan,course,lesson,review,talk,chat,hangul,settings,'daily-task':dailyTask,practice}[S.tab]();
  app.classList.toggle('chatting',S.tab==='chat');
  app.dataset.page = S.tab==='hangul'&&S.hu!==null ? 'hangul-unit' : S.tab;
  if(anim){ app.classList.remove('enter'); void app.offsetWidth; app.classList.add('enter'); }
  const deskUI = document.documentElement.classList.contains('desk'); // 浏览器宽屏也用左侧导航
  $('#tabs').classList.toggle('hide',deskUI?S.tab==='onboard':['onboard','lesson','chat','hangul','settings','practice','daily-task'].includes(S.tab));
  const navTab = deskUI ?({lesson:'course',hangul:'course',chat:'talk',practice:'home','daily-task':'home'}[S.tab]||S.tab) : S.tab;
  if(DESK){ const n=dueCards().length, badge=$('#tabs .cnt'); if(badge) badge.textContent=n||''; }
  document.querySelectorAll('#tabs button').forEach(b=>{ const on=b.dataset.tab===navTab; b.classList.toggle('on',on); b.setAttribute('aria-current',on?'page':'false'); });
  if(S.tab==='chat'){ bindComposer(); drawThread(); }
  track(strandOfView());
}
document.querySelectorAll('#tabs button').forEach(b=>{ const t=TABS.find(x=>x[0]===b.dataset.tab); b.innerHTML=`${ic(t[1],22,1.9)}<span>${t[2]}</span>`; b.onclick=()=>go(b.dataset.tab); });

/* ---------- Mac 桌面版：侧边栏抬头、设置入口、复习数，键盘操作 ---------- */
function deskGo(t){ if(P.start) go(t); } // 菜单「前往」和 ⌘1–4、⌘, 调这里
if(DESK){
  const nav=$('#tabs');
  nav.insertAdjacentHTML('afterbegin',`<div class="brand"><span class="logo">한</span><span><b>学韩语</b><span class="fn">首尔大学 · 维他命</span></span></div>`);
  nav.querySelector('[data-tab=review]').insertAdjacentHTML('beforeend','<em class="cnt num"></em>');
  nav.insertAdjacentHTML('beforeend',`<button class="set" data-tab="settings">${ic('sliders',20,1.9)}<span>设置</span></button>`);
  nav.querySelector('.set').onclick=()=>go('settings');
  addEventListener('keydown',e=>{
    if(e.metaKey||e.ctrlKey||e.altKey||e.isComposing||e.target.closest('textarea,input')) return;
    if(e.key==='Escape'){ $('.nav [aria-label="返回"]')?.click(); return; }
    if(S.tab!=='review') return;
    if(e.key===' '&&$('.reveal-go')){ e.preventDefault(); $('.reveal-go').click(); }
    else if('123'.includes(e.key)&&e.key.length===1) document.querySelectorAll('.grade button')[+e.key-1]?.click();
  });
}
/* 中文句子里夹的韩语按整词换行：连续的韩文包进 .kw，不在音节中间断开 */
const KO_RUN=/[ᄀ-ᇿ㄰-㆏가-힯]+/g;
function keepKo(root){
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT), hits=[];
  for(let n; (n=w.nextNode());) if(n.data.search(KO_RUN)>=0 && !n.parentElement?.closest('.kw,textarea,script,style')) hits.push(n);
  for(const n of hits){
    const f=document.createDocumentFragment(); let at=0;
    for(const m of n.data.matchAll(KO_RUN)){
      f.append(n.data.slice(at,m.index), Object.assign(document.createElement('span'),{className:'kw',textContent:m[0]}));
      at=m.index+m[0].length;
    }
    f.append(n.data.slice(at)); n.replaceWith(f);
  }
}
new MutationObserver(ms=>{ for(const m of ms) for(const n of m.addedNodes) if(n.isConnected) keepKo(n.nodeType===1?n:n.parentNode); })
  .observe($('#app'),{childList:true,subtree:true});
history.replaceState({t:S.tab}, '');
document.querySelector('#speech-player-toggle').addEventListener('click',()=>{if(speechText)speak(speechText,false)});
document.querySelector('#speech-player-close').addEventListener('click',()=>stopSpoken());
if(window.DAILY_READY){ render(true); checkAI(); }
