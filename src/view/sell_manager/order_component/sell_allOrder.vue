<!--
 * @Description: 订单全部明细
 * @Author: wb
 * @others: 
 * @Date: 2019-04-02 10:41:54
 -->

<template>
  <div>
  
      <row>

           <!-- <Table :columns="columns1" :data="data1"></Table> -->
             <!-- 新的table -->
            <vxe-table 
            show-footer
            :footer-method="footerMethod"
            size="mini"
            :height="tableHeight"
            :data.sync="data1">
                <vxe-table-column width="40"  type="index" fixed="left"  ></vxe-table-column>
                <vxe-table-column width="40" field="id" title="ID"  fixed="left" ></vxe-table-column>
                <vxe-table-column width="100" field="steelName" title="品名"  fixed="left"></vxe-table-column>
                <vxe-table-column width="100" field="steelGuige" title="规格" fixed="left"></vxe-table-column>
                <vxe-table-column width="100" field="steelPaihao" title="材质" fixed="left"></vxe-table-column>
                <vxe-table-column width="100" field="steelPinpai" title="钢厂"></vxe-table-column>
                
                <vxe-table-column width="100" field="jianshu"  title="件数"></vxe-table-column>
                <vxe-table-column width="100" field="guapaijia" :formatter="this.$global.vxeTableMoney" title="单价"></vxe-table-column>
                <vxe-table-column width="100" field="zongzhongliang" :formatter="this.$global.vxeTableWeight" title="总重量"></vxe-table-column>
                <vxe-table-column width="100" field="cusMoney" :formatter="this.$global.vxeTableMoney"  title="销售总额"></vxe-table-column>
                <vxe-table-column width="100" field="internetMoney" :formatter="this.$global.vxeTableMoney" title="网价"></vxe-table-column>
                <vxe-table-column width="100" field="floatMoney"   title="浮动价格"></vxe-table-column>
                <vxe-table-column width="100" field="region"  title="网价区域"></vxe-table-column>
                <vxe-table-column width="100" field="internetMoneyNote"  title="网价备注"></vxe-table-column>
                <vxe-table-column width="100" field="kunbaohao"  title="捆包号"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanJianshu"   title="结算件数"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanDanjia" :formatter="this.$global.vxeTableMoney"  title="结算单价"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanWeight" :formatter="this.$global.vxeTableWeight" title="结算重量"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanMoney" :formatter="this.$global.vxeTableMoney" title="结算金额"></vxe-table-column>
                <!-- <vxe-table-column width="120" field="buyRealDanjia" :formatter="this.$global.vxeTableMoney"  title="采购结算单价"></vxe-table-column>
                <vxe-table-column width="120" field="buyRealWeight" :formatter="this.$global.vxeTableWeight"  title="采购结算吨位"></vxe-table-column>
                <vxe-table-column width="120" field="buyRealMoney" :formatter="this.$global.vxeTableMoney"  title="采购结算金额"></vxe-table-column> -->
                <vxe-table-column width="120" field="duizhangTime"   title="对账时间"></vxe-table-column>
                <vxe-table-column width="100" field="steelWorks" title="提货方式"></vxe-table-column>
                <vxe-table-column width="100" field="jiaohuodi" title="交货地"></vxe-table-column>
                <vxe-table-column width="100" field="jizhongType" title="计重方式"></vxe-table-column>
                <!-- 新增字段参数 -->
                 <vxe-table-column prop="infoType"  width="80" label="明细类型"  :formatter="this.$global.vexLiXi" ></vxe-table-column> 
                
                 <vxe-table-column show-overflow prop="realUnitPrice" label="实提单价"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
                 <vxe-table-column show-overflow prop="realMoney" label="实提金额"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
                 <vxe-table-column show-overflow prop="interestUnitPrice" label="利息单价"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
                 <vxe-table-column show-overflow prop="sointerestMoney" label="利息金额"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
                 <vxe-table-column show-overflow prop="note" label="备注" width="80"></vxe-table-column>



            </vxe-table>
      </row>

  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import {
    findOrdersInfoAll,
            } from '@/api/data_8889'
  export default {
    name: 'allOrder',
    props: ["allOrder_orderItem"],
    data(){
      return {
        tableHeight:40,
        data2:[],
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
                    if(['cusMoney','jiesuanMoney','realMoney','sointerestMoney'].includes(column.property)){//
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
              this.tableHeight = (this.data1.length+1) *40 +100;
            }else{
            }
          })
       }
    },
    mounted () {
     
    },
    watch: {
        allOrder_orderItem(val){
            this.valueForm_allOrder_orderItem = val;
            this.getOrderInfo()
        }
    },
  }
</script>
<style <style lang="less">

</style>

