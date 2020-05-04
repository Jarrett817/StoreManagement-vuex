module.exports = {
    devServer: {
        port: 8888,
        host: "localhost",
        https: false,
        open: true,
        proxy: {
            // '/dev-api': {

            [process.env.VUE_APP_BASE_API]: { //匹配process.env.VUE_APP_BASE_API开头的请求
                //目标服务器地址
                target: process.env.VUE_APP_SERVICE_URL,
                changOrigin: true,
                pathRewrite: {
                    // '^/dev-api': '', //将请求地址前缀替换为空
                    ['^' + process.env.VUE_APP_BASE_API]: ''

                }

            }
        }
    },
    lintOnSave: false, //关闭格式检查
    productionSourceMap: false, //打包时不生成.map文件，加快打包速度
}