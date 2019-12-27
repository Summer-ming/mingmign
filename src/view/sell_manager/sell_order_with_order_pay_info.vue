<!--
 * @Description: 销售单确认收款，从其他销售单剩余的钱收款。相当于采购单的抵扣。这是销售单的抵扣
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
            <dt>合同金额：{{this.$global.isMoneyShow(formItem.money)}}</dt>
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
            <!-- <FormItem label='抵扣金额'>
            <Input style='width:150px' v-model='formItem.dikouMoney' placeholder='请输入抵扣金额'/>
            </FormItem> -->
            <FormItem label='已勾选总金额'>
            <Input style='width:150px' v-model='formItem.choseMoney' placeholder='请输入金额'/>
            </FormItem>
          </Form>
        </row>
      <!-- 选择销售单的列表项 -->
        <row>
          <Card>
            <Form :model="formItemD" inline :label-width="160">
                <Button style="margin-right:10px" type="primary" @click="searchD">查询</Button>
            </Form>
              <Table @on-selection-change="selectAllSelection"  style="margin-bottom:10px" height="300" border ref="selection" :columns="columns5" :data="data5"  >
              </Table>
          </Card>
        </row>

       <row>
        <Button style="margin-right:10px" type="primary" @click="addBtn"  :disabled="isDisable" >确认收款</Button>
        <Button type="primary" @click="deletBtn"> 关闭</Button>
       </row>

        <p style="visibility: hidden;">{{total}}</p>
     </div>
</template>

