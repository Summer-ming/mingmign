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
          <FormItem label="工程名称:" style="margin-right:10px;">
               <el-select style="width:100px" size="mini" v-model="formItem.engineering"  multiple clearable  filterable  default-first-option placeholder="请输入工程名称">
                <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                  </el-option>
              </el-select>
          </FormItem>
          <!-- <FormItem label="订单号:" style="margin-right:10px;">
          <Input style="width:100px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem> -->
           <!-- <FormItem label="供应商查询:">
            <Select v-model="orgSearch"  style="width:100px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
      
            </Select>
          </FormItem> -->
          <!-- <FormItem label='付款时间'>
              <DatePicker @on-change="changeUpdateTieme" format="yyyy-MM-dd" v-model="formItem.dateUpdateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 100px">
              </DatePicker>
            </FormItem> -->
            
            <!-- <FormItem label='申请时间'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 100px">
              </DatePicker>
            </FormItem>
            <FormItem label="状态:">
            <Select v-model="formItem.status"  style="width:100px" filterable placeholder="请选择名称"  @on-change='getStatus'  :label-in-value='true'>
               <Option v-for="(item,index) in formItem.statusList " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem> -->
          <!-- <FormItem label="订单类型:" style="margin-right:10px;">
            <Select  v-model='orderType' style="width:100px" placeholder="请选择订单类型" >
              <Option  v-for='(item,index) in zhidanOrderType' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem> -->
           <FormItem label="每页显示:">
            <Select size='small' v-model="formItem.length"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="24">
             <Button size='small' type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button size='small' style="margin-left:5px" shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
            <Button size='small' style="margin-left:5px" type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>
             <Tooltip content="按照项目名称、对账批次来区分列表数据" placement="top-start">
              <Button size='small' style="margin-left:4px" shape="circle" icon="md-help" ></Button>
             </Tooltip>
          </Col>
          <br>
          <Col span="24">
            <time>采购合同吨位：</time>
            <time style="color:red" >{{this.$global.accPrecision(tItem.buyOrderWeight,3)}}</time>吨
            <time style="margin-left:30px">采购实提吨位：</time>
            <time style="color:red">{{this.$global.isMoneyShow(tItem.buyOrderDeliveryWeight)}}</time>元
             <time style="margin-left:30px">采购单付款金额：</time>
            <time style="color:red">{{this.$global.isMoneyShow(tItem.buyOrderPayMoney)}}</time>元
            <br>
             <time >已对账金额：</time>
            <time style="color:red">{{this.$global.isMoneyShow(tItem.sellOrderDeliveryMoney)}}</time>元
             <time style="margin-left:30px">收款金额：</time>
            <time style="color:red">{{this.$global.isMoneyShow(tItem.sellOrderReceviedMoeny)}}</time>元
             <time style="margin-left:30px">未收款金额：</time>
            <time style="color:red">{{this.$global.isMoneyShow(tItem.sellOrderUnReceviedMoney)}}</time>元
            <br>
            <time>说明：已对账金额 = 销售单结算总金额;<br/>
             &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    收款金额 = 销售单订单已经汇款的金额;<br/>
            &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 未收款金额 = 销售收款金额 - 销售已对账金额 </time>
          </Col>
        </Row>
        <!-- 新的vxe table -->
        <vxe-table style="margin-top:10px" height="550" show-footer :footer-method="footerMethod"
        @select-change="selectChangeEvent" @select-all='selentAll'
          border  resizable  size="mini" ref="vxeSelection" :data.sync="data1"  >
        <vxe-table-column type="selection" width="30"></vxe-table-column>
        <vxe-table-column show-overflow width="200" field="engineering" title="项目名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="80"  field="customerName" title="客户名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="80"  field="duizhangTimes" title="对账批次" ></vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableWeight" field="zongzhongliang" title="采购合同吨位" ></vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableWeight" field="deliveryTotalWeightBuy" title="采购实提吨位" ></vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="receivedMoneyBuy" title="采购付款金额" ></vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="deliveryToatalMoneyCusSell" title="已对账金额" ></vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="receivedMoneySell" title="收款金额" ></vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="key1" title="未收款金额" ></vxe-table-column>
        <vxe-table-column show-overflow width="160"  field="skOrgName" title="备注" ></vxe-table-column>
        </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {
findOrderEngineering,
findShop,
findOrgCusAcc,
getUserList,
findZhidanApplySum,
findEngineeringMoney} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,jiesuanStatusList} from '@/libs/global_type'
import {getJiesuanStatus,zhidanTypeLis} from '@/libs/allStatus'
import XEUtils from 'xe-utils'

