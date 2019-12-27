/** 数量差异
*
*
**/
<style lang="less">
    @import "../../excel/common.less";
</style>
<template>
  <div>
    <!-- 提交付款申请 -->
    <Modal 
    v-model="modal"  :title="modalTitle"  z-index="1" :z-index="1"    @on-ok="modal_ok" @on-cancel="modal_cancel"
     ok-text="提交" width="1000" :styles="{top:'10px'}" >
      <Form :rules="ruleValidate" :label-width="120" inline :model="addForm">
         <FormItem label="付款事由" prop="name">
           <Input style="width:300px" v-model="addForm.name" placeholder="请输入付款事由"/>
         </FormItem>
         <FormItem label="期望付款时间" prop="date">
           <DatePicker format="yyyy-MM-dd"  v-model="addForm.date" type="date" placeholder="请选择日期" style="width:300px"></DatePicker>
         </FormItem>
         <FormItem label="付款金额" prop="payMoney">
           <Input style="width:300px" v-model="addForm.payMoney" placeholder="请输入付款金额"/>
         </FormItem>
         <FormItem label="所属公司" prop="belongCompany">
           <Select :label-in-value='true'     v-model="addForm.select"  clearable style="width:300px" >
             <Option v-for="item in belongCompanyList" :value="JSON.stringify(item)" :key="item.value" :label="item.label">{{item.label}}</Option>
           </Select>
         </FormItem>
         <FormItem label="支付对象" prop="payCompanyName">
           <div>
             <Input style="width:240px" v-model="addForm.payCompanyName" placeholder="请输入公司名称"/>
            <Button type="warning" @click="modal_ok">添加</Button>
           </div>
         </FormItem>
         <FormItem label="付款方式" prop="selectPay">
           <Select v-model="addForm.selectPay" placeholder="请选择付款方式" clearable style="width:300px">
             <Option v-for="item in selectPayList" :value="JSON.stringify(item)" :key="item.value">{{item.label}}</Option>
           </Select>
         </FormItem>
         <FormItem label="银行账户" prop="bankAcount">
           <Input style="width:300px" v-model="addForm.bankAcount" placeholder="请输入银行账户"/>
         </FormItem>
         <FormItem label="开户行" prop="openingBank">
           <Input style="width:300px" v-model="addForm.openingBank" placeholder="请输入开户行名称"/>
         </FormItem>
         <FormItem label="备注" prop="note">
           <Input type="textarea" :rows="3" style="width:300px" v-model="addForm.note" placeholder="请输入备注"/>
         </FormItem>
         <br>
         <!-- 上传图片控件 -->
         <FormItem :required="true" label="合同图片" prop="images">
              <template >
    <div class="demo-upload-list" v-for="item in uploadList">
        <template v-if="item.status === 'finished'">
            <img :src=" ossUrl + item.name">
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
        :format="['jpg','jpeg','png']"
        :max-size="20480"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        multiple
        type="drag"
        :action="updateImgUrl " 
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="md-add" size="50"></Icon>
        </div>
    </Upload>
    <Modal fullscreen :transfer="false"   title="查看图片" v-model="visible">
        <img :src=" this.$global.ossUrl + imgName " v-if="visible" style="width: 100%">
    </Modal>
</template>
         </FormItem>
         <br>
         <!-- 上传文件附件 -->
         <FormItem label="合同附件" prop="zips">
              <template >
    <div class="demo-upload-list" v-for="item in uploadListzips">
        <template v-if="item.status === 'finished'">
            <p>{{item.shortName}}</p>
            <div class="demo-upload-list-cover">
                <Icon type="ios-trash-outline" @click.native="handleRemoveZips(item)"></Icon>
                <Icon type="md-download" @click.native="handleDown(item)"></Icon>

            </div>
        </template>
        <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
    </div>
    <Upload
        ref="uploadzips"
        :show-upload-list="false"
        :default-file-list="defaultListZips"
        :on-success="handleSuccessZips"
        :max-size="20480"
        :on-format-error="handleFormatErrorZips"
        :on-exceeded-size="handleMaxSizeZips"
        :before-upload="handleBeforeUploadZips"
        multiple
        type="drag"
        :action="updateImgUrl " 
        style="display: inline-block;width:58px;">
        <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="md-add" size="50"></Icon>
        </div>
    </Upload>
