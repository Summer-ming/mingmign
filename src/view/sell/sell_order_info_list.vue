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
          <Input style="width:200px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
           <FormItem label="客户查询:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
            <FormItem label='收货时间'>
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
            <el-select size="small" style="width:200px" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                  </el-option>
              </el-select>
          <!-- <Input style="width:200px"  placeholder="请输入工程名称" v-model="formItem.engineering"></Input> -->
          </FormItem>
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
            <Button type="primary"  icon="ios-download-outline" @click="exportData()" style='margin-right:10px'>导出excel</Button>
             <Button type="primary"  icon="ios-download-outline" @click="exportData1()">导出对账单</Button>
              <!-- 合计 -->
              <br>
              <div style="float:left;">
                <span >合同重量<span   style="color:#4b98dc;">{{this.$global.accPrecision(TWeight,3)}}</span> 吨&nbsp;&nbsp; </span>
                <span >合同金额<span  style="color:#4b98dc;">{{this.$global.isMoneyShow(TMoney)}}</span> 元&nbsp;&nbsp;</span>
                <br>
                <span style="">结算总重量<span   style="color:red;">{{this.$global.accPrecision(TjiesuanWeight,3)}}</span> 吨&nbsp;&nbsp;</span>
                <span style="">结算总金额<span   style="color:red;">{{this.$global.isMoneyShow(TjiesuanMoney)}}</span> 元&nbsp;&nbsp;</span>
                 <br>
                  <span style="">开票总重量<span   style="color:red;">{{this.$global.accPrecision(TInvoiceWeight,3)}}</span> 吨&nbsp;&nbsp;</span>
                  <span style="margin-left:10px">开票总金额<span   style="color:red;">{{this.$global.isMoneyShow(TInvoiceMoney)}}</span> 元&nbsp;&nbsp;</span>
                  <br/>
                   <span style="">利息总额<span   style="color:red;">{{this.$global.isMoneyShow(Tlixi)}}</span> 元&nbsp;&nbsp;</span>
                  <span style="margin-left:10px">货物总金额<span   style="color:red;">{{this.$global.isMoneyShow(Tzong)}}</span> 元&nbsp;&nbsp;</span>
              </div>
          </Col>
        </Row>
        <!-- 新的vxe table -->
          <vxe-toolbar  style='padding:0;'
          setting
          :refresh="{query:data1 }"></vxe-toolbar>
        <vxe-table style="margin-top:10px" height="450" show-footer 
          border  resizable  size="mini" ref="vxeSelection" :data.sync="data1"  >
        <vxe-table-column show-overflow  width="60" field="id" title="ID" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="createTime" title="收货时间" >
          <template v-slot="{row}">
                              <span v-if="row.createTime" style="color:red">{{row.createTime.substr(0,10)}}</span>
                   </template>
        </vxe-table-column>
        <vxe-table-column show-overflow width="200" field="orderNo" title="销售单号" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="shopOrgName" title="公司名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="customerOrgName" title="客户" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="gongcheng" title="工程名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="createCname" title="管理员" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="steelName" title="品名" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="steelGuige" title="规格" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="steelPaihao" title="材质" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="steelPinpai" title="钢厂" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="steelWorks" title="提货方式" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="jiaohuodi" title="交货地" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="jizhongType" title="计重方式" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="jianshu" title="件数" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" :formatter="this.$global.vxeTableWeight" field="weight" title="单件重" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" align='right' :formatter="this.$global.vxeTableWeight" field="zongzhongliang" title="总重量" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" align='right' :formatter="this.$global.vxeTableMoney" field="guapaijia" title="单价" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" align='right' :formatter="this.$global.vxeTableMoney" field="cusMoney" title="总金额" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="kunbaohao" title="捆包号" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" :formatter="this.$global.vxeTableMoney" field="internetMoney" title="网价" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" :formatter="this.$global.vxeTableMoney" field="floatMoney" title="浮动价格" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="region" title="网价区域" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="internetMoneyNote" title="网价备注" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" align='right' :formatter="this.$global.vxeTableMoney" field="jiesuanDanjia" title="结算单价" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" align='right' :formatter="this.$global.vxeTableWeight" field="jiesuanWeight" title="结算重量" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" align='right' :formatter="this.$global.vxeTableMoney" field="jiesuanMoney" title="结算金额" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="receiptStatus" :formatter="this.$global.vexShouH" title="是否收货" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" :formatter="this.$global.vxeTableWeight" field="invoiceWeight" title="开票重量" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" :formatter="this.$global.vxeTableMoney" field="invoiceMoney" title="开票金额" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="invoiceNo" title="开票号码" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" :formatter="this.$global.vexShouP" field="invoiceStatus" title="是否收票" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" field="status" title="状态" ></vxe-table-column>
        <!-- <vxe-table-column show-overflow width="100" :formatter="this.$global.vxeTableMoney" field="buyRealDanjia" title="采购单价" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" :formatter="this.$global.vxeTableWeight" field="buyRealWeight" title="采购结算重量" ></vxe-table-column>
        <vxe-table-column show-overflow width="100" :formatter="this.$global.vxeTableMoney" field="buyRealMoney" title="采购结算金额" ></vxe-table-column> -->
        
        <vxe-table-column prop="infoType"  width="80" label="明细类型"  :formatter="this.$global.vexLiXi" ></vxe-table-column> 
        <vxe-table-column show-overflow prop="realUnitPrice" label="实提单价"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
        <vxe-table-column show-overflow prop="realMoney" label="实提金额"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
        <vxe-table-column show-overflow prop="interestUnitPrice" label="利息单价"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
        <vxe-table-column show-overflow prop="sointerestMoney" label="利息金额"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
        <vxe-table-column show-overflow prop="note" label="备注" width="80"></vxe-table-column>
        </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findOrdersInfoAll,
