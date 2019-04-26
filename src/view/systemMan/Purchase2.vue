<template>
  <div>
      <Card :border="false" :dis-hover="true">
      <Form :model="formItem" :label-width="80">
        <Row>
            <i-col span="5"><FormItem label="公司名:">
                <i-input  placeholder="请输入公司名称" v-model="formItem.input"></i-input>
                </FormItem>
            </i-col>

          <i-col span="5" style=''>
            <FormItem label="业务员">
              <Select v-model="formItem.select">
                <Option value="北京">北京</Option>
                <Option value="上海">上海</Option>
                <Option value="深证">深圳</Option>
              </Select>
            </FormItem>
          </i-col>

           <i-col span="5" style=''>
            <FormItem label="单号">
               <i-input  placeholder="请输入单号" v-model="formItem.selectOne"></i-input>
            </FormItem>
          </i-col>

          <i-col span="3">
             <Button type='primary' @click='searchM()'>查询</Button>
          </i-col>
        </Row>
      </Form>
    </Card>
    <!--表格height="447" -->
    <Row>        
         <Table border   ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'></Table>
        
        
        <Row span='8' style="margin-bottom:20px;display:flex;">
             <!-- 功能添加删除 -->
            <div style='flex:1'>
            <Button  icon="md-add" type="primary"  @click='modal10=true'>添加</Button>
     
      
            <Button  icon="md-add" type="primary">付款</Button>
       
     
            <Button  icon="ios-trash-outline" type="primary">提单</Button>
    
            <Button  icon="ios-trash-outline" type="primary">入库</Button>
            <Button  icon="ios-trash-outline" type="primary">结算</Button>
            <Button  icon="ios-trash-outline" type="primary">开票</Button>
            </div>
    
             <!-- 分页 -->
             <!-- <Page  @on-change='changePage'  :total="totalM"  show-elevator show-sizer  show-total style='flex:1'/> -->
          
        </Row>
    </Row> 
   


  </div>
</template>
<script>
import {accountManagement} from '@/api/data'
  export default {
    name: 'purchase2',
    data(){
      return {
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          input: '', //员工姓名
          select: '',//岗位
          selectTwo:'',//部门
          selectOne:"",//部门1
          radio: 'male',
          checkbox: [],
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: '',},
          columns4: [
                   
                    {
                        title: '采购单号',
                        key: 'id',
                        align: 'center',
                        width:'100',
                        fixed:'left'
                       
                    },
                    {
                        title: '销售单号',
                        key: 'createCname',
                        align: 'center',
                         width:'80'
                    },
                    {
                        title: '采购公司',
                        key: 'postW',
                        align: 'center',
                         width:'80'
                    },
                     {
                        title: '供应商',
                        key: 'departmentName',
                        align: 'center',
                        width:'100'
                    },
                      {
                        title: '采购重量',
                        key: 'sex',
                        align: 'center',
                         width:'80'
                    },
                      {
                        title: '采购总金额(元)',
                        key: 'acount',
                        align: 'center',
                        width:'80'
                        
                    },
                      {
                        title: '已付款',
                        key: 'phone',
                        align: 'center',
                         width:'110'
                        
                    },
                     {
                        title: '抵扣金额',
                        key: 'mail',
                        align: 'center',
                         width:'110' 
                    },
                     {
                        title: '实提重量',
                        key: 'mail',
                        align: 'center',
                         width:'110' 
                    },
                     {
                        title: '实提总额',
                        key: 'mail',
                        align: 'center',
                         width:'110' 
                    },
                     {
                        title: '结算反差',
                        key: 'mail',
                        align: 'center',
                        width:'110' 
                    },
                     {
                        title: '已补差额',
                        key: 'mail',
                        align: 'center',
                         width:'110' 
                    },
                     {
                        title: '代理商',
                        key: 'mail',
                        align: 'center',
                         width:'110' 
                    },
                     {
                        title: '开单日期',
                        key: 'mail',
                        align: 'center',
                         width:'110' 
                    },
                     {
                        title: '业务部门',
                        key: 'mail',
                        align: 'center',
                         width:'110' 
                    },
                     {
                        title: '采购员',
                        key: 'mail',
                        align: 'center',
                         width:'110' 
                    },
                     {
                        title: '单据类型',
                        key: 'mail',
                        align: 'center',
                         width:'110' 
                    },
                     {
                        title: '合同图片(多张)',
                        key: 'mail',
                        align: 'center',
                        width:'110' 
                    },
                     {
                        title: '采购状态',
                        key: 'mail',
                        align: 'center',
                        width:'110',
                        fixed:'right'
                    }, 
                ],
                data1: [],//表格展示的数据
      }
    },
    methods:{
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
         param.cname=this.formItem.input //name
         param.roleCname=this.formItem.select //岗位
         param.departmentName=this.formItem.selectOne //部门
         param.pageNum=this.pagesizea//分页
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         accountManagement(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
       }
    },
    mounted(){
      //账户管理接口
     this.searchM();
    },
    created(){
    
    },
  }
</script>
<style <style lang="less">
.ivu-card-body{
   padding-bottom:0;
 }
 .width_150{
   width:500px;
 }
.ivu-modal-content{
  padding-left:20px;
 
}
.ivu-modal-footer{
  display: none;
}
#formM{
  .ivu-form-item-content{
    margin-left:357px!important;
  }
}
</style>

