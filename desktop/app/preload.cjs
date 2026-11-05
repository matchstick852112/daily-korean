// 告诉网页「这是 Mac 分享版」，并转接 AI 请求和朗读；凭据留在主进程，这里和网页都拿不到
const {contextBridge, ipcRenderer} = require('electron');
const call = async (ch, arg) => { const r = await ipcRenderer.invoke(ch, arg); if (r?.error) throw Error(r.error); return r?.data ?? r; };
contextBridge.exposeInMainWorld('KO_DESK', {edition: 'share', speech: {
  speak: arg => call('speech:speak', arg),
  edge: arg => call('speech:edge', arg),
  edgeStop: arg => call('speech:edge-stop', arg),
  stop: () => call('speech:stop')
}, tutor: {
  status: () => call('tutor:status'),
  request: arg => call('tutor:request', arg),
  cancel: arg => call('tutor:cancel', arg)
}});
