<template>
  <div>
  
      <row>
        <Steps :current="current"  status="finish"  direction="vertical">
          <Step style="color:red" v-for="(item, index) in dataList"  :title="item.createTime"
           :content="getStatusStr(item)"  :key="index"></Step>
        <!-- <Step title="2019年3月26日15:33:54  周一" content="付款300万  管理员"></Step>
        <Step title="2019年3月26日15:33:54  周一" content="付款300万  管理员"></Step>
        <Step title="2019年3月26日15:33:54  周一" content="付款300万  管理员"></Step>
        <Step title="2019年3月26日15:33:54  周一" content="付款300万  管理员"></Step> -->
    </Steps>
           

      </row>


  </div>
</template>
<script>
import  {findOrderCaozuoRecord }from '@/api/data'
import {getBuyOrderCaoZuoStatus} from '@/libs/allStatus'
  export default {
    name: 'sell_examine',
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
            let p  = {};
            p.id = this.valueForm_allOrder_orderItem.id;
            p.pageSize ="99999"
            p.orderType ="2"
            findOrderCaozuoRecord(p).then(res =>{
              if(res.code =='100' && res.data.list.length>0){
                  this.dataList = res.data.list
                  this.current = res.data.list.length;
                  this.$Notice.success({
                      title:'获取订单审核流水成功',
                  })
              }else{
                  this.$Notice.error({
                      title:'获取订单审核流水失败'
                  })
              }
            })
       },
       getStatusStr(item){
         console.log(item.newOrderStatus);
         getBuyOrderCaoZuoStatus(item);
         let s = getBuyOrderCaoZuoStatus(item);
         console.log(s);
         return s;
       }
    },
     watch: {
        allOrder_orderItem(val){
            console.log("watch buy_examine");
            console.log(val.ordersNo);
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

