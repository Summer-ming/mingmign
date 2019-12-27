<!--
 * @Description: 库存销售单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='mdiv'>

     <Form inline :model="formItem" >
        <Row style='margin-bottom:10px;'>
          <!-- <FormItem label="公司名称:" style="margin-right:10px;">
            <Select v-model="formItem.companyName"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in cusOrgList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
           <FormItem label="订单号:" style="margin-right:10px;">
          <Input style="width:140px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
        <FormItem label="订单状态:" style="margin-right:10px;">
            <Select  v-model='formItem.orderStatus' style="width:140px" placeholder="请选择订单状态" @on-change='changeOrderStatus'>
              <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          
          <FormItem label="公司抬头:">
            <Select v-model="formItem.bankJgId"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          
            <FormItem label="工程名称:" style="margin-right:10px;">
               <el-select size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                  </el-option>
              </el-select>
          </FormItem>
          <FormItem label='下单时间'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
          </FormItem> -->
          <br>
          <i-Col span="24" style='display:flex;'>
             <Button size='small' type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button size='small' shape="circle" icon="md-refresh" @click="reloadSelf" style='margin-left:4px;'></Button>
               <Button size='small' type="primary"  icon="ios-download-outline" @click="exportData()" style='margin-left:4px;'>导出excel</Button>
              <Poptip placement="bottom" :transfer="true" style='margin-left:4px;'  trigger="hover" title="说明：" content="剩余应收金额=合同金额 - 已收金额;在未实提前||在实提后，剩余应收金额=结算金额 - 已收金额">
               <Icon type="ios-help-circle-outline" size="30"  />
             </Poptip>

             <div style='flex:1'>
               <Button size='small'  icon="md-add" type="primary" @click='addNew'>新增库存销售单</Button>
              </div>

          </i-Col>
        </Row>
        <!-- <Table  height="400" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            
        </Table> -->

        <!-- 开始 -->
       <vxe-table style="margin-top:10px" height="550"
         class="mytable-style" border   size="mini" ref="selection" :data.sync="data1"  >
                <vxe-table-column fixed="left"  min-width="60" field="id" title="ID" >
                </vxe-table-column>
                <!-- 下单时间 -->
                <vxe-table-column align="center" fixed="left" width="100"  title="收货时间">
                      <vxe-table-column align="center" fixed="left" width="100"  field="createTime" title="收货时间" >
                            <template v-slot:header>
                              <div style="width:90px" >
                                  <DatePicker  :transfer="true"  @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" >
                                  </DatePicker>
                              </div>
                            </template>
                            <template v-slot="{row}">
                              <span style="color:red">{{row.createTime.substr(0,10)}}</span>
                            </template>
                      </vxe-table-column>
                </vxe-table-column>
                <!-- 销售单号 -->
              <vxe-table-column align="center" fixed="left" width="200"  title="销售单号">
                 <vxe-table-column align="center" fixed="left" field="ordersNo" title="销售单号" width="200" >
                    <template v-slot:header>
                          <Input clearable style="width:150px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
                    </template>
                    <template v-slot="{row}">
                        <a    @click='pushOrderInfo(row)' type="primary">{{row.ordersNo}}</a>
                    </template>
                </vxe-table-column>
              </vxe-table-column>


                   <!-- 供应商名称 -->
              <vxe-table-column align="center" fixed="left" width="160"  title="客户">
                <vxe-table-column align="center" field="customerOrgName" fixed="left" title="供应商名称" width="160" >
                  
                    <template v-slot:header>
                        <Select clearable  style="width:150px" :transfer="true" v-model="formItem.companyName"  
                                filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
                          <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
                        </Select>
                    </template>
                    <template v-slot="{row}">
                        <a   @click='tableShopOrderName(row)' type="primary">{{row.customerOrgName}}</a>
                    </template>
                </vxe-table-column>
              </vxe-table-column>
                <!-- 采购方名称 -->
              <vxe-table-column align="center" fixed="left" width="100"  title="公司抬头">
                <vxe-table-column fixed="left" width="100" :formatter="tableCustomerOrgName" field="shopOrgName" title="公司抬头" >
                  <template v-slot:header>
                        <Select clearable style="width:90px" :transfer="true" v-model="formItem.bankJgId"    placeholder="请选择"   >
                          <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
                        </Select>
                  </template>
                </vxe-table-column>
              </vxe-table-column>
           

                <vxe-table-column align='right' width="100" fixed="left" :formatter="this.$global.vxeTableMoney" field="moneyAll" title="合同金额(元)" ></vxe-table-column>
                <vxe-table-column align='right' width="100" :formatter="this.$global.vxeTableWeight" field="zhongliangAll" title="合同重量(吨)" ></vxe-table-column>
                <vxe-table-column align='right' width="100" :formatter="this.$global.vxeTableWeight" field="deliveryTotalWeight" title="实提重量(吨)" ></vxe-table-column>
                <vxe-table-column align='right' width="100" :formatter="this.$global.vxeTableMoney" field="deliveryTotalMoneyCus" title="实提总货款(元)" ></vxe-table-column>
                <vxe-table-column align='center'  width="200" :formatter="this.$global.vxeTableMoney" field="otherMoney" title="杂费总额(已付金额)(元)" >
                  <template v-slot="{row}">
                    <!-- <span >{{$global.isMoneyShow(row.otherMoney)}} </span> -->

                    <span >{{$global.isMoneyShow(row.otherMoney)}} <span style="color:blue">({{$global.isMoneyShow(row.payOtherMoney)}})</span></span>
                  </template>
                </vxe-table-column>
                <!-- 工程名称 -->
              <vxe-table-column align="center"  width="250"  title="工程名称">
                <vxe-table-column width="250" field="gongcheng" title="工程名称" >
                  <template v-slot:header>
                        <el-select style="width:240px" :transfer="true" size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                          <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-option>
                        </el-select>
                  </template>
                </vxe-table-column>
              </vxe-table-column>

                  <!-- 订单状态 -->
              <vxe-table-column align="center"  width="100"  title="状态">
                <vxe-table-column width="100" :formatter="table_status" field="status" title="订单状态" >
                  <template  v-slot:header>
                        <Select clearable style="width:90px" :transfer="true"  v-model='formItem.orderStatus'  placeholder="请选择订单状态" >
                          <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
                        </Select>
                  </template>
                </vxe-table-column>
              </vxe-table-column>

               <vxe-table-column width="100" :formatter="table_in" field="status" title="实提状态" ></vxe-table-column>
               <vxe-table-column width="100" :formatter="table_ins" field="" title="收款状态" ></vxe-table-column>
               <vxe-table-column width="100" :formatter="table_invo" field="" title="开票状态" ></vxe-table-column>
               <vxe-table-column width="60"  field="userName" title="管理员" ></vxe-table-column>
            
                <vxe-table-column align='right' width="100"  :formatter="this.$global.vxeTableMoney" field="receivedMoney" title="已收金额(元)" ></vxe-table-column>
                <vxe-table-column align='right' width="100" :formatter="table_payable" field="" title="剩余应收金额(元)" ></vxe-table-column>
                <!-- 操作 -->
                <vxe-table-column field=""  title="操作" width="60" >
                    <template v-slot="{row}">
                      <Button size="small" type="primary" @click="pushOrderInfo(row)">查看</Button>&nbsp;
                      <!-- <Button size="small" type="primary" @click="table_changeBtn(row)">修改</Button> -->
                    </template>
                </vxe-table-column>
            </vxe-table>
        <!-- 结束 -->
        <Page show-elevator show-sizer :page-size-opts="pageList" @on-page-size-change="pageSizeChange" :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>

        <!-- <Page show-elevator :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page> -->
        <br>
     
     </Form>
     <!-- 2019年5月5日16:58:20 添加修改订单 -->
     
        <Modal
        title="修改订单"
        v-model="changeModal" 
        :mask-closable="false" :footer-hide="true"  width='600px;' >
        <Form  inline :model="changeItem"  :labelWidth="100">
          <p>订单号:{{changeItem.ordersNo}}</p>
        <FormItem label="工程名称：" style="width:200px" >
            <Input v-model="changeItem.engineering" placeholder="输入工程名称"></Input>
        </FormItem>
        
            <div class="margin-top-20">
                  <Button style="margin-right:10px" type="primary" @click="changeBtn" :disabled="isDisable">修改</Button>
                  <Button  type="default" @click="modalCancel">取消</Button>
            </div>
    </Form>
    </Modal>
     </div>
