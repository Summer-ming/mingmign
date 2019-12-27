/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-06-11 14:42:39 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-11-21 09:36:49
 */
 //电商线上角色类型，客户还是供应商
 export const transactionTypeList = [
    {
    value: '1',
    label: '客户账单'
},
{
    value: '2',
    label: '供应商账单'
},
];
 //电商线上流水类型
export const onlineBusinessListType = [
    {
    value: '20010',
    label: '合同账单'
},
{
    value: '20020',
    label: '实提账单'
},
{
    value: '20030',
    label: '开票账单'
},
{
    value: '20040',
    label: '红冲账单'
},
{
    value: '20050',
    label: '提现账单'
},
{
    value: '20060',
    label: '抵扣释放账单'
},
{
    value: '20070',
    label: '抵扣账单'
},
{
    value: '20080',
    label: '货齐结算账单'
},
{
    value: '20090',
    label: '退款账单'
},
{
    value: '10010',
    label: '付款账单'
},
{
    value: '10020',
    label: '收款账单'
},
{
    value: '10030',
    label: '实提账单'
},
{
    value: '10040',
    label: '释放账单'
},
{
    value: '10050',
    label: '提现账单'
},
{
    value: '10060',
    label: '抵扣释放账单'
},
{
    value: '10070',
    label: '抵扣账单'
},
{
    value: '10080',
    label: '货齐结算账单'
},
{
    value: '10090',
    label: '退款账单(提现)'
},
{
    value: '10100',
    label: '开票账单'
},
{
    value: '10200',
    label: '红冲账单'
},
];
//采购单状态
export const orderStatusList = [{
    value: '1',
    label: '待审核',
},
{
    value: '2',
    label: '已审核',
},
{
    value: '3',
    label: '已申请付款/待财务付款',
},
{
    value: '4',
    label: '付款成功',
},
{
    value: '6',
    label: '未实提',
},
{
    value: '8',
    label: '已收货未开票',
},
{
    value: '9',
    label: '开票中',
},
{
    value: '10',
    label: '已开票',
},
{
    value: '99',
    label: '已回收',
},

];
//到账单确认有效类型
export const orgTypeList = [{
    value: '1',
    label: '客户'
},
{
    value: '2',
    label: '供应商'
},
];

export const jizhongTypeList=[
    '过磅',
    '理算',
    '抄牌'
]

export const jiesuanStatusList = [
    {
        value: '0',
        label: '待抵扣'
    }, 
    {
        value: '1',
        label: '待制单'
    }, 
    {
        value: '2',
        label: '制单完成'
    }, 
    {
        value: '8',
        label: '付款成功'
    }, 
];
// 采购单下单时可以选择的品名
export const pinminTypeList = [
    '螺纹钢',
    '三级螺纹钢',
    '三级抗震螺纹钢',
    '四级螺纹钢',
    '四级抗震螺纹钢',
    '盘螺',
    '三级盘螺',
    '三级抗震盘螺',
    '线材',
    '高线',
    '工业线材'
];
//采购单下单时可以选择的牌号 材质
export const paihaoTypeList = [
//    螺纹钢材质
'HRB400',
'HRB400E',
'HRB500',
'HRB500E',
//盘螺材质
// HRB400 HRB400E
// 线材材质
'Q195',
'Q235 ',
'HPB300',

];
//采购单下单时可以选择的规格
export const guigeTyoeList = [
   //螺纹钢规格
'10*9',
'12*9',
'14*9',
'16*9',
'18*9',
'20*9',
'22*9',
'25*9',
'28*9',
'32*9',
'10*12',
'12*12',
'14*12',
'16*12',
'18*12',
'20*12',
'22*12',
'25*12',
'28*12',
'32*12',
//盘螺规格
'6',
'8',
'10',
'12',
'14',
//线材规格
'6.5',
// '8',
// '10 ',
// '12',
];

