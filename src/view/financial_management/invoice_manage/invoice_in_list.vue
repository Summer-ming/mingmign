<!--
 * @Description: 进项票列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-16 09:01:46
 -->




<template>
     <div id='mm'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form inline :model="formItem" :label-width="90">
        <Row>

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

          <row style='text-align:left;margin-left:20px;'>
                    <Button type="primary" icon="ios-search" @click='getSearch'>查询</Button>
                    <Button shape="circle"  icon="md-refresh" @click="reloadSelf()"></Button>
                    <Button type="primary"  icon="ios-download-outline" @click="exportData()">导出excel</Button>    
          </row>
         <row>
            <i-col style="visibility: hidden;" >{{allMoney}}</i-col>
           <span>重量:<time style='color:red'>{{this.$global.accPrecision(zongWeight,3)}}</time></span>
            <span>总金额:<time style='color:red'>{{this.$global.isMoneyShow(zongMoney,2)}}</time></span>
            <br>
             <span>不含税金额:<time style='color:red'>{{this.$global.isMoneyShow(zongBuMoney,3)}}</time></span>
              <span>税额:<time style='color:red'>{{this.$global.isMoneyShow(zongSui,3)}}</time></span>
         </row>
      
        </Row>
        <Table height='450' @on-select-cancel='quxiao'  @on-selection-change="selectAllSelection" border ref="selection" size="small" :columns="columns4" :data="data1" >
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;" :page-size='formItem.length'  :total="totalM" show-total ></Page>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findInvoiceIncome,findOrgCusAcc,
findBillFlow,
updateBillFlow,
addBillFlow,
findOrderEngineering,updateOrderBuyMoneyBatch
} from '@/api/data'
import {getKeHuLiuShui,
getXiuGaijinPiao,
getXiuGaiDingDanFaPiao,
getXiuGaiOrderStatus,
getKeHuLiuShuiBiao,
getCompanyLiuShui} from '@/api/cusData'
import {statusStr} from '@/libs/allStatus'
 //左---右依次 查询客户流水 修改进项票  修改订单发票信息  修改订单状态  更新客户流水  添加流水到流水表
import {lengthList} from '@/libs/global_type'
//getKeHuLiuShui

