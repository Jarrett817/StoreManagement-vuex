import {
    getToken,
    setToken,
    getUser,
    setUser,
    removeToken
} from '@/utils/auth'
import {
    login,
    getUserInfo,
    logout
} from '@/api/login'
const user = {

    state: {
        token: getToken(), //解决刷新页面后值为null的问题
        user: getUser()

    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            setToken(token)
        },
        SET_USER(state, user) {
            state.user = user
            setUser(user)
        }
    },
    actions: {
        Login({
            commit
        }, form) {
            return new Promise((resolve, reject) => {
                login(form.username.trim(), form.password).then(response => {
                    const resp = response.data
                    commit('SET_TOKEN', resp.data.token)
                    resolve(resp)
                    //resolve触发成功处理
                }).catch(error => {
                    reject(error)
                })
            })

        },
        GetUserInfo({
            commit,state
        }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(response => {
                    const resp = response.data
                    commit('SET_USER', resp.data)
                    resolve(resp)
                }).catch(error=>{
                    reject(error)
                })
            })

        },
        Logout({commit,state}){
            return new Promise((resolve,reject)=>{
                logout(state.token).then(response=>{
                    const resp=response.data
                    commit('SET_TOKEN',null)
                    commit('SET_USER',null)
                    removeToken()
                    resolve(resp)
                }).catch(error=>{
                    reject(error)
                })
            })

        }
    }


}

export default user