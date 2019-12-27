
<template>
     <div>
         <h2 style='margin-bottom:15px;font-weight:400;'>开票申请</h2>
        <b class="font_32">基础信息</b>
        <row class='order_all' style='margin-bottom:10px;'>
            <dl>
                <dt>销售单号：{{formItem.orderNo}}</dt>
                <dd>客户：{{formItem.cusOrgName}} {{formItem.infoStatus}}</dd>
            </dl>
            <dl>
                <dt>供应商公司：{{formItem.shopOrgName}}</dt>
                <dd>管理员：{{formItem.adminName}}</dd>
            </dl>
            <dl>
                <dt>合同金额：{{formItem.money}}</dt>
            </dl>
        
        </row>

        <!-- table表格 -->
        <row>
             <Table :columns="columnsKai" :data="dataKai"></Table>
        </row>

        <!-- 申请金额总计 申请重量总计 -->
        <row class='allJin' style='margin-bottom:15px;'>
              <i-col>{{allZ}}</i-col>
              <i-col>申请金额总计:<time>{{this.$global.isMoneyShow(allMoney) }}</time>元</i-col>
              <i-col>申请重量总计:<time>{{this.$global.accPrecision(allWeight,3)}}</time>吨</i-col>
              <a v-show="aShow" style="color:red">资料不完整，请补充客户资料，保护客户公司名称，客户税号，客户营业执照，客户开票资料</a>
        </row>

        <!-- 确认申请 取消返回 -->
        <row style='padding-left:20px;'>
             <Button v-show="btnShow" type="primary" style='margin-right:10px;' @click="getShen"> 确认申请</Button>
             <Button type="default"> 取消返回</Button>
        </row>




     </div>
