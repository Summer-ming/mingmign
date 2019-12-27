/*
 * @Description: 
 * @Author: gmm
 * @Date: 2019-08-21 14:44:31
 * @其他: 
 */
import { getUserInfoAdmin } from './../libs/util.js'
import {OMPayInvoiceTypeStr,OMTypeListStr,OMstatusStr,OMst,getInvoiceStatusLabel,getReceiptStatusLabel,lixi} from './../libs/allStatus.js'
const global = {

}
global.testglobal = function() {
    return console.log("引用成功 global");
}
 /**
     * 四舍五入 test
     * arg1乘以arg2的精确结果
     * @param {Object} arg1
     * @param {Object} arg2
     */
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
     * 乘法函数，用来得到精确的乘法结果 test
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
        if(typeof(arg1) != 'number'){
            arg1 = arg1.replace(/\s*/g,"");
        }
        if(typeof(arg2) != 'number'){
            arg2 =  arg2.replace(/\s*/g,"");
        }
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

        return global.accMul((r1 / r2),(Math.pow(10, t2 - t1)))
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
    r3 = global.accMul(-1, arg2);
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
    let a =num.replace(/,/g,'');;
    return a;
};
/**
 * 如果是用来显示的金额，变成千分位金额显示
 */
global.isMoneyShow = function isMoneyShow(m) {
        var s = m;
            s = global.formatCurrency(global.accPrecision(s, 2));
            if(s){

            }else{
                s = '';
            }
        return s;
    }
/**
 * 将千分位显示的金额，变更无千分位的，用来传值
 * 
 */
