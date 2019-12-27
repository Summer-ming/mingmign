<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div id='moppp'>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
           <!-- 查询 -->
         <Row style='margin-bottom:15px;border-bottom:1px solid #000'> 

           <i-col span="2" style='font-size:20px;color:black;font-weight:600' >
               操作   
            </i-col> 
          <i-Col  span="22"  >
             <Button size='small' type='primary' style="margin-right:10px" v-if='showDisplay'   @click="addNew2">新增</Button>
             <Button size='small' type='primary' style="margin-right:10px" v-if='shouM'   @click="gengXin">更新基本信息</Button>
             <Button size='small' type="primary" @click='genGan' v-if='shouM'>更新干系人信息</Button>
          </i-Col>
         </Row>
       
     <Form :model="formItem" inline :label-width="90" >
        <Row style='border-bottom:1px solid #000;margin-bottom:5px;'>
           <iCol span="2" style='font-size:20px;color:black;font-weight:600'>基本信息</iCol>
          <Col span="22">
          <!-- 项目id -->
          <FormItem label="ID:" style="margin-right:10px;">
            <span> <time style='color:red'>{{xiangId}}</time></span>
          </FormItem>
          <!-- 项目名称 -->
          <br>
          <FormItem label="项目名称:" style="margin-right:10px;">
              <Input style="width:250px"  placeholder="请输入项目名称" v-model="formItem.cname"></Input>
          </FormItem>

         <FormItem label="项目简称:" style="margin-right:10px;">
              <Input style="width:250px"  placeholder="请输入项目简称" v-model="formItem.jianCheng"></Input>
          </FormItem>
          <br>
          <!-- 客户查询 -->
          <FormItem label="客户:">
            <Select v-model="formItem.orgSearch"  style="width:250px" filterable placeholder="请选择名称"  @on-change='getDianOrg'  :label-in-value='true'>
               <Option v-for="(item,index) in optionsList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
            </Select>
          </FormItem>
          <!-- 公司抬头 -->
          <FormItem label="公司抬头:" style="width:200px">
              <Select style="width:90px"  v-model="formItem.bankJgId"    placeholder="请选择"   >
                          <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
              </Select>
          </FormItem>
          <br>
          <!-- 所属集团-->
         <FormItem label="所属集团:">
            <Select v-model="formItem.jituan"  style="width:250px" filterable placeholder="请选择集团"  @on-change='getJiTuan'  :label-in-value='true'>
               <Option v-for="(item,index) in jituanArr" :value="item.label" :label="item.value" :key="index" >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <!-- 所属公司 -->
           <FormItem label="所属公司:">
            <Select v-model="formItem.gongsi"  style="width:250px" filterable placeholder="请选择名称"  @on-change='changeBelongCompany'>
               <Option v-for="(item,index) in gongsiArr" :value="item.label" :label="item.value" :key="index" >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <br/>
          <!-- 项目差价 -->
           <FormItem  label="差价:" style="width:200px;">
                <Input  placeholder="请输入最小值" v-model="formItem.beginchajia "></Input>
              
          </FormItem>

          <!-- 项目对账日 -->
           <FormItem  label="对账日(天):" style="width:200px;">
                <Input  placeholder="请输入" v-model="formItem.beginduizhangri "></Input>
              
          </FormItem>

          <!-- 项目付款周期  -->

          <FormItem  label="付款周期(天):" style="width:200px;">
                <Input  placeholder="请输入" v-model="formItem.beginfukuanzhouqi "></Input>
              
          </FormItem>

          <!-- 备注 -->
          <br/>
         <FormItem label="备注:" >
           <i-input style="width:400px;"  type="textarea" :rows="3"  v-model="formItem.note" placeholder="请输入备注"/>
          </FormItem>
    
          <!-- 分页 -->
          <!-- <FormItem label="每页显示:" style="width:200px">
            <Select v-model="formItem.length"    placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
      
            </Select>
          </FormItem> -->

          </Col> 
        </Row>
          
          <!-- 干系人信息 -->
          <row>
            <i-col span="4" style='font-size:20px;color:black;font-weight:600' >
                 干系人信息
            </i-col> 

            <i-Col  span="20"  >
            
             <Button size='small' type='primary' style="margin-right:10px"   @click="deleteL">删除</Button>
             <Button size='small'   type="primary" @click='addNewYi'>新增一行</Button>
          </i-Col>

          </row>
           
            <!-- =2=2= -->
           <vxe-table  height="300" @select-change="selectChangeEvent" @select-all='selentAll' :edit-config="{key: 'vxeId', trigger: 'click', mode: 'cell',}" border show-footer resizable class="vxe-table-element" size="mini" ref="xTable1"  :data.sync="data1">
             <vxe-table-column type="selection" width="30"></vxe-table-column>
           

             <vxe-table-column width="50" show-overflow field="id" title="项目ID" ></vxe-table-column>
             <vxe-table-column width="60" show-overflow field="projectId" title="项目id" ></vxe-table-column>
             <vxe-table-column width="100" show-overflow field="type" :edit-render="{name: 'ElInput',autoselect: true}" title="干系人类型" ></vxe-table-column>
             <vxe-table-column width="90" show-overflow field="name" :edit-render="{name: 'ElInput',autoselect: true}" title="干系人姓名" ></vxe-table-column>
             <vxe-table-column width="110" show-overflow field="phone" :edit-render="{name: 'ElInput',autoselect: true}" title="干系人联系电话" ></vxe-table-column>
             <vxe-table-column width="90" show-overflow field="note" title="备注" :edit-render="{name: 'ElInput',autoselect: true}" ></vxe-table-column>
             <vxe-table-column width="100" show-overflow field="status" title="状态" ></vxe-table-column>      
             <vxe-table-column sortable  width="80" field="createTime"  show-overflow title="创建时间" >
                  <template v-slot="{row}">
                              <span style="color:red">{{row.createTime}}</span>
                   </template>
              </vxe-table-column>
            </vxe-table>
        <!-- 结束 -->

        <!-- <Page :page-size="formItem.length" @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page> -->
       



         </Form>
     </Card>    
       
    

     </div>
