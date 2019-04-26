<!--
 * @Description: 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-02 17:29:26
 -->


<template>
  <div>
      <Card :border="false" :dis-hover="true">
      <Form :model="formItem" :label-width="80">
        <Row>
          <i-col span="5"><FormItem label="公司名:">
          <i-input     placeholder="请输入公司名称" v-model="formItem.companyName"></i-input  >
        </FormItem>
        </i-col>
        <!-- todo -->
          <i-col span="5" >
            <FormItem style="display:none;" label="业务员">
              <Select
                v-model="model13"
                filterable
                remote
                :remote-method="remoteMethod1"
                @on-change='changeOpation'
                :loading="loading1">
                <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
            </Select>
            </FormItem>
          </i-col>
           <i-col span="5" style='margin-right:10px;'>
            <FormItem style="display:none;" label="公司类型">
              <Select v-model="formItem.companyType">
                <Option value="北京">北京</Option>
                <Option value="上海">上海</Option>
                <Option value="深证">深圳</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="3">
             <Button type='primary' @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf" ></Button>
          </i-col>
        </Row>
      </Form>
      <Row  style='margin-bottom:10px;padding-left:20px;display:none;'>
           <Button>所有单位</Button>
           <Button>潜在单位</Button>
           <Button>今天联系</Button>
           <Button>明天联系</Button>
           <Button>本周内联系</Button>
           <Button>本月内联系</Button>
      </Row>
    </Card>
    <!--表格height="447" -->
    <Row>        
         <Table border   ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'></Table>
        
        
        <Row span='8' style="margin-bottom:20px;display:flex;">
             <!-- 功能添加删除 -->
            <div style='flex:1'>
            <Button  icon="md-add" type="primary" @click='addNew'>新增</Button>
            
            <Button v-show="false"  icon="md-add" type="primary"  @click='modal10=true'>指派业务员</Button>
             <Button v-show="false"   icon="ios-trash-outline" type="primary" @click="modal2 = true">删除</Button>
     
      
       
     
            <Button disabled  icon="ios-trash-outline" type="primary" @click='getT'>通过审核</Button>
    
            <Button disabled  icon="ios-trash-outline" type="primary">审核不通过</Button>
            <Button disabled icon="ios-trash-outline" type="primary">锁定</Button>
            <Button disabled  icon="ios-trash-outline" type="primary">解锁</Button>
            </div>
    
             <!-- 分页 -->
             <Page  @on-change='changePage'  :total="totalM"  show-elevator show-sizer  show-total style='text-align:right;'/>
          
        </Row>
    </Row> 
   
<!-- 结束 -->
<Modal v-model="modal2" width="360">
    <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除信息</span>
    </p>
    <div style="text-align:center">
        <p>删除后将不可找回</p>
        <p>是否删除?</p>
    </div>
    <div >
        <Button @click="deleteCus" type="error" size="large" long>删除</Button>
    </div>
</Modal>
<!-- 引入的公司详情 -->
<Modal v-model="orgInfoModal" footer-hide fullscreen >
    <orgAddInfo :orgItema="orgItem"></orgAddInfo>
