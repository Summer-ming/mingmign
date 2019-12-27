<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id="padidng_m">
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
          <FormItem label="订单号:" style="margin-right:10px;">
          <Input style="width:200px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
           <FormItem label="供应商查询:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
      
            </Select>
          </FormItem>
          <FormItem label='付款时间'>
              <DatePicker @on-change="changeUpdateTieme" format="yyyy-MM-dd" v-model="formItem.dateUpdateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>
            
            <FormItem label='申请时间'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>
            <FormItem label="状态:">
            <Select v-model="formItem.status"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getStatus'  :label-in-value='true'>
               <Option v-for="(item,index) in formItem.statusList " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
          <FormItem label="订单类型:" style="margin-right:10px;">
            <Select  v-model='orderType' style="width:140px" placeholder="请选择订单类型" >
              <Option  v-for='(item,index) in zhidanOrderType' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="24">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button style="margin-left:5px" shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
            <Button style="margin-left:5px" type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>
          </Col>
        </Row>
        <!-- 新的vxe table -->
        <vxe-table style="margin-top:10px" height="550" show-footer :footer-method="footerMethod"
          border  resizable  size="mini" ref="vxeSelection" :data.sync="data1"  >
        <vxe-table-column show-overflow  width="60" field="jgJieSuanId" title="ID" ></vxe-table-column>
        <vxe-table-column show-overflow width="60" field="key1" title="状态" ></vxe-table-column>
        <vxe-table-column show-overflow width="140" field="merchantsName" title="供应商名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="160"  field="customerOrgName" title="订单采购方名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="160"  field="skOrgName" title="收款公司名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="160" field="orderNo" title="订单号" >
                    <template v-slot="{row}">
                        <a    @click='pushOrderInfo(row)' type="primary">{{row.orderNo}}</a>
                    </template>
        </vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="actualApyMoney" title="付款金额(元)" ></vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="dikouMoney" title="申请抵扣金额 (元)" ></vxe-table-column>

        <vxe-table-column  show-overflow  width="60" field="businessNote" title="备注" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="160" field="payTime" title="付款时间" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="160" field="jgJieSuanCreateTime" title="申请时间" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="60" field="userName" title="管理员" ></vxe-table-column>
        <vxe-table-column  show-overflow :formatter="tableItemTypeStr"  width="100" field="jgJieSuanOperatorType" title="类型" ></vxe-table-column>
        <vxe-table-column field=""  title="操作" width="100" >
                    <template v-slot="{row}">
                      <Button v-if="row.jgJieSuanOperatorType =='5'" size="small" type="primary" @click="showOMInfo(row)">查看杂费信息</Button>
                    </template>
                </vxe-table-column>
        </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findJgJieSuanInfo,
findJgJieSuanInfoSellOrders,
findShop,
findOrgCusAcc,
getUserList,
findZhidanApplySum} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,jiesuanStatusList} from '@/libs/global_type'
import {getJiesuanStatus,zhidanTypeLis} from '@/libs/allStatus'
import XEUtils from 'xe-utils'

export default {
    name: 'payList',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        tableTotalDic:{},
         zhidanOrderType:[
          {
                value: '1',
                label: '采购单'
            },
            {
                value: '2',
                label: '销售单'
            },
        ],
        orderType:'1',
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
          length:20,
          orderNo:'',
          status:'',
          statusList:jiesuanStatusList,
          dateUpdateTime:'',
          beginUpdateTime:'',//起始付款时间
          endUpdateTime:''//截止付款时间
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
                    return '当页合计'
                  }
                    if(['actualApyMoney','dikouMoney'].includes(column.property)){//
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)
                  }    
                  return '-'
                }),
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '全部合计'
                  }
                    if(['actualApyMoney'].includes(column.property)){//
                    console.log("全部合计中"+this.tableTotalDic.actualApyMoney);
                    return this.$global.isMoneyShow(this.tableTotalDic.actualApyMoney);
                  } 
                   if(['dikouMoney'].includes(column.property)){//
                    return this.$global.isMoneyShow(this.tableTotalDic.dikouMoney);
                  }    
                  return '-'
                })
              ]
       },
      showOMInfo(row){
        this.gotoPomList(row);
      },
      tableItemTypeStr({cellValue, row, column}){
        return zhidanTypeLis(cellValue);
      },
      subStrOrgName({cellValue, row, column}){//采购方名称截取前5位
        if(cellValue){
          return cellValue.substr(0,5)
        }else{
          return cellValue;
        }
      },
      pushOrderInfo(row){
        row.operateType  ="1"//查看
         sessionStorage.setItem('CAIGOU','')
         row.ordersNo=row.orderNo
         sessionStorage.setItem('CAIGOU',JSON.stringify(row))
             const route = {
                name: 'order_buy_info',
              }
              this.$router.push(route)
      },
      gotoPomList(row){
         sessionStorage.setItem('SELL_OM_ZHIDAN_ITEM','')
        sessionStorage.setItem('SELL_OM_ZHIDAN_ITEM',JSON.stringify(row))
            const route = {
                name: 'pay_oMoney_list',
              }
              this.$router.push(route)
      },
      exportData(){//导出到excel

        this.$refs.vxeSelection.exportCsv({
          filename:"付款明细表"
        })
      },
      getStatus(item){
        console.log(this.formItem.status)
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
        console.log(item)
        this.shopOrgName = item.label;
        this.shopOrgId = item.value;
       },
      changeCreateTieme(data){
        console.log(data);
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';

      },
       changeUpdateTieme(data){
        console.log(data);
        this.formItem.beginUpdateTime  =data[0] +' 00:00:00';
        this.formItem.endUpdateTime  =data[1]+' 24:00:00';

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
         let param                       = {};
             param.pageNum               = this.pagesizea                  //分页
             param.merchantsId           = this.shopOrgId                  //供应商
             param.beginTime             = this.formItem.beginTime         //创建时间 
             param.endTime               = this.formItem.endTime           //供应商
             param.jgJieSuanCaoZuoStatus = this.formItem.status
             param.pageSize              = this.formItem.length;
             param.orderNo               = this.formItem.orderNo
             param.orderType             = this.orderType;
             param.beginPayTime          = this.formItem.beginUpdateTime;
             param.endPayTime            = this.formItem.endUpdateTime;

          console.log(param);
          if(this.orderType=="1")
          {//采购单
                  findJgJieSuanInfo(param).then(res=>{
                      if(res.code =="100"){
                      this.totalM=res.data.total; 
                      this.data1=res.data.list;
                        this.getOrderInfoTotal(param);//查询全部数据
                      this.data1.map(item=>{
                        //状态
                          item.key1 =  getJiesuanStatus(item.jgJieSuanCaoZuoStatus) 
                      })
                    }  
                  })
          }
          else
          {//销售单
                findJgJieSuanInfoSellOrders(param).then(res=>{
                      if(res.code =="100"){
                      this.totalM=res.data.total; 
                      this.data1=res.data.list;
                      this.getOrderInfoTotal(param);
                      this.data1.map(item=>{
                        //状态
                          item.key1 =  getJiesuanStatus(item.jgJieSuanCaoZuoStatus) 
                      })
                    }  
                  })
          }
          
          
       },
       getOrderInfoTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findZhidanApplySum(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data[0];
              this.tableTotalDic = res.data[0];
                this.$refs.vxeSelection.updateFooter();//手动更新表尾部信息
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
