<!--
 * @Description: 采购单线上付款列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-09 15:10:51
 -->



<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="80">
        <Row>
          <Col span="24">
          <FormItem label="公司名称:" style="margin-right:10px;">
          <Input style="width:200px"  placeholder="请输入公司名称" v-model="formItem.companyName"></Input>
          </FormItem>
           <FormItem label='到账单状态'>
            <Select  v-model='formItem.daozhangdanStatus' style="width:200px" placeholder="请选择到账单状态" >
              <Option  v-for='(item,index) in daozhangdanStatusListThis' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
           <FormItem label='出入账类型'>
            <Select  v-model='formItem.tranType' style="width:200px" placeholder="请选择出账或入账" >
              <Option  v-for='(item,index) in tranTypeListThis' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          </Col>
        
          <Col span="10">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
        </Row>
        <Table  @on-selection-change="selectAllSelection" border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
     </Form>
     </Card>    
     
    <!-- 增加客户弹窗 -->

     </div>
</template>

<script>
import {
  findDaoZhangDanAll,deleteDaoZhangDan
  } from '@/api/data'
import {companyCardTypeList,daozhangdanStatusList,tranTypeList} from '@/libs/global_type'
import {getDaozhangdanStatus,getTranType} from '@/libs/allStatus'

export default {
    name: 'bank_flow_FJ_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        daozhangdanStatusListThis:daozhangdanStatusList,
        tranTypeListThis:tranTypeList,

        //弹出框使用的数据
        modal:false,
        //弹出框使用的数据结束
        tableItem:{},
        selectionsList:[],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        companyCardTypeListThis:companyCardTypeList,
        formItem: {
          companyName:'',
          orderNo:'',
          payMony:'',
          dikouMoney:'',
          cardType:"",
          totalMoney:'',
          totalNum:'',
          daozhangdanStatus:'',
          tranType:''
          },
          columns4: [
                    {
                        title: 'ID',
                        key: 'daozhangdanId',
                        align: 'center',
                        width:'100'
                    },
                     
                     {
                        title: '客户名称',
                        key: 'creditedCompany',
                        align: 'center',
                        width:'250'
                    },
                     {
                        title: '到账金额 (元)',
                        key: 'payMoney',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.payMoney))
                        }
                    },
                    {
                        title: '剩余可用到账金额 (元)',
                        key: 'dealMoney',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dealMoney))
                        }
                    },
                     {
                        title: '客户银行账号',
                        key: 'bankNo',
                        align: 'center',
                        width:'200',
                    },
                     {
                        title: '收款账号',
                        key: 'jgBankNo',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },params.row.jgBankNo)
                        }
                    },
                     {
                        title: '到账时间',
                        key: 'dealTime',
                        align: 'center',
                        width:'250'
                    },
                    {
                        title: '客户开户行名',
                        key: 'bank',
                        align: 'center',
                        width:'250'
                    },
                     {
                        title: '摘要',
                        key: 'zhaiyao',
                        align: 'center',
                        width:'250'
                    },
                    {
                        title: '类型',
                        key: 'tranType',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },getTranType(params.row.tranType))
                        }
                    },
                    {
                        title: '状态',
                        key: 'daozhangdanStatus',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },getDaozhangdanStatus(params.row.daozhangdanStatus))
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
     
      selectAllSelection(data){//全选变化
      },
      modalCancel(){
        this.modal = false;
      },
      addNew(){
        console.log("开始添加")
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
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.pageNum=this.pagesizea //分页
         param.tranType          = this.formItem.tranType;
         param.creditedCompany = this.formItem.companyName;
         param.daozhangdanStatus = this.formItem.daozhangdanStatus
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){

         findDaoZhangDanAll(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
       },
    },
    
    mounted(){
     this.searchM();
    },
    
    created(){
   
    },
}

</script>