export default {
    name: 'invoice_in_list',
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
        orgSearch:"",//供应商查询字段
        gongYingShangName:"",//供应商的值
        gongYingId:"",//供应商id
        orgList:[],
        //弹出框使用的数据
        modal:false,
        //弹出框使用的数据结束
        tableItem:{},
        orgSearch:"",
        selectionsList:[],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          engineering:'',//工程名称
          companyName:'',
          orderNo:'',
          payMony:'',
          dikouMoney:'',
          cardType:"",
          totalMoney:'',
          length:20,
          totalNum:'',
          invoiceNo:'',//发票号
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
                        title: '工程名称',
                        key: 'engineering',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '发票号码',
                        key: 'invoiceNo',
                        align: 'center',
                        width:'120'
                    },
                     {
                        title: '公司名称',
                        key: 'companyName',
                        align: 'center',
                        width:'160'
                    },
                   
                     {
                        title: '重量',
                        key: 'weight',
                        align: 'center',
                        width:'160',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.weight,3));
                        }
                    },
                     {
                        title: '总金额',
                        key: 'money',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.money))
                        }
                        
                    },
                     {
                        title: '不含税金额',
                        key: 'taxNoMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.taxNoMoney))
                        }
                        
                    },
                     {
                        title: '税额',
                        key: 'taxLeftoverMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.taxLeftoverMoney))
                        }
                        
                    },
                      {
                        title: '绑定时间',
                        key: 'createTime',
                        align: 'center',
                        width:'120'
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
                        title: '本公司抬头',
                        key: 'bankJgId',
                        align: 'center',
                        width:'120'
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


      //结束
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
              dic.billType          = '20040';  //账单类型
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
                      this.updateOnlineBusiness();
                      console.log(this.returnData)
                       console.log('我是作废')
                      //步骤111 修改进项票信息
                      let param1 = {};
                      param1.id=row.id;//列表选中的id
                      param1.status='0';//选中的状态
                      getXiuGaijinPiao(param1).then(res=>{ //查询客户资金流水接口
                        if(res.code =="100"){
                          //步骤2222   修改订单发票信息 getXiuGaiDingDanFaPiao
                              let param2 ={
                                pageOrderInfoList:[]
                              };
                              let list=[];
                              list = row.listList;
                              list.map((item)=>{  //orderInfoId 订单明细id   ordersId订单id
                                let dic               = {};
                                    dic.id            = item.orderInfoId;
                                    dic.invoiceStatus = '0',
                                    dic.invoiceWeight = '0';
                                    dic.invoiceMoney  = '0'
                                    dic.invoiceNo     = '-'
                                 param2.pageOrderInfoList.push(dic)
                              })
                              getXiuGaiDingDanFaPiao(param2).then(res=>{ //修改订单明细发票信息
                                    if(res.code =="100"){
                                            this.updateOrderInvoiceMoney(row.listList);
                                           //步骤3333  getXiuGaiOrderStatus
                                           let param3={
                                             pageUpdateOrderList:[]
                                           };
                                           list.map((item)=>{  //orderInfoId 订单明细id   ordersId订单id
                                              let dio={};
                                              dio.id=item.ordersId;
                                              dio.status='9'
                                              param3.pageUpdateOrderList.push(dio)
                                            })
                                            //数组去除重复
                                            param3.pageUpdateOrderList=this.$global.uniqueNew(param3.pageUpdateOrderList,'id')
                                           getXiuGaiOrderStatus(param3).then(res=>{ //修改订单状态
                                                if(res.code =="100"){
                                                      //步骤444 getKeHuLiuShuiBiao
                                                      let param4 = {
                                                        list:[]
                                                      };
                                                      let dip={};
                                                      dip.id=this.returnData.id
                                                      dip.status='0'
                                                      param4.list.push(dip)
                                                      console.log(this.returnData);
                                                      console.log('步骤4')
                                                      console.log(param4)
                                                      getKeHuLiuShuiBiao(param4).then(res=>{ //修改流水表
                                                          if(res.code =="100"){
                                                             this.$Notice.success({
                                                                  title:'作废成功',
                                                                  duration:1,
                                                                  onClose:res =>{
                                                                    this.reloadSelf();
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
                      // param1.money=row.money;//选中列表的money
                      // param1.invoiceNo=row.invoiceNo;//
                      // param1.weight=row.weight;//选中的重量
                      // param1.createUserId=row.createUserId;//选中的用户创建id
                      param1.status="0";//选中的状态
                      // param1.companyName=row.companyName;//选中列表中的公司
                      // param1.customerId=row.customerId;//选中公司的id
                      // param1.taxLeftoverMoney=row.taxLeftoverMoney;//
                      // param1.taxNoMoney=row.taxNoMoney;//
                      getXiuGaijinPiao(param1).then(res=>{ //查询客户资金流水接口
                        if(res.code =="100"){
                          //步骤2222   修改订单发票信息 getXiuGaiDingDanFaPiao
                              let param2 ={
                                pageOrderInfoList:[]
                              };
                              let list=[];
                              list = row.listList;
                              // this.dataZhuLie.map((item)=>{
                              //   list=item.listList
                              // })
                              list.map((item)=>{  //orderInfoId 订单明细id   ordersId订单id
                                let dic={};
                                 dic.id=item.orderInfoId;
                                 dic.invoiceStatus='0',
                                 dic.invoiceWeight = '0';
                                 dic.invoiceMoney = '0'
                                 dic.invoiceNo = '-'
                                 param2.pageOrderInfoList.push(dic)
                              })
                              console.log('获取param2的数据')
                              console.log(param2)
                              getXiuGaiDingDanFaPiao(param2).then(res=>{ //修改订单发票信息
                                    if(res.code =="100"){
                                            this.updateOrderInvoiceMoney(row.listList);

                                           //步骤3333  getXiuGaiOrderStatus
                                           let param3={
                                             pageUpdateOrderList:[]
                                           };
                                           list.map((item)=>{  //orderInfoId 订单明细id   ordersId订单id
                                              let dio={};
                                              dio.id=item.ordersId;
                                              dio.status='9'
                                              param3.pageUpdateOrderList.push(dio)
                                            })
                                            param3.pageUpdateOrderList=this.$global.uniqueNew(param3.pageUpdateOrderList,'id')
                                            console.log('param3的数据')
                                           getXiuGaiOrderStatus(param3).then(res=>{ //修改订单状态
                                                if(res.code =="100"){
                                                      //步骤444 getKeHuLiuShuiBiao
                                                      let param4 = {
                                                        list:[]
                                                      };
                                                      let dip={};
                                                      dip.inMoney=(0-this.returnData.inMoney)
                                                      dip.outMoney ='0'
                                                      dip.payMoneyType ='8'
                                                      dip.status        = '1'
                                                      //新的内容
                                                      dip.customerId      = this.returnData.customerId
                                                      dip.orderId         = this.returnData.orderId; //记录
                                                      dip.currentMoney    = "0"
                                                      dip.userId          = this.$global.adminInfo.id
                                                      dip.note            = '进项票红冲作废';
                                                      dip.orderNo         = this.returnData.orderNo;
                                                      dip.bankJgId        = this.returnData.bankJgId;
                                                      dip.orgId           = this.returnData.orgId;
                                                      dip.orgName         = this.returnData.orgName;
                                                      dip.daozhangdanId   = '0';
                                                      dip.bankConnectedId = '0'
                                                      dip.zhidanApplyId   = '0';
                                                      dip.zhaiyao         = '进项票红冲作废'
                                                      dip.direction        = ''
                                                      dip.type ="2"//1是客户
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
                                                                    this.reloadSelf();
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
        param.payMoneyType='7'//选中的状态
        getKeHuLiuShui(param).then(res=>{ //查询客户资金流水接口
            if(res.code =="100"){
                console.log('我是返回的值')
                console.log(res)
                this.returnData=res.data.list[0] //请求获取返回的id 步骤4用到
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
          console.log(this.dataOne)
          console.log(this.$refs.selection)
    
      },
      //取消
      quxiao(selection,row){
           console.log('取消')
           this.dataOne=selection
          console.log(this.$refs.selection.clearCurrentRow())
          console.log('=====')
          console.log(this.dataOne)
      },
   


      exportData(){//导出到excel

        this.$refs.selection.exportCsv({
          filename:"进项票列表"
        })
      },
       reloadSelf(){
            this.reload();
        },
      //点击按钮根据条件查询
      getSearch(){
         this.searchM();
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
         let param={};
        param.engineering    = gong;  //工程名称
         param.pageSize       = this.formItem.length;//分页
         param.pageNum        = this.pagesizea 
         param.invoiceNo=this.formItem.invoiceNo;//发票号
         param.companyName=this.gongYingShangName;//供应商名称
         param.status = 1;
         this.getSerch(param)
       },
       //获取供应商列表
       getOrgList(){
        let param = {};
        param.pageNum ="1";
        param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.orgList=res.data.list
          }  
         })
       },
       //查询接口
       getSerch(param){
         findInvoiceIncome(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            console.log('我是主列表的数据')
            this.dataZhuLie=res.data.list;//主列表数据保存
            console.log(this.dataZhuLie)
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
       },
       
    },
    mounted(){
     this.searchM();
     this.getOrgList();
     this.getGongcheng();//查询工程名称
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
