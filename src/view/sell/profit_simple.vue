<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='xioashou_profit_simpld'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
          <FormItem label="采购单号:" style="margin-right:10px;">
          <Input clearable style="width:100px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
            <FormItem label='采购对账批次'>
               <DatePicker v-model='formItem.duiTime' @on-change="changeDuiZhangTime" format="yyyy-MM" type="month" placeholder="选择年月" style="width: 100px"></DatePicker>
            </FormItem>
             
            <FormItem label='采购日期'>
              <DatePicker @on-change="changeBuyCreateTieme" format="yyyy-MM-dd" v-model="formItem.buyCreateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 100px">
              </DatePicker>
            </FormItem>
          <FormItem label="公司抬头:">
            <Select clearable v-model="formItem.bankJgId"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
         
            <FormItem label='收款日期'>
              <DatePicker :transfer='true' @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.shouTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 100px">
              </DatePicker>
            </FormItem>
          <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
           <FormItem label="工程名称:" style="margin-right:10px;">
               <el-select  style="width:100px" multiple :transfer="true" size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                          <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-option>
                        </el-select>
            </FormItem>
           <!-- <FormItem label="客户查询:">
            <Select clearable v-model="orgSearch"  style="width:100px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </!-->
          <!-- <FormItem label="管理员查询:">
            <Select clearable v-model="adminSearch"  style="width:100px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
            </Select>
          </FormItem>
           <FormItem label="订单状态:" style="margin-right:10px;">
            <Select clearable  v-model='formItem.orderStatus' style="width:100px" placeholder="请选择订单状态" >
              <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem> -->
          
          </Col>
        
          <Col span="24">
             <Button size='small' type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button size='small' shape="circle" style='margin-left:4px' icon="md-refresh" @click="reloadSelf"></Button>
            <Button size='small' type="primary"  icon="ios-download-outline" @click="exportData()" style='margin-left:4px'>导出excel</Button>
            <el-tooltip  content="利润 = 销售单结算金额 - 采购单实提总金额 - 销售杂费" placement="top-start">
              <Button size='small' style="margin-left:4px" shape="circle" icon="md-help" ></Button>
             </el-tooltip>
           <Button size="small" type="primary" @click="upsideDown" style='margin-left:4px'>反向排列列表</Button>

              <!-- 合计 -->
              <br>
              <span style="">采购合同重量<span   style="color:#4b98dc;">{{this.$global.accPrecision(BTWeight,3)}}</span> 吨&nbsp;&nbsp; </span>
              <span style="margin-left:20px">采购合同金额<span  style="color:#4b98dc;">{{this.$global.isMoneyShow(BTMoney)}}</span> 元&nbsp;&nbsp;</span>
              <br>
              <span style="">采购实提总重量<span   style="color:red;">{{this.$global.accPrecision(BTDWeight,3)}}</span> 吨&nbsp;&nbsp;</span>
              <span style="margin-left:20px">采购实提总金额<span   style="color:red;">{{this.$global.isMoneyShow(BTDMoney)}}</span> 元&nbsp;&nbsp;</span>
              <span style="margin-left:20px">采购付款金额<span   style="color:red;">{{this.$global.isMoneyShow(BTPayMoney)}}</span> 元&nbsp;&nbsp;</span>
              <br>
               <span style="">销售结算金额<span   style="color:red;">{{this.$global.isMoneyShow(STDMoeny)}}</span> 元&nbsp;&nbsp;</span>
              <span style="margin-left:20px">销售收款金额<span   style="color:red;">{{this.$global.isMoneyShow(STDSMoeny)}}</span> 元&nbsp;&nbsp;</span>
              <span style="margin-left:20px">杂费金额<span   style="color:red;">{{this.$global.isMoneyShow(STDOMoney)}}</span> 元&nbsp;&nbsp;</span>
              <br>
              <span style="margin-left:0px">利润总额<span   style="color:red;">{{this.$global.isMoneyShow(PMoney)}}</span> 元&nbsp;&nbsp;</span>

          </Col>
        </Row>
        <vxe-table border resizable
        show-footer
        height="500"
        :footer-method="footerMethod"
        :header-cell-class-name="headerCellClassName"
          :cell-class-name="cellClassName"
          @cell-click="cellClickEvent"
          :row-class-name="rowClassName"
          @select-change="selectChangeEvent"   @select-all='selentAll'
         class="mytable-style-profitSimple"  :select-config="{labelField: 'name', checkMethod}" size="mini" ref="xTable1" :data.sync="data1"  >
              
                <vxe-table-column   type="selection" width="40"></vxe-table-column>
                <vxe-table-column width="40"  type="index" ></vxe-table-column>
                <vxe-table-column width="100" field="duizhangTimes" title="采购单对账批次" ></vxe-table-column>
                <vxe-table-column field="orderNo" title="采购单号" width="170" show-overflow >
                    <template v-slot="{row}">
                        <a style='cursor:pointer;'  @click='getAA(row)' type="text">{{row.orderNo}}</a>
                    </template>
                </vxe-table-column>
                <!-- //下面是显示 -->
                 <vxe-table-column show-overflow field="engineering"   title="采购单工程名称"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow :formatter="this.$global.vexTaiTou"  field="bankJgId"   title="公司抬头"  min-width='60'></vxe-table-column>
              <vxe-table-column show-overflow field="createTime"   title="采购单下单时间"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow align="right" :formatter="this.$global.vxeTableWeight" field="zongzhongliang"   title="采购单合同重量"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow align="right" :formatter="this.$global.vxeTableMoney" field="moneyAll"   title="采购单合同金额"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow align="right" :formatter="this.$global.vxeTableMoney" field="receivedMoney"   title="采购单付款金额"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow align="right"  field="deliveryTotalWeight" :formatter="this.$global.vxeTableWeight"   title="采购单实提总重量"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow align="right" :formatter="this.$global.vxeTableMoney" field="deliveryTotalMoneyCus"   title="采购单实提总金额"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow align="right" :formatter="this.$global.vxeTableMoney" field="jiesuanMoney"   title="销售单结算金额"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow align="right" :formatter="this.$global.vxeTableMoney" field="xiaoshoudanMoney"   title="销售单收款金额"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow align="right" :formatter="this.$global.vxeTableMoney" field="zafei"   title="杂费金额"  min-width='100'></vxe-table-column>
              <vxe-table-column show-overflow align="right" :formatter="this.$global.vxeTableMoney" field="profitKey"   title="利润金额"  min-width='100'></vxe-table-column>
              
              <vxe-table-column show-overflow field="dealTime"   title="收款日期"  min-width='100'></vxe-table-column>
            </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    
     </div>
