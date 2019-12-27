<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-09-16 17:26:56
 * @其他: 
 -->


<template>
     <div id='daozhang'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form inline :model="formItem" :label-width="80">
        <Row>
          <FormItem  label="公司名称:" style="width:200px">
                <Input clearable  placeholder="请输入公司名称" v-model="formItem.companyName"></Input>
          </FormItem>
          <FormItem label="出入账:" style="width:200px">
                 <Select v-model="formItem.tranType" filterable >
                    <Option v-for="(item, index) in tranTypeListThis" :value="item.value" :key="index">{{item.label}}</Option>
                </Select>
          </FormItem>
           <FormItem label="每页显示:" style="width:200px">
            <Select v-model="length"    placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
             <FormItem label="处理状态:" style="width:200px">
            <Select v-model="dType"    placeholder="请选择"   >
               <Option v-for="(item,index) in dTypeList " :value="item.value" :key="item.value" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
            <br>
           <FormItem label='下单时间' id='pp'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" style="width: 200px">
              </DatePicker>
            </FormItem>


          <FormItem  label="到账金额:" style="width:200px;">
                <Input clearable  placeholder="请输入最小值" v-model="formItem.minPrice"></Input>
              
          </FormItem>
          <FormItem style="width:130px;" id='mo'>
                <Input clearable  placeholder="请输入最大值" v-model="formItem.maxPrice"></Input>
          </FormItem>


        </Row>
        <Row>
            <Col span="24">
             <Button style="margin-right:4px" size="small" type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button style="margin-right:4px" size="small" type='primary' icon="ios-add" @click='addNew()'>新增</Button>

             <Button  shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
             <Button style="margin-left:4px;margin-right:5px" size="small" type='primary' icon="ios-add" @click='batchAdd()'>批量确认入账</Button>
              <Button type="primary" @click="exportData(1)" size="small">下载excel</Button>
              <br>
            <span>当前勾选总笔数:<time style='color:red'>{{totalNumber}}</time>笔,</span>
            <span style="margin-letf:4px">总到账单金额:</span><span style="color:red">{{this.$global.isMoneyShow(totalDMoney)}}</span>元,
            <span>总剩余可用到账金额:</span><span style="color:red">{{this.$global.isMoneyShow(totalKMoney)}}</span>元
            </Col>
        </Row>
          
        <Table  @on-selection-change="selectAllSelection" border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
            
        </Table>

        <Page :page-size="length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
     </Form>
     </Card>    
      <!-- 制单付款-银行退汇 -->
     <Modal
        title="银行退汇-申请重新付款"
        v-model="modal"
        footer-hide 
        :mask-closable="false"  width='700px;' >
        <Form :label-width="200"  :model="changeformItem" >
            <FormItem label="公司:" >
           <i-input   style="width:280px" v-model="changeformItem.companyName" placeholder="请输入公司"/>
         </FormItem>
            <FormItem label="退款开户行:" prop="openBank">
              <Select  v-model="changeformItem.openBank" :label-in-value='true' filterable style='width:280px;' @on-change='getChange'>
                <Option v-for="(item,index) in changeformItem.bankAdd" :value="item.bankAbbreviation" :key="index">{{ item.bankAbbreviation}}</Option>
            </Select>
         </FormItem>
          <FormItem label="退款银行所在地区:" prop="valueOne" >
            <el-cascader style='width:280px'
                 filterable
                :options="dataOne1"
                placeholder="选择省/市/"
                v-model="changeformItem.valueOne"
                @change='getCityOne' ref='cascaderAddr'>
            </el-cascader>
             <!-- <Cascader :data="dataOne1" v-model="changeformItem.valueOne" @on-change='getCityOne' style='width:280px'></Cascader> -->
         </FormItem>
        <FormItem label='退款银行开户网点名称:' prop="bankDot">
            <Select :label-in-value="true" placeholder="请选择退款银行开户网点" v-model="changeformItem.bankDot" filterable style='width:280px;' @on-change='getChangeDot'>
                <Option v-for="(item,index) in bankDotList" :value="JSON.stringify(item)" :key="index">{{ item.branchFullName}}</Option>
            </Select>
            <Tag color="default">{{changeformItem.bankDot_placeholder}}</Tag>
        </FormItem>
        <!-- 退款银行三级查找结束 -->
        <FormItem label="退款银行账号:" >
           <i-input   style="width:280px" v-model="changeformItem.tkAccBankCode" placeholder="请输入退款银行账号"/>
        </FormItem>
            
          </Form>
          <div class="margin-top-20">
    <Button style="margin-right:10px"  type="primary" @click="changeItem">确认提交</Button>
    <Button  type="default" @click="modalCancel">取消</Button>
