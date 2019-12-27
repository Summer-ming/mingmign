<!--
 * @Description: 客户供应商往来流水
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
          <FormItem label="订单号:" style="margin-right:10px;">
          <Input style="width:200px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
           <FormItem label="公司名称:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
      
            </Select>
          </FormItem>
          <FormItem label="本公司抬头:">
            <Select v-model="formItem.bankJgId"  style="width:200px"  placeholder="请选择"  :label-in-value='true'  >
                          <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
            <FormItem label='发生时间'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>
            <!-- <FormItem label="状态:">
            <Select v-model="formItem.status"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getStatus'  :label-in-value='true'>
               <Option v-for="(item,index) in formItem.statusList " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem> -->
          <!-- <FormItem label="管理员查询:">
            <Select v-model="adminSearch"  styl
            e="width:200px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
      
            </Select>
          </FormItem> -->
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>

           <FormItem label="工程名称:" style="margin-right:10px;">
            <el-select size="small" v-model="formItem.engineering"  clearable  filterable  default-first-option placeholder="请输入工程名称">
             <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
              </el-option>
            </el-select>
          </FormItem>
          </Col>
        
          <Col span="24">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
             <Button type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>

          </Col>
        </Row>
        <!-- 新的vxe table -->
        <vxe-table style="margin-top:10px" height="550" 
          border  resizable  size="mini" ref="selection" :data.sync="data1"  >
        <vxe-table-column show-overflow  width="60" field="id" title="ID" ></vxe-table-column>
        <vxe-table-column show-overflow width="200" field="orgName" title="公司名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="160"  field="orderNo" title="订单号" ></vxe-table-column>
        <vxe-table-column show-overflow width="160"  field="sellEngineering" title="工程名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="inMoney" title="往来金额(进)" ></vxe-table-column>
        <vxe-table-column show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="outMoney" title="往来金额(出)" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="80" :formatter="getOrgMoneyRecordTypeThis" field="payMoneyType" title="业务类型" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="60" field="payMoneyType" title="业务类型ID" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="160" field="createTime" title="创建时间" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="60" :formatter="getbelongCompanyTypeListThis" field="bankJgId" title="公司抬头" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="60" field="bankJgId" title="公司抬头ID" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="60" field="status" title="状态" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="60" field="type" title="类型" ></vxe-table-column>

        <vxe-table-column field=""  title="操作" width="100" >
                    <template v-slot="{row}">
                      <Button v-if="!row.isTotal"  size="small" type="primary" @click="deleteRow(row)">删除</Button>
                    </template>
                </vxe-table-column>
        </vxe-table>
        <Page @on-change="changePage" :page-size="formItem.length" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findOrgMoneyRecord,updateOrgMoneyRecord,findOrgMoneyRecordSum,
findShop,
findOrgCusAcc,
getUserList,findOrderEngineering
} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,jiesuanStatusList,belongCompanyList} from '@/libs/global_type'
import {getOrgMoneyRecordType,getbelongCompanyTypeList} from '@/libs/allStatus'

export default {
    name: 'org_money_record_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        belongCompanyListThis:belongCompanyList,
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
          engineering:'',
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:15,
          orderNo:'',
          status:'',
          statusList:jiesuanStatusList,
          bankJgId:'2'
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
                searchPage:1, //初始化时查询的页码数
                engineerNameList:[]
                
      }
    },
    
    methods:{
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
      getbelongCompanyTypeListThis({cellValue, row, column}){
        return getbelongCompanyTypeList(cellValue);
      },
      getOrgMoneyRecordTypeThis({cellValue, row, column}){
        return getOrgMoneyRecordType(cellValue);
      },
      deleteRow(row){
            this.tableItem = row;
            this.$Modal.confirm({
                                           title:"确定需要删除吗",
                                           onOk:()=>{
                                               let p = {};
                                               let plist = [];
                                               let dic = {};

                                               dic.id = this.tableItem.id;
                                               dic.status = "0";
                                               plist.push(dic);
                                               p.list = plist;
                                                updateOrgMoneyRecord(p).then(res=>{
                                                 if(res.code =="100"){
                                                   this.$Notice.success({
                                                     title:'删除成功'
                                                   })
                                                   this.searchM();
                                                 }else{
                                                   this.$Notice.error({
                                                     title:'修改失败'
                                                   })
                                                 }
                                               })
                                           }
            })
      },
      exportData(){//导出到excel

        this.$refs.selection.exportCsv({
          filename:"客户业务往来表"
        })
      },
      getStatus(item){
        console.log(this.formItem.status)
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
        console.log(item)
        this.shopOrgName = item.label;
        this.shopOrgId = item.value;
       },
      changeCreateTieme(data){
        console.log(data);
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';

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
         
         //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum = this.pagesizea  //分页
          param.engineeringSell    = this.formItem.engineering;  //工程名称
        //  param.beginStatus = 1 ;
        //  param.endStatus   = 11 ;
        //  param.userId      = this.adminSearchId  //管理员查询
         param.orgId = this.shopOrgId  //供应商
         param.beginTime   = this.formItem.beginTime      //创建时间 
         param.endTime     = this.formItem.endTime        
          // param.jgJieSuanCaoZuoStatus = this.formItem.status
          param.pageSize              = this.formItem.length;
          param.orderNo               = this.formItem.orderNo
          param.status  = "1";
          param.six = this.$global.cusFlowPinJieStr;
          param.type = "1"
          param.bankJgId = this.$global.OMRBankJgId(this.formItem.bankJgId);
           findOrgMoneyRecord(param).then(res=>{
            if(res.code =="100"){
            let alist =  this.getTotalThisPage(res.data.list);
            this.totalM=res.data.total; 
            this.data1=alist;

            this.getListTotal(param);
          }  
         })
          
       },
       getListTotal(param){//查询全部合计,当列表查询之后在查询总计
         
          findOrgMoneyRecordSum(param).then(res=>{
            console.log("查询总计")
            if(res.code =="100"&&res.data[0]!=null){
              let dic = res.data[0];
              dic.id = '全部合计'
            dic.isTotal = true
            dic.orgName  = '';
            this.data1.push(dic);
            console.log(this.data1);
          }  
         })
       },
       getTotalThisPage(list){//获取当页合计，插入到数据中
          let sList = list;
          let dic = {};
          dic.id = '当页合计'
          dic.inMoney       = 0;
          dic.outMoney  = 0;
          dic.isTotal = true

          console.log("当页合计")
          sList.map(item=>{
                dic.inMoney      = this.$global.accAdd(item.inMoney,dic.inMoney)
                dic.outMoney = this.$global.accAdd(item.outMoney,dic.outMoney)
          })
          sList.push(dic)
          return sList;
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
     this.getGongcheng();
     this.searchM();
     this.getShop();
     this.getAdminList();
     var that = this;
     Utils.$on('demo',function(msg){
       console.log(msg);
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
         .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {
      padding: 0 2px;
      }
      .ivu-form-item{
        margin-bottom:5px;
      }
</style>
