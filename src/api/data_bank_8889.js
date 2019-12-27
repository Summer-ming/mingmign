//这是杭州银行银企直连访问的接口文件
import axios from '@/libs/api_bank_8889.request.js'

    //查询余额
    export const getBalance = (param) => {
        return axios.request({
            url: 'BillFlow/getBalance',
            method: 'post',
            data: param
        })
    }

     //提交制单
     export const zhidan = (param) => {
        return axios.request({
            url: 'BillFlow/zhidan',
            method: 'post',
            data: param
        })
    }
