<!--
 * @Description: 销售单汇总
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='ming'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
          <!-- <FormItem label="工程名称:" style="margin-right:10px;">
               <el-select size="small"  style="width:200px" v-model="formItem.engineering"  multiple clearable  filterable  default-first-option placeholder="请输入工程名称">
                <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                  </el-option>
              </el-select>
          </!--> 
          <!-- 新增工程名称 -->
        <FormItem label="工程名称:" style="width:300px;height:32px;" >
               <!-- ingput -->
               <el-input size='small' v-model="filterText" placeholder="请输入内容" @focus='getFoucus' >

               </el-input>

               <div style="position: absolute;width:1000px;"   v-if='showDisplay'>
                  <div style="z-index:200;position: absolute;background-color:white;width:100%">
                      <Button size='small'   v-if='showDisplay' style="" type="primary"  @click="selectTree()">确定</Button>
                      <Button size='small'   v-if='showDisplay' style="" type="primary"  @click="selectTree111()">确定111111</Button>
                      <Button size='small'  v-if='showDisplay' style="margin-left:4px;" type="warning"  @click="closeTree()">取消</Button>
                  </div>
                 
                    <!-- 搜索下拉 -->
                    <el-tree style="margin-top:30px;z-index:200;height:200px;overflow-y: scroll;" v-if='showDisplay'
                        class="filter-tree"
                        :data="newGong"
                        :props="defaultProps"
                        show-checkbox
                        node-key="id"
                        :default-checked-keys="[]"
                        :filter-node-method="filterNode"
                        ref="tree2">
                      </el-tree>
               </div>
          </FormItem>

          <FormItem label="订单号:" style="margin-right:10px;">
          <Input style="width:200px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
           <FormItem label="客户查询:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
            <FormItem label='收货时间'>
              <DatePicker transfer @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>
           
          <FormItem label="管理员查询:">
            <Select v-model="adminSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
          
           <FormItem label="订单状态:" style="margin-right:10px;">
            <Select   v-model='formItem.orderStatus' style="width:200px" placeholder="请选择订单状态" >
              <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="公司抬头:">
            <Select v-model="formItem.bankJgId"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
        
          </Col>
        
          <Col span="24">
             <Button size='small' type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button size='small' style="margin-left:4px" shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
             <Button size='small' style="margin-left:4px" type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>
             <Tooltip content="结算差额 = 合同金额 - 实提金额" placement="top-start">
              <Button size='small' style="margin-left:4px" shape="circle" icon="md-help" ></Button>
             </Tooltip>
               <Button size='small' style="margin-left:4px" type="primary"  @click="duiZhang()">设定对账批次</Button>

          </Col>
          <Col span="24">
              <time>合同总重量：</time>
              <time >{{this.$global.accPrecision(tItem.contractWeight,3)}}</time>吨
              <time style="margin-left:30px">合同总金额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.contractMoney)}}</time>元
              <br>
              <time >结算总重量：</time>
              <time>{{this.$global.accPrecision(tItem.actualWeight,3)}}</time>吨

               <time style="margin-left:30px">结算总金额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.actualMoney)}}</time>元

              <time style="margin-left:20px">已收总金额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.receivedMoney)}}</time>元 
              <time style="margin-left:20px">差额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.chaMoney)}}</time>元
              <br>
                  <time >杂费总金额：</time>
                  <time style="color:red">{{this.$global.isMoneyShow(tItem.otherMoney)}}</time>元
                  <time style="margin-left:20px">杂费已付金额：</time>
                  <time style="color:red">{{this.$global.isMoneyShow(tItem.payOtherMoney)}}</time>元
                  <time style="margin-left:20px">杂费优惠金额：</time>
                  <time style="color:red">{{this.$global.isMoneyShow(tItem.otherDikouMoney)}}</time>元
               <br/>
              <time style="">已收票重量：</time>
              <time style="color:red">{{this.$global.accPrecision(tItem.TinvoiceWeight,3)}}</time>吨
              <time style="margin-left:20px">已收票金额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.TinvoiceMoney)}}</time>元
                <br>
               <time style="">利息总额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.Tlixi)}}</time>元

               <time style="margin-left:20px">货物总额：</time>
              <time style="color:red">{{this.$global.isMoneyShow(tItem.Thuoqu)}}</time>元
          </Col>
          
        </Row>
        <!-- <Table height="400" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table> -->
        <!-- 开始 -->
               <!-- 新增table -->
         <vxe-toolbar  style='padding:0;'
          setting
          :refresh="{query:data1 }"></vxe-toolbar>
           <vxe-table height="450" border show-footer resizable class="vxe-table-element"  @select-change="selectChangeEvent"   @select-all='selentAll' size="mini" ref="xTable1" :footer-method="footerMethod" :data.sync="data1">
             <vxe-table-column type="selection" width="30"></vxe-table-column>
             <vxe-table-column width="40" field="id" title="ID" ></vxe-table-column>
             <vxe-table-column width="85" field="duizhangTimes" show-overflow title="对账批次" ></vxe-table-column>
            <vxe-table-column sortable  width="100" field="createTime" title="收货时间" show-overflow >
                  <template v-slot="{row}">
                              <span style="color:red">{{row.createTime.substr(0,10)}}</span>
                   </template>
            </vxe-table-column>
             <vxe-table-column width="200" field="ordersNo" title="销售单号" show-overflow  >
                       <template v-slot="{row}">
                              <a @click='getTiao(row)' style="color:blue">{{row.ordersNo}}</a>
                        </template>
             </vxe-table-column>
             <vxe-table-column width="60" field="gongcheng" show-overflow title="工程名称" ></vxe-table-column>
             

           <vxe-table-column width="100" field="customerOrgName" show-overflow title="客户名称" ></vxe-table-column>
           <vxe-table-column width="100" align='right' field="moneyAll" show-overflow title="销售合同金额" :formatter="this.$global.vxeTableMoney"  ></vxe-table-column>
           <vxe-table-column width="100" align='right' field="deliveryTotalMoneyCus" show-overflow title="结算金额" :formatter="this.$global.vxeTableMoney"  ></vxe-table-column>
           <vxe-table-column width="100" align='right' field="receivedMoney" show-overflow title="已收金额" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
           <vxe-table-column width="100" align='right' field="chaMoney" show-overflow title="结算差额" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
           <vxe-table-column sortable  width="100" field="shopOrgName" title="公司抬头" show-overflow >
                  <template v-slot="{row}">
                              <span style="color:red">{{row.shopOrgName}}</span>
                   </template>
            </vxe-table-column>
            <vxe-table-column width="100" align='right' field="zhongliangAll" show-overflow title="销售合同吨位" :formatter="this.$global.vxeTableWeight" ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="deliveryTotalWeight" show-overflow title="结算吨位" :formatter="this.$global.vxeTableWeight" ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="otherMoney" show-overflow title="杂费金额" :formatter="this.$global.vxeTableMoney"  ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="payOtherMoney" show-overflow title="杂费已付金额" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="otherDikouMoney" show-overflow title="杂费优惠金额" :formatter="this.$global.vxeTableMoney"  ></vxe-table-column>
            <vxe-table-column width="100" field="userName" show-overflow title="管理员" ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="dikouSmoney" show-overflow title="抵扣金额"  :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="tixianSMoney" show-overflow title="打款金额"  :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="skSmoney" show-overflow title="打款金额1" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
            <vxe-table-column width="140" field="status" title="状态" :formatter='this.$global.vexStatus'></vxe-table-column>

            <vxe-table-column width="100" align='right' field="invoiceWeightCus" show-overflow title="已开发票重量" :formatter="this.$global.vxeTableWeight" ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="invoiceMoneyCus" show-overflow title="已开发票金额" :formatter="this.$global.vxeTableMoney"  ></vxe-table-column>
            <vxe-table-column width="100" field="invoiceNumberCus" show-overflow title="已开发票号" ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="realMoney" show-overflow title="实提金额"  :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
            <vxe-table-column width="100" align='right' field="interestMoney" show-overflow title="利息金额"  :formatter="this.$global.vxeTableMoney" ></vxe-table-column>

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
import {
findShop,
findOrgCusAcc,
getUserList,findOrderEngineering,xiangMu
} from '@/api/data'
import {findOrdersAll,findOrdersAllSum89,updateOrderStatus} from '@/api/data_8889'
import {getReceiptStatusLabel,getInvoiceStatusLabel,getBuyOrderStatus} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,orderStatusList,belongCompanyList} from '@/libs/global_type'
import XEUtils from 'xe-utils'

