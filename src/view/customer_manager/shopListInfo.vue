<!--
 * @Description:店铺详情 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-04 10:43:19
 -->

<template>
  <div  style="background: #ffffff;">
    <Form  :label-width="120"   :model="addForm">
      <h2 style='text-indent:20px;'>基本信息</h2>
      <FormItem  label='公司名称：'>
        <Input   class="width_300" v-model='addForm.companyName' placeholder='请输入店铺名称'/>
      </FormItem>
       <FormItem label='店铺名称：'>
        <Input  class="width_300" v-model='addForm.shopName' placeholder='请输入店铺名称'/>
      </FormItem>
      <FormItem label='付款银行卡:'>
        <Select clearable  :label-in-value="true" class="width_300" v-model="addForm.card">
          <Option v-for="(item, index) in addForm.cardList" :value="item.accId"  :key="index">{{item.accBank +'('+'卡号'+item.accBankCode+ '所属支行联行号：'+item.accBblId +'银行卡id：'+item.accId+')'}}</Option>
        </Select>
      </FormItem>
    </Form>
    <div>
            <Button style="margin-right:10px" v-show="addBtn" type="primary" @click="addNewShop" :disabled="isDisable">添加</Button>
            <Button style="margin-right:10px" v-show="changeBtn"  type="primary" @click="changeShop" :disabled="isDisableOne">修改</Button>
            <Button  type="primary" @click="closeSelf">关闭</Button>
    </div>
  </div>
  
</template>
<script>
import { mapMutations } from 'vuex'
import { findAccount,addShop,updateShop } from '@/api/data'
export default {
  name:'shopListInfo',
  inject: ['reload'],
  data() {
    return {
      isDisableOne:false,
      isDisable:false,
      addBtn:true,
      changeBtn:true,
      deleteBtn:true,
      addForm:{
        orgId:'',
        shopId:'',
        companyName:'',
        orgName:'',
        shopName:'',
        card:'',
        accountId:'',
        cardList:[]

      }
    }
  },
  methods: {
     ...mapMutations([
      'closeTag'
    ]),
    addNewShop(){
      console.log(this.addForm.card);
      let param = {};
        param.name  = this.addForm.shopName;//店铺名称
				param.orgId = this.addForm.orgId;//店铺公司id
				param.orgName = this.addForm.orgName;//店铺公司名称
        param.accountId = this.addForm.card;//公司指定打款银行id
        
				param.adminId = this.$global.adminInfo.id;
				param.adminName = this.$global.adminInfo.cname;
				param.auditStatus  ="8";
				param.createEname = this.$global.adminInfo.ename;
				param.createCname = this.$global.adminInfo.cname;
				param.money = "0";
				param.dongjieMoney = "0";
				param.creditShop = "1";
        param.status = "1";
        console.log(param)
      addShop(param).then(res=>{
        if(res.code =="100"){
          this.isDisable=true;
          this.$Notice.success({
                 title:'已经新增一个店铺',
          })
            let _that=this;
            setTimeout(function(){
               _that.closeTag({
                name: 'shopListInfo'
              })
            }, 100);             
          }
      })
    },
    changeShop(){//修改店铺
        let param = {};
        console.log(param)
        param.id = this.addForm.shopId;
        param.name = this.addForm.shopName;
        
        param.accountId =this.addForm.card; 
      updateShop(param).then(res=>{
        if(res.code =="100"){
          this.isDisableOne=true;
          this.$Notice.success({
                title:'修改成功',
          })
         let _that=this;
            setTimeout(function(){
               _that.closeTag({
                name: 'shopListInfo'
              })
            }, 100);  
        }
      })
    },
    deleteShop(){

    },
    closeSelf(){
      this.closeTag({
        name: 'shopListInfo'
      })
    },
    findOrgAccount(){
      let param = {};
      param.accStauts = "1"
      param.accOrgId = this.addForm.orgId;
      param.accType = "30"

      findAccount(param).then(res=>{
        if(res.code =="100"){
          this.addForm.cardList = res.data.list
          this.addForm.card = this.addForm.accountId;
        }
      })
    },
    setFormItem(){
      console.log(this.$route.query.operateType);
      if(this.$route.query.operateType == "1"){
        this.addBtn = true;
        this.changeBtn = false;
        this.deleteBtn = false;
        this.addForm.orgName = this.$route.query.orgorgName;
        this.addForm.companyName = this.$route.query.orgorgName;
        this.addForm.orgId = this.$route.query.cusorgId;
      }else {//2和3 是编辑店铺
          this.addBtn = false;
        this.changeBtn = true;
        this.deleteBtn = true;
        this.addForm.orgName = this.$route.query.orgName;
        this.addForm.companyName = this.$route.query.orgName;
        this.addForm.shopName = this.$route.query.name;
        this.addForm.orgId = this.$route.query.orgId;
        this.addForm.shopId = this.$route.query.id;
        this.addForm.accountId = this.$route.query.accountId
        
      }

    }
  },
  created () {
    this.setFormItem();
    this.findOrgAccount();
  },
}
</script>
<style>
.width_300{
  width: 600px;
}
.top_20{
  margin-top: 20px
}
</style>

