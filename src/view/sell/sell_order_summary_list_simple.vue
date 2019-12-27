<!--
 * @Description: 销售单汇总
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
           <FormItem label="客户查询:">
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
               <el-select size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                  </el-option>
              </el-select>
          </FormItem>
           <FormItem label="订单状态:" style="margin-right:10px;">
            <Select  v-model='formItem.orderStatus' style="width:140px" placeholder="请选择订单状态" >
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
             <Tooltip content="结算差额 = 合同金额 - 实提金额" placement="top-start">
              <Button shape="circle" icon="md-help" ></Button>
             </Tooltip>
          </Col>
          <Col span="24">
              <time>合同总重量：</time>
              <time >{{this.$global.accPrecision(tItem.contractWeight,3)}}</time>吨
              <time style="margin-left:20px">合同总金额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.contractMoney)}}</time>元

              <time style="margin-left:20px">结算总重量：</time>
              <time>{{this.$global.accPrecision(tItem.actualWeight,3)}}</time>吨

               <time style="margin-left:20px">结算总金额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.actualMoney)}}</time>元
          </Col>
        </Row>
        <Table height="400" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table>

        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {
findShop,
findOrgCusAcc,
getUserList,findOrderEngineering
} from '@/api/data'
import {findOrdersAll,findOrdersAllSum89} from '@/api/data_8889'
import {getReceiptStatusLabel,getInvoiceStatusLabel,getBuyOrderStatus,getSellOrderIsInvoiceStatus} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,orderStatusList,belongCompanyList} from '@/libs/global_type'


