/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-05-10 10:54:37 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-12-13 11:05:20
 */
<!--
 * @Description:审核采购单 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-10 10:27:38
 -->
<template>
     <div id='xaio'>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
      <dl>
        <dt>采购单号：{{formItem.orderNo}}</dt>
        <dd>采购公司：{{formItem.cusOrgName}}</dd>
      </dl>
      <dl>
        <!-- <dt>供应商公司：{{formItem.shopOrgName}}</dt> -->
        <dt>供应商公司：
          <Select id='gong' v-model="formItem.shopOrgName" filterable style="width:220px" :placeholder="formItem.shopOrgName"  @on-change='getDian'  :label-in-value='true'>
              <Option v-for="(item,index) in shopList" :value="JSON.stringify(item)" :label="item.name" :key="index" >{{ item.name }}</Option>
            </Select>
        </dt>
        <dd>采购员：{{formItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{formItem.money}}</dt>
        <dt>工程名称：
          <el-select @change="changeEngerName" size="small" style="width:220px" v-model="formItem.engerName" clearable  filterable  default-first-option placeholder="请输入工程名称">
             <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.label" ></el-option>
              </el-option>
          </el-select>
          <!-- <Input v-model="formItem.engerName" @on-change="changeEngerName" style="width:160px;" /> -->
        </dt>
      </dl>
        
    </row>
    <row>
        <b class="font_32">合同信息</b>
        <span style="margin-left:40px;color:red;">点击可以编辑修改,&nbsp;单价和总重量变化会变化总金额;&nbsp;结算单价和结算重量变化会变化结算金额</span>
        <!-- VEX-ELEMENT -->
        <vxe-toolbar>
          <template v-slot:buttons>
            <vxe-button @click="addNewitem">添加一行</vxe-button>
          </template>
        </vxe-toolbar>
        <vxe-table border 
        class="vxe-table-element" 
        :highlight-cell='false'  
        :data.sync="tableData"
        size="mini"
        @edit-actived="currentChangeNew"  
        :edit-config="{key: 'id', trigger: 'click', mode: 'cell',} ">
                <vxe-table-column  fixed="left" label="操作"  min-width="100" align="center">
                    <template v-slot="{row,rowIndex}">
                        <vxe-button type="text" @click='addNewItemFromTable(row,rowIndex)'  v-if="row.vType==1" >复制一行</vxe-button>
                        <vxe-button type="text"  v-if="row.vType==2||row.vType==3" @click='deleteRow(row,rowIndex)'>删除</vxe-button>
                    </template>
               </vxe-table-column>
               <vxe-table-column fixed="left" prop='vType' :formatter="tableType" width="60" label="类型"></vxe-table-column> 
                <vxe-table-column fixed="left"  prop='id' width="50"  label="ID">
                        <template v-slot="{ row,rowIndex}">
                          <span v-if="row.vType==1" >{{row.id}}</span>
                    </template>
                  </vxe-table-column> 
                <vxe-table-column  fixed="left" prop="steelType" label="类别" min-width="80"></vxe-table-column>
                <vxe-table-column  fixed="left" prop="steelName" label="品名" width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column  fixed="left" prop="steelGuige" label="规格" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column  fixed="left" prop="steelPaihao" label="材质" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="steelPinpai" label="钢厂" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="steelWorks" label="提货方式" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="jiaohuodi" label="交货地" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="jizhongType" label="计重方式" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="jianshu" label="件数" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                
                <vxe-table-column prop="weight" :formatter="this.$global.vxeTableWeight"  label="单件重" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="zongzhongliang" :formatter="this.$global.vxeTableWeight" label="总重量" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="guapaijia" :formatter="this.$global.vxeTableMoney" label="单价" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="cusMoney" :formatter="this.$global.vxeTableMoney" label="总金额" min-width="120" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="kunbaohao" label="捆包号" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                
                <vxe-table-column prop="jiesuanJianshu"  label="实提件数" min-width="80"></vxe-table-column>
                <vxe-table-column prop="jiesuanDanjia" :formatter="this.$global.vxeTableMoney"  label="实提单价" min-width="80"></vxe-table-column>
                <vxe-table-column prop="jiesuanWeight" :formatter="this.$global.vxeTableWeight"  label="实提重量" min-width="80"></vxe-table-column>
                <vxe-table-column prop="jiesuanMoney"  :formatter="this.$global.vxeTableMoney"  label="实提金额" min-width="120"></vxe-table-column>
                <vxe-table-column prop="receiptStatus" label="是否收货" :edit-render="{name: 'ElSelect',options:selectData}" min-width="80"></vxe-table-column>

                <vxe-table-column prop="invoiceWeight" :formatter="this.$global.vxeTableWeight" label="收票重量" :edit-render="{name: 'ElInput',autoselect: true}"  min-width="80"></vxe-table-column>
                <vxe-table-column prop="invoiceMoney" :formatter="this.$global.vxeTableWeight" label="收票金额" :edit-render="{name: 'ElInput',autoselect: true}" min-width="80"></vxe-table-column>
                <vxe-table-column prop="invoiceNo" label="收票号码"  :edit-render="{name: 'ElInput',autoselect: true}" min-width="80"></vxe-table-column>
                <vxe-table-column prop="invoiceStatus" label="是否收票" :edit-render="{name: 'ElSelect',options:selectData}" min-width="80"></vxe-table-column>
          </vxe-table>
    </row>
    <row>
      
      <span>合同重量合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.accPrecision(contractTWeight,3)}}吨</span>
      <span>合同金额合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.isMoneyShow(contractTMoney)}}元</span>
      <span>总件数：</span>
      <span style="color:red;">{{this.$global.accPrecision(contractTNumber,0)}}件</span>
      <br>
      <span>实提重量合计：</span>
      <span  style="color:red;margin-right:20px">{{this.$global.accPrecision(tWeight,3)}}吨</span>
      <span>实提金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(tMoney)}}元</span>
      <p style="disaply:none">{{getTotal}}</p>
      <br>
      <Button type="primary" @click="addBtn" :disabled="isDisable"> 修改提交</Button>
    </row>

     </div>
