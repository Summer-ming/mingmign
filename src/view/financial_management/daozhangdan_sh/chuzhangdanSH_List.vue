<!--
 * @Description: 采购单线上付款列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-09 15:10:51
 -->



<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="80">
        <Row>
          <Col span="24">
          <FormItem label="公司名称:" style="margin-right:10px;">
          <Input  style="width:200px"  placeholder="请输入公司名称" v-model="formItem.companyName"></Input>
          </FormItem>
          <FormItem label='到账单状态'>
            <Select  v-model='formItem.daozhangdanStatus' style="width:200px" placeholder="请选择到账单状态" >
              <Option  v-for='(item,index) in daozhangdanStatusListThis' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
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
      <!-- 批量选择付款账号 -->
     <Modal
        title="批量选择付款账号"
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
           <Select v-model="formItem.cardType"  style="width:400px"  placeholder="请选择"   >
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
  findDaoZhangDanAllSH,deleteDaoZhangDanSH
  } from '@/api/data'
import {companyCardTypeList,daozhangdanStatusList} from '@/libs/global_type'
import {getDaozhangdanStatus} from '@/libs/allStatus'


export default {
    name: 'daozhangdanSH_List',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        //弹出框使用的数据
        modal:false,
        daozhangdanStatusListThis:daozhangdanStatusList,
        //弹出框使用的数据结束
        tableItem:{},
        selectionsList:[],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        companyCardTypeListThis:companyCardTypeList,
        formItem: {
          companyName:'',
          orderNo:'',
          payMony:'',
          dikouMoney:'',
          cardType:"",
          totalMoney:'',
          totalNum:'',
          daozhangdanStatus:''
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
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },getDaozhangdanStatus(params.row.daozhangdanStatus))
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
          let status = '0';
          let stra = '修改成功'
          let strb = '确定需要修改吗'
          console.log(type)
          switch (type.toString()) {
            case "1"://错打款项
              status = "4"
              stra ='修改错打款项成功'
              strb = '确定需要修改为错打款项吗'

              break;
             case "2"://银行退汇
              status = "5"
              stra ='修改银行退汇成功'
              strb = '确定需要修改为银行退汇吗'
              
              break;
             case "3"://关闭
              status = "99"
              stra ='关闭成功'
              strb = '确定需要删除吗'
              
              break;
            default:
              break;
          }
          console.log(strb)
         this.$Modal.confirm({
                                           title:strb,
                                           onOk:()=>{
                                               let param                   = {};
                                                   param.userId            = this.$global.adminInfo.id
                                                   param.daozhangdanId     = item.daozhangdanId
                                                   param.daozhangdanStatus = status
                                                   param.note              = ""
                                                deleteDaoZhangDanSH(param).then(res=>{
                                                        if(res.code =="100"){
                                                          this.$Notice.success({
                                                            title:stra,
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
          this.formItem.orderNo = row.orderNo
          this.formItem.payMony = parseFloat(row.jgJieSuanMoney)
          this.formItem.dikouMoney= parseFloat(row.updateDiKou)
      },
      changeItem(){
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
      fujian_zhidan(){//福建制单接口
      },
      shanghai_zhidan(){//上海制单接口
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
         param.tranType = "2";
         param.creditedCompany = this.formItem.companyName;
         param.daozhangdanStatus = this.formItem.daozhangdanStatus
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
    },
    
    mounted(){
     this.searchM();
    },
    
    created(){
   
    },
}

</script>
