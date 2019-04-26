<!--
 * @Description: 采购单付款列表
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
        
          <Col span="3">
             <!-- <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button> -->
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
        </Row>
        <Table border ref="selection" size="small" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
     </Form>
     </Card>    
      <!-- 添加人员 -->
     <Modal
        title="审核"
        v-model="modal"
        footer-hide 
        :mask-closable="false"  width='700px;' >
        <Form :label-width="120" inline :model="formItem">
            <FormItem label="订单号:" prop="name">
           <i-input   style="width:180px" v-model="formItem.orderNo" placeholder="请输入姓名"/>
         </FormItem>
         <FormItem label="申请金额:" prop="name">
           <i-input   style="width:180px" v-model="formItem.payMony" placeholder="请输入姓名"/>
         </FormItem>
         <FormItem label="申请抵扣金额:" prop="name">
           <i-input   style="width:180px" v-model="formItem.dikouMoney" placeholder="请输入姓名"/>
         </FormItem>
          </Form>
          <div class="margin-top-20">
    <Button   type="primary" @click="changeItem">抵扣</Button>
    <Button  type="default" @click="modalCancel">取消</Button>
</div>
    </Modal>
    <!-- 增加客户弹窗 -->

     </div>
</template>

<script>
import {findJgJieSuanInfo,updateShopMoneyJieSuanMer} from '@/api/data'

export default {
    name: 'buy_order_payment_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        //弹出框使用的数据
        modal:false,
        //弹出框使用的数据结束
        tableItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          orderNo:'',
          payMony:'',
          dikouMoney:''
          },
          columns4: [
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
                     
                   
                     {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'80',
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
                                        click: () => { //TODO:
                                          this.modal = true;
                                          this.tableItem = params.row;
                                          this.setItemInfo(params.row);
                                        }
                                    }
                                }, '抵扣'),

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
      setItemInfo(row){//给弹出框赋值
          this.formItem.orderNo = row.orderNo
          this.formItem.payMony = parseFloat(row.jgJieSuanMoney)
          this.formItem.dikouMoney= parseFloat(row.updateDiKou)
      },
      changeItem(){//TODO:
        console.log("开始抵扣")
        let param = {}
        param.bankJgId       = this.tableItem.bankJgId
        param.jgJieSuanId    = this.tableItem.jgJieSuanId;
        param.jgJieSuanMoney = this.formItem.dikouMoney
        param.orderId        = this.tableItem.orderId
        param.orderMoney     = this.tableItem.jgJieSuanMoney
        param.shopId         = this.tableItem.shopId
        param.userId         = this.$global.adminInfo.id
        updateShopMoneyJieSuanMer(param).then(res =>{
           if(res.code =='100'){
               this.$Notice.success({
                   title:'获取订单明细成功',
                   duration:1,
                    onClose:res =>{
                      this.reload()
                 }
               })
           }else{
               this.$Notice.error({
                   title:'获取订单明细失败'
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
         param.jgJieSuanCaoZuoStatus = "0";
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
