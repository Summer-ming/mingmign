<!--
 * @Description: 采购单汇总
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='padidng_m'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <iCol span="24">
               <!-- 新增工程名称 -->
          <FormItem label="工程名称:" style="width:300px;height:32px;" >
               <!-- ingput -->
               <el-input size='small' v-model="filterText" placeholder="请输入内容" @focus='getFoucus' >

               </el-input>

               <div style="position: absolute;width:1000px;"   v-if='showDisplay'>
                  <div style="z-index:200;position: absolute;background-color:white;width:100%">
                      <Button size='small'   v-if='showDisplay' style="" type="primary"  @click="selectTree()">确定</Button>
                      <Button size='small'  v-if='showDisplay' style="margin-left:4px;" type="warning"  @click="closeTree()">取消</Button>
                  </div>
                 
                    <!-- 搜索下拉 -->
                    <el-tree style="margin-top:30px;z-index:200;height:200px;overflow-y: scroll;" v-if='showDisplay'
                        class="filter-tree"
                        :data="newGong"
                        :props="defaultProps"
                        show-checkbox
                        node-key="id"
                        :filter-node-method="filterNode"
                        ref="tree2">
                      </el-tree>
               </div>
          </FormItem>
          <FormItem label="订单号:" style="margin-right:10px;">
          <Input clearable style="width:200px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
           <FormItem label="供应商查询:">
            <Select clearable v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
           

            <FormItem label='下单时间'>
              <DatePicker transfer @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>
           
          <FormItem label="管理员查询:">
            <Select clearable v-model="adminSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
      
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
     
         
           <FormItem label="订单状态:" style="margin-right:10px;">
            <Select  v-model='formItem.orderStatus' style="width:200px" placeholder="请选择订单状态" >
              <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="公司抬头:">
            <Select v-model="formItem.bankJgId"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
         
          </iCol>
        
          <Col span="24">
             <Button  type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button style="margin-left:4px" shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
               <Button style="margin-left:4px" type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>

               <Button style="margin-left:4px" type="primary"  @click="duiZhang()">设定对账批次</Button>

             <Tooltip content="结算差额 = 合同金额 - 实提金额-收款金额" placement="top-start">

              <Button shape="circle" icon="md-help" ></Button>
             </Tooltip>

          </Col>
          <Col span="24">
              <time>合同总重量：</time>
              <time >{{this.$global.accPrecision(tItem.contractWeight,3)}}</time>吨
              <time style="margin-left:20px">合同总金额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.contractMoney)}}</time>元
              <br>
              <time >实提总重量：</time>
              <time>{{this.$global.accPrecision(tItem.actualWeight,3)}}</time>吨

               <time style="margin-left:20px">实提总金额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.actualMoney)}}</time>元
              <time style="margin-left:20px">已付总金额</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.receivedMoney)}}</time>元
              <time style="margin-left:20px">差额</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.chaMoney)}}</time>元
              <br/>
              <time style="">已收票重量：</time>
              <time style="color:red">{{this.$global.accPrecision(tItem.TinvoiceWeight,3)}}</time>吨
              <time style="margin-left:20px">已收票金额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.TinvoiceMoney)}}</time>元
          </Col>
        </Row>
        <!-- <Table height="400" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
          
        </Table> -->

        <!-- 新增table -->
         <vxe-toolbar  style='padding:0;'
          setting
          :refresh="{query:data1 }"></vxe-toolbar>
     <vxe-table height="500" border show-footer  resizable class="vxe-table-element" size="mini" ref="xTable1" 
           :data.sync="data1" :footer-method="footerMethod"  @select-change="selectChangeEvent"   @select-all='selentAll'
           >
                <vxe-table-column type="selection" width="30"></vxe-table-column>
                <vxe-table-column width="45" field="id" title="ID" ></vxe-table-column>
                <vxe-table-column width="200" field="ordersNo" title="采购单号" >
                  <template v-slot="{row}">
                        <a    @click='pushOrderInfo(row)' type="primary">{{row.ordersNo}}</a>
                    </template>
                </vxe-table-column>

                 <vxe-table-column width="75" field="duizhangTimes" show-overflow title="对账批次" ></vxe-table-column>
                <vxe-table-column width="100" field="gongcheng" show-overflow title="工程名称" ></vxe-table-column>
                <vxe-table-column sortable  width="80" field="createTime" title="下单时间"  show-overflow>
                            <template v-slot="{row}">
                              <span style="color:red">{{row.createTime.substr(0,10)}}</span>
                            </template>
                </vxe-table-column>
                <vxe-table-column width="100" field="shopOrgName" show-overflow title="供应商名称" ></vxe-table-column>
                <vxe-table-column align='right' width="100" field="moneyAll" show-overflow title="采购合同金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column align='right' width="100" field="receivedMoney" show-overflow title="付款金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column align='right' width="100" field="deliveryTotalMoneyCus" show-overflow title="实提金额" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
                <vxe-table-column align='right' width="100" field="jiesuanMoney" show-overflow title="结算差额" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
                <vxe-table-column width="60" field="customerOrgName" show-overflow title="公司抬头" ></vxe-table-column>
                <vxe-table-column align='right' width="100" field="zhongliangAll" show-overflow title="采购合同吨位" :formatter="this.$global.vxeTableWeight"></vxe-table-column>
                <vxe-table-column align='right' width="100" field="deliveryTotalWeight" show-overflow title="实提吨位" :formatter="this.$global.vxeTableWeight"></vxe-table-column>
                <vxe-table-column width="60" field="userName" show-overflow title="管理员" ></vxe-table-column>
                <vxe-table-column align='right' width="100" field="dikouSmoney" show-overflow title="抵扣金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column align='right' width="100" field="tixianSMoney" show-overflow title="提现金额" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
                <vxe-table-column align='right' width="100" field="skSmoney" show-overflow title="收款金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column width="100" field="status" title="状态" :formatter='this.$global.vexStatus'></vxe-table-column>
                <vxe-table-column align='right' width="100" field="invoiceWeightShop" show-overflow title="已收票吨位" :formatter="this.$global.vxeTableWeight"></vxe-table-column>
                <vxe-table-column align='right' width="100" field="invoiceMoneyShop" show-overflow title="已收票金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column align='right' width="100" field="invoiceNumberShop" show-overflow title="已收票号码" ></vxe-table-column>

                <!-- <vxe-table-column width="60" field="gongcheng" show-overflow title="工程名称" ></vxe-table-column> -->
              
            </vxe-table>
        <!-- 结束 -->

        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     <!-- 弹窗 -->
     <Modal
        v-model="modal1"
        title="设定对账批次"
        
        :footer-hide='true'
       >
        <Form :model="formItem1" inline :label-width="100" >

            <FormItem label='本次勾选:'>
                    <p style='color:red'>{{formItem1.timeGou}}笔</p>
            </FormItem>
        

            <FormItem label='勾选总实提金额:'>
                    <p style='color:red'>{{shiTiMoney}}(元)</p>
            </FormItem>
          

            <FormItem label='其中已对账订单数:'>
                    <p style='color:red'>{{formItem1.timeOne}}</p>
            </FormItem>
       


          <FormItem style="margin-top:20px" label='对账批次'>
               <DatePicker v-model='formItem1.duiTime' @on-change="changeDuiZhangTime" format="yyyy-MM-dd" type="date" placeholder="选择年月" style="width: 200px"></DatePicker>
            <!-- <Input type="textarea" style='width:300px' v-model='formItem1.duiTime' placeholder='请输入对账批次'/> -->
          </FormItem>

           <FormItem style="margin-top:20px" label='对账备注'>
            <Input type="textarea" style='width:300px' v-model='formItem1.duiNote' placeholder='请输入对账备注'/>
          </FormItem>
          
        </Form>
        <div>
            <Button    type="primary"  @click='getQue'>确定</Button>
            <Button  type="default" style="margin-left:10px" @click="modalCancel">取消</Button>

        </div>
    </Modal> 
     <!-- 结束 -->

     </div>
