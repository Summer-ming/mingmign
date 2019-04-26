<!--
 * @Description:店铺管理 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-04 10:42:57
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
        <Table border ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px"   :total="totalM" show-total ></Page>
     </Form>
     </Card>    

     </div>
</template>

<script>
import {findShop,updateShop} from '@/api/data'

export default {
    name: 'purchase',
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
                        title: '店铺名称',
                        key: 'name',
                        align: 'center',
                        width:'250'
                    },
                    {
                        title: '公司名称',
                        key: 'orgName',
                        align: 'center',
                         width:'280'
                    },
                     {
                        title: '管理员',
                        key: 'adminName',
                        align: 'center',
                        width:'140'
                    },
                     
                     {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'auto',
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
                                           params.row.operateType  ="3"//编辑
                                               const route = {
                                                  name: 'shopListInfo',
                                                  query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                                    }
                                }, '编辑'),
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
                                            params.row.operateType  ="2"//查看
                                               const route = {
                                                  name: 'shopListInfo',
                                                  query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                                    }
                                }, '查看'),
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
                                          this.deleteShop(params.row);
                                        }
                                    }
                                }, '删除'),

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
         param.status = 1 ;
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         findShop(param).then(res=>{
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
