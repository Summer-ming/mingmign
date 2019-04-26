<!--
 * @Description: 客户列表
 * @Author: gmm
 * @LastEditors: Please set LastEditors
 * @Date: 2019-03-20 10:47:19
 * @LastEditTime: 2019-04-22 13:59:30
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
   
    
    <!-- 添加人员 -->
     <Modal
        title="121313"
        v-model="modal10" @on-ok="okConfig('formValidate')"
        @on-cancel="cancel('formValidate')"
        :mask-closable="false" inline width='700px;' >
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="员工姓名" prop="name" class='width_150' >
            <i-input   v-model="formValidate.name" placeholder="输入员工姓名"></i-input  >
        </FormItem>
        <FormItem label="所属岗位" prop="gangW" class='width_150'>
            <Select v-model="formValidate.gangW" placeholder="输入员工岗位">
                <Option value="技术">技术</Option>
                <Option value="财务">财务</Option>
                <Option value="运营">运营</Option>
            </Select>
        </FormItem>
        <FormItem label="所属部门" prop="buM" class='width_150'>
            <Select v-model="formValidate.buM" placeholder="输入员工部门">
                <Option value="技术">技术</Option>
                <Option value="财务">财务</Option>
                <Option value="运营">运营</Option>
            </Select>
        </FormItem>
        <FormItem label="员工账户名" prop="account" class='width_150'>
            <i-input   v-model="formValidate.account" placeholder="输入员工账户"></i-input  >
        </FormItem>
        <FormItem label="手机号" prop="phone" class='width_150'>
            <i-input   v-model="formValidate.phone" placeholder="输入手机号"></i-input  >
        </FormItem>
        <FormItem id='formM'>
            <Button  @click="cancel('formValidate')" style="margin-left: 8px">重置</Button>
             <Button type="primary" @click="okConfig('formValidate')">确定</Button>
        </FormItem>
    </Form>
    </Modal>
    <!-- 增加客户弹窗 -->
     <Modal 
     v-model="modal" 
     :title="modalTitle"
     ok-text="提交"
     :z-inde="9999" 
     width="1100" :styles="{top:'10px'}" >
      <Form :label-width="120" inline :model="addForm">
        <b class="font_32">基础信息</b>
        <br>
        <FormItem label="姓名:" prop="name">
           <i-input   style="width:180px" v-model="addForm.name" placeholder="请输入姓名"/>
         </FormItem>
         <FormItem label="手机号:" :label-width="140" prop="phone">
           <i-input   style="width:180px" v-model="addForm.phone" placeholder="请输入手机号"/>
         </FormItem>
         <br>
         <b class="font_32">公司信息</b>
         <br>
        <FormItem label="公司:" >
           <i-input   style="width:180px" v-model="addForm.companyName" placeholder="请输入公司"/>
         </FormItem>
        <FormItem label='税号' :label-width="140">
            <Input style='width:180px' v-model='addForm.taxNo' placeholder='请输入税号'/>
        </FormItem>
        <br>
        <FormItem label="所在城市:" >
          <Cascader :data="dataOne"  :placeholder="addForm.cityWhere_placeholder" v-model="addForm.cityWhere" @on-change='getCity' style='width:180px'></Cascader>
        </FormItem>
        
        <FormItem label="联系电话：" :label-width="140">
            <Input style='width:180px' v-model='addForm.orgPhone' placeholder='请输入开票资料上的电话'/>
        </FormItem>
        <FormItem label='公司地址:' :label-width="170">
            <Input style='width:180px' v-model='addForm.orgAddress' placeholder='请输入开票资料上的公司地址'/>
        </FormItem>
        <br>
        <b class="font_32">银行卡信息</b>
        <br>
         <FormItem label="开户银行:" >
           <i-input   style="width:180px" v-model="addForm.dkAccBank" placeholder="请输入开户银行"/>
         </FormItem>
        
         
         <FormItem label="银行账号:"  :label-width="140">
           <i-input   style="width:180px" v-model="addForm.dkAccBankCode" placeholder="请输入银行账号"/>
         </FormItem>
         <br>
         <!-- 退款银行三级查找 -->
          <FormItem label="退款开户行:">
              <Select :label-in-value="true" v-model="openBank" filterable style='width:180px;' @on-change='getChange'>
                <Option v-for="(item,index) in bankAdd" :value="item.bankAbbreviation" :key="index">{{ item.bankAbbreviation}}</Option>
            </Select>
         </FormItem>
         <FormItem label="退款银行所在地区:" :label-width="140" >
             <Cascader :data="dataOne1" v-model="valueOne" @on-change='getCityOne' style='width:180px'></Cascader>
         </FormItem>
        <FormItem label='退款银行开户网点名称:' :label-width="170">
            <Select :label-in-value="true" :placeholder="bankDot_placeholder" v-model="bankDot" filterable style='width:180px;' @on-change='getChangeDot'>
                <Option v-for="(item,index) in bankDotList" :value="item.bankBranchLineId" :key="index">{{ item.branchFullName}}</Option>
            </Select>
        </FormItem>
        <!-- 退款银行三级查找结束 -->
        <FormItem label="退款银行账号:" >
           <i-input   style="width:180px" v-model="addForm.tkAccBankCode" placeholder="请输入退款银行账号"/>
        </FormItem>
         
        <br>
         <!-- 上传图片控件 -->
        <b class="font_32">图片信息</b> 
        <Tag type="border" color="error">第一张为营业执照</Tag>
        <Tag type="border" color="error">第二张为开票资料</Tag>       
        <br>
        <div  class="demo-upload-list " v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url" >
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
<template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
</div>
<Upload 
ref="upload" 
:show-upload-list="false" 
:default-file-list="defaultList" 
:on-success="handleSuccess" 
:format="['jpg','jepg','png']" 
:max-size="5120" 
:on-format-error="handleFormatError" 
:on-exceeded-size="handleMaxSize" 
:before-upload="handleBeforeUpload"
    multiple type="drag" :action="updateImgUrl" style="display:inline-block;width:58px">
    <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
    </div>
    <Modal title="查看图片" v-model="visible">
        <img :src="this.$global.ossUrl + imgName" v-if="visible" style="width: 100%">
    </Modal>
