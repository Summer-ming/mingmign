/*
 * @Description: 
 * @Author: gmm
 * @Date: 2019-04-26 11:09:55
 * @其他: 
 */
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config

//解决点击同一路由报错的信息
// const originalPush = Router.prototype.push
// console.log('我是测试')
// console.log(Router.prototype)
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(Router)
const router = new Router({
    routes,
    mode: 'hash'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
    if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
    else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
    //console.log(to)
    //alert('我是要进去的路由')
    if(to.name == 'home'){
        let c=localStorage.getItem('routeArr')
        localStorage.setItem('arr',c)
        console.log(localStorage.getItem('arr'))
     }
    
    //console.log(localStorage.getItem('arr'))
    //iView.LoadingBar.start()
    const token = getToken()
    if (!token && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        console.log('未登录跳转到登陆页面')
        next({
            name: LOGIN_PAGE_NAME // 跳转到登录页
        })
      
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
        // 未登陆且要跳转的页面是登录页
        next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
        // 已登录且要跳转的页面是登录页
        console.log('已经登陆直接跳到首页')
        next({
            name: homeName // 跳转到homeName页
        })
       
    } else {
        if (store.state.user.hasGetInfo) {
            turnTo(to, store.state.user.access, next)
        } else {
            store.dispatch('getUserInfo').then(user => {
                // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
                turnTo(to, user.access, next)
            }).catch(() => {
                next()
            })
        }
    }
})

router.afterEach(to => {
    var reloaded = window.localStorage.getItem('reloaded') || '';
    if(reloaded == ''&&to.name == 'home'){
       // alert('刷新')
        window.location.reload();
        window.localStorage.setItem('reloaded','yes');
    }
     
    setTitle(to, router.app)
        //iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})




export default router