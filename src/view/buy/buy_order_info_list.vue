<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='padidng_m'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
          <FormItem label="订单号:" style="margin-right:10px;">
          <Input clearable style="width:200px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
           <FormItem label="供应商查询:">
            <Select clearable v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
            <FormItem label='下单时间'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>
           
          <FormItem label="管理员查询:">
            <Select clearable v-model="adminSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
      
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
          <FormItem label="工程名称:" style="margin-right:10px;">
            <el-select size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
             <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
              </el-option>
            </el-select>
          </FormItem>
          <!-- <FormItem label="工程名称:" style="margin-right:10px;">
          <Input style="width:200px"  placeholder="请输入工程名称" v-model="formItem.engineering"></Input>
          </FormItem> -->
           <FormItem label="订单状态:" style="margin-right:10px;">
            <Select  v-model='formItem.orderStatus' style="width:200px" placeholder="请选择订单状态" >
              <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="公司抬头:">
            <Select v-model="formItem.bankJgId"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
        
          <Col span="24">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
              <Button type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>

              <!-- 合计 -->
              <br>
              <span style="">合同重量<span   style="color:#4b98dc;">{{this.$global.accPrecision(TWeight,3)}}</span> 吨&nbsp;&nbsp; </span>
              <span style="margin-left:10px">合同金额<span  style="color:#4b98dc;">{{this.$global.isMoneyShow(TMoney)}}</span> 元&nbsp;&nbsp;</span>
              <br>
              <span style="">实提总重量<span   style="color:red;">{{this.$global.accPrecision(TjiesuanWeight,3)}}</span> 吨&nbsp;&nbsp;</span>
              <span style="margin-left:10px">实提总金额<span   style="color:red;">{{this.$global.isMoneyShow(TjiesuanMoney)}}</span> 元&nbsp;&nbsp;</span>
              <br>
              <span style="">开票总重量<span   style="color:red;">{{this.$global.accPrecision(TInvoiceWeight,3)}}</span> 吨&nbsp;&nbsp;</span>
              <span style="margin-left:10px">开票总金额<span   style="color:red;">{{this.$global.isMoneyShow(TInvoiceMoney)}}</span> 元&nbsp;&nbsp;</span>

          </Col>
        </Row>
             <!-- 新增table -->
         <vxe-toolbar  style='padding:0;'
          setting
          :refresh="{query:data1 }"></vxe-toolbar>
         <vxe-table height="450" border   resizable  size="mini" ref="xTable1" 
           :data.sync="data1"   >
                <vxe-table-column width="45" field="id" title="ID" ></vxe-table-column>
                <vxe-table-column width="80"  field="createTime" show-overflow title="下单时间" >
                  <template v-slot="{row}">
                              <span v-if="row.createTime" style="color:red">{{row.createTime.substr(0,10)}}</span>
                            </template>
                </vxe-table-column>
                <vxe-table-column width="200" field="orderNo" show-overflow title="采购单号" ></vxe-table-column>
                <vxe-table-column width="100" field="shopOrgName" show-overflow title="供应商名称" ></vxe-table-column>
                <vxe-table-column width="100" field="customerOrgName" show-overflow title="采购方名称" ></vxe-table-column>
                <vxe-table-column width="100" field="gongcheng" show-overflow title="工程名称" ></vxe-table-column>
                <vxe-table-column width="100" field="createCname" show-overflow title="管理员" ></vxe-table-column>
                <vxe-table-column width="100" field="steelName" show-overflow title="品名" ></vxe-table-column>
                <vxe-table-column width="100" field="steelGuige" show-overflow title="规格" ></vxe-table-column>
                <vxe-table-column width="100" field="steelPaihao" show-overflow title="材质" ></vxe-table-column>
                <vxe-table-column width="100" field="steelPinpai" show-overflow title="钢厂" ></vxe-table-column>
                <vxe-table-column width="100" field="steelWorks" show-overflow title="提货方式" ></vxe-table-column>
                <vxe-table-column width="100" field="jizhongType" show-overflow title="计重方式" ></vxe-table-column>
                <vxe-table-column width="100" field="jiaohuodi" show-overflow title="交货地" ></vxe-table-column>
                <vxe-table-column width="100" field="jianshu" show-overflow title="件数" ></vxe-table-column>
                <vxe-table-column width="100" field="weight" show-overflow :formatter="this.$global.vxeTableWeight" title="单件重" ></vxe-table-column>
                <vxe-table-column align='right' width="100" field="zongzhongliang" show-overflow :formatter="this.$global.vxeTableWeight" title="总重量" ></vxe-table-column>
                <vxe-table-column align='right' width="100" field="guapaijia" :formatter="this.$global.vxeTableMoney" show-overflow title="单价" ></vxe-table-column>
                <vxe-table-column align='right' width="100" field="cusMoney" show-overflow :formatter="this.$global.vxeTableMoney" title="总金额" ></vxe-table-column>
                <vxe-table-column width="100" field="kunbaohao" show-overflow title="捆包号" ></vxe-table-column>
                <vxe-table-column width="100" align='right' field="jiesuanDanjia" :formatter="this.$global.vxeTableMoney" show-overflow title="实提单价" ></vxe-table-column>
                <vxe-table-column width="100" align='right' field="jiesuanWeight" show-overflow :formatter="this.$global.vxeTableWeight" title="实提重量" ></vxe-table-column>
                <vxe-table-column width="100" align='right' field="jiesuanMoney" :formatter="this.$global.vxeTableMoney" show-overflow title="实提金额" ></vxe-table-column>
                <vxe-table-column width="100" field="receiptStatus" show-overflow :formatter="this.$global.vexShouH"  title="是否收货" ></vxe-table-column>
                <vxe-table-column width="100" field="invoiceWeight" show-overflow :formatter="this.$global.vxeTableWeight" title="收票重量" ></vxe-table-column>
                <vxe-table-column width="100" field="invoiceMoney" :formatter="this.$global.vxeTableMoney" show-overflow title="收票金额" ></vxe-table-column>
                <vxe-table-column width="100" field="invoiceNo" show-overflow title="收票号码" ></vxe-table-column>
                <vxe-table-column width="100" field="invoiceStatus" show-overflow :formatter="this.$global.vexShouP" title="是否收票" ></vxe-table-column>
                <vxe-table-column width="100" field="status" show-overflow title="状态" ></vxe-table-column>

           </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findOrdersInfoAll,
