<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div>
         <h3>杂费申请明细11</h3>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
          <vxe-table  border
            show-footer
            resizable
          size="mini" ref="xTable1" :footer-method="footerMethod"
           :data.sync="data1"    
           >

                <vxe-table-column width="60" field="id" show-overflow title="ID" ></vxe-table-column>
                <vxe-table-column width="200" field="orgName" show-overflow title="公司名称" ></vxe-table-column>
                <vxe-table-column width="160" field="orderNo" show-overflow title="订单号" >
                    <template v-slot="{row}">
                        <a style=' cursor:pointer;'  @click='gotoSellOrderInfo(row)' type="text">{{row.orderNo}}</a>
                    </template>
                </vxe-table-column>
                <vxe-table-column width="100" field="outMoney" title="实际付款金额(元)"  :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column width="100" field="dikouMoney" title="优惠金额(元)"  :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column width="160" field="createTime" title="申请时间"  ></vxe-table-column>
                <vxe-table-column width="100" field="payMoneyType" title="类型1"  ></vxe-table-column>
                <vxe-table-column width="200" field="payMoneyType" :formatter="payMoneyTypeStr" title="类型"  ></vxe-table-column>

            </vxe-table>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findOrgMoneyRecord} from '@/api/data'
import XEUtils from 'xe-utils'
import {getOrgMoneyRecordType} from '@/libs/allStatus'

export default {
    name: 'invoice_omoney_list_info',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
       formItem:{},
       data1:[],
       columns4: [
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
        gotoSellOrderInfo(row){
            row.operateType  ="1"//查看
            sessionStorage.setItem('XiaoShou','')
            row.ordersNo=row.orderNo
            sessionStorage.setItem('XiaoShou',JSON.stringify(row))
                const route = {
                   name: 'sell_order_info',
                 }
                 this.$router.push(route)
        },
        payMoneyTypeStr({cellValue, row, column}){
            return getOrgMoneyRecordType(cellValue)
        },
          footerMethod({columns,data}){
        return [
          columns.map((column,columnIndex)=>{
            if(columnIndex === 0){
              return '当页合计'
            }
            if(['outMoney','dikouMoney'].includes(column.property)){
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)

            }

          })
        ]
      },
       //查询表格
       searchM(row){
           let p = {};
           p.zhidanApplyId =row.zhidanApplyId;
           p.payMoneyType = '19'
           p.pageSize="9999"
           p.status  ="1"
          findOrgMoneyRecord(p).then(res =>{
                if(res.code =='100'){
                    this.data1 = res.data.list;
                  this.$Notice.success({
                    title:'查询成功',
                 })
              }else{
                   this.$Notice.error({
                   title:'查询失败'
                  })
              }
           })
       },
    },
    
    mounted(){

     let receivedItem = JSON.parse(sessionStorage.getItem('SELL_OM_LIST_INFO'));
     console.log(receivedItem)
     this.searchM(receivedItem);

    },
    
    created(){
   
    },
}

</script>