</Modal>
</div>
</template>
<script>
    import {
        findOrgCusAcc,
        updateOrgCus,
        updateShop
    } from '@/api/data'
    import {
        getUserList,
    } from '@/api/cusData' //客户列表
    // import city from '@/api/city' //三级城市
    import city from '@/api/city_houtai'
    import orgAddInfo from '@/view/customer_manager/supplierList_add'


    export default {
        name: 'customerlist',
        inject: ['reload'],
        components: {
            orgAddInfo
        },
        data() {
            return {
                orgInfoModal:false,
                orgItem:'',
                //以下为旧的内容
                addBtn:false,
                changeBtn:false,
                modal2: false,
                model13: '',
                loading1: false,
                modalTitle: '新增客户',
                options1: [],
                list: ['中国', '香港', '美国', '台湾', '调鱼岛'],
                listCon: [], //
                listCname: [], //保存业务员名字
                businessName: '', //下拉框选中时业务员的名字
                params: {}, //获取业务员列表
                cityStringOne: "", //银行省市区
                Provinces: "", //省
                city: "", //市
                bankDotList: [],
                bankDot: '',
                bankDot_placeholder:'请选择支行名称',
                imgName: '',
                uploadList: [
                ],
                changeItem:{
                    cusId:"",
                    orgId:''
                },
                cityString: '', //省市区-字段
                dataOne: city,
                dataOne1: city,
                totalM: 0, //表格分页总天数
                pagesizea: 1, //默认分页第一页
                modal10: false,
                modal: false, //控制添加客户弹窗
                formValidate: {
                    name: '',
                    gangW: '',
                    buM: '',
                    account: '',
                    phone: '',
                },
                ruleValidate: {
                    name: [{
                        required: true,
                        message: '名字不能为空',
                        trigger: 'blur'
                    }],
                    gangW: [{
                        required: true,
                        message: '请选择岗位',
                        trigger: 'change'
                    }, ],
                    buM: [{
                        required: true,
                        message: '请选择部门',
                        trigger: 'change'
                    }],
                    account: [{
                        required: true,
                        message: '请填写账户信息',
                        trigger: 'blur'
                    }],
                    phone: [{
                        required: true,
                        message: '请填写手机号',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: 11,
                        message: '请填写正确手机号',
                        trigger: 'blur'
                    }]
                },
                formItem: {
                    companyName: '', //员工姓名
                    companyType: '', //公司类型

                },
                addForm: { //新增客户添加的字段
                },
                columns4: [{
                        title: '选中',
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    }, {
                        title: '公司名称',
                        key: 'cusorgName',
                        align: 'center',
                        width: '220'

                    }, {
                        title: '业务员',
                        key: 'orgcreateCname',
                        align: 'center',
                        width: '80'
                    }, {
                        title: '税号',
                        key: 'orgtaxNo',
                        align: 'center',
                        width: '200'
                    },
                    {
                        title: '添加时间',
                        key: 'orgcreateTime',
                        align: 'center',
                        width: '200'
                    }, {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width: '450',
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
                                            params.row.orgAddType  ="2"
                                               const route = {
                                                  name: 'supplierList_add',
                                                  query: params.row

                                                }
                                                this.$router.push(route)
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
                                                 params.row.orgAddType  ="2"
                                               const route = {
                                                  name: 'supplierList_add',
                                                  query: params.row

                                                }
                                                this.$router.push(route)

                                        }
                                    }
                                }, '查看'),
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
                                                params.row.operateType  ="1"//添加
                                               const route = {
                                                  name: 'shopListInfo',
                                                  query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                                    }
                                }, '添加店铺'),
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
                                                params.row.operateType  ="1"//添加
                                               const route = {
                                                  name: 'org_bankAccount',
                                                  query: params.row

                                                }
                                                this.$router.push(route)
                                        }
                                    }
                                }, '管理银行卡'),
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
                                            this.setmodalInfo(params);
                                            this.modal2 = true;
                                        }
                                    }
                                }, '删除'),
                            ]);
                        }

                    },

                ],
                data1: [], //表格展示的数据 
            }
        },
        methods: {
            deleteCus(){
                let param = {};
                param.id = this.changeItem.cusId;
                param.orgId = this.changeItem.orgId;
                param.status = "0"
                console.log("删除成功");
                updateOrgCus(param).then(res =>{
                    if(res.code =="100"){
                        this.$Notice.success({
                            title:'删除成功',
                        })
                        this.deleteOrgShop();
                        setTimeout(() => {
                           this.reloadSelf() 
                        }, 2);
                    }
                })
            },
            deleteOrgShop(){
                let p = {};
                p.orgString = this.changeItem.orgId;
                p.status = "0"
                 updateShop(p).then(res =>{
                    if(res.code =="100"){
                        this.$Notice.success({
                            title:'删除店铺成功',
                        })
                    }
                })
            },
            addNew(){ 
             const route = {
                                                  name: 'supplierList_add',
                                                  query: {
                                                      'orgAddType':'1'
                                                  }

                                                }
                                                this.$router.push(route)
            },
            //给modal赋值
            setmodalInfo(item){ 
                let dic = item.row;
                this.changeItem.cusId = dic.cusid;
                this.changeItem.orgId = dic.orgid;

            },
            addNewCustomer() {//添加
            },
            changeCustomer() {

            },
            modalCancel() {
                this.orgInfoModal = false;
            },
            //确认
            okConfig(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('添加成功!');
                    } else {
                        this.$Message.error('添加失败!');


                    }
                })
            },
            //取消
            cancel(name) {
                this.$refs[name].resetFields();
            },
            //分页
            changePage(index) {
                console.log(index)
                this.pagesizea = index;
                this.searchM();
            },
            selectOne(row) {
                console.log(row)
            },
            //查询表格
            searchM() {
                //获取查询的i-input  的值
                let param = {};
                param.orgName = this.formItem.companyName //员工姓名
                    //param.aa=this.businessName //业务员名字
                param.pageNum = this.pagesizea //分页
                param.orgRoleType = "2"
                this.getSerch(param)
            },
            //根据公司名，业务员查询
            getSerch(param) {
                findOrgCusAcc(param).then(res => {
                    if (res.code == "100") {
                        this.data1 = res.data.list;
                        this.totalM = res.data.total;
                        // console.log(res.data.list);//总条数 
                    }
                })
            },
            //省市区
            getCity(value, selectedData) {
                if (selectedData.length == '2') {
                    this.cityString = selectedData[0].label + ',' + selectedData[1].label
                } else {
                    this.cityString = selectedData[0].label + ',' + selectedData[1].label + ',' + selectedData[2].label
                }

                console.log(this.cityString)
            },
            getT() { //审核通过
                this.reload();
            },
            //业务员远程搜锁
            remoteMethod1(query) {
                console.log(query)
                if (query !== '') {
                    this.loading1 = true;
                    this.params.pageNum = '99';
                    // console.log(this.params)
                    this.params.status = "1";
                    this.params.cname = query;
                    getUserList(this.params).then(res => {
                        if (res.code == "100") {
                            this.listCon = res.data.list
                            this.listCon.map((value, key, arr) => {
                                this.listCname.push(arr[key].cname)
                            })
                        }
                    })
                    setTimeout(() => {
                        this.loading1 = false;
                        //console.log(this.listCon)
                        const list = this.listCname.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options1 = list.filter(item => item.label.indexOf(query) > -1);
                        this.businessName = query;
                    }, 200);
                } else {
                    this.options1 = [];
                }
            },
            //业务员选中的值
            changeOpation(opation) {
                console.log(opation)
            },
            reloadSelf() {
                this.reload();
            },
            //选中开户行确定的数据
            getChange(item) {
                this.bankString = item.value;
                this.getBankDotName();
            },
            //选中开户网点的名字
            getChangeDot(item) {
                console.log(item);
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
        },
        mounted() {
            //  this.getBankDotName();//开户网点数据
            //账户管理接口
            this.searchM();

            //  this.uploadList = this.$refs.upload.fileList; //上传合同图片
        },
        created() {

        },
    }
</script>
<style <style lang="less">
    .ivu-card-body {
        padding-bottom: 0;
    }
    
    .width_150 {
        width: 500px;
    }
    
    .ivu-modal-content {
        padding-left: 20px;
    }
    
    .ivu-modal-footer {
        display: none;
    }
    
    #formM {
        .ivu-form-item-content {
            margin-left: 357px!important;
        }
    }
    
    .ivu-form-item {
        margin-bottom: 16px!important;
    }
    
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
        margin-top: 20px;
    }
    
    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }
    
    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }
    
    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }
    
    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    
    .font_32 {
        font-size: 32;
    }
</style>