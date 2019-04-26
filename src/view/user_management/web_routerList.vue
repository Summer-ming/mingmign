/**页面router信息编辑 */
// todo 筛选多维数组，并且保留父级
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
                      <Button shape="circle" icon="md-refresh" @click="leftRefresh"></Button>
                 </Row>
                <Row style="margin-top:4px;">
                      <Button icon="md-add-circle" @click="addLeft"  >添加第一级页面</Button>
                      <br/>
                      <div style="margin-top:4px">
                        <Button :disabled="isDis"  v-model="left_add" @click="add_children">添加子节点</Button>
                      </div>
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
            <Input v-model="right_name" placeholder="请输入title" style="width:100px"/>
            <Input v-model="pid" placeholder="输入pid" style="width:100px"/>
            <Button type="primary" @click="right_search">查询</Button>
            <Button shape="circle" icon="md-refresh" @click="rightRefresh()"></Button>
          </Card>
          <Card style="margin-top:4px">
            <Table :disabled-hover="true" size="large" :border="true"   :columns="columns1" :data="data1"></Table>
            <Page @on-change="changePage" style="margin-top:10px" :page-size="pageSize"  :total="dataCount" show-total ></Page>
          </Card>
        </Col>
      </Row>
      <!-- 用于添加操作的modal -->
      <Modal 
        :title="leftAddTitle"
        width="1000"
        :styles="{top:'10px'}"
        v-model="left_addModal">
       <Form :model="addFirstForm" :label-width="100" inline>
         <FormItem  label="层级">
            <Input style="width:80px" v-model="addFirstForm.order"  />
         </FormItem>
         <FormItem label="path">
           <Input v-model="addFirstForm.path" />
         </FormItem>
        <FormItem label="name">
           <Input v-model="addFirstForm.name" />
         </FormItem>
         <FormItem label="icon">
           <Input v-model="addFirstForm.icon" />
         </FormItem>
         <FormItem label="title">
           <Input v-model="addFirstForm.title" />
         </FormItem>
         <FormItem label="notcache">
           <Input v-model="addFirstForm.notcache" />
         </FormItem>
         <FormItem label="showalways">
           <Input v-model="addFirstForm.showalways" />
         </FormItem>
         <FormItem label="access">
           <Input v-model="addFirstForm.access" />
         </FormItem>
         <FormItem label="href">
           <Input v-model="addFirstForm.href" />
         </FormItem>
         <FormItem label="hideinmenu">
           <Input v-model="addFirstForm.hideinmenu" />
         </FormItem>
         <br/>
         <FormItem label="component">
           <Input style="width:300px" v-model="addFirstForm.component" />
         </FormItem>
       </Form>
       <div slot="footer">
        <Button type="text" @click="modalCancel">取消</Button>
        <Button type="primary" @click="leftModalOK">添加</Button>
      </div>
      </Modal>
      <!-- 改名字使用的modal -->
      <Modal 
        title="修改节点信息"
        @on-ok="left_changeModal_ok"
        @on-cancel="left_changeModal_cancel"
        v-model="left_changeModal">
        <Form :label-width="90">
          <FormItem  label="节点名称">
            <Input v-model="left_changeModal_name"/>
          </FormItem>
          <FormItem label="节点英文名称">
            <Input  v-model="left_changeModal_ename"/>
          </FormItem>
        </Form>
      </Modal>
    
      <!-- //查询 和编辑基础信息使用的 modal -->
      <Modal :title="tableInfoTitle" 
      v-model="tableInfoModal"
      width="1000"
      :styles="{top:'10px'}"
      >
      <Form inline ref="changeFormValidate" :model="changeFormValidate" :rules="changeFormValidateRule" :label-width="120">
        <FormItem  label="层级">
            <Input style="width:80px" v-model="changeFormValidate.order"  />
         </FormItem>
         <FormItem label="path">
           <Input v-model="changeFormValidate.path" />
         </FormItem>
        <FormItem label="name">
           <Input v-model="changeFormValidate.name" />
         </FormItem>
         <FormItem label="icon">
           <Input v-model="changeFormValidate.icon" />
         </FormItem>
         <FormItem label="title">
           <Input v-model="changeFormValidate.title" />
         </FormItem>
         <FormItem label="notcache">
           <Input v-model="changeFormValidate.notcache" />
         </FormItem>
         <FormItem label="showalways">
           <Input v-model="changeFormValidate.showalways" />
         </FormItem>
         <FormItem label="access">
           <Input v-model="changeFormValidate.access" />
         </FormItem>
         <FormItem label="href">
           <Input v-model="changeFormValidate.href" />
         </FormItem>
         <FormItem label="hideinmenu">
           <Input v-model="changeFormValidate.hideinmenu" />
         </FormItem>
         <br/>
         <FormItem label="component">
           <Input style="width:300px" v-model="changeFormValidate.component" />
         </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="tableItemCancel">取消</Button>
        <Button v-show="isShow" type="primary" @click="changeTableItem">修改</Button>
      </div>
      </Modal>
      <!-- 更换岗位 -->
       <Modal title="更换岗位" 
      v-model="changeUserRoleModal"
      width="1000"
      :styles="{top:'10px'}"
      >
      <Form inline ref="changeUserRole" :model="changeUserRole" :rules="changeUserRoleRule" :label-width="120">
        <FormItem label="姓名" prop="name">
          <Input style="width:300px" v-model="changeUserRole.name" placeholder="请输入姓名"/>
        </FormItem>
        <br/>
        <FormItem label="原部门" >
          <Input style="width:300px" v-model="changeUserRole.oldDept" placeholder=""/>
        </FormItem>
        <FormItem label="原岗位" >
          <Input style="width:300px" v-model="changeUserRole.oldRole" placeholder=""/>
        </FormItem>
        <FormItem label="所属部门" prop="departmentName">
          <Select v-model="changeUserRole.departmentName" style="width:300px" @on-change="departMentChange">
            <Option v-for="item in deptArr" :value="JSON.stringify(item)" :key="item.deptId">{{item.deptCname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="选择岗位" prop="role">
          <Select v-model="changeUserRole.role" style="width:300px">
            <Option filterable v-for="item in roleArr" :value="JSON.stringify(item)" :key="item.roleId">{{item.roleCname}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalCancel">取消</Button>
        <Button type="primary" @click="changeRole">确定变更</Button>
      </div>
      </Modal>
  </div>
</template>
<script>
import {findVueRouter1,findVueRouter2,updateVueRouter,addVueRouter,   deleteRoleEmp,addRoleEmp,updateEmployee,addEmployee,findPersonnelRole,isNotItHaveRole,updatePersonnelDept,getUserList,findPersonnelDept,addPersonnelDept } from '@/api/data'

export default {
  data(){
    return {
      addFirstForm:{
        order:'',
        path:'',
        name:'',
        icon:'',
        title:'',
        notcache:'',
        name:'',
        showalways:'',
        access:'',
        href:'',
        hideinmenu:'',
        component:''
      },
      pid:'',
      leftAddTitle:'',
      choseDeptDic:'',
      choseRoleDic:'',
      deptArr:[],
      tableItem:'',
      isShow:false,
      tableInfoTitle:'',
      tableInfoModal:false,
      roleArr:[],
      departmentName:'',
      leftChoseDic:'',
      right_name:'',
      left_searchArr:[],
      left_input:'',
      addFirst:true,
      isDis:true,
      left_add:'',
      left_change:'',
      left_delete:'',
      left_addModal_input_ename:'',
      left_changeModal_ename:'',
      changeUserRoleModal:false,
      changeFormValidate:{
        order:'',
        path:'',
        name:'',
        icon:'',
        title:'',
        notcache:'',
        name:'',
        showalways:'',
        access:'',
        href:'',
        hideinmenu:'',
        component:''
      },
      changeUserRole:false,
      changeUserRole:{
      },
      addFormValidate:{
      },
      changeUserRoleRule:{
      },
      changeFormValidateRule:{
      },
      addFormValidateRule:{
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
      columns1:[{ //列表
        title:'ID',
        key:'id',
        width:90,
        fixed:'left'
      },{
        title:'pid',
        key:'pid',
        width:90,
        fixed:'left'
      },{
        title:'title',
        key:'title',
        width:100
      },{
        title:'orders',
        key:'orders',
        width:100
      },{
        title:'path',
        key:'path',
        width:100
      },{
        title:'name',
        key:'name',
        width:100
      },{
        title:'icon',
        key:'icon',
        width:100
      },{
        title:'notcache',
        key:'notcache',
        width:100
      },{
        title:'showalways',
        key:'showalways',
        width:100
      },{
        title:'access',
        key:'access',
        width:100
      },{
        title:'href',
        key:'href',
        width:100
      },{
        title:'hideinmenu',
        key:'hideinmenu',
        width:100
      },{
        title:'create_time',
        key:'createTime',
        width:200
      },{
        title:'操作',
        key:'actions',
        fixed:'right',
        width:200,
        render:(h,params) =>{
          return h('div',[
            h('Button',{
              props:{
                size:'small'
              },
              style:{
              
              },
              on:{
                click:() =>{
                  //  查看
                  this.tableItem = params.row;
                  this.tableInfoTitle = "查看页面信息"
                  this.tableInfoModal = true;
                  this.letModalItemValue();
                  

                }
              }
            },'查看'),
            h('Button',{
              props:{
                size:'small'
              },
              style:{
                marginLeft:'2px'
              },
              on:{
                click:()=>{
                  // 编辑信息
                    this.isShow = true;
                    this.tableItem = params.row;
                    this.tableInfoTitle = '编辑页面信息'
                    this.tableInfoModal = true;
                    this.letModalItemValue();
                }
              }
            },'编辑'),
            h('Button',{
              props:{
                type:'error',
                ghost:true,
                size:'small'
              },
              style:{
                marginLeft:'2px'
              },
              on:{
                click:()=>{
                  this.tableItem = params.row;
                  this.$Modal.confirm({
                    title:"确定需要删除吗:"+this.tableItem.title,
                    onOk:()=>{
                      let param = {};
                        let updateEmployeeList = [];
                        let dic = {};
                        dic.id = this.tableItem.id;
                        dic.status = "0";
                        updateEmployeeList.push(dic);
                        param.updateEmployeeList = updateEmployeeList;
                        updateVueRouter(param).then(res=>{
                          if(res.code =="100"){
                            this.$Notice.success({
                              title:'删除成功'
                            })
                            this.rightRefresh();
                            this.leftRefresh();
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
            },'删除')
          ])
        }
      }]
    }
  },
  methods:{
    letModalItemValue(){//给changeFormValidate 赋值
        this.changeFormValidate.order = this.tableItem.orders; 
                  this.changeFormValidate.path  = this.tableItem.path;
                  this.changeFormValidate.name= this.tableItem.name;
                  this.changeFormValidate.icon= this.tableItem.icon;
                  this.changeFormValidate.title= this.tableItem.title;
                  this.changeFormValidate.notcache= this.tableItem.notcache;
                  this.changeFormValidate.name= this.tableItem.name;
                  this.changeFormValidate.showalways= this.tableItem.showalways;
                  this.changeFormValidate.access= this.tableItem.access;
                  this.changeFormValidate.href= this.tableItem.href;
                  this.changeFormValidate.hideinmenu= this.tableItem.hideinmenu;
                  this.changeFormValidate.component= this.tableItem.component;
    },
    changeRole(){ //todo
     
      this.$refs['changeUserRole'].validate((valid)=>{
        if(valid){
             //部门也需要变更 岗位也需要变更
              //选中的部门 信息
              let param = {};
              let updateEmployeeList = [];
              let dic = {};
              dic.id = this.tableItem.id;
              dic.departmentId  = this.choseDeptDic.deptId;
              dic.departmentName   = this.choseDeptDic.deptCname;
              updateEmployeeList.push(dic);
              param.updateEmployeeList = updateEmployeeList;
              updateEmployee(param).then(res=>{
                if(res.code =="100"){
                  this.$Notice.success({
                    title:'修改部门成功'
                  })
                  this.deleteRole();
                }else{
                  this.$Notice.error({
                    title:"修改部门失败"
                  })
                }
              })
              //选中 的岗位信息
              let roleDic = JSON.parse(this.changeUserRole.role);
              console.log("roleDic");
              
        }else{

        }
      })
      
    },
    deleteRole(){
      let param = {};
      param.empId = this.tableItem.id;
               deleteRoleEmp(param).then(res=>{
                 this.addNewRole();
                  if(res.code =="100"){

                  this.$Notice.success({
                    title:'删除旧的岗位成功'
                  })
                }else{
                  this.$Notice.error({
                    title:"删除旧的岗位成功"
                  })
                }
               })     
    },
    addNewRole(){
      let roleDic = JSON.parse(this.changeUserRole.role);

                          let parama = {};
                          parama.roleId = roleDic.roleId;
                          parama.empId = this.tableItem.id;
                          addRoleEmp(parama).then(res=>{
                            if(res.code =="100"){
                              this.$Notice.success({
                                title:"绑定新岗位成功"
                              })
                              this.modalCancel();
                              this.rightRefresh();
                            }else{
                              this.$Notice.error({
                                title:"绑定新岗位失败,请再次尝试"
                              })
                            }
                          })
    },
    departMentChange(data){ //todo
      console.log("选中了部门");
      let dic = JSON.parse(data);
      this.choseDeptDic = dic;
      console.log(dic);
          let param = {};
          param.pageNum = 1;
          param.pageSize = this.pageSize;
          param.roleStatus = "1";
          param.roleDeptInfoId = dic.deptId;
          findPersonnelRole(param).then(res=>{
            if(res.code =='100'){
                this.$Message.success({
                  content:'获取岗位数据成功'
              })
                this.roleArr = res.data.list;
              }else{
                  this.$Message.error({
                    content:'获取数据失败:'+res.code+':'+res.msg
                  })
              }
          })
    },
    changeTableItem(){
      let param = {};
      let updateEmployeeList = [];
      let dic = {};
      dic.id = this.tableItem.id;
      dic.order   = this.changeFormValidate.order;
      dic.path     = this.changeFormValidate.path;
      dic.name   = this.changeFormValidate.name;
      dic.icon   = this.changeFormValidate.icon;
      dic.title  = this.changeFormValidate.title;
      dic.notcache   = this.changeFormValidate.notcache;
      dic.name   = this.changeFormValidate.name;
      dic.showalways   = this.changeFormValidate.showalways;
      dic.access   = this.changeFormValidate.access;
      dic.href   = this.changeFormValidate.href;
      dic.hideinmenu   = this.changeFormValidate.hideinmenu;
      dic.component   = this.changeFormValidate.component;

      updateEmployeeList.push(dic);
      param.updateEmployeeList = updateEmployeeList;
      updateVueRouter(param).then(res=>{
        if(res.code =="100"){
          this.tableInfoModal = false;
          this.$Notice.success({
            title:'修改成功'
          })
          this.getLeftTreeData();
          this.rightRefresh();
        }else{
          this.$Notice.error({
            title:"修改失败"
          })
        }
      })
    },
    tableItemCancel(){
      this.tableInfoModal =false;
    },
    right_search(){
      // right_name
      this.getRightTableData();
    },
    add_children(){
      this.left_addModal = true;
      this.addFirst =false;
    },
    showDeleteModal(){
    },
    tree_on_select_change(arr){  //todo
      console.log("点击了tree");
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      this.leftChoseDic = clickarr[0].attr;
      this.isDis = false;
      this.addFirst = false;
      this.right_name = this.leftChoseDic.title;
      this.leftAddTitle = "添加子节点页面"

    },
    modalCancel(){
      this.$Modal.remove();
      this.changeUserRoleModal =false;
      this.left_addModal = false;
    },
    // 添加新员工
    addModalOk(){
      console.log("确认添加"+this.$refs.addFormValidate.validate());
      this.$refs['addFormValidate'].validate((valid) => {
                    console.log(valid);
                    if (valid) {
                      //验证成功可以添加
                      let param = {};
                      param.cname = this.addFormValidate.name;
                      param.ename = this.addFormValidate.ename;
                      param.passWord = '123456';
                      param.sex = this.addFormValidate.sex;
                      param.phone = this.addFormValidate.phone;
                      param.mobile = this.addFormValidate.mobile;
                      param.email = this.addFormValidate.email;
                      param.departmentId = this.leftChoseDic.deptId;
                      param.departmentName =this.leftChoseDic.deptCname;

                      param.createCname = this.userInfo.cname;
                      param.createEname = this.userInfo.ename;
                      addEmployee(param).then(res=>{
                        if(res.code =="100"){
                          //绑定角色                        }else{  
                          let empid = res.data.id;
                          let roleDic = JSON.parse(this.addFormValidate.role);
                          let parama = {};
                          parama.roleId = roleDic.roleId;
                          parama.empId = empid;
                          this.right_add_modal = false;
                          addRoleEmp(parama).then(res=>{
                            if(res.code =="100"){
                              this.$Notice.success({
                                title:"绑定岗位成功"
                              })
                            }else{
                              this.$Notice.error({
                                title:"绑定岗位失败,请手动绑定岗位"
                              })
                            }
                          })
                        }else{
                          this.$Notice.error({
                            title:"添加失败"
                          })
                        }
                      })

                    } else {
                    }
                })

    },
    addUser(){
      this.right_add_modal = true;
    },
    addLeft(){
      this.left_addModal = true;
      this.addFirst = true;
      this.leftAddTitle = "添加第一层页面"
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
    leftModalOK(){//todo
      if(this.addFirst){
            let param = {};
            param.pid = 0;
            param.order      = this.addFirstForm.order;
            param.path      = this.addFirstForm.path;
            param.name      = this.addFirstForm.name;
            param.icon      = this.addFirstForm.icon;
            param.title      = this.addFirstForm.title;
            param.notcache      = this.addFirstForm.notcache;
            param.showalways      = this.addFirstForm.showalways;
            param.access      = this.addFirstForm.access;
            param.href      = this.addFirstForm.href;
            param.hideinmenu      = this.addFirstForm.hideinmenu;
            param.component      = this.addFirstForm.component;
            addVueRouter(param).then(res=>{
              if(res.code =="100"){
                this.$Notice.success({
                  title:"添加成功"
                })
                this.modalCancel();
                this.getRightTableData();
              }else{
                this.$Notice.error({
                  title:'添加失败'+res.msg
                })
              }
            })
      }else{
            let param = {};
            param.pid = this.leftChoseDic.id;
            param.order      = this.addFirstForm.order;
            param.path      = this.addFirstForm.path;
            param.name      = this.addFirstForm.name;
            param.icon      = this.addFirstForm.icon;
            param.title      = this.addFirstForm.title;
            param.notcache      = this.addFirstForm.notcache;
            param.showalways      = this.addFirstForm.showalways;
            param.access      = this.addFirstForm.access;
            param.href      = this.addFirstForm.href;
            param.hideinmenu      = this.addFirstForm.hideinmenu;
            param.component      = this.addFirstForm.component;
            addVueRouter(param).then(res=>{
              if(res.code =="100"){
                this.$Notice.success({
                  title:"添加成功"
                })
                this.modalCancel();
                this.rightRefresh();
                this.getLeftTreeData();
              }else{
                this.$Notice.error({
                  title:'添加失败'+res.msg
                })
              }
            })
      }
     
    },
    leftModalCancel(){

    },
    // 左侧搜索
    leftSearch(){  
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
      console.log("当前的页码数"+index);
      this.searchPage = index;
      this.getRightTableData();
    },
    leftRefresh(){
      this.left_input = "";
      this.getLeftTreeData();
    },
    rightRefresh(){
      this.right_name  = '';
      this.pid = '';
      this.getRightTableData();
    },
    getRightTableData(){
          let param = {};
          param.pageNum = this.searchPage;
          param.pageSize = this.pageSize;
          param.status = "1";
          param.title = this.right_name;
          param.pid = this.pid;
          findVueRouter1(param).then(res=>{
            if(res.code =='100'){
                this.isDis = true;
                this.dataCount = res.data.total;
                this.data1 = res.data.list;
              }
          })
    },
    // 获取数据 tree 
    getLeftTreeData(key){
      let param = {};
      param.pageNum = "1";
      param.pageSize = '10000';
      param.deptCname = key;
      param.status = 1;
      findVueRouter2(param).then(res=>{
       
        if(res.code =="100"){
          let dealArr = [];
          this.isDis = true;
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
          this.deptArr.push(item);

          let obj = {};
          obj.title = item.title+' '+item.orders;
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
    this.getRightTableData();
    this.getLeftTreeData();
  }
}
</script>
