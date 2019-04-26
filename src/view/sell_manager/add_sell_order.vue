<!--
 * @Description: 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-16 10:31:18
 -->
<!--
 * @Description:新增库存销售单  
 * @Author: wb
 * @others: 
 * @Date: 2019-04-16 10:31:18
 -->

<template>
  <div>
    <row>
      <Form :label-width="120" inline :model="addForm">

        <row>
          <h2 style='text-indent:20px;'>库存销售开单</h2><br/>
          <h3 style='text-indent:40px;'>基本信息</h3>

          <FormItem label="客户查询:">
            <Select v-model="shopO" 
            style="width:200px" 
            placeholder="请输入客户名称" 
             @on-change='getDian'  
             filterable
             remote
             :remote-method="getOrg"
             :loading="loading"
             :label-in-value='true'
             >
               <Option v-for="(item,index) in optionsList" :value="JSON.stringify(item)"  :key="index" >{{ item.cusorgName }}</Option>
      
            </Select>
          </FormItem>

          <FormItem label="本公司抬头:">
            <Select v-model="taiT" style="width:200px" placeholder="请输入公司抬头" @on-change='getTai'  :label-in-value='true'>
              <Option v-for="(item,index) in rise" :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>

          <FormItem label="查询代理商">
            <Select :label-in-value='true' v-model='dai' style="width:200px" placeholder="请选择代理商" @on-change='getChange'>
              <Option  v-for='(item,index) in daiLi' :value="item.id" :key='index'>{{item.shortName}}</Option>
            </Select>
          </FormItem>
        </row>

           <FormItem label="采购总金额:" prop="totalSum">
           <div   style="width:200px;color:red" v-model="addForm.totalSum" placeholder="请输入总金额">{{this.$global.isMoneyShow(addForm.totalSum)}}元</div>
         </FormItem>

         <FormItem label="采购总重量:" prop="totalWeight">
           <div   style="width:200px;color:red" v-model="addForm.totalWeight" placeholder="请输入总重量">{{addForm.totalWeight}}吨</div>
         </FormItem>
           <FormItem label="杂费总金额:" prop="totalOMoney">
           <div   style="width:200px;color:red" v-model="addForm.totalOMoney" placeholder="请输入杂费总金额">{{this.$global.isMoneyShow(addForm.totalOMoney)}}元</div>
         </FormItem>
          <FormItem label="总件数:" prop="totalOMoney">
           <div   style="width:200px;color:red" v-model="addForm.totalNum" placeholder="请输入总件数">{{addForm.totalNum}}件</div>
         </FormItem>
          <p style="visibility: hidden;">{{total}}</p>

      </Form>
    </row>
    <!-- 合同明细 -->
    <row>
      <h3 style='text-indent:40px;margin-bottom:10px'>合同明细</h3>
         <Button type='primary' style='margin-left:30px;margin-bottom:15px;' @click="modal8 = true" >选择库存资源</Button>
        <!-- TABLE表格 -->
       <row style='margin-bottom:20px;'> 
           <Table size="small" :columns="columnsOne" v-show='tabShow' :data="dataOne"></Table>
       </row>
    </row>

    <!-- 上传图片 -->
    <row style='margin-bottom:20px;'>
        <b class="font_32">图片信息</b> 
        <!-- <Tag type="border" color="error">第一张为营业执照</Tag>
        <Tag type="border" color="error">第二张为开票资料</Tag>        -->
        <br>
        <div  class="demo-upload-list" v-for="(item,index) in uploadList" :key='index'>
            <template v-if="item.status === 'finished'">
                <img :src="item.url" >
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload 
        ref="upload" 
        :show-upload-list="false" 
        :default-file-list="defaultList" 
        :on-success="handleSuccess" 
        :format="['jpg','jepg','png']" 
        :max-size="5120" 
        :on-format-error="handleFormatError" 
        :on-exceeded-size="handleMaxSize" 
        :before-upload="handleBeforeUpload"
            multiple type="drag" :action="updateImgUrl" style="display:inline-block;width:58px">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
            <Modal title="查看图片" v-model="visible">
                <img :src="this.$global.ossUrl + imgName" v-if="visible" style="width: 100%">
            </Modal>
        </Upload>

    </row>

    <!--提交取消按钮 -->
    <row style='padding-left:10px;'>
      <Button   type="primary" @click='getAdd' style='margin-right:15px;'>提交</Button>
      <Button   type="primary">取消</Button> 
    </row>

    <!-- 2 点击选择库存资源弹窗 -->
     <Modal
        title="库存资源"
        v-model="modal8"
        width='1300'
        :footer-hide="true"
        :mask-closable="false">
        <row>
             <Form :label-width="80" inline  :model="addFormOne">

                 <row>
                    <FormItem label="入库单号:" >
                     <i-input style="width:120px"  v-model="addFormOne.inStockNoLike" placeholder="请输入采购单号" />
                   </FormItem>

                   <FormItem label="捆包号:" >
                     <i-input style="width:120px"  v-model="addFormOne.kunbaohao" placeholder="请输入捆包号" />
                   </FormItem>
                </row>
                
                <!-- 查询 -->
                <row >
                    <Button type='primary'  style='margin-left:35px;' @click='getCha'>查询</Button>
                </row>
                <!-- 根据查询条件查出来的table -->
                <row >
                   <Table  :columns="columnsSlip" :data="dataSlip"></Table> 
                </row>

                <!-- 分页 -->
                <row>
                    <Page style='text-align:right;' @on-change='getChangeFen' :total="totalM" show-total  /> 
                </row>

              </Form>

        </row>
    </Modal>

  </div>
