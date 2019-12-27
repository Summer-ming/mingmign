<template>
  <div>
  
      <row>
        <Steps :current="current"  status="finish"  direction="vertical">
          <Step  v-for="(item, index) in dataList"  :title="item.createTime"
           :content="getStatusStr(item)"  :key="index"></Step>
    </Steps>
      </row>
  </div>
</template>
<script>
import  {findOrderCaozuoRecord }from '@/api/data'
import {getBuyOrderCaoZuoStatus} from '@/libs/allStatus'
  export default {
    name: 'buy_examine',
    props: ["allOrder_orderItem"],
    data(){
      return {
        valueForm_allOrder_orderItem:"",
        dataList:[],
        current:0,
      }
    },
    methods:{
       getOrderAuditList(){//获取订单审核流信息
            console.log("查询流水")
            console.log(this.valueForm_allOrder_orderItem);
            let p  = {};
            p.id = this.valueForm_allOrder_orderItem.id;
            p.pageSize ="99999"
            p.orderType ="1"
            findOrderCaozuoRecord(p).then(res =>{
              if(res.code =='100' && res.data.list.length>0){
                  this.dataList = res.data.list
                  this.current = res.data.list.length;
              }else{
              }
            })
       },
       getStatusStr(item){
         getBuyOrderCaoZuoStatus(item);
         let s = getBuyOrderCaoZuoStatus(item);
         return s;
       }
    },
     watch: {
        allOrder_orderItem(val){
            console.log("这里是审核流组件");
            console.log(val.ordersNo);
            console.log(val.id);
            this.valueForm_allOrder_orderItem = val;
            this.getOrderAuditList();
        }
    },
    mounted(){
    },
  }
</script>
<style <style lang="less">
.ivu-steps-content{
  color:#0C8AEB!important
}
</style>

