<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->
<template>
     <div>
        <!-- 查询表格信息 -->
          <Form :model="formItem" inline :label-width="119">
            <Row>
              <i-Col span="24">
                <!-- 采购单订单号 -->
              <FormItem label="采购单订单号:" style="margin-right:10px;">  
                <Input style="width:200px" @on-change='getChangeCai' placeholder="请输入采购单订单号" v-model="formItem.buyOrderNo"></Input>
              </FormItem>
              <!-- 销售单工程名称 -->
              <FormItem label="销售单工程名称:">
                <Select v-model="xiaoGouName" multiple  style="width:200px"   @on-change='getXiaoName'  filterable placeholder="请选择名称"   :label-in-value='true'>
                  <Option v-for="(item,index) in buyEngineeringList" :value="item.value" :label="item.label" :key="item.value" >{{ item.label }}</Option>
                </Select>
              </FormItem>
              <!-- 销售单客户名称 -->
              <FormItem label="客户名称:">
                <Select v-model="xiaoKeName" multiple  style="width:200px"   @on-change='getKeName'  filterable placeholder="请选择名称"   :label-in-value='true'>
                  <Option v-for="(item,index) in caiGouList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
                </Select>
              </FormItem>
              <!-- 采购单工程名称 -->
              <!-- <FormItem label="采购单工程名称:">
                <Select v-model="caiGouName" multiple   style="width:200px"   @on-change='getCaiName'  filterable placeholder="请选择名称"   :label-in-value='true'>
                  <Option v-for="(item,index) in buyEngineeringList" :value="item.value" :label="item.label" :key="item.value" >{{ item.label }}</Option>
                </Select>
              </!--> 
              <!-- 采购单供应商名称 -->
              <FormItem label="采购单供应商名称:">
                <Select v-model="caiGongName"  multiple style="width:200px"   @on-change='getCaiGongName'  filterable placeholder="请选择名称"   :label-in-value='true'>
                  <Option v-for="(item,index) in caiGouList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
                </Select>
              </FormItem>
              <!-- 采购单下单时间 -->
              <FormItem label='采购单下单时间'>
                    <DatePicker id='caigou' @on-change='getDataOne' type="daterange" :options="options2" placement="bottom-end" placeholder="请选择日期" style="width: 200px"></DatePicker>
                </FormItem>
                <!-- 采购单付款时间 -->
               <FormItem label='付款时间'>
                    <DatePicker id='caigou' @on-change='getBuyOrderPayTime' type="daterange" :options="options2" placement="bottom-end" placeholder="请选择日期" style="width: 200px"></DatePicker>
                </FormItem>
                <!-- 销售单订单号 -->
              <FormItem label="销售单订单号:" style="margin-right:10px;">  
                <Input style="width:200px" @on-change='getChangeXiao' placeholder="请输入销售单订单号" v-model="formItem.sellOrderNo"></Input>
              </FormItem>
              
              

              <!-- 销售单下单时间 -->
               <FormItem label='销售单下单时间'>
                    <DatePicker id='caigou1' @on-change='getDataTwo' type="daterange" :options="options2" placement="bottom-end" placeholder="请选择日期" style="width: 200px"></DatePicker>
               </FormItem>
               <!-- 查询管理员，采购单下单人名称 -->
                 <FormItem label="管理员查询:">
                <Select v-model="adminSearch"  multiple style="width:200px"   @on-change='getAdmin'  filterable placeholder="请选择名称"   :label-in-value='true'>
                  <Option v-for="(item,index) in adminList" :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
                </Select>
              </FormItem>
               <!-- 每页显示 -->
              <FormItem label="每页显示:">
                <Select v-model="formItem.pageFen"  style="width:200px"   @on-change='getFen'  filterable placeholder="请选择名称"   :label-in-value='true'>
                 <Option  :value="item.value" v-for='(item,index) in everyPage' :key='index'>{{item.value}}</Option>
                </Select>
              </FormItem>
              <FormItem label="采购单本公司抬头:">
                <Select v-model="formItem.buyBankJgId"  style="width:200px"  placeholder="请选择"   >
                  <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
                </Select>
              </FormItem>
              </i-Col>

              <i-Col span="24">
                <Button style="margin-left:10px" type='primary' icon="ios-search" @click='searchM()'>查询</Button>
                <Button style="margin-left:10px"  shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
                <Button style="margin-left:10px"  icon="ios-download-outline" @click="exportCsvEvent()">导出excel</Button>

              </i-Col>
            </Row>
            <br>
            <span style="color:red">注：①应补（退）款 = 实提总金额 - 付款金额</span>
            <span style="margin-left:10px;color:red" >②未收款 = 收款金额 - 实提金额</span>
            <span style="margin-left:10px;color:red" >③吨差价 = 销售结算单价 - 采购结算单价</span>
            <span style="margin-left:10px;color:red" >④利润 = 结算金额-杂费-对应的采购件数对应的结算金额</span>
            <span style="margin-left:10px;color:red" >⑥天数 = 回款日期-付款日期</span>
          </Form>
          <br>
          <!-- 表格信息 -->
          <row>
             <vxe-table
              ref="xTable1"
              border
              show-footer
              size="mini"
              class="vxe-table-element mytable-style"
              :span-method="rowspanMethod"
              height="400"
              :cell-class-name="cellClassName"
              :footer-method="footerMethod"
              :footer-cell-class-name="footerCellClassName"
              @cell-click="cellClickEvent2"
              :data.sync="tableData">
              <!-- //第一部分采购单相关信息 -->
              <vxe-table-column type='index' title="#"  min-width='40' fixed="left"></vxe-table-column>
              <vxe-table-column field="sellCustomerOrgName"   title="客户名称" fixed="left"  min-width='140'></vxe-table-column>
              <vxe-table-column field="sellEngineering"  title="销售项目名称" show-overflow  min-width='140'></vxe-table-column>
              <vxe-table-column field="buyOrderNo"  title="采购单订单号" min-width='140'></vxe-table-column>
              <vxe-table-column field="buyOrderCreateTime"  title="下单时间" min-width='140'></vxe-table-column>
              <vxe-table-column field="buyid" title="id-采购单明细id" show-header-overflow min-width='40'></vxe-table-column>
              <vxe-table-column field="omrCreateTime" title="付款日期" min-width='140'></vxe-table-column>
              <vxe-table-column field="buyShopOrgName" title="采购单位名称" min-width='140'></vxe-table-column>
              <vxe-table-column field="buySteelName" title="物资名称" min-width='60'></vxe-table-column>
              <vxe-table-column field="buySteelPaihao" title="型号" min-width='80'></vxe-table-column>
              <vxe-table-column field="buySteelGuige" title="规格" min-width='60'></vxe-table-column>
              <vxe-table-column field="buySteelPinpai" title="厂地" min-width='100'></vxe-table-column>
              <vxe-table-column field="buyjianshu" title="件数" min-width='60'></vxe-table-column>
              <!-- 采购单单价，吨位，合同金额 -->
              <vxe-table-column field="buyzongzhongliang" :formatter="this.$global.vxeTableWeight" title="采购吨位(合同)" min-width='80'></vxe-table-column>
              <vxe-table-column field="buydijia" :formatter="this.$global.vxeTableMoney" title="采购单价(合同)" min-width='80'></vxe-table-column>
              <vxe-table-column field="buyCusMoney"  :formatter="this.$global.vxeTableMoney" title="采购金额(合同)" min-width='100'></vxe-table-column>

              <vxe-table-column field="buyReceivedMoney" :formatter="this.$global.vxeTableMoney" title="付款金额" min-width='100'></vxe-table-column>

              <vxe-table-column field="buyJiesuanDanjia" :formatter="this.$global.vxeTableMoney" title="采购实提单价" min-width='80'></vxe-table-column>
              <vxe-table-column field="buyJiesuanWeight" :formatter="this.$global.vxeTableWeight" title="采购实提重量" min-width='80'></vxe-table-column>
              <vxe-table-column field="buyJiesuanMoney"  :formatter="this.$global.vxeTableMoney" title="采购单实提金额" min-width='100'></vxe-table-column>
              <vxe-table-column field="buyDeliveryTotalMoneyCus"  :formatter="this.$global.vxeTableMoney" title="实提总金额" min-width='100'></vxe-table-column>
              <vxe-table-column field="buyCha" :formatter="this.$global.vxeTableMoney"   title="应补（退）款" min-width='140'></vxe-table-column>
              <vxe-table-column field="invoiceIncomeCreateTime"  :formatter="buyinvoiceStatus"  title="收票情况" min-width='140'></vxe-table-column>
              <vxe-table-column field="buyDikouSMoney"  :formatter="this.$global.vxeTableMoney"  title="抵扣金额" min-width='60'></vxe-table-column>
              <vxe-table-column field="buyTixianSMoney"  :formatter="this.$global.vxeTableMoney"  title="提现金额" min-width='60'></vxe-table-column>
              <vxe-table-column field="buySkSMoney"  :formatter="this.$global.vxeTableMoney"  title="收款金额" min-width='60'></vxe-table-column>
              <vxe-table-column field="fengeLine" title="分割线" min-width='60' align="center"></vxe-table-column>
              
              <!-- 分割1 -->
              <vxe-table-column field="sellOrderNo" title="销售单号" min-width='140'></vxe-table-column>
              <vxe-table-column field="sellOrderCreateTime"  title="下单时间" min-width='140'></vxe-table-column>
              <vxe-table-column field="sellid" title="销售明细id" show-header-overflow min-width='40'></vxe-table-column>
              <vxe-table-column field="sellInternetMoneyNote" title="磅单日期" min-width='140'></vxe-table-column>
              <vxe-table-column field="sellJiesuanWeight" :formatter="this.$global.vxeTableWeight"  title="磅单吨位" min-width='80'></vxe-table-column>
              <vxe-table-column field="sellInternetMoney" :formatter="this.$global.vxeTableMoney"   title="网价" min-width='80'></vxe-table-column>
              <vxe-table-column field="sellJiesuanDanjia" :formatter="this.$global.vxeTableMoney" title="结算单价" min-width='80'></vxe-table-column>
              <vxe-table-column field="sellJiesuanMoney" :formatter="this.$global.vxeTableMoney" title="结算金额" min-width='100'></vxe-table-column>
              <vxe-table-column field="sellDeliveryTotalMoneyCus" :formatter="this.$global.vxeTableMoney" title="结算总金额" min-width='100'></vxe-table-column>

              <vxe-table-column field="dzdDealType" title="收款日期" min-width='140'></vxe-table-column>
              <vxe-table-column field="sellOrderReceivedMoney"  :formatter="this.$global.vxeTableMoney" title="收款金额" min-width='100'></vxe-table-column>
              <vxe-table-column field="sellCha"  :formatter="this.$global.vxeTableMoney" title="未收款" min-width='100'></vxe-table-column>
              <vxe-table-column field="invoceOutpCreateTime" :formatter="sellinvoiceStatus" title="是否开票" min-width='100'></vxe-table-column>
              <vxe-table-column field="sellDikouSMoney"  :formatter="this.$global.vxeTableMoney" title="抵扣金额" min-width='60'></vxe-table-column>
              <vxe-table-column field="sellTixianSMoney"  :formatter="this.$global.vxeTableMoney" title="提现金额" min-width='60'></vxe-table-column>
              <vxe-table-column field="sellSkSMoney"  :formatter="this.$global.vxeTableMoney" title="收款金额" min-width='60'></vxe-table-column>
              
              <!-- 利润开始 -->
              <vxe-table-column field="maoli" :formatter="this.$global.vxeTableMoney" title="吨差价" min-width='80'></vxe-table-column>
              <vxe-table-column field="maoliZhong"  :formatter="this.$global.vxeTableMoney" title="利润" min-width='100'></vxe-table-column>
              <vxe-table-column field="timeCha"   title="天数(天)" min-width='60'></vxe-table-column>
              <vxe-table-column field=""   title="资金成本" min-width='140'></vxe-table-column>
              <vxe-table-column field="buyCreateCname"   title="业务员" min-width='80'></vxe-table-column>

              <!-- 杂费6个显示 -->
              <!-- <vxe-table-column field="sellOm1Name" title="杂费1名称" min-width='80'></vxe-table-column>
              <vxe-table-column field="sellOm1Money" title="杂费1金额" min-width='80'></vxe-table-column>

              <vxe-table-column field="sellOm2Name" title="杂费2名称" min-width='80'></vxe-table-column>
              <vxe-table-column field="sellOm2Money" title="杂费2金额" min-width='80'></vxe-table-column> -->
              <!-- 分割2 -->
              <vxe-table-column field="fengeLine" title="分割线" min-width='60' align="center"></vxe-table-column>
              <vxe-table-column field="sellBuyRealDanjia" :formatter="this.$global.vxeTableMoney" title="结算单价(采购,计算用)" min-width='80'></vxe-table-column>
              <vxe-table-column field="sellBuyRealWeight" :formatter="this.$global.vxeTableWeight" title="结算重量(采购,计算用)" min-width='80'></vxe-table-column>
              <vxe-table-column field="sellBuyRealMoney" :formatter="this.$global.vxeTableMoney" title="结算金额(采购,计算用)" min-width='80'></vxe-table-column>
            
            </vxe-table>
            <Page :page-size="formItem.pageFen" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>

          </row>
     
       

     </div>
