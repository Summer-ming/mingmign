<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
          <FormItem label="订单号:" style="margin-right:10px;">
          <Input clearable style="width:100px"  placeholder="请输入订单号" v-model="formItem.orderNo"></Input>
          </FormItem>
           <FormItem label="客户查询:">
            <Select clearable v-model="orgSearch"  style="width:100px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="管理员查询:">
            <Select clearable v-model="adminSearch"  style="width:100px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
      
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select  v-model="formItem.length"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="工程名称:" style="margin-right:10px;">
               <el-select style="width:100px" :transfer="true" size="small" v-model="formItem.engineering" clearable  filterable  default-first-option placeholder="请输入工程名称">
                          <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                            </el-option>
                        </el-select>
          </FormItem>
          <FormItem label="公司抬头:">
            <Select clearable v-model="formItem.bankJgId"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label='下单时间'>
              <DatePicker @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange"  placement="bottom-end" placeholder="选择日期" style="width: 100px">
              </DatePicker>
            </FormItem>

          <FormItem label="付款状态:">
            <Select clearable v-model="formItem.payMoneyStatus"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in payMoneyStatusListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="打款类型">
            <Select clearable v-model="formItem.type"  style="width:100px"  placeholder="请选择"   >
              <Option value="2">打款并收票</Option>
              <Option value="1">只打款</Option>
            </Select>
          </FormItem>
          </Col>
        
          <Col span="24">
              <Button  type='primary' @click="confirmTi" :disabled='apd'>合并提交</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
            <Button size='small' type="primary"  icon="ios-download-outline" @click="exportData()" style='margin-left:4px'>导出excel</Button>

              <!-- 合计 -->
              <span style="color:#4b98dc;padding-left:20px;">本次勾选的总金额(元)<span  style="color:red;">{{this.$global.isMoneyShow(selectAllMoney)}}</span> &nbsp;&nbsp; </span>
          </Col>
        </Row>
        <vxe-table height="600" border
            show-footer
            resizable
         class="mytable-footer"
         :select-config="{labelField: '', checkMethod}" 
          size="mini" ref="xTable1" :footer-method="footerMethod"
           :data.sync="data1"  @select-change="selectChangeEvent"   @select-all='selentAll'
           >
                <vxe-table-column type="selection" width="30"></vxe-table-column>
                <vxe-table-column type="index" width="60"></vxe-table-column>
                <vxe-table-column width="40" field="id" title="ID" ></vxe-table-column>

                  <vxe-table-column align="center" field="orderNo" title="销售单号" width="200" >
                      <template v-slot="{row}">
                          <a    @click='pushOrderInfo(row)' type="primary">{{row.orderNo}}</a>
                      </template>
                  </vxe-table-column>


                <vxe-table-column width="100" field="name" title="杂费名称" ></vxe-table-column>
                <vxe-table-column sortable  width="100" field="createTime" title="订单创建时间" >
                  <template v-slot="{row}">
                              <span style="color:red">{{row.createTime.substr(0,10)}}</span>
                            </template>
                </vxe-table-column>

                <vxe-table-column width="100" field="orgName" show-overflow title="公司名称" ></vxe-table-column>
                <vxe-table-column width="60" field="engineering" show-overflow title="工程名称" ></vxe-table-column>
                <vxe-table-column align='right' width="100" field="money" title="杂费金额"  :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column align='right' width="100" field="paymentMoney" title="已付金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column align='right' width="100" field="bo1" title="剩余应付金额" :formatter="this.$global.vxeTableMoney"></vxe-table-column>
                <vxe-table-column align='right' width="100" field="weight" title="重量" :formatter="this.$global.vxeTableWeight"></vxe-table-column>
                <vxe-table-column align='right'  width="100" field="unitPrice" title="单价" ></vxe-table-column>
                <vxe-table-column align='center' width="140" field="type" title="类型" :formatter="this.$global.vxeType"></vxe-table-column>
                <vxe-table-column width="140" field="jizhongType" title="计价方式" :formatter='this.$global.vexJijian'></vxe-table-column>
                <vxe-table-column width="140" field="paymentStatus" title="付款状态" :formatter='paymentStatusStr'></vxe-table-column>
                <vxe-table-column width="140" field="note" title="说明" ></vxe-table-column>
                <vxe-table-column width="140" field="explanation" title="解释" ></vxe-table-column>
                <vxe-table-column width="140" field="createTiime" title="创建时间" ></vxe-table-column>
                <vxe-table-column width="140" field="status" title="状态" :formatter='this.$global.vexStatus'></vxe-table-column>
                <vxe-table-column width="140" field="userName" title="创建人" ></vxe-table-column>
            </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    
         <Modal
        v-model="modal1"
        title="新增杂费付款项"
        width='1100px'
        :footer-hide='true'
       >
        <Form :model="formItem1" inline :label-width="100" id='xiadan'>

            <FormItem label='勾选总条数:'>
                    <p style='color:red'>{{selentLength}}</p>
            </FormItem>
        

            <FormItem label='勾选总金额(元):'>
                    <p style='color:red'>{{selectAllMoney}}</p>
            </FormItem>
          

            <FormItem label='公司名称:'>
                    <p style='color:red'>{{comPanyM}}</p>
            </FormItem>
       

            <FormItem label='供应商店铺查询'>
                  <Select v-model="gongYingShang"  style="width:200px" id='kehu' filterable :placeholder="palyName"  @on-change='getChangGong'  :label-in-value='true'>
               <Option v-for="(item,index) in shoeGongYing" :value="JSON.stringify(item)" :label="item.name" :key="index" >{{ item.name }}</Option>
            </Select>
            </FormItem>
        
            <FormItem label="实付总金额(元)">
                <span  style="color:red;">{{this.$global.isMoneyShow(zaFeiMoney)}}</span> &nbsp;&nbsp;
                <span>优惠总金额:{{this.$global.isMoneyShow(zongMoney)}}</span>
            </FormItem>
            <FormItem  label="打款验证">
                  <i-switch v-model="payType" size="large">
                      <span slot="open">开启</span>
                      <span slot="close">关闭</span>
                  </i-switch>
            </FormItem>

            <br/>
            <Table height="350" size="small" border :columns="columns1" :data="dataOne"></Table>

          <FormItem style="margin-top:20px" label='备注'>
            <Input type="textarea" style='width:300px' v-model='formItem1.note' placeholder='请输入备注'/>
          </FormItem>
          
        </Form>
        <div>
            <Button    type="primary" @click="ok" :disabled="isDisable">添加</Button>
            <Button  type="default" style="margin-left:10px" @click="modalCancel">取消</Button>

        </div>
    </Modal> 
     </div>
