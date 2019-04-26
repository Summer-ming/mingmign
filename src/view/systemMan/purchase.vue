<template>
  <div>
      <Card :border="false" :dis-hover="true">
      <Form :model="formItem" :label-width="80">
        <Row>
      
          <Col span="5"><FormItem label="公司名:">
          <Input  placeholder="请输入公司名称" v-model="formItem.input"></Input>
        </FormItem>
        </Col>
          <Col span="5" style=''>
            <FormItem label="业务员">
              <Select v-model="formItem.select">
                <Option value="北京">北京</Option>
                <Option value="上海">上海</Option>
                <Option value="深证">深圳</Option>
              </Select>
            </FormItem>
          </Col>
           <Col span="5" style=''>
            <FormItem label="公司类型">
              <Select v-model="formItem.selectOne">
                <Option value="北京">北京</Option>
                <Option value="上海">上海</Option>
                <Option value="深证">深圳</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="3">
             <Button type='primary' @click='searchM()'>查询</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <!--表格height="447" -->
    <Row>        
         <Table border   ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'></Table>
        
        
        <Row span='8' style="margin-bottom:20px;display:flex;">
             <!-- 功能添加删除 -->
            <div style='flex:1'>
            <Button  icon="md-add" type="primary"  @click='modal10=true'>指派业务员</Button>
     
      
            <Button  icon="md-add" type="primary">新增</Button>
       
     
            <Button  icon="ios-trash-outline" type="primary">通过审核</Button>
    
            <Button  icon="ios-trash-outline" type="primary">审核不通过</Button>
            <Button  icon="ios-trash-outline" type="primary">锁定</Button>
            <Button  icon="ios-trash-outline" type="primary">解锁</Button>
             <Button  icon="ios-trash-outline" type="primary">删除</Button>
            </div>
    
             <!-- 分页 -->
             <!-- <Page  @on-change='changePage'  :total="totalM"  show-elevator show-sizer  show-total style='flex:1'/> -->
          
        </Row>
    </Row> 
   
    
    <!-- 添加人员 -->
     <Modal
        title="121313"
        v-model="modal10" @on-ok="okConfig('formValidate')"
        @on-cancel="cancel('formValidate')"
        :mask-closable="false" inline width='700px;' >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="员工姓名" prop="name" class='width_150' >
            <Input v-model="formValidate.name" placeholder="输入员工姓名"></Input>
        </FormItem>
        <FormItem label="所属岗位" prop="gangW" class='width_150'>
            <Select v-model="formValidate.gangW" placeholder="输入员工岗位">
                <Option value="技术">技术</Option>
                <Option value="财务">财务</Option>
                <Option value="运营">运营</Option>
            </Select>
        </FormItem>
        <FormItem label="所属部门" prop="buM" class='width_150'>
            <Select v-model="formValidate.buM" placeholder="输入员工部门">
                <Option value="技术">技术</Option>
                <Option value="财务">财务</Option>
                <Option value="运营">运营</Option>
            </Select>
        </FormItem>
        <FormItem label="员工账户名" prop="account" class='width_150'>
            <Input v-model="formValidate.account" placeholder="输入员工账户"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone" class='width_150'>
            <Input v-model="formValidate.phone" placeholder="输入手机号"></Input>
        </FormItem>
        <FormItem id='formM'>
           
            <Button @click="cancel('formValidate')" style="margin-left: 8px">重置</Button>
             <Button type="primary" @click="okConfig('formValidate')">确定</Button>
        </FormItem>
    </Form>
    </Modal>

  </div>
</template>
<script>
import {accountManagement} from '@/api/data'
  export default {
    name: 'purchase',
    data(){
      return {
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        modal10:false,
        formValidate: {
                    name: '',
                    gangW: '',
                    buM: '',
                    account: '',
                    phone: '',
                },
        ruleValidate: {
                    name: [
                        { required: true, message: '名字不能为空', trigger: 'blur' }
                    ],
                    gangW: [
                        { required: true, message: '请选择岗位', trigger: 'change' },
                    ],
                    buM: [
                        { required: true, message: '请选择部门', trigger: 'change' }
                    ],
                    account: [
                        { required: true, message: '请填写账户信息', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        { type: 'string', min: 11, message: '请填写正确手机号', trigger: 'blur' }
                    ]
                    },
        formItem: {
          input: '', //员工姓名
          select: '',//岗位
          selectTwo:'',//部门
          selectOne:"",//部门1
          radio: 'male',
          checkbox: [],
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: '',},
          columns4: [
                    {   title: '选中',
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '公司名称',
                        key: 'id',
                        align: 'center',
                        width:'100'
                       
                    },
                    {
                        title: '业务员',
                        key: 'createCname',
                        align: 'center',
                         width:'80'
                    },
                    {
                        title: '类型',
                        key: 'postW',
                        align: 'center',
                         width:'80'
                    },
                     {
                        title: '添加时间',
                        key: 'departmentName',
                        align: 'center',
                        width:'100'
                    },
                      {
                        title: '来源',
                        key: 'sex',
                        align: 'center',
                         width:'80'
                    },
                      {
                        title: '状态',
                        key: 'acount',
                        align: 'center',
                        width:'80'
                        
                    },
                      {
                        title: '最后联系时间',
                        key: 'phone',
                        align: 'center',
                         width:'110'
                        
                    },
                     {
                        title: '下次联系时间',
                        key: 'mail',
                        align: 'center',
                         width:'110'

                     
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '沟通'),
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
                                            this.remove(params.index)
                                        }
                                    }
                                }, '联系人'),
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
                                            this.remove(params.index)
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
                                            this.remove(params.index)
                                        }
                                    }
                                }, '下单'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '销售合同'),
                             ]);
                    }
                        
                    },
                    
                ],
                data1: [],//表格展示的数据
      }
    },
    methods:{
      //确认
      okConfig(name){
          this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('添加成功!');
                        
                    } else {
                        this.$Message.error('添加失败!');
                       
                       
                    }
                })
      },
      //取消
      cancel(name){
        this.$refs[name].resetFields();
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
         param.cname=this.formItem.input //name
         param.roleCname=this.formItem.select //岗位
         param.departmentName=this.formItem.selectOne //部门
         param.pageNum=this.pagesizea//分页
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         accountManagement(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
       }
    },
    mounted(){
      //账户管理接口
     this.searchM();
    },
    created(){
    
    },
  }
</script>
<style <style lang="less">
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
</style>

