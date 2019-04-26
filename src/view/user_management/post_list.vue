<!--
 * @Description: 组织岗位
 * @Author: 王斌
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-20 17:25:46
 * @LastEditTime: 2019-03-21 10:58:04
 -->
/**岗位管理 */

<template>
  <div>
      <!-- 左侧顶部按钮 -->
      <Row :gutter="4" >
        <Col  span="8" >
          <Row >
               <Card  :bordered="true">
                 <Row>
                      <Input v-model="left_input" placeholder="输入关键字查询" style="width:120px"/>
                      <Button type="primary" @click="leftSearch">查询</Button>
                      <Button shape="circle" icon="md-refresh" @click="reloadSelf()"></Button>
                 </Row>
               </Card>
               <!-- 组织结构图 -->
               <Card  :bordered="true" style="margin-top:4px;">
                 <Tree ref="leftTree"   :data="leftDataNew" @on-select-change="tree_on_select_change" ></Tree>
               </Card>
          </Row>
       
        </Col>
        <Col span="16">
          <Card :bordered="true">
            <Button :disabled="isDis" icon="md-add-circle" @click="addUser">添加岗位</Button>
            <Input v-model="right_name" placeholder="请输入岗位姓名" style="width:100px"/>
            <Button type="primary" @click="right_search">查询</Button>
            <Button shape="circle" icon="md-refresh" @click="reloadSelf()"></Button>
          </Card>
          <Card style="margin-top:4px">
            <Table size="large" :border="true"   :columns="columns1" :data="data1"></Table>
            <Page @on-change="changePage" :current="current_page" style="margin-top:10px" :page-size="pageSize"  :total="dataCount" show-total ></Page>
          </Card>
        </Col>
      </Row>
      <!-- 用于添加操作的modal -->
      <Modal 
        title="添加岗位"
        v-model="left_addModal">
       <Form :label-width="100">
         <FormItem  label="岗位名称">
            <Input v-model="left_addModal_input" placeholder="请输入岗位名称" />
         </FormItem>
         <FormItem label="岗位英文名称">
           <Input v-model="left_addModal_input_ename" placeholder="请输入岗位英文名称"/>
         </FormItem>
       </Form>
        <div slot="footer">
          <Button type="text" @click="leftModalCancel">取消</Button>
          <Button  type="primary" @click="leftModalOK">添加</Button>
      </div>
      </Modal>
      <!-- 改名字使用的modal -->
      <Modal 
        title="修改岗位名称"
        @on-ok="left_changeModal_ok"
        @on-cancel="left_changeModal_cancel"
        v-model="left_changeModal">
        <Form :label-width="90">
          <FormItem  label="岗位名称">
            <Input v-model="left_changeModal_name"/>
          </FormItem>
          <FormItem label="岗位英文名称">
            <Input  v-model="left_changeModal_ename"/>
          </FormItem>
        </Form>
      </Modal>
      <Modal title="添加新员工" 
      v-model="right_add_modal"
      @on-ok="addModalOk"
      ok-text="添加"
      width="1000"
      :styles="{top:'10px'}"
      >
      <Form inline ref="addFormValidate" :model="addFormValidate" :rules="addFormValidateRule" :label-width="120">
        <FormItem label="姓名" prop="name">
          <Input style="width:300px" v-model="addFormValidate.name" placeholder="请输入姓名"/>
        </FormItem>
        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="addFormValidate.sex">
            <Radio label="male">男</Radio>
            <Radio label="female">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="登录名" prop="ename">
          <Input style="width:300px" v-model="addFormValidate.ename" placeholder="请输入登录名称"/>
        </FormItem>
        <FormItem label="手机号码" prop="phone">
          <Input style="width:300px" v-model="addFormValidate.phone" placeholder="请输入手机号码"/>
        </FormItem>
        <FormItem label="座机号码" prop="mobile">
          <Input style="width:300px" v-model="addFormValidate.mobile" placeholder="请输入座机号码"/>
        </FormItem>
        <FormItem label="微信号码" prop="wetchat">
          <Input style="width:300px" v-model="addFormValidate.wetchat" placeholder="请输入微信号码"/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input style="width:300px" v-model="addFormValidate.email" placeholder="请输入邮箱"/>
        </FormItem>
        <br/>
        <FormItem label="岗位" props="post">
          <Input style="width:300px" v-model="addFormValidate.post" placeholder="请选择岗位"/>
        </FormItem>
      </Form>
      </Modal>
  </div>
