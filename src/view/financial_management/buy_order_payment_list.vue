<!--
 * @Description: 采购单付款列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-09 15:10:51
 -->
<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
      <Form :model="formItem" :label-width="80">
          <Row>
            <i-Col span="5">
            <!-- <FormItem label="公司名称:" style="margin-right:10px;">
            <Input  placeholder="请输入公司名称" v-model="formItem.companyName"></Input>
            </FormItem> -->
            </i-Col>
          
            <i-Col span="3">
              <!-- <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button> -->
              <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

            </i-Col>
          </Row>
          <br>
                 <time>说明：剩余可抵扣金额为<span style="color:red">负</span>，则需要给钢厂<span style="color:red">补款</span>;<br>剩余可抵扣金额为<span style="color:red">正</span>，则需要钢厂<span style="color:red">退款给平台，或进行抵扣</span></time>

          <Table border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
              
          </Table>

          <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
      </Form>
     </Card>    
      <!-- 添加人员 -->
     <Modal
        title="审核"
        v-model="modal"
        footer-hide 
        :mask-closable="false"  width='1300px;' >
        <Form :label-width="120" inline :model="formItem">
            <FormItem label="订单号:" prop="name">
           <i-input   style="width:180px" v-model="formItem.orderNo" placeholder="请输入姓名"/>
         </FormItem>
         <FormItem label="申请金额:" prop="name">
           <i-input disabled   style="width:180px" v-model="formItem.payMony" placeholder="请输入姓名"/>
         </FormItem>
         <FormItem label="申请抵扣金额:" prop="name">
           <i-input :disabled="dikouDisabled" @on-blur="changeDiKouMoney"  style="width:180px" v-model="formItem.zongMoney" placeholder="抵扣金额"/>
         </FormItem>
          </Form>
          <!-- 新增抵扣添加资源 -->
          <Row>
            <h2>抵扣金额来源</h2>
            <Row style='margin-left:30px;margin-bottom:15px;'>
                <i-col span='5' style='padding-top:5px;'>合计抵扣：{{formItem.dikouMoney}}元</i-col>
                <i-col span='5'>
                  <Button v-if="choseSourceShow" type="primary" @click='choseSource'>选择抵扣来源</Button>
                </i-col>
            </Row>
            <br>
                 <time>说明：剩余可抵扣金额为<span style="color:red">负</span>，则需要给钢厂<span style="color:red">补款</span>;<br>剩余可抵扣金额为<span style="color:red">正</span>，则需要钢厂<span style="color:red">退款给平台，或进行抵扣</span></time>
            
            <!-- 抵扣的表格 -->
            <Row>
                <Table :columns="columnTwo" :data="dataTwo"></Table>

            </Row>
            <!-- 结束 -->
          </Row>
          <!-- 结束 -->
          <p style="visibility: hidden;">{{totalPrice}}</p>
          <div class="margin-top-20">
              <Button   type="primary" @click="changeItem" :disabled="isDisable">确认抵扣</Button>
              <Button style="margin-left:20px"  type="default" @click="modalCancel">取消</Button>
          </div>
     </Modal>
    <!-- 新增添加资源抵扣弹窗 -->
      <Modal title="选择订单资源" v-model="modal2" footer-hide :mask-closable="false"  width='1400px;' >
        
          <Row>
             <Form :label-width="120" inline >
                <!-- <FormItem label="供应商店铺查询:">
                    <Select v-model="gongYingShang" style="width:200px" placeholder="请输入店铺名称"  @on-change='getDian'  :label-in-value='true'>
                      <Option v-for="(item,index) in shopList" :value="JSON.stringify(item)" :label="item.name" :key="index" >{{ item.name }}</Option>
                    </Select>
                </FormItem> -->

                <FormItem label="供应商店铺查询:" prop="gongYingShang">
                  <i-input   style="width:180px" v-model="gongYingShang" placeholder="供应商名字"/>
                </FormItem>
                

                 <FormItem label="采购方名称:" prop="caiGouName">
                  <i-input   style="width:180px" v-model="caiGouName" placeholder="采购方名字"/>
                </FormItem>
                <!-- <FormItem label='采购方名称'>
                      <Select  @on-change='getCai' style='width:150px'
                                  
                          v-model="caigou"
                          filterable
                          remote
                          :remote-method="remoteMethod3"
                          :loading="loading3">
                            <Option v-for="(option, index) in options3" :value="option.value" :key="index">{{option.label}}</Option>
                      </Select>
                </FormItem> -->

              <FormItem label="下单时间">
                 <i-Col span="12">
                      <DatePicker type="daterange" @on-change='getData' placement="bottom-end" placeholder="请选择日期" style="width: 200px"></DatePicker>
                 </i-Col>

              </FormItem>

             </Form>

             <!-- 查询 -->
             <Row style='padding-left:30px;'>
                 <Button @click='getMM'  type="primary">查询</Button>
             </Row>
             <!-- 选择订单资源的表格 -->
             <Row>
                <Table :columns="columnOne" :data="dataOne"></Table>
                <Page @on-change="changePageOne" style="margin-top:10px;text-align:right;"   :total="totalOne" show-total ></Page>
             </Row>



          </Row>

      
       
        
      </Modal>
     

     </div>
