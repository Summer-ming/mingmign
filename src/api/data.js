/*
 * @Description: 
 * @Author: gmm
 * @Date: 2019-10-15 11:19:43
 * @其他: 
 */
import axios from '@/libs/api.request'


export const getTableData = () => {
        return axios.request({
            url: 'get_table_data',
            method: 'get'
        })
    }
    //管理员登录请求 测试使用
export const getJgLogin = (ename, passWord) => {
    return axios.request({
        url: 'Login',
        method: 'get',
        params: {
            ename,
            passWord
        }
    })
}
export const getJgLoginTest = (param) => {
    return axios.request({
        url: 'Login',
        method: 'get',
        params: param
    })
}
//修改订单
export const updateOrderStatus = (param) => {
        return axios.request({
            url: 'order/updateOrder',
            method: 'post',
            data: param
        })
    }
    //获取买家流水信息
export const getCusFlowList = (param) => {
        return axios.request({
            url: 'customer/findCustomerMoneyRecord',
            method: 'get',
            params: param
        })
    }
    //获取管理员列表
export const getUserList = (param) => {
        return axios.request({
            url: 'employee/findEmployee',
            method: 'get',
            params: param
        })
    }
    //批量添加客户科目明细
export const addCustomerAccountRecord = (param) => {
        return axios.request({
            url: 'car/addCustomerAccountRecord',
            method: 'post',
            data: param
        })
    }
    //客户科目明细表——查询客户明细
export const findCustomerAccountRecord = (param) => {
    return axios.request({
        url: 'car/findCustomerAccountRecord',
        methor: 'get',
        params: param
    })
}

//客户科目明细表-删除列表中的客户明细记录
export const deleteCustomerAccountItem = (param) => {
        return axios.request({
            url: 'car/updateCustomerAccountRecord',
            method: 'post',
            data: param
        })
    }
    //客户科目明细表-修改客户科目明细

export const updateCustomerAccountRecord = (param) => {
        return axios.request({
            url: 'car/updateCustomerAccountRecord',
            method: 'post',
            data: param
        })
    }
    /**
     * 供应商科目-查询供应商科目明细
     * @param {} param 
     */
export const findSupplierAccountRecord = (param) => {
        return axios.request({
            url: 'sar/findSupplierAccountRecord',
            method: 'get',
            params: param
        })
    }
    /**
     * 供应商科目-批量添加供应商科目明细
     * @param {*} param 
     */
export const addSupplierAccountRecord = (param) => {
        return axios.request({
            url: 'sar/addSupplierAccountRecord',
            method: 'post',
            data: param
        })
    }
    /**
     * 供应商科目-批量修改供应商科目明细
     * @param {*} param 
     */
export const updateSupplierAccountRecord = (param) => {
        return axios.request({
            url: 'sar/updateSupplierAccountRecord',
            method: 'post',
            data: param
        })
    }
    /**付款申请
     * 添加付款申请
     */
export const addPaymentRequest = (param) => {
        return axios.request({
            url: 'paymentRequest/addPaymentRequest',
            method: 'post',
            data: param
        })
    }
    /**付款申请
     * 查询付款申请列表信息
     */
export const findPaymentRequest = (param) => {
    return axios.request({
        url: 'paymentRequest/findPaymentRequest',
        method: 'get',
        params: param
    })
}
export const updatePaymentRequest = (param) => {
    return axios.request({
        url: 'paymentRequest/updatePaymentRequest',
        method: 'post',
        data: param
    })
}

/**部门组织架构
 * 查询部门
 */
export const findPersonnelDept = (param) => {
        return axios.request({
            url: 'Personnel/findPersonnelDept',
            method: 'get',
            params: param
        })
    }
    /**部门组织结构
     * 添加部门
     */
export const addPersonnelDept = (param) => {
        return axios.request({
            url: 'Personnel/addPersonnelDept',
            method: 'post',
            data: param
        })
    }
    /**部门组织结构
     * 修改部门信息
     */
