/*
 * @Description: 
 * @Author: gmm
 * @Date: 2019-08-12 16:47:59
 * @其他: 
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import global from './libs/global.js'
import VueResource from 'vue-resource'
//引入elemant
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入vex-element表格
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import Utils from '@/api/middle'
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')
console.log(process.env.NODE_ENV)
VXETable.use(VXETablePluginElement)
Vue.use(VXETable)
Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
})

Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
Vue.use(VOrgTree)
Vue.use(VueResource)

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
    /**
     * @description 生产环境关掉提示
     */
Vue.config.productionTip = false
    /**
     * @description 全局注册应用配置
     */
Vue.prototype.$config = config
Vue.prototype.$global = global;
Vue.prototype.$Utils = Utils;

/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)
Vue.directive('focus', {
    inserted: (el) => {
      el.focus()
    }
  })
//全局提示
// Vue.prototype.$Message.config({
//     top: 300,
//     duration: 2,
// });

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
})