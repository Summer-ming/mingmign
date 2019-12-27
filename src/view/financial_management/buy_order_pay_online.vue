<!--
 * @Description: 采购单线上付款列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-09 15:10:51
 -->



<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form inline :model="formItem" :label-width="80">
        <Row>
          <i-Col span="24" id='nop'>
                <Tabs style="width:230px" type='line'  value="1" @on-click='tabM'>
                    <TabPane :label="label" name="1"></TabPane>
                    <TabPane :label="label1" name="2"></TabPane>  
                </Tabs>
            <!-- <FormItem label="订单类型:" style="margin-right:10px;">
            <Select  v-model='orderType' style="width:140px" placeholder="请选择订单类型" @on-change='getChange'>
              <Option  v-for='(item,index) in zhidanOrderType' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem> -->
          <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>
          </i-Col>
          <i-Col span="10">
             <Button style="margin-right:10px"  type='primary'  @click='payList()'>批量付款</Button>
             <Button  style="margin-right:10px" type='primary'  @click='payConfirmListDelete()'>批量删除</Button>

             <Button style="margin-right:10px" type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
              <p>总金额(元)：{{formItem.totalMoney}}</p>
              <p>总件数：{{formItem.totalNum}}</p>
              <span style="color:red">说明：用途会出现在兴业银行的回单的用途中</span>
          </i-Col>
        </Row>
        <Table  @on-selection-change="selectAllSelection" border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;" :page-size="formItem.length"   :total="totalM" show-total ></Page>
     </Form>
     </Card>    
      <!-- 选择付款账号 -->
     <Modal
        title="选择付款账号"
        v-model="modal"
        footer-hide 
        :mask-closable="false"  width='700px;' >
        <Form :label-width="140"  :model="formItem">
            <FormItem label="选中金额为（元）：" prop="name">
              <p style="color:red">{{formItem.totalMoney}}</p>
            </FormItem>
            <FormItem label="选中条数：" prop="name">
              <p style="color:red">{{formItem.totalNum}}</p>
            </FormItem>
         <FormItem label='选择付款银行账号：'>
           <Select @on-change="selectChange" v-model="formItem.cardType"  style="width:400px"  placeholder="请选择"   >
               <Option v-for="(item,index) in companyCardTypeListThis " v-if="item.type ==1"  :value="item.value"  :key="index" >{{ item.label }}</Option>
            </Select>
         </FormItem>
          </Form>
            <span style="color:red">说明：《线下制单付款成功》必须点击</span>
          <div class="margin-top-20">
    <Button style="margin-right:10px" v-show="true"  type="warning" @click="changeItem">提交制单</Button>
    <Button style="margin-right:10px"  type="primary" @click="payConfirmList">线下制单付款成功</Button>
    <Button  type="default" @click="modalCancel">取消</Button>
</div>
    </Modal>
    <!-- 增加客户弹窗 -->

     </div>
</template>

<script>
import {
  findJgJieSuanInfo,
  updateShopMoneyJieSuanMer,
  addCashFlow,
  updateJieSuanForStatus1,//添加流水
  addOrgMoneyRecord,
  updateOrgMoneyRecord,
  updateDaoZhangDanFJ,
  updateOrderStatus,
  findJgJieSuanInfoSellOrders,
  updateJiSuanPidBatch,
  addBillFlow,
  updateOtherMoneyBatch 
  } from '@/api/data'
import {updateOrder89} from '@/api/data_8889'
import {lengthList,companyCardTypeList} from '@/libs/global_type'
import {zhidan_fujian} from '@/api/data_4_8080'
import {zhidan_shanghai} from '@/api/data_5_8080'
import {zhidan} from '@/api/data_bank_8889'
import {getDiKouList} from '@/api/cusData'//返回抵扣列表
import {zhidanTypeLis} from '@/libs/allStatus'
import config from '@/config'
import axios from 'axios'

