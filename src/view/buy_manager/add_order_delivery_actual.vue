<!--
 * @Description: 新增实提单
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:34:05
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
          </dl>
        
         </row>

        <row>
            <b class="font_32">合同信息</b>
            <!-- 新增图库table -->
             <vxe-table size="mini" border 
              class="vxe-table-element" 
              :highlight-cell='false'  
              :data.sync="data1"
               @edit-actived="currentChangeNew"
              :edit-config="{key: 'id', trigger: 'click', mode: 'cell',} ">
        
                <vxe-table-column prop="stataMM" label="货物信息" width="140" fixed="left"></vxe-table-column>
                <vxe-table-column prop="jizhongType" label="方式" min-width="40" ></vxe-table-column>
                <vxe-table-column prop="steelWorks" label="仓库" min-width="60" :edit-render="{name: 'ElSelect',options:dataCang}"></vxe-table-column>
                <vxe-table-column prop="jianshu" label="采购件数" min-width="30"></vxe-table-column>
                <vxe-table-column prop="weight" :formatter="this.$global.vxeTableWeight" label="采购单件重" min-width="30"></vxe-table-column>
                <vxe-table-column prop="zongzhongliang" :formatter="this.$global.vxeTableWeight" label="总重" min-width="40"></vxe-table-column>
                <vxe-table-column prop="guapaijia" label="采购单价" :formatter="this.$global.vxeTableMoney" min-width="50"></vxe-table-column>
                <vxe-table-column prop="cusMoney" label="采购总额"  :formatter="this.$global.vxeTableMoney" min-width="50"></vxe-table-column>
                <vxe-table-column prop="ru_xuniJianshu" :edit-render="{name: 'ElInput',autoselect: true}"   label="入库件数(件)" min-width="50"></vxe-table-column>
                <vxe-table-column prop="ru_weight" label="入库单件重" :formatter="this.$global.vxeTableWeight" :edit-render="{name: 'ElInput',autoselect: true}"  min-width="50"></vxe-table-column>
                <vxe-table-column prop="ru_jiesuanDanjia" label="结算单价(元)(入库单价)" :edit-render="{name: 'ElInput',autoselect: true}"  :formatter="this.$global.vxeTableMoney"  min-width="50"></vxe-table-column>
                <vxe-table-column prop="ru_zongzhongliang" label="入库总重量(吨)"  :edit-render="{name: 'ElInput',autoselect: true}"  :formatter="this.$global.vxeTableWeight"   min-width="50"></vxe-table-column>
                <vxe-table-column prop="ru_cusMoney" label="入库总金额"  :formatter="this.$global.vxeTableMoney" :edit-render="{name: 'ElInput',autoselect: true}"  min-width="50"></vxe-table-column>
             </vxe-table>

        </row>
        <span>总计吨位：</span> <span style="color:red"> {{this.$global.accPrecision(tWeight,3)}}</span>
        <span>总计金额：</span> <span style="color:red">{{this.$global.isMoneyShow(tMoney)}}</span>
        <br>
        <row>
            <div>
              <el-radio-group @change="radioBtnChange" v-model="radioBtn" size="medium">
                <el-radio   label="1" border>虚拟入库</el-radio>
                <el-radio   label="2" border>实提入库</el-radio>
              </el-radio-group>
              
            </div>
        </row>
          <br>
        <row>
          <Button  type="primary" @click="addBtn" :disabled="isDisable"> 虚拟入库</Button>
          <Button style="margin-left:20px"  type="primary" @click="addBtnNew" :disabled="isDisableNew"> 实提入库</Button>
        </row>
        <p style="visibility: hidden;">{{getTotal}}</p>

     </div>
</template>

<script>
import {findOrdersInfoAll,
updateOrderInfo,
updateOrdersStatus,
updateOrderStatus,
addBillFlow,
addOrgMoneyRecord} from '@/api/data' 
import {getRuKu,getWarehouse} from '@/api/cusData'//入库提交接口
import { constants } from 'crypto';
import { mapMutations } from 'vuex'
 import Utils from '@/api/middle'
