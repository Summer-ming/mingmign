/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-05-14 17:15:28 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-06-11 14:03:10
 */
<!--
 * @Description: 客户余额表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->
<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <i-Col span="24">
           <FormItem label="公司名称:">
            <Select v-model="orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDianOrg'  :label-in-value='true'>
               <Option v-for="(item,index) in orgList" :value="JSON.stringify(item)" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>

          <FormItem label="本公司抬头:">
            <Select v-model="formItem.taitou"  style="width:200px"  placeholder="请选择"  :label-in-value='true' @on-change='getTaiTou' >
               <Option v-for="(item,index) in bankList " :value="JSON.stringify(item)" :label="item.label" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>


          </i-Col>
        
          <i-Col span="3">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </i-Col>
        </Row>
        <Table height="440" border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            <!-- <div slot="footer" style="height:100px">
              <td style="width:660px">合计</td>
              <td style="width:100px;text-align: center;">11</td>
              <td style="width:100px">-</td>
              <td style="width:100px;text-align: center;">2222</td>
            </div> -->
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>
      <!-- 选择资订单退款客户源弹窗 -->
      <popup :choseItem="choseItem" :message="showTrue" v-on:mychild="showmess" v-on:mychildOne='showN'></popup>

      <Modal v-model="modal" footer-hide title="订单退客户款"  :z-inde="9999" width="1100" :styles="{top:'10px'}" >
             <!-- 这里的form卡 -->
        <Form :label-width="120" inline :model="cusForm">
            <FormItem label="公司名称:" >
              <p>{{cusForm.companyName}}</p>
            </FormItem>
            <FormItem label="退款银行名称:" >
              <p>{{cusForm.bankName}}</p>
            </FormItem>
              <FormItem label="退款银行卡号:" >
              <p>{{cusForm.bankNo}}</p>
            </FormItem>
              <FormItem label="退款银行bblID:" >
              <p>{{cusForm.bblId}}</p>
            </FormItem>
            <br>
            
            <FormItem label="退款金额:" >
              <i-input   style="width:180px" v-model="cusForm.money" />
            </FormItem>
            <FormItem label="备注:" >
              <i-input   style="width:180px" v-model="cusForm.note" />
            </FormItem>
        </Form>

        <!-- 新加资源按钮 -->
        <Row style='margin-bottom:10px;margin-left:40px'>
          <Button type="primary" @click='addZiYuan'>选择添加资源</Button>
        </Row>

        <!-- 选择添加资源的table -->
        <Row>
             <Table :columns="columnOne" :data="dataOne"></Table>
        </Row>
     <!-- modal底部按钮 -->
        <div class="margin-top-20">
            <Button style="margin-right:10px"  type="primary" @click="getAdd" >添加</Button>
            <Button  type="default" @click="modalCancel">取消</Button>
        </div>
        
       
     </Modal>
       <!-- 选择订单退款供应商资源弹窗 -->
     <popup :message1="showTrueBB" v-on:mychild1="showmessBB" v-on:mychildOne1='showNBB'></popup>
     <Modal v-model="modal1" title="订单退供应商款" footer-hide :z-inde="9999" width="1100" :styles="{top:'10px'}" >
             <!-- 这里的form卡 -->
          <Form :label-width="120" inline :model="cusForm">
              <FormItem label="公司名称:" >
                <p>{{cusForm.companyName}}</p>
              </FormItem>
              <FormItem label="退款银行名称:" >
                <p>{{cusForm.bankName}}</p>
              </FormItem>
                <FormItem label="退款银行卡号:" >
                <p>{{cusForm.bankNo}}</p>
              </FormItem>
                <FormItem label="退款银行bblID:" >
                <p>{{cusForm.bblId}}</p>
              </FormItem>
              <br>
                <FormItem label="收款店铺:">
                  <Select v-model="shopSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
                    <Option v-for="(item,index) in shopList" :value="JSON.stringify(item)" :label="item.name" :key="index" >{{ item.name }}</Option>
                  </Select>
                </FormItem>
              <FormItem label="退款金额:" >
                <i-input   style="width:180px" v-model="cusForm.money" />
              </FormItem>
              <FormItem label="备注:" >
                <i-input   style="width:180px" v-model="cusForm.note" />
              </FormItem>
          </Form>

        <!-- 新加资源按钮 -->
          <Row style='margin-bottom:10px;margin-left:40px'>
            <Button type="primary" @click='addZiYuanBB'>选择添加资源</Button>
          </Row>
            <!-- 选择添加资源的table -->
          <Row>
              <Table :columns="columnTwo" :data="dataTwo"></Table>
          </Row>
      <!-- modal底部按钮 -->
          <div class="margin-top-20">
              <Button style="margin-right:10px"  type="primary" @click="getAddTwo" >添加</Button>
              <Button  type="default" @click="modalCancel">取消</Button>
          </div>
     </Modal>

     <!--到账单退款客户 选择资源弹窗  -->
     <Modal v-model="modal2" title="到账单退款客户" footer-hide :z-inde="9999" width="1100" :styles="{top:'10px'}" >
             <!-- 这里的form卡 -->
      <Form :label-width="120" inline :model="cusForm">
          <FormItem label="公司名称:" >
            <p>{{cusForm.companyName}}</p>
          </FormItem>
          <FormItem label="退款银行名称:" >
            <p>{{cusForm.bankName}}</p>
          </FormItem>
            <FormItem label="退款银行卡号:" >
            <p>{{cusForm.bankNo}}</p>
          </FormItem>
            <FormItem label="退款银行bblID:" >
            <p>{{cusForm.bblId}}</p>
          </FormItem>
          <br>
          <FormItem label="退款金额:" >
            <i-input   style="width:180px" v-model="cusForm.money" />
          </FormItem>
          <FormItem label="备注:" >
            <i-input   style="width:180px" v-model="cusForm.note" />
          </FormItem>
      </Form>

        <!-- 新加资源按钮 -->
          <Row style='margin-bottom:10px;margin-left:40px'>
            <Button type="primary" @click='addZiYuanCC'>选择添加资源</Button>
          </Row>
            <!-- 选择添加资源的table -->
          <Row>
              <Table :columns="columnThree" :data="dataThree"></Table>
          </Row>
      <!-- modal底部按钮 -->
          <div class="margin-top-20">
              <Button style="margin-right:10px"  type="primary" @click="getAddThree" >添加</Button>
              <Button  type="default" @click="modalCancel">取消</Button>
          </div>
     </Modal>
     <popup2 :message2='showTrueCC'  v-on:mychild2='showCC' v-on:mychildTwo='showTwo'></popup2>
     <!-- 结束 -->

     <!-- 到账单退款供应商 -->
     <Modal v-model="modal3" title="到账单退款供应商" footer-hide :z-inde="9999" width="1100" :styles="{top:'10px'}" >
             <!-- 这里的form卡 -->
      <Form :label-width="120" inline :model="cusForm">
          <FormItem label="公司名称:" >
            <p>{{cusForm.companyName}}</p>
          </FormItem>
          <FormItem label="退款银行名称:" >
            <p>{{cusForm.bankName}}</p>
          </FormItem>
            <FormItem label="退款银行卡号:" >
            <p>{{cusForm.bankNo}}</p>
          </FormItem>
            <FormItem label="退款银行bblID:" >
            <p>{{cusForm.bblId}}</p>
          </FormItem>
          <br>
            <FormItem label="收款店铺:">
              <Select v-model="shopSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
                <Option v-for="(item,index) in shopList" :value="JSON.stringify(item)" :label="item.name" :key="index" >{{ item.name }}</Option>
              </Select>
            </FormItem>
          <FormItem label="退款金额:" >
            <i-input   style="width:180px" v-model="cusForm.money" />
          </FormItem>
          <FormItem label="备注:" >
            <i-input   style="width:180px" v-model="cusForm.note" />
          </FormItem>
      </Form>

        <!-- 新加资源按钮 -->
          <Row style='margin-bottom:10px;margin-left:40px'>
            <Button type="primary" @click='addZiYuanDD'>选择添加资源</Button>
          </Row>
            <!-- 选择添加资源的table -->
          <Row>
              <Table :columns="columnFour" :data="dataFour"></Table>
          </Row>
      <!-- modal底部按钮 -->
          <div class="margin-top-20">
              <Button style="margin-right:10px"  type="primary" @click="getAddFour" >添加</Button>
              <Button  type="default" @click="modalCancel">取消</Button>
          </div>
     </Modal>
     <popup2 :message3='showTrueDD'  v-on:mychild3='showDD' v-on:mychildFour='showFour'></popup2>
     <!-- 结束 -->
     </div>
      
