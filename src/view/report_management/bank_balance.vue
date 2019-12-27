
<!--
 * @Description: 客户余额表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
    <div  style="background: #ffffff;">
    <Form  :label-width="120"   :model="searchForm">
      <h2 style='text-indent:20px;'>基本信息</h2>
      <br>
      <span style="margin-left:40px">目前只支持上海杭州银行卡</span>
      <br>

      <FormItem label='付款银行卡:'>
        <Select style="width:400px" clearable  :label-in-value="true" v-model="searchForm.card">
          <Option v-if="item.type==1" v-for="(item, index) in searchForm.cardList" :value="item.value"  :key="index">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem  label='余额：'>
        <Input style="width:400px"    v-model='searchForm.balance' />元
      </FormItem>
      
    </Form>
    <div>
            <Button style="margin-right:10px"  type="primary" @click="searchM" >查询</Button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config'
import {companyCardTypeList} from '@/libs/global_type'
export default {
    name: 'bank_balance',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        modal1:false,
        searchForm:{
          balance:'',
          card:'',
          cardList:companyCardTypeList,
        }
      }
    },
    methods:{
       //查询表格
       searchM(){
         console.log(this.searchForm.card);
         switch (Number(this.searchForm.card)) {
           case 3:
             this.get_HangZhouBank_balance();
             break;
         
           default:
             this.$Notice.info({
               title:'当前只可以查询上海杭州银行余额'
             })
             break;
         }
       },
       //获取杭州银行 余额
       get_HangZhouBank_balance(){
        const baseUrl = process.env.NODE_ENV === 'development' ? 'http://10.100.16.65:8889/jgerp-hz-YQZL/' : config.baseUrl.HZbank_SH
        axios({
          url:baseUrl+'pay/getBalance',
          methods:'get',
          data:{}
        })
        .then((res)=>{
          if(res.data.code =="100"){
            let dic = res.data.data;
            for (let i in dic){
              if(i.trim() =="bankBal"){
                this.searchForm.balance = this.$global.isMoneyShow(dic[i])
              }
            }
          }
        })
        .catch((res)=>{
          console.log("获取失败")
          console.log(res);
        })
       }
    },
    mounted(){
    },
    
    created(){
   
    },
}

</script>
<style <style lang="less">
</style>