//到账单出入账可惜
export const tranTypeList = [{
        value: '1',
        label: '到账',
    },
    {
        value: '2',
        label: '出账',
    }
];
//到账单状态类型
export const daozhangdanStatusList = [{
        value: '1',
        label: '待使用/部分使用'
    },
    {
        value: '6',
        label: '二次结算'
    },
    {
        value: '8',
        label: '使用完'
    },
    {
        value: '5',
        label: '银行退汇待处理'
    },
    {
        value: '54',
        label: '银行退汇已处理'
    },
    {
        value: '4',
        label: '错打款项待处理'
    },
    {
        value: '44',
        label: '错打款项已处理'
    },
    {
        value: '88',
        label: '使用完'
    },
    {
        value: '99',
        label: '已关闭'
    },

];
//公司银行卡类型
//type  =1是可以制单的卡 2是不可以制单的卡
export const companyCardTypeList = [
    {
        value: '1',
        label: '兴业银行(福建亿钢)-110510100100213405',
        bankNo: '福建兴业银行',
        bankCode: '110510100100213405',
        type:'1'
    },
    {
        value: '6',
        label: '华瑞银行(福建亿钢)-800013333893',
        bankNo: '华瑞银行',
        bankCode: '800013333893',
        bankAddress:"上海华瑞银行",
        type:'2'

    },
    {
        value: '7',
        label: '杭州银行(福建亿钢)-800011265991',
        bankNo: '杭州银行',
        bankCode: '3101040160001639076',
        bankAddress:"上海杨浦支行",
        type:'2'
    },
    {
        value: '2',
        label: '兴业银行(上海闽航)-110510100100212500',
        bankNo: '福建兴业银行',
        bankCode: '110510100100212500',
        type:'1'

    },
    {
        value: '3',
        label: '杭州银行(上海闽航)-3101040160001538773',
        bankNo: '杭州银行',
        bankCode: '3101040160001538773',
        bankAddress:"上海杨浦支行",
        type:'1'
    },
    {
        value: '4',
        label: '华瑞银行(上海闽航)-800011265991',
        bankNo: '华瑞银行',
        bankCode: '800011265991',
        bankAddress:"上海浦东新区支行",
        type:'2'
    },
    {
        value: '5',
        label: '建设银行(上海闽航)-31050168360000001004',
        bankNo: '建设银行',
        bankCode: '31050168360000001004',
        bankAddress:"上海宝钢宝山支行",
        type:'2'
    },
   
];

//采购单类型
export const buyTypeList = [{
        value: '1',
        label: '库存销售单'
    },
    {
        value: '2',
        label: '先销后进单'
    },
    {
        value: '8',
        label: '快速打款单'
    }
];
/***iview page分页使用的数组
 */
 export const lengthListArray = [
10,
15,
20,
30,
50,
100,
200,
300,
500,
1000,
5000,
10000
];
/**
 * 页面长度
 */
export const lengthList = [
    {
        value: 10,
        label: '10'
    },
     {
        value: 15,
        label: '15'
    },
     {
        value: 20,
        label: '20'
    },
    {
        value: 30,
        label: '30'
    },
    {
        value: 50,
        label: '50'
    },
    {
        value: 100,
        label: '100'
    },
    {
        value: 200,
        label: '200'
    },
    {
        value: 300,
        label: '300'
    },
    {
        value: 500,
        label: '500'
    },
    {
        value: 1000,
        label: '1000'
    },
    {
        value: 5000,
        label: '5000'
    },
    {
        value: 10000,
        label: '10000'
    }
];
/**
 * 公司性质
 */
