<template>
  <div class="container">
    <tree-table  :data="data" :columns="columns" border/>
  </div>
</template>
<script>
  import treeTable from "./TreeTable";
  export default {
    data(){
      return {
        columns: [
        
          {
            text: "ID",
            value: "id",
            align:'center'
          },
          {
            text:'订单号',
            value:"ordersNo",
            align:'center'
          },
          {
            text:'采购方名称',
            value:"customerOrgName",
            align:'center'
          },
          {
            text:"供应商名称",
            value:"shopOrgName",
            align:'center'
          },
          {
            text:"合同金额(元)",
            value:"moneyAll",
            align:'center'
          },
          {
            text:"合同重量(吨)",
            value:"zhongliangAll",
            align:'center'
          },
          {
            text:"实提重量(吨)",
            value:"deliveryTotalWeight",
            align:'center'
          },
           {
            text:"实提总贷款(元)",
            value:"deliveryTotalMoneyCus",
            align:'center'
          },
          {
            text:"下单时间",
            value:"createTime",
            align:'center'
          },
          {
            text:"管理员",
            value:"userName",
            align:'center'
          },
          {
            text:"工程名称",
            value:"gongcheng",
            align:'center'
          },
          {
            text:"采购类型",
            value:"buyType",
            align:'center'
          },
          {
            text:"状态",
            value:"status",
            align:'center'
          
          },
          
        ],
        data: [
          {
            id: 0,
        
            timeLine: 50,
            comment: "无",  
            ordersNo:"订单号",
            customerOrgName:"采购方名称",
            shopOrgName:"供应商名称",
            moneyAll:"合同金额",
            zhongliangAll:"合同重量",
            deliveryTotalWeight:'实提重量',
            deliveryTotalMoneyCus:'实提总贷款',
            createTime:"下单时间",
            userName:'管理员',
            gongcheng:"工程名称",
            buyType:"采购类型",
            status:"状态",
          },
          {
            id: 1,
         
            timeLine: 100,
            comment: "无",
            ordersNo:"订单号",
            customerOrgName:"采购方名称",
            shopOrgName:"供应商名称",
            moneyAll:"合同金额",
            zhongliangAll:"合同重量",
            deliveryTotalWeight:'实提重量',
            deliveryTotalMoneyCus:'实提总贷款',
            createTime:"下单时间",
            userName:'管理员',
            gongcheng:"工程名称",
            buyType:"采购类型",
            status:"状态",
            child: [
              {
                id: 2,
             
                timeLine: 10,
                comment: "无",
                ordersNo:"订单号",
                customerOrgName:"采购方名称",
                shopOrgName:"供应商名称",
                moneyAll:"合同金额",
                zhongliangAll:"合同重量",
                deliveryTotalWeight:'实提重量',
                deliveryTotalMoneyCus:'实提总贷款',
                createTime:"下单时间",
                userName:'管理员',
                gongcheng:"工程名称",
                buyType:"采购类型",
                status:"状态",
              },
              {
                id: 3,
               
                timeLine: 90,
                comment: "无",
                ordersNo:"订单号",
                customerOrgName:"采购方名称",
                shopOrgName:"供应商名称",
                moneyAll:"合同金额",
                zhongliangAll:"合同重量",
                deliveryTotalWeight:'实提重量',
                deliveryTotalMoneyCus:'实提总贷款',
                createTime:"下单时间",
                userName:'管理员',
                gongcheng:"工程名称",
                buyType:"采购类型",
                status:"状态",
                 
              }
            ]
          }
        ]
      }
    },

    components: { treeTable },
    watch: {

    },
    methods: {

    },
    mounted() {


    }
  }
</script>
<style lang="less" scoped>
.el-table th{
  text-align: center!important;
  background:red!important;
}
.el-table .cell{
  text-align:center!important;
}
</style>



