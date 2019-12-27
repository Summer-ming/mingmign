<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='moppp'>

       <!-- 开始 -->
       <Row>
         <!-- 左边 -->
          <i-col  span="8" >
          <Row >
               <Card  :bordered="true">
                 <Row>
                      <Input size='small' v-model="left_input" placeholder="输入关键字查询" style="width:120px"/>
                      <Button size='small' type="primary" @click="leftSearch">查询|</Button>
                      <Button size='small' shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
                 </Row>
                <Row style="margin-top:4px;">
                      <Button size='small' icon="md-add-circle" @click="addLeft"  >添加第一层级组织结构</Button>
                      <br/>
                      <div style="margin-top:4px">
                        <Button size='small' :disabled="isDis"  v-model="left_add" @click="add_children">添加子节点</Button>
                        <Button size='small' :disabled="isDis" v-model="left_change" @click="change_tree">修改</Button>
                        <Button size='small' :disabled="isDis" v-model="left_delete" type="error" @click="delete_tree">删除</Button>
                      </div>
                </Row>
                
               </Card>
               <!-- 组织结构图 -->
               <Card  :bordered="true" style="margin-top:4px;">
                 <Tree ref="leftTree"   :data="leftDataNew" @on-select-change="tree_on_select_change"  ></Tree>
               </Card>
          </Row>
       
        </i-col>
         <!-- 右边 -->
         <i-col span="16">
                   <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
          <FormItem label="项目名称:" style="margin-right:10px;">
              <Input size='small' style="width:200px"  placeholder="请输入项目名称" v-model="formItem.cname"></Input>
          </FormItem>

          <!-- 客户查询 -->
          <FormItem label="客户查询:">
            <Select size='small' v-model="formItem.orgSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getDianOrg'  :label-in-value='true'>
               <Option v-for="(item,index) in optionsList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>

          <!-- 项目差价 -->
           <FormItem  label="项目差价:" style="width:200px;">
                <Input size='small'  placeholder="请输入最小值" v-model="formItem.beginchajia "></Input>
              
          </FormItem>
          <FormItem style="width:130px;" id='mo'>
                <Input size='small'  placeholder="请输入最大值" v-model="formItem.endchajia"></Input>
          </FormItem>

          <!-- 项目对账日 -->
           <FormItem  label="项目对账日:" style="width:200px;">
                <Input size='small'  placeholder="请输入最小值" v-model="formItem.beginduizhangri "></Input>
              
          </FormItem>
          <FormItem style="width:130px;" id='mo'>
                <Input size='small'  placeholder="请输入最大值" v-model="formItem.endduizhangri"></Input>
          </FormItem>
          <!-- 项目付款周期  -->

          <FormItem  label="项目付款周期:" style="width:200px;">
                <Input size='small'  placeholder="请输入最小值" v-model="formItem.beginfukuanzhouqi "></Input>
              
          </FormItem>
          <FormItem style="width:130px;" id='mo'>
                <Input size='small'  placeholder="请输入最大值" v-model="formItem.endfukuanzhouqi"></Input>
          </FormItem>
          <!-- 分页 -->
          <FormItem label="每页显示:" style="width:200px">
            <Select size='small' v-model="formItem.length"    placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem>

          <!-- 公司抬头 -->
         <FormItem label="公司抬头:" style="width:200px">
        
              <Select size='small' style="width:90px" :transfer="true" v-model="formItem.bankJgId"    placeholder="请选择"   >
                          <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
              </Select>
          </FormItem>


          </Col> 
        </Row>
        <!-- 查询 -->
         <Row>
          <i-Col style="margin-top:10px" span="24"  >
             <Button  size='small' type='primary' icon="ios-search" @click="chaXun">查询</Button>
             <Button  size='small' style="margin-left:4px" shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
             <Button  size='small' type="primary" style='margin-left:4px;'   icon="ios-download-outline" @click="exportData()">导出excel</Button>
             <Button  size='small' style="margin-left:4px"  icon="md-add" type="primary" @click='addNew2'>新增项目</Button>
             <br>

          </i-Col>
        </Row>
           
            <!-- =2=2= -->
           <vxe-table height="300" border show-footer resizable class="vxe-table-element" size="mini" ref="xTable1" :data.sync="data1">
             <vxe-table-column width="50" show-overflow field="id" title="项目ID" ></vxe-table-column>
             <vxe-table-column width="160" show-overflow field="cname" title="项目名称" ></vxe-table-column>
             <vxe-table-column width="100" show-overflow field="ename" title="项目简称" ></vxe-table-column>
             <vxe-table-column width="90" show-overflow field="companyId" title="项目所属公司ID" ></vxe-table-column>
             <vxe-table-column width="200" show-overflow field="companyName" title="公司名称" ></vxe-table-column>
             <vxe-table-column width="150" show-overflow field="bankJgId" title="公司抬头" :formatter="this.$global.vexTaiTou"></vxe-table-column>
             <vxe-table-column width="60" show-overflow field="chajia" title="项目差价" ></vxe-table-column>
             <vxe-table-column width="90" show-overflow field="duizhangri" title="项目对账日(天)" ></vxe-table-column>
             <vxe-table-column width="100" show-overflow field="fukuanzhouqi" title="项目付款周期(天)" ></vxe-table-column>
             <vxe-table-column width="60" show-overflow field="note" title="项目备注" ></vxe-table-column>
             <vxe-table-column   width="30" show-overflow field="level" title="level" ></vxe-table-column>
             <vxe-table-column   width="30" show-overflow field="type" title="type" ></vxe-table-column>

             <vxe-table-column sortable  width="120" field="create_time" title="创建时间" >
                  <template v-slot="{row}">
                              <span style="color:red">{{row.createTime}}</span>
                   </template>
              </vxe-table-column>
              <vxe-table-column field=""  title="操作" width="60" >
                    <template v-slot="{row}">
                      <Button   size="small" type="primary" @click="showOMInfo(row)">查看</Button>
                    </template>
              </vxe-table-column>   
            </vxe-table>
        <!-- 结束 -->

        <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
         </Form>
     </Card> 
         </i-col>

       </Row>

       <!-- 添加第一层组织结构 -->
     <Modal 
        title="添加节点"
        @on-ok="leftModalOK"
        @on-cancel="leftModalCancel"
        v-model="left_addModal">
       <Form :label-width="100">
         <FormItem  label="节点名称">
            <Input v-model="left_addModal_input" placeholder="请输入节点名称" />
         </FormItem>
         <FormItem label="节点简称">
           <Input v-model="left_addModal_input_ename" placeholder="请输入节点简称"/>
         </FormItem>
       </Form>
      </Modal>
      <!-- 修改 -->
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
       
       <!-- 结束-->
     </div>