<script>
import {findOrdersInfoAll,
updateFukuanZhenghe,
updateOrderStatus,
findOrdersAll
} from '@/api/data_8889'
import {
addOrgMoneyRecord
} from '@/api/data'
import { mapMutations } from 'vuex'
import {companyCardTypeList} from '@/libs/global_type'
import {daozhangdanCardType,getBuyOrderStatus} from '@/libs/allStatus'

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
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          choseMoney:0,
          choseBaseMoney:0,
           deliveryTotalMoney:'0',//实提总金额
          chaMoney:'0',//差额 实提金额-  合同金额
          receivedMoney:"0",//已收金额

        },
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        data5:[],
        columns5:[//销售单使用的列表
        {
          type:'selection',
          width:60,
          align:"center"
        },
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'60'
                    },
                     {
                        title: '订单号',
                        key: 'ordersNo',
                        align: 'center',
                        width:'180',
                    },
                    {
                        title: '客户',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'180'
                    },
                    {
                        title: '供应商名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{

                          },params.row.shopOrgName.substr(0,5))
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
                              value:this.$global.isMoneyShow(params.row.choseMoney),
                            },
                            on:{
                              'on-blur':(event)=>{
                                  this.data5[params.index].choseMoney = event.target.value
                                // //如果用户已经勾选了，通知勾选的数组变化；
                                // for(var i = 0;i<this.selectionList.length;i++){
                                //   let item = this.selectionList[i];
                                //   if(item.daozhangdanId == params.row.daozhangdanId){
                                //     item.choseMoney = this.data5[params.index].choseMoney;
                                //     break;
                                //   }
                                // }
                                // this.getTotal();
                              }
                            }
                          })
                        }
                    },
                    {
                        title: '差额(元)',
                        key: '',
                        align: 'center',
                        width:'140',
                        render:(h,params) =>{
                          let a = this.$global.accMinus(params.row.moneyAll,params.row.deliveryTotalMoneyCus)
                          return h('div',{
                          },this.$global.accPrecision(a,2))
                        }
                    },
                      {
                        title: '合同金额(元)',
                        key: 'moneyAll',
                        align: 'center',
                        width:'140',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.moneyAll))
                        }
                    },
                    {
                        title: '合同重量(吨)',
                        key: 'zhongliangAll',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.zhongliangAll,3))
                        }
                    },
                     {
                        title: '实提重量(吨)',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                        }
                    },
                      {
                        title: '实提总货款(元)',
                        key: 'deliveryTotalMoneyCus',
                        align: 'center',
                        width:'140',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.deliveryTotalMoneyCus))
                        }
                    },
                    {
                        title: '下单时间',
                        key: 'createTime',
                        align: 'center',
                        width:'140'
                    },
                     {
                        title: '管理员',
                        key: 'userName',
                       
                        width:'70'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width:'90',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },getBuyOrderStatus(params.row.status))
                        }
                    }
                    
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
      selectAllSelection(data){//全选变化 
        this.selectionList = data;
      },
      searchD(){ //查询销售单 
        console.log(this.formItemD.cardType);
        this.selectionList = [];
          this.searchDList();
      },
      
        searchDList(){//查询销售单列表 
         let param={};
         param.beginStatus = "8"
         param.endStatus = "10"
         param.pageSize = "999999"
         param.bankJgId = this.$route.query.bankJgId//订单类型，分上海抬头和福建抬头
         param.cusMerName = this.$route.query.customerOrgName//买家公司名称
         param.noorderId  =this.$route.query.id
          findOrdersAll(param).then(res =>{
            if(res.code =="100"){
               res.data.list.map(item =>{
                item.choseMoney = 0; 
              })
              this.data5 = res.data.list;
             
              this.$Notice.success({
                title:'获取销售单成功'
              })
            }else{
              this.$Notice.error({
                title:'获取销售单失败'
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
          this.formItem.money              = this.$route.query.moneyAll
          this.formItemD.cardType          = this.$route.query.bankJgId
          this.formItem.deliveryTotalMoney = this.$route.query.deliveryTotalMoneyCus
          this.formItem.receivedMoney      = this.$route.query.receivedMoney
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
        
      
      //确定按钮需要调用的接口 结束
      //步1 修改订单的对应的金额。
      //步2 添加到客户流水表中。状态为已删除 TODO
       addBtn(){
         if(this.selectionList.length ==0){
           this.$Message.warning("请选择销售单")
         }else{
           console.log("提交");
         }
          this.step1ChangeOrder();
          this.step2AddOrgFlow();
       },
       step1ChangeOrder(){
             let ps ={};
         let plist = [];
         let dic = {};//主订单
         dic.id = this.$route.query.id;
         dic.skSMoney  = this.formItem.choseBaseMoney;
         dic.payMoneyStatus = "8";
         plist.push(dic);

         //被使用的订单
          this.selectionList.map(item =>{
            let d = {};
            d.id = item.id;
            d.dikouSMoney = item.choseMoney;
            plist.push(d);
          })
         ps.pageUpdateOrderList = plist;
          updateOrderStatus(ps).then(res =>{
             if(res.code =='100'){
               this.isDisable=true;
                 this.$Notice.success({
                     title:'修改订单信息成功',
                     onClose:res =>{
                        console.log("关闭时回调")
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'修改订单信息失败'
                 })
             }
          })
       },
       step2AddOrgFlow(){
         let p                   = {};
            let plist               = [];
            
            this.selectionList.map(item=>{
                  let dic                 = {};
                    dic.customerId      = item.customerId
                    dic.orderId         = item.id; //记录
                    dic.inMoney         = "0";
                    dic.outMoney        = item.choseMoney;
                    dic.currentMoney    = "0"
                    dic.userId          = this.$global.adminInfo.id
                    dic.payMoneyType    = "14"
                    dic.note            = '销售单抵扣';
                    dic.orderNo         = item.ordersNo;
                    dic.bankJgId        = item.bankJgId;
                    dic.orgId           = this.$route.query.customerOrgId;
                    dic.orgName         = this.$route.query.customerOrgName;
                    dic.daozhangdanId   = '0';
                    dic.bankConnectedId = '0'
                    dic.zhidanApplyId   = '0';
                    dic.zhaiyao         = '销售单抵扣'
                    dic.direction        = ''
                    dic.type ="1"//1是客户
                    dic.status = "1";
                    dic.dikouOrderId = this.$route.query.id;
                    dic.dikouOrderNo = this.$route.query.ordersNo;
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
              name: 'sell_order_with_order_pay_info',
              query:this.$route.query
          })
       }
    },
    computed:{
      total(){
         let total = 0;
            let s     = 0;
            this.selectionList.map((item)=>{
              console.log(item.choseMoney);
              s = this.$global.accAdd(s,item.choseMoney)
            })
            this.formItem.choseMoney     = this.$global.isMoneyShow(s)
            this.formItem.choseBaseMoney = s;
      },
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
    .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
</style>