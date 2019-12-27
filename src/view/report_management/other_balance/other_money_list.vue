<!--
 * @Description: 杂费余额表
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
           <!-- <FormItem label="公司名称:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDianOrg'  :label-in-value='true'>
               <Option v-for="(item,index) in orgList" :value="JSON.stringify(item)" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </!--> 
          <FormItem label="客户查询:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDianOrg'  :label-in-value='true'>
               <Option v-for="(item,index) in orgList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          </i-Col>
        
          <i-Col span="24">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
            <Button type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>

          </i-Col>
        </Row>
        <Table height="440" border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;" :page-size="formItem.length"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>

     <!-- 结束 -->
     </div>
      
</template>

<script>
import {
findOrgCusAcc,
findOtherMoneySum
} from '@/api/data'
import Utils from '@/api/middle'
import {lengthList} from '@/libs/global_type'
export default {
    name: 'other_money_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        orgList:[],
        lengthListThis:lengthList,
        orgSearch:'',
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:10,
          taitou:'',//本公司抬头
          orderNo:'',
          status:'',
          },
        columns4: [
                    {
                        title: 'ID',
                        key: 'id',
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
                        title: '应付总金额',
                        key: 'o1',
                        align: 'money',
                        // width:'200'
                        render:(h,params) =>{
                          return h('div',{
                            'style':{
                            }
                          },this.$global.isMoneyShow(params.row.money))
                        }
                    },
                    {
                        title: '实付总金额',
                        key: 'paymentMoney',
                        align: 'center',
                        // width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.paymentMoney))
                        }
                        
                    },
                    {
                        title: '剩余应付金额',
                        key: 'key1',
                        align: 'center',
                        // width:'200',
                        render:(h,params) =>{
                          //剩余应付金额 = 应付总金额 - （已付金额+优惠金额）
                          let a =  params.row.money;
                          let b = this.$global.accAdd(params.row.paymentMoney,params.row.dikouMoney)
                          let c = this.$global.accMinus(a,b)
                          return h('div',{
                          },this.$global.isMoneyShow(c))
                        }
                    },
                    {
                        title: '优惠金额',
                        key: 'dikouMoney',
                        align: 'center',
                        // width:'200',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dikouMoney))
                        }
                    },
                    {
                        title: '已收票额',
                        key: 'invoiceInComeMoney',
                        align: 'center',
                        // width:'200',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.invoiceInComeMoney))
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
      exportData(){//导出到excel
        this.$refs.selection.exportCsv({
          filename:"杂费余额表"
        })
      },
      getOrg(){
        let param = {};
        param.pageNum ="1";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.orgList=res.data.list
          }  
         })
       },
      getDianOrg(item){
        this.formItem.companyName = item.label;
      },
      propsClick(){
        console.log("回调成功");
        this.reload();
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
         let param = {};
         param.pageNum  = this.pagesizea              //分页
         param.orgName  = this.formItem.companyName;  //公司名称
         param.pageSize = this.formItem.length;
          //过滤 只查询 有效数据
           findOtherMoneySum(param).then(res=>{
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
