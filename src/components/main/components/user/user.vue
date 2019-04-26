<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar shape="square" size="large"  src="https://jgys.oss-cn-shenzhen.aliyuncs.com/baseImg/yaotou.gif"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
        <DropdownItem name="changeMima">修改密码</DropdownItem>

      </DropdownMenu>
    </Dropdown>

     <Modal
        title="修改密码"
        v-model="changeModal"
        :mask-closable="false" inline width='700px;' >
        <Form :v-model="formItem" :label-width="140">
              <FormItem label='请输入原始密码'>
                <Input style='width:300px' v-model='formItem.oldPassword' placeholder='请输入原始密码'/>
              </FormItem>
              <FormItem label='请输入新密码'>
              <Input style='width:300px' v-model='formItem.newPassword' placeholder='请输入新密码'/>
              </FormItem>
              <FormItem label='请重复输入密码'>
              <Input style='width:300px' v-model='formItem.againNewPassword' placeholder='请在次输入新密码'/>
              </FormItem>
        </Form>
        <div >
          <Button style="margin-right:10px" @click="okConfig" type="primary" size="small" >确认修改</Button>
          <Button @click="cancel" type="default" size="small" >取消</Button>
        </div>
        </Modal>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import {updatePassword} from '@/api/user'
export default {
  name: 'User',
  data(){
    return {
      changeModal:false,
      formItem:{
        oldPassword:'',
        newPassword:"",
        againNewPassword:""
      }
    }
  },
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    okConfig(){
      if(this.formItem.newPassword !=this.formItem.againNewPassword){
        this.$Message.warning("输入的新密码不相同，不可提交")
        return ;
      }
      console.log("提交成功")
      let p = {};
      p.id          = this.$global.adminInfo.id
      p.oldPassword = this.formItem.oldPassword;
      p.newPassword = this.formItem.newPassword;
      updatePassword(p).then(res =>{
         if(res.code =='100'){
             this.$Notice.success({
                 title:'修改密码成功,将返回重新登录',
                  duration:2,
                  onClose:res =>{
                  console.log('关闭时回调')
                  this.logoutOut();
               }
             })
         }else{
             this.$Notice.error({
                 title:res.msg
             })
         }
      })
    },
    cancel(){
      this.changeModal = false;
    },
    logoutOut(){//退出登录
      this.handleLogOut().then(() => {
                  this.$router.push({
                    name: 'login'
                  })
                })
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.logoutOut();
          break;
        case 'changeMima':
          console.log("修改密码")
          this.changeModal = true;
        break
      }
    }
  }
}
</script>
