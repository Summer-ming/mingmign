<!--
 * @Description: 销售利润表
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
          <Input  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
           <FormItem label="供应商查询:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
            <FormItem label='下单时间'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 220px">
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
          </Col>
        
          <Col span="3">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
        </Row>
        <Table border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            <!-- <div slot="footer" style="height:100px">
              <td style="width:660px">合计</td>
              <td style="width:100px;text-align: center;">11</td>
              <td style="width:100px">-</td>
              <td style="width:100px;text-align: center;">2222</td>
            </div> -->
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {
findShop,
findOrgCusAcc,
getUserList} from '@/api/data'
import  {findOrdersInfoAll5} from '@/api/data_8889'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList} from '@/libs/global_type'

export default {
    name: 'sell_order_info_profit_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        shopList:[],
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
          length:'',
          orderNo:''
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
                        width:'100'
                    },
                    {
                        title: '销售单号',
                        key: 'orderNo',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '下单时间',
                        key: 'createTime',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '供应商名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'200'
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
                        title: '销售合同重量',
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
                        title: '销售单价',
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
                          },this.$global.accPrecision(params.row.guapaijia,2))
                        }
                    },
                    {
                        title: '采购单价',
                        key: 'buyOrderInfoGuapaijia',
                        align: 'center',
                        width:'200',
                        className:"table-info-column",
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.buyOrderInfoGuapaijia,2))
                        }
                    },
                    {
                        title: '采购单号',
                        key: 'buyOrderInfoOrderNo',
                        align: 'center',
                        width:'200',
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
                          },this.$global.accPrecision(params.row.cusMoney,2))
                        }
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',
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
                          },this.$global.accPrecision(params.row.jiesuanMoney,2))
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
                          },this.$global.accPrecision(params.row.weight,2))
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
                    
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
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
        console.log(item)
        this.shopOrgName = item.label;
        this.shopOrgId = item.value;
       },
      changeCreateTieme(data){
        console.log(data);
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';

      },
      propsClick(){
        console.log("回调成功");
        this.reload();
      },
      getAdmin(item){
        console.log(item);
        this.adminSearchId = item.value;
      },
        reloadSelf(){
            this.reload();
        },
       //分页
       changePage(index){
           console.log(index)
           this.pagesizea=index;
           this.searchM();
       },
       selectOne(row){
         console.log(row)
       },
       //查询表格
       searchM(){

         //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum     = this.pagesizea           //分页
         param.beginStatus = 1 ;
         param.endStatus   = 11 ;
         param.userId      = this.adminSearchId       //管理员查询
         param.shopOrgId   = this.shopOrgId           //供应商
         param.beginTime   = this.formItem.beginTime  //创建时间 
         param.endTime     = this.formItem.endTime    //供应商
         param.pageSize    = this.formItem.length;
         param.orderNo     = this.formItem.orderNo;
          console.log(param);
           findOrdersInfoAll5(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
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
     var that = this;
     Utils.$on('demo',function(msg){
       console.log(msg);
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
.ivu-table td.table-info-column{
  color:#fff;
  background-color: #2db7f5
}
</style>

