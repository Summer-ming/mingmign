<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='xioashou'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
          <FormItem label="订单号:" style="margin-right:10px;">
          <Input clearable style="width:100px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
           <FormItem label="客户查询:">
            <Select clearable v-model="orgSearch"  style="width:100px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
            <FormItem label='下单时间'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 100px">
              </DatePicker>
            </FormItem>
           
          <FormItem label="管理员查询:">
            <Select clearable v-model="adminSearch"  style="width:100px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
      
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
          <FormItem label="工程名称:" style="margin-right:10px;">
               <el-select  style="width:100px" :transfer="true" size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                          <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-option>
                        </el-select>
          </FormItem>
           <FormItem label="订单状态:" style="margin-right:10px;">
            <Select clearable  v-model='formItem.orderStatus' style="width:100px" placeholder="请选择订单状态" >
              <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="公司抬头:">
            <Select clearable v-model="formItem.bankJgId"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
        
          <Col span="24">
             <Button size='small' type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button size='small' shape="circle"  style='margin-left:4px' icon="md-refresh" @click="reloadSelf"></Button>
            <Button size='small' type="primary"  icon="ios-download-outline" @click="exportData()" style='margin-left:4px'>导出excel</Button>
             <!-- <Button style="margin-left:10px"   type='primary'  @click="getSelectEvent1()">批量修改对账日期</Button> -->
              <!-- 合计 -->
              <br>
              <span style="">合同重量<span   style="color:#4b98dc;">{{this.$global.accPrecision(TWeight,3)}}</span> 吨&nbsp;&nbsp; </span>
              <span style="margin-left:20px">合同金额<span  style="color:#4b98dc;">{{this.$global.isMoneyShow(TMoney)}}</span> 元&nbsp;&nbsp;</span>
              <br>
              <span style="">结算总重量<span   style="color:red;">{{this.$global.accPrecision(TjiesuanWeight,3)}}</span> 吨&nbsp;&nbsp;</span>
              <span style="margin-left:20px">结算总金额<span   style="color:red;">{{this.$global.isMoneyShow(TjiesuanMoney)}}</span> 元&nbsp;&nbsp;</span>
          </Col>
        </Row>
        <!-- <Table height="400" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table> -->
        <vxe-table height="600" border resizable
         class="mytable-style"  :select-config="{labelField: 'name', checkMethod}" size="mini" ref="xTable1" :data.sync="data1"  >
              
                <vxe-table-column   type="selection" width="40"></vxe-table-column>
                <vxe-table-column width="40"  type="index" ></vxe-table-column>
                <vxe-table-column width="40" field="id" title="ID" ></vxe-table-column>
                <!-- <vxe-table-column width="100" field="duizhangTime" title="对账时间" ></vxe-table-column> -->
                <vxe-table-column field="orderNo" title="销售单号" width="200" show-overflow >
                    <template v-slot="{row}">
                        <a style=' cursor:pointer;'  @click='getAA(row)' type="text">{{row.orderNo}}</a>
                    </template>
                </vxe-table-column>
                <!-- //下面是显示 -->
                <vxe-table-column width="80" :formatter="this.$global.vexcreateTime" field="createTime" title="收货时间" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" :formatter="orgShopName" field="shopOrgName" title="供应商名称" show-overflow></vxe-table-column>
                <vxe-table-column width="120" field="customerOrgName" title="客户" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" field="gongcheng" title="工程名称" show-overflow ></vxe-table-column>
                <vxe-table-column width="80" field="createCname" title="管理员" show-overflow></vxe-table-column>
                <vxe-table-column width="80" field="steelName" title="品名" show-overflow></vxe-table-column>
                <vxe-table-column width="80" field="steelGuige" title="规格" show-overflow></vxe-table-column>
                <vxe-table-column width="80" field="steelPaihao" title="材质" show-overflow ></vxe-table-column>
                <vxe-table-column width="80" field="steelPinpai" title="钢厂" show-overflow></vxe-table-column>
                <vxe-table-column width="80" field="steelWorks" title="提货方式" show-overflow></vxe-table-column>
                <vxe-table-column width="80" field="jiaohuodi" title="交货地" show-overflow></vxe-table-column>
                <vxe-table-column width="80" field="jianshu" title="件数" show-overflow></vxe-table-column>
                <vxe-table-column width="80"  align='right' :formatter="this.$global.vxeTableWeight" field="weight" title="单件重" show-overflow></vxe-table-column>
                <vxe-table-column width="80"  align='right' :formatter="this.$global.vxeTableWeight" field="zongzhongliang" title="总重量" show-overflow ></vxe-table-column>
                <vxe-table-column width="80"  align='right'  :formatter="this.$global.vxeTableMoney" field="guapaijia" title="单价" show-overflow></vxe-table-column>
                <vxe-table-column width="120" align='right' :formatter="this.$global.vxeTableMoney" field="cusMoney" title="总金额" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" field="kunbaohao" title="捆包号" show-overflow ></vxe-table-column>
                <vxe-table-column width="120"  :formatter="this.$global.vxeTableMoney" field="internetMoney" title="网价" show-overflow ></vxe-table-column>
                <vxe-table-column width="120"  :formatter="this.$global.vxeTableMoney" field="floatMoney" title="浮动价格" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" field="region" title="网价区域" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" field="internetMoneyNote" title="网价备注" show-overflow></vxe-table-column>
                <vxe-table-column width="120" align='right'  :formatter="this.$global.vxeTableMoney" field="jiesuanDanjia" title="结算单价" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" align='right' :formatter="this.$global.vxeTableWeight" field="jiesuanWeight" title="结算重量" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" align='right'  :formatter="this.$global.vxeTableMoney" field="jiesuanMoney" title="结算金额" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" align='center' field="receiptStatus" :formatter="receiptStatus" title="是否收货" show-overflow></vxe-table-column>
                <vxe-table-column width="120" :formatter="this.$global.vxeTableWeight" field="invoiceWeight" title="开票重量" show-overflow ></vxe-table-column>
                <vxe-table-column width="120"  :formatter="this.$global.vxeTableMoney" field="invoiceMoney" title="开票金额" show-overflow></vxe-table-column>
                <vxe-table-column width="120" field="invoiceNo" title="开票号码" show-overflow></vxe-table-column>
                <vxe-table-column width="120" field="invoiceStatus" :formatter="invoiceStatus" title="是否收票" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" :formatter="orderStatus"  field="status" title="订单状态" show-overflow></vxe-table-column>
                <vxe-table-column width="120"  :formatter="this.$global.vxeTableMoney" field="buyRealDanjia" title="采购单价" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" :formatter="this.$global.vxeTableWeight" field="buyRealWeight" title="采购结算重量" show-overflow></vxe-table-column>
                <vxe-table-column width="120"  :formatter="this.$global.vxeTableMoney" field="buyRealMoney" title="采购结算金额" show-overflow></vxe-table-column>

            </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    
         <Modal
        v-model="modal1"
        title="修改时间"
        @on-ok="ok"
       >
        <Form :model="formItem1" inline :label-width="100" id='xiadan'>
               <FormItem label='对账时间'>
                    <DatePicker type="date" placeholder="请选择时间"  @on-change="changeDuiZhang" style="width: 200px"></DatePicker>
            </FormItem>
        </Form>
    </Modal> 
     </div>
