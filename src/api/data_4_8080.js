/*
 * @Description: 福建到账单制单相关接口
 * @Author: wb
 * @others: 
 * @Date: 2019-04-15 09:58:05
 */
import axios from '@/libs/api_10_100_16_4_8080.request'

//制单接口
export const zhidan_fujian = () => {
    return axios.request({
        url: 'orders/zhidan',
        method: 'get'
    })
}

//到账单制单
export const daozhangdanZhidan_fujian = () => {
    return axios.request({
        url: 'orders/daozhangdanZhidan',
        method: 'get'
    })
}