</template>
<script>
import {findOrgCusAcc,findInStock,updateInStock} from '@/api/data';//查询客户  //销售单列表查询
import {getAgent} from '@/api/cusData'//查询代理商
import {addPrepaidOrdersSell} from '@/api/data_8889'//新增销售单

import {companyTypeListAllName} from '@/libs/global_type'//公司抬头
import { EventEmitter } from 'events';

export default {
  name: 'add_sell_order',
  components: {

  },
  data() {
    return {
      dataCompany:[],
      optionsList:[],
      cusOrgItem:{},
      totalM:0, //表格分页总天数
      pagesizea:1,//默认分页第一页
      loading:false,
      columnsSlip: [
                    {
                        title:'操作',
                        key:'operate',
                        width:'80',
                        fixed:'left',
                        render:(h,params)=>{
                        return h('div',[
                          h('Button',{
                            props: {
                            type: 'primary',
                            size: 'small',
                            disabled:params.row.showa
                            },
                             attrs: {
                                 
                                },
                            style: {
                              marginRight: '5px'
                            },
                            on: {
                              click: () => {
                                params.row.showa=true
                                this.tianAdd(params.index,params.row)
                              }
                            }
                          },'添加')
                        ])
                      }
                    },
                    {
                        title: 'ID1',
                        key: 'id',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '入库单号',
                        key: 'inStockNo',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'150',
                    },
                    {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'120',
                    },
                     {
                        title: '剩余件数',
                        key: 'xuniJianshu',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '单件重',
                        key: 'weight',
                        align: 'center',
                        width:'100',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.weight,3))
                        }
                    },
                     {
                        title: '入库总重量',
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
                        title: '入库单价',
                        key: 'guapaijia',
                        align: 'center',
                        width:'200',
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
                        title: '入库总金额',
                        key: 'cusMoney',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.cusMoney,2))
                        }
                    },
                    
                    {
                        title: '入库时间',
                        key: 'createTime',
                        align: 'center',
                        width:'200'
                    },
                    
                ],
      dataSlip: [],
      addFormOne:{ //添加新的采购单
        danhao:"",
        chandi:"",
        jiaohuo:"",
        inStockNoLike:'',
        kunbaohao:"",
      },
      modal8:false,//添加资源弹窗
      tabShow:false,
      addForm: {
        totalSum: '',//总金额
        totalDijia:'',//底价总金额
        totalWeight: "",//总重量
        totalNum:'',//总件数
        totalOMoney:'',//总杂费金额

      },
      param1:{name:""},//查询店铺参数
      shopList:[],//店铺data
      showIdK:'',//保存供应商的showid
      shopO:"",
      rise:companyTypeListAllName,//公司抬头
      taiT:"",
      param2:{shortName:""},//查寻代理商接口
      daiLi:[],//代理商data
      dai:'',
      columnsOne: [ //合同明细中的表格
                    {
                        title: '序号',
                        key: 'steelName',
                        width:'60',
                        fixed:'left',
                        render: (h, params) => {
                            return h('span', params.index+1);
                        }
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        width:'100',
                    },
                    {
                        title: '类别',
                        key: 'steelType',
                        width:'100',
                    },
                    {
                        title: '品名',
                        width:'100',
                        key: 'steelName',
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        width:'100',
                    },
                    {
                        title: '牌号',
                        key: 'steelPaihao',
                        width:'100',
                    },
                     {
                        title: '产地/品牌',
                        key: 'steelPinpai',
                        width:'100',
                    
                    },
                    {
                        title: '交货地',
                        key: 'jiaohuodi',
                        width:'100',
                        
                    },
                    {
                        title: '仓库',
                        key: 'steelWorks',
                        width:'100',
                       
                    },
                    {
                        title: '计重方式',
                        key: 'jizhongType',
                        width:'100',
                       
                    },
                    {
                        title: '件数',
                        key: 'jianshu',
                        width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('InputNumber',{
                                    props:{
                                      value:Number(params.row.jianshu),
                                      max:Number(params.row.jianshu),
                                        min:1
                                    },
                                   on:{
                                  'on-change':(event)=>{
                                    this.dataOne[params.index].jianshu=event
                                     //计算单件重
                                   let a_weight = this.dataOne[params.index].zongzhongliang;
                                   let a_jianshu = this.dataOne[params.index].jianshu;
                                   this.dataOne[params.index].weight=this.$global.accPrecision(this.$global.accDiv(a_weight,a_jianshu),3)
                              }
                            }
                        },)
                            ])
                        }
                       
                    },
                    
                    {
                        title: '总重',
                        width:'100',
                        key: 'zongzhongliang',
                        render:(h,params)=>{
                            return h('div',[
                                 h('Input',{
                                    props:{
                                        type:'text',
                                        value:this.$global.accPrecision(params.row.zongzhongliang,3)
                                    },
                                    style:{
                                      
                                   },
                                   on:{
                                  'on-blur':(event)=>{
                                    console.log(event.target.value)
                                    this.dataOne[params.index].zongzhongliang=event.target.value

                                     //计算单件重
                                   let a_weight = this.dataOne[params.index].zongzhongliang;
                                   let a_jianshu = this.dataOne[params.index].jianshu;
                                   this.dataOne[params.index].weight=this.$global.accPrecision(this.$global.accDiv(a_weight,a_jianshu),3)
                              }
                            }
                        },)
                            ])
                        }   
                    },
                      {
                        title: '单件重',
                        key: 'weight',
                        width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },this.$global.accPrecision(params.row.weight,3)),
                            ])
                        }
                       
                        
                    },
                    {
                        title: '销售单价',
                        key: 'guapaijia',
                        width:'120',
                        render:(h,params)=>{
                            return h('div',[
                                 h('Input',{
                                    props:{
                                        type:'text',
                                        value:this.$global.accPrecision(params.row.guapaijia,2)
                                    },
                                    style:{
                                      
                                   },
                                   on:{
                                  'on-blur':(event)=>{
                                    console.log(event.target.value)
                                    this.dataOne[params.index].guapaijia=event.target.value
                                    this.dataOne=this.dataOne
                              }
                            }
                        },)
                            ])
                        } 
                       
                    },
                  
                    {
                        title: '销售总额',
                        key: 'moneyAll',
                        width:'120',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.moneyAll,2))
                        }
                    },
                    {
                      key:'o1Name',
                      title:'杂费1名称',
                      width:'100',
                      render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o1Name,
                            
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o1Name=event.target.value
                              }
                            }

                          })
                        }
                     
                    },
                     {
                      key:'o1Money',
                      title:'杂费1金额',
                      width:'100',
                     render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o1Money,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o1Money=event.target.value
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
                                 this.dataOne[params.index].o1OrgName  = event.label
                                 this.dataOne[params.index].o1OrgId = event.value
                                 
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
                      key:'o1OrgName',
                      title:'杂费1公司名称',
                      width:'100',
                      render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    style:{
                                   },
                                   },params.row.o1OrgName),
                            ])
                        }
                    },
                     {
                      key:'o1OrgId',
                      title:'杂费1公司id',
                      width:'100',
                      render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o1OrgId),
                            ])
                        }
                     
                    },
                     {
                      key:'o2Name',
                      title:'杂费2名称',
                      width:'100',
                      render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o2Name,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o2Name=event.target.value
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'o2Money',
                      title:'2金额',
                      width:'100',
                      render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o2Money,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o2Money=event.target.value
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
                                 this.dataOne[params.index].o2OrgName   = event.label
                                 this.dataOne[params.index].o2OrgId = event.value

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
                      key:'o2OrgName',
                      title:'杂费公司名称2',
                      width:'100',
                      render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o2OrgName),
                            ])
                        }
                     
                    },
                     {
                      key:'o2OrgId',
                      title:'杂费公司2id',
                      width:'100',
                      render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o2OrgId),
                            ])
                        }
                     
                    },
                     {
                      key:'o3Name',
                      title:'杂费3名称',
                      width:'100',
                      render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o3Name,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o3Name=event.target.value
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'o3Money',
                      title:'公司3金额',
                       width:'100',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o3Money,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o3Money=event.target.value
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
                                 this.dataOne[params.index].o3OrgName   = event.label
                                 this.dataOne[params.index].o3OrgId = event.value

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
                      key:'o3OrgName',
                      title:'公司名称3',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o3OrgName),
                            ])
                        }
                     
                    },
                     {
                      key:'o3OrgId',
                      title:'公司3id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o3OrgId),
                            ])
                        }
                     
                    },
                    // 1
                             {
                      key:'o4Name',
                      title:'杂费4名称',
                      width:'100',
                      render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o4Name,
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o4Name=event.target.value
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'o4Money',
                      title:'杂费4金额',
                       width:'100',
                       render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o4Money,
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o4Money=event.target.value
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
                                  this.dataOne[params.index].o4OrgName  = event.label
                                  this.dataOne[params.index].o4OrgId = event.value

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
                      key:'o4OrgName',
                      title:'公司4名称',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o4OrgName),
                            ])
                        }
                     
                    },
                     {
                      key:'o4OrgId',
                      title:'公司4id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o4OrgId),
                            ])
                        }
                     
                    },
                    // 5
                             {
                      key:'o5Name',
                      title:'杂费5名称',
                       width:'100',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o5Name,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o5Name=event.target.value
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'o5Money',
                      title:'杂费5金额',
                       width:'100',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o5Money,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o5Money=event.target.value
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
                                  this.dataOne[params.index].o5OrgName=event.label
                                  this.dataOne[params.index].o5OrgId=event.value

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
                      key:'o5OrgName',
                      title:'公司5名称',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o5OrgName),
                            ])
                        }
                     
                    },
                     {
                      key:'o5OrgId',
                      title:'公司5id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o5OrgId),
                            ])
                        }
                     
                    },
                    // 6
                             {
                      key:'o6Name',
                      title:'杂费6名称',
                       width:'100',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o6Name,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o6Name=event.target.value
                              }
                            }

                          })
                        } 
                     
                    },
                     {
                      key:'o6Money',
                      title:'杂费6金额',
                       width:'100',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.o6Money,
                             
                              type:'text',
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataOne[params.index].o6Money=event.target.value
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
                                  this.dataOne[params.index].o6OrgName=event.label
                                  this.dataOne[params.index].o6OrgId=event.value
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
                      key:'o6OrgName',
                      title:'公司6id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o6OrgName),
                            ])
                        }
                     
                    },
                     {
                      key:'o6OrgId',
                      title:'公司6id',
                       width:'100',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },params.row.o6OrgId),
                            ])
                        }
                    },
                     {
                      key:'operate',
                      title:'操作',
                      width:"100",
                      fixed:'right',
                      render:(h,params)=>{
                        return h('div',[
                          h('Button',{
                            props: {
                            type: 'primary',
                            size: 'small'
                            },
                            style: {
                              marginRight: '5px'
                            },
                            on: {
                              click: () => {
                                this.remove(params.index,params.row)
                              }
                            }
                          },'删除')
                        ])

                      }},
                    ],
      dataOne:[],
      agentId: "",// 代理商id
      agentShortName: "",//代理商名称
      bankJgId: "",//本公司抬头类型，1上海闽航，2福建亿钢
      businessType: "1",//写死
      buyType: "1",//写死
      createCname: "",//登录人的名称
      createEname: "",//登录人的英文名称
      //cus的信息根据 bankJgId的类型来区分填写
      customerId: "",//bankJgId = 1,写死1，bankJgId = 2,写死2
      customerName: "",//bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
      customerOrgId: "",//bankJgId = 1,写死"1"bankJgId = 2,写死2
      customerOrgName: "",//bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
      customerPhone: "",//传空
      merMoneyAll: "0",//卖家总金额
      moneyAll: "0",//买家总金额
      orderType: "1",//订单类型,写1
      payType: "1",//写死
      pid: "0",//写死
      shopId: "",//供应商店铺id
      shopName: "",//供应商店铺名称
      shopOrgId: "",//供应商店铺公司id
      shopOrgName: "",//供应商店铺公司名称
      shopUserId: "",//供应商店铺所属管理员id
      staus: "1",//状态 写1
      userId: "",// 管理员id，登录人员的id
      zhouqijiesuanStatus: "0",//写死0
      zongjianshu: "",//总件数
      zongzhongliang: "",//总重量
      param14:{},//提交后台数据进行过滤
      dataThree:[],//数组
      updateImgUrl: this.$global.updateImgUrl, //上传图片
      visible: false,
      defaultList: [],
      uploadList: [],
      imgString:"",//图片的参数
    }
  },
  methods: {
     //获取公司名字
         getComPany(){
             let param={};
              
             findOrgCusAcc(param).then(res=>{
        
                  this.dataCompany=res.data.list            
            })
         },
       //查询公司
       getOrg(name){
         console.log(name);
         let p  ={}
         p.orgName = name;
         p.pageSize = '99999';
         this.loading = true
          findOrgCusAcc(p).then(res=>{
            this.loading = false;

            if(res.code =="100"){
              console.log(name+'请求成功')
             this.optionsList=res.data.list
            }  
         })
       },
       //查询代理商 getAgent
       getDai(param){
          getAgent(param).then(res=>{
            if(res.code =="100"){
             this.daiLi=res.data.list;
          }  
         })
       },
       //获取代理商的值
       getChange(item){
         console.log(item)
         this.agentId = item.value;
         this.agentShortName = item.label;

       },
       //公司抬头的值
       getTai(e){
         console.log('公司抬头的值')
          console.log(e)
          if(e.value=='1'){
                  this.bankJgId    = '1'
                  this.shopId      = this.$global.ourFJOrgItem.shopId;
                  this.shopName    = this.$global.ourFJOrgItem.shopName
                  this.shopOrgId   = this.$global.ourFJOrgItem.orgId;
                  this.shopOrgName = this.$global.ourFJOrgItem.orgName;
                  this.shopUserId  = this.$global.ourFJOrgItem.shopUserId;

            }else if(e.value=='2'){
                  this.bankJgId='2';
                  this.shopId      = this.$global.ourSHOrgItem.shopId;
                  this.shopName    = this.$global.ourSHOrgItem.shopName
                  this.shopOrgId   = this.$global.ourSHOrgItem.orgId;
                  this.shopOrgName = this.$global.ourSHOrgItem.orgName;
                  this.shopUserId  = this.$global.ourSHOrgItem.shopUserId;
          }
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
       },
       //table表格删除
       remove(index,row){
         console.log(row.shopSteelId);
           this.dataOne.splice(index,1)

       },
       //上传图片
       handleView(name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove(file) {
                this.uploadList.splice(this.uploadList.indexOf(file), 1);
            },
            handleSuccess(res, file) {
                this.$Message.success('上传成功');
                console.log("上传成功");
                file.name = res.msg;
                file.url = this.$global.ossUrl + res.msg;
                console.log(file);
                this.uploadList.push(file);
                console.log('我是上传的图片')
                const reg=/,$/gi;//此处是正则

                this.uploadList.map((item)=>{
                  console.log(this.imgString.length+'我是打印的长度')
                     this.imgString += item.url+','    
                })
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确 ',
                    desc: '文件 ' + file.name + '格式不正确，请选择 jpg 或者 png.'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超过文件大小限制',
                    desc: '文件  ' + file.name + ' 太大，最大不超过20M'
                });
            },
            handleBeforeUpload() {
                console.log("验证最大上传张数")
                console.log(this.uploadList.length)

                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最大支持上传5张图片'
                    });
                }else{
                    console.log("大大大")
                }
                return check;
            },
       //添加订单提交
       reloadData(){
         this.dataThree = [];
         this.dataOne.map((item)=>{
           console.log(item.weightAll);
           let dic = {};
                        dic.inStockId           =item.id;
                        dic.agentId            = this.agentId
                        dic.agentName          = this.agentShortName
                        
                        dic.bankJgId           = this.bankJgId
                        dic.businessType       = '1'
                        dic.buyType            = '1'

                        dic.createEname        = this.$global.adminInfo.ename
                        dic.createCname        = this.$global.adminInfo.cname

                        dic.cusMoney           = item.moneyAll//买家总价格
                        dic.merMoney           = item.moneyAll//底价总额

                        //买家信息
                        dic.customerId         = this.customerId
                        dic.customerName       = this.customerName;
                        dic.customerOrgId      = this.customerOrgId
                        dic.customerOrgName    = this.customerOrgName;
                        dic.customerPhone      = this.customerPhone

                        dic.dijia              = item.guapaijia
                        dic.guapaijia          = item.guapaijia

                        dic.invoiceApplyMoney  = "0"
                        dic.invoiceApplyWeight = "0"
                        
                        dic.jianshu            = item.jianshu
                        dic.xuniJianshu        = item.jianshu

                        dic.jiaohuodi          = item.jiaohuodi
                        dic.jizhongType        = item.jizhongType
                        dic.kunbaohao          = item.kunbaohao

                        dic.ordersType         = "1"
                        dic.payType            = '1'

                        dic.shopId             = this.shopId
                        dic.shopName           = this.shopName
                        dic.shopOrgId          = this.shopOrgId;
                        dic.shopOrgName        = this.shopOrgName;
                        dic.shopUserId         = this.shopUserId;

                        dic.shopSteelId        = ''; 

                        
                        dic.steelGuige         = item.steelGuige
                        dic.steelName          = item.steelName
                        dic.steelPaihao        = item.steelPaihao
                        dic.steelPinpai        = item.steelPinpai
                        dic.steelWorks         = item.steelWorks
                        dic.steelType          = item.steelType//类别

                        dic.userId             = this.$global.adminInfo.id

                        dic.weight             =item.weight //单件重
                        dic.zongzhonglia       = item.zongzhongliang//总重量
                        //下面是新增的字段
                        dic.jiesuanMoney       = item.moneyAll
                        dic.jiesuanWeight      = item.zongzhongliang

                           //下面是杂费的字段
                        dic.om1Name             = item.o1Name        
                        dic.om1Money            = item.o1Money
                        dic.om1OrgId            = item.o1OrgId
                        dic.om1OrgName          = item.o1OrgName

                        dic.om2Name             = item.o2Name        
                        dic.om2Money            = item.o2Money
                        dic.om2OrgId            = item.o2OrgId
                        dic.om2OrgName          = item.o2OrgName

                        dic.om3Name             = item.o3Name        
                        dic.om3Money            = item.o3Money
                        dic.om3OrgId            = item.o3OrgId
                        dic.om3OrgName          = item.o3OrgName

                        dic.om4Name             = item.o4Name        
                        dic.om4Money            = item.o4Money
                        dic.om4OrgId            = item.o4OrgId
                        dic.om4OrgName          = item.o4OrgName

                        dic.om5Name             = item.o5Name        
                        dic.om5Money            = item.o5Money
                        dic.om5OrgId            = item.o5OrgId
                        dic.om5OrgName          = item.o5OrgName

                        dic.om6Name             = item.o6Name        
                        dic.om6Money            = item.o6Money
                        dic.om6OrgId            = item.o6OrgId
                        dic.om6OrgName          = item.o6OrgName
                        this.dataThree.push(dic)
                  })
       },
       getAdd(){ 
       console.log(this.dataOne)
       this.reloadData();
         const param                = {};
               param.agentId        = this.agentId;
               param.agentShortName = this.agentShortName,            //代理商名称
               param.bankJgId       = this.bankJgId,                  //本公司抬头类型，1上海闽航，2福建亿钢
               param.businessType   = '1',                            //写死
               param.buyType        = "1",                            //写死
               param.createCname    = this.$global.adminInfo.cname,   //登录人的名称
               param.createEname    = this.$global.adminInfo.ename,   //登录人的英文名称
         //cus的信息根据 bankJgId的类型来区分填写
         param.customerId          = this.customerId,            //bankJgId = 1,写死1，bankJgId = 2,写死2
         param.customerName        = this.customerName,          //bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
         param.customerOrgId       = this.customerOrgId,         //bankJgId = 1,写死"1"bankJgId = 2,写死2
         param.customerOrgName     = this.customerOrgName,       //bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
         param.customerPhone       = "",                         //传空
         //买家信息结束
         param.merMoneyAll         = this.addForm.totalDijia,                        //卖家总金额 TODO:
         param.moneyAll            = this.addForm.totalSum,                        //买家总金额
         
         param.orderType           = "1",                        //订单类型,写1
         param.payType             = "1",                        //写死
         param.pid                 = "0",                        //写死
         //店铺信息
         param.shopId              = this.shopId,                //供应商店铺id
         param.shopName            = this.shopName,              //供应商店铺名称
         param.shopOrgId           = this.shopOrgId,             //供应商店铺公司id
         param.shopOrgName         = this.shopOrgName,           //供应商店铺公司名称
         param.shopUserId          = this.shopUserId,            //供应商店铺所属管理员id
         
         param.staus               = "1",                        //状态 写1
         param.userId              = this.$global.adminInfo.id,                // 管理员id，登录人员的id
         param.zhouqijiesuanStatus = "0",                        //写死0
         param.zongjianshu         = this.addForm.totalNum,      //总件数
         param.zongzhongliang      = this.addForm.totalWeight,   //总重量
         param.pictures            = this.imgString              //上传的图片
    
          //明细信息
         param.orderInfoList       = this.dataThree
         console.log(param)
          addPrepaidOrdersSell(param).then(res=>{//TODO:
              if(res.code =="100"){
                console.log(res)
                 this.$Notice.success({
                            title:'添加成功',
                    })
                    this.updateInstock();
            }  
          })
       },
       updateInstock(){//提交成功后修改库存件数
                let p     = {};
                let plist = [];
      this.dataOne.map(item=>{
          let dic             = {};
              dic.id          = item.id
              dic.xuniJianshu = item.jianshu
          plist.push(dic); 
      })
      p.pageOrderInfoList = plist
        updateInStock(p).then(res =>{
           if(res.code =='100'){
               this.$Notice.success({
                   title:'修改库存成功',
                    duration:2,
                    onClose:res =>{
                      // this.reload();
                 }
               })
           }else{
               this.$Notice.error({
                   title:'修改库存失败'
               })
           }
        })
       },
       //添加到销售单
       tianAdd(index,row){
           this.tabShow=true;
           this.dataOne.push(row)
             
           //this.dataSlip[index].showa=true;
           //this.dataSlip=this.dataSlip
           console.log(this.dataSlip[index])
       },
       //销售单列表
        searchM(){
        //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum     = this.pagesizea      //分页
         param.inStockNoLike = this.addFormOne.inStockNoLike;//入库号
         param.kunbaohao = this.addFormOne.kunbaohao;//捆包号
         param.xuniJianshuBig0 = 0;

         findInStock(param).then(res=>{
            if(res.code =="100"){
                console.log(res)
                let showA=false;
                res.data.list.map((item)=>{
                      item.showa=showA
                      item.o1Name    = ""
                      item.o1Money   = ""
                      item.o1OrgId   = ""
                      item.o1OrgName = ""
                      item.o2Name    = ""
                      item.o2Money   = ""
                      item.o2OrgId   = ""
                      item.o2OrgName = ""
                      item.o3Name    = ""
                      item.o3Money   = ""
                      item.o3OrgId   = ""
                      item.o3OrgName = ""
                      item.o4Name    = ""
                      item.o4Money   = ""
                      item.o4OrgId   = ""
                      item.o4OrgName = ""
                      item.o5Name    = ""
                      item.o5Money   = ""
                      item.o5OrgId   = ""
                      item.o5OrgName = ""
                      item.o6Name    = ""
                      item.o6Money   = ""
                      item.o6OrgId   = ""
                      item.o6OrgName = ""
                  })
                this.dataSlip=res.data.list;//table表格
                
                this.totalM=res.data.total;//分页条数
          }  
         })  
       },
       //点击查询销售单
       getCha(){
           this.searchM();
       },
       //table分页
       getChangeFen(page){
           console.log(page)
           this.pagesizea =page;
           this.searchM();
       }

  

   
  
 
  },
  //totalSum
   computed:{ //计算总金额和总重量
        total(){
            let total      = 0;
            let tolWeight  = 0;
            let totJianshu = 0;
            let totalDijia = 0;
            let caiTol=0; //添加采购单的总价
            let totalOM = 0;//杂费总金额
           
            this.dataOne.map((item) => {
              //重新计算 moneyAll，必须先计算，否则后续计算总值错误
              caiTol=Number(item.zongzhongliang)*Number(item.guapaijia)
              item.moneyAll=caiTol

              total      += Number(item.moneyAll)
              console.log(item.moneyAll);
              totalDijia += Number(item.moneyAll);
              tolWeight  += Number(item.zongzhongliang)
              totJianshu += Number(item.jianshu)
              totalOM += Number(item.o1Money) + Number(item.o2Money) + Number(item.o3Money)+ Number(item.o4Money)+ Number(item.o5Money)+ Number(item.o6Money)
              
            })
            this.addForm.totalSum    = total
            this.addForm.totalDijia  = totalDijia
            this.addForm.totalWeight = this.$global.accPrecision(tolWeight,3)
            this.addForm.totalNum    = totJianshu
            this.addForm.totalOMoney = totalOM 
            
            console.log("计算成功")

            return  this.addForm.totalSum, this.addForm.totalWeight
        }
    },
  mounted() {
    this.searchM();//查询接口table
    this.getComPany();//获取公司名称
    // this.total;
    console.log(this.$global.baseUrl)
    // this.getShop(this.param1);//查询店铺
    this.getDai(this.param2);//查询代理商
  },
  watch: {
    
  }
}
</script>
<style <style lang="less">
.buy_m {
  display: flex;
  background: #ffffff;
  .clo_span {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 8px;
  }
}
 .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
        margin-top: 20px;
    }
    
    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }
    
    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }
    
    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }
    
    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

