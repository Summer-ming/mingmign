<template>
  <div style='background: #ffffff;'>
    <row class='buy_money'>
      <h1 class='buy_title'>采购单</h1>
      <row class='row_buy'>
           <dl>
             <dd>采购单号:cgd185200222</dd>
             <dd>发货日期:2015-5-05</dd>
             <dd>采购员:王斌土匪</dd>
             <dd>联系电话:110</dd>
             <dd>销售电话:120</dd>
             <dd>销售订单:乙单</dd>
             <dd>复核备注:1131</dd>
           </dl>
           <dl>
             <dd>供应商:江苏钢铁有限公司</dd>
             <dd>提货仓库:1313</dd>
             <dd>运输单位:2232</dd>
             <dd>代理结算:131313</dd>
             <dd>销售单:xsd184545</dd>
             <dd>单据类型:先销后进</dd>
             <dd>审单日期:2015.15</dd>
           </dl>
           <dl>
             <dd>工程:1515</dd>
             <dd>采购公司:上海圣剑</dd>
             <dd>车船号:1313</dd>
             <dd>我方分成比例:0%</dd>
             <dd>采购询价单:1212</dd>
             <dd>开单备注:kk;k</dd>
             <dd>商城供应:12</dd>
           </dl>
           <dl>
             <dd>开单日期:2018.15131</dd>
             <dd>业务组:松江区</dd>
             <dd>联系人:121213</dd>
             <dd>采购订单:11212</dd>
             <dd>合同号:1113</dd>
             <dd>审单备注:1313</dd>
             <dd>商城采购:1113</dd>
           </dl>

      </row>
    </row>

    <row>
      <Form :model="formItem" :label-width="80">
        <Row>
          <i-Col span="5">
          <FormItem label="采购单号:">
          <i-Input  placeholder="请输入单号" v-model="formItem.input"></i-Input>
        </FormItem>
        </i-Col>
          <i-Col span="5" style='margin-right:10px;'>
             <FormItem label="产地:">
              <i-Input  placeholder="请输产地" v-model="formItem.input"></i-Input>
            </FormItem>
          </i-Col>
          <i-Col span="3">
             <Button type='primary' @click='searchM()'>查询</Button>
          </i-Col>
        </Row>
      </Form>
    </row>
    <!--表格 -->
    <Row>        
         <Table border  :columns="columnsShop" :data="dataShop"></Table>
    </Row> 
    <row class='row_button'>
      <div class='add_bton'>
        <Button  icon="md-add" type="primary" @click='modal=true'>添加</Button>
        <Button  type="primary" @click='modal=true'>导出Excel</Button>
      </div>
      <Page  @on-change='changePage'  :total="100"  show-elevator show-sizer  show-total style='text-align:right;'/>

    </row>
   
  </div>
</template>
<script>
import {accountManagement} from '@/api/data'
  export default {
    name: 'purchMan',
    data(){
      return {
      formItem:{
        input:'',
      },
       columnsShop:[
                    
                    {
                        title: '采购单号',
                        key: 'id',
                        align: 'center',
                        width:'100',
                        fixed:'left'
                    },
                    {
                        title: '品格名称',
                        key: 'shopCname',
                        align: 'center',
                         width:'110'
                    },
                    {
                        title: '材质',
                        key: 'postW',
                        align: 'center',
                         width:'70'
                    },
                     {
                        title: '产地',
                        key: 'departmentName',
                        align: 'center',
                        width:'100'
                    },
                      {
                        title: '长度',
                        key: 'sex',
                        align: 'center',
                         width:'100'
                    },
                      {
                        title: '减重',
                        key: 'acount',
                        align: 'center',
                        width:'100'
                        
                    },
                      {
                        title: '支数',
                        key: 'phone',
                        align: 'center',
                         width:'100'
                        
                    },
                     {
                        title: '件数',
                        key: 'mail',
                        align: 'center',
                         width:'100'
                    },
                      {
                        title: '单位',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                      {
                        title: '数量(吨)',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },   
                    {
                        title: '单价',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '金额',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },  
                    {
                        title: '核定件数',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    }, 
                    {
                        title: '核定数量',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '核定单价',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    }, 
                    {
                        title: '核定金额',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    }, 
                    {
                        title: '期数',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '出库卡号',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '出库件数',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '入库卡号',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '入库件数',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '入库数量',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '开单备注',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '审单备注',
                        key: 'mail1',
                        align: 'left',
                        width:'100'
                    },
                    {
                        title: '复核备注',
                        key: 'mail1',
                        align: 'left',
                        width:'100',
                        fixed: 'right',
                    },                                  
                ],
                dataShop:[
                     {
                        id: '12',
                        shopCname: '福建建刚钢厂',
                        postW: '开通',
                        departmentName: '现货交易',
                        sex:'上海市宝山区许竞争',
                        acount:"111113121313",
                        phone:"13444455555555",
                        mail:'11132132131313',
                        mail1:'13121313131313'

                    },
                    {
                        id: '12',
                        shopCname: '福建建刚钢厂',
                        postW: '开通',
                        departmentName: '现货交易',
                        sex:'上海市宝山区许竞争',
                        acount:"111113121313",
                        phone:"13444455555555",
                        mail:'11132132131313',
                        mail1:'13121313131313'

                    },
                ],//店铺表格
    }
    },
    methods:{
    
    },
    mounted(){
  
    },
    created(){
    
    },
  }
</script>
<style <style lang="less">
.buy_money{
   border:1px solid rgba(187,187,187,1);
   padding:10px 0 0 10px;
   background: #ffffff;
   margin-bottom:30px;
  .buy_title{
    font-size:13px;
    font-weight:400;
    color:rgba(102,102,102,1);
  };
  .row_buy{
    display: flex;
     dl{
       flex:1;
       dd{
         line-height:28px;
         font-size:13px;
         font-weight:400;
         color:rgba(51,51,51,1);
         text-indent: 10px;
       }
     }
  }
}
.row_button{
 border:1px solid rgba(221,221,221,1);
 border-top:0;
 padding:20px 0 20px 20px;
 display:flex;
 .add_bton{
   flex: 1;
 }
}
</style>

