/*
 * @Description: 
 * @Author: gmm
 * @Date: 2019-10-14 17:15:23
 * @其他: 
 */
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
//进项票查询列表 order/findOrdersInfoAll
export const getJinPiao = (param) => {
    return axios.request({
        url: 'order/findOrdersInfoAll',
        method: 'get',
        params: param
    })
}
//新增进项票 BillingApplicationController/addInvoiceInCome
export const getAddJinPiao = (param) => {
    return axios.request({
        url: 'invoiceInOut/addInvoiceInCome',
        method: 'post',
        data: param
    })
}
//批量添加采购单明细和进项票关联关系 invoiceInOut/addBuyInComeBatch
export const getBangJinPiao = (param) => {
    return axios.request({
        url: 'invoiceInOut/addBuyInComeBatch',
        method: 'post',
        data: param
    })
}
//新增 进项票修改订单发票信息 order/updateOrderInfo
export const getXiuGaiOrder = (param) => {
    return axios.request({
        url: 'order/updateOrderInfo',
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
        url: 'OtherMoney/updateOtherMoneyBatch',
        method: 'post',
        data: param
    })
}
// 查询客户金额流水 orginization/findOrgMoneyRecord
export const getKeHuLiuShui = (param) => {
    return axios.request({
        url: 'orginization/findOrgMoneyRecord',
        method: 'get',
        params: param
    })
}
//修改进项票信息 invoiceInOut/updateInvoiceIncome
export const getXiuGaijinPiao = (param) => {
    return axios.request({
        url: 'invoiceInOut/updateInvoiceIncome',
        method: 'post',
        data: param
    })
}
//修改订单发票信息  order/updateOrderInfo
export const getXiuGaiDingDanFaPiao = (param) => {
    return axios.request({
        url: 'order/updateOrderInfo',
        method: 'post',
        data: param
    })
}
//修改订单发票信息 销项票  order/updateOrderInfo89
export const getXiuGaiDingDanFaPiao89 = (param) => {
    return axios.request({
        url: 'order/updateOrderInfo89',
        method: 'post',
        data: param
    })
}
//修改订单状态  order/updateOrder
export const getXiuGaiOrderStatus = (param) => {
    return axios.request({
        url: 'order/updateOrder',
        method: 'post',
        data: param
    })
}
//修改订单状态 order/updateOrder89  销项票
export const getXiuGaiOrderStatus89 = (param) => {
    return axios.request({
        url: 'order/updateOrder89',
        method: 'post',
        data: param
    })
}
//修改客户流水表  orginization/updateOrgMoneyRecord
export const getKeHuLiuShuiBiao = (param) => {
    return axios.request({
        url: 'orginization/updateOrgMoneyRecord',
        method: 'post',
        data: param
    })
}
//添加流水到公司流水表  orginization/addOrgMoneyRecord
export const getCompanyLiuShui = (param) => {
    return axios.request({
        url: 'orginization/addOrgMoneyRecord',
        method: 'post',
        data: param
    })
}
// 销项票的三个接口  getAddJinPiao,getBangJinPiao,getXiuGaiOrder
//新增销项票 BillingApplicationController/addInvoiceInCome89
export const getAddJinPiao89 = (param) => {
    return axios.request({
        url: 'invoiceInOut/addInvoiceOutput',
        method: 'post',
        data: param
    })
}
//批量添加采购单明细和进项票关联关系 invoiceInOut/addBuyInComeBatch89
export const getBangJinPiao89 = (param) => {
    return axios.request({
        url: 'invoiceInOut/addSellOutPutBatch',
        method: 'post',
        data: param
    })
}
//新增进项票修改订单发票信息 order/updateOrderInfo89
export const getXiuGaiOrder89 = (param) => {
    return axios.request({
        url: 'order/updateOrderInfo89',
        method: 'post',
        data: param
    })
}

//修改销项票  步骤1 invoiceInOut/updateInvoiceOutput
export const getXiuXiaoPiao = (param) => {
    return axios.request({
        url: 'invoiceInOut/updateInvoiceOutput',
        method: 'post',
        data: param
    })
}
// om1 返回抵扣列表  customer/updateJiSuanStatus
export const getDiKouList = (param) => {
    return axios.request({
        url: 'customer/updateJiSuanStatus',
        method: 'post',
        data: param
    })
}
// 提现查询接口 jgerp/customer/findJgJieSuanInfo 
export const getTiXian = (param) => {
    return axios.request({
        url: 'customer/findJgJieSuanInfo',
        method: 'get',
        params: param
    })
}
// 审核拒绝提现申请 customer/updateJieSuanForStatus1
export const getRefus = (param) => {
    return axios.request({
        url: 'customer/updateJieSuanForStatus1',
        method: 'post',
        data: param
    })
}
//客户供应商提现制单申请/ customer/addJgJieSuan
export const getZhiDan = (param) => {
    return axios.request({
        url: 'customer/addJgJieSuan',
        method: 'post',
        data: param
    })
}
//查询到账单 daozhangdan/findDaoZhangDanAll
export const getChaXunDaoDan = (param) => {
    return axios.request({
        url: 'daozhangdan/findDaoZhangDanAll',
        method: 'get',
        params: param
    })
}
//销售单利润查询接口  
export const getLiRun = (param) => {
    return axios.request({
        url: 'order/findSellOrdersInfoUsedBuyOrderInfo',
        method: 'get',
        params: param
    })
}
    //修改库存信息
    export const updateInStockInfo = (param) => {
        return axios.request({
            url: 'order/updateInStock',
            method: 'post',
            data: param
        })
    }
//申请解锁接口 order/addOrderCaozuoRecord
export const jieSuo = (param) => {
    return axios.request({
        url: 'order/addOrderCaozuoRecord',
        method: 'post',
        data: param
    })
}