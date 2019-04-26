<template>
  <div>
    
     <row class='Numbers'>
            <i-col style='margin-right:20px;'>采购单号 <a>{{orderInfoItem.orderNo}}</a></i-col>  
            <!-- <i-col span='5' class='time'>状态:<time>已结算</time></i-col> -->
            <i-col >
                 <!-- <Button style="margin-right: 10px;"   type="primary" @click='getTiDn'>提单</Button> -->
                 <Button v-show="btnShow1" style="margin-right: 10px;"   type="primary" @click='getFukuan'>收款</Button> 
                 <Button v-show="btnShow2" style="margin-right: 10px;"   type="primary" @click='getShiTi'>录实提</Button>  
                 <Button v-show="btnShow3" style="margin-right: 10px;"   type="primary" @click='getKaipiao' >开票申请</Button>  
            </i-col>   
    </row>  

    <!-- 操作步骤条 -->
    <row class='step_all'>
          <Steps :current="0" class='step_list' >
            <Step title="下单" content=""></Step>
            <Step title="审核" content=""></Step>
            <Step title="买家付款" content=""></Step>
            <Step title="付款审核" content=""></Step>
            <Step title="提货申请" content=""></Step>
            <Step title="开放货单" content=""></Step>
            <Step title="录入实提" content=""></Step>
            <Step title="收货" content=""></Step>
            <Step title="开票" content=""></Step>
            <Step title="交易成功" content=""></Step>
        </Steps>
           
          <div style='width:60%;margin-left:460px;'>
            <p class='p_border'></p>
            <Steps :current="-1" class='step_two'>
              <Step title="付款申请中" content=""></Step>
              <Step title="付款已完成" content=""></Step>
            </Steps>
          </div>

    </row>
    <!-- 订单内容 -->
    <row class='order_all'>
      <dl>
        <dt>采购单号：{{orderInfoItem.orderNo}}</dt>
         <dd>采购公司：{{orderInfoItem.cusOrgName}}</dd>
      </dl>
      <dl>
        <dt>供应商公司：{{orderInfoItem.shopOrgName}}</dt>
        <dd>采购员：{{orderInfoItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{orderInfoItem.money}}</dt>
      </dl>
        
    </row>
    <!-- TAB切换 -->
    <row>
        <Tabs value="name1">
        <TabPane label="全部明细" name="name1"><allOrder :allOrder_orderItem="orderItem"></allOrder></TabPane>
        <TabPane label="审核流" name="name3"><examine :allOrder_orderItem="orderItem"></examine></TabPane>
        <!-- <TabPane label="杂费信息" name="name2"><incidental :allOrder_orderItem="orderItem"></incidental></TabPane> -->
         <TabPane label="图片信息" name="name4"><sellImg :allOrder_orderItem="orderItem"></sellImg></TabPane>
        <!-- <TabPane label="订单流" name="name2"><order ></order></TabPane>
        <TabPane label="付款流" name="name4"><payment :allOrder_orderItem="orderItem"></payment></TabPane> -->
        <!-- <TabPane label="提货和实提" name="name5"><bill></bill></TabPane> -->
        <!-- <TabPane label="收货信息" name="name6"><goods></goods></TabPane> -->
        <!-- <TabPane label="开票信息" name="name7"> <invoice></invoice> </TabPane> -->
        </Tabs>
    </row>



  </div>
</template>
<script>
import invoice from '@/view/sell_manager/order_component/sell_invoice' //开票信息
import goods from '@/view/sell_manager/order_component/sell_goods'//收货信息
import bill from '@/view/sell_manager/order_component/sell_bill'//收货信息
import payment from '@/view/sell_manager/order_component/sell_payment' //付款流
import examine from '@/view/sell_manager/order_component/sell_examine'//审核流  shenH
import order from '@/view/sell_manager/order_component/sell_order' //订单流
import allOrder from '@/view/sell_manager/order_component/sell_allOrder'//全部明细
import incidental from '@/view/sell_manager/order_component/sell_Incidental'//杂费信息
import sellImg from '@/view/sell_manager/order_component/sell_img'//图片信息

import {accountManagement} from '@/api/data'
  export default {
    name: 'sell_order_info',
    components:{
         invoice,
         goods,
         bill,
         payment,
         examine,
         order,
         allOrder,
         incidental,
         sellImg
    },
    data(){
      return {
        orderItem:'父组件的值传给子组件',
        orderInfoItem:{//存放订单明细的字典
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:''
        },
        btnShow1:false,
        btnShow2:false,
        btnShow3:false,
              
      }
    },
    methods:{
      getKaipiao(){//开票申请
        const route = { 
                  name: 'sell_order_kaiPiao',
                  query: this.$route.query
                  }
             this.$router.push(route)

      },
       setOrderInfo(){//给一些普通数据赋值
       if(Number(this.$route.query.status) >=2){
              this.btnShow1 = true;
              this.btnShow2 = true;
              this.btnShow3 = true;
        }
        var item = this.$route.query;
        this.orderItem = item;
        console.log("父组件获取到item的值");
        console.log(this.orderItem);
        this.orderInfoItem.orderNo     = item.ordersNo
        this.orderInfoItem.cusOrgName  = item.customerOrgName
        this.orderInfoItem.shopOrgName = item.shopOrgName
        this.orderInfoItem.adminName   = item.userName
        this.orderInfoItem.money       = this.$global.isMoneyShow(this.$route.query.moneyAll)
       },
       getOrderIn(){//获取订单明细信息

       },
       //跳转提单页面
       getTiDn(){
              const route = { name: 'takeGoods',
                  query: 1
                  }
             this.$router.push(route)
       },
       getFukuan(){//跳转到付款页面
          const route = { 
                  name: 'sell_order_pay_info',
                  query: this.$route.query
                  }
             this.$router.push(route)
       },
       getShiTi(){
         const route = { 
                  name: 'sell_order_change_info',
                  query: this.$route.query
                  }
             this.$router.push(route)
       },
       getruKu(){
         const route = { 
                  name: 'add_order_delivery_actual',
                  query: this.$route.query
                  }
             this.$router.push(route)
       }
     
    },
    mounted(){
      this.setOrderInfo();
    },
  }
</script>
<style <style lang="less">
.Numbers{
    height:70px;
    padding-top:20px;
    font-size:18px;
    display: flex;
    .time{
      time{
        color:red;
      }
    }
    
}

.step_all{
  height:226px;
  background: #ffffff;
  padding-top:15px;
  position:relative;
  .step_list{
    display: flex;

  }
  .p_border{
    height:100px;
    width:1px;
    background: #cccccc;
    margin-top:-10px;
  }
  .step_two{
    margin-left:-10px;
    width:50%;
  }
}

.order_all{
  height:100px;
  background:rgba(235,254,255,1);
  border:1px dashed rgba(134,223,228,1);
  display:flex;
  dl{
    flex:1;
    padding-top:20px;
    dt{
     height:14px;
      font-size:14px;
      font-family:SourceHanSansCN-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:14px;
      text-indent:20px;
      margin-bottom:20px;
    }
    dd{
      height:14px;
      font-size:14px;
      text-indent:20px;
      font-family:SourceHanSansCN-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:14px
    }
  }
}
</style>

