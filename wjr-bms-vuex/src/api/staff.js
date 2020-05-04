import request from '@/utils/request'
export default {
    search(page, size, searchMap) {
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap

        })
    },
    getById(id) {
        return request({
            url: `/staff/${id}`,
            method:'get'
        })
    },
    add(pojo) {
        return request({
            url: '/staff',
            method: 'post',
            data: pojo
        })
    },
    update(pojo){
        return request({
            url:`/staff/${pojo.id}`,
            method:'put',
            data:pojo
        })
    },
    deleteById(id){
        return request({
            url:`/staff/${id}`,
            method:'delete'
        })
    }
}