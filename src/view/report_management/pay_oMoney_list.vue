<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div>
         <h3>杂费申请明细</h3>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Table  border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
        </Table>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {getOrgMoneyRecordType} from '@/libs/allStatus'
export default {
    name: 'pay_oMoney_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
       formItem:{},
       data1:[],
       columns4: [
          {
                        title: '#',
                        key: '',
                        align: 'center',
                        type:'index'
                        // width:'60'
                    },
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
                        title: '订单号',
                        key: 'orderNo',
                        align: 'center',
                        // width:'200',
                        render:(h,params) =>{
                          return h('a',{
                            on:{
                                click: () => {
                                           params.row.operateType  ="1"//查看
                                           sessionStorage.setItem('XiaoShou','')
                                           params.row.ordersNo=params.row.orderNo
                                           sessionStorage.setItem('XiaoShou',JSON.stringify(params.row))
                                               const route = {
                                                  name: 'sell_order_info',
                                                }
                                                this.$router.push(route)
                                        }
                            }
                          },params.row.orderNo);
                        }
                    },
                     {
                        title: '实际付款金额(元)',
                        key: 'outMoney',
                        align: 'center',
                        // width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.outMoney))
                        }
                        
                    },
                    {
                        title: '优惠金额(元)',
                        key: 'dikouMoney',
                        align: 'center',
                        // width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dikouMoney))
                        }
                        
                    },
                     {
                        title: '申请时间',
                        key: 'createTime',
                        align: 'center',
                        // width:'120'
                    },
                    {
                        title: '类型1',
                        key: 'payMoneyType',
                        align: 'center',
                        // width:'120'
                    },
                    {
                        title: '类型',
                        key: 'payMoneyType',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{

                          },getOrgMoneyRecordType(params.row.payMoneyType))
                        }
                    },
                   
                    
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
       //查询表格
       searchM(){
          
       },
    },
    
    mounted(){
        let receivedItem = JSON.parse(sessionStorage.getItem('SELL_OM_ZHIDAN_ITEM'));
        this.data1 = receivedItem.orgnizations;
        console.log("接收到的数据")
        console.log(receivedItem.jgJieSuanId);
        console.log(receivedItem.orgnizations);

     this.searchM();
    },
    
    created(){
   
    },
}

</script>
