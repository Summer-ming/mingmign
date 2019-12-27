<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='moppp'>
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
              <DatePicker clearable @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>
           
          <FormItem label="管理员查询:">
            <Select clearable v-model="adminSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
      
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select clearable v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
          <FormItem label="工程名称:" style="margin-right:10px;">
             <el-select style="width:200px" :transfer="true" size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                          <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-option>
                        </el-select>
          <!-- <Input  style="width:200px"  placeholder="请输入工程名称" v-model="formItem.engineering"></Input> -->
          </FormItem>
           <FormItem label="订单状态:" style="margin-right:10px;">
            <Select clearable  v-model='formItem.orderStatus' style="width:140px" placeholder="请选择订单状态" >
              <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="公司抬头:">
            <Select  clearable v-model="formItem.bankJgId"  style="width:200px"  placeholder="请选择"   >
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
              <span >合同重量<span   style="color:#4b98dc;">{{this.$global.accPrecision(TWeight,3)}}</span> 吨&nbsp;&nbsp; </span>
              <span style="margin-left:10px">合同金额<span  style="color:#4b98dc;">{{this.$global.isMoneyShow(TMoney)}}</span> 元&nbsp;&nbsp;</span>
              <br>
              <span style="">结算总重量<span   style="color:red;">{{this.$global.accPrecision(TjiesuanWeight,3)}}</span> 元&nbsp;&nbsp;</span>
              <span style="margin-left:10px">结算总金额<span   style="color:red;">{{this.$global.isMoneyShow(TjiesuanMoney)}}</span> 元&nbsp;&nbsp;</span>
          </Col>
        </Row>
        <!-- <Table height="400" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table> -->

        <!--新修改表格-->
        <vxe-toolbar 
          setting
          :refresh="{query:data1 }"></vxe-toolbar>
        <!-- =2=2= -->
           <vxe-table height="600" border show-footer resizable class="vxe-table-element" size="mini" ref="xTable1" :footer-method="footerMethod" :data.sync="data1">
             <vxe-table-column width="40" field="id" title="ID" ></vxe-table-column>
                <vxe-table-column sortable  width="100" field="createTime" title="订单创建时间" >
                  <template v-slot="{row}">
                              <span style="color:red">{{row.createTime.substring(0,10)}}</span>
                   </template>
                </vxe-table-column>
                <vxe-table-column width="200" field="orderNo" title="采购单号" >
                       <template v-slot="{row}">
                              <span @click='getTiao(row)' style="color:blue">{{row.orderNo}}</span>
                        </template>
                </vxe-table-column>
                <vxe-table-column show-overflow width="90" field="shopOrgName" title="供应商名称" >
                       <template v-slot="{row}">
                              <span >{{row.shopOrgName}}</span>
                        </template>
                </vxe-table-column>
                <vxe-table-column width="100" field="customerOrgName" show-overflow title="采购方名称" ></vxe-table-column>
                <vxe-table-column width="60" field="gongcheng" show-overflow title="工程名称" ></vxe-table-column>
                <vxe-table-column width="60" field="createCname" show-overflow title="管理员" ></vxe-table-column>
                <vxe-table-column width="60" field="steelName" show-overflow title="品名" ></vxe-table-column>
                <vxe-table-column width="60" field="steelGuige" show-overflow title="规格" ></vxe-table-column>
                <vxe-table-column width="60" field="steelPaihao" show-overflow title="材质" ></vxe-table-column>
                <vxe-table-column width="60" field="steelPinpai" show-overflow title="钢厂" ></vxe-table-column>
                <vxe-table-column width="60" field="steelWorks" show-overflow title="提货方式" ></vxe-table-column>
                <vxe-table-column width="60" field="jiaohuodi" show-overflow title="交货地" ></vxe-table-column>
                <vxe-table-column width="60" field="jianshu" sortable show-overflow title="件数"></vxe-table-column>
                <vxe-table-column width="80" align='right' field="weight" sortable show-overflow title="单件重" :formatter="this.$global.vxeTableWeight"></vxe-table-column>
                <vxe-table-column width="80" align='right' field="zongzhongliang" sortable show-overflow title="总重量" :formatter="this.$global.vxeTableWeight"></vxe-table-column>
                <vxe-table-column width="80" align='right' field="guapaijia" sortable show-overflow title="单价" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column width="80" align='right' field="cusMoney" sortable show-overflow title="总金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column width="80" field="kunbaohao"  show-overflow title="捆包号" ></vxe-table-column>
                <vxe-table-column width="80" align='right' field="jiesuanDanjia" sortable show-overflow title="实提单价" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
                <vxe-table-column width="80" align='right' field="jiesuanWeight" sortable show-overflow title="实提重量" :formatter="this.$global.vxeTableWeight"></vxe-table-column>
                <vxe-table-column width="80" align='right' field="jiesuanMoney" sortable show-overflow title="实提金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column width="80" align='center' field="receiptStatus" show-overflow title="是否收货" :formatter="this.$global.vexShouH" ></vxe-table-column>
                <vxe-table-column width="80" field="invoiceWeight" sortable show-overflow title="收货重量" :formatter="this.$global.vxeTableWeight"></vxe-table-column>
                <vxe-table-column width="80" field="invoiceMoney" sortable show-overflow title="收票金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column width="80" field="invoiceNo" show-overflow title="收票号码" ></vxe-table-column>
                <vxe-table-column width="80" field="invoiceStatus" show-overflow title="是否收票" :formatter="this.$global.vexShouP"></vxe-table-column>
                <vxe-table-column width="140" field="status" title="状态" :formatter='this.$global.vexStatus'></vxe-table-column>
              
            </vxe-table>
        <!-- 结束 -->

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
import XEUtils from 'xe-utils'

