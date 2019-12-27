<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-08-01 15:22:27
 * @其他: 
 -->
<template>
  <div>
      <!-- 1 -->
      <Layout >
        <div id='lay_con'>
            <!-- LEFT -->
            <div class='lay_left'>
              <span style="font-size:24px;" >{{orgName}}</span>
              <Row class='row_left'>
                  <dl>
                      <dt>余额</dt>
                      <dd>{{this.$global.isMoneyShow(balanceMoney)}}<time> 元</time></dd>
                  </dl>
                  <dl>
                      <dt>收款金额</dt>
                      <dd>{{this.$global.isMoneyShow(inMoney)}}<time> 元</time></dd>
                  </dl>
                  <dl>
                      <dt>合同金额</dt>
                      <dd>{{this.$global.isMoneyShow(outMoney)}} <time> 元</time> </dd>
                  </dl>
              </Row> 
              <!-- 累计总量 -->
              <!-- <Row class='account_price'>
                  合计:<time>{{tMoney}}</time>
                  订单剩余:<time>{{tMoneyOrder}}</time>&nbsp;&nbsp;&nbsp;
                  到账单剩余:<time>{{tMoneyDao}}</time>&nbsp;&nbsp;&nbsp;
                
              </Row> -->
              <!-- TABLE切换 -->
              <Row>
                 <Tabs value="name1">
                    <TabPane label="订单流水" name="name1">
                      <!-- 开始 -->
                      <row>
                         <Form :model="formItem" inline :label-width="100">
                          <Row>
                          
                            <FormItem label="订单号:" style="margin-right:10px;">
                            <Input style="width:200px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
                            </FormItem>
                              <FormItem label='下单时间'>
                                <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
                                </DatePicker>
                              </FormItem>
                            
                            <!-- <FormItem label="管理员查询:">
                              <Select v-model="adminSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
                                <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
                        
                              </Select>
                            </FormItem> -->
                            <FormItem label="每页显示:">
                              <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
                                <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
                        
                              </Select>
                            </FormItem>
                            <!-- <FormItem label="工程名称:" style="margin-right:10px;">
                              <el-select size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                              <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                              
                              </el-select>
                            </FormItem>
                            <FormItem label="订单状态:" style="margin-right:10px;">
                              <Select  v-model='formItem.orderStatus' style="width:140px" placeholder="请选择订单状态" >
                                <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
                              </Select>
                            </FormItem> -->

                            <FormItem label="是否显示余额为0的订单:">
                              <Select style="width:200px" v-model='formItem.changStatus' filterable placeholder="请选择名称"    :label-in-value='true'>
                                <Option v-for="(item,index) in adminListaa " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
                        
                              </Select>
                            </FormItem>
                          
                          
                        
                          </Row>
                       </Form>
                      </row>
                      <!-- 结束 -->





                      <vxe-toolbar>
                        <template v-slot:buttons>
                          <!-- <vxe-button type='primary' @click="exportCsvEvent" style='margin-left:10px;'>导出当前excel</vxe-button> -->
                          <vxe-button  type='primary' @click="getGG">查询</vxe-button>
                          <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

                        </template>
                      </vxe-toolbar>

                       <vxe-table size="mini" border
                       show-footer
                       ref="xTable1"
                       max-height="500"
                       :footer-method="footerMethod" 
                       class="vxe-table-element" :highlight-cell='false'  :data.sync="tableDataOne"  >
                         <vxe-table-column field="ordersNo"  title="订单号" width="160">
                           <template v-slot="{ row }">
                            <span style="color:blue" @click="orderBtnClick(row)" type="text">{{row.ordersNo}}</span>
                          </template>
                         </vxe-table-column>
                         <vxe-table-column field="createTime"  title="下单时间" width="160"></vxe-table-column>
                         <vxe-table-column field="chaMoney" :formatter="this.$global.vxeTableMoney"  title="余额" width="160"></vxe-table-column>
                         <vxe-table-column field="deliveryTotalMoneyCus" :formatter="this.$global.vxeTableMoney"  title="合同金额" width="160"></vxe-table-column>
                         <vxe-table-column field="receivedMoney"  :formatter="this.$global.vxeTableMoney" title="收款金额" width="160"></vxe-table-column>
                         <vxe-table-column field="status" :formatter="sellOrderStatus"  title="备注" width="160"></vxe-table-column>

                         <!-- <vxe-table-column field="chaMoney" :formatter="this.$global.vxeTableMoney"  title="结算差额" width="160"></vxe-table-column>
                         <vxe-table-column field="id"  title="ID" width="40"></vxe-table-column>
                         <vxe-table-column field="gongcheng"  title="工程名称" width="160"></vxe-table-column>
                         <vxe-table-column field="createTime"  title="下单时间" width="160"></vxe-table-column>
                         <vxe-table-column field="customerOrgName"  title="客户名称" width="160"></vxe-table-column>
                         <vxe-table-column field="shopOrgName"  title="供应商名称" width="160"></vxe-table-column>
                         <vxe-table-column field="zhongliangAll" :formatter="this.$global.vxeTableWeight"  title="销售合同吨位" width="160"></vxe-table-column>
                         <vxe-table-column field="moneyAll" :formatter="this.$global.vxeTableWeight"  title="销售合同金额" width="160"></vxe-table-column>
                         <vxe-table-column field="deliveryTotalWeight" :formatter="this.$global.vxeTableWeight"  title="实提吨位" width="160"></vxe-table-column>
                         <vxe-table-column field="deliveryTotalMoneyCus" :formatter="this.$global.vxeTableMoney"  title="实提金额" width="160"></vxe-table-column>
                         <vxe-table-column field="userName"  title="管理员" width="160"></vxe-table-column>
                         <vxe-table-column field="dikouSmoney"  :formatter="this.$global.vxeTableMoney" title="抵扣金额" width="160"></vxe-table-column>
                         <vxe-table-column field="tixianSMoney" :formatter="this.$global.vxeTableMoney"  title="提现金额" width="160"></vxe-table-column>
                         <vxe-table-column field="skSmoney" :formatter="this.$global.vxeTableMoney"  title="收款金额" width="160"></vxe-table-column>
                         <vxe-table-column field="receivedMoney"  :formatter="this.$global.vxeTableMoney" title="付款金额" width="160"></vxe-table-column>
                         <vxe-table-column field="status" :formatter="sellOrderStatus"  title="状态" width="160"></vxe-table-column>
                          -->
                        </vxe-table>

                        <!-- 分页 -->     
                    <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
                    </TabPane>
                    <!-- <TabPane label="到账单余额" name="name2">
                       <vxe-table
                        size="mini" border
                        show-footer
                       :footer-method="footerMethod2"  
                        class="vxe-table-element" :highlight-cell='false'  :data.sync="tableDataTwo"  >
                         <vxe-table-column field="daozhangdanId"  title="ID" width="40"></vxe-table-column>
                         <vxe-table-column field="creditedCompany"  title="客户名称" width="140"></vxe-table-column>
                         <vxe-table-column field="payMoney"  :formatter="this.$global.vxeTableMoney" title="到账金额 (元)" width="140"></vxe-table-column>
                         <vxe-table-column field="dealMoney"  :formatter="this.$global.vxeTableMoney" title="剩余可用到账金额 (元)" width="140"></vxe-table-column>
                         <vxe-table-column field="bankNo"  title="客户银行账号" width="140"></vxe-table-column>
                         <vxe-table-column field="bank"  title="客户开户行名" width="140"></vxe-table-column>
                         <vxe-table-column field="jgBankNo"  title="收款账号" width="140"></vxe-table-column>
                         <vxe-table-column field="type"  title="到账银行卡" width="140"></vxe-table-column>
                         <vxe-table-column field="dealTime"  title="到账时间" width="140"></vxe-table-column>
                         <vxe-table-column field="zhaiyao"  title="摘要" width="140"></vxe-table-column>
                         <vxe-table-column field="daozhangdanStatus"  title="状态" width="140"></vxe-table-column>
                         <vxe-table-column field="dealTime"  title="到账时间" width="140"></vxe-table-column>
                         
                        </vxe-table>
                    </TabPane> -->
                    <TabPane label="余额工程组合" name="name3">
                       <vxe-table
                        size="mini" border
                        show-footer
                        height="400"
                       :footer-method="footerMethod3"  
                        class="vxe-table-element" :highlight-cell='false'  :data.sync="tableDataThree"  >
                         <vxe-table-column field="orgName"  title="公司名称" width="140"></vxe-table-column>
                         <vxe-table-column field="key1"  :formatter="this.$global.vxeTableMoney" title="供应商角色余额" width="140"></vxe-table-column>
                         <vxe-table-column field="outMoney"  :formatter="this.$global.vxeTableMoney" title="已付金额(元)(入)" width="140"></vxe-table-column>
                         <vxe-table-column field="inMoney"  :formatter="this.$global.vxeTableMoney" title="应付金额(元)(出)" width="140"></vxe-table-column>
                         <vxe-table-column field="engineeringSo"  title="工程名称" width="140"></vxe-table-column>
                        </vxe-table>
                    </TabPane>
                </Tabs>
              </Row>
            <Row>        
               <!-- TABLE -->
            </Row>
            </div>
          
        </div>
      </Layout>
        <p style="visibility: hidden;">{{total}}</p>

  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import {findOrdersAll} from '@/api/data_8889'

