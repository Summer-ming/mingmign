<template>
  <div>
  
      <row style='margin-bottom:20px;'>
           <Table :columns="columns1" :data="data1"></Table>
      </row>
     <row>
          <Button  style="margin-right:10px" type="primary" @click="addNew">新增杂费</Button>
          <Button   type="primary" @click="getCha">刷新</Button>

     </row>
      
      <!-- 杂费对话框 -->
    <Modal
        v-model="modal1" :mask-closable='false' :footer-hide='true'
        :title="modalTitle">
         <Form :label-width="120" inline :model="addForm">
        <row>

         <FormItem label="杂费名称:" prop="nameZ">
           <i-input   style="width:200px" v-model="addForm.nameZ" placeholder="请输入杂费名称"/>
         </FormItem>

        <FormItem label="杂费金额:" prop="moneyZ">
           <i-input   style="width:200px" v-model="addForm.moneyZ" placeholder="请输入杂费金额"/>
         </FormItem>

        <FormItem label='公司名称'>
                <Select style='width:200px'  v-model="conmpanyOne" filterable :label-in-value='true' @on-change='getUserTwo'>
                    <Option v-for="(option, index) in companyZu" :value="JSON.stringify(option)" :key="index">{{option.cusorgName}}</Option>
                </Select>
                <p>{{companyTwo}}</p>
        </FormItem>

        <FormItem label="说明:" prop="shuomm">
            <i-input style="width:200px" type="textarea" :rows="3" v-model="addForm.shuomm" placeholder="请输入备注" />
        </FormItem>

        </row>
       <!-- 添加  取消按钮 -->
        <row>
            <Button v-show="addBtn" style="margin-right:10px"   type="primary"  @click='getFei'>添加</Button>
            <Button v-show="updateBtn" style="margin-right:10px"   type="primary"  @click='updateAction'>修改</Button>

            <Button   type="primary" @click="modal1 = false" >取消</Button>
        </row>

      </Form>
       
    </Modal>



  </div>
</template>

