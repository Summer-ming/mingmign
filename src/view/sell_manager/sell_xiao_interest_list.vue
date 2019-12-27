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
             <Button type='primary' icon="ios-search" @click='searCh()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
            <Button type="primary"  icon="ios-download-outline" @click="exportData()" style='margin-right:10px'>导出excel</Button>
             <Button  type="primary"  @click="piLiang">批量录入利息</Button>
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
        <vxe-table height="450" 
        :data="tableData"
        resizable
        :checkbox-config="{labelField: 'id',checkMethod}"
        :tree-config="{children: 'orderInfoList'}"
         @select-change="selectChangeEvent"
         
         @select-all='selectAll'
        size="mini" ref="xTable1" >
                <vxe-table-column width="150" title="ID"  type="checkbox"  tree-node ></vxe-table-column>
                <vxe-table-column width="100" field="duizhangTime" title="对账时间" ></vxe-table-column>
                <vxe-table-column field="ordersNo" title="销售单号" width="200" show-overflow >
                    <template v-slot="{row}">
                        <a style=' cursor:pointer;'  @click='getAA(row)' type="text">{{row.ordersNo}}</a>
                    </template>
                </vxe-table-column>
                 <!-- 下面是显示 --> 
                <vxe-table-column width="80"  field="createTime" title="收货时间" show-overflow ></vxe-table-column>
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
                <vxe-table-column width="120"  :formatter="this.$global.vxeTableMoney" field="buyRealMoney" title="采购结算金额" show-overflow></vxe-table-column> -->

            </vxe-table> 
            <!-- 开始 -->
                <!-- <vxe-table
                  :data="tableData1"
                  :tree-config="{children: 'children'}"
                   row-key=true
                  :checkbox-config="{labelField: 'name'}">
                  <vxe-table-column type="checkbox" field="name" title="Name" tree-node></vxe-table-column>
                  <vxe-table-column field="sex" title="Sex"></vxe-table-column>
                  <vxe-table-column field="date" title="Date"></vxe-table-column>
                </vxe-table> -->
            <!-- 结束 -->


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
    <!-- 新增利息弹窗 -->
          <Modal
        v-model="modal2"
        title="批量录入信息"
        width='1100px'
        :footer-hide='true'
        style='top:5px!important'
       >
        <Form :model="formItem1" inline :label-width="120" id='xiadan' :op='counterZISuan'>

            <FormItem label='勾选的结算总金额:'>
                    <p style='color:red'>{{zongMoney}}万</p>
            </FormItem>
        

            <FormItem label='总重量:'>
                    <p style='color:red'>{{zongWeight}}吨</p>
            </FormItem>
        

          <FormItem  label='利息总额'>
            <Input type="text" style='width:200px' v-model='formItem1.zongLiXi' @on-change="getVlaue" placeholder='请输入利息总额'/>
          </FormItem>


            <FormItem label='最终结算金额度:'>
                    <p style='color:red'>{{zongM}}</p>
            </FormItem>

            <FormItem label='利息每吨单价:'>
                    <p style='color:red'>{{liXiMoney}}</p>
            </FormItem>
       
            <br/>
             <vxe-table height="450" 
        :data="tableDataTwo"
        resizable
        :radio-config="{labelField: 'id'}"
        :tree-config="{children: 'orderInfoList'}"
    
        size="mini" ref="xTable2" >
                <vxe-table-column width="150" title="ID" field="id"  tree-node ></vxe-table-column>
                <vxe-table-column field="ordersNo" title="销售单号|" width="200" show-overflow >
                    <template v-slot="{row}">
                        <a style=' cursor:pointer;'  @click='getAA(row)' type="text">{{row.ordersNo}}</a>
                    </template>
                </vxe-table-column>
                 <!-- 下面是显示 --> 
                <vxe-table-column width="120" :formatter="this.$global.vxeTableWeight" field="deliveryTotalWeight" title="结算重量" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" align='right'  :formatter="this.$global.vxeTableMoney" field="jiesuanDanjia" title="结算单价" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" align='right'  :formatter="this.$global.vxeTableMoney" field="jiesuanDanjia" title="上浮单价" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" align='right'  :formatter="this.$global.vxeTableMoney" field="jiesuanDanjia" title="最终结算单价" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" align='right'  :formatter="this.$global.vxeTableMoney" field="jiesuanDanjia" title="结算金额" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" align='right'  :formatter="this.$global.vxeTableMoney" field="jiesuanDanjia" title="上浮金额" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" align='right'  :formatter="this.$global.vxeTableMoney" field="jiesuanDanjia" title="最终结算金额" show-overflow ></vxe-table-column>
                <vxe-table-column width="120" field="internetMoneyNote" title="备注" show-overflow></vxe-table-column>
                 <!-- 结束 -->

            </vxe-table> 
            

          
        </Form>
        <div>
            <Button    type="primary" @click='getOrder'>保存</Button>
            <Button  type="default" style="margin-left:10px" @click='canCel' >取消</Button>

        </div>
    </Modal> 
    <!-- 结束 -->
     </div>