import {accountManagement,findDaoZhangDanAll,findOrgMoneyRecordMoneySum,
findOrgCusAcc,getUserList,findOrderEngineering} from '@/api/data'
import {getBuyOrderStatus} from '@/libs/allStatus'
import {lengthList,orderStatusList} from '@/libs/global_type'
  export default {
    name: 'appLoad',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        tableDataThree:[],
          adminListaa:[
              {
                  value:1,
                  label:'是'
              },
              {
                  value:2,
                  label:'否'
              }
          ],
        //开始
        engineerNameList:[],//工程名称数组
      
        orderStatusList:orderStatusList,
        lengthListThis:lengthList,
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
          orderStatus:"",//默认订单状态
          changStatus:1
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
        // ----==
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
        // 结束
        tMoneyOrder:'0',//订单剩余
        tMoneyDao:'0',//到账单剩余
        tMoney:"0",//合计
         orgName:'',//公司名称
         balanceMoney:0,//客户角色余额
         inMoney:0,//入金额
         outMoney:0,//出金额
         tableDataOne:[],//订单组成的table
         tableDataTwo:[],//到账单余额
         dataSession:null,//获取前面存起来的数据
         dataSessionNew:null,
      }
    },
    methods:{
      reloadSelf(){
        this.reload();
      },
      // 开始
      //查询
      getGG(){
         this.searchM();
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
          getDian(item){
        this.shopOrgName = item.label;
        this.shopOrgId = item.value;
       },
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';

      },
         getAdmin(item){
        this.adminSearchId = item.value;
      },
       //分页
       changePage(index){
           this.pagesizea=index;
           this.searchM();
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
       },
      //结束
      exportCsvEvent(){//导出订单组成
          this.$refs.xTable1.exportCsv()
      },
       //footer 合计
       footerMethod ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '合'
                  }
                  if (['zhongliangAll','moneyAll'//重量3位小数点
                    ].includes(column.property)) {
                      let a = this.$global.accPrecision(XEUtils.sum(data, column.property),3);
                    return a
                  }
                  if (['chaMoney','dikouSmoney','moneyAll',
                  'tixianSMoney','skSmoney','receivedMoney','deliveryTotalMoneyCus'//金额返回2位小数点
                    ].includes(column.property)) {
                      let a = this.$global.accPrecision(XEUtils.sum(data, column.property),2);
                      console.log("a = "+a);
                      if(column.property=="chaMoney"){
                        this.tMoneyOrder = a;
                      }
                    return a
                  }
                  return '-'
                })
              ]
       },
       //footer 合计
       footerMethod2 ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '合'
                  }
                  if (['dealMoney'//金额返回2位小数点
                    ].includes(column.property)) {
                      console.log(column.property)
                      let b = this.$global.accPrecision(XEUtils.sum(data, column.property),2);
                      this.tMoneyDao =b;
                    return b
                  }
                  return '-'
                })
              ]
       },
        footerMethod3 ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '合'
                  }
                  if (['key1','outMoney','inMoney'//金额返回2位小数点
                    ].includes(column.property)) {
                      let b = this.$global.accPrecision(XEUtils.sum(data, column.property),2);
                      this.tMoneyDao =b;
                    return b
                  }
                  return '-'
                })
              ]
       },
      sellOrderStatus({cellValue, row, column}){
        return getBuyOrderStatus(row.status)
      },
      orderBtnClick(row){
       row.operateType  ="1"//查看
       sessionStorage.setItem('CAIGOU','')
       sessionStorage.setItem('CAIGOU',JSON.stringify(row))
         const route = {
                         name: 'order_buy_info',
                        }
                          this.$router.push(route)
      },
      setInfo(){//赋值
      // params.row.key1 //客户角色余额
      // 到账金额 params.row.inMoney2
      // 应收金额 params.row.outMoney2
          this.balanceMoney = this.dataSession.key1;
          this.inMoney = this.dataSession.inMoney;
          this.outMoney = this.dataSession.outMoney;
          this.orgName = this.dataSession.orgName
      },
       //查询表格
       searchM(){ //
         //获取查询的input的值
         let param             = {};
         param.cusMerName  = this.dataSession.orgName  //客户名称
         param.pageNum        = this.pagesizea              //分页
         param.userId         = this.adminSearchId          //管理员查询
         param.pageSize       = this.formItem.length;
         param.engineering    = this.formItem.engineering;  //工程名称
         param.ordersNoLike   = this.formItem.orderNo       //订单号
         param.orderShopOrgId = this.shopOrgId              //供应商
         param.beginTime      = this.formItem.beginTime     //创建时间 
         param.endTime        = this.formItem.endTime       //供应商
           param.beginStatus = "2";
             param.endStatus   = "90";
            if(this.formItem.orderStatus == "1"){
               param.beginStatus = 2 ;
              param.endStatus   = 90 ;
             }
             else if(this.formItem.orderStatus == "2"){
               param.beginStatus = 2 ;
                param.endStatus   = 90 ;
             }
             else {
               param.beginStatus = this.formItem.orderStatus ;
                param.endStatus   = this.formItem.orderStatus ;
             }
             param.bankJgId = this.dataSessionNew;
         findOrdersAll(param).then(res=>{
            if(res.code =="100"){
             
          
        
                res.data.list.map(item=>{
                  // 采购单以实体为准，用实提金额 和收款金额相减
                    item.chaMoney =  this.$global.accMinus(item.deliveryTotalMoneyCus,item.receivedMoney)

                })
               this.tableDataOne=res.data.list
               this.totalM=res.data.total; 
              }
          })  
       },
       searchDaozhangdan(){
          //获取查询的input的值
         let param             = {};
             param.allEqualcreditedCompany  = this.dataSession.orgName  //客户名称
             param.beginDaozhangdanStatus = "1";
             param.endDaozhangdanStatus   = "3";
             param.pageSize    = "999999"
             param.tranType    = "1"
             param.beginDtype    = "1"
             param.endDtype    = "1"
            //  param.jgBank    = "2"
         findDaoZhangDanAll(param).then(res=>{
            if(res.code =="100"){
               this.tableDataTwo=res.data.list
              }
          })  
       },
         //查询表格
       searchGroupByEngineering(){

         //获取查询的input的值
         let param           = {};
             param.bankJgId  = this.$global.OMRBankJgId(this.dataSessionNew);
             param.pageNum   = '1'                                             //分页
             param.orgName   = this.dataSession.orgName;                                   //公司名称 这是测试传入的信息
             param.pageSize  = "99999";
             param.status    = "1";
         let a               = this.$global.cusPinJieStr;
             param.six       = a;
             param.type      = "1"
             param.groupbySo = "Y"
          //过滤 只查询 有效数据
           findOrgMoneyRecordMoneySum(param).then(res=>{
            if(res.code =="100"){
            this.tableDataThree=res.data.list;
            this.tableDataThree.map(item =>{
                //供应商角色余额
               item.key1 = this.$global.accMinus(item.outMoney,item.inMoney);
            })
          }  
         })
          
       },
    },
     computed:{ //计算总金额和总重量
      total(){
        this.tMoney = this.$global.accAdd(this.tMoneyOrder,this.tMoneyDao);

        return  this.tMoney
      }
    },
    mounted(){
       this.setInfo();
       this.searchM();//table的查询数据
       this.searchDaozhangdan();//查询到账单列表数据
        this.searchGroupByEngineering();
     this.searchM();
     this.getAdminList();
     this.getGongcheng();//获取工程名称
       
    },
    created(){
      this.dataSession=JSON.parse(sessionStorage.getItem('compay'));
      console.log('-----------------000000')
      console.log(this.dataSession)
      this.dataSessionNew=JSON.parse(sessionStorage.getItem('compayBankJgId'));
      console.log(this.dataSessionNew)
    },
  }
