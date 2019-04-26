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

/*** 
export default [{
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login - 登录',
            hideInMenu: true
        },
        component: () =>
            import ('@/view/login/login.vue')
    },
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
                hideInMenu: true,
                title: '首页',
                notCache: true,
                icon: 'md-home'
            },
            component: () =>
                import ('@/view/single-page/home')
        }]
    },
    
    {
        path: '',
        name: 'doc',
        meta: {
            title: '文档',
            href: 'https://lison16.github.io/iview-admin-doc/#/',
            icon: 'ios-book',
            hideInMenu:true
        }
    },
    {
        path: '/join',
        name: 'join',
        component: Main,
        meta: {
            hideInBread: true,
            hideInMenu:true
        },
        children: [{
            path: 'join_page',
            name: 'join_page',
            meta: {
                icon: '_qq',
                title: 'QQ群'
            },
            component: () =>
                import ('@/view/join-page.vue')
        }]
    },
    {
        path: '/message',
        name: 'message',
        component: Main,
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        children: [{
            path: 'message_page',
            name: 'message_page',
            meta: {
                icon: 'md-notifications',
                title: '消息中心'
            },
            component: () =>
                import ('@/view/single-page/message/index.vue')
        }]
    },
    {
        path: '/components',
        name: 'components',
        meta: {
            icon: 'logo-buffer',
            title: '组件组件',
            hideInMenu:true

        },
        component: Main,
        children: [{
                path: 'tree_select_page',
                name: 'tree_select_page',
                meta: {
                    icon: 'md-arrow-dropdown-circle',
                    title: '树状下拉选择器'
                },
                component: () =>
                    import ('@/view/components/tree-select/index.vue')
            },
            {
                path: 'count_to_page',
                name: 'count_to_page',
                meta: {
                    icon: 'md-trending-up',
                    title: '数字渐变'
                },
                component: () =>
                    import ('@/view/components/count-to/count-to.vue')
            },
            {
                path: 'drag_list_page',
                name: 'drag_list_page',
                meta: {
                    icon: 'ios-infinite',
                    title: '拖拽列表'
                },
                component: () =>
                    import ('@/view/components/drag-list/drag-list.vue')
            },
            {
                path: 'drag_drawer_page',
                name: 'drag_drawer_page',
                meta: {
                    icon: 'md-list',
                    title: '可拖拽抽屉'
                },
                component: () =>
                    import ('@/view/components/drag-drawer')
            },
            {
                path: 'org_tree_page',
                name: 'org_tree_page',
                meta: {
                    icon: 'ios-people',
                    title: '组织结构树'
                },
                component: () =>
                    import ('@/view/components/org-tree')
            },
            {
                path: 'tree_table_page',
                name: 'tree_table_page',
                meta: {
                    icon: 'md-git-branch',
                    title: '树状表格'
                },
                component: () =>
                    import ('@/view/components/tree-table/index.vue')
            },
            {
                path: 'cropper_page',
                name: 'cropper_page',
                meta: {
                    icon: 'md-crop',
                    title: '图片裁剪'
                },
                component: () =>
                    import ('@/view/components/cropper/cropper.vue')
            },
            {
                path: 'tables_page',
                name: 'tables_page',
                meta: {
                    icon: 'md-grid',
                    title: '多功能表格'
                },
                component: () =>
                    import ('@/view/components/tables/tables.vue')
            },
            {
                path: 'split_pane_page',
                name: 'split_pane_page',
                meta: {
                    icon: 'md-pause',
                    title: '分割窗口'
                },
                component: () =>
                    import ('@/view/components/split-pane/split-pane.vue')
            },
            {
                path: 'markdown_page',
                name: 'markdown_page',
                meta: {
                    icon: 'logo-markdown',
                    title: 'Markdown编辑器'
                },
                component: () =>
                    import ('@/view/components/markdown/markdown.vue')
            },
            {
                path: 'editor_page',
                name: 'editor_page',
                meta: {
                    icon: 'ios-create',
                    title: '富文本编辑器'
                },
                component: () =>
                    import ('@/view/components/editor/editor.vue')
            },
            {
                path: 'icons_page',
                name: 'icons_page',
                meta: {
                    icon: '_bear',
                    title: '自定义图标'
                },
                component: () =>
                    import ('@/view/components/icons/icons.vue')
            }
        ]
    },
    {
        path: '/update',
        name: 'update',
        meta: {
            icon: 'md-cloud-upload',
            title: '数据上传',
            hideInMenu:true

        },
        component: Main,
        children: [{
                path: 'update_table_page',
                name: 'update_table_page',
                meta: {
                    icon: 'ios-document',
                    title: '上传Csv'
                },
                component: () =>
                    import ('@/view/update/update-table.vue')
            },
            {
                path: 'update_paste_page',
                name: 'update_paste_page',
                meta: {
                    icon: 'md-clipboard',
                    title: '粘贴表格数据'
                },
                component: () =>
                    import ('@/view/update/update-paste.vue')
            }
        ]
    },
    {
        path: '/excel',
        name: 'excel',
        meta: {
            icon: 'ios-stats',
            title: 'EXCEL导入导出',
            hideInMenu:true

        },
        component: Main,
        children: [{
                path: 'upload-excel',
                name: 'upload-excel',
                meta: {
                    icon: 'md-add',
                    title: '导入EXCEL'
                },
                component: () =>
                    import ('@/view/excel/upload-excel.vue')
            },
            {
                path: 'export-excel',
                name: 'export-excel',
                meta: {
                    icon: 'md-download',
                    title: '导出EXCEL'
                },
                component: () =>
                    import ('@/view/excel/export-excel.vue')
            }
        ]
    },
    {
        path: '/tools_methods',
        name: 'tools_methods',
        meta: {
            hideInBread: true,
            hideInMenu:true

        },
        component: Main,
        children: [{
            path: 'tools_methods_page',
            name: 'tools_methods_page',
            meta: {
                icon: 'ios-hammer',
                title: '工具方法',
                beforeCloseName: 'before_close_normal'
            },
            component: () =>
                import ('@/view/tools-methods/tools-methods.vue')
        }]
    },
    {
        path: '/i18n',
        name: 'i18n',
        meta: {
            hideInBread: true,
            hideInMenu:true

        },
        component: Main,
        children: [{
            path: 'i18n_page',
            name: 'i18n_page',
            meta: {
                icon: 'md-planet',
                title: 'i18n - {{ i18n_page }}'
            },
            component: () =>
                import ('@/view/i18n/i18n-page.vue')
        }]
    },
    {
        path: '/error_store',
        name: 'error_store',
        meta: {
            hideInBread: true,
            hideInMenu:true

        },
        component: Main,
        children: [{
            path: 'error_store_page',
            name: 'error_store_page',
            meta: {
                icon: 'ios-bug',
                title: '错误收集'
            },
            component: () =>
                import ('@/view/error-store/error-store.vue')
        }]
    },
    {
        path: '/error_logger',
        name: 'error_logger',
        meta: {
            hideInBread: true,
            hideInMenu: true
        },
        component: Main,
        children: [{
            path: 'error_logger_page',
            name: 'error_logger_page',
            meta: {
                icon: 'ios-bug',
                title: '错误收集'
            },
            component: () =>
                import ('@/view/single-page/error-logger.vue')
        }]
    },
    {
        path: '/directive',
        name: 'directive',
        meta: {
            hideInBread: true,
            hideInMenu:true

        },
        component: Main,
        children: [{
            path: 'directive_page',
            name: 'directive_page',
            meta: {
                icon: 'ios-navigate',
                title: '指令'
            },
            component: () =>
                import ('@/view/directive/directive.vue')
        }]
    },
    {
        path: '/multilevel',
        name: 'multilevel',
        meta: {
            icon: 'md-menu',
            title: '多级菜单',
            hideInMenu:true

        },
        component: Main,
        children: [{
                path: 'level_2_1',
                name: 'level_2_1',
                meta: {
                    icon: 'md-funnel',
                    title: '二级-1'
                },
                component: () =>
                    import ('@/view/multilevel/level-2-1.vue')
            },
            {
                path: 'level_2_2',
                name: 'level_2_2',
                meta: {
                    access: ['super_admin'],
                    icon: 'md-funnel',
                    showAlways: true,
                    title: '二级-2'
                },
                component: parentView,
                children: [{
                        path: 'level_2_2_1',
                        name: 'level_2_2_1',
                        meta: {
                            icon: 'md-funnel',
                            title: '三级'
                        },
                        component: () =>
                            import ('@/view/multilevel/level-2-2/level-2-2-1.vue')
                    },
                    {
                        path: 'level_2_2_2',
                        name: 'level_2_2_2',
                        meta: {
                            icon: 'md-funnel',
                            title: '三级'
                        },
                        component: () =>
                            import ('@/view/multilevel/level-2-2/level-2-2-2.vue')
                    }
                ]
            },
            {
                path: 'level_2_3',
                name: 'level_2_3',
                meta: {
                    icon: 'md-funnel',
                    title: '二级-3'
                },
                component: () =>
                    import ('@/view/multilevel/level-2-3.vue')
            }
        ]
    },
    {
        path: '/argu',
        name: 'argu',
        meta: {
            hideInMenu: true
        },
        component: Main,
        children: [{
                path: 'params/:id',
                name: 'params',
                meta: {
                    icon: 'md-flower',
                    title: route => `{{ params }}-${route.params.id}`,
                    notCache: true,
                    beforeCloseName: 'before_close_normal'
                },
                component: () =>
                    import ('@/view/argu-page/params.vue')
            },
            {
                path: 'query',
                name: 'query',
                meta: {
                    icon: 'md-flower',
                    title: route => `{{ query }}-${route.query.id}`,
                    notCache: true
                },
                component: () =>
                    import ('@/view/argu-page/query.vue')
            }
        ]
    },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () =>
            import ('@/view/error-page/404.vue')
    }
]
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
            hide: true,
            icon: 'ios-aperture',
            title: '客户管理'
        },
        component: Main,
        children: [{
                path: 'customerlist',
                name: 'customerlist',
                meta: {
                    icon: "md-cube",
                    title: "客户列表"
                },
                component: () =>
                    import ('@/view/customer_manager/customerlist.vue')
            },
            {
                path: 'supplierList',
                name: 'supplierList',
                meta: {
                    icon: "md-cube",
                    title: "供应商管理"
                },
                component: () =>
                    import ('@/view/customer_manager/supplierList.vue')
            },
            {
                path: 'shopList',
                name: 'shopList',
                meta: {
                    icon: "md-cube",
                    title: "店铺管理"
                },
                component: () =>
                    import ('@/view/customer_manager/shopList.vue')
            },
            {
                path: 'user_agent',
                name: 'user_agent',
                meta: {
                    icon: "md-cube",
                    title: "代理商管理"
                },
                component: () =>
                    import ('@/view/customer_manager/user_agent.vue')
            },
            {
                path: 'supplierList_add',
                name: 'supplierList_add',
                meta: {
                    icon: "md-cube",
                    title: "供应商详情",
                    hideInMenu: true
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
                    hideInMenu: true
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
                    hideInMenu: true
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
            title: '采购管理'
        },
        component: Main,
        children: [{
                path: 'buy_order_list',
                name: 'buy_order_list',
                meta: {
                    icon: "md-cube",
                    title: "采购单列表"
                },
                component: () =>
                    import ('@/view/buy_manager/buy_order_list.vue')
            },
            {
                path: 'add_order_delivery_actual',
                name: 'add_order_delivery_actual',
                meta: {
                    icon: "md-cube",
                    title: "采购单入库",
                    hideInMenu: true
                },
                component: () =>
                    import ('@/view/buy_manager/add_order_delivery_actual.vue')
            },
            {
                path: 'review_order_list',
                name: 'review_order_list',
                meta: {
                    icon: "md-cube",
                    title: "审核采购单"
                },
                component: () =>
                    import ('@/view/buy_manager/review_order_list.vue')
            },
            {
                path: 'review_order_info',
                name: 'review_order_info',
                meta: {
                    icon: "md-cube",
                    title: "审核采购单详情",
                    hideInMenu: true
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
                    hideInMenu: true
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
                    hideInMenu: true
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
            {
                path: 'add_order_new',
                name: 'add_order_new',
                meta: {
                    icon: "md-cube",
                    title: "新增采购单",
                    hideInMenu: true,
                    notCache: true
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
        ]
    }, //采购管理

    {
        path: '/sell_manager',
        name: 'sell_manager',
        meta: {
            icon: 'md-calculator',
            title: '销售管理'
        },
        component: Main,
        children: [{
                path: 'sell_order_list',
                name: 'sell_order_list',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单列表'
                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_list.vue')
            },
            {
                path: 'sell_order_info',
                name: 'sell_order_info',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单明细',
                    hideInMenu: true
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
                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_review_list.vue')
            },
            {
                path: 'sell_order_review_info',
                name: 'sell_order_review_info',
                meta: {
                    icon: 'md-calculator',
                    title: '审核销售单明细',
                    hideInMenu: true
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
                    hideInMenu: true
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
                    hideInMenu: true
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
                    hideInMenu: true
                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_pay_info.vue')
            },
            {
                path: 'sell_order_change_info',
                name: 'sell_order_change_info',
                meta: {
                    icon: 'md-calculator',
                    title: '修改销售单',
                    hideInMenu: true
                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_change_info.vue')
            },
            {
                path: 'sell_order_kaiPiao',
                name: 'sell_order_kaiPiao',
                meta: {
                    icon: 'md-calculator',
                    title: '销售单开票申请',
                    hideInMenu: true
                },
                component: () =>
                    import ('@/view/sell_manager/sell_order_kaiPiao.vue')
            },
        ]
    }, //销售管理
    {
        path: '/stock',
        name: 'stock',
        meta: {
            icon: 'md-menu',
            title: '库存管理'
                // showAlways: true
        },
        component: Main,
        children: [{
                path: 'stock_manager',
                name: 'stock_manager',
                meta: {
                    icon: 'md-funnel',
                    title: '仓库管理'
                },
                component: () =>
                    import ('@/view/stock/stock_manager.vue')
            },
            {
                path: 'in_stock_list',
                name: 'in_stock_list',
                meta: {
                    icon: 'md-funnel',
                    title: '库存列表'
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
            title: '财务管理'
        },
        component: Main,
        children: [{
                path: 'buy_order_payment_list',
                name: 'buy_order_payment_list',
                meta: {
                    icon: 'md-calculator',
                    title: '采购单付款列表'
                },
                component: () =>
                    import ('@/view/financial_management/buy_order_payment_list.vue')
            },
            {
                path: 'buy_order_pay_online',
                name: 'buy_order_pay_online',
                meta: {
                    icon: 'md-calculator',
                    title: '采购单线上制单付款'
                },
                component: () =>
                    import ('@/view/financial_management/buy_order_pay_online.vue')
            },
            {
                path: 'daozhangdan_fj',
                name: 'daozhangdan_fj',
                meta: {
                    icon: 'md-calculator',
                    title: '福建亿钢到账单管理'
                },
                component: parentView,
                children: [{
                        path: 'daozhangdanFJ_List',
                        name: 'daozhangdanFJ_List',
                        meta: {
                            icon: 'md-funnel',
                            title: '到账单列表(福建亿钢)'
                        },
                        component: () =>
                            import ('@/view/financial_management/daozhangdan_fj/daozhangdanFJ_List.vue')
                    },
                    {
                        path: 'daozhangdanFJ_backList',
                        name: 'daozhangdanFJ_backList',
                        meta: {
                            icon: 'md-funnel',
                            title: '回退到账单列表(福建亿钢)'
                        },
                        component: () =>
                            import ('@/view/financial_management/daozhangdan_fj/daozhangdanFJ_backList.vue')
                    },
                    {
                        path: 'chuzhangdanFJ_List',
                        name: 'chuzhangdanFJ_List',
                        meta: {
                            icon: 'md-funnel',
                            title: '出账单列表(福建亿钢)'
                        },
                        component: () =>
                            import ('@/view/financial_management/daozhangdan_fj/chuzhangdanFJ_List.vue')
                    },
                ]
            },
            {
                path: 'daozhangdan_sh',
                name: 'daozhangdan_sh',
                meta: {
                    icon: 'md-calculator',
                    title: '上海闽航到账单管理'
                },
                component: parentView,
                children: [{
                        path: 'daozhangdanSH_List',
                        name: 'daozhangdanSH_List',
                        meta: {
                            icon: 'md-funnel',
                            title: '到账单列表(上海闽航)'
                        },
                        component: () =>
                            import ('@/view/financial_management/daozhangdan_sh/daozhangdanSH_List.vue')
                    },
                    {
                        path: 'daozhangdanSH_backList',
                        name: 'daozhangdanSH_backList',
                        meta: {
                            icon: 'md-funnel',
                            title: '回退到账单列表(上海闽航)'
                        },
                        component: () =>
                            import ('@/view/financial_management/daozhangdan_sh/daozhangdanSH_backList.vue')
                    },
                    {
                        path: 'chuzhangdanSH_List',
                        name: 'chuzhangdanSH_List',
                        meta: {
                            icon: 'md-funnel',
                            title: '出账单列表(上海闽航)'
                        },
                        component: () =>
                            import ('@/view/financial_management/daozhangdan_sh/chuzhangdanSH_List.vue')
                    },
                ]
            },
            {
                path: 'invoice_manage',
                name: 'invoice_manage',
                meta: {
                    icon: 'md-calculator',
                    title: '发票管理'
                },
                component: parentView,
                children: [{
                        path: 'invoice_in_list',
                        name: 'invoice_in_list',
                        meta: {
                            icon: 'md-funnel',
                            title: '进项票列表'
                        },
                        component: () =>
                            import ('@/view/financial_management/invoice_manage/invoice_in_list.vue')
                    },
                    {
                        path: 'invoice_out_list',
                        name: 'invoice_out_list',
                        meta: {
                            icon: 'md-funnel',
                            title: '销项票列表'
                        },
                        component: () =>
                            import ('@/view/financial_management/invoice_manage/invoice_out_list.vue')
                    },
                ]
            },
            {
                path: 'invoice_out_list_MH',
                name: 'invoice_out_list_MH',
                meta: {
                    icon: 'md-funnel',
                    title: '销项票开票列表(闽航)'
                },
                component: () =>
                    import ('@/view/financial_management/invoice_out_list_MH.vue')
            },
            {
                path: 'invoice_out_list_FJ',
                name: 'invoice_out_list_FJ',
                meta: {
                    icon: 'md-funnel',
                    title: '销项票开票列表(亿钢)'
                },
                component: () =>
                    import ('@/view/financial_management/invoice_out_list_FJ.vue')
            },



        ]
    }, //财务管理
    { //报表管理
        path: '/report_management',
        name: 'report_management',
        meta: {
            hide: true,
            icon: 'ios-aperture',
            title: '报表管理'
        },
        component: Main,
        children: [{
                path: 'buy_order_info_list',
                name: 'buy_order_info_list',
                meta: {
                    icon: 'md-calculator',
                    title: '采购明细表',
                },
                component: () =>
                    import ('@/view/report_management/buy_order_info_list.vue')
            },
            {
                path: 'sell_order_info_list',
                name: 'sell_order_info_list',
                meta: {
                    icon: 'md-calculator',
                    title: '销售明细表',
                },
                component: () =>
                    import ('@/view/report_management/sell_order_info_list.vue')
            },
            {
                path: 'sell_order_info_profit_list',
                name: 'sell_order_info_profit_list',
                meta: {
                    icon: 'md-calculator',
                    title: '销售利润表',
                },
                component: () =>
                    import ('@/view/report_management/sell_order_info_profit_list.vue')
            },
            {
                path: 'bank_flow_FJ_list',
                name: 'bank_flow_FJ_list',
                meta: {
                    icon: 'md-calculator',
                    title: '福建客户流水',
                },
                component: () =>
                    import ('@/view/report_management/bank_flow_FJ_list.vue')
            },
            {
                path: 'bank_flow_SH_list',
                name: 'bank_flow_SH_list',
                meta: {
                    icon: 'md-calculator',
                    title: '上海客户流水',
                },
                component: () =>
                    import ('@/view/report_management/bank_flow_SH_list.vue')
            },
        ]
    }, //报表管理
    {
        path: '/shop_management',
        name: 'shop_management',
        meta: {
            hide: true,
            icon: 'ios-aperture',
            title: '店铺管理',
            hideInMenu: true
        },
        component: Main,
        children: [{
            path: 'publish_resources',
            name: 'publish_resources',
            meta: {
                icon: 'ios-hammer',
                title: '发布资源'
            },
            component: () =>
                import ('@/view/shop_management/publish_resources.vue')
        }, {
            path: 'inquiry_summary',
            name: 'inquiry_summary',
            meta: {
                icon: 'ios-hammer',
                title: '询价汇总'
            },
            component: () =>
                import ('@/view/shop_management/inquiry_summary.vue')
        }]
    }, //店铺管理

    {
        path: '/systemMan',
        name: 'systemMan',
        meta: {
            icon: 'ios-build',
            title: '系统管理'
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
        ],
    }, //listOrder InvoiceKai  saleSlip takeGoods  orderOne  系统管理supCustomers listBuy  purchMan customerlist purchase  supplier supplierManage operationLog  customerInformation cusInformation  organizationalStructure
    {
        path: '/user_management',
        name: 'user_management',
        meta: {
            icon: 'ios-build',
            title: '系统管理1',
            hideInMenu: getIsHide('user_management')
        },
        component: Main,
        children: [{
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
            title: '我是测试'
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

function getIsHide(key) {
    let hide = false;
    if (key == "_home") {
        hide = true;
    } else {
        hide = false;
    }
    a++;
    let endtime = +new Date();
    hide = judge(roleList, key) == undefined ? hide : judge(roleList, key);
    // console.log(key + '=' + hide);
    // console.log("运行时间" + endtime);
    // console.log("时间差值=" + (endtime - bTime) + 'ms');
    // return hide;
    //开发模式 默认 都显示
    return false;
    // return env == 'development1' ? false : hide;
}

function judge(obj, key) {
    for (var i in obj) {
        var item = obj[i];
        if (item.children) {
            judge(item.children, key);
        } else {
            if (item.name == key) {
                return item.hideInMenu;
            } else {
                return undefined;
            }
        }
    }
}