export const updatePersonnelDept = (param) => {
        return axios.request({
            url: 'Personnel/updatePersonnelDept',
            method: 'post',
            data: param
        })
    }
    /**部门组织结构
     * 判断组织下面有没有岗位 返回100 说明有 101 说明没有
     */
export const isNotItHaveRole = (param) => {
        return axios.request({
            url: 'Personnel/isNotItHaveRole',
            method: 'get',
            params: param
        })
    }
    /**部门组织结构
     * 查询角色
     */
export const findPersonnelRole = (param) => {
        return axios.request({
            url: 'Personnel/findPersonnelRole',
            method: 'get',
            params: param
        })
    }
    /**部门组织结构
     * 添加角色
     */
export const addRole = (param) => {
        return axios.request({
            url: 'Personnel/addRole',
            method: 'post',
            data: param
        })
    }
    /**部门组织结构
     * 修改角色
     */
export const updateRole = (param) => {
        return axios.request({
            url: 'Personnel/updateRole',
            method: 'post',
            data: param
        })
    }
    /**部门组织结构
     * 查询角色下面是不是有人员
     */
export const findRoleEmp = (param) => {
        return axios.request({
            url: 'Personnel/findRoleEmp',
            method: 'post',
            data: param
        })
    }
    /**部门组织结构
     * 添加人员
     */
export const addEmployee = (param) => {
        return axios.request({
            url: 'employee/addEmployee',
            method: 'post',
            data: param
        })
    }
    /**部门组织结构
     * 修改人员信息
     */
export const updateEmployee = (param) => {
        return axios.request({
            url: 'employee/updateEmployee',
            method: 'post',
            data: param
        })
    }
    /**部门组织结构
     * 赋值权限
     */
export const addRoleEmp = (param) => {
        return axios.request({
            url: 'Personnel/addRoleEmp',
            method: 'post',
            data: param
        })
    }
    /**部门组织结构
     * 删除角色
     */
export const deleteRoleEmp = (param) => {
        return axios.request({
            url: 'Personnel/deleteRoleEmp',
            method: 'post',
            data: param
        })
    }
    /**页面侧边栏
     * 查询侧边栏列表 list状
     */
export const findVueRouter1 = (param) => {
        return axios.request({
            url: 'vueRouter/findVueRouter1',
            method: 'get',
            params: param
        })
    }
    /**
     * 页面侧边栏
     *  树状结构查询
     * @param {*} param 
     */
export const findVueRouter2 = (param) => {
        return axios.request({
            url: 'vueRouter/findVueRouter2',
            method: 'get',
            params: param
        })
    }
    /**
     * 页面侧边栏
     * 修改信息
     * @param {*} param 
     */
export const updateVueRouter = (param) => {
        return axios.request({
            url: 'vueRouter/updateVueRouter',
            method: 'post',
            data: param
        })
    }
    /**
     * 页面侧边栏
     * 添加
     * @param {*} param 
     */
export const addVueRouter = (param) => {
        return axios.request({
            url: 'vueRouter/addVueRouter',
            method: 'post',
            data: param
        })
    }
    /**
     * 角色权限
     * 查询
     * @param {*} param 
     */
export const findRoleVue = (param) => {
        return axios.request({
            url: 'vueRouter/findRoleVue',
            method: 'get',
            params: param
        })
    }
    /**
     * 角色权限
     * 添加
     * @param {*} param 
     */
export const addRoleVue = (param) => {
        return axios.request({
            url: 'vueRouter/addRoleVue',
            method: 'post',
            data: param
        })
    }
    /**
     * 角色权限
     * 删除
     * @param {*} param 
     */
export const deleterRoleVue = (param) => {
        return axios.request({
            url: 'vueRouter/deleterRoleVue',
            method: 'post',
            data: param
        })
    }
    /**
     * 客户管理
     * 添加客户
     * @param {*} param 
     */