export default {
    name: 'buy_cai_order_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
      engineerNameList:[],
        //============
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
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
   filters: {
      //过滤器
      // formateLength(value){
      //   return value.substr(0,5)

      // },
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
      getTiao(row){
         row.operateType  ="1"//查看
         sessionStorage.setItem('CAIGOU','')
         row.ordersNo=row.orderNo
         sessionStorage.setItem('CAIGOU',JSON.stringify(row))
         const route = {
                       name: 'order_buy_info',
         }
        this.$router.push(route)
                                
                
      },
     //新增
      footerMethod({columns,data}){
        return [
          columns.map((column,columnIndex)=>{
            if(columnIndex === 0){
              return '当页合计'
            }
            if(['jianshu','guapaijia','cusMoney','jiesuanDanjia','jiesuanMoney','invoiceMoney'].includes(column.property)){
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)

            }

          })
        ]
      },


      // 结束
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
          if(item){
            this.shopOrgName = item.label;
            this.shopOrgId = item.value;
          }else{
            this.shopOrgName = '';
        this.shopOrgId = '';
          }
        
       },
      changeCreateTieme(data){
        if(data){
          this.formItem.beginTime  =data[0] +' 00:00:00';
          this.formItem.endTime  =data[1]+' 24:00:00';
        }else{
          this.formItem.beginTime  ='';
          this.formItem.endTime  ='';
        }
        

      },
      propsClick(){
        this.reload();
      },
      getAdmin(item){
        if(item){
        this.adminSearchId = item.value;

        }else{
        this.adminSearchId = '';

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
            let alist =  res.data.list
            this.totalM=res.data.total; 
            this.data1=alist;
            this.getOrderInfoTotal(param)
            //计算合同 结算总金额
            this.data1.map((item)=>{
                item.weight=Number(item.weight)
                item.zongzhongliang=Number(item.zongzhongliang)
                item.jiesuanWeight=Number(item.jiesuanWeight)
            })
            console.log('我是查询数据')
            console.log(res.data)
          }  
         })
          
       },
       //
       getOrderInfoTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findOrdersInfoAllSum(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data.list[0];
            
            this.TWeight        = dic.zongzhongliang
            this.TMoney         = dic.cusMoney
            this.TjiesuanWeight = dic.jiesuanWeight
            this.TjiesuanMoney  = dic.jiesuanMoney
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
     this.getGongcheng();
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
 <style lang="less" >
   #moppp .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0px!important;
      }
    #moppp .vxe-table .vxe-body--column{
        line-height:20px!important;
      }
   #moppp .vxe-table .vxe-cell {
      padding: 0 2px;
      }
     #moppp .vxe-toolbar{
      padding: 0 0; 

     }
</style>
