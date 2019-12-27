<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-08-01 15:22:27
 * @其他: 
 -->
<template>
  <div>
      <!-- 1 -->
      <Layout >
        <div id='lay_con'>
            <!-- LEFT -->
            <div class='lay_left'>
              <span style="font-size:24px;" >{{orgName}}</span>
              <Row class='row_left'>
                  <dl>
                      <dt>客户角色余额</dt>
                      <dd>{{this.$global.isMoneyShow(balanceMoney)}}<time> 万元</time></dd>
                  </dl>
                  <dl>
                      <dt>到账金额(元)(入)</dt>
                      <dd>{{this.$global.isMoneyShow(inMoney)}}<time> 万元</time></dd>
                  </dl>
                  <dl>
                      <dt>应收金额(元)(出)</dt>
                      <dd>{{this.$global.isMoneyShow(outMoney)}} <time> 万元</time> </dd>
                  </dl>
              </Row> 
              <!-- 累计总量 -->
              <Row class='account_price'>
                  合计:<time>{{tMoney}}</time>
                  订单剩余:<time>{{tMoneyOrder}}</time>&nbsp;&nbsp;&nbsp;
                  到账单剩余:<time>{{tMoneyDao}}</time>&nbsp;&nbsp;&nbsp;
                
              </Row>
              <!-- TABLE切换 -->
              <Row>
                 <Tabs value="name1">
                    <TabPane label="订单组成" name="name1">
                      <!-- 订单组成的查询 -->
                     <row>
                        <Form :label-width="120" inline :model="addForm">

                              <FormItem label='订单号'>
                                <Input style="width:200px" v-model='addForm.orderNo' placeholder='请输入入库号码'/>
                              </FormItem>

                              <!-- 采购单下单时间 -->
                              <FormItem label='下单时间'>
                                    <DatePicker id='caigou' @on-change='getDataOne' type="daterange" :options="options2" placement="bottom-end" placeholder="请选择日期" style="width: 200px"></DatePicker>
                               </FormItem>
                               <!-- 管理员查询 -->
                              <FormItem label="管理员查询:">
                                <Select v-model="adminSearch"   style="width:200px"   @on-change='getAdmin'  filterable placeholder="请选择管理员"   :label-in-value='true'>
                                  <Option v-for="(item,index) in adminList" :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
                                </Select>
                              </FormItem>
                              <!-- 每页显示 -->
                               <FormItem label="每页显示:">
                                <Select v-model="addForm.pageFen"  style="width:200px"   @on-change='getFen'  filterable placeholder="请选择名称"   :label-in-value='true'>
                                <Option  :value="item.value" v-for='(item,index) in everyPage' :key='index'>{{item.value}}</Option>
                                </Select>
                              </FormItem>
                              <!-- 工程名称 -->
                               <FormItem label="工程名称:" >
                                  <el-select size="small" v-model="addForm.engineering" clearable  filterable allow-create default-first-option placeholder="请输入工程名称">
                                  <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
                                </el-select>
                                </FormItem>
                                <!-- 订单状态 -->
                                <FormItem label="订单状态:" style="margin-right:10px;">
                                  <Select  v-model='addForm.orderStatus' style="width:140px" placeholder="请选择订单状态" >
                                    <Option  v-for='(item,index) in orderStatusList' :value="item.value" :key='index'>{{item.label}}</Option>
                                  </Select>
                                </FormItem>




                        </Form>
                     </row>
                      
                      <!-- 结束 -->



                      <vxe-toolbar>
                        <template v-slot:buttons>
                          <vxe-button type='primary' @click="exportCsvEvent" style='margin-right:10px;'>导出当前excel</vxe-button>
                          <vxe-button type='primary' @click='getData'>查询</vxe-button>
                          <vxe-button type='primary' @click="reloadSelf">刷新</vxe-button>
                        </template>
                      </vxe-toolbar>
                       <vxe-table size="mini" border
                       show-footer
                       ref="xTable1"
                       :footer-method="footerMethod" 
                       class="vxe-table-element" :highlight-cell='false'
                         :data.sync="tableDataOne"   >
                         <vxe-table-column field="ordersNo"  title="订单号" width="160">
                           <template v-slot="{ row }">
                            <span style="color:blue" @click="orderBtnClick(row)" type="text">{{row.ordersNo}}</span>
                          </template>
                         </vxe-table-column>
                         <vxe-table-column field="chaMoney" :formatter="this.$global.vxeTableMoney"  title="结算差额" width="160"></vxe-table-column>
                         <vxe-table-column field="id"  title="ID" width="60"></vxe-table-column>
                         <vxe-table-column field="gongcheng"  title="工程名称" width="160"></vxe-table-column>
                         <vxe-table-column field="createTime"  title="下单时间" width="160"></vxe-table-column>
                         <vxe-table-column field="customerOrgName"  title="客户名称" width="160"></vxe-table-column>
                         <vxe-table-column field="shopOrgName"  title="供应商名称" width="160"></vxe-table-column>
                         <vxe-table-column field="zhongliangAll" :formatter="this.$global.vxeTableWeight"  title="销售合同吨位" width="160"></vxe-table-column>
                         <vxe-table-column field="moneyAll" :formatter="this.$global.vxeTableWeight"  title="销售合同金额" width="160"></vxe-table-column>
                         <vxe-table-column field="deliveryTotalWeight" :formatter="this.$global.vxeTableWeight"  title="实提吨位" width="160"></vxe-table-column>
                         <vxe-table-column field="deliveryTotalMoneyCus" :formatter="this.$global.vxeTableMoney"  title="实提金额" width="160"></vxe-table-column>
                         <vxe-table-column field="userName"  title="管理员" width="160"></vxe-table-column>
                         <vxe-table-column field="dikouSmoney"  :formatter="this.$global.vxeTableMoney" title="抵扣金额" width="160"></vxe-table-column>
                         <vxe-table-column field="tixianSMoney" :formatter="this.$global.vxeTableMoney"  title="提现金额" width="160"></vxe-table-column>
                         <vxe-table-column field="skSmoney" :formatter="this.$global.vxeTableMoney"  title="收款金额" width="160"></vxe-table-column>
                         <vxe-table-column field="receivedMoney"  :formatter="this.$global.vxeTableMoney" title="付款金额" width="160"></vxe-table-column>
                         <vxe-table-column field="status" :formatter="sellOrderStatus"  title="状态" width="160"></vxe-table-column>
                         
                        </vxe-table>

                        <!-- 分页 -->
                         <Page :page-size="addForm.pageFen" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
                    </TabPane>
                    <TabPane label="到账单余额" name="name2">
                       <vxe-table
                        size="mini" border
                        show-footer
                       :footer-method="footerMethod2"  
                        class="vxe-table-element" :highlight-cell='false'  :data.sync="tableDataTwo"  >
                         <vxe-table-column field="daozhangdanId"  title="ID" width="40"></vxe-table-column>
                         <vxe-table-column field="creditedCompany"  title="客户名称" width="140"></vxe-table-column>
                         <vxe-table-column field="payMoney"  :formatter="this.$global.vxeTableMoney" title="到账金额 (元)" width="140"></vxe-table-column>
                         <vxe-table-column field="dealMoney"  :formatter="this.$global.vxeTableMoney" title="剩余可用到账金额 (元)" width="140"></vxe-table-column>
                         <vxe-table-column field="bankNo"  title="客户银行账号" width="140"></vxe-table-column>
                         <vxe-table-column field="bank"  title="客户开户行名" width="140"></vxe-table-column>
                         <vxe-table-column field="jgBankNo"  title="收款账号" width="140"></vxe-table-column>
                         <vxe-table-column field="type"  title="到账银行卡" width="140"></vxe-table-column>
                         <vxe-table-column field="dealTime"  title="到账时间" width="140"></vxe-table-column>
                         <vxe-table-column field="zhaiyao"  title="摘要" width="140"></vxe-table-column>
                         <vxe-table-column field="daozhangdanStatus"  title="状态" width="140"></vxe-table-column>
                         <vxe-table-column field="dealTime"  title="到账时间" width="140"></vxe-table-column>
                         
                        </vxe-table>
                    </TabPane>
              
                </Tabs>
              </Row>
            <Row>        
               <!-- TABLE -->
            </Row>
            </div>
          
        </div>
      </Layout>
        <p style="visibility: hidden;">{{total}}</p>

  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import {findOrdersAll} from '@/api/data_8889'
