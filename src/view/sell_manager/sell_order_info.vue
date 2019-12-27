<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-10-16 17:18:14
 * @其他: 
 -->
<template>
  <div>
    
     <row class='Numbers'>
            <i-col style='margin-left:4px;'>销售单号 <a>{{orderInfoItem.orderNo}}</a></i-col>  
            <i-col >
                 <!-- 确认出货 更换到审核销售订单处触发。 -->
                 <Button size='small' :disabled="btnShow1"  style="margin-left: 10px;"   type="primary" @click='getFukuan'>到账单收款</Button> 
                 <Button size='small' :disabled="btnShow1" style="margin-left: 10px;"   type="primary" @click='getOrderPay' >订单收款</Button>  

                 <Button size='small' style="margin-left: 10px;"  :disabled="btnShow9"  type="warning" @click='getJieSuo' >申请解锁</Button>

                 <Button size='small' :disabled="btnShow2"  style="margin-left: 10px;"   type="primary" @click='getShiTi1'>录实提</Button>  
                 <Button size='small' :disabled="btnShow7"  style="margin-left:10px;" type ="primary" @click="changeOrderInfoNew">修改订单明细</Button>
                 
                 <Button size='small' :disabled="btnShow3"  style="margin-left: 10px;"   type="primary" @click='getKaipiao' >开票申请</Button>  
                 <Button size='small' :disabled="btnShow5"  style="margin-left:10px;" type ="primary" @click="setOrderExamine">再次提交订单审核</Button>
                 <Button size='small' :disabled="btnShow6"  style="margin-left:10px;" type ="primary" @click="deleteOrder">删除订单</Button>
            </i-col>   
    </row>  


    <!-- 订单内容 -->
    <row class='order_all'>
      <dl>
        <dt>销售单号：{{orderInfoItem.orderNo}}</dt>
         <dt>客户：{{orderInfoItem.cusOrgName}}</dt>
         <dt>工程：{{orderInfoItem.gongcheng}}</dt>

      </dl>
      <dl>
        <dt>供应商公司：{{orderInfoItem.shopOrgName}}</dt>
        <dt>采购员：{{orderInfoItem.adminName}}</dt>
       <dt>订单状态：{{orderStats}}</dt>

      </dl>
      <dl>
        <dt>合同金额：{{orderInfoItem.money}}</dt>
         <dt>杂费总额：{{orderInfoItem.otherMoney}}</dt>
         <dt>收货时间：{{orderInfoItem.createTime}}</dt>

      </dl>
       <dl>
        <dt>结算总金额：{{orderInfoItem.jiesuanMoney}}</dt>
       <dt>利息总额：{{orderInfoItem.interestMoney}}</dt>
       <dt>货物实收金额：{{this.$global.isMoneyShow(this.searchOrderItem.realMoney)}}</dt>

      </dl>
    </row>
    <!-- TAB切换 -->
    <row >
        <Tabs  value="name1">
        <TabPane label="全部明细" name="name1"><allOrder :allOrder_orderItem="orderItem"></allOrder></TabPane>
        <TabPane label="审核流" name="name3"><examine :allOrder_orderItem="orderItem"></examine></TabPane>
        <TabPane label="杂费信息" name="name2"><incidental :allOrder_orderItem="orderItem"></incidental></TabPane>
         <TabPane label="图片信息" name="name4"><sellImg :allOrder_orderItem="orderItem"></sellImg></TabPane>

          <TabPane label="收款信息" name="name5"><sellInformation :allOrder_orderItem="orderItem"></sellInformation></TabPane>
          <!-- <TabPane label="计息信息" name="name6"><sell_prolit v-on:triggerFunc="parentFunc" :allOrder_orderItem="orderItem"></sell_prolit></TabPane> -->

        <!-- <TabPane label="订单流" name="name2"><order ></order></TabPane>
        <TabPane label="付款流" name="name4"><payment :allOrder_orderItem="orderItem"></payment></TabPane> -->
        <!-- <TabPane label="提货和实提" name="name5"><bill></bill></TabPane> -->
        <!-- <TabPane label="收货信息" name="name6"><goods></goods></TabPane> -->
        <!-- <TabPane label="开票信息" name="name7"> <invoice></invoice> </TabPane> -->
        </Tabs>
    </row>

      <!-- 弹窗 -->
     <Modal
        v-model="modal1"
        title="申请解锁订单"
        
        :footer-hide='true'
       >
        <Form :model="formItem1" inline :label-width="100" >

            <FormItem label='订单号:'>
                    <p style='color:red'>{{formItem1.timeGou}}</p>
            </FormItem>
        

           <FormItem style="margin-top:20px" label='解锁原因'>
            <Input type="textarea" style='width:300px' v-model='formItem1.duiNote' placeholder='请输入原因'/>
          </FormItem>
          
        </Form>
        <div>
            <Button    type="primary"  @click='getQue'>确定</Button>
            <Button  type="default" style="margin-left:10px" @click="modalCancel">取消</Button>

        </div>
    </Modal> 

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
import sellInformation from '@/view/sell_manager/order_component/sell_payment_information' //付款信息 sell_payment_information
import sell_prolit from '@/view/sell_manager/order_component/sell_prolit'//利息信息 即 计息信息