</template>

<script>
import {findOrdersAll,findShop,updateOrderStatus} from '@/api/data_8889'
import {buyTypeList,orderStatusList,lengthList,belongCompanyList,lengthListArray} from '@/libs/global_type'
import { getBuyOrderStatus,getSellOrderIsInvoiceStatus,getSellOrderIsRealMentionStatus,getSellOrderIsReceiveMoneyStatus} from '@/libs/allStatus'
import { setTimeout } from 'timers'
import {findOrgCusAcc,findOrderEngineering} from '@/api/data'
import Utils from '@/api/middle'
export default {
    name: 'sell_order_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        shopList:[],
        pageList:lengthListArray,
        //todo
        engineerNameList:[],//工程名称数组
        cusOrgList:[],
        isDisable  : false,
        changeModal: false,
        changeItem : {
          engineering: "",
          ordersNo   : "",
          id         : ''
        },
        tableItem      : {},
        belongCompanyListThis:belongCompanyList,
        orderStatusList: orderStatusList,
        totalM         : 0,                 //表格分页总天数
        pagesizea      : 1,                 //默认分页第一页
        formItem       : {
          companyName: '',
          length     : 15,
          orderStatus: "",
          cusOrgName:'',
          cusOrgId:'',
          orderNo:"",
          bankJgId:"",
          dateTime:"",
          beginTime:'',
          endTime:''
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
        lengthListThis:lengthList,
        
        data1: [],//表格展示的数据
        dataCount:0,//总页数
        
        searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      tableShopOrderName(row){
        localStorage.setItem('a',true)
          const route = {
              name: '/sell/Customer_balance/Customer_Business',
              query:row
            }
            this.$router.push(route)
      },
      table_changeBtn(row){
        this.changeModal = true;
        this.changeItem.ordersNo    = params.row.ordersNo;
        this.changeItem.id          = params.row.id;
        this.changeItem.engineering = params.row.gongcheng;

      },
       tableCustomerOrgName({ cellValue, row, column }){
        return cellValue.substr(0,5)

      },
       pageSizeChange(pageSize){//修改页码数
        this.formItem.length = pageSize;
        this.searchM();
      },
       table_payable({ cellValue, row, column }){//剩余应付金额(元)
        //订单未实提之前 用合同金额 - 收款金额
        //订单实提之后 用实提金额 - 收款金额
        let b = row.moneyAll;
        if(Number(row.status)>=8 && Number(row.status)<=90){//已经实提
              b= row.deliveryTotalMoneyCus
        }
        let a = this.$global.accMinus(b,row.receivedMoney)
        return this.$global.isMoneyShow(a);
      },
      table_invo({cellValue, row, column}){
         return getSellOrderIsInvoiceStatus(cellValue);
      },
      table_ins({cellValue, row, column}){
         return getSellOrderIsReceiveMoneyStatus(cellValue);
      },
      table_in({cellValue, row, column}){
         return getSellOrderIsRealMentionStatus(cellValue);

      },
      table_status({ cellValue, row, column }){//状态
        return getBuyOrderStatus(cellValue);
      },
       getShop(){
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
      //todo
      pushOrderInfo(row){
        row.operateType  ="1"//查看
        sessionStorage.setItem('XiaoShou','')
        sessionStorage.setItem('XiaoShou',JSON.stringify(row))
            const route = {
               name: 'sell_order_info',
             }
             this.$router.push(route)
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
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';
      },
       exportData(){//导出到excel

        this.$refs.selection.exportCsv({
          filename:"导出excel"
        })
      },
       changeOrderStatus(item){
      },
      changeBtn(){//TODO
            let p  ={};
            let plist = [];
            let dic = {};
            dic.id = this.changeItem.id;
            dic.gongcheng = this.changeItem.engineering;
            plist.push(dic);
            p.pageUpdateOrderList = plist;
        updateOrderStatus(p).then(res =>{
           if(res.code =='100'){
             this.isDisable=true;
               this.$Notice.success({
                   title:'修改成功',
                    duration:1,
                    onClose:res =>{
                      let that=this;
                      setTimeout(function(){
                       that.reload()
                      },100)
                 }
               })
           }else{
               this.$Notice.error({
                   title:'修改失败'
               })
           }
        })
      },
      modalCancel(){
        this.changeModal = false;
      },
      addNew(){
          const route = {
             name: 'add_sell_order'
           }
           this.$router.push(route)
      },
      addNew1(){
        const route = {
             name: 'add_sell_order_excel'
           }
           this.$router.push(route)
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
         param.cusMerName=this.formItem.cusOrgName //name
         param.pageNum=this.pagesizea //分页
         param.bankJgId = this.formItem.bankJgId;
         param.engineering   = this.formItem.engineering;//工程名称

        //  param.status = 1 ;
         //根据订单状态查询
             if(this.formItem.orderStatus == "1"){
               param.beginStatus = -1 ;
               param.endStatus   = 1 ;
             }
             else if(this.formItem.orderStatus == "2"||this.formItem.orderStatus == "6"){
               param.beginStatus = 2 ;
                param.endStatus   = 7 ;
             }
             else  if( this.formItem.orderStatus==""  ) {
                //默认查询 1到90的
             param.beginStatus = -1 ;
              param.endStatus   = 90 ;
             }else {
               param.beginStatus = this.formItem.orderStatus ;
                param.endStatus   = this.formItem.orderStatus ;
             }
            param.userId = this.$global.adminInfo.id;
          param.pageSize = this.formItem.length;
          param.ordersNoLike = this.formItem.orderNo;
          param.beginTime   = this.formItem.beginTime     //创建时间 
         param.endTime     = this.formItem.endTime       //截止时间
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         findOrdersAll(param).then(res=>{
           console.log("请求成功 应该是89")
            if(res.code =="100"){

            this.data1=res.data.list;
            this.totalM=res.data.total; 
          }  
         })
       },
       getCusOrgList(){
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.cusOrgList=res.data.list
          }  
         })
       },
        getDian(item){
          if(item){
        this.formItem.cusOrgName = item.label;
        this.formItem.cusOrgId = item.value;
          }
       },
    },
    
    mounted(){
     this.getShop();
     //todo
     this.searchM();
     this.getCusOrgList();
     this.getGongcheng();//获取工程数组
      var that = this;
     Utils.$on('sell_order_list',function(msg){
       console.log("emit监听到的信息："+msg);
       if(msg == "reload"){
        that.searchM();
       }else{

       }
     })
    },
    
    created(){
   
    },
}

</script>
<style <style lang="less">
//  .ivu-table-cell{
//         padding-left: 0!important;
//         padding-right: 0!important;;
//       }
   
      #apop .ivu-card-body{
        padding-top:0px!important;
      }
      // 让表格紧凑，并宽度统一
     #mdiv .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
         height:20px ;
       
      }
      .vxe-table .vxe-cell {
        padding: 0 2px;
      }
</style>
