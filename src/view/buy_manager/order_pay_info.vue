<!--
 * @Description: 订单申请付款
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 19:55:36
 -->




<template>
     <div>
        <b class="font_32">基础信息</b>
        <row class='order_all' >
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
    <!-- 增公司信息详情 -->
    <row class='row_lp'>{{comPanyM}} 账户余额 <time>{{zhangHuYuE}}</time>元；已付 <time>{{yingShou}}</time>元，应付 <time>{{yingFu}}</time>元</row>

    <row>
        <b class="font_32">合同信息</b>
        <vxe-table height="200"
            size="mini"
            :data.sync="data1">
                <vxe-table-column width="40" type="index" title="#"   ></vxe-table-column>
                <vxe-table-column width="40" field="id" title="ID"   ></vxe-table-column>
                <vxe-table-column width="80" field="steelName" title="品名"  ></vxe-table-column>
                <vxe-table-column width="80" field="steelGuige" title="规格" ></vxe-table-column>
                <vxe-table-column width="80" field="steelPaihao" title="材质"></vxe-table-column>
                <vxe-table-column width="80" field="steelPinpai" title="钢厂"></vxe-table-column>
                <vxe-table-column width="80" field="steelWorks" title="提货方式"></vxe-table-column>
                <vxe-table-column width="80" field="jiaohuodi" title="交货地"></vxe-table-column>
                <vxe-table-column width="80" field="jizhongType" title="计重方式"></vxe-table-column>
                <vxe-table-column width="80" field="jianshu"  title="件数"></vxe-table-column>
                <vxe-table-column width="100" field="guapaijia" :formatter="this.$global.vxeTableMoney" title="单价"></vxe-table-column>
                <vxe-table-column width="100" field="zongzhongliang" :formatter="this.$global.vxeTableWeight" title="总重量"></vxe-table-column>
                <vxe-table-column width="100" field="cusMoney" :formatter="this.$global.vxeTableMoney"  title="采购总额"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanJianshu"  title="结算件数"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanDanjia" :formatter="this.$global.vxeTableMoney"  title="结算单价"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanWeight" :formatter="this.$global.vxeTableWeight" title="结算重量"></vxe-table-column>
                <vxe-table-column width="100" field="jiesuanMoney" :formatter="this.$global.vxeTableMoney" title="结算金额"></vxe-table-column>
                <vxe-table-column width="100" field="kunbaohao"  title="捆包号"></vxe-table-column>
            </vxe-table>
    </row>
   
      <row>
        <span>合同总金额<span style="color:red">{{formItem.money}}</span>元</span>
        <br>
        <span>结算总金额<span style="color:red">{{this.$global.isMoneyShow(dTMoney)}}</span>元</span>
         <span style="margin-left:10px">结算总重量<span style="color:red">{{this.$global.accPrecision(dTweight,3)}}</span>吨</span>
        <span style="margin-left:10px">已申请付款总金额：<span style="color:red">{{this.$global.isMoneyShow(totalApplyMoney)}}</span></span>
        <span style="margin-left:10px">剩余未付差额|：<span style="color:red">{{this.$global.isMoneyShow(totalDifferenceMoney)}}</span></span>
        <br>
        <span>说明：本次应付款金额 = 抵扣金额 + 实际付款金额 </span>
        <Form :model="formItem" inline :label-width="100">
          <FormItem label='本次应付款金额'>
          <Input style='width:100px' v-model='formItem.payMoney' @on-blur='getBlur' placeholder='请输入金额'/>
          <p style='color:red' v-show='show_t'>付款金额超出</p>
          </FormItem>
          <FormItem label='抵扣金额'>
            <Input style='width:100px' v-model='formItem.dikouMoney' placeholder='请输入抵扣金额'/>
          </FormItem>
           <FormItem label='实际付款金额'>
            <Input disabled style='width:100px' v-model='formItem.actualPayMoney' />
          </FormItem>
          <br>
          <FormItem label="备注">
            <Input style="width:600px" v-model="formItem.note" type="textarea" :rows="4" placeholder="请输入备注" />
          </FormItem>
        </Form>
      </row>
      <row>
        <!-- 新增抵扣添加资源 -->
            <h2>抵扣金额来源</h2>
            <Row style='margin-left:30px;margin-bottom:15px;'>
                <i-col span='5' style='padding-top:5px;'>合计抵扣：{{this.$global.isMoneyShow(formItem.dikouMoney)}}元</i-col>
                <i-col span='5'>
                  <Button type="warning" @click='choseSource'>选择抵扣来源</Button>
                </i-col>

            </Row>
                <br>

                 <time>说明：剩余可抵扣金额为<span style="color:red">负</span>，则需要给钢厂<span style="color:red">补款</span>;<br>剩余可抵扣金额为<span style="color:red">正</span>，则需要钢厂<span style="color:red">退款给平台，或进行抵扣</span></time>
                
            <!-- 抵扣的表格 -->
            <Row>
                <Table :columns="columnTwo" :data="dataTwo"></Table>

            </Row>
            <!-- 结束 -->
      </row>
      <row>
           <!-- 新增添加资源抵扣弹窗 -->
      <Modal class-name="dikouClass" title="选择订单资源"  v-model="modal2" footer-hide :mask-closable="false"  width='1100px;' >
        
          <Row>
             <Form :label-width="120" inline >
                <FormItem label="供应商店铺查询:" prop="gongYingShang">
                  <i-input   style="width:180px" v-model="gongYingShang" placeholder="供应商名字"/>
                </FormItem>
                 <FormItem label="采购方名称:" prop="caiGouName">
                  <i-input   style="width:180px" v-model="caiGouName" placeholder="采购方名字"/>
                </FormItem>
              <FormItem label="下单时间|">
                 <i-Col span="12">
                      <DatePicker type="daterange" @on-change='getData' placement="bottom-end" placeholder="请选择日期" style="width: 200px"></DatePicker>
                 </i-Col>
              </FormItem>

              <FormItem label="管理员查询:">
                <Select clearable v-model="adminSearch"  style="width:180px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
                  <Option v-for="(item,index) in adminList " :value="item.value" :label="item.label" :key="item.value" >{{ item.label }}</Option>
                </Select>
              </FormItem>

               <FormItem label="工程名称:" style="margin-right:10px;">
                <el-select style="width:180px" :transfer="true" size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                              <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                                </el-option>
                            </el-select>
              <!-- <Input  style="width:200px"  placeholder="请输入工程名称" v-model="formItem.engineering"></Input> -->
              </FormItem>

              <FormItem label="剩余可抵扣金额与0关系:">
                <Select clearable v-model="chaType"  style="width:180px" filterable placeholder="请选择"  >
                  <Option v-for="(item,index) in chaList " :value="item.value" :label="item.label" :key="item.value" >{{ item.label }}</Option>
                </Select>
              </FormItem>
             </Form>

             <!-- 查询 -->
             <Row style='padding-left:30px;'>
                 <Button size="small" @click='getMM'  type="primary">查询</Button>
                 <br>
                 
                 <time>说明：剩余可抵扣金额为<span style="color:red">负</span>，则需要给钢厂<span style="color:red">补款</span>;<br>剩余可抵扣金额为<span style="color:red">正</span>，则需要钢厂<span style="color:red">退款给平台，或进行抵扣</span></time>
                  <br/>
                <time>如果按钮为灰色，则说明订单已经抵扣完成，或者正在抵扣中</time>
             </Row>
             <!-- 选择订单资源的表格 -->
             <Row>
                <Table size="small" :columns="columnOne" :data="dataOne"></Table>
                <Page @on-change="changePageOne" style="margin-top:10px;text-align:right;"   :total="totalOne" show-total ></Page>
             </Row>
          </Row>
      </Modal>
      </row>
       <row>
         
          <p style="visibility: hidden;">{{total}}</p>

          <br>
         <span v-show="notice" style="color:red">已申请总金额等于订单金额，不可申请</span>
         <br>
      <Button style="margin-left:20px;width:200px;margin-bottom:30px" type="primary" @click="getAdd" :disabled="isDisable"> 提交</Button>
    </row>
     </div>
