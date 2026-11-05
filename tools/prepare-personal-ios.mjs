// 个人版 iOS 专用：把 DeepSeek 凭据写进 ios/App/App/PersonalResources（不在 www 里，网页代码读不到），不打印凭据
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {parseEnv} from 'node:util';

const dest = path.resolve(import.meta.dirname, '..', 'ios/App/App/PersonalResources');
const file = path.join(dest, 'korean-private.json');
if (process.argv.includes('--clean')) {
  fs.rmSync(file, {force: true});
  console.log('已移除 Mac 上的 iOS 个人版凭据资源；iPhone 里已装的 App 和学习进度不受影响。');
  process.exit(0);
}
let version = '';
try { version = execFileSync('xcodebuild', ['-version'], {encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']}); } catch {}
if (Number(version.match(/Xcode\s+(\d+)/)?.[1] || 0) < 26) {
  console.error('需要先安装 Xcode 26 或更高版本，并由你本人完成首次设置。没有写入任何凭据。');
  process.exit(2);
}

function apiKey(env = process.env) { // 与 tools/prepare-personal-android.mjs 同一来源
  const envFile = env.EXPLORERS_DEEPSEEK_ENV_FILE || '/Users/mac/uad-rag/.env';
  const saved = fs.existsSync(envFile) ? parseEnv(fs.readFileSync(envFile, 'utf8')) : {};
  const valid = v => typeof v === 'string' && v.length > 20 && /^[\x21-\x7e]+$/.test(v);
  return [env.EXPLORERS_DEEPSEEK_API_KEY, saved.LLM_BINDING_API_KEY, saved.VLM_API_KEY].find(valid);
}
const key = apiKey();
if (!key) throw Error('没有找到 DeepSeek 连接凭据。');
fs.mkdirSync(dest, {recursive: true});
fs.writeFileSync(file, JSON.stringify({key, model: 'deepseek-flash', display_name: 'DeepSeek V4.1 Flash · 1017'}), {mode: 0o600});
fs.chmodSync(file, 0o600);
console.log('iOS 个人版凭据资源已准备；没有输出凭据内容。装好后运行 node tools/prepare-personal-ios.mjs --clean 清理。');
