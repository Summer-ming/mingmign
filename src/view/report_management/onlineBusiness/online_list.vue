<!--
 * @Description: 采购单工程汇总
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='kp'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
              <FormItem label="订单号:" style="margin-right:10px;">
                  <Input style="width:200px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
              </FormItem>
              <FormItem label="客户公司名称:">
                <Select   style="width:200px" v-model="formItem.keHu" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
                  <Option v-for="(item,index) in orgList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="供应商公司名称:">
                <Select   style="width:200px"  v-model="formItem.gongying" filterable placeholder="请选择名称"  @on-change='getDianShop'  :label-in-value='true'>
                  <Option v-for="(item,index) in orgList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
                </Select>
              </FormItem>
              <FormItem label='发生时间'>
                  <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange"  placement="bottom-end" placeholder="选择日期" style="width: 200px">
                  </DatePicker>
                </FormItem>
                <FormItem label="每页显示:">
                    <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
                      <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="类型:">
                    <Select v-model="formItem.type"  style="width:200px"  placeholder="请选择"   >
                      <Option v-for="(item,index) in onlineBusinessListTypeThis " :value="item.value"  :key="index" >{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="角色类型:">
                    <Select v-model="formItem.ttype"  style="width:200px"  placeholder="请选择"   >
                      <Option v-for="(item,index) in transactionTypeListThis" :value="item.value" :key="index" >{{ item.label }}</Option>
                    </Select>
                </FormItem>
          </Col>
        
          <Col span="24">
             <Button  type='primary' size="small" icon="ios-search" @click='searchM()'>查询</Button>
             <Button style="margin-left:10px" size="small" shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
             <Button style="margin-left:10px" size="small" type="primary" icon="md-download" @click="downcsv"></Button>
          </Col>
        </Row>
          <!-- vxetable -->
          <vxe-table
              border
              ref="selection"
              size="mini"
              height="500"
              show-footer
              resizable
              :footer-method="vtableFootMethod"
              :data.sync="data1">
              <!-- //第一部分采购单相关信息 -->
              <vxe-table-column field="id"   title="ID"  min-width='40'></vxe-table-column>
             
              <vxe-table-column field="sellerCompanyName" show-overflow   title="销售公司名称"  min-width='100'>
                         <template v-slot="{row,rowIndex}">
                            <span style='color:blue;' @click='getT()'> {{row.sellerCompanyName}}</span>
                         </template>

              </vxe-table-column>
              <vxe-table-column field="createTime" show-overflow  title="时间"  min-width='120'></vxe-table-column>
              <vxe-table-column field="billType"  show-overflow title="类型"  min-width='60'></vxe-table-column>
              <vxe-table-column field="note"  show-overflow  title="类型备注"  min-width='90'></vxe-table-column>
              <vxe-table-column  field="fsMoney" show-overflow  title="发生金额"  :formatter="this.$global.vxeTableMoney" min-width='80'></vxe-table-column>
              <vxe-table-column field="ysMoney" show-overflow  title="应收货款/待发货" :formatter="this.$global.vxeTableMoney"  min-width='130'></vxe-table-column>
              <vxe-table-column field="dkpMoney" show-overflow   title="应收票额/代开票额" :formatter="this.$global.vxeTableMoney"  min-width='130'></vxe-table-column>
              <vxe-table-column field="sellerEmpDept" show-overflow  title="销售所属部门"  min-width='100'></vxe-table-column>
              <vxe-table-column field="sellerEmpName" show-overflow  title="销售管理员"  min-width='100'></vxe-table-column>
              <vxe-table-column field="buyerEmpDept" show-overflow  title="采购所属部门"  min-width='120'></vxe-table-column>
              <vxe-table-column field="buyerCompanyName" show-overflow   title="采购公司名称"  min-width='100'></vxe-table-column>
              <vxe-table-column field="buyerEmpName" show-overflow  title="采购管理员"  min-width='120'></vxe-table-column>
              <vxe-table-column field="orderNo" show-overflow   title="订单号"  min-width='120'></vxe-table-column>
              <vxe-table-column field="status" show-overflow :formatter="isUserStatus"   title="可用状态"  min-width='60'></vxe-table-column>
              <vxe-table-column field="transactionType" show-overflow :formatter="roleType"    title="角色类型"  min-width='60'></vxe-table-column>

            </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {
  findBillFlow,
  findOrgCusAcc
} from '@/api/data'
import Utils from '@/api/middle'
import XEUtils from 'xe-utils'
import {lengthList,onlineBusinessListType,transactionTypeList} from '@/libs/global_type'

export default {
    name: 'online_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        transactionTypeListThis:transactionTypeList,
        onlineBusinessListTypeThis:onlineBusinessListType,
        lengthListThis:lengthList,
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        orgList:[],
        formItem: {
          keHu:"",
          gongying:"",
          length:10,
          orderNo:'',
          cusOrgName:'',
          cusOrgId:'',
          shopOrgName:'',
          shopOrgId:'',
          dateTime:"",
          beginTime:'',
          endTime:'',
          type:'',
          ttype:''
          },
        data1: [],//表格展示的数据
                
      }
    },
    
    methods:{
      getT(){

      },
      downcsv(){
        this.$refs.selection.exportCsv();
      },
      roleType({ cellValue, row, column }){
        switch (cellValue) {
          case "1":
            return "客户"
          case "2":
            return "供应商"
            break;
        
          default:
            return cellValue
            break;
        }
      },
      isUserStatus({ cellValue, row, column }){
        switch (cellValue) {
          case "1":
            return "可用"
          case "0":
          return "已删除"
          default:
            return cellValue
            break;
        }
      },
      vtableFootMethod({columns,data}){
        return [
          columns.map((column,columnIndex)=>{
            if(columnIndex === 0){
              return '当页合计'
            }
            if(['fsMoney','ysMoney','dkpMoney'].includes(column.property)){
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)

            }

          })
        ]
      },
       changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';
      },
      getOrgList(){
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.orgList=res.data.list
          }  
         })
       },
      getDian(item){
        this.formItem.cusOrgName = item.label;
        this.formItem.cusOrgId = item.value;
        console.log(item)
       },
       getDianShop(item){
        this.formItem.shopOrgName = item.label;
        this.formItem.shopOrgId = item.value;
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
       //查询表格
       searchM(){

         //获取查询的input的值
         let p                 = {};
             p.pageNum         = this.pagesizea            //分页
             p.orderNo         = this.formItem.orderNo;    //订单号
             p.buyerCompanyId  =sessionStorage.getItem('p')=='1'?this.formItem.keHu:this.formItem.cusOrgId;
             p.sellerCompanyId =sessionStorage.getItem('p')=='2'?this.formItem.gongying:this.formItem.shopOrgId;
             p.beginTime       = this.formItem.beginTime;
             p.endTime         = this.formItem.endTime;
             p.billType        = this.formItem.type;
             p.transactionType = this.formItem.ttype;
             p.pageSize        = this.formItem.length;

           findBillFlow(p).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM = res.data.total;
          }  
         })
          
       },
    },
    
    mounted(){
     
     this.searchM();
      this.getOrgList();
    },
    
    created(){
      if(sessionStorage.getItem('p')=='1'){
        this.formItem.keHu=JSON.parse(sessionStorage.getItem('po')).buyerCompanyId;
        this.formItem.gongying='';
      }else if(sessionStorage.getItem('p')=='2'){
        this.formItem.gongying=JSON.parse(sessionStorage.getItem('po')).sellerCompanyId;
        this.formItem.keHu='';
      }
      
    },
}

</script>
<style lang="less">
   #kp .ivu-form-item{
         margin-bottom:5px!important;
   }
</style>