<!--
 * @Description: 客户列表
 * @Author: gmm
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-20 10:47:19
 * @LastEditTime: 2019-03-22 17:33:13
 -->

<template>
  <div>
      <Card :border="false" :dis-hover="true">
      <Form :model="formItem" :label-width="80">
        <Row>
          <i-col span="5"><FormItem label="公司名:">
          <i-input    placeholder="请输入公司名称" v-model="formItem.companyName"></i-input  >
        </FormItem>
        </i-col>
          <i-col span="5" style=''>
            <FormItem label="业务员">
              <Select
                v-model="model13"
                filterable
                remote
                :remote-method="remoteMethod1"
                @on-change='changeOpation'
                :loading="loading1">
                <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
            </Select>
            </FormItem>
          </i-col>
           <i-col span="5" style='margin-right:10px;'>
            <FormItem label="公司类型">
              <Select v-model="formItem.companyType">
                <Option value="北京">北京</Option>
                <Option value="上海">上海</Option>
                <Option value="深证">深圳</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="3">
             <Button type='primary' @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" ></Button>
          </i-col>
        </Row>
      </Form>
      <Row style='margin-bottom:10px;padding-left:20px;'>
           <Button>所有单位</Button>
           <Button>潜在单位</Button>
           <Button>今天联系</Button>
           <Button>明天联系</Button>
           <Button>本周内联系</Button>
           <Button>本月内联系</Button>

      </Row>
    </Card>
    <!--表格height="447" -->
    <Row>        
         <Table border   ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'></Table>
        
        
        <Row span='8' style="margin-bottom:20px;display:flex;">
             <!-- 功能添加删除 -->
            <div style='flex:1'>
            <Button  icon="md-add" type="primary"  @click='modal10=true'>指派业务员</Button>
     
      
            <Button  icon="md-add" type="primary" @click='modal=true'>新增</Button>
       
     
            <Button  icon="ios-trash-outline" type="primary" @click='getT'>通过审核</Button>
    
            <Button  icon="ios-trash-outline" type="primary">审核不通过</Button>
            <Button  icon="ios-trash-outline" type="primary">锁定</Button>
            <Button  icon="ios-trash-outline" type="primary">解锁</Button>
             <Button  icon="ios-trash-outline" type="primary">删除</Button>
            </div>
    
             <!-- 分页 -->
             <Page  @on-change='changePage'  :total="totalM"  show-elevator show-sizer  show-total style='text-align:right;'/>
          
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
            <i-input   v-model="formValidate.name" placeholder="输入员工姓名"></i-input  >
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
            <i-input   v-model="formValidate.account" placeholder="输入员工账户"></i-input  >
        </FormItem>
        <FormItem label="手机号" prop="phone" class='width_150'>
            <i-input   v-model="formValidate.phone" placeholder="输入手机号"></i-input  >
        </FormItem>
        <FormItem id='formM'>
           
            <Button @click="cancel('formValidate')" style="margin-left: 8px">重置</Button>
             <Button type="primary" @click="okConfig('formValidate')">确定</Button>
        </FormItem>
    </Form>
    </Modal>
    <!-- 增加客户弹窗 -->
     <Modal 
     v-model="modal"  
     width="1000" :styles="{top:'10px'}" >
      <Form :label-width="120" inline :model="addForm">
        <FormItem label="姓名:" prop="name">
           <i-input   style="width:300px" v-model="addForm.name" placeholder="请输入姓名"/>
         </FormItem>
         <FormItem label="手机号:" prop="phone">
           <i-input   style="width:300px" v-model="addForm.phone" placeholder="请输入手机号"/>
         </FormItem>
            <FormItem label="公司:" prop="company">
           <i-input   style="width:300px" v-model="addForm.company" placeholder="请输入公司"/>
         </FormItem>

        <FormItem label="所在城市:" prop="Citywhere">
          <Cascader :data="dataOne" filterable v-model="value1" @on-change='getCity' style='width:300px'></Cascader>
        </FormItem>
         
         <FormItem label="开户银行:" prop="bankDeposit">
           <i-input   style="width:300px" v-model="addForm.bankDeposit" placeholder="请输入开户银行"/>
         </FormItem>
        
         
         <FormItem label="银行账号:" prop="bankAccount">
           <i-input   style="width:300px" v-model="addForm.bankAccount" placeholder="请输入银行账号"/>
         </FormItem>
          <FormItem label="退款开户行:" prop="refundBank">
           <i-input   style="width:300px" v-model="addForm.refundBank" placeholder="请输入退款账开户行"/>
         </FormItem>
         <FormItem label="退款银行开户网点:" prop="nameRefund">
           <i-input   style="width:300px" v-model="addForm.nameRefund" placeholder="请选择开户网点"/>
         </FormItem>
    
          <FormItem label="退款银行账号:" prop="refundAccount">
           <i-input   style="width:300px" v-model="addForm.refundAccount" placeholder="请输入退款银行账号"/>
         </FormItem>
         
         <br>
         <!-- 上传图片控件 -->
        <FormItem :required="true" label="合同图片" prop="images">
          <template >
            <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>

            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
           </div>
          <Upload
              ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              multiple
              type="drag"
              action="//jsonplaceholder.typicode.com/posts/"
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                  <Icon type="ios-camera" size="20"></Icon>
              </div>
          </Upload>
    <Modal title="View Image" v-model="visible">
        <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
    </Modal>

          </template>
         </FormItem>
         <br>
         <!-- 上传文件附件 -->
      
        <br>
      </Form>
    </Modal>
    <!-- 结束 -->

  </div>