export default {
    name: 'add_order_delivery_actual',
     inject:['reload'],  //調用組建app.vue
    data(){
      return {
        radioBtn:'1',
        ciickItem:'',
          isDisable:false,
          isDisableNew:false,
          data1: [],//表格展示的数据        
          dataCang: [],      //仓库的数组
          tWeight:0,
          tMoney:0,
          formItem: {//基础信息
          companyName: '',
          orderNo    : '',
          cusOrgName : '',
          shopOrgName: '',
          adminName  : '',
          money      : ''
          },
        
      }
    },
    
    methods:{
      radioBtnChange(){
        if(this.radioBtn == "1"){
          this.isDisable = false;
          this.isDisableNew = true;
        }else{
          this.isDisable = true;
          this.isDisableNew = false;
        }
      },
      currentChangeNew({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event){
        this.ciickItem =column.label; 
      },
       ...mapMutations([
      'closeTag'
      ]),
      //获取所有仓库getWarehouse
         getCang(){
            let param={pageSize:'9999'};
            getWarehouse(param).then(res=>{
                console.log('我是仓库')
                console.log(res)
                 res.data.list.map((item)=>{
                   if(item.warehouseName==null){
                             
                   }else{
                      let dic={};
                      dic.label=item.warehouseName//公司id
                      dic.value=item.warehouseName;//公司名字
                      this.dataCang.push(dic)
                   //   this.dataCang.push(item.warehouseName)
                     
                      // console.log(this.dataCang)
                   }
                 })                 
            })
         },
      remove(index){
         this.data1.splice(index,1);
       },
        //基础信息赋值
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
               res.data.list.map(item=>{
                item.ru_xuniJianshu    = item.xuniJianshu;
                item.ru_weight         = item.weight;//单件重
                item.ru_zongzhongliang = item.zongzhongliang;
                item.ru_guapaijia      = item.guapaijia;
                item.ru_cusMoney       = item.cusMoney;
                item.ru_jiesuanDanjia  = item.guapaijia;
                item.jianGshuStatus=false;
                item.jiesuanDanjiaStatus = false;
                

                //对数进行处理
                item.ru_zongzhongliang=this.$global.accPrecision(item.ru_zongzhongliang,3)
               
                item.ru_jiesuanDanjia=this.$global.accPrecision(item.ru_jiesuanDanjia,2)  
                item.kunbaohao = item.kunbaohao?item.kunbaohao:'';
                item.stataMM=item.steelName+','+'规格:'+item.steelGuige+','+'材质:'+item.steelPaihao+','+'钢厂:'+item.steelPinpai+','+'捆包号:'+item.kunbaohao

              })
              this.data1 = res.data.list.reverse();
              console.log(this.data1)
            }else{
            }
          })
      },
      //提交入库分3步骤； 这是实提入库
      //步骤1：修改订单明细的结算重量，结算金额，结算状态；入库成功后，调用修改订单明细的接口，将订单明细xunijianshu 减掉
      //步骤2：添加到库存表中
      //步骤3:给供应商添加一笔流水入账流水；
      //步骤4：修改订单为已完成状态 状态8 ，未开票
      addBtnNew(){//实提入库
        this.isDisableNew = true;
        //步骤1入库成功后，调用修改订单明细的接口，将订单明细xunijianshu 减掉
          this.stepUpdateOrderInfo();
       
         //步骤3：给供应商添加一笔流水入账流水；
          this.step3AddOrgMoneyRecord();
         //步骤4 修改订单为已完成状态 状态8 ，未开票
         this.step4OK();
          //步骤2：添加到库存表中
         this.stepAddStock();
         //新增的步骤
         this.payOnlineBusiness();
      },
      //新增一个步骤，用来新增电商流水。
            payOnlineBusiness(){//合同审核线上付款
          let p                     = {};
          let plist                 = [];
          let dic                   = {};
              dic.billType          = '20020';  //账单类型
              dic.fsMoney           = '0';  //发生金额
              dic.ysMoney           = this.$global.accMinus(0, this.tMoney);  //应收金额
              dic.dkpMoney          =  this.tMoney;  //待开票金额

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
      //步骤4:给供应商添加一笔流水入账流水；
       step3AddOrgMoneyRecord(){//走线下确认付款成功后，
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
                            
                          })
                        }else{
                          this.$Notice.error({
                            title:'入账流水添加失败'
                          })
                        }
               })
        },
      step4OK(){//修改订单的实提金额和实提重量
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
               })
            }else{
                 this.$Notice.error({
                 title:'修改订单信息失败'
                })
            }
         })
       },
      
      // 这是虚拟入库
      //步骤2：添加到库存表中
      //步骤3 ：入库成功后，调用修改订单明细的接口，将订单明细xunijianshu 减掉
      //步骤5：修改订单为已完成状态 状态6 ，已入库，
      addBtn(){//TODO

        this.isDisable=true;
    //步骤1入库成功后，调用修改订单明细的接口，将订单明细xunijianshu 减掉
          this.stepUpdateOrderInfo();
      //步骤2：添加到库存表中
         this.stepAddStock();
      //步骤5：修改订单为已完成状态 状态6 ，未开票//更新总订单的实提重量和金额
          this.stepChangeOrderStatus();      
       },
       //步骤1  入库成功后，调用修改订单明细的接口，将订单明细xunijianshu 减掉
       stepUpdateOrderInfo(){
         let p  ={};
         let plist = [];
          this.data1.map(item=>{
            let dic = {};
            dic.id = item.id;
            dic.xuniJianshu   = item.ru_xuniJianshu
            //对实提入库的判断
            if(this.radioBtn == "2"){
              dic.jiesuanJianshu = item.ru_xuniJianshu   //结算件数
              dic.jiesuanDanjia = item.ru_jiesuanDanjia   //结算单价
              dic.jiesuanWeight = item.ru_zongzhongliang   //结算重量
              dic.jiesuanMoney  = item.ru_cusMoney   //结算金额
              dic.receiptStatus = "1"   //是否收货
            }
            plist.push(dic)
          })
         p.pageOrderInfoList = plist;
         updateOrderInfo(p).then(res =>{
            if(res.code =='100'){
                this.$Notice.success({
                    title:'修改订单明细成功',
                })
            }else{
                this.$Notice.error({
                    title:'修改订单明细失败'
                })
            }
         })
       },
       stepAddStock(){//步骤添加到库存表
          let params = {};
         let orderInfoList = [];
          for(var i=0; i<this.data1.length;i++ ){
            var item = this.data1[i];
            let dic = {};
            //选择的件数
            dic.jianshu       = item.ru_xuniJianshu     //件数
            dic.xuniJianshu   = item.ru_xuniJianshu
            dic.weight        = item.ru_weight          //单件重
            dic.zongzhonglia  = item.ru_zongzhongliang  //总重量 入库实提总重量
            dic.guapaijia     = item.ru_jiesuanDanjia       //单价
            dic.dijia         = item.ru_jiesuanDanjia       //底价和挂牌价相同
            dic.cusMoney      = item.ru_cusMoney        //总金额
            dic.merMoney      = item.ru_cusMoney
            dic.jiesuanMoney  = item.ru_cusMoney
            dic.jiesuanWeight = item.ru_zongzhongliang

            dic.ordersInfoId = item.id;
            dic.steelName    = item.steelName;    //品名
            dic.steelGuige   = item.steelGuige;   //规格
            dic.steelPaihao  = item.steelPaihao;  //材质
            dic.steelPinpai  = item.steelPinpai;  //钢厂
            dic.steelWorks   = item.steelWorks    //提货方式
            dic.jiaohuodi    = item.jiaohuodi     //交货地
            dic.kunbaohao    = item.kunbaohao     //捆包号jizhongType
            dic.jizhongType  = item.jizhongType   //计重方式
            //其他字段
            dic.shopId      = item.shopId                //店铺id
            dic.shopName    = item.shopName
            dic.shopOrgId   = item.shopOrgId;
            dic.shopOrgName = item.shopOrgName;
            dic.shopSteelId = "";
            dic.shopUserId  = item.shopUserId;
            dic.userId      = this.$global.adminInfo.id
            
            dic.customerId         = item.customerId
            dic.customerName       = item.customerName;
            dic.customerOrgId      = item.customerOrgId
            dic.customerOrgName    = item.customerOrgName;
            dic.customerPhone      = ''

            dic.bankJgId           = item.bankJgId
            //入库的采购单的类型
            // 1：虚拟入库
            // 2：实提入库
            dic.businessType       = this.radioBtn;

            dic.buyType            = item.buyType
            dic.ordersType         = item.ordersType
            dic.payType            = item.payType
            dic.agentId            = item.agentId
            dic.agentName          = item.agentName
            dic.steelType          = item.steelType

            //传入订单的下单时间
            let times = this.$global.formatDate(new Date(),"hh:mm:ss");
            let yearMonthDate = this.$route.query.createTime.substring(0,10);
            dic.createTime        = yearMonthDate+' '+times;

            if(Number(item.ru_xuniJianshu) > 0 && Number(item.ru_zongzhongliang) >0){
              orderInfoList.push(dic);
            }else{
              console.log("小于")
            }
          }
         
          params.orderId       = this.$route.query.id;
          params.orderNo       = this.$route.query.ordersNo;
          params.orderInfoList = orderInfoList;
          if(orderInfoList.length == 0){
            this.$Notice.warning({
                     title:'无法入库，入库件数为0',
                 })
            return ;
          }
          
         getRuKu(params).then(res=>{
              if(res.code =='100'){
                this.isDisable=true;
                 this.$Notice.success({
                     title:'入库成功',
                     duration:1,
                     onClose:res =>{
                       this.closeSelf();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'入库失败'
                 })
             }
         })
       },
        //步骤3：如果订单的所有明细都录入实提，确认已收货，则总订单的状态变化，只修改订单状态
       stepChangeOrderStatus(){
            let a = 0;
            let b = 0;
            let p  ={};
            let plist = [];
            let dic = {};
            dic.id                    = this.$route.query.id;
            dic.status                = "6";
            dic.userId                = this.$global.adminInfo.id;
            dic.statusNote            = "入库"
            plist.push(dic);
            p.pageUpdateOrderList = plist;
              updateOrderStatus(p).then(res =>{
                if(res.code =='100'){
                  this.isDisable=true;
                    this.$Notice.success({
                        title:'修改订单状态成功',
                    })
                }else{
                    this.$Notice.error({
                        title:'修改订单状态失败'
                    })
                }
              })
       },
       closeSelf(){
         this.closeTag({
              name: 'add_order_delivery_actual',
              query:this.$route.query
          })
          //关闭自己跳转到 采购单列表中
          setTimeout(() => {
              const route = { 
                    name: 'buy_order_list',
                    query:''
                }
                this.$router.push(route);
                this.$Utils.$emit('buy_order_list','reload');
          }, 100);
          
       },
    },
    
    mounted(){
     this.getCang();
     this.setOrderInfo();
     this.radioBtnChange();
    
    },
    computed:{
        getTotal(){
          let tWeight=0;
          let tMoney = 0;
          this.data1.map(item=>{
            //修改入库件数,
            if(this.ciickItem == "入库件数(件)"||this.ciickItem == "入库单件重"){
              item.ru_zongzhongliang = this.$global.accMul(item.ru_weight,item.ru_xuniJianshu);
              item.ru_cusMoney  = this.$global.accMul(item.ru_zongzhongliang,item.ru_jiesuanDanjia)

            }
            //点击总重量 需要修改 入库单件重;并修改入库总金额 = 入库总重量* 入库单价
            if(this.ciickItem == "入库总重量(吨)"){
              item.ru_weight  = this.$global.accDiv(item.ru_zongzhongliang,item.ru_xuniJianshu)
              item.ru_cusMoney  = this.$global.accMul(item.ru_zongzhongliang,item.ru_jiesuanDanjia)
            }
            //点击修改入库单价 重新计算入库总金额 = 入库总重量* 入库单价
            if(this.ciickItem == "结算单价(元)(入库单价)"){
              item.ru_cusMoney  = this.$global.accMul(item.ru_zongzhongliang,item.ru_jiesuanDanjia)
            }

            //总重量求和
            tWeight = this.$global.accAdd(tWeight,item.ru_zongzhongliang)
            //总金额求和
            tMoney = this.$global.accAdd(tMoney,item.ru_cusMoney)
            
          })
          this.tWeight = tWeight;
          this.tMoney = tMoney
          return  this.tWeight,this.tMoney
      },
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
.ivu-table td.demo-table-info-column{
        background-color: #2db7f5;
        color: #fff;
    }
</style>