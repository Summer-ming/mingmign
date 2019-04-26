<template>
  <div>
    
     <row class='Numbers'>
            <i-col style='margin-right:20px;'>采购单号:YG180828X0049267</i-col>  
            <i-col span='5' class='time'>状态:<time>已结算</time></i-col>
            <i-col>
                 <Button   type="primary">导出PDF</Button>
                 <Button   type="primary">付款</Button> 
                 <Button   type="primary">提单</Button>  
                 <Button   type="primary">入库</Button>  
                 <Button   type="primary">结算</Button>  
                 <Button   type="primary">开票</Button>      
            </i-col>   
    </row>  

    <!-- 操作步骤条 -->
    <row class='step_all'>
          <Steps :current="5" class='step_list' >
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
        <dt>采购单号：YG180201X000020564</dt>
        <dd>采购公司：上海闽航</dd>
      </dl>
      <dl>
        <dt>采购公司：上海闽航</dt>
        <dd>采购员：管理员1</dd>
      </dl>
      <dl>
        <dt>合同金额：100万</dt>
        <dd>状态：已开票</dd>
      </dl>
        
    </row>
    <!-- TAB切换 -->
    <row>
        <Tabs value="name1">
        <TabPane label="全部明细" name="name1"><allOrder></allOrder></TabPane>
        <TabPane label="订单流" name="name2"><order></order></TabPane>
        <TabPane label="审核流" name="name3"><examine></examine></TabPane>
        <TabPane label="付款流" name="name4"><payment></payment></TabPane>
        <TabPane label="提货和实提" name="name5"><bill></bill></TabPane>
        <TabPane label="收货信息" name="name6"><goods></goods></TabPane>
        <TabPane label="开票信息" name="name7"> <invoice></invoice> </TabPane>
        </Tabs>

    </row>



  </div>
</template>
<script>
import invoice from '@/view/systemMan/invoice' //开票信息
import goods from '@/view/systemMan/goods'//收货信息
import bill from '@/view/systemMan/bill'//收货信息
import payment from '@/view/systemMan/payment' //付款流
import examine from '@/view/systemMan/examine'//审核流  shenH
import order from '@/view/systemMan/order' //订单流
import allOrder from '@/view/systemMan/allOrder'//全部明细
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
         allOrder
    },
    data(){
      return {
       
              
      }
    },
    methods:{
       
    },
    mounted(){
     
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

