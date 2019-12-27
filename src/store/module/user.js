import {
    login,
    logout,
    getUserInfo,
    getMessage,
    getContentByMsgId,
    hasRead,
    removeReaded,
    restoreTrash,
    getUnreadCount
} from '@/api/user'
import { setToken, getToken, setUserInfo, getUserInfoAdmin } from '@/libs/util'

export default {
    state: {
        userName: '',
        userId: '',
        avatarImgPath: '',
        token: getToken(),
        access: '',
        hasGetInfo: false,
        unreadCount: 0,
        messageUnreadList: [],
        messageReadedList: [],
        messageTrashList: [],
        messageContentStore: {}
    },
    mutations: {
        setAvatar(state, avatarPath) {
            state.avatarImgPath = avatarPath
        },
        setUserId(state, id) {
            state.userId = id
        },
        setUserName(state, name) {
            state.userName = name
        },
        setAccess(state, access) {
            state.access = access
        },
        setToken(state, token) {
            state.token = token
            setToken(token)
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
            setUserInfo(userInfo)
        },
        setHasGetInfo(state, status) {
            state.hasGetInfo = status
        },
        setMessageCount(state, count) {
            state.unreadCount = count
        },
        setMessageUnreadList(state, list) {
            state.messageUnreadList = list
        },
        setMessageReadedList(state, list) {
            state.messageReadedList = list
        },
        setMessageTrashList(state, list) {
            state.messageTrashList = list
        },
        updateMessageContentStore(state, { msg_id, content }) {
            state.messageContentStore[msg_id] = content
        },
        moveMsg(state, { from, to, msg_id }) {
            const index = state[from].findIndex(_ => _.msg_id === msg_id)
            const msgItem = state[from].splice(index, 1)[0]
            msgItem.loading = false
            state[to].unshift(msgItem)
        }
    },
    getters: {
        messageUnreadCount: state => state.messageUnreadList.length,
        messageReadedCount: state => state.messageReadedList.length,
        messageTrashCount: state => state.messageTrashList.length
    },
    actions: {
        // 登录
        handleLogin({ commit }, { userName, password }) {
            userName = userName.trim()
            return new Promise((resolve, reject) => {
                login({
                    userName,
                    password
                }).then(res => {

                    if (res.code == "100") {
                        commit('setToken', res.data.token)
                        commit('setUserInfo', res.datas[0]); //存储登录的角色信息
                        localStorage.setItem('caName', res.datas[0].cname)
                        localStorage.setItem('userInfoErp', JSON.stringify(res.datas[0]))

                        resolve(res)
                    } else {
                        resolve(res);
                    }
                }).catch(err => {
                    reject(err)
                })

            })
        },
        // 退出登录
        handleLogOut({ state, commit }) {
            return new Promise((resolve, reject) => {
                console.log('我退出了')
                localStorage.setItem('caName', '')
                localStorage.setItem('userInfoErp','')
                localStorage.setItem('tagNaveList','');
                window.localStorage.setItem('reloaded','');
                commit('setToken', '')
                commit('setAccess', [])
                commit('setUserInfo', []); //存储登录的角色信息
                localStorage.setItem('routeArr','')

                resolve()
                    // logout(state.token).then(() => {
                    //         console.log('我退出了')
                    //         localStorage.setItem('caName', '')
                    //         commit('setToken', '')
                    //         commit('setAccess', [])
                    //         commit('setUserInfo', []); //存储登录的角色信息
                    //         resolve()
                    //     }).catch(err => {
                    //         reject(err)
                    //     })
                    // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
                    // commit('setToken', '')
                    // commit('setAccess', [])
                    // resolve()
            })
        },
        // 获取用户相关信息
        getUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
                //TODO:设置头像地址
                let dic = {};
                dic.avatar = "avator";
                dic.user_name = "user_name";
                dic.user_id = "user_id";
                dic.access = "access";
                const data = dic

                // commit('setAvatar', data.avatar)
                commit('setUserName', dic.name)
                commit('setUserId', dic.user_id)
                commit('setAccess', dic.access)
                commit('setHasGetInfo', true)
                resolve(data)
                    // try {
                    //     getUserInfo(state.token).then(res => {
                    //         const data = res
                    //         console.log(res)
                    //             //TODO:设置头像地址
                    //         let dic = {};
                    //         dic.avatar = "avator";
                    //         dic.user_name = "user_name";
                    //         dic.user_id = "user_id";
                    //         dic.access = "access";
                    //         // commit('setAvatar', data.avatar)
                    //         commit('setUserName', dic.name)
                    //         commit('setUserId', dic.user_id)
                    //         commit('setAccess', dic.access)
                    //         commit('setHasGetInfo', true)
                    //         resolve(data)
                    //     }).catch(err => {
                    //         reject(err)
                    //     })
                    // } catch (error) {
                    //     reject(error)
                    // }
            })
        },
        // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
        getUnreadMessageCount({ state, commit }) {
            // getUnreadCount().then(res => {
            //     const { data } = res
            //     commit('setMessageCount', data)
            // })
        },
        // 获取消息列表，其中包含未读、已读、回收站三个列表
        getMessageList({ state, commit }) {
            // return new Promise((resolve, reject) => {
            //     getMessage().then(res => {
            //         const { unread, readed, trash } = res
            //         commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
            //         commit('setMessageReadedList', readed.map(_ => {
            //             _.loading = false
            //             return _
            //         }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
            //         commit('setMessageTrashList', trash.map(_ => {
            //             _.loading = false
            //             return _
            //         }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
            //         resolve()
            //     }).catch(error => {
            //         reject(error)
            //     })
            // })
        },
        // 根据当前点击的消息的id获取内容
        getContentByMsgId({ state, commit }, { msg_id }) {
            // return new Promise((resolve, reject) => {
            //     let contentItem = state.messageContentStore[msg_id]
            //     if (contentItem) {
            //         resolve(contentItem)
            //     } else {
            //         getContentByMsgId(msg_id).then(res => {
            //             const content = res
            //             commit('updateMessageContentStore', { msg_id, content })
            //             resolve(content)
            //         })
            //     }
            // })
        },
        // 把一个未读消息标记为已读
        hasRead({ state, commit }, { msg_id }) {
            // return new Promise((resolve, reject) => {
            //     hasRead(msg_id).then(() => {
            //         commit('moveMsg', {
            //             from: 'messageUnreadList',
            //             to: 'messageReadedList',
            //             msg_id
            //         })
            //         commit('setMessageCount', state.unreadCount - 1)
            //         resolve()
            //     }).catch(error => {
            //         reject(error)
            //     })
            // })
        },
        // 删除一个已读消息到回收站
        removeReaded({ commit }, { msg_id }) {
            // return new Promise((resolve, reject) => {
            //     removeReaded(msg_id).then(() => {
            //         commit('moveMsg', {
            //             from: 'messageReadedList',
            //             to: 'messageTrashList',
            //             msg_id
            //         })
            //         resolve()
            //     }).catch(error => {
            //         reject(error)
            //     })
            // })
        },
        // 还原一个已删除消息到已读消息
        restoreTrash({ commit }, { msg_id }) {
            // return new Promise((resolve, reject) => {
            //     restoreTrash(msg_id).then(() => {
            //         commit('moveMsg', {
            //             from: 'messageTrashList',
            //             to: 'messageReadedList',
            //             msg_id
            //         })
            //         resolve()
            //     }).catch(error => {
            //         reject(error)
            //     })
            // })
        }
    }
}