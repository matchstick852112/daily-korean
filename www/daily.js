/* 每日学习 v0.5：课程保留原顺序，日历负责组织新课、场景、复习与恢复。 */
window.DAILY_READY=true;
const DESK_UI = DESK || matchMedia('(min-width: 701px)').matches;
document.documentElement.classList.toggle('desk', DESK_UI);
matchMedia('(min-width: 701px)').addEventListener('change',e=>{
  if(!DESK){
    document.documentElement.classList.toggle('desk',e.matches);
    render();
  }
});
document.querySelectorAll('#tabs > .inner > button').forEach(b=>{
  const label=TABS.find(t=>t[0]===b.dataset.tab);
  if(label){b.innerHTML=`${ic(label[1],21,1.9)}<span>${label[2]}</span>`;b.setAttribute('aria-label',label[2]);}
});
if(!DESK){
  const nav=document.querySelector('#tabs');
  nav.insertAdjacentHTML('afterbegin','<div class="brand"><span class="logo">한</span><span><b>学韩语</b><span class="fn">每天一点，真的能开口</span></span></div>');
  nav.insertAdjacentHTML('beforeend','<button class="set" data-tab="settings">'+ic('sliders',20,1.9)+'<span>学习偏好</span></button>');
  nav.querySelector('.set').onclick=()=>go('settings');
}
const D_STORE = 'ko-daily.v1';
const D_DEF = {period:30, goal:'日常会话', startDate:'', cursor:0, done:{}, attempts:[], recovery:{}, custom:{}, completedCustom:{}};
let D = (()=>{ try{return {...D_DEF,...JSON.parse(localStorage.getItem(D_STORE)||'{}')}}catch{return {...D_DEF}} })();
D.custom ??= {}; D.completedCustom ??= {}; D.difficulties ??= []; D.skip ??= {};
S.calendarMonth ??= today().slice(0,7);
S.selectedDate ??= today();
S.planEditor ??= null;
if(!D.startDate) D.startDate=today();
const dSave=()=>{try{localStorage.setItem(D_STORE,JSON.stringify(D))}catch{}};
const dClamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dTypeName=t=>({new:'新表达',speak:'开口',review:'复习',light:'轻量日',rest:'休息日',recovery:'恢复卡'}[t]);
const dTypeLabel=t=>({new:'新表达',speak:'开口练习',review:'复习',light:'轻量学习',rest:'休息日',recovery:'恢复卡'}[t]);
const dISO=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const dParse=s=>new Date(`${s}T12:00:00`);
const dDayIndex=s=>Math.round((dParse(s)-dParse(D.startDate))/864e5);
// 「今天」按日期算，和日历一致；超出周期停在最后一天
const dCur=()=>dClamp(dDayIndex(today()),0,D.period-1);
const dDateKey=(i=dCur())=>dISO(dDate(i));
const dCustomAt=s=>D.custom[s] ? (Array.isArray(D.custom[s]) ? D.custom[s][0] : D.custom[s]) : null;
const D_TRACK=SERIES.flatMap(s=>s.books.flatMap(b=>lessonsIn(b[0])));
const D_TRACK_ZERO=seriesLessons('1A');
const dSeries=()=>P.start==='zero'?D_TRACK_ZERO:D_TRACK;
const D_QUOTAS={30:[12,8,10],90:[35,25,30],180:[65,50,65],365:[125,100,140]};
const D_SCHEDULES={};
for(const [period,quotas] of Object.entries(D_QUOTAS)){
  const p=+period, plan=Array(p-1), used=[0,0,0], names=['new','speak','review'];
  for(let day=0;day<p-1;day++){
    const k=names.map((name,k)=>({k,left:quotas[k]-used[k]})).filter(x=>x.left>0).sort((a,b)=>b.left-a.left||a.k-b.k)[0].k;
    plan[day]=names[k];used[k]++;
  }
  const seen=[0,0,0];D_SCHEDULES[p]=plan.map((type,day)=>({day,type,local:seen[names.indexOf(type)]++}));
}
// 新课从起点课开始，一课接一课往下排；开口、复习用最近学的那一课
D.startN ??= (lessonOf(P.cur)||D_TRACK[0])?.n;
const D_TASKS={};
function dTasks(p=D.period){
  const start=Math.max(0,D_TRACK.findIndex(x=>x.n===D.startN)), key=`${p}:${start}`;
  if(D_TASKS[key]) return D_TASKS[key];
  const tasks=[];let next=start,last=start;
  for(let day=0;day<p;day++){
    if(day===p-1){tasks.push({id:`d${day}`,day,type:'light',title:'回到第一段对话，听见自己的进步',lessonN:D_TRACK[start]?.n,mode:'light'});continue;}
    const {type}=D_SCHEDULES[p][day];
    if(type==='new'){last=Math.min(next,D_TRACK.length-1);next++;}
    const L=D_TRACK[last];
    tasks.push({id:`d${day}`,day,type,lessonN:L?.n,mode:type,title:type==='new'?(day===0?`今天，${L?.cando||'学会第一句韩语'}`:L?.cando):type==='speak'?L?.task?.brief:type==='review'?'不看原文，找回一句熟悉的表达':'听一段熟悉的对话，轻松接上'});
  }
  return D_TASKS[key]=tasks;
}
// 学习证据：讲过、听过不算掌握，要有一次自己说出来的动作。没看整句（提示序号 4）就说出来，记为独立完成
const D_STATE={none:'还没开始',understood:'学过，还没开口',assisted:'带提示说出来了',independent:'能独立说出',verified:'隔天也能说出'};
const dIndep=a=>a.ok!==false&&(a.independent??a.hint<4);
function dEvidence(n){
  const xs=D.attempts.filter(a=>a.n===n&&(a.kind==='expression'||a.kind==='scene')), said=xs.filter(a=>a.kind==='expression');
  const ind=said.filter(dIndep), first=ind[0]?.at;
  const state=first&&ind.some(a=>a.at>first)?'verified':ind.length?'independent':xs.length?'assisted':prog(n).done?'understood':'none';
  return {state,last:said.at(-1)};
}
// 推进看证据：前一课至少开口说过一次（或你选了先跳过），后面的新课才排上；已过去的日子不改
function dFrontier(){
  const start=Math.max(0,D_TRACK.findIndex(x=>x.n===D.startN));
  for(let i=start;i<D_TRACK.length;i++){const n=D_TRACK[i].n;if(!D.skip[n]&&['none','understood'].includes(dEvidence(n).state))return i;}
  return D_TRACK.length-1;
}
function dGate(t){
  if(!t||!t.lessonN)return t;
  // 已完成的日子显示当天实际学的那一课
  const doneN=typeof D.done[t.day]==='number'?D.done[t.day]:0;
  if(doneN&&doneN!==t.lessonN)return {...t,lessonN:doneN,title:t.type==='new'?lessonOf(doneN)?.cando:t.title};
  if(t.day<dCur()||D.done[t.day])return t;
  const fi=dFrontier(), f=D_TRACK[fi], ti=D_TRACK.findIndex(x=>x.n===t.lessonN);
  if(!f||ti<=fi)return t;
  // 整体顺延：从今天起的第一节新课对齐到还没开口的那一课，后面的课依次往后挪
  const nx=dTasks().slice(dCur()).find(x=>x.type==='new'), shift=nx?Math.max(0,D_TRACK.findIndex(x=>x.n===nx.lessonN)-fi):0;
  const ni=Math.max(fi,ti-shift), L=D_TRACK[ni];
  if(ni>fi)return {...t,lessonN:L.n,title:t.type==='new'?L.cando:t.type==='speak'?L.task?.brief:t.title};
  const studied=prog(f.n).done||prog(f.n).step>0, start=Math.max(0,D_TRACK.findIndex(x=>x.n===D.startN));
  if(t.type==='new')return {...t,lessonN:f.n,held:studied,title:studied?`先把这一课说出来：${f.cando}`:f.cando};
  const back=studied||fi<=start?f:D_TRACK[fi-1];
  return {...t,lessonN:back.n,title:t.type==='speak'?back.task?.brief:t.title};
}
function dSkip(n){D.skip[n]=true;dSave();toast('这一课先放一放，之后的复习和对话里还会见到');render();}
const dTask=(i=dCur(),period=D.period)=>dGate(dTasks(+period)[dClamp(i,0,+period-1)]);
// 连着漏了几天（休息日不算），用来决定恢复卡给多少内容
function dMissedRun(){
  let run=0;
  for(let d=dCur()-1;d>=0&&run<30;d--){const t=dTaskAt(dDateKey(d));if(!t||t.type==='rest')continue;if(dDone(t))break;run++;}
  return run;
}
const dRecoveryTier=run=>run>=8?{min:6,eyebrow:'休息了一阵',title:'先简短回顾，记录都还在',sub:`漏了 ${run} 天。学过的内容和复习记录都保留着，先听两句、复习一下，明天起照常排。`}:run>=4?{min:10,eyebrow:'先复习再用',title:'先复习，再把学过的说一次',sub:`漏了 ${run} 天。今天不加新课：先听熟悉的一句，再做到期复习。`}:run>=2?{min:8,eyebrow:'接住最近一句',title:'今天不加新课，先接住最近一句',sub:`漏了 ${run} 天。不用补课，听一句、跟着说，再做到期复习。`}:{min:6,eyebrow:'从熟悉的开始',title:'从熟悉的表达开始',sub:'漏了 1 天。听一句熟悉的，跟着说一句，再做到期复习。'};
function dRecoveryTask(){
  const c=dCur();let last=-1;for(let d=c-1;d>=0;d--)if(D.done[d]){last=d;break;}
  const base=dTask(Math.max(0,c-1)), n=last>=0?dTask(last).lessonN:D.startN||base.lessonN, run=dMissedRun();
  return {...base,id:`recovery-${c}`,day:c,type:'recovery',mode:'recovery',lessonN:n,title:'先从熟悉的表达开始，轻松接上',missed:run>0,run};
}
function dTaskAt(s){
  const custom=dCustomAt(s), idx=dDayIndex(s);
  if(custom) return {...custom,id:`custom-${s}`,day:idx,date:s,custom:true};
  return idx>=0&&idx<D.period ? dTask(idx) : null;
}
function dMissedYesterday(){const c=dCur();if(c<=0)return false;const y=dTaskAt(dDateKey(c-1));return !!y&&y.type!=='rest'&&!dDone(y);}
function dCurrentTask(){
  const t=dTaskAt(dDateKey());
  if(t?.custom) return t;
  if(!dMissedYesterday()||dDone(t)) return t;
  if(!D.recovery[dCur()]) return dRecoveryTask();
  // 漏了两天以上：恢复卡做完后，今天也不加新课
  return t?.type==='new'&&dMissedRun()>=2 ? {...t,type:'light',mode:'light',title:'今天不加新课，听一段熟悉的对话'} : t;
}
function dDate(i=dCur()){const d=new Date(D.startDate+'T12:00:00');d.setDate(d.getDate()+i);return d;}
function dDone(t){return t.type==='recovery'?D.recovery[dCur()]:t.custom?D.completedCustom[t.date]:D.done[t.day];}
function dMarkDone(t){if(t.type==='recovery')D.recovery[dCur()]=true;else if(t.custom)D.completedCustom[t.date]=true;else D.done[t.day]=t.lessonN||true;dSave();}
// 本周按真实日期排，周一到周日
function dWeek(){
  const mon=dParse(today());mon.setDate(mon.getDate()-((mon.getDay()+6)%7));
  return Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);const key=dISO(d),task=dTaskAt(key);return {key,label:['一','二','三','四','五','六','日'][i],task,date:d,today:key===today(),done:!!task&&!!dDone(task)};});
}
function dSource(L){return L?`${lname(L)} · ${pages(L)}`:'';}
function dPhrase(L){
  if(!L) return {k:'안녕하세요?',zh:'你好。',cue:'先听一句，再试着说。'};
  const line=L.dialogues?.[0]?.lines?.find(x=>x.k.length<=42)||L.dialogues?.[0]?.lines?.[0];
  return {k:line?.k||L.k,zh:line?.z||L.zh,cue:L.grammar?.[0]?.rule?.[0]?.[1]||'先听原音，再按自己的意思表达。'};
}
function openPractice(n,fromTask=true){
  const L=lessonOf(n);if(!L)return;
  S.practice={n,hint:0,answer:'',feedback:null,recording:false,fromTask,tries:0,prevHint:dEvidence(n).last?.hint??-1};go('practice');
}
// 导师记忆：只记具体卡在哪一句、怎么改，绑定课和时间；你可以在学习偏好里删掉
function dNoteFix(n,fix,src){
  if(!fix?.better)return;
  D.difficulties=[{n,at:today(),original:str(fix.original),better:str(fix.better),why:str(fix.why),src},...D.difficulties.filter(x=>x.better!==fix.better)].slice(0,12);dSave();
}
function dDifficultyText(){
  const xs=D.difficulties.filter(x=>!x.resolved).slice(0,3);
  return xs.length?'学习者最近卡住的地方（对话里自然地给一次机会再用到，不要说教）：'+xs.map(x=>`${x.original?x.original+' → ':''}${x.better}${x.why?`（${x.why}）`:''}`).join('；')+'。':'';
}
function dForget(i){D.difficulties.splice(i,1);dSave();render();}
// 复习吃练习证据：要看整句才说出来的那句，最晚明天再复习；还没进复习的，从这次练习起加进来
function dReviewFromPractice(L,p,independent){
  const card=lessonCards(L).find(c=>c.back===p.k);if(!card)return;
  if(!P.cards.some(c=>c.id===card.id))addCards([card]);
  const c=P.cards.find(x=>x.id===card.id), soon=new Date(Date.now()+864e5);
  if(!independent&&c.f.state!==F.State.New&&new Date(c.f.due)>soon){c.f.due=soon;save();}
}
async function submitPractice(){
  const q=S.practice,L=lessonOf(q.n),p=dPhrase(L);
  q.answer=document.querySelector('#practice-answer')?.value??q.answer;if(!q.answer.trim())return;
  const a={n:q.n,at:today(),kind:'expression',hint:q.hint,answer:q.answer.trim(),independent:q.hint<4,try:q.tries};
  D.attempts.push(a);dSave();dReviewFromPractice(L,p,a.independent);
  q.feedback={loading:AI.ready};render();
  if(!AI.ready){q.feedback={offline:true};return render();}
  const sys=['你是韩语学习 App 里的表达教练，学习者是中文母语成人。'+learnedText(L)+dDifficultyText(),
    `这次练习的场景：${L.task.t}。想表达的意思：「${p.zh}」。教材里的说法：「${p.k}」。学习者这次${q.hint>=4?'看过整句提示':q.hint>=2?'看过部分提示':'没看提示'}。`,
    '先理解学习者想说什么。意思对上、说法合理就算达到，不要求和教材一字不差。',
    '只挑最值得改的一处（词形、助词、语尾、敬语、用词）；没有明显错误，或只是标点空格，fix 为 null。不评发音，不打分，不改写学习者的原意。',
    '只输出 JSON：{"ok":true,"meaning":"用中文一句话说你理解的意思","fix":null,"next":"下次再说时注意什么，中文 20 字以内"}。fix 有内容时为 {"original":"原句里要改的部分","better":"改好的整句","why":"一句中文原因"}。'].join('\n');
  try{
    const d=JSON.parse(await aiRequest([{role:'system',content:sys},{role:'user',content:a.answer}],'p'+Date.now()));
    const fix=d.fix&&str(d.fix.better)?{original:str(d.fix.original),better:str(d.fix.better),why:str(d.fix.why)}:null;
    a.ok=d.ok!==false;a.fix=fix;
    if(fix)dNoteFix(q.n,fix,'practice');
    else if(a.ok&&a.independent)D.difficulties.forEach(x=>{if(x.n===q.n)x.resolved=today();});
    dSave();
    if(S.practice===q){q.feedback={ok:a.ok,meaning:str(d.meaning),fix,next:str(d.next)};render();}
  }catch{if(S.practice===q){q.feedback={offline:true};render();}}
}
function dailyLessonPractice(L){
  return `<div class="card candy c-lilac"><p class="eyebrow">今天的场景 · ${esc(L.task.t)}</p><h2 class="t2">${esc(L.task.brief)}</h2><p class="sub">先用自己的话试一试，再让 AI 陪你进入真实场景。</p></div><div class="card"><h3 class="hl">你的表达，由你确认</h3><p class="fn">从熟悉的一句开始，再看需要减少哪一层提示。</p><div style="margin-top:14px">${goBtn('开始表达练习',`openPractice(${L.n},true)`)}</div></div><div class="card candy c-green"><h3 class="hl">和 ${esc(L.task.ai)} 演一遍</h3><p class="fn">如果已经练过这句，可以直接进入场景。</p>${statusLine()}<div style="margin-top:14px">${goBtn('进入场景',`completeScene(${L.n})`)}</div></div>`;
}
function completeScene(n){
  if(S.dailyTask?.type==='speak'){const t=S.dailyTask;D.attempts.push({n,at:today(),kind:'scene'});dMarkDone(t);S.dailyTask=null;openChat('scene','home',n);}else openChat('scene','lesson',n);
}
function practice(){
  const q=S.practice,L=lessonOf(q.n),p=dPhrase(L),hintLabels=['重听原音','慢速听','看关键词','看中文','看整句','语法解释'];
  const wordHint=(L.words||[]).slice(0,4).map(w=>w.k).join(' · '), grammar=L.grammar?.[0];
  return `<header class="nav"><div class="bar"><button class="icon-btn" aria-label="返回" onclick="go('lesson')">${ic('chevL',22)}</button><div class="mid"><p class="fn">${lname(L)} · 表达练习</p><p class="hl">这次，换你来说</p></div><span style="width:44px"></span></div></header><main class="practice-page"><div class="practice-main"><p class="eyebrow">先试着表达，再获得一处有用的反馈 · ${D_STATE[dEvidence(q.n).state]}</p><h1 class="lt">${esc(L.task.t)}</h1><p class="practice-intro">可以录音回听，也可以直接打字。识别结果能修改，原意由你确认。</p><div class="practice-phrase"><p class="daily-korean">${q.hint>=4?esc(p.k):esc(p.cue)}</p><p class="daily-zh">${q.hint>=3?esc(p.zh):'先想一想，这句话可以怎样说。'}</p><button class="daily-listen" onclick="speak(${JSON.stringify(p.k).replaceAll('"','&quot;')})"><span class="daily-play-icon"></span><span class="daily-wave">${Array.from({length:23},(_,i)=>`<i style="height:${[10,16,23,14,19,25][i%6]}px"></i>`).join('')}</span>听原音</button></div><label class="practice-label" for="practice-answer">你的韩语表达</label><textarea id="practice-answer" rows="4" placeholder="用韩语说或输入你的回答" ${q.feedback?'disabled':''} oninput="S.practice.answer=this.value;document.querySelector('#practice-submit').disabled=!this.value.trim()">${esc(q.answer)}</textarea><div class="practice-tools"><span>原句保留，不做自动发音评分。</span><button class="btn soft" onclick="practiceMic(this)">${ic('mic',16)}语音输入</button></div>${q.feedback?`${practiceFeedback(q,p)}<div class="practice-actions"><button class="btn soft" onclick="practiceRetry()">${ic('review',16)}我再说一次</button><button class="btn go" onclick="finishPractice()"><span>完成表达练习</span><span class="knob">${ic('check',17)}</span></button></div>`:`<button class="btn go" id="practice-submit" ${q.answer.trim()?'':'disabled'} onclick="submitPractice()"><span>${q.tries?'再交一次':'完成这一次表达'}</span><span class="knob">${ic('chevR',17)}</span></button>`}</div><aside class="practice-hints"><h3 class="hl">需要一点提示？</h3><p class="fn">每次只展开一层，想好再继续。不看整句说出来，记为独立完成。</p>${q.prevHint>=2?`<p class="practice-hint-goal">上次用到「${hintLabels[q.prevHint]}」，这次试着只用到「${hintLabels[q.prevHint-1]}」。</p>`:''}<div class="practice-hint-list">${hintLabels.map((x,i)=>`<button onclick="practiceHint(${i})"><span>${q.hint>i?ic('check',14):i+1}</span>${x}</button>`).join('')}</div>${q.hint>=2?`<div class="practice-hint-content">${q.hint===2?esc(wordHint):q.hint===3?esc(p.zh):q.hint===4?esc(p.k):`${esc(grammar?.t||L.tip)}<br>${esc(grammar?.note||'')}`}</div>`:''}<p class="daily-source">${esc(dSource(L))}</p></aside></main>`;
}
function practiceHint(i){const q=S.practice;if(i===0)speak(dPhrase(lessonOf(q.n)).k);else if(i===1)speak(dPhrase(lessonOf(q.n)).k,true);else{q.hint=Math.max(q.hint,i);render();}}
function practiceMic(btn){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return toast('这个浏览器没有语音识别，可以打字或先跟读。');const r=new SR();r.lang='ko-KR';r.onresult=e=>{S.practice.answer=e.results[0][0].transcript;render();};r.onerror=()=>toast('没有识别到内容，请重试或打字。');r.start();btn.innerHTML=`${ic('mic',16)}正在听…`;}
function practiceFeedback(q,p){
  const f=q.feedback;
  if(f.loading)return `<div class="practice-feedback"><h3>${ic('sparkles',17)}正在看你说的这句…</h3><p>已经记下这次表达。</p></div>`;
  if(f.offline)return `<div class="practice-feedback"><h3>${ic('check',17)}已记下这次表达</h3><p>现在连不上 AI，没法逐句给反馈。回听原音，对照「看整句」自己确认一下，再说一次。</p></div>`;
  return `<div class="practice-feedback"><h3>${ic(f.fix?'pencil':'check',17)}${f.fix?'意思对上了，有一处可以更自然':f.ok?'说得对，意思也到了':'意思还没完全对上'}</h3>${f.meaning?`<p>我理解的是：${esc(f.meaning)}</p>`:''}${f.fix?`<div class="fix">${f.fix.original?`<s>${esc(f.fix.original)}</s>`:''}<div class="bt"><p>${esc(f.fix.better)}</p>${play(f.fix.better)}</div>${f.fix.why?`<p class="fn">${esc(f.fix.why)}</p>`:''}</div>`:''}${f.next?`<p class="fn">下次：${esc(f.next)}</p>`:''}<button class="daily-text-btn" onclick="practiceAgain()">进入场景，和 AI 演一遍 ${ic('chevR',14)}</button></div>`;
}
// 再说一次：清掉答案、收起提示，自己先试
function practiceRetry(){const q=S.practice;q.tries++;q.prevHint=q.hint;q.hint=0;q.answer='';q.feedback=null;render();setTimeout(()=>document.querySelector('#practice-answer')?.focus(),0);}
function practiceAgain(){const q=S.practice;q.feedback=null;prog(q.n).step=5;save();go('lesson');}
function finishPractice(){const q=S.practice;if(q.fromTask&&S.dailyTask?.type==='speak'){dMarkDone(S.dailyTask);S.dailyTask=null;go('home');}else{prog(q.n).step=5;save();go('lesson');}}
function dHint(L){
  if(!L)return '';
  const words=(L.words||[]).slice(0,4).map(w=>w.k).join(' · ');
  const g=L.grammar?.[0];
  return `<strong>${esc(words)}</strong><p>${esc(g?.t||L.tip||'')} · ${esc(g?.zh||'')}</p>`;
}
function dHome(){
  const t=dCurrentTask(),L=lessonOf(t.lessonN),phrase=dPhrase(L),done=!!dDone(t),rec=t.type==='recovery';
  return `<header class="top daily-header"><div class="grow"><p class="eyebrow">${today().replaceAll('-','.')} · ${D.period}天 · ${esc(D.goal)}</p><h1 class="lt">今日学习</h1></div><button class="daily-plan-pill" onclick="go('plan')">${D.period}天计划 ${ic('chevR',13)}</button><button class="icon-btn mobile-only" aria-label="学习偏好" onclick="go('settings')">${ic('sliders',20)}</button></header><main class="daily-home">
  <section class="daily-focus"><div class="daily-title"><p class="eyebrow">DAY ${String(t.day+1).padStart(2,'0')} / ${D.period} · ${dTypeName(t.type)}</p><h2>${rec?'今天，先找回一句熟悉的韩语':done?'今天已经完成，再练一次会更熟悉':t.type==='new'?'今天，学会一句真的能用的话':t.type==='speak'?'今天，把学过的表达用出来':'今天，让熟悉的表达留下来'}</h2><p>${rec?dRecoveryTier(t.run).sub:t.title||L?.cando||''}</p></div>
  <div class="daily-hero ${rec?'recovery':''}"><div class="daily-steps"><span>01 听懂</span><i></i><span>02 试着说</span><i></i><span>03 场景使用</span></div><p class="daily-korean">${esc(phrase.k)}</p><p class="daily-zh">${esc(phrase.zh)}</p><button class="daily-listen" aria-pressed="false" data-speech-key="${speechButtonKey(phrase.k)}" onclick="speak(${JSON.stringify(phrase.k).replaceAll('"','&quot;')})"><span class="daily-play-icon"></span><span class="daily-wave">${Array.from({length:23},(_,i)=>`<i style="height:${[10,16,23,14,19,25][i%6]}px"></i>`).join('')}</span><span class="speech-label">听原音</span></button><div class="daily-hero-bottom"><span>${ic('bulb',16)}按需提示，不急着看答案</span>${goBtn(done?'再练一次':rec?'开始恢复':'开始今日任务',`openDaily(${JSON.stringify(t.id).replaceAll('"','&quot;')})`)}</div></div>
  <p class="daily-note">${ic('sparkles',15)}${t.held&&!done?`上一课还没开口说过，先把它说一次。<button class="daily-text-btn" onclick="dSkip(${t.lessonN})">这课先跳过</button>`:`先试着表达，再获得一处有用的反馈。${L?` · ${D_STATE[dEvidence(L.n).state]}`:''}`}</p></section>
  <aside class="daily-rhythm"><p class="eyebrow">这一周的学习节奏</p><h3>少量新内容，留时间真的用出来。</h3><div class="desktop-week-agenda">${dWeek().map(w=>`<button onclick="${w.task?`openDaily('${w.task.id}')`:'void 0'}"><span>${w.label} · ${w.date?`${w.date.getMonth()+1}/${w.date.getDate()}`:''}</span><strong>${w.task?dTypeName(w.task.type):'休息日'}</strong>${w.today?'<i>今天</i>':ic('chevR',14)}</button>`).join('')}</div><div class="daily-week">${dWeek().map(w=>`<div class="${w.today?'now':''} ${w.done?'done':''}"><b>${w.done?ic('check',14):w.label}</b><span>${w.task?dTypeName(w.task.type):'—'}</span></div>`).join('')}</div><p class="daily-rhythm-note">每次出现，都有点小变化。<br>之后会在新的对话里，再次用到它。</p><button class="daily-text-btn" onclick="go('plan')">查看完整学习计划 ${ic('chevR',14)}</button><button class="daily-text-btn muted" onclick="go('review')">先复习一下 ${ic('review',14)}</button><p class="daily-source">${esc(dSource(L))}</p></aside>
  </main>`;
}
function openDaily(id){
  const cur=dCurrentTask();
  let t=cur?.id===id?cur:id.startsWith('recovery-')?dRecoveryTask():id.startsWith('custom-')?dTaskAt(id.slice(7)):dTask(+id.slice(1));
  if(!t){toast('这一天还没有学习计划，可以先添加任务');return;}
  S.dailyTask=t;
  if(t.type==='rest'){ toast('这一天是休息日，不用完成学习任务');return; }
  // 先定好从哪一步开始，再打开课程（openLesson 会立即渲染）
  if(t.type==='new'){ if(!t.custom)prog(t.lessonN).step=0; save(); openLesson(t.lessonN); }
  else if(t.type==='speak'){ if(!t.custom)prog(t.lessonN).step=5; save(); openLesson(t.lessonN); }
  else if(t.type==='review'){ if(dEvidence(t.lessonN).state!=='none') addDailyCards(t.lessonN); if(dueCards().length) go('review'); else { dMarkDone(t); S.dailyTask=null; toast('今天没有到期的复习卡，已记为完成'); render(); } }
  else go('daily-task');
}
function addDailyCards(n){const L=lessonOf(n);if(L&&!prog(n).carded){addCards(lessonCards(L));prog(n).carded=true;save();}}
function finishLesson(){
  const L=curL();legacyFinishLesson();
  const t=S.dailyTask;
  if(t?.lessonN===L.n){D.attempts.push({day:t.day,n:L.n,at:today(),kind:'lesson'});dMarkDone(t);}
  S.dailyTask=null;go('home');
}
function dailyTask(){
  const t=S.dailyTask||dCurrentTask(),L=lessonOf(t.lessonN),p=dPhrase(L);
  return `<header class="nav"><div class="bar"><button class="icon-btn" onclick="go('home')" aria-label="返回">${ic('chevL',22)}</button><div class="mid"><p class="fn">${dTypeName(t.type)} · DAY ${t.day+1}</p><p class="hl">听一段，轻松接上</p></div><span style="width:44px"></span></div></header><main><div class="card candy c-yellow daily-simple">${(()=>{const r=t.type==='recovery'?dRecoveryTier(t.run??dMissedRun()):null;return `<p class="eyebrow">${r?`恢复卡 · ${r.eyebrow} · 约${r.min}分钟`:'轻量日 · 约5分钟'}</p><h2 class="t2">${r?r.title:'今天只留一点韩语的耳朵'}</h2><p class="sub">${r?r.sub:'不增加新内容。听完后，跟着说一句就好。'}</p>`})()}<p class="daily-korean">${esc(p.k)}</p><p class="daily-zh">${esc(p.zh)}</p><button class="btn soft" onclick="speak(${JSON.stringify(p.k).replaceAll('"','&quot;')})">${ic('speaker',17)}听原音</button></div><div class="card"><h3 class="hl">听过以后，完成今天的轻任务</h3><p class="fn">记录这次回到学习的时间，不清零，也不堆叠新课。</p><div style="margin-top:14px">${goBtn('完成，回到今日','completeDailyTask()')}</div></div></main>`;
}
function goCalendarDate(key){S.calendarMonth=key.slice(0,7);S.selectedDate=key;S.planEditor=null;go('plan');}
function completeDailyTask(){const t=S.dailyTask||dCurrentTask();dMarkDone(t);S.dailyTask=null;toast(t.type==='recovery'?'接上了，接着做今天的任务':'这一天已完成');go('home');}
function dailyPlan(){
  const [y,m]=S.calendarMonth.split('-').map(Number), month=new Date(y,m-1,1,12), offset=(month.getDay()+6)%7, dim=new Date(y,m,0).getDate(), cells=[...Array(offset),...Array.from({length:dim},(_,i)=>i+1)];
  const selected=dTaskAt(S.selectedDate), selectedDate=dParse(S.selectedDate);
  const dayText=`${selectedDate.getMonth()+1}月${selectedDate.getDate()}日 · ${['周日','周一','周二','周三','周四','周五','周六'][selectedDate.getDay()]}`;
  const L=selected?lessonOf(selected.lessonN):null;
  const next=new Date(y,m,1,12), nextOffset=(next.getDay()+6)%7, nextDim=new Date(y,m+1,0).getDate();
  const nextCells=[...Array(nextOffset),...Array.from({length:nextDim},(_,i)=>i+1)].map(n=>{
    if(typeof n!=='number')return '<span class="calendar-blank"></span>';
    const key=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-${String(n).padStart(2,'0')}`,t=dTaskAt(key);
    return `<button class="calendar-date ${key===S.selectedDate?'selected':''}" onclick="selectCalendarDate('${key}')"><b>${n}</b><span>${t?dTypeLabel(t.type):'+'}</span></button>`;
  }).join('');
  return `<header class="top daily-header"><div class="grow"><p class="eyebrow">跟着自己的节奏</p><h1 class="lt">学习计划</h1></div><button class="btn soft daily-add-plan" onclick="openPlanEditor()">${ic('plus',16)}制定计划</button></header><main class="daily-plan">
    <div class="daily-plan-top"><p>选择日期查看任务，也可以按自己的时间安排学习。</p><div class="daily-periods" aria-label="自动计划周期">${[30,90,180,365].map(n=>`<button class="${D.period===n?'on':''}" onclick="changePeriod(${n})">${n}天</button>`).join('')}</div></div>
    <div class="calendar-workspace"><aside class="desktop-plan-agenda"><p class="eyebrow">本周安排</p><h3>一天完成一个小目标</h3><div>${dWeek().map(w=>`<button onclick="${w.task?`openDaily('${w.task.id}')`:'void 0'}"><span>${w.label} · ${w.date?`${w.date.getMonth()+1}/${w.date.getDate()}`:''}</span><strong>${w.task?dTypeName(w.task.type):'休息日'}</strong>${w.today?'<i>今天</i>':ic('chevR',14)}</button>`).join('')}</div><p>每天只安排一件能完成的事。漏做时，从恢复卡接上。</p><button class="daily-text-btn" onclick="openDaily('recovery-${dCur()}')">从恢复卡开始 ${ic('review',14)}</button></aside><section class="daily-calendar" aria-label="学习日历"><div class="daily-month"><button class="calendar-month-btn" aria-label="上个月" onclick="moveCalendarMonth(-1)">${ic('chevL',19)}</button><h2>${y}年 ${m}月</h2><button class="calendar-month-btn" aria-label="下个月" onclick="moveCalendarMonth(1)">${ic('chevR',19)}</button><button class="calendar-today-btn" onclick="calendarToday()">回到今天</button></div><div class="daily-weekdays">${['一','二','三','四','五','六','日'].map(x=>`<span>${x}</span>`).join('')}</div><div class="daily-days">${cells.map(n=>{if(typeof n!=='number')return '<span class="calendar-blank"></span>';const key=`${y}-${String(m).padStart(2,'0')}-${String(n).padStart(2,'0')}`,t=dTaskAt(key),done=t&&dDone(t),custom=dCustomAt(key);return `<button class="calendar-date ${key===today()?'today':''} ${key===S.selectedDate?'selected':''} ${done?'done':''} ${custom?'custom':''}" aria-pressed="${key===S.selectedDate}" aria-label="${key}${t?`，${dTypeLabel(t.type)}，${esc(t.title)}`:'，没有计划'}" onclick="selectCalendarDate('${key}')"><b>${n}</b>${t?`<span>${done?'已完成':dTypeLabel(t.type)}</span><i class="calendar-dot ${t.type}"></i>`:'<span class="calendar-empty">+</span>'}</button>`}).join('')}</div></section>
    <section class="desktop-next-month" aria-label="下个月"><div class="daily-month"><h2>${next.getFullYear()}年 ${next.getMonth()+1}月</h2></div><div class="daily-weekdays">${['一','二','三','四','五','六','日'].map(x=>`<span>${x}</span>`).join('')}</div><div class="daily-days">${nextCells}</div></section>    <aside class="calendar-detail"><p class="eyebrow">${dayText}${S.selectedDate===today()?' · 今天':''}</p>${selected?`<span class="calendar-task-type ${selected.type}">${dTypeLabel(selected.type)}${selected.custom?' · 自定义':''}</span><h2>${selected.type==='rest'?'给自己放一天假':esc(selected.title||L?.cando||'')}</h2>${selected.type!=='rest'?`<p class="calendar-lesson">${esc(lname(L))}${selected.custom?` · 约${selected.minutes||P.minutes}分钟`:''} · ${D_STATE[dEvidence(L.n).state]}</p><p class="calendar-detail-note">${selected.type==='review'?'从已经学过的内容中复习，不需要赶新课。':selected.type==='speak'?'用自己的话完成一次场景表达，卡住了可以逐级看提示。':selected.type==='light'?'听一段熟悉的内容，轻松保持学习节奏。':'从听懂到开口，按自己的节奏完成。'}</p><button class="btn go" onclick="openDaily('${selected.id}')"><span>${dDone(selected)?'再练一次':selected.day<0?'补做这一天的任务':'开始这一天的学习'}</span><span class="knob">${ic('chevR',17)}</span></button>`:'<p class="calendar-detail-note">不排新任务，保留已经完成的学习记录。</p>'}<button class="daily-text-btn" onclick="openPlanEditor()">${selected.custom?'编辑这一天的计划':'调整这一天的计划'} ${ic('chevR',14)}</button>`:`<div class="calendar-empty-state"><h2>这一天还没有学习计划</h2><p>安排一个能在当天完成的任务，或给自己留一天休息。</p><button class="btn go" onclick="openPlanEditor()"><span>添加学习计划</span><span class="knob">${ic('plus',17)}</span></button></div>`}</aside></div>
    <div class="daily-recovery"><div><p class="eyebrow">漏做也能接上</p><h3>从恢复卡开始，不需要补完所有新课。</h3><p>也可以点选过去日期，单独安排补做。</p></div><button class="btn soft" onclick="openDaily('recovery-${dCur()}')">体验恢复卡 ${ic('review',16)}</button></div>
    <p class="fn">自定义计划只保存在这台设备上，优先于同一天的自动任务；已有完成记录不会删除。</p>
    ${S.planEditor?planEditor():''}
  </main>`;
}
document.addEventListener('click',e=>{if(e.target.closest('.daily-add-plan')&&!S.planEditor)openPlanEditor();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&S.planEditor)closePlanEditor();});
function moveCalendarMonth(delta){const [y,m]=S.calendarMonth.split('-').map(Number),d=new Date(y,m-1+delta,1,12);S.calendarMonth=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;S.selectedDate=dISO(d);render(true);}
function calendarToday(){S.calendarMonth=today().slice(0,7);S.selectedDate=today();render(true);}
function selectCalendarDate(key){S.selectedDate=key;S.planEditor=null;render(true);}
function openPlanEditor(){
  const t=dTaskAt(S.selectedDate), custom=dCustomAt(S.selectedDate);
  S.planEditor={start:S.selectedDate,end:S.selectedDate,mode:'once',weekdays:[],type:custom?.type||t?.type||'new',lessonN:custom?.lessonN||t?.lessonN||lessonOf(P.cur)?.n||1,minutes:custom?.minutes||P.minutes,conflict:'skip'};
  render(true);
}
function updatePlanEditor(key,value){if(!S.planEditor)return;S.planEditor[key]=value;render(true);}
function togglePlanWeekday(day){const q=S.planEditor;if(!q)return;q.weekdays=q.weekdays.includes(day)?q.weekdays.filter(x=>x!==day):[...q.weekdays,day];render(true);}
function planDates(q){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(q.start)||!/^\d{4}-\d{2}-\d{2}$/.test(q.end))return [];
  let start=dParse(q.start),end=dParse(q.end);if(Number.isNaN(+start)||Number.isNaN(+end)||start>end)return [];
  const dates=[];
  for(let d=new Date(start),i=0;d<=end&&i<370;d.setDate(d.getDate()+1),i++) if(q.mode!=='weekly'||q.weekdays.includes((d.getDay()+6)%7)) dates.push(dISO(d));
  return dates;
}
function planEditor(){
  const q=S.planEditor, dates=planDates(q), conflicts=dates.filter(s=>dTaskAt(s)), affected=dates.length;
  const typeOptions=[['new','新课'],['speak','开口'],['review','复习'],['light','轻量'],['rest','休息']];
  return `<div class="plan-editor-backdrop" role="presentation" onclick="if(event.target===this)closePlanEditor()"><section class="plan-editor" role="dialog" aria-modal="true" aria-labelledby="plan-editor-title"><div class="plan-editor-head"><div><p class="eyebrow">按自己的时间安排</p><h2 id="plan-editor-title">制定学习计划</h2></div><button class="icon-btn" aria-label="关闭计划编辑" onclick="closePlanEditor()">${ic('chevL',19)}</button></div>
    <div class="plan-form-grid"><label>开始日期<input type="date" required value="${q.start}" onchange="updatePlanEditor('start',this.value)"></label><label>结束日期<input type="date" required value="${q.end}" min="${q.start}" onchange="updatePlanEditor('end',this.value)"></label></div>
    <fieldset><legend>重复方式</legend><div class="seg">${[['once','仅这一天'],['range','连续每天'],['weekly','每周重复']].map(([v,t])=>`<button class="${q.mode===v?'on':''}" onclick="updatePlanEditor('mode','${v}')">${t}</button>`).join('')}</div></fieldset>
    ${q.mode==='weekly'?`<fieldset><legend>选择星期</legend><div class="plan-weekdays">${['一','二','三','四','五','六','日'].map((t,i)=>`<button class="${q.weekdays.includes(i)?'on':''}" aria-pressed="${q.weekdays.includes(i)}" onclick="togglePlanWeekday(${i})">${t}</button>`).join('')}</div></fieldset>`:''}
    <fieldset><legend>安排什么？</legend><div class="seg plan-type-options">${typeOptions.map(([v,t])=>`<button class="${q.type===v?'on':''}" onclick="updatePlanEditor('type','${v}')">${t}</button>`).join('')}</div></fieldset>
    ${q.type!=='rest'?`<label class="plan-course-label">课程内容<select onchange="updatePlanEditor('lessonN',+this.value)">${dSeries().map(L=>`<option value="${L.n}" ${L.n===q.lessonN?'selected':''}>${esc(lname(L))} · ${esc(L.k)}</option>`).join('')}</select></label><fieldset><legend>预计学习时长</legend><div class="seg">${[15,25,40].map(n=>`<button class="${q.minutes===n?'on':''}" onclick="updatePlanEditor('minutes',${n})">${n}分钟</button>`).join('')}</div></fieldset>`:'<p class="plan-rest-note">休息日会替换同一天的自动任务，不清除课程或复习记录。</p>'}
    <div class="plan-summary"><strong>${affected?`将安排 ${affected} 天`:'请选择有效的日期范围'}</strong><span>${q.mode==='weekly'?'仅选中的星期会添加任务':q.mode==='range'?'开始与结束日期都会包含':'只安排选中的这一天'}</span></div>
    ${conflicts.length?`<fieldset><legend>已有计划的日期（${conflicts.length}天）</legend><div class="seg"><button class="${q.conflict==='skip'?'on':''}" onclick="updatePlanEditor('conflict','skip')">跳过，保留原计划</button><button class="${q.conflict==='replace'?'on':''}" onclick="updatePlanEditor('conflict','replace')">替换为新计划</button></div></fieldset>`:''}
    <div class="plan-editor-actions"><button class="btn soft" onclick="closePlanEditor()">取消</button><button class="btn go" ${affected?'':'disabled'} onclick="saveCustomPlan()"><span>保存到日历</span><span class="knob">${ic('check',17)}</span></button></div>
  </section></div>`;
}
function closePlanEditor(){S.planEditor=null;render(true);}
function saveCustomPlan(){
  const q=S.planEditor;if(!q)return;const dates=planDates(q);if(!dates.length)return toast('请选择有效的日期与重复日');
  const targets=dates.filter(s=>q.conflict==='replace'||!dTaskAt(s));
  if(!targets.length)return toast('这些日期已有计划，没有需要添加的任务');
  const before=Object.keys(D.custom).length;
  for(const s of targets) D.custom[s]={type:q.type,lessonN:q.lessonN,minutes:q.minutes,title:q.type==='rest'?'休息日':q.type==='new'?lessonOf(q.lessonN)?.cando:q.type==='speak'?lessonOf(q.lessonN)?.task?.brief:q.type==='review'?'复习已经学过的表达':'听一段熟悉的对话'};
  S.calendarMonth=targets[0].slice(0,7);S.selectedDate=targets[0];S.planEditor=null;dSave();toast(`已安排 ${targets.length} 天学习计划`);render(true);
}
function changePeriod(n){if(n===D.period)return;D.period=n;dSave();render(true);}
function onboard(){
  const opts=[['zero','完全没学过','从韩文字母开始'],['hangul','会拼读，但几乎不会说','从1A第1课开始'],['some','学过一些','自己选从哪一课开始']];
  const pick=S.pick==='some'?`<div class="card"><p class="eyebrow">选择起点</p><div class="seg">${SERIES[0].books.filter(b=>lessonsIn(b[0]).length).map(b=>`<button class="${S.book===b[0]?'on':''}" onclick="S.book='${b[0]}';render()">${b[0]}</button>`).join('')}</div><select class="daily-select" onchange="S.ln=+this.value;render()">${lessonsIn(S.book).map(L=>`<option value="${L.n}" ${S.ln===L.n?'selected':''}>${L.book} 第${L.num}课 · ${esc(L.k)}</option>`).join('')}</select></div>`:'';
  return `<main class="daily-onboard"><p class="eyebrow">学韩语 · 每天一点，真的能开口</p><h1>你的韩语，<br>从今天的<span>一句话</span>开始。</h1><p class="sub">选一个目标与节奏，教材会帮你安排每天的新表达、开口和复习。</p><div class="daily-onboard-grid"><section><h3 class="hl">你希望优先用在哪些场景？</h3><div class="daily-choice-row">${['日常会话','旅行沟通','追剧听力'].map(g=>`<button class="${D.goal===g?'on':''}" onclick="D.goal='${g}';render()">${g}</button>`).join('')}</div><h3 class="hl">你现在会什么？</h3>${opts.map(o=>`<button class="daily-choice ${S.pick===o[0]?'on':''}" onclick="S.pick='${o[0]}';render()"><strong>${o[1]}</strong><span>${o[2]}</span>${S.pick===o[0]?ic('check',17):''}</button>`).join('')}${pick}</section><section><h3 class="hl">每天可以投入</h3><div class="daily-choice-row">${[15,25,40].map(m=>`<button class="${P.minutes===m?'on':''}" onclick="P.minutes=${m};render()">${m}分钟</button>`).join('')}</div><h3 class="hl">希望坚持多久？</h3><div class="daily-choice-row">${[30,90,180,365].map(n=>`<button class="${D.period===n?'on':''}" onclick="D.period=${n};render()">${n}天</button>`).join('')}</div><p class="fn">周期调整新课密度、复现次数与场景广度，不代表语言等级承诺。</p><button class="btn go" ${S.pick?'':'disabled'} onclick="finishOnboard()"><span>生成我的学习计划</span><span class="knob">${ic('chevR',18)}</span></button></section></div></main>`;
}
function finishOnboard(){P.start=S.pick;P.cur=S.pick==='zero'?0:S.pick==='hangul'?1:S.ln;if(P.cur>=1)for(const u of HANGUL.units)P.hg[u.id]=true;D.startDate=today();D.startN=(lessonOf(P.cur)||D_TRACK[0]).n;D.done={};D.recovery={};dSave();save();go('home');}
function home(){return P.cur===0?legacyHome():dHome();}
function settings(){return `<header class="top daily-header"><button class="icon-btn mobile-only" aria-label="返回" onclick="go('home')">${ic('chevL',22)}</button><div class="grow"><p class="eyebrow">按你的情况安排</p><h1 class="lt">学习偏好</h1></div></header><main class="daily-settings"><div class="card"><h3 class="hl">优先场景</h3><div class="seg">${['日常会话','旅行沟通','追剧听力'].map(g=>`<button class="${D.goal===g?'on':''}" onclick="D.goal='${g}';dSave();render()">${g}</button>`).join('')}</div></div><div class="card"><h3 class="hl">每天学习时长</h3><p class="fn">同时影响每日新复习卡数量。</p><div class="seg">${[15,25,40].map(m=>`<button class="${P.minutes===m?'on':''}" onclick="P.minutes=${m};save();render()">${m}分钟</button>`).join('')}</div></div><div class="card"><h3 class="hl">计划周期</h3><div class="seg">${[30,90,180,365].map(n=>`<button class="${D.period===n?'on':''}" onclick="changePeriod(${n})">${n}天</button>`).join('')}</div><p class="fn">改变周期只重排未来任务，不清除完成记录。</p></div><div class="card"><h3 class="hl">朗读速度</h3><div class="seg">${[[.8,'慢一点'],[1,'正常'],[1.15,'快一点']].map(r=>`<button class="${P.rate===r[0]?'on':''}" onclick="P.rate=${r[0]};save();render();speak('안녕하세요? 만나서 반가워요.')">${r[1]}</button>`).join('')}</div></div><div class="card"><h3 class="hl">AI 伙伴</h3>${statusLine()}</div><div class="card"><h3 class="hl">最近卡住的地方</h3><p class="fn">练习和对话里的纠正记在这里，AI 下次会给你机会再用到；不准的可以删掉。</p>${D.difficulties.length?`<div class="daily-difficulties">${D.difficulties.map((x,i)=>`<div class="${x.resolved?'resolved':''}"><p><strong>${esc(x.better)}</strong>${x.why?`<span>${esc(x.why)}</span>`:''}</p><small>${esc(x.at.slice(5).replace('-','/'))}${x.resolved?' · 已能独立说出':''}</small><button class="icon-btn" aria-label="删掉这条" onclick="dForget(${i})">×</button></div>`).join('')}</div>`:'<p class="fn" style="margin-top:8px">还没有记录。</p>'}</div><div class="card"><h3 class="hl">重新选择起点</h3><p class="fn">会从今天重新排学习计划；课程进度和复习卡保留。</p><button class="btn soft" onclick="S.pick=null;go('onboard')">重新选择</button></div><div class="card"><h3 class="hl">清空这台设备上的记录</h3><p class="fn">进度、复习卡、学习计划全部删除，不能恢复。</p><button class="btn soft" onclick="${S.reset?'resetAll()':'S.reset=true;render()'}">${S.reset?'确认清空':'清空记录'}</button></div><p class="note">学韩语 · 每日学习 v0.5.6 · 本地保存</p></main>`;}
function plan(){return dailyPlan();}
function review(){return legacyReview();}
function grade(id,r){dailyLegacyGrade(id,r);const t=S.dailyTask;if(t?.type==='review'&&!dueCards().length){dMarkDone(t);S.dailyTask=null;toast('今日复习完成');go('home');}}
function resetAll(){try{localStorage.removeItem(STORE);localStorage.removeItem(D_STORE);}catch{}P=load();D={...D_DEF,startDate:today(),done:{},attempts:[],recovery:{},custom:{},completedCustom:{},difficulties:[],skip:{}};S.reset=false;S.pick=null;go('onboard');}
render(true);
checkAI();