</template>

<script>
import { mapMutations } from 'vuex'
import {lengthList,belongCompanyList} from '@/libs/global_type'
import {findShop,findOrgCusAcc,xiangMu,xiangMuDetail,xiangGeng,genZhu,genAdd,getAdd} from '@/api/data';//查询店铺
import { setTimeout } from 'timers';
export default {
    name: 'xiangDetail',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        jituanArr:[],//所属集团数组
        gongsiArr:[],//所属公司数组
        vxeId:0,
        data1:[],
        showDisplay:true,
        belongCompanyListThis:belongCompanyList,
        formItem:{
            jituan:"",//所属集团
            gongsi:"",//所属公司
            bankJgId:"",//公司抬头
            orgSearch:'',//客户
            cname:'',//项目名称
            jianCheng:'',//项目建成
            beginchajia:"",//项目差价最小值
            endchajia:"",//项目差价最大值
            beginduizhangri:"",//项目对账日最小值
            endduizhangri:"",//项目对账日最大值
            beginfukuanzhouqi:"",//项目付款周期最小值
            endfukuanzhouqi:"",//项目付款周期最大值
            length:10,
            note:"",//备注
            level:'2'
        },
        keHuId:"1",//查询公司的客户id
        optionsList:[],
        lengthListThis:lengthList,
       
        xiangId:"",
        keName:"1",
        arrDelete:[], 
        delP:[],
        xinz:"",//区分新增
        add:[],//新增的
        shouM:true,
        ko:'',//新增id
                
      }
    },

    methods:{ 
      ...mapMutations([
      'closeTag'
      ]),
      //开始
      //所属集团
      getSuoGong(){
        let param = {};
        param.level ="0";
        param.status = "1";
        param.pageSize=9999;
        this.jituanArr = [];
          xiangMu(param).then(res=>{
            if(res.code =="100"){
              console.log('我是集团数据')
              res.data.list.map((item)=>{
                let dic={};
                dic.value=item.cname;
                dic.label=item.id;
                this.jituanArr.push(dic)
              })
              console.log(this.jituanArr)
          }  
         })
       },
       changeBelongCompany(item){
         console.log(item);
         //选择了所属公司
         this.formItem.gongsi = item;
         this.formItem.level = '2';
       },
       //集团改变时获取公司
       getJiTuan(item){
           console.log('我是公司')
           //防止 用户只选择了 所属集团，没有选择所属公司
           this.formItem.pid = item.value;
           this.formItem.level = '1'
           let gongId=item.value;//获取公司的id
           this.getConmpany(gongId)
       },
       //获取公司
       getConmpany(id){
          let param = {};
          param.pid =id;
          param.status = "1";
          param.pageSize=9999;
          this.gongsiArr = [];
          xiangMu(param).then(res=>{
            if(res.code =="100"){
              console.log('我是集团数据')
              console.log(res)
              res.data.list.map((item)=>{
                let dic={};
                dic.value=item.cname;
                dic.label=item.id;
                this.gongsiArr.push(dic)
              })
              // console.log(this.formItem.gongsi)
              console.log('0000000000')
              console.log(this.gongsiArr)
          }  
         })
       },
      //结束
       
      //客户选择
      //获取供应商选中的值
      getDianOrg(item){
          this.keHuId=item.value;
          this.keName=item.label;
          console.log(this.keHuId+"客户id"+this.keName+"客户名称")
      },
           //查询公司
       getOrg(){
        let param = {};
        param.pageNum ="1";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
              this.$Message.success("查询客户公司名称")
             this.optionsList=res.data.list
          }  
         })
       },

       //查询
       chaXun(){
         this.searchM();
       },
       //更新基本信息
       gengXin(){
             let param={};
             param.id          = JSON.parse(sessionStorage.getItem('ro')).id
             param.cname       = this.formItem.cname
             param.ename       = this.formItem.jianCheng
             param.companyId   = this.keHuId
             param.companyName = this.keName
             param.chajia      = this.formItem.beginchajia
             param.duizhangri  = this.formItem.beginduizhangri
             param.fukuanzhouqi = this.formItem.beginfukuanzhouqi
             param.note        = this.formItem.note
             param.bankJgId     =this.formItem.bankJgId
             param.pid          =this.formItem.gongsi
             xiangGeng(param).then(res => {
                  if (res.code == "100") {
                        this.$Notice.success({
                          title:'更新基本信息成功'
                        })
                       this.closeSelf();       
                 }else{
                        this.$Notice.error({
                          title:'更新基本信息失败'
                        })
                    }
                })

       },
       closeSelf(){
         setTimeout(() => {
             this.closeTag({
                              name: 'xiangDetail',
                          });
          const route = {
                            name: 'xiangmu',
                        }
                        this.$router.push(route)
         }, 1000);
         
       },
       //跟新主干信息
       genGan(){
           this.geta();
           this.getx();
       },
       //修改
       getx(){
        let param={pageProjectList:[]};
           let d=this.data1.concat(this.delP)
           console.log("ddddddd");
           console.log(d);
           d.map((item)=>{
               let dic           = {};
                   dic.id        = item.id
                   dic.projectId = item.item
                   dic.type      = item.type
                   dic.name      = item.name
                   dic.phone     = item.phone
                   dic.note      = item.note
                   dic.status    = item.status
               if(item.o !="1"){
                param.pageProjectList.push(dic)
               }
           })
           console.log(param)
           if(param.pageProjectList.length==0){
             return false;
           }
           genZhu(param).then(res=>{
            if(res.code =="100"){
                this.$Notice.success({
                          title:'更新干系人信息成功',
                          duration:1,
                              onClose:res =>{
                              }
                        })
                this.searchM();
                
            }  
         })
       },
       //添加
       geta(){
           let param={pageProjectList:[]}
          this.data1.map((item)=>{
                if(item.o=='1'){
                   this.add.push(item)
                }
          })
          this.add.map((it)=>{
              let dic={};
              dic.projectId=it.projectId
              dic.type=it.type
              dic.name=it.name
              dic.phone=it.phone
              dic.note=it.note
              param.pageProjectList.push(dic)
            })
            if(param.pageProjectList.length==0){
              return false;
            }
            genAdd(param).then(res=>{
            if(res.code =="100"){
              this.$Notice.success({
                          title:'添加干系人成功',
                          duration:1,
                              onClose:res =>{
                              }
                        })
                this.searchM();
            }  
         })

       },
        //删除
        deleteL(){
            this.xinz='2'
            this.data1=this.arrDelete
        },
     //新增一行
     addNewYi(){
         this.xinz='1'
         let p={
                id:"",
                o:'1',
                projectId:this.xiangId,
                type:"",
                name:"",
                phone:"",
                note:"",
                status:"",
                createTime:'',
                vxeId:this.vxeId
             }
             this.vxeId ++;
      this.data1.push(p)

    

     },
     //选中
     selectChangeEvent(){
       this.getHuo();
     },
     //全选
     selentAll(){
        this.getHuo();
     },
   
     //共同的方法
     getHuo(){
        let dataSelect=this.$refs.xTable1.getSelectRecords()//删除选中的数组
        this.delP=this.$refs.xTable1.getSelectRecords()//删除选中的数组
        this.delP.map((item)=>{
               item.status='0'
        })
        let arr3 = this.data1.filter(item=>{
            return dataSelect.every(item2=>{
                return item.id != item2.id;
            })
        })
        this.arrDelete=arr3 //删除后的数组

       
        
        console.log(dataSelect)
     
     },
       //刷新；
       reloadSelf(){
         this.formItem={};
         this.searchM();
       },
       //导出excel
       exportData(){
          this.$refs.xTable1.exportCsv({
          filename:"导出excel"
        })
       },
       //新增项目
       addNew2(){
        let param            = {pageProjectList:[]};
        let dic              = {};
            dic.cname        = this.formItem.cname
            dic.ename        = this.formItem.jianCheng
            dic.companyId    = this.keHuId.length>0 ?this.keHuId:'0';
            dic.companyName  = this.keName
            dic.chajia       = this.formItem.beginchajia
            dic.duizhangri   = this.formItem.beginduizhangri
            dic.fukuanzhouqi = this.formItem.beginfukuanzhouqi
            dic.note         = this.formItem.note
            dic.bankJgId     =this.formItem.bankJgId
            console.log(this.formItem.gongsi);
            if(this.formItem.gongsi.length>0){//如果选了所属集团 或者所属公司则传值
                 dic.pid          =this.formItem.gongsi
                 dic.level        =this.formItem.level
            }else{
                 dic.pid          ='0'
                 dic.level        ='0'
            }
           dic.type = '2';//
            param.pageProjectList.push(dic)
            getAdd(param).then(res=>{//添加基本信息
                if(res.code =="100"){
                     this.$Notice.success({
                          title:'添加基本信息成功',
                          duration:1,
                              onClose:res =>{
                                this.closeSelf();

                                   

                              }
                        })
                    let a=res.msg
                    this.ko=res.msg
                    let param1={pageProjectList:[]}
                    this.data1.map((item)=>{
                          let div           = {}
                              div.projectId = a
                              div.type      = item.type
                              div.name      = item.name
                              div.phone     = item.phone
                              div.note      = item.note
                              param1.pageProjectList.push(div);
                    })
                    if(param1.pageProjectList.length ==0){
                      return false;
                    }
                    genAdd(param1).then(res=>{
                        if(res.code =="100"){
                            this.$Notice.success({
                              title:'添加干系人信息成功',
                            })
                            
                            
                        } else{
                          this.$Notice.error({
                              title:'添加干系人信息失败'
                            })
                        } 
                    })
                  
                } else{
                  this.$Notice.error({
                              title:'添加基本信息失败'
                            })
                } 
            })

         
       },
        //查询项目
        searchM() {
                    //获取查询的i-input  的值
                    let param = {};
                    param.projectId=this.xiangId

                    param.pageSize=99999

                    param.pageNum=1
                    param.status = 1;
                    this.getSerch(param)
            },
            //根据公司名，业务员查询
            getSerch(param) {
                    xiangMuDetail(param).then(res => {
                        if (res.code == "100") {
                            this.data1 = res.data.list;
                            this.data1.map(item=>{
                                item.vxeId = this.vxeId;
                                this.vxeId ++;
                            })
                        }else{
                            this.$Notice.warning({
                            title:"暂无数据"
                            })
                        }
                    })
            },
                //分页
                changePage(index) {
                    this.pagesizea = index;
                    this.searchM();
                },
            
                //点击查看进来进行赋值
                getFuZhi(){
                  let dic = JSON.parse(sessionStorage.getItem('ro'));
                    this.formItem.cname             = dic.cname
                    this.formItem.jianCheng         = dic.ename
                    this.formItem.beginchajia       = dic.chajia
                    this.formItem.beginduizhangri   = dic.duizhangri
                    this.formItem.beginfukuanzhouqi = dic.fukuanzhouqi
                    this.formItem.note              = dic.note
                    this.formItem.orgSearch         = dic.companyId
                    this.formItem.bankJgId          = dic.bankJgId
                    console.log('我是公司抬头')
                    console.log(this.formItem.bankJgId)
                    this.keHuId                     = dic.companyId
                    this.keName                     = dic.companyName
                    //给所属公司赋值
                    this.setCompany(dic.pid); 
                },
                 //给公司
       setCompany(id){//通过找到对应的 公司给下拉框进行赋值
          this.gongsiArr = [];
          let param = {};
          param.status = "1";
          param.level = '1';
          param.pageSize=9999999;
          xiangMu(param).then(res=>{
            if(res.code =="100"){
              console.log('我是集团数据')
              res.data.list.map((item)=>{
                let dic={};
                dic.value=item.cname;
                dic.label=item.id;
                this.gongsiArr.push(dic)
                if(item.id == id){
                  this.formItem.jituan = item.pid;
                  console.log("找到的公司"+item.cname+'-'+item.id+'-'+item.pid);
                }
              })
              this.formItem.gongsi = id;
              // console.log(this.formItem.gongsi)
              console.log(this.jituanArr)
          }  
         })
       },
     
            //状态判断
            getS(){
                if(sessionStorage.getItem('statusOne')=='1'){//修改
                     this.showDisplay=false;
                     this.searchM();
                      this.getFuZhi();

                }else if(sessionStorage.getItem('statusOne')=='2'){//添加
                   
                     this.shouM=false
                }else{
                     this.showDisplay=true;
                     this.shouM=true
                }
            }

     
  
    },
    
    mounted(){
      console.log(JSON.parse(sessionStorage.getItem('ro')));
        if(JSON.parse(sessionStorage.getItem('ro'))!=null){
            this.xiangId=JSON.parse(sessionStorage.getItem('ro')).id
        }
       
        console.log(this.keHuId+'======gggggg=======')
        console.log(this.keName+'客户名称')
       this.getOrg();//客户查询
       this.getS();//状态判断
       this.getSuoGong();//所属集团
      
    },
    
    created(){
     
   
    },
}

</script>
 <style lang="less" >
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
     #moppp .ivu-form-item{
           margin-bottom:4px!important;
     }
</style>