</template>
<script>                                   //新增修改销售单信息
import {findOrdersInfoAll,kaiPiao,kaiPiao2,getXiuGaiDingDan} from '@/api/data_8889'
import { mapMutations } from 'vuex'
import {findOrgList} from '@/api/data'
export default {
  name: 'kaiPiao',
  data () {
    return {
         allMoney:'',
         allWeight:'',
         btnShow:false,
         aShow:false,
         formItem:{
          payMoney:'',
          dikouMoney:'0',
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          infoStatus:"",
          infoa:false
        },
        columnsKai: [
                    {
                        title: 'Id',
                        key: 'id',
                        width:'60'
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        width:'100'
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',

                    },
                     {
                        title: '材质',
                        key: 'steelPaihao'
                    },
                     {
                        title: '钢厂',
                        key: 'steelPinpai'
                    },
                     {
                        title: '提货方式',
                        key: 'steelWorks'
                    },
                     {
                        title: '交货地',
                        key: 'jiaohuodi'
                    },
                     {
                        title: '件数',
                        key: 'jianshu'
                    },
                     {
                        title: '总重量',
                        key: 'zongzhongliang',
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
                        title: '合同金额',
                        key: 'cusMoney',
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
                        title: '结算重量',
                        key: 'jiesuanWeight',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.jiesuanWeight,3))
                        }
                    },
                    {
                        title: '结算金额',
                        key: 'jiesuanMoney',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.jiesuanMoney,2))
                        }
                    },
                     {
                        title: '捆包号',
                        key: 'kunbaohao'
                    },
                ],
        dataKai: [],
        dataThree:[],//修改数组数据
    
    }
  },
  
  methods: {
     ...mapMutations([
      'closeTag'
    ]),
    getCusInfo(){//获取客户信息,判断客户资料是否完整，不完整不可提交
    let p  ={};
    p.id = this.$route.query.customerId;
      findOrgList(p).then(res =>{
              let a = "-";
                            
            if(res.code =='100'){//TODO
               let cusItem = res.data.list[0];
                if(cusItem.orgorgName && cusItem.orgkaipiaoPhoto && cusItem.orgshuiwudengjiPhoto && cusItem.orgtaxNo)
                            {
                                this.formItem.infoStatus = "(资料完整)"
                                this.formItem.infoa      = true
                                this.btnShow             = true;
                                this.aShow               = false;
                            }else{
                                this.formItem.infoStatus = "(资料不完整)"
                                this.formItem.infoa      = false
                                this.btnShow             = false;
                                this.aShow               = true;


                            }
            }
       })
    },
     close () {
      /**
       * 如果是调用closeTag方法，普通的页面传入的对象参数只需要写name字段即可
       * 如果是动态路由和带参路由，需要传入query或params字段，用来区别关闭的是参数为多少的页面
       */
      this.closeTag({
        name: 'sell_order_kaiPiao',
        query: this.$route.query
      })
    },
      //基础信息
    setOrderInfo(){
      console.log(this.$route.query)
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName     
          this.formItem.payMoney              = parseFloat(this.$route.query.moneyAll)
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll) 
          this.getOrderInfo();
      },
    getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              this.dataKai = res.data.list;
            }else{
            }
          })
    },
      //申请开票
    getShen(){
      this.stepOk();
      return false;
        let params={};
        params.note='';
        params.orderCustomerCompany = this.$route.query.customerOrgName;
        params.orderCustomerId      = this.$route.query.customerId;
        params.orderId              = this.$route.query.id;
        params.orderNo              = this.$route.query.ordersNo;
        params.orderShopCompanyName = this.$route.query.shopOrgName;
        params.orderShopId          = this.$route.query.shopId;
        params.orderShopName        = this.$route.query.shopName;
        params.orderUserId          = this.$route.query.userId;
        params.orderUserName        = this.$route.query.userName;
        params.status               = "1";
        params.totalMoney           = this.allMoney;
        params.totalMoneyShop       = this.allMoney;
        params.totalWeight          = this.allWeight;
        params.userId               = this.$global.adminInfo.id;
        params.userName             = this.$global.adminInfo.cname;
         //遍历数据
         this.dataKai.map((item)=>{
             let dis                   = {};
                 dis.isNewName         = '0';
                 dis.money             = item.cusMoney
                 dis.moneyShop         = item.cusMoney
                 dis.orderId           = item.ordersId
                 dis.orderInfoId       = item.id
                 dis.orderNo           = item.orderNo
                 dis.shopSteelBridgeId = ''
                 dis.status            = "1"
                 dis.weight            = item.zongzhongliang
             this.dataThree.push(dis)
         })
         params.invoiceApplicationDetailsList=this.dataThree;
           kaiPiao(params).then(res=>{
              if(res.code=='100'){
                  

              }
          })
      
    },
    stepOk(){
         let params1={}
         let plist = [];
         this.dataKai.map(item =>{
           let dic = {};
           dic.id = item.id
           dic.invoiceStatus = "-1"
           plist.push(dic)
         })
                  //  let pageUpdateOrderList=[{
                  //      id:this.$route.query.id,
                  //      //status:'9'
                  //      invoiceStatus:'-1'
                  //  }];
                  // params1.pageUpdateOrderList=pageUpdateOrderList 修改前
                   params1.pageOrderInfoList=plist //修改后
                   getXiuGaiDingDan(params1).then(res=>{//没修改前是调用kaiPiao2接口   修改后是调用getXiuGaiDingDan接口
                      console.log('我是打印的数据')
                      console.log(res)
                     if(res.code=='100'){
                        console.log(res)
                           this.$Notice.success({
                            title:'申请成功',
                            duration:1,
                             onClose:res =>{
                               console.log('关闭时回调')
                               this.close();
                            }
                            })
                      }
                          
                   })
    },
   
  },
  //计算总重和总价
  computed:{
      allZ(){
          let totalMoney=0; //总价
          let totalWeight=0;//总计
          this.dataKai.map((item)=>{
              totalMoney = this.$global.accAdd(item.jiesuanMoney,totalMoney)
              totalWeight =this.$global.accAdd(item.jiesuanWeight,totalWeight)
          })
          this.allMoney=totalMoney;
          this.allWeight=totalWeight;
          //return totalMoney,totalWeight
      }

  },
  created () {

  },
  mounted () {
     this.setOrderInfo();
     this.getCusInfo();
  }
}
</script>
<style lang='less'>
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
.allJin{
    padding-top:10px;
    time{
        color:red;
    }
}

</style>

