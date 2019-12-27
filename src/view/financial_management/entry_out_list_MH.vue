<!--
 * @Description:销项票开票申请列表 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-18 10:09:16
 -->

<template>
     <div>
         <row>
             <h2 style='font-weight:400;'>进项票绑定列表(上海闽航)</h2>
         </row>
         <!-- 开票列表 -->
         <row style='margin-bottom:20px;padding-top:10px;background-color: #fbfbfb;-webkit-box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);-moz-box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);padding: 12px;'>
             <Form :label-width="120" inline :model="addForm">
                 <row>
                         <!-- 销售方名称
                        <FormItem label='销售方名称'>
                            <Select @on-change='getXiao' style='width:200px'
                               
                                v-model="model14"
                                filterable
                                remote
                                :remote-method="remoteMethod2"
                                :loading="loading2">
                                <Option v-for="(option, index) in options2" :value="option.value" :key="index">{{option.label}}</Option>
                            </Select>
                        </FormItem> -->

                        <!--供应商名称 -->
                        <FormItem label='供应商名称'>
                            <Select  @on-change='getCai' style='width:200px'
                               :label-in-value='true'
                                v-model="caigou"
                                filterable
                                remote
                                clearable
                                :remote-method="remoteMethod3"
                                :loading="loading3">
                                <Option v-for="(option, index) in caigouData" :value="option.orgid" :key="index">{{option.cusorgName}}</Option>
                            </Select>
                        </FormItem>
                        <!-- 每页显示个数 -->
                        <FormItem label="每页显示个数:">
                          <Select @on-change='getPage' v-model="addForm.pageNum" style="width:200px" >
                              <Option  :value="item.value" v-for='(item,index) in everyPage' :key='index'>{{item.value}}</Option>
                          </Select>
                        </FormItem>
                        <!-- 金乡绑定状态 -->
                         <FormItem label="进项绑定状态">
                          <Select @on-change='getStatus' v-model="addForm.jinStatus" style="width:200px" >
                              <Option value="0">待绑定</Option>
                              <Option value="1">绑定完成</Option>
                          </Select>
                        </FormItem>
                 <!-- 订单号 规格 销售票绑定状态 -->
                     <FormItem label="订单号:" prop="dingdanhao">
                      <i-input clearable   style="width:200px" v-model="addForm.dingdanhao" placeholder="请输入订单号"/>
                     </FormItem>

                     <FormItem label="规格:" prop="guige">
                      <i-input  clearable  style="width:200px" v-model="addForm.guige" placeholder="请输入订规格"/>
                     </FormItem>
                        <FormItem label='管理员'>
                            <Select clearable style='width:200px' filterable v-model="guanli" filterable :label-in-value='true' @on-change='getUserone'>
                                <Option v-for="(option, index) in options4" :value="JSON.stringify(option)" :key="index">{{option.cname}}</Option>
                            </Select>
                        </FormItem>
                          
                 <!-- 管理员  品名 订单本公司抬头 -->
                      <FormItem label="品名:" prop="pinming">
                        <i-input clearable   style="width:200px" v-model="addForm.pinming" placeholder="请输入订品名"/>
                      </FormItem>
 
                  <!-- 代理商名称  进项票号码  销售票号码 -->
                     <FormItem label='代理商名称'>
                            <Select @on-change='getDaili' style='width:200px'
                                clearable
                                v-model="dailiShang"
                                filterable
                                remote
                                clearable
                                :remote-method="remoteMethod5"
                                :loading="loading5">
                                <Option v-for="(option, index) in options5" :value="option.value" :key="index">{{option.value}}</Option>
                            </Select>
                     </FormItem>

                     <FormItem label="进项票号码:" prop="jinhao">
                        <i-input  clearable  style="width:200px" v-model="addForm.jinhao" placeholder="请输入进项票号码"/>
                     </FormItem> 
                     <FormItem label="公司抬头:">
                      <Select clearable v-model="addForm.bankJgId"  style="width:200px"  placeholder="请选择"   >
                        <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                     <FormItem label='下单时间'>
                        <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="addForm.dateTime" type="daterange"  placement="bottom-end" placeholder="选择日期" style="width: 200px">
                        </DatePicker>
                      </FormItem>
                       <FormItem label="工程名称:" style="margin-right:10px;">
                          <el-select  size="small" v-model="addForm.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                          <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-option>
                          </el-select>
                        </FormItem>
                  </row>

                  <!-- 查询  刷新 -->
                  <row style='text-align:right;'>
                    <Button type="primary" icon="ios-search" @click='getSearch'>查询</Button>
                    <Button shape="circle"  icon="md-refresh" @click="reloadSelf()"></Button>
                  </row>


              </Form>
         </row>
         
         <!-- 重量合计  金额合计 -->
         <!-- <row class='allrow'>重量合计:<time>80.050</time>吨 &nbsp;&nbsp;金额合计:<time>325862.30</time>元</row> -->

         <!-- TABLE 表格 -->
         <row style='background-color: #fbfbfb;-webkit-box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);-moz-box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);padding: 12px;'>
             <!-- 申请总额  销项总额  总重量 -->
             <row class='row_sa'>
               <i-col>{{allMoney}}</i-col>
               <!-- <i-col span='8'>本次申请销项总金额（元）:<time>{{allMprice}}</time></i-col> -->
               <i-col span='8'>本次申请进项总金额（元）:<time>{{this.$global.isMoneyShow(allMprice)}}</time></i-col>
               <i-col span='8'>本次申请总重量（吨）:<time>{{this.$global.accPrecision(allWightp,3)}}</time></i-col>  
             </row>
             <!-- 下载excel 下载开票excel  打印列表区域  绑定新进项票  绑定新销项票  撤销申请 -->
             <row class='buton_all'>
               <Button type="primary" @click="exportData(1)" style='display:none'>下载excel</Button>
               <Button type="primary" @click="exportData(3)" style='display:none'>下载开票excel</Button>
              
               <!-- <Button type="primary" @click="modal1 = true">绑定新进项票</Button> -->
               <Button :disabled="addBtnUsed" type="primary" @click='modal2 = true'>绑定新进项票</Button>

               <Button type="primary" @click='modal3 = true' style='display:none'>撤销申请</Button>
             </row>
             <!-- TBALE 表格 -->
             <row>
                <Table size="small" border ref="table"   @on-selection-change='getTable'   style='margin-bottom:10px;' :columns="columnsAll" :data="dataAll"></Table>
                <Page @on-change="changePage" :page-size="page_size" :total="totalPage" show-total />
             </row>
             


         </row>

         <!-- 新进项票弹窗 -->
         <!-- <Modal v-model="modal1" title="新增进项票弹窗"  @on-ok="ok"  @on-cancel="cancel">
          <row>
            <Form :label-width="180"  :model="addFormOne">
                      <FormItem label="发票号码:" prop="fapiaohao">
                        <i-input   style="width:200px" v-model="addFormOne.fapiaohao" placeholder="请输入订单号"/>
                      </FormItem>

                      <FormItem label='公司名称'>
                            <Select style='width:200px' :placeholder="conmpanyOne" v-model="conmpanyOne" filterable :label-in-value='true' @on-change='getUserone'>
                                <Option v-for="(option, index) in options4" :value="JSON.stringify(option)" :key="index">{{option.cname}}</Option>
                            </Select>

          
                        </FormItem>

                      <FormItem label="发票总重量(吨):" prop="faWeight">
                        <i-input   style="width:200px" v-model="addFormOne.faWeight" placeholder=""/>
                      </FormItem>

                      <FormItem label="发票总金额(元):" prop="faMoney">
                        <i-input   style="width:200px" v-model="addFormOne.faMoney" placeholder=""/>
                      </FormItem>

                      <FormItem label="发票不含税金额(元):" prop="faMoneyOne">
                        <i-input   style="width:200px" v-model="addFormOne.faMoneyOne" placeholder=""/>
                      </FormItem>


                      <FormItem label="发票税额(元):" prop="faShui">
                        <i-input   style="width:200px" v-model="addFormOne.faShui" placeholder=""/>
                      </FormItem>

                      <FormItem label="绑定时间:" prop="bangTime">
                        <i-input   style="width:200px" v-model="addFormOne.bangTime" placeholder=""/>
                      </FormItem>

            </Form>
              

          </row>
       
         </Modal> -->
         <!-- 绑定新销项票 -->
        <Modal v-model="modal2" title="新增进项票并绑定" footer-hide    @on-visible-change='getChangeStatus'>
          <row>
            <Form :label-width="120"  :model="addFormTwo">
                      <FormItem label="发票号码:" prop="fapiaohao">
                        <i-input   style="width:300px" v-model="addFormTwo.fapiaohao1" placeholder="请输入发票号码"/>
                      </FormItem>

                      <FormItem label='公司名称'>
                        <i-input disabled   style="width:300px" v-model="addFormTwo.companyName1" placeholder="请输入公司名称"/>
                            <!-- <Select style='width:200px' :placeholder="conmpanyOne" v-model="conmpanyOne" filterable :label-in-value='true' @on-change='getUserTwo'>
                                <Option v-for="(option, index) in companyZu" :value="JSON.stringify(option)" :key="index">{{option.orgName}}</Option>
                            </Select> -->
                        </FormItem>

                      <FormItem label="发票总重量(吨):" prop="faWeight">
                        <i-input   style="width:300px" v-model="addFormTwo.faWeight1" placeholder=""/>
                      </FormItem>

                      <FormItem label="发票总金额(元):" prop="faMoney">
                        <i-input   style="width:300px" v-model="addFormTwo.faMoney1" placeholder=""/>
                      </FormItem>

                      <!-- 新增发票 -->
                       <FormItem label="发票不含税金额(元):" prop="faMoneyOne">
                        <i-input   style="width:200px" v-model="addFormTwo.faMoneyOne" placeholder=""/>
                      </FormItem>


                      <FormItem label="发票税额(元):" prop="faShui">
                        <i-input   style="width:200px" v-model="addFormTwo.faShui" placeholder=""/>
                      </FormItem>


                      <FormItem label="绑定时间:" >
                        <!-- <i-input   style="width:200px" v-model="addFormTwo.bangTime1" placeholder=""/> -->
                          <i-Col span="12">
                              <DatePicker type="date" @on-change='getBang' placeholder="选择时间" style="width: 300px"></DatePicker>
                          </i-Col>
                      </FormItem>

            </Form>
              

          </row>
             <div class="margin-top-20">
                <Button  style="margin-right:10px" type="primary" @click="ok" >添加</Button>
                
                <Button  type="default" style="margin-right:10px" @click="cancel">取消</Button>
            </div>
        </Modal>


        <!-- 撤销申请的弹窗 -->
          <Modal v-model="modal3" title="撤销选项"  @on-ok="getCon"  @on-cancel="getCu">
            <p>撤销开票申请</p>
            <row style='padding-left:30px;'>
              <RadioGroup v-model="zuofei" vertical @on-change='getRadio'>
                <!-- <Radio label="zuofei">
                    <Icon type="social-apple"></Icon>
                    <span>作废</span>
                </Radio> -->
                <!-- <Radio label="hongchong">
                    <Icon type="social-android"></Icon>
                    <span style='color:red'>红冲(只买家)</span>
                </Radio>
                <Radio label="hongchongm">
                    <Icon type="social-windows"></Icon>
                    <span style='color:red'>红冲(买家和卖家)</span>
                </Radio> -->
              </RadioGroup>
            </row>
          </Modal>
        

     </div>
