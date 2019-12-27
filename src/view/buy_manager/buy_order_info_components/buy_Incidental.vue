<template>
  <div>
  
      <row style='margin-bottom:20px;'>
           <Table size="small" :columns="columns1" :data="data1"></Table>
      </row>
     <row>
          <Button  style="margin-right:10px" type="primary" @click="addNew">新增杂费</Button>
          <Button   type="primary" @click="getCha">刷新</Button>

     </row>
      
      <!-- 杂费对话框 -->
    <Modal
        v-model="modal1" width="1200" :mask-closable='false' :footer-hide='true'
        :title="modalTitle">
        <span>合同金额<span style="color:red;font-size:16px">{{this.$global.isMoneyShow(orderItem.money)}}</span>元</span>
        <span style="margin-left:10px">合同重量<span style="color:red;font-size:16px">{{this.$global.accPrecision(orderItem.weight,3)}}</span>吨</span>
        <span style="margin-left:10px">实提金额<span style="color:red;font-size:16px">{{this.$global.isMoneyShow(orderItem.actualMoney)}}</span>元</span>
        <span style="margin-left:10px">实提重量<span style="color:red;font-size:16px">{{this.$global.accPrecision(orderItem.actualWeight,3)}}</span>吨</span>
        <span style="margin-left:10px">是否计算:</span>
        <Select   style='width:200px;' size="small"  v-model="isCal" filterable :label-in-value='true' >
                    <Option v-for="(option, index) in isCalList" :value="option.value" :key="index">{{option.label}}</Option>
                </Select>
        <br>
         <Form ref="formValidate" :rules="ruleValidate" :label-width="120" inline :model="addForm">
        <row>

         <FormItem label="杂费名称:" prop="name" >
           <i-input   style="width:200px" v-model="addForm.name" placeholder="请输入杂费名称"/>
         </FormItem>

        <FormItem label="杂费金额:"  prop="money" >
           <i-input @on-change=""   style="width:200px" v-model="addForm.money" placeholder="请输入杂费金额"/>
         </FormItem>
          <FormItem label="杂费重量:"  >
           <i-input   style="width:200px" v-model="addForm.weight" placeholder="请输入杂费重量"/>
         </FormItem>
         <FormItem label="杂费单价:" >
           <i-input   style="width:200px" v-model="addForm.unit_price" placeholder="请输入杂费单价"/>
         </FormItem>
        <FormItem label='公司名称' prop="orgId">
                <Select clearable style='width:200px'  v-model="addForm.orgId" filterable :label-in-value='true' @on-change='getUserTwo'>
                    <Option v-for="(option, index) in companyZu" :value="option.orgid" :key="index">{{option.cusorgName}}</Option>
                </Select>
        </FormItem>
        <FormItem prop="type" label='是否需要收票与打款'>
                <Select clearable style='width:200px'  v-model="addForm.type" filterable :label-in-value='true'>
                    <Option v-for="(option, index) in OMPayInvoiceType" :value="option.value" :key="index">{{option.label}}</Option>
                </Select>
        </FormItem>
        <FormItem label='计价方式' prop="jizhong_type">
                <Select clearable style='width:200px'  v-model="addForm.jizhong_type" filterable :label-in-value='true' >
                    <Option v-for="(option, index) in OMTypeList" :value="option.value" :key="index">{{option.label}}</Option>
                </Select>
        </FormItem>
        <FormItem label='税率'>
                <Select clearable style='width:200px'  v-model="addForm.tax_rate" filterable :label-in-value='true' >
                    <Option v-for="(option, index) in OMTaxRateList" :value="option.value" :key="index">{{option.label}}</Option>
                </Select>
        </FormItem>
        <FormItem label="备注:" prop="shuomm">
            <i-input style="width:200px" type="textarea" :rows="3" v-model="addForm.note" placeholder="请输入备注" />
        </FormItem>
        <FormItem label="解释:" prop="shuomm">
            <i-input style="width:200px" type="textarea" :rows="3" v-model="addForm.explanation" placeholder="请输入解释" />
        </FormItem>
        <FormItem label="需要收票的金额:" >
           <i-input   style="width:200px" v-model="addForm.apply_money" placeholder="请输入需要收票的金额"/>
         </FormItem>
         <FormItem label="需要收票的重量:" >
           <i-input   style="width:200px" v-model="addForm.apply_weight" placeholder="请输入需要收票的重量"/>
         </FormItem>
        </row>
       <!-- 添加  取消按钮 -->
        <row>
            <Button v-show="addBtn" style="margin-right:10px"   type="primary"  @click='getAdd'>添加</Button>
            <Button v-show="updateBtn" style="margin-right:10px"   type="primary"  @click='updateAction'>修改</Button>

            <Button   type="primary" @click="modal1 = false" >取消</Button>
        </row>

      </Form>
          <p style="visibility: hidden;">{{totalZongoing}}</p>
       
    </Modal>



  </div>
