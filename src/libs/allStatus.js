//判断 公司的角色类型，是客户还是 供应商
export const getOrgRoleType = (status) =>{
    if(status == "1"){
        return "客户"
    }else if (status == "2"){
        return "供应商"
    }else{
        return "-"
    }
}
//判断采购单 是否已经入库
export const getBuyOrderIsInStockStatus = (status) =>{
    // 6是已入库
    if(status < 5){
        return "未入库"
    }else {
        return "已入库"
    }
}
//判断采购单 是否付款
export const getBuyOrderIsPayMoneyStatus = (status) =>{
    switch (Number(status)) {
        case 0:
            return '未付款'
            break;
        case 1:
                return '付款中'
                break;
        case 8:
                return '付款完成'
                break;
        default:
            break;
    }
    
}
//采购单是否收票状态
export const getBuyOrderIsInvoiceStatus =(status) =>{
    if(status  == "10"){
        return "已收票"
    }else{
        return "未收票"
    }
}
//销售单是否 开票状态 
export const getSellOrderIsInvoiceStatus = (status) =>{
    if(status == "10"){
        return "已开票"
    }else{
        return "未开票"
    }
}
//销售单是否实提
export const getSellOrderIsRealMentionStatus = (status) =>{
    if(status <8 && status <=90){
        return "未实提"
    }else{
        return "已实提"
    }
}
//销售单是否收款
export const getSellOrderIsReceiveMoneyStatus = (status) =>{
    if(status <= 0){
        return "未收款"
    }else{
        return "已收款"
    }
}
export const getBuyOrderCaoZuoStatus = (dic) => {

        var orderCaozuoRecordStatus = dic.newOrderStatus ? dic.newOrderStatus : "";
        var orderoldstatus = dic.oldOrderStatus ? dic.oldOrderStatus : "";
        if (orderCaozuoRecordStatus == "1") {
            return "成功下单";
        }
        if (orderCaozuoRecordStatus == "2") {
            return "审核通过";
        }
        if (orderCaozuoRecordStatus == "3") {
            return "提交付款申请";
        }
        if (orderCaozuoRecordStatus == "4") {
            return "财务付款成功";
        }

        if (orderCaozuoRecordStatus == "502" && orderoldstatus == "5") {
            return "提交退货申请";
        }
        if (orderCaozuoRecordStatus == "5" && orderoldstatus == "501") {
            return "[开放货单成功]";
        }
        if (orderCaozuoRecordStatus == "502" && orderoldstatus == "502") {
            return "店小二审核";
        }
        if (orderCaozuoRecordStatus == "503" && orderoldstatus == "502") {
            return "总监审核通过";
        }
        if (orderCaozuoRecordStatus == "509" && orderoldstatus == "509") {
            return "申请提货作废";
        }
        if (orderCaozuoRecordStatus == "5") {
            return "提交提货申请";
        }


        if (orderCaozuoRecordStatus == "6") {
            return "[订单录入实提]";
        }
        if (orderCaozuoRecordStatus == "7") {
            return "订单已出库完成";
        }
        if (orderCaozuoRecordStatus == "8") {
            return "已确认收货";
        }
        if (orderCaozuoRecordStatus == "9") {
            return "提交开票申请";
        }
        if (orderCaozuoRecordStatus == "10") {
            return "财务开票完成";
        }
        if (orderCaozuoRecordStatus == "9009") {
            return "财务拒绝开票申请";
        }
        if (orderCaozuoRecordStatus == "11") {
            return "关闭订单,交易失败";
        }
        return "";
    }
    //获取订单状态