</template>

<script>
import {findOrdersAll,
findShop,
findOrgCusAcc,
getUserList,
findOrdersAllSum,findOrderEngineering,updateOrderStatus,xiangMu} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel,getBuyOrderStatus} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,orderStatusList,belongCompanyList} from '@/libs/global_type'

import XEUtils from 'xe-utils'
import Treeselect from '@riophae/vue-treeselect'
  // import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
    name: 'buy_order_summary_list',
    inject:['reload'],  //調用組建app.vue
     components: { Treeselect },
    data(){
      return {
        
        //开始
        gongStr:'',
        gongM:[],
        dataTree:[],
        filterText:'',
        showDisplay:false,
        valueConsistsOf:"LEAF_PRIORITY",
        newGong:[],//
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        //结束
        shiTiMoney:"",//勾选的实提金额
        selectLength:'',
        modal1:false,
        formItem1:{
           timeGou:"",//勾选的笔数
          
           timeOne:'',//其中已对账订单数
           duiTime:"",//对账批次
           duiNote:"",//对账批次备注
        },
        belongCompanyListThis:belongCompanyList,
        engineerNameList:[],//工程名称数组
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
        tItem:{
          contractWeight : 0,
          contractMoney :0,
          actualWeight:0,
          actualMoney:0,
          receivedMoney:0,
          chaMoney:0,
          TinvoiceMoney:0,
          TinvoiceWeight:0,
        },
        tableItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          gongchengInput:"",//input
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:20,
          orderNo:'',
          engineering:'',
          bankJgId:'',
          orderStatus:''
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
  
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
     closeTree(){
       this.filterText = '';
         this.showDisplay=false;
     },
      selectTree(){
         this.showDisplay=false;
         if(this.$refs.tree2.getCheckedNodes().length>0){
            this.getSelectTree();

        }

      },
      //开始
       filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
    
      //获取焦点
      getFoucus(event){
        console.log('获取焦点')
         console.log(event)
        
         this.showDisplay=true;
      
      },

      //获取工程名称
      getGp(){
        let p={};
        p.pageSize=999;
        p.status=1;
        p.merge=1;
        xiangMu(p).then(res=>{
          if(res.code =="100"){
             console.log('我是请求的数据')
             console.log(res)
             let dataGong=[];
             dataGong=this.getCon(res.data.list);
             this.newGong=dataGong;
          }
        })
      },
      //递归处理数据
      getCon(tree){
         let arr = [];
         if(!!tree && tree.length !== 0){
            tree.forEach(item => {
              this.newGong.push(item);
              let obj = {};
              obj.label = item.cname;
              obj.id=item.id;
              // obj.isDefaultExpanded = true;
              obj.level = item.level;
              if(item.children!=null){
                obj.children = this.getCon(item.children);
              }
              arr.push(obj);   
            });
          }
          return arr;
      },
     //结束
      //确定提交
      getQue(){
            let param={pageUpdateOrderList:[]};
            let dataSelectOne=this.$refs.xTable1.getSelectRecords()
            dataSelectOne.map((item)=>{
              let dic={};
              dic.id=item.id;
              dic.duiZhangTimes=this.formItem1.duiTime;
              dic.duiZhangNote=this.formItem1.duiNote;
              dic.duiZhangStatus='8';
              param.pageUpdateOrderList.push(dic)
            })
           
            console.log(param)
            updateOrderStatus(param).then(res=>{
            if(res.code =="100"){
                  this.$Notice.success({
                    title:'修改成功',
                    onClose:res =>{
                      
                    }
                 })
                this.modal1=false;
                this.searchM()
          }  
         })
      },
     //设定对账批次
     duiZhang(){
       if(this.$refs.xTable1.getSelectRecords().length !=0){
              this.modal1=true;
       }
     },
     //获取选中数据
     getHuo(){
        let zong=0;
        let kong=[];
        let dataSelect=this.$refs.xTable1.getSelectRecords()
        this.formItem1.timeGou=this.$refs.xTable1.getSelectRecords().length//选中的长度
        dataSelect.map((item)=>{
           zong += Number(item.deliveryTotalMoneyCus)
           if(item.daoZhangTime !=null){
               kong.push(item.daoZhangTime)
           }
           this.formItem1.timeOne=kong.length;
        })
        this.shiTiMoney=zong
        console.log(dataSelect)

     },
     //选中
     selectChangeEvent(){
       this.getHuo();
     },
     //全选
     selentAll(){
       this.getHuo();
     },
     //取消弹窗
     modalCancel(){
       this.modal1=false;
     },

      //====
    pushOrderInfo(row){
        row.operateType  ="1"//查看
        sessionStorage.setItem('CAIGOU','')
        sessionStorage.setItem('CAIGOU',JSON.stringify(row))
           const route = {
               name: 'order_buy_info',
             }
             this.$router.push(route)
    },
     footerMethod({columns,data}){
        return [
          columns.map((column,columnIndex)=>{
            if(columnIndex === 0){
              return '当页合计'
            }
            if(['zhongliangAll','deliveryTotalWeight'].includes(column.property)){
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),3)//重量3位小数

            }
            if(['jiesuanMoney','receivedMoney','deliveryTotalMoneyCus',
            'dikouSmoney','tixianSMoney','skSmoney'].includes(column.property)){
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property)) //金额自动2位小数，并千分位

            }

          })
        ]
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
  exportData(){//导出到excel

        this.$refs.xTable1.exportCsv({
          filename:"导出excel"
        })
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
        this.shopOrgName =item?item.label:'';
        this.shopOrgId = item?item.value:'';
       },
       changeDuiZhangTime(data){
         console.log(data);
         this.formItem1.duiTime = data;
       },
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0]?(data[0] +' 00:00:00'):'';
        this.formItem.endTime  =data[1]?(data[1]+' 24:00:00'):'';
        
      },
      propsClick(){
        this.reload();
      },
      getAdmin(item){
        this.adminSearchId = item?item.value:'';
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
       getSelectTree(){
         this.showDisplay=false;
         console.log("报错起始点")
         if(!this.$refs.tree2){
           return false;
         }
         let aTree = this.$refs.tree2.getCheckedNodes();
         console.log(aTree);
         let selectTree = [];
         aTree.map(item=>{
            if(item.level =="2"){
              selectTree.push(item.label);
            }
         })
         this.formItem.engineering = selectTree;
         let gong='';
       
       if(this.formItem.engineering==''){
         gong=''
       }else{
        this.formItem.engineering.map((item)=>{
                gong+=("'"+item+"'"+',')
        })
        gong = gong.substr(0,gong.length-1);
       }
       console.log("选择完成")
       if(gong==''){
         this.$Message.warning("当前集团下无具体工程")
       }
       this.gongStr = gong;
         this.filterText = gong
       },
       //查询表格
       searchM(){
           this.getSelectTree();

         //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum        = this.pagesizea              //分页
         param.userId         = this.adminSearchId          //管理员查询
         param.pageSize       = this.formItem.length;
         param.engineeringString    = this.gongStr;  //工程名称
         param.ordersNoLike   = this.formItem.orderNo       //订单号
         param.orderShopOrgId = this.shopOrgId              //供应商
         param.beginTime      = this.formItem.beginTime     //创建时间 
         param.endTime        = this.formItem.endTime       //供应商
         console.log(this.formItem.orderStatus);
          //根据订单状态查询
             if(this.formItem.orderStatus == "1"){
               param.beginStatus = 1 ;
              param.endStatus   = 1 ;
             }
             else if( this.formItem.orderStatus=="") {
                //默认查询 1到90的
             param.beginStatus = -1 ;
             param.endStatus   = 90 ;
             }
             else if(this.formItem.orderStatus == "2"){
               param.beginStatus = 2 ;
                param.endStatus   = 7 ;
             }else {
               param.beginStatus = this.formItem.orderStatus ;
                param.endStatus   = this.formItem.orderStatus ;
             }
             param.bankJgId = this.formItem.bankJgId;
           findOrdersAll(param).then(res=>{
            if(res.code =="100"){

            
            this.totalM=res.data.total; 
            this.data1=res.data.list;

            this.data1.map((item)=>{
              //计算 结算差额 = 入金额 - 出金额；一般为 实提金额 - 打款金额
                
                let b =  this.$global.accAdd(item.deliveryTotalMoneyCus,item.skSmoney);//入金额，实提金额
                let a =this.$global.accAdd(item.receivedMoney,item.tixianSMoney)//出金额， 打款金额
                  let  ad = this.$global.accAdd(a,item.dikouSmoney)
                let c = this.$global.accMinus(b,ad)
                item.jiesuanMoney=c
            })

            this.getOrderInfoTotal(param);
           
          }  
         })
          
       },
       getOrderInfoTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findOrdersAllSum(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data.list[0];
              if(dic!=null){
                 this.tItem.contractWeight = dic.zhongliangAll;
                 this.tItem.contractMoney  = dic.moneyAll;
                 this.tItem.actualWeight   = dic.deliveryTotalWeight;
                 this.tItem.actualMoney    = dic.deliveryTotalMoneyCus;
                 this.tItem.receivedMoney  = dic.receivedMoney;
                  this.tItem.chaMoney = this.$global.accMinus(this.tItem.actualMoney,this.tItem.receivedMoney)//实提 - 已付

                 this.tItem.TinvoiceWeight  = dic.invoiceWeightShop;
                 this.tItem.TinvoiceMoney  = dic.invoiceMoneyShop;

              }
             

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
     this.getGongcheng();//获取工程名称
     this.searchM();
     this.getGp();
     this.getShop();
     this.getAdminList();
     var that = this;
     Utils.$on('demo',function(msg){
       if(msg == "reload"){
        that.propsClick();
       }
     })
    },
     watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    created(){
   
    },
}

</script>
<style <style lang="less">
 #padidng_m .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0px!important;
      }
  #padidng_m .vxe-table .vxe-body--column{
        line-height:20px!important;
      }
   #padidng_m .vxe-table .vxe-cell {
      padding: 0 2px;
      }
      .ivu-form-item{
        margin-bottom: 5px;
      }
     
      #padidng_m  .ivu-form-item-content{
            line-height:20px!important;
      }
      .vue-treeselect__control{
        z-index: 200!important;
      }
     
</style>
