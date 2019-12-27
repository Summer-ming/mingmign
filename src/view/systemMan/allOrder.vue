<!--
 * @Description: 订单全部明细
 * @Author: wb
 * @others: 
 * @Date: 2019-04-02 10:41:54
 -->

<template>
  <div>
  
      <row>

           <Table :columns="columns1" :data="data1"></Table>

      </row>


  </div>
</template>
<script>
import {
    findOrdersInfoAll,
            } from '@/api/data'
  export default {
    name: 'allOrder',
    props: ["allOrder_orderItem"],
    data(){
      return {
        valueForm_allOrder_orderItem:"",
       columns1: [
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
                        width:'100'
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
                  
                ]
              
      }
    },
    methods:{
       getOrderInfo(){//监听到数据后，加载数据 TODO:
             let params = {};
          params.orderNo = this.valueForm_allOrder_orderItem.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              this.data1 = res.data.list;
            }else{
            }
          })
       }
    },
    mounted () {
    },
    watch: {
        allOrder_orderItem(val){
            console.log("watch");
            console.log(val.ordersNo);
            this.valueForm_allOrder_orderItem = val;
            this.getOrderInfo()
        }
    },
  }
</script>
<style <style lang="less">

</style>

