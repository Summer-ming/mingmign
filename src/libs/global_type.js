//采购单下单时可以选择的牌号
export const paihaoTypeList = [
    '0',
    '10',
    '12',
    '14*12',
    '16',
    '16*12',
    '18',
    '18*12',
    '18*9',
    '20',
    '20*12',
    '20*9',
    '22',
    '22*12',
    '22*9',
    '25',
    '25*12',
    '25*9',
    '6',
    '8',
    'HBB400',
    'HBR400',
    'HBR400E',
    'HEB400',
    'HEB400E',
    'HPB300',
    'HPB300E',
    'HPB400',
    'HRB300',
    'HRB335',
    'HRB400',
    'HRB400 E',
    'HRB400E',
    'HRB401',
    'HRB401 E',
    'HRB401E',
    'HRB402',
    'HRB402 E',
    'HRB402E',
    'HRB403',
    'HRB403 E',
    'HRB403E',
    'HRB404',
    'HRB404 E',
    'HRB404E',
    'HRB405 E',
    'HRB405E',
    'HRB406 E',
    'HRB406E',
    'HRB407 E',
    'HRB407E',
    'HRB408 E',
    'HRB408E',
    'HRB409E',
    'HRB410E',
    'HRB411E',
    'HRB500',
    'HRB500E',
    'HRE400E',
    'HRE402E',
    'HREB400E',
    'Q195',
    'Q235',
    'Q235B',
    '国标',
    '螺纹400',
    '螺纹400E',
    '螺纹钢400',
    '螺纹钢400E',

];
//采购单下单时可以选择的规格
export const guigeTyoeList = [
    '16',
    '20',
    '20*12',
    '10',
    '10*10',
    '10*12',
    '10*5',
    '10*6',
    '10*7',
    '10*8',
    '10*9',
    '10E',
    '10EY',
    '12',
    '12*',
    '12*12',
    '12*12E',
    '12*8',
    '12*9',
    '12*9E',
    '12E',
    '12ES',
    '14',
    '14*12',
    '14*12E',
    '14*6',
    '14*9',
    '14*9E',
    '14E',
    '14ES',
    '15',
    '16*12',
    '16*12E',
    '16*9',
    '16*9E',
    '16*9E大',
    '16E',
    '18',
    '18*12',
    '18*12E',
    '18*6',
    '18*8',
    '18*9',
    '18*9E',
    '18*9E大',
    '18E',
    '18E*12',
    '18ES',
    '20*12',
    '20*12E',
    '20*9',
    '20*9E',
    '20*9E大',
    '20*9M',
    '20',
    '20E',
    '20E*12',
    '20ES',
    '22',
    '22*12',
    '22*12E',
    '22*9',
    '22*9E',
    '22E',
    '22ES',
    '23',
    '25',
    '25*12',
    '25*12E',
    '25*9',
    '25*9E',
    '25*9E大',
    '25E',
    '25E*12',
    '25ES',
    '26',
    '28',
    '28*12',
    '28*12M',
    '28*9',
    '28*9E',
    '28E',
    '31',
    '32',
    '32*12',
    '32*9',
    '32',
    '32E',
    '6',
    '6.5',
    '6E',
    '6ER',
    '6EY ',
    '8',
    '8 10',
    '8*12',
    '8',
    '8E',
    '8EY ',
    '8、10',
    'A10',
    'A8',
    'E10',
    'E12',
    'E14',
    'E16',
    'E18',
    'E20',
    'E22',
    'E25',
    'E28',
    'E6',
    'E8',
    'ES12',
    'ES14',
    'ES16',
    'ES18',
    'ES20',
    'ES22',
    'HPB10',
    'HPB300',
    'HPB8',
    'HRB400',
    'HRB400E',
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
export const companyCardTypeList = [{
        value: '1',
        label: '兴业银行(福建亿钢)-110510100100213405',
        bankNo: '福建兴业银行',
        bankCode: '110510100100213405'

    },
    {
        value: '2',
        label: '兴业银行(上海闽航)-110510100100212500',
        bankNo: '福建兴业银行',
        bankCode: '110510100100212500'
    }
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
/**
 * 页面长度
 */
export const lengthList = [{
        value: '10',
        label: '10'
    }, {
        value: '20',
        label: '20'
    },
    {
        value: '30',
        label: '30'
    },
    {
        value: '50',
        label: '50'
    },
    {
        value: '100',
        label: '100'
    },
    {
        value: '200',
        label: '200'
    },
    {
        value: '300',
        label: '300'
    },
    {
        value: '500',
        label: '500'
    },
    {
        value: '1000',
        label: '1000'
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
export const belongCompanyList = [{
        value: '1',
        label: '福建亿钢'
    },
    {
        value: '2',
        label: '上海闽航'
    },
];
//供应商 所属公司类型
export const orgCompanyTypeList = [{
    value: '贸易商',
    label: '贸易商'
}, {
    value: '钢厂',
    label: '钢厂'
}];
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