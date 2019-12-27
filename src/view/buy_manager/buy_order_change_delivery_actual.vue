/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-05-10 10:54:37 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-10-22 09:51:44
 */
<!--
 * @Description:审核采购单 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-10 10:27:38
 -->



<template>
     <div>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
      <dl>
        <dt>采购单号：{{formItem.orderNo}}</dt>
        <dd>采购公司：{{formItem.cusOrgName}}</dd>
      </dl>
      <dl>
        <dt>供应商公司：{{formItem.shopOrgName}}</dt>
        <dd>采购员：{{formItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{formItem.money}}</dt>
        <dt>工程：{{formItem.gongcheng}}</dt>
      </dl>
        
    </row>
    <row>
        <b class="font_32">合同信息</b>
        <Button size='small' type='primary' style='margin-left:8px; ' @click='copyClick'>复制合同到结算</Button>

          <!-- 新增图库table -->
             <vxe-table size="mini" border 
              class="vxe-table-element" 
              :data.sync="data1"
              :highlight-current-row="true"
              @edit-actived="currentChangeNew"
              :edit-config="{key: 'id', trigger: 'click', mode: 'cell',} ">
        
                <vxe-table-column prop="id" label="ID" width="40" fixed="left"></vxe-table-column>
                <vxe-table-column show-overflow  prop="steelName" label="品名" width="80" fixed="left"></vxe-table-column>
                <vxe-table-column show-overflow prop="steelGuige" label="规格" width="40" fixed="left"></vxe-table-column>   
                <vxe-table-column show-overflow prop="steelPaihao" label="材质" width="80" fixed="left"></vxe-table-column>
                <vxe-table-column show-overflow prop="steelPinpai" label="钢厂" width="40" ></vxe-table-column>
                <vxe-table-column show-overflow prop="steelWorks" label="提货方式" width="40" ></vxe-table-column>
                <vxe-table-column show-overflow prop="jiaohuodi" label="交货地" width="40" ></vxe-table-column>
                <vxe-table-column show-overflow prop="jianshu" label="采购件数" width="40"></vxe-table-column>
                <vxe-table-column show-overflow prop="weight" :formatter="this.$global.vxeTableWeight" label="单件重" width="80"></vxe-table-column>
                <vxe-table-column show-overflow prop="zongzhongliang" :formatter="this.$global.vxeTableWeight" label="总重" width="80"></vxe-table-column>
                <vxe-table-column show-overflow prop="guapaijia" label="单价" :formatter="this.$global.vxeTableMoney" width="80"></vxe-table-column>
                <vxe-table-column show-overflow prop="cusMoney" label="总金额"  :formatter="this.$global.vxeTableMoney" width="80"></vxe-table-column>
                <vxe-table-column show-overflow prop="jiesuanJianshu" label="结算件数" :edit-render="{name: 'ElInput',autoselect: true}"    width="100"></vxe-table-column>
                <vxe-table-column show-overflow prop="jiesuanDanjia" label="结算单价" :edit-render="{name: 'ElInput',autoselect: true}"  :formatter="this.$global.vxeTableMoney"  width="100"></vxe-table-column>
                <vxe-table-column show-overflow prop="jiesuanWeight" label="结算重量" :edit-render="{name: 'ElInput',autoselect: true}"  :formatter="this.$global.vxeTableWeight"  width="100"></vxe-table-column>
                <vxe-table-column show-overflow prop="jiesuanMoney" label="结算金额" :edit-render="{name: 'ElInput',autoselect: true}"  :formatter="this.$global.vxeTableMoney"  width="100"></vxe-table-column>

            
             </vxe-table>
        <!-- 结束 -->
    </row>
    <row>
          <span>合同重量合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.accPrecision(contractTWeight,3)}}吨</span>
      <span>合同金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(contractTMoney)}}元</span>
      <br>
      <span>实提重量合计：</span>
      <span  style="color:red;margin-right:20px">{{this.$global.accPrecision(tWeight,3)}}吨</span>
      <span>实提金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(tMoney)}}元</span>
      <br>
      <Button type="primary" @click="addBtn" :disabled="isDisable"> 修改提交</Button>
    </row>
    <p style="disaply:none">{{getTotal}}</p>

     </div>
</template>

