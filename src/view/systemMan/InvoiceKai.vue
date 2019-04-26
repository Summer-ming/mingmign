
<template>
     <div>
         <row>
             <h2 style='font-weight:400;'>开票申请列表(亿钢)</h2>
         </row>
         <!-- 开票列表 -->
         <row style='margin-bottom:20px;padding-top:10px;background-color: #fbfbfb;-webkit-box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);-moz-box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);padding: 12px;'>
             <Form :label-width="120" inline :model="addForm">
                 <row>
                         <!-- 销售方名称 -->
                        <FormItem label='销售方名称'>
                            <Select @on-change='getXiao' style='width:160px'
                               
                                v-model="model14"
                                filterable
                                remote
                                :remote-method="remoteMethod2"
                                :loading="loading2">
                                <Option v-for="(option, index) in options2" :value="option.value" :key="index">{{option.label}}</Option>
                            </Select>
                        </FormItem>

                        <!--采购方名称 -->
                        <FormItem label='采购方名称'>
                            <Select  @on-change='getCai' style='width:150px'
                               
                                v-model="caigou"
                                filterable
                                remote
                                :remote-method="remoteMethod3"
                                :loading="loading3">
                                <Option v-for="(option, index) in options3" :value="option.value" :key="index">{{option.label}}</Option>
                            </Select>
                        </FormItem>
                        <!-- 每页显示个数 -->
                        <FormItem label="每页显示个数:">
                          <Select @on-change='getPage' v-model="addForm.pageNum" style="width:150px" >
                              <Option  :value="item.value" v-for='(item,index) in everyPage' :key='index'>{{item.value}}</Option>
                          </Select>
                        </FormItem>
                        <!-- 金乡绑定状态 -->
                         <FormItem label="进项绑定状态">
                          <Select @on-change='getStatus' v-model="addForm.jinStatus" style="width:100px" >
                              <Option value="待绑定">待绑定</Option>
                              <Option value="待定完成">待定完成</Option>
                          </Select>
                        </FormItem>
                 </row>
                 <!-- 订单号 规格 销售票绑定状态 -->
                 <row>
                     <FormItem label="订单号:" prop="dingdanhao">
                      <i-input   style="width:200px" v-model="addForm.dingdanhao" placeholder="请输入订单号"/>
                     </FormItem>

                     <FormItem label="规格:" prop="guige">
                      <i-input   style="width:200px" v-model="addForm.guige" placeholder="请输入订规格"/>
                     </FormItem>

                     <FormItem label="销售票绑定状态">
                          <Select @on-change='getXstatus' v-model="addForm.xiaoshouStatus" style="width:100px" >
                              <Option value="待开票">待开票</Option>
                              <Option value="开票完成">开票完成</Option>
                          </Select>
                      </FormItem>
                 </row>
                 <!-- 管理员  品名 订单本公司抬头 -->
                 <row>
                      <FormItem label='管理员'>
                            <Select style='width:150px' v-model="guanli" filterable :label-in-value='true' @on-change='getUserone'>
                                <Option v-for="(option, index) in options4" :value="JSON.stringify(option)" :key="index">{{option.cname}}</Option>
                            </Select>

          
                        </FormItem>

                      <FormItem label="品名:" prop="pinming">
                        <i-input   style="width:200px" v-model="addForm.pinming" placeholder="请输入订品名"/>
                      </FormItem>

                      <FormItem label="订单本公司抬头">
                          <Select @on-change='getTitle' v-model="addForm.dingtitle" style="width:100px" >
                              <Option value="福建亿钢">福建亿钢</Option>
                              <Option value="全部">全部</Option>
                          </Select>
                      </FormItem>
                  </row>
                  <!-- 申请时间  进项绑定时间  消项绑定时间 -->
                  <row>
                        <FormItem label="申请时间">
                            <i-Col span="12">
                                <DatePicker type="daterange"  placeholder="选择日期" style="width: 200px" @on-change='getShen'></DatePicker>
                            </i-Col>
                        </FormItem>


                        <FormItem label="进项绑定时间">
                            <i-Col span="12">
                                <DatePicker type="daterange" @on-change='getJinTime'  placeholder="选择日期" style="width: 200px"></DatePicker>
                            </i-Col>
                        </FormItem>


                         <FormItem label="消项绑定时间">
                            <i-Col span="12">
                                <DatePicker type="daterange" @on-change='getXiaoTime'  placeholder="选择日期" style="width: 200px"></DatePicker>
                            </i-Col>
                        </FormItem>
 
                  </row>
                  <!-- 代理商名称  进项票号码  销售票号码 -->
                  <row>
                     <FormItem label='代理商名称'>
                            <Select @on-change='getDaili' style='width:150px'
                                clearable
                                v-model="dailiShang"
                                filterable
                                remote
                                :remote-method="remoteMethod5"
                                :loading="loading5">
                                <Option v-for="(option, index) in options5" :value="option.value" :key="index">{{option.value}}</Option>
                            </Select>
                     </FormItem>

                     <FormItem label="进项票号码:" prop="jinhao">
                        <i-input   style="width:200px" v-model="addForm.jinhao" placeholder="请输入进项票号码"/>
                     </FormItem>

                     <FormItem label="销项票号码:" prop="xiaohao">
                        <i-input   style="width:200px" v-model="addForm.xiaohao" placeholder="请输入销项票号码"/>
                     </FormItem>   
                  </row>

                  <!-- 查询  刷新 -->
                  <row style='text-align:right;'>
                    <Button type="primary" icon="ios-search" @click='getSearch'>查询</Button>
                    <Button  icon="md-refresh"  style='margin-left:10px;'>刷新</Button>
                  </row>
                       


              </Form>
         </row>
         
         <!-- 重量合计  金额合计 -->
         <row class='allrow'>重量合计:<time>80.050</time>吨 &nbsp;&nbsp;金额合计:<time>325862.30</time>元</row>

         <!-- TABLE 表格 -->
         <row style='background-color: #fbfbfb;-webkit-box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);-moz-box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);box-shadow: 1px 0 10px 1px rgba(0, 0, 0, .3);padding: 12px;'>
             <!-- 申请总额  销项总额  总重量 -->
             <row class='row_sa'>
               <i-col>{{allMoney}}</i-col>
               <!-- <i-col span='8'>本次申请销项总金额（元）:<time>{{allMprice}}</time></i-col> -->
               <i-col span='8'>本次申请进项总金额（元）:<time>{{allMprice}}</time></i-col>
               <i-col span='8'>本次申请总重量（吨）:<time>{{allWightp}}</time></i-col>  
             </row>
             <!-- 下载excel 下载开票excel  打印列表区域  绑定新进项票  绑定新销项票  撤销申请 -->
             <row class='buton_all'>
               <Button type="primary" @click="exportData(1)">下载excel</Button>
               <Button type="primary" @click="exportData(3)">下载开票excel</Button>
               <!-- <Button type="primary" @click="modal1 = true">绑定新进项票</Button> -->
               <Button type="primary" @click='modal2 = true'>绑定新销项票</Button>
               <Button type="primary" @click='modal3 = true'>撤销申请</Button>
             </row>
             <!-- TBALE 表格 -->
             <row>
                <Table  ref="table"  @on-selection-change='getTable'   style='margin-bottom:10px;' :columns="columnsAll" :data="dataAll"></Table>
                <Page :total="totalPage" show-total />
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
        <Modal v-model="modal2" title="新增销项票并绑定"  @on-ok="ok"  @on-cancel="cancel">
          <row>
            <Form :label-width="180"  :model="addFormTwo">
                      <FormItem label="发票号码:" prop="fapiaohao">
                        <i-input   style="width:200px" v-model="addFormTwo.fapiaohao1" placeholder="请输入订单号"/>
                      </FormItem>

                      <FormItem label='公司名称'>
                            <Select style='width:200px' :placeholder="conmpanyOne" v-model="conmpanyOne" filterable :label-in-value='true' @on-change='getUserTwo'>
                                <Option v-for="(option, index) in companyZu" :value="JSON.stringify(option)" :key="index">{{option.orgName}}</Option>
                            </Select>

          
                        </FormItem>

                      <FormItem label="发票总重量(吨):" prop="faWeight">
                        <i-input   style="width:200px" v-model="addFormTwo.faWeight1" placeholder=""/>
                      </FormItem>

                      <FormItem label="发票总金额(元):" prop="faMoney">
                        <i-input   style="width:200px" v-model="addFormTwo.faMoney1" placeholder=""/>
                      </FormItem>


                      <FormItem label="绑定时间:" >
                        <!-- <i-input   style="width:200px" v-model="addFormTwo.bangTime1" placeholder=""/> -->
                          <i-Col span="12">
                              <DatePicker type="date" @on-change='getBang' placeholder="选择时间" style="width: 200px"></DatePicker>
                          </i-Col>
                      </FormItem>

            </Form>
              

          </row>
       
        </Modal>


        <!-- 撤销申请的弹窗 -->
          <Modal v-model="modal3" title="撤销选项"  @on-ok="getCon"  @on-cancel="getCu">
            <row style='padding-left:30px;'>
              <RadioGroup v-model="zuofei" vertical @on-change='getRadio'>
                <Radio label="zuofei">
                    <Icon type="social-apple"></Icon>
                    <span>作废</span>
                </Radio>
                <Radio label="hongchong">
                    <Icon type="social-android"></Icon>
                    <span style='color:red'>红冲(只买家)</span>
                </Radio>
                <Radio label="hongchongm">
                    <Icon type="social-windows"></Icon>
                    <span style='color:red'>红冲(买家和卖家)</span>
                </Radio>
              </RadioGroup>
            </row>
          </Modal>
        

     </div>