</script>
<style <style lang="less">

.ivu-tabs-nav .ivu-tabs-tab-active{
    background:#2d8cf0!important;
    color:#fff;
}
.ivu-tabs-tab-active:hover{
    color:#fff!important;
}
#lay_con{
    display: flex;
    .lay_left{
      width:100%;
      flex: 3;
    };
    .lay_right{
      width:100%;
      flex:1;
      .basicInfo{
          height:360px;
          width:100%;
          border:1px solid rgba(221,221,221,1);
          margin-bottom:10px;
          .h_info{
            height:40px;
            text-indent: 10px;
            background:rgba(238,238,238,1);
            line-height:40px;
            font-size:14px;
            font-weight:400;
            color:rgba(51,51,51,1)
          }
          .info_con{
             padding-top:16px;
             padding-left:16px;
          
             p{
                 font-size:14px;
                 color:rgba(51,51,51,1)
             }

          }
      }
      .phone_info{
           border:1px solid rgba(221,221,221,1);
        .phone_title{
            height:40px;
            text-indent: 10px;
            background:rgba(238,238,238,1);
            line-height:40px;
            font-size:14px;
            font-weight:400;
            color:rgba(51,51,51,1);
            time{
                font-size:16px;
            };
        }
        .phone_qq{
            height:40px;
        }
      }
      .infoF{
        height:40px;
        background:rgba(238,238,238,1);
        border:1px solid rgba(245,245,245,1);
        overflow: hidden;
        margin-bottom:20px;
        .spanKai{
          float:left;
          height:40px;
          font-size:14px;
          color:rgba(51,51,51,1);
          line-height:40px;
          text-indent: 10px;
        }
        .iconT{
        float:right;
        line-height:40px;
        font-size:18px;
        margin-right:17px;
      }}
    
     .p_con{
        width:100%;
        padding-left:10px;
        p{
          font-size:14px;
          line-height:25px;
          color:rgba(51,51,51,1);
          min-height:20px;
        }
      }
}
}
.row_left{
  display:flex;
  height:90px;
  background:rgba(236,248,255,1);
  border:1px dashed #94d6ff;
  padding-top:10px;
  dl{
      flex:1;
      dt{
          text-align:center;
          font-size:16px;
      }
      dd{
          text-align:center;
          font-size:24px;
          color:red;
          time{
              font-size:14px;
              color:rgba(51,51,51,1);
          }
      }
  } 
}
.row_shop{
    height:45px;
    border:1px solid rgba(221,221,221,1);
    border-bottom:0;
    .shop_info{
        height:45px;
        line-height:45px;
        font-size:16px;
        text-indent: 10px;
        color:rgba(51,51,51,1);
    }
    .shop_add{
        height:45px;
        padding-top:7px;
        .but_on{
            height:30px;
            font-size:13px;
            float:right;
            margin-right:10px

        }
    }

}
.row_account{
  height:45px;
  border:1px solid rgba(221,221,221,1);
  border-bottom:0;
  .row_span{
      float:left;
      height:45px;
      text-indent: 10px;
      font-size:16px;
      color:rgba(51,51,51,1);
      line-height:45px;
  }
  .row_more{
      float:right;
      height:45px;
     font-size:13px;
     color:rgba(27,151,229,1);
     line-height:45px;
     margin-right:10px
  }

}
.ivu-card-body{
   padding-bottom:0;
 }
 .width_150{
   width:500px;
 }
.ivu-modal-content{
  padding-left:20px;
 
}
.ivu-modal-footer{
  display: none;
}
#formM{
  .ivu-form-item-content{
    margin-left:357px!important;
  }
}
.ivu-form-item{
    margin-bottom:16px!important;
}
.contacts{
   height:45px;
   border:1px solid rgba(221,221,221,1);
   border-bottom:0;
   .span_contacts{
       height:45px;
       line-height:45px;
       text-indent:10px;
       font-size:16px;
       color:rgba(51,51,51,1);
       float:left;
   }
   .span_btn{
       float:right;
       width:60px;
       
       border-radius:3px;
       margin-right:24px;
       margin-top:5px;
      .ivu-btn >.ivu-icon + span{
          margin-left:0!important;
      }
   }
}
.ivu-modal-body{
    padding:31px 30px;
}
.ivu-modal-content{
    padding-left:0!important;
}
.account_price{
    height:50px;
    line-height:50px;
    // text-align:right;
    time{
        font-size:16px;
        color:red;
    }
}
</style>