import {accountManagement,findDaoZhangDanAll,findOrgCusAcc,getUserList,findOrderEngineering} from '@/api/data'
import {getBuyOrderStatus} from '@/libs/allStatus'
import {lengthList,orderStatusList} from '@/libs/global_type'
  export default {
    name: 'cusMoneyInfo',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        //开始
        keHu:"",//客户默认
        keHuName:'',//获取改变客户名称
        buyBeginCreateTime:'', //下单时间开始
        buyEndCreateTime:"", //下单时间结束
        adminSearch:"",//默认管理员
        adminList:[],//管理员数组
        engineerNameList:[],//工程名称数组
        orderStatusList: orderStatusList,//订单状态
        guanLiYuan:'',//获取管理员选中的值
        addForm:{//form表单的字段
          orderNo:"",
          pageFen:100,//分页的默认展示
          engineering:'',//工程名字
          orderStatus:"",//订单状态

        },
        everyPage:lengthList,//选择分页的数组
        totalM:0,//分页默认数据
        pagesizea:1,//默认分页第一页
        options2: {
             shortcuts: [
                        {
                            text: '1 周',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '1 月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '3 月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
             ]
        },//下单时间
        //结束


        
        tMoneyOrder:'0',//订单剩余
        tMoneyDao:'0',//到账单剩余
        tMoney:"0",//合计
         orgName:'',//公司名称
         balanceMoney:0,//客户角色余额
         inMoney:0,//入金额
         outMoney:0,//出金额
         tableDataOne:[],//订单组成的table
         tableDataTwo:[],//到账单余额
         dataSession:null,//获取前面存起来的数据
      }
    },
    methods:{
      reloadSelf(){
            this.reload();
        },
      //开始
      //获取客户名称
      getKeName(item){
        this.keHuName=item.label
        console.log(item)
      },
      //获取下单日期
      getDataOne(item){
         this.buyBeginCreateTime=item[0] +' 00:00:00'; 
         this.buyEndCreateTime=item[1]+' 24:00:00'; 
      },
      //获取管理员选中的值
      getAdmin(item){
        this.guanLiYuan=item.value;
        console.log(item)
      },
      //获取管理员的查询
       getAdminList(){
         let param = {};
         param.pageSize = "99999"
         param.status  ="1"
        getUserList(param).then(res=>{
            if(res.code =="100"){
            this.adminList=res.data.list;
          }  
         })
       },
       //点击查询获取数据
       getData(){
          this.searchM();
       },
      //选择分页查询
      getFen(item){
        this.addForm.pageFen=item.value;
        //这里调取查询的方法 todo
        this.searchM();
      },
      //分页查询
       changePage(index){
          this.pagesizea=index;
         
          this.searchM();
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
      exportCsvEvent(){//导出订单组成
          this.$refs.xTable1.exportCsv()
      },
       //footer 合计
       footerMethod ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '合'
                  }
                  if (['zhongliangAll','deliveryTotalWeight',//重量3位小数点
                    ].includes(column.property)) {
                      let a = this.$global.accPrecision(XEUtils.sum(data, column.property),3);
                    return a
                  }
                  if (['chaMoney','dikouSmoney','tixianSMoney',
                  'skSmoney','receivedMoney','deliveryTotalMoneyCus',
                  'moneyAll'//金额返回2位小数点
                    ].includes(column.property)) {
                      let a = this.$global.accPrecision(XEUtils.sum(data, column.property),2);
                      console.log("a = "+a);
                      if(column.property =="chaMoney"){
                       this.tMoneyOrder = a;
                      }
                    return a
                  }
                  return '-'
                })
              ]
       },
       //footer 合计
       footerMethod2 ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '合'
                  }
                  if (['dealMoney'//金额返回2位小数点
                    ].includes(column.property)) {
                      let b = this.$global.accPrecision(XEUtils.sum(data, column.property),2);
                      this.tMoneyDao =b;
                    return b
                  }
                  return '-'
                })
              ]
       },
       sellOrderStatus({cellValue, row, column}){
          return getBuyOrderStatus(row.status)
       },
       orderBtnClick(row){
        row.operateType  ="1"//查看
        sessionStorage.setItem('XiaoShou','')
      sessionStorage.setItem('XiaoShou',JSON.stringify(row))
          const route = {
                          name: 'sell_order_info',
                          }
                            this.$router.push(route)
       },
       setInfo(){//赋值
      // params.row.key1 //客户角色余额
      // 到账金额 params.row.inMoney
      // 应收金额 params.row.outMoney
          this.balanceMoney = this.dataSession.key1;
          this.inMoney = this.dataSession.inMoney;
          this.outMoney = this.dataSession.outMoney;
          this.orgName = this.dataSession.orgName
        },
       //查询表格
       searchM(){ //
         //获取查询的input的值
         let param             = {};
             param.cusMerName  = this.dataSession.orgName  //客户名称
             param.beginStatus = "2";
             param.endStatus   = "90";
             //根据订单状态查询
             if(this.addForm.orderStatus == "1"){
               param.beginStatus = 2 ;
              param.endStatus   = 90 ;
             }else if(this.addForm.orderStatus == "2"){
               param.beginStatus = 2 ;
                param.endStatus   = 90 ;
             }else {
               param.beginStatus = this.addForm.orderStatus ;
                param.endStatus   = this.addForm.orderStatus ;
             }
           //  param.pageSize    = "999999"
             param.pageNum      = this.pagesizea             //分页的数量
             param.pageSize     = this.addForm.pageFen;      //
             param.ordersNoLike = this.addForm.orderNo;      //订单号
             param.beginTime    = this.buyBeginCreateTime    //创建时间 
             param.endTime      = this.buyEndCreateTime      //供应商
             param.engineering  = this.addForm.engineering;  //工程名称
             param.userId       = this.guanLiYuan;           //管理员id
         findOrdersAll(param).then(res=>{
            if(res.code =="100"){
                res.data.list.map(item=>{
                  if(item.status>=8)//如果订单已经录入实提 则用录入实提的金额和收款金额相减
                  {
                    item.chaMoney =  this.$global.accMinus(item.receivedMoney,item.deliveryTotalMoneyCus)

                  }else{
                    item.chaMoney =  this.$global.accMinus(item.receivedMoney,item.moneyAll)

                  }
                })
               this.tableDataOne=res.data.list
               this.totalM=res.data.total
              }
          })  
       },
       searchDaozhangdan(){
          //获取查询的input的值
         let param             = {};
             param.allEqualcreditedCompany  = this.dataSession.orgName  //客户名称
             param.beginDaozhangdanStatus = "1";
             param.endDaozhangdanStatus   = "3";
             param.pageSize    = "999999"
             param.tranType    = "1"
             param.beginDtype    = "1"
             param.endDtype    = "1"
            //  param.jgBank    = "2"
         findDaoZhangDanAll(param).then(res=>{
            if(res.code =="100"){
               this.tableDataTwo=res.data.list
              }
          })  
       }
    },
     computed:{ //计算总金额和总重量
      total(){
        this.tMoney = this.$global.accAdd(this.tMoneyOrder,this.tMoneyDao);

        return  this.tMoney
      }
    },
    mounted(){
       this.searchM();//table的查询数据
       this.searchDaozhangdan();//查询到账单列表数据
       this.setInfo();
       this.getAdminList();//管理员查询
       this.getGongcheng();//查询工程名称
       
    },
    created(){
      this.dataSession=JSON.parse(sessionStorage.getItem('compay'));
    },
  }
