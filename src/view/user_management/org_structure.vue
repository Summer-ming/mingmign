<!--
 * @Description: 组织架构
 * @Author: 王斌
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-20 17:25:46
 * @LastEditTime: 2019-12-04 15:36:54
 -->
/**组织架构 */
// 筛选多维数组，并且保留父级

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
                      <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
                 </Row>
                <Row style="margin-top:4px;">
                      <Button icon="md-add-circle" @click="addLeft"  >添加第一层级组织结构</Button>
                      <br/>
                      <div style="margin-top:4px">
                        <Button :disabled="isDis"  v-model="left_add" @click="add_children">添加子节点</Button>
                        <Button :disabled="isDis" v-model="left_change" @click="change_tree">修改</Button>
                        <Button :disabled="isDis" v-model="left_delete" type="error" @click="delete_tree">删除</Button>
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
            <Button :disabled="isDis" icon="md-add-circle" @click="addUser">添加员工</Button>
            <Input v-model="right_name" placeholder="请输入员工姓名" style="width:100px"/>
            <Button type="primary" @click="right_search">查询</Button>
            <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
          </Card>
          <Card style="margin-top:4px">
            <Table :disabled-hover="true" size="large" :border="true"   :columns="columns1" :data="data1"></Table>
            <Page @on-change="changePage" style="margin-top:10px" :page-size="pageSize"  :total="dataCount" show-total ></Page>
          </Card>
        </Col>
      </Row>
      <!-- 用于添加操作的modal -->
      <Modal 
        title="添加节点"
        @on-ok="leftModalOK"
        @on-cancel="leftModalCancel"
        v-model="left_addModal">
       <Form :label-width="100">
         <FormItem  label="节点名称">
            <Input v-model="left_addModal_input" placeholder="请输入节点名称" />
         </FormItem>
         <FormItem label="节点英文名称">
           <Input v-model="left_addModal_input_ename" placeholder="请输入节点英文名称"/>
         </FormItem>
       </Form>
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
      <!-- 添加新员工 -->
      <Modal title="添加新员工" 
      v-model="right_add_modal"
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
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
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
        <FormItem label="邮箱" prop="email">
          <Input style="width:300px" v-model="addFormValidate.email" placeholder="请输入邮箱"/>
        </FormItem>
        <br/>
        <FormItem label="所属部门">
          <Input style="width:300px" disabled v-model="departmentName"/>
        </FormItem>
        <FormItem label="选择岗位" prop="role">
          <Select v-model="addFormValidate.role" style="width:300px">
            <Option filterable v-for="(item,index) in roleArr" 
            :value="JSON.stringify(item)" 
            :key="index">{{item.roleCname}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalCancel">取消</Button>
        <Button type="primary" @click="addModalOk">添加</Button>
      </div>
      </Modal>
      <!-- //查询 和编辑基础信息使用的 modal -->
      <Modal :title="tableInfoTitle" 
      v-model="tableInfoModal"
      width="1000"
      :styles="{top:'10px'}"
      >
      <Form inline ref="changeFormValidate" :model="changeFormValidate" :rules="changeFormValidateRule" :label-width="120">
        <FormItem label="姓名" prop="name">
          <Input style="width:300px" v-model="changeFormValidate.name" placeholder="请输入姓名"/>
        </FormItem>
        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="changeFormValidate.sex">
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="登录名" prop="ename">
          <Input style="width:300px" v-model="changeFormValidate.ename" placeholder="请输入登录名称"/>
        </FormItem>
        <FormItem label="手机号码" prop="phone">
          <Input style="width:300px" v-model="changeFormValidate.phone" placeholder="请输入手机号码"/>
        </FormItem>
        <FormItem label="座机号码" prop="mobile">
          <Input style="width:300px" v-model="changeFormValidate.mobile" placeholder="请输入座机号码"/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input style="width:300px" v-model="changeFormValidate.email" placeholder="请输入邮箱"/>
        </FormItem>
        <FormItem>

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
            <Option v-for="(item,index) in deptArr"
             :value="JSON.stringify(item)"
             :key="index">{{item.deptCname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="选择岗位" prop="role">
          <Select v-model="changeUserRole.role" style="width:300px">
            <Option filterable 
            v-for="(item,index) in roleArr" 
            :value="JSON.stringify(item)" 
            :key="index " >{{item.roleCname}}</Option>
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
import {deleteRoleEmp,addRoleEmp,updateEmployee,addEmployee,findPersonnelRole,isNotItHaveRole,updatePersonnelDept,getUserList,findPersonnelDept,addPersonnelDept } from '@/api/data'
import { getUserInfo } from '@/libs/util.js'

export default {
  name:'org_structure',
  inject:['reload'],
  data(){
    return {
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
         name:'',
        ename:'',
        sex:'',
        phone:'',
        mobile:'',
        wetchat:'',
        email:'',
        post:'',
        role:'',
        oldDept:'',
        oldRole:''
      },
      changeUserRole:false,
      changeUserRole:{
        name:'',
        ename:'',
        sex:'',
        phone:'',
        mobile:'',
        wetchat:'',
        email:'',
        post:'',
        role:'',
        dept:'',
        departmentName:''
      },
      addFormValidate:{
        name:'',
        ename:'',
        sex:'',
        phone:'',
        mobile:'',
        wetchat:'',
        email:'',
        post:'',
        role:''
      },
      changeUserRoleRule:{
        departmentName:[
          {required:true,message:'请选择部门',trigger:'blue'}
          ],
          role:[
            {required:true,message:'请选择岗位',trigger:'blue'}
          ]
      },
      changeFormValidateRule:{
         name:[
          {required:true,message:'名字不可为空',trigger:'blur'}
        ],
        ename:[
          {required:true,message:'登录名称不可为空',trigger:'blur'}
        ],
        sex:[
          {required:true,message:'请选择性别',trigger:'blur'}
        ]
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
        ],
        role:[
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
      columns1:[{
        title:'ID',
        key:'id',
        width:90,
        fixed:'left'
      },{
        title:'姓名',
        key:'cname',
        width:100
      },{
        title:'部门',
        key:'departmentName',
        width:120
      },{
        title:'岗位',
        key:'roleCname',
        width:100
      },{
        title:'性别',
        key:'sex',
        width:50
      },{
        title:'手机号码',
        key:'phone',
        width:140
      },{
        title:'email',
        key:'email',
        width:180
      },{
        title:'操作',
        key:'actions',
        fixed:'right',
        width:280,
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
                  this.tableInfoTitle = "查看员工信息"
                  this.tableInfoModal = true;
                  
                  this.changeFormValidate.name =    this.tableItem.cname;
                  this.changeFormValidate.sex =     this.tableItem.sex;
                  this.changeFormValidate.ename =   this.tableItem.ename;
                  this.changeFormValidate.phone =   this.tableItem.phone;
                  this.changeFormValidate.mobile =  this.tableItem.mobile;
                  this.changeFormValidate.email =   this.tableItem.email;

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
                    this.tableInfoTitle = '编辑员工信息'
                    this.tableInfoModal = true;

                    this.changeFormValidate.name = this.tableItem.cname;
                    this.changeFormValidate.sex = this.tableItem.sex;
                    this.changeFormValidate.ename = this.tableItem.ename;
                    this.changeFormValidate.phone = this.tableItem.phone;
                    this.changeFormValidate.mobile = this.tableItem.mobile;
                    this.changeFormValidate.email = this.tableItem.email;
                }
              }
            },'编辑基础信息'),
             h('Button',{
              props:{
                size:'small'
              },
              style:{
                marginLeft:'2px'
              },
              on:{
                click:()=>{
                  // 编辑信息  view

                  this.changeUserRoleModal =true;
                  this.tableItem = params.row;
                  this.changeUserRole.name = this.tableItem.cname;
                  this.changeUserRole.oldDept = this.tableItem.departmentName;
                  this.changeUserRole.oldRole = this.tableItem.roleCname;

                }
              }
            },'编辑岗位'),
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
                    title:"确定需要删除吗",
                    onOk:()=>{
                      let param = {};
                        let updateEmployeeList = [];
                        let dic = {};
                        dic.id = this.tableItem.id;
                        dic.status = "0";
                        updateEmployeeList.push(dic);
                        param.updateEmployeeList = updateEmployeeList;
                        updateEmployee(param).then(res=>{
                          if(res.code =="100"){
                            this.$Notice.success({
                              title:'删除成功'
                            })
                            this.getRightTableData();
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
            },'删除'),
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
                    this.tableItem = params.row;
                    this.$Modal.confirm({
                      title:'确定要重置密码吗',
                      onOk:()=>{
                        // 重置密码使用
                        let param = {};
                        let updateEmployeeList = [];
                        let dic = {};
                        dic.id = this.tableItem.id;
                        dic.passWord = "123456";
                        updateEmployeeList.push(dic);
                        param.updateEmployeeList = updateEmployeeList;
                        updateEmployee(param).then(res=>{
                          if(res.code =="100"){
                            this.$Notice.success({
                              title:'修改成功'
                            })
                          }else{
                            this.$Notice.error({
                              title:'修改失败'
                            })
                          }
                        })
                      },
                    })
                }
              }
            },'重置密码'),
          ])
        }
      }]
    }
  },
  methods:{
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
          param.pageSize = 10000;
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
      dic.cname   = this.changeFormValidate.name;
      dic.sex     = this.changeFormValidate.sex;
      dic.ename   = this.changeFormValidate.ename;
      dic.phone   = this.changeFormValidate.phone;
      dic.mobile  = this.changeFormValidate.mobile;
      dic.email   = this.changeFormValidate.email;
      updateEmployeeList.push(dic);
      param.updateEmployeeList = updateEmployeeList;
      updateEmployee(param).then(res=>{
        if(res.code =="100"){
          this.tableInfoModal = false;
          this.$Notice.success({
            title:'修改成功'
          })
          this.getRightTableData();
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
    change_tree(){
      console.log("左侧修改")
      this.left_changeModal = true;
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      let dic = clickarr[0].attr;
      this.left_changeModal_name = dic.deptCname;
      this.left_changeModal_ename = dic.deptEname;
      
    },
    delete_tree(){ 
      // 删除先判断
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      let dic = clickarr[0].attr;
      let param = {};
      param.roleDeptInfoId = dic.deptId;
      isNotItHaveRole(param).then(res=>{
        if(res.code =="100"){
          this.showDeleteModal();
        }else{
          this.$Notice.error({
            title:'当前部门存在正在使用的岗位，不可删除'
          })
        }
      })
    },
    showDeleteModal(){
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      let dic = clickarr[0].attr;
      this.$Modal.confirm({
        title:'确定删除:'+dic.deptCname,
        onOk:()=>{
            let clickarr = this.$refs.leftTree.getSelectedNodes();
            let dic = clickarr[0].attr;
            let param = {};
            param.deptId = dic.deptId;
            param.deptStatus = '0';
            updatePersonnelDept(param).then(res=>{
            if(res.code =="100"){
              this.$Notice.success({
                title:'删除成功'
              });
              this.getLeftTreeData();
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
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      if(clickarr.length == 0){
        console.log("点击取消")
        return false;
      }
      this.leftChoseDic = clickarr[0].attr;
      this.isDis = false;
      this.departmentName = this.leftChoseDic.deptCname;
      
      //  获取改部门下的岗位
      let param = {};
      param.roleDeptInfoId = this.leftChoseDic.deptId;
      param.pageSize = '10000';
      findPersonnelRole(param).then(res=>{
        if(res.code =="100"){
          this.roleArr = res.data.list;
        }
      })
    },
    modalCancel(){
      this.$Modal.remove();
      this.right_add_modal = false;
      this.changeUserRoleModal =false;
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

                      param.createCname = this.$global.adminInfo.cname;
                      param.createEname = this.$global.adminInfo.ename;
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
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      let dic = clickarr[0].attr;
      let param = {};
      param.deptId = dic.deptId;
      param.deptCname = this.left_changeModal_name;
      param.deptEname = this.left_changeModal_ename;
      updatePersonnelDept(param).then(res=>{
        if(res.code =="100"){
          this.$Notice.success({
            title:"修改成功"
          })
          this.getLeftTreeData();
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
      if(this.addFirst){
            let param = {};
            param.deptEname = this.left_addModal_input_ename;
            param.deptCname = this.left_addModal_input;
            param.deptPid = 0;
            param.deptLeader = 0;
      
            param.deptCreateEname = this.$global.adminInfo.ename;
            param.deptCreateCname = this.$global.adminInfo.cname;
            console.log(param);
            // param. this.userInfo.id;
            //   param.applicantName       = this.userInfo.cname;
            addPersonnelDept(param).then(res=>{
              if(res.code =="100"){
                this.$Notice.success({
                  title:"添加成功"
                })
                this.getLeftTreeData();
              }else{
                this.$Notice.error({
                  title:'添加失败'+res.msg
                })
              }
            })
      }else{
            let clickarr = this.$refs.leftTree.getSelectedNodes();
            let dic = clickarr[0].attr;
            let param = {};
            param.deptEname = this.left_addModal_input_ename;
            param.deptCname = this.left_addModal_input;
            param.deptPid = dic.deptId;
            param.deptLeader = dic.deptId;

            param.deptCreateEname = this.$global.adminInfo.ename;
            param.deptCreateCname = this.$global.adminInfo.cname;
            // param. this.userInfo.id;
            //   param.applicantName       = this.userInfo.cname;
            addPersonnelDept(param).then(res=>{
              if(res.code =="100"){
                this.$Notice.success({
                  title:"添加成功"
                })
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
    rightRefresh(){
      this.right_name  = '';
      this.getRightTableData();
    },
    getRightTableData(){
          let param = {};
          param.pageNum = this.searchPage;
          param.cname = this.right_name;
          param.status = "1";
          getUserList(param).then(res=>{
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
      findPersonnelDept(param).then(res=>{
       
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
          obj.title = item.deptCname;
          obj.attr = item;//其他想要添加的属性
          obj.expand = true;
          obj.selected = false;
          obj.children = this.getTree(item.children);
          arr.push(obj);
          
        });
      }
      return arr;
    },
    reloadSelf(){
      this.reload();
    }
  },
  created(){
    this.getRightTableData();
    this.getLeftTreeData();
  }
}
</script>