</template>

<script>
import {findOrdersInfoAll,updateFukuanZhenghe,
findJgJieSuanInfo,findShop,findOrgMoneyRecordMoneySum,
updateOrderStatus,findOrdersAll,
addJgJieSuan,
updateShopMoneyJieSuanMer,
getLiuShuiBiao,
findCodeInfo,
getUserList,findOrderEngineering
} from '@/api/data'
import { mapMutations } from 'vuex'
import {axios} from 'axios'
import qs from 'qs'
import {sendSmsApi} from  '@/api/data_message'
import { setTimeout } from 'timers';
export default {
    name: 'order_pay_info',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        chaType:'',
        chaList:[
          {
            "label":'大于',
            "value":'1'
          },
           {
            "label":'小于',
            "value":'-1'
          },
           {
            "label":'等于',
            "value":'0'
          },
        ],//剩余可抵扣金额和0的对比
        adminList:[],
        adminSearchId:'',
        adminSearch:'',
        show_t:false,
        zhidanApplyId:'',
        totalOne:0, //表格分页总天数
        beginTime:'',//下单开始时间
        stopTime:'',//下单结束时间
        caiGouName:'',//采购方名称
        gongYingShang:"",//供应商初始值
        gongYingShangName:'',//供应商名字
        gongYingShangId:'',//供应商id
        modal2:false,//添加资源弹窗
         dataOne:[],//选择资源数组
        dataTwo:[],//选择资源添加后的数组
        dTMoney:0,
        dTweight:0,
        searchOrderItem:{},
        isDisable:false,
        isDisableOne:false,
        notice:false,
        shopItem:{},
        totalApplyMoney:0,
        totalDifferenceMoney:0,
        formItem:{
          payMoney:0,
          dikouMoney:'0',
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          note:'',
          engineering:'',
          actualPayMoney:0//实际付款金额
        },
        engineerNameList:[],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        data1: [
        ],//表格展示的数据
        dataCount:0,//总页数
        // pageSize:10,  //每页总条数
        searchPage:1 ,//初始化时查询的页码数
        //公司名称  账户余额  应收  应付
        comPanyM:"",
        zhangHuYuE:'',
        yingShou:"",
        yingFu:"",
         columnOne:[
                    {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        fixed:'left',
                        width:'100',
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:params.row.showa
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                               params.row.showa=true
                                                this.dataTwo.push(params.row)
                                        }
                                    }
                                }, '添加|'),
                             ]);
                        }    
                    },
                    {
                        title: '订单号',
                        key: 'ordersNo',
                        align: 'center',
                        width:'120',
                    },
                     {
                        title: '销售方名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'120',
                        render:  (h, params)=> {
                          return h('div',{},params.row.customerOrgName.substr(0,5))
                        }
                    },
                    {
                        title: '工程名称',
                        key: 'gongcheng',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '管理员',
                        key: 'userName',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '剩余可抵扣金额|',
                        key: 'choseInMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params)=>{
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },this.$global.isMoneyShow(params.row.choseInMoney)),
                            ])
                        }
                    },
                    
                    {
                        title: '实提金额',
                        key: 'deliveryTotalMoneyCus',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.deliveryTotalMoneyCus))
                        }
                    },
                    //下面是用来显示计算的数值
                     {
                        title: '已付款金额',
                        key: 'receivedMoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.receivedMoney))
                        }
                    },
                    {
                        title: '已提现金额',
                        key: 'tixianSMoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.tixianSMoney))
                        }
                    },
                     {
                        title: '已抵扣金额',
                        key: 'dikouSmoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.dikouSmoney))
                        }
                    },
                     
                     {
                        title: '已二次收款金额',
                        key: 'skSmoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.skSmoney))
                        }
                    },
                    //计算一共入金 多少，出金多少
                     {
                        title: '出金额',
                        key: '',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                           let a = this.$global.accAdd(params.row.receivedMoney,params.row.tixianSMoney)
                          return h('div',{

                          },this.$global.isMoneyShow(a))
                        }
                    },
                    {
                        title: '入金额',
                        key: '',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                           let a = this.$global.accAdd(params.row.deliveryTotalMoneyCus,params.row.skSmoney)
                           let b = this.$global.accAdd(a,params.row.dikouSmoney)

                          return h('div',{

                          },this.$global.isMoneyShow(b))
                        }
                    },
                    
                    {
                        title: '合同金额',
                        key: 'moneyAll',
                        align: 'center',
                        width:'80',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.moneyAll))
                        }
                    },
                    {
                        title: '合同重量',
                        key: 'zhongliangAll',
                        align: 'center',
                        width:'80',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.accPrecision(params.row.zhongliangAll,3))
                        }
                    },
                    {
                        title: '实提重量',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        width:'80',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                        }
                    },
                    {
                        title: '抵扣申请状态',
                        key: 'dikouStatus',
                        align: 'center',
                        width:'80',
                        render:(h,params) =>{
                          return h('div',{

                          },params.row.dikouStatus)
                        }
                    },
        ],
        columnTwo:[
                    {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        fixed:'left',
                        width:'100',
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.dataTwo.splice(params.index,1);
                                        }
                                    }
                                }, '删除'),
                             ]);
                        }    
                    },
                    {
                        title: '订单号',
                        key: 'ordersNo',
                        align: 'center',
                        width:'120',
                    },
                     {
                        title: '销售方名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '剩余可抵扣金额',
                        key: '',
                        align: 'center',
                        width:'120',
                        render:(h,params)=>{
                          //出金额
                           let a = this.$global.accAdd(params.row.receivedMoney,params.row.tixianSMoney)
                                a = this.$global.accAdd(a,params.row.dikouSmoney)
                          //入金额
                           let b = this.$global.accAdd(params.row.deliveryTotalMoneyCus,params.row.skSmoney)
                          //  let c = this.$global.accAdd(b,params.row.dikouSmoney)
                            //差额 出 - 入
                            let d = this.$global.accMinus(a,b)
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },this.$global.isMoneyShow(d)),
                            ])
                        }
                    },
                    {
                        title: '选择抵扣金额',
                        key: 'inMoney',
                        align: 'center',
                        width:'120',
                          render:(h,params)=>{
                            return h('div',[
                                 h('Input',{
                                    props:{
                                        type:'text',
                                         value:params.row.inMoney,
                                    },
                                    style:{
                                      
                                   },
                                   on:{
                                  'on-blur':(event)=>{
                                          this.dataTwo[params.index].inMoney=event.target.value
                                        
                                    }
                                }
                            },)
                          ])
                        }  

                    },
                    {
                        title: '合同金额',
                        key: 'moneyAll',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.moneyAll))
                        }
                    },
                    {
                        title: '合同重量',
                        key: 'zhongliangAll',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.accPrecision(params.row.zhongliangAll,3))
                        }
                    },
                    {
                        title: '结算重量',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                        }
                    },
                    {
                        title: '结算金额',
                        key: 'deliveryTotalMoneyCus',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.deliveryTotalMoneyCus))
                        }
                    },
        ],//添加抵扣来源
                
      }
    },
    
    methods:{
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
      getAdminList(){
         let param = {};
         param.pageSize = "99999"
         param.status  ="1"
        //  adminList
        getUserList(param).then(res=>{
            if(res.code =="100"){
              res.data.list.map(item=>{
                let dic = {};
                dic.value =Number(item.id);
                dic.label = item.cname;
                this.adminList.push(dic);
              })
              //赋值
              console.log(this.$global.adminInfo.id)
              this.adminSearch = Number(this.$global.adminInfo.id);
              this.adminSearchId = this.$global.adminInfo.id;
          }  
         })
       },
        getAdmin(item){
        if(item){
        this.adminSearchId = item.value;

        }else{
        this.adminSearchId = '';

        }
      },
      //付款金额超出剩余未付金额时提示
      getBlur(){
         if(this.$route.query.status <8){

         }else{
                  if(Number(this.formItem.payMoney)>Number(this.totalDifferenceMoney)){
                this.show_t=true;
                this.$Notice.error({
                                        title:'请注意付款金额超出',
                                      })

              }else{
                this.show_t=false; 
              }
         }
       
      },
      //处理短信发送的方法,对其他方法不影响
      sendMessage(){ 
        //暂时先不发送 
        //先判断是否需要发送
        let p = {};
        p.codeInfoCodeId = 14;//小代码管理中的 "是否开启短信通知"的对应id
        findCodeInfo(p).then(res =>{
              if(res.code =='100'){
                if(res.data.list){
                  if(res.data.list[0].codeInfoKeysm =="1"){
                      console.log("开始发送短信")
                      let that=this;
                     setTimeout(function(){
                        that.sendMessage_step2();
                     },0)

                  }else{
                      console.log("不需要发送短信")

                  }
                }
            }else{
            }
         })
        //在进行发送
      },
      sendMessage_step2(){
           let p = {};
      const mobile = process.env.NODE_ENV === 'development' ? '18762815383' : '13405917171'

      //账号1
      p.username = "jiangang"
      p.password = "jiangang123456789"
      p.mobile = mobile
      p.content = "订单："+this.formItem.orderNo+"，付款："+this.$global.isMoneyShow(this.formItem.payMoney)+" 给"+this.$route.query.shopOrgName+"，申请人:"+this.$global.adminInfo.cname;
          this.$http.jsonp('http://114.215.196.145/sendSmsApi',{params:p})
                        .then(function(res){
                          console.log("短信发送成功")
                          console.log(res)
                        },function(res){
                          console.log("短信发送失败")
                          console.log(res)
                        })
          
      },
  
      //步骤1 添加流水到公司流水表 只记录关系，等待财务审核
      changeItem(){ 
        if(this.dataTwo.length>0){
         this.d_step1(); 
        }
      },
      //添加流水到公司流水
      d_step1(){
          let list=[];
         
          let param={};
          this.dataTwo.map((item)=>{
            let dic={};
            dic.customerId      = '';
            dic.orderId         = item.id;
            dic.inMoney         = item.inMoney;
            dic.outMoney        = '0';
            dic.currentMoney    = '0';
            dic.userId          = item.userId;
            dic.payMoneyType    = '6';
            dic.note            = '抵扣';
            dic.orderNo         = item.ordersNo;//被抵扣订单号
            dic.bankJgId        = item.bankJgId;
            dic.orgId           = item.merchantsId;//店铺的orgid
            dic.orgName         = item.shopOrgName;//店铺公司名称
            dic.daozhangdanId   = '0';               
            dic.bankConnectedId = '0';              
            dic.zhidanApplyId   = this.zhidanApplyId;
            dic.zhaiyao         = '采购单抵扣';
            dic.direction       = '';
            dic.type            = '2';
            dic.dikouOrderId    = this.searchOrderItem.id;//抵扣的订单号
            dic.dikouOrderNo    = this.searchOrderItem.ordersNo;//
            dic.status        = '0'

            list.push(dic)
          })
          param.list=list
          getLiuShuiBiao(param).then(res =>{
           if(res.code =='100'){
              this.$Notice.success({
                                   title:'添加抵扣流水成功',
                                 })
           }else{
              this.$Notice.error({
                                   title:'添加抵扣流水失败',
                                 })
           }
        })
      },
      //选择资源分页
      changePageOne(index){
          this.pagesizeaOne=index;
          this.searchOne();
      },
      //点击选择资源的查询
       getMM(){
         this.searchOne();
       },
      //获取下单时间的值
      getData(item){
        console.log(item)
        
        this.beginTime=item[0]?item[0]+' 00:00:00':'';//下单开始时间
        this.stopTime=item[1]?item[1]+' 24:00:00':'';//下单结束时间

      },
      choseSource(){//选择店铺资源
        this.searchOne();
        this.modal2=true;
      },
       //查询表格
      searchOne(){
         //获取查询的input的值
         let param               = {};
            //  param.merchantsName = this.gongYingShang;  //供应商名字
             param.orderShopOrgId= this.gongYingShangId//供应商公司id
             param.cusMerName    = this.caiGouName;     //采购方名字
             param.beginTime     = this.beginTime;      //下单开始时间
             param.endTime       = this.stopTime;       //下单结束时间
             param.pageNum       = this.pagesizeaOne;   //分页
             param.beginStatus   = 8 ;
             param.endStatus     = 10 ;
             param.userId       = this.adminSearchId;//管理员id
             param.engineering    = this.formItem.engineering ;  //工程名称

            //  param.dayu = "Y"
            switch (this.chaType) {
              case '0':
              param.dengyu = "Y"
                break;
             case '1':
              param.dayu = "Y"
                break;
             case '-1':
              param.xiaoyu = "Y"
                break;
              default:
                break;
            }

             findOrdersAll(param).then(res=>{
                    if(res.code =="100"){
                    this.dataOne=res.data.list;
                    let showa=false;
                    let showB=false;
                    this.dataOne.map((item)=>{
                      item.showa=showa
                      item.showB=showB
                      //计算剩余可抵扣金额
                      //出金额
                           let a = this.$global.accAdd(item.receivedMoney,item.tixianSMoney)
                           a = this.$global.accAdd(a,item.dikouSmoney)
                          //入金额
                           let b = this.$global.accAdd(item.deliveryTotalMoneyCus,item.skSmoney)
                          //  let c = this.$global.accAdd(b,item.dikouSmoney)
                            //差额 出 - 入
                            let d = this.$global.accMinus(a,b)
                            d = this.$global.accPrecision(d,2)
                            item.choseInMoney = d;
                      item.inMoney=d;
                      //设置按钮不可点击
                      // item.showa =false;
                      if(Number(d)==0 || item.dikouStatus == '0'){
                        item.showa =true;//不可点击
                      }
                    })
                    this.totalOne=res.data.total; 
                   
                  }  
              })
       },
      ...mapMutations([
      'closeTag'
      ]),
      getShopAccoutID(){//获取公司收款银行卡
      let p  = {};
      p.id = this.$route.query.shopId;
          findShop(p).then(res =>{
            if(res.code =='100'){
              this.shopItem = res.data.list[0];
            }else{
            }
           })
      },
      setMoney(){//设置初始金额
           let a      = 0;
           
            this.data1.map((item) => {
              a = this.$global.accAdd(a,item.jiesuanMoney)

            })
           //订单未实提前 付款按照合同金额来。已经实提的按照实提来
          if(this.$route.query.status <8){
            this.totalDifferenceMoney = this.$global.accMinus(this.$route.query.moneyAll,this.totalApplyMoney)
                //默认本次付款金额 = 剩余未付差额
            if(this.totalDifferenceMoney>0){
              this.formItem.payMoney =this.$global.accPrecision(this.totalDifferenceMoney,2) 
            }else{
              this.formItem.payMoney = 0;
            }

          }else{//已经实提的按照实提来

            this.totalDifferenceMoney = this.$global.accMinus(a,this.totalApplyMoney)
            this.formItem.payMoney              = this.$global.accPrecision(this.$route.query.moneyAll,2)
             //默认本次付款金额 = 剩余未付差额
            if(this.totalDifferenceMoney>0){
              this.formItem.payMoney =this.$global.accPrecision(this.totalDifferenceMoney,2) 
            }else{
              this.formItem.payMoney = 0;
            }
          }
          console.log("剩余未付差额")
          
           console.log('订单状态:'+this.totalDifferenceMoney);
           console.log('结算总金额:'+a);

           console.log('this.totalDifferenceMoney:'+this.totalDifferenceMoney);
      },
        setOrderInfo(){
          console.log("采购单申请付款"+this.$route.query.ordersNo );
          console.log("采购单申请付款"+this.$route.query.status );
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName 
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll) 
          this.getOrderInfo();
          this.getShopAccoutID();
      },
       selectOne(row){
       
       },
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.orgName=this.formItem.companyName //name
         param.pageNum=this.pagesizea //分页
         param.status = 1 ;
         this.getSerch(param)
       },
        getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              this.data1 = res.data.list;
              this.setMoney();
            }else{
            }
          })
      },
       //步骤1 添加制单申请
       //步骤2 修改订单付款状态
       getAdd(){//TODO:
          //判断已申请总金额和 订单金额 前者大于后者 不可再提交
            let a = this.dTMoney;//订单实提金额
            let b = this.$global.accPrecision(this.totalApplyMoney,2) + this.$global.accPrecision(this.formItem.payMoney,2);//申请总金额，包括本次
            //限制暂时不需要
            // if( Number(b) >  Number(a) ){
            //   this.notice = true;
            //    this.isDisable=true;
            //   return;
            // }else{
            //   console.log("小于")
            // }
            this.step1OK();

       },
       step1OK(){//添加到制单表

         let params ={};
            params.orderId                 = this.$route.query.id;      
            params.operator                = this.$global.adminInfo.id         
            params.operatorType = "1"
            if(this.formItem.dikouMoney == 0){
              params.jiesuanStatus           =  "1"
            }else{
              params.jiesuanStatus           =  "0" //需要抵扣变成0             
            }
            params.businessNote                    =  this.formItem.note;
            params.money                   =  this.formItem.payMoney //付款金额 
            params.updateDiKou             = this.formItem.dikouMoney //抵扣金额 
            params.orderType              = "1"//1采购单 2销售单 
            params.dikouMoney = this.formItem.dikouMoney
            params.actualPayMoney = this.formItem.actualPayMoney//实际付款金额 = 申请金额 - 抵扣金额

            params.skOrgId       = this.$route.query.merchantsId
            params.skShopId      = this.$route.query.shopId
            params.skOrgAcountId = this.shopItem.accountId
            params.skOrgName     = this.$route.query.shopOrgName

            params.dkOrgName     = this.$route.query.companyName;  //本公司的公司名称
            params.auditStatus   = "8"
          
          addJgJieSuan(params).then(res =>{
             if(res.code =='100'){
               this.zhidanApplyId = res.msg;
               this.changeItem();
               this.step2OK();
               this.sendMessage();
               this.isDisable=true;
                 this.$Notice.success({
                     title:'提交付款申请成功',
                     duration:1,
                     onClose:res =>{
                        console.log("关闭时回调")
                       this.closeSelf();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'提交付款申请失败'
                 })
             }
          })
       },
        step2OK(){//修改订单付款状态
           let p = {};
           let plsit = [];
           let dic = {};
           dic.id = this.$route.query.id;
           dic.payMoneyStatus = "1"
           plsit.push(dic);
           //修改订单的抵扣状态 如果选择了抵扣的话,修改为0 则订单暂时锁定不可用
           this.dataTwo.map(item=>{
             let adic = {};
             adic.id = item.id;
             adic.dikouStatus = '0';
            plsit.push(adic);

           })
          p.pageUpdateOrderList = plsit;
          updateOrderStatus(p).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'修改订单付款状态成功',
                     duration:1,
                     onClose:res =>{
                        console.log("关闭时回调")
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'修改订单付款状态失败'

                 })
             }
          })
       },
       closeSelf(){
         this.closeTag({
              name: 'order_pay_info',
              query:this.$route.query
          })
       },
       //获取已申请总金额
       getApplyList(){
         let p             = {};
             p.beginStatus = "1";
             p.endStatus   = "999999";
             p.orderNo     = this.$route.query.ordersNo;
             p.orderType   = '1';                         //必传 采购单
         findJgJieSuanInfo(p).then(res =>{
           if(res.code =='100'){
             res.data.list.map(item=>{
                this.totalApplyMoney = this.$global.accAdd(this.totalApplyMoney,item.money)
             })
              this.setMoney();
           }
          
          })
       },
       //获取合同金和公司信息 findOrgMoneyRecordMoneySum

       getHe(){
         let param={};
         param.pageNum='1';
         param.orgName=this.$route.query.shopOrgName;
         param.status='1';
         let a = this.$global.orgPinJieStr
         param.six = a//传入所有需要查询的字段
         param.bankJgId  = this.$global.OMRBankJgId(this.$route.query.bankJgId);

         findOrgMoneyRecordMoneySum(param).then(res =>{
          
           if(res.code =='100'){
               let item=res.data.list[0]
                this.comPanyM=item.orgName;
                this.zhangHuYuE=this.$global.isMoneyShow(this.$global.accMinus(item.inMoney2,item.outMoney2));
                this.yingShou=this.$global.isMoneyShow(item.inMoney2);
                this.yingFu=this.$global.isMoneyShow(item.outMoney2);
           }
          })

       },
       getOrderMessage(){//获取订单信息 TODO
        //获取到query 信息后，取出订单号 用来查询
        let p = {};
        p.ordersNo = this.$route.query.ordersNo
         findOrdersAll(p).then(res=>{
            if(res.code =="100"){
               this.searchOrderItem = res.data.list[0];
               //赋值
               this.caiGouName      = this.searchOrderItem.customerOrgName  //采购方名字
               this.gongYingShang   = this.searchOrderItem.shopOrgName      //供应商名字
               this.gongYingShangId = this.searchOrderItem.merchantsId      //供应商id
          }  
        })
       },

    },
    
    mounted(){
          this.getOrderMessage();
          this.getApplyList();
          this.setOrderInfo();
          this.getHe();//获取公司总金额
          this.getAdminList();
          this.getGongcheng();

    },
     //totalSum
   computed:{ //计算总金额和总重量
        total(){
            let a      = 0;
            let b  = 0;
           
            this.data1.map((item) => {
              a = this.$global.accAdd(a,item.jiesuanMoney)
              b = this.$global.accAdd(b,item.jiesuanWeight)

            })
            this.dTMoney    = a
            this.dTweight  = b
            //如果选择了抵扣金额
            let priceZhong=0;
            this.dataTwo.map((item)=>{
                 priceZhong+=Number(item.inMoney)
            })
              if(this.dataTwo.length>0){
                this.formItem.dikouMoney = this.$global.accPrecision(priceZhong,2);
              }
            this.formItem.actualPayMoney = this.$global.accMinus(this.formItem.payMoney,this.formItem.dikouMoney)//实际付款金额 = 申请金额 - 抵扣金额
            this.formItem.actualPayMoney = this.$global.accPrecision(this.formItem.actualPayMoney,2);
            return this.dTMoney, this.dTweight,this.formItem.dikouMoney
        }
    },
    created(){
   
    },
}

</script>
<style lang="less">
.ivu-table ivu-table-small ivu-table-border{
   padding-left: 0!important;
   padding-right: 0!important;;
}

.order_all{
  height:120px;
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
.font_32 {font-size: 32;}
.row_lp{
      font-size:20px;
      time{
        color:red;
      }
    }
    .ivu-modal{
      top:4px !important;
    }
</style>