export const addcus = (param) => {
        return axios.request({
            url: 'customer/addOrgCustomer',
            method: 'post',
            data: param
        })
    }
    /**
     * 客户管理
     * 添加客户和供应商
     * @param {*} param 
     */
export const addOrgCustomer = (param) => {
        return axios.request({
            url: 'customer/addOrgCustomer',
            method: 'post',
            data: param
        })
    }
    // 查询公司信息
export const findOrgList = (param) => {
        return axios.request({
            url: 'customer/findOrgCusAcc',
            method: 'get',
            params: param
        })
    }
    //修改cus表信息
export const updateCusVipStatus = (param) => {
        return axios.request({
            url: 'customer/updateCustomer',
            method: 'post',
            data: param
        })
    }
    //org表信息
export const updateOrgVipStatus = (param) => {
        return axios.request({
            url: 'orginization/updateOrginization',
            method: 'post',
            data: param
        })
    }
    //修改买家卖家信息
export const updateOrgCus = (param) => {
        return axios.request({
            url: 'customer/updateOrgCustomer',
            method: 'post',
            data: param
        })
    }
    //小代码管理
    //查询代码类型
export const findCodeType = (param) => {
    return axios.request({
        url: 'codeType/findCodeType',
        method: 'get',
        params: param
    })
}

//小代码 管理
//查询代码信息
export const findCodeInfo = (param) => {
    return axios.request({
        url: 'codeType/findCodeInfo',
        method: 'get',
        params: param
    })
}

//小代码管理
//修改小代码信息
export const updateCodeInfo = (param) => {
    return axios.request({
        url: 'codeType/updateCodeInfo',
        method: 'post',
        data: param
    })
}

//小代码管理
//修改小代码类型
export const updateCodeType = (param) => {
        return axios.request({
            url: 'codeType/updateCodeType',
            method: 'post',
            data: param
        })
    }
    //小代码管理
    //添加小代码信息
export const addCodeInfo = (param) => {
    return axios.request({
        url: 'codeType/addCodeInfo',
        method: 'post',
        data: param
    })
}

//小代码管理
//添加小代码类型
export const addCodeType = (param) => {
        return axios.request({
            url: 'codeType/addCodeType',
            method: 'post',
            data: param
        })
    }
    //账户管理/employee/findEmployee
export const accountManagement = (param) => {
    return axios.request({
        url: 'employee/findEmployee',
        method: 'get',
        params: param
    })
}

//查询公司
export const findOrginization = (param) => {
    return axios.request({
        url: 'orginization/findOrginization',
        method: 'get',
        params: param
    })
}

//查询公司
export const findOrgCusAcc = (param) => {
    return axios.request({
        url: 'customer/findOrgCusAcc',
        method: 'get',
        params: param
    })
}

/**
 * 店铺管理
 * 添加店铺
 * @param {*} param 
 */
export const addShop = (param) => {
        return axios.request({
            url: 'shop/addShop',
            method: 'post',
            data: param
        })
    }
    //查询店铺
export const findShop = (param) => {
        return axios.request({
            url: 'shop/findShop',
            method: 'get',
            params: param
        })
    }
    //删除店铺
export const updateShop = (param) => {
        return axios.request({
            url: 'shop/updateShop',
            method: 'post',
            data: param
        })
    }
    //查询银行卡
export const findAccount = (param) => {
    return axios.request({
        url: 'account/findAccount',
        method: 'get',
        params: param
    })
}

//删除银行卡
export const updateAccount = (param) => {
    return axios.request({
        url: 'account/updateAccount',
        method: 'post',
        data: param
    })
}

//添加银行卡
export const addAccount = (param) => {
        return axios.request({
            url: 'account/addAccount',
            method: 'post',
            data: param
        })
    }
    //查询订单