export default {
    name: 'sell_order_summary_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        setMm:[],
        gongStr:'',
        filterText:'',
        newGong:[],//工程名称新的定义
        showDisplay:false,
        defaultProps: {//tree 控件引用的
                  children: 'children',
                  label: 'label'
                },
        elTree:false,
        defaultProps:{
          children: 'children',
          label: 'label'
        },
        engineerNameListTest:[
        
        ],
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
        shopList:[],
        engineerNameList:[],//工程名称数组
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
          otherMoney:0,
          payOtherMoney:0,
          otherDikouMoney:0,
          receivedMoney:0,
          chaMoney:0,
          TinvoiceMoney:0,
          TinvoiceWeight:0,
          Tlixi:0,
          Thuoqu:0,
        },
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
          engineering:'',
          bankJgId:'',
          orderStatus:'',
          eTest:''
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
       //获取焦点
      getFoucus(event){
        console.log('获取焦点')
         console.log(event)
        
         this.showDisplay=true;
      
      },
       //获取焦点
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
      //测试点击筛选选中
      selectTree111(){
           console.log('选中的数据')
           console.log(this.newGong)
           console.log(this.filterText)
         
      },

      getFoucus(event){
        console.log('获取焦点')
         console.log(event)
        
         this.showDisplay=true;
      
      },
      //筛选
       filterNode(value, data,node) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
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
             let dataGong={};
           
            // dic.children=res.data.list
             dataGong=this.getCon(res.data.list);
             this.newGong = dataGong
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
      showTreeSelect(){
        console.log("聚焦了")
        this.$Message.success("输入框聚焦了")
        this.elTree = !this.elTree;
      },
          changeDuiZhangTime(data){
         console.log(data);
         this.formItem1.duiTime = data;
       },
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



      getTiao(row){
          row.operateType  ="1"//查看
          sessionStorage.setItem('XiaoShou','')
          sessionStorage.setItem('XiaoShou',JSON.stringify(row))
            const route = {
                       name: 'sell_order_info',
                    // query: params.row
                }
                      this.$router.push(route)
                     
      },
       //新增
      footerMethod({columns,data}){
        return [
          columns.map((column,columnIndex)=>{
            if(columnIndex === 0){
              return '当页合计'
            }
             if(['zhongliangAll','deliveryTotalWeight'].includes(column.property)){
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),3)

            }
            if(['otherMoney','moneyAll','deliveryTotalMoneyCus','realMoney','interestMoney','receivedMoney'].includes(column.property)){
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property))

            }

          }),
          // columns.map((column, columnIndex) => {
          //         if (columnIndex === 0) {
          //           return '和值'
          //         }
          //         if (['moneyAll','otherDikouMoney'].includes(column.property)) {
          //           return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)
          //         }
          //         return null
          //       })
              
        ]
      },
       //查询工程
      getGongcheng(buyOrgName){
        let p  ={};
        p.pageSize ="99999"
        p.cusOrgName = buyOrgName;
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
        param.orgRoleType = "1";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
        getDian(item){
        this.shopOrgName = item.label;
        this.shopOrgId = item.value;
        //选择公司名称后再次获取 公司对应的工程名称
        this.engineerNameList = [];
        this.getGongcheng(item.label);
       },
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';
      },
      propsClick(){
        this.reload();
      },
      getAdmin(item){
        this.adminSearchId = item.value;
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
         this.getSelectTree();

         //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum     = this.pagesizea              //分页
         param.userId      = this.adminSearchId          //管理员查询
         param.cusMerName   = this.shopOrgName              //客户名称
         param.beginTime   = this.formItem.beginTime     //创建时间 
         param.endTime     = this.formItem.endTime       //供应商
         param.pageSize    = this.formItem.length;
         param.ordersNoLike     = this.formItem.orderNo //订单号
         param.engineeringString   = this.gongStr;//工程名称
          //根据订单状态查询
             if(this.formItem.orderStatus == "1"){
               param.beginStatus = 1 ;
              param.endStatus   = 1 ;
             }
             else if(this.formItem.orderStatus == ""){
               param.beginStatus = -1 ;
                param.endStatus   = 90 ;
             }
             else if(this.formItem.orderStatus == "2"){
               param.beginStatus = 2 ;
                param.endStatus   = 7 ;
             }
             else {
               param.beginStatus = this.formItem.orderStatus ;
                param.endStatus   = this.formItem.orderStatus ;
             }
             param.bankJgId = this.formItem.bankJgId;
           findOrdersAll(param).then(res=>{
            if(res.code =="100"){

            let alist =  res.data.list;
            this.totalM=res.data.total; 
            this.data1=alist;
        
            this.data1.map((item)=>{
              item.chaMoney=this.$global.accMinus(item.receivedMoney,item.deliveryTotalMoneyCus)
            })

            this.getOrderInfoTotal(param);
            console.log(this.$global.deleteArrNull(res.data.list));//总条数 
          }  
         })
          
       },
       getOrderInfoTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findOrdersAllSum89(param).then(res=>{
            if(res.code =="100"){
              let dic = res.data.list[0];
              if(dic!=null){
                this.tItem.contractWeight  = dic.zhongliangAll;
                this.tItem.contractMoney   = dic.moneyAll;
                this.tItem.actualWeight    = dic.deliveryTotalWeight;
                this.tItem.actualMoney     = dic.deliveryTotalMoneyCus;
                this.tItem.otherMoney      = dic.otherMoney;
                this.tItem.payOtherMoney   = dic.payOtherMoney;
                this.tItem.otherDikouMoney = dic.otherDikouMoney;
                this.tItem.receivedMoney = dic.receivedMoney;
                this.tItem.chaMoney = this.$global.accMinus(this.tItem.actualMoney,this.tItem.receivedMoney) //结算总金额 - 已收金额

                this.tItem.TinvoiceWeight = dic.invoiceWeightCus;
                this.tItem.TinvoiceMoney  = dic.invoiceMoneyCus;
                this.tItem.Tlixi          = dic.interestMoney;
                this.tItem.Thuoqu         = dic.realMoney;
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
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    mounted(){
     this.searchM();
     this.getShop();
     this.getAdminList();
    //  this.getGongcheng();//获取工程数组
     this.getGp();
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
<style <style lang="less">
  .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
             #ming .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0px!important;
      }
  #ming .vxe-table .vxe-body--column{
        line-height:20px!important;
      }
   #ming .vxe-table .vxe-cell {
      padding: 0 2px;
      }
       .ivu-form-item{
         margin-bottom:5px!important;
       }
</style>
