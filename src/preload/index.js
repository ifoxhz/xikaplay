import { contextBridge,ipcRenderer,dialog} from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.

const  renderShowOpenDialog = async () => {
   return new Promise(async (resolve,reject) => {
    ipcRenderer.invoke('dialog:open')
    .then( res => resolve(res))
    .catch( e => reject(e))
   })
}


if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
  window.ipcRenderer = ipcRenderer
  window.showOpenDialog = renderShowOpenDialog
}
