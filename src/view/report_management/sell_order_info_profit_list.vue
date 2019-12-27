<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
          <FormItem label="订单号:" style="margin-right:10px;">
          <Input style="width:200px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
          <FormItem label="销售客户方:">
            <Select v-model="cusorgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getcusDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
           <FormItem label="供应商查询:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
            <FormItem label='下单时间'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>
           
          <FormItem label="管理员查询:">
            <Select v-model="adminSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
      
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
          <FormItem label="工程名称:" style="margin-right:10px;">
          <Input style="width:200px"  placeholder="请输入工程名称" v-model="formItem.engineering"></Input>
          </FormItem>
          <FormItem label="是否有利润:">
            <Select v-model="formItem.profit"  style="width:200px"  placeholder="请选择"   >
               <Option  value="0" label="大于"  > 大于 </Option>
               <Option  value="1" label="小于"  >小于  </Option>
               <Option  value="2" label="等于"  > 等于 </Option>
               <Option  value="3" label="不等于"  >不等于 </Option>
      
            </Select>
          </FormItem>
          </Col>
        
          <Col span="24">
             <Button style="margin-left:10px" type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button style="margin-left:10px"  shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
            <Button style="margin-left:10px"  icon="ios-download-outline" @click="exportCsvEvent()">导出excel</Button>

          </Col>
          <a style="color:red">注：毛利总额 = 结算金额(销售) - 结算金额(采购)</a>
        </Row>
         <vxe-table height="650"
         class="mytable-style" size="mini" ref="xTable1" :data.sync="data1" :cell-class-name="cellClassName" >
                <vxe-table-column width="40"  type="index" ></vxe-table-column>
                <vxe-table-column width="40" field="id" title="ID" ></vxe-table-column>

                <vxe-table-column width="80" :formatter="this.$global.vxeTableMoney" field="buyRealDanjia" title="结算单价(采购)" ></vxe-table-column>
                <vxe-table-column width="80" :formatter="this.$global.vxeTableWeight" field="buyRealWeight" title="结算重量(采购)" ></vxe-table-column>
                <vxe-table-column width="200" :formatter="this.$global.vxeTableMoney" field="buyRealMoney" title="结算金额(采购)" ></vxe-table-column>
                <vxe-table-column width="150" :formatter="this.$global.vxeTableMoney" field="jiesuanDanjia" title="结算单价(销售)" ></vxe-table-column>
                <vxe-table-column width="200" :formatter="this.$global.vxeTableWeight" field="jiesuanWeight" title="结算重量(销售)" ></vxe-table-column>
                <vxe-table-column width="200" :formatter="this.$global.vxeTableMoney" field="jiesuanMoney" title="结算金额(销售)" ></vxe-table-column>
                <vxe-table-column width="100"  style="color:red" :formatter="this.$global.vxeTableMoney" field="profit" title="毛利" ></vxe-table-column>
                <vxe-table-column width="100":formatter="this.$global.vxeTableMoney" field="profitMoney" title="毛利总额" ></vxe-table-column>
                <vxe-table-column width="150" field="createTime" title="下单时间" ></vxe-table-column>
                <vxe-table-column width="200" field="orderNo" title="销售单号" ></vxe-table-column>
                <vxe-table-column width="250" field="shopOrgName" title="供应商名称" ></vxe-table-column>
                <vxe-table-column width="250" field="customerOrgName" title="采购方名称" ></vxe-table-column>
                <vxe-table-column width="200" field="gongcheng" title="工程名称" ></vxe-table-column>
                <vxe-table-column width="100" field="createCname" title="管理员" ></vxe-table-column>
                <vxe-table-column width="100" field="steelName" title="品名" ></vxe-table-column>
                <vxe-table-column width="100" field="steelGuige" title="规格" ></vxe-table-column>
                <vxe-table-column width="100" field="steelPaihao" title="材质" ></vxe-table-column>
                <vxe-table-column width="100" field="steelPinpai" title="钢厂" ></vxe-table-column>
                <vxe-table-column width="100" field="steelWorks" title="提货方式" ></vxe-table-column>
                <vxe-table-column width="100" field="jiaohuodi" title="交货地" ></vxe-table-column>
                <vxe-table-column width="100" field="jianshu" title="件数" ></vxe-table-column>
                <vxe-table-column width="100" :formatter="this.$global.vxeTableWeight" field="weight" title="单件重" ></vxe-table-column>
                <vxe-table-column width="100" :formatter="this.$global.vxeTableWeight" field="zongzhongliang" title="总重量" ></vxe-table-column>
                <vxe-table-column width="120" field="guapaijia" :formatter="this.$global.vxeTableMoney"  title="销售单价"></vxe-table-column>
                <vxe-table-column width="120" field="cusMoney" :formatter="this.$global.vxeTableMoney"  title="总金额"></vxe-table-column>
                <vxe-table-column width="100" field="kunbaohao" title="捆包号" ></vxe-table-column>
                <vxe-table-column width="100" field="receiptStatus" :formatter="formReceiptStatus" title="是否收货" ></vxe-table-column>
                <vxe-table-column width="100" :formatter="this.$global.vxeTableWeight" field="invoiceWeight" title="开票重量" ></vxe-table-column>
                <vxe-table-column width="100" :formatter="this.$global.vxeTableMoney"  field="invoiceMoney" title="开票金额" ></vxe-table-column>
                <vxe-table-column width="100" field="invoiceNo" title="开票号码" ></vxe-table-column>
                <vxe-table-column width="100" field="invoiceStatus" :formatter="formInvoiceStatus" title="是否收票" ></vxe-table-column>
                <vxe-table-column width="100" field="inStockId" title="仓库ID" ></vxe-table-column>

            </vxe-table>
        <!-- <Table height="400" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table> -->

        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findOrdersInfoAll
} from '@/api/data_8889'
import {findOrgCusAcc,
getUserList,findOrdersInfoAllSum89Sum,findOrdersInfoAllSum89Zong} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList} from '@/libs/global_type'

