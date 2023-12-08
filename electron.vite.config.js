import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import vitePluginRequire from "vite-plugin-require";
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy'
// import { visualizer } from "rollup-plugin-visualizer"


function myPlug(){
  console.log("vite____________",__dirname)
}

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: '[name].js',
          manualChunks: (id) => {
            if(id.includes('player')) return 'mpv/player'
          }
        }
      }
    },
    plugins: [commonjs(),vitePluginRequire(),externalizeDepsPlugin(),nodePolyfills()],
    resolve: {
      // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
      browserField: false,
      conditions: ['node'],
      mainFields: ['module', 'jsnext:main', 'jsnext'],
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin(),vitePluginRequire(),nodePolyfills()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(),nodePolyfills()]
  }
})
