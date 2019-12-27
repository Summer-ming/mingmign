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
        <!-- <dd>客户：{{formItem.cusOrgName}}</dd> -->
        <dd>
          客户：
          <Select id='kehu' v-model="cusOrg" 
            style="width:200px" 
            :placeholder="cusOrgPl" 
             @on-change='getDian'  
             filterable
             remote
             :remote-method="getOrg"
             :label-in-value='true'
             >
               <Option v-for="(item,index) in optionsList" :value="JSON.stringify(item)"  :key="index" >{{ item.cusorgName }}</Option>
      
            </Select>
        </dd>
      </dl>
      <dl>
        <dt>供应商公司：{{formItem.shopOrgName}}</dt>
        <dd>管理员：{{formItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{formItem.money}}</dt>
        <dd>工程名称：
          <Input v-model="formItem.engerName" @on-change="changeEngerName" style="width:160px;" />
        </dd>
      </dl>
        
    </row>
    <row>
        <b class="font_32">合同信息</b>
        <span style="margin-right:20px">蓝色区域点击修改</span>
        <Table border ref="selection" :columns="columns1" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table>
    </row>
    <row>
        <b class="font_32">新增合同明细信息</b>
      <!-- <Button size="small" type="primary" @click="addNewitem"> 添加一行</Button> -->

        <Table border ref="selection" :columns="columns2" :data="data2" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table>
    </row>
    <row>
      <Button type="primary" @click="addBtn"> 修改提交</Button>
    </row>

     </div>
</template>

<script>
import {findOrdersInfoAll,
updateOrderInfo,
addOrderInfo,
updateOrderStatus} from '@/api/data_8889'
import {findOrgCusAcc } from '@/api/data'
import { mapMutations } from 'vuex'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
export default {
    name: 'sell_order_change_info',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        cusOrg:"",
        cusOrgPl:'',
        optionsList:[],
        cusOrgItem:'',
        customerId:'',
        customerName:'',
        customerOrgId:'',
        customerOrgName:'',
        customerPhone:'',
        isChangeCus:false,
        isChangeEnger:false,
      dataCompany:[],
        tableItem:{},
        selectData:[{
          value:'1',
          label:'是'
        },{
          value:'0',
          label:"否"
        }],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          engerName:""
          },
          // ++++++++++++++++++++++++++++++++++++++++++++++
          columns1: [
            {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'150',
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
                                          this.addNewItemFromTable(params)
                                        }
                                    }
                                }, '复制本行'),
                                // h('Button', {
                                //     props: {
                                //         type: 'primary',
                                //         size: 'small'
                                //     },
                                //      style: {
                                //         marginRight: '5px'
                                //     },
                                //     on: {
                                //         click: () => {
                                //           // this.remove(params.index);
                                //           params.row.isDelete = true;
                                //           this.data1[params.index].isDelete = true

                                //         }
                                //     }
                                // }, '删除'),
                                // h('Button', {
                                //     props: {
                                //         type: 'primary',
                                //         size: 'small'
                                //     },
                                //      style: {
                                //         marginRight: '5px'
                                //     },
                                //     on: {
                                //         click: () => {
                                //           // this.remove(params.index);
                                //           console.log("启用成功")
                                //           params.row.isDelete = false;
                                //           this.data1[params.index].isDelete = false

                                //         }
                                //     }
                                // }, '启用'),
                             ]);
                      }
                        
            },
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
                        width:'100',
                        render:(h,params)=>{
                         if(params.row.steelNameStatus){
                              return h('Input',{
                              props:{
                                value:params.row.steelName,
                                disabled:params.row.isDelete
                              },
                            
                              on:{
                                'on-blur':(event)=>{
                                  this.data1[params.index].steelName = event.target.value
                                  this.data1[params.index].steelNameStatus = false

                                },
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
                                    this.data1[params.index].steelNameStatus = true
                                  }
                                }
                              },params.row.steelName)
                          }
                        }
            },
            {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          if(params.row.steelGuigeStatus){
                            return h('Input',{
                            props:{
                              value:params.row.steelGuige,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].steelGuige = event.target.value
                                this.data1[params.index].steelGuigeStatus = false
                                
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
                                    this.data1[params.index].steelGuigeStatus = true
                                  }
                                }
                              },params.row.steelGuige)
                          }
                        }
            },
            {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'150',
                        render:(h,params)=> {
                           if(params.row.steelPaihaoStatus){
                            return h('Input',{
                            props:{
                              value:params.row.steelPaihao,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].steelPaihao = event.target.value
                                  this.data1[params.index].steelPaihaoStatus = false

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
                                    this.data1[params.index].steelPaihaoStatus = true
                                  }
                                }
                              },params.row.steelPaihao)
                          }
                        },
            },
            {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'120',
                        render:(h,params)=> {
                         if(params.row.steelPinpaiStatus){
                            return h('Input',{
                            props:{
                              value:params.row.steelPinpai,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data1[params.index].steelPinpai = event.target.value
                                  this.data1[params.index].steelPinpaiStatus = false

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
                                    this.data1[params.index].steelPinpaiStatus = true
                                  }
                                }
                              },params.row.steelPinpai)
                          }
                        },
            },//提货方式
            {
                        title: '提货方式',
                        key: 'steelWorks',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(params.row.steelWorksStatus){
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
                          if(params.row.jiaohuodiStatus){
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
                          if(params.row.jianshuStatus){
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
                          if(params.row.weightStatus){
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
                          if(params.row.zongzhongliangStatus){
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
                          if(params.row.guapaijiaStatus){
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
                          if(params.row.cusMoneyStatus){
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
                            return h('a',{
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
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(params.row.kunbaohaoStatus){
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
                                    this.data1[params.index].kunbaohaoStatus = true
                                  }
                                }
                              },params.row.kunbaohao)
                          }
                        },
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
                                    this.data1[params.index].receiptStatusStatus = true
                                    
                                  }
                                }
                              },getReceiptStatusLabel(params.row.receiptStatus))
                          }
                        }
            },
            {
                        title: '收票重量',
                        key: 'invoiceWeight',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                           if(params.row.invoiceWeightStatus){
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
                          if(params.row.invoiceMoneyStatus){
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
                          if(params.row.invoiceNoStatus){
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
                          if(params.row.invoiceStatusStatus){
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
                          if(params.row.om1NameStatus){
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
                         if(params.row.om1MoneyStatus){
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
                        if(params.row.om1OrgNameChoseStatus){
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
                          if(params.row.om2NameStatus){
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
                        if(params.row.om2MoneyStatus){
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
                        if(params.row.gongsi2Status){
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
                          if(params.row.om3NameStatus){
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
                          if(params.row.om3MoneyStatus){
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
                          if(params.row.gongsi3Status){
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
                          if(params.row.om4NameStatus){
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
                          if(params.row.om4MoneyStatus){
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
                              if(params.row.gongshi4Status){
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
                          if(params.row.om5NameStatus){
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
                          if(params.row.om5MoneyStatus){
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
                        if(params.row.gongsi5Status){
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
                          if(params.row.om6NameStatus){
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
                          if(params.row.om6MoneyStatus){
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
                        if(params.row.gongshi6Status){
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
            //2019年7月10日14:19:21  新增
             {
                        title: '采购结算单价',
                        key: 'buyRealDanjia',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.buyRealDanjiaStatus){
                               return h('Input',{
                            props:{
                              value:Number(params.row.buyRealDanjia),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data1[params.index].buyRealDanjia = event.target.value
                                  this.data1[params.index].buyRealDanjiaStatus = false

                              }
                            }
                          })
                          }else{
                              return h('a',{
                                style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].buyRealDanjiaStatus = true
                                    
                                  }
                                }
                              },this.$global.isMoneyShow(params.row.buyRealDanjia))
                          }
                        }
            },
             {
                        title: '采购结算重量',
                        key: 'buyRealWeight',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.buyRealWeightStatus){
                               return h('Input',{
                            props:{
                              value:Number(params.row.buyRealWeight),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data1[params.index].buyRealWeight = event.target.value
                                  this.data1[params.index].buyRealWeightStatus = false

                              }
                            }
                          })
                          }else{
                              return h('a',{
                                style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].buyRealWeightStatus = true
                                    
                                  }
                                }
                              },this.$global.accPrecision(params.row.buyRealWeight,3))
                          }
                        }
            },
             {
                        title: '采购结算金额',
                        key: 'buyRealMoney',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.buyRealMoneyStatus){
                               return h('Input',{
                            props:{
                              value:Number(params.row.buyRealMoney),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data1[params.index].buyRealMoney = event.target.value
                                  this.data1[params.index].buyRealMoneyStatus = false

                              }
                            }
                          })
                          }else{
                              return h('a',{
                                style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].buyRealMoneyStatus = true
                                    
                                  }
                                }
                              },this.$global.isMoneyShow(params.row.buyRealMoney))
                          }
                        }
            },
          ],
                //分割线——————————————————————————————————————————————————————————————————————
         columns2: [
            {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'150',
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
                                          // this.remove(params.index);
                                          this.data2.splice(params.index,1);
                                        }
                                    }
                                }, '删除'),
                             ]);
                      }
                        
            },
            {
                        title: '品名1',
                        key: 'steelName',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                            if(params.row.steelNameStatus){
                              return h('Input',{
                              props:{
                                value:params.row.steelName,
                                disabled:params.row.isDelete
                              },
                              on:{
                                'on-blur':(event)=>{
                                  this.data2[params.index].steelName = event.target.value
                                  this.data2[params.index].steelNameStatus = false
                                },
                              }
                              })
                          }else{
                                  return h('a',{
                                    props:{
                                      
                                    },
                                     style:{
                                      'display':'block',
                                      "width":"90px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                      "margin":"auto"
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].steelNameStatus = true
                                    console.log(this.data2[params.index].steelNameStatus)
                                  }
                                }
                              },params.row.steelName)
                          }
                        }
            },
            {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          
                          if(params.row.steelGuigeStatus){
                            return h('Input',{
                            props:{
                              value:params.row.steelGuige,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data2[params.index].steelGuige = event.target.value
                                this.data2[params.index].steelGuigeStatus = false
                                
                              }
                            }
                          })
                          }else{
                             return h('a',{
                               style:{
                                      'display':'block',
                                      "width":"90px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                      "margin":"auto"

                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].steelGuigeStatus = true
                                  }
                                }
                              },params.row.steelGuige)
                          }
                        }
            },
            {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(params.row.steelPaihaoStatus){
                            return h('Input',{
                            props:{
                              value:params.row.steelPaihao,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data2[params.index].steelPaihao = event.target.value
                                  this.data2[params.index].steelPaihaoStatus = false

                              }
                            }
                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].steelPaihaoStatus = true
                                  }
                                }
                              },params.row.steelPaihao)
                          }
                        },
            },
            {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(params.row.steelPinpaiStatus){
                            return h('Input',{
                            props:{
                              value:params.row.steelPinpai,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data2[params.index].steelPinpai = event.target.value
                                this.data2[params.index].steelPinpaiStatus = false

                              }
                            }
                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].steelPinpaiStatus = true
                                    console.log(params)
                                  }
                                }
                              },params.row.steelPinpai)
                          }
                        },
            },
            {
                        title: '提货方式',
                        key: 'steelWorks',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(params.row.steelWorksStatus){
                            return h('Input',{
                            props:{
                              value:params.row.steelWorks,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data2[params.index].steelWorks = event.target.value
                                  this.data2[params.index].steelWorksStatus = false

                              }
                            }
                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].steelWorksStatus = true
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
                          if(params.row.jiaohuodiStatus){
                            return h('Input',{
                            props:{
                              value:params.row.jiaohuodi,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data2[params.index].jiaohuodi = event.target.value
                                  this.data2[params.index].jiaohuodiStatus = false

                              }
                            }
                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].jiaohuodiStatus = true
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
                          if(params.row.jianshuStatus){
                            return h('Input',{
                            props:{
                              value:params.row.jianshu,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data2[params.index].jianshu = event.target.value
                                  this.data2[params.index].jianshuStatus = false

                              }
                            }
                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].jianshuStatus = true
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
                          if(params.row.weightStatus){
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
                                this.data2[params.index].weight = event.target.value
                                  this.data2[params.index].weightStatus = false

                              }
                            }
                          })
                          }else{
                             return h('a',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].weightStatus = true
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
                          if(params.row.zongzhongliangStatus){
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
                                this.data2[params.index].zongzhongliang = event.target.value
                                  this.data2[params.index].zongzhongliangStatus = false

                              }
                            }
                          })
                          }else{
                              return h('a',{
                                style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].zongzhongliangStatus = true
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
                          if(params.row.guapaijiaStatus){
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
                                this.data2[params.index].guapaijia = event.target.value
                                  this.data2[params.index].guapaijiaStatus = false

                              }
                            }
                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].guapaijiaStatus = true
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
                          if(params.row.cusMoneyStatus){
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
                                 this.data2[params.index].cusMoneyStatus = false

                                this.data2[params.index].cusMoney = event.target.value
                               
                              }
                            }
                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].cusMoneyStatus = true
                                  }
                                }
                              },this.$global.isMoneyShow(params.row.cusMoney))
                          }
                        }
            },
                    //2019年5月5日14:41:17 网价4个
            {
                        title: '网价',
                        key: 'internetMoney',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                            if(params.row.wangJiaStatus){
                            return h('Input',{
                            props:{
                              value:params.row.internetMoney,
                              disabled:params.row.isDelete
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                  this.data2[params.index].wangJiaStatus = false

                                  this.data2[params.index].internetMoney = event.target.value
                               
                              }
                            }
                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].wangJiaStatus = true
                                  }
                                }
                              },params.row.internetMoney)
                          }
                          // 111
                        }
            },
            {
                        title: '浮动价格',
                        key: 'floatMoney',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.fuDongStatus){
                            return h('Input',{
                            props:{
                              value:params.row.floatMoney,
                              disabled:params.row.isDelete
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                  this.data2[params.index].fuDongStatus = false

                                  this.data2[params.index].floatMoney = event.target.value
                               
                              }
                            }
                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].fuDongStatus = true
                                  }
                                }
                              },params.row.floatMoney)

                          }
                        }
            },
            {
                        title: '网价区域',
                        key: 'region',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.wangJiaQu){
                             return h('Input',{
                            props:{
                              value:params.row.region,
                              disabled:params.row.isDelete
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                  this.data2[params.index].wangJiaQu = false

                                  this.data2[params.index].region = event.target.value
                               
                              }
                            }
                          })

                          }else{
                             return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].wangJiaQu = true
                                  }
                                }
                              },params.row.region)
                          }
                        }
            },
            {
                        title: '网价备注',
                        key: 'internetMoneyNote',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.wangJiaBei){
                            return h('Input',{
                            props:{
                              value:params.row.internetMoneyNote,
                              disabled:params.row.isDelete
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                  this.data2[params.index].wangJiaBei = false

                                  this.data2[params.index].internetMoneyNote = event.target.value
                               
                              }
                            }
                          })

                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].wangJiaBei = true
                                  }
                                }
                              },params.row.internetMoneyNote)

                          }
                        }
            },
            //网价4个结束
            {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          if(params.row.kunbaohaoStatus){
                             return h('Input',{
                            props:{
                              value:params.row.kunbaohao,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data2[params.index].kunbaohao = event.target.value
                                  this.data2[params.index].kunbaohaoStatus = false

                              }
                            }
                          })
                          }else{
                             return h('a',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].kunbaohaoStatus = true
                                  }
                                }
                              },params.row.kunbaohao)
                          }
                        },
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
                              value:this.$global.accPrecision(params.row.jiesuanDanjia,2),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event) =>{
                                this.data2[params.index].jiesuanDanjia = event.target.value
                                  this.data2[params.index].jiesuanDanjiaStatus = false

                              }
                            }
                          })
                           }else{
                             return h('a',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].jiesuanDanjiaStatus = true
                                    
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
                                this.data2[params.index].jiesuanWeight = event.target.value
                                  this.data2[params.index].jiesuanWeightStatus = false

                              }
                            }
                          })
                           }else{
                             return h('a',{
                               style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].jiesuanWeightStatus = true
                                    
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
                                this.data2[params.index].jiesuanMoney = event.target.value
                                  this.data2[params.index].jiesuanMoneyStatus = false

                              }
                            }
                          })
                          }else{
                               return h('a',{
                                 style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].jiesuanMoneyStatus = true
                                    
                                  }
                                }
                              },this.$global.isMoneyShow(params.row.jiesuanMoney))
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
                                this.data2[params.index].receiptStatus = value
                                  this.data2[params.index].receiptStatusStatus = false

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
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].receiptStatusStatus = true
                                    
                                  }
                                }
                              },getReceiptStatusLabel(params.row.receiptStatus))
                          }
                        }
            },
            {
                        title: '开票重量',
                        key: 'invoiceWeight',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                           if(params.row.kaiPiaoWeightStatus){
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
                                console.log(event.target.value)
                                this.data2[params.index].invoiceWeight = event.target.value
                                this.data2[params.index].kaiPiaoWeightStatus = false

                              }
                            }
                          })
                           }else{
                              return h('a',{
                                 style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].kaiPiaoWeightStatus = true
                                    
                                  }
                                }
                              },this.$global.accPrecision(params.row.invoiceWeight,3))
                           }
                          
                        }
            },
            {
                        title: '开票金额',
                        key: 'invoiceMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          if(params.row.kaiPiaoMoneyStatus){
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
                                console.log(event.target.value)
                                 this.data2[params.index].kaiPiaoMoneyStatus = false

                                this.data2[params.index].invoiceMoney = event.target.value

                              }
                            }
                          })

                          }else{
                               return h('a',{
                                 style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].kaiPiaoMoneyStatus = true
                                    
                                  }
                                }
                              },this.$global.accPrecision(params.row.invoiceMoney,2))
                          }
                       
                        }
            },
            {
                        title: '开票号码',
                        key: 'invoiceNo',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.kaiPiaoNumberStatus){
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
                                console.log(event.target.value)
                                 this.data2[params.index].kaiPiaoNumberStatus = false
                                this.data2[params.index].invoiceNo = event.target.value

                              }
                            }
                          })
                          }else{
                              return h('a',{
                                 style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].kaiPiaoNumberStatus = true
                                    
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
                          if(params.row.isShouPiao){
                            return h('Select',{
                            props:{
                              value:params.row.invoiceStatus,
                              disabled:params.row.isDelete
                            },
                            on:{
                              'on-change':(value) =>{
                                  this.data2[params.index].invoiceStatus = value
                                  this.data2[params.index].isShouPiao = false

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
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].isShouPiao = true
                                    
                                  }
                                }
                              },getReceiptStatusLabel(params.row.invoiceStatus))

                          }
                        }
            },
            {
                      key:'om1Name',
                      title:'杂费1名称',
                      width:'100',
                      render:(h,params)=>{
                          if(params.row.om1NameStatus){
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
                                   this.data2[params.index].om1Name=event.target.value
                                  this.data2[params.index].om1NameStatus = false

                              }
                            }

                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].om1NameStatus = true
                                    
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
                         if(params.row.om1MoneyStatus){
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
                                   this.data2[params.index].om1Money=event.target.value
                                  this.data2[params.index].om1MoneyStatus = false

                              }
                            }

                          })
                         }else{
                           return h('a',{
                             style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].om1MoneyStatus = true
                                    
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
                        if(params.row.om1OrgNameChoseStatus){
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
                                 this.data2[params.index].om1OrgName  = event.label
                                 this.data2[params.index].om1OrgId = event.value
                                  this.data2[params.index].om1OrgNameChoseStatus = false
                                 
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
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].om1OrgNameChoseStatus = true
                                    
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
                          if(params.row.om2NameStatus){
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
                                   this.data2[params.index].om2Name=event.target.value
                                  this.data2[params.index].om2NameStatus = false

                              }
                            }

                          })
                          }else{
                              return h('a',{
                                style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].om2NameStatus = true
                                    
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
                        if(params.row.om2MoneyStatus){
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
                                   this.data2[params.index].om2Money=event.target.value
                                  this.data2[params.index].om2MoneyStatus = false

                              }
                            }

                          })
                        }else{
                          return h('a',{
                            style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                          on:{
                          'click':(event)=>{
                          this.data2[params.index].om2MoneyStatus = true
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
                        if(params.row.gongsi2Status){
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
                                 this.data2[params.index].om2OrgName   = event.label
                                 this.data2[params.index].om2OrgId = event.value
                                  this.data2[params.index].gongsi2Status = false

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
                        return h('a',{
                          style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                        on:{
                        'click':(event)=>{
                        this.data2[params.index].gongsi2Status = true
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
                          if(params.row.om3NameStatus){
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
                                   this.data2[params.index].om3Name=event.target.value
                                  this.data2[params.index].om3NameStatus = false

                              }
                            }

                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data2[params.index].om3NameStatus = true
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
                          if(params.row.om3MoneyStatus){
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
                                   this.data2[params.index].om3Money=event.target.value
                                  this.data2[params.index].om3MoneyStatus = false
                              }
                            }

                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data2[params.index].om3MoneyStatus = true
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
                          if(params.row.gongsi3Status){
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
                                 this.data2[params.index].om3OrgName   = event.label
                                 this.data2[params.index].om3OrgId = event.value
                                  this.data2[params.index].gongsi3Status = false

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
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data2[params.index].gongsi3Status = true
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
                          if(params.row.om4NameStatus){
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
                                   this.data2[params.index].om4Name=event.target.value
                                  this.data2[params.index].om4NameStatus = false
                              }
                            }

                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data2[params.index].om4NameStatus = true
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
                          if(params.row.om4MoneyStatus){
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
                                   this.data2[params.index].om4Money=event.target.value
                                  this.data2[params.index].om4MoneyStatus = false
                              }
                            }

                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data2[params.index].om4MoneyStatus = true
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
                              if(params.row.gongshi4Status){
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
                                  this.data2[params.index].om4OrgName  = event.label
                                  this.data2[params.index].om4OrgId = event.value
                                  this.data2[params.index].gongshi4Status = false

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
                                return h('a',{
                                  style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                                  on:{
                                  'click':(event)=>{
                                      this.data2[params.index].gongshi4Status = true
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
                          if(params.row.om5NameStatus){
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
                                   this.data2[params.index].om5Name=event.target.value
                                  this.data2[params.index].om5NameStatus = false
                              }
                            }

                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data2[params.index].om5NameStatus = true
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
                          if(params.row.om5MoneyStatus){
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
                                   this.data2[params.index].om5Money=event.target.value
                                  this.data2[params.index].om5MoneyStatus = false
                              }
                            }

                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data2[params.index].om5MoneyStatus = true
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
                        if(params.row.gongsi5Status){
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
                                  this.data2[params.index].om5OrgName=event.label
                                  this.data2[params.index].om5OrgId=event.value
                                  this.data2[params.index].gongsi5Status = false

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
                          return h('a',{
                            style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                            on:{
                            'click':(event)=>{
                                this.data2[params.index].gongsi5Status = true
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
                          if(params.row.om6NameStatus){
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
                                   this.data2[params.index].om6Name=event.target.value
                                  this.data2[params.index].om6NameStatus = false
                              }
                            }

                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data2[params.index].om6NameStatus = true
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
                          if(params.row.om6MoneyStatus){
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
                                   this.data2[params.index].om6Money=event.target.value
                                  this.data2[params.index].om6MoneyStatus = false
                              }
                            }

                          })
                          }else{
                            return h('a',{
                              style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                              on:{
                              'click':(event)=>{
                                  this.data2[params.index].om6MoneyStatus = true
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
                        if(params.row.gongshi6Status){
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
                                  this.data2[params.index].om6OrgName=event.label
                                  this.data2[params.index].om6OrgId=event.value
                                  this.data2[params.index].gongshi6Status = false
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
                          return h('a',{
                            style:{
                                      'display':'block',
                                      "width":"100px",
                                      "height":'40px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"40px",
                                      "text-align":"center",
                                    },
                            on:{
                            'click':(event)=>{
                                this.data2[params.index].gongshi6Status = true
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
            //2019年7月10日14:26:37 新增
            //2019年7月10日14:19:21  新增
             {
                        title: '采购结算单价',
                        key: 'buyRealDanjia',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.buyRealDanjiaStatus){
                               return h('Input',{
                            props:{
                              value:Number(params.row.buyRealDanjia),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data2[params.index].buyRealDanjia = event.target.value
                                  this.data2[params.index].buyRealDanjiaStatus = false

                              }
                            }
                          })
                          }else{
                              return h('a',{
                                style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].buyRealDanjiaStatus = true
                                    
                                  }
                                }
                              },this.$global.isMoneyShow(params.row.buyRealDanjia))
                          }
                        }
            },
             {
                        title: '采购结算重量',
                        key: 'buyRealWeight',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.buyRealWeightStatus){
                               return h('Input',{
                            props:{
                              value:Number(params.row.buyRealWeight),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data2[params.index].buyRealWeight = event.target.value
                                  this.data2[params.index].buyRealWeightStatus = false

                              }
                            }
                          })
                          }else{
                              return h('a',{
                                style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].buyRealWeightStatus = true
                                    
                                  }
                                }
                              },this.$global.accPrecision(params.row.buyRealWeight,3))
                          }
                        }
            },
             {
                        title: '采购结算金额',
                        key: 'buyRealMoney',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.buyRealMoneyStatus){
                               return h('Input',{
                            props:{
                              value:Number(params.row.buyRealMoney),
                              disabled:params.row.isDelete

                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-blur':(event)=>{
                                this.data2[params.index].buyRealMoney = event.target.value
                                  this.data2[params.index].buyRealMoneyStatus = false

                              }
                            }
                          })
                          }else{
                              return h('a',{
                                style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'40px',
                                      "border":"1px",
                                      "line-height":"40px",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data2[params.index].buyRealMoneyStatus = true
                                    
                                  }
                                }
                              },this.$global.isMoneyShow(params.row.buyRealMoney))
                          }
                        }
            },
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
      //查询公司
       getOrg(name){
       },
      //获取供应商选中的值
       getDian(item){
         console.log("获取到了数据")
          console.log(item)
        const d=eval('(' + item.value + ')')
        this.cusOrgItem = d;
        this.customerId         = d.cusid           
        this.customerName       = d.cus              
        this.customerOrgId      = d.cusorgId                
        this.customerOrgName    = d.cusorgName                  
        this.customerPhone      = d.cusphone 
        
        this.isChangeCus = true;
       },
      changeEngerName(item){
        console.log(item.target.value)
        this.isChangeEnger = true;
      },
      //获取公司名字
         getComPany(){
             let param={};
          param.pageSize = 999999;
              
             findOrgCusAcc(param).then(res=>{
        
                  this.dataCompany=res.data.list
                  this.optionsList=res.data.list            
            })
         },
      setOrderInfo(){
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName        
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll) 
          this.formItem.engerName             = this.$route.query.gongcheng;
          this.cusOrgPl = this.$route.query.customerOrgName
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

                res.data.list[i].buyRealDanjiaStatus    = false;//开票号码状态
                res.data.list[i].buyRealWeightStatus    = false;//开票号码状态
                res.data.list[i].buyRealMoneyStatus    = false;//开票号码状态

              }
              this.data1 = res.data.list;
            }else{
            }
          })
      },
       selectOne(row){
         console.log(row)
       },
       remove(index){
         this.data1.splice(index,1);
       },
       thenFunction(){},
       addBtn(){//TODO:
       //测试 then方法
          this.updateOrderTInfo();
          this.addNewitemOrder();
          let params = {};
          let pageOrderInfoList = [];
          for(var i=0; i<this.data1.length;i++ ){
            console.log(i);
            var item = this.data1[i];
            let dic = {};
            //是否删除 isDelete true 或者 false
            if(item.isDelete){
              dic.status = 0
            }
            dic.id             = item.id;
            dic.steelName      = item.steelName;      //品名
            dic.steelGuige     = item.steelGuige;     //规格
            dic.steelPaihao    = item.steelPaihao;    //材质
            dic.steelPinpai    = item.steelPinpai;    //钢厂
            dic.steelWorks     = item.steelWorks      //提货方式
            dic.jiaohuodi      = item.jiaohuodi       //交货地
            dic.jianshu        = item.jianshu         //件数
            dic.zongzhongliang = item.zongzhongliang  //总重量
            dic.weight         = item.weight          //单件重
            dic.guapaijia      = item.guapaijia       //单价
            dic.kunbaohao      = item.kunbaohao       //捆包号

            dic.jiesuanDanjia  = item.jiesuanDanjia   //结算单价
            dic.jiesuanWeight  = item.jiesuanWeight   //结算重量
            dic.jiesuanMoney   = item.jiesuanMoney    //结算金额

            dic.receiptStatus  = item.receiptStatus   //是否收货
            dic.invoiceWeight  = item.invoiceWeight   //开票重量
            dic.invoiceMoney   = item.invoiceMoney    //开票金额
            dic.invoiceNo      = item.invoiceNo       //开票号码
            dic.invoiceStatus  = item.invoiceStatus   //是否收票

             //以下是 杂费的修改
            dic.om1Name    = item.om1Name
            dic.om1Money   = item.om1Money
            dic.om1OrgId   = item.om1OrgId
            dic.om1OrgName = item.om1OrgName

                        dic.om2Name    = item.om2Name
                        dic.om2Money   = item.om2Money
                        dic.om2OrgId   = item.om2OrgId
                        dic.om2OrgName = item.om2OrgName

                        dic.om3Name    = item.om3Name
                        dic.om3Money   = item.om3Money
                        dic.om3OrgId   = item.om3OrgId
                        dic.om3OrgName = item.om3OrgName

                        dic.om4Name    = item.om4Name
                        dic.om4Money   = item.om4Money
                        dic.om4OrgId   = item.om4OrgId
                        dic.om4OrgName = item.om4OrgName

                        dic.om5Name    = item.om5Name
                        dic.om5Money   = item.om5Money
                        dic.om5OrgId   = item.om5OrgId
                        dic.om5OrgName = item.om5OrgName

                        dic.om6Name    = item.om6Name
                        dic.om6Money   = item.om6Money
                        dic.om6OrgId   = item.om6OrgId
                        dic.om6OrgName = item.om6OrgName
                          //2019年5月5日13:40:08 新增 a:网价，b:浮动价,c:区域,d:网价备注;
                        dic.internetMoney     = item.internetMoney
                        dic.floatMoney        = item.floatMoney
                        dic.region            = item.region
                        dic.internetMoneyNote = item.internetMoneyNote
                        
                               //2019年7月10日14:37:25
                        dic.buyRealDanjia = item.buyRealDanjia
                        dic.buyRealWeight = item.buyRealWeight
                        dic.buyRealMoney =  item.buyRealMoney
                        //2019年6月25日15:32:05 添加修改客户信息
                        if(this.isChangeCus == true){
                            dic.customerId = this.customerId;
                            dic.cusName    = this.customerName
                            dic.cusOrgId   = this.customerOrgId
                            dic.cusOrgName = this.customerOrgName
                            dic.cusPhone   = this.customerPhone
                          }
            pageOrderInfoList.push(dic);
          }
          params.pageOrderInfoList = pageOrderInfoList;
          console.log("updateOrderInfo方法")
          updateOrderInfo(params).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'修改成功',
                     duration:1,
                     onClose:res =>{
                        this.closeSelf();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'修改失败'
                 })
             }
          })
       },
        updateOrderTInfo(){//修改订单的店铺信息和工程名称
              console.log("updateOrderTInfo")
              if(this.isChangeCus ==false  && this.isChangeEnger == false){
                return false;
              }
              let p = {};
              let plist = [];
              let dic = {};
              dic.id = this.$route.query.id;
              if(this.isChangeCus == true){

                      dic.customerId = this.customerId;
                      dic.cusName    = this.customerName
                      dic.cusOrgId   = this.customerOrgId
                      dic.cusOrgName = this.customerOrgName
                      dic.cusPhone   = this.customerPhone
              }
            
                if(this.isChangeEnger == true){
                  dic.gongcheng = this.formItem.engerName;
                }
              plist.push(dic);
              p.pageUpdateOrderList = plist;
          updateOrderStatus(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改总订单信息成功',
                    duration:1,
                    onClose:res =>{
                    }
                 })
              }else{
                   this.$Notice.error({
                   title:'修改总订单信息失败'
                  })
              }
           })
       },
       addNewitemOrder(){//新增订单明细
          console.log("开始添加addNewitemOrder");
          if(this.data2.length<=0){
            return;
          }
          let params ={};
          let orderInfoList = [];
          let baseItem = this.data1[0];
          for(var i = 0;i<this.data2.length;i++){
             let dic =  this.data2[i];
             let item = {};
             //传参时 不变的内容
                        item.ordersId           = baseItem.ordersId;
                        item.orderNo            = baseItem.orderNo;
                        item.status             = "1";

                        item.agentId            = baseItem.agentId
                        item.agentName          = baseItem.agentName
                        item.agentShortName     = baseItem.agentName
                        item.bankJgId           = baseItem.bankJgId
                        item.businessType       = baseItem.businessType
                        item.buyType            = baseItem.buyType
                        item.createCname        = this.$global.adminInfo.cname
                        item.createEname        = this.$global.adminInfo.ename
                        item.customerId         = baseItem.customerId
                        item.customerName       = baseItem.customerName;
                        item.customerOrgId      = baseItem.customerOrgId
                        item.customerOrgName    = baseItem.customerOrgName;
                        item.customerPhone      = baseItem.customerPhone
                        item.invoiceApplyMoney  = "0"
                        item.invoiceApplyWeight = "0"
                        item.ordersType         = baseItem.ordersType
                        item.payType            = baseItem.payType
                        item.shopId             = baseItem.shopId
                        item.shopName           = baseItem.shopName
                        item.shopOrgId          = baseItem.shopOrgId
                        item.shopOrgName        = baseItem.shopOrgName;
                        item.shopSteelId        = '';
                        item.shopUserId         = baseItem.shopUserId;
                        item.userId             = baseItem.userId

                        //下面是根据列表取的内容
                        item.inStockId    = dic.inStockId;

                        item.cusMoney     = dic.cusMoney
                        item.orgMoney     = dic.cusMoney//底价总额

                        item.dijia        = dic.guapaijia
                        item.guapaijia    = dic.guapaijia

                        item.jianshu      = dic.jianshu
                        item.xuniJianshu  = dic.jianshu

                        item.jiaohuodi    = dic.jiaohuodi
                        item.jizhongType  = dic.jizhongType
                        item.kunbaohao    = dic.kunbaohao
                        item.merMoney     = dic.cusMoney
                        item.steelGuige   = dic.steelGuige
                        item.steelName    = dic.steelName
                        item.steelPaihao  = dic.steelPaihao
                        item.steelPinpai  = dic.steelPinpai
                        item.steelWorks   = dic.steelWorks
                        item.steelType    = dic.steelType//类别

                        item.weight       = dic.weight
                        item.zongzhongliang = dic.zongzhongliang
                        //新增的字段
                        item.jiesuanDanjia = dic.jiesuanDanjia
                        item.jiesuanMoney  = dic.jiesuanMoney
                        item.jiesuanWeight = dic.jiesuanWeight

                        item.receiptStatus = dic.receiptStatus
                        item.invoiceMoney  = dic.invoiceMoney
                        item.invoiceWeight = dic.invoiceWeight
                        item.invoiceStatus = dic.invoiceStatus
                        item.invoiceNo     = dic.invoiceNo

                          //以下是 杂费的修改
                        item.om1Name    = dic.om1Name
                        item.om1Money   = dic.om1Money
                        item.om1OrgId   = dic.om1OrgId
                        item.om1OrgName = dic.om1OrgName
                        item.om2Name    = dic.om2Name
                        item.om2Money   = dic.om2Money
                        item.om2OrgId   = dic.om2OrgId
                        item.om2OrgName = dic.om2OrgName
                        item.om3Name    = dic.om3Name
                        item.om3Money   = dic.om3Money
                        item.om3OrgId   = dic.om3OrgId
                        item.om3OrgName = dic.om3OrgName
                        item.om4Name    = dic.om4Name
                        item.om4Money   = dic.om4Money
                        item.om4OrgId   = dic.om4OrgId
                        item.om4OrgName = dic.om4OrgName
                        item.om5Name    = dic.om5Name
                        item.om5Money   = dic.om5Money
                        item.om5OrgId   = dic.om5OrgId
                        item.om5OrgName = dic.om5OrgName
                        item.om6Name    = dic.om6Name
                        item.om6Money   = dic.om6Money
                        item.om6OrgId   = dic.om6OrgId
                        item.om6OrgName = dic.om6OrgName

                        //2019年5月5日13:40:08 新增 a:网价，b:浮动价,c:区域,d:网价备注;
                        item.internetMoney     = dic.internetMoney
                        item.floatMoney        = dic.floatMoney
                        item.region            = dic.region
                        item.internetMoneyNote = dic.internetMoneyNote
                        //2019年7月10日14:37:25
                        item.buyRealDanjia = dic.buyRealDanjia
                        item.buyRealWeight = dic.buyRealWeight
                        item.buyRealMoney = dic.buyRealMoney

                 orderInfoList.push(item);  
          }
          params.pageOrderInfoList= orderInfoList;
          addOrderInfo(params).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'订单添加明细成功',
                      duration:1,
                      onClose:res =>{
                   }
                 })
             }else{
                 this.$Notice.error({
                     title:'订单添加明细失败'
                 })
             }
          })
       },
       turnToOrderList(){//审核或者关闭之后跳转到
          console.log("准备关闭")
          this.closeTag({
              name: 'review_order_info'
          })
          setTimeout(() => {
            this.toreload();
          }, 1000);
       },
       toreload(){//通知列表页面刷新数据
          console.log("准备关闭2")
           Utils.$emit('demo','reload');
       },
        ...mapMutations([
      'closeTag'
    ]),
    closeSelf(){
      this.closeTag({
        name:'sell_order_change_oinfo',
        query:this.$route.query
      })
    },
    addNewItemFromTable(params){
      let a = params.row;
      this.data2.push(a);

    },
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

      dic.buyRealDanjiaStatus    = "";//开票号码状态
      dic.buyRealWeightStatus    = "";//开票号码状态
      dic.buyRealMoneyStatus    = "";//开票号码状态
      this.data2.push(dic);
    }

    },
    
    mounted(){
     this.setOrderInfo();
     this.getComPany();

    },
    
    created(){
   
    },
}

</script>
<style <style lang="less">
#kehu .ivu-select-input::-webkit-input-placeholder{
  color:red
}

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