// const fs = require('fs').promises
// import path from 'path'
// const os = require('os')
import ffi from 'ffi-napi'
// const ref = require('ref-napi')
// const ArrayType = require('ref-array-napi');
// const StructType = require('ref-struct-napi');


  export function mpvCreate() {

	const libraryPath = "./lib/libmpv-2.dll"
	console.log('path:', libraryPath)
	// 定义相关的 Windows API 函数签名
	// const mpv = ffi.Library(libraryPath, {
	// 	mpv_create: ['pointer', []],
	// 	mpv_set_option_string:['int',['pointer','string','string']],
	// 	mpv_set_option:['int',['pointer','string','int','pointer']],
	// 	mpv_set_property_string:['int',['pointer','string','string']],
	// 	mpv_request_log_messages:['int',['pointer','string']],
	// 	mpv_initialize:['int',['pointer']],
	// 	mpv_command_async:['int',['pointer','int','pointer']]
	// })
	return __dirname
}

//  async function mpvPlay(mpvLib, hwnd,  file){
// 	console.log("mpvLib",typeof mpvLib, "xxx", mpvLib)

// 	const mpv = mpvLib.mpv_create()
// 	console.log("mpv instance:",mpv)
// 	let  ret = mpvLib.mpv_set_option_string(mpv, "input-vo-keyboard", "yes")
// 	console.log("mpv option string: ",ret)

// 	const intPtr = ref.alloc(ref.types.int);

// 	// Set the integer value through the pointer
// 	intPtr.writeInt64LE(1); // Write the integer value 42
	
// 	ret = mpvLib.mpv_set_option(mpv, "osc", 3, intPtr)
// 	console.log("mpv mpv_set_option: osc",ret)

	
// 	// const widhw = ref.alloc(ref.types.int);
// 	// widhw.writeInt64LE(hwnd)
// 	// mpv_set_option(mpv, "wid", MPV_FORMAT_INT64,widhw)


// 	ret = mpvLib.mpv_request_log_messages(mpv, "debug")
// 	console.log("mpv mpv_request_log_messages: ",ret)


// 	ret = mpvLib.mpv_initialize(mpv)
// 	console.log("mpv mpv_initialize: ",ret)



// 	  // Select a subtitle by ID or file path
// 	  const subtitleID = "3"; // Replace with the desired subtitle ID or file path
// 	  ret = mpvLib.mpv_set_property_string(mpv, "sid", subtitleID);
// 	  console.log("mpv mpv_set_property_string: ", ret)


// 	// const cmds = ['loadfile', 'D:\\testmv.MP4',null]

// 	const cmds = ['loadfile', 'D:\\topgun2.mkv',null]
// 	// Create an array type for storing char*
// 	const CStringArray = ArrayType(ref.types.CString,cmds.length);

// 	// Create a buffer to hold the array of char*
// 	const ptrArray = new CStringArray(cmds)


// 	ret = mpvLib.mpv_command_async(mpv, 0, ptrArray.buffer)
// 	console.log("mpv_command_async",ret)
// 	return mpv 

// }

export default mpvCreate
module.exports ={
	mpvCreate
}

