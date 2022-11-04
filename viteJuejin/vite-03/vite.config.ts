import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
// 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
import path from 'path'

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/style/common.scss'))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    // postcss 与 postcss.config.js 文件二选一
    // postcss: {
    //   plugins: [
    //     autoprefixer({
    //       // 指定目标浏览器
    //       overrideBrowserslist: ['Chrome > 30', 'ff > 31', 'ie 11']
    //     })
    //   ]
    // },
    preprocessorOptions: {
      scss: {
        // 具体配置查看：TODO：但是我没有看到对应的配置
        // https://sass-lang.com/documentation/js-api/modules#render
        // additionalData 的内容会在每个 scss 文件的开头自动注入
        additionalData: `@import "${variablePath}";`
      }
    },
    modules: {
      // see: https://cn.vitejs.dev/config/shared-options.html#css-modules
      // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
      // 其中，name 表示当前文件名，local 表示类名
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
})
