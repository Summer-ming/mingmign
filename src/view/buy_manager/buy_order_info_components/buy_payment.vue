<template>
  <div>
  
      <row>
             <vxe-table 
             show-footer
             :footer-method="footerMethod"
          ref="xTable1" :data.sync="dataList"  >
                <vxe-table-column width="40"  type="index" ></vxe-table-column>
                <vxe-table-column width="40" field="id" title="ID" ></vxe-table-column>

                <vxe-table-column width="100" :formatter="this.$global.vxeTableMoney" field="inMoney" title="已入金额" ></vxe-table-column>
                <vxe-table-column width="100" :formatter="this.$global.vxeTableMoney" field="outMoney" title="已出金额" ></vxe-table-column>
                <vxe-table-column width="100" :formatter="getOrgMoneyRecordTypeThis" field="payMoneyType" title="类型" ></vxe-table-column>
                <vxe-table-column width="150"  field="orderId" title="主订单id" ></vxe-table-column>
                <vxe-table-column width="100"  field="createTime" title="时间" ></vxe-table-column>
                <vxe-table-column width="100"  field="daozhangdanId" title="到帐单id" ></vxe-table-column>
                <vxe-table-column width="100"  field="dikouOrderId" title="抵扣订单id" ></vxe-table-column>
                <vxe-table-column width="100"  field="dikouOrderNo" title="抵扣订单号" ></vxe-table-column>

            </vxe-table>

      </row>


  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import  {findCashFlow,findOrgMoneyRecord }from '@/api/data'
import {getBuyOrderCaoZuoStatus,getOrgMoneyRecordType} from '@/libs/allStatus'
  export default {
    name: 'buy_payment',
    props: ["allOrder_orderItem"],
    data(){
      return {
        valueForm_allOrder_orderItem:"",
        dataList:[],
        current:0,
      }
    },
    methods:{
       //列表底部合计
      footerMethod({columns,data}){
        return [
          columns.map((column,columnIndex)=>{
            if(columnIndex === 0){
              return '列表合计'
            }
            if(['inMoney','outMoney'].includes(column.property)){
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property))
            }
            if(['orderId'].includes(column.property)){//显示已入金额 和 已出金额的差值
                    let inall = 0;
                    let outall = 0;
                    let cha = 0
                    this.dataList.map(item=>{
                      inall = this.$global.accAdd(inall,item.inMoney)
                      outall = this.$global.accAdd(outall,item.outMoney)
                    })
                    cha = this.$global.accMinus(inall,outall)
                    return '差值：'+this.$global.isMoneyShow(cha)
            }
          })
        ]
      },
      getOrgMoneyRecordTypeThis({ cellValue, row, column }){
        console.log(cellValue);
        return getOrgMoneyRecordType(cellValue)
      },
        getOrderAuditList(){//获取订单审核流信息
          let params = {};
          params.orderId = this.valueForm_allOrder_orderItem.id;
          let a = this.$global.pinjieStr("2,14")
          // params.six = a;
          params.status = "1"
          params.pageSize ="99999"
          params.type = "2"
            findOrgMoneyRecord(params).then(res =>{
              if(res.code =='100' && res.data.list.length>0){
                  this.dataList = res.data.list
                  this.current = res.data.list.length;
              }else{
              }
            })
       },
       getOrderAuditListDiKou(){//获取订单审核流信息
          let params = {};
          params.dikouOrderId = this.valueForm_allOrder_orderItem.id;
          let a = this.$global.pinjieStr("6")
          params.six = a;
          params.status = "1"
          params.pageSize ="99999"
          params.type = "2"
            findOrgMoneyRecord(params).then(res =>{
              if(res.code =='100' && res.data.list.length>0){
                  res.data.list.map(item=>{
                      this.dataList.push(item);
                  })
              }else{
              }
            })
       },
    },
    mounted(){
     
    },
       watch: {
        allOrder_orderItem(val){
            console.log("watch buy_examine");
            console.log(val.ordersNo);
            this.valueForm_allOrder_orderItem = val;
            this.getOrderAuditList();
            this.getOrderAuditListDiKou();
        }
    },
  }
</script>
<style <style lang="less">

</style>

