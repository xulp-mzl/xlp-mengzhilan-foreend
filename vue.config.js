const path = require('path')
const themePath = path.join(__dirname, './src/css/common.less')

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/mengzhilan',
        ws: true,
        // secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果是跨域访问，需要配置这个参数
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  css: {
    extract: true,
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        modifyVars: {
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${themePath}";`
        }
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
  }
}
