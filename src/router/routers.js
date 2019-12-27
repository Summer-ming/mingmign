/*
 * @Description: 
 * @Author: gmm
 * @Date: 2019-08-12 16:47:59
 * @其他: 
 */
import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () =>
            import ('@/view/login/login.vue')
    }, //登录
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [{
            path: '/home',
            name: 'home',
            meta: {
                hideInMenu: false,
                title: '首页',
                notCache: true
            },
            component: () =>
                import ('@/view/single-page/home')
        }]
    }, //默认启动页-home
    { //TODO
        path: '/customer_manager',
        name: 'customer_manager',
        meta: {
            hideInMenu: getIsHide("customer_manager"),
            icon: 'ios-aperture',
            title: '客户管理',
            showAlways:true,
            notCache: false
        },
        component: Main,
        children: [
            {
                path: 'customerlist',
                name: 'customerlist',
                meta: {
                    icon: "md-cube",
                    title: "客户列表",
                    hideInMenu:getIsHide("customerlist"),
                    notCache:false,
                },
                component: () =>
                    import ('@/view/customer_manager/customerlist.vue')
            },
            {
                path: 'supplierList',
                name: 'supplierList',
                meta: {
                    icon: "md-cube",
                    title: "供应商管理",
                    hideInMenu:getIsHide("supplierList"),
                    notCache:false,
                },
                component: () =>
                    import ('@/view/customer_manager/supplierList.vue')
            },
            {
                path: 'shopList',
                name: 'shopList',
                meta: {
                    icon: "md-cube",
                    title: "店铺管理",
                    hideInMenu:getIsHide("shopList"),
                    notCache:false,

                },
                component: () =>
                    import ('@/view/customer_manager/shopList.vue')
            },
            {
                path: 'xiangmu',
                name: 'xiangmu',
                meta: {
                    icon: 'md-funnel',
                    title: '工程名称管理',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/customer_manager/xiangmu.vue')
            },
            {
                path: 'xiangDetail',
                name: 'xiangDetail',
                meta: {
                    icon: 'md-funnel',
                    title: '工程名称详情',
                    notCache:true,
                    hideInMenu: true,

                },
                component: () =>
                    import ('@/view/customer_manager/xiangDetail.vue')
            },
            // {
            //     path: 'user_agent',
            //     name: 'user_agent',
            //     meta: {
            //         icon: "md-cube",
            //         title: "代理商管理",
            //         hideInMenu:getIsHide("user_agent"),

            //     },
            //     component: () =>
            //         import ('@/view/customer_manager/user_agent.vue')
            // },
            //tiXianShenHe 提现审核
            {
                path: 'tiXianShenHe',
                name: 'tiXianShenHe',
                meta: {
                    icon: "md-cube",
                    title: "提现审核",
                    hideInMenu:getIsHide("tiXianShenHe"),
                    notCache:true,

                },
                component: () =>
                    import ('@/view/customer_manager/tiXianShenHe.vue')
            },
            {
                path: 'supplierList_add',
                name: 'supplierList_add',
                meta: {
                    icon: "md-cube",
                    title: "供应商详情",
                    hideInMenu: true,
                   notCache: false

                },
                component: () =>
                    import ('@/view/customer_manager/supplierList_add.vue')
            },
            {
                path: 'shopListInfo',
                name: 'shopListInfo',
                meta: {
                    icon: "md-cube",
                    title: "店铺详情",
                    hideInMenu: true,
                   notCache: false

                },
                component: () =>
                    import ('@/view/customer_manager/shopListInfo.vue')
            },
            {
                path: 'org_bankAccount',
                name: 'org_bankAccount',
                meta: {
                    icon: "md-cube",
                    title: "银行卡详情",
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/customer_manager/org_bankAccount.vue')
            },

        ]
    }, //客户管理
    { //TODO
        path: '/buy_manager',
        name: 'buy_manager',
        meta: {
            hide: true,
            icon: 'ios-aperture',
            title: '采购管理',
            hideInMenu:getIsHide("buy_manager"),
            showAlways:true,
            notCache:false,
        },
        component: Main,
        children: [
            {
                path: 'buy_order_list',
                name: 'buy_order_list',
                meta: {
                    icon: "md-cube",
                    title: "采购单列表",
                    hideInMenu:getIsHide("buy_order_list"),
                    notCache:false,

                },
                component: () =>
                    import ('@/view/buy_manager/buy_order_list.vue')
            },
            // {
            //     path: 'MyTable',
            //     name: 'MyTable',
            //     meta: {
            //         icon: "md-cube",
            //         title: "采购单列表2222",
            //         hideInMenu:getIsHide("MyTable"),
            //         notCache:false,

            //     },
            //     component: () =>
            //         import ('@/view/buy_manager/MyTable.vue')
            // },
           
            {
                path: 'add_order_delivery_actual',
                name: 'add_order_delivery_actual',
                meta: {
                    icon: "md-cube",
                    title: "采购单入库",
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/buy_manager/add_order_delivery_actual.vue')
            },
            //入账
            {
                path: 'buy_order_pay_info',
                name: 'buy_order_pay_info',
                meta: {
                    icon: "md-cube",
                    title: "采购单入账",
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/buy_manager/buy_order_pay_info.vue')
            },
            {
                path: 'review_order_list',
                name: 'review_order_list',
                meta: {
                    icon: "md-cube",
                    title: "审核采购单",
                    hideInMenu:getIsHide("review_order_list"),
                    notCache:true,

                },
                component: () =>
                    import ('@/view/buy_manager/review_order_list.vue')
            },
            {
                path: 'buy_cai_order_list',
                name: 'buy_cai_order_list',
                meta: {
                    icon: "md-cube",
                    title: "采购明细查询",
                    hideInMenu:getIsHide("buy_cai_order_list"),
                    notCache:false,

                },
                component: () =>
                    import ('@/view/buy_manager/buy_cai_order_list.vue')
            },
            {
                path: 'review_order_info',
                name: 'review_order_info',
                meta: {
                    icon: "md-cube",
                    title: "审核采购单详情",
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/buy_manager/review_order_info.vue')
            },
            {
                path: 'order_pay_info',
                name: 'order_pay_info',
                meta: {
                    icon: "md-cube",
                    title: "采购单申请付款",
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/buy_manager/order_pay_info.vue')
            },
            {
                path: 'order_om_pay_info',
                name: 'order_om_pay_info',
                meta: {
                    icon: "md-cube",
                    title: "采购单申请杂费付款",
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/buy_manager/order_om_pay_info.vue')
            },
            {
                path: 'order_buy_info',
                name: 'order_buy_info',
                meta: {
                    icon: "md-cube",
                    title: "采购单详情",
                    hideInMenu: true,
                   notCache: true
                },
                component: () =>
                    import ('@/view/buy_manager/order_buy_info.vue')
            },
            {
                path: 'buy_order_change_info',
                name: 'buy_order_change_info',
                meta: {
                    icon: "md-cube",
                    title: "修改采购单",
                    hideInMenu: true,
                    notCache: true
                },
                component: () =>
                    import ('@/view/buy_manager/buy_order_change_info.vue')
            },
            //测试使用
            {
                path: 'buy_order_change_info1',
                name: 'buy_order_change_info1',
                meta: {
                    icon: "md-cube",
                    title: "修改采购单明细",
                    hideInMenu: true,
                    notCache: true
                },
                component: () =>
                    import ('@/view/buy_manager/buy_order_change_info1.vue')
            },
            {
                path: 'buy_order_change_Oinfo',
                name: 'buy_order_change_Oinfo',
                meta: {
                    icon: "md-cube",
                    title: "修改采购单基础信息",
                    hideInMenu: true,
                    notCache: true
                },
                component: () =>
                    import ('@/view/buy_manager/buy_order_change_Oinfo.vue')
            },
            {
                path: 'add_order_new',
                name: 'add_order_new',
                meta: {
                    icon: "md-cube",
                    title: "新增采购单",
                    hideInMenu: true,
                    notCache: false
                },
                component: () =>
                    import ('@/view/buy_manager/add_order_new.vue')
            },
            {
                path: 'add_order_new_noInfo',
                name: 'add_order_new_noInfo',
                meta: {
                    icon: "md-cube",
                    title: "新增快速打款单",
                    hideInMenu: true,
                    notCache: true
                },
                component: () =>
                    import ('@/view/buy_manager/add_order_new_noInfo.vue')
            },
            {
                path: 'kaiPiao',
                name: 'kaiPiao',
                meta: {
                    icon: "md-cube",
                    title: "开票申请",
                    hideInMenu: true,
                    notCache: true
                },
                component: () =>
                    import ('@/view/buy_manager/kaiPiao.vue')
            }, //kaiPiao
            {
                path: 'add_order_new_byInfo',
                name: 'add_order_new_byInfo',
                meta: {
                    icon: "md-cube",
                    title: "新增先销待采单",
                    hideInMenu: true,
                    notCache: true
                },
                component: () =>
                    import ('@/view/buy_manager/add_order_new_byInfo.vue')
            }, //kaiPiao
            {
                path: 'buy_order_change_delivery_actual',
                name: 'buy_order_change_delivery_actual',
                meta: {
                    icon: "md-cube",
                    title: "修改采购单实提信息",
                    hideInMenu: true,
                    notCache: true
                },
                component: () =>
                    import ('@/view/buy_manager/buy_order_change_delivery_actual.vue')
            },
        ]
    }, //采购管理

    {
        path: '/sell_manager',
        name: 'sell_manager',
        meta: {
            icon: 'md-calculator',
            title: '销售管理',
            showAlways:true,
            notCache:false,
        },
        component: Main,
        children: [{
                path: 'sell_order_list',
                name: 'sell_order_list',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单列表',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_list.vue')
            },//sell_xiao_search
         
            {
                path: 'sell_order_info',
                name: 'sell_order_info',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单明细',
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_info.vue')
            },
            {
                path: 'sell_order_review_list',
                name: 'sell_order_review_list',
                meta: {
                    icon: 'md-calculator',
                    title: '审核销售单',
                    notCache:true,
                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_review_list.vue')
            },
            {
                path: 'sell_xiao_search',
                name: 'sell_xiao_search',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单明细查询',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/sell_manager/sell_xiao_search.vue')
            },
            {
                path: 'sell_xiao_interest_list',
                name: 'sell_xiao_interest_list',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单Tree查询11',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/sell_manager/sell_xiao_interest_list.vue')
            },
          
            // 新增杂费列表
            {
                path: 'zaFei',
                name: 'zaFei',
                meta: {
                    icon: 'md-calculator',
                    title: '杂费列表',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/sell_manager/zaFei.vue')
            },
            {
                path: 'sell_order_review_info',
                name: 'sell_order_review_info',
                meta: {
                    icon: 'md-calculator',
                    title: '审核销售单明细',
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_review_info.vue')
            },
            {
                path: 'add_sell_order',
                name: 'add_sell_order',
                meta: {
                    icon: 'md-calculator',
                    title: '新增库存销售单',
                    hideInMenu: true,
                   notCache: false

                },
                component: () =>
                    import ('@/view/sell_manager/add_sell_order.vue')
            },
           
            {
                path: 'add_sell_order_excel',
                name: 'add_sell_order_excel',
                meta: {
                    icon: 'md-calculator',
                    title: '新增先销后进单',
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/add_sell_order_excel.vue')
            },
            {
                path: 'sell_order_pay_info',
                name: 'sell_order_pay_info',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单确认收款',
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_pay_info.vue')
            },
            {
                path: 'sell_order_with_order_pay_info',
                name: 'sell_order_with_order_pay_info',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单订单确认收款',
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_with_order_pay_info.vue')
            },
            {
                path: 'sell_order_change_info',
                name: 'sell_order_change_info',
                meta: {
                    icon: 'md-calculator',
                    title: '修改销售单',
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_change_info.vue')
            },
            {
                path: 'sell_order_change_oinfo',
                name: 'sell_order_change_oinfo',
                meta: {
                    icon: 'md-calculator',
                    title: '修改销售单明细',
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_change_oinfo.vue')
            },
            {
                path: 'sell_order_change_oinfo_vxeTable',
                name: 'sell_order_change_oinfo_vxeTable',
                meta: {
                    icon: 'md-calculator',
                    title: '修改销售单明细',
                    hideInMenu: true,
                   notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_change_oinfo_vxeTable.vue')
            },
            {
                path: 'sell_order_changeActual',
                name: 'sell_order_changeActual',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单录实提',
                    hideInMenu: true,
                    notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_changeActual.vue')
            },
            //测试
            {
                path: 'sell_order_changeActual1',
                name: 'sell_order_changeActual1',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单录实提',
                    hideInMenu: true,
                    notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_changeActual1.vue')
            },
            {
                path: 'sell_order_addOrgMoneyRecord',
                name: 'sell_order_addOrgMoneyRecord',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单确认出货',
                    hideInMenu: true,
                    notCache: true

                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_addOrgMoneyRecord.vue')
            },
            {
                path: 'sell_order_kaiPiao',
                name: 'sell_order_kaiPiao',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单开票申请',
                    hideInMenu: true,
                    notCache: true
                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_kaiPiao.vue')
            },
            {
                path: 'sell_order_om_pay_info',
                name: 'sell_order_om_pay_info',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单杂费付款申请',
                    hideInMenu: true,
                    notCache: true
                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_om_pay_info.vue')
            },
            
        ]
    }, //销售管理
    {
        path: '/stock',
        name: 'stock',
        meta: {
            icon: 'md-menu',
            title: '库存管理',
            showAlways: true,
            notCache:true,
        },
        component: Main,
        children: [{
                path: 'stock_manager',
                name: 'stock_manager',
                meta: {
                    icon: 'md-funnel',
                    title: '仓库管理',
                    notCache:true,
                    
                },
                component: () =>
                    import ('@/view/stock/stock_manager.vue')
            },
            {
                path: 'in_stock_list',
                name: 'in_stock_list',
                meta: {
                    icon: 'md-funnel',
                    title: '库存列表',
                    notCache:true,
                },
                component: () =>
                    import ('@/view/stock/in_stock_list.vue')
            },

        ]

    }, //库存管理
    {
        path: '/financial_management',
        name: 'financial_management',
        meta: {
            icon: 'md-calculator',
            title: '财务管理',
            showAlways:true,
            notCache:false,
        },
        component: Main,
        children: [
            {
                path: 'buy_order_payment_list',
                name: 'buy_order_payment_list',
                meta: {
                    icon: 'md-calculator',
                    title: '采购单付款抵扣列表',
                    notCache:true,
                },
                component: () =>
                    import ('@/view/financial_management/buy_order_payment_list.vue')
            },
            {
                path: 'buy_order_pay_online',
                name: 'buy_order_pay_online',
                meta: {
                    icon: 'md-calculator',
                    title: '线上制单付款',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/financial_management/buy_order_pay_online.vue')
            },

            //新增线上制单
            {
                path: 'buy_new_online',
                name: 'buy_new_online',
                meta: {
                    icon: 'md-calculator',
                    title: '公司内部划转金额',
                    notCache:true,
                },
                component: () =>
                    import ('@/view/financial_management/buy_new_online.vue')
            },
            {
                path: 'daozhangdan_summary',
                name: 'daozhangdan_summary',
                meta: {
                    icon: 'md-calculator',
                    title: '到账单汇总',
                    notCache:true,
                },
                component: () =>
                    import ('@/view/financial_management/daozhangdan_summary.vue')
            },

            {
                path: 'jieSuo',
                name: 'jieSuo',
                meta: {
                    icon: 'md-calculator',
                    title: '已对账订单解锁',
                    notCache:true,
                },
                component: () =>
                    import ('@/view/financial_management/jieSuo.vue')
            },
            // {
            //     path: 'daozhangdan_fj',
            //     name: 'daozhangdan_fj',
            //     meta: {
            //         icon: 'md-calculator',
            //         title: '福建亿钢到账单管理',
            //         notCache:true,
            //     },
            //     component: parentView,
            //     children: [{
            //             path: 'daozhangdanFJ_List',
            //             name: 'daozhangdanFJ_List',
            //             meta: {
            //                 icon: 'md-funnel',
            //                 title: '到账单列表(福建亿钢)',
            //                 notCache:true,
            //             },
            //             component: () =>
            //                 import ('@/view/financial_management/daozhangdan_fj/daozhangdanFJ_List.vue')
            //         },
            //         {
            //             path: 'daozhangdanFJ_backList',
            //             name: 'daozhangdanFJ_backList',
            //             meta: {
            //                 icon: 'md-funnel',
            //                 title: '回退到账单列表(福建亿钢)',
            //                 notCache:true,
            //             },
            //             component: () =>
            //                 import ('@/view/financial_management/daozhangdan_fj/daozhangdanFJ_backList.vue')
            //         },
            //         {
            //             path: 'chuzhangdanFJ_List',
            //             name: 'chuzhangdanFJ_List',
            //             meta: {
            //                 icon: 'md-funnel',
            //                 title: '出账单列表(福建亿钢)',
            //                 notCache:true,
            //             },
            //             component: () =>
            //                 import ('@/view/financial_management/daozhangdan_fj/chuzhangdanFJ_List.vue')
            //         },
            //     ]
            // },
            // {
            //     path: 'daozhangdan_sh',
            //     name: 'daozhangdan_sh',
            //     meta: {
            //         icon: 'md-calculator',
            //         title: '上海闽航到账单管理',
            //         notCache:true,
            //     },
            //     component: parentView,
            //     children: [
            //         {
            //             path: 'daozhangdanSH_List',
            //             name: 'daozhangdanSH_List',
            //             meta: {
            //                 icon: 'md-funnel',
            //                 title: '到账单列表(上海闽航)',
            //                 notCache:true,
            //             },
            //             component: () =>
            //                 import ('@/view/financial_management/daozhangdan_sh/daozhangdanSH_List.vue')
            //         },
            //         {
            //             path: 'daozhangdanSH_backList',
            //             name: 'daozhangdanSH_backList',
            //             meta: {
            //                 icon: 'md-funnel',
            //                 title: '回退到账单列表(上海闽航)',
            //                 notCache:true,
            //             },
            //             component: () =>
            //                 import ('@/view/financial_management/daozhangdan_sh/daozhangdanSH_backList.vue')
            //         },
            //         {
            //             path: 'chuzhangdanSH_List',
            //             name: 'chuzhangdanSH_List',
            //             meta: {
            //                 icon: 'md-funnel',
            //                 title: '出账单列表(上海闽航)',
            //                 notCache:true,
            //             },
            //             component: () =>
            //                 import ('@/view/financial_management/daozhangdan_sh/chuzhangdanSH_List.vue')
            //         },
            //     ]
            // },
            {
                path: 'invoice_manage',
                name: 'invoice_manage',
                meta: {
                    icon: 'md-calculator',
                    title: '发票管理',
                    notCache:true,
                },
                component: parentView,
                children: [{
                        path: 'invoice_in_list',
                        name: 'invoice_in_list',
                        meta: {
                            icon: 'md-funnel',
                            title: '进项票列表',
                            notCache:true,
                        },
                        component: () =>
                            import ('@/view/financial_management/invoice_manage/invoice_in_list.vue')
                    },
                    {
                        path: 'invoice_out_list',
                        name: 'invoice_out_list',
                        meta: {
                            icon: 'md-funnel',
                            title: '销项票列表',
                            notCache:true,
                        },
                        component: () =>
                            import ('@/view/financial_management/invoice_manage/invoice_out_list.vue')
                    },
                ]
            },
            // {
            //     path: 'invoice_out_list_MH',
            //     name: 'invoice_out_list_MH',
            //     meta: {
            //         icon: 'md-funnel',
            //         title: '销项票开票列表(闽航)'
            //     },
            //     component: () =>
            //         import ('@/view/financial_management/invoice_out_list_MH.vue')
            // },
            // {
            //     path: 'invoice_out_list_FJ',
            //     name: 'invoice_out_list_FJ',
            //     meta: {
            //         icon: 'md-funnel',
            //         title: '销项票开票列表(亿钢)'
            //     },
            //     component: () =>
            //         import ('@/view/financial_management/invoice_out_list_FJ.vue')
            // },
            //entry_out_list_MH
            {
                path: 'entry_out_list_MH',
                name: 'entry_out_list_MH',
                meta: {
                    icon: 'md-funnel',
                    title: '进项票收票列表',
                    notCache:true,
                },
                component: () =>
                    import ('@/view/financial_management/entry_out_list_MH.vue')
            },
            //invoice_out_list1_MH  新的销项票列表
            {
                path: 'invoice_out_list1_MH',
                name: 'invoice_out_list1_MH',
                meta: {
                    icon: 'md-funnel',
                    title: '销项票开票列表',
                    notCache:true,
                },
                component: () =>
                    import ('@/view/financial_management/invoice_out_list1_MH.vue')
            },
            {
                path: 'invoice_omoney_list',
                name: 'invoice_omoney_list',
                meta: {
                    icon: 'md-funnel',
                    title: '杂费收票列表',
                    notCache:true,
                },
                component: () =>
                    import ('@/view/financial_management/invoice_omoney_list.vue')
            },
            {
                path: 'invoice_omoney_list_info',
                name: 'invoice_omoney_list_info',
                meta: {
                    icon: 'md-funnel',
                    title: '杂费申请明细',
                    notCache:true,
                    hideInMenu:true
                },
                component: () =>
                    import ('@/view/financial_management/invoice_omoney_list_info.vue')
            },
            {
                path: 'bank_balance',
                name: 'bank_balance',
                meta: {
                    icon: 'md-calculator',
                    title: '银行卡余额',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/report_management/bank_balance.vue')
            },


        ]
    }, //财务管理
    {
        path: '/buy',
        name: 'buy',
        meta: {
            icon: 'md-calculator',
            title: '报表-采购',
            notCache:false,
            showAlways:false,
        },
        component: Main,
        children:[
             //供应商余额
                    {
                        path: '/buy/Supplier_balance',
                        name: '/buy/Supplier_balance',
                        meta: {
                            icon: 'md-calculator',
                            title: '供应商余额',
                            notCache:false,
                            showAlways:false,
                        },
                        component: parentView,
                        children: [
                            {
                                path: '/buy/Supplier_balance/Supplier_business',
                                name: '/buy/Supplier_balance/Supplier_business',
                                meta: {
                                    icon: 'md-funnel',
                                    title: '供应商业务余额',
                                    notCache:false,
                                },
                                component: () =>
                                    import ('@/view/buy/Supplier_balance/Supplier_business.vue')
                            },
                            {
                                path: 'Supplier_contacts',
                                name: 'Supplier_contacts',
                                meta: {
                                    icon:'md-calculator',
                                    title: '供应商业务往来表',
                                    notCache:false,
                                },
                                component: () =>
                                    import ('@/view/buy/Supplier_balance/Supplier_contacts.vue')
                            },
                            {
                                path: 'Supplier_Finance',
                                name: 'Supplier_Finance',
                                meta: {
                                    icon: 'md-calculator',
                                    title: '供应商财务票额表',
                                    notCache:false,
                                },
                                component: () =>
                                    import ('@/view/buy/Supplier_balance/Supplier_Finance.vue')
                            },
                            {
                                path: 'Supplier_invoice_contacts',
                                name: 'Supplier_invoice_contacts',
                                meta: {
                                    icon:'md-calculator',
                                    title: '供应商票额往来表',
                                    notCache:false,
                                },
                                component: () =>
                                    import ('@/view/buy/Supplier_balance/Supplier_invoice_contacts.vue')
                            },
                            {
                                path: 'supplierMoneyInfo',
                                name: 'supplierMoneyInfo',
                                meta: {
                                    icon:'md-calculator',
                                    title: '供应商业务余额组成表',
                                    notCache:false,
                                    hideInMenu: true
                                },
                                component: () =>
                                    import ('@/view/buy/Supplier_balance/supplierMoneyInfo.vue')
                            },

                            {
                                path: 'appPlay',
                                name: 'appPlay',
                                meta: {
                                    icon:'md-calculator',
                                    title: '供应商业务余额组成',
                                    notCache:true,
                                    hideInMenu: true
                                },
                                component: () =>
                                    import ('@/view/buy/Supplier_balance/appPlay.vue')
                            },
                        ]
                    },
                    {
                        path: 'buy_order_summary_list',
                        name: 'buy_order_summary_list',
                        meta: {
                            icon: 'md-calculator',
                            title: '采购单汇总',
                            notCache:false,
                        },
                        component: () =>
                            import ('@/view/buy/buy_order_summary_list.vue')
                    },
                    {
                        path: 'buy_order_info_list',
                        name: 'buy_order_info_list',
                        meta: {
                            icon: 'md-calculator',
                            title: '采购明细表',
                            notCache:false,
                        },
                        component: () =>
                            import ('@/view/buy/buy_order_info_list.vue')
                    },
                 
                    {
                        path: 'buy_engineer_sum_list',
                        name: 'buy_engineer_sum_list',
                        meta: {
                            icon: 'md-calculator',
                            title: '采购单工程汇总',
                            notCache:false,
                        },
                        component: () =>
                            import ('@/view/buy/buy_engineer_sum_list.vue')
                    },
     //供应商余额
     
        ] 
    },
    {
        path: '/sell',
        name: 'sell',
        meta: {
            icon: 'md-calculator',
            title: '报表-销售',
            notCache:false,
            hideInMenu: false,
            showAlways:true,
            
        },
        component: Main,
        children:[
            {
                path: '/sell/Customer_balance',
                name: '/sell/Customer_balance',
                meta: {
                    icon: 'md-calculator',
                    title: '客户余额',
                    notCache:false,
                    showAlways:true,
                },
                component: parentView,
                children: [
                    {
                        path: '/sell/Customer_balance/Customer_Business',
                        name: '/sell/Customer_balance/Customer_Business',
                        meta: {
                            icon: 'md-funnel',
                            title: '客户业务余额表',
                            notCache:false,
                        },
                        component: () =>
                            import ('@/view/sell/Customer_balance/Customer_Business.vue')
                    },
                    {
                        path: '/sell/Customer_balance/org_money_record_list',
                        name: '/sell/Customer_balance/org_money_record_list',
                        meta: {
                            icon:'md-calculator',
                            title: '客户业务往来表',
                        },
                        component: () =>
                            import ('@/view/sell/Customer_balance/org_money_record_list.vue')
                    },
                    {
                        path: '/sell/Customer_balance/org_invoice_balance_list',
                        name: '/sell/Customer_balance/org_invoice_balance_list',
                        meta: {
                            icon: 'md-calculator',
                            title: '客户财务票额表',
                            notCache:false,
                        },
                        component: () =>
                            import ('@/view/sell/Customer_balance/org_invoice_balance_list.vue')
                    },
                   
                    {
                        path: '/sell/Customer_balance/org_invoice_money_record_list',
                        name: '/sell/Customer_balance/org_invoice_money_record_list',
                        meta: {
                            icon:'md-calculator',
                            title: '客户发票往来表',
                            notCache:false,
                        },
                        component: () =>
                            import ('@/view/sell/Customer_balance/org_invoice_money_record_list.vue')
                    },
                    {
                        path: '/sell/Customer_balance/cusMoneyInfo',
                        name: '/sell/Customer_balance/cusMoneyInfo',
                        meta: {
                            icon:'md-calculator',
                            title: '客户业务余额组成表',
                            notCache:false,
                            hideInMenu: true
                        },
                        component: () =>
                            import ('@/view/sell/Customer_balance/cusMoneyInfo.vue')
                    },

                    {
                        path: '/appLoad',
                        name: 'appLoad',
                        meta: {
                            icon:'md-calculator',
                            title: '客户业务余额组成',
                            notCache:true,
                            hideInMenu: true
                        },
                        component: () =>
                            import ('@/view/sell/Customer_balance/appLoad.vue')
                    },
                ]
            },
            {
                path: 'other_balance',
                name: 'other_balance',
                meta: {
                    icon: 'md-calculator',
                    title: '杂费余额',
                    notCache:false,
                    showAlways:true,
                },
                component: parentView,
                children: [
                    {
                        path: 'other_money_list',
                        name: 'other_money_list',
                        meta: {
                            icon: 'md-funnel',
                            title: '杂费余额表',
                            notCache:false,
                        },
                        component: () =>
                            import ('@/view/sell/other_balance/other_money_list.vue')
                    },
                    {
                        path: 'other_money_flow_list',
                        name: 'other_money_flow_list',
                        meta: {
                            icon: 'md-funnel',
                            title: '杂费出入表',
                            notCache:false,
                        },
                        component: () =>
                            import ('@/view/sell/other_balance/other_money_flow_list.vue')
                    }
                ]
            },
            {
                path: 'sell_order_summary_list',
                name: 'sell_order_summary_list',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单汇总',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/sell/sell_order_summary_list.vue')
            },
            {
                path: 'sell_order_summary_list_simple',
                name: 'sell_order_summary_list_simple',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单汇总(简)',
                    notCache:false,
                    hideInMenu:true//本页面暂时隐藏，等后续有需求在释放，并修改。2019年11月13日 星期三
                },
                component: () =>
                    import ('@/view/sell/sell_order_summary_list_simple.vue')
            },
            {
                path: 'sell_order_info_list',
                name: 'sell_order_info_list',
                meta: {
                    icon: 'md-calculator',
                    title: '销售明细表',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/sell/sell_order_info_list.vue')
            },
            {
                path: 'sell_order_info_profit_list1',
                name: 'sell_order_info_profit_list1',
                meta: {
                    icon: 'md-calculator',
                    title: '销售利润订单明细表',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/sell/sell_order_info_profit_list1.vue')
            },
            {
                path: 'profit_simple',
                name: 'profit_simple',
                meta: {
                    icon: 'md-calculator',
                    title: '销售利润订单表',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/sell/profit_simple.vue')
            },
            {
                path: 'sell_engineer_sum_list',
                name: 'sell_engineer_sum_list',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单工程汇总',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/sell/sell_engineer_sum_list.vue')
            },
        ]
    },//Customer_Business //客户业务余额表
    
    {
        path: 'org_balance_list',
        name: 'org_balance_list',
        meta: {
            icon: 'md-calculator',
            title: '客户业务余额表',
            notCache:false,
            hideInMenu: true
            
        },
        component: () =>
            import ('@/view/report_management/org_balance_list.vue')
    },//Customer_Business //客户业务余额表
    { //报表管理
        path: '/report_management',
        name: 'report_management',
        meta: {
            hide: true,
            icon: 'ios-aperture',
            title: '报表管理',
            showAlways:false,
            notCache:false,

        },
        component: Main,
        children: [
            {
                path: 'duizhangList',
                name: 'duizhangList',
                meta: {
                    icon:'md-calculator',
                    title: '项目对账统计表',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/report_management/duizhangList.vue')
            },
           
           
            {
                path: 'org_money_record_all_list',
                name: 'org_money_record_all_list',
                meta: {
                    icon:'md-calculator',
                    title: '全部流水表',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/report_management/org_money_record_all_list.vue')
            },
            {
                path: 'payList',
                name: 'payList',
                meta: {
                    icon:'md-calculator',
                    title: '付款明细表',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/report_management/payList.vue')
            },
            {
                path: 'pay_oMoney_list',
                name: 'pay_oMoney_list',
                meta: {
                    icon:'md-calculator',
                    title: '杂费申请明细',
                    hideInMenu:true,
                    notCache:false,
                },
                component: () =>
                    import ('@/view/report_management/pay_oMoney_list.vue')
            },
            {
                path: 'onlineBusiness',
                name: 'onlineBusiness',
                meta: {
                  icon: 'md-funnel',
                  title: '线上流水测试'
                },
                component: parentView,
                children: [
                  {
                    path: 'online_list',
                    name: 'online_list',
                    meta: {
                      icon: 'md-funnel',
                      title: '线上全部流水',
                      notCache:true,

                    },
                    component: () => import('@/view/report_management/onlineBusiness/online_list.vue')
                  },
                  {
                    path: 'online_listTotal',
                    name: 'online_listTotal',
                    meta: {
                      icon: 'md-funnel',
                      title: '线上全部流水汇总',
                     
                    },
                    component: () => import('@/view/report_management/onlineBusiness/online_listTotal.vue')
                  },
                ]
              },

          
          
           
        ],
        
    }, //报表管理
    {
        path: '/shop_management',
        name: 'shop_management',
        meta: {
            hide: true,
            icon: 'ios-aperture',
            title: '店铺管理',
            hideInMenu: true,
            notCache: true

        },
        component: Main,
        children: [{
            path: 'publish_resources',
            name: 'publish_resources',
            meta: {
                icon: 'ios-hammer',
                title: '发布资源',
                notCache: true
            },
            component: () =>
                import ('@/view/shop_management/publish_resources.vue')
        }, {
            path: 'inquiry_summary',
            name: 'inquiry_summary',
        meta: {
        icon: 'ios-hammer',
        title:   '询价汇总',
        notCache: true
    },
        component: () =>
                import ('@/view/shop_management/inquiry_summary.vue')
        }
    ]
    }, //店铺管理

    {
        path: '/systemMan',
        name: 'systemMan',
        meta: {
            icon: 'ios-build',
            title: '系统管理',
            hideInMenu: getIsHide('systemMan'),
            showAlways:true
        },
        component: Main,
        children: [
            // {
            //   path:'organizationa',
            //   name:'organizationa',
            //   meta:{
            //     icon:"md-cube",
            //     title:"组织架构"
            //   },
            //   component: () =>
            //     import ('@/view/systemMan/organizationa.vue')
            // },
            {
                path: 'wb_test_2',
                name: 'wb_test_2',
                meta: {
                    icon: "md-cube",
                    title: "大数据表格渲染问题"
                },
                component: () =>
                    import ('@/view/systemMan/wb_test_2.vue')
            },//table
            {
                path: 'table11',
                name: 'table11',
                meta: {
                    icon: "md-cube",
                    title: "表格嵌套"
                },
                component: () =>
                    import ('@/view/systemMan/table11.vue')
            },
            {
                path: 'wb_test_1',
                name: 'wb_test_1',
                meta: {
                    icon: "md-cube",
                    title: "测试列表相同项合并"
                },
                component: () =>
                    import ('@/view/systemMan/wb_test_1.vue')
            },
            
            {
                path: 'wb_test',
                name: 'wb_test',
                meta: {
                    icon: "md-cube",
                    title: "测试render"
                },
                component: () =>
                    import ('@/view/systemMan/wb_test.vue')
            },
            {
                path: 'JobInformation',
                name: 'JobInformation',
                meta: {
                    icon: "md-cube",
                    title: "岗位信息"
                },
                component: () =>
                    import ('@/view/systemMan/JobInformation.vue')
            },
            {
                path: 'accountMan',
                name: 'accountMan',
                meta: {
                    icon: "md-cube",
                    title: "账户管理"
                },
                component: () =>
                    import ('@/view/systemMan/accountMan.vue')
            },
            {
                path: 'purchase',
                name: 'purchase',
                meta: {
                    icon: "md-cube",
                    title: "采购管理"
                },
                component: () =>
                    import ('@/view/systemMan/purchase.vue')
            },
            {
                path: 'supplier',
                name: 'supplier',
                meta: {
                    icon: "md-cube",
                    title: "供应商信息列表"
                },
                component: () =>
                    import ('@/view/systemMan/supplier.vue')
            },
            {
                path: 'supplierManage',
                name: 'susupplierManagepplier',
                meta: {
                    icon: "md-cube",
                    title: "供应商信息管理"
                },
                component: () =>
                    import ('@/view/systemMan/supplierManage.vue')
            },
            {
                path: 'operationLog',
                name: 'operationLog',
                meta: {
                    icon: "md-cube",
                    title: "操作日志"
                },
                component: () =>
                    import ('@/view/systemMan/operationLog.vue')
            },
            {
                path: 'customerInformation',
                name: 'customerInformation',
                meta: {
                    icon: "md-cube",
                    title: "客户信息管理详情"
                },
                component: () =>
                    import ('@/view/systemMan/customerInformation.vue')
            },
            {
                path: 'cusInformation',
                name: 'cusInformation',
                meta: {
                    icon: "md-cube",
                    title: "客户信息管理"
                },
                component: () =>
                    import ('@/view/systemMan/cusInformation.vue')
            },
            {
                path: 'organizationalStructure',
                name: 'organizationalStructure',
                meta: {
                    icon: "md-cube",
                    title: "组织架构"
                },
                component: () =>
                    import ('@/view/systemMan/organizationalStructure.vue')
            },
            {
                path: 'purchMan',
                name: 'purchMan',
                meta: {
                    icon: "md-cube",
                    title: "采购管理"
                },
                component: () =>
                    import ('@/view/systemMan/purchMan.vue')
            },
            {
                path: 'supCustomers',
                name: 'supCustomers',
                meta: {
                    icon: "md-cube",
                    title: "采供应商新增弹窗"
                },
                component: () =>
                    import ('@/view/systemMan/supCustomers.vue')
            },
            {
                path: 'Purchase2',
                name: 'Purchase2',
                meta: {
                    icon: "md-cube",
                    title: "採購管理22"
                },
                component: () =>
                    import ('@/view/systemMan/Purchase2.vue')
            },
            {
                path: 'listBuy',
                name: 'listBuy',
                meta: {
                    icon: "md-cube",
                    title: "采购管理-列表"
                },
                component: () =>
                    import ('@/view/systemMan/listBuy.vue')
            },
            {
                path: 'listOrder',
                name: 'listOrder',
                meta: {
                    icon: "md-cube",
                    title: "先销后采"
                },
                component: () =>
                    import ('@/view/systemMan/listOrder.vue')
            },
            {
                path: 'orderOne',
                name: 'orderOne',
                meta: {
                    icon: "md-cube",
                    title: "下单"
                },
                component: () =>
                    import ('@/view/systemMan/orderOne.vue')
            },
            {
                path: 'takeGoods',
                name: 'takeGoods',
                meta: {
                    icon: "md-cube",
                    title: "提货申请"
                },
                component: () =>
                    import ('@/view/systemMan/takeGoods.vue')
            },
            {
                path: 'saleSlip',
                name: 'saleSlip',
                meta: {
                    icon: "md-cube",
                    title: "新增销售单"
                },
                component: () =>
                    import ('@/view/systemMan/saleSlip.vue')
            },
            {
                path: 'InvoiceKai',
                name: 'InvoiceKai',
                meta: {
                    icon: "md-cube",
                    title: "开票申请"
                },
                component: () =>
                    import ('@/view/systemMan/InvoiceKai.vue')
            },
            {
                path: 'boList',
                name: 'boList',
                meta: {
                    icon: "md-cube",
                    title: "采购单列表测试"
                },
                component: () =>
                    import ('@/view/systemMan/boList.vue')
            },
             
            {
                path: 'boListTest',
                name: 'boListTest',
                meta: {
                    icon: "md-cube",
                    title: "采购单列表测试vxe"
                },
                component: () =>
                    import ('@/view/systemMan/boListTest.vue')
            },
        ],
    }, //listOrder InvoiceKai  saleSlip takeGoods  orderOne  系统管理supCustomers listBuy  purchMan customerlist purchase  supplier supplierManage operationLog  customerInformation cusInformation  organizationalStructure
    {
        path: '/user_management',
        name: 'user_management',
        meta: {
            icon: 'ios-build',
            title: '系统管理1',
            hideInMenu: getIsHide('user_management'),
            showAlways:true
        },
        component: Main,
        children: [
            {
                path: 'updateLog',
                name: 'updateLog',
                meta: {
                    icon: 'md-calculator',
                    title: '更新日志',
                    notCache:false,
                },
                component: () =>
                    import ('@/view/user_management/updateLog.vue')
            },
            {
                path: 'org_structure',
                name: 'org_structure',
                meta: {
                    title: '组织架构'
                },
                component: () =>
                    import ('@/view/user_management/org_structure.vue')
            }, {
                path: 'post_list',
                name: 'post_list',
                meta: {
                    title: '组织岗位'
                },
                component: () =>
                    import ('@/view/user_management/post_list.vue')
            }, {
                path: 'authority_list',
                name: 'authority_list',
                meta: {
                    title: '权限管理',
                    hideInMenu: getIsHide('authority_list')
                },
                component: () =>
                    import ('@/view/user_management/authority_list.vue')
            },
            {
                path: 'small_code',
                name: 'small_code',
                meta: {
                    title: '小代码管理',
                    hideInMenu: false
                },
                component: () =>
                    import ('@/view/user_management/small_code.vue')
            },
            {
                path: 'web_routerList',
                name: 'web_routerList',
                meta: {
                    title: '页面router信息编辑'
                },
                component: () =>
                    import ('@/view/user_management/web_routerList.vue')
            }
        ]
    },
    {
        path: '/addM',
        name: 'addM',
        meta: {
            icon: 'md-menu',
            title: '我是测试',
            hideInMenu: true
        },
        component: Main,
        children: [{
                path: 'test',
                name: 'test',
                meta: {
                    icon: 'md-funnel',
                    title: '测试一级'
                },
                component: () =>
                    import ('@/view/addM/test.vue')
            },
            {
                path: 'test1',
                name: 'test1',
                meta: {
                    icon: 'md-funnel',
                    title: '测试二级'
                },
                component: () =>
                    import ('@/view/addM/test1.vue')
            },
        ]

    }, //测试路由


    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/401.vue')
    }, //401路由页面
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/500.vue')
    }, //500路由页面

    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/404.vue')
    } //404路由页面
]
let a = 0;
let bTime = +new Date();
var roleList = [];
// var tempList = [
//     'name':customer_manager',
//     'name':'customerlist',

// ];

function getIsHide(key) {

    let hide = false;
    if (key == "_home") {
        hide = true;
    } else {
        hide = false;
    }
    a++;
    let endtime = +new Date();
    //let a = localStorage.getItem('routeArr');
    let a=localStorage.getItem('arr');
  //  console.log(localStorage.getItem('arr'))
    if(a=='null'|| a== null){
        a=[]   
    }
    if(a.length>0){
        roleList = eval('(' + a + ')');
    }else{
        roleList = [];
    }
    
    if(key == "user_management" && process.env.NODE_ENV == 'development'){//生产环境
        hide = false;
    }else if(key == "user_management" && process.env.NODE_ENV == 'production'){
         hide = true;
    }else{
        hide = false;
    }

    if(key == "systemMan" && process.env.NODE_ENV == 'development'){//生产环境
        hide = false;
    }else if(key == "systemMan" && process.env.NODE_ENV == 'production'){
         hide = true;
    }else{
        hide = false;
    }
    //权限控制 开启后按照页面权限显示页面
    // if(roleList.indexOf(key) != -1){
    //     console.log(key+':'+'有')
    //     return false;
        
    // }else{
    //     console.log(key+':'+'没有')
    //     return true;
    // }

    //return hide;
    //开发模式 默认 都显示 
    return hide;
    // return env == 'development1' ? false : hide;
}