findOrdersInfoAllSum} from '@/api/data_8889'
import {findOrgCusAcc,getUserList,findOrdersInfoAllSum89Zong,findOrderEngineering} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel,getBuyOrderStatus} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,orderStatusList,belongCompanyList} from '@/libs/global_type'
import excel from '@/libs/excel'
export default {
    name: 'sell_order_info_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        TInvoiceMoney:0,//开票金额
        TInvoiceWeight:0,//开票重量
        engineerNameList:[],//工程名称数组
        belongCompanyListThis:belongCompanyList,
        TWeight:0,
        TMoney:0,
        Tlixi:0,
        Tzong:0,
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
                     {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'60',
                        fixed:'left'
                    },
                    {
                        title: '下单时间',
                        key: 'createTime',
                        align: 'center',
                        width:'80',
                        fixed:'left',
                        render:(h,params) =>{
                          let a = params.row.createTime;
                          if(params.row.createTime){
                            a = params.row.createTime.substr(0,10)
                          }
                          return h('div',{

                          },a)
                        }
                    },
                    {
                        title: '销售单号',
                        key: 'orderNo',
                        align: 'center',
                        width:'160',
                        fixed:'left'

                    },
                    {
                        title: '公司名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'80',
                        fixed:'left',
                        render:(h,params)=>{
                            let a = params.row.shopOrgName
                            if(params.row.shopOrgName){
                              a = a.substr(0,5)
                            }
                          return h('div',{
                          },a)
                        }

                    },
                    {
                        title: '客户',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'200',
                        fixed:'left'

                    },
                    {
                        title: '工程名称',
                        key: 'gongcheng',
                        align: 'center',
                        width:'250'
                    },
                    {
                        title: '管理员',
                        key: 'createCname',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },params.row.steelName.indexOf('合计')!=-1?'':params.row.steelName)
                        }
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'150',
                    },
                    {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '提货方式',
                        key: 'steelWorks',
                        align: 'center',
                        width:'100',
                    },
                     {
                        title: '交货地',
                        key: 'jiaohuodi',
                        align: 'center',
                        width:'100',
                    },
                     {
                        title: '计重方式',
                        key: 'jizhongType',
                        align: 'center',
                        width:'50',
                    },
                    {
                        title: '件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '单件重',
                        key: 'weight',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.weight,3))
                        }
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
                        width:'200',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.guapaijia))
                        }
                    },
                     {
                        title: '总金额',
                        key: 'cusMoney',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.cusMoney))
                        }
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',
                    },
                     {
                        title: '网价',
                        key: 'internetMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            
                          },this.$global.accPrecision(params.row.internetMoney,2))
                        }
                    },
                     {
                        title: '浮动价格',
                        key: 'floatMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            
                          },this.$global.accPrecision(params.row.floatMoney,2))
                        }
                    },
                    {
                        title: '网价区域',
                        key: 'region',
                        align: 'center',
                        width:'100',
                    },
                     {
                        title: '网价备注',
                        key: 'internetMoneyNote',
                        align: 'center',
                        width:'100',
                    },

                      {
                        title: '结算单价',
                        key: 'jiesuanDanjia',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.jiesuanDanjia,2))
                        }
                    },
                    {
                        title: '结算重量',
                        key: 'jiesuanWeight',
                        align: 'center',
                        width:'100',
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
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.jiesuanMoney))
                        }
                    },
                     {
                        title: '是否收货',
                        key: 'receiptStatus',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },getReceiptStatusLabel(params.row.receiptStatus))
                        }
                    },
                      {
                        title: '开票重量',
                        key: 'invoiceWeight',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.invoiceWeight,3))
                        }
                    },
                     {
                        title: '开票金额',
                        key: 'invoiceMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.invoiceMoney,2))
                        }
                    },
                    {
                        title: '开票号码',
                        key: 'invoiceNo',
                        align: 'center',
                        width:'200',
                    },
                    {
                        title: '是否收票',
                        key: 'invoiceStatus',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },getInvoiceStatusLabel(params.row.invoiceStatus))
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },getBuyOrderStatus(params.row.status))
                        }
                    },
                    {
                        title: '采购单价',
                        key: 'buyRealDanjia',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.buyRealDanjia,2))
                        }
                    },
                    {
                        title: '采购结算重量',
                        key: 'buyRealWeight',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.buyRealWeight,3))
                        }
                    },
                      {
                        title: '采购结算金额',
                        key: 'buyRealMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.buyRealMoney))
                        }
                    },
                    
                ],
                data1: [],//表格展示的数据
    
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
        //查询工程
      getGongcheng(buyOrgName){
        let p  ={};
        p.pageSize ="99999"
        p.cusOrgName = buyOrgName;
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

        this.$refs.vxeSelection.exportCsv({
          filename:"导出excel"
        })
      },
       exportData1(){//导出对账单
       const alist = this.$global.copyDeep(this.data1);
      
       alist.map((item,index)=>{
              item.jiesuanWeight = Number(this.$global.accPrecision(item.jiesuanWeight,3));
              item.internetMoney = Number(this.$global.accPrecision(item.internetMoney,2));
              item.floatMoney    = Number(this.$global.accPrecision(item.floatMoney,2));
              item.jiesuanDanjia = Number(this.$global.accPrecision(item.jiesuanDanjia,2));
              item.jiesuanMoney  = Number(this.$global.accPrecision(item.jiesuanMoney,2));
              item.createTime    = item.createTime.substr(0,10)
              if(item.id == "当页合计"){
                item.steelName = "合计"
                item.internetMoney = '';
                item.floatMoney = '';

              }else if(item.id == "全部合计"){
                alist.splice(index,1)
              }
       })
       const params = {
          title: [
            '品名', 
            '规格', 
            '牌号',
            '签收数量',
            '产地',
            '网价',
            '加价',
            '销售单价',
            '销售总价',
            '到货日期',
            ],
          key: [
            'steelName', 
            'steelGuige', 
            'steelPaihao', 
            'jiesuanWeight', 
            'jiaohuodi',
             'internetMoney', 
             'floatMoney', 
             'jiesuanDanjia',
             'jiesuanMoney',
             'createTime'
             ],
          data: alist,
          autoWidth: true,
          filename: alist[0].gongcheng+'---'+alist[0].createTime,
        }
        excel.export_array_to_excel(params)
         
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
               dic.steelName = '全部合计'
            this.data1.push(dic);
             this.TWeight        = dic.zongzhongliang
             this.TMoney         = dic.cusMoney
             this.TjiesuanWeight = dic.jiesuanWeight
             this.TjiesuanMoney  = dic.jiesuanMoney
             this.TInvoiceWeight = dic.invoiceWeight;
             this.TInvoiceMoney  = dic.invoiceMoney;
             this.Tzong          = dic.realMoney
             this.Tlixi          = dic.interestMoney
          }  
         })
       },
       getTotalThisPage(list){//获取当页合计，插入到数据中
          let sList = list;
          let dic = {};
          dic.id =  '当页合计'
           dic.steelName = '当页合计'
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
 .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
       .ivu-table-small td {
        height:27px!important;
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

