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
        <Table border ref="selection" :columns="columns1" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
        </Table>
    </row>
    <row>
        <b class="font_32">新增合同明细信息</b>
      <Button size="small" type="primary" @click="addNewitem"> 添加一行</Button>

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
findOrgCusAcc} from '@/api/data'
import { mapMutations } from 'vuex'
import Utils from '@/api/middle'
export default {
    name: 'buy_order_change_info',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
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
      dataCompany:[],
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
                                          params.row.isDelete = true;
                                          this.data1[params.index].isDelete = true

                                        }
                                    }
                                }, '删除'),
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
                                          console.log("启用成功")
                                          params.row.isDelete = false;
                                          this.data1[params.index].isDelete = false

                                        }
                                    }
                                }, '启用'),
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
                          return h('Input',{
                            props:{
                              value:params.row.steelName,
                              disabled:params.row.isDelete
                            },
                            on:{
                              'on-blur':(event)=>{
                                console.log(event.target.value)
                                this.data1[params.index].steelName = event.target.value
                              }
                            }
                          })
                        }
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.steelGuige,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data1[params.index].steelGuige = event.target.value

                              }
                            }
                          })
                        }
                    },
                    {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'150',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.steelPaihao,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data1[params.index].steelPaihao = event.target.value

                              }
                            }
                          })
                        },
                    },
                    {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'120',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.steelPinpai,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data1[params.index].steelPinpai = event.target.value

                              }
                            }
                          })
                        },
                    },
                    {
                        title: '提货方式',
                        key: 'steelWorks',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.steelWorks,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data1[params.index].steelWorks = event.target.value

                              }
                            }
                          })
                        },
                    },
                     {
                        title: '交货地',
                        key: 'jiaohuodi',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.jiaohuodi,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data1[params.index].jiaohuodi = event.target.value

                              }
                            }
                          })
                        },
                    },
                    {
                        title: '件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.jianshu,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data1[params.index].jianshu = event.target.value

                              }
                            }
                          })
                        },
                    },
                    {
                        title: '单件重',
                        key: 'weight',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data1[params.index].weight = event.target.value

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '总重量',
                        key: 'zongzhongliang',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data1[params.index].zongzhongliang = event.target.value

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '单价',
                        key: 'guapaijia',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data1[params.index].guapaijia = event.target.value

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '总金额',
                        key: 'cusMoney',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data1[params.index].cusMoney = event.target.value

                              }
                            }
                          })
                        }
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.kunbaohao,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data1[params.index].kunbaohao = event.target.value

                              }
                            }
                          })
                        },
                    },
                    {
                        title: '结算重量',
                        key: 'jiesuanWeight',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data1[params.index].jiesuanWeight = event.target.value

                              }
                            }
                          })
                        }
                    },
                      {
                        title: '结算金额',
                        key: 'jiesuanMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data1[params.index].jiesuanMoney = event.target.value

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '是否收货',
                        key: 'receiptStatus',
                        align: 'center',
                        width:'100',
                        render: (h,params)=> {
                          return h('Select',{
                            props:{
                              value:params.row.receiptStatus,
                              disabled:params.row.isDelete
                            },
                            on:{
                              'on-change':(value) =>{
                                console.log(value)
                                this.data1[params.index].receiptStatus = value

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
                        }
                    },
                      {
                        title: '开票重量',
                        key: 'invoiceWeight',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
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
                                this.data1[params.index].invoiceWeight = event.target.value

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '开票金额',
                        key: 'invoiceMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
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
                                this.data1[params.index].invoiceMoney = event.target.value

                              }
                            }
                          })
                        }
                    },
                    {
                        title: '开票号码',
                        key: 'invoiceNo',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
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
                                this.data1[params.index].invoiceNo = event.target.value

                              }
                            }
                          })
                        }
                    },
                    {
                        title: '是否收票',
                        key: 'invoiceStatus',
                        align: 'center',
                        width:'100',
                        render: (h,params)=> {
                          return h('Select',{
                            props:{
                              value:params.row.invoiceStatus,
                              disabled:params.row.isDelete
                            },
                            on:{
                              'on-change':(value) =>{
                                console.log(value)
                                this.data1[params.index].invoiceStatus = value

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
                        }
                    },
                     {
                      key:'om1Name',
                      title:'杂费1名称',
                      width:'100',
                      render:(h,params)=>{
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
                              }
                            }

                          })
                        }
                     
                    },
                     {
                      key:'om1Money',
                      title:'杂费1金额',
                      width:'100',
                     render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'sszafeigongsi1',
                      title:'选择杂费1公司',
                      width:'100',
                      render:(h,params)=>{
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
                                 console.log(event)
                                 this.data1[params.index].om1OrgName  = event.label
                                 this.data1[params.index].om1OrgId = event.value
                                 
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om2Money',
                      title:'2金额',
                      width:'100',
                      render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongsi2',
                      title:'选择杂费2公司名称',
                      width:'100',
                      render:(h,params)=>{
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

                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om3Money',
                      title:'公司3金额',
                       width:'100',
                        render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongsi3',
                      title:'选择杂费公司3',
                       width:'100',
                        render:(h,params)=>{
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

                                 console.log(event)
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om4Money',
                      title:'杂费4金额',
                       width:'100',
                       render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongshi4',
                      title:'选择公司4',
                       width:'100',
                           render:(h,params)=>{
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

                                 console.log(event)
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om5Money',
                      title:'杂费5金额',
                       width:'100',
                        render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongsi5',
                      title:'公司5',
                      width:'100',
                      render:(h,params)=>{
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

                                 console.log(event)
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om6Money',
                      title:'杂费6金额',
                       width:'100',
                        render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongshi6',
                      title:'公司6',
                       width:'100',
                        render:(h,params)=>{
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
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.steelName,
                              disabled:params.row.isDelete
                            },
                            on:{
                              'on-blur':(event)=>{
                                console.log(event.target.value)
                                this.data2[params.index].steelName = event.target.value
                              }
                            }
                          })
                        }
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.steelGuige,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data2[params.index].steelGuige = event.target.value

                              }
                            }
                          })
                        }
                    },
                    {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'150',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.steelPaihao,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data2[params.index].steelPaihao = event.target.value

                              }
                            }
                          })
                        },
                    },
                    {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'120',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.steelPinpai,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data2[params.index].steelPinpai = event.target.value

                              }
                            }
                          })
                        },
                    },
                    {
                        title: '提货方式',
                        key: 'steelWorks',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.steelWorks,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data2[params.index].steelWorks = event.target.value

                              }
                            }
                          })
                        },
                    },
                     {
                        title: '交货地',
                        key: 'jiaohuodi',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.jiaohuodi,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data2[params.index].jiaohuodi = event.target.value

                              }
                            }
                          })
                        },
                    },
                    {
                        title: '件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'100',
                        render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.jianshu,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data2[params.index].jianshu = event.target.value

                              }
                            }
                          })
                        },
                    },
                      {
                        title: '单件重',
                        key: 'weight',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data2[params.index].weight = event.target.value

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '总重量',
                        key: 'zongzhongliang',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data2[params.index].zongzhongliang = event.target.value

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '单价',
                        key: 'guapaijia',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data2[params.index].guapaijia = event.target.value

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '总金额',
                        key: 'cusMoney',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data2[params.index].cusMoney = event.target.value

                              }
                            }
                          })
                        }
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',render:(h,params)=> {
                          return h('Input',{
                            props:{
                              value:params.row.kunbaohao,
                              disabled:params.row.isDelete

                            },
                            on:{
                              'on-blur':(event) =>{
                                console.log(event.target.value)
                                this.data2[params.index].kunbaohao = event.target.value

                              }
                            }
                          })
                        },
                    },
                    {
                        title: '结算重量',
                        key: 'jiesuanWeight',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data2[params.index].jiesuanWeight = event.target.value

                              }
                            }
                          })
                        }
                    },
                      {
                        title: '结算金额',
                        key: 'jiesuanMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
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
                                console.log(event.target.value)
                                this.data2[params.index].jiesuanMoney = event.target.value

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '是否收货',
                        key: 'receiptStatus',
                        align: 'center',
                        width:'100',
                        render: (h,params)=> {
                          return h('Select',{
                            props:{
                              value:params.row.receiptStatus,
                              disabled:params.row.isDelete
                            },
                            on:{
                              'on-change':(value) =>{
                                console.log(value)
                                this.data2[params.index].receiptStatus = value

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
                        }
                    },
                      {
                        title: '开票重量',
                        key: 'invoiceWeight',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
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

                              }
                            }
                          })
                        }
                    },
                     {
                        title: '开票金额',
                        key: 'invoiceMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
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
                                this.data2[params.index].invoiceMoney = event.target.value

                              }
                            }
                          })
                        }
                    },
                    {
                        title: '开票号码',
                        key: 'invoiceNo',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
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
                                this.data2[params.index].invoiceNo = event.target.value

                              }
                            }
                          })
                        }
                    },
                    {
                        title: '是否收票',
                        key: 'invoiceStatus',
                        align: 'center',
                        width:'100',
                        render: (h,params)=> {
                          return h('Select',{
                            props:{
                              value:params.row.invoiceStatus,
                              disabled:params.row.isDelete
                            },
                            on:{
                              'on-change':(value) =>{
                                console.log(value)
                                this.data2[params.index].invoiceStatus = value

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
                        }
                    },
                    {
                      key:'om1Name',
                      title:'杂费1名称',
                      width:'100',
                      render:(h,params)=>{
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
                              }
                            }

                          })
                        }
                     
                    },
                     {
                      key:'om1Money',
                      title:'杂费1金额',
                      width:'100',
                     render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'sszafeigongsi1',
                      title:'选择杂费1公司',
                      width:'100',
                      render:(h,params)=>{
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
                                 console.log(event)
                                 this.data2[params.index].om1OrgName  = event.label
                                 this.data2[params.index].om1OrgId = event.value
                                 
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om2Money',
                      title:'2金额',
                      width:'100',
                      render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongsi2',
                      title:'选择杂费2公司名称',
                      width:'100',
                      render:(h,params)=>{
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

                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om3Money',
                      title:'公司3金额',
                       width:'100',
                        render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongsi3',
                      title:'选择杂费公司3',
                       width:'100',
                        render:(h,params)=>{
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

                                 console.log(event)
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om4Money',
                      title:'杂费4金额',
                       width:'100',
                       render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongshi4',
                      title:'选择公司4',
                       width:'100',
                           render:(h,params)=>{
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

                                 console.log(event)
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om5Money',
                      title:'杂费5金额',
                       width:'100',
                        render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongsi5',
                      title:'公司5',
                      width:'100',
                      render:(h,params)=>{
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

                                 console.log(event)
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'om6Money',
                      title:'杂费6金额',
                       width:'100',
                        render:(h,params)=>{
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
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'gongshi6',
                      title:'公司6',
                       width:'100',
                        render:(h,params)=>{
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
                              }
                            },
                        },
                        this.dataCompany.map((item)=>{
                          return h('Option',{
                            props:{value:item.cusorgId}
                          },item.cusorgName)
                        })
                      
                      );
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
      //获取公司名字
         getComPany(){
             let param={};
              
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
          console.log(this.$route.query)
      },
      getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              for(var i in res.data.list){
                res.data.list[i].isDelete = false;
              }
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
       selectOne(row){
         console.log(row)
       },
       remove(index){
         this.data1.splice(index,1);
       },
       addBtn(){//修改提交
          console.log("修改成功");
          console.log(this.data2);
          this.addNewitemOrder();
          let params = {};
          let pageOrderInfoList = [];
          for(var i in this.data1){
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
                        this.reload();
                      //  this.turnToOrderList();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'修改失败'
                 })
             }
          })
       },
       addNewitemOrder(){//新增订单明细
          console.log("开始添加");
          if(this.data2.length<=0){
            return;
          }
          let params ={};
          let orderInfoList = [];
          let baseItem = this.$route.query
          for(var i in this.data2){
             let dic =  this.data2[i];
             let item = {};
             //传参时 不变的内容
                        item.ordersId           = baseItem.id;
                        item.orderNo            = baseItem.ordersNo;
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
                        item.shopOrgId          = baseItem.merchantsId
                        item.shopOrgName        = baseItem.shopOrgName;
                        item.shopSteelId        = '';
                        item.shopUserId         = baseItem.shopUserId;
                        item.userId             = baseItem.userId

                        //下面是根据列表取的内容
                        item.cusMoney     = dic.cusMoney
                        item.dijia        = dic.guapaijia
                        item.guapaijia    = dic.guapaijia
                        item.jianshu      = dic.jianshu
                        item.jiaohuodi    = dic.jiaohuodi
                        item.jizhongType  = dic.jizhongType
                        item.kunbaohao    = dic.kunbaohao
                        item.merMoney     = dic.cusMoney
                        item.steelGuige   = dic.steelGuige
                        item.steelName    = dic.steelName
                        item.steelPaihao  = dic.steelPaihao
                        item.steelPinpai  = dic.steelPinpai
                        item.steelWorks   = dic.steelWorks
                        item.weight       = dic.weight
                        item.zongzhongliang = dic.zongzhongliang
                        //新增的字段
                        item.jiesuanMoney  =(dic.jiesuanMoney =="")?"0":dic.jiesuanMoney 
                        item.jiesuanWeight = (dic.jiesuanWeight =="")?"0":dic.jiesuanWeight  
                        item.receiptStatus = dic.receiptStatus
                        item.invoiceMoney  = (dic.invoiceMoney =="")?"0":dic.invoiceMoney
                        item.invoiceWeight = (dic.invoiceWeight =="")?"0":dic.invoiceWeight 
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
</style>