</template>

<script>
import {findOrdersInfoAll,
findOrdersInfoAllSum,updateOrderInfo} from '@/api/data_8889'
import {findOrgCusAcc,getUserList,findOrdersInfoAllSum89Zong,findOrderEngineering} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel,getBuyOrderStatus} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,orderStatusList,belongCompanyList} from '@/libs/global_type'
import excel from '@/libs/excel'
export default {
    name: 'sell_xiao_search',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
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
          columns4: [],
                data1: [],//表格展示的数据
    
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
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
        
        row.operateType  ="1"//查看
        row.ordersNo=row.orderNo
        sessionStorage.setItem('XiaoShou','')
        sessionStorage.setItem('XiaoShou',JSON.stringify(row))
              const route = { 
                 name: 'sell_order_info',
                // query: row
                 }
              this.$router.push(route)
        },
      //禁止选中
        checkMethod ({ row }) {
              //条件满足的 可以选择
              return row.id !="当页合计"&&  row.id !="全部合计" 
        },
       //确认修改对账时间
        ok(){
            let updateRecords = this.$refs.xTable1.getSelectRecords()
            console.log(updateRecords)
            let param = {pageOrderInfoList:[]};
            updateRecords.map((item)=>{
                    let dic={};
                    dic.id=item.id;
                    dic.duizhangTime=this.daozhangTime
                   param.pageOrderInfoList.push(dic)
            })
          updateOrderInfo(param).then(res=>{
            if(res.code =="100"){
               this.searchM();
          }  
         })


        },
       //修改对账时间
        changeDuiZhang(item){
            console.log(item)
            this.daozhangTime=item;
        },
       //获取选中 
        getSelectEvent1(){
            this.modal1=true;
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
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';

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

         //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum     = this.pagesizea              //分页
         param.userId      = this.adminSearchId          //管理员查询
         param.cusOrgId    = this.shopOrgId              //供应商
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
             else {
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
         
          findOrdersInfoAllSum89Zong(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data.list[0];
              dic.id = '全部合计'
              dic.createTime=''
               dic.steelName = ''
            this.data1.push(dic);
             this.TWeight        = dic.zongzhongliang
            this.TMoney         = dic.cusMoney
            this.TjiesuanWeight = dic.jiesuanWeight
            this.TjiesuanMoney  = dic.jiesuanMoney
          }  
         })
       },
       getTotalThisPage(list){//获取当页合计，插入到数据中
          let sList = list;
          let dic = {};
          dic.id =  '当页合计'
           dic.steelName = ''
          dic.jianshu        = 0
          dic.zongzhongliang = 0;
          dic.cusMoney       = 0;
          dic.jiesuanWeight  = 0;
          dic.jiesuanMoney   = 0;
          dic.invoiceWeight  = 0;
          dic.invoiceMoney   = 0;
          dic.createTime=''
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
<style>

 #xioashou .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0px!important;
      }
    #xioashou .vxe-table .vxe-body--column{
        line-height:20px!important;
      }
   #xioashou .vxe-table .vxe-cell {
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
         .mytable-style .vxe-body--column.col-blue {
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

