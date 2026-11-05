// 在给定的文件或目录里找 DeepSeek 凭据原文（含 .asar 包），只输出命中数量，不输出凭据
import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';

const envFile = process.env.EXPLORERS_DEEPSEEK_ENV_FILE || '/Users/mac/uad-rag/.env';
const saved = fs.existsSync(envFile) ? parseEnv(fs.readFileSync(envFile, 'utf8')) : {};
const valid = v => typeof v === 'string' && v.length > 20 && /^[\x21-\x7e]+$/.test(v);
const keys = [process.env.EXPLORERS_DEEPSEEK_API_KEY, saved.LLM_BINDING_API_KEY, saved.VLM_API_KEY].filter(valid).map(k => Buffer.from(k));
if (!keys.length) { console.error('本机没有找到凭据，无法比对。'); process.exit(2); }

let files = 0, hits = 0;
function walk(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) { for (const f of fs.readdirSync(p)) walk(path.join(p, f)); return; }
  files++;
  const buf = fs.readFileSync(p);
  if (keys.some(k => buf.includes(k))) { hits++; console.log('命中：' + p); }
}
for (const p of process.argv.slice(2)) walk(p);
console.log(`凭据扫描：${files} 个文件，命中 ${hits} 个`);
process.exit(hits ? 1 : 0);
