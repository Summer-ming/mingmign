<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" :label-width="80">
        <Row>
          <i-Col span="5">
            <FormItem label="公司名称:" style="margin-right:10px;">
            <Input clearable placeholder="请输入公司名称" v-model="formItem.companyName"></Input>
            </FormItem>
          </i-Col>
        
          <i-Col span="3">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
          </i-Col>
        </Row>
        
        <Table border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
             
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findOrdersAll,findShop,updateShop} from '@/api/data'
import Utils from '@/api/middle'
import { mapMutations } from 'vuex'

export default {
    name: 'review_order_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        tableItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:''
          },
          columns4: [
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'60'
                    },
                     {
                        title: '订单号',
                        key: 'ordersNo',
                        align: 'center',
                        width:'200',
                        render:(h,params) =>{
                          return h('a',{
                            on:{
                                click: () => {
                                           params.row.operateType  ="1"//查看
                                           sessionStorage.setItem('CAIGOU','')
                                           sessionStorage.setItem('CAIGOU',JSON.stringify(params.row))
                                               const route = {
                                                  name: 'order_buy_info',
                                                // query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                            }
                          },params.row.ordersNo);
                        }
                    },
                    {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '供应商名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'200'
                    },
                      {
                        title: '合同金额(元)',
                        key: 'moneyAll',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.moneyAll))
                        }
                        
                    },
                    //  {
                    //     title: '实提重量(吨)',
                    //     key: 'deliveryTotalWeight',
                    //     align: 'center',
                    //     width:'70',
                    //     render:(h,params) =>{
                    //       return h('div',{
                    //       },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                    //     }
                    // },
                    //   {
                    //     title: '实提总货款(元)',
                    //     key: 'deliveryTotalMoneyCus',
                    //     align: 'center',
                    //     width:'88',
                    //     render:(h,params) =>{
                    //       return h('div',{
                    //       },this.$global.isMoneyShow(params.row.deliveryTotalMoneyCus))
                    //     }
                    // },
                    {
                        title: '下单时间',
                        key: 'createTime',
                        align: 'center',
                        width:'160'
                    },
                     {
                        title: '管理员',
                        key: 'userName',
                        align: 'center',
                        width:'80'
                    },
                     {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width:'50'
                    },
                     {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'80',
                       
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
                                          this.closeTag({
                                                name: 'review_order_list'
                                            })
                                            params.row.operateType  ="1"//审核采购单列表
                                               const route = {
                                                  name: 'review_order_info',
                                                  query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                                    }
                                }, '审核'),

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
       ...mapMutations([
      'closeTag'
    ]),
      propsClick(){
        this.reload();
      },
      addNew(){
      },
      deleteShop(item){

         this.$Modal.confirm({
                                           title:"确定需要删除吗",
                                           onOk:()=>{
                                               let param = {};
                                               param.id = item.id;
                                               param.status = "0";
                                                updateShop(param).then(res=>{
                                                 if(res.code =="100"){
                                                   this.$Notice.success({
                                                     title:'删除成功'
                                                   })
                                                   this.reload();
                                                 }else{
                                                   this.$Notice.error({
                                                     title:'修改失败'
                                                   })
                                                 }
                                               })

                                           }
                                         })
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
       selectOne(row){
         console.log(row)
       },
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.orgName=this.formItem.companyName //name
         param.pageNum=this.pagesizea //分页
         param.beginStatus = 1 ;
         param.endStatus = 1 ;

         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         findOrdersAll(param).then(res=>{
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
     var that = this;
     Utils.$on('demo',function(msg){
       console.log(msg);
       if(msg == "reload"){
        that.propsClick();
       }
     })
    },
    
    created(){
   
    },
}

</script>
<style lang="less" scoped>
 .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
</style>