</template>
<script>
import {findOrgCusAcc,getUserList,findShop} from '@/api/data'
import {lengthList} from '@/libs/global_type'
import {findAgent} from '@/api/warehouse'  
import {getKaiPiao,getBangDing,getCheXiao} from '@/api/cusData'
import { join } from 'path';

export default {
  name: 'InvoiceKai',
  data () {
    return {
         zuofei:'zuofei',
         addForm:{
           pageNum:"",//每页显示个数
           jinStatus:"",//进项绑定状态
           dingdanhao:"",//订单号
           guige:"",//规格
           xiaoshouStatus:"",//销售票绑定状态
           pinming:"",//品名
           dingtitle:"",//订单本公司抬头
           jinhao:"",//进项票号码
           xiaohao:'',//销项票号码
         },
         model14:'',//销售方名称
         paramSale:{},//销售方名称
         loading2: false,
         saleMing:[],
         options2:[],
         saleOne:[],

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
                        title: '品名',
                        key: 'steelName',
                        width:'80px'
                    },
                     {
                        title: '材质',
                        key: 'steelPaihao',
                        width:'80px'
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        width:'80px'
                    },
                    {
                        title: '吨位',
                        key: 'weight',
                        width:'80px'
                    },
                    {
                        title: '单价',
                        key: 'guapaijia',
                        width:'80px'
                    },
                     {
                        title: '金额',
                        key: 'money',
                        width:'80px'
                    },
                     {
                        title: '销售方',
                        key: 'orderCustomerCompany',
                        width:'80px'
                    },
                    
                     {
                        title: '采购方',
                        key: 'orderShopCompanyName ',
                        width:'80px'
                    },
                    {
                        title: '备注',
                        key: 'note',
                        width:'80px'
                    },
                    {
                        title: '差',
                        key: 'cha',
                        width:'80px'
                    },
                    {
                        title: '请求时间',
                        key: 'qingtime',
                        width:'80px'
                    },
                    {
                        title: '申请明细ID',
                        key: 'shenId',
                        width:'80px'
                    },
                    {
                        title: '申请ID',
                        key: 'qingId',
                        width:'80px'
                    },
                    {
                        title: '订单ID',
                        key: 'dingdanid',
                        width:'80px'
                    },
                    {
                        title: '订单号',
                        key: 'dingdanhao',
                        width:'80px'
                    },
                    {
                        title: '是否新名称',
                        key: 'isname',
                        width:'80px'
                    },
                    {
                        title: '发票抬头',
                        key: 'fapiao',
                        width:'80px'
                    },
                    {
                        title: '进项票',
                        key: 'jinpiao',
                        width:'80px'
                    },
                    {
                        title: '销项票',
                        key: 'xiaopiao',
                        width:'80px'
                    },
                    {
                        title: '请求金额',
                        key: 'qingmoney',
                        width:'80px'
                    },
                    {
                        title: '请求重量',
                        key: 'qingweight',
                        width:'80px'
                    },
                    {
                        title: '进项票号码',
                        key: 'jinhaoma',
                        width:'80px'
                    },
                    {
                        title: '销项票号码',
                        key: 'xiaohaoma',
                        width:'80px'
                    },
                    {
                        title: '进项绑定时间',
                        key: 'jintime',
                        width:'80px'
                    },
                      {
                        title: '销项绑定时间',
                        key: 'xiaotime',
                        width:'80px'
                    },
                    {
                        title: '低价',
                        key: 'dijia',
                        width:'80px'
                    },
                     {
                        title: '挂牌价格',
                        key: 'guapai',
                        width:'80px'
                    },
                     {
                        title: '代理商',
                        key: 'daili',
                        width:'80px'
                    },
                ],
         dataAll: [
                    {
                        pinming: '盘螺',
                        caizhi:"hrb4001",
                        guige: '8',
                        dunwei: '20.05',
                        danjia: '4046',
                        jine: '81155.30',
                        xiaoshou:'湖南凯泽建材贸易有限公司',
                        caigou:'徐州东亚钢铁有限公司',
                        beizhu:'d',
                        cha:'否',
                        qingtime:'2015-8-9',
                        shenId:'2',
                        qingId:'2',
                        dingdanid:'1115151515',
                        dingdanhao:'iiiiyy',
                        isname:'否',
                        fapiao:'湖南凯泽建材贸易有限公司',
                        jinpiao:'待开票',
                        xiaopiao:'已开票',
                        qingmoney:'555',
                        qingweight:'555',
                        jinhaoma:'555',
                        xiaohaoma:'555',
                        jintime:'555',
                        xiaotime:'555',
                        dijia:'555',
                        guapai:'555',
                        daili:'555',
                    }
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
         },//进项表单

         totalPage:0,//分页总条数

         allMprice:'',//本次申请总金额
         allWightp:'',//本次申请总重量

         companyZu:[],//公司名称
         bangDing:"",//绑定时间

         modal3:false,//撤销申请的弹窗







    
    }
  },
  methods: {
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
                this.paramCaiGou.pageNum = '9999' //分页
                this.paramCaiGou.orgRoleType = "2"
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
       getUser(param){
         getUserList(param).then(res=>{
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
              console.log(res)
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
       //this.caigou=item;
       this.paramFirst.orderShopCompanyName= item
       console.log(item)
      },
      //获取管理员名字
      getUserone(item){
        const stingR=eval('(' + item.value + ')')
        console.log(stingR)
        this.paramFirst.orderUserId=stingR.id  
      },
      //获取公司名称
      getUserTwo(item){
          const stingTwo=eval('(' + item.value + ')')
          this.companyTwo=stingTwo.orgName
       
      },
      //获取分页的个数
      getPage(item){
       //this.addForm.pageNum=item;
       this.paramFirst.length=item
       console.log(item)
      },
      //获取订单本公司抬头
      getTitle(item){
        if(item=='福建亿钢'){
            this.paramFirst.invoiceApplyStatus='1';
        }else if(item=='全部'){
            this.paramFirst.invoiceApplyStatus='1';
        }

      },
      //获取进项绑定状态
      getStatus(item){
         if(item=='绑定完成'){
           this.paramFirst.status='4'
           }else if(item=='待绑定'){
           this.paramFirst.status='1'
           }
      },
      //销项票绑定状态
      getXstatus(item){
        if(item=='待开票'){
           this.paramFirst.statusOut='1'
        }else if(item=='开票完成'){
           this.paramFirst.statusOut='4'
           }
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
        this.paramFirst.agentShortName=item
      },
      //通过条件查询表格
      getSearch(){
        this.paramFirst.orderNo=this.addForm.dingdanhao
        this.paramFirst.steelGuige=this.addForm.guige
        this.paramFirst.steelName=this.addForm.pinming
        this.paramFirst.noIn=this.addForm.jinhao
        this.paramFirst.noOut=this.addForm.xiaohao
        this.paramFirst.fenyeStatus='Y'
        this.paramFirst.bankJgId='1'
        this.paramFirst.deleteStatus='1'
        this.paramFirst.invoiceApplyStatus='1'
        this.paramFirst={};
        getKaiPiao(this.paramFirst).then(res=>{
            if(res.code =="100"){
               this.dataAll=res.data.list
               this.totalPage = res.data.total
               this.conmpanyOne=res.data.list[0].orderShopName 
               console.log(this.conmpanyOne)
               console.log(this.totalPage)
          }  
         })
      },
      //table选中事件
      getTable(selection,row){
        //console.log(selection) //选中的数据一个数组
        console.log(row)//选中的当前行数据内容
        this.selectData=selection

        console.log(this.selectData)
      },
      //绑定时间
      getBang(item){
         console.log(item)
         this.bangDing=item
      },
      //确定绑定新销项票
      ok(){
        let param1={};
        if(this.companyTwo==''|| this.companyTwo==null){
          param1.companyName=this.conmpanyOne
          }else{
          param1.companyName=this.companyTwo
        }
        param1.invoiceNo=this.addFormTwo.fapiaohao1
        param1.createUserId='5'
        param1.customerId='bd78dd31-3112-423f-8480-bd763d8fd2a8'
        param1.money=this.allMprice
        param1.status='1'
        param1.weight=this.allWightp
        console.log()
         getBangDing(param1).then(res=>{
            if(res.code =="100"){
              console.log(res)
               
          }  
         })

      },
      cancel(){

      }, 
      //撤销申请的弹窗  确定取消
      getCon(){

      },
      getCu(){

      },
      //撤销 单选
      getRadio(item){
          console.log(item)
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
                      console.log(item.yuanshi)
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
           
            this.selectData.map((item) => {
              totalMoney += Number(item.money)
              tolWeight += Number(item.weight)
          
            })
            this.allMprice=totalMoney
            this.allWightp=tolWeight
            this.addFormTwo.faWeight1=tolWeight
            this.addFormTwo.faMoney1=totalMoney
            



            //return  this.addForm.totalSum, this.addForm.totalWeight
        }
    },

  created () {

  },
  mounted () {
    this.getUser(this.paramGuanli)
    this.getCompany();
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

</style>