</template>

<script>
import {findOrdersInfoAll,
findOrdersInfoAllSum,updateOrderInfo} from '@/api/data_8889'
import {findOrgCusAcc,getUserList,findOrdersInfoAllSum89Zong,
findOrderEngineering,findOrderProfit,findOrderProfitSum} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel,getBuyOrderStatus} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,orderStatusList,belongCompanyList} from '@/libs/global_type'
import excel from '@/libs/excel'
import XEUtils from 'xe-utils'
export default {
    name: 'profit_simple',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        dataSelectIndex:[],//选中的数组下表
        BTWeight:0,//采购合同重量
        BTMoney:0,//采购合同金额
        BTDWeight:0,//采购实提总重量
        BTDMoney:0,//采购实提总金额
        BTPayMoney:0,//采购付款金额
        STDMoeny:0,//销售结算金额
        STDSMoeny:0,//销售收款金额
        STDOMoney:0,//杂费金额
        PMoney:0,//利润总额
        engineerNameList:[],//工程名称数组
         formItem1: {
            dateTime:'',
          },
        daozhangTime:"",
        modal1:false,
        belongCompanyListThis:belongCompanyList,
        TWeight:0,
        TMoney:0,
        TjiesuanWeight:0,
        TjiesuanMoney:0,
        shopList:[],
        orderStatusList:orderStatusList,
        lengthListThis:lengthList,
        showIdK       :'',
        agentId       :'',
        agentShortName:'',
        shopId        :'',
        shopName      :'',
        shopOrgName   :'',
        shopUserId    :'',
        shopOrgId     :'',
        orgSearch:'',
        adminSearchId:"",
        adminSearch:'',
        adminList:[],
        tableItem:{},
        modal1:false,
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:100,
          orderNo:'',
          engineering:'',
          bankJgId:'',
          duiTime:'',
          buyCreateTime:'',
          buyBeginCreateTime:'',
          buyEndCreateTime:'',
          shouTime:'',
          shouBeginTime:'',
          shouEndTime:'',
          },
        options:{
          shortcuts:[
             {
                            text: '1周',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '一个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '3个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
          ]
        },
          columns4: [],
                data1: [],//表格展示的数据
    
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      upsideDown(){//颠倒列表数组
          this.data1 = this.data1.reverse();
      },
      cellClickEvent ({row,rowIndex}) {
              console.log('单元格点击事件'+rowIndex);
              this.dataSelectIndex=[];
              this.dataSelectIndex.push(rowIndex);
            },
      //选中
     selectChangeEvent(){
       this.getHuo();
     },
     //全选
     selentAll(){
       this.getHuo();
     },
     //获取选中数据
     getHuo(){
        // let zong=0;
        // let kong=[];
        // let dataSelect=this.$refs.xTable1.getSelectRecords()
        // dataSelect.map((item)=>{
        // })

     },
      rowClassName ({ row, rowIndex }) {

              if (this.dataSelectIndex.includes(rowIndex)) {
                return 'row-green'
              }
            },
      headerCellClassName ({ column, columnIndex }) {
              if (column.property === 'jiesuanMoney') {
                return 'col-red'
              }
            },
      cellClassName({ row, rowIndex, column, columnIndex }){
        if (column.property === 'orderNo') {//销售单结算金额
           return 'col-white'
         }
         if (column.property === 'jiesuanMoney') {//销售单结算金额
           return 'col-orange'
         }
         if (column.property === 'deliveryTotalMoneyCus'||column.property === 'zafei') {//采购单实提总金额 、杂费
           return 'col-red'
         }
      },
       //新增
      footerMethod({columns,data}){
        return [
          columns.map((column,columnIndex)=>{
            if(columnIndex === 0){
              return '当页合计'
            }
             if(['zongzhongliang','deliveryTotalWeight'].includes(column.property)){
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),3)

            }
            if(['moneyAll','deliveryTotalMoneyCus','receivedMoney','jiesuanMoney','xiaoshoudanMoney','zafei','profitKey'].includes(column.property)){
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property))

            }

          }),
              
        ]
      },
       changeDuiZhangTime(data){
         console.log(data);
         this.formItem.duiTime = data;
       },
       //查询工程
      getGongcheng(){
        let p  ={};
        p.pageSize ="99999"
        findOrderEngineering(p).then(res=>{
          if(res.code =="100"){
              res.data.list.map(item =>{
                if(item){
                let dic = {};
                dic.label =item.engineering;
                dic.value =item.engineering;
                this.engineerNameList.push(dic);
                }
              })
          }
        })
      },
      orgShopName({cellValue, row, column}){
          if(cellValue){
            return cellValue.substr(0,5)
          }else{
            return ""
          }
      },
      orderStatus({cellValue, row, column}){
        return getBuyOrderStatus(cellValue)
      },
      receiptStatus({cellValue, row, column}){
          return getReceiptStatusLabel(cellValue);
      },
      invoiceStatus({cellValue, row, column}){
          return getInvoiceStatusLabel(cellValue);
      },
       getAA(row){
        let dic = {};
        dic.orderNo = row.orderNo;
        dic.ordersNo = row.orderNo;
        dic.operateType  ="1"//查看
        sessionStorage.setItem('CAIGOU','')
        sessionStorage.setItem('CAIGOU',JSON.stringify(dic))
           const route = {
               name: 'order_buy_info',
             }
             this.$router.push(route)
        },
      //禁止选中
        checkMethod ({ row }) {
              //条件满足的 可以选择
              return row.id !="当页合计"&&  row.id !="全部合计" 
        },
       //修改对账时间
        changeDuiZhang(item){
            console.log(item)
            this.daozhangTime=item;
        },
       exportData(){//导出到excel

        this.$refs.xTable1.exportCsv({
          filename:"导出excel"
        })
      },
      getShop(){
        let param = {};
        param.pageNum ="1";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
        getDian(item){
          if(item){
              this.shopOrgName = item.label;
              this.shopOrgId = item.value;
          }
       },
       changeBuyCreateTieme(data){//采购日期
        this.formItem.buyBeginCreateTime  =data[0] +' 00:00:00';
        this.formItem.buyEndCreateTime  =data[1]+' 24:00:00';
      },
      changeCreateTieme(data){
        this.formItem.shouBeginTime  =data[0] +' 00:00:00';
        this.formItem.shouEndTime  =data[1]+' 24:00:00';
      },
      propsClick(){
        this.reload();
      },
      getAdmin(item){
        if(item){
          this.adminSearchId = item.value;
        }
      },
        reloadSelf(){
            this.reload();
        },
       //分页
       changePage(index){
           this.pagesizea=index;
           this.searchM();
       },
       selectOne(row){
       },
       //查询表格
       searchM(){
          let gong='';
        this.formItem.engineering.map((item)=>{
                // gong+=(item+',')
                 gong+=("'"+item+"'"+',')
        })
        gong = gong.substr(0,gong.length-1);
         //获取查询的input的值
         let p={};
         p.pageNum     = this.pagesizea              //分页
         p.pageSize    = this.formItem.length;
         p.orderNo = this.formItem.orderNo ;//订单号
         p.engineering = gong ;//工程名称
         
         p.beginTime = this.formItem.buyBeginCreateTime ;//采购单下单开始时间
         p.endTime = this.formItem.buyEndCreateTime ;//采购单下单结束时间

         p.beginDuiZhangTime = this.formItem.duiTime ;//开始采购单对账时间
         p.endDuiZhangTime = this.formItem.duiTime ;//截止采购单对账时间

         p.beginDealTime = this.formItem.shouBeginTime ;//开始销售单到账时间
         p.endDealTime = this.formItem.shouEndTime ;//截止销售单到账时间

         p.bankJgId = this.formItem.bankJgId ;//公司抬头

           findOrderProfit(p).then(res=>{
            if(res.code =="100"){
              this.$Message.success("获取列表数据成功")
              //计算利润
              res.data.list.map(item=>{
                let a = this.$global.accAdd(item.deliveryTotalMoneyCus,item.zafei)
                item.profitKey = this.$global.accMinus(item.jiesuanMoney,a);//利润 = 销售结算金额 - 采购实提金额-销售杂费
              })
            this.totalM=res.data.total; 
            this.data1=res.data.list;
            this.getOrderInfoTotal(p);
          }else{
              this.$Message.error("获取列表数据失败——"+res.msg)

          }   
         })
          
       },
       getOrderInfoTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findOrderProfitSum(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data.list[0];
                  this.BTWeight   = dic.zongzhongliang         //采购合同重量
                  this.BTMoney    = dic.moneyAll               //采购合同金额
                  this.BTDWeight  = dic.deliveryTotalWeight    //采购实提总重量
                  this.BTDMoney   = dic.deliveryTotalMoneyCus  //采购实提总金额
                  this.BTPayMoney = dic.receivedMoney          //采购单付款金额
                  this.STDMoeny   = dic.jiesuanMoney           //销售结算金额
                  this.STDSMoeny  = dic.xiaoshoudanMoney       //销售收款金额
                  this.STDOMoney  = dic.zafei                  //杂费金额
                  //利润 = 销售单结算金额 - 采购单实提总金额 - 销售杂费
                  let a = this.$global.accAdd(dic.deliveryTotalMoneyCus,dic.zafei)
                  this.PMoney = this.$global.accMinus(dic.jiesuanMoney,a);
          }  
         })
       },
       
       getAdminList(){
         let param = {};
         param.pageSize = "99999"
         param.status  ="1"
        //  adminList
        getUserList(param).then(res=>{
            if(res.code =="100"){
            this.adminList=res.data.list;
          }  
         })
       }
    },
    
    mounted(){
     this.searchM();
     this.getShop();
     this.getAdminList();
     this.getGongcheng();
     var that = this;
     Utils.$on('demo',function(msg){
       if(msg == "reload"){
        that.propsClick();
       }
     })
    
    },
    
    created(){
        
    },
}