</template>
<script>
import {updatePaymentRequest} from '@/api/data'
import {cusSearch,getUserList} from '@/api/cusData' //客户列表
// import city from '@/api/city' //三级城市
import city from '@/api/city_houtai'


  export default {
    name: 'customerlist',
    inject:['reload'],
    data(){
      return {
         model13: '',
         loading1: false,
         options1: [],
         list: ['中国', '香港', '美国', '台湾', '调鱼岛'],
         listCon:[],//
         listCname:[],//保存业务员名字
         businessName:'',//下拉框选中时业务员的名字
         params:{},//获取业务员列表
        defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
        imgName: '',
        visible: false,
        uploadList: [],
        cityString:'',//省市区-字段
        dataOne:city,
        value1: [],
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        modal10:false,
        modal:false, //控制添加客户弹窗
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
          companyName: '', //员工姓名
          companyType:'',//公司类型
          
          },
          addForm:{ //新增客户添加的字段
            name:'',
            phone:'',
            company:"",
            bankDeposit:'',
            bankAccount:'',
            refundBank:'',
            nameRefund:"",
            refundAccount:'',
          },
          columns4: [
                    {   title: '选中',
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '公司名称',
                        key: 'orgName',
                        align: 'center',
                        width:'100'
                       
                    },
                    {
                        title: '业务员',
                        key: 'adminCname',
                        align: 'center',
                         width:'80'
                    },
                    {
                        title: '类型',
                        key: 'adminEname',
                        align: 'center',
                         width:'80'
                    },
                     {
                        title: '添加时间',
                        key: 'createTime',
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
         //获取查询的i-input  的值
         let param={};
         param.orgName=this.formItem.companyName//员工姓名
         //param.aa=this.businessName //业务员名字
         param.pageNum=this.pagesizea//分页
         this.getSerch(param)
       },
       //根据公司名，业务员查询
       getSerch(param){
         cusSearch(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
           // console.log(res.data.list);//总条数 
          }  
         })
       },
       //省市区
       getCity(value,selectedData){
         console.log(value);
         console.log(selectedData.length)
         console.log(selectedData)
          //selectedData[2].label== 'undefined' || undefined ? '' :selectedData[2].label
          if(selectedData.length =='2'){
             this.cityString= selectedData[0].label+','+ selectedData[1].label
          }else {
            this.cityString= selectedData[0].label+','+ selectedData[1].label+','+ selectedData[2].label
          }
          
         // console.log(this.cityString)
       },
       //上传图片
       handleView (name) {
            this.imgName = name;
            this.visible = true;
       },
       handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
       },
       handleSuccess (res, file) {
            file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            file.name = '7eb99afb9d5f317c912f08b5212fd69a';
       },
       handleFormatError (file) {
            this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
       },
       handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
       },
       handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
      },
      getT(){//审核通过
        this.reload();
      },
      //业务员远程搜锁
      remoteMethod1 (query) {
               console.log(query)
                if (query !== '') {
                    this.loading1 = true;
                    this.params.pageNum='99';
                   // console.log(this.params)
                    this.params.status = "1";
                    this.params.cname =query ;
                    getUserList(this.params).then(res=>{
                        if(res.code =="100"){
                        this.listCon=res.data.list
                        this.listCon.map((value,key,arr)=>{
                             this.listCname.push(arr[key].cname)
                        })
                      }  
                    })
                    setTimeout(() => {
                        this.loading1 = false;
                        //console.log(this.listCon)
                        const list = this.listCname.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options1 = list.filter(item => item.label.indexOf(query) > -1);
                        this.businessName=query;
                    }, 200);
                } else {
                    this.options1 = [];
                }
       },
       //业务员选中的值
       changeOpation(opation){
          console.log(opation)
       }
    },
    mounted(){
      //账户管理接口
     this.searchM();
     this.uploadList = this.$refs.upload.fileList; //上传合同图片
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
.ivu-form-item{
    margin-bottom:16px!important;
}
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        i-color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

