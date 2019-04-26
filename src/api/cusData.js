import axios from '@/libs/api.request'
import qs from 'qs'
//客户列表接口api


//查询接口/customer/findCustomer
export const cusSearch = (param) => {
        return axios.request({
            url: '/customer/findCustomer',
            method: 'get',
            params: param
        })
    }
    //获取业务员展示列表
export const getUserList = (param) => {
        return axios.request({
            url: 'employee/findEmployee',
            method: 'get',
            params: param
        })
    }
    //jgv2/swfarea/findswfarea 获取主营城市接口
export const getCity = (param) => {
        return axios.request({
            url: 'swfarea/findswfarea',
            method: 'get',
            params: param
        })
    }
    // 钢厂列表 steelworks/findSteelworks
export const getGang = (param) => {
        return axios.request({
            url: 'steelworks/findSteelworks',
            method: 'get',
            params: param
        })
    }
    //仓库列表/warehouse/findWareHouse
export const getWarehouse = (param) => {
        return axios.request({
            url: 'warehouse/findWareHouse',
            method: 'get',
            params: param
        })
    }
    //查询开户行名称bank/findBankAll
export const getOpeningBank = (param) => {
        return axios.request({
            url: 'bank/findBankAll',
            method: 'get',
            params: param
        })
    }
    //根据地址 查询开户行名称 bank/findBankBranchLine
export const getBankDot = (param) => {
        return axios.request({
            url: 'bank/findBankBranchLine',
            method: 'get',
            params: param
        })
    }
    //查询供应商
export const getAgent = (param) => {
        return axios.request({
            url: 'agentController/findAgent',
            method: 'get',
            params: param
        })
    }
    //下单提交接口  prepayment/addPrepaidOrders
export const getTi = (param) => {
        return axios.request({
            url: 'prepayment/addPrepaidOrders',
            method: 'post',
            data: param
        })
    }
    //入库提交接口 prepayment/PrepaidDetails2
export const getRuKu = (param) => {
        return axios.request({
            url: 'prepayment/PrepaidDetails2',
            method: 'post',
            data: param
        })
    }
    //开票查询  BillingApplicationController/findInvoiceApplyInfoAndInvoiceApply
export const getKaiPiao = (param) => {
        return axios.request({
            url: 'BillingApplicationController/findInvoiceApplyInfoAndInvoiceApply',
            method: 'get',
            params: param
        })
    }
    //绑定新销项票 BillingApplicationController/addInvoiceOutout
export const getBangDing = (param) => {
        return axios.request({
            url: 'BillingApplicationController/addInvoiceOutout',
            method: 'post',
            data: param
        })
    }
    //绑定新销项票 步骤2 BillingApplicationController/addInvoiceApplyInfoInvoiceOutputBridge
export const addInfoOutBridge = (param) => {
    return axios.request({
        url: 'BillingApplicationController/addInvoiceApplyInfoInvoiceOutputBridge',
        method: 'post',
        data: param
    })
}

//绑定新销项票 步骤3 BillingApplicationController/updateTordersInfoStatus
export const updateTordersInfoStatus = (param) => {
        return axios.request({
            url: 'BillingApplicationController/updateTordersInfoStatus',
            method: 'post',
            data: param
        })
    }
    //杂费金额查询 OtherMoney/findOtderMoney
export const getZha = (param) => {
        return axios.request({
            url: 'OtherMoney/findOtderMoney',
            method: 'get',
            params: param
        })
    }
    //添加杂费接口/OtherMoney/addOtherMoney
export const getAddFei = (param) => {
        return axios.request({
            url: 'OtherMoney/addOtherMoney',
            method: 'post',
            data: param
        })
    }
    //删除 修改接口 /OtherMoney/updateOtherMoney
export const getShan = (param) => {
    return axios.request({
        url: 'OtherMoney/updateOtherMoney',
        method: 'post',
        data: param
    })
}