global.unFormatCurrency =   function unFormatCurrency(num) {
        var strArr = [];
        var returnStr = "";
        strArr = num.split(',');
        for (var i in strArr) {
            returnStr += strArr[i]
        }
        return returnStr;
    };
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
let url = process.env.NODE_ENV === 'development' ? 'http://10.100.16.65:8888/jgerp/' : 'http://120.77.56.107:8888/jgerp/'
// let url = 'http://120.77.56.107:8888/jgerp/';
// let url = 'http://10.100.16.65:8888/jgerp/';

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
    getUserInfo();
};
global.adminInfo = JSON.parse(localStorage.getItem('userInfoErp'),);
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
    sList = sList;//重新赋值，当没有数据之后也不会报错。防止上线后图片没有传值报错
    let returnList = [];
    if (sList.length > 0) {
        for (var i = 0;i< sList.length;i++) {
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
        for (var i = 0;i<arr.length;i++) {
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
//保存打印合同时需要的本公司信息
global.pdfSHItem={//上海抬头
    orgName:'上海市闽航电子商务有限公司',
    address:'上海市宝山区漠河路600号东鼎国际大厦B栋23楼',
    legalPerson:"陈晓龙",
    phone:'021-56169788',//电话
    fax:'021-56167166',//传真
    bankName:'兴业银行长乐支行',
    bankCardNo:'110510100100212500',//银行卡号
    taxNumber:'91310113MA1GKFF17R',//税号
};
global.pdfFJItem={//福建抬头
    orgName:'福建省亿钢电子商务有限公司',
    address:'福建省长乐市首占镇冶金大厦',
    legalPerson:"陈晓龙",
    phone:'021-56169788',//电话
    fax:'021-56167166',//传真
    bankName:'兴业银行长乐支行',
    bankCardNo:'110510100100213405',//银行卡号
    taxNumber:'91350182MA3488PQ3N',//税号
};

global.S4 = function S4() {

    let a = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    return a;
}
global.guidERP =  function guidERP() {
    let a = ("jgerp"+"-"+global.S4()+global.S4()+"-"+global.S4()+"-"+global.S4()+"-"+global.S4()+"-"+global.S4()+global.S4()+global.S4())
    return a;
}
//删除数组中为null的元素，并json格式化，主要用来打印输出 ，方便查找数据
global.deleteArrNull = function deleteArrNull(arr1){
    arr1.map(item =>{
        for(var i in item){
            if(item[i] == null){
                delete item[i]
            }

        }
    })
    return JSON.parse(JSON.stringify(arr1));
}
 /////*
// * 拼接字符串 返回 "'12','12'"形式的字符,传入 "1,2,3"
// */

global.pinjieStr =  function pinjieStr(str){
    var strarr = str.split(",")
    var a = "";
    strarr.map(item => {
        if(a ==""){
			a =  "'"+item+"'"
		}else{
			a = a+ ",'"+item+"'"
		}
    })
	return a;
}

//客户余额 销售单
global.cusPinJieStr =global.pinjieStr("1,3,4,5,11,14,15")//客户余额查询
global.cusFlowPinJieStr =global.pinjieStr("1,3,4,5,11,14,15")//客户流水查询，去除发票
//客户发票
global.cusInvoicePinJieStr =global.pinjieStr("1,3,7,8,9,10,11")//客户票额查询
global.cusInvoiceFlowStr =global.pinjieStr("5,9,10")//客户发票流水查询

//供应商余额 采购单
global.orgPinJieStr =global.pinjieStr("1,3,4,5,14,15")//供应商余额查询
global.orgFlowPinJieStr =global.pinjieStr("1,3,4,5,14,15")//供应商流水查询
//供应商发票
global.orgInvoicePinJieStr =global.pinjieStr("1,3,4,7,8,9,10,11")//供应商票额查询 无用
global.orgInvoiceFlow =global.pinjieStr("4,7,8")//供应商票额查询

//查询流水 公司抬头的筛选
global.OMRBankJgId = function OMRBankJgId(bankJgId){
    if(bankJgId=="1"){//福建
        return global.pinjieStr("1,6,7")
    }else if(bankJgId=="2"){//上海
        return global.pinjieStr("2,3,4,5")
    }
}
//查询福建抬头的流水


//数组去除重复 新的可以使用的
global.uniqueNew = function uniqueNew(arr,key) {//去除重复数组 使用方法 this.$global.uniqueNew(plist,'id')
    const res = new Map();
    return arr.filter((arr) => !res.has(arr[key]) && res.set(arr[key], 1))
    },
//数组去除重复
global.uniqueArr = function uniqueArr(arr,key){
    let res=[];
    let repeat=[];
    for(let i=0;i<arr.length;i++){
    let vueRouterId=arr[i].key;
    if(!repeat[vueRouterId]){
        res.push(arr[i]);
        repeat[vueRouterId]=1
    }
    }
      return res;
    },
    global.uniqueArrSingle = function uniqueArrSingle(baseArr){ 
        var h = {};  //定义一个hash表 
        var arr = []; //定义一个临时数组 
         
        for(var i = 0; i < baseArr.length; i++){  //循环遍历当前数组 
          //对元素进行判断，看是否已经存在表中，如果存在则跳过，否则存入临时数组 
          if(!h[baseArr[i]]){ 
            //存入hash表 
            h[baseArr[i]] = true; 
            //把当前数组元素存入到临时数组中 
            arr.push(baseArr[i]); 
          } 
        } 
        return arr; 
      },  
    //必须传入date对象 返回 2019-10-10
global.getYearMonthDate = function getYearMonthDate(fmt){
    let year = fmt.getFullYear();//年
    let  month = fmt.getMonth()+1;//月
    if(Number(month) <10){
        month = "0"+month;
    }
    let date1 = fmt.getDate();//日
    if(Number(date1)<10){
        date1 = "0" + date1;
    }
    let a = year +'-' +month +'-'+date1;
    return  a;

}
    //用法 let times = this.$global.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");
global.formatDate = function formatDate(date,fmt) { 
    var o = { 
        "M+" : date.getMonth()+1,                 //月份 
        "d+" : date.getDate(),                    //日 
        "h+" : date.getHours(),                   //小时 
        "m+" : date.getMinutes(),                 //分 
        "s+" : date.getSeconds(),                 //秒 
        "q+" : Math.floor((date.getMonth()+3)/3), //季度 
        "S"  : date.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt; 
}
//显示重量，重量四舍五入显示3位小数点
global.vxeTableWeight = function vxeTableWeight({cellValue, row, column}){
    
    return global.accPrecision(cellValue,3);
}
//显示金额 金额四舍五入显示2位小数点
global.vxeTableMoney = function vxeTableMoney({cellValue, row, column}){
    
    return global.isMoneyShow(cellValue);
}
//类型计算
global.vxeType=function vxeType({cellValue, row, column}){
    return OMPayInvoiceTypeStr(cellValue);
}
//计价方式
global.vexJijian=function vexJijian({cellValue, row, column}){
    return OMTypeListStr(cellValue);
}
//状态
global.vexStatus=function vexStatus({cellValue, row, column}){
    return OMstatusStr(cellValue);
}
//公司抬头
global.vexTaiTou=function vexTaiTou({cellValue, row, column}){
    return OMst(cellValue);
}
//是否收票
global.vexShouP=function vexShouP({cellValue, row, column}){
    return getInvoiceStatusLabel(cellValue);
}
//利息还是货物
global.vexLiXi=function vexLiXi({cellValue, row, column}){
    return lixi(cellValue);
}
//是否收货   getReceiptStatusLabel
global.vexShouH=function vexShouH({cellValue, row, column}){
    return getReceiptStatusLabel(cellValue);
}
//下单时间 显示前10位。
global.vexcreateTime=function vexcreateTime({cellValue, row, column}){
    return cellValue.substr(0,10);
}
//深拷贝
global.copyDeep = function  copyDeep(templateData) {
    // templateData 是要复制的数组或对象，这样的数组或者对象就是指向新的地址的
      return JSON.parse(JSON.stringify(templateData));
    }
//去除null 字典中的
global.killNull = function killNull(dic){
    for (var j in dic) {
        if (dic[j] == null) {
            dic[j] = ""
        } 
    }
    return dic;
}
export default global;