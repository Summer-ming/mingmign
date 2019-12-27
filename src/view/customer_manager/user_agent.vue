<!--
 * @Description: 
 * @Author: zl
 * @others: 
 * @Date: 2019-04-02 11:08:59
 -->

<template>
  <div>
    <Card :border="false" :dis-hover="true">
        <Form  :model="formAgent" :label-width="80">
            <Row>
                         <Col span="5">  <!--col输入框长度-->
                            <FormItem label="代理商名称:" style="margin-right:10px;">
                            <Input  placeholder="请输入代理商名称" v-model="formAgent.input"></Input>
                            </FormItem> 
                        </Col>

                         <Col span="3">
                            <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
                            <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
                        </Col>
            </Row>
        
            <Row span='8' style="margin-bottom:20px;display:flex;">
                            <div style='flex:1'>
                               <Button  icon="md-add" type="info"  @click='addClick'>新增代理商</Button>

                            </div>
            </Row>

            <Table border :columns="column1" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            </Table>

            <Page @on-change='changePage' style="margin-top:10px"   :total="totalM" show-total ></Page>                
        </Form>
    </Card>

<Modal :title="modalTitle" v-model="modal0" @on-ok="okConfig()" @on-cancel="cancel()" :mask-closable="false" inline width='700px;' >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
    <FormItem label="公司名称" prop="Cname" class='width_150' >
        <Input v-model="formValidate.Cname" placeholder="输入公司名称"></Input>
    </FormItem>
    <FormItem label="代理简称" prop="simple"  class='width_150'>
        <Input v-model="formValidate.simple" placeholder="输入简称"></Input>
    </FormItem>
    </Form>
</Modal>

  </div>
</template>

<script>
import {findAgent,addAgent,updateAgent} from '@/api/warehouse'

  export default {
    inject:['reload'],  //調用組建app.vue
            data () {
                return {
                    modal0:false,
                    ischange:false,
                    tableItem:{},
                    formAgent: {
                      input: '', //输入代理名称查询
                    },
                    totalM : 0,
                    pagesize:1,//默认分页第一页
                    data1 : [],   //表格展现的数据
                    formValidate: { //熙增代理商字段
                    id:'',
                    Cname: '',
                    simple: '',
                   },
                   modalTitle : '',
                    column1 : [
                      { title: '选中',
                        type: 'selection',
                        width: 60,
                        align: 'center'
                      },
                      {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'60'
                      },
                      {
                        title: '代理简称',
                        key: 'shortName',
                        align: 'center',
                        width:'200'
                      },
                      {
                        title: '公司名称',
                        key: 'companyName',
                        align: 'center',
                        width:'300'
                      },
                      {
                        title: '管理员名称',
                        key: 'userName',
                        align: 'center',
                        width:'200'
                      },
                      {
                        title: '创建时间',
                        key: 'timeCreate',
                        align: 'center',
                        width:'250'
                      },
                      
                      {
                        title: '操作',
                        key: 'id',
                        align: 'center',
                        width:'200px',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal0 = true;
                                            this.tableItem =  params;
                                            this.modalTitle = '修改代理商'
                                            this.setTableItemModal();
                                        }
                                    }
                                }, '修改'),   

                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: 'disabled',

                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modalTitle = '删除代理商'
                                            this.$Modal.confirm({
                                           title:"确定需要删除吗",
                                           onOk:()=>{
                                               let param = {};
                                               let dic = {};
                                               dic.id = this.tableItem.id;
                                               dic.status = "0";
                                                deleteAgengt(dic).then(res=>{   //未设置接口
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
                                        }
                                    }
                                }, '删除'),             

                             ]);
                    }
                      },
                        ],  //column1
                   ruleValidate: {
                    Cname: [
                        { required: true, message: '名字不能为空', trigger: 'blur' }
                    ],
                    simple: [
                        { required: true, message: '请填写供应商简称信息', trigger: 'blur' }
                    ],
                    },

                    } //return
            },

 methods:{
   addClick1(){
   
     this.$Message.success("54535436546546")
   },
    selectOne(row){
         console.log(row)
       },

       addClick(){
         this.modal0=true;
         this.ischange =false;
         this.modalTitle = '新增代理商'
         this.formValidate.id = "";    //清空输入框数据
         this.formValidate.Cname = "";
         this.formValidate.simple = "";
        },

        okConfig(){
          //确认提交
          if(this.ischange ){  //編輯代理商
              let dic = {};
              dic.id = this.formValidate.id;
              dic.companyName = this.formValidate.Cname;
              dic.shortName = this.formValidate.simple;
        updateAgent(dic).then(res=>{
         if(res.code =="100"){
           this.$Notice.success({
           title:"修改成功",
           })
           this.reload();
        }else{
           this.$Notice.error({
           title:"修改失败",
           })
        }
        })
          }
          else{  //新增代理
              let dic = {};
              dic.companyName = this.formValidate.Cname;
              dic.shortName = this.formValidate.simple;
              dic.userName = this.$global.adminInfo.cname;  //全局变量
              dic.userId = this.$global.adminInfo.id;
              dic.status = '1';
        addAgent(dic).then(res=>{
          if(res.code =="100"){
           this.$Notice.success({
           title:"添加成功",
           })
           this.reload();
         }else{
           this.$Notice.error({
           title:"添加失败",
           })
         }
         })
          }
          return false;
      },

      //刷新页面
       reloadSelf(){
            this.reload();
        },

      //取消按钮
      // cancel(name){
      //   this.$refs[name].resetFields();
      // },

      //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.companyName=this.formAgent.input //name
         param.pageNum=this.pagesize //分页
         param.status = 1 ;
         this.getSerch(param)
       },

       //分页
       changePage(index){
           console.log(index)
           this.pagesize=index;
           this.searchM();
       },

       //查询接口
       getSerch(param){
         findAgent(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
       },

       setTableItemModal(){//给modal 赋值 todo
         let dic = this.tableItem.row;
         console.log(dic);
         //赋值
         this.ischange = true;
         this.formValidate.id = dic.id;
         this.formValidate.Cname = dic.companyName;
         this.formValidate.simple = dic.shortName;
        },
      
        },

        mounted(){
         //账户管理接口
          this.searchM();
          },

  }
</script>

