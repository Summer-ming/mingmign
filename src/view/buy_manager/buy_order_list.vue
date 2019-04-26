<!--
 * @Description: 采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
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
          <Col span="5" style="margin-right:30px;" >
          <FormItem label="订单类型:" style="margin-right:10px;">
            <Select  v-model='formItem.buyType' style="width:140px" placeholder="请选择订单购买类型" @on-change='getChange'>
              <Option  v-for='(item,index) in buyTypeListThis' :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="3"  style="margin-left:30px;">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
        </Row>
        <Table border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
        <br>
        <div style='flex:1'>
            <Button style="margin-right:10px"  icon="md-add" type="primary" @click='addNew'>新增库存采购单</Button>
            <Button style="margin-right:10px"  icon="md-add" type="warning" @click='addNew2'>新增快速打款单</Button>
            
            <!-- <Button  icon="md-add" type="primary" @click='addNew1'>新增先销代采单</Button> -->

            </div>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findOrdersAll,findShop,updateShop} from '@/api/data'
import {buyTypeList} from '@/libs/global_type'
import {getBuyTypeLabel} from '@/libs/status_type_color'

export default {
    name: 'purchase',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        tableItem:{},
        buyTypeListThis:buyTypeList,
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          buyType:''
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
                                                  name: 'order_buy_info',
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
                        width:'100'
                    },
                     {
                        title: '采购类型',
                        key: 'buyType',
                        align: 'center',
                        width:'120',
                        render:(h,params)=>{
                          return h('div',{

                          },getBuyTypeLabel(params.row.buyType))
                        }
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
                                            params.row.operateType  ="1"//查看
                                               const route = {
                                                  name: 'order_buy_info',
                                                  query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                                    }
                                }, '查看'),

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
      addNew(){//新增库存销售单
          const route = {
             name: 'add_order_new'
          }
           this.$router.push(route)
      },
      addNew1(){//新增先销后进单
          const route = {
             name: 'add_order_new_byInfo'
          }
           this.$router.push(route)
      },
      addNew2(){//快速打款订单，没有明细的
        const route = {
             name: 'add_order_new_noInfo'
          }
           this.$router.push(route)
      },
      getChange(item){
        console.log(item);
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
         let param             = {};
             param.orgName     = this.formItem.companyName  //name
             param.pageNum     = this.pagesizea             //分页
             param.beginStatus = 1 ;
             param.endStatus   = 11 ;
             param.ordersType     = this.formItem.buyType
        
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         findOrdersAll(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
          }  
         })
       },
    },
    
    mounted(){
     this.searchM();
      console.log(this.$global.adminInfo.cname)
    console.log(this.$global.adminInfo.ename)
    console.log(this.$global.adminInfo.id)
    },
    
    created(){
   
    },
}

</script>
