<!--
 * @Description: 采购单线上付款列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-09 15:10:51
 -->

<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" :label-width="80">
        <Row>
          <Col span="5">
          <FormItem label="公司名称:" style="margin-right:10px;">
          <Input  placeholder="请输入公司名称" v-model="formItem.companyName"></Input>
          </FormItem>
          </Col>
        
          <Col span="10">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
        </Row>
        <Table  @on-selection-change="selectAllSelection" border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
     </Form>
     </Card>    
      <!-- 制单付款-银行退汇 -->
     <Modal
        title="银行退汇-申请重新付款"
        v-model="modal"
        footer-hide 
        :mask-closable="false"  width='700px;' >
        <Form :label-width="200"  :model="changeformItem" >
            <FormItem label="公司:" >
           <i-input   style="width:280px" v-model="changeformItem.companyName" placeholder="请输入公司"/>
         </FormItem>
            <FormItem label="退款开户行:" prop="openBank">
              <Select  v-model="changeformItem.openBank" :label-in-value='true' filterable style='width:280px;' @on-change='getChange'>
                <Option v-for="(item,index) in changeformItem.bankAdd" :value="item.bankAbbreviation" :key="index">{{ item.bankAbbreviation}}</Option>
            </Select>
         </FormItem>
          <FormItem label="退款银行所在地区:" prop="valueOne" >
             <Cascader :data="dataOne1" v-model="changeformItem.valueOne" @on-change='getCityOne' style='width:280px'></Cascader>
         </FormItem>
        <FormItem label='退款银行开户网点名称:' prop="bankDot">
            <Select :label-in-value="true" placeholder="请选择退款银行开户网点" v-model="changeformItem.bankDot" filterable style='width:280px;' @on-change='getChangeDot'>
                <Option v-for="(item,index) in bankDotList" :value="JSON.stringify(item)" :key="index">{{ item.branchFullName}}</Option>
            </Select>
            <Tag color="default">{{changeformItem.bankDot_placeholder}}</Tag>
        </FormItem>
        <!-- 退款银行三级查找结束 -->
        <FormItem label="退款银行账号:" >
           <i-input   style="width:280px" v-model="changeformItem.tkAccBankCode" placeholder="请输入退款银行账号"/>
        </FormItem>
            
          </Form>
          <div class="margin-top-20">
    <Button style="margin-right:10px"  type="primary" @click="changeItem">确认提交</Button>
    <Button  type="default" @click="modalCancel">取消</Button>
</div>
    </Modal>
    <!-- 增加客户弹窗 -->

     </div>
</template>

<script>
import {
  findDaoZhangDanAllSH,deleteDaoZhangDanSH,findBankLineByBankCode
  } from '@/api/data'
import {companyCardTypeList} from '@/libs/global_type'
import {getDaozhangdanStatus} from '@/libs/allStatus'
import {
        getOpeningBank,
        getBankDot
    } from '@/api/cusData' //客户列表
import city from '@/api/city_houtai'
import jsonp from 'jsonp'