findShop,
findOrgCusAcc,
getUserList,
findOrdersInfoAllSum,findOrderEngineering} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel,getBuyOrderStatus} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,orderStatusList,belongCompanyList} from '@/libs/global_type'


export default {
    name: 'buy_order_info_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        TInvoiceMoney:0,//开票金额
        TInvoiceWeight:0,//开票重量
        engineerNameList:[],//工程名称数组
        shopList:[],
        TWeight:0,
        TMoney:0,
        belongCompanyListThis:belongCompanyList,
        TjiesuanWeight:0,
        TjiesuanMoney:0,
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
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:20,
          orderNo:'',
          engineering:'',
          bankJgId:''
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
      //footer vxeTable合计
       footerMethod ({ columns, data }) {
         //tableTotalDic
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '当页合计hh'
                  }
                   if(['jianshu'].includes(column.property)){//件数 0位小数点
                    return XEUtils.sum(data, column.property)
                  }  zongzhongliang
                  if(['zongzhongliang','jiesuanWeight','invoiceWeight'].includes(column.property)){//重量 3位小数点
                    return XEUtils.sum(data, column.property)
                  }
                    if(['cusMoney','jiesuanMoney','invoiceMoney'].includes(column.property)){//金额千分位显示
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property))
                  }    
                  return '-'
                }),
                // columns.map((column, columnIndex) => {
                //   if (columnIndex === 0) {
                //     return '全部合计'
                //   }
                //     if(['actualApyMoney'].includes(column.property)){//
                //     console.log("全部合计中"+this.tableTotalDic.actualApyMoney);
                //     return this.$global.isMoneyShow(this.tableTotalDic.actualApyMoney);
                //   } 
                //    if(['dikouMoney'].includes(column.property)){//
                //     return this.$global.isMoneyShow(this.tableTotalDic.dikouMoney);
                //   }    
                //   return '-'
                // })
              ]
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
       exportData(){//导出到excel

        this.$refs.xTable1.exportCsv({
          filename:"导出excel"
        })
      },
      getShop(){
        let param = {};
        param.pageNum ="1";
        param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
        getDian(item){
        this.shopOrgName = item?item.label:'';
        this.shopOrgId = item?item.value:'';
       },
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0]?data[0] +' 00:00:00':'';
        this.formItem.endTime  =data[1]?data[1]+' 24:00:00':'';

      },
      propsClick(){
        this.reload();
      },
      getAdmin(item){
        this.adminSearchId = item?item.value:'';
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
         param.userId      = this.adminSearchId          //管理员查询
         param.shopOrgId   = this.shopOrgId              //供应商
         param.beginTime   = this.formItem.beginTime     //创建时间 
         param.endTime     = this.formItem.endTime       //供应商
         param.pageSize    = this.formItem.length;
         param.orderNo     = this.formItem.orderNo
         param.gongcheng   = this.formItem.engineering;
          //根据订单状态查询
             if(this.formItem.orderStatus == "1"){
               param.beginStatus = 1 ;
              param.endStatus   = 1 ;
             }else if(this.formItem.orderStatus == "2"){
               param.beginStatus = 2 ;
                param.endStatus   = 7 ;
             }
             else if(this.formItem.orderStatus =="" ||this.formItem.orderStatus == undefined ) {
               param.beginStatus = '2' ;
                param.endStatus   = '90' ;
             }
             else{
               param.beginStatus = this.formItem.orderStatus ;
                param.endStatus   = this.formItem.orderStatus ;
             }
            param.bankJgId = this.formItem.bankJgId;
           findOrdersInfoAll(param).then(res=>{
            if(res.code =="100"){
            let alist =  this.getTotalThisPage(res.data.list);
            this.totalM=res.data.total; 
            this.data1=alist;

            this.getOrderInfoTotal(param);
          }  
         })
          
       },
       getOrderInfoTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findOrdersInfoAllSum(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data.list[0];
              dic.id = '全部合计'
            this.data1.push(dic);
            this.TWeight        = dic.zongzhongliang
            this.TMoney         = dic.cusMoney
            this.TjiesuanWeight = dic.jiesuanWeight
            this.TjiesuanMoney  = dic.jiesuanMoney
            this.TInvoiceWeight = dic.invoiceWeight;
            this.TInvoiceMoney = dic.invoiceMoney;
          }  
         })
       },
       getTotalThisPage(list){//获取当页合计，插入到数据中
          let sList = list;
          let dic = {};
          dic.id =  '当页合计'
          dic.jianshu        = 0
          dic.zongzhongliang = 0;
          dic.cusMoney       = 0;
          dic.jiesuanWeight  = 0;
          dic.jiesuanMoney   = 0;
          dic.invoiceWeight  = 0;
          dic.invoiceMoney   = 0;
          for(var i = 0; i< sList.length;i++){
            let item               = sList[i];
                dic.jianshu        = this.$global.accAdd(item.jianshu,dic.jianshu)
                dic.zongzhongliang = this.$global.accAdd(item.zongzhongliang,dic.zongzhongliang)
                dic.cusMoney       = this.$global.accAdd(item.cusMoney,dic.cusMoney)
                dic.jiesuanWeight  = this.$global.accAdd(item.jiesuanWeight,dic.jiesuanWeight)
                dic.jiesuanMoney   = this.$global.accAdd(item.jiesuanMoney,dic.jiesuanMoney)
                dic.invoiceWeight  = this.$global.accAdd(item.invoiceWeight,dic.invoiceWeight)
                dic.invoiceMoney   = this.$global.accAdd(item.invoiceMoney,dic.invoiceMoney)
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
     this.getGongcheng();//获取工程名称

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
<style <style lang="less">
  .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
       #padidng_m .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0px!important;
      }
  #padidng_m .vxe-table .vxe-body--column{
        line-height:20px!important;
      }
   #padidng_m .vxe-table .vxe-cell {
      padding: 0 2px;
      }
</style>
