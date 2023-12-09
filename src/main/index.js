import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ipcMain ,dialog} from 'electron'
import log from 'electron-log/main'

// import {mpvCreate, mpvPromise}  from "./mpv/libmpv"
const {Player} = require('./mpv/player')
// import {Player} from "./mpv/player"

// const path = require("path")

const EventEmitter = require('events')

const PlayEvent = new EventEmitter()



const MediaExtensions = ['mp4', 'webm', 'ogg', 'mkv', 'avi', 'mov', 'asf', 'wmv', 'navi', '3gp', 'flv', 'f4v', 'rmvb', 'hddvd', 'rm', 'rmvb', 'mp3', 'h264']

let playWindow = null


PlayEvent.on("play", (uri) => {

  Player.playing(uri)

//   if (!gMpvLib){
//     gMpvLib = mpvCreate()
// }
//   console.log("PlayEvent recv play")
//   // playWindow.send("play",uri)
//   const handle = playWindow.getNativeWindowHandle()
//   playWindow.transparent = true
//   const hw = handle.readBigInt64LE(0)
//   console.log('playWindow',hw)
//   mpvIns = mpvPromise(gMpvLib,0,uri)
console.log("playing is running")

})

//init code
log.initialize({ preload: true })
log.info('Log from the main process')


function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 720,
    height: 480,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      webviewTag: true,
      webSecurity: false,
      nativeWindowOpen: true,
      contextIsolation: false
    }
  })

  mainWindow.loadFile(join(__dirname, '../renderer/index.html'))


      //   playWindow = new BrowserWindow({
      //   width: 360,
      //   height: 240,
      //   show: false,
      //   autoHideMenuBar: true,
      //   webPreferences: {
      //     preload: join(__dirname, '../preload/index.js'),
      //     sandbox: false,
      //     nodeIntegration: true,
      //     webviewTag: true,
      //     webSecurity: false,
      //     nativeWindowOpen: true,
      //     contextIsolation: false
      //   }
      // })
      // let ret = playWindow.loadFile(join(__dirname, './mpv/play.html'))
  
      

  // if (is.dev) {
    console.log('open devtools')
    mainWindow.webContents.openDevTools();
  // }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    //  playWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.on('read_user', (event) => {
    // createFakePeer()
  })

  let i = 0
  ipcMain.on('play', (event,uri) => {
    console.log("index on event ",i++, uri)
  })

  ipcMain.handle('dialog:open', async (_, args) => {
    const result = await dialog.showOpenDialog({ 
      defaultPath: '',
          properties: ['openFile'],
          filters: [{
            name: 'video',
            extensions: MediaExtensions
          }]
    })

    const fileUri = result.filePaths[0]

    PlayEvent.emit("play",fileUri)
    console.log("dialog:open return  ", fileUri)
    return result
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// async function createFakePeer() {
//   console.log('create fake data')

//   let peers = await peerModel()

//   const yong = await peers.create({
//     name: 'Yong',
//     p2paddrss: '12qw34as',
//     email: 'zhengyong@etsme.com'
//   })
//   await yong.save()
//   const test = await peers.create({
//     name: 'Test',
//     p2paddrss: '5678qw',
//     email: 'Test@etsme.com'
//   })
//   await test.save()
// }