export const companyNatureList = [{
        value: '上市公司',
        label: '上市公司'
    }, {
        value: '民企钢厂',
        label: '民企钢厂'
    }, {
        value: '民企',
        label: '民企'
    },
    {
        value: '国企',
        label: '国企'
    }
];
//公司类型
export const companyTypeList = [{
    value: '终端',
    label: '终端'
}, {
    value: '次终端',
    label: '次终端'
}, {
    value: '代理商',
    label: '代理商'
}, {
    value: '钢厂',
    label: '钢厂'
}, {
    value: '卖场',
    label: '卖场'
}];
//下单时使用的公司名称
export const companyTypeListAllName = [{
        value: '1',
        label: '福建省亿钢电子商务有限公司'
    },
    {
        value: '2',
        label: '上海市闽航电子商务有限公司'
    },

];
//付款申请 所属公司类型
export const belongCompanyList = [
    {
        value: '',
        label: '全部'
    },
    {
        value: '1',
        label: '福建亿钢'
    },
    {
        value: '2',
        label: '上海闽航'
    },
];
//供应商 所属公司类型
export const orgCompanyTypeList = [
    {
    value: '贸易商',
    label: '贸易商'
}, 
{
    value: '钢厂',
    label: '钢厂'
},
{
    value: '物流公司',
    label: '物流公司'
},
{
    value: '物流个人',
    label: '物流个人'
}
];
//付款申请 付款类型
export const payTypeList = [{
    value: '1',
    label: '支票'
}, {
    value: '2',
    label: '转账'
}, {
    value: '3',
    label: '贷记'
}, {
    value: '4',
    label: '电汇'
}, {
    value: '5',
    label: '汇票'
}, {
    value: '6',
    label: '现金'
}, {
    value: '7',
    label: '银行卡'
}, {
    value: '8',
    label: '其他'
}];

//供应商申请时销售品种选择
export const salesVarietiesList = [{
        value: '建筑钢材',
        label: '建筑钢材'
    },
    {
        value: '热轧板卷',
        label: '热轧板卷'
    },
    {
        value: '带钢',
        label: '带钢'
    },
    {
        value: '管材',
        label: '管材'
    },
    {
        value: '尤特钢',
        label: '尤特钢'
    },
    {
        value: '钢坯(钢锭)',
        label: '钢坯(钢锭)'
    },
    {
        value: '不锈钢',
        label: '不锈钢'
    },
];

