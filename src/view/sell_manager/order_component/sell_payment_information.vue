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
import { findOrdersInfoAll,} from '@/api/data_8889'
                      //添加订单 //修改订单的已收款金额
import { getKeHuLiuShui,getTi, getXiuGaiOrderStatus89,getKeHuLiuShuiBiao} from '@/api/cusData'
import {getOrgMoneyRecordType} from '@/libs/allStatus'
        //确认到账单有效
import {updateDaoZhangDanBatch2} from '@/api/data'
  export default {
    name: 'allOrder',
    inject:['reload'],  //調用組建app.vue
    props: ["allOrder_orderItem"],
    data(){
      return {
       data1:[],
        valueForm_allOrder_orderItem:"",
       columns1: [
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '已入金额',
                        key: 'inMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.inMoney))
                        }
                    },
                    {
                        title: '已出金额',
                        key: 'outMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.outMoney))
                        }
                    },
                     {
                        title: '类型',
                        key: 'payMoneyType',
                        align: 'center',
                        width:'150',
                        render:(h,params) =>{
                          return h('div',{
                          },getOrgMoneyRecordType(params.row.payMoneyType))
                        }
                    },
                     {
                        title: '到帐单id',
                        key: 'daozhangdanId',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '主订单id',
                        key: 'orderId',
                        align: 'center',
                        width:'120'
                    },
                     {
                        title: '使用的订单id',
                        key: 'dingdanid',
                        align: 'center',
                        width:'120'
                    },
                     {
                        title: '时间',
                        key: 'createTime',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '类型',
                        key: 'payMoneyType',
                        align: 'center',
                        width:'100'
                    },
                      {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        // fixed:'right',
                        width:'100',
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                              this.remove(params)
                                        }
                                    }
                                }, '删除'),
                             ]);
                             }    
                    },
                   
                 
                ],
                data1: [
                  
                ]
              
      }
    },
    methods:{
       //删除
       remove(params){
            this.$Modal.confirm({
             title: '删除',
             content: '确定需要删除吗?',
             onOk:()=>{
               if(params.row.payMoneyType=='2'){
                 console.log('==================')
                 console.log(params.row.payMoneyType)

                 this.step2(params);
               }else if(params.row.payMoneyType=='14'){
                  console.log('============3333333======')
                  this.stepP2(params);
                 console.log(params.row.payMoneyType)
               }
               
             },
             onCancel:()=>{},

        })
          console.log('我是删除的数据')
          console.log(params)
       },
       //列表类型2的接口数据
       //步骤1 修改到账单的信息，让到账单可以继续使用
       //步骤2 删除该条流水
       //步骤3 修改订单 receviedmOney
       step2(params){
           let param1            = {pageDaoZahangDanForUpdateList:[]};
           let dic               = {};
               dic.daozhangdanId = params.row.daozhangdanId;
               dic.addDealMoney  = params.row.inMoney;
               dic.dStatus       = '2'
           param1.pageDaoZahangDanForUpdateList.push(dic)
           updateDaoZhangDanBatch2(param1).then(res=>{
             console.log('我是步骤二')
             console.log(res)
                    if(res.code =="100"){
                         this.step23(params)
                      }  
            })
       },
       //删除该条流水
       step23(params){
             let param2     = {list:[]};
             let dic        = {};
                 dic.id     = params.row.id;
                 dic.status = '0';
             param2.list.push(dic)
             getKeHuLiuShuiBiao(param2).then(res=>{
                  console.log('=========12121251')
                 if(res.code =="100"){
                         //getXiuGaiOrderStatus89
                         let param3            = {pageUpdateOrderList:[]};
                             dic               = {};
                             dic.id            = this.valueForm_allOrder_orderItem.id;
                             dic.receivedMoney = (0-params.row.inMoney)
                         param3.pageUpdateOrderList.push(dic)

                         getXiuGaiOrderStatus89(param3).then(res=>{
                                     if(res.code =="100"){
                                       console.log("成功，开始刷新")
                                       this.$Notice.success({
                                                 title:'删除成功',
                                                 duration:1,
                                                 onClose:res =>{
                                                    this.reload();
                                                 }
                                              })
                                     }
                         })
                  }  
            })
       },



       stepP2(params){
           let param1            = {pageDaoZahangDanForUpdateList:[]};
           let dic               = {};
               dic.daozhangdanId = params.row.daozhangdanId;
               dic.addDealMoney  = params.row.inMoney;
               dic.dStatus       = '2'
           param1.pageDaoZahangDanForUpdateList.push(dic)
           updateDaoZhangDanBatch2(param1).then(res=>{
             console.log('我是步骤二')
             console.log(res)
                    if(res.code =="100"){
                         this.step233(params)
                      }  
            })
       },
       //删除该条流水
       step233(params){
             let param2     = {list:[]};
             let dic        = {};
                 dic.id     = params.row.id;
                 dic.status = '0';
             param2.list.push(dic)
             getKeHuLiuShuiBiao(param2).then(res=>{
                  console.log('=========12121251')
                 if(res.code =="100"){
                         //getXiuGaiOrderStatus89
                         let param3          = {pageUpdateOrderList:[]};
                         let dic             = {};
                             dic.id          = this.$route.query.id;
                             dic.skSMoney    = (0-params.row.inMoney)
                         let dip             = {};
                             dip.id          = params.row.dikouOrderId
                             dip.dikouSMoney = (0-params.row.inMoney)

                         param3.pageUpdateOrderList.push(dic)
                         param3.pageUpdateOrderList.push(dip)

                         getXiuGaiOrderStatus89(param3).then(res=>{
                           if(res.code =="100"){
                                       console.log("成功，开始刷新")
                                       this.$Notice.success({
                                                 title:'删除成功',
                                                 duration:1,
                                                 onClose:res =>{
                                                    this.reload();
                                                 }
                                              })
                                     }
                         })
                  }  
            })
       },
       getOrderInfo(){//监听到数据后，加载数据 TODO:
             let params = {};
          params.orderId = this.valueForm_allOrder_orderItem.id;
          let a = this.$global.pinjieStr("2,14")
          params.six = a;
          params.status = "1"
          getKeHuLiuShui(params).then(res =>{
            console.log('我是监听到的数据=========================')
            console.log(res)
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
            console.log('我是数据1111111')
            console.log(val)
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