</template>
         </FormItem>
        <br>
        <FormItem>
        <h6>审批流程</h6>
        <Steps style="width:800px" :current="0" status="wait" >
          <Step title="待审核" content="待运营总监审核"></Step>
          <Step title="待审核" content="待财务总监审核"></Step>
        </Steps>
        </FormItem>
      </Form>
      <div slot="footer"> 
        <Button  type="default" @click="modal_cancel()">取消</Button>
        <Button v-show="reviewBtn" type="warning" @click="modal_review()">审核</Button>
        <Button v-show="addBtn" type="primary" @click="modal_ok()">添加</Button>
        <Button v-show="changeBtn" type="warning" @click="modal_change()">修改</Button>
      </div>
    </Modal>
    <!-- 删除使用的对话框 -->
    <Modal v-model="modal_delete"
      title="确认要删除吗" width="360" @on-ok="modal_delete_ok" @on-cancel="modal_delete_cancel">
      <p >{{modal_delete_message}}</p>
    </Modal>
      <!-- 查询搜索div -->
      <div >
        <Card :bordered="false">
          <Button type="info" icon="md-add" ghost @click="addNew()">新增付款申请</Button>
          <Input v-model="value" placeholder="Enter something..." style="width: 300px" />
          <Button type="info" @click="searchEvents()">查询</Button>
          <Button shape="circle"  icon="md-refresh" @click="refresh()"></Button>
        </Card>
      </div>
      
      <div style="margin-top:10px">
          <Card :bordered="false">
      <!-- 列表 div -->
        <Table size="large" :border="true"   :columns="columns1" :data="data1"></Table>
        <Page @on-change="changePage" style="margin-top:10px" :page-size="pageSize"  :total="dataCount" show-total ></Page>
      </Card>
      </div>
  </div>
