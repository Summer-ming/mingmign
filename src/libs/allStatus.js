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
    //	var status = info.status;
    var str = "";
    status = parseInt(status);
    if (status == 1) {
        str = "待审核";
        return str
    }
    if (status == 2) {
        str = "待付款";
        return str
    }
    if (status == 3) {
        str = "待提货";
        return str
    }
    if (status == 4) {
        str = "待提货";
        return str
    }
    if (status == 5) {
        str = "待提货";
        return str
    }
    if (status == 6) {
        str = "待放货";
        return str
    }
    if (status == 7) {
        str = "待收货";
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

            default:
                return ""
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

        default:
            return ""
    }
}