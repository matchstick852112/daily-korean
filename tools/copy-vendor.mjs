// 把字体和 FSRS 从 node_modules 复制进 www，App 离线也能用，不依赖 CDN
import {cpSync, mkdirSync, readdirSync, rmSync} from 'node:fs';
const nm = new URL('../node_modules/', import.meta.url), www = new URL('../www/', import.meta.url);
const out = p=>new URL(p, www);
rmSync(out('fonts'), {recursive:true, force:true});
mkdirSync(out('fonts/misans'), {recursive:true});
mkdirSync(out('vendor'), {recursive:true});

const pv = new URL('pretendard/dist/web/variable/', nm);
cpSync(new URL('pretendardvariable-dynamic-subset.css', pv), out('fonts/pretendard/pretendardvariable-dynamic-subset.css'));
cpSync(new URL('woff2-dynamic-subset/', pv), out('fonts/pretendard/woff2-dynamic-subset/'), {recursive:true});

const ms = new URL('misans/lib/Normal/', nm);
for(const w of ['Regular','Semibold','Bold','Heavy'])
  for(const f of readdirSync(ms)) if(f.startsWith(`MiSans-${w}.`)) cpSync(new URL(f, ms), out('fonts/misans/'+f));

// Mac 桌面端标题字：得意黑（OFL，随附授权说明）
for(const f of ['SmileySans-Oblique.woff2','SmileySans-LICENSE.txt']) cpSync(new URL('fonts/'+f, import.meta.url), out('fonts/smiley/'+f));

cpSync(new URL('ts-fsrs/dist/index.umd.js', nm), out('vendor/ts-fsrs.umd.js'));
cpSync(new URL('@capacitor/core/dist/capacitor.js', nm), out('vendor/capacitor.js'));
console.log('fonts + vendor copied');