export const getBuyOrderStatus = (status) => {
    var str = "";
    if(status == undefined || status == "undefined" || status == null || status =="null" ){
        return "-"
    }else{
        status = parseInt(status);
    }
    if (status == -1) {
        str = "审核被拒绝";
        return str
    }
    if (status == 1) {
        str = "待审核";
        return str
    }
    if (status == 2) {
        str = "已审核";
        return str
    }
    if (status == 3) {
        str = "已申请付款/待财务付款";
        return str
    }
    if (status == 4) {
        str = "已付款";
        return str
    }
    if (status == 5) {
        str = "已审核";
        return str
    }
    if (status == 6) {
        str = "已入库";
        return str
    }
    if (status == 7) {
        str = "已审核";
        return str
    }
    if (status == 8) {
        str = "待开票";
        return str
    }
    if (status == 9) {
        if (status == 9009) {
            str = "财务回退开票申请";
        } else {
            str = "待财务开票";
        }

        return str
    }
    if (status == 10) {
        str = "已开票";
        return str
    }
    if (status == 11) {
        str = "交易失败";
        return str
    }
    if (status == 12) {
        str = "申请退货";
        return str
    }
    if (status == 13) {
        str = "申请退货店小二审核成功";
        return str
    }
    if (status == 14) {
        str = "申请退货店小二驳回";
        return str
    }
    if (status == 15) {
        str = "销售总监驳回";
        return str
    }
    if (status == 16) {
        str = "申请退货成功";
        return str
    }
    if (status == 99) {
        str = "已回收";
        return str
    }
    return status;
}
export const getbelongCompanyTypeList = (status) => {
        switch (parseInt(status)) {
            case 1:
                return "福建亿钢"
            case 2:
                return "上海闽航"
                case 3:
                return "上海闽航"
                case 4:
                return "上海闽航"
                case 5:
                return "上海闽航"
                case 6:
                return "福建亿钢"
                case 7:
                return "福建亿钢"
            default:
                return status
        }
    }
    //到账单类型
export const getTranType = (status) => {
        switch (parseInt(status)) {
            case 1:
                return "到账"
            case 2:
                return "出账"

            default:
                return ""
        }
    }
    //	到账单状态
export const getDaozhangdanStatus = (status) => {
        switch (parseInt(status)) {
            case 1:
                return "待使用/部分使用"
            case 2:
                    return "已使用再次释放"
            case 6:
                return "二次结算"
            case 8:
                return "使用完"
            case 5:
                return "银行退汇待处理"
            case 54:
                return "银行退汇已处理"
            case 4:
                return "错打款项待处理"
            case 44:
                return "错打款项已处理"
            case 88:
                return "使用完"
            case 99:
                return "已关闭"
            default:
                return ""
        }
    }
    //	到账单入账类型
    export const getDaozhangdanDType = (status) => {
        switch (parseInt(status)) {
            case 0:
                return "未入账"
            case 1:
                    return "已入账"
            default:
                return ""
        }
    }
    //获取是否收货
export const getReceiptStatusLabel = (status) => {
        let a = "";
        if (status) {
            switch (status.toString()) {
                case "1":
                    a = "是";
                    break;
                case "0":
                    a = "否";
                    break;
            }
        }

        return a;
    }
    //是否收票
export const getInvoiceStatusLabel = (status) => {
        let a = "";
        if (status) {

            switch (status.toString()) {
                case "1":
                    a = "是";
                    break;
                case "0":
                    a = "否";
                    break;
            }
        }
        return a;
    }
    //获取zhidan_apply  的jiesuan_status
export const getJiesuanStatus = (status) => {
    switch (parseInt(status)) {
        case 0:
            return "待抵扣"
        case 1:
            return "待制单"
        case 2:
            return "制单完成"
        case 8:
            return "付款成功"
        default:
            return ""
    }
}
//获取账户流水的类型
export const getOrgMoneyRecordType = (status) => {
    switch (parseInt(status)) {
        case 1:
            return "采购订单打款供应商"
        case 2:
            return "销售订单收客户款"
        case 3:
            return "到账单入账"
            case 4:
            return "采购单收货"
            case 5:
            return "销售单出货"
            case 6:
            return "采购单订单抵扣"
            case 7:
            return "采购单录入进项票"
            case 8:
            return "采购单红冲发票记录"
            case 9:
            return "销售单录入销项票"
            case 10:
            return "销售红冲发票记录"
            case 11:
            return "采购订单二次打款或提现"
            case 12:
            return "供应商到账单提现/或客户到账单提现"
            case 13:
            return "销售订单提现记录"
            case 14:
            return "采购单抵扣；用采购单少提货的钱付款给另外的订单"
            case 15:
            return "客户提现"
            case 16:
            return "采购单杂费付款"
            case 17:
            return "销售单杂费付款"
            case 18:
            return "销售单利润欠款"
            case 19:
            return "杂费，订单，付款信息"
        default:
            return status
    }
}

