<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">如无法登录，请联系管理员</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import { appendFile } from 'fs';
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
              //处理当用户输入错误账号 或密码的情况
              if(res.code !="100"){
                 this.$Notice.error({
                    title:res.msg
                })
                return ;
              }
              let sa = res.info.list;
              console.log(sa);
              let reArr = [];//权限数组
              sa.map(item=>{
                console.log(item);
                if(item == null || item=='' ){
                }else{
                  reArr.push(item.name);
                }
              })
              console.log("登陆成功")
              //处理一下 权限页面数组
              if(reArr.length > 0){

              }else{
                this.$Notice.error({
                    title:'登录失败！该角色无法登陆'
                })
                return ;
              }
              localStorage.setItem('routeArr',JSON.stringify(reArr))
              localStorage.setItem('isF',true)//设置状态是否刷新
              console.log(res)
             

          if(res.code =='100'){
            this.$Notice.success({
              title:'登录成功'
            })
            this.getUserInfo().then(res=>{
              console.log('登陆成功跳转首页')
              
               this.$router.push({
                name:this.$config.homeName
              })
            })
          }else{
            this.$Notice.error({
              title:'登录失败！请检查账户和密码'
            })
          }
          //32543 test
      })
    }
  }
}
</script>

<style>

</style>