</div>
    </Modal>
    <!-- 增加新到账单 -->
     <Modal
        title="添加新到账单"
        v-model="modal_add"
        footer-hide 
        :mask-closable="false"  width='1200px;' >
        <Form :label-width="120" ref="addFormItem"  inline :rules="ruleValidate"  :model="addFormItem" >
            <FormItem label="公司名称:" prop="companyName">
                <i-input    style="width:150px" v-model="addFormItem.companyName" placeholder="请输入公司"/>
            </FormItem>
             <FormItem label="到账时间:" prop="date">
                <DatePicker @on-change="changeDate" type="date" format="yyyy-MM-dd" placeholder="请选择日期" v-model="addFormItem.date" style="width:105px" ></DatePicker>
                <!-- <TimePicker type="time" placeholder="请选择时间" v-model="addFormItem.time"  style="width:90px"></TimePicker> -->
            </FormItem>
            <FormItem label="本公司收账银行卡:" prop="jgBank">
                <Select v-model="addFormItem.jgBank" style="width:270px" :label-in-value='true' filterable @on-change='addFormItem_getChange'>
                    <Option v-for="(item, index) in companyCardTypeListThis" :value="JSON.stringify(item)" :label="item.label" :key="index">{{item.label}}</Option>
                </Select>
            </FormItem>
            <!-- <FormItem label="银行支行全称:" prop="bankName">
                <i-input   style="width:150px" v-model="addFormItem.bankName" placeholder="请输入银行支行全称"/>
            </FormItem> -->
            <!-- <FormItem label="到账卡号:" prop="bankCardNo">
                <i-input   style="width:150px" v-model="addFormItem.bankCardNo" placeholder="请输入到账卡号"/>
            </FormItem> -->
            <FormItem label="到账金额:" prop="money">
                <i-input   style="width:150px" v-model="addFormItem.money" placeholder="请输入到账金额"/>
            </FormItem>
            <FormItem label="摘要:" prop="zhaiyao" >
                <i-input   style="width:150px" v-model="addFormItem.zhaiyao" placeholder="请输入摘要"/>
            </FormItem>
            <!-- <FormItem label="出入账类型:" prop="tranType">
                 <Select v-model="addFormItem.tranType" style="width:150px"  filterable @on-change='getChange_trantype'>
                    <Option v-for="(item, index) in tranTypeListThis" :value="item.value" :key="index">{{item.label}}</Option>
                </Select>
            </FormItem> -->

          </Form>
          <div class="margin-top-20">
                <Button style="margin-right:10px"  type="primary" @click="addModal_new">确认提交</Button>
                <Button  type="default" @click="modalCancel">取消</Button>
            </div>
    </Modal>
        <!-- 确认到账单有效 -->
          <Modal
        :title="changeFromItem.title"
        v-model="modal_change"
        footer-hide 
        :mask-closable="false"  width='1200px;' >
        <Form :label-width="120"   inline   :model="changeFromItem" >
            <FormItem label="公司名称:" >
                <span   style="width:150px" >{{changeFromItem.companyName}}</span>
            </FormItem>
             <FormItem label="到账时间:" >
                <span   style="width:150px" >{{changeFromItem.date}}</span>
            </FormItem>
            <FormItem label="银行支行全称:" >
                <span   style="width:150px" >{{changeFromItem.bankName}}</span>
            </FormItem>
            <FormItem label="到账卡号:" >
                <span   style="width:150px" >{{changeFromItem.bankCardNo}}</span>
            </FormItem>
            <FormItem label="到账金额:" >
                <span   style="width:150px;color:red" >{{ this.$global.isMoneyShow(changeFromItem.money) }}</span>
            </FormItem>
            <FormItem label="确认可用金额:" >
                <InputNumber   style="width:150px" :max="changeFromItem.dealMoney" :min="0.01" v-model="changeFromItem.usedMoney" placeholder="请输入金额"></InputNumber>
            </FormItem>
            <FormItem label="摘要:"  >
                <span   style="width:150px;" >{{ changeFromItem.zhaiyao }}</span>
            </FormItem>
            <FormItem label="出入账类型:" >
                <span   style="width:150px" >{{ changeFromItem.tranTypeStr}}</span>
            </FormItem>
            <br>
            <FormItem label="确认入账类型:" prop="tranType">
                 <Select v-model="changeFromItem.type" style="width:150px"  filterable >
                    <Option v-for="(item, index) in orgTypeListThis" :value="item.value" :key="index">{{item.label}}</Option>
                </Select>
            </FormItem>
             <FormItem label="备注:"  >
                <i-input   style="width:150px" v-model="changeFromItem.note" placeholder="请输入备注"/>
            </FormItem>
             <FormItem label="摘要:"  >
                <i-input   style="width:150px" v-model="changeFromItem.zhaiyaoInput" placeholder="请输入摘要"/>
            </FormItem>
          </Form>
          <div class="margin-top-80">
                <Button style="margin-right:10px"  type="primary" @click="changeModalClick(1)">确认</Button>
                <Button  type="default" @click="modalCancel">取消</Button>
            </div>
    </Modal>



    <!-- 多选确认入账弹窗 -->
     <Modal
        :title="changeFromItem.title"
        v-model="modal_changeOne"
        footer-hide 
        :mask-closable="false"  width='1200px;' >
        <Form :label-width="120"   inline   :model="changeFromItem" >
            <!-- <FormItem label="公司名称:" >
                <span   style="width:150px" >{{changeFromItem.companyName}}</span>
            </FormItem> -->
             <!-- <FormItem label="到账时间:" >
                <span   style="width:150px" >{{changeFromItem.date}}</span>
            </FormItem> -->
            <!-- <FormItem label="银行支行全称:" >
                <span   style="width:150px" >{{changeFromItem.bankName}}</span>
            </FormItem>
            <FormItem label="到账卡号:" >
                <span   style="width:150px" >{{changeFromItem.bankCardNo}}</span>
            </FormItem> -->
            <FormItem label="到账总金额:" >
                <span   style="width:150px;color:red" >{{ this.$global.isMoneyShow(changeFromItem.money) }}</span>
            </FormItem>
            <!-- <FormItem label="确认可用金额:" >
                <InputNumber   style="width:150px" :max="changeFromItem.dealMoney" :min="0.01" v-model="changeFromItem.usedMoney" placeholder="请输入金额"></InputNumber>
            </FormItem> -->
            <!-- <FormItem label="摘要:"  >
                <span   style="width:150px;" >{{ changeFromItem.zhaiyao }}</span>
            </FormItem>
            <FormItem label="出入账类型:" >
                <span   style="width:150px" >{{ changeFromItem.tranTypeStr}}</span>
            </FormItem> -->
            <br>
            <FormItem label="确认入账类型:" prop="tranType">
                 <Select v-model="changeFromItem.type" style="width:150px"  filterable >
                    <Option v-for="(item, index) in orgTypeListThis" :value="item.value" :key="index">{{item.label}}</Option>
                </Select>
            </FormItem>
             <FormItem label="备注:"  >
                <i-input   style="width:150px" v-model="changeFromItem.note" placeholder="请输入备注"/>
            </FormItem>
             <FormItem label="摘要:"  >
                <i-input   style="width:150px" v-model="changeFromItem.zhaiyaoInput" placeholder="请输入摘要"/>
            </FormItem>
          </Form>
          <div class="margin-top-80">
                <Button style="margin-right:10px"  type="primary" @click="changeModalClick(2)">确认</Button>
                <Button  type="default" @click="modalCancel">取消</Button>
            </div>
    </Modal>
    <!-- 结束 -->
     </div>
