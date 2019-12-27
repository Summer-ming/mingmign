<!--
 * @Description:审核采购单 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-10 10:27:38
 -->



<template>
     <div>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
      <dl>
        <dt>销售单号：{{formItem.orderNo}}</dt>
        <dd>客户：{{formItem.cusOrgName}}</dd>
      </dl>
      <dl>
        <dt>供应商公司：{{formItem.shopOrgName}}</dt>
        <dd>管理员：{{formItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{formItem.money}}</dt>
      </dl>
        
    </row>
    <row>
        <b class="font_32">合同信息</b>
        <br>
        <span style="color:red">*</span>
        <span >一键收货</span>

        <i-switch v-model="switch1" @on-change="switchChange">
          <span  slot="open">是</span>
          <span  slot="close">否</span>

          </i-switch>
        <Table border ref="selection" :columns="columns1" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table>
    </row>
    <!-- <row>
        <b class="font_32">新增合同明细信息</b>
      <Button size="small" type="primary" @click="addNewitem"> 添加一行</Button>

        <Table border ref="selection" :columns="columns2" :data="data2" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table>
    </row> -->
    <row>
       <span>合同重量合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.accPrecision(contractTWeight,3)}}吨</span>
      <span>合同金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(contractTMoney)}}元</span>
      <br>
      <span>实提重量合计：</span>
      <span  style="color:red;margin-right:20px">{{this.$global.accPrecision(tWeight,3)}}吨</span>
      <span>实提金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(tMoney)}}元</span>
      <br>
      <a v-show="saveBtnShow"  style="color:red">请先将销售单确认出货，在进项录入实提操作</a>
      <br>
      <Button :disabled="btnDisabled" type="primary" @click="addBtn"> 提交保存</Button>
    </row>
    <p style="disaply:none">{{getTotal}}</p>
     </div>
</template>

<script>