</template>

<script>

import {findOrdersInfoAll,findOrdersInfoAllSum,updateOrderInfo,updateOrder89} from '@/api/data_8889'
import {findOrgCusAcc,getUserList,findOrdersInfoAllSum89Zong,findOrderEngineering,findTree,updateOrgMoneyRecord} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel,getBuyOrderStatus} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,orderStatusList,belongCompanyList} from '@/libs/global_type'
import excel from '@/libs/excel'
import XEUtils from 'xe-utils'
import { unlink } from 'fs';
export default {
    name: 'sell_xiao_interest_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        //1
        dataOne:[],//保存接口2的子集
        zongMoney:0,//勾选的结算金额
        zongWeight:0,//总重量
        lastMoney:0,//最终结算金
        liXiMoney:0,//利息每吨单价
        zongM:0,
        tableData:[],
        seleData:[],
        tableDataTwo:[],
        modal2:false,
        formItem1:{
            zongLiXi:"",//利息总额
        },
        //2
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
      //开始
      selectChangeEvent({ selection }){
        console.log('选中')
         this.getselect(selection)
      }, 
      //保存
      saveData(){
          this.getXiu()//修改订单
          this.getOrder();//修改订单那明细
          this.getShiTi();//修改尸体流水金额
      },
      //修改订单/1
      getXiu(){
        let param={pageUpdateOrderList:[]}
        this.tableDataTwo.map((item)=>{
          let dic={};
          dic.id=item.id;
          dic.deliveryTotalMoneyCus=item.deliveryTotalMoneyCus;
          dic.realMoney=item.deliveryRequestMoneyCus
          dic.interestMoney='';
          param.pageUpdateOrderList.push(dic)
        })
        updateOrder89(param).then(res=>{
          if(res.code =="100"){
            
          }
        })
      },
      //接口修改订单明细2
      getOrder(){
          this.tableDataTwo.map((item)=>{//dataOne
                item.orderInfoList.map((item1)=>{
                    this.dataOne.push(item1)
                })
          })
         let param={pageOrderInfoList:[]}
          this.dataOne.map((item)=>{
                let dic={};
              dic.id=item.id;
              dic.jiesuanDanjia=item.jiesuanDanjia
              dic.realUnitPrice=item.realUnitPrice
              dic.realMoney=item.realMoney
              dic.interestUnitPrice=interestUnitPrice
              dic.interestMoney=item.interestMoney
              dic.note=item.note
              param.pageOrderInfoList.push(dic)
          })
          console.log(this.dataOne)
        updateOrderInfo(param).then(res=>{
              if(res.code =="100"){
                
              }
            })
        },
        //修改实体流水金额3
        getShiTi(){
          let tabFour=this.tableDataTwo[0].orgnizations
          let param={list:[]}

          tabFour.map((item)=>{
               let dic={};
               dic.id=item.id
               dic.outMoney=item.outMoney
               param.list.push(dic)
          })
           updateOrgMoneyRecord(param).then(res=>{
              if(res.code =="100"){
                
              }
            })
        
        },
      //取消
      canCel(){
        this.modal2=false;
      },
      //获取利息总额的值
      getVlaue(e){
         console.log(e.target.value)
         this.liXiMoney=(e.target.value)/(this.zongWeight)
         this.zongM=Number(e.target.value)+Number(this.zongMoney)
      },
      //不可点击
      checkMethod({row}){
          console.log('2222row')//条件满足的可以选中
           return row.id !='808'&&row.id!='2500'
      },
      //公用方法
      getselect(selection){
          this.seleData=selection;//判断是否勾选
          this.tableDataTwo=[];
          let tableDataThree=this.$refs.xTable1.getSelectRecords()//选中的数据
          console.log(tableDataThree)
          tableDataThree.map((item)=>{
              if(item.a=='1'){
                  this.tableDataTwo.push(item)
              }
          })
          
      },
      //全选
      selectAll({ selection }){
          console.log('全选')
          this.getselect(selection)
      },
      //批量导入利息
      piLiang(){
        console.log(this.seleData.length)
            if(this.seleData.length<=0){
                this.$Message.success("请选择勾选")
            }else(
              this.modal2=true
            )
      }, 
  
       getTree(){
        let p  ={};
        p.pageNum     = this.pagesizea    
        p.pageSize ="10"
         
        findTree(p).then(res=>{
          console.log('运输')
           console.log(res)
          if(res.code =="100"){
             
              // this.tableData=this.getCon(res.data.list);
              this.tableData=res.data.list;
              console.log(this.tableData)
          }
        })
      },
       //递归处理数据
      getCon(tree){
         let arr = [];
         if(!!tree && tree.length !== 0){
            tree.forEach(item => {
              this.tableDataTwo.push(item);
              let obj = {};
              obj.id = item.id;
              obj.duizhangTime=item.duizhangTime;
              obj.orderNo=item.orderNo;
              obj.createTime=item.createTime;
              obj.shopOrgName=item.shopOrgName;
              obj.customerOrgName=item.customerOrgName;
              obj.gongcheng=item.gongcheng;
              obj.createCname=item.createCname;
              obj.steelName=item.steelName;
              obj.steelGuige=item.steelGuige;
              obj.steelPaihao=item.steelPaihao;
              obj.steelPinpai=item.steelPinpai;
              obj.steelWorks=item.steelWorks;
              obj.jiaohuodi=item.jiaohuodi;
              obj.jianshu=item.jianshu;
              obj.weight=item.weight;
              obj.zongzhongliang=item.zongzhongliang;
              obj.guapaijia=item.guapaijia;
              obj.cusMoney=item.cusMoney;
              obj.kunbaohao=item.kunbaohao;
              obj.internetMoney=item.internetMoney;
              obj.floatMoney=item.floatMoney;
              obj.region=item.region;
              obj.internetMoneyNote=item.internetMoneyNote;
              obj.jiesuanDanjia=item.jiesuanDanjia;
              obj.jiesuanWeight=item.jiesuanWeight;
              obj.jiesuanMoney=item.jiesuanMoney;
              obj.receiptStatus=item.receiptStatus;
              obj.invoiceWeight=item.invoiceWeight;
              obj.invoiceMoney=item.invoiceMoney;
              obj.invoiceNo=item.invoiceNo;
              obj.invoiceStatus=item.invoiceStatus;
              obj.status=item.status;
              obj.buyRealDanjia=item.buyRealDanjia;
              obj.buyRealWeight=item.buyRealWeight;
              obj.buyRealMoney=item.buyRealMoney;
              
              if(item.orderInfoList!=null|| item.orderInfoList!=undefined){
                obj.orderInfoList = this.getCon(item.orderInfoList);
              }
              arr.push(obj);   
            });
          }
          return arr;
      },
      //结束
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
              return row.o !=false 
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
       searCh(){
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
  

             param.beginStatus = '8' ;
             param.endStatus   = '10' ;
             param.bankJgId = this.formItem.bankJgId;
           findTree(param).then(res=>{
            if(res.code =="100"){
           
            let alist = res.data.list;
            this.totalM=res.data.total; 
            this.tableData=res.data.list;
            this.tableData.map((item)=>{
                 item.a=1;
                 item.o=true;//判断是否可以点击子集
                 if(item.orderInfoList.length!=0){
                     item.orderInfoList.map((item1)=>{
                       item1.o=false;
                     }) 
                 }
              
            })
            this.data1=alist;
            this.getOrderInfoTotal(param);
          }   
         })
          
       },
       getOrderInfoTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findOrdersInfoAllSum89Zong(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data.list[0];
            this.data1.push(dic);
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
  computed: {
    counterZISuan () {
        let zongMoney=0;//勾选的结算金额
        let zongWeight=0;//总重量
        let lastMoney=0;//最终结算金
        this.tableDataTwo.map((item)=>{
            zongMoney+=Number(item.deliveryRequestMoneyCus)  
            this.zongMoney=zongMoney 
            zongWeight+=Number(item.deliveryTotalWeight)  
            this.zongWeight=zongWeight
        })
        return this.zongMoney,this.zongWeight
    }
  },
    mounted(){
     this.searchM();
     this.getShop();
     this.getAdminList();
     this.getGongcheng();
     //this.getTree();//tree数组
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
  .ivu-modal{
            top:5px!important;
        }
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
      padding: 0 10px;
      }
      #xiadan .ivu-select-dropdown{
              left: -114px!important;
      }
</style>

