<!--
 * @Description: 采购单工程汇总
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
              <FormItem label="客户公司名称:">
                <Select   style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
                  <Option v-for="(item,index) in orgList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
                </Select>
              </FormItem>
              <FormItem label="供应商公司名称:">
                <Select   style="width:200px" filterable placeholder="请选择名称"  @on-change='getDianShop'  :label-in-value='true'>
                  <Option v-for="(item,index) in orgList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
                </Select>
              </FormItem>
                <FormItem label="每页显示:">
                    <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
                      <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="角色类型:">
                    <Select @on-change="changeType" v-model="formItem.ttype"  style="width:200px"  placeholder="请选择"   >
                      <Option v-for="(item,index) in transactionTypeListThis" :value="item.value" :key="index" >{{ item.label }}</Option>
                    </Select>
                </FormItem>
          </Col>
        
          <Col span="24">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
        </Row>
          <!-- vxetable -->
          <vxe-table
              border
              ref="selection"
              size="mini"
              height="500"
              :customs.sync="customColumns"
              :data.sync="data1">
              <!-- //第一部分采购单相关信息 -->
              <vxe-table-column type="index" width="40"></vxe-table-column>
              <!-- 供应商公司名称 -->
                  <vxe-table-column   field="sellerCompanyName"   title="销售公司名称"  min-width='100'>
                          <template v-slot="{row,rowIndex}">
                            <span style='color:blue;cursor:pointer' @click='getT(row)'> {{row.sellerCompanyName}}</span>
                         </template>

                  </vxe-table-column>
                  <vxe-table-column  field="sellerEmpName"   title="销售管理员"  min-width='60'></vxe-table-column>
                  <vxe-table-column field="sellerCompanyId"   title="公司id"  min-width='60'></vxe-table-column>
            
              <!-- 客户公司 -->
                  <vxe-table-column   field="buyerCompanyName"   title="采购公司名称"  min-width='100'>
                         <template v-slot="{row,rowIndex}">
                            <span style='color:blue;cursor:pointer' @click='getTo(row)'> {{row.buyerCompanyName}}</span>
                         </template>
                  </vxe-table-column>
                  <vxe-table-column   field="buyerEmpName"   title="采购管理员"  min-width='60'></vxe-table-column>
                  <vxe-table-column   field="buyerCompanyId"   title="采购公司id"  min-width='60'></vxe-table-column>
              
              <!-- 供应商 -->
              <vxe-table-column  field="youxiaoMoneyCus"   title="客户账户有效余额"  :formatter="this.$global.vxeTableMoney" min-width='60'></vxe-table-column>
              <vxe-table-column  field="youxiaoMoneyShop"   title="供应商账户有效余额"  :formatter="this.$global.vxeTableMoney" min-width='60'></vxe-table-column>
              <vxe-table-column  field="fsMoney"   title="账户余额"  :formatter="this.$global.vxeTableMoney" min-width='60'></vxe-table-column>
              <vxe-table-column field="ysMoney"   title="待发货余额" :formatter="this.$global.vxeTableMoney"  min-width='60'></vxe-table-column>
              <vxe-table-column field="dkpMoneyCus"   title="待开票余额" :formatter="this.$global.vxeTableMoney"  min-width='60'></vxe-table-column>
              <vxe-table-column field="dkpMoneyShop"   title="待收票余额" :formatter="this.$global.vxeTableMoney"  min-width='60'></vxe-table-column>
              

            </vxe-table>
        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
        <!-- <p v-show="false">{{changeTType}}</p> -->
     </Form>
     </Card>    

     </div>
</template>

<script>
import {
  findBillFlowSum,
  findOrgCusAcc
} from '@/api/data'
import Utils from '@/api/middle'
import XEUtils from 'xe-utils'
import {lengthList,onlineBusinessListType,transactionTypeList} from '@/libs/global_type'

