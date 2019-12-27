<!--
 * @Description: 采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='wnag'>
     <Card :border="false" :dis-hover="true" id='apop'>  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form inline :model="formItem" :label-width="80">
        <Row>
          <i-Col style="margin-top:10px" span="24"  >
             <Button size="small" type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button size="small" shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
               <Button size="small" type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>
             <Poptip trigger="hover" title="说明：" content="	剩余应付金额=合同金额-已付金额，在未实提前||实提后 剩余应付金额=结算金额-已付金额">
               <Icon type="ios-help-circle-outline" size="30"  />
             </Poptip>
             <Button size="small" style="margin-right:10px"  icon="md-add" type="primary" @click='addNew'>新增库存采购单</Button>
            <Button size="small" style="margin-right:10px"  icon="md-add" type="warning" @click='addNew2'>新增快速打款单</Button>
             <br>

          </i-Col>
        </Row>
        <!-- <Table height="440" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            
        </Table> -->
        <!-- vxeTable -->
         <vxe-table style="margin-top:10px" height="500" stripe
         class="mytable-style" border   size="mini" ref="selection" :data.sync="data1"  >
                <vxe-table-column fixed="left"  min-width="40" field="id" title="ID" >
                </vxe-table-column>
                <!-- 下单时间 -->
                <vxe-table-column align="center" fixed="left" width="80"  title="下单时间">
                      <vxe-table-column align="center" fixed="left" width="80"  field="createTime" title="下单时间" >
                            <template v-slot:header>
                              <div style="width:80px" >
                                  <DatePicker  :transfer="true"  @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" >
                                  </DatePicker>
                              </div>
                            </template>
                            <template v-slot="{row}">
                              <span style="color:red">{{row.createTime.substr(0,10)}}</span>
                            </template>
                      </vxe-table-column>
                </vxe-table-column>
                <!-- 采购单号 -->
              <vxe-table-column align="center" fixed="left" width="200"  title="采购单号">
                 <vxe-table-column align="center" fixed="left" field="orderNo" title="采购单号" width="200" >
                    <template v-slot:header>
                          <Input style="width:150px"  clearable placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
                    </template>
                    <template v-slot="{row}">
                        <a    @click='pushOrderInfo(row)' type="primary">{{row.ordersNo}}</a>
                    </template>
                </vxe-table-column>
              </vxe-table-column>
                <!-- 采购方名称 -->
              <vxe-table-column align="center" fixed="left" width="100"  title="公司抬头">
                <vxe-table-column align="center" fixed="left" width="100" :formatter="tableCustomerOrgName" field="customerOrgName" title="公司抬头" >
                  <template v-slot:header>
                        <Select clearable style="width:90px" :transfer="true" v-model="formItem.bankJgId"    placeholder="请选择"   >
                          <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
                        </Select>
                  </template>
                </vxe-table-column>
              </vxe-table-column>
                <!-- 供应商名称 -->
              <vxe-table-column align="center" fixed="left" width="160"  title="供应商名称">
                <vxe-table-column align="center" field="shopOrgName" fixed="left" title="供应商名称" width="160" >
                  
                    <template v-slot:header>
                        <Select clearable style="width:150px" :transfer="true" v-model="formItem.companyName"  
                                filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
                          <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
                        </Select>
                    </template>
                    <template v-slot="{row}">
                        <a   @click='tableShopOrderName(row)' type="primary">{{row.shopOrgName}}</a>
                    </template>
                </vxe-table-column>
              </vxe-table-column>

                <vxe-table-column width="100" align="right"  fixed="left" :formatter="this.$global.vxeTableMoney" field="moneyAll" title="合同金额(元)" ></vxe-table-column>
                <vxe-table-column width="100" align="right" :formatter="this.$global.vxeTableWeight" field="zhongliangAll" title="合同重量(吨)" ></vxe-table-column>
                <vxe-table-column width="100" align="right" :formatter="this.$global.vxeTableWeight" field="deliveryTotalWeight" title="实提重量(吨)" ></vxe-table-column>
                <vxe-table-column width="100" align="right" :formatter="this.$global.vxeTableMoney" field="deliveryTotalMoneyCus" title="实提总货款(元)" ></vxe-table-column>
                <!-- 工程名称 -->
              <vxe-table-column align="left"  width="250"  title="工程名称">
                <vxe-table-column  width="250" field="gongcheng" title="工程名称" >
                  <template  v-slot:header>
                        <el-select style="width:240px" :transfer="true" size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                          <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-option>
                        </el-select>
                  </template>
                </vxe-table-column>
              </vxe-table-column>
                <!-- 采购类型 -->
              <vxe-table-column align="center"  width="80"  title="采购类型">
                <vxe-table-column width="80" :formatter="table_buyType" field="buyType" title="采购类型" >
                    <template v-slot:header>
                      <Select clearable :transfer="true"  v-model='formItem.buyType' style="width:70px" placeholder="请选择订单购买类型" @on-change='getChange'>
                        <Option  v-for='(item,index) in buyTypeListThis' :value="item.value" :key='index'>{{item.label}}</Option>
                      </Select>
                    </template>
                </vxe-table-column>
              </vxe-table-column>
                <!-- 订单状态 -->
              <vxe-table-column align="center"  width="100"  title="订单状态">
                <vxe-table-column width="100" :formatter="table_status" field="status" title="订单状态" >
                  <template  v-slot:header>
                        <Select style="width:90px" clearable :transfer="true"  v-model='formItem.orderStatus'  placeholder="请选择订单状态" >
                          <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
                        </Select>
                  </template>
                </vxe-table-column>
              </vxe-table-column>
              <!-- 付款状态 -->
             <vxe-table-column align="center"  width="100"  title="付款状态">
                <vxe-table-column width="100"  field="payMoneyStatus" :formatter="table_payMoneyStatus" title="付款状态" >
                  <template  v-slot:header>
                        <Select clearable style="width:90px" :transfer="true"  v-model='formItem.moneyStatus'  placeholder="请选择付款状态" >
                          <Option  v-for='(item,index) in moneyList' :value="item.value" :key='index'>{{item.label}}</Option>
                        </Select>
                  </template>
                </vxe-table-column>
              </vxe-table-column>

                <!-- <vxe-table-column width="100" :formatter="table_payMoneyStatus" field="payMoneyStatus" title="付款状态" ></vxe-table-column> -->
                <vxe-table-column width="100" :formatter="table_instockStatus" field="" title="入库状态" ></vxe-table-column>
                <vxe-table-column width="100" :formatter="table_invoiceStatus" field="" title="开票状态" ></vxe-table-column>
                <vxe-table-column width="60"  field="userName" title="管理员" ></vxe-table-column>
                <vxe-table-column align="right" width="100"  :formatter="this.$global.vxeTableMoney" field="receivedMoney" title="已付金额(元)" ></vxe-table-column>
                <vxe-table-column align="right" width="100" :formatter="table_payable" field="" title="剩余应付金额(元)" ></vxe-table-column>
                <vxe-table-column width="20" align='center'  field="fenge" title="分割" ></vxe-table-column>

                <vxe-table-column align="right"  width="100" field="dikouSmoney" show-overflow title="抵扣金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column align="right"  width="100" field="tixianSMoney" show-overflow title="提现金额" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
                <vxe-table-column align="right"  width="100" field="skSmoney" show-overflow title="收款金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <!-- 操作 -->
                <vxe-table-column field="shopOrgName"  title="操作" width="60" >
                    <template v-slot="{row}">
                      <Button size="small" type="primary" @click="pushOrderInfo(row)">查看</Button>&nbsp;
                      <!-- <Button size="small" type="primary" @click="table_changeBtn(row)">修改</Button> -->
                    </template>
                </vxe-table-column>
            </vxe-table>
        <Page show-elevator show-sizer :page-size-opts="pageList" @on-page-size-change="pageSizeChange" :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
        <div style='flex:1'>
            <!-- <Button  icon="md-add" type="primary" @click='addNew1'>新增先销代采单</Button> -->
            </div>
    </Form>
    </Card> 
    <!-- 2019年5月5日16:58:05 添加修改订单 modal -->
    <Modal
        title="修改订单"
        v-model="changeModal" 
        :mask-closable="false" :footer-hide="true"  width='600px;' >
        <Form  inline :model="changeItem"  :label-width="100">
          <p>订单号:{{changeItem.ordersNo}}</p>
        <FormItem label="工程名称：" style="width:200px" >
            <Input v-model="changeItem.engineering" placeholder="输入工程名称"></Input>
        </FormItem>
            <div class="margin-top-20">
                  <Button style="margin-right:10px" type="primary" @click="changeBtn" :disabled="isDisable" >修改</Button>
                  <Button  type="default" @click="modalCancel">取消</Button>
            </div>
    </Form>
    </Modal>
    </div>
