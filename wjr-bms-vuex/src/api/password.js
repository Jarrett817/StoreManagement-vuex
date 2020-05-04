import request from '@/utils/request'

export default {
    checkPwd(userId, password) {
        // 校验密码,这里的id不是账号
        return request({
            url: '/user/password',
            method: 'post',
            data: {
                userId,
                password
            }
        })
    },
    updatePwd(userId, password) {
        return request({
            url: '/user/password',
            method: 'put',
            data: {
                userId,
                password
            }
        })
    }
}