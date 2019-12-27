<!--
 * @Description: 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 17:49:36
 -->
<!--
 * @Description: 审核订单
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:34:05
 -->



<template>
     <div>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
      <dl>
        <dt>销售单号：{{formItem.orderNo}}</dt>
        <dd>采购公司：{{formItem.cusOrgName}}</dd>
      </dl>
      <dl>
        <dt>供应商公司：{{formItem.shopOrgName}}</dt>
        <dd>采购员：{{formItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{formItem.money}}</dt>
      </dl>
        
    </row>
    <row>
        <b class="font_32">合同信息</b>
        <Table border ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        <!-- <div slot="footer" style="height:100px">
          <td style="width:660px">合计</td>
          <td style="width:100px;text-align: center;">11</td>
          <td style="width:100px">-</td>
          <td style="width:100px;text-align: center;">2222</td>
        </div> -->
        </Table>
    </row>
    <row>
       <span>合同重量合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.accPrecision(tWeight,3)}}吨</span>
      <span>合同金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(tMoney)}}元</span>
    </row>
    <p style="disaply:none">{{getTotal}}</p>

    <row>
        <buyImg1></buyImg1>
    </row>
    <row>
      <Button style="margin-right:10px;" type="primary" @click="addBtn" :disabled="isDisable"> 审核通过</Button>
      <Button type="error" @click="deletBtn"> 审核拒绝</Button>
    </row>

     </div>
</template>

<script>
import {findOrdersInfoAll,
updateOrdersStatus} from '@/api/data_8889'
import {addOrgMoneyRecord,
findOrgMoneyRecord,
addBillFlow
} from '@/api/data'
import { mapMutations } from 'vuex'
import Utils from '@/api/middle'
import buyImg1 from '@/view/buy_manager/buy_order_info_components/buy_img1'
export default {
    name: 'sell_order_review_info',
    inject:['reload'],  //調用組建app.vue
    components:{
         buyImg1
    },
    data(){
      return {
        tMoney:0,
        tWeight:0,
        isDisable:false,
        isAdd:true,//判断 是否调用确认出货按钮
        tableItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:''
          },
          columns4: [
                      {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'100'
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
                        width:'100'
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
                        title: '销售总额',
                        key: 'cusMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.cusMoney,2))
                        }
                    },
                    //2019年5月5日14:03:49 新增网价
                    {
                        title: '网价',
                        key: 'internetMoney',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '浮动价格',
                        key: 'floatMoney',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '网价区域',
                        key: 'region',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '网价备注',
                        key: 'internetMoneyNote',
                        align: 'center',
                        width:'100'
                    },
                   //2019年5月5日14:09:14 结束
                   
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
            payOnlineBusiness(){//合同审核线上付款
          let p                     = {};
          let plist                 = [];
          let dic                   = {};
              dic.billType          = '10010';  //账单类型
              dic.fsMoney           = this.$global.accMinus(0,this.$route.query.moneyAll);  //发生金额
              dic.ysMoney           = this.$route.query.moneyAll;  //应收金额
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
              dic.note              = '合同账单';  //备注
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
      setOrderInfo(){
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName        
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll) 
          this.getOrderInfo(); 
      },
      getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              this.data1 = res.data.list.reverse();
            }else{
            }
          })
      },
       selectOne(row){
         console.log(row)
       },
       remove(index){
         this.data1.splice(index,1);
       },
       //步骤1 审核通过
       //步骤2 调用销售单 确认出货步骤。
       addBtn(){//审核通过
          this.step1OK();
          if(this.isAdd){
            this.step2OK();
          }else{

          }
          // this.payOnlineBusiness();
       },
       step2OK(){//添加确认出货
             console.log("修改成功");
          let p                   = {};
          let plist               = [];
          let dic                 = {};
          dic.customerId      = this.$route.query.customerId
          dic.orderId         = this.$route.query.id;
          dic.inMoney         = "0" ;
          dic.outMoney        = this.tMoney;
          dic.currentMoney    = "0"
          dic.userId          = this.$global.adminInfo.id
          dic.payMoneyType    = "5"
          dic.note            = '销售单出货';
          dic.orderNo         = this.$route.query.ordersNo;
          dic.bankJgId        = this.$route.query.bankJgId;
          dic.orgId           = this.$route.query.customerOrgId;
          dic.orgName         = this.$route.query.customerOrgName;
          dic.daozhangdanId   = '0'
          dic.bankConnectedId = '0'
          dic.zhidanApplyId   = '0';
          dic.zhaiyao         = '销售单出货'
          dic.direction        = ''
          dic.type            = '1'//1客户 2供应商
          dic.status = "1"

          plist.push(dic);
          p.list = plist;
           
             addOrgMoneyRecord(p).then(res=>{
                        if(res.code =="100"){
                          this.$Notice.success({
                            title:'确认出货成功',
                          })
                        }else{
                          this.$Notice.error({
                            title:'确认出货失败'
                          })
                        }
               })
       },
       step1OK(){//审核销售单
          let params            = {};
              params.id         = this.$route.query.id;
              params.status     = "2"
              params.statusNote = ""
              params.userId     = this.$global.adminInfo.id
          updateOrdersStatus(params).then(res =>{
             if(res.code =='100'){
                 this.isDisable=true;
                 this.$Notice.success({
                     title:'审核通过',
                     duration:1,
                     onClose:res =>{
                        console.log("关闭时回调")
                       this.turnToOrderList();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'审核失败'
                 })
             }
          })
       },
       deletBtn(){//删除订单
           let params = {};
          params.id  = this.$route.query.id;
          params.status  ="-1"
          params.statusNote  ="审核拒绝"
          params.userId  =this.$global.adminInfo.id

          updateOrdersStatus(params).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'审核拒绝成功',
                     duration:1,
                     onClose:res =>{
                        console.log("关闭时回调")
                       this.turnToOrderList();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'删除失败'

                 })
             }
          })
       },
       turnToOrderList(){//审核或者关闭之后跳转到
          this.closeTag({
              name: 'sell_order_review_info',
              query:this.$route.query
          })
          setTimeout(() => {
                const route = { 
                    name: 'sell_order_list',
                    query:''
                }
                this.$router.push(route);
                Utils.$emit('sell_order_list','reload');
          }, 100);
       },
        ...mapMutations([
      'closeTag'
    ]),
    //获取订单是否已经确认出货
      getOrderOrgMoneyRecordList(){
        let p                = {};
            p.pay_money_type = "5";
            p.orderId        = this.$route.query.id;
            p.type           = "1"
        findOrgMoneyRecord(p).then(res =>{
              if(res.code =='100' && res.data.list.length>0 ){
                      this.isAdd = false;
                    this.$Notice.error({
                      title:'查询到已经确认出货',
                  })
                
            }else{
                 this.$Notice.success({
                 title:'查询到未确认出货'
                })
            }
         })
      },
    },
    computed:{
      getTotal(){
        let  a = 0;
        let b = 0;
        this.data1.map(item=>{
           a = this.$global.accAdd(a,item.zongzhongliang)
           b = this.$global.accAdd(b,item.cusMoney)
        })
        this.tWeight = a;
        this.tMoney = b;
      }
    },
    mounted(){
     this.setOrderInfo();
     this.getOrderOrgMoneyRecordList();
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