export const findOrdersAll = (param) => {
    return axios.request({
        url: 'order/findOrdersAll',
        method: 'get',
        params: param
    })
}

//查询订单明细
export const findOrdersInfoAll = (param) => {
    return axios.request({
        url: 'order/findOrdersInfoAll',
        method: 'get',
        params: param
    })
}

//审核订单等，值修改状态，同时变更流水
export const updateOrdersStatus = (param) => {
        return axios.request({
            url: 'order/updateOrdersStatus',
            method: 'post',
            data: param
        })
    }
    //采购单付款申请
export const updateFukuanZhenghe = (param) => {
        return axios.request({
            url: 'customer/updateFukuanZhenghe',
            method: 'post',
            data: param
        })
    }
    //查询抵扣列表 采购单
export const findJgJieSuanInfo = (param) => {
    return axios.request({
        url: 'customer/findJgJieSuanInfo',
        method: 'get',
        params: param
    })
}
    //查询抵扣列表 销售单
    export const findJgJieSuanInfoSellOrders = (param) => {
        return axios.request({
            url: 'customer/findJgJieSuanInfoSellOrders',
            method: 'get',
            params: param
        })
    }

//修改采购单详细
export const updateOrderInfo = (param) => {
    return axios.request({
        url: 'order/updateOrderInfo',
        method: 'post',
        data: param
    })
}

//添加订单明细
export const addOrderInfo = (param) => {
        return axios.request({
            url: 'order/addOrderInfo',
            method: 'post',
            data: param
        })
    }
    //修改抵扣状态
export const updateShopMoneyJieSuanMer = (param) => {
    return axios.request({
        url: 'customer/updateShopMoneyJieSuanMer',
        method: 'post',
        data: param
    })
}

//查询库存列表信息
export const findInStock = (param) => {
        return axios.request({
            url: 'order/findInStock',
            method: 'get',
            params: param
        })
    }
//查询库存列表信息 汇总
export const findInStockSum = (param) => {
    return axios.request({
        url: 'order/findInStockSum',
        method: 'get',
        params: param
    })
}
    //修改库存信息
export const updateInStock = (param) => {
    return axios.request({
        url: 'order/updateInStock',
        method: 'post',
        data: param
    })
}

//查询订单明细合计
export const findOrdersInfoAllSum = (param) => {
        return axios.request({
            url: 'order/findOrdersInfoAllSum',
            method: 'get',
            params: param
        })
    }
//查询销售订单明细合计
export const findOrdersInfoAllSum89 = (param) => {
    return axios.request({
        url: 'order/findOrdersInfoAllSum89',
        method: 'get',
        params: param
    })
}
//查询销售单利润合计
export const findOrdersInfoAllSum89Sum = (param) => {
    return axios.request({
        url: 'order/findOrdersInfoAllSum89Sum',
        method: 'get',
        params: param
    })
}
//查询销售单明细金额总计的接口
export const findOrdersInfoAllSum89Zong = (param) => {
    return axios.request({
        url: 'order/findOrdersInfoAllSum89Zong',
        method: 'get',
        params: param
    })
}
    //查询到账单列表福建应
export const findDaoZhangDanAll = (param) => {
        return axios.request({
            url: 'daozhangdan/findDaoZhangDanAll',
            method: 'get',
            params: param
        })
    }
    //修改到账单状态 福建亿钢
export const deleteDaoZhangDan = (param) => {
        return axios.request({
            url: 'daozhangdan/deleteDaoZhangDan',
            method: 'post',
            data: param
        })
    }
    //查询银行支行信息
export const findBankLineByBankCode = (param) => {
    return axios.request({
        url: 'daozhangdan/findBankLineByBankCode',
        method: 'get',
        params: param
    })
}

//查询到账单列表 上海闽航
export const findDaoZhangDanAllSH = (param) => {
        return axios.request({
            url: 'daozhangdan/findDaoZhangDanAllSH',
            method: 'get',
            params: param
        })
    }
    //修改到账单状态 上海闽航