export default {
    name: 'sell_order_summary_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        belongCompanyListThis:belongCompanyList,
        shopList:[],
        engineerNameList:[],//工程名称数组
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
        tItem:{
          contractWeight : 0,
          contractMoney :0,
          actualWeight:0,
          actualMoney:0
        },
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
                        fixed:'left',
                        width:'25',
                    },
                      {
                        title: '工程名称',
                        key: 'gongcheng',
                        align: 'center',
                        fixed:'left',
                        width:'180',
                         render:(h,params)=>{
                          let aArray = [];
                          let a= ""
                          if(params.row.gongcheng){
                            if(params.row.gongcheng.indexOf('-') != -1){
                              aArray = params.row.gongcheng.split("-")
                            }else{
                              aArray.push(params.row.gongcheng)
                            }
                          }else{
                              aArray.push(params.row.gongcheng)
                          }
                          if(aArray.length>=2){
                            a = aArray[1];
                          }else{
                            a = aArray[0];
                          }
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },a)
                        }
                    },
                    {
                        title: '下单时间',
                        key: 'createTime',
                        fixed:'left',
                        align: 'center',
                        width:'80',
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
                        title: '结算吨位',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        fixed:'left',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                        }
                    },
                    {
                        title: '结算金额',
                        key: 'deliveryTotalMoneyCus',
                        fixed:'left',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.deliveryTotalMoneyCus))
                        }
                    },
                      {
                        title: '已收金额(元)',
                        key: 'receivedMoney',
                        fixed:'left',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.receivedMoney))
                        }
                    },
                    {
                        title: '剩余应收金额(元)',
                        key: '',
                        align: 'center',
                        fixed:'left',
                        width:'100',
                        render:(h,params) =>{
                          //订单未实提之前 用合同金额 - 收款金额
                          //订单实提之后 用实提金额 - 收款金额
                          let b = params.row.moneyAll;
                          if(Number(params.row.status)>=8 && Number(params.row.status)<=90){//已经实提
                                b= params.row.deliveryTotalMoneyCus
                          }
                          let a = this.$global.accMinus(b,params.row.receivedMoney)
                          return h('div',{
                          },this.$global.isMoneyShow(a))
                        }
                    },
                      {
                        title: '开票状态',
                        key: '',
                        fixed:'left',
                        align: 'center',
                        width:'90',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },getSellOrderIsInvoiceStatus(params.row.status))
                        }
                    },
                    {
                        title: '分割线',
                        key: '',
                        align: 'center',
                        width:'90',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },'|')
                        }
                    },
                    {
                        title: '销售单号',
                        key: 'ordersNo',
                        align: 'center',
                        width:'180',
                        render:(h,params) =>{
                          return h('a',{
                            on:{
                                click: () => {
                                           params.row.operateType  ="1"//查看
                                           sessionStorage.setItem('XiaoShou','')
                                            sessionStorage.setItem('XiaoShou',JSON.stringify(params.row))
                                               const route = {
                                                  name: 'sell_order_info',
                                                 // query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                            }
                          },params.row.ordersNo);
                        }
                    },
                   
                    {
                        title: '客户名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'100',
                       
                    },
                     {
                        title: '公司抬头',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'100',
                         render:(h,params) =>{
                          let a = params.row.shopOrgName;
                          if(params.row.shopOrgName){
                            a = params.row.shopOrgName.substr(0,5)
                          }
                          return h('div',{

                          },a)
                        }
                    },
                    {
                        title: '销售合同吨位',
                        key: 'zhongliangAll',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.zhongliangAll,3))
                        }
                    },
                    {
                        title: '销售合同金额',
                        key: 'moneyAll',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.moneyAll))
                        }
                    },
                   
                     {
                        title: '结算差额',
                        key: 'chaMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          let a = 0;
                          if(params.row.id == "当页合计"){
                            a = params.row.chaMoney;
                          }else{
                          a = this.$global.accMinus(params.row.receivedMoney,params.row.deliveryTotalMoneyCus)

                          }
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(a))
                        }
                    },
                      {
                        title: '管理员',
                        key: 'userName',
                        align: 'center',
                        width:'50'
                    },
                    {
                        title: '抵扣金额',
                        key: 'dikouSmoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.dikouSmoney))
                        }
                    },
                    {
                        title: '打款金额',
                        key: 'tixianSMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.tixianSMoney))
                        }
                    },
                    {
                        title: '打款金额1',
                        key: 'skSmoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.skSmoney))
                        }
                    },
                    {
                        title: '已收金额',
                        key: 'receivedMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.isMoneyShow(params.row.receivedMoney))
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width:'50',
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
                        title: '工程全称',
                        key: 'gongcheng',
                        align: 'center',
                        width:'240',
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

        this.$refs.selection.exportCsv({
          filename:"导出excel"
        })
      },
      getShop(){
        let param = {};
        param.pageNum ="1";
        param.orgRoleType = "1";
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
        //选择公司名称后再次获取 公司对应的工程名称
        this.engineerNameList = [];
        this.getGongcheng(item.label);
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
         param.cusMerName   = this.shopOrgName              //客户名称
         param.beginTime   = this.formItem.beginTime     //创建时间 
         param.endTime     = this.formItem.endTime       //供应商
         param.pageSize    = this.formItem.length;
         param.ordersNoLike     = this.formItem.orderNo //订单号
         param.engineering   = this.formItem.engineering;//工程名称
          //根据订单状态查询
             if(this.formItem.orderStatus == "1"){
               param.beginStatus = 1 ;
              param.endStatus   = 1 ;
             }else if(this.formItem.orderStatus == "2"){
               param.beginStatus = 2 ;
                param.endStatus   = 7 ;
             }else {
               param.beginStatus = this.formItem.orderStatus ;
                param.endStatus   = this.formItem.orderStatus ;
             }
             param.bankJgId = this.formItem.bankJgId;
           findOrdersAll(param).then(res=>{
            if(res.code =="100"){

            let alist =  this.getTotalThisPage(res.data.list);
            this.totalM=res.data.total; 
            this.data1=alist;

            this.getOrderInfoTotal(param);
            console.log(this.$global.deleteArrNull(res.data.list));//总条数 
          }  
         })
          
       },
       getOrderInfoTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findOrdersAllSum89(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data.list[0];
              dic.id = '全部合计'
              this.tItem.contractWeight = dic.zhongliangAll;
              this.tItem.contractMoney = dic.moneyAll;
              this.tItem.actualWeight = dic.deliveryTotalWeight;
              this.tItem.actualMoney = dic.deliveryTotalMoneyCus;

            this.data1.push(dic);
          }  
         })
       },
       getTotalThisPage(list){//获取当页合计，插入到数据中
          let sList = list;
          let dic = {};
          dic.id =  '当页合计'
          dic.zhongliangAll        = 0
          dic.moneyAll = 0;
          dic.deliveryTotalWeight       = 0;
          dic.deliveryTotalMoneyCus  = 0;
          dic.chaMoney = 0;
          for(var i = 0; i< sList.length;i++){
            let item               = sList[i];
                let a = this.$global.accMinus(item.receivedMoney,item.deliveryTotalMoneyCus)
                dic.zhongliangAll        = this.$global.accAdd(item.zhongliangAll,dic.zhongliangAll)
                dic.moneyAll = this.$global.accAdd(item.moneyAll,dic.moneyAll)
                dic.cusMoney       = this.$global.accAdd(item.cusMoney,dic.cusMoney)
                dic.deliveryTotalWeight  = this.$global.accAdd(item.deliveryTotalWeight,dic.deliveryTotalWeight)
                dic.deliveryTotalMoneyCus   = this.$global.accAdd(item.deliveryTotalMoneyCus,dic.deliveryTotalMoneyCus)
                dic.chaMoney  =a
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
     this.getGongcheng();//获取工程数组
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
</style>
