/*
 * @Description: 
 * @Author: gmm
 * @Date: 2019-09-16 17:26:55
 * @其他: 
 */
import axios from '@/libs/api.request'

    //修改订单状态
export const updateOrderStatus = (param) => {
        return axios.request({
            url: 'order/updateOrder89',
            method: 'post',
            data: param
        })
    }


    //查询销售订单
export const findOrdersAll = (param) => {
    return axios.request({
        url: 'order/findOrdersAll89',
        method: 'get',
        params: param
    })
}
    //查询销售订单89命名
    export const findOrdersAll89 = (param) => {
        return axios.request({
            url: 'order/findOrdersAll89',
            method: 'get',
            params: param
        })
    }
    //查询销售订单合计
    export const findOrdersAllSum89 = (param) => {
        return axios.request({
            url: 'order/findOrdersAllSum89',
            method: 'get',
            params: param
        })
    }

//查询订单明细
export const findOrdersInfoAll = (param) => {
        return axios.request({
            url: 'order/findOrdersInfoAll89',
            method: 'get',
            params: param
        })
    }
    //查询订单明细
export const findOrdersInfoAll5 = (param) => {
        return axios.request({
            url: 'order/findOrdersInfoAll589',
            method: 'get',
            params: param
        })
    }
    //审核订单等，值修改状态，同时变更流水
export const updateOrdersStatus = (param) => {
        return axios.request({
            url: 'order/updateOrdersStatus89',
            method: 'post',
            data: param
        })
    }
    //采购单付款申请
export const updateFukuanZhenghe = (param) => {
        return axios.request({
            url: 'customer/updateFukuanZhenghe89',
            method: 'post',
            data: param
        })
    }


//修改采购单详细
export const updateOrderInfo = (param) => {
    return axios.request({
        url: 'order/updateOrderInfo89',
        method: 'post',
        data: param
    })
}

//添加订单明细
export const addOrderInfo = (param) => {
        return axios.request({
            url: 'order/addOrderInfo89',
            method: 'post',
            data: param
        })
    }

    //开票申请 1 BillingApplicationController/BillingApplication 不用改
export const kaiPiao = (param) => {
        return axios.request({
            url: 'BillingApplicationController/BillingApplication',
            method: 'post',
            data: param
        })
    }
    //开票申请 2 /order/updateOrder
export const kaiPiao2 = (param) => {
    return axios.request({
        url: 'order/updateOrder89',
        method: 'post',
        data: param
    })
}

//开票申请 2 /order/updateOrder
export const addPrepaidOrdersSell = (param) => {
    return axios.request({
        url: 'prepayment/addPrepaidOrders89',
        method: 'post',
        data: param
    })
}

//撤销回退接口 BillingApplicationController/invoiceback 不改
export const getCheXiao = (param) => {
    return axios.request({
        url: 'BillingApplicationController/invoiceback',
        method: 'post',
        data: param
    })
}

//获取类别 Steel/findSteel 不用改
export const getLeiBie = (param) => {
    return axios.request({
        url: 'Steel/findSteel',
        method: 'get',
        params: param
    })
}
//查询订单明细合计
export const findOrdersInfoAllSum = (param) => {
    return axios.request({
        url: 'order/findOrdersInfoAllSum89',
        method: 'get',
        params: param
    })
}
//新的 修改销售单信息接口 order/updateOrderInfo89
export const getXiuGaiDingDan = (param) => {
    return axios.request({
        url: 'order/updateOrderInfo89',
        method: 'post',
        data: param
    })
}

    //修改销售单
    export const updateOrder89 = (param) => {
        return axios.request({
            url: 'order/updateOrder89',
            method: 'post',
            data: param
        })
    }

    //新增杂费查询列表
export const findZaFei = (param) => {
    return axios.request({
        url: 'OtherMoney/findOtderMoney',
        method: 'get',
        params: param
    })
}