export default {
    name: 'online_listTotal',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        customColumns:[
          {
                  field: 'sellerCompanyName',
                  visible: false
                },
           {
                  field: 'sellerEmpName',
                  visible: false
                },
                {
                  field: 'sellerCompanyId',
                  visible: false
                },
                {
                   field: 'youxiaoMoneyShop',
                  visible: false
                },
                {
                   field: 'dkpMoneyShop',
                  visible: false
                },
                

        ],
        transactionTypeListThis:transactionTypeList,
        onlineBusinessListTypeThis:onlineBusinessListType,
        lengthListThis:lengthList,
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        orgList:[],
        formItem: {
          length:10,
          orderNo:'',
          cusOrgName:'',
          cusOrgId:'',
          shopOrgName:'',
          shopOrgId:'',
          dateTime:"",
          beginTime:'',
          endTime:'',
          type:'',
          ttype:'1'
          },
        data1: [],//表格展示的数据
                
      }
    },
    
    methods:{
      getT(row){
         sessionStorage.setItem('p','')
         sessionStorage.setItem('po','')
         sessionStorage.setItem('p','2')
         sessionStorage.setItem('po',JSON.stringify(row))
         const route = {
                         name: 'online_list',
                       }
        this.$router.push(route)

      },
      getTo(row){
         sessionStorage.setItem('p','')
         sessionStorage.setItem('po','')
         sessionStorage.setItem('p','1')
         sessionStorage.setItem('po',JSON.stringify(row))
         const route = {
                         name: 'online_list',
                       }
        this.$router.push(route)

      },
      changeType(item){

        if(item=="1"){//客户
            console.log("客户")
            this.customColumns.map(item=>{
              if(item.property == "sellerCompanyName"||item.property == "sellerEmpName"
              ||item.property == "sellerCompanyId"||item.property =="youxiaoMoneyShop"
              ||item.property =="dkpMoneyShop"
              )
              {
                item.visible = false;
              }
              if(item.property == "buyerCompanyName"||item.property == "buyerEmpName"
              ||item.property == "buyerCompanyId" ||item.property =="youxiaoMoneyCus"
              ||item.property =="dkpMoneyCus"
              )
              {
                item.visible = true;
              }
            })
              
            }else{//供应商
            console.log("供应商")
            this.customColumns.map(item=>{
              if(item.property == "sellerCompanyName"||item.property == "sellerEmpName"
              ||item.property == "sellerCompanyId" ||item.property =="youxiaoMoneyShop"
              ||item.property =="dkpMoneyShop"
              )
              {
                item.visible = true;
              }
              if(item.property == "buyerCompanyName"||item.property == "buyerEmpName"
              ||item.property == "buyerCompanyId" ||item.property =="youxiaoMoneyCus"
              ||item.property =="dkpMoneyCus"
              )
              {
                item.visible = false;
              }
            })
               
            }
            
      },
       changeCreateTieme(data){
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';
      },
      getOrgList(){
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.orgList=res.data.list
          }  
         })
       },
      getDian(item){
        this.formItem.cusOrgName = item.label;
        this.formItem.cusOrgId = item.value;
       },
       getDianShop(item){
        this.formItem.shopOrgName = item.label;
        this.formItem.shopOrgId = item.value;
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
        this.$refs.selection.refreshColumn();
        console.log(this.customColumns)
         //获取查询的input的值
         let p                 = {};
             p.pageNum         = this.pagesizea            //分页
             p.orderNo         = this.formItem.orderNo;    //订单号
             p.buyerCompanyId  = this.formItem.cusOrgId;
             p.sellerCompanyId = this.formItem.shopOrgId;
             p.beginTime       = this.formItem.beginTime;
             p.endTime         = this.formItem.endTime;
             p.billType        = this.formItem.type;
             p.pageSize        = this.formItem.length;

          p.transactionType=this.formItem.ttype;//角色类型
          console.log(this.formItem.ttype);
            if(this.formItem.ttype=="1"){//客户
              p.buyerCompayIdGroup = 'Y'
              
            }else{//供应商
              p.sellerCompayIdGroup= 'Y'
            }
           findBillFlowSum(p).then(res=>{
            if(res.code =="100"){
              res.data.list.map(item=>{
                // youxiaoMoney
                item.fsMoney = this.$global.accPrecision(item.fsMoney,2)
                item.ysMoney = this.$global.accPrecision(item.ysMoney,2)
                item.dkpMoney = this.$global.accPrecision(item.dkpMoney,2)
                item.dkpMoneyCus = item.dkpMoney;
                item.dkpMoneyShop = item.dkpMoney;

                item.youxiaoMoneyCus = this.$global.accAdd(item.fsMoney,item.ysMoney)//客户是相加
                item.youxiaoMoneyShop = this.$global.accMinus(item.fsMoney,item.ysMoney)//供应商时相减
              })
            this.data1=res.data.list;
            this.totalM = res.data.total;
          }  
         })
          
       },
    },
    
    mounted(){
     this.searchM();
      this.getOrgList();
    },
    computed:{
      changeTType(){
          if(this.formItem.ttype=="1"){//客户
            console.log("客户computed")
            this.customColumns.map(item=>{
              //改名字
              if(item.property == "dkpMoney"){
                  item.title = "客户待开票余额"
                }
            })
              
            }else{//供应商
            console.log("供应商computed")
            this.customColumns.map(item=>{
              //改名字
              if(item.property == "dkpMoney"){
                  item.title = "供应商待收票余额"
                }
            })
               
            }
      }
    },
    created(){
   
    },
}

</script>