</template>

<script>
import {findOrdersAll,findShop,updateShop,updateOrderStatus,findOrgCusAcc,findOrderEngineering} from '@/api/data'
import {buyTypeList,orderStatusList,lengthList,belongCompanyList,lengthListArray} from '@/libs/global_type'
import {getBuyTypeLabel} from '@/libs/status_type_color'
import { getBuyOrderStatus,getBuyOrderIsInStockStatus,getBuyOrderIsInvoiceStatus,getBuyOrderIsPayMoneyStatus} from '@/libs/allStatus'
import { setTimeout } from 'timers';
import Utils from '@/api/middle'
export default {
    name: 'buy_order_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        moneyList:[
          {
            value:'0',
            label:'未付款'
          },
          {
            value:'1',
            label:'付款中'
          },
          {
            value:'8',
            label:'付款完成'
          }
        ],//付款状态的数组
        pageList:lengthListArray,
        shopList:[],
        engineerNameList:[],//工程名称数组
        isDisable:false,
        changeModal:false,
        belongCompanyListThis:belongCompanyList,
        changeItem:{
          engineering:"",
          ordersNo:"",
          id:''
        },
        lengthListThis:lengthList,
        tableItem:{},
        orderStatusList:orderStatusList,
        buyTypeListThis:buyTypeList,
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          moneyStatus:'',//付款状态
          companyName:'',
          buyType:'',
          orderNo:'',
          orderStatus:"",
          length:15,
          shopOrgName:'',
          shopOrgId:'',
          bankJgId:'',
          beginTime:'',
          endTime:'',
          engineering:'',
          dateTime:''
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
          columns4: [ ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      pageSizeChange(pageSize){//修改页码数
        this.formItem.length = pageSize;
        this.searchM();
      },
      table_changeBtn(row){//表格修改
        this.changeModal = true;
        this.changeItem.ordersNo    = row.ordersNo;
        this.changeItem.id          = row.id;
        this.changeItem.engineering = row.gongcheng;
      },
      table_payable({ cellValue, row, column }){//剩余应付金额(元)
        //订单未实提之前 用合同金额 - 收款金额(出)
        //订单实提之后 用实提金额 - 收款金额(出)
        let b = row.moneyAll;
        //出金额汇总
        let c = this.$global.accAdd(row.receivedMoney,row.tixianSMoney);
            c = this.$global.accAdd(c,row.dikouSmoney);
        if(Number(row.status)>=8 && Number(row.status)<=90){//已经实提
              b= this.$global.accAdd(row.deliveryTotalMoneyCus,row.skSmoney) 
        }
        let a = this.$global.accMinus(b,c)
        return this.$global.isMoneyShow(a);
      },
      table_invoiceStatus({ cellValue, row, column }){//入库状态
        return getBuyOrderIsInvoiceStatus(row.status);
      },
      table_instockStatus({ cellValue, row, column }){//入库状态
        return getBuyOrderIsInStockStatus(row.status);
      },
      table_payMoneyStatus({ cellValue, row, column }){//付款状态
        return getBuyOrderIsPayMoneyStatus(cellValue);
      },
      table_status({ cellValue, row, column }){//状态
        return getBuyOrderStatus(cellValue);
      },
      table_buyType({ cellValue, row, column }){//采购类型
        return getBuyTypeLabel(cellValue);
      },
      tableShopOrderName(row){
        localStorage.setItem('a',true)
          const route = {
              name: '/buy/Supplier_balance/Supplier_business',
              query:row
            }
            this.$router.push(route)
      },
      tableCustomerOrgName({ cellValue, row, column }){
        return cellValue.substr(0,5)

      },
      formatTime({ cellValue, row, column }){
        return cellValue.substr(0,10)
      },
      pushOrderInfo(row){
        sessionStorage.setItem('CAIGOU','')
        sessionStorage.setItem('CAIGOU',JSON.stringify(row))
        row.operateType  ="1"//查看
            const route = {
                name: 'order_buy_info',
              }
              this.$router.push(route)
    },
      //查询工程
      getGongcheng(){
        let p  ={};
        p.pageSize ="99999"
        findOrderEngineering(p).then(res=>{
          if(res.code =="100"){
              res.data.list.map((item,index) =>{
                let dic = {};
                if(item){
                   dic.label =item.engineering;
                  dic.value =item.engineering;
                  this.engineerNameList.push(dic);
                }
               
              })
          }
        })
      },
      changeCreateTieme(data){
        if(data){
          this.formItem.beginTime  =data[0] +' 00:00:00';
          this.formItem.endTime  =data[1]+' 24:00:00';
        }else{
          this.formItem.beginTime  =''
          this.formItem.endTime  =''
        }
        

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
      addNew(){//新增库存销售单
          const route = {
             name: 'add_order_new'
          }
           this.$router.push(route)
      },
      addNew1(){//新增先销后进单
          const route = {
             name: 'add_order_new_byInfo'
          }
           this.$router.push(route)
      },
      addNew2(){//快速打款订单，没有明细的
        const route = {
             name: 'add_order_new_noInfo'
          }
           this.$router.push(route)
      },
      getChange(item){
      
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
         console.log(this.formItem.moneyStatus)
       
         //获取查询的input的值
         let param             = {};
             param.orderShopOrgId = this.formItem.shopOrgId  //name
             param.pageNum        = this.pagesizea           //分页
             param.beginTime      = this.formItem.beginTime     //创建时间 
             param.endTime        = this.formItem.endTime       //截止时间
         
             //根据订单状态查询
             if(this.formItem.orderStatus == "1"){
               param.beginStatus = -1 ;
               param.endStatus   = 1 ;
             }else if(this.formItem.orderStatus == "2" || this.formItem.orderStatus == "6"){
               param.beginStatus = 2 ;
               param.endStatus   = 7 ;
             }else if( this.formItem.orderStatus=="") {
                //默认查询 1到90的
             param.beginStatus = -1 ;
             param.endStatus   = 90 ;
             }else{
               param.beginStatus = this.formItem.orderStatus ;
               param.endStatus   = this.formItem.orderStatus ;
             }
           
             param.ordersType   = this.formItem.buyType
             param.ordersNoLike = this.formItem.orderNo
             param.userId       = this.$global.adminInfo.id;
             param.pageSize     = this.formItem.length;
             param.bankJgId     = this.formItem.bankJgId;
             param.engineering    = this.formItem.engineering ;  //工程名称
             param.payMoneyStatus = this.formItem.moneyStatus//付款状态
             console.log("查询"+this.$global.adminInfo.id +"_"+this.$global.adminInfo.cname)
            this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         findOrdersAll(param).then(res=>{
            if(res.code =="100"){
              res.data.list.map(item=>{
                item.fenge = '|'
              })
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            this.$Message.success("获取列表数据成功")
          }else{
            this.$Message.error("获取列表数据失败")
          }  
        })
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
      getDian(item){
        if(item){
          this.formItem.shopOrgName = item.label;
        this.formItem.shopOrgId = item.value;
        }else{
        this.formItem.shopOrgName = '';
        this.formItem.shopOrgId = '';
        }
        
       },
    },
    
    mounted(){
    this.searchM();
    this.getShop();
    this.getGongcheng();//获取工程名称
   
    },
    created(){
        //监听刷新
      var that = this;
      Utils.$on('buy_order_list',function(msg){
       if(msg == "reload"){
         console.log("重新查询数据")
         that.searchM();
       }
     })
    },
}

</script>
<style <style lang="less">

      #apop .ivu-card-body{
        padding-top:0px!important;
      }
      // 让表格紧凑，并宽度统一
     #wnag .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {
        padding: 0 2px;
      }
       #wnag .vxe-table.size--mini .vxe-body--column{
         height:20px;
       }
    
</style>

