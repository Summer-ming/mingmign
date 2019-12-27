<!--
 * @Description: 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-25 09:58:23
 -->
<!--
 * @Description: 订单申请付款
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 19:55:36
 -->




<template>
     <div>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
      <dl>
        <dt>采购单号：{{formItem.orderNo}}</dt>
        <dd>采购公司：{{formItem.cusOrgName}}</dd>
      </dl>
      <dl>
        <dt>供应商公司：{{formItem.shopOrgName}}</dt>
        <dd>采购员：{{formItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{formItem.money}}</dt>
      </dl>
        
    </row>
    <row>
        <b class="font_32">合同信息</b>
        <Table border ref="selection" :columns="columns" :data="data"  style='margin-bottom:10px;'>
        </Table>
    </row>
    <row>
      <Tabs value="name1">
        <TabPane label="杂费汇总合计" name="name1">
            <Table size="small" width="600" border :columns="columns1" :data="data1"  style='margin-bottom:10px;'>
            </Table>
        </TabPane>
        <TabPane label="已申请列表" name="name2">
             <Table size="small"  border :columns="columns2" :data="data2"  style='margin-bottom:10px;'>
            </Table>
        </TabPane>
      </Tabs>

    </row>
      <row>
        <Form :model="formItem" inline :label-width="100">
          <FormItem label="供应商店铺查询:">
            <Select v-model="shopO" style="width:200px" placeholder="请输入店铺名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="JSON.stringify(item)" :label="item.name" :key="index" >{{ item.name }}</Option>
      
            </Select>
          </FormItem>
          <FormItem label='本次付款金额'>
          <Input style='width:150px' v-model='formItem.payMoney' placeholder='请输入金额'/>
          </FormItem>
          <FormItem label='抵扣金额'>
          <Input style='width:150px' v-model='formItem.dikouMoney' placeholder='请输入抵扣金额'/>
          </FormItem>
          <FormItem label='备注'>
          <Input type="textarea" style='width:300px' v-model='formItem.note' placeholder='请输入备注'/>
          </FormItem>
        </Form>
      </row>
       <row>
      <Button style="margin-right:10px" type="primary" @click="addBtn" :disabled="isDisable"> 提交</Button>
      <Button type="primary" @click="deletBtn"> 删除</Button>
    </row>
     </div>
</template>

<script>
import {findOrdersInfoAll,
updateFukuanZhenghe,
findShop,
findJgJieSuanInfo} from '@/api/data'
import { mapMutations } from 'vuex'
import {getJiesuanStatus} from '@/libs/allStatus'

export default {
    name: 'order_pay_info',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        isDisable:false,
        shopItem:'',
        shopO:'',
      shopList:[],//店铺data
        data1:[],
        data2:[],
        columns1:[
                    {
                        title: '序号',
                        width:'80',
                        render: (h, params) => {
                            return h('span', params.index+1);
                        }
                    },
                    {
                        title: '杂费合计',
                        key: 'money',
                        align: 'center',
                        width:'120'
                    },
                    {
                        title: '公司名称',
                        key: 'orgName',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '条目合计',
                        key: 'name',
                        align: 'center',
                        width:'auto'
                    },
        ],
         columns2:[
                    {
                        title: '序号',
                        width:'80',
                        render: (h, params) => {
                            return h('span', params.index+1);
                        }
                    },
                    {
                        title: 'ID',
                        key: 'jgJieSuanId',
                        align: 'center',
                        width:'60'
                    },
                     {
                        title: '状态',
                        key: 'jgJieSuanStatus',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{
                          },getJiesuanStatus(params.row.jgJieSuanStatus))
                        }

                    },
                     {
                        title: '供应商名称',
                        key: 'merchantsName',
                        align: 'center',
                        width:'200'
                    },
                     {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'200'
                    },
                   
                     {
                        title: '订单号',
                        key: 'orderNo',
                        align: 'center',
                        width:'200',
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
        formItem:{
          payMoney:'',
          dikouMoney:'0',
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          note:''
        },
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        columns: [
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'120'
                    },
                    {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '提货方式',
                        key: 'steelWorks',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '交货地',
                        key: 'jiaohuodi',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '总重量',
                        key: 'zongzhongliang',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.zongzhongliang,3))
                        }
                    },
                     {
                        title: '单价',
                        key: 'guapaijia',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.guapaijia,2))
                        }
                    },
                    
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100'
                    },
                    //杂费1
                    {
                        title: '杂费1名称',
                        key: 'om1Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费1金额',
                        key: 'om1Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om1Money,2))
                        }
                    },
                    {
                        title: '杂费1公司',
                        key: 'om1OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费1公司id',
                        key: 'om1OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费2

                    {
                        title: '杂费2名称',
                        key: 'om2Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费2金额',
                        key: 'om2Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om2Money,2))
                        }
                    },
                    {
                        title: '杂费2公司',
                        key: 'om2OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费2公司id',
                        key: 'om2OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费3

                    {
                        title: '杂费3名称',
                        key: 'om3Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费3金额',
                        key: 'om3Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om3Money,2))
                        }
                    },
                    {
                        title: '杂费3公司',
                        key: 'om3OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费3公司id',
                        key: 'om3OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费4

                    {
                        title: '杂费4名称',
                        key: 'om4Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费4金额',
                        key: 'om4Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om4Money,2))
                        }
                    },
                    {
                        title: '杂费4公司',
                        key: 'om4OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费4公司id',
                        key: 'om4OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费5

                    {
                        title: '杂费5名称',
                        key: 'om5Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费5金额',
                        key: 'om5Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om5Money,2))
                        }
                    },
                    {
                        title: '杂费5公司',
                        key: 'om5OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费5公司id',
                        key: 'om5OrgId',
                        align: 'center',
                        width:'100'
                    },
                    //杂费6

                    {
                        title: '杂费6名称',
                        key: 'om6Name',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费6金额',
                        key: 'om6Money',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.om6Money,2))
                        }
                    },
                    {
                        title: '杂费6公司',
                        key: 'om6OrgName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '杂费6公司id',
                        key: 'om6OrgId',
                        align: 'center',
                        width:'100'
                    },
                    
                ],
                data: [
                ],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      ...mapMutations([
      'closeTag'
      ]),
      getOrgPayList(){//获取订单已付款列表
          let p ={};
          p.jgJieSuanOrderId = this.$route.query.id;
          findJgJieSuanInfo(p).then(res=>{
            if(res.code =="100"){
             this.data2=res.data.list
          }  
         })
      },
        //获取供应商选中的值
       getDian(item){
        console.log(item)
        //item= eval('(' + item + ')');
          const stingR=eval('(' + item.value + ')')
          this.shopItem = stingR
       },
      //查询店铺
       getShop(param){
         let  p  ={};
         p.status = 1;
         p.pageSize="999999"
          findShop(p).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
        setOrderInfo(){
          console.log(this.$route.query);
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName     
          this.formItem.payMoney              = 0;
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll) 
          this.getOrderInfo();
      },
       selectOne(row){
         console.log(row)
       },
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.orgName=this.formItem.companyName //name
         param.pageNum=this.pagesizea //分页
         param.status = 1 ;
         this.getSerch(param)
       },
        getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              this.data = res.data.list;
              this.getOTmoenyList();
            }else{
            }
          })
      },
      getOTmoenyList(){//获取杂费合计的列表
          let aList = [];
          //1：先将所有的杂费放在一个列表中
          this.data.map(item=>{
            if(Number(item.om1Money)>0){
              let dic = {};
              dic.name    = item.om1Name
              dic.money   = item.om1Money
              dic.orgName = item.om1OrgName
              dic.orgId   = item.om1OrgId
              aList.push(dic);
            }
            if(Number(item.om2Money)>0){
              let dic = {};
              dic.name    = item.om2Name
              dic.money   = item.om2Money
              dic.orgName = item.om2OrgName
              dic.orgId   = item.om2OrgId
              aList.push(dic);
            }
            if(Number(item.om3Money)>0){
              let dic = {};
              dic.name    = item.om3Name
              dic.money   = item.om3Money
              dic.orgName = item.om3OrgName
              dic.orgId   = item.om3OrgId
              aList.push(dic);
            }
            if(Number(item.om4Money)>0){
              let dic = {};
              dic.name    = item.om4Name
              dic.money   = item.om4Money
              dic.orgName = item.om4OrgName
              dic.orgId   = item.om4OrgId
              aList.push(dic);
            }
            if(Number(item.om5Money)>0){
              let dic = {};
              dic.name    = item.om5Name
              dic.money   = item.om5Money
              dic.orgName = item.om5OrgName
              dic.orgId   = item.om5OrgId
              aList.push(dic);
            }
            if(Number(item.om6Money)>0){
              let dic = {};
              dic.name    = item.om6Name
              dic.money   = item.om6Money
              dic.orgName = item.om6OrgName
              dic.orgId   = item.om6OrgId
              aList.push(dic);
            }
          })
          //步骤2 将获取的数组,取出来相同的公司
          let bList =  [];
          let cList = [];
          
          aList.map(item=>{
            if(bList.indexOf(item.orgName) ==-1){
              bList.push(item.orgName)
              let dic = {};
              dic.name    = ''
              dic.money   = 0
              dic.orgName = item.orgName
              dic.orgId   = item.orgId
              cList.push(dic);
            }
          })
          //步骤3：获取对应的字段
          for( var i=0; i<aList.length;i++ ){
            let itema = aList[i];
            for(var j in cList){
              let itemb = cList[j];
              if(itemb.orgName == itema.orgName){
                if(itemb.name !="" && itemb.name!=""){
                      itemb.name = itemb.name +',' +itemb.name;
                }
                      itemb.money = Number(itemb.money) +Number(itema.money)
              }
        
            }
          }

          console.log(bList);
          console.log(cList);

          this.data1 = cList;

      },
       remove(index){
         this.data.splice(index,1);
       },
       addBtn(){//提交按钮
         console.log("提交");
         console.log(this.shopItem);

         if(this.shopItem==''){
            this.$Notice.error({
                     title:'请选择店铺'
                 })
           return ;
         }
         let params ={};
            params.bankJgId                =  this.$route.query.bankJgId                    
            params.customerId              =  this.$route.query.customerId         
            params.id                      =  this.$route.query.id  
            if(this.formItem.dikouMoney == 0){
              params.jiesuanStatus           =  "1"
            }else{
              params.jiesuanStatus           =  "0" //需要抵扣变成0             
            }
            params.merchantsId             =  this.$route.query.merchantsId;           
            params.money                   =  this.formItem.payMoney //付款金额 
            params.updateDiKou             = this.formItem.dikouMoney //抵扣金额 
            params.note                    =  this.formItem.note
            params.operator                = this.$global.adminInfo.id         
            params.orderId                 = this.$route.query.id;      
            params.orderStatus             = "3"            
            params.statusNote              = "杂费付款"           
            params.userId                  = this.$global.adminInfo.id
            params.orderType              = "1" //1 采购单 2销售 
            //新增的字段   
            params.dikouMoney = this.formItem.dikouMoney
            params.actualPayMoney = Number(this.formItem.payMoney) - Number(this.formItem.dikouMoney)

            params.skOrgId       = this.shopItem.orgId
            params.skShopId      = this.shopItem.id
            params.skOrgAcountId = this.shopItem.accountId
            params.skOrgName     = this.shopItem.orgName
            params.dkOrgName     = this.$route.query.companyName;  //本公司的公司名称

            params.operatorType = "2"
            params.auditStatus = "8"
          
          updateFukuanZhenghe(params).then(res =>{
             if(res.code =='100'){
               this.isDisable=true;
                 this.$Notice.success({
                     title:'提交付款申请成功',
                     duration:1,
                     onClose:res =>{
                        console.log("关闭时回调")
                       this.closeSelf();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'提交付款申请失败'
                 })
             }
          })
       },
       deletBtn(){

       },
       closeSelf(){
         this.closeTag({
              name: 'order_om_pay_info',
              query:this.$route.query
          })
       }
    },
    
    mounted(){
     this.setOrderInfo();
      this.getShop();
      this.getOrgPayList();
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
</style>