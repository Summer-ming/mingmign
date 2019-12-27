<!--
 * @Description:审核采购单 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-10 10:27:38
 -->
<template>
     <div>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
      <dl>
        <dt>销售单号：{{formItem.orderNo}}</dt>
        <dd>客户：{{formItem.cusOrgName}}</dd>
      </dl>
      <dl>
        <dt>供应商公司：{{formItem.shopOrgName}}</dt>
        <dd>管理员：{{formItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{formItem.money}}</dt>
        <dt>工程名称：{{formItem.gongcheng}}</dt>

      </dl>
        
    </row>
    <row>
        <b class="font_32">合同信息</b>
      <span style="color:red">注：网价备注中填写到货日期：例子：2019-07-25到货，;若没有后续通过改订单明细更改</span>
        <br>
        <span style="color:red">*</span>
        <span >一键收货</span>

        <i-switch v-model="switch1" @on-change="switchChange">
          <span  slot="open">是</span>
          <span  slot="close">否</span>

          </i-switch>
          
        <!-- 111 -->
         <RadioGroup style='margin-left:28px;'   v-model="phone" @on-change='getRadio'>
                <Radio label="1">
                    <span>根据销售单价计算网价</span>
                </Radio>
        
                 <Radio label="3">
                    <span>无</span>
                </Radio>
        </RadioGroup>
        <Input v-model="yijian" placeholder="请输入" @on-change='paiceName' style="width: 150px" />
        <Button type='primary' style='margin-left:8px; margin-right:10px;' @click='addAll'>一键添加——></Button>
        <Select v-model="chosePrice" style="width:150px" @on-change='getValue'>
                <Option v-for="(item,index) in priceChose" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <Button type='primary' style='margin-left:8px; ' @click='copyClick'>复制合同到结算</Button>
        <br/>
        <Button type='primary' style='margin-left:8px; ' @click='newAddRest'>新增利息</Button>

        <!-- 新修改table -->
         <!-- @cell-click="cellClickEvent" -->

        <vxe-table size="mini" border 
         class="vxe-table-element"
         :header-cell-class-name="headerCellClassName"
         :highlight-cell='false'
         resizable
         :data.sync="tableDataTwo"
          @edit-actived="currentChangeNew"
          show-footer
            :footer-method="footerMethod"
         :edit-config="{key: 'id', trigger: 'click', mode: 'cell',} ">
                <vxe-table-column type="index"  width="20" title="#" fixed="left"></vxe-table-column> 
                <vxe-table-column field="id"  width="40" title="ID" fixed="left"></vxe-table-column> 
                <vxe-table-column field="infoType" :formatter='infoTypeToStr'  width="40" title="明细类型" fixed="left"></vxe-table-column> 
                 <vxe-table-column :edit-render="{name: 'ElInput',autoselect: true}" show-overflow  prop="steelName" label="品名" width="60" fixed="left"></vxe-table-column>
                <vxe-table-column :edit-render="{name: 'ElInput',autoselect: true}" show-overflow prop="steelGuige" label="规格" width="60" fixed="left"></vxe-table-column>
                <vxe-table-column :edit-render="{name: 'ElInput',autoselect: true}" show-overflow prop="steelPaihao" label="材质" width="60" fixed="left"></vxe-table-column>
                    <!-- 左边固定 -->
                <vxe-table-column :edit-render="{name: 'ElInput',autoselect: true}" show-overflow  prop="steelPinpai" label="钢厂" width="40"></vxe-table-column>
                <vxe-table-column :edit-render="{name: 'ElInput',autoselect: true}" show-overflow prop="steelWorks" label="提货方式" width="80"></vxe-table-column>
                <vxe-table-column :edit-render="{name: 'ElInput',autoselect: true}" show-overflow prop="jiaohuodi" label="交货地" width="40"></vxe-table-column>

                <vxe-table-column show-overflow field="jianshu" title="件数" width="40"></vxe-table-column>
                <vxe-table-column show-overflow field="weight" title="单件重"  :formatter="this.$global.vxeTableWeight" width="40"></vxe-table-column>
                <vxe-table-column show-overflow field="zongzhongliang"  :formatter="this.$global.vxeTableWeight" label="总重量" width="60"></vxe-table-column>
                <vxe-table-column show-overflow field="guapaijia" title="单价"  :formatter="this.$global.vxeTableMoney"  width="60"></vxe-table-column>
                <!--开始 -->
                <!-- 结束 -->
                <vxe-table-column show-overflow field="cusMoney" title="总金额"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
                    <!-- 可编辑数据 -->
                <vxe-table-column show-overflow field="jiesuanJianshu" title="结算件数"  :edit-render="{name: 'ElInput',autoselect: true}"  width="80"></vxe-table-column>

                <vxe-table-column show-overflow field="jiesuanDanjia" title="结算单价"  :formatter="this.$global.vxeTableMoney"
                 :edit-render="{name: 'ElInput',autoselect: true}"   width="80"></vxe-table-column>
                <vxe-table-column show-overflow field="jiesuanWeight" title="结算重量"  :formatter="this.$global.vxeTableWeight" :edit-render="{name: 'ElInput',autoselect: true}"  width="80"></vxe-table-column>
                <vxe-table-column show-overflow field="jiesuanMoney" title="结算金额"  :formatter="this.$global.vxeTableMoney"   width="80"></vxe-table-column>
                <vxe-table-column show-overflow field="receiptStatus" title="是否收货"   :edit-render="{name: 'ElSelect',options:selectData}"  width="40"></vxe-table-column>
                <vxe-table-column show-overflow field="internetMoney" title="网价"   :formatter="this.$global.vxeTableMoney" :edit-render="{name: 'ElInput',autoselect: true}"  width="80"></vxe-table-column>
                <vxe-table-column show-overflow field="region" title="网价所属区域" :edit-render="{name: 'ElInput',autoselect: true}"  width="80"></vxe-table-column>
                <vxe-table-column show-overflow field="floatMoney" title="浮动价格" :edit-render="{name: 'ElInput',autoselect: true}"  width="80"></vxe-table-column>
                <vxe-table-column show-overflow field="internetMoneyNote" title="网价备注" :edit-render="{name: 'ElInput',autoselect: true}"  width="80"></vxe-table-column>
                    <!-- 不可编辑数据 -->
                <!-- <vxe-table-column show-overflow prop="kunbaohao" label="捆包号" width="80"></vxe-table-column>
                <vxe-table-column show-overflow prop="invoiceWeight" label="收票重量" width="80"  :formatter="this.$global.vxeTableWeight" ></vxe-table-column>
                <vxe-table-column show-overflow prop="invoiceMoney" label="收票金额"  :formatter="this.$global.vxeTableMoney"   width="80"></vxe-table-column>
                <vxe-table-column show-overflow prop="invoiceNo" label="收票号码"  width="80"></vxe-table-column>
                <vxe-table-column show-overflow prop="invoiceStatus" label="是否收票"  width="80"></vxe-table-column> -->

                 <vxe-table-column   show-overflow prop="realUnitPrice" title="实提单价"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
                 <vxe-table-column   show-overflow prop="realMoney" title="实提金额"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
                 <vxe-table-column  :edit-render="{name: 'ElInput',autoselect: true}" show-overflow prop="interestUnitPrice" title="利息单价"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
                 <vxe-table-column   show-overflow prop="interestMoney" title="利息金额"  :formatter="this.$global.vxeTableMoney"  width="80"></vxe-table-column>
                 <vxe-table-column  :edit-render="{name: 'ElInput',autoselect: true}" show-overflow prop="note" title="备注" width="80"></vxe-table-column>
                <vxe-table-column  label="操作"  min-width="100" align="center">
            
                    <template v-slot="{ row,rowIndex}">
                        <vxe-button type="text"  v-if="row.infoType==1" @click='deleteRow(row,rowIndex)'>删除</vxe-button>

                    </template>
               </vxe-table-column>
        </vxe-table>



    </row>

    <row>
       <span>合同重量合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.accPrecision(contractTWeight,3)}}吨</span>
      <span>合同金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(contractTMoney)}}元</span>
      <br>
      <span>实提重量合计：</span>
      <span  style="color:red;margin-right:20px">{{this.$global.accPrecision(tWeight,3)}}吨</span>
      <span>结算金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(tMoney)}}元</span>
      <br>
        <span>利息金额合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.isMoneyShow(interestTMoney)}}元</span>
        <span>货物实提金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(realTMoney)}}元</span>
      <br>
      <a v-show="saveBtnShow"  style="color:red">请先将销售单确认出货，在进项录入实提操作</a>
      <br>
      <Button :disabled="btnDisabled" type="primary" @click="addBtn"> 提交保存</Button>
    </row>
    <p style="disaply:none">{{getTotal}}</p>
     </div>
