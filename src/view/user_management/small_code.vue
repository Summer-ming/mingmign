

<!--
 * @Description: 
 * @Author: wb
 * @others: 
 * @Date: 2019-03-20 17:25:46
 * @LastEditTime: 2019-03-22 13:37:14
 -->

 
/**小代码管理 */
// todo 筛选多维数组，并且保留父级11

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
                      <Button shape="circle" icon="md-refresh" @click="getLeftTreeData()"></Button>
                 </Row>
                <Row style="margin-top:4px;">
                      <Button icon="md-add-circle" @click="addLeft"  >添加类型</Button>
                      <br/>
                      <div style="margin-top:4px">
                        <!-- <Button :disabled="isDis"  v-model="left_add" @click="add_children">添加子节点</Button> -->
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
            <Button :disabled="isDis" icon="md-add-circle" @click="addUser">添加key_value</Button>
            <Input v-model="right_name" placeholder="请输入字段名称" style="width:100px"/>
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
        title="添加类型"
        v-model="left_addModal">
       <Form :label-width="100">
         <FormItem  label="类型名称">
            <Input v-model="left_addModal_input" placeholder="请输入类型名称" />
         </FormItem>
         <FormItem label="类型英文名称">
           <Input v-model="left_addModal_input_ename" placeholder="请输入类型英文名称"/>
         </FormItem>
       </Form>
        <div slot="footer">
            <Button type="text" @click="modalCancel()">取消</Button>
            <Button  type="primary" @click="leftModalOK()">添加</Button>
        </div>
      </Modal>
      <!-- 改名字使用的modal -->
      <Modal 
        title="修改类型信息"
        v-model="left_changeModal">
        <Form :label-width="90">
          <FormItem  label="类型名称">
            <Input v-model="left_changeModal_name"/>
          </FormItem>
          <FormItem label="类型英文名称">
            <Input  v-model="left_changeModal_ename"/>
          </FormItem>
        </Form>
         <div slot="footer">
            <Button type="text" @click="modalCancel()">取消</Button>
            <Button  type="primary" @click="left_changeModal_ok()">修改</Button>
        </div>
      </Modal>
      <!-- 添加key_value数组 -->
      <Modal title="添加key_value数组" 
      v-model="right_add_modal"
      width="700"
      :styles="{top:'10px'}"
      >
      <Form style="width:800px" ref="addFormValidate" :model="addFormValidate" :rules="addFormValidateRule" :label-width="120">
        <FormItem 
            v-for="(item, index) in addFormValidate.items" :key="index"
            v-if="item.status"
            :label="'第'+item.index+'个'"
            :prop="'items.'+index+'.value'">
        <Row>
          <Col>
            <Input style="width:80px" type="text"  v-model='item.key' placeholder='key'/>
            <Input style="width:180px"  type="text"  v-model='item.cname' placeholder='中文名称'/>
            <Input style="width:180px"  type="text"  v-model='item.ename' placeholder='英文名称'/>

            <Button @click="removeFormItem(index)">删除</Button>
          </Col>
        </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col>
              <Button type="error" @click="addFormItem" icon="md-add">添加</Button>
            </Col>
          </Row>
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
        <FormItem label='明细'>
        <Input style='width:300px' v-model='changeFormValidate.key' placeholder=''/>
        <Input style='width:300px' v-model='changeFormValidate.value' placeholder=''/>
        
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="modalCancel">取消</Button>
        <Button v-show="isShow" type="primary" @click="changeTableItem">修改</Button>
      </div>
      </Modal>
  </div>
</template>
<script>
import {findCodeType,
findCodeInfo,
updateCodeInfo,
updateCodeType,
addCodeInfo,
addCodeType,
   } from '@/api/data'

