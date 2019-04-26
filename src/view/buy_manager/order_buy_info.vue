<template>
  <div>
    
     <row class='Numbers'>
            <i-col style='margin-right:20px;'>采购单号 <a>{{orderInfoItem.orderNo}}</a></i-col>  
            <!-- <i-col span='5' class='time'>状态:<time>已结算</time></i-col> -->
            <i-col>
                 <!-- <Button style="margin-right: 10px;"   type="primary" @click='getTiDn'>提单</Button> -->
                 <Button v-show="btnShow1" style="margin-right: 10px;"   type="primary" @click='getFukuan'>合同付款</Button>
                 <Button v-show="btnShow2" style="margin-right: 10px;"   type="primary" @click='getFukuanO'>杂费付款</Button> 
                 <Button v-show="btnShow3" style="margin-right: 10px;"   type="primary" @click='getShiTi'>录实提</Button>  
                 <Button v-show="btnShow4" style="margin-right: 10px;"   type="primary" @click='getruKu' >入库</Button>
                 <!-- <Button style="margin-right: 10px;"   type="primary" @click='getPiao' >开票申请</Button>     -->
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
        <TabPane label="付款流" name="name4"><payment :allOrder_orderItem="orderItem"></payment></TabPane>
        <!-- <TabPane label="订单流" name="name2"><order></order></TabPane> -->
        <TabPane label="杂费信息" name="name2"><incidental :allOrder_orderItem="orderItem"></incidental></TabPane>
        <TabPane label="图片信息" name="name5"><buyImg :allOrder_orderItem="orderItem"></buyImg></TabPane>
        <!-- <TabPane label="提货和实提" name="name5"><bill></bill></TabPane> -->
        <!-- <TabPane label="收货信息" name="name6"><goods></goods></TabPane> -->
        <!-- <TabPane label="开票信息" name="name7"> <invoice></invoice> </TabPane> -->
        </Tabs>

    </row>



  </div>
</template>
<script>
import invoice from '@/view/buy_manager/buy_order_info_components/buy_invoice' //开票信息
import goods from '@/view/buy_manager/buy_order_info_components/buy_goods'//收货信息
import bill from '@/view/buy_manager/buy_order_info_components/buy_bill'//收货信息
import payment from '@/view/buy_manager/buy_order_info_components/buy_payment' //付款流
import examine from '@/view/buy_manager/buy_order_info_components/buy_examine'//审核流  shenH
import order from '@/view/buy_manager/buy_order_info_components/buy_order' //订单流
import allOrder from '@/view/buy_manager/buy_order_info_components/buy_allOrder'//全部明细   
import incidental from '@/view/buy_manager/buy_order_info_components/buy_Incidental'//杂费信息
import buyImg from '@/view/buy_manager/buy_order_info_components/buy_img'
import {accountManagement} from '@/api/data'
  export default {
    name: 'listBuy',
    components:{
         invoice,
         goods,
         bill,
         payment,
         examine,
         order,
         allOrder,
         incidental,
         buyImg
    },
    data(){
      return {
        orderItem:'父组件的值传给子组件',
        orderInfoItem:{//存放订单明细的字典
          orderNo:""
        },
        btnShow1:false,
        btnShow2:false,
        btnShow3:false,
        btnShow4:false,
              
      }
    },
    methods:{
      
       setOrderInfo(){//给一些普通数据赋值
        if(Number(this.$route.query.status) >=2){
              this.btnShow1 = true;
              this.btnShow2 = true;
              this.btnShow3 = true;
              this.btnShow4 = true;
        }
        var item = this.$route.query;
        this.orderItem = item;
        console.log("父组件获取到item的值");
        console.log(this.orderItem.ordersNo);
        this.orderInfoItem.orderNo     = item.ordersNo
        this.orderInfoItem.cusOrgName  = this.$route.query.customerOrgName
        this.orderInfoItem.shopOrgName = this.$route.query.shopOrgName
        this.orderInfoItem.adminName   = this.$route.query.userName
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
       getFukuanO(){//跳转到杂费付款页面
        const route = { 
                  name: 'order_om_pay_info',
                  query: this.$route.query
                  }
             this.$router.push(route)
       },
       getFukuan(){//跳转到付款页面
          const route = { 
                  name: 'order_pay_info',
                  query: this.$route.query
                  }
             this.$router.push(route)
       },
       getShiTi(){
         const route = { 
                  name: 'buy_order_change_info',
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
       },
       //开票申请
       getPiao(){
         const route = { 
                  name: 'kaiPiao',
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