</template>
<script>
import {findOrdersInfoAll,
updateOrderInfo,
addOrderInfo,
findOrgCusAcc,
findShop,findOrdersAll,xiangMu,
updateOrderStatus} from '@/api/data'
import { mapMutations } from 'vuex'
import Utils from '@/api/middle'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
export default {
    name: 'buy_order_change_info1',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        engineerNameList:[],//工程名称数组
        searchOrderItem:'',
        ciickItem:'',
        contractTWeight:0,
        contractTMoney:0,
        contractTNumber:0,
        tWeight:0,
        tMoney:0,
        ids:0,//用于编辑的id
        selectData:[{
          value:'1',
          label:'是'
        },{
          value:'0',
          label:"否"
        }],
        //开始
        tableDataOme:[],
        tableData: [],
        // 结束
        isChangeShop:false,
        isChangeEnger:false,
        shopList:[],//店铺data
        isDisable:false,
        tableItem:{},
        shopId: "",//供应商店铺id
        shopName: "",//供应商店铺名称
        shopOrgId: "",//供应商店铺公司id
        shopOrgName: "",//供应商店铺公司名称
        shopUserId: "",//供应商店铺所属管理员id
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
      dataCompany:[],
        formItem: {
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          engerName:''//工程名称
          },
          columns2: [
                ],
                data2:[],//添加表格使用的列表
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 ,//初始化时查询的页码数
      }
    },
    
    methods:{
       //查询工程
      getGongcheng(){
        let p  ={};
        p.pageSize ="99999"
        p.status = 1;
        p.type = '2';
        this.engineerNameList = [];
        //替换接口 查询工程名称 xiangMu findOrderEngineering
        xiangMu(p).then(res=>{
          if(res.code =="100"){
            this.$Message.success("获取工程名称成功")
              res.data.list.map(item =>{
                let dic = {};
                dic.label =item.cname;
                dic.value =item.id;
                this.engineerNameList.push(dic);
              })
          }
        })
      },
       currentChangeNew({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event){
        this.ciickItem =column.label; 
      },
      tableType({cellValue, row, column}){
            let a = ''
            switch (Number(cellValue)) {
              case 1:
                a = '原数据(1)'
                break;
             case 2:
                a = '复制一行数据(2)'
                break;
              default:
                break;
            }
            return a;
      },
       addNewitem(){//添加一行
          this.ids++;
          let ssType = '' 
          if(this.tableData.length>0){
            ssType = this.tableData[0].steelType
          }else{
            ssType = '建筑钢材'
          }
          let dic = {
            invoiceStatus:'0',
            receiptStatus:'0',
            vType:'2',
            steelType:ssType,
            id:this.ids,
            zongzhongliang:'0',
            cusMoney:'0',
            jianshu:'0',
            guapaijia:'0',
            jiesuanWeight:'0',
            jiesuanDanjia:'0',
            jiesuanMoney:'0'
          };
          this.tableData.push(dic);
    },
      deleteRow(row,rowIndex){//删除一行
          this.tableData.splice(rowIndex,1);
      },
       //复制一行到table表格
    addNewItemFromTable(row,rowIndex){//TODO
      let a       = {};
          a       = this.copyDeep(row);
          a.vType = "2"
       this.ids++;
       a.id = this.ids;
      this.tableData.push(a);
    },
      // 结束
      changeEngerName(item){
        this.isChangeEnger = true;
      },
      //获取供应商选中的值
      getDian(item){
        //item= eval('(' + item + ')');
        const stingR=eval('(' + item.value + ')')
        this.shopId=stingR.id;
        this.shopName=stingR.name;
        this.shopOrgName=stingR.orgName;
        this.shopUserId=stingR.adminId;
        this.shopOrgId=stingR.orgId;
        this.isChangeShop = true;
      },
      copyDeep(templateData) {
      // templateData 是要复制的数组或对象，这样的数组或者对象就是指向新的地址的
        return JSON.parse(JSON.stringify(templateData));
      },
      //查询店铺
      getShop(){
        let param = {};
        param.status = 1;
        param.pageSize = "999999"
        findShop(param).then(res=>{
          if(res.code =="100"){
            this.shopList=res.data.list
          }
        })
      },
      //获取公司名字
      getComPany(){
             let p={};
              p.pageSize = "999999"
             findOrgCusAcc(p).then(res=>{
                 res.data.list.map((item)=>{
                   let dic={};
                   dic.label=item.cusorgName+","+item.cusorgId//公司id
                   dic.value=item.cusorgId+","+item.cusorgName;//公司名字
                 })

                  this.dataCompany=res.data.list   
                   
            })
         },
      setOrderInfo(){
          this.formItem.orderNo               = this.searchOrderItem.ordersNo     
          this.formItem.cusOrgName            = this.searchOrderItem.customerOrgName        
          this.formItem.shopOrgName           = this.searchOrderItem.shopOrgName          
          this.formItem.adminName             = this.searchOrderItem.userName        
          this.formItem.money                 = this.$global.isMoneyShow(this.searchOrderItem.moneyAll) 
          this.formItem.engerName             = this.searchOrderItem.gongcheng;
          this.getOrderInfo(); 
      },
     getOrderMessage(){//获取订单信息 TODO
        //获取到query 信息后，取出订单号 用来查询
        let p = {};
        p.ordersNo = this.$route.query.ordersNo
         findOrdersAll(p).then(res=>{
            if(res.code =="100"){
              this.searchOrderItem = res.data.list[0];
              this.setOrderInfo();
          }  
        })
       },
      getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              for(var i=0; i<res.data.list.length;i++ ){
                res.data.list[i].vType = "1" //1是原数据从后台获取的数据 2是 复制一行的数据 
                //对数据进行处理 todo   zongzhongliang   guapaijia cusMoney  
                res.data.list[i].weight=this.$global.accPrecision(res.data.list[i].weight,3)
                res.data.list[i].zongzhongliang=this.$global.accPrecision(res.data.list[i].zongzhongliang,3)
                res.data.list[i].guapaijia=this.$global.accPrecision(res.data.list[i].guapaijia,2)
                res.data.list[i].cusMoney=this.$global.accPrecision(res.data.list[i].cusMoney,2)
                res.data.list[i].jiesuanWeight=this.$global.accPrecision(res.data.list[i].jiesuanWeight,3)
                res.data.list[i].jiesuanMoney=this.$global.accPrecision(res.data.list[i].jiesuanMoney,2)
                res.data.list[i].jiesuanDanjia=this.$global.accPrecision(res.data.list[i].jiesuanDanjia,2)
                
                res.data.list[i].invoiceWeight=this.$global.accPrecision(res.data.list[i].invoiceWeight,3)
                res.data.list[i].invoiceMoney=this.$global.accPrecision(res.data.list[i].invoiceMoney,2)  
                // res.data.list[i].receiptStatus=getReceiptStatusLabel(res.data.list[i].receiptStatus)
                // res.data.list[i].invoiceStatus=getInvoiceStatusLabel(res.data.list[i].invoiceStatus)
                this.ids = res.data.list[i].id;
              }
              this.tableData=res.data.list;//新版表格
              
            }else{
            }
          })
      },
       addBtn(){//修改提交
          this.updateOrderTInfo();//修改订单总信息
          this.addNewitemOrder();//新增明细
          let params = {};
          let pageOrderInfoList = [];
          this.tableDataOme=this.copyDeep(this.tableData);
          //修改订单明细
          for(var i=0; i<this.tableData.length;i++ ){
            var item = this.tableData[i];
            let dic = {};
                dic.id               = item.id;
                dic.steelType      = item.steelType;      //品名
                dic.steelName      = item.steelName;      //品名
                dic.steelGuige     = item.steelGuige;     //规格
                dic.steelPaihao    = item.steelPaihao;    //材质
                dic.steelPinpai    = item.steelPinpai;    //钢厂
                dic.steelWorks     = item.steelWorks      //提货方式
                dic.jiaohuodi      = item.jiaohuodi       //交货地
                dic.jizhongType    = item.jizhongType //计重方式
                dic.jianshu        = item.jianshu         //件数
                dic.zongzhongliang = item.zongzhongliang  //总重量
                dic.weight         = item.weight          //单件重
                dic.guapaijia      = item.guapaijia       //单价
                dic.cusMoney      = item.cusMoney       //总金额
                dic.orgMoney      = item.cusMoney       //总金额

                dic.kunbaohao      = item.kunbaohao       //捆包号
                dic.receiptStatus  = item.receiptStatus   //是否收货
                dic.invoiceWeight  = item.invoiceWeight   //开票重量
                dic.invoiceMoney   = item.invoiceMoney    //开票金额
                dic.invoiceNo      = item.invoiceNo       //开票号码
                dic.invoiceStatus  = item.invoiceStatus   //是否收票
                         if(this.isChangeShop == true){
                            dic.shopId      = this.shopId;
                            dic.shopUserId  = this.shopUserId;
                            dic.shopName    = this.shopName;
                            dic.shopOrgId   = this.shopOrgId;
                            dic.shopOrgName = this.shopOrgName;
                    }
            if(item.vType == 1){
              pageOrderInfoList.push(dic);
            }
          }
          params.pageOrderInfoList = pageOrderInfoList;
          updateOrderInfo(params).then(res =>{
             if(res.code =='100'){
               this.isDisable=true;
                 this.$Notice.success({
                     title:'修改成功',
                     duration:1,
                     onClose:res =>{
                        this.reload();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'修改失败'
                 })
             }
          })
       },
       updateOrderTInfo(){//修改订单的店铺信息和工程名称
      //  if(this.isChangeShop ==false  && this.isChangeEnger == false){
      //    return false;
      //  }
       let p = {};
       let plist = [];
       let dic = {};
       dic.id = this.$route.query.id;
       if(this.isChangeShop == true){
              dic.shopId      = this.shopId;
              dic.shopUserId  = this.shopUserId;
              dic.shopName    = this.shopName;
              dic.shopOrgId   = this.shopOrgId;
              dic.shopOrgName = this.shopOrgName;
       }
     
        if(this.isChangeEnger == true){
          dic.gongcheng = this.formItem.engerName;
        }
        // 2019年8月12日13:45:23 新增
        dic.zongzhongliang = this.contractTWeight;          //合同重量
        dic.zongjianshu    = this.contractTNumber;  //总件数
        dic.moneyAll       = this.contractTMoney;//总金额
        dic.orgMoneyAll    = this.contractTMoney;
        dic.beifenCusMoney = this.contractTMoney;
        dic.beifenMerMoney = this.contractTMoney;

       plist.push(dic);
       p.pageUpdateOrderList = plist;
          updateOrderStatus(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改总订单信息成功',
                    duration:1,
                    onClose:res =>{
                    }
                 })
              }else{
                   this.$Notice.error({
                   title:'修改总订单信息失败'
                  })
              }
           })
       },
       addNewitemOrder(){//新增订单明细
         
          let params ={};
          let orderInfoList = [];
          let baseItem = this.$route.query
          for(var i=0; i<this.tableData.length;i++ ){
             let dic =  this.tableData[i];
             let item = {};
             //传参时 不变的内容
                        item.ordersId           = baseItem.id;
                        item.orderNo            = baseItem.ordersNo;
                        item.status             = "1";

                        item.agentId            = baseItem.agentId
                        item.agentName          = baseItem.agentName
                        item.agentShortName     = baseItem.agentName
                        item.bankJgId           = baseItem.bankJgId
                        item.businessType       = baseItem.businessType
                        item.buyType            = baseItem.buyType
                        item.createCname        = this.$global.adminInfo.cname
                        item.createEname        = this.$global.adminInfo.ename
                        item.customerId         = baseItem.customerId
                        item.customerName       = baseItem.customerName;
                        item.customerOrgId      = baseItem.customerOrgId
                        item.customerOrgName    = baseItem.customerOrgName;
                        item.customerPhone      = baseItem.customerPhone
                        item.invoiceApplyMoney  = "0"
                        item.invoiceApplyWeight = "0"
                        item.ordersType         = baseItem.ordersType
                        item.payType            = baseItem.payType
                        item.shopId             = baseItem.shopId
                        item.shopName           = baseItem.shopName
                        item.shopOrgId          = baseItem.merchantsId
                        item.shopOrgName        = baseItem.shopOrgName;
                        item.shopSteelId        = '';
                        item.shopUserId         = baseItem.shopUserId;
                        item.userId             = baseItem.userId

                        //下面是根据列表取的内容
                        item.steelType    = dic.steelType
                        item.cusMoney     = dic.cusMoney
                        item.dijia        = dic.guapaijia
                        item.guapaijia    = dic.guapaijia
                        item.jianshu      = dic.jianshu
                        item.xuniJianshu  = dic.jianshu
                        item.jiaohuodi    = dic.jiaohuodi
                        item.jizhongType  = dic.jizhongType

                        item.kunbaohao    = dic.kunbaohao
                        item.merMoney     = dic.cusMoney
                        item.steelGuige   = dic.steelGuige
                        item.steelName    = dic.steelName
                        item.steelPaihao  = dic.steelPaihao
                        item.steelPinpai  = dic.steelPinpai
                        item.steelWorks   = dic.steelWorks
                        item.weight       = dic.weight
                        item.zongzhongliang = dic.zongzhongliang
                        //新增的字段
                        item.jiesuanMoney  = dic.jiesuanMoney 
                        item.jiesuanWeight = dic.jiesuanWeight
                        item.jiesuanDanjia = dic.jiesuanDanjia 
                        item.jiesuanJianshu = dic.jiesuanJianshu 

                        item.receiptStatus = dic.receiptStatus
                        item.invoiceMoney  = (dic.invoiceMoney =="")?"0":dic.invoiceMoney
                        item.invoiceWeight = (dic.invoiceWeight =="")?"0":dic.invoiceWeight 
                        item.invoiceStatus = dic.invoiceStatus
                        item.invoiceNo     = dic.invoiceNo
                        if(Number(dic.vType) == 2){
                           orderInfoList.push(item);  
                        }
          }
          if(orderInfoList.length<=0){
            return ;
          }
          params.pageOrderInfoList= orderInfoList;
          addOrderInfo(params).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'订单添加明细成功',
                      duration:1,
                      onClose:res =>{
                   }
                 })
             }else{
                 this.$Notice.error({
                     title:'订单添加明细失败'
                 })
             }
          })
       },
       turnToOrderList(){//审核或者关闭之后跳转到
          this.closeTag({
              name: 'review_order_info'
          })
          setTimeout(() => {
            this.toreload();
          }, 1000);
       },
       toreload(){//通知列表页面刷新数据
           Utils.$emit('demo','reload');
       },
        ...mapMutations([
      'closeTag'
    ]),
   
    },
    
    mounted(){
     this.getOrderMessage();
     this.getComPany();
     this.getShop();
     this.getGongcheng();
    },
     computed:{
      getTotal(){
        let  a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        let f = 0;//件数
        // tWeight:0,//实提重量
        // tMoney:0,//实提金额
        // contractTMoney:0,//合同金额
        // contractTWeight:0,//合同重量
        console.log("变化")
        this.tableData.map(item=>{
           //自动计算 结算单价* 结算重量  = 结算金额
            if(this.ciickItem =="结算单价" || this.ciickItem == "结算重量"){
                item.jiesuanMoney=item.jiesuanDanjia*item.jiesuanWeight
            }
            if(this.ciickItem =="总重量" ){//修改总重会变化 单件重
                
                item.weight=this.$global.accPrecision(this.$global.accDiv(item.zongzhongliang,item.jianshu),3);
                item.cusMoney=item.guapaijia*item.zongzhongliang
            }
            if( this.ciickItem == "单价"){
                item.cusMoney=item.guapaijia*item.zongzhongliang
            }
           a = this.$global.accAdd(a,item.jiesuanWeight)
           b = this.$global.accAdd(b,item.jiesuanMoney)
            
           c = this.$global.accAdd(c,item.zongzhongliang)
           d = this.$global.accAdd(d,item.cusMoney)

           f = this.$global.accAdd(f,item.jianshu)
        })
        this.tWeight         = a;
        this.tMoney          = b;
        this.contractTWeight = c;
        this.contractTMoney  = d;
        this.contractTNumber = f;
      }
    },
    created(){
   
    },
}

</script>
<style <style lang="less">
#gong .ivu-select-input::-webkit-input-placeholder{
  color:red
}

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
    .ivu-table-cell{
      padding-left: 0 !important;
      padding-right:0 !important;

    }
    .ivu-select-input ::-webkit-input-placeholder{
      color:red;
    }
    .ivu-select-input ::-moz-placeholder{
      color:red;
    }
    .ivu-select-input :-ms-input-placeholder{
      color:red;
    }
    .ivu-select-input :-moz-placeholder{
      color:red
    }

  
   #xaio .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
      }
     #xaio .vxe-table .vxe-cell {
      padding: 0 2px;
      }
     #xaio .vxe-table.vxe-editable.size--mini .vxe-body--column{
       height:20px!important
     }
</style>