export default {
    name: 'daozhangdanSH_backList',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        //弹出框使用的数据
        modal:false,
        //弹出框使用的数据结束
        tableItem:{},
        selectionsList:[],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        companyCardTypeListThis:companyCardTypeList,
        changeformItem:{
          companyName:'',
          openBank:'',
          valueOne:[],
          bankDot:'',
          bankDot_placeholder:'',
          tkAccBankCode:'',
          returnBankItem:{},
          prefectureLevel:'',
          bankCode:"",
          bank:"",
          bankNumber:"",
          dealMoney:'',
          bankNo:''
        },
         bankString:'',
          Provinces:'',
          city:'',
          cityStringOne:'',
          bankDotList:[],
          dataOne1:city,
        formItem: {
          companyName:'',
          orderNo:'',
          payMony:'',
          dikouMoney:'',
          cardType:"",
          totalMoney:'',
          totalNum:'',
          },
          columns4: [
                    {
                        title: 'ID',
                        key: 'daozhangdanId',
                        align: 'center',
                        width:'100'
                    },
                     
                     {
                        title: '客户名称',
                        key: 'creditedCompany',
                        align: 'center',
                        width:'250'
                    },
                     {
                        title: '到账金额 (元)',
                        key: 'payMoney',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.payMoney))
                        }
                    },
                    {
                        title: '剩余可用到账金额 (元)',
                        key: 'dealMoney',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dealMoney))
                        }
                    },
                     {
                        title: '客户银行账号',
                        key: 'bankNo',
                        align: 'center',
                        width:'200',
                    },
                     {
                        title: '收款账号',
                        key: 'jgBankNo',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },params.row.jgBankNo)
                        }
                    },
                     {
                        title: '到账时间',
                        key: 'dealTime',
                        align: 'center',
                        width:'250'
                    },
                    {
                        title: '客户开户行名',
                        key: 'bank',
                        align: 'center',
                        width:'250'
                    },
                     {
                        title: '摘要',
                        key: 'zhaiyao',
                        align: 'center',
                        width:'250'
                    },
                    {
                        title: '状态',
                        key: 'daozhangdanStatus',
                        align: 'center',
                        width:'160',
                        render:(h,params) =>{
                          return h('div',{
                          },getDaozhangdanStatus(params.row.daozhangdanStatus))
                        }
                    },
                    {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'350',
                        fixed:'right',
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
                                              this.changeStatus(params.row,1);
                                        }
                                    }
                                }, '错打款项提交'),
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
                                              this.changeStatus(params.row,2);

                                        }
                                    }
                                }, '银行退汇提交'),
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
                                              this.changeStatus(params.row,3);
                                        }
                                    }
                                }, '关闭'),
                             ]);
                    }
                        
                    },
                    
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      changeStatus(item,type){
          this.tableItem = item;
          let status = '0';
          let stra = '修改成功'
          let strb = '确定需要修改吗'
          console.log(type)
          switch (type.toString()) {
            case "1"://错打款项提交
              status = "4"
              this.tableItem.dStatus = "44"
              this.modal = true;
              this.setItemInfo(item);
              break;
             case "2"://银行退汇
              status = "5"
              this.modal = true;
              this.tableItem.dStatus = "54"
              this.setItemInfo(item);
              break;
             case "3"://关闭
              status = "99"
              this.tableItem.dStatus = "99"
              this.deleteDaoZhangDanItem(item)
              break;
            default:
              break;
          }
          console.log(strb)
        
      },
      changeItem(){//银行退汇提交保存制单
      console.log("提交成")
      console.log(this.changeformItem.returnBankItem.bankCode)
      if(this.changeformItem.returnBankItem.bankCode==undefined){
        this.$Message.warning('请选择退款银行!');

      }else{
                  let param = {};
            //       bankNo: 1702920809100027077
                            param.bankNo = this.tableItem.bankNo;
            // dealMoney: 5.00
                            param.dealMoney = this.$global.accPrecision(this.tableItem.dealMoney,2);
                            // param.dealMoney = this.tableItem.dealMoney;
                              
            // creditedCompany: 河南灿辉商贸有限公司
                            param.creditedCompany = this.tableItem.creditedCompany;
            // prefectureLevel: 郑州市
                            param.prefectureLevel = this.changeformItem.returnBankItem.prefectureLevel;
            // bankCode: 102491002907
                            param.bankCode = this.changeformItem.returnBankItem.bankCode;
            // bank: 中国工商银行河南省分行营业部
                            param.bank = this.changeformItem.returnBankItem.branchFullName;
            // bankNumber: AAA
                            param.bankNumber = this.changeformItem.returnBankItem.banksuoxie;
            // yongtu: 货款
            // memo: 货款
            // payType: 40000
                        param.yongtu  = "退款";
                        param.memo    = "退款";
                        param.payType = "40000"
                        let url = 'http://10.100.16.5:8080/niubee/orders/daozhangdanZhidan'
                        
                        this.$http.jsonp(url,{params:param,jsonp:'callback',jsonpCallback:'successCallback'})
                        .then(function(res){
                          console.log("请求成功");
                          if(res.body =="100"){
                            this.$Notice.success({
                              title:'提交制单成功',
                                duration:1,
                            })
                            this.updataStats();
                          }else{
                              this.$Notice.error({
                                                            title:'提交制单失败'
                                                        })
                          }
                          console.log(res);
                        },function(res){
                          this.$Notice.error({
                                                            title:'提交制单失败,请联系管理员'
                                                        })
                        })
        }
      },
      updataStats(){//修改到账单状态
   let param                   = {};
       param.userId            = this.$global.adminInfo.id
       param.daozhangdanId     = this.tableItem.daozhangdanId
       param.daozhangdanStatus = this.tableItem.dStatus
       param.note              = ""
                                                deleteDaoZhangDanSH(param).then(res=>{
                                                        if(res.code =="100"){
                                                          this.$Notice.success({
                                                            title:'修改到账单状态成功',
                                                            duration:1
                                                             
                                                          })
                                                        }else{
                                                          this.$Notice.error({
                                                            title:'修改到账单状态失败'
                                                          })
                                                        }
                                               })
      },
      deleteDaoZhangDanItem(item){
         this.$Modal.confirm({
                                           title:'确定需要删除吗',
                                           onOk:()=>{
                                               let param                   = {};
                                                   param.userId            = this.$global.adminInfo.id
                                                   param.daozhangdanId     = item.daozhangdanId
                                                   param.daozhangdanStatus = '99'
                                                   param.note              = ""
                                                deleteDaoZhangDanSH(param).then(res=>{
                                                        if(res.code =="100"){
                                                          this.$Notice.success({
                                                            title:'删除成功',
                                                            duration:1,
                                                             onClose:res =>{
                                                                  console.log('关闭时回调')
                                                                  this.reload();
                                                              }
                                                          })
                                                        }else{
                                                          this.$Notice.error({
                                                            title:'修改失败'
                                                          })
                                                        }
                                               })

                                           }
                                         })
      },
      selectAllSelection(data){//全选变化
      },
      payList(){//批量付款
        this.modal = true;
        //计算选中的总计金额
      },
      setItemInfo(row){//给弹出框赋值
          this.changeformItem.tkAccBankCode = row.bankNo
          this.changeformItem.dealMoney = row.dealMoney
          this.changeformItem.companyName = row.creditedCompany
          this.changeformItem.bankDot_placeholder = row.bank
          let p  ={}
          p.bankCode = row.bankCode
          findBankLineByBankCode(p).then(res =>{
             if(res.code =='100'){
               if(res.data.length>0){
                 this.changeformItem.returnBankItem = res.data[0];

               }else{
               }
                
             }else{
                 this.$Notice.error({
                     title:'获取银行支行信息失败，请联系管理员添加'
                 })
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
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.pageNum=this.pagesizea //分页
         param.tranType = "1";
         param.daozhangdanStatusIN = "4,44,5,55"
         param.creditedCompany = this.formItem.companyName;
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){

         findDaoZhangDanAllSH(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
       },
       //直接获取银行开户行数据
            getBan(param) {
                //let param4={bankName:"123"},//开户行参数
                console.log(param);
                let param1 = {
                    "pageSize": "9999"
                }
                getOpeningBank(param1).then(res => {
                    if (res.code == "100") {
                        this.changeformItem.bankAdd = res.data;
                    }
                })
            },
            //选中开户行确定的数据
            getChange(item) {
                this.bankString = item.value;
                this.getBankDotName();
            },
            //选中开户网点的名字
            getChangeDot(item) {
                const stingR=eval('(' + item.value + ')')
                this.changeformItem.returnBankItem = stingR;
                this.changeformItem.bankDot_placeholder = stingR.branchFullName;

            },
            //获取开户网点的数据
            getBankDotName() {
                if (this.Provinces == '' && this.city == '') return false
                const paramB = {};
                paramB.bankAbbreviation = this.bankString //银行名称
                paramB.bankBranchLineCity = this.Provinces //省
                paramB.prefectureLevel = this.city //市
                paramB.pageSize ="99999999"
                getBankDot(paramB).then(res => {
                    if (res.code == "100") {
                        this.bankDotList = res.data.list;
                    }
                })

            }, //银行所在地区
            getCityOne(value, selectedData) {
                this.Provinces = selectedData[0].label
                this.city = selectedData[1].label
                if (selectedData.length == '2') {
                    this.cityStringOne = selectedData[0].label + ',' + selectedData[1].label
                } else {
                    this.cityStringOne = selectedData[0].label + ',' + selectedData[1].label + ',' + selectedData[2].label
                }
                this.getBankDotName();
            }
    },
    
    mounted(){
     this.searchM();
       this.getBan(); //开户行数据
      //  this.getBankDotName();//开户网点数据
    },
    
    created(){
   
    },
}

</script>
