<!--
 * @Description: 新增实提单
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:34:05
 -->



<template>
     <div>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
          <dl>
            <dt>采购单号：{{formItem.orderNo}}</dt>
            <dd>采购公司：{{formItem.cusOrgName}}</dd>
          </dl>
          <dl>
            <dt>供应商公司：{{formItem.shopOrgName}}</dt>
            <dd>采购员：{{formItem.adminName}}</dd>
          </dl>
          <dl>
            <dt>合同金额：{{formItem.money}}</dt>
          </dl>
        
         </row>

        <row>
            <b class="font_32">合同信息</b>
            <Table border :columns="columns4" :data="data1"  style='margin-bottom:10px;'>

            </Table>
        </row>

        <row>
          <Button type="primary" @click="addBtn"> 提交入库</Button>
        </row>

     </div>
</template>

<script>
import {findOrdersInfoAll,updateOrderInfo} from '@/api/data' 
import {getRuKu,getWarehouse} from '@/api/cusData'//入库提交接口
import { constants } from 'crypto';
import { mapMutations } from 'vuex'

export default {
    name: 'add_order_delivery_actual',
     inject:['reload'],  //調用組建app.vue
    data(){
      return {
          data1: [],//表格展示的数据        
          dataCang: [],      //仓库的数组
          formItem: {//基础信息
          companyName: '',
          orderNo    : '',
          cusOrgName : '',
          shopOrgName: '',
          adminName  : '',
          money      : ''
          },
          columns4: [
                    {
                        title: '货物信息',
                        key: 'steelName',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },params.row.steelName+',规格:'+params.row.steelGuige+',材质:'+params.row.steelPaihao+',钢厂:'+params.row.steelPinpai+',捆包号:'+params.row.kunbaohao)
                        }
                    },
                      {
                        title: '方式',
                        key: 'jizhongType',
                        align: 'center',
                        width:'80'
                    },
                    {
                        title: '仓库',
                        key: 'steelWorks',
                        width:'120',
                        render:(h,params)=>{
                        return h('Select', {
                        props:{
                            value: params.row.steelWorks,
                            filterable:true,
                        },
                        on: {
                           'on-open-change':(event) => {
                                //event 为true 和 false
                            },
                            'on-change':(event) => {
                                  //select 值改变赋值
                                this.data1[params.index].steelWorks=event
                                 console.log(event)
                              }
                            },
                        },
                        this.dataCang.map((item)=>{
                          return h('Option',{
                            props:{value:item},
                          },item)
                        })
                      );
                    }
                       
                    },
                     {
                        title: '采购件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'90'
                    },
                     {
                        title: '采购单件重',
                        key: 'weight',
                        align: 'center',
                        width:'90',
                         render:(h,params)=>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.weight,3))
                        }
                    },
                     {
                        title: '总重',
                        key: 'zongzhongliang',
                        align: 'center',
                        width:'90',
                        render:(h,params)=>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.zongzhongliang,3))
                        }
                    },
                     {
                        title: '采购单价',
                        key: 'guapaijia',
                        align: 'center',
                        width:'90',
                         render:(h,params)=>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.guapaijia,2))
                        }
                    },
                     {
                        title: '采购总额',
                        key: 'cusMoney',
                        align: 'center',
                        width:'90',
                         render:(h,params)=>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.cusMoney,2))
                        }
                    },


                      {
                        title: '可出(件)',
                        key: 'xuniJianshu',
                        align: 'center',
                        width:'90',
                        className:'demo-table-info-column'

                    },
                    {
                        title: '入库件数(件)',
                        key: 'ru_xuniJianshu',//不用重新在读取值
                        width:'100',
                        render:(h,params)=>{
                          return h('InputNumber',{
                            props:{
                              value:Number(params.row.ru_xuniJianshu),
                              max:Number(params.row.xuniJianshu),
                              min:0
                            },
                            on:{
                              'on-change':(event) =>{
                                console.log(event)
                                this.data1[params.index].ru_xuniJianshu =event;
                                //修改了件数后重新计算单件重；单件重 = 入库总重/件数
                                 let  a = this.data1[params.index].ru_xuniJianshu;
                                 let b = this.data1[params.index].ru_zongzhongliang;
                                 console.log('a ='+a+'b='+b)
                                 console.log(this.$global.accDiv(b,a))
                                 this.data1[params.index].ru_weight = this.$global.accPrecision(this.$global.accDiv(b,a),3)
                                 console.log("赋值后")
                                 console.log(this.data1[params.index].ru_weight)
                              }
                            }
                          })
                        }
                    },
                    {
                        title: '入库单价(元)',
                        key: 'ru_guapaijia',
                        width:'140',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:Number(params.row.ru_guapaijia),
                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].ru_guapaijia =event.target.value;
                                 //重新计算总金额
                                  let a = this.data1[params.index].ru_zongzhongliang 
                                  let b = this.data1[params.index].ru_guapaijia
                                  let c = this.$global.accMul(a,b)
                                  console.log(c);
                                  this.data1[params.index].ru_cusMoney = c
                              }
                            }
                          })
                        }
                    },
                    {
                        title: '入库总重量(吨)',
                        key: 'ru_zongzhongliang',
                        width:'140',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{ 
                              value:this.$global.accPrecision(params.row.ru_zongzhongliang,3),
                              autosize:true
                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].ru_zongzhongliang =event.target.value;
                                 //修改了总重后重新计算单件重；单件重 = 入库总重/件数


                                 //重新计算总金额
                                  let a = this.data1[params.index].ru_zongzhongliang 
                                  let b = this.data1[params.index].ru_guapaijia
                                  let c = this.$global.accMul(a,b)
                                  this.data1[params.index].ru_cusMoney = c


                              }
                            }

                          })
                        }
                    },
                    {
                        title: '入库单件重',
                        key: 'ru_weight',
                        align: 'center',
                        width:'100',
                          render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },this.$global.accPrecision(params.row.ru_weight,3)),
                            ])
                        }
                    },
                      {
                        title: '入库总金额',
                        key: 'ru_cusMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.ru_cusMoney,2))
                        }
                    },
                     {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'90',
                        render: (h, params) => {
                            return h('div', [

                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                          this.remove(params.index);
                                        }
                                    }
                                }, '删除'),

                             ]);
                    }
                        
                    },],
      }
    },
    
    methods:{
       ...mapMutations([
      'closeTag'
      ]),
      //获取所有仓库getWarehouse
         getCang(){
            let param={pageSize:'9999'};
            getWarehouse(param).then(res=>{
                 res.data.list.map((item)=>{
                   if(item.warehouseName==null){
                             
                   }else{
                      this.dataCang.push(item.warehouseName)
                   }
                 })                 
            })
         },
      remove(index){
         this.data1.splice(index,1);
       },
        //基础信息赋值
        setOrderInfo(){
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName        
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll) 
          this.getOrderInfo(); 
      },
      getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
               res.data.list.map(item=>{
                item.ru_xuniJianshu    = item.xuniJianshu;
                item.ru_weight         = item.weight;//单件重
                item.ru_zongzhongliang = item.zongzhongliang;
                item.ru_guapaijia      = item.guapaijia;
                item.ru_cusMoney       = item.cusMoney;
              })
              this.data1 = res.data.list;
             
              this.$Notice.success({
                title:'获取订单明细成功'
              })
            }else{
              this.$Notice.error({
                title:'获取订单明细失败'
              })
            }
          })
      },
      addBtn(){//TODO
        
         let params = {};
         let orderInfoList = [];
          for(var i in this.data1){
            var item = this.data1[i];
            let dic = {};
            //选择的件数
            dic.jianshu       = item.ru_xuniJianshu     //件数
            dic.xuniJianshu   = item.ru_xuniJianshu
            dic.zongzhonglia  = item.ru_zongzhongliang  //总重量
            dic.weight        = item.ru_weight          //单件重
            dic.guapaijia     = item.ru_guapaijia       //单价
            dic.dijia         = item.ru_guapaijia       //底价和挂牌价相同
            dic.cusMoney      = item.ru_cusMoney        //总金额
            dic.merMoney      = item.ru_cusMoney
            dic.jiesuanMoney  = item.ru_cusMoney
            dic.jiesuanWeight = item.ru_zongzhongliang

            dic.ordersInfoId = item.id;
            dic.steelName    = item.steelName;    //品名
            dic.steelGuige   = item.steelGuige;   //规格
            dic.steelPaihao  = item.steelPaihao;  //材质
            dic.steelPinpai  = item.steelPinpai;  //钢厂
            dic.steelWorks   = item.steelWorks    //提货方式
            dic.jiaohuodi    = item.jiaohuodi     //交货地
            dic.kunbaohao    = item.kunbaohao     //捆包号jizhongType
            dic.jizhongType  = item.jizhongType   //计重方式
            //其他字段
            dic.shopId      = item.shopId                //店铺id
            dic.shopName    = item.shopName
            dic.shopOrgId   = item.shopOrgId;
            dic.shopOrgName = item.shopOrgName;
            dic.shopSteelId = "";
            dic.shopUserId  = item.shopUserId;
            dic.userId      = this.$global.adminInfo.id
            
            dic.customerId         = item.customerId
            dic.customerName       = item.customerName;
            dic.customerOrgId      = item.customerOrgId
            dic.customerOrgName    = item.customerOrgName;
            dic.customerPhone      = ''

            dic.bankJgId           = item.bankJgId
            dic.businessType       = item.businessType
            dic.buyType            = item.buyType
            dic.ordersType         = item.ordersType
            dic.payType            = item.payType
            dic.agentId            = item.agentId
            dic.agentName          = item.agentName
            dic.steelType          = item.steelType

            if(Number(item.ru_xuniJianshu) > 0){
              orderInfoList.push(dic);
            }else{
              console.log("小于")
            }
          }
          params.orderId       = this.$route.query.id;
          params.orderNo       = this.$route.query.ordersNo;
          params.orderInfoList = orderInfoList;
          if(orderInfoList.length == 0){
            this.$Notice.warning({
                     title:'无法入库，入库件数为0',
                 })
            return ;
          }
         getRuKu(params).then(res=>{
              if(res.code =='100'){
                 this.$Notice.success({
                     title:'提交入库成功',
                     duration:2,
                     onClose:res =>{
                        // console.log("关闭时回调")
                        this.updateOrderInfo();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'入库失败'
                 })
             }
         })

         console.log(this.data1);
       },
       //入库成功后，调用修改订单明细的接口，将订单明细xunijianshu 减掉
       updateOrderInfo(){
         let p  ={};
         let plist = [];
          this.data1.map(item=>{
            let dic = {};
            dic.id = item.id;
            dic.xuniJianshu = item.ru_xuniJianshu
            plist.push(dic)
          })
         p.pageOrderInfoList = plist;
         updateOrderInfo(p).then(res =>{
            if(res.code =='100'){
                this.$Notice.success({
                    title:'修改订单明细成功',
                     duration:2,
                     onClose:res =>{
                     console.log('关闭时回调')
                        this.closeSelf();
                  }
                })
            }else{
                this.$Notice.error({
                    title:'修改订单明细失败'
                })
            }
         })
       },
       closeSelf(){
         this.closeTag({
              name: 'add_order_delivery_actual',
              query:this.$route.query
          })
       }
    },
    
    mounted(){
     this.getCang();
     this.setOrderInfo();
    },
    
    created(){
   
    },
}

</script>
<style <style lang="less">


.order_all{
  height:100px;
  background:rgba(235,254,255,1);
  border:1px dashed rgba(134,223,228,1);
  display:flex;
  dl{
    flex:1;
    padding-top:20px;
    dt{
     height:14px;
      font-size:14px;
      font-family:SourceHanSansCN-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:14px;
      text-indent:20px;
      margin-bottom:20px;
    }
    dd{
      height:14px;
      font-size:14px;
      text-indent:20px;
      font-family:SourceHanSansCN-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:14px
    }
  }
}
.font_32 {
        font-size: 32;
    }
.ivu-table td.demo-table-info-column{
        background-color: #2db7f5;
        color: #fff;
    }
</style>