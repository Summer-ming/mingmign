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
    //查询抵扣列表
export const findJgJieSuanInfo = (param) => {
    return axios.request({
        url: 'customer/findJgJieSuanInfo',
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
    //汇总订单总计金额
export const updateBuy = (param) => {
    return axios.request({
        url: 'OtherMoney/updateBuy',
        method: 'post',
        data: param
    })
}