</template>

<script>
import {getZha,getAddFei,getShan} from '@/api/cusData'//查询杂费
import {findOrgList,updateBuy} from '@/api/data'
import {OMTypeList,OMTaxRateList,OMPayInvoiceType} from '@/libs/global_type'
import {OMPayInvoiceTypeStr,OMTypeListStr,OMTaxRateListStr,OMstatusStr} from '@/libs/allStatus'
  export default {
    name: 'buy_Incidental',
    props: ["allOrder_orderItem"],
    data(){
      return {
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
        data1: [  
                ],
                OMPayInvoiceType:OMPayInvoiceType,
          OMTypeList:OMTypeList,
          OMTaxRateList:OMTaxRateList,
          dataParent:'',//绑定父组件传过来的值
          modal1:false,//杂费对话框
          orderItem:{
            money:0,
            weight:0,
            actualMoney:0,
            actualWeight:0
          },
          addForm:{
              name:"",//杂费名称
              money:'',//杂费金额
              weight:"",//说明
              unit_price:"",//单价
              orgName:'',
              orgId:'',
              jizhong_type:'',
              tax_rate:'',//
              note:'',//
              explanation:'',//
              apply_money:'',//
              apply_weight:'',//
              type:1,

          },//杂费表单弹窗
          ruleValidate:{ 
             type: [
                        { required: true, message: '请选择打款类型', trigger: 'blur' }
                    ],
          name: [
                        { required: true, message: '请输入杂费名称', trigger: 'blur' }
                    ],
            money: [
                        { required: true, message: '请输入杂费金额', trigger: 'blur' }
                    ],
            jizhong_type: [
                        { required: true, message: '请选择杂费计价方式', trigger: 'blur' }
                    ],
             orgId: [
                        { required: true, message: '请选择公司', trigger: 'blur' }
                    ],
      },
          conmpanyOne:"",//公司名称
          companyZu:[],//贮存公司名称
        companyTwo:'',
        companyId:'',
        addBtn:true,
        updateItem:{},
        updateBtn:false,
        modalTitle:"新增杂费",
          columns1: [
                    {
                        title: 'Id',
                        key: 'id',
                        width:'60'
                    },
                    {
                        title: '杂费名称',
                        key: 'name',
                        width:'100'
                    },
                    {
                        title: '杂费金额',
                        key: 'money',
                        width:'100',
                         render:(h,params) =>{
                          return  h('div',{

                          },this.$global.isMoneyShow(params.row.money))
                        }
                    },
                    {
                        title: '重量',
                        key: 'weight',
                        width:'100'
                    },
                    {
                        title: '单价',
                        key: 'unitPrice',
                        width:'100',
                    },
                    {
                        title: '类型',
                        key: 'type',
                        width:'100',
                        render:(h,params) =>{
                          return  h('div',{

                          },OMPayInvoiceTypeStr(params.row.type))
                        }
                    },
                    {
                        title: '计价方式',
                        key: 'jizhongType',
                        width:'100',
                        render:(h,params) =>{
                          return  h('div',{

                          },OMTypeListStr(params.row.jizhongType))
                        }
                    },
                    {
                        title: '税率',
                        key: 'taxRate',
                        width:'100',
                        render:(h,params) =>{
                          return  h('div',{

                          },OMTaxRateListStr(params.row.taxRate))
                        }
                    },
                     {
                        title: '说明',
                        key: 'note',
                        width:'100',
                    },
                    {
                        title: '解释',
                        key: 'explanation',
                        width:'100',

                    },
                     {
                        title: '公司名称',
                        key: 'orgName',
                        width:'100',

                    },
                     {
                        title: '状态',
                        key: 'status',
                        width:'100',
                        render:(h,params) =>{
                          return  h('div',{

                          },OMstatusStr(params.row.status))
                        }

                    },
                     {
                        title: '创建时间',
                        key: 'createTiime',
                        width:'100',

                    },
                     {
                        title: '创建人名称',
                        key: 'userName',
                        width:'100',

                    },
                     {
                        title: '订单号',
                        key: 'orderNo',
                        width:'100',
                    },
                    {
                      key:'operate',
                      title:'操作',
                      width:'150px',
                      fixed:"right",
                      align:'center',
                      render:(h,params)=>{
                        return h('div',[
                          h('Button',{
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
      }
    },
    methods:{
      addNew(){
          this.modalTitle = "新增杂费"
        this.modal1 = true
        this.addBtn = true;
        this.updateBtn = false;
      },
      setModalItem(item){//编辑赋值
          this.modalTitle = "编辑杂费"
        this.modal1 = true
        this.addBtn = false;
        this.updateBtn = true;
        this.updateItem = item;
        //赋值
        this.addForm.name         = item.name
        this.addForm.money        = item.money
        this.addForm.note         = item.note
        this.addForm.orgName      = item.orgName
        this.addForm.orgId        = item.orgId
        this.addForm.type         = item.type
        this.addForm.explanation  = item.explanation
        this.addForm.weight       = item.weight
        this.addForm.apply_money  = item.applyMoney
        this.addForm.apply_weight = item.applyWeight
        this.addForm.jizhong_type = item.jizhongType
        this.addForm.tax_rate     = item.taxRate
        this.addForm.unit_price   = item.unitPrice

      },
       getCha(val){
            let param={};
             param.orderId   = this.dataParent.id;
             param.orderType = "1"
             param.status    = "1"
             param.pageSize  = "99999"
             getZha(param).then(res=>{
             if(res.code =="100"){
             this.data1=res.data.list
             this.getTotalMoney();

          }  
         })
       },
       getTotalMoney(){//获取杂费总计
       let tm = 0;
         this.data1.map(item=>{
            tm = this.$global.accAdd(tm,item.money)
         })
         let dic = {};
         dic.id = "合计"
         dic.name = ""
         dic.money = tm;
         dic.isTotal = true;
         this.data1.push(dic);
       },
       updateAction(){//修改
       let p ={};
       p.updateOtherMoneyBatch = [];
          let param             = {};
              param.name          = this.addForm.name             //杂费名称
              param.money         = this.addForm.money
              param.note          = this.addForm.note
              param.orgName       = this.addForm.orgName          //
              param.orgId         = this.addForm.orgId            //
              param.type          = this.addForm.type             //类型，判断是否需要收票与打款，1只打款 2 打款并需收票
              param.explanation   = this.addForm.explanation      //
              param.userId        = this.$global.adminInfo.id     //
              param.userName      = this.$global.adminInfo.cname  //
              param.weight        = this.addForm.weight           //
              param.applyMoney    = this.addForm.apply_money      //
              param.applyWeight   = this.addForm.apply_weight     //
              param.jizhongType   = this.addForm.jizhong_type     //计重的方式1：按单 2：按吨位；计价方式       //
              param.taxRate       = this.addForm.tax_rate         //
              param.unitPrice     = this.addForm.unit_price  //
              param.id = this.updateItem.id;
          p.updateOtherMoneyBatch.push(param);
          getShan(p).then(res=>{
            if(res.code =="100"){
             this.$Message.success("修改成功")
             this.modal1 =false;
             this.getCha();
             this.getTotal();
          }  
         })
       },
       getTotal(){//无论添加成功还是删除成功都需要调用
       let p         = {};
           p.orderId = this.dataParent.id;
          updateBuy(p).then(res =>{
          })
       },
       //添加杂费
       getAdd(){
         console.log(this.addForm.type);
         this.$refs.formValidate.validate(valid=>{
           if(valid){
             
           }else{
              this.$Message.error('请填写完成，*必须填写!');
              return false;
           }
         })
          let param             = {};
              param.name          = this.addForm.name             //杂费名称
              param.money         = this.addForm.money
              param.note          = this.addForm.note
              param.orgName       = this.addForm.orgName          //
              param.orgId         = this.addForm.orgId            //
              param.status        = '1'
              param.type          = this.addForm.type             //类型，判断是否需要收票与打款，1只打款 2 打款并需收票
              param.explanation   = this.addForm.explanation      //
              param.userId        = this.$global.adminInfo.id     //
              param.userName      = this.$global.adminInfo.cname  //
              param.orderId       = this.dataParent.id            //
              param.orderType     = "1"                           //1采购订单 2销售订单
              param.orderNo       = this.dataParent.ordersNo      //
              param.weight        = this.addForm.weight           //
              param.applyMoney    = this.addForm.apply_money      //
              param.applyWeight   = this.addForm.apply_weight     //
              param.jizhongType   = this.addForm.jizhong_type     //计重的方式1：按单 2：按吨位；计价方式       //
              param.taxRate       = this.addForm.tax_rate         //
              param.paymentStatus = '0'                           //
              param.paymentMoney  = 0                        //
              param.paymentWeight = 0                        //
              param.unitPrice     = this.addForm.unit_price  //

          getAddFei(param).then(res=>{
            if(res.code =="100"){
             this.$Message.success("添加成功")
             this.modal1 =false;
             this.getCha();
             this.getTotal();
          }  
         })
        
       },
       //获取公司选中
       getUserTwo(item){
            this.addForm.orgName = item.label;
            this.addForm.orgId = item.value;
      },
       //公司名称请求数据
       getCompany(){
          let param={};
         param.orgName='' //name
         param.pageSize='999999' //分页
         param.status = 1 ;
         findOrgList(param).then(res=>{
            if(res.code =="100"){
              this.companyZu=res.data.list
          }  
         })
       },
       //删除表格
       remove(index){
          this.$Modal.confirm({
                         title:"确定需要删除吗",
                         onOk:()=>{
                                //删除的id index getShan
                              let param={};
                              param.id=index
                              param.status='0'
                              getShan(param).then(res=>{
                                  if(res.code =="100"){
                                  this.$Message.success("删除成功")

                                  this.getCha();
                                  console.log('我成功了删除了')
                                }  
                              })
                         }
                       })
         
       },

    },
    mounted(){
      this.getCompany();
    },
    computed:{ //计算总金额和总重量
        totalZongoing(){
            if(Number(this.isCal) == 1&&this.addForm.unit_price && this.addForm.weight){
              this.addForm.money = this.$global.accMul(this.addForm.unit_price,this.addForm.weight)
              this.addForm.money = this.$global.accPrecision(this.addForm.money,2)
            }else{
            }
            this.addForm.apply_money = this.addForm.money;//需要收票的金额 = 杂费金额
            this.addForm.apply_weight = this.addForm.weight;//需要收票的重量 = 杂费重量:
            
            console.log("计算成功:"+this.isCal)

            return  this.addForm.apply_money
        }
    },
    watch: {
        allOrder_orderItem(val){
            console.log("watch 监听测试");
            console.log(val.ordersNo);
            console.log(val);
        //给合同金额等值赋值
          this.orderItem.money        = val.moneyAll
          this.orderItem.weight       = val.zhongliangAll
          this.orderItem.actualMoney  = val.deliveryTotalMoneyCus
          this.orderItem.actualWeight = val.deliveryTotalWeight

          //     orderItem:{
          //   money:0,
          //   weight:0,
          //   actualMoney:0,
          //   actualWeight:0
          // },
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

