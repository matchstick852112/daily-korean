// 个人版专用：把 DeepSeek 凭据写进原生资源目录（不在 www 里，网页代码读不到），不打印凭据
import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';

function apiKey(env = process.env) { // 与 tools/serve.mjs、探索队同一来源
  const file = env.EXPLORERS_DEEPSEEK_ENV_FILE || '/Users/mac/uad-rag/.env';
  const saved = fs.existsSync(file) ? parseEnv(fs.readFileSync(file, 'utf8')) : {};
  const valid = v => typeof v === 'string' && v.length > 20 && /^[\x21-\x7e]+$/.test(v);
  return [env.EXPLORERS_DEEPSEEK_API_KEY, saved.LLM_BINDING_API_KEY, saved.VLM_API_KEY].find(valid);
}
const key = apiKey();
if (!key) throw Error('没有找到 DeepSeek 连接凭据。');
const dest = path.resolve(import.meta.dirname, '..', '.local/personal-build/assets');
fs.mkdirSync(dest, {recursive: true});
fs.writeFileSync(path.join(dest, 'korean-private.json'), JSON.stringify({key, model: 'deepseek-flash', display_name: 'DeepSeek V4.1 Flash · 1017'}), {mode: 0o600});
console.log('个人版凭据资源已准备；没有输出凭据内容。');