</template>

<script>
import XEUtils from 'xe-utils'
import {findOrdersInfoAll
} from '@/api/data_8889'
import {findOrgCusAcc,
getUserList,findOrdersInfoAllSum89Sum,findOrdersInfoAllSum89Zong,findOrderEngineering} from '@/api/data'
import {getLiRun} from "@/api/cusData"
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,belongCompanyList} from '@/libs/global_type'
import { parse } from 'querystring';

export default {
    name: 'sell_order_info_profit_list1',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        belongCompanyListThis:belongCompanyList,
        sellEngineeringName:'',//销售单工程名称
        buyPayStartTime:'',//采购单付款开始时间
        buyPayEndTime:'',//销售单付款截止时间
        tableData:[],//表格数据
        customColumns: [//控制表格列哪些显示哪些隐藏
                {
                  field: 'sellCustomerOrgName',
                  visible: true,
                }
              ],
        customColumnsTree:[
            {
                   title: '点击选择展示项',
                        expand: false,
                        checked:true,
                        field: 'sellCustomerOrgName',
                        visible: true,
                        children: [
                                    {
                                        title: '客户名称',
                                         field: 'sellCustomerOrgName',
                                          visible: true,
                                    },
                                     {
                                        title: '销售项目名称',
                                         field: 'sellEngineering',
                                          visible: true,
                                    }
                                ]
            }
        ],
        //采购查询参数
        buyEngineeringList:[],//采购工程名称
        caiGouName1:"",//采购单工程名称
        caiGouName1Id:"",//采购单工程名称id
        caiGouName:"",//采购单工程名称默认值
        caiGongName:'',//采购单供应商名称默认值
        caiGongName1:'',//采购单供应商名称
        caiGongName1Id:'',//采购单供应商名称id
        buyBeginCreateTime:'', //采购单下单时间开始
        buyEndCreateTime:"", //采购单下单时间结束
        adminSearch:"",//管理员名称
        adminNameStr:'',//管理员名称用来搜索
        adminList:[],//管理员数组
        caiGouList:[],//采购下拉的数组
        formItem:{
          buyOrderNo:'',//采购单订单号
          sellOrderNo:"",//销售单订单号
          pageFen:50,//分页的默认展示
          buyBankJgId:'',

        },//查询订单的参数
        options2: {
             shortcuts: [
                        {
                            text: '1 周',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '1 月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '3 月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
             ]
        },//采购单下单时间
        //销售查询参数
        sellCusOrgName:'',//销售方客户名称
        xiaoGouName:"",//销售单工程名称默认值
        xiaoGouName1:"",//销售单工程名称
        xiaoGouName1Id:"",//销售单工程名称id
        XiaoGouList:[],//销售单工程名字数组
        xiaoKeName:"",//销售单客户名称默认值
        xiaoKeName1:"",//销售单客户名称
        xiaoKeName1Id:"",//销售单客户名称id
        sellBeginCreateTime:"",//销售单开始
        sellEndCreateTime:"",//销售但时间结束

        everyPage:lengthList,//选择分页的数组
        totalM:0,//分页默认数据
        pagesizea:1,//默认分页第一页

         spanArr: [], //遍历数据时，根据相同的标识去存储记录
         pos: 0, // 二维数组的索引

          spanArr1: [], //遍历数据时，根据相同的标识去存储记录 记录付款金额
         pos1: 0, // 二维数组的索引
          spanArr2: [], //遍历数据时，根据相同的标识去存储记录 记录付款金额
         pos2: 0, // 二维数组的索引
         selectRow:null,
         selectColumn:null

      }
       
    },
    
    methods:{
      cellClickEvent2({ row, column }){//cell点击事件
          this.selectRow = row
              this.selectColumn = column
      },
      getAdminList(){
         let param = {};
         param.pageSize = "99999"
         param.status  ="1"
        getUserList(param).then(res=>{
            if(res.code =="100"){
            this.adminList=res.data.list;
          }  
         })
       },
      buyinvoiceStatus({cellValue, row, column}){//判断收票情况
            if(cellValue&&cellValue.length>2){
                  return cellValue.substring(0,10)+' '+'收票'
            }else{
                return "未收票"
            }
      },
       sellinvoiceStatus({cellValue, row, column}){//判断收票情况
            if(cellValue&&cellValue.length>2){
                  return cellValue.substring(0,10)+' '+'开票'
            }else{
                return "未开票"
            }
      },
      //导出excel
      exportCsvEvent () {
        this.$refs.xTable1.exportCsv({
          filename: ' 销售利润表',
        })
      },
      
      //底部合计单元格样式
       footerCellClassName ({ $rowIndex, column, columnIndex }) {
              if (columnIndex === 0) {
                if ($rowIndex === 0) {
                  return 'col-red'
                } 
              }
        },
      //footer 合计
       footerMethod ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '合'
                  }
                  if(['buyjianshu'].includes(column.property)){//判断件数 返回 0位小数点
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),0)
                  }
                    if(['buyzongzhongliang','buyJiesuanWeight','sellJiesuanWeight',
                    'sellBuyRealWeight','maoliZhong'].includes(column.property)){////重量返回 3位小数点
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),3)
                  }    
                  if (['buyReceivedMoney','buyCha','buyCusMoney','sellCha',//金额返回2位小数点
                    'sellJiesuanMoney','sellDeliveryTotalMoneyCus','sellOrderReceivedMoney','sellOm1Money','sellOm2Money',
                   'buyJiesuanMoney','buyDeliveryTotalMoneyCus',
                   'sellBuyRealMoney'].includes(column.property)) {
                     
                     
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),2)
                  }
                  return '-'
                })
              ]
       },
       //数组合并记录判别
       getSpanArr(data) {　

          for (var i = 0; i < data.length; i++) {
            let item = data[i];
              //根据采购单明细id，判断销售单明细是否合并 行合并
                if (i === 0) {
                      this.spanArr.push(1);
                      this.pos = 0

                } else {
                  // 判断当前元素与上一个元素是否相同
                      if (data[i].buyid === data[i - 1].buyid) {//根据采购单明细id，判断销售单明细是否合并
                                  this.spanArr[this.pos] += 1;
                                  this.spanArr.push(0);//不显示
                                  //不显示的将需要计算的值 为0 ，防止重复相加
                                  item.buyJiesuanDanjia = '0'
                                  item.buyJiesuanWeight = '0'
                                  item.buyJiesuanMoney  = '0'
                                  item.buyjianshu = '0'
                                  item.buyzongzhongliang = '0'
                                  item.buyCusMoney = '0'  
                                      
                        } else {
                                  this.spanArr.push(1);//显示
                                  this.pos = i;
                                }
                }

                //新的判断付款金额 采购单
                if (i === 0) {
                      this.spanArr1.push(1);
                      this.pos1 = 0

                } else {
                  // 判断当前元素与上一个元素是否相同
                      if (data[i].buyOrdersId === data[i - 1].buyOrdersId) {//根据采购单明细id，判断销售单明细是否合并
                                  this.spanArr1[this.pos1] += 1;
                                  this.spanArr1.push(0);//不显示
                                  item.buyReceivedMoney ='0'
                                  item.buyDeliveryTotalMoneyCus='0'
                        } else {
                                  this.spanArr1.push(1);//显示
                                  this.pos1 = i;

                                }
                }

                 //新的判断收款金额，未收款 销售单
                if (i === 0) {
                      this.spanArr2.push(1);
                      this.pos2 = 0

                } else {
                  // 判断当前元素与上一个元素是否相同
                      if (data[i].sellOrdersId === data[i - 1].sellOrdersId) {//根据采购单明细id，判断销售单明细是否合并
                                  this.spanArr2[this.pos2] += 1;
                                  this.spanArr2.push(0);//不显示
                                  item.sellOrderReceivedMoney = '0'
                                  item.sellCha = '0'
                                  item.sellDeliveryTotalMoneyCus = '0' 
                        } else {
                                  this.spanArr2.push(1);//显示
                                  this.pos2 = i;

                                }
                }
            }

       },
      
      //合并单元格
      rowspanMethod ({ row, $rowIndex, column, columnIndex}) {//data是页面展示的数据

            // console.log(column.property)
            // if (columnIndex <=15 ||columnIndex==17||columnIndex==18||columnIndex==19||columnIndex==22) {//判断合并哪些

            if (columnIndex <=15 ||columnIndex==17||columnIndex==18||columnIndex==19||columnIndex==22) {//判断合并哪些
                 const _row = this.spanArr[$rowIndex];
                  const _col = _row > 0 ? 1 : 0;
                  return {
                           rowspan: _row,//行
                           colspan: 1//列
                      }
             
             }
      //单独合并的是 《付款金额》 《实提总金额》《应补（退）款》buyReceivedMoney
      //付款金额 buyReceivedMoney;实提总金额 buyDeliveryTotalMoneyCus;应补（退）款 buyCha
    //   else if(columnIndex == 16 || columnIndex == 20 || columnIndex == 21){//合并 付款金额，实提总吨位，应退，补款内容
        else if(column.property == 'buyReceivedMoney' || column.property == 'buyDeliveryTotalMoneyCus' || 
        column.property == 'buyCha'||column.property == 'buyDikouSMoney'||column.property == 'buyTixianSMoney'||column.property == 'buySkSMoney'){//合并 付款金额，实提总吨位，应退，补款内容
                   const _row1 = this.spanArr1[$rowIndex];
                  const _col1 = _row1 > 0 ? 1 : 0;
                  return {
                           rowspan: _row1,//行
                           colspan: 1//列
                      }
            }
            // else if(columnIndex == 30 || columnIndex == 32|| columnIndex == 33){
                //结算总金额 sellDeliveryTotalMoneyCus
                //收款金额 sellOrderReceivedMoney
                //未收款sellCha
            else if(column.property == 'sellDeliveryTotalMoneyCus' || column.property == 'sellOrderReceivedMoney'||
              column.property == 'sellCha'||column.property == 'sellDikouSMoney'||column.property == 'sellTixianSMoney'||column.property == 'sellSkSMoney'){
                   const _row2 = this.spanArr2[$rowIndex];
                  const _col2 = _row2 > 0 ? 1 : 0;
                  return {
                           rowspan: _row2,//行
                           colspan: 1//列
                      }
            }
      },
      count(obj) {
        var t = typeof obj;
        if (t == 'string') {
          return obj.length;
        } else if (t == 'object') {
          var n = 0;
          for (var i in obj) {
            n++;
          }
          return n;
        }
        return false;
      },
      //给对应的列加上颜色
      cellClassName({ row, rowIndex, column, columnIndex }){//设置行和列的颜色
            let color = ""
             const colmm=this.spanArr1[rowIndex]//设置行颜色
              if(colmm!=0){
                color = 'red-mm' +' '+color
                  //  return 'red-mm'
              }
              // else{
              //     return ''
              // }

          if(column.property=='fengeLine'  ){//第一个分割线的位置
                  color = 'col-green' +' '+color
                      // return 'col-green';
                  }
                  //付款金额 buyReceivedMoney
          //实提总金额 buyDeliveryTotalMoneyCus
          //应补（退）款 buyCha
          if(column.property=='buyReceivedMoney' || column.property=='buyDeliveryTotalMoneyCus' || column.property=='buyCha' ){
                  color = 'col-yellow' +' '+color
                      
                      // return 'col-yellow';
                  }
                  //结算总金额 sellDeliveryTotalMoneyCus
                    //收款金额 sellOrderReceivedMoney
                    //未收款sellCha
          if(column.property=='sellDeliveryTotalMoneyCus'||column.property=='sellOrderReceivedMoney'||column.property=='未收款sellCha' ){
                  color = 'col-darkkhaki' +' '+color
                  
                  // return 'col-darkkhaki';
               }
                if (row === this.selectRow & column === this.selectColumn) {//点击的cell然后变色
                  color = 'col-orange' +' '+color
              }
              return color
      },
     
      //获取采购单下单日期
      getDataOne(item){
         this.buyBeginCreateTime=item[0]; 
         this.buyEndCreateTime=item[1]; 
      },
      //获取采购单付款日期
      getBuyOrderPayTime(item){
        console.log(item)
         this.buyPayStartTime=item[0]; 
         this.buyPayEndTime=item[1]; 
      },
      //获取采购工程选中的名字
      getCaiName(item){
          console.log(item);
         this.caiGouName1=item.label;
         this.caiGouName1Id=item.value   
      },
      //获取采购单供应商名字
      getCaiGongName(item){
        
        let alist = '';
        item.map(dic=>{
            if(alist.length<=0){
                alist = dic.label;
            }else{
                alist = alist+','+dic.label;
            }
        })
        let a = alist;
        a = this.$global.pinjieStr(a)
        console.log(a);
        this.buyShopOrgName = a;//采购单供应商名称
        //  this.caiGongName1=item.label;//采购单供应商名称
        //  this.caiGongName1Id=item.value;//采购单供应商名称id
      },
      getAdmin(item){
        let alist = '';
        item.map(dic=>{
            if(alist.length<=0){
                alist = dic.label;
            }else{
                alist = alist+','+dic.label;
            }
        })
        let a = alist;
        a = this.$global.pinjieStr(a)
        this.adminNameStr = a
      },
      //获取采购单订单号的值
      getChangeCai(e){
        this.formItem.buyOrderNo=e.target.value;
      },
      //获取采购单工程名称和采购单供应商
      getShop(){
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.caiGouList=res.data.list
          }  
         })
      },
      //获取采购单工程名称和采购单供应商
      getEngerList(){
        let param = {};
        param.pageSize = "999999"
           findOrderEngineering(param).then(res=>{
          if(res.code =="100"){
              res.data.list.map(item =>{
                if(item){
                let dic = {};
                dic.label =item.engineering;
                dic.value =item.engineering;
                this.buyEngineeringList.push(dic);
                }
              })
          }
        })
      },

      //销售单的查询参数
      getChangeXiao(e){ //销售单的订单号
          this.formItem.sellOrderNo=e.target.value;
      },
      //销售单工程名称 id
      getXiaoName(item){
        console.log(item)
        let alist = '';
        item.map(dic=>{
            if(alist.length<=0){
                alist = dic.label;
            }else{
                alist = alist+','+dic.label;
            }
        })
        let a = alist;
        a = this.$global.pinjieStr(a)
        console.log(a);
          this.sellEngineeringName=a//销售单工程名称
      },
      //销售单客户名称 id
      getKeName(item){
           let alist = '';
        item.map(dic=>{
            if(alist.length<=0){
                alist = dic.label;
            }else{
                alist = alist+','+dic.label;
            }
        })
        let a = alist;
        a = this.$global.pinjieStr(a)
          this.sellCusOrgName=a//销售方名称
      },
      //销售单下单时间
      getDataTwo(item){
         this.sellBeginCreateTime=item[0]//销售单开始
         this.sellEndCreateTime=item[1] //销售但时间结束
      },
      //选择分页查询
      getFen(item){
        this.formItem.pageFen=item.value;
        this.spanArr=[];
      },
      //分页查询
       changePage(index){
          this.pagesizea=index;
          this.spanArr=[];
          this.searchM();
       },
      //默认表格的查询
      searchM(){
          //每次查询时 清空之前的合并单元格的数组
          this.spanArr = [];
          this.pos = 0;
          this.spanArr1 = [];
          this.pos1 = 0;
          this.spanArr2 = [];
          this.pos2 = 0;

          let param={};
             //分页
          param.pageNum     =  this.pagesizea; //分多少页  
          param.pageSize    =this.formItem.pageFen;

          param.buyShopOrgName  =this.caiGongName1;//采购单店铺名称 
 

          param.sellEngineering    =this.xiaoGouName1;//销售单工程名称
          param.sellShopOrgName     =this.xiaoKeName1;//销售单店铺名称
          
          //——————————————————————下面是已经调试OK的筛选
          if(this.buyPayStartTime != ''){
              param.omrBeginCreateTime = this.buyPayStartTime +' '+'00:00:00';//采购单下单开始时间
              param.omrEndCreateTime   = this.buyPayEndTime+' '+'24:00:00';//采购单下单截止时间

          }
          
          param.sellEngineeringString     = this.sellEngineeringName;  //销售工程名称 
          param.sellCustomerOrgNameString = this.sellCusOrgName;       //客户名称
          param.buyShopOrgNameString      = this.buyShopOrgName;       //采购单供应商名称
          if(this.buyBeginCreateTime !=''){
            param.beginbuyOrderCreateTime  =this.buyBeginCreateTime +' '+'00:00:00';//采购下单时间
            param.endbuyOrderCreateTime  =this.buyEndCreateTime +' '+'24:00:00';//采购下单截止时间
          }
          param.sellOrderNo   =this.formItem.sellOrderNo;//销售单订单号
          param.buyOrderNo=this.formItem.buyOrderNo;//采购单订单号 
          if(this.sellBeginCreateTime !=''){
            param.beginsellOrderCreateTime = this.sellBeginCreateTime +' '+'00:00:00';//销售单下单时间
            param.endsellOrderCreateTime =this.sellEndCreateTime +' '+'24:00:00';//销售单下单截止时间
          }
          param.buyCreateCnameString = this.adminNameStr;
          this.tableData = [];
          //状态
          param.beginBuyStatus = '1'
          param.endBuyStatus = '90'
          param.buyBankJgId = this.formItem.buyBankJgId;
          // param.beginSellStatus = '2' 这2个状态不需要传
          // param.endSellStatus = '90'
          getLiRun(param).then(res=>{
            if(res.code=='100'){
              this.tableData=res.data.list
              this.totalM=res.data.total
              this.tableData.map((item)=>{
                // sellBuyRealMoney -  sellJiesuanMoney
                  item.maoli=item.sellJiesuanDanjia-item.sellBuyRealDanjia //吨差价 = 销售结算单价 - 采购结算单价(用结算单价(采购,计算用))
                  // ④利润 = 结算金额-杂费-采购金额
                  //计算杂费的总和
                  //结算金额 sellJiesuanMoney
                  //采购结算金额sellBuyRealMoney
                  //OMTotalM 杂费总金额
                  item.OMTotalM = this.$global.accAdd(item.sellOm2Money,item.sellOm1Money)
                  let a = this.$global.accMinus(item.sellJiesuanMoney,item.OMTotalM) 
                  item.maoliZhong=this.$global.accMinus(a,item.sellBuyRealMoney) //每一行的毛利总和
                  
                  item.fengeLine = "|"
                  item.fengeLine1 = "|"
                  item.fengeLine2 = "|"

                  //buyCha 
                  item.buyCha = this.$global.accMinus(item.buyDeliveryTotalMoneyCus,item.buyReceivedMoney)
                  //sellCha
                  item.sellCha = this.$global.accMinus(item.sellOrderReceivedMoney,item.sellDeliveryTotalMoneyCus)
                  //计算天数
                  // ⑥天数 = 回款日期-付款日期
                  if(item.dzdDealType && item.omrCreateTime){
                     let b = new Date(item.dzdDealType)
                    let c = new Date(item.omrCreateTime)
                    let d = (b-c)/(1000*60*60*24);
                    item.timeCha = this.$global.accPrecision(d,0) 
                  }else{
                    item.timeCha = "-"
                  }
                 
              })
              //判断合并几行
              this.getSpanArr(this.tableData) //找出要合并的几列
            }     
          })
       },
       //刷新
       reloadSelf(){
            this.reload();
      },
     },
    
    mounted(){
       this.getShop();//获取采购单名称 采购单供应商名称
      //  this.searchM();//查询表格的数据
       this.getEngerList();//获取工程名称
       this.getAdminList();//获取管理员名称
    },
    watch:{

    },
    
    created(){
        
       
    },
}

</script>
<style  >
       .mytable-style .vxe-body--column.red-mm{
            border-top: 1px solid red!important;
       }
       .mytable-style .vxe-header--column.col-blue {
          background-color: #2db7f5;
          color: #fff;
        }
        .mytable-style .vxe-footer--column.col-red{
          background-color: red;
          color: #fff;
        }
        .mytable-style .vxe-body--column.col-green {
          background-color: green;
          color: #fff;
        }
         .mytable-style .vxe-body--column.col-blue {
          background-color: #2db7f5;
          color: #fff;
        }
         .mytable-style .vxe-body--column.col-yellow {
          background-color: yellowgreen;
          color: #fff;
        }
           .mytable-style .vxe-body--column.col-aqua {
          background-color: aqua!important;
          color: #fff;
        }
          .mytable-style .vxe-body--column.col-yellow {
          background-color:antiquewhite!important;
          color: black;
        }
 .mytable-style .vxe-body--column.col-darkkhaki {
          background-color:darkkhaki!important;
          color: black;
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
        #caigou .ivu-select-dropdown{
              left: -123px!important;
        }
     
      .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {
      padding: 0 2px;
      }
    .ivu-form-item{
         margin-bottom:5px!important;
       }

</style>
