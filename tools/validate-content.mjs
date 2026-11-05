import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const contentDir = path.join(root, 'www/content');
const files = fs.readdirSync(contentDir)
  .filter(file => /^l\d+\.js$/.test(file))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
const context = vm.createContext({LESSONS: []});
const errors = [];
const loaded = [];

for (const file of files) {
  try {
    const before = context.LESSONS.length;
    vm.runInContext(fs.readFileSync(path.join(contentDir, file), 'utf8'), context, {filename: file});
    if (context.LESSONS.length !== before + 1) errors.push(`${file}: expected one lesson`);
    else loaded.push({file, lesson: context.LESSONS.at(-1)});
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

const required = ['n', 'book', 'k', 'zh', 'pages', 'cando', 'dialogues', 'words', 'tip',
  'grammar', 'pron', 'swap', 'task', 'culture', 'cando_items', 'learned'];
const ids = new Set();
const assert = (condition, message) => { if (!condition) errors.push(message); };
const nonempty = value => typeof value === 'string' ? value.trim().length > 0 : Number.isFinite(value);
const checkQuestion = (q, label) => {
  assert(q && Array.isArray(q.opts) && q.opts.length >= 2 && q.opts.includes(q.ans), `${label}: invalid answer/options`);
  assert(q && (nonempty(q.pre) || nonempty(q.post) || nonempty(q.ask)) && nonempty(q.why), `${label}: missing question or explanation`);
};

for (const {file, lesson: L} of loaded) {
  L.book ??= L.n <= 8 ? '1A' : L.n <= 16 ? '1B' : L.n <= 25 ? '2A' : L.n <= 34 ? '2B'
    : L.n <= 43 ? '3A' : L.n <= 52 ? '3B' : L.n <= 61 ? '4A' : L.n <= 70 ? '4B'
    : L.n <= 85 ? '5A' : L.n <= 102 ? '5B' : L.n <= 116 ? '6A' : '6B';
  const label = `${file} (${L.book}/${L.num ?? L.n})`;
  assert(!ids.has(L.n), `${label}: duplicate n`);
  ids.add(L.n);
  for (const key of required) assert(L[key] !== undefined && L[key] !== null, `${label}: missing ${key}`);
  assert(Array.isArray(L.pages) && L.pages.length === 2 && L.pages.every(Number.isFinite), `${label}: invalid pages`);
  assert(Array.isArray(L.dialogues) && L.dialogues.length, `${label}: no dialogues`);
  for (const [i, d] of (L.dialogues || []).entries()) {
    assert(Array.isArray(d.lines) && d.lines.length, `${label}/dialogue ${i + 1}: no lines`);
    for (const [j, line] of (d.lines || []).entries()) {
      assert(nonempty(line.k) && nonempty(line.z), `${label}/dialogue ${i + 1}/line ${j + 1}: missing Korean/Chinese`);
    }
    assert(Number.isInteger(d.q?.ans) && d.q?.opts?.[d.q.ans] !== undefined, `${label}/dialogue ${i + 1}: invalid listening answer`);
    if (d.audio) assert(fs.existsSync(path.join(root, 'www/audio', `${d.audio}.mp3`)), `${label}/dialogue ${i + 1}: missing audio ${d.audio}`);
  }
  assert(Array.isArray(L.words) && L.words.length >= 10, `${label}: too few words`);
  for (const w of L.words || []) assert(nonempty(w.k) && nonempty(w.z), `${label}: incomplete word`);
  assert(new Set((L.words || []).map(w => w.k)).size === L.words.length, `${label}: duplicate word`);
  assert(Array.isArray(L.grammar) && L.grammar.length, `${label}: no grammar`);
  for (const [i, g] of (L.grammar || []).entries()) {
    assert(nonempty(g.t) && nonempty(g.zh) && Array.isArray(g.rule) && g.rule.length, `${label}/grammar ${i + 1}: incomplete`);
    assert(Array.isArray(g.quiz) && g.quiz.length >= 3, `${label}/grammar ${i + 1}: fewer than 3 quizzes`);
    for (const [j, q] of (g.quiz || []).entries()) checkQuestion(q, `${label}/grammar ${i + 1}/quiz ${j + 1}`);
  }
  assert(Array.isArray(L.pron?.lines) && L.pron.lines.length >= 4, `${label}: incomplete pronunciation`);
  assert(Array.isArray(L.swap?.items) && L.swap.items.length >= 3, `${label}: incomplete substitution`);
  for (const item of L.swap?.items || []) assert(nonempty(item.a) && nonempty(item.zh), `${label}: incomplete substitution item`);
  assert(nonempty(L.task?.role) && nonempty(L.task?.brief) && nonempty(L.task?.ai), `${label}: incomplete AI task`);
  assert(nonempty(L.culture?.t) && nonempty(L.culture?.z), `${label}: incomplete culture`);
  if (L.drill) {
    assert(Array.isArray(L.drill.items) && L.drill.items.length, `${label}: empty workbook`);
    for (const [i, q] of L.drill.items.entries()) checkQuestion(q, `${label}/drill ${i + 1}`);
  }
  assert(Array.isArray(L.cando_items) && L.cando_items.length >= 3, `${label}: incomplete self assessment`);
}

const html = fs.readFileSync(path.join(root, 'www/index.html'), 'utf8');
const registered = [...html.matchAll(/<script src="content\/(l\d+\.js)"><\/script>/g)].map(m => m[1]);
for (const file of files) assert(registered.includes(file), `${file}: not registered in index.html`);
for (const file of registered) assert(files.includes(file), `${file}: registered but missing`);
assert(new Set(registered).size === registered.length, 'index.html: duplicate content registration');

const books = Map.groupBy(loaded.map(x => x.lesson), L => L.book);
for (const [book, lessons] of books) {
  console.log(`${book}: ${lessons.length} lessons, ${lessons.reduce((n, L) => n + L.words.length, 0)} words`);
}
console.log(`Total: ${loaded.length} lessons, ${files.length} files, ${registered.length} registered`);
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('Content structure, answers, registration and referenced audio: PASS');
}