</Upload>
<!-- 上传图片控件结束 -->

</Form>
<!-- modal底部按钮 -->

<div class="margin-top-20">
    <Button v-show="addBtn"  type="primary" @click="addNewCustomer">添加</Button>
    <Button v-show="changeBtn" type="primary" @click="changeCustomer">修改</Button>
    <Button  type="default" @click="modalCancel">取消</Button>
</div>
</Modal>
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
</div>
</template>
<script>
    import {
        updatePaymentRequest,
        addOrgCustomer,
        findOrginization,
        findOrgCusAcc,
        updateOrgCus
    } from '@/api/data'
    import {
        cusSearch,
        getUserList,
        getOpeningBank,
        getBankDot
    } from '@/api/cusData' //客户列表
    // import city from '@/api/city' //三级城市
    import city from '@/api/city_houtai'


    export default {
        name: 'customerlist',
        inject: ['reload'],
        data() {
            return {
                updateImgUrl: this.$global.updateImgUrl,
                visible: false,
                defaultList: [],
                returnBankItem: {},
                bankAdd: [],
                valueOne: [],
                addBtn:false,
                changeBtn:false,
                // value:[],
                openBank: '',
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
                visible: false,
                uploadList: [
                ],
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
                    cusId:'',
                    orgId:'',
                    name: '', //姓名
                    phone: '', //手机号
                    companyName: "", //公司名称
                    taxNo: '', //税号
                    cityWhere: [], //所在城市
                    orgPhone: '', //开票联系电话
                    orgAddress: '', //公司地址
                    dkAccBank: '', //打款银行
                    dkAccBankCode: '', //打款银行卡号
                    refundBank: '',
                    nameRefund: "",
                    tkAccBankCode: '', //退款银行卡
                    cityWhere_placeholder:'请选择城市'
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
                                            this.addBtn = false;
                                            this.changeBtn = true;
                                            this.modalTitle = "修改客户信息"
                                            this.setmodalInfo(params);
                                            this.modal = true;
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
                                            this.addBtn = false;
                                            this.changeBtn = false;
                                            this.modalTitle = "查看客户信息"
                                            this.setmodalInfo(params);
                                            this.modal = true;

                                             
                                    
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
                                            this.setmodalInfo(params);
                                            this.modal2 = true;
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: 'disabled'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            //查看客户基础信息
                                            
                                        }
                                    }
                                }, '沟通'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: 'disabled'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '联系人'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: 'disabled'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '下单'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: 'disabled'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '销售合同'),
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
                param.id = this.addForm.cusId;
                param.orgId = this.addForm.orgId;
                param.status = "0"
                console.log("删除成功");
                updateOrgCus(param).then(res =>{
                    if(res.code =="100"){
                        this.$Notice.success({
                            title:'删除成功',
                        })
                        setTimeout(() => {
                           this.reloadSelf() 
                        }, 2);
                        

                    }
                })
            },
            addNew(){
                this.modal=true
                this.modalTitle = "新增客户"
                this.addBtn = true;
                this.changeBtn = false;
            },
            //给modal赋值
            setmodalInfo(item){
                        let dic = item.row;
                        this.returnBankItem.label = dic.tkaccBank
                        this.returnBankItem.value = dic.tkaccBankCode

                        //给modal赋值
                        this.addForm.cusId = dic.cusid;
                        this.addForm.orgId = dic.orgid;
                        this.addForm.name        = dic.cus //姓名
                        this.addForm.phone       =dic.cusphone//手机号
                        this.addForm.companyName =dic.orgorgName //公司名称
                        this.addForm.taxNo       =dic.orgtaxNo //税号

                        this.addForm.cityWhere_placeholder = dic.cusaddress  //所在城市
                        this.cityString                    = dic.cusaddress

                        this.addForm.orgPhone      = dic.orgorgPhone    //开票联系电话
                        this.addForm.orgAddress    = dic.orgorgAddress  //公司地址
                        this.addForm.dkAccBank     = dic.dkAccBank      //打款银行
                        this.addForm.dkAccBankCode = dic.dkAccBankCode  //打款银行卡号
                        this.addForm.tkAccBankCode = dic.tkAccBankCode  //退款银行卡
            
                        this.addForm.dkAccBankCode = dic.dkaccBankCode
                        this.addForm.dkAccBank     = dic.dkaccBank
                        this.addForm.tkAccBankCode = dic.tkaccBankCode
                        this.bankDot_placeholder   = dic.tkaccBank;
                    //配置图片参数;
                        this.uploadList                     = this.$global.setDefaultImgList([dic.orgshuiwudengjiPhoto,dic.orgkaipiaoPhoto]);
            },
            addNewCustomer() {//添加
            this.addBtn = true;
            this.changeBtn = false;
                console.log(this.returnBankItem); //退款银行需要的数据
                // 添加所需的参数
                let param = {};
                param.isMain            = "1";
                param.address           = this.cityString;
                param.adminCname        = this.$global.adminInfo.cname;
                param.adminEname        = this.$global.adminInfo.ename;

                param.adminId           = this.$global.adminInfo.ename;
                param.adminName         = this.$global.adminInfo.cname
                param.createCname       = this.$global.adminInfo.cname
                param.createEname       = this.$global.adminInfo.ename
                param.createUserId      = this.$global.adminInfo.id
                param.cusSeatNumber     = this.addForm.orgPhone
                //打款银行卡
                param.dkAccBank         = this.addForm.dkAccBank
                param.dkAccBankCode     = this.addForm.dkAccBankCode
                param.dkAccType         = "0"
                param.dkAccAuditStatus  = "8"
                //打款银行卡结束
                //退款银行卡开始
                param.tkAccBank         = this.returnBankItem.label
                param.tkAccBankCode     = this.addForm.tkAccBankCode
                param.tkAccBblId        = this.returnBankItem.value
                param.tkAccType         = "1"
                param.tkAccAuditStatus  = "8"
                //退款银行卡结束
                param.dongjieMoney      = "0"
                param.money             = "0"

                param.name              = this.addForm.name
                param.orgAddress        = this.addForm.orgAddress;
                param.orgName           = this.addForm.companyName;
                param.taxNo             = this.addForm.taxNo
                param.orgPhone          = this.addForm.orgPhone
                param.password          = "123456"
                param.phone             = this.addForm.phone
                param.registerType      = "5"

                param.shuiwudengjiPhoto = this.uploadList[0].url;
                param.kaipiaoPhoto      = this.uploadList[1].url
                param.vipStatus         = "8"
                addOrgCustomer(param).then(res =>{
                    if(res.code =="100"){
                        this.$Notice.success({
                            title:'添加成功',
                        })
                        this.reloadSelf()
                    }
                })
            },
            changeCustomer() {
                //修改 
                let param = {};
                param.id = this.addForm.cusId;
                param.orgId = this.addForm.orgId;
                //姓名
                param.name  = this.addForm.name;
                // 手机号
                param.phone = this.addForm.phone;

                // 公司名
                param.orgName = this.addForm.companyName
                // 税号
                param.taxNo   = this.addForm.taxNo
                // 所在城市
                param.address = this.cityString;
                // 联系电话
                param.orgPhone = this.addForm.orgPhone
                // 公司地址
                param.orgAddress = this.addForm.orgAddress
                // 开户行
                // 银行账户
                param.dkAccBank         = this.addForm.dkAccBank
                param.dkAccBankCode     = this.addForm.dkAccBankCode
                param.dkAccType         = "0"
                param.dkAccAuditStatus  = "8"
                // 退款行
                // 退款行账号
                param.tkAccBank         = this.returnBankItem.label
                param.tkAccBankCode     = this.addForm.tkAccBankCode
                param.tkAccBblId        = this.returnBankItem.value
                param.tkAccType         = "1"
                param.tkAccAuditStatus  = "8"
                // 图片
                param.shuiwudengjiPhoto = this.uploadList[0].url;
                param.kaipiaoPhoto      = this.uploadList[1].url
                console.log(param);
                updateOrgCus(param).then(res =>{
                    if(res.code =="100"){
                        this.$Notice.success({
                            title:'修改成功',
                        })
                        this.reloadSelf()

                    }
                })

            },
            modalCancel() {
                this.modal = false;
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
                this.getSerch(param)
            },
            //根据公司名，业务员查询
            getSerch(param) {
                findOrgCusAcc(param).then(res => {
                    console.log("请求成功")
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
            //上传图片
            handleView(name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove(file) {
                this.uploadList.splice(this.uploadList.indexOf(file), 1);
            },
            handleSuccess(res, file) {
                this.$Message.success('上传成功');
                console.log("上传成功");
                file.name = res.msg;
                file.url = this.$global.ossUrl + res.msg;
                console.log(file);
                this.uploadList.push(file);
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确 ',
                    desc: '文件 ' + file.name + '格式不正确，请选择 jpg 或者 png.'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超过文件大小限制',
                    desc: '文件  ' + file.name + ' 太大，最大不超过20M'
                });
            },
            handleBeforeUpload() {
                console.log("验证最大上传张数")
                console.log(this.uploadList.length)

                const check = this.uploadList.length < 2;
                if (!check) {
                    this.$Notice.warning({
                        title: '最大支持上传2张图片'
                    });
                }else{
                    console.log("大大大")
                }
                return check;
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
            //直接获取银行开户行数据
            getBan(param) {
                //let param4={bankName:"123"},//开户行参数
                console.log(param);
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
            getCityOne(value, selectedData) {
                this.Provinces = selectedData[0].label
                this.city = selectedData[1].label
                if (selectedData.length == '2') {
                    this.cityStringOne = selectedData[0].label + ',' + selectedData[1].label
                } else {
                    this.cityStringOne = selectedData[0].label + ',' + selectedData[1].label + ',' + selectedData[2].label
                }
                this.getBankDotName();
            }
        },
        mounted() {
            this.getBan(); //开户行数据
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