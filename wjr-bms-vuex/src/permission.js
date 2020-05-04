/**
 * 权限校验（拦截器）
 * 判断是否登录，防止直接跳转
 */
import router from '@/router'
import {
    getUserInfo
} from '@/api/login'
import store from './store'
router.beforeEach((to, from, next) => {
    //获取token，
    // const token = localStorage.getItem('wjr-bms-token')
    const token = store.state.user.token

    if (!token) {
        if (to.path !== '/login') {
            next({
                path: '/login'
            })
        } else {
            next()
        }
    } else {
        if (to.path === '/login') {
            next();
        } else {
            const userInfo = store.state.user.user

            if (userInfo) {
                next()
            } else {
                // getUserInfo(token).then(response=>{
                //     const resp=response.data
                //     if(resp.flag){
                //         localStorage.setItem('wjr-bms-user',JSON.stringify(resp.data))
                //         next()
                //     }else{
                //         next({
                //             path:'/login'
                //         })
                //     }
                // });
                store.dispatch('GetUserInfo').then(response => {
                    if (response.flag) {
                        next()
                    } else {
                        next({
                            path: '/login'
                        })
                    }
                }).catch(error => {

                })
            }
        }
    }
})