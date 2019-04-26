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
          <Col span="5"><FormItem label="公司名称:" style="margin-right:10px;">
          <Input  placeholder="请输入公司名称" v-model="formItem.companyName"></Input>
          </FormItem>
          </Col>
        
          <Col span="3">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
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
import {findOrdersAll,findShop,updateShop} from '@/api/data_8889'
import Utils from '@/api/middle'

export default {
    name: 'sell_order_review_list',
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
                        width:'180',
                        render:(h,params) =>{
                          return h('a',{
                            on:{
                                click: () => {
                                           params.row.operateType  ="1"//查看
                                               const route = {
                                                  name: 'sell_order_info',
                                                  query: params.row

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
                        width:'250'
                    },
                    {
                        title: '供应商名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'250'
                    },
                      {
                        title: '合同金额(元)',
                        key: 'moneyAll',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.moneyAll))
                        }
                        
                    },
                     {
                        title: '实提重量(吨)',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                        }
                    },
                      {
                        title: '实提总货款 (元)',
                        key: 'deliveryTotalMoneyCus',
                        align: 'center',
                        width:'250',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.deliveryTotalMoneyCus))
                        }
                    },
                    {
                        title: '下单时间',
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
                        title: '状态',
                        key: 'status',
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
                                        click: () => {
                                            params.row.operateType  ="1"//审核采购单列表
                                               const route = {
                                                  name: 'sell_order_review_info',
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
      propsClick(){
        console.log("回调成功");
        this.reload();
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
