const webpack = require('webpack')
module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
    pages: {
      index: {
        //入口
        entry: 'src/main.js',
      },
    },
    lintOnSave: false,
    runtimeCompiler: true,
    publicPath: '/',
    devServer: {
        // 设置开发接口代理
        proxy: {

            '/api': {
                // target 是后端给你的服务，可以通过ip配置，也可以通过域名配置
                // 当请求接口的时候遇到 "/api" 会自动转为target里的服务，解决跨域
                // 配置域名
                target: 'http://localhost:8000',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                },
            },
        }
    }
  };