</template>
<script>
import {addPaymentRequest, findPaymentRequest,updatePaymentRequest} from '@/api/data'
import {belongCompanyList,payTypeList} from '@/libs/global_type'
import {getPayTypeValue,getPayTypeValueColor} from '@/libs/status_type_color'
export default {
   name: 'upload-excel',
  data(){
    return {
      addBtn:false,
      changeBtn:false,
      reviewBtn:false,
      defaultList: [],
      defaultListZips:[],
      imgName: '',
      updateImgUrl:this.$global.updateImgUrl,
      ossUrl:this.$global.ossUrl,
      visible: false,
      uploadList: [],
      uploadListzips:[],
      uploadLoading: false,
      progressPercent: 0,
      showProgress: false,
      showRemoveFile: false,
      file: null,
      tableData: [],
      tableItem:{},
      tableTitle: [],
      sendDataDic:{},
      modalTitle:'添加付款申请',
      tableLoading: false,
      //上面是model中的内容
      formItem:{
        year:'',
        month:'',
        day:'',
        pingzhenghao:'',
        subjectCode:'',
        subjectName:'',
        customerCode:'',
        customerName:'',
        zhaiyao:'',
        jieMoney:'',
        daiMoney:'',
        fangxiang:'',
        yuMoney:''
      },
      //表单验证
      addForm:{
        name:'',
        date:'',
        payMoney:'',
        belongCompany:'',
        select:'',
        payCompanyName:'',
        selectPay:''
      },
      ruleValidate:{
        name:[{
          required:true,message:'请输入付款事由',trigger:'blue'
        }],
        payMoney:[{
          required:true,message:'请输入付款金额',trigger:'blue'
        }],
        belongCompany:[{
          required:true,message:'请选择所属公司',trigger:'blue'
        }],
        payCompanyName:[{
          required:true,message:'请输入支付对象',trigger:'blue'
        }],
        selectPay:[{
          required:true,message:'请选择付款方式',trigger:'blue'
        }],
        bankAcount:[{
          required:true,message:'请输入银行账户',trigger:'blue'
        }],
        openingBank:[{
          required:true,message:'请输入开户行',trigger:'blue'
        }]
      },
      selectPayList:payTypeList,
      belongCompanyList:belongCompanyList,
      modal:false,
      modal_delete:false,
      model_item:false,
      model_item_change:false,

      modal_delete_message:'',
      formItem:{
        year:'',
        month:'',
        day:'',
        pingzhenghao:'',
        subjectCode:'',
        subjectName:'',
        customerCode:'',
        customerName:'',
        zhaiyao:'',
        jieMoney:'',
        daiMoney:'',
        fangxiang:'',
        yuMoney:''
      },
      value:'',
      columns1:[{
        title:'ID',
        key:'id',
        width:60,
        fixed:'left'
      },{
        title:'付款事由',
        key:'payCause',
        width:100
      },{
        title:'期望付款时间',
        key:'payTime',
        width:120
      },{
        title:'付款金额',
        key:'payMoney',
        width:100
      },{
        title:'所属公司',
        key:'companyName',
        width:100
      },{
        title:'支付对象',
        key:'payCompayName',
        width:200
      },{
        title:'付款方式',
        key:'payType',
        width:100
      },{
        title:'银行账户',
        key:'payCompanyBankNumber',
        width:200
      },{
        title:'开户行',
        key:'payCompanyBankName',
        width:200

      },{
        title:'备注',
        key:'note',
        width:100

      },{
        title:"审核状态",
        key:'status',
        fixed:'right',
        width:160,
        render:(h,params)=>{
          const row  = params.row;
          const text = getPayTypeValue(row.status);
          const color = getPayTypeValueColor(row.status);
          return h('Tag',{
            props:{
              type:'dot',
              color:color
            }
          },text)
        }
      },{
        title:'操作',
        key:'actions',
        fixed:'right',
        width:230,
        render:(h,params) =>{
          return h('div',[
            h('Button',{
              props:{
                type:'primary',
                ghost:true,
                size:'small'
              },
              style:{
              
              },
              on:{
                click:() =>{
                  this.modal = true;
                  this.tableItem =  params;
                  this.modalTitle = '查看付款申请'
                  this.addBtn  = false;
                  this.changeBtn = false;
                  this.reviewBtn = false;
                  this.setTableItemModal();
                }
              }
            },'查看'),
            h('Button',{
              props:{
                type:'warning',
                ghost:true,
                size:'small'
              },
              style:{
                marginLeft:'10px'
              },
              on:{
                click:()=>{
                  console.log("开始审核");
                  this.modal = true;
                  this.tableItem =  params;
                  this.modalTitle = '审核付款申请'
                  this.changeBtn =false;
                  this.addBtn  =false;
                  this.reviewBtn = true;
                  this.setTableItemModal();
                }
              }
            },'审核'),
            h('Button',{
              props:{
                type:'info',
                ghost:true,
                size:'small'

              },
              style:{
                marginLeft:'10px'
              },
              on:{
                click:()=>{
                  // 编辑信息
                  this.modal = true;
                  this.tableItem =  params;
                  this.modalTitle = '编辑付款申请'
                  this.changeBtn =true;
                  this.addBtn  =false;
                  this.reviewBtn = false;
                  this.setTableItemModal();
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
                marginLeft:'10px'
              },
              on:{
                click:()=>{
                  this.tableItem = params;
                  this.modal_delete_message = "ID="+this.tableItem.row.id; 
                  this.modal_delete =true;
                }
              }
            },'删除')
          ])
        }
      }],
      data1:[],
      dataCount:0,//总页数
      pageSize:10,
      searchPage:1 //初始化时查询的页码数
    }
  },
  methods:{
    addNew(){
      this.modal = true;
      this.addBtn = true;
      this.changeBtn = false;
      this.reviewBtn = false;
      this.clearAddForm();
    },
    setTableItemModal(){//给modal 赋值 todo
      this.clearAddForm();
      let dic = this.tableItem.row;
      console.log(dic);
      //赋值
      this.addForm.name       = dic.payCause;
      this.addForm.date  = dic.payTime
      this.addForm.payMoney = dic.payMoney
      this.addForm.payCompanyName = dic.payCompayName
      this.addForm.bankAcount = dic.payCompanyBankName
      this.addForm.openingBank = dic.payCompanyBankNumber
      this.addForm.note = dic.note

      let cinfo = belongCompanyList.find((element) =>(element.value == dic.companyId));
      this.addForm.select = JSON.stringify(cinfo);

      let pinfo = payTypeList.find((element) =>(element.value == dic.payTypeValue));
      this.addForm.selectPay = JSON.stringify(pinfo);
      
      this.defaultList = [];
      this.defaultListZips  = [];
      
      if(dic.hetongPhoto.length>0){
          let hetongArr = dic.hetongPhoto.split(',');
          let hArr = [];
          hetongArr.forEach(element => {
            let dic1 = {};
            dic1.name = element;
            dic1.status = "finished";
            dic1.url = this.$global.ossUrl+element;

            dic1.percentage = 0;
            dic1.showProgress = false;

            hArr.push(dic1);
          });
          this.uploadList = hArr;
      }
        if(dic.hetongFujian.length>0){
          let hetongArr = dic.hetongFujian.split(',');
          let hArr = [];
          hetongArr.forEach(element => {
            let dic1 = {};
            dic1.name = element;
            dic1.status = "finished";
            dic1.url = this.$global.ossUrl+element;
            dic1.shortName = element.split('.')[1];
            dic1.percentage = 0;
            dic1.showProgress = false;

            hArr.push(dic1);
          });
          this.uploadListzips = hArr;
      }
      // uploadListzips
    
    },
    clearAddForm(){
      for(var p in this.addForm){
        this.addForm[p] = "";
      }
      this.uploadList = [];
      this.uploadListzips = [];
    },
     handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemove (file) {
              console.log("开始删除");
              console.log(file);
              this.uploadList.splice(this.uploadList.indexOf(file),1);
            },
            handleSuccess (res, file,fileList) {
                this.$Message.success('上传成功');
                console.log("上传成功");
                file.url = this.$global.ossUrl+res.msg;
                file.name = res.msg;
                console.log(file);
                this.uploadList.push(file);
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确 ',
                    desc: '文件 ' + file.name + '格式不正确，请选择 jpg 或者 png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超过文件大小限制',
                    desc: '文件  ' + file.name + ' 太大，最大不超过20M'
                });
            },
            handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最大支持上传5张图片'
                    });
                }
                return check;
            },
             handleViewZips (name) {
                this.imgName = name;
                this.visible = true;
            },
            handleRemoveZips (file) {
              this.uploadListzips.splice(this.uploadListzips.indexOf(file),1);
                // const fileList = this.$refs.uploadzips.fileList;
                // this.$refs.uploadzips.fileList.splice(fileList.indexOf(file), 1);
            },
            handleDown(file){
              window.open(file.url);
            },
            handleSuccessZips (res, file) {
                this.$Message.success('上传成功')
                file.url =this.$global.ossUrl+res.msg;
                file.name = res.msg;
                file.shortName = res.msg.split('.')[1];
                console.log(file);
                this.uploadListzips.push(file);
            },
            handleFormatErrorZips (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件' + file.name + '格式不正确，请选择 rar 或者zip'
                });
            },
            handleMaxSizeZips (file) {
                this.$Notice.warning({
                    title: '文件超出大小限制',
                    desc: '文件' + file.name + ' 太大，最大支持20M.'
                });
            },
            handleBeforeUploadZips () {
                const check = this.uploadListzips.length < 10;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传10个附件'
                    });
                }
                return check;
            },
    addCus(){
      this.$Message.error('功能暂未添加')
    },
    formItem_change_update(){//编辑提交事件
      let param = {};
      let  updateCarList = [];
      let  dic = {};
    
      updateCarList.push(dic);
      param.updateList = updateCarList;
      param.status = 0;
      updatePaymentRequest(param).then(res=>{
          if(res.code =="100"){
            this.$Notice.success({
              title:"修改成功",
              duration:3
            })
            this.refresh();
          }else{
            this.$Notice.error({
              title:"修改失败",
              duration:3
            })
          }
      })
    },
    refresh(){//刷新
      this.searchPage = "1";
      this.getTable();
    },
    modal_delete_cancel(){
      this.$Message.info('modal_delete_cancel');
    },
    modal_delete_ok(){
      //确认删除列表中心
      let param = {};
      let updateCarList = [];
      let dic = {};
      dic.id = this.tableItem.row.id;
      updateCarList.push(dic);
      param.updateList = updateCarList;
      param.status = 0;

      updatePaymentRequest(param).then(res =>{
          if(res.code =="100"){
            this.$Notice.success({
              title:'删除成功',
              duration:3
            })
            //重新获取当前页面数据
           this.searchPage = "1";
            this.getTable();
          }
      })
    },
    modal_cancel(){
      console.log("点击取消")
      this.modal = false;
    },
    modal_change(){//修改
    console.log("修改");
    console.log(this.uploadList);
    },
    modal_ok(){ //提交保存
      let hetongPhoto = '';
      for(let i =0; i< this.uploadList.length;i++){
        let item = this.uploadList[i];
        if(hetongPhoto ==''){
          hetongPhoto = item.name;
        }else{
          hetongPhoto = hetongPhoto +','+item.name
        }
      }

      let hetongFujian = '';
      for(let i = 0;i< this.uploadListzips.length;i++){
        let item = this.uploadListzips[i];
        if(hetongFujian ==''){
          hetongFujian = item.name;
        }else{
          hetongFujian = hetongFujian +','+item.name
        }
      }
      let month = this.addForm.date.getMonth() +1;
      let param = {};
     
        param.payCause            = this.addForm.name //付款事由
        param.payTime             = this.addForm.date.getFullYear() +'-' +month +'-' +this.addForm.date.getDate() //时间
        param.payMoney            = this.addForm.payMoney //金额

        let comdic = JSON.parse(this.addForm.select);
        param.companyId           = comdic.value //所属公司
        param.companyName         = comdic.label //所属公司

        // param.payCompanyId        = this.addForm.payCompanyName //支付对象公司id
        param.payCompayName       = this.addForm.payCompanyName //支付对象公司
        
        let paydic = JSON.parse(this.addForm.selectPay);
        param.payType             = paydic.label //付款方式id
        param.payTypeValue        = paydic.value //付款方式字符串

        param.payCompanyBankName  = this.addForm.openingBank
        param.payCompanyBankNumber= this.addForm.bankAcount
        param.note                = this.addForm.note
        param.hetongFujian        = hetongFujian
        param.hetongPhoto         = hetongPhoto
        param.applicantId         = this.userInfo.id;
        param.applicantName       = this.userInfo.cname;
        let approvalProcessPerson = {};
        let addList = [];
        let dic = {};
        dic.userId = '300279';
        dic.userName = '王森';
        dic.approvalSequence = '0';
        addList.push(dic);
        let dic1 = {};
        dic1.userId = '300337';
        dic1.userName = '姜敏慧';
        dic1.approvalSequence = '1';
        addList.push(dic1);
        approvalProcessPerson.addList = addList;
        param.approvalProcessPerson = approvalProcessPerson;
        addPaymentRequest(param).then(res=>{
          if(res.code =="100"){
            this.$Notice.success({
              title:'添加成功',
              duration:3
            })
             this.searchPage = "1";
            this.getTable();
            this.modal_cancel();
          }
        })
    },
    searchEvents(){
      this.$global.testglobal();
  },
  changePage(index){
      this.searchPage = index;
      this.getTable();
  },
  getTable(){
    let param = {};
    param.pageNum = this.searchPage;
    findPaymentRequest(param).then(res=>{
      if(res.code =='100'){
        this.dataCount = res.data.total;
        this.data1 = res.data.list;
        this.$Message.success('获取列表数据成功')
      }else{
        this.$Message.error('获取列表数据失败')
      }
    })
  }
  },
  mounted(){
    // this.uploadList = this.$refs.upload.fileList;
    // this.uploadListzips = this.$refs.uploadzips.fileList;
  },
  created(){
    this.getTable();
    console.log("开始运行")
    console.log(this.userInfo);
  }
}
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>