export const deleteDaoZhangDanSH = (param) => {
    return axios.request({
        url: 'daozhangdan/deleteDaoZhangDanSH',
        method: 'post',
        data: param
    })
}

//查询进项票列表
export const findInvoiceIncome = (param) => {
    return axios.request({
        url: 'BillingApplicationController/findInvoiceIncome',
        method: 'get',
        params: param
    })
}

//查询销项票列表
export const findInvoiceOutout = (param) => {
        return axios.request({
            url: 'BillingApplicationController/findInvoiceOutout',
            method: 'get',
            params: param
        })
    }
    //添加采购单付款 金额流水
export const deleteDaoZhangDanSH1 = (param) => {
        return axios.request({
            url: 'daozhangdan/deleteDaoZhangDanSH',
            method: 'post',
            data: param
        })
    }
    //修改福建到账单
export const updateDaoZhangDanFJ = (param) => {
        return axios.request({
            url: 'daozhangdan/updateDaoZhangDan',
            method: 'post',
            data: param
        })
    }
    //修改上海到账单
export const updateDaoZhangDanSH = (param) => {
    return axios.request({
        url: 'daozhangdan/updateDaoZhangDanSH',
        method: 'post',
        data: param
    })
}

//添加桥梁表福建
export const daoOrderBridgeFJ = (param) => {
        return axios.request({
            url: 'daozhangdan/daoOrderBridge',
            method: 'post',
            data: param
        })
    }
    //添加桥梁表上海
export const daoOrderBridgeSH = (param) => {
        return axios.request({
            url: 'daozhangdan/daoOrderBridgeSH',
            method: 'post',
            data: param
        })
    }
    //销售单付款制单时，记录付款流水信息。CashFlowController/addCashFlow
export const addCashFlow = (param) => {
        return axios.request({
            url: 'CashFlowController/addCashFlow',
            method: 'post',
            data: param
        })
    }
    //销售单付款制单时，修改付款流水信息。CashFlowController/addCashFlow
export const updateCashFlow = (param) => {
    return axios.request({
        url: 'CashFlowController/updateCashFlow',
        method: 'post',
        data: param
    })
}

//销售单付款制单时添加的流水信息，查询付款流水
export const findCashFlow = (param) => {
        return axios.request({
            url: 'CashFlowController/findCashFlow',
            method: 'get',
            params: param
        })
    }
    //查找订单审核操作流水
export const findOrderCaozuoRecord = (param) => {
        return axios.request({
            url: 'order/findOrderCaozuoRecord',
            method: 'get',
            params: param
        })
    }
    //汇总采购单订单总计金额
export const updateBuy = (param) => {
    return axios.request({
        url: 'OtherMoney/updateBuy',
        method: 'post',
        data: param
    })
}
    //汇总销售单订单总计金额
    export const updateSell = (param) => {
        return axios.request({
            url: 'OtherMoney/updateSell',
            method: 'post',
            data: param
        })
    }

    //批量修改结算单状态；
    export const updateJieSuanForStatus1 = (param) => {
        return axios.request({
            url: 'customer/updateJieSuanForStatus1',
            method: 'post',
            data: param
        })
    }
       //批量修改结算单状态；全部可以批量的接口
       export const updateJiSuanPidBatch = (param) => {
        return axios.request({
            url: 'customer/updateJiSuanPidBatch',
            method: 'post',
            data: param
        })
    }
        //查找订单付款申请流水记录总和
export const findZhidanApplySum = (param) => {
    return axios.request({
        url: 'customer/findZhidanApplySum',
        method: 'get',
        params: param
    })
}
//批量添加到账单
export const addDaoZhangDanBatch = (param) => {
    return axios.request({
        url: 'daozhangdan/addDaoZhangDanBatch',
        method: 'post',
        data: param
    })
}

