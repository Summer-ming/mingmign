<template>
  <div>
  
      <row style='margin-bottom:20px;'>
           <Table size="small" :columns="columns1" :data="data1"></Table>
      </row>
     <row>
          <Button  style="margin-right:10px" type="primary" @click="addNew">新增利息</Button>
          <Button   type="primary" @click="getCha">刷新</Button>

     </row>
      
      <!-- 利息对话框 -->
    <Modal
        v-model="modal1" width="1200" :mask-closable='false' :footer-hide='true'
        :title="modalTitle">
        <span>合同金额<span style="color:red;font-size:16px">{{this.$global.isMoneyShow(orderItem.money)}}</span>元</span>
        <span style="margin-left:10px">合同重量<span style="color:red;font-size:16px">{{this.$global.accPrecision(orderItem.weight,3)}}</span>吨</span>
        <span style="margin-left:10px">实提金额<span style="color:red;font-size:16px">{{this.$global.isMoneyShow(orderItem.actualMoney)}}</span>元</span>
        <span style="margin-left:10px">实提重量<span style="color:red;font-size:16px">{{this.$global.accPrecision(orderItem.actualWeight,3)}}</span>吨</span>
       
         <!-- <Form ref="formValidate"  :rules="ruleValidate" :label-width="120" inline :model="addForm"> -->
         <Form ref="formValidate"   :label-width="120" inline :model="addForm">
        <row>
            <FormItem label="利息天数:" prop="name" >
           <i-input   style="width:200px" v-model="addForm.days" placeholder="请输入利息天数"/>
         </FormItem>

        <FormItem label="利息金额:"  prop="money" >
           <i-input @on-change=""   style="width:200px" v-model="addForm.money" placeholder="请输入利息金额"/>
         </FormItem>
          <FormItem label="到款日期:"  prop="money" >
            <DatePicker format="yyyy-MM-dd" type="date" v-model="addForm.arriveTime" placeholder="请选择到款日期" style="width:200px"></DatePicker>
         </FormItem>
         <FormItem label="类型:">
           <Select v-model="addForm.type" style="width:200px">
              <Option v-for="(item,index) in typeList"  :value="item.value" :key ="index" >{{item.lable}}</Option>
           </Select>
        </FormItem>
        <FormItem label="备注:" prop="shuomm">
            <i-input style="width:200px" type="textarea" :rows="3" v-model="addForm.note" placeholder="请输入备注" />
        </FormItem>

        </row>
       <!-- 添加  取消按钮 -->
        <row>
            <Button v-show="addBtn" style="margin-right:10px"   type="primary"  @click='getAdd'>添加</Button>
            <Button v-show="updateBtn" style="margin-right:10px"   type="primary"  @click='updateAction'>修改</Button>
            <Button   type="primary" @click="modal1 = false" >取消</Button>
        </row>

      </Form>
    </Modal>
  </div>
</template>

