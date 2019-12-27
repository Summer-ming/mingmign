/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-11-18 14:21:58 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-12-11 17:24:20
 */
/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-11-18 13:55:49 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-11-18 14:17:23
 */
<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-08-06 11:16:25
 * @其他: 
 -->
<template>
  <div>
    
     <row class='Numbers'>
            <i-col style='margin-left:4px;'>采购单号 <a>{{orderInfoItem.orderNo}}</a></i-col>  
            <i-col>
                 <Button size="small" :disabled="btnShow1"   style="margin-left: 10px;"   type="primary" @click='getFukuan'>合同付款</Button>
                 <!-- 新的改订单明细 -->
                  <Button size="small" :disabled="btnShow3"    style="margin-left: 10px;"   type="primary" @click='getShiTi1'>改订单明细</Button> 

                 <Button size="small" :disabled="btnShow4"  style="margin-left: 10px;"    type="primary" @click='getruKu' >入库</Button>

                 <Button size="small" style="margin-left: 10px;"  :disabled="btnShow8"   type="primary" @click='getRuZhang' >到账单入账</Button>
                 <Button size="small" style="margin-left: 10px;"  :disabled="btnShow9"  type="warning" @click='getJieSuo' >申请解锁</Button>
                 <Button size="small" :disabled="btnShow5"  style="margin-left: 10px;" type ="primary" @click="setOrderExamine">再次提交订单审核</Button>
                 <Button size="small" :disabled="btnShow6"  style="margin-left: 10px;" type ="primary" @click="deleteOrder">删除订单</Button>
                 <Button size="small" :disabled="btnShow7"  style="margin-left: 10px;"   type="primary" @click='changeShiTi'>补录实提</Button>  
                 <Button size="small" type='info' style="margin-left: 10px;" @click="printPdf1(1)">打印预付合同</Button>
                 <Button size="small" type='info' style="margin-left: 10px;" @click="printPdf1(2)">打印实提合同</Button>
            </i-col>   
    </row>  


    <!-- 订单内容 -->
    <row class='order_all' >
      <dl>
        <dt>采购单号：{{orderInfoItem.orderNo}}</dt>
       <dt>采购公司：{{orderInfoItem.cusOrgName}}</dt>
       <dt>下单时间：{{orderInfoItem.createTime}}</dt>
      </dl>
      <dl>
        <dt>供应商公司：{{orderInfoItem.shopOrgName}}</dt>
        <dt>采购员：{{orderInfoItem.adminName}}</dt>
       <dt>店铺名称：{{orderInfoItem.shopName}}</dt>

      </dl>
      <dl>
        <dt>合同金额：{{orderInfoItem.money}}</dt>
        <dt>工程名称：{{orderInfoItem.gongcheng}}</dt>
      </dl>
      <dl>
       <dt>订单状态：{{orderStats}}</dt>
       <dt>付款状态：{{orderPayStatus}}</dt>
      </dl>
        
    </row>
    <!-- TAB切换 -->
    <row >
        <Tabs  value="name1">
        <TabPane label="全部明细" name="name1"><allOrder :allOrder_orderItem="orderItem"></allOrder></TabPane>
        <TabPane label="审核流" name="name3"><examine :allOrder_orderItem="orderItem"></examine></TabPane>
        <TabPane label="付款信息" name="name4"><payment :allOrder_orderItem="orderItem"></payment></TabPane>
        <!-- <TabPane label="订单流" name="name2"><order></order></TabPane> -->
        <!-- <TabPane label="杂费信息" name="name2"><incidental :allOrder_orderItem="orderItem"></incidental></TabPane> -->
        <TabPane label="图片信息" name="name5"><buyImg :allOrder_orderItem="orderItem"></buyImg></TabPane>
        <!-- <TabPane label="提货和实提" name="name5"><bill></bill></TabPane> -->
        <!-- <TabPane label="收货信息" name="name6"><goods></goods></TabPane> -->
        <!-- <TabPane label="开票信息" name="name7"> <invoice></invoice> </TabPane> -->
        <TabPane label="付款申请信息" name="name8"><buy_pay_apply :allOrder_orderItem="orderItem"></buy_pay_apply></TabPane>

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
     <!-- 结束 -->
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
import buy_pay_apply from '@/view/buy_manager/buy_order_info_components/buy_pay_apply' //付款申请信息