<script>
import {getZha,getAddFei,getShan} from '@/api/cusData'//查询杂费
import {findOrgList,updateBuy} from '@/api/data'
  export default {
    name: 'buy_Incidental',
    props: ["allOrder_orderItem"],
    data(){
      return {
        companyTwo:'',
        companyId:'',
        addBtn:true,
        updateItem:{},
        updateBtn:false,
        modalTitle:"新增杂费",
          columns1: [
                    {
                        title: 'Id',
                        key: 'id',
                        width:'60'
                
                    },
                    {
                        title: '杂费名称',
                        key: 'name'
                    },
                    {
                        title: '杂费金额',
                        key: 'money'
                    },
                     {
                        title: '说明',
                        key: 'note'
                    },
                     {
                        title: '公司名称',
                        key: 'orgName'
                    },
                     {
                        title: 'status',
                        key: 'status'
                    },
                     {
                        title: '创建时间',
                        key: 'createTiime'
                    },
                     {
                        title: '创建人名称',
                        key: 'userName'
                    },
                     {
                        title: '订单号',
                        key: 'orderNo'
                    },
                    {
                      key:'operate',
                      title:'操作',
                      width:'150px',
                      align:'center',
                      render:(h,params)=>{
                        return h('div',[
                          h('Button',{
                            props: {
                            type: 'primary',
                            size: 'small'
                            },
                            style: {
                              marginRight: '5px'
                            },
                            on: {
                              click: () => {
                                this.remove(params.row.id)
                              }
                            }
                          },'删除'),
                            h('Button',{
                            props: {
                            type: 'primary',
                            size: 'small'
                            },
                            style: {
                              marginRight: '5px'
                            },
                            on: {
                              click: () => {
                                this.setModalItem(params.row);
                              }
                            }
                          },'编辑')
                        ])

                      }},

                ],
          data1: [  
                ],
          dataParent:'',//绑定父组件传过来的值
          modal1:false,//杂费对话框
          addForm:{
              nameZ:"",//杂费名称
              moneyZ:'',//杂费金额
              shuomm:"",//说明
          },//杂费表单弹窗
          conmpanyOne:"",//公司名称
          companyZu:[],//贮存公司名称

      }
    },
    methods:{
      addNew(){
          this.modalTitle = "新增杂费"
        this.modal1 = true
        this.addBtn = true;
        this.updateBtn = false;
      },
      setModalItem(item){//编辑赋值
          this.modalTitle = "编辑杂费"
        this.modal1 = true
        this.addBtn = false;
        this.updateBtn = true;
        this.updateItem = item;

        this.addForm.nameZ = item.name         //杂费名称
        this.addForm.moneyZ = item.money       //杂费金额
        this.companyTwo = item.orgName           //公司名称
        this.companyId = item.orgId           //公司id
        this.addForm.shuomm  = item.note       //说明
      },
       getCha(val){
            console.log('我来了')
            let param={};
             param.orderId = this.dataParent.id;
             param.orderType="1"
             param.status = "1"
             getZha(param).then(res=>{
             if(res.code =="100"){
             this.data1=res.data.list
          }  
         })
       },
       updateAction(){//修改
          let param             = {};
              param.name        = this.addForm.nameZ         //杂费名称
              param.money       = this.addForm.moneyZ        //杂费金额
              param.orgName     = this.companyTwo            //公司名称
              param.orgId       = this.companyId;            //公司id
              param.note        = this.addForm.shuomm        //说明

              param.userId     = this.$global.adminInfo.id
              param.userName   = this.$global.adminInfo.cname
              param.id = this.updateItem.id;
          getShan(param).then(res=>{
            if(res.code =="100"){
             this.$Message.success("修改成功")
             this.modal1 =false;
             this.getCha();
             this.getTotal();
          }  
         })
       },
       getTotal(){//无论添加成功还是删除成功都需要调用
       let p         = {};
           p.orderId = this.dataParent.id;
          updateBuy(p).then(res =>{
          })
       },
       //添加杂费
       getFei(){
          let param             = {};
              param.name        = this.addForm.nameZ         //杂费名称
              param.money       = this.addForm.moneyZ        //杂费金额
              param.orgName     = this.companyTwo            //公司名称
              param.orgId       = this.companyId;            //公司id
              param.note        = this.addForm.shuomm        //说明
              param.explanation = this.addForm.explanation   //说明
              param.orderId     = this.dataParent.id;
              param.orderNo     = this.dataParent.ordersNo;

              param.orderType = "1"
              param.status     = '1'
              param.type     = '1'

              param.userId     = this.$global.adminInfo.id
              param.userName   = this.$global.adminInfo.cname
          getAddFei(param).then(res=>{
            if(res.code =="100"){
             this.$Message.success("添加成功")
             this.modal1 =false;
             this.getCha();
             this.getTotal();
          }  
         })
        
       },
       //获取公司选中
       getUserTwo(item){
          const stingTwo        = eval('(' + item.value + ')')
                this.companyTwo = stingTwo.cusorgName
                this.companyId  = stingTwo.cusorgId
      },
       //公司名称请求数据
       getCompany(){
          let param={};
         param.orgName='' //name
         param.pageNum='9999' //分页
         param.status = 1 ;
         findOrgList(param).then(res=>{
            if(res.code =="100"){
              this.companyZu=res.data.list
          }  
         })

       },
       //删除表格
       remove(index){
           //删除的id index getShan
         let param={};
         param.id=index
         param.status='0'
         getShan(param).then(res=>{
             if(res.code =="100"){
             this.$Message.success("删除成功")

             this.getCha();
             console.log('我成功了删除了')
          }  
         })
       },

    },
    mounted(){
      this.getCompany();
    },
    watch: {
        allOrder_orderItem(val){
            console.log("watch 监听测试");
            console.log(val.ordersNo);
            // this.valueForm_allOrder_orderItem = val;
            // this.getOrderAuditList();
            this.dataParent=val
            console.log(val)
            this.getCha(val);
        }
    },
  }
</script>
<style <style lang="less">

</style>

