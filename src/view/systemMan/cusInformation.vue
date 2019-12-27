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
                  订单剩余:<time>{{tMoneyOrder}}</time>&nbsp;&nbsp;&nbsp;
                  到账单剩余:<time>{{tMoneyDao}}</time>&nbsp;&nbsp;&nbsp;
                  合计:<time>{{tMoney}}</time>
                
              </Row>
              <!-- TABLE切换 -->
              <Row>
                 <Tabs value="name1">
                    <TabPane label="订单组成" name="name1">
                       <vxe-table size="mini" border
                       show-footer
                       :footer-method="footerMethod" 
                       class="vxe-table-element" :highlight-cell='false'  :data.sync="tableDataOne"  :edit-config="{key: 'id', trigger: 'click', mode: 'row',} ">
                         <vxe-table-column prop="ordersNo"  label="订单号" width="160">
                           <template v-slot="{ row }">
                            <vxe-button @click="orderBtnClick(row)" type="text">{{row.ordersNo}}</vxe-button>
                          </template>
                         </vxe-table-column>
                         <vxe-table-column prop="chaMoney" :formatter="this.$global.vxeTableMoney"  label="结算差额" width="160"></vxe-table-column>
                         <vxe-table-column prop="id"  label="ID" width="40"></vxe-table-column>
                         <vxe-table-column prop="gongcheng"  label="工程名称" width="160"></vxe-table-column>
                         <vxe-table-column prop="createTime"  label="下单时间" width="160"></vxe-table-column>
                         <vxe-table-column prop="customerOrgName"  label="客户名称" width="160"></vxe-table-column>
                         <vxe-table-column prop="shopOrgName"  label="供应商名称" width="160"></vxe-table-column>
                         <vxe-table-column prop="zhongliangAll" :formatter="this.$global.vxeTableWeight"  label="销售合同吨位" width="160"></vxe-table-column>
                         <vxe-table-column prop="moneyAll" :formatter="this.$global.vxeTableWeight"  label="销售合同金额" width="160"></vxe-table-column>
                         <vxe-table-column prop="deliveryTotalWeight" :formatter="this.$global.vxeTableWeight"  label="实提吨位" width="160"></vxe-table-column>
                         <vxe-table-column prop="deliveryTotalMoneyCus" :formatter="this.$global.vxeTableMoney"  label="实提金额" width="160"></vxe-table-column>
                         <vxe-table-column prop="userName"  label="管理员" width="160"></vxe-table-column>
                         <vxe-table-column prop="dikouSmoney"  :formatter="this.$global.vxeTableMoney" label="抵扣金额" width="160"></vxe-table-column>
                         <vxe-table-column prop="tixianSMoney" :formatter="this.$global.vxeTableMoney"  label="提现金额" width="160"></vxe-table-column>
                         <vxe-table-column prop="skSmoney" :formatter="this.$global.vxeTableMoney"  label="收款金额" width="160"></vxe-table-column>
                         <vxe-table-column prop="receivedMoney"  :formatter="this.$global.vxeTableMoney" label="付款金额" width="160"></vxe-table-column>
                         <vxe-table-column prop="status" :formatter="sellOrderStatus"  label="状态" width="160"></vxe-table-column>
                         
                        </vxe-table>
                    </TabPane>
                    <TabPane label="到账单余额" name="name2">
                       <vxe-table size="mini" border class="vxe-table-element" :highlight-cell='false'  :data.sync="tableDataTwo"  :edit-config="{key: 'id', trigger: 'click', mode: 'row',} ">
                         <vxe-table-column prop="daozhangdanId"  label="ID" width="40"></vxe-table-column>
                         <vxe-table-column prop="creditedCompany"  label="客户名称" width="140"></vxe-table-column>
                         <vxe-table-column prop="payMoney"  :formatter="this.$global.vxeTableMoney" label="到账金额 (元)" width="140"></vxe-table-column>
                         <vxe-table-column prop="dealMoney"  :formatter="this.$global.vxeTableMoney" label="剩余可用到账金额 (元)" width="140"></vxe-table-column>
                         <vxe-table-column prop="bankNo"  label="客户银行账号" width="140"></vxe-table-column>
                         <vxe-table-column prop="bank"  label="客户开户行名" width="140"></vxe-table-column>
                         <vxe-table-column prop="jgBankNo"  label="收款账号" width="140"></vxe-table-column>
                         <vxe-table-column prop="type"  label="到账银行卡" width="140"></vxe-table-column>
                         <vxe-table-column prop="dealTime"  label="到账时间" width="140"></vxe-table-column>
                         <vxe-table-column prop="zhaiyao"  label="摘要" width="140"></vxe-table-column>
                         <vxe-table-column prop="daozhangdanStatus"  label="状态" width="140"></vxe-table-column>
                         <vxe-table-column prop="dealTime"  label="到账时间" width="140"></vxe-table-column>
                         
                        </vxe-table>
                    </TabPane>
                    <!-- <TabPane label="流水账单" name="name3">
                       <vxe-table size="mini" border class="vxe-table-element" :highlight-cell='false'  :data.sync="tableDataTwo"  :edit-config="{key: 'id', trigger: 'click', mode: 'row',} ">
                         <vxe-table-column prop="ordersNo" label="订单号" width="140"></vxe-table-column>
                         <vxe-table-column prop="chaMoney" label="结算金额" min-width="140"></vxe-table-column>
                         <vxe-table-column prop="companyName" label="买家名称" min-width="140"></vxe-table-column>
                        </vxe-table>
                    </!--> -->
                </Tabs>
              </Row>
            <Row>        
               <!-- TABLE -->
            </Row>
            </div>
          
        </div>
      </Layout>

  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import {findOrdersAll} from '@/api/data_8889'
import {accountManagement,findDaoZhangDanAll} from '@/api/data'
import {getBuyOrderStatus} from '@/libs/allStatus'
  export default {
    name: 'cusInformation',
    data(){
      return {
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
       //footer 合计
       footerMethod ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '合'
                  }
                  if (['chaMoney'//金额返回2位小数点
                    ].includes(column.property)) {
                    return this.$global.accPrecision(XEUtils.sum(data, column.property),2)
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
         const route = {
                         name: 'sell_order_info',
                         query: row
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
             param.beginStatus = "-1";
             param.endStatus   = "90";
             param.pageSize    = "999999"
         findOrdersAll(param).then(res=>{
            if(res.code =="100"){
                res.data.list.map(item=>{
                  item.chaMoney =  this.$global.accMinus(item.receivedMoney,item.deliveryTotalMoneyCus)
                })
               this.tableDataOne=res.data.list
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
    mounted(){
       this.searchM();//table的查询数据
       this.searchDaozhangdan();//查询到账单列表数据
       this.setInfo();
       
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