</template>

<script>

import {findOrdersInfoAll,
updateOrderInfo,addOrderInfo,
updateOrderStatus,} from '@/api/data_8889'
import {findOrgCusAcc,findOrgMoneyRecord,
updateOrgMoneyRecord,addOrgMoneyRecord,
findBillFlow,
addBillFlow,
updateBillFlow} from '@/api/data'
import { mapMutations } from 'vuex'
import {getReceiptStatusLabel,getInvoiceStatusLabel,lixi} from '@/libs/allStatus'
import Utils from '@/api/middle'
import { truncate } from 'fs';
import { Promise } from 'q';
import XEUtils from 'xe-utils'

export default {
    name: 'sell_order_changeActual1',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        onlineBusinessDic:'',
        ciickItem:'',//
        //新增的table数组
        tableDataTwo:[],
        phone:"",//单选的默认值
        radioValue:'',//获取选中的单选值
        yijian:'',//一键添加的默认值
        namePrice:"",//input的值获取
        chosePrice:"",//select默认选中的值
        priceChose: [
                    {
                        value: '1',
                        label: '浮动价格'
                    },        
        ],
        priceVa:"",//获取select选中的值
        //todo
        saveBtnShow:false,
        btnDisabled:false,
        orgMoneyRecordItem:{},
        tWeight:0,//实提重量
        tMoney:0,//实提金额
        contractTMoney:0,//合同金额
        contractTWeight:0,//合同重量
        interestTMoney:0,//利息总额
        realTMoney:0,//货物实际总额
      dataCompany:[],
        tableItem:{},
        selectData:[{
          value:'1',
          label:'是'
        },{
          value:'0',
          label:"否"
        }],
        switch1:false,
        isadd :true,
        clickRow:"",
        clickRowIndex:"",
        clickColumn:"",
        clickColumnIndex:'',
        switchTitle:'否',
        formItem: {
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          gongcheng:''
          },
       //分割线——————————————————————————————————————————————————————————————————————
         data1: [],//表格展示的数据          
      
      }
    },
    
    methods:{
       headerCellClassName ({ column, columnIndex }) {
              if (column.property === 'jiesuanJianshu'
              ||column.property === 'jiesuanDanjia'
              ||column.property === 'jiesuanWeight'
              ||column.property === 'jiesuanMoney'
              ) {
                return 'col-blue'
              }
            },
      deleteRow(row,rowIndex){//删除一行
          this.tableDataTwo.splice(rowIndex,1);
      },
      //footer 合计
       footerMethod ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '合'
                  }
                  
                  if(['jianshu'].includes(column.property)){//判断件数 返回 0位小数点
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),0)
                  }
                    if(['cusMoney','jiesuanMoney','realMoney','interestMoney'].includes(column.property)){//
                    return this.$global.isMoneyShow(XEUtils.sum(data, column.property),2)
                  }    
                  if (['zongzhongliang','jiesuanWeight'].includes(column.property)) {//重量返回 3位小数点
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),3)
                  }
                  return '-'
                })
              ]
       },
      infoTypeToStr({cellValue, row, column}){//明细类型转换成 字符串
        return lixi(cellValue);
      },
      //开始
      //新增利息
      newAddRest(){
         let p={
           newAdd:true,//新增利息的字段
           id:"",
           infoType:"1",
           steelName:"",
           steelGuige:"",
           steelPaihao:"",
           steelPinpai:"",
           steelWorks:"",
           jiaohuodi:"",
           jianshu:"0",
           xuniJianshu:'0',
           weight:"0",
           zongzhongliang:'0',
           cusMoney:"0",
           jiesuanJianshu:"0",
           jiesuanDanjia:"0",
           jiesuanWeight:"0",
           jiesuanMoney:"0",
           guapaijia:'0',
           realUnitPrice:"0",
           realMoney:"0",
           interestUnitPrice:"0",
           interestMoney:"0",
           note:"",
           receiptStatus:"1",
           internetMoney:"0",
           region:"",
           floatMoney:"0",
           internetMoneyNote:"",
           kunbaohao:"",
           invoiceWeight:"0",
           invoiceMoney:"0",
           invoiceNo:"",
           invoiceStatus:"0",



         };
         this.tableDataTwo.push(p)
      },
      //结束
      copyClick(){
        this.tableDataTwo.map(item=>{
            item.jiesuanWeight  = item.zongzhongliang   //结算重量
            item.jiesuanMoney   = item.cusMoney    //结算金额
            item.jiesuanDanjia  = item.guapaijia    //结算单价
            item.jiesuanJianshu  = item.jianshu //结算件数
            //实提金额的录入
            item.realUnitPrice = this.$global.accMinus(item.jiesuanDanjia,item.interestUnitPrice)//实际单价
            item.realMoney = this.$global.accMinus(item.jiesuanMoney,item.interestMoney)//实际金额

            
        })
      },
      findOnlineBusinessList(){
         let p = {};
         p.orderId = this.$route.query.id;//订单id
         p.billType = '10030';//类型
         p.status = "1";
         findBillFlow(p).then(res =>{
               if(res.code =='100'){
                 this.onlineBusinessDic = res.data.list[0];
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
          let dic                   = {};
              dic.billType          = '10030';  //账单类型
              dic.fsMoney           = '0';  //发生金额
              dic.ysMoney           = this.$global.accMinus(0,this.tMoney);  //应收金额
              dic.dkpMoney          = this.tMoney;  //待开票金额

              dic.sellerEmpDept     = '';  //卖家负责人部门
              dic.sellerCompanyId   = this.$route.query.merchantsId;  //卖家公司id
              dic.sellerCompanyName = this.$route.query.shopOrgName;  //卖家公司名称
              dic.sellerEmpName     = this.$route.query.shopUserName;  //卖家负责人名称

              dic.buyerEmpDept      = '';  //买家负责人部门 本公司
              dic.buyerCompanyId    = this.$route.query.customerOrgId;  //买家公司id
              dic.buyerEmpName      = this.$global.adminInfo.cname;  //买家负责人名称
              dic.buyerCompanyName  = this.$route.query.customerOrgName;  //买家公司名称

              dic.orderId           = this.$route.query.id;  //订单id
              dic.orderNo           = this.$route.query.ordersNo;  //订单号

              dic.accApply          = '';  //打款申请
              dic.dkApply           = '';  //抵扣申请
              dic.txApply           = '';  //提现申请
              dic.kpApply           = '';  //开票申请
              dic.zxStatus          = '1';  //注销状态
              dic.note              = '实提账单';  //备注
              dic.status            = '1';  //可用状态
              dic.transactionType   = '1';  //交易账单类型（买家账单，卖家账单）
            plist.push(dic);
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
          let p                     = {};
          let plist                 = [];
          let dic                   = {};
              dic.id = this.onlineBusinessDic.id
              dic.ysMoney           = this.$global.accMinus(0,this.tMoney);  //应收金额
              dic.dkpMoney          = this.tMoney;  //待开票金额
              dic.buyerEmpName      = this.$global.adminInfo.cname;  //买家负责人名称

            plist.push(dic);
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
      currentChangeNew({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event){
        // if(column.label == "结算单价" || column.label == "结算重量"){
        //   //通过结算单价计算 总金额 = 结算单价 * 结算重量
        //  row.jiesuanMoney = row.jiesuanDanjia * row.jiesuanWeight
        // }
        console.log("点击了")
        console.log(column)
        this.ciickItem =column.title; 
      },
      changeFilterEvent (evnt, option, context) {
        console.log("点击变化")

            },
      getInputChange(item){
          console.log(item);
      },
        //获取单选的值
        getRadio(item){
             this.radioValue=item
             console.log('单选值'+item)
        },
        //获取一键添加input的值
        paiceName(e){
        this.namePrice=e.target.value;

        },
         //获取浮动价格
        getValue(item){
        console.log(item)
        this.priceVa=item

        },
         //一键添加
        addAll(){
            if(this.priceVa==''){
                this.$Notice.error({
                            title: '请选择添加类型',
                        }); 
            }
        this.tableDataTwo.map((item)=>{
            if(this.radioValue==1){
               item.floatMoney=this.namePrice

            } else if(this.radioValue==3||this.radioValue==''){
                if(this.priceVa==1){//浮动价
                    item.floatMoney=this.namePrice
                }
                else if(this.priceVa==''){
                    console.log('请选择一键添加网价还是浮动价')
                }
            }
            
        })
        },

      //=====================
      switchChange(status){
        console.log("开关状态" +status)
        let a = "";
        if(status){//true
          this.switchTitle = "是"
          a = "1"
        }else{
          this.switchTitle = "否"
          a = "0"

        }
        this.tableDataTwo.map(item=>{
          item.receiptStatus = a;
        })
      },
      //获取公司名字
         getComPany(){
             let param={};
          param.pageSize = 999999;
              
             findOrgCusAcc(param).then(res=>{
        
                  this.dataCompany=res.data.list            
            })
         },
      setOrderInfo(){
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName        
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll)
          this.formItem.gongcheng             = this.$route.query.gongcheng
          this.getOrderInfo(); 
      },
      getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              for(var i=0;i< res.data.list.length;i++){
                let dic =res.data.list[i];
                  // res.data.list[i].receiptStatus=='1'? '是' :'否'  默认四舍五入 取值
                   res.data.list[i].invoiceStatus=='1'? res.data.list[i].invoiceStatus='是' :res.data.list[i].invoiceStatus='否'
                dic.jiesuanWeight = this.$global.accPrecision(dic.jiesuanWeight,3);
                dic.jiesuanDanjia = this.$global.accPrecision(dic.jiesuanDanjia,2);
                dic.jiesuanMoney = this.$global.accPrecision(dic.jiesuanMoney,2);

                dic.buyRealDanjia = this.$global.accPrecision(dic.buyRealDanjia,2);
                dic.buyRealWeight = this.$global.accPrecision(dic.buyRealWeight,3);
                dic.buyRealMoney = this.$global.accPrecision(dic.buyRealMoney,2);

                dic.interestMoney = dic.sointerestMoney
              }
              // this.data1 = res.data.list.reverse();
              this.tableDataTwo=res.data.list.reverse();
              //设置默认一键收货
              //switch1
              this.switch1 = true;
              this.switchChange(true);
              console.log(this.tableDataTwo)
            }else{
            }
          })
      },
     
       getOrderOrgRecord(){
            this.orgMoneyRecordItem ="";
            let p  = {};
            p.orderId = this.$route.query.id;
            p.payMoneyType = "5"
            findOrgMoneyRecord(p).then(res=>{
                  if(res.code =="100"){
                    if(res.data.list.length>0){
                      this.isadd              = false;
                      this.orgMoneyRecordItem = res.data.list[0];
                      this.btnDisabled        = false;
                      this.saveBtnShow        = false;
                    }else{
                      this.isadd       = true;
                      this.btnDisabled = true;
                      this.saveBtnShow = true;
                    }
                }  
              })
       },
       //步骤1：修改订单明细为已收货
       //步骤2：修改客户已经入账的流水
       //步骤3：如果订单的所有明细都录入实提，确认已收货，则总订单的状态变化
       addBtn(){
         //判断是否能提交
         //如果实提重量为0或实提金额为0 不可提交
        if(Number(this.tWeight)==0 || Number(this.tMoney) ==0){
          this.$Message.warning("实提重量或实提金额不可为0")
          return false;
        }
         if(this.onlineBusinessDic){//判断是否有值，有值修改，无值添加
            console.log("数组中有值")
            this.updateOnlineBusiness();
          }else{
            console.log("数组中无值")
              this.payOnlineBusiness();
          }
         this.btnDisabled =true;
         
         Promise.all([this.newAddLiXi(),this.stepChangeOrderInfo(),this.stepChangeOrder(),this.stepChangeOrgMoneyRecord()]).then((res) => {

            console.log(res, 'promise all 方法')
            //无论成功还是取消都调用相同方法
            this.$confirm('保存成功', '提示', {
                confirmButtonText: '确定',
                type: 'success',
                center: true,
                showCancelButton:false
            }).then(() => {
            //成功点击事件,不显示取消按钮
                setTimeout(() => {
                  this.closeSelf();
                }, 0);
                 setTimeout(() => {
                  const route = { 
                    name: 'sell_order_list',
                    query:''
                }
                this.$router.push(route)
                Utils.$emit('sell_order_list','reload');
               }, 100);
                console.log("点击确定关闭")
            }).catch(() => {
            //取消点击事件，
                 setTimeout(() => {
                  this.closeSelf();
                }, 0);
                setTimeout(() => {
                  const route = { 
                    name: 'sell_order_list',
                    query:''
                }
                this.$router.push(route)
                Utils.$emit('sell_order_list','reload');
               }, 100);
            });
          })
          // this.stepChangeOrderInfo();//修改订单明细
          // this.stepChangeOrder();//修改订单总信息
          // this.stepChangeOrgMoneyRecord();//修改流水信息
       },
      
       //步骤4:给供应商添加一笔流水入账流水；
       step4AddOrgMoneyRecord(){//走线下确认付款成功后，
            let p                   = {};
            let plist               = [];
                  let dic                 = {};
                    dic.customerId      = this.$route.query.customerId;
                    dic.orderId         = this.$route.query.id;
                    dic.inMoney         = '0';
                    dic.outMoney        = this.tMoney;
                    dic.currentMoney    = "0"
                    dic.userId          = this.$global.adminInfo.id
                    dic.payMoneyType    = "5"
                    dic.note            = '销售单出账';
                    dic.orderNo         = this.$route.query.ordersNo;
                    dic.bankJgId        = this.$route.query.bankJgId;
                    dic.orgId           = this.$route.query.customerOrgId;
                    dic.orgName         = this.$route.query.customerOrgName;
                    dic.daozhangdanId   = '0'
                    dic.bankConnectedId = '0'
                    dic.zhidanApplyId   = '0';
                    dic.zhaiyao         = '销售单出账'
                    dic.direction        = ''
                    dic.type        = '1'
                    dic.status        = '1'

                plist.push(dic);
                p.list = plist;
           
             addOrgMoneyRecord(p).then(res=>{
                        if(res.code =="100"){
                          this.$Notice.success({
                            title:'入账流水成功',
                            duration:3,
                             onClose:res =>{
                              }
                          })
                        }else{
                          this.$Notice.error({
                            title:'入账流水失败'
                          })
                        }
               })
        },
       //步骤3：如果订单的所有明细都录入实提，确认已收货，则总订单的状态变化
       stepChangeOrder(){
         return new Promise((resolve,reject)=>{
         console.log("step2 运行")
            //获取已经录入实提的总重量和吨位；
            //如果全部实提，状态变更成8；
            let is8 = true;
            let a = 0;
            let b = 0;
            let c=0;
            let d=0;
            let isAdd = false;
            this.tableDataTwo.map(item=>{
                if(item.receiptStatus == "0"){
                  is8 =false;
                }else{
                  isAdd = true;
                  a = this.$global.accAdd(a,item.jiesuanWeight)
                  b = this.$global.accAdd(b,item.jiesuanMoney)
                  c = this.$global.accAdd(c,item.realMoney )
                  d = this.$global.accAdd(d,item.interestMoney )
                }
            })
            console.log("isAdd="+isAdd)
            if(!isAdd){
              this.$Notice.info({
                title:"请确认有明细已确认收货"
              })
              return;
            }
            let p                         = {};
            let plist                     = [];
            let dic                       = {};
                dic.id                    = this.$route.query.id;
                dic.deliveryTotalWeight   = a
                dic.deliveryTotalMoneyCus = b
                dic.realMoney             = c
                dic.interestMoney         = d
            if(is8){
              dic.status                = "8";
            }
            dic.statusNote            = "录入实提"
            plist.push(dic);
            p.pageUpdateOrderList = plist;
              updateOrderStatus(p).then(res =>{
                console.log("step2 OK")
                resolve("step2 OK")
                if(res.code =='100'){
                  this.isDisable=true;
                    this.$Notice.success({
                        title:'修改订单状态成功',
                    })
                }else{
                    this.$Notice.error({
                        title:'修改订单状态失败'
                    })
                }
              })
             })
       },
       //新增的利息接口
       newAddLiXi(){
         return new Promise((resolve,reject)=>{
             let params = {pageOrderInfoList:[]};
             let tableDataThree=[];
             this.tableDataTwo.map((item=>{
               console.log("新增"+item.newAdd);
                if(item.newAdd==true){
                  tableDataThree.push(item)
                }
             }))
             let baseItem = this.tableDataTwo[0];
             tableDataThree.map((item)=>{
                  let dic                    = {}
                      dic.ordersId           = baseItem.ordersId;
                      dic.orderNo            = baseItem.orderNo;
                      dic.status             = "1";
                      dic.agentId            = baseItem.agentId
                      dic.agentName          = baseItem.agentName
                      dic.agentShortName     = baseItem.agentName
                      dic.bankJgId           = baseItem.bankJgId
                      dic.businessType       = baseItem.businessType
                      dic.buyType            = baseItem.buyType
                      dic.createCname        = this.$global.adminInfo.cname
                      dic.createEname        = this.$global.adminInfo.ename
                      dic.customerId         = baseItem.customerId
                      dic.customerName       = baseItem.customerName;
                      dic.customerOrgId      = baseItem.customerOrgId
                      dic.customerOrgName    = baseItem.customerOrgName;
                      dic.customerPhone      = baseItem.customerPhone
                      dic.invoiceApplyMoney  = "0"
                      dic.invoiceApplyWeight = "0"
                      dic.ordersType         = baseItem.ordersType
                      dic.payType            = baseItem.payType
                      dic.shopId             = baseItem.shopId
                      dic.shopName           = baseItem.shopName
                      dic.shopOrgId          = baseItem.shopOrgId
                      dic.shopOrgName        = baseItem.shopOrgName;
                      dic.shopSteelId        = '';
                      dic.shopUserId         = item.shopUserId;
                      dic.userId             = item.userId
                       //下面是根据列表取的内容
                        dic.inStockId      = 0;
                        dic.cusMoney       = item.cusMoney
                        dic.orgMoney       = item.cusMoney        //底价总额
                        dic.dijia          = item.guapaijia
                        dic.guapaijia      = item.guapaijia
                        dic.jianshu        = item.jianshu
                        dic.xuniJianshu    = item.jianshu
                        dic.jiaohuodi      = item.jiaohuodi
                        dic.jizhongType    = item.jizhongType
                        dic.kunbaohao      = item.kunbaohao
                        dic.merMoney       = item.cusMoney
                        dic.steelGuige     = item.steelGuige
                        dic.steelName      = item.steelName
                        dic.steelPaihao    = item.steelPaihao
                        dic.steelPinpai    = item.steelPinpai
                        dic.steelWorks     = item.steelWorks
                        dic.steelType      = item.steelType       //类别
                        dic.weight         = item.weight
                        dic.zongzhongliang = item.zongzhongliang
                          //新增的字段
                        dic.jiesuanDanjia     = item.jiesuanDanjia
                        dic.jiesuanMoney      = item.jiesuanMoney
                        dic.jiesuanWeight     = item.jiesuanWeight
                        dic.jiesuanJianshu    = item.jianshu
                        dic.receiptStatus     = item.receiptStatus
                        dic.invoiceMoney      = item.invoiceMoney
                        dic.invoiceWeight     = item.invoiceWeight
                        dic.invoiceStatus     = item.invoiceStatus
                        dic.invoiceNo         = item.invoiceNo
                        dic.internetMoney     = item.internetMoney
                        dic.floatMoney        = item.floatMoney
                        dic.region            = item.region
                        dic.internetMoneyNote = item.internetMoneyNote
                        dic.infoType          = '2'                     // 1是货物  2是 利息
                        dic.interestUnitPrice = item.interestUnitPrice //利息单价
                        dic.interestMoney     = item.interestMoney//利息总额
                        dic.realUnitPrice     = item.realUnitPrice//货物实提单价
                        dic.realMoney         = item.realMoney//货物实提金额
                        dic.note              = item.note//备注
                          params.pageOrderInfoList.push(dic)
             })
             if(params.pageOrderInfoList.length <=0){
                resolve("step0 OK")
               return false;
             }
              addOrderInfo(params).then(res =>{
                resolve("step0 OK")
                       if(res.code=='100'){
                              this.$Notice.success({
                              title:'新增利息成功'
                              })
                       }else {
                          this.$Notice.error({
                              title:'新增利息失败'
                              })
                       }
                  
              })
             
         })
       },
       
       stepChangeOrderInfo(){
         return new Promise((resolve,reject)=>{
          let params = {};
          let pageOrderInfoList = [];
          for(var i=0; i<this.tableDataTwo.length;i++ ){
            var item = this.tableDataTwo[i];
            let dic = {};
            dic.id             = item.id;
            dic.jiesuanWeight  = item.jiesuanWeight   //结算重量
            dic.jiesuanMoney   = item.jiesuanMoney    //结算金额
            dic.jiesuanDanjia  = item.jiesuanDanjia    //结算单价
            dic.jiesuanJianshu  = item.jiesuanJianshu    //结算件数

            dic.receiptStatus  = item.receiptStatus   //是否收货

            dic.buyRealDanjia = item.buyRealDanjia
            dic.buyRealWeight = item.buyRealWeight
            dic.buyRealMoney =  item.buyRealMoney

            dic.realUnitPrice     = item.realUnitPrice              //实际单价
            dic.realMoney         = item.realMoney              //实际金额
            dic.interestUnitPrice = item.interestUnitPrice;             //利息单价
            dic.interestMoney     = item.interestMoney ;              //利息金额
            dic.note              = item.note             //备注

            pageOrderInfoList.push(dic);
          }
          params.pageOrderInfoList = pageOrderInfoList;

          updateOrderInfo(params).then(res =>{
            console.log("step1 OK")
            resolve("step1 OK")
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'修改成功',
                     duration:1,
                     onClose:res =>{
                        console.log("关闭时回调")
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'修改失败'
                 })
             }
          })
         })
       },
       //步骤2：修改客户已经入账的流水； 如果之前是 已经添加过得，只修改，没有添加的 走添加
       stepChangeOrgMoneyRecord(){
         return new Promise((resolve,reject)=>{
         console.log("步骤3开始")
             let p = {};
             let plist = [];
             let dic = {};
             dic.id = this.orgMoneyRecordItem.id;
             dic.outMoney = this.tMoney;
             plist.push(dic);
             p.list = plist;
              updateOrgMoneyRecord(p).then(res=>{
                    console.log("step3 OK")
                    resolve("step3 OK")
               if(res.code =="100"){
                 this.$Notice.success({
                   title:'修改流水成功',
                   duration:2,
                   onClose:res=>{
                    //  this.closeSelf();
                   }
                 })
               }else{
                 this.$Notice.error({
                   title:'修改流水失败'
                 })
               }
             })
          })   
        },
       
       closeSelf(){//审核或者关闭之后跳转到
          this.closeTag({
              name: 'sell_order_changeActual1',
              query:this.$route.query
          })
       },
       toreload(){//通知列表页面刷新数据
          console.log("准备关闭2")
           Utils.$emit('demo','reload');
       },
     ...mapMutations([
      'closeTag'
    ]),
    },
    
    mounted(){
     this.setOrderInfo();
     this.getComPany();
     this.getOrderOrgRecord();
     this.findOnlineBusinessList();
    },
    computed:{
      getTotal(){
        let  a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        let e = 0;
        let f = 0;
        // tWeight:0,//实提重量
        // tMoney:0,//实提金额
        // contractTMoney:0,//合同金额
        // contractTWeight:0,//合同重量
        // interestTMoney:0,//利息总额
        // realTMoney:0,//货物实际总额
        console.log("点击那一行"+this.ciickItem);
        this.tableDataTwo.map(item=>{
          if(this.ciickItem =="结算单价" ){
              if(item.infoType == "0")//货物明细
              {
              item.jiesuanMoney = item.jiesuanDanjia * item.jiesuanWeight;//更新结算金额
              //更新 货物实提金额 和单价
              //货物实提单价 = 结算单价 - 利息单价
              item.realUnitPrice = this.$global.accMinus(item.jiesuanDanjia,item.interestUnitPrice);
              //货物实提总额 = 货物实提单价 * 结算重量
              item.realMoney = this.$global.accMul(item.jiesuanWeight,item.realUnitPrice);
              }
              else{//利息明细
                item.interestUnitPrice = item.jiesuanDanjia;
                item.interestMoney = item.jiesuanMoney;
              }
            }
            if( this.ciickItem =="结算重量"){
              if(item.infoType == "0")//货物明细
              {
              //更新 结算金额 = 结算单价*结算重量
              item.jiesuanMoney = item.jiesuanDanjia * item.jiesuanWeight;

              //货物实提总额 = 货物实提单价 * 结算重量
              item.realMoney = this.$global.accMul(item.jiesuanWeight,item.realUnitPrice);
              }
              else//利息明细
              {
                //更新 结算金额 = 结算单价*结算重量
                item.jiesuanMoney = item.jiesuanDanjia * item.jiesuanWeight;
                item.interestMoney = item.jiesuanMoney;
              }
            }
            //利息的变化
            if(this.ciickItem=='利息单价'){
              if(item.infoType == "0")//货物明细
              {
              //变化利息 单价 ，则结算单价 = 利息单价 + 货物单价
              item.jiesuanDanjia = this.$global.accAdd(item.interestUnitPrice,item.realUnitPrice);
              item.jiesuanMoney = item.jiesuanDanjia * item.jiesuanWeight;//更新结算金额
              //更新利息总额
              item.interestMoney   = this.$global.accMul(item.interestUnitPrice,item.jiesuanWeight);
              }
              else
              {
                //结算单价 = 利息单价
                item.jiesuanDanjia = item.interestUnitPrice;
                //利息金额= 结算重量 * 利息单价
                item.interestMoney = this.$global.accMul(item.jiesuanWeight,item.interestUnitPrice);
                //结算金额 = 利息金额
                item.jiesuanMoney = item.interestMoney;
              }
            }

            if(this.radioValue == "1"){
                item.internetMoney= this.$global.accMinus(item.guapaijia,item.floatMoney) //根据销售单价计算网价
            }

           a = this.$global.accAdd(a,item.jiesuanWeight)
           b = this.$global.accAdd(b,item.jiesuanMoney)
           let aa = item.jiesuanDanjia
           let bb = item.jiesuanWeight
            
                
           
           c = this.$global.accAdd(c,item.zongzhongliang)
           d = this.$global.accAdd(d,item.cusMoney)

           e =this.$global.accAdd(e,item.interestMoney)
           f =this.$global.accAdd(f,item.realMoney)

        })
        this.tWeight         = a;
        this.tMoney          = b;
        this.contractTWeight = c;
        this.contractTMoney  = d;
        this.interestTMoney  = e;
        this.realTMoney  = f;
      }
    },
    created(){
   
    },
}

</script>
<style <style lang="less">

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
.font_32 {
        font-size: 32;
    }
        .ivu-table-cell {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
   .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {
      padding: 0 2px;
      }

      .vxe-table-element .vxe-header--column.col-blue {
          background-color: #ddfdff;
        }
</style>