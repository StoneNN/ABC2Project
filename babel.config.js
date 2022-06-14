/*
 * @Author: Nn
 * @Date: 2022-06-13 11:04:54
 * @LastEditors: Nn
 * @LastEditTime: 2022-06-14 15:57:26
 * @Description: 
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
       "import",
        { 
          libraryName: "ant-design-vue", 
          libraryDirectory: "es", 
          style: "less" 
        }
    ]
  ]
}

