import axios from '@/libs/api_10_100_16_5_8080.request'
//制单接口
export const zhidan_shanghai = () => {
    return axios.request({
        url: 'orders/zhidan',
        method: 'get'
    })
}