<!--
 * @Description: 订单申请付款
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 19:55:36
 -->
<template>
     <div>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
          <dl>
            <dt>销售单号：{{formItem.orderNo}}</dt>
            <dd>客户：{{formItem.cusOrgName}}</dd>
          </dl>
          <dl>
            <dt>供应商公司：{{formItem.shopOrgName}}</dt>
            <dd>管理员：{{formItem.adminName}}</dd>
          </dl>
          <dl>
            <dt>合同金额：{{formItem.money}}</dt>
          </dl>
        </row>


        <row>
            <b class="font_32">合同信息</b>
            <Table size="small" style="margin-bottom:10px"  border ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' >
            </Table>
        </row>
   
        <row>
          <Form :model="formItem" inline :label-width="120">
            <a>合同金额：<a style="color:red;">{{this.$global.isMoneyShow(formItem.payMoney)}}</a>元</a>&nbsp;&nbsp;
            <a>实提总金额(结算总金额)：<a style="color:red;">{{this.$global.isMoneyShow(formItem.deliveryTotalMoney)}}</a>元</a>&nbsp;&nbsp;
            <a>已收金额：<a style="color:red;">{{this.$global.isMoneyShow(formItem.receivedMoney)}}</a>元</a>&nbsp;&nbsp;


            <br>
            <!-- <FormItem label='订单金额'>
            <Input style='width:150px' v-model='formItem.payMoney' placeholder='请输入金额'/>
            </FormItem> -->
            <FormItem label='抵扣金额'>
            <Input style='width:150px' v-model='formItem.dikouMoney' placeholder='请输入抵扣金额'/>
            </FormItem>
            <FormItem label='已勾选总金额'>
            <Input style='width:150px' v-model='formItem.choseMoney' placeholder='请输入金额'/>
            </FormItem>
          </Form>
        </row>
      <!-- 选择到账单的列表项 -->
        <row>
          <Card>
            <Form :model="formItemD" inline :label-width="160">
                <FormItem label='选择付款银行账号：'>
                  <Select   v-model="formItemD.cardType"  style="width:300px"  placeholder="请选择"   >
                      <Option v-for="(item,index) in companyCardTypeListThis "  :value="item.value"  :key="index" >{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <Button style="margin-right:10px" type="primary" @click="searchD">查询|</Button>
            </Form>
              <Table @on-selection-change="selectAllSelection"  style="margin-bottom:10px" height="300" border ref="selection" :columns="columns5" :data="data5"  >
              </Table>
          </Card>
        </row>

       <row>
        <Button style="margin-right:10px" type="primary" @click="addBtn"  :disabled="isDisable" >确认收款</Button>
        <Button type="primary" @click="deletBtn"> 关闭</Button>
       </row>

       
     </div>
</template>

<script>
import {findOrdersInfoAll,updateFukuanZhenghe,} from '@/api/data_8889'
import {findDaoZhangDanAll,
findDaoZhangDanAllSH,
updateDaoZhangDanFJ,
addBillFlow,
daoOrderBridgeSH,addOrgMoneyRecord,
daoOrderBridgeFJ
} from '@/api/data'
import {updateOrderStatus} from '@/api/data_8889'
import { mapMutations } from 'vuex'
import {companyCardTypeList} from '@/libs/global_type'
import {daozhangdanCardType} from '@/libs/allStatus'

export default {
    name: 'sell_order_pay_info',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        isDisable:false,
        selectionList:[],
        companyCardTypeListThis:companyCardTypeList,
        formItemD:{
          cardType:''
        },
        formItem:{
          payMoney:'',
          dikouMoney:'0',
          deliveryTotalMoney:'0',//实提总金额
          chaMoney:'0',//差额 实提金额-  合同金额
          receivedMoney:"0",//已收金额
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          choseMoney:0,
          choseBaseMoney:0

        },
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        data5:[],
        columns5:[//到账单使用的列表
        {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
            {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                     {
                        title: 'ID',
                        key: 'daozhangdanId',
                        align: 'center',
                        width:'80'
                    },
                     {
                        title: '公司名称',
                        key: 'creditedCompany',
                        align: 'center',
                        width:'180'
                    },
                     {
                        title: '到账金额',
                        key: 'payMoney',
                        align: 'center',
                        width:'150',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.payMoney))
                        }
                    },
                     {
                        title: '可用金额',
                        key: 'dealMoney',
                        align: 'center',
                        width:'150',
                           render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dealMoney))
                        }
                    },
                    
                     {
                        title: '选择金额',
                        key: 'choseMoney',
                        align: 'center',
                        width:'130',
                         render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.choseMoney,2),
                            },
                            on:{
                              'on-blur':(event)=>{
                                console.log(event.target.value)
                                let a = event.target.value;
                                let b = params.row.dealMoney
                                if(parseFloat(a)>parseFloat(b)){
                                  this.$Message.warning('选择金额不可大于剩余可用金额')
                                  params.row.choseMoney = "0"
                                  this.data5[params.index].choseMoney = "0"

                                }else{
                                  this.data5[params.index].choseMoney = event.target.value
                                }
                                //如果用户已经勾选了，通知勾选的数组变化；
                                for(var i = 0;i<this.selectionList.length;i++){
                                  let item = this.selectionList[i];
                                  if(item.daozhangdanId == params.row.daozhangdanId){
                                    item.choseMoney = this.data5[params.index].choseMoney;
                                    break;
                                  }
                                }
                                this.getTotal();
                              }
                            }
                          })
                        }
                    },
                     {
                        title: '到账时间',
                        key: 'dealTime',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '到账银行卡',
                        key: 'jgBank',
                        align: 'center',
                        width:'160',
                        render:(h,params) =>{
                          return h('div',{
                          },daozhangdanCardType(params.row.jgBank))
                        }
                    },
        ],
        columns4: [
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'60'
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'90'
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'120'
                    },
                    {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '提货方式',
                        key: 'steelWorks',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '交货地',
                        key: 'jiaohuodi',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '总重量',
                        key: 'zongzhongliang',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.zongzhongliang,3))
                        }
                    },
                     {
                        title: '单价',
                        key: 'guapaijia',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.guapaijia,2))
                        }
                    },
                    {
                        title: '单价',
                        key: 'cusMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.cusMoney,2))
                        }
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100'
                    }
                    
                ],
                data1: [
                ],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      ...mapMutations([
      'closeTag'
      ]),
      selectAllSelection(data){//全选变化 TODO:
        console.log("发生变化");
        this.selectionList = data;
        this.getTotal();
      },
     
      searchD(){ //查询到账单 
        console.log(this.formItemD.cardType);
        this.selectionList = [];
        this.getTotal();
          this.searchDList();
      },
      
        searchDList(){//查询到账单列表 
         let param={};
         param.allEqualcreditedCompany=this.$route.query.customerOrgName //name
         param.beginDaozhangdanStatus = "1";
         param.endDaozhangdanStatus = "3"
         param.tranType = "1",
         param.pageSize =  "999999"
         param.beginDtype = "1";//只有确认入账的到账单才可以被查询到
         param.endDtype = "1";
         param.jgBank = this.formItemD.cardType //对应的银行卡所属公司
          findDaoZhangDanAll(param).then(res =>{
            if(res.code =="100"){
              this.data5 = res.data.list;
              this.data5.map((item) =>{
                item.choseMoney = item.dealMoney 
              })
              this.$Notice.success({
                title:'获取到账单成功'
              })
            }else{
              this.$Notice.error({
                title:'获取到账单失败'
              })
            }
          })
       },
        setOrderInfo(){
          console.log(this.$route.query);
          this.formItem.orderNo            = this.$route.query.ordersNo
          this.formItem.cusOrgName         = this.$route.query.customerOrgName
          this.formItem.shopOrgName        = this.$route.query.shopOrgName
          this.formItem.adminName          = this.$route.query.userName
          this.formItem.payMoney           = this.$route.query.moneyAll
          this.formItem.money              = Number(this.$route.query.moneyAll)
          this.formItem.deliveryTotalMoney = this.$route.query.deliveryTotalMoneyCus
          this.formItem.receivedMoney      = this.$route.query.receivedMoney

          
          this.formItemD.cardType          = this.$route.query.bankJgId
          this.getOrderInfo();
      },
       selectOne(row){
         console.log(row)
       },
     
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.orgName=this.formItem.companyName //name
         param.pageNum=this.pagesizea //分页
         param.status = 1 ;
         this.getSerch(param)
       },
        getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              this.data1 = res.data.list;
            }else{
            }
          })
      },
       remove(index){
         this.data1.splice(index,1);
       },
        
      updateDFJ(){//修改到账单福建
        let pageDaoZahangDanForUpdateList = [];
      this.selectionList.map((item) =>{
        let dic = {};
        dic.daozhangdanId = item.daozhangdanId;
        dic.dealMoney     = this.$global.accPrecision(item.choseMoney,2);
        pageDaoZahangDanForUpdateList.push(dic);
      })
      let p  = {};
      p.bankJgId                      = this.$route.query.bankJgId
      p.customerId                    = this.$route.query.customerId
      p.pageDaoZahangDanForUpdateList = pageDaoZahangDanForUpdateList;
      p.userId                        = this.$global.adminInfo.id
        updateDaoZhangDanFJ(p).then(res =>{
           if(res.code =='100'){
               this.$Notice.success({
                   title:'修改到账单上海成功',
               })
           }else{
               this.$Notice.error({
                   title:'修改到账单上海成功失败'
               })
           }
        })
      },
      addBridgeFJ(){
  let p = {}
         let pageDaoZahangDanForUpdateList = [];
         this.selectionList.map((item) =>{
              let dic = {};
              dic.daozhangdanId = item.daozhangdanId;
              dic.money = item.choseMoney;
              dic.orderId = this.$route.query.id
              dic.type ="2" ;//订单类型，1采购单 2销售单
              pageDaoZahangDanForUpdateList.push(dic);
          })
      p.pageDaozhangdanOrderBridges = pageDaoZahangDanForUpdateList;
         daoOrderBridgeFJ(p).then(res =>{
            if(res.code =='100'){
                this.$Notice.success({
                    title:'福建添加到桥梁表中成功',
                })
            }else{
                this.$Notice.error({
                    title:'福建添加到桥梁表中失败'
                })
            }
         })
      },
      //确定按钮需要调用的接口 结束
       addBtn(){//

         if(this.selectionList.length ==0){
           this.$Message.warning("请选择到账单")
         }else{
          console.log("提交");
          //1：先修改到账单
          //2:在添加到桥梁表中
          //3:添加到入账表中
          //4:在修改订单
          this.updateDFJ();//步骤1
          this.addBridgeFJ();//步骤2
          this.step3AddOrgFlow();//步骤3
          this.step4ChangeOrder();//步骤4
          this.payOnlineBusiness();
          
         }
        
       },
       payOnlineBusiness(){//合同审核线上付款
          let p                     = {};
          let plist                 = [];
          let dic                   = {};
              dic.billType          = '10010';  //账单类型
              dic.fsMoney           = this.$global.accMinus(0,this.formItem.choseBaseMoney);  //发生金额
              dic.ysMoney           = this.formItem.choseBaseMoney;  //应收金额
              dic.dkpMoney          = '0';  //待开票金额

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
              dic.note              = '付款账单';  //备注
              dic.status            = '1';  //可用状态
              dic.transactionType   = '1';  //交易账单类型（买家账单，卖家账单）
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
       step3AddOrgFlow(){
         let p                   = {};
            let plist               = [];
            this.selectionList.map(item=>{
                  let dic                 = {};
                      dic.customerId      = this.$route.query.customerId
                      dic.orderId         = this.$route.query.id;
                      dic.inMoney         = item.choseMoney;
                      dic.outMoney        = "0";
                      dic.currentMoney    = "0"
                      dic.userId          = this.$global.adminInfo.id
                      dic.payMoneyType    = "2"
                      dic.note            = '';
                      dic.orderNo         = this.$route.query.ordersNo;
                      dic.bankJgId        = this.formItemD.cardType;
                      dic.orgId           = this.$route.query.customerOrgId;
                      dic.orgName         = this.$route.query.customerOrgName;
                      dic.daozhangdanId   = item.daozhangdanId;
                      dic.bankConnectedId = '0'
                      dic.zhidanApplyId   = '0';
                      dic.zhaiyao         = ''
                      dic.direction       = ''
                      dic.type            = "1"
                      dic.status          = "1"

                plist.push(dic);
                p.list = plist;
            })
           
             addOrgMoneyRecord(p).then(res=>{
                        if(res.code =="100"){
                          this.$Notice.success({
                            title:'入账成功',
                            duration:1,
                             onClose:res =>{
                                  console.log('关闭时回调')
                              }
                          })
                        }else{
                          this.$Notice.error({
                            title:'入账失败'
                          })
                        }
               })
       },
       step4ChangeOrder(){
             let ps                 = {};
             let plist              = [];
             let dic                = {};
                 dic.id             = this.$route.query.id;
                //  dic.status         = "4" //订单状态不要修改
                 dic.receivedMoney  = this.formItem.choseBaseMoney;
                 dic.payMoneyStatus = "8";
         plist.push(dic);
         ps.pageUpdateOrderList = plist;
          updateOrderStatus(ps).then(res =>{
             if(res.code =='100'){
               this.isDisable=true;
                 this.$Notice.success({
                     title:'修改订单状态成功',
                     onClose:res =>{
                        console.log("关闭时回调")
                        this.closeSelf();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'入账失败'
                 })
             }
          })
       },
       getTotal(){
            let total = 0;
            let s     = 0;
            this.selectionList.map((item)=>{
              console.log(item.choseMoney);
              s = this.$global.accAdd(s,item.choseMoney)
            })
            this.formItem.choseMoney     = this.$global.isMoneyShow(s)
            this.formItem.choseBaseMoney = s;
       },

       deletBtn(){
         this.closeSelf();
       },
       closeSelf(){
         this.closeTag({
              name: 'sell_order_pay_info',
              query:this.$route.query
          })
       }
    },
    mounted(){
     this.setOrderInfo();
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
</style>