import {findOrdersInfoAll,
updateOrderInfo,
updateOrderStatus,
addOrderInfo} from '@/api/data_8889'
import {findOrgCusAcc,findOrgMoneyRecord,
updateOrgMoneyRecord,addOrgMoneyRecord } from '@/api/data'
import { mapMutations } from 'vuex'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import { truncate } from 'fs';
export default {
    name: 'sell_order_change_info',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        saveBtnShow:false,
        btnDisabled:false,
        orgMoneyRecordItem:{},
        tWeight:0,//实提重量
        tMoney:0,//实提金额
        contractTMoney:0,//合同金额
        contractTWeight:0,//合同重量
      dataCompany:[],
        tableItem:{},
        selectData:[{
          value:'1',
          label:'是'
        },{
          value:'0',
          label:"否"
        }],
        switch1:false,
        isadd :true,
        switchTitle:'否',
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:''
          },
          columns1: [
            
            {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'50',
                        fixed:'left',
                        sortable:true
            },
            {
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'100',
                        fixed:'left',
                        render:(h,params)=>{
                                  return h('div',{
                                     style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              },params.row.steelName)
                        }
            },
            {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100',
                        fixed:'left',
                        render:(h,params)=>{
                             return h('div',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              },params.row.steelGuige)
                        }
            },
            {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'100',
                        fixed:'left',
                        render:(h,params)=> {
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].steelPaihaoStatus = true
                                  }
                                }
                              },params.row.steelPaihao)
                        },
            },
            {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'120',
                        render:(h,params)=> {
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              },params.row.steelPinpai)
                        },
            },//提货方式
            {
                        title: '提货方式',
                        key: 'steelWorks',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(false){
                            return h('Input',{
                            props:{
                              value:params.row.steelWorks,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].steelWorks = event.target.value
                                  this.data1[params.index].steelWorksStatus = false

                              }
                            }
                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].steelWorksStatus = true
                                  }
                                }
                              },params.row.steelWorks)
                          }
                        },
            },
            {
                        title: '交货地',
                        key: 'jiaohuodi',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(false){
                            return h('Input',{
                            props:{
                              value:params.row.jiaohuodi,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].jiaohuodi = event.target.value
                                  this.data1[params.index].jiaohuodiStatus = false

                              }
                            }
                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].jiaohuodiStatus = true
                                  }
                                }
                              },params.row.jiaohuodi)
                          }
                        },
            },
            {
                        title: '件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(false){
                            return h('Input',{
                            props:{
                              value:params.row.jianshu,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].jianshu = event.target.value
                                  this.data1[params.index].jianshuStatus = false

                              }
                            }
                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].jianshuStatus = true
                                  }
                                }
                              },params.row.jianshu)
                          }
                        },
            },
            {
                        title: '单件重',
                        key: 'weight',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          if(false){
                             return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.weight,3),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].weight = event.target.value
                                  this.data1[params.index].weightStatus = false

                              }
                            }
                          })
                          }else{
                             return h('div',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].weightStatus = true
                                  }
                                }
                              },this.$global.accPrecision(params.row.weight,3))
                          }
                        }
            },
            {
                        title: '总重量',
                        key: 'zongzhongliang',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          if(false){
                            return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.zongzhongliang,3),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].zongzhongliang = event.target.value
                                  this.data1[params.index].zongzhongliangStatus = false

                              }
                            }
                          })
                          }else{
                              return h('div',{
                                style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].zongzhongliangStatus = true
                                  }
                                }
                              },this.$global.accPrecision(params.row.zongzhongliang,3))
                          }
                        }
            },
            {
                        title: '单价',
                        key: 'guapaijia',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          if(false){
                            return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.guapaijia,2),
                              disabled:params.row.isDelete
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data1[params.index].guapaijia = event.target.value
                                  this.data1[params.index].guapaijiaStatus = false

                              }
                            }
                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].guapaijiaStatus = true
                                  }
                                }
                              },this.$global.accPrecision(params.row.guapaijia,2))
                          }
                        }
            },
            {
                        title: '总金额',
                        key: 'cusMoney',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(false){
                            return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.cusMoney,2),
                              disabled:params.row.isDelete
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data1[params.index].cusMoney = event.target.value
                                  this.data1[params.index].cusMoneyStatus = false

                              }
                            }
                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].cusMoneyStatus = true
                                  }
                                }
                              },this.$global.accPrecision(params.row.cusMoney,2))
                          }
                        }
            },
            {
                        title: '结算单价',
                        key: 'jiesuanDanjia',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                           if(params.row.jiesuanDanjiaStatus){
                              return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.jiesuanDanjia,3),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].jiesuanDanjia = event.target.value
                                  this.data1[params.index].jiesuanDanjiaStatus = false
                                  //输入结算重量自动计算结算金额
                                  let a = this.data1[params.index].jiesuanWeight;
                                  let b = this.data1[params.index].jiesuanDanjia
                                this.data1[params.index].jiesuanMoney = this.$global.accMul(a,b)
                                //是否收货为是
                                this.data1[params.index].receiptStatus = "1"


                              }
                            }
                          })
                           }else{
                             return h('a',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].jiesuanDanjiaStatus = true
                                    
                                  }
                                }
                              },this.$global.accPrecision(params.row.jiesuanDanjia,2))
                           }
                        }
            },
            {
                        title: '结算重量',
                        key: 'jiesuanWeight',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                           if(params.row.jiesuanWeightStatus){
                              return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.jiesuanWeight,3),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].jiesuanWeight = event.target.value
                                  this.data1[params.index].jiesuanWeightStatus = false
                                  //输入结算重量自动计算结算金额
                                  let a = this.data1[params.index].jiesuanWeight;
                                  let b = this.data1[params.index].jiesuanDanjia
                                this.data1[params.index].jiesuanMoney = this.$global.accMul(a,b)
                                //是否收货为是
                                this.data1[params.index].receiptStatus = "1"


                              }
                            }
                          })
                           }else{
                             return h('a',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].jiesuanWeightStatus = true
                                    
                                  }
                                }
                              },this.$global.accPrecision(params.row.jiesuanWeight,3))
                           }
                        }
            },
            {
                        title: '结算金额',
                        key: 'jiesuanMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          if(params.row.jiesuanMoneyStatus){
                            return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.jiesuanMoney,2),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data1[params.index].jiesuanMoney = event.target.value
                                  this.data1[params.index].jiesuanMoneyStatus = false

                              }
                            }
                          })
                          }else{
                               return h('a',{
                                 style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].jiesuanMoneyStatus = true
                                    
                                  }
                                }
                              },this.$global.accPrecision(params.row.jiesuanMoney,2))
                          }
                        }
            },
            {
                        title: '是否收货',
                        key: 'receiptStatus',
                        align: 'center',
                        width:'100',
                        render: (h,params)=> {
                          if(params.row.receiptStatusStatus){
                              return h('Select',{
                            props:{
                              value:params.row.receiptStatus,
                              disabled:params.row.isDelete
                            },
                            on:{
                              'on-change':(value) =>{
                                this.data1[params.index].receiptStatus = value
                                this.data1[params.index].receiptStatusStatus = false

                              }
                            }

                          },
                          this.selectData.map(function(type){
                            return h('Option',{
                              props:{
                                value:type.value,
                                label:type.label
                                }
                            },type);
                          })
                          )
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].receiptStatusStatus = true
                                    
                                  }
                                }
                              },getReceiptStatusLabel(params.row.receiptStatus))
                          }
                        }
            },
            {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(false){
                             return h('Input',{
                            props:{
                              value:params.row.kunbaohao,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].kunbaohao = event.target.value
                                  this.data1[params.index].kunbaohaoStatus = false

                              }
                            }
                          })
                          }else{
                             return h('div',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].kunbaohaoStatus = true
                                  }
                                }
                              },params.row.kunbaohao)
                          }
                        },
            },
            {
                        title: '收票重量',
                        key: 'invoiceWeight',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                           if(false){
                             return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.invoiceWeight,3),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].invoiceWeight = event.target.value
                                  this.data1[params.index].invoiceWeightStatus = false

                              }
                            }
                          })
                           }else{
                             return h('div',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].invoiceWeightStatus = true
                                    
                                  }
                                }
                              },this.$global.accPrecision(params.row.invoiceWeight,3))
                           }
                        }
            },
            {
                        title: '收票金额',
                        key: 'invoiceMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          if(false){
                            return h('Input',{
                            props:{
                              value:this.$global.accPrecision(params.row.invoiceMoney,2),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data1[params.index].invoiceMoney = event.target.value
                                  this.data1[params.index].invoiceMoneyStatus = false

                              }
                            }
                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].invoiceMoneyStatus = true
                                    
                                  }
                                }
                              },this.$global.accPrecision(params.row.invoiceMoney,2))
                          }
                        }
            },
            {
                        title: '收票号码',
                        key: 'invoiceNo',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(false){
                               return h('Input',{
                            props:{
                              value:params.row.invoiceNo,
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data1[params.index].invoiceNo = event.target.value
                                  this.data1[params.index].invoiceNoStatus = false

                              }
                            }
                          })
                          }else{
                              return h('div',{
                                style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].invoiceNoStatus = true
                                    
                                  }
                                }
                              },params.row.invoiceNo)
                          }
                        }
            },
            {
                        title: '是否收票',
                        key: 'invoiceStatus',
                        align: 'center',
                        width:'100',
                        render: (h,params)=> {
                          if(false){
                            return h('Select',{
                            props:{
                              value:params.row.invoiceStatus,
                              disabled:params.row.isDelete
                            },
                            on:{
                              'on-change':(value) =>{
                                this.data1[params.index].invoiceStatus = value
                                  this.data1[params.index].invoiceStatusStatus = false

                              }
                            }

                          },
                          this.selectData.map(function(type){
                            return h('Option',{
                              props:{
                                value:type.value,
                                label:type.label
                                }
                            },type);
                          })
                          )
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].invoiceStatusStatus = true
                                    
                                  }
                                }
                              },getInvoiceStatusLabel(params.row.invoiceStatus))
                          }
                        }
            },
            //杂费开始
            {
                      key:'om1Name',
                      title:'杂费1名称',
                      width:'100',
                      render:(h,params)=>{
                          if(false){
                            return h('Input',{
                            props:{
                              value:params.row.om1Name,
                            
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om1Name=event.target.value
                                  this.data1[params.index].om1NameStatus = false

                              }
                            }

                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].om1NameStatus = true
                                    
                                  }
                                }
                              },params.row.om1Name)
                          }
                        }
                     
            },
            {
                      key:'om1Money',
                      title:'杂费1金额',
                      width:'100',
                     render:(h,params)=>{
                         if(false){
                            return h('Input',{
                            props:{
                              value:params.row.om1Money,
                             
                              type:'text',
                            },
                            
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om1Money=event.target.value
                                  this.data1[params.index].om1MoneyStatus = false

                              }
                            }

                          })
                         }else{
                           return h('div',{
                             style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].om1MoneyStatus = true
                                    
                                  }
                                }
                              },params.row.om1Money)
                         }
                        } 
                     
            },
            {
                      key:'om1OrgNameChose',
                      title:'选择杂费1公司',
                      width:'100',
                      render:(h,params)=>{
                        if(false){
                          return h('Select', {
                        props:{
                            filterable:true,
                            'label-in-value':true
                        },
                        on: {
                           'on-open-change':(event) => {
                                //event 为true 和 false
                            },
                            'on-change':(event) => {
                                  //select 值改变赋值
                                 this.data1[params.index].om1OrgName  = event.label
                                 this.data1[params.index].om1OrgId = event.value
                                  this.data1[params.index].om1OrgNameChoseStatus = false
                                 
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{
                              value:item.cusorgId,
                              lable:item.cusorgName
                              }
                          },item.cusorgName)
                        })
                      
                      );
                        }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].om1OrgNameChoseStatus = true
                                    
                                  }
                                }
                              },params.row.om1OrgName)
                        }
                    }

                     
            },
            {
                      key:'om1OrgName',
                      title:'杂费1公司名称',
                      width:'100',
                      render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    style:{
                                   },
                                   },params.row.om1OrgName),
                            ])
                        }
            },
            {
                      key:'om1OrgId',
                      title:'杂费1公司id',
                      width:'100',
                      render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om1OrgId),
                            ])
                        }
                     
            },
            {
                      key:'om2Name',
                      title:'杂费2名称',
                      width:'100',
                      render:(h,params)=>{
                          if(false){
                             return h('Input',{
                            props:{
                              value:params.row.om2Name,
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om2Name=event.target.value
                                  this.data1[params.index].om2NameStatus = false

                              }
                            }

                          })
                          }else{
                              return h('div',{
                                style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].om2NameStatus = true
                                    
                                  }
                                }
                              },params.row.om2Name)
                          }
                        } 
                     
            },
            {
                      key:'om2Money',
                      title:'2金额',
                      width:'100',
                      render:(h,params)=>{
                        if(false){
                          return h('Input',{
                            props:{
                              value:params.row.om2Money,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om2Money=event.target.value
                                  this.data1[params.index].om2MoneyStatus = false

                              }
                            }

                          })
                        }else{
                          return h('div',{
                            style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                          on:{
                          'click':(event)=>{
                          this.data1[params.index].om2MoneyStatus = true
                          }
                          }
                          },params.row.om2Money)
                        }
                      } 
                     
            },
            {
                      key:'gongsi2',
                      title:'选择杂费2公司名称',
                      width:'100',
                      render:(h,params)=>{
                        if(false){
                          return h('Select', {
                        props:{
                            value:params.row.gongsi2,
                            filterable:true,
                            'label-in-value':true
                        },
                        on: {
                           'on-open-change':(event) => {
                                //event 为true 和 false
                            },
                            'on-change':(event) => {
                                  //select 值改变赋值
                                 this.data1[params.index].om2OrgName   = event.label
                                 this.data1[params.index].om2OrgId = event.value
                                  this.data1[params.index].gongsi2Status = false

                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
                        }else{
                        return h('div',{
                          style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                        on:{
                        'click':(event)=>{
                        this.data1[params.index].gongsi2Status = true
                        }
                        }
                        },params.row.om2OrgName)
                        }
                    }
                     
            },
            {
                      key:'om2OrgName',
                      title:'杂费公司名称2',
                      width:'100',
                      render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om2OrgName),
                            ])
                        }
                     
            },
            {
                      key:'om2OrgId',
                      title:'杂费公司2id',
                      width:'100',
                      render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om2OrgId),
                            ])
                        }
                     
            },
            {
                      key:'om3Name',
                      title:'杂费3名称',
                      width:'100',
                      render:(h,params)=>{
                          if(false){
                              return h('Input',{
                            props:{
                              value:params.row.om3Name,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om3Name=event.target.value
                                  this.data1[params.index].om3NameStatus = false

                              }
                            }

                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data1[params.index].om3NameStatus = true
                                 }
                                }
                            },params.row.om3Name)  
                          }
                        } 
                     
            },
            {
                      key:'om3Money',
                      title:'公司3金额',
                       width:'100',
                        render:(h,params)=>{
                          if(false){
                              return h('Input',{
                            props:{
                              value:params.row.om3Money,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om3Money=event.target.value
                                  this.data1[params.index].om3MoneyStatus = false
                              }
                            }

                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data1[params.index].om3MoneyStatus = true
                                 }
                                }
                            },params.row.om3Money)  
                          }
                        } 
                     
            },
            {
                      key:'gongsi3',
                      title:'选择杂费公司3',
                       width:'100',
                        render:(h,params)=>{
                          if(false){
                               return h('Select', {
                        props:{
                            value: params.row.gongsi3,
                            filterable:true,
                            'label-in-value':true
                        },
                        on: {
                           'on-open-change':(event) => {
                                //event 为true 和 false
                            },
                            'on-change':(event) => {
                                  //select 值改变赋值
                                 this.data1[params.index].om3OrgName   = event.label
                                 this.data1[params.index].om3OrgId = event.value
                                  this.data1[params.index].gongsi3Status = false

                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );}else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data1[params.index].gongsi3Status = true
                                 }
                                }
                            },params.row.om3OrgName)      
                          }
                    }
                     
            },
            {
                      key:'om3OrgName',
                      title:'公司名称3',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om3OrgName),
                            ])
                        }
                     
            },
            {
                      key:'om3OrgId',
                      title:'公司3id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om3OrgId),
                            ])
                        }
                     
            },
            // 1
            {
                      key:'om4Name',
                      title:'杂费4名称',
                      width:'100',
                      render:(h,params)=>{
                          if(false){
                              return h('Input',{
                            props:{
                              value:params.row.om4Name,
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om4Name=event.target.value
                                  this.data1[params.index].om4NameStatus = false
                              }
                            }

                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data1[params.index].om4NameStatus = true
                                 }
                                }
                            },params.row.om4Name)  
                          }
                        } 
                     
            },
            {
                      key:'om4Money',
                      title:'杂费4金额',
                       width:'100',
                       render:(h,params)=>{
                          if(false){
                               return h('Input',{
                            props:{
                              value:params.row.om4Money,
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om4Money=event.target.value
                                  this.data1[params.index].om4MoneyStatus = false
                              }
                            }

                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data1[params.index].om4MoneyStatus = true
                                 }
                                }
                            },params.row.om4Money)  
                          }
                        } 
                     
            },
            {
                      key:'gongshi4',
                      title:'选择公司4',
                       width:'100',
                           render:(h,params)=>{
                              if(false){
                                  return h('Select', {
                        props:{
                            value: params.row.gongshi4,
                            filterable:true,
                            'label-in-value':true
                        },
                        on: {
                           'on-open-change':(event) => {
                                //event 为true 和 false
                            },
                            'on-change':(event) => {
                                  //select 值改变赋值
                                  this.data1[params.index].om4OrgName  = event.label
                                  this.data1[params.index].om4OrgId = event.value
                                  this.data1[params.index].gongshi4Status = false

                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );}else{
                                return h('div',{
                                  style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                  on:{
                                  'click':(event)=>{
                                      this.data1[params.index].gongshi4Status = true
                                     }
                                    }
                                },params.row.om4OrgName)          
                              }
                    }
            },
            {
                      key:'om4OrgName',
                      title:'公司4名称',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om4OrgName),
                            ])
                        }
                     
            },
            {
                      key:'om4OrgId',
                      title:'公司4id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om4OrgId),
                            ])
                        }
                     
            },
            // 5
            {
                      key:'om5Name',
                      title:'杂费5名称',
                       width:'100',
                        render:(h,params)=>{
                          if(false){
                              return h('Input',{
                            props:{
                              value:params.row.om5Name,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om5Name=event.target.value
                                  this.data1[params.index].om5NameStatus = false
                              }
                            }

                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data1[params.index].om5NameStatus = true
                                 }
                                }
                            },params.row.om5Name)  
                          }
                        } 
                     
            },
            {
                      key:'om5Money',
                      title:'杂费5金额',
                       width:'100',
                        render:(h,params)=>{
                          if(false){
                              return h('Input',{
                            props:{
                              value:params.row.om5Money,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om5Money=event.target.value
                                  this.data1[params.index].om5MoneyStatus = false
                              }
                            }

                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data1[params.index].om5MoneyStatus = true
                                 }
                                }
                            },params.row.om5Money)  
                          }
                        } 
                     
            },
            {
                      key:'gongsi5',
                      title:'公司5',
                      width:'100',
                      render:(h,params)=>{
                        if(false){
                            return h('Select', {
                        props:{
                            value: params.row.gongsi5,
                            filterable:true,
                            'label-in-value':true
                        },
                        on: {
                           'on-open-change':(event) => {
                                //event 为true 和 false
                            },
                            'on-change':(event) => {
                                  //select 值改变赋值
                                  this.data1[params.index].om5OrgName=event.label
                                  this.data1[params.index].om5OrgId=event.value
                                  this.data1[params.index].gongsi5Status = false

                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
                        }else{
                          return h('div',{
                            style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                            on:{
                            'click':(event)=>{
                                this.data1[params.index].gongsi5Status = true
                               }
                              }
                          },params.row.om5OrgName)    
                        }
                    }
                     
            },
            {
                      key:'om5OrgName',
                      title:'公司5名称',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om5OrgName),
                            ])
                        }
                     
            },
            {
                      key:'om5OrgId',
                      title:'公司5id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om5OrgId),
                            ])
                        }
                     
            },
            // 6
            {
                      key:'om6Name',
                      title:'杂费6名称',
                       width:'100',
                        render:(h,params)=>{
                          if(false){
                               return h('Input',{
                            props:{
                              value:params.row.om6Name,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om6Name=event.target.value
                                  this.data1[params.index].om6NameStatus = false
                              }
                            }

                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data1[params.index].om6NameStatus = true
                                 }
                                }
                            },params.row.om6Name)  
                          }
                        } 
                     
            },
            {
                      key:'om6Money',
                      title:'杂费6金额',
                       width:'100',
                        render:(h,params)=>{
                          if(false){
                              return h('Input',{
                            props:{
                              value:params.row.om6Money,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.data1[params.index].om6Money=event.target.value
                                  this.data1[params.index].om6MoneyStatus = false
                              }
                            }

                          })
                          }else{
                            return h('div',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data1[params.index].om6MoneyStatus = true
                                 }
                                }
                            },params.row.om6Money)  
                          }
                        } 
                     
            },
            {
                      key:'gongshi6',
                      title:'公司6',
                       width:'100',
                        render:(h,params)=>{
                        if(false){
                            return h('Select', {
                        props:{
                            value: params.row.gongshi6,
                            filterable:true,
                            'label-in-value':true
                        },
                        on: {
                           'on-open-change':(event) => {
                                
                                //event 为true 和 false
                            },
                            'on-change':(event) => {
                                  //select 值改变赋值
                                  this.data1[params.index].om6OrgName=event.label
                                  this.data1[params.index].om6OrgId=event.value
                                  this.data1[params.index].gongshi6Status = false
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
                        }else{
                          return h('div',{
                            style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                            on:{
                            'click':(event)=>{
                                this.data1[params.index].gongshi6Status = true
                               }
                              }
                          },params.row.om6OrgName)    
                        }
                    }
                     
            },
            {
                      key:'om6OrgName',
                      title:'公司6id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om6OrgName),
                            ])
                        }
                     
            },
            {
                      key:'om6OrgId',
                      title:'公司6id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.om6OrgId),
                            ])
                        }
            },
            //杂费结束
          ],
                //分割线——————————————————————————————————————————————————————————————————————
         columns2: [
           
          ],
                data1: [
                ],//表格展示的数据
                data2:[],//添加表格使用的列表
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      
      }
    },
    
    methods:{
      switchChange(status){
        console.log("开关状态" +status)
        let a = "";
        if(status){//true
          this.switchTitle = "是"
          a = "1"
        }else{
          this.switchTitle = "否"
          a = "0"

        }
        this.data1.map(item=>{
          item.receiptStatus = a;
        })
      },
      //获取公司名字
         getComPany(){
             let param={};
          param.pageSize = 999999;
              
             findOrgCusAcc(param).then(res=>{
        
                  this.dataCompany=res.data.list            
            })
         },
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
              for(var i=0;i< res.data.list.length;i++){
               //添加默认条件进行判断
                res.data.list[i].isDelete              = false;
                res.data.list[i].changeStatus          = false;
                res.data.list[i].steelNameStatus       = false;
                res.data.list[i].steelGuigeStatus      = false;
                res.data.list[i].steelPaihaoStatus     = false;
                res.data.list[i].steelPinpaiStatus     = false;
                res.data.list[i].steelWorksStatus      = false;
                res.data.list[i].jiaohuodiStatus       = false;
                res.data.list[i].jianshuStatus         = false;
                res.data.list[i].weightStatus          = false;
                res.data.list[i].zongzhongliangStatus  = false;
                res.data.list[i].guapaijiaStatus       = false;
                res.data.list[i].cusMoneyStatus        = false;
                res.data.list[i].kunbaohaoStatus       = false;
                res.data.list[i].jiesuanDanjiaStatus   = false;
                res.data.list[i].jiesuanWeightStatus   = false;
                res.data.list[i].jiesuanMoneyStatus    = false;
                res.data.list[i].receiptStatusStatus   = false;
                res.data.list[i].invoiceWeightStatus   = false;
                res.data.list[i].invoiceMoneyStatus    = false;
                res.data.list[i].invoiceNoStatus       = false;
                res.data.list[i].invoiceStatusStatus   = false;
                res.data.list[i].om1NameStatus         = false;
                res.data.list[i].om1MoneyStatus        = false;
                res.data.list[i].om1OrgNameChoseStatus = false;
                res.data.list[i].om2NameStatus         = false;
                res.data.list[i].om2MoneyStatus        = false;
                res.data.list[i].gongsi2Status         = false;
                res.data.list[i].om3NameStatus         = false;
                res.data.list[i].om3MoneyStatus        = false;
                res.data.list[i].gongsi3Status         = false;
                res.data.list[i].om4NameStatus         = false;
                res.data.list[i].om4MoneyStatus        = false;
                res.data.list[i].gongshi4Status        = false;
                res.data.list[i].om5NameStatus         = false;
                res.data.list[i].om5MoneyStatus        = false;
                res.data.list[i].gongsi5Status         = false;
                res.data.list[i].om6NameStatus         = false;
                res.data.list[i].om6MoneyStatus        = false;
                res.data.list[i].gongshi6Status        = false;
                res.data.list[i].wangJiaStatus         = false;//网价状态
                res.data.list[i].fuDongStatus          = false;//浮动价格状态
                res.data.list[i].wangJiaQu             = false;//网价区域
                res.data.list[i].wangJiaBei            = false;//网价备注isShouPiao
                res.data.list[i].isShouPiao            = false;//是否收票
                res.data.list[i].kaiPiaoWeightStatus   = false;//开票重量状态
                res.data.list[i].kaiPiaoMoneyStatus    = false;//开票金额状态
                res.data.list[i].kaiPiaoNumberStatus    = false;//开票号码状态

              }
              this.data1 = res.data.list.reverse();
            }else{
            }
          })
      },
       selectOne(row){
         console.log(row)
       },
       getOrderOrgRecord(){
            this.orgMoneyRecordItem ="";
            let p  = {};
            p.orderId = this.$route.query.id;
            p.payMoneyType = "5"
            findOrgMoneyRecord(p).then(res=>{
                  if(res.code =="100"){
                    if(res.data.list.length>0){
                      this.isadd              = false;
                      this.orgMoneyRecordItem = res.data.list[0];
                      this.btnDisabled        = false;
                      this.saveBtnShow        = false;
                    }else{
                      this.isadd       = true;
                      this.btnDisabled = true;
                      this.saveBtnShow = true;
                    }
                }  
              })
       },
       remove(index){
         this.data1.splice(index,1);
       },
       //步骤1：修改订单明细为已收货
       //步骤2：修改客户已经入账的流水
       //步骤3：如果订单的所有明细都录入实提，确认已收货，则总订单的状态变化
       addBtn(){
         console.log(this.orgMoneyRecordItem)
          this.stepChangeOrderInfo();
          this.stepChangeOrder();
          this.stepChangeOrgMoneyRecord();
       },
       //步骤4:给供应商添加一笔流水入账流水；
       step4AddOrgMoneyRecord(){//走线下确认付款成功后，
      // this.selectionsList.map
            let p                   = {};
            let plist               = [];
                  let dic                 = {};
                    dic.customerId      = this.$route.query.customerId;
                    dic.orderId         = this.$route.query.id;
                    dic.inMoney         = '0';
                    dic.outMoney        = this.tMoney;
                    dic.currentMoney    = "0"
                    dic.userId          = this.$global.adminInfo.id
                    dic.payMoneyType    = "5"
                    dic.note            = '销售单出账';
                    dic.orderNo         = this.$route.query.ordersNo;
                    dic.bankJgId        = this.$route.query.bankJgId;
                    dic.orgId           = this.$route.query.customerOrgId;
                    dic.orgName         = this.$route.query.customerOrgName;
                    dic.daozhangdanId   = '0'
                    dic.bankConnectedId = '0'
                    dic.zhidanApplyId   = '0';
                    dic.zhaiyao         = '销售单出账'
                    dic.direction        = ''
                    dic.type        = '1'
                    dic.status        = '1'

                plist.push(dic);
                p.list = plist;
           
             addOrgMoneyRecord(p).then(res=>{
                        if(res.code =="100"){
                          this.$Notice.success({
                            title:'入账流水成功',
                            duration:3,
                             onClose:res =>{
                              }
                          })
                        }else{
                          this.$Notice.error({
                            title:'入账流水失败'
                          })
                        }
               })
        },
       //步骤3：如果订单的所有明细都录入实提，确认已收货，则总订单的状态变化
       stepChangeOrder(){
            //获取已经录入实提的总重量和吨位；
            //如果全部实提，状态变更成8；
            let is8 = true;
            let a = 0;
            let b = 0;
            let isAdd = false;
            this.data1.map(item=>{
                if(item.receiptStatus == "0"){
                  is8 =false;
                }else{
                  isAdd = true;
                  a = this.$global.accAdd(a,item.jiesuanWeight)
                  b = this.$global.accAdd(b,item.jiesuanMoney)
                }
            })
            if(!isAdd){
              this.$Notice.info({
                title:"请确认有明细已确认收货"
              })
              return;
            }
            let p  ={};
            let plist = [];
            let dic = {};
            dic.id                    = this.$route.query.id;
            dic.deliveryTotalWeight   = a
            dic.deliveryTotalMoneyCus = b
            if(is8){
              dic.status                = "8";
            }
            dic.userId                = this.$global.adminInfo.id;
            dic.statusNote            = "录入实提"
            plist.push(dic);
            p.pageUpdateOrderList = plist;
              updateOrderStatus(p).then(res =>{
                if(res.code =='100'){
                  this.isDisable=true;
                    this.$Notice.success({
                        title:'修改订单状态成功',
                    })
                }else{
                    this.$Notice.error({
                        title:'修改订单状态失败'
                    })
                }
              })
       },
       stepChangeOrderInfo(){
         console.log("修改成功");
          let params = {};
          let pageOrderInfoList = [];
          for(var i=0; i<this.data1.length;i++ ){
            var item = this.data1[i];
            let dic = {};
            dic.id             = item.id;
            dic.jiesuanWeight  = item.jiesuanWeight   //结算重量
            dic.jiesuanMoney   = item.jiesuanMoney    //结算金额
            dic.jiesuanDanjia  = item.jiesuanDanjia    //结算单价

            dic.receiptStatus  = item.receiptStatus   //是否收货

            pageOrderInfoList.push(dic);
          }
          params.pageOrderInfoList = pageOrderInfoList;
          updateOrderInfo(params).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'修改成功',
                     duration:1,
                     onClose:res =>{
                        console.log("关闭时回调")
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'修改失败'
                 })
             }
          })
       },
       //步骤2：修改客户已经入账的流水； 如果之前是 已经添加过得，只修改，没有添加的 走添加
       stepChangeOrgMoneyRecord(){
             let p = {};
             let plist = [];
             let dic = {};
             dic.id = this.orgMoneyRecordItem.id;
             dic.outMoney = this.tMoney;
             plist.push(dic);
             p.list = plist;
              updateOrgMoneyRecord(p).then(res=>{
               if(res.code =="100"){
                 this.$Notice.success({
                   title:'修改流水成功',
                   duration:2,
                   onClose:res=>{
                     this.closeSelf();
                   }
                 })
               }else{
                 this.$Notice.error({
                   title:'修改流水失败'
                 })
               }
             })
        },
       
       closeSelf(){//审核或者关闭之后跳转到
          console.log("准备关闭")
          this.closeTag({
              name: 'sell_order_changeActual',
              query:this.$route.query
          })
       },
       toreload(){//通知列表页面刷新数据
          console.log("准备关闭2")
           Utils.$emit('demo','reload');
       },
        ...mapMutations([
      'closeTag'
    ]),
    addNewitem(){
      let dic = {
        invoiceStatus:'0',
        receiptStatus:'0'
      };
       dic.om1Name    = ''
       dic.om1Money   = ''
       dic.om1OrgId   = ''
       dic.om1OrgName = ''
       dic.om2Name    = ''
       dic.om2Money   = ''
       dic.om2OrgId   = ''
       dic.om2OrgName = ''
       dic.om3Name    = ''
       dic.om3Money   = ''
       dic.om3OrgId   = ''
       dic.om3OrgName = ''
       dic.om4Name    = ''
       dic.om4Money   = ''
       dic.om4OrgId   = ''
       dic.om4OrgName = ''
       dic.om5Name    = ''
       dic.om5Money   = ''
       dic.om5OrgId   = ''
       dic.om5OrgName = ''
       dic.om6Name    = ''
       dic.om6Money   = ''
       dic.om6OrgId   = ''
       dic.om6OrgName = ''
       //添加状态进行input和a标签的转变
       dic.steelNameStatus = ""
       dic.steelGuigeStatus="";
       dic.steelPaihaoStatus="";
       dic.steelPinpaiStatus="";
       dic.steelWorksStatus="";
       dic.jiaohuodiStatus="";
       dic.jianshuStatus="";
       dic.weightStatus="";
       dic.zongzhongliangStatus="";
       dic.guapaijiaStatus="";
       dic.cusMoneyStatus="";
       dic.kunbaohaoStatus="";
       dic.jiesuanWeightStatus="";
       dic.jiesuanMoneyStatus="";
       dic.receiptStatusStatus="";
       dic.invoiceWeightStatus="";
       dic.invoiceMoneyStatus="";
       dic.invoiceNoStatus="";
       dic.invoiceStatusStatus="";
       dic.om1NameStatus="";
       dic.om1MoneyStatus="";
       dic.om1OrgNameChoseStatus="";
       dic.om2NameStatus="";
       dic.om2MoneyStatus="";
       dic.gongsi2Status="";
       dic.om3NameStatus="";
       dic.om3MoneyStatus="";
       dic.gongsi3Status="";
       dic.om4NameStatus="";
       dic.om4MoneyStatus="";
       dic.gongshi4Status="";
       dic.om5NameStatus="";
       dic.om5MoneyStatus="";
       dic.gongsi5Status="";
       dic.om6NameStatus="";
       dic.om6MoneyStatus="";
       dic.gongshi6Status="";
       dic.wangJiaStatus='';//网价状态
       dic.fuDongStatus='';//浮动价格
       dic.wangJiaQu='';//网价区域
       dic.wangJiaBei='';//网价备注
       dic.isShouPiao='';//是否收票
       dic.kaiPiaoWeightStatus='';//开票重量
       dic.kaiPiaoMoneyStatus='';//开票金额
       dic.kaiPiaoNumberStatus='';//开票号码

      this.data2.push(dic);
    }

    },
    
    mounted(){
     this.setOrderInfo();
     this.getComPany();
      this.getOrderOrgRecord();
    },
    computed:{
      getTotal(){
        let  a = 0;
        let b = 0;
        let c = 0;
        let d = 0;

        // tWeight:0,//实提重量
        // tMoney:0,//实提金额
        // contractTMoney:0,//合同金额
        // contractTWeight:0,//合同重量
        this.data1.map(item=>{
           a = this.$global.accAdd(a,item.jiesuanWeight)
           b = this.$global.accAdd(b,item.jiesuanMoney)

           c = this.$global.accAdd(c,item.zongzhongliang)
           d = this.$global.accAdd(d,item.cusMoney)
        })
        this.tWeight         = a;
        this.tMoney          = b;
        this.contractTWeight = c;
        this.contractTMoney  = d;
      }
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
        .ivu-table-cell {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
</style>