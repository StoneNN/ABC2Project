/*
 * @Author: Nn
 * @Date: 2022-06-13 11:04:54
 * @LastEditors: Nn
 * @LastEditTime: 2022-06-14 15:10:27
 * @Description: 
 */

'use strict'

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true, //加入内容
  lintOnSave: false,  // 默认为true，警告仅仅会被输出到命令行，且不会使得编译失败。
  devServer: {
    port: 8000,  // 端口，如果端口被占用自动提升1
    open: false,  // 启动服务后自动打开浏览器
    https: false, // https协议
    host: 'localhost', // 主机名，也可以是127.0.0.1，或者真机测试的时候0.0.0.0
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: ' http://1.15.178.125:8069',
        // target: 'http://124.71.163.195:8069',
        // target: 'http://192.168.56.110:8069',
        // target: 'http://192.168.56.108:8069',
        // target: 'http://192.168.56.108/odoo',
        // target: 'http://app.snowacres.net/odoo',

        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  publicPath: "./",// 基本路径
})

// const path = require('path')

// function resolve(dir) {
//   return path.join(__dirname, dir)
// }

// const name = 'odoojs Vue' // page title

// // If your port is set to 80,
// // use administrator privileges to execute the command line.
// // For example, Mac: sudo npm run
// // You can change the port by the following method:
// // port = 9527 npm run dev OR npm run dev --port = 9527
// const port = process.env.port || process.env.npm_config_port || 8080 // dev port

// module.exports = {
//   /**
//    * You will need to set publicPath if you plan to deploy your site under a sub path,
//    * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
//    * then publicPath should be set to "/bar/".
//    * In most cases please use '/' !!!
//    * Detail: https://cli.vuejs.org/config/#publicpath
//    */
//   transpileDependencies: true,

//   publicPath: './',

//   outputDir: 'dist',
//   assetsDir: 'static',
//   lintOnSave: process.env.NODE_ENV === 'development',

//   productionSourceMap: false,
//   devServer: {
//     port: port,
//     open: true,
//     overlay: {
//       warnings: false,
//       errors: true
//     },
//     proxy: {
//       // detail: https://cli.vuejs.org/config/#devserver-proxy
//       [process.env.VUE_APP_BASE_API]: {
//         target: 'http://1.15.178.125:8069',
//         // target: 'http://124.71.163.195:8069',
//         // target: 'http://192.168.56.111:8069',
//         // target: 'http://192.168.56.108:8069',
//         // target: 'http://192.168.56.108/odoo',
//         // target: 'http://app.snowacres.net/odoo',

//         changeOrigin: true,
//         pathRewrite: {
//           ['^' + process.env.VUE_APP_BASE_API]: ''
//         }
//       }
//     }
//     // https: true
//   },
//   configureWebpack: {
//     // provide the app's title in webpack's name field, so that
//     // it can be accessed in index.html to inject the correct title.
//     name: name,
//     resolve: {
//       alias: {
//         // 这句不知道什么时候加上去的.
//         vue$: 'vue/dist/vue.esm.js', //加上这一句
//         '@': resolve('src')
//       }
//     }
//   }
// }