</template>

<script>                                            //添加流水表到公司流水
import {findJgJieSuanInfo,
updateShopMoneyJieSuanMer,
getLiuShuiBiao,
addBillFlow,updateJieSuanForStatus1,
updateOrgMoneyRecord} from '@/api/data'
import { setTimeout } from 'timers';
import {findShop,findOrgCusAcc,findOrdersAll,updateOrderStatus} from '@/api/data';//查询店铺  查询公司
export default {
    name: 'buy_order_payment_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        choseSourceShow:true,
        orgnizationsStatus:false,
        dikouDisabled:false,
        index_one:"",//保存添加数据的下表
        dataOne:[],//选择资源数组
        dataTwo:[],//选择资源添加后的数组
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
                                               //this.dataTwo.push(params.row)
                                             
                                              //  this.dataTwo.map((item)=>{
                                              //    item.showB=showB;
                                              //    item.inMoney=''
                                              //  })
                                                this.dataTwo.push(params.row)
                                               //this.index_one=params.index
                                        }
                                    }
                                }, '添加'),
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
                          //入金额
                           let b = this.$global.accAdd(params.row.deliveryTotalMoneyCus,params.row.skSmoney)
                           let c = this.$global.accAdd(b,params.row.dikouSmoney)
                            //差额 出 - 入
                            let d = this.$global.accMinus(a,c)
                            return h('div',[
                                 h('div',{
                                    
                                    style:{
                                      
                                   },
                                   },this.$global.isMoneyShow(d)),
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
                        title: '实提重量',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
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
                                             //this.dataTwo
                                             this.remove(params.index)
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
                        title: '剩余可抵扣金额|',
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
                        title: '选择抵扣金额|',
                        key: 'inMoney',
                        align: 'center',
                        width:'120',
                          render:(h,params)=>{
                            return h('div',[
                                 h('Input',{
                                    props:{
                                        type:'text',
                                         value:params.row.inMoney,
                                        // disabled:params.row.showB, 
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
                    // {
                    //     title: '合同金额',
                    //     key: 'moneyAll',
                    //     align: 'center',
                    //     width:'120',
                    //      render:(h,params) =>{
                    //       return h('div',{

                    //       },this.$global.isMoneyShow(params.row.moneyAll))
                    //     }
                    // },
                    // {
                    //     title: '合同重量',
                    //     key: 'zhongliangAll',
                    //     align: 'center',
                    //     width:'120',
                    //      render:(h,params) =>{
                    //       return h('div',{

                    //       },this.$global.accPrecision(params.row.zhongliangAll,3))
                    //     }
                    // },
                    // {
                    //     title: '实提重量',
                    //     key: 'deliveryTotalWeight',
                    //     align: 'center',
                    //     width:'120',
                    //     render:(h,params) =>{
                    //       return h('div',{

                    //       },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                    //     }
                    // },
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
        ],//添加抵扣来源
        totalOne:0, //表格分页总天数
        pagesizeaOne:1,//默认分页第一页
        beginTime:'',//下单开始时间
        stopTime:'',//下单结束时间
        caigou:'',//采购方
        loading3:false,
        options3:[],//采购方
        caigouData:[],
        caigouOne:[],
        paramCaiGou:{},//采购列表
        caiGouName:'',//采购方名称
        paramFirst:{},//查询采购方参数对像
        gongYingShang:"",//供应商初始值
        gongYingShangName:'',//供应商名字
        gongYingShangId:'',//供应商id
        shopList:[],//供应商数组
        param1:{pageSize:"999999"},//查询店铺参数
        isDisable:false,
        //弹出框使用的数据
        modal:false,
        modal2:false,//添加资源弹窗
        //弹出框使用的数据结束
        tableItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          orderNo:'',
          payMony:'',
          dikouMoney:'',
          zongMoney:'0',//抵扣总金额
        },
        columns4: [
                    {
                        title: 'ID|',
                        key: 'jgJieSuanId',
                        align: 'center',
                        width:'60'
                    },
                     {
                        title: '供应商名称',
                        key: 'skOrgName',
                        align: 'center',
                        width:'180'
                    },
                     {
                        title: '采购方名称',
                        key: 'dkOrgName',
                        align: 'center',
                        width:'180'
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
                                           params.row.operateType  ="1"//查看
                                           sessionStorage.setItem('CAIGOU','')
                                           params.row.ordersNo=params.row.orderNo
                                           sessionStorage.setItem('CAIGOU',JSON.stringify(params.row))
                                               const route = {
                                                  name: 'order_buy_info',
                                                 // query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                            }
                          },params.row.orderNo);
                        }
                    },
                     {
                        title: '申请金额(元)',
                        key: 'money',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.money))
                        }
                        
                    },
                      {
                        title: '申请抵扣金额 (元)',
                        key: 'updateDiKou',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.updateDiKou))
                        }
                    },
                     {
                        title: '备注',
                        key: 'businessNote',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '申请时间',
                        key: 'createTime',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '管理员',
                        key: 'userName',
                        align: 'center',
                        width:'100'
                    },
                     
                   
                     {
                        title: '操作|',
                        key: 'operate',
                        align: 'center',
                        width:'140',
                        fixed:'right',
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '2px'
                                    },
                                    on: {
                                        click: () => { 
                                          this.modal = true;
                                          this.tableItem = params.row;
                                          this.caiGouName=params.row.customerOrgName //采购方名字
                                          this.gongYingShang=params.row.merchantsName//供应商名字
                                          this.gongYingShangId = params.row.merchantsId//供应商id
                                          this.dataTwo = [];//先清空一下防止有值
                                          this.orgnizationsStatus = false;//初始化
                                          this.choseSourceShow = true;//初始化
                                          this.setItemInfo(params.row);
                                        }
                                    }
                                }, '抵扣'),
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '2px'
                                    },
                                    on: {
                                        click: () => { 
                                          this.payConfirmListDelete(params.row);
                                        }
                                    }
                                }, '删除'),
                             ]);
                    }
                        
                    },
                    
        ],
        data1: [],//表格展示的数据

                
      }
    },
    
    methods:{
      chanOrder(row){
        if(row.orgnizations.length<=0){
          return false;
        }
           let p = {};
           let plsit = [];
           //修改订单的抵扣状态 如果选择了抵扣的话,修改为0 则订单暂时锁定不可用
           row.orgnizations.map(item=>{
             let adic = {};
             adic.id = item.orderId;
             adic.dikouStatus = '1';
            plsit.push(adic);
           })
          p.pageUpdateOrderList = plsit;
          updateOrderStatus(p).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'修改订单抵扣状态成功',
                 })
             }else{
                 this.$Notice.error({
                     title:'修改订单抵扣状态失败'

                 })
             }
          })
      },
      payConfirmListDelete(row){//删除 的时候，同时修改订单的dikouStatus =1
          let plist = [];
              let dic = {};
              dic.jieSuanId = row.jgJieSuanId;
              plist.push(dic)

          let p  ={};
          p.status1 = "0";

          p.pageCustomerStatuses = plist;

          this.$Modal.confirm({
                     title:"确定需要删除吗",
                     onOk:()=>{
                       this.chanOrder(row);
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
      changeDiKouMoney(event){//传值时 以输入框中的值为准 失去焦点时触发
            this.formItem.zongMoney = this.$global.accPrecision(this.formItem.zongMoney,2);//四舍五入取2位
      },
      choseSource(){//选择店铺资源
        this.searchOne();
        this.modal2=true;
      },
      //删除选中资源
      remove(index){
         this.dataTwo.splice(index, 1);
         this.searchOne();
      },
       //查询表格
      searchOne(){
         //获取查询的input的值
         let param               = {};
            //  param.merchantsName = this.gongYingShang;  //供应商名字
             param.orderShopOrgId= this.gongYingShangId//供应商公司id
             param.cusMerName    = this.caiGouName;     //采购方名字
            //  param.beginTime     = this.beginTime;      //下单开始时间
            //  param.endTime       = this.stopTime;       //下单结束时间
             param.pageNum       = this.pagesizeaOne;   //分页
             param.beginStatus   = 8 ;
             param.endStatus     = 10 ;
             param.dayu = "Y"
             this.getSerchOne(param)
       },
       //点击选择资源的查询
       getMM(){
         this.searchOne();
       },
       //查询接口
       getSerchOne(param){
         findOrdersAll(param).then(res=>{
            if(res.code =="100"){
            this.dataOne=res.data.list;
            let showa=false;
            let showB=false;
            this.dataOne.map((item)=>{
              item.showa=showa
              item.showB=showB
              item.inMoney='0'
            })
            this.totalOne=res.data.total; 
          }  
        })
      },



      //获取采购方名称
      getCai(item){
       //this.caigou=item;
      // this.paramFirst.orderShopCompanyName= item
      this.caiGouName=item;//采购方名称赋值

       console.log(item)
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
      //供应商店铺
      // getShop(param){
      //   param.status = 1;
      //   param.pageSize = "999999"
      //   findShop(param).then(res=>{
      //     if(res.code =="100"){
      //       this.shopList=res.data.list
      //     }
      //   })
      // },
      //获取供应商选中的值
      // getDian(item){
      //   const stingR=eval('(' + item.value + ')')
      //   console.log(stingR) 
      //   this.gongYingShangName=stingR.name;//供应商店铺名称
      //   this.gongYingShangId=stingR.id;//供应商店铺id
      // },
      //获取下单时间的值
      getData(item){
        console.log(item)
        this.beginTime=item[0];//下单开始时间
        this.stopTime=item[1];//下单结束时间

      },

      setItemInfo(row){//给弹出框赋值
          this.formItem.orderNo = row.orderNo
          this.formItem.payMony = this.$global.accPrecision(row.money,2)
          this.formItem.dikouMoney= this.$global.accPrecision(row.updateDiKou,2)
          //TODO 预处理一下数据
          if(row.orgnizations.length>0){
            this.orgnizationsStatus = true;
            this.choseSourceShow = false;
            row.orgnizations.map(item=>{
              item.ordersNo = item.orderNo
              item.shopOrgName = item.orgName;
            })
            this.dataTwo = row.orgnizations
            
          }
      },
            payOnlineBusiness(){//合同审核线上付款,被抵扣列表中要是无数据就都不添加
            if(this.dataTwo.length==0){
              return false;
            }
            console.log(this.dataTwo.length)
          let p                     = {};
          let plist                 = [];
          //主订单
          let dic                   = {};
              dic.billType          = '20070';  //账单类型
              dic.fsMoney           = '0';  //发生金额
              dic.ysMoney           = this.$global.accMinus(0,this.formItem.dikouMoney);  //应收金额
              dic.dkpMoney          = '0';  //待开票金额

              dic.sellerEmpDept     = '';  //卖家负责人部门
              dic.sellerCompanyId   = this.tableItem.merchantsId;  //卖家公司id
              dic.sellerCompanyName = this.tableItem.merchantsName;  //卖家公司名称
              dic.sellerEmpName     = '';  //卖家负责人名称

              dic.buyerEmpDept      = '';  //买家负责人部门 本公司
              dic.buyerCompanyId    = this.tableItem.customerOrgId;  //买家公司id
              dic.buyerEmpName      = '';  //买家负责人名称
              dic.buyerCompanyName  = this.tableItem.customerOrgName;  //买家公司名称

              dic.orderId           = this.tableItem.orderId;  //订单id
              dic.orderNo           = this.tableItem.orderNo;  //订单号

              dic.accApply          = '';  //打款申请
              dic.dkApply           = this.tableItem.jgJieSuanId;  //抵扣申请
              dic.txApply           = '';  //提现申请
              dic.kpApply           = '';  //开票申请
              dic.zxStatus          = '1';  //注销状态
              dic.note              = '抵扣账单';  //备注
              dic.status            = '1';  //可用状态
              dic.transactionType   = '2';  //交易账单类型（买家账单，卖家账单）
            plist.push(dic);
            p.billFlowList = plist;
          //抵扣订单
          this.dataTwo.map(item=>{
             let dic                   = {};
              dic.billType          = '20060';  //账单类型
              dic.fsMoney           = item.inMoney;  //发生金额
              dic.ysMoney           = '0';  //应收金额
              dic.dkpMoney          = '0';  //待开票金额

              dic.sellerEmpDept     = '';  //卖家负责人部门
              dic.sellerCompanyId   = item.orgId;  //卖家公司id
              dic.sellerCompanyName = item.orgName;  //卖家公司名称
              dic.sellerEmpName     = '';  //卖家负责人名称

              dic.buyerEmpDept      = this.$global.adminInfo.cname;  //买家负责人部门 本公司
              dic.buyerCompanyId    = item.customerOrgId;  //买家公司id TODO 无此数据
              dic.buyerEmpName      = '';  //买家负责人名称
              dic.buyerCompanyName  = item.customerOrgName;  //买家公司名称

              dic.orderId           = item.orderId;  //订单id
              dic.orderNo           = item.orderNo;  //订单号

              dic.accApply          = '';  //打款申请
              dic.dkApply           = this.tableItem.jgJieSuanId;  //抵扣申请
              dic.txApply           = '';  //提现申请
              dic.kpApply           = '';  //开票申请
              dic.zxStatus          = '1';  //注销状态
              dic.note              = '抵扣释放账单';  //备注
              dic.status            = '1';  //可用状态
              dic.transactionType   = '2';  //交易账单类型（买家账单，卖家账单）
            plist.push(dic);
            p.billFlowList = plist;

          })
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
      //步骤1 修改结算单的信息
      //步骤2 添加流水到公司流水表
      //步骤3 用主订单的钱 去抵扣 欠款订单的钱。 
      // 主订单修改 dikou_s_money 为正值
      //      被抵扣订单列表中订单的信息 dikou_s_money 写负值 说明订单一部分钱走出去了
      changeItem(){ 
         this.step1OK();
         if(this.orgnizationsStatus)
         {//如果orgnizations中有数据，则是业务员提交的直接修改不同在新增加
            this.updateOMRList();
         }
         else
         {
            this.getLiuShui(); //添加到流水到公司流水表 //如果返回的 orgnizations 中有数据，则说明是业务员提交的绑定好的，则只需要修改信息即可
         }
         this.step2OK(); 
          this.payOnlineBusiness();

      },
      updateOMRList(){//修改流水信息 TODO
          let p  ={};
          let plist = [];
          this.dataTwo.map(item=>{
            let dic = {};
            dic.id = item.id;
            dic.inMoney = item.inMoney;
            dic.status = "1"
            plist.push(dic);
          })
          p.list = plist;
              updateOrgMoneyRecord(p).then(res =>{
                    if(res.code =='100'){
                      this.$Notice.success({
                        title:'修改流水信息成功',
                    })
                  }else{
                      this.$Notice.error({
                      title:'修改流水信息失败'
                      })
                  }
              })
      },
      step2OK(){//修改主订单和抵扣订单相关金额信息
      let p = {};
      let plist = [];
      //主订单 
      let dic             = {};
          dic.id          = this.tableItem.orderId;
          dic.dikouSMoney = this.formItem.zongMoney
      plist.push(dic);
      //被抵扣订单列表
      this.dataTwo.map((item) =>{
            let pdic             = {};
                if(this.orgnizationsStatus){//从流水中来的数据
                  pdic.id          = item.orderId;//需要被抵扣订单的订单id

                }else{//从订单中选择的数据
                  pdic.id          = item.id;//需要被抵扣订单的订单id

                }
                pdic.dikouSMoney = Number(0-item.inMoney);
                pdic.dikouStatus = '1';//0 是不可用 1是抵扣时可用。
            plist.push(pdic);
      })
      p.pageUpdateOrderList = plist;
        updateOrderStatus(p).then(res =>{
              if(res.code =='100'){
                this.$Notice.success({
                  title:'修改订单抵扣信息成功',
               })
            }else{
                 this.$Notice.error({
                 title:'修改订单抵扣信息成功失败'
                })
            }
         })
      },
      step1OK(){
        console.log("开始抵扣")

        let param = {}
        param.bankJgId       = this.tableItem.bankJgId
        param.jgJieSuanId    = this.tableItem.jgJieSuanId;
        param.jgJieSuanMoney = this.formItem.dikouMoney
        param.orderId        = this.tableItem.orderId
        param.orderMoney     = this.tableItem.jgJieSuanMoney
        param.shopId         = this.tableItem.shopId
        param.userId         = this.$global.adminInfo.id
        //2019年5月9日11:27:59 新增
        param.dikouMoney     = this.formItem.dikouMoney;
        param.actualPayMoney = this.$global.accMinus(this.formItem.payMony,this.formItem.dikouMoney);  //实际付款金额 = 申请金额 - 抵扣金额
        updateShopMoneyJieSuanMer(param).then(res =>{
           if(res.code =='100'){
             this.isDisable=true;
                  this.$Notice.success({
                                   title:'抵扣成功',
                                   duration:2,
                                  onClose:res =>{
                                      console.log('关闭时回调')
                                      this.reload();
                                  }
                                 })
           }else{
           }
        })
      },
      //添加流水到公司流水
      getLiuShui(){
          let list=[];
         
          let param={};
          console.log(this.dataTwo)
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
            dic.orderNo         = item.ordersNo;
            dic.bankJgId        = item.bankJgId;
            dic.orgId           = item.merchantsId;//店铺的orgid
            dic.orgName         = item.shopOrgName;//店铺公司名称
            dic.daozhangdanId   = '0';               
            dic.bankConnectedId = '0';              
            dic.zhidanApplyId   = this.tableItem.jgJieSuanId;
            dic.zhaiyao         = '采购单抵扣';
            dic.direction       = '';
            dic.type            = '2';
            dic.dikouOrderId    = this.tableItem.jgJieSuanOrderId;
            dic.dikouOrderNo    = this.tableItem.orderNo;
             dic.status        = '1'

            list.push(dic)
          })
          param.list=list
          getLiuShuiBiao(param).then(res =>{
           if(res.code =='100'){
              this.$Notice.success({
                                   title:'添加抵扣流水成功',
                                 })
           }else{
           }
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
      //选择资源分页
      changePageOne(index){
          this.pagesizeaOne=index;
          this.searchOne();
      },
       //查询表格
      searchM(){
         //获取查询的input的值
         let param={};
         param.pageNum=this.pagesizea //分页
         param.jgJieSuanCaoZuoStatus = "0";
         param.beginStatus = "1";
         param.endStatus = "999999";
         param.orderType = "1"
         this.getSerch(param)
      },
       //查询接口
      getSerch(param){

         findJgJieSuanInfo(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
      },
    },
    //计算抵扣金额来源的进价总和
    computed:{
          totalPrice(){ 
            console.log('开始计算')
            let priceZhong=0;
            this.dataTwo.map((item)=>{
                 console.log(item.inMoney)
                 priceZhong+=Number(item.inMoney)
            })
              if(this.dataTwo.length>0){
                this.formItem.zongMoney  = priceZhong
                this.formItem.dikouMoney = priceZhong;
                this.dikouDisabled = true;
              }else{
                this.formItem.dikouMoney = this.formItem.zongMoney;//输入的值
              }
            this.formItem.dikouMoney = this.$global.accPrecision(this.formItem.dikouMoney,2);//四舍五入取2位
            return this.formItem.dikouMoney
          }     
    },
    mounted(){
     this.searchM();
    //  this.searchOne();//选择资源列表
     //this.getShop(this.param1);//查询店铺
    },
    
    created(){
   
    },
}

</script>
<style <style lang="less">
 
 #kehu .ivu-select-input::-webkit-input-placeholder{
  color:red
}
</style>