//杂费计价方式的类型
export const OMTypeList = [{
    value: '1',
    label: '按单'
},
{
    value: '2',
    label: '按吨位'
},

];
//杂费的税率类型
export const OMTaxRateList = [{
    value: '1',
    label: '运输费（9.00%）'
},
{
    value: '2',
    label: '加工费（13.00%）'
},
{
    value: '3',
    label: '仓储费（6.00%）'
},
];
//杂费是否需要打款与收票
export const OMPayInvoiceType = [
    {
    value: '1',
    label: '只打款'
},
{
    value: '2',
    label: '打款并收票'
},
];
//用来内部划转的银行卡数据
//type =1 ，既可以打款也可以收款，type=2 只可以收款
//本数组 只用来 在内部划转的时候使用
export const companyCardTypeListNew = [
    //上面是上海的银行卡4张
    {
    value:'2',
    label:'上海闽航,兴业银行长乐支行,2500',//用来下拉框显示的内容
     companyName:'上海市闽航电子商务有限公司',//公司名称
     cardNoValue:"110510100100212500",//付款卡号
     branchFullName:"兴业银行长乐支行",//银行支行名称
     bankName:'兴业银行',//银行名称
     serialNumber:'309391000038',//支付行号
     province:"福建省",//省
     city:'长乐市',//市
     area:'长乐区',//区
     bankCode:'CIB',//银行缩写简称
     type:'1'//类型
},
{
    value:'4',
    label:'上海闽航,上海华瑞银行,5991',//用来下拉框显示的内容
     companyName:'上海市闽航电子商务有限公司',//公司名称
     cardNoValue:"800011265991",//付款卡号
     cardNoStr:'8000 1126 5991',//付款卡号，用来显示的
     branchFullName:"上海华瑞银行",//银行支行名称
     bankName:'上海华瑞银行',//银行名称
     serialNumber:'323290000016',//支付行号
     province:"上海市",//省
     city:'上海市',//市
     area:'浦东新区',//区
     bankCode:'AAA',//银行缩写简称
     type:'2'//类型
},
{
    value:'3',
    label:'上海闽航,杭州银行上海杨浦支行,8773',//用来下拉框显示的内容
     companyName:'上海市闽航电子商务有限公司',//公司名称
     cardNoValue:"3101040160001538773",//付款卡号
     cardNoStr:'3101 0401 6000 1538 773',//付款卡号，用来显示的
     branchFullName:"杭州银行股份有限公司上海杨浦支行",//银行支行名称
     bankName:'杭州银行',//银行名称
     serialNumber:'313290030021',//支付行号
     province:"上海市",//省
     city:'上海市',//市
     area:'杨浦区',//区
     bankCode:'AAA',//银行缩写简称
     type:'1'//类型
},
{
    value:'5',
    label:'上海闽航,建设银行上海宝钢宝山支行,1004',//用来下拉框显示的内容
     companyName:'上海市闽航电子商务有限公司',//公司名称
     cardNoValue:"31050168360000001004",//付款卡号
     cardNoStr:'3105 0168 3600 0000 1004',//付款卡号，用来显示的
     branchFullName:"中国建设银行股份有限公司上海宝钢宝山支行",//银行支行名称
     bankName:'中国建设银行',//银行名称
     serialNumber:'105290068000',//支付行号
     province:"上海市",//省
     city:'上海市',//市
     area:'宝山区',//区
     bankCode:'AAA',//银行缩写简称
     type:'2'//类型
},
//下面是福建的银行卡 3张
{
    value:'1',
    label:'福建亿钢,兴业银行长乐支行,3405',//用来下拉框显示的内容
     companyName:'福建省亿钢电子商务有限公司',//公司名称
     cardNoValue:"110510100100213405",//付款卡号
     cardNoStr:'1105 1010 0100 2134 05',//付款卡号，用来显示的
     branchFullName:"兴业银行长乐支行",//银行支行名称
     bankName:'兴业银行',//银行名称
     serialNumber:'309391000038',//支付行号
     province:"福建省",//省
     city:'长乐市',//市
     area:'长乐区',//区
     bankCode:'CIB',//银行缩写简称
     type:'1'//类型
},
{
    value:'6',
    label:'福建亿钢,上海华瑞银行,3893',//用来下拉框显示的内容
     companyName:'福建省亿钢电子商务有限公司',//公司名称
     cardNoValue:"800013333893",//付款卡号
     cardNoStr:'8000 1333 3893',//付款卡号，用来显示的
     branchFullName:"上海华瑞银行",//银行支行名称
     bankName:'上海华瑞银行',//银行名称
     serialNumber:'323290000016',//支付行号
     province:"上海市",//省
     city:'上海市',//市
     area:'浦东新区',//区
     bankCode:'AAA',//银行缩写简称
     type:'2'//类型
},
{
    value:'7',
    label:'福建亿钢,杭州银行上海杨浦支行,9076',//用来下拉框显示的内容
     companyName:'福建省亿钢电子商务有限公司',//公司名称
     cardNoValue:"3101040160001639076",//付款卡号
     cardNoStr:'3101 0401 6000 1639 076',//付款卡号，用来显示的
     branchFullName:"杭州银行股份有限公司上海杨浦支行",//银行支行名称
     bankName:'杭州银行',//银行名称
     serialNumber:'313290030021',//支付行号
     province:"上海市",//省
     city:'上海市',//市
     area:'杨浦区',//区
     bankCode:'AAA',//银行缩写简称
     type:'2'//类型
},

]
//入库类型 in_stock表 business_type
export const ISBusinessTypeList = [
    {
    value: '1',
    label: '虚拟入库'
},
{
    value: '2',
    label: '实提入库'
},
];
//杂费表的付款状态 payMoneyStatus
export const payMoneyStatusList = [
    {
        value: '',
        label: '全部'
    },
    {
    value: '0',
    label: '未付款'
},
{
    value: '8',
    label: '已付款'
},
];
//新增杂费时的待选择框
export const otherMoneyNameList = [
    //卸车开头
    {
        value: '1',
        label: '卸力费'
    },
    {
        value: '1',
        label: '卸签'
    },
    {
        value: '1',
        label: '卸车费'
    },
    {
        value: '1',
        label: '卸车费+杂费+出库费'
    },
    {
        value: '1',
        label: '卸车费+运费'
    },
    {
        value: '1',
        label: '卸车费+杂费'
    },
    {
        value: '1',
        label: '车费'
    },
    {
        value: '1',
        label: '车费'
    },
    {
        value: '1',
        label: '车费'
    },
    {
        value: '1',
        label: '车费'
    },
    {
        value: '1',
        label: '车费'
    }
];