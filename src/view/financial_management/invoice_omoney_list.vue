<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
           <FormItem label="客户查询:">
            <Select clearable v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
           
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>

           <FormItem label="工程名称:" style="margin-right:10px;">
               <el-select style="width:240px" :transfer="true" size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                          <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-option>
                        </el-select>
          </FormItem>
          <FormItem label="打款类型">
            <Select v-model="formItem.type"  style="width:200px"  placeholder="请选择"   >
              <Option value="2">打款并收票</Option>
              <Option value="1">只打款</Option>
            </Select>
          </FormItem>
          </Col>
        
          <Col span="24">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button style="margin-left:10px" shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
             <Button style="margin-left:10px" type="primary" icon="md-add" @click="modal2=true" >新增杂费收票</Button>
               <i-col style="float:right" span='8'>本次申请总金额（元）:<span style="color:red">{{this.$global.isMoneyShow(allMprice)}}</span></i-col>

          </Col>
        </Row>
        <vxe-table height="400" border
         class="mytable-style"
         @select-change="selectChangeData"
         @select-all="selectAllEvent"  
         :select-config="{labelField: 'name', checkMethod}"
          size="mini" ref="xTable1" :data.sync="data1"  >
              
                <vxe-table-column   type="selection" width="40"></vxe-table-column>
                <vxe-table-column width="40"  type="index" ></vxe-table-column>
                <vxe-table-column width="40" field="id" title="ID" ></vxe-table-column>
                <vxe-table-column width="200" field="orgName" title="公司名称" ></vxe-table-column>
                <vxe-table-column width="200" field="sellEngineering" title="项目名称" ></vxe-table-column>
                <vxe-table-column width="200" :formatter="this.$global.vxeTableMoney" field="outMoney" title="已付金额" ></vxe-table-column>
                <vxe-table-column width="200"   field="createTime" title="创建时间" ></vxe-table-column>
                <vxe-table-column width="100"   field="key1" title="业务类型" ></vxe-table-column>
                <vxe-table-column width="80"  :formatter="payTypeList" field="type" title="付款类型" ></vxe-table-column>
                 <vxe-table-column field=""  title="操作" width="100" >
                    <template v-slot="{row}">
                      <Button  size="small" type="primary" @click="showOMInfo(row)">查看申请明细</Button>
                    </template>
                </vxe-table-column>
              </vxe-table>
            </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>
           <!-- 绑定新销项票 -->    
          <Modal v-model="modal2" title="新增进项票并绑定" footer-hide @on-visible-change='getChangeStatus'>
          <row>
            <Form :label-width="120"  :model="addFormTwo">
                      <FormItem label="发票号码:" prop="fapiaohao">
                        <i-input   style="width:300px" v-model="addFormTwo.fapiaohao1" placeholder="请输入发票号码"/>
                      </FormItem>

                      <FormItem label='公司名称'>
                          <Select style='width:200px' :placeholder="addFormTwo.placeHolderName" v-model="addFormTwo.companyName1" filterable :label-in-value='true' @on-change='getUserTwo'>
                                <Option v-for="(option, index) in shopList" :value="JSON.stringify(option)" :key="index">{{option.cusorgName}}</Option>
                            </Select>
                        </FormItem>

                      <FormItem label="发票总重量(吨):" prop="faWeight">
                        <i-input   style="width:300px" v-model="addFormTwo.faWeight1" placeholder=""/>
                      </FormItem>

                      <FormItem label="发票总金额(元):" prop="faMoney">
                        <i-input   style="width:300px" v-model="addFormTwo.faMoney1" placeholder=""/>
                      </FormItem>

                      <!-- 新增发票 -->
                       <FormItem label="发票不含税金额(元):" prop="faMoneyOne">
                        <i-input   style="width:200px" v-model="addFormTwo.faMoneyOne" placeholder=""/>
                      </FormItem>


                      <FormItem label="发票税额(元):" prop="faShui">
                        <i-input   style="width:200px" v-model="addFormTwo.faShui" placeholder=""/>
                      </FormItem>


                      <FormItem label="绑定时间:" >
                          <i-Col span="12">
                              <DatePicker type="date" @on-change='getBang' placeholder="选择时间" style="width: 300px"></DatePicker>
                          </i-Col>
                      </FormItem>

            </Form>
              

          </row>
             <div class="margin-top-20">
                <Button  style="margin-right:10px" type="primary" @click="addBtn" >添加</Button>
                
                <Button  type="default" style="margin-right:10px" @click="cancel">取消</Button>
            </div>
        </Modal>
     </div>