</script>
<style >

 #xioashou_profit_simpld .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0px!important;
      }
    #xioashou_profit_simpld .vxe-table .vxe-body--column{
        line-height:20px!important;
      }
   #xioashou_profit_simpld .vxe-table .vxe-cell {
      padding: 0 2px;
      }


  .ivu-table td.demo-table-info-column{
        background-color: #187;
        color: #fff;
       
    }
.ivu-table-cell{
      padding-left: 0 !important;
      padding-right:0 !important;

    }
       .mytable-style-profitSimple .vxe-body--row.row-green {
          background-color: #448aca;
          color: #fff;
        }
        .mytable-style-profitSimple .vxe-header--column.col-blue {
          background-color: #2db7f5;
          color: #fff;
        }
       
        .mytable-style-profitSimple .vxe-body--column.col-red {
          background-color: #f39800;
          color: #fff;
        }
        .mytable-style-profitSimple .vxe-body--column.col-orange {
          background-color: #f60;
          color: #fff;
        }
        .mytable-style-profitSimple .vxe-body--column.col-white {
          background-color: white;
        }
         .mytable-style-profitSimple .vxe-body--column.col-blue {
          background-color:blue;
          color: #fff;
        }
         .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {
      padding: 0 2px;
      }
      #xiadan .ivu-select-dropdown{
              left: -114px!important;
      }
</style>