</template>

<script>

import {lengthList,belongCompanyList} from '@/libs/global_type'
import {findShop,findOrgCusAcc,xiangMu,findProject,getAdd,xiangGeng} from '@/api/data';//查询店铺
export default {
    name: 'xiangmu',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        //开始
        isDis:true,
        left_input:"",
        left_add:'',
        left_change:'',
        left_delete:"",
        leftDataNew:[],//tree数组
        deptArr:[],
        left_addModal:false,
        left_changeModal:false,
        left_addModal_input:"",
        left_changeModal_name:"",
        left_changeModal_ename:"",
        left_addModal_input_ename:"",
        addFirst:true,
        //结束
        data1:[],
        belongCompanyListThis:belongCompanyList,
        formItem:{
           bankJgId:"",//公司抬头id
            orgSearch:'',//客户
            cname:'',//项目名称
            beginchajia:"",//项目差价最小值
            endchajia:"",//项目差价最大值
            beginduizhangri:"",//项目对账日最小值
            endduizhangri:"",//项目对账日最大值
            beginfukuanzhouqi:"",//项目付款周期最小值
            endfukuanzhouqi:"",//项目付款周期最大值
            length:10,
            keHuId:'',//查询公司的客户id
        },
        optionsList:[],
        lengthListThis:lengthList,
        pagesizea:1,
        totalM:0,
       
       
                
      }
    },

    methods:{ 
       //开始
      getGongMM(){
        this.leftDataNew = [];
        let param = {};
        param.pageSize=999
        param.status=1,
        param.merge=1,
          findProject(param).then(res=>{
            if(res.code =="100"){
              console.log('我是tree数组')
              console.log(res)
             this.leftDataNew=this.getTree(res.data.list)
          }  
         })
       },
    //处理tree数据
    getTree(tree){
      let arr = [];
      if(!!tree && tree.length !== 0){
        tree.forEach(item => {
          this.deptArr.push(item);
          let obj = {};
          obj.title = item.cname;
          obj.attr = item;//其他想要添加的属性
          obj.expand = false;
          obj.selected = false;
          obj.children = this.getTree(item.children);
          arr.push(obj);
          
        });
      }
      return arr;
    },
    //点击节点触发
    tree_on_select_change(a){
      console.log('我是点击数据')
      let clickarr = this.$refs.leftTree.getSelectedNodes();
      console.log(clickarr)
      if(clickarr.length == 0){
        console.log("点击取消")
        return false;
      }
       this.isDis = false;
         //点击三级的时候添加删除不可用
      console.log(clickarr[0].children.length)
      // if(clickarr[0].children.length==0&&clickarr[0].title==this.left_addModal_input_ename){
      
      //       this.isDis=true;
      // }else{
        
      //       this.isDis=false;
      // }

    },
      //查询
     leftSearch(){
       if(this.left_input==""){
         this.$Message.warning("请输入关键字")
         return false;
       }
     console.log("开始搜索组织架构"+this.left_input);
      let newArr = [];
      this.left_searchArr = [];
      this.consoleArrAll(this.leftDataNew);
      console.log(this.left_searchArr);
      this.leftDataNew = this.left_searchArr;
     },
     //过滤树节点查询用
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
    //添加第一层确定
    leftModalOK(){
        console.log(this.addFirst);
         if(this.addFirst){//添加第一层级组织结构
            let param        = {pageProjectList:[]};
            let dic          = {};
                dic.pid      = 0;
                dic.cname    = this.left_addModal_input;
                dic.ename    = this.left_addModal_input_ename;
                dic.level    = 0;
                dic.type     = 0;
                dic.bankJgId = 0;
              param.pageProjectList.push(dic)
            console.log(param);
            // param. this.userInfo.id;
            //   param.applicantName       = this.userInfo.cname;
            getAdd(param).then(res=>{
              if(res.code =="100"){
                this.$Notice.success({
                  title:"添加成功"
                })
                this.getGongMM();
              }else{
                this.$Notice.error({
                  title:'添加失败'+res.msg
                })
              }
            })
      }else{//添加子节点
            let clickarr = this.$refs.leftTree.getSelectedNodes();
            console.log('ndd')
            console.log(clickarr)
            let dic          = clickarr[0].attr;
            let param        = {pageProjectList:[]};
            let dip          = {};
                dip.cname    = this.left_addModal_input;
                dip.ename    = this.left_addModal_input_ename;
                dip.pid      = clickarr[0].attr.id;
                dip.level    = '1';
                dip.type     = '1'
                dip.bankJgId = 0;
            param.pageProjectList.push(dip)
            getAdd(param).then(res=>{
              if(res.code =="100"){
                this.$Notice.success({
                  title:"添加成功"
                })
                this.getGongMM();
              }else{
                this.$Notice.error({
                  title:'添加失败'+res.msg
                })
              }
            })
      }
    },
    //修改确定
    left_changeModal_ok(){
        let clickarr = this.$refs.leftTree.getSelectedNodes();
        let dic = clickarr[0].attr;
        let param = {};
        param.id = dic.id;
        param.cname = this.left_changeModal_name;
        param.ename = this.left_changeModal_ename;
        xiangGeng(param).then(res=>{
          if(res.code =="100"){
            this.$Notice.success({
              title:"修改成功"
            })
            this.getGongMM();
          }else{
            this.$Notice.error({
              title:'修改失败'+res.msg
            })
          }
        })
    },
    left_changeModal_cancel(){

    },
    //添加第一层取消
    leftModalCancel(){

    },
       
       //添加第一层节点
       addLeft(){
          this.left_addModal_input       = '';
          this.left_addModal_input_ename = '';
          this.left_addModal             = true;
          this.addFirst                  = true;
       },
       //添加节点
       add_children(){
         //添加限制
         //如果是点击第二层级或者第三层次 则添加子节点失效
         let clickarr = this.$refs.leftTree.getSelectedNodes();
         let dic = clickarr[0].attr
         if(dic.pid != 0 ){//只有第一层级为0
          this.$Message.warning("只有第一层级可以添加子节点")
            return false;
         }
         this.left_addModal_input       = '';
         this.left_addModal_input_ename = '';
         this.left_addModal             = true;
         this.addFirst                  = false;
       },

       //修改
       change_tree(){
            this.left_changeModal = true;
            let clickarr = this.$refs.leftTree.getSelectedNodes();
            let dic = clickarr[0].attr;
            this.left_changeModal_name = dic.cname;
            this.left_changeModal_ename = dic.ename;
       },
       //删除
       delete_tree(){
             this.showDeleteModal();
       },
       //删除弹窗
          showDeleteModal(){
            let clickarr = this.$refs.leftTree.getSelectedNodes();
            let dic = clickarr[0].attr;
            this.$Modal.confirm({
              title:'确定删除:'+dic.cname,
              onOk:()=>{
                  let clickarr = this.$refs.leftTree.getSelectedNodes();
                  let dic = clickarr[0].attr;
                  let param = {};
                  param.id = dic.id;
                  param.status ='0';
                  xiangGeng(param).then(res=>{
                  if(res.code =="100"){
                    this.$Notice.success({
                      title:'删除成功'
                    });
                    this.getGongMM();
                  }else{
                    this.$Notice.error({
                      title:'删除失败'
                    })
                  }
                })
              },
              
            })
    },
      //结束






      //客户选择
      //获取供应商选中的值
      getDianOrg(item){
          this.formItem.keHuId=item.value;
        console.log(item)
      },
           //查询公司
       getOrg(){
        let param = {};
        param.pageNum ="1";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.optionsList=res.data.list
          }  
         })
       },
       //查询
       chaXun(){
         this.searchM();
       },
       //刷新；
       reloadSelf(){
        this.leftDataNew = [];
         this.formItem={};
         this.searchM();
         this.getGongMM();

       },
       //导出excel
       exportData(){
          this.$refs.xTable1.exportCsv({
          filename:"导出excel"
        })
       },
       //新增项目
       addNew2(){
          //  sessionStorage.setItem('ro','')
          //  sessionStorage.setItem('ro',JSON.stringify(row))
          sessionStorage.setItem('statusOne','')
           sessionStorage.setItem('statusOne','2')
                 const route = {
                       name: 'xiangDetail',
                  }
                  this.$router.push(route)

       },
       //查询项目
        searchM() {
                //获取查询的i-input  的值
                let param                   = {};
                    param.pageSize          = this.formItem.length;
                    param.cname             = this.formItem.cname              //项目名称
                    param.beginchajia       = this.formItem.beginchajia        //项目差价最小值
                    param.endchajia         = this.formItem.endchajia          //项目差价最大值
                    param.beginduizhangri   = this.formItem.beginduizhangri    //项目对账日最小值
                    param.endduizhangri     = this.formItem.endduizhangri      //项目对账日最大值
                    param.beginfukuanzhouqi = this.formItem.beginfukuanzhouqi  //项目付款周期最小值
                    param.endfukuanzhouqi   = this.formItem.endfukuanzhouqi    //项目付款周期最大值
                    param.pageNum           = this.pagesizea                   //分页
                    param.companyId         = this.formItem.keHuId;            //公司id
                    param.bankJgId          = this.formItem.bankJgId;
                    param.status            = "1"
                    param.type = '2';
                this.getSerch(param)
            },
            //根据公司名，业务员查询
            getSerch(param) {
                xiangMu(param).then(res => {
                  console.log('--------------------')
                    console.log(res)
                    if (res.code == "100") {
                      this.$Notice.success({
                          title:'获取列表数据成功'
                        })
                        this.data1 = res.data.list;
                        this.totalM = res.data.total;
                    }else{
                      this.data1 = [];
                        this.$Notice.error({
                          title:res.msg
                        })
                    }
                })
            },
            //分页
            changePage(index) {
                this.pagesizea = index;
                this.searchM();
            },
            //查看
            showOMInfo(row){
               sessionStorage.setItem('ro','')
               sessionStorage.setItem('ro',JSON.stringify(row))
                sessionStorage.setItem('statusOne','')
               sessionStorage.setItem('statusOne','1')
                 const route = {
                       name: 'xiangDetail',
                  }
                  this.$router.push(route)
            },

     
  
    },
    
    mounted(){
       this.getOrg();//客户查询
       this.searchM();
       this.getGongMM();//tree数组
    },
    
    created(){
   
    },
}

</script>
 <style lang="less" >
 #moppp .ivu-form-item{
   margin-bottom: 5px!important;
 }
   #moppp .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0px!important;
      }
    #moppp .vxe-table .vxe-body--column{
        line-height:20px!important;
      }
   #moppp .vxe-table .vxe-cell {
      padding: 0 2px;
      }
     #moppp .vxe-toolbar{
      padding: 0 0; 

     }
       #mo .ivu-form-item-content{
       margin-left: 0!important;
     }
</style>
