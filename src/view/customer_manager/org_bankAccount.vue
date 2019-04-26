<!--
 * @Description:店铺管理 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-04 10:42:57
 -->


<template>
     <div>
       <h2 >{{ addForm.orgName}}</h2>
       <br>
       <Row>
          <Col span="8">
          <Card>

          
      <Form :label-width="150" inline :model="addForm">
        
         <!-- 退款银行三级查找 -->
          <FormItem label="退款开户行:">
              <Select :label-in-value="true" v-model="openBank" filterable style='width:180px;' @on-change='getChange'>
                <Option v-for="(item,index) in bankAdd" :value="item.bankAbbreviation" :key="index">{{ item.bankAbbreviation}}</Option>
            </Select>
         </FormItem>
         <FormItem label="退款银行所在地区:"  >
             <Cascader :data="dataOne1" v-model="valueOne" @on-change='getCityOne' style='width:180px'></Cascader>
         </FormItem>
        <FormItem label='退款银行开户网点名称:' >
            <Select :label-in-value="true" :placeholder="bankDot_placeholder" v-model="bankDot" filterable style='width:180px;' @on-change='getChangeDot'>
                <Option v-for="(item,index) in bankDotList" :value="item.bankBranchLineId" :key="index">{{ item.branchFullName}}</Option>
            </Select>
        </FormItem>
        <!-- 退款银行三级查找结束 -->
        <FormItem label="退款银行账号:" >
           <i-input   style="width:180px" v-model="addForm.bankCode" placeholder="请输入退款银行账号"/>
        </FormItem>
        </Form>
        <br>
        <div>
          <Button   type="primary" @click="addNewCard">新增</Button>
        </div>
        </Card>
          </Col>
          <!-- 右侧列表 -->
         <Col span="16">
          <Table border ref="selection" :columns="columns4" :data="data1"  style='margin-bottom:10px;'>
            
        </Table>
         </Col>
         
       </Row>

     </div>
</template>

<script>
import {findShop,findAccount,updateAccount,addAccount} from '@/api/data'
import city from '@/api/city_houtai'
  import {
        getOpeningBank,
        getBankDot
    } from '@/api/cusData' //客户列表

export default {
    name: 'org_bankAccount',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        tableItem:{},
        returnBankItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        openBank: '',
        bankAdd: [],
        valueOne: [],
        bankDot:'',
        bankDotList: [],
        bankDot_placeholder:'请选择支行名称',
        dataOne1: city,
        addForm: {
          companyName:'',
          orgId:'',
          bankCode:'',
          orgName:''
          },
          columns4: [
                    {
                        title: 'ID',
                        key: 'accId',
                        align: 'center',
                        width:'120'
                    },
                    {
                        title: '银行名称',
                        key: 'accBank',
                        align: 'center',
                        width:'300'
                    },
                    {
                        title: '卡号',
                        key: 'accBankCode',
                        align: 'center',
                         width:'200'
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
                                          this.deleteShop(params.row);
                                        }
                                    }
                                }, '删除'),

                             ]);
                    }
                        
                    },
                    
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      deleteShop(item){
          console.log(item.accId);
             let param = {};
              // 开始查询
              console.log("开始查询")
              param.accountId = item.accId
              findShop(param).then(res=>{
                if(res.data.list.length >0){
                  this.$Notice.error({
                    title:'不可删除'
                  })
                }else{
                  this.beginDelete(item);

                }
              })
      },
      beginDelete(item){
        this.$Modal.confirm({
                                           title:"确定需要删除吗",
                                           onOk:()=>{
                                               let param = {};
                                               param.accId = item.accId;
                                               param.accStauts = "0";
                                                updateAccount(param).then(res=>{
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
      },
        reloadSelf(){
            this.reload();
        },
        addNewCard(){
              let param = {};
            	param.accBankCode = this.addForm.bankCode;
              param.accBblId = this.returnBankItem.value;
				      param.accBank = this.returnBankItem.label;
            	param.accType = 30;
            	param.accAuditStatus = 8;
				      param.accOrgId = this.addForm.orgId;
          addAccount(param).then(res=>{
                if(res.code =="100"){
                        this.$Notice.success({
                            title:'添加成功',
                        })
                        setTimeout(() => {
                           this.reloadSelf() 
                        }, 1000);
                        

                    }
          })
        },
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.accOrgId   = this.addForm.orgId
         param.accType = "30"
         param.accStauts = "1"
         param.pageSize = "100"
        if(this.addForm.orgId =="" || this.addForm.orgId =="undefined" ||this.addForm.orgId == undefined){
          return ;
        }
        //  param.pageNum=this.pagesizea //分页
        //  param.status = 1 ;
          findAccount(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
          }  
         })
       },
       //银行三级联动
       //直接获取银行开户行数据
            getBan(param) {
                //let param4={bankName:"123"},//开户行参数
                let param1 = {
                    "pageSize": "9999"
                }
                getOpeningBank(param1).then(res => {
                    if (res.code == "100") {
                        this.bankAdd = res.data;
                    }
                })
            },
            //选中开户行确定的数据
            getChange(item) {
                this.bankString = item.value;
                this.getBankDotName();
            },
            //选中开户网点的名字
            getChangeDot(item) {
                this.returnBankItem = item;
            },
            //获取开户网点的数据
            getBankDotName() {
                if (this.Provinces == '' && this.city == '') return false
                const paramB = {};
                paramB.bankAbbreviation = this.bankString //银行名称
                paramB.bankBranchLineCity = this.Provinces //省
                paramB.prefectureLevel = this.city //市
                getBankDot(paramB).then(res => {
                    if (res.code == "100") {
                        this.bankDotList = res.data;
                    }
                })

            }, //银行所在地区
            getCityOne(value, selectedData) {
                this.Provinces = selectedData[0].label
                this.city = selectedData[1].label
                if (selectedData.length == '2') {
                    this.cityStringOne = selectedData[0].label + ',' + selectedData[1].label
                } else {
                    this.cityStringOne = selectedData[0].label + ',' + selectedData[1].label + ',' + selectedData[2].label
                }
                this.getBankDotName();
            },
            setItem(){
              this.addForm.orgId = this.$route.query.cusorgId;
              this.addForm.orgName = this.$route.query.cusorgName;
            }
    },
    
    mounted(){
     this.setItem();
     this.getBan(); //开户行数据

     this.searchM();
    },
    
    created(){
   
    },
}

</script>