export const daozhangdanCardType = (status) => {
    switch (parseInt(status)) {
        case 1:
            return "福建亿钢|兴业银行卡"
        case 2:
            return "上海闽航|兴业银行卡"
            case 3:
            return "上海闽航|杭州银行"
            case 4:
            return "上海闽航|华瑞银行"
            case 5:
            return "上海闽航|建设银行"
            case 6:
            return "福建亿钢|华瑞银行"
            case 7:
            return "福建亿钢|杭州银行"
        default:
            return ""
    }
}

//制单的类型区分
// 付款的类型1:采购单合同付款2：采购单杂费付款
// 3：客户退款
// 4：供应商退款
export const zhidanTypeLis =(type) =>{
    
    switch (Number(type)) {
        case 1:
            return "采购单合同付款"
            case 2:
            return "采购单杂费付款"
            case 3:
            return "客户退款"
            case 4:
            return "供应商退款"
            case 5:
            return '杂费付款'
        default:
            return type;
    }
} 
//状态的有效还是无效
export const statusStr =(status) =>{
    
    switch (Number(status)) {
        case 1:
            return "有效"
            case 0:
            return "已删除"
        default:
            break;
    }
} 
//发票绑定的状态
export const invoiceSatusStr =(status) =>{
    
    switch (Number(status)) {
        case 1:
            return "已绑定"
            case 0:
            return "未绑定"
            case -1:
            return "未绑定"
        default:
            break;
    }
} 
//杂费的类型状态
export const OMPayInvoiceTypeStr =(status) =>{
    
    switch (Number(status)) {
        case 1:
            return "只打款"
            case 2:
            return "打款并收票"
        default:
            break;
    }
} 

//杂费的计价方式
export const OMTypeListStr =(status) =>{
    
    switch (Number(status)) {
        case 1:
            return "按单"
            case 2:
            return "按吨位"
        default:
            break;
    }
} 

//杂费的税率
export const OMTaxRateListStr =(status) =>{
    
    switch (Number(status)) {
        case 1:
            return "运输费（9.00%）"
            case 2:
            return "加工费（13.00%）"
        case 3:
        return '仓储费（6.00%）'
        default:
            break;
    }
} 

//杂费的状态说明
//0 不可用 1可用 2 申请中 8 已收票
export const OMstatusStr =(status) =>{
    
    switch (Number(status)) {
        case 0:
            return "已删除"
        case 1:
            return "有效"
        case 2:
            return '开票申请中'
        case 8:
            return '已收票'
        default:
            break;
    }
} 
//公司抬头
export const OMst=(status)=>{
    switch (Number(status)) {
        case 1:
            return "福建亿钢"
        case 2:
            return "上海闽航"
        case 0:
            return "全部"
        // case 2:
        //     return '开票申请中'
        // case 8:
        //     return '已收票'
       default:
            return status;
            break;
    }
}
//入库类型 in_stock表 business_type
export const ISBusinessTypeStr =(status) =>{
    switch (Number(status)) {
        case 1:
            return "虚拟入库"
        case 2:
            return "实提入库"
        default:
            break;
    }
}

//杂费列中 付款状态
export const payMoneyStatusStr =(status) =>{
    switch (Number(status)) {
        case 0:
            return "未付款"
        case 8:
            return "已付款"
        default:
            return status;
            break;
    }
}
//利息还是获取
export const lixi =(status) =>{
    switch (Number(status)) {
        case 0:
            return "货物"
        case 1:
            return "利息"
        default:
            return status;
            break;
    }
}