</template>

<script>

import {
  findOrgMoneyRecord,
  findOrgCusAcc,updateOrgMoneyRecord,findOrderEngineering
  } from '@/api/data'
import {getAddJinPiao} from '@/api/cusData'
import {getOrgMoneyRecordType,} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList} from '@/libs/global_type'
export default {
    name: 'invoice_omoney_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        engineerNameList:[],//工程名称数组
         formItem1: {
            dateTime:'',
          },
        daozhangTime:"",
        modal2:false,
        allMprice:'0',
        addFormTwo:{
           fapiaohao1:"",//发票号码
           faWeight1:"0",//发票总重量
           faMoney1:"0",//发票总金额
           bangTime1:"",//绑定时间
           companyName1:"",//公司名称
           faMoneyOne:"0",//发票不含税金额
           faShui:"0",//发票税额
           cusId:'',//公司cusid
           cusOrgId:"",//公司orgid
           orgName:'',
           bankJgId:"",
           placeHolderName:'公司名称'
         },//进项表单
        TWeight:0,
        TMoney:0,
        TjiesuanWeight:0,
        TjiesuanMoney:0,
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
        modal1:false,
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
          bankJgId:'',
          type:'2'

          },
          columns4: [],
          data1: [],//表格展示的数据
          dataCount:0,//总页数
          searchPage:1, //初始化时查询的页码数
          bangDing:''    
      }
    },
    
    methods:{
      payTypeList({cellValue, row, column}){
        switch (Number(cellValue)) {
          case 1:
            return "只打款"
          case 2:
            return "打款并收票"
          default:
            break;
        }
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
      showOMInfo(row){
        console.log(row);
        sessionStorage.setItem('SELL_OM_LIST_INFO','')
        sessionStorage.setItem('SELL_OM_LIST_INFO',JSON.stringify(row))
            const route = {
                name: 'invoice_omoney_list_info',
              }
              this.$router.push(route)
      },
      selectAllEvent(){//全选
        this.getSelectTotal();
      },
      selectChangeData(){//单选
        this.getSelectTotal();
      },
      getSelectTotal(){//获取选中的数据
          let selectData = this.$refs.xTable1.getSelectRecords();
          this.allMprice = 0;
          if(selectData.length>0){
            selectData.map(item=>{
              this.allMprice =this.$global.accAdd(this.allMprice,item.outMoney)
            })
            //赋值给弹出框
            this.addFormTwo.faMoney1 = this.$global.accPrecision(this.allMprice,2);//发票总金额
            this.addFormTwo.faMoneyOne = this.$global.accMul(this.allMprice,1.13)//不含税金额
            this.addFormTwo.faShui = this.$global.accPrecision(this.$global.accMinus(this.allMprice,this.addFormTwo.faMoneyOne),2)//税额
          }

      },
      getChangeStatus(status){
          let selectData = this.$refs.xTable1.getSelectRecords();
          let firstOrgName ='';
           if(status==true){
             if(selectData.length>0){
               firstOrgName = selectData[0].orgName;
               selectData.map((item,index)=>{
                 if(item.orgName !=firstOrgName){
                   this.$Message.error("不同公司不可新增")
                   this.modal2=false; 
                 }
               })
               //如果勾选了数据，给公司名称赋值
              this.addFormTwo.orgName         = selectData[0].orgName
              this.addFormTwo.cusOrgId        = selectData[0].orderId;
              this.addFormTwo.placeHolderName = selectData[0].orgName
             }
         }
      },
       //绑定时间
      getBang(item){
         this.bangDing=item
      },
      //获取公司名称
      getUserTwo(item){
          let stingTwo=eval('(' + item.value + ')')
          this.addFormTwo.cusOrgId = stingTwo.cusorgId;
          this.addFormTwo.orgName = stingTwo.cusorgName;
      },
      cancel(){
        this.modal2 = false;
      },
      addBtn(){//新增杂费收票

       let selectData= this.$refs.xTable1.getSelectRecords();
        
        let p={};
       
        p.invoiceNo        = this.addFormTwo.fapiaohao1    //发票号码
        p.money            = this.addFormTwo.faMoney1                //发票总金额
        p.weight           = this.addFormTwo.faWeight1               //发票总重
        p.status           = '1'
        p.customerId       = this.addFormTwo.cusOrgId         //店铺的公司的id orgId
        p.createUserId     = this.$global.adminInfo.id     //登录人的id
        p.companyName      = this.addFormTwo.orgName  //公司名字
        p.taxLeftoverMoney = this.addFormTwo.faMoneyOne                 //发票不含税金额
        p.taxNoMoney       = this.addFormTwo.faShui                    //税额
        p.createTime = this.bangDing +' 01:00:00'//绑定时间
        //新增销项票 todo1
        
         getAddJinPiao(p).then(res=>{
            if(res.code =="100"){
              let msgId = res.msg;//返回的id值 
              this.$Notice.success({
                    title:'新增进项票成功',
                    duration:2,
                    onClose:res =>{
                       console.log('关闭时回调')
                       this.reload();
                    }
                 })
              if(selectData.length>0){
                this.step2(msgId);
              }
            }  
         })
      },
      step2(msg){//修改流水信息
       let selectData= this.$refs.xTable1.getSelectRecords();

      let p ={};
      p.list = [];
          selectData.map(item=>{
            let dic = {};
            dic.id = item.id;
            dic.invoiceIncomeId = msg;
            p.list.push(dic);
          })
          updateOrgMoneyRecord(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改流水进项信息成功',
                 })
              }else{
                   this.$Notice.error({
                   title:'修改流水进项信息失败'
                  })
              }
           })
      },
      orgShopName({cellValue, row, column}){
          console.log(cellValue)
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
              return row.id !="当页合计"&&  row.id !="全部合计" 
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
      propsClick(){
        this.reload();
      },
        reloadSelf(){
            this.reload();
        },
       //分页
       changePage(index){
           this.pagesizea=index;
           this.searchM();
       },
       //查询表格
       searchM(){

         //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum     = this.pagesizea              //分页
         param.orgId    = this.shopOrgId              //公司id
         param.pageSize    = this.formItem.length;
         param.status = "1"   
         param.six=this.$global.pinjieStr("17");
         param.invoiceIncomeId = '0'
         param.engineering = this.formItem.engineering
         param.type =this.formItem.type;
           findOrgMoneyRecord(param).then(res=>{
            if(res.code =="100"){
              res.data.list.map(item=>{
                item.key1 = getOrgMoneyRecordType(item.payMoneyType);
              })
            this.data1=res.data.list;
            this.totalM = res.data.total;
          }
          else{
            this.data1 = [];
            this.$Message.warning("当前无数据")
          }    
         })
          
       },
    },
    
    mounted(){
     this.searchM();
     this.getShop();
     this.getGongcheng();
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
         /* .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      } */
      .vxe-table .vxe-cell {
      padding: 0 2px;
      }
      #xiadan .ivu-select-dropdown{
              left: -114px!important;
      }

</style>