</template>
<script>
import {findOrgCusAcc,
getUserList,
findShop,findOrdersInfoAll,findOrderEngineering,
addOrgMoneyRecord,updateOrderStatusByInvoiceStatus,
addBillFlow,updateOrderBuyMoneyBatch,
} from '@/api/data'
import {getCheXiao} from '@/api/data_8889'

import {lengthList,belongCompanyList} from '@/libs/global_type'
import {findAgent} from '@/api/warehouse'       //新增进项票  //绑定进项票账单 //修改订单发票信息                  //进项票列表接口
import {getBangDing,addInfoOutBridge,getAddJinPiao,getBangJinPiao,getXiuGaiOrder,updateTordersInfoStatus,getJinPiao} from '@/api/cusData'
import { join } from 'path';
import { fail } from 'assert';
import {invoiceSatusStr} from '@/libs/allStatus'

export default {
  name: 'entry_out_list_MH',
  inject:['reload'],  //調用組建app.vue
  data () {
    return {
      addBtnUsed:true,
      engineerNameList:[],
         zuofei:'zuofei',
         pageNumG:1,//分页的数据
         belongCompanyListThis:belongCompanyList,
         addForm:{
           pageNum:10,//每页显示个数
           jinStatus:"0",//进项绑定状态
           dingdanhao:"",//订单号
           guige:"",//规格
           xiaoshouStatus:"1",//销售票绑定状态
           pinming:"",//品名
           dingtitle:"",//订单本公司抬头
           jinhao:"",//进项票号码
           xiaohao:'',//销项票号码
           bankJgId:"",
           dateTime:'',
           beginTime:'',
           endTime:'',
           engineering:""
         },
         model14:'',//销售方名称
         paramSale:{},//销售方名称
         loading2: false,
         saleMing:[],
         options2:[],
         saleOne:[],
         page_size:10,
         caigou:'',
         loading3:false,
         options3:[],//采购方
         caigouData:[],
         caigouOne:[],
         paramCaiGou:{},//采购列表
         everyPage:lengthList,

         guanli:"",//管理员
         loading4:false,
         paramGuanli:{
           pageNum:"",
           cname:"",
           status:"1"

         },
         guanData:[],
         guanOne:[],
         options4:[],

         dailiShang:"",//代理商名称
         loading5:false,
         options5:[],
         paramDaili:{},
         daiData:[],
         daiOne:[],
         paramFirst:{},//查询参数对像

         columnsAll: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                     {
                        title: 'ID',
                        key: 'id',
                        width:'60'
                    },
                    {
                        title: '工程名称',
                        key: 'gongcheng',
                        width:'150'
                    },
                    {
                        title: '下单时间',
                        key: 'createTime',
                        width:'70',
                        render:(h,params) =>{
                          return h('div',{
                          },params.row.createTime.substr(0,10));
                        }
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        width:'80'
                    },
                     {
                        title: '材质',
                        key: 'steelPaihao',
                        width:'80'
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        width:'80'
                    },
                    
                    {
                        title: '采购单价',
                        key: 'guapaijia',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.guapaijia,2));
                        }
                    },
                    {
                        title: '实提单价',
                        key: 'jiesuanDanjia',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.jiesuanDanjia,2));
                        }
                    },
                    {
                        title: '实提重量',
                        key: 'jiesuanWeight',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.jiesuanWeight,3));
                        }
                    },
                     {
                        title: '实提金额',
                        key: 'jiesuanMoney',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.jiesuanMoney));
                        }
                    },
                     {
                        title: '销售方',
                        key: 'shopOrgName',
                        width:'180'
                    },
                     {
                        title: '采购方',
                        key: 'customerOrgName',
                        width:'80',
                        render:(h,params) =>{
                          return h('div',{
                          },params.row.customerOrgName.substr(0,5));
                        }
                    },
                    {
                        title: '订单号',
                        key: 'orderNo',
                        width:'180'
                    },
                     {
                        title: '发票绑定状态',
                        key: 'invoiceStatus',
                        width:'80',
                          render:(h,params)=>{
                          return h('div',{
                          },invoiceSatusStr(params.row.invoiceStatus))
                        }
                    },
                     {
                        title: '管理员',
                        key: 'createCname',
                        width:'80'
                    },
                ],
         dataAll: [
                ],
         selectData:[],//选中的数组
         modal1: false,//控制新进项票弹窗
         addFormOne:{
           fapiaohao:"",//发票号码
           faWeight:"",//发票总重量
           faMoney:"",//发票总金额
           bangTime:"",//绑定时间
         },//进项表单
         conmpanyOne:"",//公司名称1
         companyTwo:"",//公司名改成2
         modal2:false,//绑定新销项票
         addFormTwo:{
           fapiaohao1:"",//发票号码
           faWeight1:"",//发票总重量
           faMoney1:"",//发票总金额
           bangTime1:"",//绑定时间
           companyName1:"",//公司名称
           faMoneyOne:"",//发票不含税金额
           faShui:"",//发票税额
           cusId:'',//公司cusid
           cusOrgId:"",//公司orgid
           bankJgId:""
         },//进项表单

         totalPage:0,//分页总条数

         allMprice:'',//本次申请总金额
         allWightp:'',//本次申请总重量

         companyZu:[],//公司名称
         bangDing:"",//绑定时间

         modal3:false,//撤销申请的弹窗
         faPiaoBu:'',//发票不含税
         shuiE:"",//税额
    
    }
  },
  methods: {
    updateOrderInvoiceMoney(){//发票绑定后更新主订单的 开票金额，开票重量
        let selectOrderList     = [];
        let p                   = {};
            p.pageOrderInfoList = [];
        this.selectData.map(item=>{
          selectOrderList.push(item.orderNo);
          let dic         = {};
              dic.orderNo = item.orderNo;
          p.pageOrderInfoList.push(dic);
        })
        p.pageOrderInfoList = this.$global.uniqueNew(p.pageOrderInfoList,'orderNo');
        updateOrderBuyMoneyBatch(p).then(res =>{
              if(res.code =='100'){
                this.$Notice.success({
                  title:'修改主订单发票信息成功',
                  duration:1,
               })
            }else{
                 this.$Notice.error({
                 title:'修改主订单发票信息失败'
                })
            }
         })

    },
      //查询工程
      getGongcheng(){
        let p  ={};
        p.pageSize ="99999"
        findOrderEngineering(p).then(res=>{
          if(res.code =="100"){
              res.data.list.map(item =>{
                if(item){
                let dic = {};
                dic.label =item.engineering;
                dic.value =item.engineering;
                this.engineerNameList.push(dic);
                }
              })
          }
        })
      },
     changeCreateTieme(data){
        this.addForm.beginTime  =data[0] +' 00:00:00';
        this.addForm.endTime  =data[1]+' 24:00:00';

      },
      //新增进项票弹窗的显示的状态展示
      getChangeStatus(item){
         if(item==true){
             if(this.selectData.length<=0){
               this.$Message.error("请勾选")
               this.modal2=false;  
             }
         }
      },
      //销售方名称
      remoteMethod2 (query) {
           if (query !== '') {
                this.loading2 = true;
                this.paramSale.orgName = query ;
                this.paramSale.pageNum = '9999' //分页
                this.paramSale.orgRoleType = "2"
                  findOrgCusAcc(this.paramSale).then(res=>{
                      if(res.code =="100"){
                      this.saleMing=res.data.list
                      this.saleMing.map((value,key,arr)=>{
                      this.saleOne.push(arr[key].cusorgName)
                        })
                      }  
                    })
                setTimeout(() => {
                      this.loading2 = false;
                      const list = this.saleOne.map(item => {
                          return {
                              value: item,
                              label: item
                            };
                });
                this.options2 = list.filter(item => item.label.indexOf(query) > -1);
                    }, 200);
                } else {
                    this.options2 = [];
            }
       },
      //采购方名称
      remoteMethod3 (query) {
           if (query !== '') {
                this.loading3 = true;
                this.paramCaiGou.orgName = query ;
                this.paramCaiGou.pageSize = '999999' //分页
                  findOrgCusAcc(this.paramCaiGou).then(res=>{
                      if(res.code =="100"){
                      this.caigouData=res.data.list
                      this.caigouData.map((value,key,arr)=>{
                      this.caigouOne.push(arr[key].cusorgName)
                        })
                      }  
                    })
                setTimeout(() => {
                      this.loading3 = false;
                      const list = this.caigouOne.map(item => {
                          return {
                              value: item,
                              label: item
                            };
                });
                this.options3 = list.filter(item => item.label.indexOf(query) > -1);
                    }, 200);
                } else {
                    this.options3 = [];
            }
       },
      //管理员名称
      //  this.paramGuanli.pageNum = '999';
      //  this.paramGuanli.cname = query;
      //  this.paramGuanli.status = "1"; 
      getUser(){
        let p ={};
        p.status = '1';
        p.pageSize ="99999"
         getUserList(p).then(res=>{
            if(res.code =="100"){
             this.options4=res.data.list
          }  
         })
       },
      //获取公司名称
      getCompany(){
          let param={};
         param.orgName='' //name
         param.pageNum='9999' //分页
         param.status = 1 ;
         findShop(param).then(res=>{
            if(res.code =="100"){
              this.companyZu=res.data.list
            
          }  
         })

       },
      //代理商名称
      remoteMethod5 (query) {
           if (query !== '') {
                this.loading5 = true;
                this.paramDaili.pageNum = '999';
                this.paramDaili.companyName = query;
                this.paramDaili.status = "1";
                  findAgent(this.paramDaili).then(res=>{
                      if(res.code =="100"){
                      this.daiData=res.data.list
                      this.daiData.map((value,key,arr)=>{
                      this.daiOne.push(arr[key].companyName)
                        })
                      }  
                    })
                setTimeout(() => {
                      this.loading5 = false;
                      const list = this.daiOne.map(item => {
                          return {
                              value: item,
                              label: item
                            };
                });
                this.options5 = list.filter(item => item.label.indexOf(query) > -1);
                    }, 200);
                } else {
                    this.options5 = [];
            }
       },
      //获取销售方名称
      getXiao(item){

       this.paramFirst.orderCustomerCompany=item
      },
      //获取采购方名称
      getCai(item){
        if(item){
          this.paramFirst.orderShopCompanyName= item.label
          this.paramFirst.orderShopOrgId= item.value
        }
      },
      //获取管理员名字
      getUserone(item){
        if(item){
        const stingR=eval('(' + item.value + ')')
        this.paramFirst.orderUserId=stingR.id  
        }
      },
      //获取公司名称
      getUserTwo(item){
        if(item){
          const stingTwo=eval('(' + item.value + ')')
          this.companyTwo=stingTwo.orgName
        }
      },
      //获取分页每页显示的个数
      getPage(item){

      this.getSearch();

      },
      //获取进项绑定状态
      getStatus(item){
      },
      //销项票绑定状态
      getXstatus(item){
      },
      //获取申请时间
      getShen(item){
        this.paramFirst.beginTime=item[0]
        this.paramFirst.endTime=item[1]
      },
      //获取进项绑定时间
      getJinTime(item){
        this.paramFirst.beginBindInTime=item[0]
        this.paramFirst.endBindInTime=item[1]
      },
      //获取销项绑定时间
      getXiaoTime(item){
        this.paramFirst.beginBindOutTime=item[0]
        this.paramFirst.endBindOutTime=item[1]
      },
      //获取代理商名字
      getDaili(item){
        if(item){
        this.paramFirst.agentShortName=item
        }
      },
      //分页查询
      changePage(index){
           this.pageNumG=index;
           this.getSearch();
       },
      //通过条件查询表格---TABLE列表展示
      getSearch(){
        let p  ={};
        // p.bankJgId='2' //默认值 上海抬头的订单
        // p.deleteStatus='1' //默认值，是否删除
        // p.invoiceApplyStatus = "1"//默认值 审核状态

        p.invoiceStatus = this.addForm.jinStatus  //进项绑定状态
       // p.statusOut = this.addForm.xiaoshouStatus//销项绑定状态
        p.pageNum    = this.pageNumG
        p.orderNo    = this.addForm.dingdanhao
        p.steelGuige = this.addForm.guige
        p.steelName  = this.addForm.pinming
        p.noIn       = this.addForm.jinhao
        //p.noOut=this.addForm.xiaohao
        p.shopOrgId    = this.paramFirst.orderShopOrgId  //供应商公司id
        p.pageSize     = this.addForm.pageNum
        this.page_size = this.addForm.pageNum
      // this.pageSize = this.addForm.pageNum
       //状态筛选
       p.beginStatus   = "8"
       p.endStatus     = "10"
       p.bankJgId      = this.addForm.bankJgId;
       p.userId        = this.paramFirst.orderUserId;
       p.beginTime     = this.addForm.beginTime        //创建时间 
       p.endTime       = this.addForm.endTime          //截止时间
       p.gongcheng     = this.addForm.engineering;
        findOrdersInfoAll(p).then(res=>{
            if(res.code =="100"){
               this.dataAll=res.data.list
               this.totalPage = res.data.total
               this.conmpanyOne=res.data.list[0].orderShopName 
          } 
          else{
            this.dataAll = [];
            this.$Message.warning("当前无数据")
          } 
         })
      },
      //table选中事件
      getTable(selection,row){
        console.log("全选判定")
        console.log(selection);
        //先数组根据店铺名称去重，去重后数组还有2个以上则不能提交
        let result = [];
        let obj = {};
        //数组对象去重
        selection.map((item,index)=>{
          if(!obj[item.shopOrgName]){
            result.push(item);
            obj[item.shopOrgName] = true;
          }
        })
        //数组对象去重结束
        if(selection.length == 0){//未勾选数据不可提交
          this.addBtnUsed = true;//true 不可点击 false  可以点击
          return false;
        }
        this.selectData=selection
        let a = this.selectData[0].shopOrgName;
        this.addFormTwo.companyName1 = a;
        this.addFormTwo.cusId = this.selectData[0].shopOrgId;
        this.addFormTwo.bankJgId = this.selectData[0].bankJgId

        if(result.length>1){
            this.$Message.warning("销售名称不同不可绑定")
            this.addBtnUsed = true;
            return false;
        }else{
          this.addBtnUsed =false;
        }

      },
      //绑定时间
      getBang(item){
         this.bangDing=item
      },
      //确定绑定新进项票
      //步骤1添加新的进项票
      //步骤2：记录进项票和订单绑定信息
      //步骤3 修改订单状态
      ok(){//TODO: 步骤1添加新的进项票
        
        let param1={};
       
        param1.invoiceNo        = this.addFormTwo.fapiaohao1    //发票号码
        param1.money            = this.allMprice                //发票总金额
        param1.weight           = this.allWightp                //发票总重
        param1.status           = '1'
        param1.customerId       = this.addFormTwo.cusId         //店铺的公司的id
        param1.createUserId     = this.$global.adminInfo.id     //登录人的id
        param1.companyName      = this.addFormTwo.companyName1  //公司名字
        param1.taxLeftoverMoney = this.faPiaoBu                 //发票不含税金额
        param1.taxNoMoney       = this.shuiE                    //税额
        param1.createTime = this.bangDing +' 01:00:00'//绑定时间
        
        //新增销项票 todo1
         getAddJinPiao(param1).then(res=>{
            if(res.code =="100"){
              let msgId = res.msg;//返回的id值 
              this.okStep2(msgId);
               this.okStep3();//修改采购单明细
              this.okStep4(msgId) //步4 运行完成 才可以运行步5
              this.payOnlineBusiness(msgId);
              
            }  
         })
      },
      //新的流水添加,批量添加明细数据
            payOnlineBusiness(msgId){//合同审核线上付款
          let p                     = {};
          let plist                 = [];
          this.selectData.map(item=>{
              let dic                   = {};
              dic.billType          = '20030';  //账单类型
              dic.fsMoney           = '0';  //发生金额
              dic.ysMoney           = '0';  //应收金额
              dic.dkpMoney          =  this.$global.accMinus(0,item.jiesuanMoney);  //待开票金额

              dic.sellerEmpDept     = '';  //卖家负责人部门
              dic.sellerCompanyId   = item.shopOrgId;  //卖家公司id
              dic.sellerCompanyName = item.shopOrgName;  //卖家公司名称
              dic.sellerEmpName     = '';  //卖家负责人名称

              dic.buyerEmpDept      = '';  //买家负责人部门 本公司
              dic.buyerCompanyId    = item.customerOrgId;  //买家公司id
              dic.buyerEmpName      = this.$global.adminInfo.cname;  //买家负责人名称
              dic.buyerCompanyName  = item.customerOrgName;  //买家公司名称

              dic.orderId           = item.ordersId;  //订单id
              dic.orderNo           = item.orderNo;  //订单号

              dic.accApply          = '';  //打款申请
              dic.dkApply           = '';  //抵扣申请
              dic.txApply           = '';  //提现申请
              dic.kpApply           = msgId;  //开票申请
              dic.zxStatus          = '1';  //注销状态
              dic.note              = '开票账单';  //备注
              dic.status            = '1';  //可用状态
              dic.transactionType   = '2';  //交易账单类型（买家账单，卖家账单）
              plist.push(dic);
          })
          
            p.billFlowList = plist;
          addBillFlow(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'添加电商流水成功',
                    onClose:res =>{
                    }
                 })
              }else{
                   this.$Notice.error({
                   title:'添加电商流水失败'
                  })
              }
           })
       },
      //步骤2 绑定新销项票
      okStep2(id){
      console.log("步骤2")

        let p  ={};
           p.list=[]
        this.selectData.map(item=>{
          let d = {};
          d.orderInfoId     = item.id;
          d.orderNo         = item.orderNo;
          d.invoiceIncomeId = id;                           //接口m2.1成功后系统会返回一个id
          d.weight          = item.jiesuanWeight;
          d.money           = item.jiesuanMoney;
          d.userId          = this.$global.adminInfo.id;
          d.userName        = this.$global.adminInfocname;
          d.type        = '1';
          d.status = "1"
          p.list.push(d);
        })
        getBangJinPiao(p).then(res =>{
           if(res.code =='100'){
               this.$Notice.success({
                   title:'绑定成功',
                    duration:1,
                    onClose:res =>{
                      this.modal2 =false;
                      this.getSearch();
                 }
               })
           }else{
               this.$Notice.error({
                   title:'绑定失败'
               })
           }
        })
      },
      //步骤3 修改订单明细的信息
      okStep3(){
      console.log("步骤3")

        let pageOrderInfoList = [];
        this.selectData.map(item =>{
          let d = {};
          d.id = item.id //勾选的订单明细id
          d.invoiceWeight = item.jiesuanWeight //勾选的结算重量
          d.invoiceMoney  = item.jiesuanMoney  //勾选的结算金额
          d.invoiceNo     = this.addFormTwo.fapiaohao1 //开票号码
          d.invoiceStatus = '1'
          pageOrderInfoList.push(d);
        })
        let p                         = {};
            p.pageOrderInfoList = pageOrderInfoList;
        getXiuGaiOrder(p).then(res =>{
           if(res.code =='100'){
             this.okStep5(); //步骤5 判断订单是否已经可以收票
             this.updateOrderInvoiceMoney();// 步骤6 修改主订单 开票金额，开票重量
               this.$Notice.success({
                   title:'修改订单状态成功',
                    onClose:res =>{
                 }
               })
           }else{
               this.$Notice.error({
                   title:'修改订单状态失败'
               })
           }
        })
      },
      okStep4(invoiceId){//添加供应商收票流水
      console.log("步骤4")

      let p  = {};
      let plist = [];
      let dic = {};
            dic.customerId      = '';
            dic.orderId         = '0';
            dic.inMoney         = this.allMprice;
            dic.outMoney        = '0';
            dic.currentMoney    = '0';
            dic.userId          = this.$global.adminInfo.id;
            dic.payMoneyType    = '7';
            dic.note            = '采购单收进项票';
            dic.orderNo         = '';
            dic.bankJgId        = this.addFormTwo.bankJgId;
            dic.orgId           = this.addFormTwo.cusId;//店铺的orgid
            dic.orgName         = this.addFormTwo.companyName1;//店铺公司名称
            dic.daozhangdanId   = '0';               
            dic.bankConnectedId = '0';              
            dic.zhidanApplyId   = '';
            dic.zhaiyao         = '采购单收进项票';
            dic.direction       = invoiceId;//进项票id
            dic.type            = '2';
            dic.dikouOrderId    = '';
            dic.dikouOrderNo    = '';
                    dic.status        = '1'

            plist.push(dic)
      p.list = plist;
        addOrgMoneyRecord(p).then(res =>{
              if(res.code =='100'){
                this.$Notice.success({
                  title:'记录供应商收票成功',
                  duration:1,
                  onClose:res =>{
                  }
               })
            }else{
                 this.$Notice.error({
                 title:'记录供应商收票失败'
                })
            }
         })
      },
      uniqueNew(arr) {//去除重复数组
  const res = new Map();
  return arr.filter((arr) => !res.has(arr.ordersId) && res.set(arr.ordersId, 1))
},
      okStep5(){//步骤5 判断订单是否已经可以收票
      console.log("步骤5")
      let plist = [];
          this.selectData.map(item =>{
            let dic = {};
            dic.ordersId = item.ordersId
            plist.push(dic);
          })
          let p  = {};
          plist = this.uniqueNew(plist)
          p.pageOrderInfoList = plist;
          console.log(p)
          updateOrderStatusByInvoiceStatus(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'变更订单状态成功',
                 })
              }else{
                   this.$Notice.error({
                   title:'变更订单状态失败'
                  })
              }
           })
      },
      cancel(){
        this.modal2 =false;
      }, 
      //撤销申请的弹窗  确定取消
      getCon(){
        let issubmit = true;
        if(this.selectData.length == 0){
          this.$Message.warning("请选择一列")
          return ;
        }
        let p  = {};
        let plist = [];
        let a = this.selectData[0].aid;
        let b = this.selectData[0].orderId1
        this.selectData.map(item=>{
          let dic = {};
          dic.invoiceApplyId = item.id1;
          plist.push(dic);
            if(a != item.aid){
              this.$Message.warning("只可选择一个申请单")
              issubmit = false;
              return ;
            }

             if(b != item.orderId1){
              this.$Message.warning("只可选择一个订单")
              issubmit = false;
              return ;
            }
        })
        if(!issubmit){
          return ;
        }
        p.oldOrderStatus = "9";
        p.newOrderStatus = "9009"
        p.userId = this.$global.adminInfo.id
        p.applyId = this.selectData[0].aid
        p.orderId = this.selectData[0].orderId1
        p.id =  p.applyId
        p.substatus = "9009";
        p.note = "财务退回开票申请"
        p.deleteStatus = 0;
        p.invoiceApplicationDetailsList = plist;
        getCheXiao(p).then(res =>{
           if(res.code =='100'){
               this.$Notice.success({
                   title:'撤销成功',
                    duration:1,
                    onClose:res =>{
                      this.reload()
                 }
               })
           }else{
               this.$Notice.error({
                   title:'撤销失败'
               })
           }
        })
      },
      getCu(){

      },
      //撤销 单选
      getRadio(item){
      },
       reloadSelf(){
            this.reload();
        },
      //导出excel
      exportData (type) {
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '开票原始数据'
                    });
                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: 'Sorting and filtering data',
                        original: false
                    });
                } else if (type === 3) {
                  let colCom=[
                    {
                        title:'序号',
                        width: 60,
                        key:'aa'
                    },
                    {
                        title: '系统品名',
                        key: 'steelName',
                        width:'80px'
                    },
                     {
                        title: '货物或应税劳务、服务名称',
                        key: 'steelName',
                        width:'80px'
                    },
                    {
                        title: '计量单位',
                        key: 'dun',
                        width:'80px',
                    },
                    {
                        title: '系统原始规格型号',
                        key: 'yuanshi',
                        width:'80px',
                    },
                    {
                        title: '规格型号',
                        key: 'yuanshi',
                        width:'80px'
                    },
                     {
                        title: '数量',
                        key: 'weight',
                        width:'80px'
                    },
                     {
                        title: '金额',
                        key: 'money',
                        width:'80px'
                    },
                    
                     {
                        title: '税率',
                        key: 'shuilv',
                        width:'80px'
                    },
                    {
                        title: '商品税目',
                        key: 'shangpinshui',
                        width:'80px'
                    },
                    {
                        title: '折扣金额',
                        key: 'zheMoney',
                        width:'80px'
                    },
                    {
                        title: '税额',
                        key: 'shuie',
                        width:'80px'
                    },
                    {
                        title: '折扣税额',
                        key: 'zhekou',
                        width:'80px'
                    },
                    {
                        title: '折扣率',
                        key: 'zhekoulv',
                        width:'80px'
                    },
                    {
                        title: '单价',
                        key: 'guapaijia',
                        width:'80px'
                    },
                    {
                        title: '价格方式',
                        key: 'jiagef',
                        width:'80px'
                    },
                    {
                        title: '税收分类编码版本号',
                        key: 'shuishouhao',
                        width:'80px'
                    },
                    {
                        title: '税收分类编码',
                        key: 'bianhaoshui',
                        width:'80px'
                    },
                    {
                        title: '企业商品编码',
                        key: 'qiye',
                        width:'80px'
                    },
                    {
                        title: '使用优惠政策标识',
                        key: 'youhui',
                        width:'80px'
                    },
                    {
                        title: '零税率标识',
                        key: 'ling',
                        width:'80px'
                    },
                    {
                        title: '优惠政策说明',
                        key: 'shuoming',
                        width:'80px'
                    },
                    {
                        title: '中外合作油气田标识',
                        key: 'zhongwai',
                        width:'80px'
                    },
                    ];
                    this.dataAll.map((item,index,arr)=>{
                      item.aa=index+1;
                      item.dun='吨';
                      item.yuanshi=item.steelPaihao+'\xa0'+item.steelGuige;
                      item.shuilv='0.16'; Number
                      item.shuie=Number(Number(item.money)-Number(item.money)/1.6);
                      item.jiagef='1';
                      item.shuishouhao='30.0';
                      item.bianhaoshui='1080207990000000000';
                      item.youhui='0';
                      item.zhongwai='0'  
                    })
                    this.$refs.table.exportCsv({
                        filename: '自定义数据',
                        columns:colCom,
                        data: this.dataAll
                    });
                }
            } 

   
  },
  //计算 发票总重量  发票总金额 发票不含税金额 发票税额  
  computed:{ //计算总金额和总重量
              allMoney(){
                  let totalMoney      = 0; //本次申请总金额
                  let tolWeight  = 0;//本次申请总重量
                  let zongFa=0 //发票不含税
                
                  this.selectData.map((item) => {
                    totalMoney += Number(item.jiesuanMoney) //发票总金额
                    tolWeight += Number(item.jiesuanWeight) //发票总重量 
                                                     //发票不含税金额 faMoneyOne
                                                    
                
                  })
                  this.faPiaoBu=totalMoney*0.8547;//发票不含税
                  this.shuiE=totalMoney-zongFa;//税额
                  this.allMprice            = totalMoney
                  this.allWightp            = tolWeight
                  zongFa                    = this.$global.accDiv(totalMoney,1.13) //发票不含税金额 =总金额 除以 1.13 然后四舍五入
                  this.addFormTwo.faWeight1 = this.$global.accPrecision(tolWeight,3)//发票总重量
                  this.addFormTwo.faMoney1  = this.$global.accPrecision(totalMoney,2)//发票总金额
                  this.addFormTwo.faMoneyOne = this.$global.accPrecision(zongFa,2)//发票不含税金额
                  this.addFormTwo.faShui    = this.$global.accPrecision((totalMoney-zongFa),2)//发票税额

                  //return  this.addForm.totalSum, this.addForm.totalWeight
              }
          },

  created () {

  },
  watch:{
    
  },
  mounted () {
    this.getUser()
    this.getCompany();
    this.getSearch();
    this.getGongcheng();
  }
}
</script>
<style lang='less'>
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
.allJin{
    padding-top:10px;
    time{
        color:red;
    }
}
.allrow{
  margin-bottom:15px;
  time{
    color:red;
    font-weight:600;
    font-size:18px;
  }
}
.row_sa{
  margin-bottom:10px;
  time{
     color:red;
    font-weight:600;
    font-size:16px;
  }
}
.buton_all{
  margin-bottom:15px;
  button{
    margin-right:10px;
  }
}
 .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
</style>