import {accountManagement,findOrgMoneyRecord,updateInStock} from '@/api/data'   

import {getBuyOrderStatus} from '@/libs/allStatus'
import {
updateOrdersStatus,findOrdersAll,findOrdersInfoAll,updateOrderInfo } from '@/api/data_8889'
import { mapMutations } from 'vuex'
import {jieSuo} from '@/api/cusData'
import Utils from '@/api/middle'
  export default {
    name: 'sell_order_info',
    inject:['reload'],  //調用組建app.vue
    components:{
         invoice,
         goods,
         bill,
         payment,
         examine,
         order,
         allOrder,
         incidental,
         sellImg,
         sellInformation,
         sell_prolit
    },
    data(){
      return {
        modal1:false,

        formItem1:{
          timeGou:"",//订单号
          duiNote:"",//解锁原因
        },
        orderInfoList:[],//订单明细单的数组
        searchOrderItem:{},//通过api 查询到的订单信息
        orderItem:'父组件的值传给子组件',
        orderInfoItem:{//存放订单明细的字典
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          gongcheng:'',
          jiesuanMoney:'',//结算总金额
          interestMoney:'',//利息总金额
          otherMoney:'',//杂费总额
          createTime:'',
          realMoney:''
        },
        btnShow1:true,
        btnShow2:true,
        btnShow3:true,
        btnShow4:true,
        btnShow5:true,
        btnShow6:true,
        btnShow7:true,
        btnShow8:true,
        btnShow9:true,
        orderStats:''  
      }
    },
    methods:{


            //开始
      getJieSuo(){//申请解锁
          this.modal1=true;
          this.formItem1.timeGou=this.searchOrderItem.ordersNo;


      },
      getQue(){//确定
        let params={};
        params.orderId=this.searchOrderItem.id;

        params.orderNo=this.searchOrderItem.ordersNo;

        params.orderType="2";

        params.engineering=this.searchOrderItem.gongcheng

        params.applyUserId=this.$global.adminInfo.id;

        params.applyUserName=this.$global.adminInfo.cname;

        params.applyNote=this.formItem1.duiNote;

        params.auditStatus="1"

        params.auditType="2"
         jieSuo(params).then(res=>{
            if(res.code =="100"){
                this.modal1=false;
                this.$Notice.success({
                          title:'申请解锁成功，请等待审核',
                          duration:1,
                          onClose:res =>{
                          }
                       })
          }  
        })
        
      },
      modalCancel(){//取消
          this.modal1=false;
      },


      // 结束
      parentFunc(val) {
           let p  = {};
         p.ordersNo = JSON.parse(sessionStorage.getItem('XiaoShou')).ordersNo;

         findOrdersAll(p).then(res=>{
            if(res.code =="100"){
              this.searchOrderItem = res.data.list[0];

              let a = this.$global.accAdd(this.searchOrderItem.deliveryTotalMoneyCus,this.searchOrderItem.interestMoney);
              this.orderInfoItem.jiesuanMoney   = this.$global.isMoneyShow(a)
              this.orderInfoItem.interestMoney   = this.$global.isMoneyShow(this.searchOrderItem.interestMoney)

            }  
         })
	},
         ...mapMutations([
      'closeTag'
    ]),
    getFukuanO(){//跳转到杂费付款页面
        const route = { 
                  name: 'sell_order_om_pay_info',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
      closeSelf(){//审核或者关闭之后跳转到
          console.log("准备关闭")
          this.closeTag({
              name: 'sell_order_info',
              query:this.searchOrderItem
          })
          setTimeout(() => {
            this.toreload();
          }, 1000);
       },
       toreload(){//通知列表页面刷新数据
          console.log("准备关闭2")
           Utils.$emit('demo','reload');
       },
      deleteOrder(){//删除订单
        this.$Modal.confirm({
                                           title:"确定删除订单吗,删除订单会同步释放库存",
                                           onOk:()=>{
                                                  this.setOrderInfoStatus();//删除订单明细改状态为 0
                                                this.updateOrderStatus();//删除订单 改状态为99

                                           }
                                         })
      },
      setOrderInfoStatus(){//修改订单明细的状态 改为0
          let p = {};
          let plist = [];
          this.orderInfoList.map(item=>{
            let dic = {};
            dic.id = item.id;
            dic.status = "0"
            plist.push(dic);
          })
          p.pageOrderInfoList = plist;
          updateOrderInfo(p).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'删除订单明细成功',
                 })
             }else{
                 this.$Notice.error({
                     title:'删除订单明细失败'
                 })
             }
          })
      },
      updateOrderStatus(){//删除订单 改状态为99
            let params            = {};
                params.id         = JSON.parse(sessionStorage.getItem('XiaoShou')).id;
                params.status     = "99"
                params.statusNote = "删除订单"
                params.userId     = this.$global.adminInfo.id
            updateOrdersStatus(params).then(res=>{
             if(res.code =="100"){
               this.updateInstockFunction();
               this.$Notice.success({
                 title:'删除成功',
                 duration:2,
                 onClose:res =>{
                     this.closeSelf();
                 }
               })
             }else{
               this.$Notice.error({
                 title:'删除失败'
               })
             }
           })
      },
       updateInstockFunction(){//删除订单后
                          let p     = {};
                          let plist = [];
              this.orderInfoList.map(item=>{
                    let dic             = {};
                        dic.id          = item.inStockId
                        dic.xuniJianshu = this.$global.accMinus(0,item.jianshu)
                        if(item.inStockId){
                          plist.push(dic); 
                        }
                })
                if(plist.length<=0){
                  return false;
                }
                p.pageOrderInfoList = plist
                  updateInStock(p).then(res =>{
                    if(res.code =='100'){
                        this.$Notice.success({
                            title:'修改库存成功',
                        })
                    }else{
                        this.$Notice.error({
                            title:'修改库存失败'
                        })
                    }
                  })
       },
      setOrderExamine(){//订单再次审核
          this.$Modal.confirm({
                                           title:"确定再次提交吗",
                                           onOk:()=>{
                                                let params            = {};
                                                    params.id         = JSON.parse(sessionStorage.getItem('XiaoShou')).id;
                                                    params.status     = "1"
                                                    params.statusNote = "再次提交订单审核"
                                                    params.userId     = this.$global.adminInfo.id
                                                updateOrdersStatus(params).then(res=>{
                                                 if(res.code =="100"){
                                                   this.$Notice.success({
                                                     title:'提交成功'
                                                   })
                                                   this.closeSelf();

                                                 }else{
                                                   this.$Notice.error({
                                                     title:'提交失败'
                                                   })
                                                 }
                                               })

                                           }
                                         })
      },
      getOrderPay(){//订单收款
            const route = { 
                  name: 'sell_order_with_order_pay_info',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
      },
      getKaipiao(){//开票申请
        const route = { 
                  name: 'sell_order_kaiPiao',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)

      },
      //确认出货按钮判断
       getOrderOrgRecord(){

            this.orgMoneyRecordItem ="";
            let p  = {};
            p.orderId = JSON.parse(sessionStorage.getItem('XiaoShou')).id;
            p.payMoneyType = "5"
            findOrgMoneyRecord(p).then(res=>{
                  if(res.code =="100"){
                    if(res.data.list.length>0){
                      this.btnShow4 = false;

                    }
                     
                }  
              })
       },
       setOrderInfo(){//给一些普通数据赋值
       this.getOrderOrgRecord();
      let oStatus = this.searchOrderItem.status;
      let duiZhangStatus=this.searchOrderItem.duiZhangStatus //获取对账单状态
       console.log('我是数据状态')
       console.log(this.searchOrderItem)
      
              if(Number(oStatus)<9){
                this.btnShow7 =false;//改订单明细;开票申请前都可以修改明细
              }
      if(Number(oStatus) == -1){
          this.btnShow5 = true;
        }
        if(Number(oStatus) <=1){
          this.btnShow5 = false;//再次提交订单审核
          this.btnShow6 = false;//btnShow6

        }
       if(Number(oStatus) >=2){
              this.btnShow1 = false;//到账单收款;任何订单审核通过后可以收款
              this.btnShow2 = false;//录实提;订单可以录实提，也可以开票前在修改实提
              this.btnShow4 = false;//确认出货;录入实提前确认出货
              this.btnShow8 = false;//杂费付款,审核后可以一直付款
        }
        if(Number(oStatus) >=7){
              this.btnShow3 = false;//开票申请;录入实提后可以开票申请
              this.btnShow4 = true;//确认出货;录入实提前确认出货

        }
        if(Number(oStatus)>=10){//订单状态 大于等于 8 不可以在录入实提
              this.btnShow2 = true;//录实提;开票后不可以修改实提
              this.btnShow3 = true;
        }
        console.log("duiZhangStatus"+duiZhangStatus);
         if(Number(duiZhangStatus)==8){//只留合同付款和到账单入账显示 其他按钮隐藏
           this.btnShow1=false;//合同付款
           this.btnShow8=false;//到账单入账
           this.btnShow9=false;//申请解锁
           
           this.btnShow2 = true;//录实提;开票后不可以修改实提
           this.btnShow3=true
           this.btnShow4=true
           this.btnShow5=true
           this.btnShow6=true
           this.btnShow7=true
       }
        this.orderItem = this.searchOrderItem;
        this.orderInfoItem.orderNo     = this.searchOrderItem.ordersNo
        this.orderInfoItem.cusOrgName  = this.searchOrderItem.customerOrgName
        this.orderInfoItem.shopOrgName = this.searchOrderItem.shopOrgName
        this.orderInfoItem.adminName   = this.searchOrderItem.userName
        this.orderInfoItem.money       = this.$global.isMoneyShow(this.searchOrderItem.moneyAll)
        this.orderInfoItem.gongcheng   = this.searchOrderItem.gongcheng

        let a = this.$global.accAdd(this.searchOrderItem.deliveryTotalMoneyCus,this.searchOrderItem.interestMoney);
        this.orderInfoItem.jiesuanMoney   = this.$global.isMoneyShow(a)
        this.orderInfoItem.interestMoney   = this.$global.isMoneyShow(this.searchOrderItem.interestMoney)
        this.orderInfoItem.otherMoney     = this.$global.isMoneyShow(this.searchOrderItem.otherMoney);
        this.orderInfoItem.createTime =this.searchOrderItem.createTime;
        this.orderStats = getBuyOrderStatus(this.searchOrderItem.status);
         this.getOrderInfoMessage();
       },
       getOrderIn(){//获取订单明细信息

       },
    
       getFukuan(){//跳转到付款页面
          const route = { 
                  name: 'sell_order_pay_info',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
       getChu(){
            //确认订单出库，给客户记录出账流水
             const route = { 
                  name: 'sell_order_addOrgMoneyRecord',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
       getShiTi(){

             const route = { 
                  name: 'sell_order_changeActual',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
         getShiTi1(){
     

             const route = { 
                  name: 'sell_order_changeActual1',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
       changeOrderInfo(){
         const route = { 
                  name: 'sell_order_change_oinfo',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
       changeOrderInfoNew(){
         const route = { 
                  name: 'sell_order_change_oinfo_vxeTable',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
       getruKu(){
         const route = { 
                  name: 'add_order_delivery_actual',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
       //查询接口
       getOrderMessage(){
         let p  = {};
         p.ordersNo = JSON.parse(sessionStorage.getItem('XiaoShou')).ordersNo;

         findOrdersAll(p).then(res=>{
            if(res.code =="100"){
              this.searchOrderItem = res.data.list[0];
              this.setOrderInfo();
            }  
         })
       },
       getOrderInfoMessage(){//查询订单明细，方便删除按钮使用
          let p  = {};
         p.orderNo = JSON.parse(sessionStorage.getItem('XiaoShou')).ordersNo;
         p.pageSize ="999999"
         findOrdersInfoAll(p).then(res=>{
            if(res.code =="100"){
              this.orderInfoList = res.data.list;
              //判断如果订单明细中有绑定日期 则 录实提和修改订单明细按钮不可点击
              res.data.list.map(item=>{
                if(item.duizhangTime){
                  console.log("运行判断")
                  this.btnShow2 = true;
                  this.btnShow7 = true;
                }
              })
              
            }  
         })
       }
     
    },
    mounted(){
      this.getOrderMessage();
     

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
  height:120px;
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

