export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: '建钢',
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        dev: 'http://10.100.16.65:8888/jgerp/',//本地
        // dev: 'http://122.152.207.96:8888/jgerp/',//备份服务器
        // dev:'http://120.77.56.107:8888/jgerp/',//阿里云服务器
        pro: 'http://120.77.56.107:8888/jgerp/', //发布时的生产访问地址
        pro_8889:'http://120.77.56.107:8889/jgerp/',
        pro_bank_8889:'http://10.100.16.65:8889/jgerp/',//杭州银行发布时生产访问地址
        zhidan_FJ:"http://10.100.16.4:8080/jgerpFJ/orders/zhidan",//福建兴业银行制单接口使用的线上接口地址
        zhidan_SH:"http://10.100.16.5:8080/jgerpSH/orders/zhidan",//上海兴业银行制单接口使用的线上接口地址

        nbzd_FJ:"http://10.100.16.4:8080/jgerpFJ/orders/internalZhidan",//福建兴业银行制单接口,内部制单使用
        nbzd_SH:"http://10.100.16.5:8080/jgerpSH/orders/internalZhidan",//上海兴业银行制单接口，内部转账制单使用
        //下面是杭州制单的线上地址
        HZbank_SH:'http://10.100.16.4:8889/jgerp-hz-YQZL/',//杭州银行线上制单的接口,放置在福建前置机上面
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',
    /**
     * @description 需要加载的插件
     */
    plugin: {
        'error-store': {
            showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
            developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    }
}