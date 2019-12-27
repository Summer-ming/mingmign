<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-09-16 17:26:56
 * @其他: 
 -->


<template>
     <div id='daozhang'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form inline :model="formItem" :label-width="80">
        <Row>
         
          <FormItem label="审核状态:" style="width:200px">
                 <Select v-model="formItem.shenHe" filterable >
                    <Option v-for="(item, index) in shenList" :value="item.value" :key="index">{{item.label}}</Option>
                </Select>
          </FormItem>

          <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>

          <FormItem label="订单类型:" style="width:200px">
            <Select  v-model="formItem.leiXing"    placeholder="请选择"   >
               <Option v-for="(item,index) in leiList " :value="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>


        </Row>
          <!-- 查询  刷新 -->
         <row style='text-align:left;'>
                    <Button type="primary" icon="ios-search" @click='getSearch'>查询</Button>
                    <Button  shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

         </row>

        <Table  border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
            
        </Table>

        <Page :page-size="formItem.length"  @on-change="changePage"  style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
     </Form>
     </Card>    

     </div>
</template>

<script>
import{findOrderCaozuoRecord,updateOrderStatus,jueP} from '@/api/data'
import{getXiuGaiOrderStatus89} from '@/api/cusData'
import {lengthList} from '@/libs/global_type'
export default {
    name: 'jieSuo',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        lengthListThis:lengthList,
        totalM:0,
        formItem:{
            length:10,
            shenHe:"1",
            leiXing:"",
        },
        pagesizea:1,
        shenList:[ //审核状态的列表数据
           {
            label:'未审核',
            value:'1'
          },
          {
            label:'已审核',
            value:'8'
          },
          {
            label:'作废',
            value:'99'
          },
        ],
        leiList:[
          {
            label:'采购单',
            value:'1'
          },
          {
            label:"销售单",
            value:'2'
          }
        ],//默认类型 
        columns4: [
                    {
                        title: 'ID',
                        key: 'orderAuditApplyId',
                        align: 'center',
                        width:'60'
                    },
                      {
                        title: '订单号',
                        key: 'orderNo',
                        align: 'center',
                        width:'160',      
                    },
                     {
                        title: '订单类型',
                        key: 'orderType',
                        align: 'center',
                        width:'150',
                        render:(h,params) =>{
                          return h('div',{
                          },this.getStasus(params.row.orderType));
                        }
                    },
                    {
                        title: '工程名称',
                        key: 'engineering',
                        align: 'center',
                        width:'150'
                    },
                     {
                        title: '申请原因',
                        key: 'applyNote',
                        align: 'center',
                        width:'150'
                    },
                    {
                        title: '申请人',
                        key: 'applyUserName',
                        align: 'center',
                        width:'150'
                    },
                    {
                        title: '时间',
                        key: 'createTime',
                        align: 'center',
                        width:'150'
                    },
                    {
                        title: '审核状态',
                        key: 'auditStatus',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.getShen(params.row.auditStatus));
                        }
                    },

                    {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'120',
                        fixed:'right',
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
                                              this.getOp(params.row)
                                        }
                                    }
                                }, '审核通过'),
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
                                            this.getJue(params.row)
                                        }
                                    }
                                }, '拒绝'),     
                             ]);
                    }
                        
                    },
                    
        ],
        data1: [],//表格展示的数据      
      }
    },
    
    methods:{
      reloadSelf(){
            this.reload();
        },
      //审核
      getOp(row){
        let param={pageUpdateOrderList:[]};
        let pdic = {};
          pdic.id=row.orderId;
          pdic.duiZhangStatus='1'
        param.pageUpdateOrderList.push(pdic);

        let param2={pageUpdateOrderList:[{}]};
        param2.pageUpdateOrderList[0].id=row.orderId;
        param2.pageUpdateOrderList[0].duiZhangStatus='1'
          
          let times = this.$global.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");
          let param1={};
        param1.id            = row.orderAuditApplyId;
        param1.auditStatus   = '8';
        param1.auditTime     = times;
        param1.auditUserName = this.$global.adminInfo.cname;

          this.$Modal.confirm({
             title: '确认审核',
             content: '是否要确认?',
             onOk:()=>{
               if(row.orderType==1){//采购单
                this.getA(param) //
                this.getB(param1)//
               
                console.log('1111111111')

               }else if(row.orderType==2){//销售单
                  this.getC(param2);//
                  this.getB(param1)//
                  console.log('222222222222')
               } 
                this.searchM();
             },
             onCancel:()=>{

             },

        })
      },
      getA(param){
          updateOrderStatus(param).then(res=>{
                  if(res.code =='100'){
                        this.$Notice.success({
                          title:'审核成功',
                          duration:1,
                          onClose:res =>{
                          }
                       })
                    }else{
                         this.$Notice.error({
                         title:'审核失败'
                        })
                    }
               })
      },
      getB(param1){//修改申请表状态
          jueP(param1).then(res=>{
               if(res.code =="100"){
                        if(res.code =='100'){
                        this.$Notice.success({
                          title:'审核成功',
                          duration:1,
                          onClose:res =>{
                            this.searchM()
                          }
                       })
                    }else{
                         this.$Notice.error({
                         title:'审核失败'
                        })
                    }
                 }  
            })
      },
      getC(param2){
        getXiuGaiOrderStatus89(param2).then(res=>{
               if(res.code =="100"){
                        if(res.code =='100'){
                        this.$Notice.success({
                          title:'修改订单成功',
                          duration:1,
                          onClose:res =>{
                          }
                       })
                    }else{
                         this.$Notice.error({
                         title:'修改订单失败'
                        })
                    }
                 }  
            })
      },
      //拒绝
      getJue(row){
         this.$Modal.confirm({
             title: '拒绝',
             content: '是否要拒绝?',
             onOk:()=>{
                let param1={};
                param1.id=row.orderAuditApplyId;
                param1.auditStatus='99';
                param1.auditTime=row.auditTime;
                param1.auditUserName=row.applyUserName;
                jueP(param1).then(res=>{
                    if(res.code =="100"){
                          this.searchM();
                      }  
                  })
             },
             onCancel:()=>{},

        })
      },
      //分页
       changePage(index){
           this.pagesizea=index;
           this.searchM();
       },
      getSearch(){
         this.searchM();
      },
      //订单状态变换
      getStasus(row){
         switch(row){
              case '1':
              return '采购单';
              case '2':
              return '销售单'; 
         }
      },
      //审核状态
      getShen(row){
          switch(row){
              case '1':
              return '待审核';
              case '8':
              return '已审核'; 
              case '99':
              return '作废'; 
         }
      },
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
          param.auditType='2'
          param.auditStatus=this.formItem.shenHe
          param.orderType=this.formItem.leiXing
          param.pageNum     = this.pagesizea    
          
          this.getSerch(param)
       },
    
       //查询接口
       getSerch(param){

         findOrderCaozuoRecord(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          } else{
            this.data1 = [];
          } 
         })
       },
    
    },
    
    mounted(){   
      console.log('那你呢年女女')
      console.log(this.formItem.shenHe)
      this.searchM();
    },
    
    created(){
   
    },
}

</script>
<style lang="less" >
 #daozhang .ivu-table-small td{
       height:20px!important;
      
       line-height:1!important;
 }
  #daozhang .ivu-table-cell{
    padding:0!important;
    margin:0!important;
  }
</style>