</template>

<script>
import {
  findDaoZhangDanAll,
  deleteDaoZhangDan,
  findBankLineByBankCode,
  addDaoZhangDanBatch,
  updateDaoZhangDanBatch2,
  addOrgMoneyRecord,
  addBillFlow
  } from '@/api/data'
import {companyCardTypeList,tranTypeList,orgTypeList,lengthList} from '@/libs/global_type'
import {getDaozhangdanStatus,getTranType,daozhangdanCardType,getDaozhangdanDType} from '@/libs/allStatus'
import {
        getOpeningBank,
        getBankDot
    } from '@/api/cusData' //客户列表
import city from '@/api/city_houtai'
import jsonp from 'jsonp'
import { constants } from 'crypto';

export default {
    name: 'daozhangdan_summary',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        options:{
          shortcuts:[
             {
                            text: '1周',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '一个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '3个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
          ]
        },
        totalNumber:0,//总笔数
        totalDMoney:0,//到账金额汇总
        totalKMoney:0,//剩余可用到账金额
        dTypeList:[
          {
            label:'未入账',
            value:0
          },
          {
            label:"已入账",
            value:1
          }
        ],//默认类型 
        dType:0,
        lengthListThis:lengthList,
          orgTypeListThis:orgTypeList,
          //新增到账单
          
          ruleValidate:{
               companyName: [
                        { required: true, message: '请输入公司名称', trigger: 'blur' }
                    ],
                date: [
                        { required: true, message: '请选择日期', trigger: 'blur' }
                    ],
                jgBank: [
                        { required: true, message: '请选择本公司收账银行卡', trigger: 'blur' }
                    ],
                // bankName: [
                //         { required: true, message: '请输入银行支行全称', trigger: 'blur' }
                //     ],
                //   bankCardNo: [
                //         { required: true, message: '请输入到账卡号', trigger: 'blur' }
                //     ],
                 money: [
                        { required: true, message: '请输入到账金额', trigger: 'blur' }
                    ],
                //  zhaiyao: [
                //         { required: true, message: '请输入摘要', trigger: 'blur' }
                //     ],
                //  tranType: [
                //         { required: true, message: '请选择出入账类型', trigger: 'blur' }
                //     ],
          },
          modal_change:false,
          modal_changeOne:false,//新增的
          modal_add:false,
          tranTypeListThis:tranTypeList,
          length:10,
          addFormItem:{
              companyName: '',//公司名称
              date       : "",//日期
              time       : '00:00:00',//时间
              jgBank     : "",//本公司收款银行
              jgBankItem : '',//本公司收款银行数据
              bankName   : '',//打款的银行名称
              bankCardNo : '',   //打款银行卡号
              money      : 0,//打款金额
              zhaiyao    : '货款',//摘要
              tranType   : '1',//到账类型，出||入
          },
           changeFromItem:{
              id:'',
              title:'',
              companyName: '',//公司名称
              date       : "",//日期
              time       : '',//时间
              jgBank     : "",//本公司收款银行
              jgBankItem : '',//本公司收款银行数据
              bankName   : '',//打款的银行名称
              bankCardNo : '',   //打款银行卡号
              money      : '',//打款金额
              zhaiyao    : '',//摘要
              tranType   : '',//到账类型，出||入
              usedMoney:0,//剩余可用金额
              dealMoney:0,
              tranTypeStr:'',
              type:'1',
              note:'',
              item:"",
              zhaiyaoInput:''
            
          },
        //弹出框使用的数据
        modal:false,
        //弹出框使用的数据结束
        tableItem:{},
        selectionsList:[],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        companyCardTypeListThis:companyCardTypeList,
        changeformItem:{
          companyName:'',
          openBank:'',
          valueOne:[],
          bankDot:'',
          bankDot_placeholder:'',
          tkAccBankCode:'',
          returnBankItem:{},
          prefectureLevel:'',
          bankCode:"",
          bank:"",
          bankNumber:"",
          dealMoney:'',
          bankNo:''
        },
         bankString:'',
          Provinces:'',
          city:'',
          cityStringOne:'',
          bankDotList:[],
          dataOne1:city,
        formItem: {
          companyName:'',
          orderNo:'',
          payMony:'',
          dikouMoney:'',
          cardType:"",
          totalMoney:'', 
          dateTime:"",
          beginTime:"",
          endTime:"",
          minPrice:'',
          maxPrice:"",
          totalNum:'',
          tranType:'1',//出入账类型
          },
          columns4: [
                   {
                     title: '多选',
                     key: '',
                     align: 'center',
                     width:'60',
                     type: 'selection'
                   },
                    {
                        title: 'ID',
                        key: 'daozhangdanId',
                        align: 'center',
                        width:'60'
                    },
                    {
                        title: '到账时间',
                        key: 'dealTime',
                        align: 'center',
                        width:'150'
                    },
                     
                     {
                        title: '客户名称',
                        key: 'creditedCompany',
                        align: 'center',
                        width:'160',
                        
                    },
                     {
                        title: '到账金额 (元)',
                        key: 'payMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.payMoney))
                        }
                    },
                    {
                        title: '剩余可用到账金额 (元)',
                        key: 'dealMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dealMoney))
                        }
                    },
                   
                     {
                        title: '收款账号',
                        key: 'jgBankNo',
                        align: 'center',
                        width:'150',
                        render:(h,params) =>{
                          return h('div',{
                          },params.row.jgBankNo)
                        }
                    },
                     {
                        title: '到账银行卡',
                        key: 'type',
                        align: 'center',
                        width:'180',
                        render:(h,params) =>{
                          return h('div',{
                          },daozhangdanCardType(params.row.type))
                        }
                    },
                     
                     {
                        title: '摘要',
                        key: 'zhaiyao',
                        align: 'center',
                        width:'150'
                    },
                      {
                        title: '客户银行账号',
                        key: 'bankNo',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '客户开户行名',
                        key: 'bank',
                        align: 'center',
                        width:'150'
                    },
                    {
                        title: '状态',
                        key: 'daozhangdanStatus',
                        align: 'center',
                        width:'60',
                    },
                    {
                        title: '状态',
                        key: 'daozhangdanStatus',
                        align: 'center',
                        width:'160',
                        render:(h,params) =>{
                          return h('div',{
                          },getDaozhangdanStatus(params.row.daozhangdanStatus))
                        }
                    },
                    {
                        title: '出入账类型',
                        key: 'tranType',
                        align: 'center',
                        width:'80',
                        render:(h,params) =>{
                          return h('div',{
                          },getTranType(params.row.tranType))
                        }
                    },
                   
                     {
                        title: 'dType',
                        key: 'dType',
                        align: 'center',
                        width:'80'
                    },
                    {
                        title: '处理状态',
                        key: 'dType',
                        align: 'center',
                        width:'80',
                        render:(h,params) =>{
                          return h('div',{
                          },getDaozhangdanDType(params.row.dType))
                        }
                    },
                    {
                        title: 'jgBank',
                        key: 'jgBank',
                        align: 'center',
                        width:'80'
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'280',
                        fixed:'right',
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
                                              this.changeStatus(params.row,1);
                                        }
                                    }
                                }, '错打款项提交'),
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
                                              this.changeStatus(params.row,2);

                                        }
                                    }
                                }, '银行退汇提交'),
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
                                              this.changeStatus(params.row,3);
                                        }
                                    }
                                }, '关闭'),
                                //   h('Button', {
                                //     props: {
                                //         type: 'primary',
                                //         size: 'small'
                                //     },
                                //      style: {
                                //         marginRight: '5px'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             if(params.row.orgId =="null" ||params.row.orgId ==""||params.row.orgId ==null){
                                //                 this.$Notice.error({
                                //                     title:"请先添加该公司为客户或供应商"
                                //                 })
                                //                 return ;
                                //             }else{
                                //             }
                                //             this.modal_change = true;
                                //             this.changeFromItem.item = params.row;
                                //             //赋值
                                //             this.changeFromItem.id = params.row.daozhangdanId;
                                //             this.changeFromItem.title ='确认入账-ID:'+ params.row.daozhangdanId;
                                //             this.changeFromItem.companyName = params.row.creditedCompany;
                                //             this.changeFromItem.date = params.row.dealTime;
                                //             this.changeFromItem.jgBank = params.row.jgBank;
                                //             this.changeFromItem.bankName = params.row.bank;
                                //             this.changeFromItem.bankCardNo = params.row.bankNo;
                                //             this.changeFromItem.money = params.row.payMoney;
                                //             this.changeFromItem.zhaiyao = params.row.zhaiyao;
                                //             this.changeFromItem.tranType = params.row.tranType;
                                //             this.changeFromItem.tranTypeStr = getTranType(params.row.tranType);

                                            
                                //             this.changeFromItem.dealMoney = Number(params.row.dealMoney);
                                //             this.changeFromItem.usedMoney = parseFloat(params.row.dealMoney);
                                //         }
                                //     }
                                // }, '确认入账'),

                             
                             ]);
                    }
                        
                    },
                    
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1, //初始化时查询的页码数

                dataChoose:[],//设置多选的e
                
      }
    },
    
    methods:{
      //开始
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';
      },
       exportData (type) {
                if (type === 1) {
                    this.$refs.selection.exportCsv({
                        filename: '开票原始数据',
                        original :true
                    });
                }
            },
      //结束


      batchAdd(){
            let isShowModal = true;
            if(this.dataChoose.length==0){
              this.$Message.warning("请勾选最少一条数据")
              return false;
            }
            this.changeFromItem.title ='批量确认入账';
            let op=0;
            this.dataChoose.map((item)=>{
                if(item.orgId =="null" ||item.orgId ==""||item.orgId ==null){
                     this.$Notice.error({
                         title:"请先添加该公司为客户或供应商"
                     })
                     isShowModal =  false;
                     return false;
                 }
              console.log(item.payMoney) 
               op+= Number(item.payMoney);//到账的金额总和
            })
            this.changeFromItem.money =op;
            //已经在平台中存在的客户才可以入账
            if(isShowModal){
              this.modal_changeOne=true;
            }
            
      },
    payOnlineBusiness(){//合同审核线上付款
            let ruType = this.changeFromItem.type;//1 客户 2供应商
          let p                     = {};
          let plist                 = [];
          this.dataChoose.map(item=>{
              let dic                   = {};
               dic.ysMoney  = '0';     //应收金额
               dic.dkpMoney = '0';     //待开票金额
               dic.orderId  = '';      //订单id
               dic.orderNo  = '';      //订单号
               dic.accApply = '';      //打款申请
               dic.dkApply  = '';      //抵扣申请
               dic.txApply  = '';      //提现申请
               dic.kpApply  = '';      //开票申请
               dic.zxStatus = '1';     //注销状态
               dic.note     = '收款账单';  //备注
               dic.status   = '1';     //可用状态

              if(ruType == "1")//客户
              {
              dic.billType          = '10020';               //账单类型
              dic.fsMoney           = item.dealMoney;        //发生金额
              dic.sellerEmpDept     = '';                    //卖家负责人部门
              dic.sellerCompanyId   = '';                    //卖家公司id
              dic.sellerCompanyName = '';                    //卖家公司名称
              dic.sellerEmpName     = '';                    //卖家负责人名称
              dic.buyerEmpDept      = '';                    //买家负责人部门 本公司
              dic.buyerCompanyId    = item.orgId;            //买家公司id
              dic.buyerEmpName      = '';                    //买家负责人名称
              dic.buyerCompanyName  = item.creditedCompany;  //买家公司名称
              dic.transactionType   = '1';                   //交易账单类型（买家账单，卖家账单）
              }
              else
              {
                dic.billType          = '20090';               //账单类型
                dic.fsMoney           = item.dealMoney;        //发生金额
                dic.sellerEmpDept     = '';                    //卖家负责人部门
                dic.sellerCompanyId   = item.orgId;            //卖家公司id
                dic.sellerCompanyName = item.creditedCompany;  //卖家公司名称
                dic.sellerEmpName     = '';                    //卖家负责人名称
                dic.buyerEmpDept      = '';                    //买家负责人部门 本公司
                dic.buyerCompanyId    = '';                    //买家公司id
                dic.buyerEmpName      = '';                    //买家负责人名称
                dic.buyerCompanyName  = '';                    //买家公司名称
                dic.transactionType   = '2';                   //交易账单类型（买家账单，卖家账单）
              }
              
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
        getTranTypeThis(str){
           return getTranType(str);
        },
        changeModalClick(type){//修改
            //步骤一 修改到账单 
              console.log(type+'tyoe')
            if(type==1){//单条确认入账
             this.changeModalClickStep1();
            } else if(type==2){//批量确认入账
            this.changeModalClickStep1MM();

            }
            //步骤二 添加到流水中
        },
        // todo
           changeModalClickStep1MM(){
            //只需要修改状态
            let p  ={};
            let plist  =[];
           
            this.dataChoose.map((item)=>{
                 let dic ={};
                 dic.daozhangdanId = item.daozhangdanId;
                 dic.dType = "1"
                 plist.push(dic);
            })
          
            // dic.addDealMoney  = '-'+this.changeFromItem.usedMoney;
           
            p.pageDaoZahangDanForUpdateList = plist;
          

            updateDaoZhangDanBatch2(p).then(res=>{
                        if(res.code =="100"){
                          this.changeModalClickStep2MM();
                          this.payOnlineBusiness();
                          this.$Notice.success({
                            title:'修改到账单金额成功',
                            duration:1,
                          })
                        }else{
                          this.$Notice.error({
                            title:'修改失败'
                          })
                        }
               })
        },
        changeModalClickStep2MM(){
            let p                   = {};
            let plist               = [];
            this.dataChoose.map((item)=>{
                let dic                 = {};
                dic.customerId      = ""
                dic.orderId         = "0"
                dic.inMoney         = item.dealMoney
                dic.outMoney        = "0"
                dic.currentMoney    = "0"
                dic.userId          = this.$global.adminInfo.id
                dic.payMoneyType    = "3"
                dic.note            = this.changeFromItem.note;
                dic.orderNo         = ""
                dic.bankJgId        = item.jgBank //入账的本公司抬头
                dic.orgId           = item.orgId;
                dic.orgName         = item.creditedCompany
                dic.daozhangdanId   = item.daozhangdanId
                dic.bankConnectedId = '0'
                dic.zhidanApplyId   = '0'
                dic.zhaiyao         = this.changeFromItem.zhaiyaoInput
                dic.direction        = ''
                dic.type            = this.changeFromItem.type
                dic.status        = '1'

                plist.push(dic);
            })
   
            p.list = plist;
             addOrgMoneyRecord(p).then(res=>{
                        if(res.code =="100"){
                          this.$Notice.success({
                            title:'入账成功',
                            duration:1,
                             onClose:res =>{
                                  console.log('关闭时回调')
                                  this.reloadSelf();
                              }
                          })
                        }else{
                          this.$Notice.error({
                            title:'入账失败'
                          })
                        }
               })
        },
        // 结束
        changeModalClickStep1(){
            //只需要修改状态
            let p  ={};
            let plist  =[];
            let dic ={};
            dic.daozhangdanId = this.changeFromItem.id;
            dic.dType = "1"
            // dic.addDealMoney  = '-'+this.changeFromItem.usedMoney;
            plist.push(dic);
            p.pageDaoZahangDanForUpdateList = plist;

            updateDaoZhangDanBatch2(p).then(res=>{
                        if(res.code =="100"){
                            this.changeModalClickStep2();
                          this.$Notice.success({
                            title:'修改到账单金额成功',
                            duration:1,
                          })
                        }else{
                          this.$Notice.error({
                            title:'修改失败'
                          })
                        }
               })
        },
        changeModalClickStep2(){
            let p                   = {};
            let plist               = [];
            let dic                 = {};
                dic.customerId      = ""
                dic.orderId         = "0"
                dic.inMoney         = this.changeFromItem.usedMoney
                dic.outMoney        = "0"
                dic.currentMoney    = "0"
                dic.userId          = this.$global.adminInfo.id
                dic.payMoneyType    = "3"
                dic.note            = this.changeFromItem.note;
                dic.orderNo         = ""
                dic.bankJgId        = this.changeFromItem.jgBank //入账的本公司抬头
                dic.orgId           = this.changeFromItem.item.orgId;
                dic.orgName         = this.changeFromItem.item.creditedCompany
                dic.daozhangdanId   = this.changeFromItem.item.daozhangdanId
                dic.bankConnectedId = '0'
                dic.zhidanApplyId   = '0'
                dic.zhaiyao         = this.changeFromItem.zhaiyaoInput
                dic.direction        = ''
                dic.type            = this.changeFromItem.type
                    dic.status        = '1'

            plist.push(dic);
            p.list = plist;
             addOrgMoneyRecord(p).then(res=>{
                        if(res.code =="100"){
                          this.$Notice.success({
                            title:'入账成功',
                            duration:1,
                             onClose:res =>{
                                  console.log('关闭时回调')
                                  this.reloadSelf();
                              }
                          })
                        }else{
                          this.$Notice.error({
                            title:'入账失败'
                          })
                        }
               })
        },
        changeDate(data){
            console.log(data);
            this.addFormItem.date = data;
        },
      changeStatus(item,type){
          this.tableItem = item;
          let status = '0';
          let stra = '修改成功'
          let strb = '确定需要修改吗'
          console.log(type)
          switch (type.toString()) {
            case "1"://错打款项提交
              status = "4"
              this.tableItem.dStatus = "44"
              this.modal = true;
              this.setItemInfo(item);
              break;
             case "2"://银行退汇
              status = "5"
              this.modal = true;
              this.tableItem.dStatus = "54"
              this.setItemInfo(item);
              break;
             case "3"://关闭
              status = "0"
              this.tableItem.dStatus = "0"
              this.deleteDaoZhangDanItem(item)
              break;
            default:
              break;
          }
          console.log(strb)
        
      },
      changeItem(){//银行退汇提交保存制单
      console.log("提交成")
      console.log(this.changeformItem.returnBankItem.bankCode)
      if(this.changeformItem.returnBankItem.bankCode==undefined){
        this.$Message.warning('请选择退款银行!');

      }else{
                  let param = {};
            //       bankNo: 1702920809100027077
                            param.bankNo = this.tableItem.bankNo;
            // dealMoney: 5.00
                            param.dealMoney = this.$global.accPrecision(this.tableItem.dealMoney,2);
                            // param.dealMoney = this.tableItem.dealMoney;
                              
            // creditedCompany: 河南灿辉商贸有限公司
                            param.creditedCompany = this.tableItem.creditedCompany;
            // prefectureLevel: 郑州市
                            param.prefectureLevel = this.changeformItem.returnBankItem.prefectureLevel;
            // bankCode: 102491002907
                            param.bankCode = this.changeformItem.returnBankItem.bankCode;
            // bank: 中国工商银行河南省分行营业部
                            param.bank = this.changeformItem.returnBankItem.branchFullName;
            // bankNumber: AAA
                            param.bankNumber = this.changeformItem.returnBankItem.banksuoxie;
            // yongtu: 货款
            // memo: 货款
            // payType: 40000
                        param.yongtu  = "退款";
                        param.memo    = "退款";
                        param.payType = "40000"
                        let url = 'http://10.100.16.5:8080/niubee/orders/daozhangdanZhidan'
                        
                        this.$http.jsonp(url,{params:param,jsonp:'callback',jsonpCallback:'successCallback'})
                        .then(function(res){
                          console.log("请求成功");
                          if(res.body =="100"){
                            this.$Notice.success({
                              title:'提交制单成功',
                                duration:1,
                            })
                            this.updataStats();
                          }else{
                              this.$Notice.error({
                                                            title:'提交制单失败'
                                                        })
                          }
                          console.log(res);
                        },function(res){
                          this.$Notice.error({
                                                            title:'提交制单失败,请联系管理员'
                                                        })
                        })
        }
      },
      updataStats(){//修改到账单状态
       let param                   = {};
       param.userId            = this.$global.adminInfo.id
       param.daozhangdanId     = this.tableItem.daozhangdanId
       param.daozhangdanStatus = this.tableItem.dStatus
       param.note              = ""
                                                deleteDaoZhangDan(param).then(res=>{
                                                        if(res.code =="100"){
                                                          this.$Notice.success({
                                                            title:'修改到账单状态成功',
                                                            duration:1
                                                             
                                                          })
                                                        }else{
                                                          this.$Notice.error({
                                                            title:'修改到账单状态失败'
                                                          })
                                                        }
                                               })
      },
      deleteDaoZhangDanItem(item){
         this.$Modal.confirm({
                                           title:'确定需要删除吗',
                                           onOk:()=>{
                                               let param                   = {};
                                                   param.userId            = this.$global.adminInfo.id
                                                   param.daozhangdanId     = item.daozhangdanId
                                                   param.daozhangdanStatus = '0'
                                                   param.note              = ""
                                                deleteDaoZhangDan(param).then(res=>{
                                                        if(res.code =="100"){
                                                          this.$Notice.success({
                                                            title:'删除成功',
                                                            duration:1,
                                                             onClose:res =>{
                                                                  console.log('关闭时回调')
                                                                  this.searchM();
                                                              }
                                                          })
                                                        }else{
                                                          this.$Notice.error({
                                                            title:'修改失败'
                                                          })
                                                        }
                                               })

                                           }
                                         })
      },
      selectAllSelection(data){//全选变化
         this.dataChoose=data;
         console.log(data)
         this.totalDMoney = 0;
         this.totalKMoney = 0 ;
         //计算勾选的总金额
         data.map(item=>{
           this.totalDMoney = this.$global.accAdd(item.payMoney,this.totalDMoney) 
           this.totalKMoney = this.$global.accAdd(item.dealMoney,this.totalKMoney)
         })
         this.totalNumber = data.length;
      },
      payList(){//批量付款
        this.modal = true;
        //计算选中的总计金额
      },
      setItemInfo(row){//给弹出框赋值
          this.changeformItem.tkAccBankCode = row.bankNo
          this.changeformItem.dealMoney = row.dealMoney
          this.changeformItem.companyName = row.creditedCompany
          this.changeformItem.bankDot_placeholder = row.bank
          let p  ={}
          p.bankCode = row.bankCode
          findBankLineByBankCode(p).then(res =>{
             if(res.code =='100'){
               if(res.data.length>0){
                 this.changeformItem.returnBankItem = res.data[0];

               }else{
               }
                
             }else{
                 this.$Notice.error({
                     title:'获取银行支行信息失败，请联系管理员添加'
                 })
             }
          })
          
      },
      addModal_new(){
          //开始提交
          this.$refs['addFormItem'].validate((valid)=>{
              if(valid){
                this.addNewDaozhangdan();
              }else{
                  return;
              }
          })
          
      },
      addNewDaozhangdan(){
          let p  ={};
          let pList = [];
          let dic = {};
          dic.dealTime        = this.addFormItem.date+' '+this.addFormItem.time;
          dic.jgBank          = this.addFormItem.jgBankItem.value;
          dic.jgBankNo        = this.addFormItem.jgBankItem.bankCode;
          dic.serialNumber    = this.$global.guidERP();
          dic.bank            = this.addFormItem.bankName
          dic.bankNo          = this.addFormItem.bankCardNo
          dic.creditedCompany = this.addFormItem.companyName.trim();
          dic.dealMoney       = this.addFormItem.money
          dic.payMoney        = this.addFormItem.money
          dic.money           = 0;
          dic.zhaiyao         = this.addFormItem.zhaiyao
          dic.tranType        = this.addFormItem.tranType
          dic.adminId         = this.$global.adminInfo.id;
          dic.adminName       = this.$global.adminInfo.cname
          dic.type            = this.addFormItem.jgBankItem.value
          dic.status          = "1"
          dic.dType           = "0"

          pList.push(dic);
          p.pageDaoZhangDanForInsertList = pList;
          addDaoZhangDanBatch(p).then(res=>{
            if(res.code =="100"){
                this.$Notice.success({
                    title:"添加成功",
                    duration:1,
                    onClose:res=>{
                        //添加成功后，关闭modal显示，刷新当前页
                        this.modalCancel();
                        this.reload();
                    }
                })
            }else{
                this.$Notice.error({
                    title:"添加失败",
                }) 
            }  
         })
      },
      modalCancel(){
        this.modal        = false;
        this.modal_add    = false;
        this.modal_change = false;
        this.modal_changeOne =false;
      },
      addNew(){
        this.modal_add = true;
      },
        reloadSelf(){
            this.reload();
        },
       //分页
       changePage(index){
           console.log(index)
           this.pagesizea=index;
           this.searchM();
       },
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.pageNum=this.pagesizea //分页
         param.beginDaozhangdanStatus  = "1"
         param.endDaozhangdanStatus  = "8"
         param.begindealTime=this.formItem.beginTime
         param.enddealTime =this.formItem.endTime
         param.minPrice=this.formItem.minPrice
         param.maxPrice=this.formItem.maxPrice
         param.creditedCompany = this.formItem.companyName;
         param.tranType = this.formItem.tranType;
         param.pageSize = this.length;
         param.beginDtype = this.dType;
         param.endDtype   = this.dType;
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){

         findDaoZhangDanAll(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }else{
            this.data1 = [];
            this.$Message.warning("查无数据")
          }  
         })
       },
       //直接获取银行开户行数据
            getBan(param) {
                //let param4={bankName:"123"},//开户行参数
                console.log(param);
                let param1 = {
                    "pageSize": "9999"
                }
                getOpeningBank(param1).then(res => {
                    if (res.code == "100") {
                        this.changeformItem.bankAdd = res.data;
                    }
                })
            },
            addFormItem_getChange(item){
                const stingR=eval('(' + item.value + ')')
                this.addFormItem.jgBankItem = stingR;
            },
            getChange_trantype(item){

            },
            //选中开户行确定的数据
            getChange(item) {
                this.bankString = item.value;
                this.getBankDotName();
            },
            //选中开户网点的名字
            getChangeDot(item) {
                const stingR=eval('(' + item.value + ')')
                this.changeformItem.returnBankItem = stingR;
                this.changeformItem.bankDot_placeholder = stingR.branchFullName;

            },
            //获取开户网点的数据
            getBankDotName() {
                if (this.Provinces == '' && this.city == '') return false
                const paramB = {};
                paramB.bankAbbreviation = this.bankString //银行名称
                paramB.bankBranchLineCity = this.Provinces //省
                paramB.prefectureLevel = this.city //市
                paramB.pageSize ="99999999"
                getBankDot(paramB).then(res => {
                    if (res.code == "100") {
                        this.bankDotList = res.data.list;
                    }
                })

            }, //银行所在地区
            // getCityOne(value, selectedData) {
                
            //     this.Provinces = selectedData[0].label
            //     this.city = selectedData[1].label
            //     if (selectedData.length == '2') {
            //         this.cityStringOne = selectedData[0].label + ',' + selectedData[1].label
            //     } else {
            //         this.cityStringOne = selectedData[0].label + ',' + selectedData[1].label + ',' + selectedData[2].label
            //     }
            //     this.getBankDotName();
            // },
            getCityOne(item) {
                 let labels=this.$refs['cascaderAddr'].currentLabels
                this.Provinces = labels[0]
                this.city = labels[1]
                    if (labels.length == '2') {
                        this.cityStringOne = labels[0] + ',' + labels[1]
                    } else {
                        this.cityStringOne = labels[0]+ ',' + labels[1] + ',' + labels[2]
                    } 
                this.getBankDotName();
            }
    },
    
    mounted(){
     
     this.searchM();
     this.getBan(); //开户行数据
    },
    
    created(){
   
    },
}

</script>
<style lang="less" >
 #daozhang .ivu-table-small td{
       height:20px!important;
      
       line-height:1!important;
 }
  #daozhang .ivu-table-cell{
    padding:0!important;
    margin:0!important;
  }
    #pp .ivu-select-dropdown{
           left: -77px!important;
     }
     #mo .ivu-form-item-content{
       margin-left: 0!important;
     }
</style>


