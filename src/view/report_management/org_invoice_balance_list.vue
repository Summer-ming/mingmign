/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-05-14 17:15:28 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-06-10 10:33:56
 */
<!--
 * @Description: 客户余额表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->
<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <i-Col span="24">
           <FormItem label="公司名称:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in orgList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>

          <FormItem label="本公司抬头:">
            <Select v-model="formItem.taitou"  style="width:200px"  placeholder="请选择"  :label-in-value='true' @on-change='getTaiTou' >
               <Option v-for="(item,index) in bankList " :value="JSON.stringify(item)" :label="item.label" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>


          </i-Col>
        
          <i-Col span="3">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </i-Col>
        </Row>
        <Table height="440" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            <!-- <div slot="footer" style="height:100px">
              <td style="width:660px">合计</td>
              <td style="width:100px;text-align: center;">11</td>
              <td style="width:100px">-</td>
              <td style="width:100px;text-align: center;">2222</td>
            </div> -->
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>
      <!-- 选择资订单退款客户源弹窗 -->



     </div>
      
</template>

<script>
import {findOrgMoneyRecordMoneySum,
updateOrgMoneyRecord,
findOrgCusAcc,
findShop,
addJgJieSuan,
updateJieSuanForStatus1
} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,jiesuanStatusList,companyCardTypeList} from '@/libs/global_type'
import {getOrgMoneyRecordType} from '@/libs/allStatus'
import {getZhiDan,getCompanyLiuShui} from '@/api/cusData'
//import popup from '@view/systemMan/popup'//引入弹窗组件 
// import popup from '@/view/systemMan/popup'//引入弹窗组件
// import popup2 from '@/view/systemMan/popup2'//引入弹窗组件到账单退款客户 到账单退款供应商使用
//import { resolveTxt } from 'dns';
export default {
    name: 'org_invoice_balance_list',
    inject:['reload'],  //調用組建app.vue
    //  components:{
    //       popup,
    //       popup2
    //     },
    data(){
      return {
        modal2:false,//控制到账单退款客户显示
        columnThree:[],//到账单退款的table
        dataThree:[],//到账单退款的data数据
        showTrueCC:false,//到账单退款客户的弹窗
 

        modal3:false,//控制到账单退款供应商显示
        columnFour:[],//到账单退款供应商的table
        dataFour:[],//到账单退款供应商的data数据
        showTrueDD:false,//到账单退款供应商的弹窗



        bankList:companyCardTypeList,//本公司银行卡类型
        columnOne:[],
        dataOne:[],//shu
        columnTwo:[],
        dataTwo:[],//shu
        showTrue:false,//控制选择资源的弹窗
        showTrueBB:false,//退款供应商的弹窗
        modal1:false,
        shopSearch:"",
        //退款申请客户
        cusForm:{
          companyName:'',
          bankName:'',
          bankNo:'',
          bblId:'',
          money:'',
          note:''
        },
        modal:false,
        clickItem:{},//退款点击时那一行的数据
        orgItem:{},//客户信息
        //
        shopList:[],
        orgList:[],
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
        tableItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:'',
          taitou:'',//本公司抬头
          orderNo:'',
          status:'',
          statusList:jiesuanStatusList
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
                        key: 'orgId',
                        align: 'center',
                        // width:'60'
                    },
                     {
                        title: '公司名称',
                        key: 'orgName',
                        align: 'center',
                        // width:'200'
                    },
                     {
                        title: '客户角色余额',
                        key: '',
                        align: 'center',
                        // width:'200'
                        render:(h,params) =>{
                          return h('div',{
                            'style':{
                              'color':"blue"
                            }
                          },this.$global.isMoneyShow(this.$global.accMinus(params.row.outMoney,params.row.inMoney)))
                        }
                    },
                    {
                        title: '已付金额(元)(入)',
                        key: 'inMoney',
                        align: 'center',
                        // width:'200'
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.inMoney))
                        }
                    },
                    {
                        title: '应付金额(元)(出)',
                        key: 'outMoney',
                        align: 'center',
                        // width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.outMoney))
                        }
                        
                    },
                     {
                        title: '供应商角色余额',
                        key: '',
                        align: 'center',
                        // width:'200'
                        render:(h,params) =>{
                          return h('div',{
                            'style':{
                              'color':"blue"
                            }
                          },this.$global.isMoneyShow(this.$global.accMinus(params.row.inMoney2,params.row.outMoney2)))
                        }
                    },
                    {
                        title: '供应商入账金额（元）',
                        key: 'inMoney2',
                        align: 'center',
                        // width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.inMoney2))
                        }
                        
                    },
                    {
                        title: '供应商出账金额（元）',
                        key: 'outMoney2',
                        align: 'center',
                        // width:'200',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.outMoney2))
                        }
                    },
                  
                    
        ],//查询列表的数据的colums
        data1: [],//表格展示的数据  查询
        dataCount:0,//总页数
        // pageSize:10,  //每页总条数
        searchPage:1, //初始化时查询的页码数
        taiTouId:"",//本公司抬头的id
        msgId:"",//保存id
                
      }
    },
    
    methods:{
      //获取本公司抬头 
      getTaiTou(item){
        const stingR=eval('(' + item.value + ')');
        this.taiTouId=stingR.value;
      },
      
      getOrgInfo(){//获取客户信息；
        let p  = {};
        p.orgId = this.clickItem.orgId;

            findOrgCusAcc(p).then(res => {
                      if (res.code == "100") {
                        this.orgItem = res.data.list[0];
                        this.cusForm.companyName = this.orgItem.cusorgName;
                        this.cusForm.bankName    = this.orgItem.tkaccBank;
                        this.cusForm.bankNo      = this.orgItem.tkaccBankCode;
                        this.cusForm.bblId       = this.orgItem.tkaccBblId;
                      }
                  })
      },
      getOrg(){
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.orgList=res.data.list
          }  
         })
       },
        getShopList(){
        let param = {};
        param.pageNum ="1";
        param.pageSize = "999999"
        param.orgId=this.clickItem.orgId
          findShop(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
      modalCancel(){
        this.modal =false;
        this.modal1 = false;
        this.showTrue=false;
        this.modal3=false;
        this.modal2=false;
      },
      getStatus(item){
        console.log(this.formItem.status)
      },
      
      getDian(item){

        var jsonStr = eval('('+item.value+')')
        console.log(item)
        this.cusForm.bankName = jsonStr.bank
        this.cusForm.bankNo = jsonStr.bankCode
        this.cusForm.bblId = jsonStr.bblId;
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
        //  param.beginStatus = 1 ;
        //  param.endStatus   = 11 ;
        //  param.userId      = this.adminSearchId  //管理员查询
          // param.jgJieSuanCaoZuoStatus = this.formItem.status
          param.pageSize              = this.formItem.length;
          // param.orderNo               = this.formItem.orderNo
          param.status  = "1";
          let a = this.$global.pinjieStr("1,3,7,8,9,10,11")
          param.six = a//传入所有需要查询的字段
           findOrgMoneyRecordMoneySum(param).then(res=>{
            if(res.code =="100"){
            this.totalM=res.data.total; 
            this.data1=res.data.list;

          }  
         })
          
       },
    },
    
    mounted(){
     this.searchM();
     this.getOrg();
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
<style <style lang="less">
  .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
</style>