</template>

<script>
import {findOrgMoneyRecordMoneySum,
updateOrgMoneyRecord,
findOrgCusAcc,
findShop,
addJgJieSuan,
updateJieSuanForStatus1
} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,jiesuanStatusList,companyCardTypeList} from '@/libs/global_type'
import {getOrgMoneyRecordType} from '@/libs/allStatus'
import {getZhiDan,getCompanyLiuShui} from '@/api/cusData'
//import popup from '@view/systemMan/popup'//引入弹窗组件 
import popup from '@/view/systemMan/popup'//引入弹窗组件
import popup2 from '@/view/systemMan/popup2'//引入弹窗组件到账单退款客户 到账单退款供应商使用
//import { resolveTxt } from 'dns';
export default {
    name: 'payList',
    inject:['reload'],  //調用組建app.vue
     components:{
          popup,
          popup2
        },
    data(){
      return {

        //2019年6月6日08:51:04 补充
        choseItem:{},
        //2019年6月6日08:50:56 补充
        modal2:false,//控制到账单退款客户显示
        columnThree:[],//到账单退款的table
        dataThree:[],//到账单退款的data数据
        showTrueCC:false,//到账单退款客户的弹窗
 

        modal3:false,//控制到账单退款供应商显示
        columnFour:[],//到账单退款供应商的table
        dataFour:[],//到账单退款供应商的data数据
        showTrueDD:false,//到账单退款供应商的弹窗



        bankList:companyCardTypeList,//本公司银行卡类型
        columnOne:[],
        dataOne:[],//shu
        columnTwo:[],
        dataTwo:[],//shu

        showTrue:false,//控制选择资源的弹窗
        showTrueBB:false,//退款供应商的弹窗
        modal1:false,

        shopSearch:"",
        //退款申请客户
        cusForm:{
          companyName:'',
          bankName:'',
          bankNo:'',
          bblId:'',
          money:'',
          note:'',
          orgId:'',
          orgName:"",
          accountId:''
        },
        modal:false,
        clickItem:{},//退款点击时那一行的数据
        orgItem:{},//客户信息
        //
        shopList:[],
        orgList:[],
        lengthListThis:lengthList,
        showIdK       :'',
        agentId       :'',
        agentShortName:'',
        shopId        :'',
        shopName      :'',
        shopOrgName   :'',
        shopUserId    :'',
        shopOrgId     :'',
        orgSearch:'',
        adminSearchId:"",
        adminSearch:'',
        tableItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:'',
          taitou:'',//本公司抬头
          orderNo:'',
          status:'',
          statusList:jiesuanStatusList
          },
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
        columns4: [
                    {
                        title: 'ID',
                        key: 'orgId',
                        align: 'center',
                        // width:'60'
                    },
                     {
                        title: '公司名称',
                        key: 'orgName',
                        align: 'center',
                        // width:'200'
                    },
                     {
                        title: '客户角色余额',
                        key: '',
                        align: 'center',
                        // width:'200'
                        render:(h,params) =>{
                          return h('div',{
                            'style':{
                              'color':"blue"
                            }
                          },this.$global.isMoneyShow(this.$global.accMinus(params.row.outMoney,params.row.inMoney)))
                        }
                    },
                    {
                        title: '客户入账金额（元）',
                        key: 'inMoney',
                        align: 'center',
                        // width:'200'
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.inMoney))
                        }
                    },
                    {
                        title: '客户出账金额（元）',
                        key: 'outMoney',
                        align: 'center',
                        // width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.outMoney))
                        }
                        
                    },
                     {
                        title: '供应商角色余额',
                        key: '',
                        align: 'center',
                        // width:'200'
                        render:(h,params) =>{
                          return h('div',{
                            'style':{
                              'color':"blue"
                            }
                          },this.$global.isMoneyShow(this.$global.accMinus(params.row.inMoney2,params.row.outMoney2)))
                        }
                    },
                    {
                        title: '供应商入账金额（元）',
                        key: 'inMoney2',
                        align: 'center',
                        // width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.inMoney2))
                        }
                        
                    },
                    {
                        title: '供应商出账金额（元）',
                        key: 'outMoney2',
                        align: 'center',
                        // width:'200',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.outMoney2))
                        }
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'500',
                        fixed:'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                     style: {
                                        marginRight: '5px',
                                        display:params.row.isTotal ? 'none':""
                                    },
                                    on: {
                                        click: () => {
                                          this.modal = true;
                                          this.clickItem = params.row;
                                          this.getOrgInfo(1);
                                        }
                                    }
                                }, '订单退款客户'),
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                     style: {
                                        marginRight: '5px',
                                        display:params.row.isTotal ? 'none':""
                                    },
                                    on: {
                                        click: () => {
                                          this.modal1 = true;
                                          this.clickItem = params.row;
                                          this.getOrgInfo(2);
                                          this.getShopList(2);
                                        }
                                    }
                                }, '订单退款供应商'),

                                     h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                     style: {
                                        marginRight: '5px',
                                        display:params.row.isTotal ? 'none':""
                                    },
                                    on: {
                                        click: () => {
                                          this.modal2 = true;
                                          this.clickItem = params.row;
                                          this.getOrgInfo(3);
                                          this.getShopList(3);
                                        }
                                    }
                                }, '到账单退款客户'),

                                     h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                     style: {
                                        marginRight: '5px',
                                        display:params.row.isTotal ? 'none':""
                                    },
                                    on: {
                                        click: () => {
                                           this.modal3 = true;
                                          this.clickItem = params.row;
                                          this.getOrgInfo(4);
                                          this.getShopList(4);
                                        }
                                    }
                                }, '到账单退款供应商供应商'),
                             ]);
                    }
                        
                    },
                    
        ],//查询列表的数据的colums
        data1: [],//表格展示的数据  查询
        dataCount:0,//总页数
        // pageSize:10,  //每页总条数
        searchPage:1, //初始化时查询的页码数
        taiTouId:"",//本公司抬头的id
        msgId:"",//保存id
                
      }
    },
    
    methods:{
      //获取本公司抬头 
      getTaiTou(item){
        const stingR=eval('(' + item.value + ')');
        this.taiTouId=stingR.value;
      },
      //添加退款客户资源确定按钮
      getAdd(){//getZhiDan
        
            let param={};
            param.orderNo        = '';          
            param.operator       = this.$global.adminInfo.cname;  //操作人名称
            param.operatorType   = '3';                           //客户退款
            param.note           = this.cusForm.note;             //备注
            param.money          = this.cusForm.money;            //退款金额
            param.updateDiKou    = "0";
            param.dikouMoney     = "0";
            param.actualPayMoney = this.cusForm.money;

            param.skOrgId       = this.cusForm.orgId
            param.skShopId      = '';                       //退款银行名称
            param.skOrgAcountId = this.orgItem.tkaccId;     //退款银行卡的id
            param.skOrgName     = this.orgItem.cusorgName;  //退款银行名称

            param.dkBankNo      = '';           //退款银行卡号
            param.dkBankName    = '';                 //本公司抬头的id
            param.dkOrgName     = '';        //本公司银行名称
            param.auditStatus   = '1';
            param.orderType = "1";
            param.jiesuanStatus = "1"
            getZhiDan(param).then(res => {
              console.log(res)
                      if (res.code == "100") {
                          this.msgId=res.msg;
                          //添加流水到公司流水表
                           let param1={
                             list:[]
                           };
                           this.dataOne.map((item)=>{
                               let dic={};
                               dic.customerId      = item.customerId;   //订单买家的id
                               dic.orderId         = item.id;      //订单id
                               dic.inMoney         = '0' ;   //进入金额
                               dic.outMoney        = item.xuanMoney;               //出金额
                               dic.currentMoney    = '0';               //
                               dic.userId          = this.$global.adminInfo.id;       //当前人的操作id
                               dic.payMoneyType    = '13';              //订单退款客户
                               dic.note            = "销售单提现";         //备注
                               dic.orderNo         = item.ordersNo;     //订单号
                               dic.bankJgId        = item.bankJgId;     //订单bankjgid
                               dic.orgId           = item.customerOrgId;       //公司id
                               dic.orgName         = item.customerOrgName;  //公司名称
                               dic.daozhangdanId   = '0';               //到账单id
                               dic.bankConnectedId = '0';       //制单xml文件保存的id
                               dic.zhidanApplyId   = this.msgId;        //主列表的id
                               dic.zhaiyao         = '销售单提现';                //摘要
                               dic.direction       = '';                //发票id
                               dic.type            = '1';
                               dic.dikouOrderId    = '';                //
                               dic.dikouOrderNo    = '';                //抵扣时，弹出框列表的订单号
                               dic.status          = '0';
                               param1.list.push(dic)

                           })
                           getCompanyLiuShui(param1).then(res => {
                              if (res.code == "100") {
                                  this.$Notice.success({
                                      title:'客户申请成功',
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
      //getAddTwo 添加退款供应商的确定按钮
      getAddTwo(){
            
            let param={};
            param.orderNo       = '';          //订单id
            param.operator      = this.$global.adminInfo.cname;  //操作人名称
            param.operatorType  = '4';                           //客户退款
            param.note          = this.cusForm.note;             //备注
            param.money         = this.cusForm.money;            //退款金额
             param.updateDiKou    = "0";
            param.dikouMoney     = "0";
            param.actualPayMoney = this.cusForm.money;

            param.skOrgId       = this.cusForm.orgId
            param.skShopId      = this.cusForm.shopId;                       //退款银行名称
            param.skOrgAcountId = this.cusForm.accountId;     //退款银行卡的id
            param.skOrgName     = this.cusForm.orgName;  //退款银行名称
            
            param.dkBankNo      = '';           //退款银行卡号
            param.dkBankName    = '';                 //本公司抬头的id
            param.dkOrgName     = '';        //本公司银行名称
            param.auditStatus='1';
            param.orderType = "1";
            param.jiesuanStatus = "1"
            getZhiDan(param).then(res => {
              console.log(res)
                      if (res.code == "100") {
                          this.msgId=res.msg;
                          //添加流水到公司流水表
                           let param1={
                             list:[]
                           };
                           this.dataTwo.map((item)=>{
                               let dic                 = {};
                                   dic.customerId      = '';   //订单买家的id
                                   dic.orderId         = item.id;      //订单id
                                   dic.inMoney         = '0';   //进入金额
                                   dic.outMoney        = item.xuanMoney;               //出金额
                                   dic.currentMoney    = '0';               //
                                   dic.userId          = this.$global.adminInfo.id;       //当前人的操作id
                                   dic.payMoneyType    = '11';              //订单退款供应商
                                   dic.note            = '采购单提现';         //备注
                                   dic.orderNo         = item.ordersNo;     //订单号
                                   dic.bankJgId        = item.bankJgId;     //订单bankjgid
                                   dic.orgId           = item.merchantsId;       //公司id
                                   dic.orgName         = item.shopOrgName;  //公司名称
                                   dic.daozhangdanId   = '0';               //到账单id
                                   dic.bankConnectedId = '0';       //制单xml文件保存的id
                                   dic.zhidanApplyId   = this.msgId;        //主列表的id
                                   dic.zhaiyao         = '采购单提现';                //摘要
                                   dic.direction       = '';                //发票id
                                   dic.type            = '2';
                                   dic.dikouOrderId    = '';                //
                                   dic.dikouOrderNo    = '';                //抵扣时，弹出框列表的订单号
                                   dic.status          = '0';
                               param1.list.push(dic)

                           })
                           getCompanyLiuShui(param1).then(res => {
                              console.log('我是退款供应商')
                              console.log(res)
                              if (res.code == "100") {
                                    this.$Notice.success({
                                      title:'供应商申请成功',
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
      //到账单退款客户
      getAddThree(){
            console.log('我是退款供应航的数据')
            console.log(this.dataTwo)
            let param={};
            param.orderNo       = '';          //订单id
            param.operator      = this.$global.adminInfo.cname;  //操作人名称
            param.operatorType  = '3';                           //客户退款
            param.note          = this.cusForm.note;             //备注
            
            param.money         = this.cusForm.money;
            param.updateDiKou    = "0";
            param.dikouMoney     = "0";
            param.actualPayMoney = this.cusForm.money;            //退款金额

            param.skOrgId       = this.cusForm.orgId
            param.skShopId      = '';                       //退款银行名称
            param.skOrgAcountId = this.orgItem.tkaccId;     //退款银行卡的id
            param.skOrgName     = this.orgItem.cusorgName;  //退款银行名称
            
            param.dkBankNo      = '';           //退款银行卡号
            param.dkBankName    = '';                 //本公司抬头的id
            param.dkOrgName     = '';        //本公司银行名称
            param.auditStatus   = '1';
            param.orderType = "1";
            param.jiesuanStatus = "1"
            getZhiDan(param).then(res => {
              console.log(res)
                      if (res.code == "100") {
                          this.msgId=res.msg;
                          //添加流水到公司流水表
                           let param1={
                             list:[]
                           };
                           this.dataThree.map((item)=>{
                               let dic                 = {};
                                   dic.customerId      = this.orgItem.cusid;   //订单买家的id
                                   dic.orderId         = '0';      //订单id
                                   dic.inMoney         = '0';   //进入金额
                                   dic.outMoney        = item.xuanMoney;               //出金额
                                   dic.currentMoney    = '0';               //
                                   dic.userId          = this.$global.adminInfo.id;       //当前人的操作id
                                   dic.payMoneyType    = '12';              //订单退款供应商
                                   dic.note            = '到账单提现客户';         //备注
                                   dic.orderNo         = '';     //订单号
                                   dic.bankJgId        = item.jgBank;     //订单bankjgid
                                   dic.orgId           = this.cusForm.orgId;       //公司id
                                   dic.orgName         = this.orgItem.cusorgName;  //公司名称
                                   dic.daozhangdanId   = item.daozhangdanId;               //到账单id
                                   dic.bankConnectedId = '';       //制单xml文件保存的id
                                   dic.zhidanApplyId   = this.msgId;        //主列表的id
                                   dic.zhaiyao         = '到账单提现客户';                //摘要
                                   dic.direction       = '';                //发票id
                                   dic.type            = '1';
                                   dic.dikouOrderId    = '';                //
                                   dic.dikouOrderNo    = '';                //抵扣时，弹出框列表的订单号
                                   dic.status          = '0';
                               param1.list.push(dic)

                           })
                           getCompanyLiuShui(param1).then(res => {
                              console.log('我是退款客户')
                              console.log(res)
                              if (res.code == "100") {
                                    this.$Notice.success({
                                      title:'客户申请成功',
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
      //到账单退款供应商
      getAddFour(){
    
            let param={};
            param.orderNo       = '';          //订单id
            param.operator      = this.$global.adminInfo.cname;  //操作人名称
            param.operatorType  = '4';                           //客户退款
            param.note          = this.cusForm.note;             //备注
            param.money         = this.cusForm.money;            //退款金额
             param.updateDiKou    = "0";
            param.dikouMoney     = "0";
            param.actualPayMoney = this.cusForm.money;
            
            param.skOrgId       = this.cusForm.orgId
            param.skShopId      = this.cusForm.shopId;                       //退款银行名称
            param.skOrgAcountId = this.cusForm.accountId;     //退款银行卡的id
            param.skOrgName     = this.cusForm.orgName;  //退款银行名称
            
            
            
            param.dkBankNo      = '';           //退款银行卡号
            param.dkBankName    = '';                 //本公司抬头的id
            param.dkOrgName     = '';        //本公司银行名称
            param.auditStatus   = '1';
            param.orderType = "1";
            param.jiesuanStatus = "1"
            getZhiDan(param).then(res => {
              console.log(res)
                      if (res.code == "100") {
                          this.msgId=res.msg;
                          //添加流水到公司流水表
                           let param1={
                             list:[]
                           };
                           this.dataFour.map((item)=>{
                               let dic={};
                               dic.customerId      = this.orgItem.cusid;   //订单买家的id
                               dic.orderId         = '';      //订单id
                               dic.inMoney         = '0';   //进入金额
                               dic.outMoney        = item.xuanMoney;               //出金额
                               dic.currentMoney    = '0';               //
                               dic.userId          = item.userId;       //当前人的操作id
                               dic.payMoneyType    = '12';              //订单退款供应商
                               dic.note            = '到账单提现供应商';         //备注
                               dic.orderNo         = '';     //订单号
                               dic.bankJgId        = item.jgBank;     //订单bankjgid
                               dic.orgId           = this.cusForm.orgId;       //公司id
                               dic.orgName         = this.orgItem.cusorgName;  //公司名称
                               dic.daozhangdanId   = item.daozhangdanId;               //到账单id
                               dic.bankConnectedId = '';       //制单xml文件保存的id
                               dic.zhidanApplyId   = this.msgId;        //主列表的id
                               dic.zhaiyao         = '到账单提现供应商';                //摘要
                               dic.direction       = '';                //发票id
                               dic.type            = '2';
                               dic.dikouOrderId    = '';                //
                               dic.dikouOrderNo    = '';                //抵扣时，弹出框列表的订单号
                               dic.status          = '0';
                               param1.list.push(dic)

                           })
                           getCompanyLiuShui(param1).then(res => {
                              console.log('我是退款供应商')
                              console.log(res)
                              if (res.code == "100") {
                                    this.$Notice.success({
                                      title:'供应商申请成功',
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


      //子组件向父组件传的值  点击退款客户的时候
      showN(item){
       console.log('-----------=======')
      //  console.log(item)
        this.columnOne=item.a;
        this.dataOne=item.b;
        this.getTotal();
        //console.log('我是子组件添加过传过来的数据')
        //console.log(this.dataOne)
       
      },
      getTotal(){
            let t=0;
            this.dataOne.map((item)=>{
              console.log(item.xuanMoney)
              t = this.$global.accAdd(t,item.xuanMoney)
            })
            this.cusForm.money = t
      },
      //子组件向父组件传过来的值  点击退款供应商的时候
      showNBB(item){
        this.columnTwo=item.a;
        this.dataTwo=item.b;
        this.getTotalTwo();
      },
       getTotalTwo(){
            let t=0;
            this.dataTwo.map((item)=>{
              t = this.$global.accAdd(t,item.xuanMoney)
            })
            this.cusForm.money = t
      },
      //子组件穿过来添加后的数据
      showTwo(item){
        console.log('我是子组件bb2的数据')
        console.log(item)
         this.columnThree=item.a;//到账单退款的table
         this.dataThree=item.b;//到账单退款的table
         this.getTotalD1();
      },
       getTotalD1(){
            let t=0;
            this.dataThree.map((item)=>{
              t = this.$global.accAdd(t,item.xuanMoney)
            })
            this.cusForm.money = t
      },
      //showFour 子组件穿过来的到账单退款供应商
      showFour(item){
         this.columnFour=item.a;//到账单退款供应商的table
         this.dataFour=item.b;//到账单供应商的data
         this.getTotalD2();
      },
        getTotalD2(){
            let t=0;
            this.dataFour.map((item)=>{
              t = this.$global.accAdd(t,item.xuanMoney)
            })
            this.cusForm.money = t
      },
      //退款客户
      showmess(msg){
         console.log(msg+'我是子组件向父组件的值')
          this.showTrue=msg;
      },
      //退款供应商
      showmessBB(msg){
         //console.log(msg+'我是子组件向父组件的值退款供应商')
          this.showTrueBB=msg
      },
      //到账单退款客户
      showCC(msg){
         this.showTrueCC=msg
      },
      //到账单退款供应商
      showDD(msg){
         this.showTrueDD=msg
      },
      //选择添加资源
      addZiYuan(){//TODO
          this.showTrue=true;
          console.log("--------")
          console.log(this.choseItem);
           Utils.$emit('orgItem',this.choseItem);

          //console.log(this.showTrue)
      },
      //退款供应商
      addZiYuanBB(){
         this.showTrueBB=true;
           Utils.$emit('orgItem',this.choseItem);

      },
      //到账单退款客户
      addZiYuanCC(){
        this.showTrueCC=true
           Utils.$emit('orgItem',this.choseItem);

      },
      //到账单退款供应商
      addZiYuanDD(){
        this.showTrueDD=true
           Utils.$emit('orgItem',this.choseItem);

      },
      getOrgInfo(type){//获取客户信息；
        let p  = {};
        p.orgId = this.clickItem.orgId;

            findOrgCusAcc(p).then(res => {
                      if (res.code == "100") {
                        this.orgItem = res.data.list[0];
                        this.cusForm.companyName = this.orgItem.cusorgName;
                        this.cusForm.bankName    = this.orgItem.tkaccBank;
                        this.cusForm.bankNo      = this.orgItem.tkaccBankCode;
                        this.cusForm.bblId       = this.orgItem.tkaccBblId;
                        this.cusForm.orgId = this.orgItem.cusorgId;
                        //传递给子组件
                        this.choseItem.orgId = this.orgItem.cusorgId
                        this.choseItem.type = type;
                        this.choseItem.orgName = this.orgItem.cusorgName;
                      }
                  })
      },
      getOrg(){
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.orgList=res.data.list
          }  
         })
       },
        getShopList(){
        let param = {};
        param.pageNum ="1";
        param.pageSize = "999999"
        param.orgId=this.clickItem.orgId
          findShop(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
      modalCancel(){
        this.modal =false;
        this.modal1 = false;
        this.showTrue=false;
        this.modal3=false;
        this.modal2=false;
      },
      getStatus(item){
        console.log(this.formItem.status)
      },
      getDianOrg(item){
        var jsonStr = eval('('+item.value+')')
        this.formItem.companyName = jsonStr.orgorgName
      },
      getDian(item){

        var jsonStr = eval('('+item.value+')')
        console.log(item)
        this.cusForm.accountId = jsonStr.accountId;
        this.cusForm.shopId = jsonStr.id
        this.cusForm.orgName = jsonStr.orgName;
        // this.cusForm.bankName = jsonStr.bank
        // this.cusForm.bankNo = jsonStr.bankCode
        this.cusForm.bblId = jsonStr.bblId;
       },
      changeCreateTieme(data){
        console.log(data);
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';

      },
      propsClick(){
        console.log("回调成功");
        this.reload();
      },
      getAdmin(item){
        console.log(item);
        this.adminSearchId = item.value;
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
       selectOne(row){
         console.log(row)
       },
      
       //查询表格
       searchM(){

         //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum = this.pagesizea  //分页
        //  param.beginStatus = 1 ;
        //  param.endStatus   = 11 ;
        //  param.userId      = this.adminSearchId  //管理员查询
        //  param.orgId = this.shopOrgId  //供应商
        param.orgName =  this.formItem.companyName;//公司名称
         param.beginTime   = this.formItem.beginTime      //创建时间 
         param.endTime     = this.formItem.endTime        
          // param.jgJieSuanCaoZuoStatus = this.formItem.status
          param.pageSize              = this.formItem.length;
          param.orderNo               = this.formItem.orderNo
          param.status  = "1";
          let a = this.$global.pinjieStr("1,3,4,5,11,14,15");
          param.six = a;
          console.log(param);
          //过滤 只查询 有效数据
           findOrgMoneyRecordMoneySum(param).then(res=>{
            if(res.code =="100"){
            this.totalM=res.data.total; 
            this.data1=res.data.list;

          }  
         })
          
       },
    },
    
    mounted(){
     this.searchM();
     this.getOrg();
     var that = this;
     Utils.$on('demo',function(msg){
       console.log(msg);
       if(msg == "reload"){
        that.propsClick();
       }
     })
    },
    created(){
   
    },
}

</script>
<style <style lang="less">
  .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
</style>
