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
       <p>杂费合计</p>
       <row>

           <Table width="500" :columns="columns2" :data="data2"></Table>

      </row>
  </div>
</template>
<script>
import {
    findOrdersInfoAll,
            } from '@/api/data'
  export default {
    name: 'buy_allOrder',
    props: ["allOrder_orderItem"],
    data(){
      return {
        data2:[],
        columns2:[
                    {
                        title: '序号',
                        width:'80',
                        render: (h, params) => {
                            return h('span', params.index+1);
                        }
                    },
                    {
                        title: '杂费合计',
                        key: 'money',
                        align: 'center',
                        width:'120'
                    },
                    {
                        title: '公司名称',
                        key: 'orgName',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '条目合计',
                        key: 'name',
                        align: 'center',
                        width:'auto'
                    },
        ],
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
                    },

                    //6种杂费1
                    //杂费1
                    {
                        title: '杂费1名称',
                        key: 'om1Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费1金额',
                        key: 'om1Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om1Money,2))
                        }
                    },
                    {
                        title: '杂费1公司',
                        key: 'om1OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费1公司id',
                        key: 'om1OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费2

                    {
                        title: '杂费2名称',
                        key: 'om2Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费2金额',
                        key: 'om2Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om2Money,2))
                        }
                    },
                    {
                        title: '杂费2公司',
                        key: 'om2OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费2公司id',
                        key: 'om2OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费3

                    {
                        title: '杂费3名称',
                        key: 'om3Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费3金额',
                        key: 'om3Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om3Money,2))
                        }
                    },
                    {
                        title: '杂费3公司',
                        key: 'om3OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费3公司id',
                        key: 'om3OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费4

                    {
                        title: '杂费4名称',
                        key: 'om4Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费4金额',
                        key: 'om4Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om4Money,2))
                        }
                    },
                    {
                        title: '杂费4公司',
                        key: 'om4OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费4公司id',
                        key: 'om4OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费5

                    {
                        title: '杂费5名称',
                        key: 'om5Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费5金额',
                        key: 'om5Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om5Money,2))
                        }
                    },
                    {
                        title: '杂费5公司',
                        key: 'om5OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费5公司id',
                        key: 'om5OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费6

                    {
                        title: '杂费6名称',
                        key: 'om6Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费6金额',
                        key: 'om6Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om6Money,2))
                        }
                    },
                    {
                        title: '杂费6公司',
                        key: 'om6OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费6公司id',
                        key: 'om6OrgId',
                        align: 'center',
                        width:'100'
                    },
                ],
                data1: [
                  
                ]
              
      }
    },
    methods:{
        getOTmoenyList(baseData){//获取杂费合计的列表
          let aList = [];
          //1：先将所有的杂费放在一个列表中
          baseData.map(item=>{
            if(Number(item.om1Money)>0){
              let dic = {};
              dic.name    = item.om1Name
              dic.money   = item.om1Money
              dic.orgName = item.om1OrgName
              dic.orgId   = item.om1OrgId
              aList.push(dic);
            }
            if(Number(item.om2Money)>0){
              let dic = {};
              dic.name    = item.om2Name
              dic.money   = item.om2Money
              dic.orgName = item.om2OrgName
              dic.orgId   = item.om2OrgId
              aList.push(dic);
            }
            if(Number(item.om3Money)>0){
              let dic = {};
              dic.name    = item.om3Name
              dic.money   = item.om3Money
              dic.orgName = item.om3OrgName
              dic.orgId   = item.om3OrgId
              aList.push(dic);
            }
            if(Number(item.om4Money)>0){
              let dic = {};
              dic.name    = item.om4Name
              dic.money   = item.om4Money
              dic.orgName = item.om4OrgName
              dic.orgId   = item.om4OrgId
              aList.push(dic);
            }
            if(Number(item.om5Money)>0){
              let dic = {};
              dic.name    = item.om5Name
              dic.money   = item.om5Money
              dic.orgName = item.om5OrgName
              dic.orgId   = item.om5OrgId
              aList.push(dic);
            }
            if(Number(item.om6Money)>0){
              let dic = {};
              dic.name    = item.om6Name
              dic.money   = item.om6Money
              dic.orgName = item.om6OrgName
              dic.orgId   = item.om6OrgId
              aList.push(dic);
            }
          })
          //步骤2 将获取的数组,取出来相同的公司
          let bList =  [];
          var cList = [];
          
          aList.map(item=>{
            if(bList.indexOf(item.orgName) ==-1){
              bList.push(item.orgName)
              var dic = {};
              dic.name    = ''
              dic.money   = 0
              dic.orgName = item.orgName
              dic.orgId   = item.orgId
              cList.push(dic);
            }
          })
          console.log(aList)
          console.log(bList)

          //步骤3：获取对应的字段
          for(var i in aList){
            var itema = aList[i];
            for(var j in cList){
              var itemb = cList[j];
              if(itemb.orgName == itema.orgName){
                 if(itemb.name !="" && itemb.name!=""){
                      itemb.name = itemb.name +',' +itemb.name;
                }
                      itemb.money = Number(itemb.money) +Number(itema.money)
              }
        
            }
          }
          console.log(cList)
          this.data2 = cList;

      },
       getOrderInfo(){//监听到数据后，加载数据 TODO:
             let params = {};
          params.orderNo = this.valueForm_allOrder_orderItem.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              this.data1 = res.data.list;
              this.getOTmoenyList(this.data1)
              this.$Notice.success({
                title:'获取订单明细成功'
              })
            }else{
              this.$Notice.error({
                title:'获取订单明细失败'
              })
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

