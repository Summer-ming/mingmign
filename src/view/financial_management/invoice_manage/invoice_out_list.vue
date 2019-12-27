<!--
 * @Description: 销项票列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-16 09:01:46
 -->




<template>
     <div id='mm'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" :label-width="90" inline>
        <Row>
            <!-- <div >
              <Card :bordered="false">
                <Button shape="circle"  icon="md-refresh" @click="reloadSelf()"></Button>
              </Card>
            </div> -->

          <FormItem label="发票号:" style="margin-right:10px;">
            <i-Input style="width:200px"  placeholder="请输入发票号" v-model="formItem.invoiceNo"></i-Input>
          </FormItem>

           <FormItem label="公司名称查询:" >
            <Select v-model="orgSearch" @on-change='getGongYingShang'  style="width:200px" filterable placeholder="请选择名称"    :label-in-value='true'>
               <Option v-for="(item,index) in orgList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>


            <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>

          <FormItem label="工程名称:" style="margin-right:10px;">
               <el-select style="width:240px" :transfer="true" size="small" multiple v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                          <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-option>
                        </el-select>
          </FormItem>

          <row style='text-align:left;margin-bottom:20px;margin-left:20px;'>
                    <Button type="primary" icon="ios-search" @click='getSearch'>查询</Button>
                    <Button shape="circle"  icon="md-refresh" @click="reloadSelf()"></Button>
                    <Button type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>

          </row>


          <row>
            <i-col style="visibility: hidden;" >{{allMoney}}</i-col>
           <span>重量:<time style='color:red'>{{this.$global.accPrecision(zongWeight,3)}}</time></span>
            <span>总金额:<time style='color:red'>{{this.$global.accPrecision(zongMoney,2)}}</time></span>
             <span>不含税金额:<time style='color:red'>{{this.$global.accPrecision(zongBuMoney,3)}}</time></span>
              <span>税额:<time style='color:red'>{{this.$global.accPrecision(zongSui,3)}}</time></span>
         </row>
      
        </Row>
        <Table  height='450' @on-select-cancel='quxiao' @on-selection-change="selectAllSelection" border ref="selection" size="small" :columns="columns4" :data="data1" >
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;" :page-size='formItem.length'   :total="totalM" show-total ></Page>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findInvoiceOutout,findOrgCusAcc,
findBillFlow,
updateBillFlow,updateOrderSellMoneyBatch,
addBillFlow,findOrderEngineering} from '@/api/data'
import  {getbelongCompanyTypeList} from '@/libs/allStatus'

