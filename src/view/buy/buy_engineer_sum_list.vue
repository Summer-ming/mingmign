<!--
 * @Description: 采购单工程汇总
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
          <FormItem label="工程名称:" style="margin-right:10px;">
            <el-select size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
             <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
              </el-option>
            </el-select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="按照对账批次分组">
            <Select v-model="formItem.duiStr" style="width:100px" placeholder="请选择">
              <Option v-for="(item, index) in duiTimesList" :key="item.value" :value="item.value" :label="item.label"></Option>
            </Select>
          </FormItem> -->
          </Col>
        
          <Col span="24">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
              <Button type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>
              <br>
          </Col>
        </Row>
          <!-- vxetable -->
          <vxe-table
              border
              ref="selection"
              show-footer
              size="mini"
              height="500"
              :footer-method="footerMethod"
              :data.sync="data1">
              <!-- //第一部分采购单相关信息 -->
              <vxe-table-column type='index' title="#"  min-width='20'></vxe-table-column>
              <vxe-table-column field="engineering"   title="项目名称"  min-width='200'></vxe-table-column>
              <!-- 采购单单价，吨位，合同金额 -->
              <vxe-table-column align="right" field="zhongliangAll" :formatter="this.$global.vxeTableWeight" title="采购吨位" min-width='80'></vxe-table-column>
              <vxe-table-column align="right" field="receivedMoney" :formatter="this.$global.vxeTableMoney" title="已付款金额" min-width='80'></vxe-table-column>
              <vxe-table-column align="right" field="deliveryTotalMoneyCus"  :formatter="this.$global.vxeTableMoney" title="实提金额" min-width='100'></vxe-table-column>
              <!-- <vxe-table-column align="right" field="receivedMoney" :formatter="this.$global.vxeTableMoney" title="已收款金额" min-width='100'></vxe-table-column> -->
              <vxe-table-column align="right" field="noMoney" :formatter="this.$global.vxeTableMoney" title="未收款金额" min-width='100'></vxe-table-column>
              <!-- <vxe-table-column align="right" field="jiesuanMoney" :formatter="this.$global.vxeTableMoney" title="结算差额" min-width='100'></vxe-table-column> -->
              <vxe-table-column align="right" field="beifenCusMoney" :formatter="this.$global.vxeTableMoney" title="合同金额" min-width='80'></vxe-table-column>
              <!-- <vxe-table-column align="right" field="deliveryTotalMoneyCus" :formatter="this.$global.vxeTableMoney" title="实提金额" min-width='80'></vxe-table-column> -->
            </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {
findOrdersAllSum,
findShop,
findOrgCusAcc,findOrderEngineering,
getUserList} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,jiesuanStatusList} from '@/libs/global_type'
import {getJiesuanStatus} from '@/libs/allStatus'
import XEUtils from 'xe-utils'

export default {
    name: 'buy_engineer_sum_list',
   
    data(){
      return {
        shopList:[],
        engineerNameList:[],//工程名称数组
        lengthListThis:lengthList,
        duiTimesList:[
          {"value":"Y","key":"是"},
          {"value":"N","key":"否"}
        ],
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
          length:100,
          orderNo:'',
          status:'',
          statusList:jiesuanStatusList,
          engineering:'',
          duiStr:''

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
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
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
      //footer 合计
       footerMethod ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '当页合计'
                  }
                    if(['zhongliangAll'].includes(column.property)){////重量返回 3位小数点
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),3)
                  }    
                  if (['receivedMoney','deliveryTotalMoneyCus','receivedMoneySell','noMoney',//金额返回2位小数点
                   ].includes(column.property)) {
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)
                  }
                  return '-'
                })
              ]
       },
      exportData(){//导出到excel
        this.$refs.selection.exportCsv();
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
      getAdmin(item){
        console.log(item);
        this.adminSearchId = item.value;
      },
        reloadSelf(){
           // this.reload();
           this.formItem.engineering='';
           this.searchM();
        },
       //分页
       changePage(index){
           console.log(index)
           this.pagesizea=index;
           this.searchM();
       },
     
       //查询表格
       searchM(){

         //获取查询的input的值
         let param = {};
        //  shopOrgId //店铺id
         param.pageNum     = this.pagesizea  //分页
         param.beginStatus = 1 ;
         param.endStatus   = 90 ;
        //  param.userId      = this.adminSearchId  //管理员查询
         param.merchantsId = this.shopOrgId  //供应商
        //  param.beginTime   = this.formItem.beginTime      //创建时间 
        //  param.endTime     = this.formItem.endTime        //供应商
          param.jgJieSuanCaoZuoStatus = this.formItem.status
          param.pageSize              = this.formItem.length;
          param.orderNo               = this.formItem.orderNo
          param.engineeringGroup      = "Y"
          param.engineering           = this.formItem.engineering;  //工程名称
          // param.duiZhangTimesGroup =this.formItem.duiStr;//按照对账批次来筛选
          console.log(param);
           findOrdersAllSum(param).then(res=>{
            if(res.code =="100"){
              //计算 付款金额
              //采购单付款金额 = receivedMoney + dikouSmoney +skSmoney - tixiansMoney
            res.data.list.map(item=>{
              let a = this.$global.accAdd(item.receivedMoney,item.dikouSmoney)
                          let b = this.$global.accAdd(a,item.skSmoney)
                          let c = this.$global.accMinus(b,item.tixiansMoney)
                          item.pay_money_t = c;
                          //计算未收款金额 用实提减去付款
                          item.noMoney = this.$global.accMinus(item.deliveryTotalMoneyCus,item.receivedMoney);

                          // 结算差额
                          //计算 结算差额 = 入金额 - 出金额；一般为 实提金额 - 打款金额
                
                        let b1 =  this.$global.accAdd(item.deliveryTotalMoneyCus,item.skSmoney);//入金额，实提金额
                        let a1 =this.$global.accAdd(item.receivedMoney,item.tixianSMoney)//出金额， 打款金额
                          let  ad1 = this.$global.accAdd(a1,item.dikouSmoney)
                        let c1 = this.$global.accMinus(b1,ad1)
                        item.jiesuanMoney=c1


                          if(item.engineering == null || item.engineering == ""){
                              item.engineering = "未填写名称"
                            }
            })  
            this.totalM=res.data.total; 
            this.data1=res.data.list;
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
     this.getShop();
     this.getAdminList();
     this.getGongcheng();
    
    },
    
    created(){
   
    },
}

</script>