<script>
import {findOrgList,updateSell,addInterest,updateInterest,findInterest,
findOrgMoneyRecord,addOrgMoneyRecord,updateOrgMoneyRecord
} from '@/api/data'
import {OMTypeList,OMTaxRateList,OMPayInvoiceType} from '@/libs/global_type'
import {OMPayInvoiceTypeStr,OMTypeListStr,OMTaxRateListStr,OMstatusStr} from '@/libs/allStatus'
import {updateOrder89} from '@/api/data_8889' 
 import Utils from '@/api/middle'
  export default {
    name: 'sell_prolit',
    props: ["allOrder_orderItem"],
    data(){
      return {
        typeList:[
          {
            lable:'计息按吨',
            value:'1'
          }
        ],
        isChange:false,//判断是否变更利润
        isHasFlow:false,//判断是否有流水在表中
        orderMessage:'',
         isCal:0,
        isCalList:[
          {
            label:'无',
            value:0
          },
          {
            label:'单价乘以重量 计算金额',
            value:1
          },
        ],
        data1: [],
                OMPayInvoiceType:OMPayInvoiceType,
          OMTypeList:OMTypeList,
          OMTaxRateList:OMTaxRateList,
          dataParent:'',//绑定父组件传过来的值
          modal1:false,//利息对话框
          orderItem:{
            money:0,
            weight:0,
            actualMoney:0,
            actualWeight:0
          },
          addForm:{
              days:'',//天数
              name:"",//利息名称
              money:'',//利息金额
              note:'',//
              arriveTime:'',
              type:'1',

          },//利息表单弹窗
          ruleValidate:{ },
        companyTwo:'',
        companyId:'',
        addBtn:true,
        updateItem:{},
        updateBtn:false,
        modalTitle:"新增利息",
          columns1: [
                     {
                        title: 'Id',
                        key: 'id',
                        // width:'60'
                    },
                    {
                        title: '资金天数',
                        key: 'days',
                        // width:'100'
                    },
                    {
                        title: '利息（元）',
                        key: 'interest',
                        // width:'100',
                         render:(h,params) =>{
                          return  h('div',{

                          },this.$global.isMoneyShow(params.row.interest))
                        }
                    },
                    {
                        title: '到款日期',
                        key: 'daozhangDate',
                        // width:'100'
                    },
                    {
                        title: '备注',
                        key: 'note',
                        // width:'100',
                    },
                    {
                        title: '类型',
                        key: 'type',
                        // width:'100',
                    },
                    {
                        title: '状态',
                        key: 'status',
                        // width:'100',
                    },
                    {
                        title: '生成时间',
                        key: 'createTime',
                        // width:'100',
                    },
                    {
                      key:'operate',
                      title:'操作',
                      width:'150px',
                      align:'center',
                      fixed:'right',
                      render:(h,params)=>{
                        return h('div',[
                          h('Button',{
                            props: {
                            type: 'primary',
                            size: 'small'
                            },
                            style: {
                              marginRight: '5px',
                              display:params.row.isTotal ? 'none':""

                            },
                            on: {
                              click: () => {
                                this.remove(params.row.id)
                              }
                            }
                          },'删除'),
                            h('Button',{
                            props: {
                            type: 'primary',
                            size: 'small'
                            },
                            style: {
                              marginRight: '5px',
                              display:params.row.isTotal ? 'none':""

                            },
                            on: {
                              click: () => {
                                this.setModalItem(params.row);
                              }
                            }
                          },'编辑')
                        ])

                      }},

                ],
          data1: [  
                ],
          dataParent:'',//绑定父组件传过来的值
          modal1:false,//利息对话框
          conmpanyOne:"",//公司名称
          companyZu:[],//贮存公司名称

      }
    },
    methods:{
      addNew(){
          this.modalTitle = "新增利息"
        this.modal1 = true
        this.addBtn = true;
        this.updateBtn = false;
      },
      setModalItem(item){//编辑赋值
          this.modalTitle = "编辑利息"
        this.modal1 = true
        this.addBtn = false;
        this.updateBtn = true;
        this.updateItem = item;
         //赋值
        this.addForm.days         = item.days
        this.addForm.money        = item.interest
        this.addForm.note         = item.note
        let aArray = item.daozhangDate.split('-');
        let date = new Date(aArray[0],aArray[1]-1,aArray[2]);
        this.addForm.arriveTime         = date
      },
       getCha(val){
         this.data1= [];
            let param={};
             param.orderId = this.dataParent.id;
             param.pageSize  = "99999"
             findInterest(param).then(res=>{
              
             if(res.code =="100"){
                this.data1=res.data.list;
              }  
                if(this.isChange){
                 console.log("有修改或者删除")
                 this.getTotalMoney();
               }else{
                 console.log("没有修改或者删除")
               }
         })
       },
        getTotalMoney(){//获取利息总计,并更新给总订单
       let tm = 0;
         this.data1.map(item=>{
            tm = this.$global.accAdd(tm,item.interest)
         })
         if(tm){
           
         }else{
           tm = 0;
         }
         //修改总订单的信息
         this.updateOrder(tm);
         //添加流水 或者修改流水
          this.findOrgMoneyRecord(tm);
       },
       //查询是否有流水
       findOrgMoneyRecord(tm){
          this.orgMoneyRecordItem ="";
            let p  = {};
            p.orderId = this.orderMessage.id;
            p.payMoneyType = "18"
            findOrgMoneyRecord(p).then(res=>{
                  if(res.code =="100"){
                    if(res.data.list.length>0){//有则修改
                      this.updateOrgMoneyRecord(tm,res.data.list[0].id);
                    }else{//没有则添加
                      this.addOrgMoneyRecord(tm);
                    }
                     
                }  
              })
       },
       addOrgMoneyRecord(tm){
            let p                   = {};
            let plist               = [];
                  let dic                 = {};
                    dic.customerId      = this.orderMessage.customerId;
                    dic.orderId         = this.orderMessage.id;
                    dic.inMoney         = '0';
                    dic.outMoney        = tm;
                    dic.currentMoney    = "0"
                    dic.userId          = this.$global.adminInfo.id
                    dic.payMoneyType    = "18"
                    dic.note            = '销售单利润欠款';
                    dic.orderNo         = this.orderMessage.ordersNo;
                    dic.bankJgId        = this.orderMessage.bankJgId;
                    dic.orgId           = this.orderMessage.customerOrgId;
                    dic.orgName         = this.orderMessage.customerOrgName;
                    dic.daozhangdanId   = '0'
                    dic.bankConnectedId = '0'
                    dic.zhidanApplyId   = '0';
                    dic.zhaiyao         = '销售单利润欠款'
                    dic.direction        = ''
                    dic.type        = '1'
                    dic.status        = '1'

                plist.push(dic);
                p.list = plist;
           
             addOrgMoneyRecord(p).then(res=>{
                        if(res.code =="100"){
                          this.$Notice.success({
                            title:'入账流水成功',
                          })
                        }else{
                          this.$Notice.error({
                            title:'入账流水失败'
                          })
                        }
               })
       },
       updateOrgMoneyRecord(tm,omrId){
            let p = {};
             let plist = [];
             let dic = {};
             dic.id = omrId;
             dic.outMoney = tm;
             plist.push(dic);
             p.list = plist;
              updateOrgMoneyRecord(p).then(res=>{
               if(res.code =="100"){
                 this.$Notice.success({
                   title:'修改流水成功',
                 })
               }else{
                 this.$Notice.error({
                   title:'修改流水失败'
                 })
               }
             })
       },
       updateOrder(tmMoney){
          let p             = {
            pageUpdateOrderList:[]
          };
              let dic ={}
              dic.id = this.orderMessage.id;
              dic.interestMoney = tmMoney;
            p.pageUpdateOrderList.push(dic);
          updateOrder89(p).then(res=>{
            this.isChange =true;
            if(res.code =="100"){
             this.$Message.success("修改订单信息成功")
             this.modal1 =false;
             this.isChange = false;
             this.$emit('triggerFunc','reGetOrderMessage');
          }  
         })
       },
       updateAction(){//修改
       console.log("修改")
       console.log(this.addForm.arriveTime);
       let timeStr = '';
          if(this.addForm.arriveTime instanceof Date){
            timeStr = this.$global.formatDate(this.addForm.arriveTime,'yyyy-MM-dd')
          }
          let p             = {};
              p.id = this.updateItem.id;
              p.days = this.addForm.days;//天数
              p.interest = this.addForm.money;
              p.daozhangDate = timeStr;
              p.note         = this.addForm.note;

          updateInterest(p).then(res=>{
            this.isChange =true;
            if(res.code =="100"){
             this.$Message.success("修改成功")
             this.modal1 =false;
             this.getCha();
          }  
         })
       },
       //添加利息
       getAdd(){
         let timeStr = '';
          if( this.addForm.arriveTime instanceof Date){//判断是时间类型，如果是则选择了时间
            timeStr = this.$global.formatDate(this.addForm.arriveTime,'yyyy-MM-dd')
          }

          let p              = {};
              p.days         = this.addForm.days;
              p.interest     = this.addForm.money;
              p.daozhangDate = timeStr;
              p.note         = this.addForm.note;
              p.type         = "1";
              p.status         = "1";
              p.orderId =  this.orderMessage.id;
              p.orderNo =  this.orderMessage.ordersNo;

          addInterest(p).then(res=>{
            this.isChange = true;
            if(res.code =="100"){
             this.$Message.success("添加成功")
             this.modal1 =false;
             this.getCha();
          }  
         })
        
       },
       //删除表格
       remove(index){
          this.$Modal.confirm({
                         title:"确定需要删除吗",
                         onOk:()=>{
                                //删除的id index 
                              let p={};
                              p.id=index
                              p.status='0'
                              updateInterest(p).then(res=>{
                                this.isChange =true;
                                  if(res.code =="100"){
                                  this.$Message.success("删除成功")
                                  this.getCha();
                                }  
                              })
                         }
                       })
       },

    },
    mounted(){
    },
    watch: {
        allOrder_orderItem(val){
            console.log("watch 监听测试");
            console.log(val.ordersNo);
            this.orderMessage = val;
            this.orderItem.money        = val.moneyAll
          this.orderItem.weight       = val.zhongliangAll
          this.orderItem.actualMoney  = val.deliveryTotalMoneyCus
          this.orderItem.actualWeight = val.deliveryTotalWeight
            // this.valueForm_allOrder_orderItem = val;
            // this.getOrderAuditList();
            this.dataParent=val
            console.log(val)
            this.getCha(val);
        }
    },
  }
</script>
<style <style lang="less">
.ivu-table-cell{
      padding-left: 0 !important;
      padding-right:0 !important;

    }
</style>