//确认到账单有效
export const updateDaoZhangDanBatch2 = (param) => {
    return axios.request({
        url: 'daozhangdan/updateDaoZhangDanBatch2',
        method: 'post',
        data: param
    })
}

//量确认到账单有效进入流水中
export const addOrgMoneyRecord = (param) => {
    return axios.request({
        url: 'orginization/addOrgMoneyRecord ',
        method: 'post',
        data: param
    })
}
    //查询客户供应商流水
    export const findOrgMoneyRecord = (param) => {
     return axios.request({
         url: 'orginization/findOrgMoneyRecord',
         method: 'get',
         params: param
     })
 }

 //量确认到账单有效进入流水中
export const updateOrgMoneyRecord = (param) => {
    return axios.request({
        url: 'orginization/updateOrgMoneyRecord',
        method: 'post',
        data: param
    })
}
 //查询客户供应商流水
 export const findOrgMoneyRecordSum = (param) => {
    return axios.request({
        url: 'orginization/findOrgMoneyRecordSum',
        method: 'get',
        params: param
    })
}

 //查询客户余额汇总
 export const findOrgMoneyRecordMoneySum = (param) => {
    return axios.request({
        url: 'orginization/findOrgMoneyRecordMoneySum',
        method: 'get',
        params: param
    })
}

 //添加制单申请表
 export const addJgJieSuan = (param) => {
    return axios.request({
        url: 'customer/addJgJieSuan',
        method: 'post',
        data: param
    })
}
//添加流水到公司流水表 orginization/addOrgMoneyRecord
export const getLiuShuiBiao = (param) => {
    return axios.request({
        url: 'orginization/addOrgMoneyRecord',
        method: 'post',
        data: param
    })
}

 //查询采购订单合计
 export const findOrdersAllSum = (param) => {
    return axios.request({
        url: 'order/findOrdersAllSum',
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

//判断采购单订单状态，是否可以变更成已收票；不需要处理返回结果
export const updateOrderStatusByInvoiceStatus = (param) => {
    return axios.request({
        url: 'order/updateOrderStatusByInvoiceStatus',
        method: 'post',
        data: param
    })
}

//判断销售单订单状态，是否可以变更成已收票；不需要处理返回结果
export const updateOrderStatusByInvoiceStatus89 = (param) => {
    return axios.request({
        url: 'order/updateOrderStatusByInvoiceStatus89',
        method: 'post',
        data: param
    })
}

//查询杂费余额
export const findMoney = (param) => {
    return axios.request({
        url: 'OtherMoney/findMoney',
        method: 'get',
        params: param
    })
}
//查询客户票额
export const findOrgGroup = (param) => {
    return axios.request({
        url: 'customer/findOrgGroup',
        method: 'get',
        params: param
    })
}

//查询工程名称
export const findOrderEngineering = (param) => {
    return axios.request({
        url: 'order/findOrderEngineering',
        method: 'get',
        params: param
    })
}

//添加利息
export const addInterest = (param) => {
    return axios.request({
        url: 'Interest/addInterest',
        method: 'post',
        data: param
    })
}
//修改利息
export const updateInterest = (param) => {
    return axios.request({
        url: 'Interest/updateInterest',
        method: 'post',
        data: param
    })
}
//查询利息
export const findInterest = (param) => {
    return axios.request({
        url: 'Interest/findInterest',
        method: 'get',
        params: param
    })
}

//电商结算流水
//查询 汇总
export const findBillFlowSum = (param) => {
    return axios.request({
        url: 'billFlow/findBillFlowSum',
        method: 'get',
        params: param
    })
}
//查询 列表
export const findBillFlow = (param) => {
    return axios.request({
        url: 'billFlow/findBillFlow',
        method: 'get',
        params: param
    })
}
//修改
export const updateBillFlow = (param) => {
    return axios.request({
        url: 'billFlow/updateBillFlow',
        method: 'post',
        data: param
    })
}
//添加
export const addBillFlow = (param) => {
    return axios.request({
        url: 'billFlow/addBillFlow',
        method: 'post',
        data: param
    })
}

//查询 杂费关联采购单接口
export const findOtderMoneyBuy = (param) => {
    return axios.request({
        url: 'OtherMoney/findOtderMoneyBuy',
        method: 'get',
        params: param
    })
}
//查询 杂费关联销售单接口
export const findOtderMoneySell = (param) => {
    return axios.request({
        url: 'OtherMoney/findOtderMoneySell',
        method: 'get',
        params: param
    })
}

//修改 杂费信息
export const updateOtherMoneyBatch = (param) => {
    return axios.request({
        url: 'OtherMoney/updateOtherMoneyBatch',
        method: 'post',
        data: param
    })
}
// 
//查询 杂费总金额
export const findOtherMoneySum = (param) => {
    return axios.request({
        url: 'OtherMoney/findOtherMoneySum',
        method: 'get',
        params: param
    })
}
// order/updateOrderAuditApply
export const jueP = (param) => {
    return axios.request({
        url: 'order/updateOrderAuditApply',
        method: 'post',
        data: param
    })
}
// project/ findProject
export const xiangMu = (param) => {
    return axios.request({
        url: 'project/findProject',
        method: 'get',
        params: param
    })
}
///project/ findProjectDept 传
export const xiangMuDetail = (param) => {
    return axios.request({
        url: 'project/findProjectDept',
        method: 'get',
        params: param
    })
}
// 跟新基本信息/project/ updateProject 
export const xiangGeng = (param) => {
    return axios.request({
        url: 'project/updateProject',
        method: 'post',
        data: param
    })
}
//更新干系人信息project/ updateProjectDept
export const genZhu = (param) => {
    return axios.request({
        url: 'project/updateProjectDept',
        method: 'post',
        data: param
    })
}
//新增接口/project/ addProjectDept
export const genAdd = (param) => {
    return axios.request({
        url: 'project/addProjectDept',
        method: 'post',
        data: param
    })
}
//new /project/ addProject
export const getAdd = (param) => {
    return axios.request({
        url: 'project/addProject',
        method: 'post',
        data: param
    })
}
//打印采购合同
export const buyOrderPdf = (param) => {
    return axios.request({
        url: 'order/buyOrderPdf',
        method: 'post',
        data: param
    })
}
//查询工程、对账批次汇总
export const findEngineeringMoney = (param) => {
    return axios.request({
        url: 'order/findEngineeringMoney',
        method: 'get',
        params: param
    })
}

//查询采购销售利润订单表
export const findOrderProfit = (param) => {
    return axios.request({
        url: 'order/findOrderProfit',
        method: 'get',
        params: param
    })
}

//查询采购销售利润订单表汇总
export const findOrderProfitSum = (param) => {
    return axios.request({
        url: 'order/findOrderProfitSum',
        method: 'get',
        params: param
    })
}
//项目三级tree接口查询
export const findProject = (param) => {
    return axios.request({
        url: 'project/findProject',
        method: 'get',
        params: param
    })
}

//批量修改采购单的发票金额、发票号码、从订单明细中汇总来
export const updateOrderBuyMoneyBatch = (param) => {
    return axios.request({
        url: 'order/updateOrderBuyMoneyBatch',
        method: 'post',
        data: param
    })
}
//批量修改采购单的发票金额、发票号码、从订单明细中汇总来
export const updateOrderSellMoneyBatch = (param) => {
    return axios.request({
        url: 'order/updateOrderSellMoneyBatch',
        method: 'post',
        data: param
    })
}
//tree数组表格order/findOrdersAllTree89

export const findTree = (param) => {
    return axios.request({
        url: 'order/findOrdersAllTree89',
        method: 'get',
        params: param
    })
}