import {getKeHuLiuShui,
getXiuXiaoPiao,
getXiuGaiDingDanFaPiao89,
getXiuGaiOrderStatus89,
getKeHuLiuShuiBiao,getCompanyLiuShui} from '@/api/cusData'
import {statusStr} from '@/libs/allStatus'
import {lengthList} from '@/libs/global_type'
export default {
    name: 'invoice_out_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
           engineerNameList:[],//工程名称数组
         zongWeight:'',//总重
        zongMoney:'',//总金额
        zongBuMoney:'',//不含税金额
        zongSui:'',//税务
        dataOne:[],
         lengthListThis:lengthList,
        onlineBusinessList:[],
        orgSearch:"",//供应商查询
        gongYingShangName:"",//供应商的值
        gongYingId:"",//供应商id
        orgList:[],
        //弹出框使用的数据
        modal:false,
        //弹出框使用的数据结束
        tableItem:{},
        selectionsList:[],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          invoiceNo:"",//发票号
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
                        key: 'id',
                        align: 'center',
                        width:'60'
                    },
                     {
                        title: '发票号码',
                        key: 'invoiceNo',
                        align: 'center',
                        width:'140'
                    },
                     {
                        title: '公司名称',
                        key: 'companyName',
                        align: 'center',
                        width:'180'
                    },
                      {
                        title: '工程名称',
                        key: 'engineering',
                        align: 'center',
                        width:'100'
                    },
                   
                     {
                        title: '重量',
                        key: 'weight',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.weight,3));
                        }
                    },
                     {
                        title: '金额',
                        key: 'money',
                        align: 'center',
                        width:'140',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.money))
                        }
                        
                    },
                    //  {
                    //     title: '代理',
                    //     key: 'agentName',
                    //     align: 'center',
                    //     width:'250'
                        
                    // },
                    //  {
                    //     title: '本公司抬头',
                    //     key: 'bankJgId',
                    //     align: 'center',
                    //     width:'250',
                    //     render:(h,params) =>{
                    //       return h('div',{
                    //       },getbelongCompanyTypeList(params.row.bankJgId))
                    //     }
                    // },
                    //   {
                    //     title: '申请人',
                    //     key: 'bindInTime',
                    //     align: 'center',
                    //     width:'250'
                    // },
                     {
                        title: '绑定时间',
                        key: 'createTime',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width:'120',
                        render:(h,params)=>{
                          return h('div',{
                          },statusStr(params.row.status))
                        }
                    },
                       {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'160',
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
                                          this.getOnlineBusinessList(params.row);//必须先请求
                                          this.zuoFei(params.row)
                                        }
                                    }
                                }, '作废'),
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
                                          this.getOnlineBusinessList(params.row);//必须先请求
                                          this.hongCong(params.row)
                                        }
                                    }
                                }, '红冲作废'),
                             ]);
                    }
                        
                    },
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1, //初始化时查询的页码数

                returnData:[],//返回的订单明细数据
                dataZhuLie:[],//保存主列表 查询的数组
                
      }
    },
    
    methods:{
      updateOrderInvoiceMoney(list){//发票绑定后更新主订单的 开票金额，开票重量
        let selectOrderList     = [];
        let p                   = {};
            p.pageOrderInfoList = [];
        list.map(item=>{
          selectOrderList.push(item.orderNo);
          let dic         = {};
              dic.orderNo = item.orderNo;
          p.pageOrderInfoList.push(dic);
        })
        p.pageOrderInfoList = this.$global.uniqueNew(p.pageOrderInfoList,'orderNo');
        updateOrderSellMoneyBatch(p).then(res =>{
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
      getOnlineBusinessList(row){
        let p = {};
        p.kpApply = row.id;
        p.status = "1";
        p.pageSize ="99999"
        findBillFlow(p).then(res =>{
              if(res.code =='100'){
                this.onlineBusinessList = res.data.list;
                this.$Notice.success({
                  title:'查询电商流水成功',
               })
            }else{
                 this.$Notice.error({
                 title:'查询电商流水成功失败'
                })
            }
         })
      },
            payOnlineBusiness(){//合同审核线上付款
          let p                     = {};
          let plist                 = [];
          this.onlineBusinessList.map(item=>{
               let dic                   = {};
              dic.billType          = '10200';  //账单类型
              dic.fsMoney           = "0";  //发生金额
              dic.ysMoney           = "0";  //应收金额
              dic.dkpMoney          = this.$global.accMinus(0,item.dkpMoney);  //待开票金额

              dic.sellerEmpDept     = item.sellerEmpDept;  //卖家负责人部门
              dic.sellerCompanyId   = item.sellerCompanyId;  //卖家公司id
              dic.sellerCompanyName = item.sellerCompanyName;  //卖家公司名称
              dic.sellerEmpName     = item.sellerEmpName;  //卖家负责人名称

              dic.buyerEmpDept      = item.buyerEmpDept;  //买家负责人部门 本公司
              dic.buyerCompanyId    = item.buyerCompanyId;  //买家公司id
              dic.buyerEmpName      = item.buyerEmpName;  //买家负责人名称
              dic.buyerCompanyName  = item.buyerCompanyName;  //买家公司名称

              dic.orderId           = item.orderId;  //订单id
              dic.orderNo           = item.orderNo;  //订单号

              dic.accApply          = item.accApply;  //打款申请
              dic.dkApply           = item.dkApply;  //抵扣申请
              dic.txApply           = item.txApply;  //提现申请
              dic.kpApply           = item.kpApply;  //开票申请
              dic.zxStatus          = '1';  //注销状态
              dic.note              = '红冲账单';  //备注
              dic.status            = '1';  //可用状态
              dic.transactionType   = '1';  //交易账单类型（买家账单，卖家账单）
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
      updateOnlineBusiness(){//修改线上流水
          if(this.onlineBusinessList.length==0){
            console.log("无数据")
            return false;
          }
          let p                     = {};
          let plist                 = [];
          this.onlineBusinessList.map(item=>{
              let dic                   = {};
              dic.id = item.id
              dic.status = "0";
              plist.push(dic);
          })
          
            p.billFlowList = plist;
          updateBillFlow(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改电商流水成功',
                    onClose:res =>{
                    }
                 })
              }else{
                   this.$Notice.error({
                   title:'修改电商流水失败'
                  })
              }
           })
       },
       exportData(){//导出到excel

        this.$refs.selection.exportCsv({
          filename:"销项票列表"
        })
      },
       
      //作废
      zuoFei(row){
        console.log('选中的列')
        console.log(row)
        //判断如果没有勾选提示勾选
        // if(this.selectionsList.length<=0){
        //   alert('请先选中')
        //    return false
        // }
        //查询客户流水的参数对象
        this.getZuoFei(row);
        //已经勾选弹出确定弹窗
        this.$Modal.confirm({
                    title: '作废',
                    content: '是否要作废?',
                    onOk: () => {//点击确定作废当前选中
                      console.log(this.returnData)
                       console.log('我是作废')
                      this.updateOnlineBusiness();
                      //步骤111 修改进项票信息
                      let param1 = {};
                      param1.id     = row.id;  //列表选中的id
                      param1.status = '0';     //选中的状态
                    
                      getXiuXiaoPiao(param1).then(res=>{ //修改销项票信息 步骤1
                        if(res.code =="100"){
                          console.log('步骤2成功')
                          //步骤2222   修改订单发票信息 getXiuGaiDingDanFaPiao
                              let param2 ={
                                pageOrderInfoList:[]
                              };
                              let list=[];
                              list = row.listList;

                              list.map((item)=>{  //orderInfoId 订单明细id   ordersId订单id
                                let dic={};
                                 dic.id            = item.orderInfoId;
                                 dic.invoiceStatus = '0'
                                 dic.invoiceWeight = '0';
                                 dic.invoiceMoney = '0'
                                 dic.invoiceNo = '-'
                                 param2.pageOrderInfoList.push(dic)
                              })
                              console.log('获取param2的数据')
                              console.log(param2)
                              getXiuGaiDingDanFaPiao89(param2).then(res=>{ //修改订单发票信息
                                    if(res.code =="100"){
                                            this.updateOrderInvoiceMoney(row.listList);
                                         // 步骤3333  getXiuGaiOrderStatus89  修改订单信息状态 销项票
                                           let param3={
                                             pageUpdateOrderList:[]
                                           };
                                           list.map((item)=>{  //orderInfoId 订单明细id   ordersId订单id
                                              let dio={};
                                              dio.id=item.orderId;
                                              dio.status='8'
                                              param3.pageUpdateOrderList.push(dio)
                                            })
                                            param3.pageUpdateOrderList = this.$global.uniqueNew(param3.pageUpdateOrderList,'id')
                                           getXiuGaiOrderStatus89(param3).then(res=>{ //修改订单状态
                                                if(res.code =="100"){
                                                      //步骤444 getKeHuLiuShuiBiao
                                                      let param4 = {
                                                        list:[]
                                                      };
                                                      let dip={};
                                                      dip.id=this.returnData.id
                                                      dip.status='0'
                                                      param4.list.push(dip)
                                                      console.log('步骤4')
                                                      console.log(param4)
                                                      getKeHuLiuShuiBiao(param4).then(res=>{ //修改流水表
                                                          if(res.code =="100"){
                                                            this.$Notice.success({
                                                                  title:'作废成功',
                                                                  duration:1,
                                                                  onClose:res =>{
                                                                    this.reload();
                                                                  }
                                                              })
                                                            }  
                                                      })

                                                   
                                                  }  
                                            })
                                           
                                       
                                      }  
                              })
                           
                           
                          }  
                    })
                      //步骤33listlisy数组id去从  todo
                    },
                    onCancel: () => {//取消什么都不做
                      
                    }
        });
      },
      //红冲作废
      hongCong(row){
        //判断如果没有勾选提示勾选
        // if(this.selectionsList.length<=0){
        //   alert('请先选中')
        //    return false
        // };
        //查询客户流水的参数对象
        this.getZuoFei(row);
        //已经勾选弹出确定弹窗
        this.$Modal.confirm({
                    title: '红冲作废',
                    content: '是否要红冲作废?',
                    onOk: () => {//点击确定作废当前选中
                    this.payOnlineBusiness();
                      console.log('我是红冲作废')
                      console.log(this.returnData)
                      //步骤111 修改进项票信息
                      let param1 = {};
                      param1.id=row.id;//列表选中的id
                      param1.status='0';//选中的状态
                      getXiuXiaoPiao(param1).then(res=>{ //查询客户资金流水接口
                        if(res.code =="100"){
                          //步骤2222   修改订单发票信息 getXiuGaiDingDanFaPiao
                              let param2 ={
                                pageOrderInfoList:[]
                              };
                              let list=[];
                              list = row.listList;
                              list.map((item)=>{  //orderInfoId 订单明细id   ordersId订单id
                                let dic={};
                                 dic.id=item.orderInfoId;
                                 dic.invoiceStatus='0'
                                 dic.invoiceWeight = '0';
                                 dic.invoiceMoney = '0'
                                 dic.invoiceNo = '-'
                                 param2.pageOrderInfoList.push(dic)
                              })
                              console.log('获取param2的数据')
                              console.log(param2)
                              getXiuGaiDingDanFaPiao89(param2).then(res=>{ //修改订单发票信息
                                    if(res.code =="100"){
                                            this.updateOrderInvoiceMoney(row.listList);
                                           //步骤3333  getXiuGaiOrderStatus
                                           let param3={
                                             pageUpdateOrderList:[]
                                           };
                                           list.map((item)=>{  //orderInfoId 订单明细id   ordersId订单id
                                              let dio={};
                                              dio.id=item.orderId;
                                              dio.status='8'
                                              param3.pageUpdateOrderList.push(dio)
                                            })
                                            param3.pageUpdateOrderList = this.$global.uniqueNew(param3.pageUpdateOrderList,'id')

                                            console.log('param3的数据')
                                           getXiuGaiOrderStatus89(param3).then(res=>{ //修改订单状态
                                                if(res.code =="100"){
                                                      //步骤444 getKeHuLiuShuiBiao
                                                      let param4 = {
                                                        list:[]
                                                      };
                                                      let dip={};
                                                      dip.outMoney =(0-this.returnData.outMoney)
                                                      dip.inMoney ='0'
                                                      dip.payMoneyType ='10'
                                                      dip.status = "1"

                                                      //新的内容
                                                      dip.customerId      = this.returnData.customerId
                                                      dip.orderId         = this.returnData.orderId; //记录
                                                      dip.currentMoney    = "0"
                                                      dip.userId          = this.$global.adminInfo.id
                                                      dip.note            = '销项票红冲作废';
                                                      dip.orderNo         = this.returnData.orderNo;
                                                      dip.bankJgId        = this.returnData.bankJgId;
                                                      dip.orgId           = this.returnData.orgId;
                                                      dip.orgName         = this.returnData.orgName;
                                                      dip.daozhangdanId   = '0';
                                                      dip.bankConnectedId = '0'
                                                      dip.zhidanApplyId   = '0';
                                                      dip.zhaiyao         = '销项票红冲作废'
                                                      dip.direction        = ''
                                                      dip.type ="1"//1是客户
                                                      dip.dikouOrderId = '';
                                                      dip.dikouOrderNo = '';

                                                      param4.list.push(dip)
                                                      console.log('步骤4')
                                                      console.log(param4)
                                                      getCompanyLiuShui(param4).then(res=>{ //修改流水表
                                                          if(res.code =="100"){
                                                              this.$Notice.success({
                                                                  title:'红冲作废成功',
                                                                  duration:1,
                                                                  onClose:res =>{
                                                                    this.reload();
                                                                  }
                                                              })
                                                            }  
                                                      })

                                                   
                                                  }  
                                            })
                                           
                                       
                                      }  
                              })
                           
                           
                          }  
                    })
                      //步骤33listlisy数组id去从  todo
                    },
                    onCancel: () => {//取消什么都不做
                      
                    }
        });
      },
      //红冲作废和作废公用的
      getZuoFei(row){
        let param={};
        param.direction=row.id;//传入发票的id
        param.payMoneyType='9'//选中的状态
        getKeHuLiuShui(param).then(res=>{ //查询客户资金流水接口
            if(res.code =="100"){
                console.log('我是返回的值')
                console.log(res)
                this.returnData=res.data.list[0] //请求获取返回的id 步骤4用到
              }  
        })
      },
      //点击查询获取数据
      getSearch(){
        this.searchM();
      },
      //获取供应商列表
       getOrgList(){
        let param = {};
        param.pageNum ="1";
        param.orgRoleType = "1";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.orgList=res.data.list
          }  
         })
       },
      //获取查询供应商的值
      getGongYingShang(item){
           console.log(item)
           this.gongYingShangName=item.label//供应商的值
           this.gongYingId=item.value//供应商id
      },
      selectAllSelection(selection){//全选变化
        this.dataOne=selection
      },
       //取消
      quxiao(selection,row){
           this.dataOne=selection
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
        this.dataOne=[];
          let gong='';
        this.formItem.engineering.map((item)=>{
                gong+=("'"+item+"'"+',')
        })
        gong = gong.substr(0,gong.length-1);
         //获取查询的input的值
         let param             = {};
             param.engineering = gong;                     //工程名称
             param.pageSize    = this.formItem.length;     //分页
             param.pageNum     = this.pagesizea            //分页
             param.pageNum     = this.pagesizea
             param.invoiceNo   = this.formItem.invoiceNo;  //发票号
             param.companyName = this.gongYingShangName;   //供应商名称
             param.status      = '1';
         this.getSerch(param)
      },
       //查询接口
      getSerch(param){

        findInvoiceOutout(param).then(res=>{
            console.log('我是打印的数据')
            console.log(res)
            if(res.code =="100"){
            
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
     },
    },
        computed:{
         allMoney(){
             let weightZ=0;//总重
             let moneyZ=0;//总金额
             let moneyT=0;//不含税额
             let moneyTx=0;//税额
              
             this.dataOne.map((item)=>{                      
                 console.log('计算')
              weightZ+=Number(item.weight)
              moneyZ+=Number(item.money)
              moneyT+=Number(item.taxNoMoney)
              moneyTx+=Number(item.taxLeftoverMoney)
              })

               this.zongWeight=weightZ//总重
               this.zongMoney=moneyZ//总金额
               this.zongBuMoney=moneyT//不含税金额
               this.zongSui=moneyTx//税务
              return this.zongWeight,this.zongMoney,this.zongBuMoney,this.zongBuMoney
           }
    },
    mounted(){
     this.searchM();
     this.getOrgList()//获取供应商的值
     this.getGongcheng();//查询工程名称
    },
    
    created(){
   
    },
}

</script>
<style lang="less">
 .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
      #mm .ivu-form-item{
        margin-bottom: 5px!important;
      }
     #mm  .ivu-table-tbody .ivu-table-row .ivu-table-column-center{
        height:20px!important;
      }
</style>