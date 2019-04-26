/** 
 * 获取付款申请页面
 * 状态的字段含义
 */
export const getBuyTypeLabel = (status) => {
        let a = "";
        switch (status.toString()) {
            case "1":
                a = "库存销售单";
                break;
            case "2":
                a = "先销后进单";
                break;
            case "8":
                a = "快速打款单";
                break;
            default:
                a = "";
                break;
        }
        return a;
    }
    /** 
     * 获取付款申请页面
     * 状态的字段含义
     */
export const getPayTypeValue = (status) => {
    let a = "";
    switch (status.toString()) {
        case "1":
            a = "待审核";
            break;
        case "20000":
            a = "待财务审核";
            break;
        case "30000":
            a = "审核通过";
            break;
        default:
            a = "";
            break;
    }
    return a;
}

export const getPayTypeValueColor = (status) => {
    let a = "";
    switch (status.toString()) {
        case "1":
            a = "error";
            break;
        case "20000":
            a = "primary";
            break;
        case "30000":
            a = "success";
            break;
        default:
            a = "";
            break;
    }
    return a;
}