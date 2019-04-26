import { getUserInfoAdmin } from './../libs/util.js'
const global = {

}
global.testglobal = function() {
    return console.log("引用成功 global");
}
global.accPrecision = function accPrecision(arg1, precision) {
        if (arg1) {
            var r;
            r = Math.round(global.accMul(arg1, Math.pow(10, precision))) / Math.pow(10, precision);
            return r.toFixed(precision);
        } else {
            return ''
        }

    }
    /**
     * 乘法函数，用来得到精确的乘法结果
     * arg1乘以arg2的精确结果
     * @param {Object} arg1
     * @param {Object} arg2
     */
global.accMul = function accMul(arg1, arg2) {
        var m = 0,
            s1 = (new Number(arg1)).toString(),
            s2 = (new Number(arg2)).toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {};
        try {
            m += s2.split(".")[1].length;
        } catch (e) {};
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }
    //除法函数，用来得到精确的除法结果
    //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
    //调用：accDiv(arg1,arg2)
    //返回值：arg1除以arg2的精确结果
global.accDiv = function accDiv(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {};
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {};
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }
    //减法函数，用来得到精确的加法结果
    //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    //调用：accAdd(arg1,arg2)
    //返回值：arg1加上arg2的精确结果
    /**
     * 减法函数,用来得到精确的减法结果
     */
global.accMinus = function accMinus(arg1, arg2) {
    var r1, r2, m, r3, precision, r4, r5;
    r3 = accMul(-1, arg2);
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    };
    try {
        r2 = r3.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    };
    //m=Math.pow(10,Math.max(r1,r2)) ;
    m = Math.pow(10, Math.max(r1, r2));
    precision = Math.max(r1, r2);
    r4 = (arg1 * m + r3 * m) / m;
    r5 = r4.toFixed(precision);
    return r5;
}

/**
 * 数字变千分位 
 * @param {Object} num
 */
global.formatCurrency = function formatCurrency(num) {
        if (num) {
            if ('' == num || isNaN(num)) {
                return num;
            }
            var sign = num.indexOf("-") == 0 ? '-' : '';
            var cents = num.indexOf(".") > 0 ? num.substr(num.indexOf(".")) : '';
            cents = cents.length > 1 ? cents : '';
            num = num.indexOf(".") > 0 ? num.substring(0, (num.indexOf("."))) : num;
            num = num.replace('-', '');
            if ('' == cents) {
                if (num.length > 1 && '0' == num.substr(0, 1)) {
                    return 'Not a Number ! ';
                }
            } else {
                if (num.length > 1 && '0' == num.substr(0, 1)) {
                    return 'Not a Number ! ';
                }
            }
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
            }
            //        处理小数点后的位数,补全0;
            if (cents.length == 2) {
                cents = cents + '0';

            } else if (cents.length == 3) {

            } else if (cents.length == 0) {
                cents = '.00';
            } else {

            }

            return (sign + num + cents);
        }

    }
    //去除千分位
    /**
     * 去除千分位
     * @param {Object} num
     */
global.unFormatCurrency = function unFormatCurrency(num) {
    var strArr = [];
    var returnStr = "";
    strArr = num.split(',');
    for (var i in strArr) {
        returnStr += strArr[i]
    }
    return returnStr;
};
/**
 * 如果是用来显示的金额，变成千分位金额显示
 */
global.isMoneyShow = function isMoneyShow(m) {
        var s = m;
        s = global.formatCurrency(global.accPrecision(s, 2));
        return s;
    }
    //加法函数，用来得到精确的加法结果
    //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    //调用：accAdd(arg1,arg2)
    //返回值：arg1加上arg2的精确结果
    /**
     * 加法函数,用来得到精确的加法结果
     * @param {Object} arg1
     * @param {Object} arg2
     */
global.accAdd = function accAdd(arg1, arg2) {
    var r1, r2, m, r3, r4, precision;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    };
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    };
    m = Math.pow(10, Math.max(r1, r2));
    precision = Math.max(r1, r2);
    r3 = (arg1 * m + arg2 * m) / m;
    r4 = r3.toFixed(precision);
    return r4;
}

/* 
添加一些常用的url 地址，用来显示图片;
 */
// let url = 'http://120.77.56.107:8888/jgerp/';
let url = 'http://10.100.16.65:8888/jgerp/';

global.baseUrl = url;
global.updateImgUrl = url + 'headImgUpload';
global.ossUrl = 'http://jgys.oss-cn-shenzhen.aliyuncs.com/';
// 结束
/**
 * 添加获取登录人的信息;
 * this.$global.adminInfo.cname
 * this.$global.adminInfo.ename
 * this.$global.adminInfo.id
 */
global.getUserInfos = function() {
    console.log("开始获取用户数据")
    getUserInfo();
};
global.adminInfo = JSON.parse(getUserInfoAdmin());
//传入图片数组，返回 插件图片默认数组
//传入参数['img1','img2']
//返回参数[
//     {
//         'name': 'a42bdcc1178e62b4694c830f028db5c0',
//         'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
//     },
//     {
//         'name': 'bc7521e033abdd1e92222d733590f104',
//         'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
//     }
// ]
global.setDefaultImgList = function setDefaultImgList(sList) {
    let returnList = [];

    if (sList.length > 0) {
        for (var i in sList) {
            if (sList[i] != "" && sList[i] != null && sList[i] != "null") {
                let dic = {};
                dic.name = sList[i].replace(global.ossUrl, '');
                dic.url = sList[i];
                dic.status = "finished";
                returnList.push(dic);
            }

        }
    } else {
        return [];
    }

    return returnList;
}

global.getListStr = function getListStr(arr) {
        let rstr = '';
        for (var i in arr) {
            var s = arr[i];
            if (rstr == "") {
                rstr = s;
            } else {
                rstr = rstr + ',' + s
            }
        }
        return rstr;
    }
    //保存的本公司信息，暂时只有 2个 上海闽航对应2 福建亿钢 对应1
global.ourFJOrgItem = {
    cusId: "1",
    orgId: '1',
    orgName: "福建省亿钢电子商务有限公司",
    phone: '11111111111',
    name: '亿钢',
    shopId: '1',
    shopUserId: '1',
    shopName: '福建省亿钢电子商务有限公司店铺'
}
global.ourSHOrgItem = {
    cusId: "2",
    orgId: '2',
    orgName: "上海市闽航电子商务有限公司",
    phone: '22222222222',
    name: '闽航',
    shopId: '2',
    shopUserId: '2',
    shopName: '上海市闽航电子商务有限公司店铺'
}

export default global;