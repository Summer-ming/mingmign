<!--
 * @Description: 权限管理
 * @Author: your name
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-20 17:25:46
 * @LastEditTime: 2019-03-21 10:14:22
 -->
/**权限管理 */

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
               </Card>
               <!-- 组织结构图 -->
               <Card  :bordered="true" style="margin-top:4px;">
                 <Tree ref="leftTree"   :data="leftDataNew" @on-select-change="tree_on_select_change" ></Tree>
               </Card>
          </Row>
       
        </Col>
        <Col span="8">
            <Card>
               <Button  @click="save_role_web()">保存权限</Button>
               <Button shape="circle" icon="md-refresh" @click="getMidTreeData()"></Button>

            </Card>
           <Card style="margin-top:4px">
             <Tree ref="midTree" multipe show-checkbox :data="midData" @on-select-change="mid_tree_on_select_change"></Tree>
           </Card>
        </Col>
        <Col span="8">
        </Col>
      </Row>
  </div>
</template>
<script>
import {findRoleVue,addRoleVue,deleterRoleVue,findPersonnelRole,findVueRouter2 } from '@/api/data'

export default {
  data(){
    return {
      left_input:'',
      leftDataNew:[],
      midData:[],
      roleRouterArr:[]
    }
  },
  methods:{
    save_role_web(){
    //  todo 保存选择的权限
      //获取选中的数据信息 当子节点没有全部选中的时候，父节点  不传，如果传值 只要父节点存在值，会导致所有子节点不管存不存在 都会设置成选中状态
      this.deleteRoleVue();
    },
    deleteRoleVue(){
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      if(clickarr.length<=0){
         this.$Notice.error({
          title:"请先选择岗位"
        })
        return false;
      }
      let dic = clickarr[0].attr;
      let param ={};
      param.roleId = dic.roleId;

      deleterRoleVue(param).then(res=>{
        this.addRoleVues();
      })
    },
    addRoleVues(){
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      let cdic = clickarr[0].attr;
      
      let checkedArr = this.$refs.midTree.getCheckedNodes();
      let pageVueRouter = [];
      
      checkedArr.forEach(item => {
        let dic = {};
        dic.vueRouterId = item.id;
        dic.roleId      = cdic.roleId;
        pageVueRouter.push(dic);
      });

      let param = {};
      param.pageVueRouter = pageVueRouter;
      addRoleVue(param).then(res=>{
        if(res.code =="100"){
          this.$Notice.success({
            title:'保存权限页面成功'
          })
          this.getLeftTreeData();
          this.getMidTableData();
        }else{
          this.$Notice.error({
            title:"保存权限页面失败"
          })
        }
      })
    },
    changeTreeData(){
       // 保存权限
      let newArr = this.changeTree(this.midData);
      this.midData = newArr;
    },
    //判断时 
    changeTree(tree){//将有权限的设置有权限
      let arr = [];
      if(!!tree && tree.length !== 0){
        tree.forEach(item => {
          let obj = {};
          obj.title = item.title;
          let a = this.judgeIsInarr(item.id);
          obj.checked = a;
          obj.attr = item;
          obj.expand = true;
          obj.selected = false;
          obj.id = item.id;
          obj.children = this.changeTree(item.children);
          arr.push(obj);
        });
      }
      return arr;
    },
    judgeIsInarr(key){
      if(this.roleRouterArr.length>0){

        for(var i=0;i<this.roleRouterArr.length;i++){
          if(this.roleRouterArr[i].vueRouterId == key){
            return true;
          }
        }
        return false;
      }else{
        return false;
      }
    },
    mid_tree_on_select_change(){
      console.log('中部页面数据')
    },
    getMidTreeData(){
      this.getMidTableData();
    },
    // 左侧搜索
    leftSearch(){  
      console.log("开始搜索组织架构"+this.left_input);
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
    tree_on_select_change(arr){
      this.getRoleWeb();
    },
    getRoleWeb(){//todo
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      if(clickarr.length<=0){
        return false;
      }
      let dic = clickarr[0].attr;
      let param = {};
      param.roleId = dic.roleId;
      findRoleVue(param).then(res=>{
        if(res.code =="100"){
          this.roleRouterArr = res.data;
        }else{
          this.roleRouterArr =[];
        }
          this.changeTreeData();

      })
    },
    getRightTableData(key,name){
    },
    //获取中部权限页面数据
    getMidTableData(){
      let param = {};
      param.pageNum = "1";
      param.pageSize = '10000';
      param.status = 1;
      findVueRouter2(param).then(res=>{
       
        if(res.code =="100"){
          let dealArr = [];
          this.isDis = true;
           this.$Message.success({
            content:'获取数据成功'
            })
          dealArr = this.getTree(res.data.list,1)
          this.midData = dealArr;
        }else{
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
      findPersonnelRole(param).then(res=>{
       
        if(res.code =="100"){
          let dealArr = [];
           this.$Message.success({
            content:'获取数据成功'
            })
          dealArr = this.getTree(res.data.list);
          this.leftDataNew = dealArr;
        }else{
          this.$Message.error({
            content:'获取数据失败:'+res.code+':'+res.msg
          })
        }
      })
    },
    // 拼接tree数据
    getTree(tree,type ){
      let arr = [];
      if(!!tree && tree.length !== 0){
        tree.forEach(item => {
          let obj = {};
          if(type==1){
            obj.title = item.title +' ('+item.orders +')';
            obj.checked = false;
            obj.id = item.id;
          }else{
            obj.title = item.roleCname +' ('+item.roleDeptInfoCname +')';
          }
          obj.attr = item;//其他想要添加的属性
          obj.expand = true;
          obj.selected = false;
          obj.children = this.getTree(item.children,type);
          arr.push(obj);
        });
      }
      return arr;
    }
  },
  created(){
    this.getLeftTreeData();
    this.getMidTableData();
  }
}
</script>