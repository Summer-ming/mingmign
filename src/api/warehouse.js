/*
 * @Description: 
 * @Author: zl
 * @others: 
 * @Date: 2019-03-25 09:52:06
 * @LastEditTime: 2019-04-03 14:21:53
 */
import axios from '@/libs/api.request'

/**
 * @description: 查询仓库
 * @param {type} 
 * @return: 
 */
export const findWareHouse = (param) => {
        return axios.request({
            url: 'warehouse/findWareHouse',
            method: 'get',
            params:param
        })
    }

    /**仓库管理
     * 编辑仓库信息
     */
export const updateWareHouse = (param) => {
        return axios.request({
            url: 'warehouse/updateWareHouse',
            method: 'post',
            data: param
        })
    }

export const addWareHouse = (param) => {
        return axios.request({
            url: 'warehouse/addWareHouse',
            method: 'post',
            data: param
        })
    }

export const deleteWareHouse = (param) => {
        return axios.request({
            url: 'warehouse/deleteWareHouse',
            method: 'post',
            data: param
        })
    }


    /*供应商管理
     * 查询信息
     */
    export const findAgent = (param) => {
        return axios.request({
            url: 'agentController/findAgent',
            method: 'get',
            params:param
        })
    }

    /*供应商管理
     * 编辑
     */
    export const updateAgent = (param) => {
        return axios.request({
            url: 'agentController/updateAgent',
            method: 'post',
            data: param
        })
    }

    /*供应商管理
     * 新增
     */
    export const addAgent = (param) => {
        return axios.request({
            url: 'agentController/addAgent',
            method: 'post',
            data: param
        })
    }