export default {
    name: 'duizhangList',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        tItem:{
          buyOrderWeight:'',//采购合同吨位
          buyOrderDeliveryWeight:'',//采购实提吨位
          buyOrderPayMoney:'',//采购单付款金额
          sellOrderDeliveryMoney:'',//已对账金额
          sellOrderReceviedMoeny:'',//收款金额
          sellOrderUnReceviedMoney:''//未收款金额
        },
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
          endUpdateTime:'',//截止付款时间
          engineering:''
          },
          engineerNameList:[],
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
      selentAll(){
        this.getSelectTotal();
      },
      selectChangeEvent({ checked, row }){
        this.getSelectTotal();
      },
      getSelectTotal(){
         let dataSelect=this.$refs.vxeSelection.getSelectRecords()//获取选中的列表
          console.log(dataSelect);
          // buyOrderWeight:'',//采购合同吨位
          // buyOrderDeliveryWeight:'',//采购实提吨位
          // buyOrderPayMoney:'',//采购单付款金额
          // sellOrderDeliveryMoney:'',//已对账金额
          // sellOrderReceviedMoeny:'',//收款金额
          // sellOrderUnReceviedMoney:''//未收款金额
          let a=0,b=0,c=0,d=0,e=0,f = 0;
          dataSelect.map(item=>{
            a = this.$global.accAdd(a,item.zongzhongliang)
            b = this.$global.accAdd(b,item.deliveryTotalWeightBuy)
            c = this.$global.accAdd(c,item.receivedMoneyBuy)
            d = this.$global.accAdd(d,item.deliveryToatalMoneyCusSell)
            e = this.$global.accAdd(e,item.receivedMoneySell)
            f = this.$global.accAdd(f,item.key1)
          })
          this.tItem.buyOrderWeight           = a;
          this.tItem.buyOrderDeliveryWeight   = b;
          this.tItem.buyOrderPayMoney         = c;
          this.tItem.sellOrderDeliveryMoney   = d;
          this.tItem.sellOrderReceviedMoeny   = e;
          this.tItem.sellOrderUnReceviedMoney = f;
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
      //footer vxeTable合计
       footerMethod ({ columns, data }) {
         //tableTotalDic
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '当页合计'
                  }
                   if(['zongzhongliang','deliveryTotalWeightBuy'].includes(column.property)){//
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)
                  }  
                    if(['receivedMoneyBuy','deliveryToatalMoneyCusSell','receivedMoneySell','key1'].includes(column.property)){//
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)
                  }    
                  return '-'
                }),
                // columns.map((column, columnIndex) => {
                //   if (columnIndex === 0) {
                //     return '全部合计'
                //   }
                //     if(['actualApyMoney'].includes(column.property)){//
                //     console.log("全部合计中"+this.tableTotalDic.actualApyMoney);
                //     return this.$global.isMoneyShow(this.tableTotalDic.actualApyMoney);
                //   } 
                //    if(['dikouMoney'].includes(column.property)){//
                //     return this.$global.isMoneyShow(this.tableTotalDic.dikouMoney);
                //   }    
                //   return '-'
                // })
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
          let gong='';
        this.formItem.engineering.map((item)=>{
                // gong+=(item+',')
                 gong+=("'"+item+"'"+',')
        })
        gong = gong.substr(0,gong.length-1);
         //获取查询的input的值
         let param                       = {};
             param.pageNum               = this.pagesizea                  //分页
             param.pageSize              = this.formItem.length;
             param.engineering             = gong;


                  findEngineeringMoney(param).then(res=>{
                      if(res.code =="100"){
                      this.totalM=res.data.total; 
                      this.data1=res.data.list;
                        // this.getOrderInfoTotal(param);//查询全部数据
                      this.data1.map((item,index)=>{
                        item.keyid= index;
                        //状态
                        item.key1 = this.$global.accMinus(item.receivedMoneySell,item.deliveryToatalMoneyCusSell)
                      })
                    }  
                  })
         
         
          
          
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
     this.getGongcheng();
    //  this.getShop();
    //  this.getAdminList();
   
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
