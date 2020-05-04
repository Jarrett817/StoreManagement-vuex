import axios from 'axios'
import {
    Loading,
    Message
} from 'element-ui';
const loading = {
    inLoading: null,
    open: function () {
        if (this.inLoading === null) {
            this.inLoading = Loading.service({
                target: '.main',
                text: '拼命加载中...',
                background: 'rgba(0,0,0,0.5)'
            });
        }


    },
    close: function () {
        if (this.inLoading) {
            this.inLoading.close()
        }
        this.inLoading = null
    }
}

//自定义一个axios实例
const request = axios.create({
    // baseURL: '/dev-api',
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,
})
// axios.get('/db.json').then(response => {
//     console.log(response.data)
// })

// request.get('/db.json').then(response => {
//     return response.data
// })

request.interceptors.request.use(config => {
    //请求拦截
    loading.open();
    return config
}, err => {
    loading.close()
    return Promise.reject(error);
})

request.interceptors.response.use(response => {
    const resp = response.data
    if (resp.code !== 2000) {
        Message({
            message: resp.message || '系统异常',
            type: 'warning',
            duration: 5 * 1000
        })
    }
    loading.close()
    return response
}, error => {
    loading.close()
    Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
})

export default request