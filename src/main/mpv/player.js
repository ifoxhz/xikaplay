const { Worker, isMainThread, parentPort, workerData} = require('worker_threads')
const { EventEmitter } = require('events')
const path = require('path')
const {mpvCreateLib, mpvPromise,mpvLoopEvent} = require("./libmpv")
const log = require('electron-log/main')



console.log = log.log


let gMpvLib = null
let gMpvIns = null
let workerId  = null

if (isMainThread){
    log.info("application run at ",app.getAppPath())
    // appPath = app.getAppPath()
}

const Player = {
    Structor:()=> {
        console.log("Structor")
    },
    eventLoopFlag:true,
    playing: async(uri) => {

        console.log(uri)
        const mpvthread = ( ) => {
            let appPath 
            if (isMainThread){
                const { app } = require('electron')
                appPath = app.getAppPath()
            }
            const scPath = path.join(__dirname,'player.js')

            console.log("create thread",scPath)
            workerId = new Worker(scPath,{
                workerData: {fileUri:uri, LibPath:appPath}
              })
            console.log("succeed to create thread")
            return workerId     
        }
        const mpvWorker =  mpvthread()
        mpvWorker.on('message', (msg) =>console.log(msg))
        mpvWorker.on('error', (err) =>console.log("worker on ",err))
        mpvWorker.on('exit', (code) => {
            if (code !== 0)
            console.log(`Worker stopped with exit code ${code}`)
        })
        return mpvWorker       
       
    },
    playEvent: () => {
        console.log("loopMpvEvent")
        mpvLoopEvent(Player.eventLoopFlag)
    },
    createPlayer: ( ) => {
        if (isMainThread){
            console.log("main thread out")
        }else{
            console.log("createPlayer",__dirname,__filename)
            console.log("Start play ", workerData)

            gMpvLib = mpvCreateLib(workerData.LibPath)
            gMpvIns = mpvPromise(gMpvLib,0,workerData.fileUri)
            Player.playEvent()
    
        }
    }
}



Player.createPlayer()
// EventLoop()

// async function mpvPlaying(uri){
//     console.log("mpvPlaying",uri)
// }
// export { Player }

module.exports = {Player}