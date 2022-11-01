import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
// 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
import path from 'path'

// 全局 scss 文件的路径
// 用 normalizePath 解决 window 下的路径问题
const variablePath = normalizePath(path.resolve('./src/style/common.scss'))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
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
    }
  }
})