</template>

<script>
import {findOrdersInfoAll,findZaFei,
findOrdersInfoAllSum,updateOrderInfo} from '@/api/data_8889'                      //添加制单申请//查询供应商店铺
import {getCompanyLiuShui} from '@/api/cusData' 
import {findOrgCusAcc,getUserList,findOrdersInfoAllSum89Zong,
findOrderEngineering,
addJgJieSuan,
findShop,
findOtderMoneySell} from '@/api/data'
import {getReceiptStatusLabel,
getInvoiceStatusLabel,
getBuyOrderStatus,
OMPayInvoiceTypeStr,
payMoneyStatusStr} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,orderStatusList,belongCompanyList,payMoneyStatusList} from '@/libs/global_type'
import XEUtils from 'xe-utils'
import excel from '@/libs/excel'
export default {
    name: 'zaFei',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        payType:true,//打款类型 true 是开启验证 false是不验证
        isDisable:false,
       payMoneyStatusListThis:payMoneyStatusList,
       dataOne:[],
       columns1:[
         {
            title: '#序号',
            type:'index',
            width:'45'
          },
          {
            title: 'ID',
            key: 'id',
            width:'40'

          },
          {
            title: '订单号',
            key: 'orderNo',
            width:'140'

          },
          {
            title: '申请金额',
            key: 'money',
            width:'80'
          },
          {
            title: '优惠金额',
            key: 'applyWeight',
            width:'80',
            render:(h,params)=>{
                
                return h('Input',{
                       props:{
                          value:params.row.applyWeight,
                       },
                      on:{
                           'on-blur':(event)=>{
                              this.dataOne[params.index].applyWeight = event.target.value
                               this.youG();
                           }
                        }
                      })
                     }

          },
          {
            title: '实付金额',
            key: 'bo3',
             width:'80'
          },
                   
       ],
       palyName:'请选择名称',
       gongYingShang:"",
       shoeGongYing:[],//供应商店铺查询的数组
       param1:{pageSize:"999999"},//查询店铺参数
       skOrgAcountId: '' ,//弹出框中 选择店铺的accountId
       skOrgId: "" ,//弹出框中 选择店铺的orgId
       skOrgName: "" ,//弹出框中 选择店铺的orgName
       skShopId: "", //弹出框中 选择店铺的id
        selentLength:'',
        apd:false,
        po:false,
        comPanyM:'',
       zaFeiMoney:0,//实际付款金额
       selectAllMoney:0,//勾选的总金额
       orderType:[
            { 
                label:'1',
                value:'销售单'

            },{
                label:'2',
                value:'采购单'
            }
        ],
        //todo
        engineerNameList:[],//工程名称数组
         formItem1: {
            dateTime:'',
            note:'',
          },
        daozhangTime:"",
        modal1:false,
        belongCompanyListThis:belongCompanyList,
        TWeight:0,
        TMoney:0,
        TjiesuanWeight:0,
        TjiesuanMoney:0,
        shopList:[],
        orderStatusList:orderStatusList,
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
        adminList:[],
        tableItem:{},
        modal1:false,
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:20,
          orderNo:'',
          orderType:'',//订单类型
          engineering:'',
          bankJgId:'',
          payMoneyStatus:'0',
          type:''
          },
          data1: [],//表格展示的数据
          dataCount:0,//总页数
          searchPage:1, //初始化时查询的页码数,
          zongMoney:0,
      }
    },
    
    methods:{
       exportData(){//导出到excel

        this.$refs.xTable1.exportCsv({
          filename:"导出excel"
        })
      },
       pushOrderInfo(row){
         let dic = {};
         dic.ordersNo = row.orderNo;
         dic.orderNo = row.orderNo;

        row.operateType  ="1"//查看
        sessionStorage.setItem('XiaoShou','')
        sessionStorage.setItem('XiaoShou',JSON.stringify(dic))
            const route = {
               name: 'sell_order_info',
             }
             this.$router.push(route)
      },
      modalCancel(){
        this.modal1 =false;
      },
      paymentStatusStr({cellValue, row, column}){
        return payMoneyStatusStr(cellValue);
      },
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';
      },
        footerMethod({columns,data}){
        return [
          columns.map((column,columnIndex)=>{
            if(columnIndex === 0){
              return '当页合计'
            }
            if(['money','ysMoney','paymentMoney'].includes(column.property)){
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)

            }

          })
        ]
      },
      //查询供应商店铺
       //查询店铺
      getShop1(param){
        param.status = 1;
        param.pageSize = "999999"
        findShop(param).then(res=>{
          if(res.code =="100"){
            this.shoeGongYing=res.data.list
          }
        })
      },
      //获取供应商店铺的值
      getChangGong(item){
        const stingR=eval('(' + item.value + ')')
        this.skOrgAcountId=stingR.accountId
        this.skOrgId=stingR.orgId
        this.skOrgName=stingR.orgName
        this.skShopId=stingR.id
        console.log(stingR)
       
      },
      uniqueA(arr){
          for(var i=0; i<arr.length; i++){
                      for(var j=i+1; j<arr.length; j++){
                          if(arr[i]==arr[j]){         //第一个等同于第二个，splice方法删除第二个
                              arr.splice(j,1);
                              j--;
                          }
                      }
                  }
          return arr;
      },
      //合并提交显示弹窗
      confirmTi(){
        
        let dataSelect=this.$refs.xTable1.getSelectRecords()//获取选中数据
        if(dataSelect.length<1){
          this.$Message.warning("请勾选")
          return false;
        }
        this.comPanyM=dataSelect[0].orgName;
        console.log(dataSelect)
        this.modal1=true;
        dataSelect.map(item=>{
          item.applyWeight = 0;
        })
        this.dataOne=dataSelect
       
        let youZ=0;
        this.youG();
        // 默认赋值 TODO
        this.shoeGongYing.map(item=>{
          if(item.orgName==dataSelect[0].orgName){
            this.palyName      = item.name;
            this.skOrgAcountId = item.accountId
            this.skOrgId       = item.orgId
            this.skOrgName     = item.orgName
            this.skShopId      = item.id

          }
        })
        
      },
      youG(){
         let zongM=0;

         this.dataOne.map((item)=>{
      
           item.bo3=this.$global.accMinus(item.money,item.applyWeight);//实付金额
          
           zongM += Number(item.applyWeight);//优惠金额
           this.zongMoney=zongM;
           return this.zongMoney
         
        })
        //优惠金额变化，实付总金额也变化
        this.zaFeiMoney = this.$global.accMinus(this.selectAllMoney,this.zongMoney);
      },
      //复选框选中
      selectChangeEvent({ checked, row }){
        console.log('我选中了')
        console.log(row)
        this.XuanZ();   
      },
      //全选
      selentAll({ checked, row }){
         console.log('全选')
         this.XuanZ();
      },

      XuanZ(){//选择触发时间
          let dataSelect=this.$refs.xTable1.getSelectRecords()
          this.selentLength=dataSelect.length;
           let  sMoney=0;
           let ko=[];//供应商公司
           let engineeringArr=[]//工程名称
           let bankJgIdArr = [];//订单类型，1福建亿钢 2上海闽航
          if(dataSelect.length<1){
              this.apd=false;
              this.zaFeiMoney=0;
              this.selectAllMoney = 0;
          }else{  
            dataSelect.map((item)=>{
                sMoney += Number(item.money);
                this.selectAllMoney=sMoney;
                this.zaFeiMoney = sMoney;  
                 ko.push(item.orgId)
                 engineeringArr.push(item.engineering)
                 this.uniqueA(engineeringArr)
                 this.uniqueA(ko)
                if(ko.length>1||engineeringArr.length>1){
                  this.$Message.warning("请选择相同公司,相同项目")
                  this.apd=true;
                  return  false;
                }else{
                  this.apd=false;
                }
            })
          }
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
      orgShopName({cellValue, row, column}){
          console.log(cellValue)
          if(cellValue){
            return cellValue.substr(0,5)
          }else{
            return ""
          }
      },
      orderStatus({cellValue, row, column}){
        return getBuyOrderStatus(cellValue)
      },
      receiptStatus({cellValue, row, column}){
          return getReceiptStatusLabel(cellValue);
      },
      invoiceStatus({cellValue, row, column}){
          return getInvoiceStatusLabel(cellValue);
      },
       getAA(row){
        
        row.operateType  ="1"//查看
        row.ordersNo=row.orderNo
        sessionStorage.setItem('XiaoShou','')
        sessionStorage.setItem('XiaoShou',JSON.stringify(row))
              const route = { 
                 name: 'sell_order_info',
                // query: row
                 }
              this.$router.push(route)
        },
      //禁止选中
        checkMethod ({ row }) {
              //条件满足的 可以选择
              // return row.id !="当页合计" ||  row.id !="全部合计"  
              return row.paymentStatus  !=8;
        },
       //确认修改对账时间
        ok(){
          console.log(this.skOrgAcountId);
          console.log("payType"+this.payType);
          if((this.skOrgAcountId=='' || this.skOrgAcountId==null)&&this.payType == true){
            this.$Message.error("请选择收款店铺，或给店铺绑定银行卡");
            this.isDisable =false;
            return false;
          }
          this.isDisable = true;
          let bankJgids  = (this.$refs.xTable1.getSelectRecords()[0]).bankJgId;
        let paramOne                = {};
            paramOne.actualPayMoney = this.zaFeiMoney                                                 //实际金额勾选的合计总额
            paramOne.auditStatus    = "8"
            paramOne.dikouMoney     =this.zongMoney //优惠金额的和
            paramOne.businessNote   =this.formItem1.note//输入框的备注金额
            paramOne.bankJgId       = bankJgids
            paramOne.customerId     = ""
            paramOne.dkOrgName      = bankJgids == '1'?'福建省亿钢电子商务有限公司':'上海市闽航电子商务有限公司'
            paramOne.id             = (this.$refs.xTable1.getSelectRecords())[0].orderId
            paramOne.jiesuanStatus  = '1'
            paramOne.merchantsId    = bankJgids
            paramOne.money          = this.selectAllMoney
            paramOne.note           = ''
            paramOne.operator       = this.$global.adminInfo.id
            paramOne.operatorType   = '5'
            paramOne.orderId        = (this.$refs.xTable1.getSelectRecords())[0].orderId
            paramOne.orderStatus    = ''
            paramOne.orderType      = "2"                                                             //销售单2 采购单1
            paramOne.skOrgAcountId  = this.skOrgAcountId                                              //弹框中选择店铺的accontid
            paramOne.skOrgId        = this.skOrgId                                                    //选择店铺的orgid
            paramOne.skOrgName      = this.skOrgName                                                  //供应商弹出框中选择店铺的orgname
            paramOne.skShopId       = this.skShopId                                                   //弹框中选择店铺的id
            paramOne.statusNote     = '杂费付款'
            paramOne.updateDiKou    = '0'
            paramOne.userId         = this.$global.adminInfo.id
         addJgJieSuan(paramOne).then(res=>{
            if(res.code =="100"){
              let msgId=res.msg;
              this.getLiuShui(msgId)//添加到流水表中
             }  
         })
        },
        //添加到流水表中接口
        getLiuShui(msgId){
        let param = {list:[]};
        let dataSelect=this.$refs.xTable1.getSelectRecords()//获取选中数据
        dataSelect.map((item)=>{
          let dic                 = {};
              dic.outMoney=item.bo3//实际付款金额
              dic.bankConnectedId = '0'
              dic.bankJgId        = item.bankJgId
              dic.currentMoney    = '0'
              dic.customerId      = ''
              dic.daozhangdanId   = '0'
              dic.direction       = ''
              dic.inMoney         = '0'
              dic.note            = '销售单杂费申请付款'
              dic.orderId         = item.orderId
              dic.orderNo         = item.orderNo
              dic.orgId           = this.skOrgId
              dic.orgName         = this.skOrgName
              dic.outMoney        = item.bo3
              dic.dikouMoney      = item.applyWeight;//优惠金额
              dic.payMoneyType    = '19'
              dic.status          = '0'
              dic.type            = this.formItem.orderType == '销售单'?'1':'2'
              dic.userId          = this.$global.adminInfo.id
              dic.zhaiyao         = ''
              dic.zhidanApplyId   = msgId
              dic.otherMoneyId    = item.id
          param.list.push(dic)
        })
          getCompanyLiuShui(param).then(res=>{
            if(res.code =="100"){
              this.$Notice.success({
                 title:'添加杂费制单绑定信息成功',
                 duration:1,
                 onClose:res =>{
                    this.reload();
                 }
              })
            }  
        })
       },
       //修改对账时间
        changeDuiZhang(item){
            console.log(item)
            this.daozhangTime=item;
        },
       //获取选中 
        getSelectEvent1(){
            this.modal1=true;
        },
    
      getShop(){
        let param = {};
        param.pageNum ="1";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
        getDian(item){
          if(item){
        this.shopOrgName = item.label;
        this.shopOrgId = item.value;
          }
       },
      changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';

      },
      propsClick(){
        this.reload();
      },
      getAdmin(item){
        if(item){
        this.adminSearchId = item.value;
        }
      },
        reloadSelf(){
            this.reload();
        },
       //分页
       changePage(index){
           this.pagesizea=index;
           this.searchM();
       },
       selectOne(row){
       },
       //查询表格
       searchM(){
         this.isDisable = false;
         //获取查询的input的值
         let param               = {};
             param.pageNum       = this.pagesizea                 //分页
             param.userId        = this.adminSearchId             //管理员查询
             param.orgId         = this.shopOrgId                 //供应商
             param.pageSize      = this.formItem.length;
             param.orderNo       = this.formItem.orderNo          //订单号
             param.gongcheng     = this.formItem.engineering;     //工程名称
             param.orderType     = '2';                           //订单类型 1采购单 2销售单，默认查询销售单
             param.status        = 1;
             param.engineering   = this.formItem.engineering;     //工程名称
             param.bankJgId      = this.formItem.bankJgId;        //公司抬头
             param.beginTime     = this.formItem.beginTime        //开始时间 
             param.endTime       = this.formItem.endTime          //截止时间
             param.paymentStatus = this.formItem.payMoneyStatus;  //付款状态
             param.type = this.formItem.type;
           findOtderMoneySell(param).then(res=>{
            if(res.code =="100"){
                this.totalM=res.data.total; 
                this.data1=res.data.list;
                this.data1.map((item)=>{
                   item.bo1=this.$global.accMinus(item.money,item.paymentMoney)
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
            this.adminList=res.data.list;
          }  
         })
       }
    },
    
    mounted(){
 
     this.searchM();
     this.getShop();//客户查询
     this.getShop1(this.param1);//查询供应商店铺
     this.getAdminList();
     this.getGongcheng();
     var that = this;
     Utils.$on('demo',function(msg){
       if(msg == "reload"){
        that.propsClick();
       }
     })
    
    },
    computed:{
     
    },
    created(){
       
    },
}

</script>
<style>
 #kehu .ivu-select-input::-webkit-input-placeholder{
  color:red
}
  .ivu-table td.demo-table-info-column{
        background-color: #187;
        color: #fff;
       
    }
.ivu-table-cell{
      padding-left: 0 !important;
      padding-right:0 !important;

    }
       .mytable-style .vxe-body--row.row-green {
          background-color: #187;
          color: #fff;
        }
        .mytable-style .vxe-header--column.col-blue {
          background-color: #2db7f5;
          color: #fff;
        }
       
        .mytable-style .vxe-body--column.col-red {
          background-color: red;
          color: #fff;
        }
        .mytable-style .vxe-body--column.col-orange {
          background-color: #f60;
          color: #fff;
        }
         .mytable-style .vxe-body--column.col-blue {
          background-color:blue;
          color: #fff;
        }
         .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {


        
      padding: 0 2px;
      }
      #xiadan .ivu-select-dropdown{
              left: -114px!important;
      }
</style>