<script>
import {findOrdersInfoAll,
updateOrderInfo,
addOrderInfo,
findOrgCusAcc,
updateOrderStatus,
findOrgMoneyRecord,
findBillFlow,
addBillFlow,
updateBillFlow,
updateOrgMoneyRecord,addOrgMoneyRecord} from '@/api/data'
import { mapMutations } from 'vuex'
import Utils from '@/api/middle'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import { Promise } from 'q';
export default {
    name: 'buy_order_change_delivery_actual',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        onlineBusinessDic:'',
        ciickItem:'',
        orderMoneyFlowItem:"",//订单的实提流水信息
        tWeight:0,//实提重量
        tMoney:0,//实提金额
        contractTMoney:0,//合同金额
        contractTWeight:0,//合同重量
        isDisable:false,
        tableItem:{},
        selectData:[{
          value:'1',
          label:'是'
        },{
          value:'0',
          label:"否"
        }],
        
      dataCompany:[],
        formItem: {
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          gongcheng:""
          },
         data1: [],//表格展示的数据
      }
    },
    
    methods:{
       copyClick(){
        this.data1.map(item=>{
            item.jiesuanWeight  = item.zongzhongliang   //结算重量
            item.jiesuanMoney   = item.cusMoney    //结算金额
            item.jiesuanDanjia  = item.guapaijia    //结算单价
            item.jiesuanJianshu  = item.jianshu //结算件数
        })
      },
      currentChangeNew({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event){
        this.ciickItem =column.label; 
      },
      getOrderOrgMoneyFlow(){//获取订单流水
      let p              = {};
          p.orderId      = this.$route.query.id;
          p.payMoneyType = "4";
          p.type         = "2";
        findOrgMoneyRecord(p).then(res =>{
              if(res.code =='100'){
                if(res.data.list.length>0){
                  this.orderMoneyFlowItem = res.data.list[0];
                }
                  
                this.$Notice.success({
                  title:'获取订单流水信息成功',
                  duration:1,
                  onClose:res =>{
                  }
               })
            }else{
                 this.$Notice.error({
                 title:'获取订单流水信息失败'
                })
            }
         })
      },
      //获取公司名字
      getComPany(){
             let p={};
              p.pageSize = "999999"
             findOrgCusAcc(p).then(res=>{

                  this.dataCompany=res.data.list            
            })
         },
      setOrderInfo(){
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName        
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll) 
          this.formItem.gongcheng             =  this.$route.query.gongcheng;
          this.getOrderInfo(); 
      },
      getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            console.log("已经获取到订单明细数据")
            if(res.code =="100"){
              for(var i=0; i<res.data.list.length;i++ ){

                //结算单价  结算金额  结算金额
                res.data.list[i].jiesuanDanjia=this.$global.accPrecision(res.data.list[i].jiesuanDanjia,2)
                res.data.list[i].jiesuanWeight=this.$global.accPrecision(res.data.list[i].jiesuanWeight,3)
                res.data.list[i].jiesuanMoney=this.$global.accPrecision(res.data.list[i].jiesuanMoney,2)
              }
              this.data1 = res.data.list.reverse();
            }else{
            }
          })
      },
       selectOne(row){
       },
       remove(index){
         this.data1.splice(index,1);
       },
       //步骤1 修改订单明细的信息
       addBtn(){//修改提交  重新修改
        //如果实提重量为0或实提金额为0 不可提交
        if(Number(this.tWeight)==0 || Number(this.tMoney) ==0){
          this.$Message.warning("实提重量或实提金额不可为0")
          return false;
        }
        
       this.isDisable=true;
        this.step1OK(); //修改订单明细的实提金额和实提重量 ；修改订单明细的结算重量，结算金额，结算状态
        this.step2OK(); //修改订单的实提总金额和实提总重量；修改订单状态为8 待收票
          if(this.orderMoneyFlowItem){//判断是否有订单的流水信息，有就修改没有则添加
            this.step3Ok();//修改订单的金额流水信息
          }else{
            this.step4AddOrgMoneyRecord();
          }
         
          if(this.onlineBusinessDic){//判断是否有值，有值修改，无值添加
            console.log("数组中有值")
            this.updateOnlineBusiness();
          }else{
            console.log("数组中无值")
              this.payOnlineBusiness();
          }
       },
       //步骤4:给供应商添加一笔流水入账流水；
       step4AddOrgMoneyRecord(){//走线下确认付款成功后，
            let p                   = {};
            let plist               = [];
                  let dic                 = {};
                      dic.customerId      = ""
                      dic.orderId         = this.$route.query.id;
                      dic.inMoney         = this.tMoney;
                      dic.outMoney        = "0";
                      dic.currentMoney    = "0"
                      dic.userId          = this.$global.adminInfo.id
                      dic.payMoneyType    = "4"
                      dic.note            = '采购单实提';
                      dic.orderNo         = this.$route.query.ordersNo;
                      dic.bankJgId        = this.$route.query.bankJgId;
                      dic.orgId           = this.$route.query.merchantsId;
                      dic.orgName         = this.$route.query.shopOrgName;
                      dic.daozhangdanId   = '0'
                      dic.bankConnectedId = '0'
                      dic.zhidanApplyId   = '0';
                      dic.zhaiyao         = ''
                      dic.direction       = ''
                      dic.type            = '2'
                      dic.status          = '1'

                plist.push(dic);
                p.list = plist;
           
             addOrgMoneyRecord(p).then(res=>{
                        if(res.code =="100"){
                          this.$Notice.success({
                            title:'入账流水添加成功',
                             onClose:res =>{
                                this.closeSelf();
                              }
                          })
                        }else{
                          this.$Notice.error({
                            title:'入账流水添加失败'
                          })
                        }
               })
        },
       step3Ok(){//修改订单的金额流水信息
       //如果订单已经有流水了则修改，没有流水则添加
       let p           = {};
       let plist       = [];
       let dic         = {};
           dic.id      = this.orderMoneyFlowItem.id;
           dic.inMoney = this.tMoney;
        plist.push(dic);
        p.list = plist;
            updateOrgMoneyRecord(p).then(res =>{
                  if(res.code =='100'){
                    this.$Notice.success({
                      title:'修改流水信息成功',
                      duration:1,
                      onClose:res =>{
                         this.closeSelf();
                      }
                   })
                }else{
                     this.$Notice.error({
                     title:'修改流水信息失败'
                    })
                }
             })           
       },
       step2OK(){//修改订单的实提金额和实提重量
       let p                         = {};
       let plist                     = [];
       let dic                       = {};
           dic.id                    = this.$route.query.id;
           dic.deliveryTotalMoneyCus = this.tMoney;
           dic.deliveryTotalWeight   = this.tWeight;
           dic.status                = "8";

       plist.push(dic);
       p.pageUpdateOrderList = plist;
        updateOrderStatus(p).then(res =>{
              if(res.code =='100'){
                this.$Notice.success({
                  title:'修改订单信息成功',
                  duration:1,
                  onClose:res =>{
                  }
               })
            }else{
                 this.$Notice.error({
                 title:'修改订单信息失败'
                })
            }
         })
       },
        step1OK(){
          let params = {};
          let pageOrderInfoList = [];
          for(var i=0; i<this.data1.length;i++ ){
            var item = this.data1[i];
            let dic = {};
                    dic.id            = item.id;
                    dic.jiesuanWeight = item.jiesuanWeight  //结算重量
                    dic.jiesuanMoney  = item.jiesuanMoney   //结算金额
                    dic.jiesuanDanjia = item.jiesuanDanjia   //结算单价
                    dic.jiesuanJianshu = item.jiesuanJianshu   //结算单价
                    dic.receiptStatus = "1"   //是否收货
            pageOrderInfoList.push(dic);
          }
          params.pageOrderInfoList = pageOrderInfoList;
          updateOrderInfo(params).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'修改成功',
                     duration:1,
                     onClose:res =>{
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'修改失败'
                 })
             }
          })
        },
       closeSelf(){//审核或者关闭之后跳转到
          this.closeTag({
              name: 'buy_order_change_delivery_actual',
              query:this.$route.query
          })
          //关闭自己，并且跳转到采购单列表
          setTimeout(() => {
                  const route = { 
                    name: 'buy_order_list',
                    query:''
                }
                this.$router.push(route)
                Utils.$emit('buy_order_list','reload');
               }, 100);
       },
       findOnlineBusinessList(){
         let p = {};
         p.orderId = this.$route.query.id;//订单号
         p.billType = '20020';//类型
         p.status = "1";
         findBillFlow(p).then(res =>{
               if(res.code =='100'){
                 this.onlineBusinessDic = res.data.list[0];
                 console.log("this.onlineBusinessDic")
                 console.log(this.onlineBusinessDic)
                 this.$Notice.success({
                   title:'查询电商流水成功',
                })
             }else{
                  this.$Notice.error({
                  title:'查询电商流水成功失败'
                 })
             }
          })
       },
             payOnlineBusiness(){//合同审核线上付款
          let p                     = {};
          let plist                 = [];
          let dic                   = {};
              dic.billType          = '20020';  //账单类型
              dic.fsMoney           = '0';  //发生金额
              dic.ysMoney           = this.$global.accMinus(0,this.tMoney);  //应收金额
              dic.dkpMoney          = this.tMoney;  //待开票金额

              dic.sellerEmpDept     = '';  //卖家负责人部门
              dic.sellerCompanyId   = this.$route.query.merchantsId;  //卖家公司id
              dic.sellerCompanyName = this.$route.query.shopOrgName;  //卖家公司名称
              dic.sellerEmpName     = this.$route.query.shopUserName;  //卖家负责人名称

              dic.buyerEmpDept      = '';  //买家负责人部门 本公司
              dic.buyerCompanyId    = this.$route.query.customerOrgId;  //买家公司id
              dic.buyerEmpName      = this.$global.adminInfo.cname;  //买家负责人名称
              dic.buyerCompanyName  = this.$route.query.customerOrgName;  //买家公司名称

              dic.orderId           = this.$route.query.id;  //订单id
              dic.orderNo           = this.$route.query.ordersNo;  //订单号

              dic.accApply          = '';  //打款申请
              dic.dkApply           = '';  //抵扣申请
              dic.txApply           = '';  //提现申请
              dic.kpApply           = '';  //开票申请
              dic.zxStatus          = '1';  //注销状态
              dic.note              = '实提账单';  //备注
              dic.status            = '1';  //可用状态
              dic.transactionType   = '2';  //交易账单类型（买家账单，卖家账单）
            plist.push(dic);
            p.billFlowList = plist;
          addBillFlow(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'添加电商流水成功',
                    onClose:res =>{
                    }
                 })
              }else{
                   this.$Notice.error({
                   title:'添加电商流水失败'
                  })
              }
           })
       },
       updateOnlineBusiness(){//修改线上流水
          let p                     = {};
          let plist                 = [];
          let dic                   = {};
              dic.id = this.onlineBusinessDic.id
              dic.ysMoney           = this.$global.accMinus(0,this.tMoney);  //应收金额
              dic.dkpMoney          = this.tMoney;  //待开票金额
              dic.buyerEmpName      = this.$global.adminInfo.cname;  //买家负责人名称

            plist.push(dic);
            p.billFlowList = plist;
          updateBillFlow(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改电商流水成功',
                    onClose:res =>{
                    }
                 })
              }else{
                   this.$Notice.error({
                   title:'修改电商流水失败'
                  })
              }
           })
       },
        ...mapMutations([
      'closeTag'
    ]),
   
    },
    computed:{
      getTotal(){
        let  a = 0;
        let b = 0;
        let c = 0;
        let d = 0;

        // tWeight:0,//实提重量
        // tMoney:0,//实提金额
        // contractTMoney:0,//合同金额
        // contractTWeight:0,//合同重量
        this.data1.map(item=>{
            //自动计算 结算单价* 结算重量  = 结算金额
            if(this.ciickItem =="结算单价" || this.ciickItem == "结算重量"){
                item.jiesuanMoney=item.jiesuanDanjia*item.jiesuanWeight
            }
           a = this.$global.accAdd(a,item.jiesuanWeight)
           b = this.$global.accAdd(b,item.jiesuanMoney)

           c = this.$global.accAdd(c,item.zongzhongliang)
           d = this.$global.accAdd(d,item.cusMoney)

        })
        this.tWeight         = a;
        this.tMoney          = b;
        this.contractTWeight = c;
        this.contractTMoney  = d;
      }
    },
    mounted(){
     this.setOrderInfo();
     this.getComPany();
     this.getOrderOrgMoneyFlow();
     this.findOnlineBusinessList();
    },
    
    created(){
   
    },
}

</script>
<style <style lang="less">


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
.font_32 {
        font-size: 32;
    }
    .ivu-table-cell{
      padding-left: 0 !important;
      padding-right:0 !important;

    }
    .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {
      padding: 0 2px;
      }
</style>