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
          <!-- <FormItem label="公司名称:" style="margin-right:10px;">
          <Input  placeholder="请输入公司名称" v-model="formItem.companyName"></Input>
          </FormItem> -->
          </Col>
        
          <Col span="10">
             <Button type='primary' icon="ios-search" @click='payList()'>批量付款</Button>

             <!-- <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button> -->
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
              <p>总金额(元)：{{formItem.totalMoney}}</p>
              <p>总件数：{{formItem.totalNum}}</p>

          </Col>
        </Row>
        <Table @on-selection-change="selectAllSelection" border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
     </Form>
     </Card>    
      <!-- 选择付款账号 -->
     <Modal
        title="选择付款账号"
        v-model="modal"
        footer-hide 
        :mask-closable="false"  width='700px;' >
        <Form :label-width="140"  :model="formItem">
            <FormItem label="选中金额为（元）：" prop="name">
              <p style="color:red">{{formItem.totalMoney}}</p>
            </FormItem>
            <FormItem label="选中条数：" prop="name">
              <p style="color:red">{{formItem.totalNum}}</p>
            </FormItem>
         <FormItem label='选择付款银行账号：'>
           <Select @on-change="selectChange" v-model="formItem.cardType"  style="width:400px"  placeholder="请选择"   >
               <Option v-for="(item,index) in companyCardTypeListThis "  :value="item.value"  :key="index" >{{ item.label }}</Option>
            </Select>
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
  findJgJieSuanInfo,
  updateShopMoneyJieSuanMer,
  addCashFlow //添加流水
  } from '@/api/data'
import {companyCardTypeList} from '@/libs/global_type'
import {zhidan_fujian} from '@/api/data_4_8080'
import {zhidan_shanghai} from '@/api/data_5_8080'