export default {
    name: 'buy_order_payment_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        countCai:0,
     
        countXiao:0,
  
      
        label: (h) => {
                    return h('div', [
                        
                        h('Badge', {
                            props: {
                                count:this.countCai
                            },
                           
                        },
                        [h('span', {
                          class:'demo-badge'
                        },'采购单 ')]
                        )
                    ])
                } ,
        label1: (h) => {
                    return h('div', [
                        // h('span', '销售单'),
                        h('Badge', {
                            props: {
                                count:this.countXiao
                            }
                        },
                        [h('span',{
                          class:'demo-badge'
                        },'销售单')]
                        )
                    ])
                } ,
        lengthListThis:lengthList,
        orderType:'1',
        //弹出框使用的数据
        modal:false,
        //弹出框使用的数据结束
        tableItem:{},
        zhidanOrderType:[
          {
                value: '1',
                label: '采购单'
            },
            {
                value: '2',
                label: '销售单'
            },
        ],
        selectionsList:[],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        companyCardTypeListThis:companyCardTypeList,
        jgBankName:"福建兴业银行",
        jgBankCode:'',
        formItem: {
          companyName:'',
          orderNo:'',
          payMony:'',
          dikouMoney:'',
          cardType:"",
          totalMoney:'',
          totalNum:'',
          length:10
          },
          columns4: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'ID',
                        key: 'jgJieSuanId',
                        align: 'center',
                        width:'60'
                    },
                     {
                        title: '收款公司名称',
                        key: 'skOrgName',
                        align: 'center',
                        width:'180'
                    },
                     {
                        title: '打款公司名称',
                        key: 'dkOrgName',
                        align: 'center',
                        width:'80',
                        render:(h,params) =>{
                          return h('div',{
                          },params.row.dkOrgName.substr(0,5))
                        }
                    },
                   {
                        title: '工程名称',
                        key: 'engineering',
                        align: 'center',
                        width:'180',
                        // render:(h,params) =>{
                        //   return h('div',{
                        //   },params.row.engineering.substr(0,5))
                        // }
                    },
                     {
                        title: '订单号',
                        key: 'orderNo',
                        align: 'center',
                        width:'180',
                        render:(h,params) =>{
                          return h('a',{
                           
                            on:{
                                click: () => {
                                  let p = {};
                                  p.id = params.row.orderId;
                                  p.ordersNo = params.row.orderNo;
                                  p.pictures=params.row.pictures
                                  if(this.orderType == "1")
                                  {//采购单
                                       sessionStorage.setItem('CAIGOU','')
                                         sessionStorage.setItem('CAIGOU',JSON.stringify(p))
                                           params.row.operateType  ="1"//查看
                                               const route = {
                                                  name: 'order_buy_info',
                                                  //query: p
                                                }
                                                this.$router.push(route)
                                  }
                                  else
                                  {
                                       p.operateType  ="1"//查看 销售单
                                                sessionStorage.setItem('XiaoShou','')
                                                sessionStorage.setItem('XiaoShou',JSON.stringify(p))
                                                    const route = {
                                                      name: 'sell_order_info',
                                                    }
                                                    this.$router.push(route)
                                  }
                                }
                            }
                          },params.row.orderNo);
                        }
                    },
                      {
                        title: '实际付款金额(元)',
                        key: 'actualApyMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.actualApyMoney))
                        }
                        
                    },
                     
                     {
                        title: '申请金额(元)',
                        key: 'money',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.money))
                        }
                        
                    },
                    
                      {
                        title: '用途',
                        key: 'yongtu',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.yongtuStatus){
                            return h('div', 
                             {
                               style:{
                                      'text-align':'left!important',
                                    },
                             },
                            [
                                h('Input', {
                                    props: {
                                      value:params.row.yongtu,
                                    },
                                    style:{
                                      "width":"140px",
                                      'text-align':'left!important'
                                    },
                                    on: {
                                         'on-blur':(event) =>{
                                          this.data1[params.index].yongtu = event.target.value

                                      }
                                    }
                                }, ),
                                 h('Icon', {
                                    props: {
                                        type: 'md-checkmark',
                                        "size":'25'
                                    },
                                    on: {
                                        click: () => {
                                          console.log("对号，修改用途")
                                          this.updateBusinessYongtu(params.row,params.row.yongtu);
                                          this.data1[params.index].yongtuStatus = false

                                        }
                                    }
                                }, ),
                                 h('Icon', {
                                    props: {
                                        type: 'md-close',
                                        "size":'25'
                                    },
                                    style:{
                                      "size":'25px'
                                    },
                                    on: {
                                        click: () => {
                                          console.log("对号，关闭不修改")

                                          this.data1[params.index].yongtuStatus = false
                                        }
                                    }
                                }, ),
                             ]);
                          }else{
                             return h('a',{
                               style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'50px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"50px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    console.log("点击了修改");
                                    this.data1[params.index].yongtuStatus = true
                                    console.log(this.data1[params.index].yongtuStatus)
                                  }
                                }
                              },params.row.yongtu)
                          }
                        }
                    },
                     {
                        title: '制单备注',
                        key: 'note',
                        align: 'center',
                        width:'200',
                        render:(h,params)=>{
                          if(params.row.noteStatus){
                            return h('div', 
                             {
                               style:{
                                      'text-align':'left!important',
                                    },
                             },
                            [
                                h('Input', {
                                    props: {
                                      value:params.row.note,
                                    },
                                    style:{
                                      "width":"140px",
                                      'text-align':'left!important'
                                    },
                                    on: {
                                         'on-blur':(event) =>{
                                          this.data1[params.index].note = event.target.value

                                      }
                                    }
                                }, ),
                                 h('Icon', {
                                    props: {
                                        type: 'md-checkmark',
                                        "size":'25'
                                    },
                                    on: {
                                        click: () => {
                                          this.updateBusinessNote(params.row,params.row.note);
                                          this.data1[params.index].noteStatus = false

                                        }
                                    }
                                }, ),
                                 h('Icon', {
                                    props: {
                                        type: 'md-close',
                                        "size":'25'
                                    },
                                    style:{
                                      "size":'25px'
                                    },
                                    on: {
                                        click: () => {
                                          console.log("点击事件xx")

                                          this.data1[params.index].noteStatus = false
                                        }
                                    }
                                }, ),
                             ]);
                          }else{
                             return h('a',{
                               style:{
                                      'display':'block',
                                      "width":"200px",
                                      "height":'50px',
                                      "border-bottom":"1px solid  #ccc",
                                      "line-height":"50px",
                                      "text-align":"center",
                                    },
                                on:{
                                  'click':(event)=>{
                                    this.data1[params.index].noteStatus = true
                                  }
                                }
                              },params.row.note)
                          }
                        }
                    },
                     {
                        title: '业务备注',
                        key: 'businessNote',
                        align: 'center',
                        width:'140'
                    },
                     {
                        title: '申请时间',
                        key: 'createTime',
                        align: 'center',
                        width:'140'
                    },
                     {
                        title: '管理员',
                        key: 'userName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '类型',
                        key: 'jgJieSuanOperatorType',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{

                          },zhidanTypeLis(params.row.jgJieSuanOperatorType))
                        }
                    },
                      {
                        title: '实际抵扣金额 (元)',
                        key: 'dikouMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dikouMoney))
                        }
                    },
                      {
                        title: '申请抵扣金额 (元)',
                        key: 'updateDiKou',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.updateDiKou))
                        }
                    },
                     {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'200',
                        fixed:"right",
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
                                          this.zuoFei(params.row)
                                        }
                                    }
                                }, '去抵扣'),

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
                                            this.instance('warning',params.row)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    directives:[//render隐藏方法
                                      {
                                        'name':'show',
                                        value:params.row.jgJieSuanOperatorType =="5"?true:false
                                      }
                                    ],
                                    on: {
                                        click: () => {
                                          this.gotoPomList(params.row);
                                        }
                                    }
                                }, '查看杂费信息'),
                             ]);
                    }
                        
                    },
                    
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      //tableq切换
      tabM(name){
          console.log('我是测试table')
          console.log(name)
          this.orderType=name;
          this.searchM();
          // if(name=='1'){
          //    this.countXiao=0;
          // }else if(name=='2'){
          //    this.countCai=0;
            
          //    this.countXiao=this.countXiao
          // }
      },
      gotoPomList(row){
         sessionStorage.setItem('SELL_OM_ZHIDAN_ITEM','')
        sessionStorage.setItem('SELL_OM_ZHIDAN_ITEM',JSON.stringify(row))
            const route = {
                name: 'pay_oMoney_list',
              }
              this.$router.push(route)
      },
      updateBusinessYongtu(row,value){//修改制单用途
        let p                = {};
        let plist            = [];
        let dic              = {};
            dic.id           = row.jgJieSuanId;
            dic.yongtu = value;
        plist.push(dic);
        p.jieSuanPidList = plist;
        updateJiSuanPidBatch(p).then(res =>{
              if(res.code =='100'){
                this.$Notice.success({
                  title:'修改制单用途成功',
                  duration:1,
                  onClose:res =>{
                     this.searchM();
                  }
               })
            }else{
                 this.$Notice.error({
                 title:'修改制单用途失败'
                })
            }
         })
      },
      updateBusinessNote(row,value){//修改制单备注
        console.log("updateBusinessNote")
        let p                = {};
        let plist            = [];
        let dic              = {};
            dic.id           = row.jgJieSuanId;
            dic.note = value;
        plist.push(dic);
        p.jieSuanPidList = plist;
        updateJiSuanPidBatch(p).then(res =>{
              if(res.code =='100'){
                this.$Notice.success({
                  title:'修改制单备注成功',
                  duration:1,
                  onClose:res =>{
                     this.searchM();
                  }
               })
            }else{
                 this.$Notice.error({
                 title:'修改制单备注失败'
                })
            }
         })
      },
      //查看银行账号
       instance (type,row) {
                const title = '请核对打款银行信息';
                let content = ''

         if(this.orderType=="1")//采购单
         {
           content = '<p>收款公司名称:'+row.skOrgName+'</p><p>卡号:'+row.bankNo+'</p><p>支行全称:'+row.bankZhiHang+'</p><p>收款行号:'+row.serialNumber+'</p><p>银行简称:'+row.bankAbbreviation;
         }
         else //销售单
         {
           content = '<p>收款公司名称:'+row.skOrgName+'</p><p>卡号:'+row.tbankNo+'</p><p>支行全称:'+row.tbankZhiHang+'</p><p>收款行号:'+row.tserialNumber+'</p><p>银行简称:'+row.tbankAbbreviation;
         }
                switch (type) {
                    case 'warning':
                        this.$Modal.warning({
                            title: title,
                            content: content
                        });
                        break;
                }
            },
      getChange(item){
        console.log(item);
      },
      //去作废抵扣
      zuoFei(row){
        //没有勾选不能作废
        // if(this.selectionsList.length<=0){
        //   alert('请去勾选')
        //   return false
        // }
        //弹出来的弹窗
        this.$Modal.confirm({
             title: '去抵扣',
             content: '是否要抵扣?',
             onOk:()=>{
                 let param1={};
                 param1.jgJieSuanId=row.jgJieSuanId;
                 param1.jgJieSuanCaoZuoStatus='0';
                 getDiKouList(param1).then(res=>{
                      if(res.code =="100"){
                         this.reloadSelf();
                        }  
                  })
             },
             onCancel:()=>{},

        })


            
      },





      selectChange(item){
        console.log(item);
        if(item  == "1"){
            this.jgBankName =  this.companyCardTypeListThis[0].bankNo;
            this.jgBankCode = this.companyCardTypeListThis[0].bankCode
        }else if(item  == "2"){
           this.jgBankName =  this.companyCardTypeListThis[1].bankNo;
            this.jgBankCode = this.companyCardTypeListThis[1].bankCode
        }
      },

      selectAllSelection(data){//全选变化
        console.log(data);
        this.selectionsList  =data;
        console.log('我是选中的值')
        console.log(this.selectionsList)
        let tm = 0;
        //全选有变化时赋值
        data.map(item=>{
          tm = this.$global.accAdd(tm,item.actualApyMoney)
        })
        this.formItem.totalMoney = this.$global.isMoneyShow(tm);
        this.formItem.totalNum = data.length; 
      },
      //线下付款成功
      //下面是采购单申请时的步骤
      //步骤1 修改结算单状态
      //步2 添加到客户流水中
      //步3 如果是提现，修改提现的绑定信息为可用
      //步4 如果是到账单提现，修改提现对应的到账单的信息
      //步5 修改订单的收款金额，方便后期查询统计 ；不一定触发
      //步6 客户通过订单提现
      //步7 供应商通过订单提现
      
      //下面是销售单申请时的步骤；销售单申请只负责打款给供应商杂费
      //步骤1  同
      //步骤2 同
      //步骤3 同
      //步骤4 同
      //步骤5 修改订单的收款金额，方便后期查询统计 ；不一定触发 换成
      payConfirmList(){//批量确认付款 TODO
          //这是公共部分，都会调用
          this.unLineStep1OK();//修改制单表状态
          this.unLineStep2OK();//添加流水到 公司流水表
          this.unLineStep3OK();//修改流水表数据的信息，根据row.orgnizations 里面的数组
          this.unLineStep4OK();//修改到账单信息
          if(this.orderType == "1"){//采购单
              
              this.unLineStep5Ok();//修改采购单提现金额
              this.unLineStep7Ok();//修改采购单 提现金额
              this.payOnlineBusiness(); //制单付款线上付款

          }else{                    //销售单
            this.unLineStep6Ok();//修改销售单 提现金额
              //销售单 付款杂费
            this.unLineStep9Ok();//修改销售单的杂费总额。当付款类型是杂费付款时
            this.unLineStep10Ok();//修改杂费表单的已付款金额

          }
        
      },
      //2019年10月14日 星期一 新增
       unLineStep9Ok(){// 修改销售单的杂费总额。当付款类型是杂费付款时
          let p = {};
          let plist = [];
          console.log(this.selectionsList)
          this.selectionsList.map(item =>{
          
            if(item.orgnizations.length>0){
              item.orgnizations.map(oitem =>{
                    let d = {};
                    d.id= oitem.orderId;
                    d.payOtherMoney = oitem.outMoney
                    d.otherDikouMoney = oitem.dikouMoney;//修改销售单的 优惠金额
                   if(item.jgJieSuanOperatorType == "5"){
                        plist.push(d);
                    }
              })
            }
           
          })
          p.pageUpdateOrderList = plist;
          if(plist.length<=0){
            return false;
          }
          console.log(p);
          updateOrder89(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改订单杂费付款金额成功',
                 })
              }else{
                   this.$Notice.error({
                   title:'修改订单杂费付款金额失败'
                  })
              }
           })
      },
       unLineStep10Ok(){// 修改销售单的杂费总额。当付款类型是杂费付款时
          let p = {};
          let plist = [];
          console.log(this.selectionsList)
          this.selectionsList.map(item =>{
          
            if(item.orgnizations.length>0){
              item.orgnizations.map(oitem =>{
                    let d               = {};
                        d.id            = oitem.otherMoneyId;
                        d.paymentMoney  = oitem.outMoney
                        d.paymentStatus = '8';                 //已付款
                        d.dikouMoney    = oitem.dikouMoney;    //优惠金额
                   if(item.jgJieSuanOperatorType == "5"){
                        plist.push(d);
                    }
              })
            }
           
          })
          p.updateOtherMoneyBatch = plist;
          if(plist.length<=0){
            return false;
          }
          console.log(p);
          updateOtherMoneyBatch(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改订单杂费付款金额成功',
                 })
              }else{
                   this.$Notice.error({
                   title:'修改订单杂费付款金额失败'
                  })
              }
           })
      },
      // 2019年10月14日 星期一 新增结束
      payOnlineBusiness(){//制单付款线上付款
          let p                     = {};
          let plist                 = [];
          this.selectionsList.map(item=>{
                let dic                   = {};
              dic.billType          = '20050';  //账单类型
              dic.fsMoney           = this.$global.accMinus(0,item.actualApyMoney);  //发生金额
              dic.ysMoney           = '0';  //应收金额
              dic.dkpMoney          = '0';  //待开票金额

              dic.sellerEmpDept     = '';  //卖家负责人部门
              dic.sellerCompanyId   = item.merchantsId;  //卖家公司id
              dic.sellerCompanyName = item.merchantsName;  //卖家公司名称
              dic.sellerEmpName     = '';  //卖家负责人名称

              dic.buyerEmpDept      = '';  //买家负责人部门 本公司
              dic.buyerCompanyId    = item.customerOrgId;  //买家公司id
              dic.buyerEmpName      = this.$global.adminInfo.cname;  //买家负责人名称
              dic.buyerCompanyName  = item.customerOrgName;  //买家公司名称

              dic.orderId           = item.orderId;  //订单id
              dic.orderNo           = item.orderNo;  //订单号

              dic.accApply          = '';  //打款申请
              dic.dkApply           = '';  //抵扣申请
              dic.txApply           = '';  //提现申请
              dic.kpApply           = '';  //开票申请
              dic.zxStatus          = '1';  //注销状态
              dic.note              = '提现账单';  //备注
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
      unLineStep7Ok(){//供应商通过订单提现，修改订单的提现金额，方便后期查询统计,类型是销售单付款的才更新
        //operator_type = 4 供应商退款,zhidan表；流水表 pay_money_type =11 采购单2次打款，也可以说是提现
        //客户和销售单相关
          let p = {};
          let plist = [];
          this.selectionsList.map(item =>{
          
            if(item.orgnizations.length>0){
              item.orgnizations.map(oitem =>{
                    let d = {};
                    d.id= oitem.orderId;
                    d.tixianSMoney = oitem.outMoney
                   if(item.jgJieSuanOperatorType == "4" && oitem.payMoneyType == "11"){
                        plist.push(d);
                    }
              })
            }
           
          })
          p.pageUpdateOrderList = plist;
          console.log(plist);
          if(plist.length<=0){
            return false;
          }
          updateOrderStatus(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改订单收款金额成功',
                 })
              }else{
                   this.$Notice.error({
                   title:'提交付款申请失败'
                  })
              }
           })
      },
      unLineStep6Ok(){//客户通过订单提现，修改订单的收款金额，方便后期查询统计,类型是采购单付款的才更新
        //operator_type = 3 客户退款,zhidan表；流水表 pay_money_type =13 销售单提现
        //客户和销售单相关
          let p = {};
          let plist = [];
          this.selectionsList.map(item =>{
          
            if(item.orgnizations.length>0){
              item.orgnizations.map(oitem =>{
                    let d = {};
                    d.id= oitem.orderId;
                    d.tixianSMoney = oitem.outMoney
                   if(item.jgJieSuanOperatorType == "3" && oitem.payMoneyType == "13"){
                        plist.push(d);
                    }
              })
            }
           
          })
          p.pageUpdateOrderList = plist;
          console.log(plist);
          if(plist.length<=0){
            return false;
          }
          updateOrder89(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改订单收款金额成功',
                 })
              }else{
                   this.$Notice.error({
                   title:'提交付款申请失败'
                  })
              }
           })
      },
      unLineStep5Ok(){//修改订单的收款金额，方便后期查询统计,类型是采购单付款的才更新
          let p = {};
          let plist = [];
          this.selectionsList.map(item =>{
            let d = {};
            d.id= item.orderId;
            d.receivedMoney = item.actualApyMoney
            d.payMoneyStatus = "8"
            if(item.jgJieSuanOperatorType == "1"){
              plist.push(d);
            }
          })
          p.pageUpdateOrderList = plist;
          if(plist.length<=0){
            return false;
          }
          updateOrderStatus(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改订单收款金额成功',
                 })
              }else{
                   this.$Notice.error({
                   title:'提交付款申请失败'
                  })
              }
           })
      },
      unLineStep4OK(){
         let inList = [];
          this.selectionsList.map(item =>{
            if(item.orgnizations.length>0){
              inList.push.apply(inList,item.orgnizations)
            }
          })

          if(inList.length <=0){ //无数据 不提交
            return false;
          }
           let plist = [];
          inList.map(item =>{
            let ds =  {};
            ds.daozhangdanId = item.daozhangdanId;
            ds.dealMoney = item.outMoney;
            if(item.payMoneyType == "12"){
              plist.push(ds);
            }
          })
          
          let p  = {};
          p.bankJgId = inList[0].bankJgId;
          p.customerId = "";//有可能有多个id，所以不传
          p.userId = this.$global.adminInfo.id;

          p.pageDaoZahangDanForUpdateList = plist
          updateDaoZhangDanFJ(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改到账单成功',
                    onClose:res =>{
                       console.log('关闭时回调')
                    }
                 })
              }else{
                   this.$Notice.error({
                   title:'修改到账单失败'
                  })
              }
           })
      },
      unLineStep3OK(){
          let inList = [];
          this.selectionsList.map(item =>{
            if(item.orgnizations.length>0){
              inList.push.apply(inList,item.orgnizations)
            }
          })

          if(inList.length <=0){ //无数据 不提交
            return false;
          }

          let plist = [];
          inList.map(item =>{
            let ds =  {};
            ds.id = item.id;
            ds.status = 1
            plist.push(ds);
          })
          
          let p  = {};
          p.list = plist
          updateOrgMoneyRecord(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改流水状态成功',
                    onClose:res =>{
                       console.log('关闭时回调')
                    }
                 })
              }else{
                   this.$Notice.error({
                   title:'修改流水状态失败'
                  })
              }
           })
      },
      unLineStep1OK(){
          let plist = [];
          this.selectionsList.map(item=>{
              let dic = {};
              dic.jieSuanId = item.jgJieSuanId;
              plist.push(dic)
          })
          let p  ={};
          p.status = "8";
          p.payTime = this.$global.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss");
          p.payAdminId = this.$global.adminInfo.id
          p.payAdminCname = this.$global.adminInfo.cname
          p.pageCustomerStatuses = plist;
          updateJieSuanForStatus1(p).then(res =>{
                            if(res.code =='100'){
                                this.$Notice.success({
                                      title:'确认付款成功',
                                })
                            }else{
                                this.$Notice.error({
                                    title:'确认付款失败'
                                })
                            }
                        })
      },
      unLineStep2OK(){//走线下确认付款成功后，
      // this.selectionsList.map
            let p                   = {};
            let plist               = [];
            this.selectionsList.map(item=>{
                  let dic                 = {};
                    dic.customerId      = ""
                    dic.orderId         = item.orderId;
                    dic.inMoney         = "0";
                    dic.outMoney        = item.actualApyMoney;
                    dic.currentMoney    = "0"
                    dic.userId          = this.$global.adminInfo.id

                    if(item.jgJieSuanOperatorType =="3" ){//3客户退款
                      dic.payMoneyType    = "15"

                    }
                    else if(item.jgJieSuanOperatorType =="2"){//2采购单杂费退款
                      dic.payMoneyType    = "16"

                    }
                     else if(item.jgJieSuanOperatorType =="5"){//5销售单杂费退款
                      dic.payMoneyType    = "17"
                      dic.dikouMoney      = item.dikouMoney//杂费的优惠金额
                    }
                    else{
                      dic.payMoneyType    = "1"

                    }
//                     //付款的类型1:采购单合同付款2：采购单杂费付款
// 3：客户退款
// 4：供应商退款
                    dic.note            = '';
                    dic.orderNo         = item.orderNo;
                    dic.bankJgId        = item.bankJgId
                    dic.orgId           = item.skOrgId;
                    dic.orgName         = item.skOrgName;
                    dic.daozhangdanId   = '0'
                    dic.bankConnectedId = '0'
                    dic.zhidanApplyId   = item.jgJieSuanId;
                    dic.zhaiyao         = ''
                    dic.direction        = ''
                    dic.type        = '2';//角色类型：1:客户；2：供应商
                    dic.status        = '1'

                plist.push(dic);
                p.list = plist;
            })
           
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
      payConfirmListDelete(){//批量确认删除 TODO
          let plist = [];
          this.selectionsList.map(item=>{
              let dic = {};
              dic.jieSuanId = item.jgJieSuanId;
              plist.push(dic)
          })
          let p  ={};
          p.status1 = "0";

          p.pageCustomerStatuses = plist;

          this.$Modal.confirm({
                     title:"确定需要删除吗",
                     onOk:()=>{
                        updateJieSuanForStatus1(p).then(res =>{
                            if(res.code =='100'){
                                this.$Notice.success({
                                      title:'删除成功',
                                      duration:2,
                                      onClose:res =>{
                                        this.reloadSelf();
                                  }
                                })
                            }else{
                                this.$Notice.error({
                                    title:'删除失败'
                                })
                            }
          })
                     }
                   })
      },
      payList(){//批量付款
      //如果没有勾选不弹出对话框
       if(this.selectionsList.length==0){
            this.$Message.warning('请选择一条数据')
            return false;
          }
        this.modal = true;
        //计算选中的总计金额
      },
      setItemInfo(row){//给弹出框赋值
          this.formItem.orderNo = row.orderNo
          this.formItem.payMony = parseFloat(row.jgJieSuanMoney)
          this.formItem.dikouMoney= parseFloat(row.updateDiKou)
      },
      changeItem(){//TODO:
          console.log("选择银行卡类型"+this.formItem.cardType);
          console.log("判断勾选的店铺是否已经绑定银行卡，未绑定不可以提交")
          //判断是否勾选了数据，没有勾选不可提交
          console.log(this.selectionsList.length);
          if(this.selectionsList.length==0){
            this.$Notice.warning({
                       title   : '不可提交,请勾选一条数据',
                       desc:ostr
             })
            return false;
          }
          let isAdd = 0;//判断是否可以提交 如果是0可以提交，
          let ostr='';
          this.selectionsList.map(item=>{
            if(item.serialNumber && item.serialNumber!=''&&item.serialNumber!=null){
            }else{
              isAdd ++;
              ostr = ostr+','+item.skOrgName
            }
          })
          if(isAdd>0){
             this.$Notice.warning({
                       title   : '不可提交,以下公司店铺未绑定银行卡',
                       desc:ostr
             })
             return false;
          }
         
          if(this.formItem.cardType == "1"){//福建兴业
            this.fujian_zhidan();
          }
          else if(this.formItem.cardType =="2"){//上海兴业
            this.shanghai_zhidan();
          }
          else if(this.formItem.cardType =="3"){//杭州银行 上海
            this.zhidan_hangzhou();
          }
          else{
             this.$Notice.warning({
                       title   : '请选择一张银行卡',
                       duration: 1
             })
          }
      },
      zhidan_hangzhou(){//杭州银行制单 杭州制单
        let a = 'http://10.100.16.65:8889/jgerp-hz-YQZL/';
        // let a = 'http://10.100.16.4:8889/jgerp-hz-YQZL/';

        const baseUrl = process.env.NODE_ENV === 'development' ? a : config.baseUrl.HZbank_SH
        let p  ={};
        let plist= [];
          this.selectionsList.map(item =>{
            console.log(item.jgJieSuanId)
            let dic                  = {};
            dic.payerCorpName     = "上海市闽航电子商务有限公司"                //付款单位名称 我司名称
            dic.jiesuanId         = item.jgJieSuanId  //系统结算id
            dic.payeeAccName      = item.skOrgName                //收款人户名
            dic.payeeBankName     = item.bankZhiHang                //收款人银行支行全称
            dic.payeeBankCode     = item.serialNumber                //收款银行人行联行号
            dic.payeeAccNo        = item.bankNo                //收款人账号
            dic.payMoney          = this.$global.accPrecision(item.actualApyMoney,2)                // 付款金额2位小数点
            dic.payPurpose        = "货款"                //付款用途 “货款”
            dic.rmk               = item.note                //付款附言最大50个汉字
            dic.erpReqUser        = ""                //
            dic.retCode           = ""                //
            dic.retMsg            = ""                //
            dic.type              = "0"               //
            dic.bankConnectedType = "3"                // 3:上海杭州 7 福建杭州
            dic.isErpCode         = "1"               //                                    
            plist.push(dic);
          })
        p.pagePayList = plist;
        
        axios({
          url:baseUrl+'pay/zhidanSH',
          method:'post',
          data:p
        })
        .then((res)=>{
          console.log("获取到结果")
          console.log(res);
          let resData =res.data;
          if(resData.code =='100'){
            this.$Notice.success({
              title:'提交上海杭州银行制单申请成功',
              duration:1,
              onClose:res =>{
                 console.log('关闭时回调')
                // this.reload();
              }
            })
          }else{
            this.$Notice.error({
              title:'提交上海杭州银行制单申请失败'
            })
          }
        })
        .catch((res)=>{
          console.log("获取失败")
          console.log(res);
          this.$Notice.error({
              title:'请联系管理员',
              desc:res
            })
          
        })
      },
     
      fujian_zhidan(){//福建制单接口
       let param = {};
        //处理数据
        let jgJieSuanIds      = ''
        let orderIdString     = ''
        let orderNoString     = ''
        let payTypeString     = ''
        let payUserIdString   = ''
        let payUserNameString = ''
        this.selectionsList.map(dic=>{
          dic.payType       = "10000";
          dic.guserId       = this.$global.adminInfo.id;
          dic.guserName     = this.$global.adminInfo.cname
          jgJieSuanIds      = (jgJieSuanIds=='')?dic.jgJieSuanId :jgJieSuanIds+','+dic.jgJieSuanId//结算单id
          orderIdString     = (orderIdString=='')?dic.orderId :orderIdString+','+dic.orderId//订单id
          orderNoString     = (orderNoString=='')?dic.orderNo :orderNoString+','+dic.orderNo//订单号
          payTypeString     = (payTypeString=='')?dic.payType :payTypeString+','+dic.payType//制单类型
          payUserIdString   = (payUserIdString=='')?dic.guserId :payUserIdString+','+dic.guserId//制单申请人id
          payUserNameString = (payUserNameString=='')?dic.guserName :payUserNameString+','+dic.guserName//制单申请人姓名
        })
        param.jgJieSuanIds      = jgJieSuanIds;
        param.orderIdString     = orderIdString;
        param.orderIds          = orderIdString;
        param.orderNoString     = orderNoString;
        param.payTypeString     = payTypeString;
        param.payUserIdString   = payUserIdString;
        param.payUserNameString = payUserNameString;
        param.userId            = this.$global.adminInfo.id;

        // let url = 'http://10.100.16.4:8080/jg/orders/zhidan'//线上接口
        //development 测试模式
let url = process.env.NODE_ENV === 'development' ? 'http://10.100.16.65:8083/jg/orders/zhidan' : config.baseUrl.zhidan_FJ

        // let url = 'http://10.100.16.65:8083/jg/orders/zhidan' //测试地址
         this.$http.jsonp(url,{params:param,jsonp:'callback',jsonpCallback:'successCallback'})
                        .then(function(res){
                          console.log("请求成功");
                          if(res.body =="100"){
                            this.$Notice.success({
                              title:'提交制单成功',
                                duration:1,
                            })
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
      },
      shanghai_zhidan(){//上海制单接口TODO
        let param = {};
        //处理数据
        let jgJieSuanIds      = ''
        let orderIdString     = ''
        let orderNoString     = ''
        let payTypeString     = ''
        let payUserIdString   = ''
        let payUserNameString = ''
        this.selectionsList.map(dic=>{
            dic.payType = "10000";
            dic.guserId       = this.$global.adminInfo.id;
            dic.guserName     = this.$global.adminInfo.cname
            jgJieSuanIds      = (jgJieSuanIds=='')?dic.jgJieSuanId :jgJieSuanIds+','+dic.jgJieSuanId//制单申请单id
            orderIdString     = (orderIdString=='')?dic.orderId :orderIdString+','+dic.orderId//订单id
            orderNoString     = (orderNoString=='')?dic.orderNo :orderNoString+','+dic.orderNo//订单号
            payTypeString     = (payTypeString=='')?dic.payType :payTypeString+','+dic.payType//付款类型
            payUserIdString   = (payUserIdString=='')?dic.guserId :payUserIdString+','+dic.guserId//管理员id
            payUserNameString = (payUserNameString=='')?dic.guserName :payUserNameString+','+dic.guserName//管理员名称
        })
        param.jgJieSuanIds      = jgJieSuanIds;
        param.orderIdString     = orderIdString;
        param.orderIds          = orderIdString;
        param.orderNoString     = orderNoString;
        param.payTypeString     = payTypeString;
        param.payUserIdString   = payUserIdString;
        param.payUserNameString = payUserNameString;
        param.userId            = this.$global.adminInfo.id;
          // let url = 'http://10.100.16.5:8080/niubee/orders/zhidan'
          // let url = 'http://10.100.16.65:88/niubee/orders/zhidan'//测试地址
          // development 是测试模式
          let a = 'http://10.100.16.5:8080/jgerpSH/orders/zhidan'; //线上地址
          // let a = 'http://10.100.16.65:88/niubee/orders/zhidan'; //测试地址
          

        let url = process.env.NODE_ENV === 'development' ? a : config.baseUrl.zhidan_SH

          console.log(param);
         this.$http.jsonp(url,{params:param,jsonp:'callback',jsonpCallback:'successCallback'})
                        .then(function(res){
                          console.log("请求成功");
                          if(res.body =="100"){
                            this.$Notice.success({
                              title:'提交制单成功',
                                duration:1,
                            })
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
      },
      modalCancel(){
        this.modal = false;
      },
      addNew(){
        console.log("开始添加")
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
         param.jgJieSuanCaoZuoStatus = "1";
         param.beginStatus = "1";
         param.endStatus = "999999";
         param.orderType = this.orderType;
         param.pageSize              = this.formItem.length;
         
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         if(param.orderType == "1"){//采购单
              findJgJieSuanInfo(param).then(res=>{
                if(res.code =="100"){
                   res.data.list.map(item=>{
                      item.noteStatus = false;
                      item.yongtuStatus = false;
                    })
                this.data1=res.data.list;
                this.countCai=res.data.total
                this.totalM=res.data.total; 
              }else{
                 this.$Notice.warning({
                             title:'当前无数据',
                          })
              }  
            })
         }else{
                findJgJieSuanInfoSellOrders(param).then(res=>{
                  if(res.code =="100"){
                     res.data.list.map(item=>{
                      item.noteStatus = false;
                      item.yongtuStatus = false;
                    })
                  this.data1=res.data.list;
                  this.totalM=res.data.total; 
                
                  this.countXiao=res.data.total
                }else{
                   this.$Notice.error({
                             title:'当前无数据',
                          })
                }  
              })
           
         }
         
       },
       searCHSello(){//本方法，仅用来查询销售单有多少条
              //获取查询的input的值
         let param                       = {};
             param.pageNum               = '1'                    //分页
             param.jgJieSuanCaoZuoStatus = "1";
             param.beginStatus           = "1";
             param.endStatus             = "999999";
             param.orderType             = '2';
             param.pageSize              = this.formItem.length;
             findJgJieSuanInfoSellOrders(param).then(res=>{
                  if(res.code =="100"){
                  this.countXiao=res.data.total
                } 
              })
       },
    },
    
    mounted(){
      
     this.searchM();//默认查询采购
      
      this.searCHSello();//查询销售单的数量
    },
    
    created(){
      
    },
}

</script>
<style <style lang="less">
#nop .ivu-tabs{
  width: 200px;
  display: inline-block;
}
.ivu-tabs-nav .ivu-tabs-tab-active{
    background:#2d8cf0!important;
    color:#fff;
}
.ivu-tabs-tab-active:hover{
    color:#fff!important;
}
  .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
       .demo-badge{
        width: 60px;
        height: 20px;
        display: inline-block;
    }
    
</style>