import {accountManagement,findOrdersInfoAll,findOrgCusAcc,buyOrderPdf,
updateOrdersStatus,findOrdersAll,updateOrderInfo} from '@/api/data'
import {getBuyOrderStatus,getBuyOrderIsPayMoneyStatus,OMst} from '@/libs/allStatus' 
import {jieSuo} from '@/api/cusData'
import { mapMutations } from 'vuex'
import Utils from '@/api/middle'
import normal from '@/libs/normal.js'
  export default {
    name: 'listBuy',
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
         buyImg,
         buy_pay_apply
    },
    data(){
      return {
        shopOrgItem:'',
        modal1:false,

        formItem1:{
          timeGou:"",//订单号
          duiNote:"",//解锁原因
        },
        orderInfoList:[],
        searchOrderItem:{},//实时获取的订单信息
        orderItem:'父组件的值传给子组件',
        orderInfoItem:{//存放订单明细的字典
          orderNo:"",
          cusOrgName :'', 
          shopOrgName :"",
          adminName  :'',
          money:'',       
          gongcheng :"",
          createTime:'',
          shopName:''

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
        orderStats:'',
        orderPayStatus:''

              
      }
    },
    methods:{
      //开始
      getJieSuo(){//申请解锁
          this.modal1=true;
          this.formItem1.timeGou=JSON.parse(sessionStorage.getItem('CAIGOU')).ordersNo;


      },
      getQue(){//确定
        let params={};
        params.orderId=this.searchOrderItem.id;

        params.orderNo=this.searchOrderItem.ordersNo;

        params.orderType="1";

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
          ...mapMutations([
      'closeTag'
    ]),
    changeShiTi(){//修改实提信息
        const route = { 
                  name: 'buy_order_change_delivery_actual',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
    },
      closeSelf(){//审核或者关闭之后跳转到
       
          this.closeTag({
              name: 'order_buy_info',
          })
          const route = { 
                  name: 'buy_order_list',
                  query: ''
                  }
             this.$router.push(route)
          setTimeout(() => {
            Utils.$emit('buy_order_list','reload');
          }, 100);
       },
      deleteOrder(){//删除订单
        this.$Modal.confirm({
                                           title:"确定删除订单吗",
                                           onOk:()=>{
                                                  this.setOrderInfoStatus();//删除订单明细状态为0
                                                  this.setOrderStatus();//删除订单状态为99
                                           }
                                         })
      },
      setOrderStatus(){//修改订单状态，删除订单
            let params            = {};
                                                    params.id         = JSON.parse(sessionStorage.getItem('CAIGOU')).id;
                                                    params.status     = "99"
                                                    params.statusNote = "删除订单"
                                                    params.userId     = this.$global.adminInfo.id
                                                updateOrdersStatus(params).then(res=>{
                                                 if(res.code =="100"){
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
      setOrderInfoStatus(){//修改订单明细的状态
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
      setOrderExamine(){//订单再次审核
          this.$Modal.confirm({
                                           title:"确定再次提交吗",
                                           onOk:()=>{
                                                let params            = {};
                                                    params.id         = JSON.parse(sessionStorage.getItem('CAIGOU')).id;
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
      
       setOrderInfo(){//给一些普通数据赋值
       //true 不可用 false 可用
       //订单没开票之前可以一直使用
       let oStatus = this.searchOrderItem.status;
       let duiZhangStatus=this.searchOrderItem.duiZhangStatus //获取对账单状态
       console.log('我是数据状态')
       console.log(oStatus);
       console.log(this.searchOrderItem)
       
       if(Number(oStatus) <9){
        this.btnShow3 = false;//改订单明细

       }
        //订单状态小于等于1 可以删除和提交审核订单
        if(Number(oStatus) <=1){
          this.btnShow5 = false;//再次提交订单审核
          this.btnShow6 = false;//删除订单
        }
        //订单状态大于2 可以一直《合同付款》《杂费付款》《入库》
        if(Number(oStatus) >=2){
              this.btnShow1 = false;//合同付款
              this.btnShow2 = false;//杂费付款
              
              this.btnShow4 = false;//入库
        }
        if(Number(oStatus)>=6){ //6是已入库
          this.btnShow4 = true;
          this.btnShow7 = false;//改实提

        }
        //订单状态 大于8 入库，不可以在入库；可以改实提
        if(Number(oStatus) >=8){//已经录入实提之后，不可以再次修改实提，或入库，
              this.btnShow4 = true;//入库
              
        }
        console.log("duiZhangStatus="+duiZhangStatus);
        if(Number(duiZhangStatus)==8){//只留合同付款和到账单入账显示 其他按钮隐藏
           this.btnShow1=false;//合同付款
           this.btnShow8=false;//到账单入账
           this.btnShow9=false;//申请解锁
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
        this.orderStats = getBuyOrderStatus(this.searchOrderItem.status);
        this.orderPayStatus = getBuyOrderIsPayMoneyStatus(this.searchOrderItem.payMoneyStatus)
        this.orderInfoItem.createTime = this.searchOrderItem.createTime;
        this.orderInfoItem.shopName = this.searchOrderItem.shopName;
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
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
       getOrderShopOrgInfo(){//获取店铺的银行卡信息
        //  findOrgCusAcc
        let p ={};
        p.orgId = this.searchOrderItem.merchantsId;
        findOrgCusAcc(p).then(res =>{
              if(res.code =='100'){
                this.shopOrgItem = res.data.list[0];
              //   this.$Notice.success({
              //     title:'查询供应商公司银行卡信息成功',
              //  })
            }else{
                //  this.$Notice.error({
                //  title:'查询供应商公司银行卡信息失败'
                // })
            }
         })
       },

       getOrderMessage(){//获取订单信息 TODO
        //获取到query 信息后，取出订单号 用来查询
        let p = {};
        p.ordersNo = JSON.parse(sessionStorage.getItem('CAIGOU')).ordersNo
         findOrdersAll(p).then(res=>{
            if(res.code =="100"){
              this.searchOrderItem = res.data.list[0];
              this.setOrderInfo();
              this.getOrderShopOrgInfo();
          }  
        })
       },
       getOrderInfoMessage(){//获取订单明细的状态
            let params = {};
            params.orderNo = JSON.parse(sessionStorage.getItem('CAIGOU')).ordersNo;
            params.pageSize = 10000;
            findOrdersInfoAll(params).then(res =>{
              if(res.code =="100"){
                this.orderInfoList = res.data.list;
              }
            })
       },
       getFukuan(){//跳转到付款页面
          const route = { 
                  name: 'order_pay_info',
                  query: this.searchOrderItem
                  }
              
             this.$router.push(route)
       },
       getShiTi(){
         const route = { 
                  name: 'buy_order_change_info',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
      //测试使用订单明细
       getShiTi1(){
         const route = { 
                  name: 'buy_order_change_info1',
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
       //开票申请
       getPiao(){
         const route = { 
                  name: 'kaiPiao',
                  query: this.searchOrderItem
                  }
             this.$router.push(route)
       },
       //入账 跳转到其他页面
       getRuZhang(){
         const route = { 
               name: 'buy_order_pay_info',
               query: this.searchOrderItem
               }
         this.$router.push(route)
       },
       printPdf1(type){//打印预付合同
      //  'https://jgys.oss-cn-shenzhen.aliyuncs.com/buyOrderPdf/2019/11/19/4cc05d35-3106-42a9-9239-5a0a3c2200d4.pdf'
       //加载loading框，打印需要5-8秒
       const loading = this.$loading({
          lock: true,
          text: '文件生成中，请等待',
          spinner: 'el-icon-loading',
          customClass:'loadingClass',
        });
        //为防止特殊错误情况，loading没有关闭，设置10秒后自动关闭
           setTimeout(() => {
          loading.close();
        }, 10000);
      //  this.searchOrderItem 存订单信息
      //  this.orderInfoList 存订单明细信息
    this.searchOrderItem = this.$global.killNull(this.searchOrderItem)
    this.shopOrgItem = this.$global.killNull(this.shopOrgItem)

       let p  ={};
      
 //生成pdf文件名称的方法
        let aa = this.searchOrderItem.createTime.substr(0,10);//采购日期
        let bb = OMst(this.searchOrderItem.bankJgId);//本公司缩写
        let cc = this.searchOrderItem.shopOrgName;//代理商
              cc = cc.replace('有限公司','');
              cc = cc.replace('有限公司','有限责任公司');
        let dd = this.orderInfoList[0].jiaohuodi?this.orderInfoList[0].jiaohuodi:'';//交货地
       p.pdfName = aa+'-'+bb+'-'+cc+'-'+dd;//采购日期+本公司缩写+代理商缩写+明细中的交货地
       p.bankJgId = this.searchOrderItem.bankJgId;
        p.pageBuyOrderPdfListList=[];
        let tNumber = 0;//总件数
        let tWeight = 0;//总重量
        let tMoney = 0;//总金额
       this.orderInfoList.map(item=>{
          let dic                  = {};
              dic.chanpinmingcheng = item.steelName;                                    //产品名称
              dic.zhiliangwenti    = '正品';                                              //质量问题描述
              dic.guige            = item.steelGuige;                                   //规格
              dic.caizhi           = item.steelPaihao;                                  //材质
              dic.chandi           = item.steelPinpai;                                  //产地
              dic.jizhongfangshi   = item.jizhongType;                                  //计量方式
              if(type=="1"){//1是预付合同
                dic.jianshu          = item.jianshu;                                      //件数
                dic.shuliang         = this.$global.accPrecision(item.zongzhongliang,3);  //数量 即重量
                dic.hanshuidanjia    = this.$global.accPrecision(item.guapaijia,2);       //含税单价
                dic.jiner            = this.$global.accPrecision(item.cusMoney,2);        //金额即采购总金额
                p.pageBuyOrderPdfListList.push(dic);
              }else{//2是实提合同
                dic.jianshu          = item.jiesuanJianshu;                                      //件数
                dic.shuliang         = this.$global.accPrecision(item.jiesuanWeight,3);  //数量 即重量
                dic.hanshuidanjia    = this.$global.accPrecision(item.jiesuanDanjia,2);       //含税单价
                dic.jiner            = this.$global.accPrecision(item.jiesuanMoney,2);        //金额即采购总金额
                if(dic.jianshu!=0){
                p.pageBuyOrderPdfListList.push(dic);
                }
              }
              tNumber =this.$global.accAdd(tNumber,dic.jianshu)
              tWeight =this.$global.accAdd(tWeight,dic.shuliang)
              tMoney =this.$global.accAdd(tMoney,dic.jiner)
              
              
       })
    //列表中的合计
    console.log("总金额："+tMoney);
    console.log(normal.changeMoneyToChinese(tMoney))
    p.zongjianshu = tNumber;//总件数
    p.zongshuliang = tWeight;//总重量
    p.zongjiner = tMoney;//总金额
    p.renminbi = normal.changeMoneyToChinese(tMoney);//人民币大写

    //合同顶部 右侧页眉
    p.jingbanren    = this.searchOrderItem.userName;   //经办人
    p.lianxifangshi = this.searchOrderItem.userPhone;  //经办人的联系方式
    console.log("searchOrderItem");
    console.log(this.searchOrderItem);
    //合同顶部存放的内容
    p.jiafang       = this.searchOrderItem.customerOrgName;               //需方公司名称 eg:上海市闽航电子商务有限公司
    p.hetongbianhao = this.searchOrderItem.ordersNo;                 //合同编号
    p.qiandingriqi  = this.searchOrderItem.createTime.substr(0,4)+'年'
                    +this.searchOrderItem.createTime.substr(5,2)+'月'
                    +this.searchOrderItem.createTime.substr(8,2)+'日';//签订日期
    p.yifang = this.searchOrderItem.shopOrgName;  //乙方公司名称，即供方公司名称
    p.qiandingdidian='上海市宝山区';//签订地点
    //合同条款的内容
    p.jiaohuodi='甲方指定交货地点';//交货地 eg：厂提
    //bankJgId = 1是福建 2是上海
    let lDic = this.searchOrderItem.bankJgId =="1"? this.$global.pdfFJItem :this.$global.pdfSHItem;
    //合同底部 左侧甲方内容
    p.danweimigncheng1  = lDic.orgName;      //单位名称1
    p.danweidizhi1      = lDic.address;      //单位地址
    p.fadingdaibiaoren1 = lDic.legalPerson;  //法定代表人
    p.weituodailiren1   = '';                //委托代理人
    p.dianhua1          = lDic.phone;        //电话
    p.chuanzhen1        = lDic.fax;          //传真
    p.kaihuyinhang1     = lDic.bankName;     //开户银行
    p.zhanghu1          = lDic.bankCardNo;   //账号
    p.shuihao1          = lDic.taxNumber;    //税号
    
    //合同底部 右侧乙方内容
    // this.shopOrgItem 存放供应商信息
    p.danweimigncheng2  = this.searchOrderItem.shopOrgName;  //单位名称
    p.danweidizhi2      = this.shopOrgItem.cusaddress;       //单位地址
    p.fadingdaibiaoren2 = this.shopOrgItem.orglegalPerson;   //法定代表人
    p.weituodailire2    = '';                                //委托代表人
    p.dianhua2          = '';                                //电话
    p.chuanzhen2        = '';                                //传真
    p.kaihuyinhang2     = this.shopOrgItem.tkaccBank;        //开户行
    p.zhanghu2          = this.shopOrgItem.tkaccBankCode;    //账号
    p.shuihao2          = this.shopOrgItem.orgtaxNo;         //税号
    
    console.log(p);
    console.log(this.$global.adminInfo.mobile)
          buyOrderPdf(p).then(res =>{
            loading.close();
            console.log(res);
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'打印成功',
                 })
       let str ='https://jgys.oss-cn-shenzhen.aliyuncs.com/'+res.msg;
        console.log(str);
                 window.open(str,'_blank')
              }else{
                   this.$Notice.error({
                   title:'打印失败'
                  })
              }
           })
           
       },
     
    },
    mounted(){
       this.getOrderMessage();
       this.getOrderInfoMessage();
    },
   
    created(){
          
    },
  }
</script>
<style <style lang="less">
.loadingClass{
  font-size:100px;
}
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
  height:250px;
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
  margin-top:10px;
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

