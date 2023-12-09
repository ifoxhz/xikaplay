
/* eslint-disable new-cap */
const fs = require('fs').promises
const path = require('path')
const os = require('os')
const ffi = require('ffi-napi')
const ref = require('ref-napi')
const ArrayType = require('ref-array-napi');
const StructType = require('ref-struct-napi');
const { Worker, isMainThread, parentPort, workerData} = require('worker_threads');


const mpvEventType = StructType({
  eventId: ref.types.int,
  error: ref.types.int,
  replyUserdata: ref.types.uint64,
  data: 'pointer'
});

let gEventLoopFlag = true

let gMpvLib = null
let gMpvIns = null


function mpvCreateLib (appPath) {
  console.log("mpvCreate",__filename,__dirname)
  const libraryPath = path.join(appPath, "extraResources/lib", 'libmpv-2.dll');
  console.log('path:', libraryPath)
  // 定义相关的 Windows API 函数签名
  const mpvLib = ffi.Library(libraryPath, {
    mpv_create: ['pointer', []],
    mpv_set_option_string: ['int', ['pointer', 'string', 'string']],
    mpv_set_option: ['int', ['pointer', 'string', 'int', 'pointer']],
    mpv_set_property_string: ['int', ['pointer', 'string', 'string']],
    mpv_request_log_messages: ['int', ['pointer', 'string']],
    mpv_error_string: ['string', ['int']],
    mpv_initialize: ['int', ['pointer']],
    mpv_wait_event: [ref.refType(mpvEventType), ['pointer', 'double']],
    mpv_command_async: ['int', ['pointer', 'int', 'pointer']],
    mpv_terminate_destroy: ['void', ['pointer']]
  })
  gMpvLib = mpvLib
  return mpvLib
}

async function mpvPromise (mpvLib, hwnd, file) {
  return new Promise((resolve) => {
    resolve(mpvPlay(mpvLib, hwnd, file, resolve))
  })
}

async function mpvPlay (mpvLib, hwnd, file) {
  
  let ret = 0
  let mpv = mpvLib.mpv_create()
  // console.log('mpv instance:', mpv)
  // let ret = mpvLib.mpv_set_option_string(mpv, 'input-vo-keyboard', 'yes')
  // console.log('mpv option string: ', ret)

  ret = mpvLib.mpv_set_option_string(mpv, 'msg-level', 'all=v');
  console.log('mpv option string: msg-level', ret)
	
  const intPtr = ref.alloc(ref.types.long);
  // Set the integer value through the pointer
  intPtr.writeInt64LE(1); // Write the integer value 
  ret = mpvLib.mpv_set_option(mpv, 'osc', 3, intPtr)
  console.log('mpv mpv_set_option: osc', ret)


  const lua_com = "D:\\workspace\\react\\xikaplay\\src\\main\\mpv\\lib\\script\\extended-menu.lua"
  ret = mpvLib.mpv_set_property_string(mpv, "scripts", lua_com);
  console.log('mpv option string: script', ret,lua_com)

  const lua_pla = "D:\\workspace\\react\\xikaplay\\src\\main\\mpv\\lib\\script\\command_palette.lua"
  ret = mpvLib.mpv_set_property_string(mpv, "scripts", lua_pla);
  console.log('mpv option string: script', ret,lua_pla)


  const widhw = ref.alloc(ref.types.long);
  const hwNum = Number(hwnd)
  console.log("hwNum",hwNum)
  widhw.writeInt64LE(hwNum)
  console.log("mpv windows hwnd:",widhw.deref())
  ret = mpvLib.mpv_set_option(mpv, 'wid', 4, widhw)
  console.log('mpv mpv_set_option: wid', ret)
  if (ret !== 0) {
    const err = mpvLib.mpv_error_string(ret)
  	console.log('mpv error is:', (err))
  }

  // ret = mpvLib.mpv_request_log_messages(mpv, 'debug')
  // console.log('mpv mpv_request_log_messages: ', ret)

  ret = mpvLib.mpv_initialize(mpv)
  console.log('mpv mpv_initialize: ', ret)

	  // Select a subtitle by ID or file path
	  const subtitleID = '3'; // Replace with the desired subtitle ID or file path
	  ret = mpvLib.mpv_set_property_string(mpv, 'sid', subtitleID);
	  console.log('mpv mpv_set_property_string: ', ret)

  // const cmds = ['loadfile', 'D:\\testmv.MP4',null]

  const cmds = ['loadfile', file, null]
  // Create an array type for storing char*
  const CStringArray = ArrayType(ref.types.CString, cmds.length);

  // Create a buffer to hold the array of char*
  const ptrArray = new CStringArray(cmds)

  ret = mpvLib.mpv_command_async(mpv, 0, ptrArray.buffer)
  console.log('mpv_command_async', ret)

  // // Define the event struct using 'ref' syntax
  // const mpvEvent = StructType({
  //   eventId: ref.types.int,
  //   error: ref.types.int,
  //   replyUserdata: ref.types.uint64,
  //   data: 'pointer'

  // });
  //     //while(retflag){
  //       const event =  mpvLib.mpv_wait_event(mpv, 10)
  //       //mpvEvent.emit("mpvevent",event)
  //       // console.log("thread event",event)

  //       const eins = event.deref();
  //       console.log("event:", eins.eventId)
  //       if (eins.eventId !== 2) {
  //         if(eins.eventId === 1){
  //             console.log('shutdown event', eins.eventId)
  //               mpvLib.mpv_terminate_destroy(mpv)
  //               console.log('shutdown event is received ', eins.eventId)
  //               // callback(0)
  //              //break
  //              return
  //         }
  //         if(eins.eventId === 11){
  //           console.log('shutdown event', eins.eventId)
  //             mpvLib.mpv_terminate_destroy(mpv)
  //             console.log('idle event is received ', eins.eventId)
  //             // callback(0)
  //           //break
  //           return 
  //         }
        
  //       }
  //       mpvEvent.emit("PlayerEvent", eins)
  //       //procall()
  //       // queueMicrotask(evePri)
  //       // parentPort.postMessage(event)
  //     //}
 
  // } 
  gMpvIns = mpv
  return mpv
}

async function mpvLoopEvent(LoopFlag){
  while(LoopFlag){
    const event =  gMpvLib.mpv_wait_event(gMpvIns, -1)
    //mpvEvent.emit("mpvevent",event)
    // console.log("thread event",event)

    const eins = event.deref();
    console.log("event:", eins.eventId)
    if (eins.eventId !== 2) {
      if(eins.eventId === 1){
          console.log('shutdown event', eins.eventId)
          gMpvLib.mpv_terminate_destroy(gMpvIns)
          console.log('shutdown event is received ', eins.eventId)
            // callback(0)
          break
          //return
      }
      if(eins.eventId === 11){
        console.log('shutdown event', eins.eventId)
        gMpvLib.mpv_terminate_destroy(gMpvIns)
          console.log('idle event is received ', eins.eventId)
          // callback(0)
        break
        //return 
      }
    
    }

  }
}

async function sleep () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 5 * 1000);
  })
}

async function test_cmd () {
  // await test()
  await sleep()
  console.log('test is over')
}
function main () {
  test_cmd()
}
// main()
// ES export
// export default {mpvCreate, mpvPlay,mpvPromise}
module.exports = {
  mpvCreateLib, 
  mpvPlay,
  mpvPromise,
  mpvLoopEvent
}