export default {
    name: 'buy_order_payment_list',
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
        jgBankName:"福建兴业银行",
        jgBankCode:'',
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
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: 'ID',
                        key: 'jgJieSuanId',
                        align: 'center',
                        width:'60'
                    },
                     {
                        title: '供应商名称',
                        key: 'merchantsName',
                        align: 'center',
                        width:'250'
                    },
                     {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'250'
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
                                               const route = {
                                                  name: 'order_buy_info',
                                                  query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                            }
                          },params.row.orderNo);
                        }
                    },
                     {
                        title: '申请金额(元)',
                        key: 'jgJieSuanMoney',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.jgJieSuanMoney))
                        }
                        
                    },
                      {
                        title: '申请抵扣金额 (元)',
                        key: 'updateDiKou',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.updateDiKou))
                        }
                    },
                     {
                        title: '申请时间',
                        key: 'createTime',
                        align: 'center',
                        width:'250'
                    },
                     {
                        title: '管理员',
                        key: 'userName',
                        align: 'center',
                        width:'250'
                    },
                    
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      selectChange(item){
        console.log(item);
        if(item  == "1"){
            this.jgBankName =  this.companyCardTypeListThis[0].bankNo;
            this.jgBankCode = this.companyCardTypeListThis[0].bankCode
        }else if(item  == "2"){
           this.jgBankName =  this.companyCardTypeListThis[1].bankNo;
            this.jgBankCode = this.companyCardTypeListThis[1].bankCode
        }
      },
      selectAllSelection(data){//全选变化
        console.log(data);
        this.selectionsList  =data;
        let tm = 0;
        //全选有变化时赋值
        for(var i in data){
          let dic = data[i];
          tm = this.$global.accAdd(tm,dic.jgJieSuanMoney)
        }
        this.formItem.totalMoney = this.$global.isMoneyShow(tm);
        console.log( this.formItem.totalMoney)
        this.formItem.totalNum = data.length; 
      },
      payList(){//批量付款
        this.modal = true;
        //计算选中的总计金额
      },
      setItemInfo(row){//给弹出框赋值
          this.formItem.orderNo = row.orderNo
          this.formItem.payMony = parseFloat(row.jgJieSuanMoney)
          this.formItem.dikouMoney= parseFloat(row.updateDiKou)
      },
      changeItem(){//TODO:
          this.addMoneyFlow();
          return false;
          console.log(this.formItem.cardType);
          if(this.formItem.cardType == "1"){//福建兴业
            this.fujian_zhidan();
          }else if(this.formItem.cardType =="2"){//上海兴业
            this.shanghai_zhidan();
          }else{
             this.$Notice.warning({
                       title   : '请选择一张银行卡',
                       duration: 1
             })
          }
      },
      addMoneyFlow(){//添加到金钱流水表中 TODO:
          let plist = [];
          this.selectionsList.map((item)=>{
            console.log(item.jgJieSuanId);
            let dic  = {};
                  dic.orgName       = item.merchantsName
                  dic.orgId         = item.merchantsId;
                  dic.orgBankName   = item.bankZhiHang
                  dic.orgBankCode   = item.bankNo
                  dic.jgBankName    = this.jgBankName
                  dic.jgBankCode    = this.jgBankCode
                  dic.userId        = this.$global.adminInfo.id
                  dic.userName      = this.$global.adminInfo.cname
                  dic.orderId       = item.orderId
                  dic.orderNo       = item.orderNo
                  dic.orgDeptName   = ""                            //TODO:需要在添加订单时记录信息             
                  dic.orgDeptDealer = ""                            //TODO:需要在添加订单时记录信息               
                  dic.money         = item.jgJieSuanMoney
                  dic.type          = "2"
                  dic.jgBankType    = this.formItem.cardType
                  dic.note          = "制单付款"
                  dic.daozhangdanId = ""
                  dic.jiesuanId     = item.jgJieSuanId
            plist.push(dic);
          })
          let p = {};
          p.pageCashFlowLists = plist;
          addCashFlow(p).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                      title:'记录出账流水成功',
                      duration:1,
                      onClose:res =>{
                   }
                 })
             }else{
                 this.$Notice.error({
                     title:'记录出账流水成功失败'
                 })
             }
          })
      },
      fujian_zhidan(){//福建制单接口
      let param = {};
        //处理数据
        let jgJieSuanIds      = ''
        let orderIdString     = ''
        let orderNoString     = ''
        let payTypeString     = ''
        let payUserIdString   = ''
        let payUserNameString = ''
        for(var i  in this.selectionsList){
          let dic = this.selectionsList[i];
          dic.payType       = "10000";
          dic.guserId       = this.$global.adminInfo.id;
          dic.guserName     = this.$global.adminInfo.cname
          jgJieSuanIds      = (jgJieSuanIds=='')?dic.jgJieSuanId :jgJieSuanIds+','+dic.jgJieSuanId
          orderIdString     = (orderIdString=='')?dic.orderId :orderIdString+','+dic.orderId
          orderNoString     = (orderNoString=='')?dic.orderNo :orderNoString+','+dic.orderNo
          payTypeString     = (payTypeString=='')?dic.payType :payTypeString+','+dic.payType
          payUserIdString   = (payUserIdString=='')?dic.guserId :payUserIdString+','+dic.guserId
          payUserNameString = (payUserNameString=='')?dic.guserName :payUserNameString+','+dic.guserName

        }
        param.jgJieSuanIds      = jgJieSuanIds;
        param.orderIdString     = orderIdString;
        param.orderIds          = orderIdString;
        param.orderNoString     = orderNoString;
        param.payTypeString     = payTypeString;
        param.payUserIdString   = payUserIdString;
        param.payUserNameString = payUserNameString;
        param.userId            = this.$global.adminInfo.id;

        let url = 'http://10.100.16.4:8080/jg/orders/zhidan'
         this.$http.jsonp(url,{params:param,jsonp:'callback',jsonpCallback:'successCallback'})
                        .then(function(res){
                          console.log("请求成功");
                          if(res.body =="100"){
                            this.$Notice.success({
                              title:'提交制单成功',
                                duration:1,
                            })
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
      },
      shanghai_zhidan(){//上海制单接口
        let param = {};
        //处理数据
        let jgJieSuanIds      = ''
        let orderIdString     = ''
        let orderNoString     = ''
        let payTypeString     = ''
        let payUserIdString   = ''
        let payUserNameString = ''
        for(var i  in this.selectionsList){
          let dic = this.selectionsList[i];
          dic.payType = "10000";
          dic.guserId       = this.$global.adminInfo.id;
          dic.guserName     = this.$global.adminInfo.cname
          jgJieSuanIds      = (jgJieSuanIds=='')?dic.jgJieSuanId :jgJieSuanIds+','+dic.jgJieSuanId
          orderIdString     = (orderIdString=='')?dic.orderId :orderIdString+','+dic.orderId
          orderNoString     = (orderNoString=='')?dic.orderNo :orderNoString+','+dic.orderNo
          payTypeString     = (payTypeString=='')?dic.payType :payTypeString+','+dic.payType
          payUserIdString   = (payUserIdString=='')?dic.guserId :payUserIdString+','+dic.guserId
          payUserNameString = (payUserNameString=='')?dic.guserName :payUserNameString+','+dic.guserName

        }
        param.jgJieSuanIds      = jgJieSuanIds;
        param.orderIdString     = orderIdString;
        param.orderIds          = orderIdString;
        param.orderNoString     = orderNoString;
        param.payTypeString     = payTypeString;
        param.payUserIdString   = payUserIdString;
        param.payUserNameString = payUserNameString;
        param.userId            = this.$global.adminInfo.id;
          let url = 'http://10.100.16.5:8080/niubee/orders/zhidan'
         this.$http.jsonp(url,{params:param,jsonp:'callback',jsonpCallback:'successCallback'})
                        .then(function(res){
                          console.log("请求成功");
                          if(res.body =="100"){
                            this.$Notice.success({
                              title:'提交制单成功',
                                duration:1,
                            })
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
         param.jgJieSuanCaoZuoStatus = "1";
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
    
    mounted(){
     this.searchM();
    },
    
    created(){
   
    },
}

</script>