export default {
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
      changeFormValidate:{
        key:'',
        value:'',
        id:''
      },
      changeUserRole:false,
      changeUserRole:{
      },
      index:1,
      addFormValidate:{
        items:[{
          value:'',
          key:'',
          index:'1',
          status:1
        }]
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
      columns1:[{
        title:'ID',
        key:'codeInfoId',
        width:70,
        fixed:'left',
        tooltip:true
      },{
        title:'key',
        key:'codeInfoCname',
        width:120
      },{
        title:'value',
        key:'codeInfoKeysm',
        width:100
      },{
        title:'类型',
        key:'codeTypeCname',
        width:120
      },{
        title:'infoEname',
        key:'codeInfoEname',
        width:100
      },{
        title:'infoId',
        key:'codeInfoCodeId',
        width:50
      },{
        title:'info状态',
        key:'codeInfoStatus',
        width:140
      },{
        title:'类型id',
        key:'codeTepyId',
        width:100
      },{
        title:'类型ename',
        key:'codeTypeEname',
        width:100
      },
      {
        title:'类型状态',
        key:'codeTypeStatus',
        width:80
      },{
        title:'操作',
        key:'actions',
        fixed:'right',
        width:150,
        render:(h,params) =>{
          return h('div',[
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
                    this.tableInfoTitle = '编辑信息'
                    this.tableInfoModal = true;

                    this.changeFormValidate.key = this.tableItem.codeInfoKeysm;
                    this.changeFormValidate.value = this.tableItem.codeInfoCname;
                    this.changeFormValidate.id = this.tableItem.codeInfoId;

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
                    title:"确定需要删除吗",
                    onOk:()=>{
                      let param = {};
                        param.codeInfoId = this.tableItem.codeInfoId;
                        param.codeInfoStatus = "0";
                        updateCodeInfo(param).then(res=>{
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
          ])
        }
      }]
    }
  },
  methods:{

       addFormItem(){
        this.index++;
        this.addFormValidate.items.push({
          value:'',
          key:'',
          index:this.index,
          status:1
        });
      },
      removeFormItem(index){
        this.addFormValidate.items[index].status = 0;
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
      param.codeInfoId = this.changeFormValidate.id;
      param.codeInfoKeysm =this.changeFormValidate.key;
      param.codeInfoCname = this.changeFormValidate.value;
      updateCodeInfo(param).then(res=>{
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
      this.left_changeModal = true;
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      let dic = clickarr[0].attr;
      this.left_changeModal_name = dic.codeTypeCname;
      this.left_changeModal_ename = dic.codeTypeEname;
      
    },
    delete_tree(){ 
       this.$Notice.error({
            title:'删除后该类型对应的信息也会删除'
          })
          this.showDeleteModal();

    },
    showDeleteModal(){
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      let dic = clickarr[0].attr;
      this.$Modal.confirm({
        title:'确定删除:'+dic.codeTypeCname,
        onOk:()=>{
            let clickarr = this.$refs.leftTree.getSelectedNodes();
            let dic = clickarr[0].attr;
            let param = {};
            param.codeTepyId = dic.codeTepyId;
            param.codeTypeStatus = '0';
            updateCodeType(param).then(res=>{
            if(res.code =="100"){
              this.$Notice.success({
                title:'删除成功'
              });
              this.modalCancel();

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
      console.log(arr);
      console.log("点击了tree");
      if(arr.length == 0){
      this.isDis = true;
        return false;
      }
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      this.leftChoseDic = clickarr[0].attr;
      this.isDis = false;
      this.getRightTableData();
    },
    modalCancel(){
      this.$Modal.remove();
      this.left_changeModal =false;
      this.left_addModal = false;
      this.right_add_modal = false;
      this.tableInfoModal = false;
    },
    // 添加新keyvalue
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    
    addModalOk(){
      console.log("确认添加");
      console.log(this.addFormValidate.items);

       let clickarr = this.$refs.leftTree.getSelectedNodes();
      let leftdic = clickarr[0].attr;

      //重组数据 status = 0的不添加
            let infoList = [];
                this.addFormValidate.items.forEach(item => {
                  if(item.status ==1){
                        let dic = {};
                        dic.codeInfoCodeId = leftdic.codeTepyId;
                        dic.codeInfoCname = item.cname;
                        dic.codeInfoEname = item.ename;

                        dic.codeInfoKeysm = item.key;
                        infoList.push(dic);
                  }

                });
                      let param = {};
                      param.infoList = infoList;
                      addCodeInfo(param).then(res=>{
                        if(res.code =="100"){
                          this.right_add_modal = false;
                          this.$Notice.success({
                            title:"添加成功"
                          });
                          this.getRightTableData();
                        }else{
                          this.$Notice.error({
                            title:"添加失败"
                          })
                        }
                      })

    },
    /**
     * @description: 
     * @param {type} 
     * @return: 
     */
    addUser(){
      this.right_add_modal = true;
     

    },
    addLeft(){
      this.left_addModal = true;
      this.addFirst = true;
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
      param.codeTepyId = dic.codeTepyId;
      param.codeTypeCname = this.left_changeModal_name;
      param.codeTypeEname = this.left_changeModal_ename;
      updateCodeType(param).then(res=>{
        if(res.code =="100"){
          this.$Notice.success({
            title:"修改成功"
          })
          this.getLeftTreeData();
          this.modalCancel();
        }else{
          this.$Notice.error({
            title:'修改失败'+res.msg
          })
        }
      })
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
            let param = {};
            param.codeTypeEname = this.left_addModal_input_ename;
            param.codeTypeCname = this.left_addModal_input;
      
            addCodeType(param).then(res=>{
              if(res.code =="100"){
                this.$Notice.success({
                  title:"添加成功"
                })
                this.left_addModal = false;
                this.getLeftTreeData();
              }else{
                this.$Notice.error({
                  title:'添加失败'+res.msg
                })
              }
            })
     
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
          this.data1 = [];
          let clickarr = this.$refs.leftTree.getSelectedNodes();
          console.log(clickarr);
          let leftdic = {};
          if(clickarr.length>0){
              leftdic = clickarr[0].attr;
              if(leftdic){

              }else{
                console.log("无数据")
                return false;
              }
          }else{
            console.log("无数据1")
            return false;
          }
          let param = {};
          param.pageNum = this.searchPage;
          param.codeTypeCname = this.right_name;
          param.codeInfoCodeId = leftdic.codeTepyId;
          findCodeInfo(param).then(res=>{
            if(res.code =='100'){
                this.dataCount = res.data.total;
                this.data1 = res.data.list;
              }else{
                this.$Message.error('查无数据')
              }
          })
    },
    // 获取数据 tree 
    getLeftTreeData(key){
      let param = {};
      param.pageNum = "1";
      param.pageSize = '10000';
      param.deptCname = key;
      findCodeType(param).then(res=>{
       
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
          obj.title = item.codeTypeCname;
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