</script>
<style <style lang="less">

.ivu-tabs-nav .ivu-tabs-tab-active{
    background:#2d8cf0!important;
    color:#fff;
}
.ivu-tabs-tab-active:hover{
    color:#fff!important;
}
#lay_con{
    display: flex;
    .lay_left{
      width:100%;
      flex: 3;
    };
    .lay_right{
      width:100%;
      flex:1;
      .basicInfo{
          height:360px;
          width:100%;
          border:1px solid rgba(221,221,221,1);
          margin-bottom:10px;
          .h_info{
            height:40px;
            text-indent: 10px;
            background:rgba(238,238,238,1);
            line-height:40px;
            font-size:14px;
            font-weight:400;
            color:rgba(51,51,51,1)
          }
          .info_con{
             padding-top:16px;
             padding-left:16px;
          
             p{
                 font-size:14px;
                 color:rgba(51,51,51,1)
             }

          }
      }
      .phone_info{
           border:1px solid rgba(221,221,221,1);
        .phone_title{
            height:40px;
            text-indent: 10px;
            background:rgba(238,238,238,1);
            line-height:40px;
            font-size:14px;
            font-weight:400;
            color:rgba(51,51,51,1);
            time{
                font-size:16px;
            };
        }
        .phone_qq{
            height:40px;
        }
      }
      .infoF{
        height:40px;
        background:rgba(238,238,238,1);
        border:1px solid rgba(245,245,245,1);
        overflow: hidden;
        margin-bottom:20px;
        .spanKai{
          float:left;
          height:40px;
          font-size:14px;
          color:rgba(51,51,51,1);
          line-height:40px;
          text-indent: 10px;
        }
        .iconT{
        float:right;
        line-height:40px;
        font-size:18px;
        margin-right:17px;
      }}
    
     .p_con{
        width:100%;
        padding-left:10px;
        p{
          font-size:14px;
          line-height:25px;
          color:rgba(51,51,51,1);
          min-height:20px;
        }
      }
}
}
.row_left{
  display:flex;
  height:90px;
  background:rgba(236,248,255,1);
  border:1px dashed #94d6ff;
  padding-top:10px;
  dl{
      flex:1;
      dt{
          text-align:center;
          font-size:16px;
      }
      dd{
          text-align:center;
          font-size:24px;
          color:red;
          time{
              font-size:14px;
              color:rgba(51,51,51,1);
          }
      }
  } 
}
.row_shop{
    height:45px;
    border:1px solid rgba(221,221,221,1);
    border-bottom:0;
    .shop_info{
        height:45px;
        line-height:45px;
        font-size:16px;
        text-indent: 10px;
        color:rgba(51,51,51,1);
    }
    .shop_add{
        height:45px;
        padding-top:7px;
        .but_on{
            height:30px;
            font-size:13px;
            float:right;
            margin-right:10px

        }
    }

}
.row_account{
  height:45px;
  border:1px solid rgba(221,221,221,1);
  border-bottom:0;
  .row_span{
      float:left;
      height:45px;
      text-indent: 10px;
      font-size:16px;
      color:rgba(51,51,51,1);
      line-height:45px;
  }
  .row_more{
      float:right;
      height:45px;
     font-size:13px;
     color:rgba(27,151,229,1);
     line-height:45px;
     margin-right:10px
  }

}
.ivu-card-body{
   padding-bottom:0;
 }
 .width_150{
   width:500px;
 }
.ivu-modal-content{
  padding-left:20px;
 
}
.ivu-modal-footer{
  display: none;
}
#formM{
  .ivu-form-item-content{
    margin-left:357px!important;
  }
}
.ivu-form-item{
    margin-bottom:16px!important;
}
.contacts{
   height:45px;
   border:1px solid rgba(221,221,221,1);
   border-bottom:0;
   .span_contacts{
       height:45px;
       line-height:45px;
       text-indent:10px;
       font-size:16px;
       color:rgba(51,51,51,1);
       float:left;
   }
   .span_btn{
       float:right;
       width:60px;
       
       border-radius:3px;
       margin-right:24px;
       margin-top:5px;
      .ivu-btn >.ivu-icon + span{
          margin-left:0!important;
      }
   }
}
.ivu-modal-body{
    padding:31px 30px;
}
.ivu-modal-content{
    padding-left:0!important;
}
.account_price{
    height:50px;
    line-height:50px;
    // text-align:right;
    time{
        font-size:16px;
        color:red;
    }
}
</style>