export default {
    name: 'sell_order_info_profit_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        allTotalDic:'',
        shopList:[],
        cusOrgList:[],
        lengthListThis:lengthList,
        showIdK       :'',
        agentId       :'',
        agentShortName:'',
        shopId        :'',
        shopName      :'',
        shopOrgName   :'',
        shopUserId    :'',
        shopOrgId     :'',
        cusOrgId:"",
        cusId:"",
        cusOrgName:"",
        orgSearch:'',
        cusorgSearch:"",
        adminSearchId:"",
        adminSearch:'',
        adminList:[],
        tableItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:10,
          orderNo:'',
          engineering:'',
          profit:''
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
          columns4: [
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
         exportCsvEvent () {
              this.$refs.xTable1.exportCsv({
                filename: ' 销售利润表',
              })
            },
      cellClassName({ row, rowIndex, column, columnIndex }){//设置行和列的颜色
          if(column.property  == "profit" || column.property == "profitMoney"){
            return 'col-orange';
          }

      },
      formReceiptStatus({cellValue, row, column}){//是否收货
      
          return getReceiptStatusLabel(cellValue);
      },
      formInvoiceStatus({cellValue, row, column}){//是否收票
      
          return getInvoiceStatusLabel(cellValue);
      },
  exportData(){//导出到excel

        this.$refs.selection.exportCsv({
          filename:"导出excel"
        })
      },
      getShop(){
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
       getcusDian(item){
        this.cusOrgId = item.value;
        this.cusOrgName = item.label;
       },
        getDian(item){
        this.shopOrgName = item.label;
        this.shopOrgId = item.value;
       },
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';

      },
      propsClick(){
        this.reload();
      },
      getAdmin(item){
        this.adminSearchId = item.value;
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

         //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum     = this.pagesizea              //分页
         param.beginStatus = 1 ;
         param.endStatus   = 11 ;
         param.userId      = this.adminSearchId          //管理员查询
         param.shopOrgId   = this.shopOrgId              //供应商
         param.beginTime   = this.formItem.beginTime     //创建时间 
         param.endTime     = this.formItem.endTime       //供应商
         param.pageSize    = this.formItem.length;
         param.orderNo     = this.formItem.orderNo
         param.gongcheng   = this.formItem.engineering;
         param.cusOrgId    = this.cusOrgId;//采购方公司id
          //是否有利润
          switch (this.formItem.profit) {
            case "0":
              param.dayu = ">"
              break;
            case "1":
              param.xiaoyu = "<"
              break;
            case "2":
              param.dengyu = "="
              break;
            case "3":
              param.budengyu = "!="
              break;
            default:
              break;
          }
           findOrdersInfoAll(param).then(res=>{
            if(res.code =="100"){
              for(var i = 0;i <res.data.list.length;i++){
                var dic = res.data.list[i];
                //计算订单的利润单价 和利润总额
                //利润 = 销售单价  - 结算单价
                //利润总额= 销售总额 - 采购总额
                dic.profit = this.$global.accMinus(dic.jiesuanDanjia,dic.buyRealDanjia);
                dic.profitMoney  =this.$global.accMinus(dic.jiesuanMoney,dic.buyRealMoney);
              }
            let alist       = this.getTotalThisPage(res.data.list);
                this.totalM = res.data.total;
                this.data1  = alist;

            this.getOrderInfoTotal(param);
          }  
         })
          
       },
       getOrderInfoTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findOrdersInfoAllSum89Zong(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data.list[0];
              this.allTotalDic = res.data.list[0]
              let dealDic = {};
              dealDic.id = '全部合计'
              dealDic.buyRealWeight = dic.buyRealWeight
              dealDic.buyRealMoney = dic.buyRealMoney
              dealDic.jiesuanWeight = dic.jiesuanWeight
              dealDic.jiesuanMoney = dic.jiesuanMoney

              dealDic.profitMoney  =this.$global.accMinus(dic.jiesuanMoney,dic.buyRealMoney);

            this.data1.push(dealDic);
          }  
         })
       },
       getTotalThisPage(list){//获取当页合计，插入到数据中
          let sList = list;
          let dic = {};
          dic.id =  '当页合计'
          dic.buyRealWeight        = 0
          dic.buyRealMoney        = 0

          dic.jiesuanWeight  = 0;
          dic.jiesuanMoney   = 0;

          dic.profitMoney    = 0;
          dic.profit = "";
          

          for(var i = 0; i< sList.length;i++){
            let item               = sList[i];
                //销售重量合计，销售结算金额合计
                dic.jiesuanWeight  = this.$global.accAdd(item.jiesuanWeight,dic.jiesuanWeight)
                dic.jiesuanMoney   = this.$global.accAdd(item.jiesuanMoney,dic.jiesuanMoney)
                //采购结算重量合计，采购结算金额合计
                dic.buyRealWeight  = this.$global.accAdd(item.buyRealWeight,dic.buyRealWeight)
                dic.buyRealMoney   = this.$global.accAdd(item.buyRealMoney,dic.buyRealMoney)
                //利润合计
                dic.profitMoney    = this.$global.accAdd(item.profitMoney,dic.profitMoney)
          }
          sList.push(dic)
          return sList;
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
<style>

 .ivu-table td.demo-table-info-column{
        background-color: #187;
        color: #fff;
    }
.ivu-table-cell{
      padding-left: 0 !important;
      padding-right:0 !important;

    }
       .mytable-style .vxe-body--row.row-green {
          background-color: #187;
          color: #fff;
        }
        .mytable-style .vxe-header--column.col-blue {
          background-color: #2db7f5;
          color: #fff;
        }
       
        .mytable-style .vxe-body--column.col-red {
          background-color: red;
          color: #fff;
        }
        .mytable-style .vxe-body--column.col-orange {
          background-color: #f60;
          color: #fff;
        }
         .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {
      padding: 0 2px;
      }
</style>
