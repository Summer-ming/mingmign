<!--
 * @Description: 订单全部明细
 * @Author: wb
 * @others: 
 * @Date: 2019-04-02 10:41:54
 -->

<template>
  <div id='wnag'>
      <row>
           <!-- <Table :columns="columns1" :data="data1"></Table> -->
            <vxe-table 
            border
            show-footer
            height="400"
            :footer-method="footerMethod"
            size="mini"
            :data.sync="data1">
                <vxe-table-column width="40"  type="index" fixed="left" ></vxe-table-column>
                <vxe-table-column width="40" field="id" title="ID"  fixed="left" ></vxe-table-column>
                <vxe-table-column width="60" field="steelName" title="品名" fixed="left"  ></vxe-table-column>
                <vxe-table-column width="60" field="steelGuige" title="规格" fixed="left"></vxe-table-column>
                <vxe-table-column width="80" field="steelPaihao" title="材质" fixed="left" ></vxe-table-column>
                <vxe-table-column width="80" field="steelPinpai" title="钢厂" fixed="left"></vxe-table-column>
                
                <vxe-table-column width="80" field="jianshu"  title="件数"></vxe-table-column>
                <vxe-table-column width="100" field="guapaijia" :formatter="this.$global.vxeTableMoney" title="单价"></vxe-table-column>
                <vxe-table-column width="100" field="zongzhongliang" :formatter="this.$global.vxeTableWeight" title="总重量"></vxe-table-column>
                <vxe-table-column width="100" field="cusMoney" :formatter="this.$global.vxeTableMoney"  title="采购总额"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanJianshu"   title="实提件数"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanDanjia" :formatter="this.$global.vxeTableMoney"  title="实提单价"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanWeight" :formatter="this.$global.vxeTableWeight" title="实提重量"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanMoney" :formatter="this.$global.vxeTableMoney" title="实提金额"></vxe-table-column>
                <vxe-table-column width="80" field="steelWorks" title="提货方式"></vxe-table-column>
                <vxe-table-column width="80" field="jiaohuodi" title="交货地"></vxe-table-column>
                <vxe-table-column width="80" field="jizhongType" title="计重方式"></vxe-table-column>
                <vxe-table-column width="100" field="kunbaohao"  title="捆包号"></vxe-table-column>

            </vxe-table>
      </row>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'

import {
    findOrdersInfoAll,
            } from '@/api/data'
  export default {
    name: 'buy_allOrder',
    props: ["allOrder_orderItem"],
    data(){
      return {
        data2:[],
        tableHeight:400,
        columns2:[
                  
        ],
        valueForm_allOrder_orderItem:"",
       columns1: [
                ],
                data1: [
                  
                ]
              
      }
    },
    methods:{
      //footer 合计
       footerMethod ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '合'
                  }
                  if(['jianshu'].includes(column.property)){//判断件数 返回 0位小数点
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),0)
                  }
                    if(['cusMoney','jiesuanMoney'].includes(column.property)){//
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)
                  }    
                  if (['zongzhongliang','jiesuanWeight'].includes(column.property)) {//重量返回 3位小数点
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),3)
                  }
                  return '-'
                })
              ]
       },
       
      
       getOrderInfo(){//监听到数据后，加载数据 TODO:
             let params = {};
          params.orderNo = this.valueForm_allOrder_orderItem.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              this.data1 = res.data.list.reverse();
              // this.tableHeight = (this.data1.length) *80 +60;
              // console.log("this.tableHeight:"+this.tableHeight)
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
  // 让表格紧凑，并宽度统一
     #wnag .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {
        padding: 0 2px;
      }
       #wnag .vxe-table.size--mini .vxe-body--column{
         height:20px;
       }
</style>

