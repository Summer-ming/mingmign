<!--
 * @Description: 销项票列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-16 09:01:46
 -->




<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" :label-width="80">
        <Row>
                <div >
              <Card :bordered="false">
                <Button shape="circle"  icon="md-refresh" @click="reloadSelf()"></Button>
              </Card>
            </div>
      
        </Row>
        <Table @on-selection-change="selectAllSelection" border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {
  findInvoiceOutout
  } from '@/api/data'
import  {getbelongCompanyTypeList} from '@/libs/allStatus'
export default {
    name: 'invoice_out_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        //弹出框使用的数据
        modal:false,
        //弹出框使用的数据结束
        tableItem:{},
        selectionsList:[],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          orderNo:'',
          payMony:'',
          dikouMoney:'',
          cardType:"",
          totalMoney:'',
          totalNum:'',
          },
          columns4: [
            {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'60'
                    },
                     {
                        title: '发票号码',
                        key: 'invoiceNo',
                        align: 'center',
                        width:'250'
                    },
                     {
                        title: '公司名称',
                        key: 'companyName',
                        align: 'center',
                        width:'250'
                    },
                   
                     {
                        title: '重量',
                        key: 'weight',
                        align: 'center',
                        width:'180',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.weight,3));
                        }
                    },
                     {
                        title: '金额',
                        key: 'money',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.money))
                        }
                        
                    },
                     {
                        title: '代理',
                        key: 'agentName',
                        align: 'center',
                        width:'250'
                        
                    },
                     {
                        title: '本公司抬头',
                        key: 'bankJgId',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },getbelongCompanyTypeList(params.row.bankJgId))
                        }
                    },
                      {
                        title: '申请人',
                        key: 'bindInTime',
                        align: 'center',
                        width:'250'
                    },
                     {
                        title: '绑定时间',
                        key: 'status',
                        align: 'center',
                        width:'250'
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
        console.log(data);
        this.selectionsList  =data;
        let tm = 0;
        //全选有变化时赋值
        for(var i in data){
          let dic = data[i];
          tm = this.$global.accAdd(tm,dic.jgJieSuanMoney)
        }
        this.formItem.totalMoney = this.$global.isMoneyShow(tm);
        this.formItem.totalNum = data.length; 
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
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){

         findInvoiceOutout(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data;
            this.totalM=res.total[0]; 
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