</template>
<script>
import {findRoleEmp,updateRole,addRole,findPersonnelRole,isNotItHaveRole,updatePersonnelDept,getUserList,findPersonnelDept,addPersonnelDept } from '@/api/data'

export default {
  name:'post_list',
  inject:['reload'],
  data(){
    return {
      current_page:1,
      right_name:'',
      rigthChoseDic:'',
      left_searchArr:[],
      left_input:'',
      addFirst:true,
      isDis:true,
      left_add:'',
      left_change:'',
      left_delete:'',
      left_addModal_input_ename:'',
      left_changeModal_ename:'',
      addFormValidate:{
        name:'',
        ename:'',
        sex:'',
        phone:'',
        mobile:'',
        wetchat:'',
        email:'',
        post:''
      },
      addFormValidateRule:{
        name:[
          {required:true,message:'名字不可为空',trigger:'blur'}
        ],
        ename:[
          {required:true,message:'登录名称不可为空',trigger:'blur'}
        ],
        sex:[
          {required:true,message:'请选择性别',trigger:'blur'}
        ],
        post:[
          {required:true,message:'请确定岗位信息',trigger:'blue'}
        ]
      },
      right_add_modal:false,
      left_root:'',
      left_node:'',
      left_data:'',
      leftDataNew:[
      ],
      left_changeModal:false,
      left_changeModal_name:'',
      left_addModal:false,
      left_addModal_input:'',
      addData:'',
      searchPage:'1',
      dataCount:0,//总页数
      pageSize:10,
      data1:[],
      leftData: [
                    {
                        title: '集团',
                        expand: true,
                        render:(h,{root,node,data}) => {
                          return h('span',{
                            style:{
                              display:'inline-block',
                              width:'100%'
                            }
                          },[
                            h('span',[
                              h('Icon',{
                                props:{
                                  type:'ios-folder-outline'
                                },
                                style:{
                                  marginRight:'8px'
                                }
                              }),
                              h('span',data.title)
                            ]),
                            h('span',{
                              style:{
                                display:'inline-block',
                                float:'right',
                                marginRight:'32px'
                              }
                            },[
                              h('Button',{
                                props:Object.assign({},this.buttonProps,{
                                  icon:'ios-add',
                                  type:'primary'
                                }),
                                style:{
                                  width:'42px'
                                },
                                on:{
                                  click:() =>{this.append(data)}
                                }
                              })
                            ])
                          ]);
                        },
                        children: [
                            {
                                title: '上海市闽航电子商务有限公司(总部)',
                                expand: true,
                                children: [
                                    {
                                        title: '财务部',
                                        key:'12',
                                        expand:true,
                                        children:[{
                                          title:'财务总监'
                                        },{
                                          title:'会计'
                                        },{
                                          title:'结算专员'
                                        }]
                                    },
                                    {
                                        title: '运营部'
                                    }
                                ]
                            },
                            {
                                title: '福建省亿钢电子商务有限公司',
                                expand: true,
                                children: [
                                    {
                                        title: '财务部'
                                    },
                                    {
                                        title: '运营部'
                                    }
                                ]
                            }
                        ]
                    }
                ],
      columns1:[{
        title:'ID',
        key:'roleId',
        width:80,
        tooltip:true
      },{
        title:'岗位名称',
        key:'roleCname',
        width:100
      },{
        title:'所属部门',
        key:'roleDeptInfoCname',
        width:120
      },{
        title:'操作',
        key:'actions',
        width:230,
        render:(h,params) =>{
          return h('div',[
            h('Button',{
              props:{
                type:'info',
                ghost:true
              },
              style:{
                marginLeft:'10px'
              },
              on:{
                click:()=>{
                  this.rigthChoseDic = params.row;
                  // 编辑信息
                  this.left_changeModal = true;

                  this.left_changeModal_name = this.rigthChoseDic.roleCname;
                  this.left_changeModal_ename = this.rigthChoseDic.roleEname;
                }
              }
            },'编辑'),
            h('Button',{
              props:{
                type:'error',
                ghost:true
              },
              style:{
                marginLeft:'10px'
              },
              on:{
                click:()=>{
                  this.rigthChoseDic = params.row;
                  let param = {};
                  param.roleId = this.rigthChoseDic.roleId;
                  findRoleEmp(param).then(res=>{
                    if(res.code =="100"){
                      this.showDeleteModal();
                      }else{
                      this.$Notice.error({
                          title:'当前岗位存在正在使用的人员，不可删除'
                        })
                      }
                  })
                }
              }
            },'删除')
          ])
        }
      }]
    }
  },
  methods:{
    reloadSelf(){//刷新当前页面
      this.reload();
    },
    right_search(){//查询右边岗位数据
      this.getRightTableData('',this.right_name);
    },
    add_children(){
      this.left_addModal = true;
      this.addFirst =false;
    },
    change_tree(){
      this.left_changeModal = true;
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      let dic = clickarr[0].attr;
      this.left_changeModal_name = dic.deptCname;
      this.left_changeModal_ename = dic.deptEname;
      
    },
    delete_tree(){//todo 删除
  
    },
    showDeleteModal(){
      // rigthChoseDic
      this.$Modal.confirm({
        title:'确定删除:'+this.rigthChoseDic.roleCname,
        onOk:()=>{
            let param = {};
            param.roleId = this.rigthChoseDic.roleId;
            param.status = '0';
            updateRole(param).then(res=>{
            if(res.code =="100"){
              this.$Notice.success({
                title:'删除成功'
              });
              this.getRightTableData();
            }else{
              this.$Notice.error({
                title:'删除失败'
              })
            }
          })
        },
        
      })
    },
    tree_on_select_change(arr){
      this.isDis = false;//添加岗位按钮可用
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      let dic = clickarr[0].attr;
      this.getRightTableData(dic.deptId);
    },
    // 添加新员工
    addModalOk(){
      console.log("确认添加"+this.$refs.addFormValidate.validate());
      this.$refs['addFormValidate'].validate((valid) => {
                    console.log(valid);
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })

    },
    addUser(){
      this.left_addModal = true;
    },
    addLeft(){
      this.left_addModal = true;
      this.addFirst = true;
    },
    /** tree的全局渲染 */
    renderTree(h,{root,node,data}){
      return h('div',{
        style:{
          display:'inline-block',
          width:'100%'
        }
        
      },[
        h('span',[
          h('Icon',{
            props:{
              type:'ios-paper-outline'
            },
            style:{
              marginRight:'8px'
            }
          }),
          h('span',data.title)
        ]),
        h('span',{
          style:{
            display:'inline-block',
            float:'right',
            marginRight:'32px'
          }
        },[
          h('Button',{
            props:Object.assign({},this.buttonProps,{
              size:'small'
            }),
            style:{
              marginRight:'4px'
            },
            on:{
              click:() => {this.append(data)}
            }
          },'添加'),
          h('Button',{
            props: Object.assign({},this.buttonProps,{
              size:'small'
            }),
            style:{
              marginRight:'4px'
            },
            on:{
              click:() => {
                
              }
            }
          },'查看'),
           h('Button',{
            props: Object.assign({},this.buttonProps,{
              size:'small'
            }),
            style:{
              marginRight:'4px'
            },
            on:{
              click:() => {
                this.left_changeModal = true;
                this.change_leftInfo(root,node,data);
              }
            }
          },'删除'),
           h('Button',{
            props: Object.assign({},this.buttonProps,{
              size:'small'
            }),
            on:{
              click:() => {
                this.left_changeModal = true;
                this.change_leftInfo(root,node,data);
              }
            }
          },'改名')
        ])
      ]);
    },
    // 改名点击事件
    change_leftInfo(root,node,data){
          console.log(data.title);
          this.left_changeModal_name = data.title;
          let children = data.children || [];
          this.left_root = root;
          this.left_node = node;
          this.left_data = data;
    },
    left_changeModal_ok(){ 
      // let clickarr = this.$refs.leftTree.getSelectedNodes();
      // let dic = clickarr[0].attr;
      let param = {};
      param.roleId = this.rigthChoseDic.roleId;
      param.roleCname = this.left_changeModal_name;
      param.roleEname = this.left_changeModal_ename;
      updateRole(param).then(res=>{
        if(res.code =="100"){
          this.$Notice.success({
            title:"修改成功"
          })
          this.getRightTableData();
        }else{
          this.$Notice.error({
            title:'修改失败'+res.msg
          })
        }
      })
    },
    left_changeModal_cancel(){

    },
    append(data){
      this.addData = data;
      this.left_addModal = true;
    },
    remove(root,node,data){
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index,1);
    },
    leftModalOK(){
            let clickarr = this.$refs.leftTree.getSelectedNodes();
            let dic = clickarr[0].attr;
            let param = {};
            param.roleEname = this.left_addModal_input_ename;
            param.roleCname = this.left_addModal_input;
            param.deptId = dic.deptId;
            param.deptEname = dic.deptEname;
            param.deptCname = dic.deptCname;
            param.createEname = this.$global.adminInfo.ename;
            param.createCname = this.$global.adminInfo.cname;
            addRole(param).then(res=>{
              if(res.code =="100"){
                this.$Notice.success({
                  title:"添加成功"
                })
                this.getRightTableData(dic.deptId);
              }else{
                this.$Notice.error({
                  title:'添加失败'+res.msg
                })
              }
            })
            this.left_addModal = false;
    },
    leftModalCancel(){
      this.left_addModal = false;
    },
    // 左侧搜索
    leftSearch(){ //todo 
      console.log("开始搜索组织架构"+this.left_input);
      // this.left_input
      // this.leftDataNew = newLeftArr;
      let newArr = [];
      this.left_searchArr = [];
      this.consoleArrAll(this.leftDataNew);
      console.log(this.left_searchArr);
      this.leftDataNew = this.left_searchArr;
    },
    consoleArrAll(tree){
      if(!!tree && tree.length !== 0){
        tree.forEach(item =>{
          this.consoleArrAll(item.children);
           if(item.title.indexOf(this.left_input) != -1 ){
            //说明有
            this.left_searchArr.push(item);
          }else{
          }
        })
      }
    },
    changePage(index){
      this.searchPage = index;
      this.getRightTableData();
    },
    getRightTableData(key,name){//查询右边岗位数据
          this.data1 = [];

          let param = {};
          param.pageNum = this.searchPage;
          param.pageSize = 10;
          param.roleStatus = "1";
           let clickarr = this.$refs.leftTree.getSelectedNodes();
           if(clickarr.length>0){
            let dic = clickarr[0].attr;
            key = dic.deptId;
           }
          param.roleDeptInfoId = key?key:'';
          param.roleCname = name?name:'';
          findPersonnelRole(param).then(res=>{
            if(res.code =='100'){
                this.$Message.success({
                  content:'获取岗位数据成功'
              })
                this.dataCount = res.data.total;
                this.data1 = res.data.list;
              }else{
                  this.dataCount = 0;
                  this.current_page = 1;
                  this.searchPage   = 1;
                  this.$Message.error({
                    content:'获取数据失败:'+res.code+':'+res.msg
                  })
              }
          })
    },
    // 获取数据 tree todo
    getLeftTreeData(key){
      let param = {};
      param.pageNum = "1";
      param.pageSize = '10000';
      param.deptCname = key;
      findPersonnelDept(param).then(res=>{
       
        if(res.code =="100"){
          let dealArr = [];
           this.$Message.success({
            content:'获取数据成功'
            })
          dealArr = this.getTree(res.data.list)
          this.leftDataNew = dealArr;
        }else{
          this.$Message.error({
            content:'获取数据失败:'+res.code+':'+res.msg
          })
        }
      })
    },
    // 拼接tree数据
    getTree(tree ){
      let arr = [];
      if(!!tree && tree.length !== 0){
        tree.forEach(item => {
          let obj = {};
          obj.title = item.deptCname;
          obj.attr = item;//其他想要添加的属性
          obj.expand = true;
          obj.selected = false;
          obj.children = this.getTree(item.children);
          arr.push(obj);
        });
      }
      return arr;
    }
  },
  created(){
    this.getLeftTreeData();
  }
}
</script>