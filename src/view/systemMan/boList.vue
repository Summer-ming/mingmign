<!--
 * @Description: 采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div>
     <Card :border="false" :dis-hover="true" id='apop'>  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form inline :model="formItem" :label-width="80">
        <Row>
          <FormItem label="供应商公司名称:" style="margin-right:10px;margin-bottom:0px!important;height: 35px;">
             <Select v-model="formItem.companyName"  style="width:200px" 
             filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          <!-- <Input style="width:140px"  placeholder="请输入公司名称" v-model="formItem.companyName"></Input> -->
          </FormItem>
           <FormItem label="订单号:" style="margin-right:10px;margin-bottom:0px!important;">
             <Input style="width:140px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
          <FormItem label="订单类型:" style="margin-right:10px;margin-bottom:0px!important;">
            <Select  v-model='formItem.buyType' style="width:140px" placeholder="请选择订单购买类型" @on-change='getChange'>
              <Option  v-for='(item,index) in buyTypeListThis' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="订单状态:" style="margin-right:10px;margin-bottom:0px!important;">
            <Select  v-model='formItem.orderStatus' style="width:140px" placeholder="请选择订单状态" >
              <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="每页显示:" style='margin-bottom:0px!important;'>
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
          <FormItem label="公司抬头:" style='margin-bottom:0px!important;'>
            <Select v-model="formItem.bankJgId"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label='下单时间' style='margin-bottom:0px!important;'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>
          <FormItem label="工程名称:" style="margin-right:10px;margin-bottom:13px!important;">
            <el-select size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
             <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
              </el-option>
            </el-select>
          </FormItem>
          <br>
          <i-Col span="24"  >
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
               <Button type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>
             <Poptip trigger="hover" title="说明：" content="	剩余应付金额=合同金额-已付金额，在未实提前||实提后 剩余应付金额=结算金额-已付金额">
               <Icon type="ios-help-circle-outline" size="30"  />
             </Poptip>
             <br>

          </i-Col>
        </Row>
        <Table height="440" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            
        </Table>

        <Page show-elevator :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
        <div style='flex:1'>
            <Button style="margin-right:10px"  icon="md-add" type="primary" @click='addNew'>新增库存采购单</Button>
            <Button style="margin-right:10px"  icon="md-add" type="warning" @click='addNew2'>新增快速打款单</Button>
            
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
import {buyTypeList,orderStatusList,lengthList,belongCompanyList} from '@/libs/global_type'
import {getBuyTypeLabel} from '@/libs/status_type_color'
import { getBuyOrderStatus,getBuyOrderIsInStockStatus,getBuyOrderIsInvoiceStatus,getBuyOrderIsPayMoneyStatus} from '@/libs/allStatus'
import { setTimeout } from 'timers';
import Utils from '@/api/middle'
export default {
    name: 'boList',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
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
          companyName:'',
          buyType:'',
          orderNo:'',
          orderStatus:"",
          length:10,
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
          columns4: [
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'30',
                        fixed:"left",
                    },
                      {
                        title: '下单时间',
                        key: 'createTime',
                        align: 'center',
                        width:'90',
                        fixed:"left",
                        render:(h,params) =>{
                          return  h('div',{
                            style:{
                            
                              color: 'red'
                            }

                          },params.row.createTime.substr(0,10))
                        }


                    },
                    {
                        title: '订单号',
                        key: 'ordersNo',
                        align: 'center',
                        width:'160',
                        fixed:"left",
                        render:(h,params) =>{
                          return h('a',{
                            on:{
                                click: () => {
                                         this.pushOrderInfo(params)
                                                
                                        }
                            }
                          },params.row.ordersNo);
                        }
                    },
                    {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'100',
                        fixed:"left",
                        render:(h,params) =>{
                          return  h('div',{

                          },params.row.customerOrgName.substr(0,5))
                        }
                    },
                    {
                        title: '供应商名称',
                        key: 'shopOrgName',
                         align: 'center',
                        width:'160',
                        fixed:"left",
                         render:(h,params) =>{
                          return h('a',{
                            on:{
                                click: () => {
                                              localStorage.setItem('a',true)
                                              const route = {
                                                  name: 'Supplier_business',
                                                  query:params.row

                                                }
                                                this.$router.push(route)
                                        }
                            }
                          },params.row.shopOrgName);
                        }

                    },
                      {
                        title: '合同金额(元)',
                        key: 'moneyAll',
                        align: 'center',
                        width:'100',
                        fixed:"left",
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.moneyAll))
                        }
                    },
                    {
                        title: '合同重量(吨)',
                        key: 'zhongliangAll',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.zhongliangAll,3))
                        }
                    },
                    {
                        title: '实提重量(吨)',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                        }
                    },
                      {
                        title: '实提总货款(元)',
                        key: 'deliveryTotalMoneyCus',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.deliveryTotalMoneyCus))
                        }
                    },
                    
                    {
                        title: '工程名称',
                        key: 'gongcheng',
                        align: 'center',
                        width:'250'
                    },
                     {
                        title: '采购类型',
                        key: 'buyType',
                        align: 'center',
                        width:'80',
                        render:(h,params)=>{
                          return h('div',{
                          },getBuyTypeLabel(params.row.buyType))
                        }
                    },
                     {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width:'100',
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
                        title: '付款状态',
                        key: 'payMoneyStatus',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },getBuyOrderIsPayMoneyStatus(params.row.payMoneyStatus))
                        }
                    },
                       {
                        title: '入库状态',
                        key: '',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },getBuyOrderIsInStockStatus(params.row.status))
                        }
                    },
                       {
                        title: '开票状态',
                        key: '',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },getBuyOrderIsInvoiceStatus(params.row.status))
                        }
                    },
                  
                     {
                        title: '管理员',
                        key: 'userName',
                       align: 'center',
                        width:'60'
                    },
                    //剩余应付金额 = 合同金额 - 已付金额；
                    {
                        title: '已付金额(元)',
                        key: 'receivedMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.receivedMoney))
                        }
                    },
{
                        title: '剩余应付金额(元)',
                        key: '',
                        align: 'center',
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
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'120',
                       
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                          this.pushOrderInfo(params);
                                        }
                                    }
                                }, '查看'),
                                  h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                          this.changeModal = true;
                                          this.changeItem.ordersNo    = params.row.ordersNo;
                                          this.changeItem.id          = params.row.id;
                                          this.changeItem.engineering = params.row.gongcheng;

                                        }
                                    }
                                }, '修改'),
                             ]);
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
      pushOrderInfo(params){
        sessionStorage.setItem('CAIGOU','')
       sessionStorage.setItem('CAIGOU',JSON.stringify(params.row))
        params.row.operateType  ="1"//查看
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
             param.engineering    = this.formItem.engineering;  //工程名称
             console.log("查询"+this.$global.adminInfo.id +"_"+this.$global.adminInfo.cname)
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         findOrdersAll(param).then(res=>{
            if(res.code =="100"){
             
            this.data1=res.data.list;
            this.totalM=res.data.total; 
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
       
        this.formItem.shopOrgName = item.label;
        this.formItem.shopOrgId = item.value;
       },
    },
    
    mounted(){
    this.searchM();
    this.getShop();
     this.getGongcheng();//获取工程名称
     //监听刷新
      var that = this;
      Utils.$on('buy_order_list',function(msg){
       if(msg == "reload"){
         that.reload();
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
      .ivu-table-small td {
        height:27px!important;
      }
      #apop .ivu-card-body{
        padding-top:0px!important;
      }
</style>

