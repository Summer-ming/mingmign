<!--
 * @Description: 仓库管理
 * @Author: zl
 * @others: 
 * @Date: 2019-03-20 14:45:18
 * @LastEditTime: 2019-04-08 10:27:44
 -->

<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" :label-width="80">
        <Row>
         
          <Col   span="5"><FormItem label="仓库名称:" style="margin-right:10px;">
          <Input  placeholder="请输入仓库名称" v-model="formItem.input1"></Input>
          </FormItem>
          </Col>
          <!-- <Col span="5"><FormItem label="仓库简称:" style="margin-right:10px;">
          <Input  placeholder="请输入仓库简称" v-model="formItem.input2"></Input>
          </FormItem>
          </Col> -->
        
          <Col span="3">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
        </Row>

        <Row span='8' style="margin-bottom:20px;display:flex;">
            <div style='flex:1'>
               <Button  icon="md-add" type="info"  @click='addClick'>新增仓库</Button>
               <!-- <Button  type="success">导出excel</Button> -->
            </div>
        </Row>

        <Table border ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px"   :total="totalM" show-total show-elevator></Page>
     </Form>
     </Card>    

     <!-- 添加仓库 -->
     <Modal
        :title="modalTitle"
        v-model="modal10" @on-ok="okConfig()"
        @on-cancel="cancel()"
        :mask-closable="false" inline width='700px;' >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="仓库名称" prop="name" class='width_150' >
            <Input v-model="formValidate.name" placeholder="输入仓库名称"></Input>
        </FormItem>
        
        <!-- <FormItem label="仓库简称" prop="simple" class='width_150'>
            <Input v-model="formValidate.simple" placeholder="输入仓库简称"></Input>
        </FormItem> -->

        <FormItem label="联系人" prop="contacter"  class='width_150'>
            <Input v-model="formValidate.contacter" placeholder="输入联系人"></Input>
        </FormItem>

        <FormItem label="手机号" prop="phone" class='width_150'>
            <Input v-model="formValidate.phone" placeholder="输入手机号"></Input>
        </FormItem>

        <FormItem label="传真号" prop="faxNo" class='width_150'>
          <h1 ></h1>
            <Input v-model="formValidate.faxNo" placeholder="输入传真号"></Input>
        </FormItem>

        <FormItem label="地址" prop="address" class='width_150'>
            <Input v-model="formValidate.address" placeholder="输入地址"></Input>
        </FormItem>

        <!-- <FormItem label="备注" prop="note" class='width_150'>
            <Input v-model="formValidate.note" placeholder="输入备注信息"></Input>
        </FormItem> -->

    </Form>
    </Modal>

     </div>
</template>

<script>
import {accountManagement} from '@/api/data'
import {findWareHouse,updateWareHouse,addWareHouse,deleteWareHouse} from '@/api/warehouse'

export default {
    name: 'purchase',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        ischange:false,
        tableItem:{},
        modalTitle:'添加仓库信息',
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        modal10:false,
        formValidate: {
                    id:'',
                    name: '',
                    simple: '',
                    contacter: '',
                    phone: '',
                    faxNo: '',
                    address: '',
                    note: '',
                },
        ruleValidate: {
                    name: [
                        { required: true, message: '名字不能为空', trigger: 'blur' }
                    ],
                    simple: [
                        { required: true, message: '请填写仓库信息', trigger: 'blur' }
                    ],
                    contacter: [
                        { required: true, message: '请填写联系人', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请填写手机号', trigger: 'blur' },
                        // { type: 'string', min: 11, message: '请填写正确手机号', trigger: 'blur' }
                    ],
                    faxNo: [
                        { required: true, message: '请填写传真号', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请填写地址', trigger: 'blur' }
                    ],
                    note: [
                        { required: true, message: '请添加备注', trigger: 'blur' }
                    ],
                    },
        formItem: {
          input1: '', //仓库名称
          input2:'',  //仓库简称
          radio: 'male',
          checkbox: [], 
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: '',
        },

          columns4: [
                    {   title: '选中',
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
                        title: '仓库名称',
                        key: 'warehouseName',
                        align: 'center',
                        width:'150'
                    },
                    // {
                    //     title: '仓库简称',
                    //     key: 'id',
                    //     align: 'center',
                    //      width:'100'
                    // },
                    {
                        title: '联系人',
                        key: 'contacts',
                        align: 'center',
                         width:'80'
                    },
                     {
                        title: '联系电话',
                        key: 'contactsPhone',
                        align: 'center',
                        width:'140'
                    },
                      {
                        title: '传真号',
                        key: 'positionFax',
                        align: 'center',
                         width:'115'
                    },
                      {
                        title: '地址',
                        key: 'warehouseAdress',
                        align: 'center',
                        width:'320'
                        
                    },
                    //   {
                    //     title: '备注',
                    //     key: 'note',
                    //     align: 'center',
                    //      width:'150'
                        
                    // },
                
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
                                            this.modal10 = true;
                                            this.tableItem =  params;
                                            this.modalTitle = '编辑仓库信息'
                                            this.changeBtn =true;
                                            this.addBtn  =false;
                                            this.setTableItemModal();
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
                                         this.tableItem = params.row;
                                         this.$Modal.confirm({
                                           title:"确定需要删除吗",
                                           onOk:()=>{
                                               let param = {};
                                               let dic = {};
                                               dic.id = this.tableItem.id;
                                               dic.status = "0";
                                                deleteWareHouse(dic).then(res=>{
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
                    
                ],
                
                //表单验证
                addForm:{
                  name:'',
                  contacter:'',
                  phone:'',
                  faxNo:'',
                  address:''
                },
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
        reloadSelf(){
            this.reload();
        },
        
        addClick(){
            this.modal10=true;
            this.ischange =false;
            this.modalTitle = '新增倉庫'
         this.formValidate.id = "";
         this.formValidate.name = "";
         this.formValidate.contacter = "";
         this.formValidate.phone = "";
         this.formValidate.faxNo = "";
         this.formValidate.address = "";
        },
      
      //确认提交
      okConfig(){
          if(this.ischange ){  //編輯倉庫
              let dic = {};
              dic.id = this.formValidate.id;
              dic.warehouseName = this.formValidate.name;
              dic.contacts = this.formValidate.contacter;
              dic.contactsPhone = this.formValidate.phone;
              dic.positionFax = this.formValidate.faxNo;
              dic.warehouseAdress = this.formValidate.address;
        updateWareHouse(dic).then(res=>{
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
          else{  //新增倉庫
              let dic = {};
              dic.warehouseName = this.formValidate.name;
              dic.contacts = this.formValidate.contacter;
              dic.contactsPhone = this.formValidate.phone;
              dic.positionFax = this.formValidate.faxNo;
              dic.warehouseAdress = this.formValidate.address;
        addWareHouse(dic).then(res=>{
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
         param.warehouseName=this.formItem.input1 //name
         param.pageNum=this.pagesizea  //显示当前光标页
         param.status = 1 ;
         this.getSerch(param)
       },
       
       //查询接口
       getSerch(param){
         findWareHouse(param).then(res=>{
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
         this.formValidate.name = dic.warehouseName;
         this.formValidate.contacter = dic.contacts;
         this.formValidate.phone = dic.contactsPhone;
         this.formValidate.faxNo = dic.positionFax;
         this.formValidate.address = dic.warehouseAdress;

           
      // uploadListzips
        },
    },
    
    mounted(){
      //账户管理接口
     this.searchM();
    },
    
    created(){
   
    },
}

</script>

<style  <style lang="less">
.width_150 {
width: 600px;
}

</style>
