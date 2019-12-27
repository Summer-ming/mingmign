<template>
  <div>
  
      <row>
            <!-- 新的vxe table -->
        <vxe-table style="margin-top:10px"  show-footer :footer-method="footerMethod"
          border  resizable  size="mini" ref="xTable1" :data.sync="dataList"  >
        <vxe-table-column show-overflow  width="60" field="jgJieSuanId" title="ID" ></vxe-table-column>
        <vxe-table-column show-overflow width="60" field="key1" title="状态" ></vxe-table-column>
        <vxe-table-column show-overflow width="140" field="merchantsName" title="供应商名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="160"  field="customerOrgName" title="订单采购方名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="160"  field="skOrgName" title="收款公司名称" ></vxe-table-column>
        <vxe-table-column show-overflow width="160" field="orderNo" title="订单号" >
        </vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="actualApyMoney" title="付款金额(元)" ></vxe-table-column>
        <vxe-table-column align='right' show-overflow width="100"  :formatter="this.$global.vxeTableMoney" field="dikouMoney" title="申请抵扣金额 (元)" ></vxe-table-column>

        <vxe-table-column  show-overflow  width="60" field="businessNote" title="备注" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="160" field="payTime" title="付款时间" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="160" field="jgJieSuanCreateTime" title="申请时间" ></vxe-table-column>
        <vxe-table-column  show-overflow  width="60" field="userName" title="管理员" ></vxe-table-column>
        <vxe-table-column  show-overflow :formatter="tableItemTypeStr"  width="100" field="jgJieSuanOperatorType" title="类型" ></vxe-table-column>
        </vxe-table>
      </row>


  </div>
</template>
<script>
import  {findJgJieSuanInfo }from '@/api/data'
import {zhidanTypeLis,getJiesuanStatus} from '@/libs/allStatus'
import XEUtils from 'xe-utils'

  export default {
    name: 'buy_pay_apply',
    props: ["allOrder_orderItem"],
    data(){
      return {
        valueForm_allOrder_orderItem:"",
        dataList:[],
      }
    },
    methods:{
        footerMethod ({ columns, data }) {
         //tableTotalDic
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '当页合计'
                  }
                    if(['actualApyMoney','dikouMoney'].includes(column.property)){//
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)
                  }    
                  return '-'
                }),
                // columns.map((column, columnIndex) => {
                //   if (columnIndex === 0) {
                //     return '全部合计'
                //   }
                //     if(['actualApyMoney'].includes(column.property)){//
                //     console.log("全部合计中"+this.tableTotalDic.actualApyMoney);
                //     return this.$global.isMoneyShow(this.tableTotalDic.actualApyMoney);
                //   } 
                //    if(['dikouMoney'].includes(column.property)){//
                //     return this.$global.isMoneyShow(this.tableTotalDic.dikouMoney);
                //   }    
                //   return '-'
                // })
              ]
       },
        tableItemTypeStr({cellValue, row, column}){
        return zhidanTypeLis(cellValue);
      },
     
        getOrderPayApplyList(){//获取订单审核流信息
          let p           = {};
              p.beginStatus    = "1"
              p.endStatus    = "1"
              p.pageSize  = "99999"
              p.orderType = '1'
              p.orderNo   = this.valueForm_allOrder_orderItem.ordersNo
            findJgJieSuanInfo(p).then(res =>{
              if(res.code =='100' && res.data.list.length>0){
                  this.dataList = res.data.list
                  this.dataList.map(item=>{
                        //状态
                          item.key1 =  getJiesuanStatus(item.jgJieSuanCaoZuoStatus) 
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
            this.getOrderPayApplyList();
        }
    },
  }
</script>
<style <style lang="less">

</style>

