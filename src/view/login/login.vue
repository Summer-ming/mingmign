<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
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
                console.log(res);
          if(res.code =='100'){
            this.$Notice.success({
              title:'登录成功'
            })
            this.getUserInfo().then(res=>{
               this.$router.push({
                name:this.$config.homeName
              })
            })
          }else{
            this.$Notice.error({
              title:'登录失败！请检查账户和密码'
            })
          }
      })
    }
  }
}
</script>

<style>

</style>
