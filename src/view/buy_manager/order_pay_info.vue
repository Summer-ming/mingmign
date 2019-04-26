<!--
 * @Description: 订单申请付款
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 19:55:36
 -->




<template>
     <div>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
      <dl>
        <dt>采购单号：{{formItem.orderNo}}</dt>
        <dd>采购公司：{{formItem.cusOrgName}}</dd>
      </dl>
      <dl>
        <dt>供应商公司：{{formItem.shopOrgName}}</dt>
        <dd>采购员：{{formItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{formItem.money}}</dt>
      </dl>
        
    </row>
    <row>
        <b class="font_32">合同信息</b>
        <Table border ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table>
    </row>
   
      <row>
        <Form :model="formItem" inline :label-width="100">
          <FormItem label='本次付款金额'>
          <Input style='width:300px' v-model='formItem.payMoney' placeholder='请输入金额'/>
          </FormItem>
          <FormItem label='抵扣金额'>
          <Input style='width:300px' v-model='formItem.dikouMoney' placeholder='请输入抵扣金额'/>
          </FormItem>
        </Form>
      </row>
       <row>
      <Button style="margin-right:10px" type="primary" @click="addBtn"> 提交</Button>
      <Button type="primary" @click="deletBtn"> 删除</Button>
    </row>
     </div>
</template>

<script>
import {findOrdersInfoAll,updateFukuanZhenghe} from '@/api/data'
import { mapMutations } from 'vuex'

export default {
    name: 'order_pay_info',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        formItem:{
          payMoney:'',
          dikouMoney:'0',
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:''
        },
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        columns4: [
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'120'
                    },
                    {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '提货方式',
                        key: 'steelWorks',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '交货地',
                        key: 'jiaohuodi',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '总重量',
                        key: 'zongzhongliang',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.zongzhongliang,3))
                        }
                    },
                     {
                        title: '单价',
                        key: 'guapaijia',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.guapaijia,2))
                        }
                    },
                    
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100'
                    }
                    
                ],
                data1: [
                ],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      ...mapMutations([
      'closeTag'
      ]),
        setOrderInfo(){
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName     
          this.formItem.payMoney              = parseFloat(this.$route.query.moneyAll)
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll) 
          this.getOrderInfo();
      },
       selectOne(row){
         console.log(row)
       },
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.orgName=this.formItem.companyName //name
         param.pageNum=this.pagesizea //分页
         param.status = 1 ;
         this.getSerch(param)
       },
        getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              this.data1 = res.data.list;
              this.$Notice.success({
                title:'获取订单明细成功'
              })
            }else{
              this.$Notice.error({
                title:'获取订单明细失败'
              })
            }
          })
      },
       remove(index){
         this.data1.splice(index,1);
       },
       addBtn(){//TODO:
         console.log("提交");
         let params ={};
            params.bankJgId                =  this.$route.query.bankJgId                    
            params.customerId              =  this.$route.query.customerId         
            params.id                      =  this.$route.query.id  
            if(this.formItem.dikouMoney == 0){
              params.jiesuanStatus           =  "1"
            }else{
              params.jiesuanStatus           =  "0" //需要抵扣变成0             
            }
            params.merchantsId             =  this.$route.query.merchantsId;           
            params.money                   =  this.formItem.payMoney //付款金额 
            params.updateDiKou             = this.formItem.dikouMoney //抵扣金额 
            params.note                    =  ""    
            params.operator                = this.$global.adminInfo.id         
            params.orderId                 = this.$route.query.id;      
            params.orderStatus             = "3"            
            params.statusNote              = ""           
            params.userId                  = this.$global.adminInfo.id
            params.orderType              = "1"           

            console.log(params)       
          updateFukuanZhenghe(params).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'提交付款申请成功',
                     duration:1,
                     onClose:res =>{
                        console.log("关闭时回调")
                       this.closeSelf();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'提交付款申请失败'
                 })
             }
          })
       },
       deletBtn(){

       },
       closeSelf(){
         this.closeTag({
              name: 'order_pay_info'
          })
       }
    },
    
    mounted(){
     this.setOrderInfo();

    },
    
    created(){
   
    },
}

</script>
<style <style lang="less">


.order_all{
  height:100px;
  background:rgba(235,254,255,1);
  border:1px dashed rgba(134,223,228,1);
  display:flex;
  dl{
    flex:1;
    padding-top:20px;
    dt{
     height:14px;
      font-size:14px;
      font-family:SourceHanSansCN-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:14px;
      text-indent:20px;
      margin-bottom:20px;
    }
    dd{
      height:14px;
      font-size:14px;
      text-indent:20px;
      font-family:SourceHanSansCN-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:14px
    }
  }
}
.font_32 {
        font-size: 32;
    }
</style>