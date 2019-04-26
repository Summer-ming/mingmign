/** 客户管理
*
*
**/
/**买家列表 */
<style lang="less">
  @import "../excel/common.less";
</style>
<template>
  <div>
    <!-- 新增买家 -->
    <Modal 
    v-model="addModal" fullscreen  title="新增买家"  z-index="1" :z-index="1"    
     ok-text="提交" width="1000" :styles="{top:'0px'}" >
     <Form ref="addForm" :model="addForm" :label-width="120" :rules="addFormRule" inline>
       <b style="font-size: 32;">开票资料</b>
       <br/>
       <FormItem prop="companyName" label="公司名称">
         <Input style="width:300px" v-model="addForm.companyName" placeholder="请输入公司名称">
         </Input>
       </FormItem>
       <FormItem prop="taxno" label="税号">
         <Input style="width:300px" v-model="addForm.taxno" placeholder="请输入税号"/>
       </FormItem>
       <FormItem prop="registerAddress" label="注册地址">
         <Input style="width:300px" v-model="addForm.registerAddress" placeholder="请输入公司注册地址"/>
       </FormItem>
       <FormItem label="联系电话">
         <Input style="width:300px" v-model="addForm.phone" placeholder="请输入电话"/>
       </FormItem>
       <FormItem label="座机">
         <Input style="width:300px" v-model="addForm.mobile" placeholder="请输入座机号码"/>
       </FormItem>
       <FormItem label="公司性质">
         <Select style="width:300px" v-model="addForm.companyNature">
           <Option  v-for="item in companyNatureList" :value="item.value" :key="item.value">{{item.label}}</Option>
         </Select>
       </FormItem>
       <FormItem label='公司类型'>
         <Select style="width:300px" v-model="addForm.companyType">
           <Option v-for="item in companyTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
         </Select>
       </FormItem>
       <FormItem label='成立日期'>
         <DatePicker type="date" v-model="addForm.registeredTime" placeholder="请选择日期" style="width:300px"></DatePicker>
       </FormItem>
       <FormItem label='注册资金'>
         <Input style='width:300px' v-model='addForm.registeredMoney' placeholder='请输入注册资金'/>
       </FormItem>
       <FormItem label='法人姓名'>
       <Input style='width:300px' v-model='addForm.legalPersonName' placeholder='请输入法人姓名'/>
       </FormItem>
       <FormItem label='法人身份证号码'>
       <Input style='width:300px' v-model='addForm.legalPersonIDcard' placeholder='请输入法人身份证号码'/>
       </FormItem>
       <br/>
       <b style="font-size: 32;">开票资料</b>
       <br/>
       <FormItem label='地址'>
       <Input style='width:300px' v-model='addForm.billingAddress' placeholder='开票地址'/>
       </FormItem>
       <FormItem label='开户行'>
       <Input style='width:300px' v-model='addForm.bankName' placeholder='开户行名称'/>
       </FormItem>
       <FormItem label='账户'>
       <Input style='width:300px' v-model='addForm.bankCardNumber' placeholder='银行卡号'/>
       </FormItem>
       <FormItem label='电话'>
       <Input style='width:300px' v-model='addForm.billPhone' placeholder='电话'/>
       </FormItem>
       <br/>
       <b style="font-size: 32;">其他</b>
       <br/>
       <FormItem label='公司简介'>
        <Input type="textarea" :row="4" style='width:600px' v-model='addForm.note' placeholder='公司简介'/>
       </FormItem>
       <br/>
       <FormItem required label='营业执照'>
          <template >
            <img v-show="isShowCp" style="width:500px;height:300px" :src=" ossUrl +addForm.contractPicture.name">
          </template>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="20480"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            multiple
            v-model="addForm.contractPicture"
            type="drag"
            :action="updateImgUrl " 
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="md-add" size="50"></Icon>
            </div>
          </Upload>
       </FormItem>
       <br/>
       <FormItem required label='开票资料图片'>
          <template >
            <img v-show="isShowBI" style="width:500px;height:300px" :src=" ossUrl +addForm.billImage.name">
          </template>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccessBI"
            v-model="addForm.billImage"
            :format="['jpg','jpeg','png']"
            :max-size="20480"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            multiple
            type="drag"
            :action="updateImgUrl " 
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="md-add" size="50"></Icon>
            </div>
          </Upload>
       </FormItem>
     </Form>
     <div slot="footer">
       <Button type="text" @click="modalCancel">取消</Button>
        <Button type="primary" @click="addcus">添加</Button>
     </div>
    </Modal>
    <!-- 删除使用的对话框 -->
    <Modal v-model="modal_delete"
      title="确认要删除吗" width="360" @on-ok="delete_modal_ok">
      <p >{{modal_delete_message}}</p>
    </Modal>
    <!-- 查看 编辑使用的 modal -->
   <Modal 
    v-model="modal_info" fullscreen  title="公司信息"   
      width="1000" :styles="{top:'0px'}" >
     <Form ref="infoForm" :model="infoForm" :label-width="120"  inline>
       <b style="font-size: 32;">开票资料</b>
       <br/>
       <FormItem  label="公司名称">
         <Input   style="width:300px" v-model="infoForm.companyName" placeholder="请输入公司名称">
         </Input>
       </FormItem>
       <FormItem  label="税号">
         <Input style="width:300px" v-model="infoForm.taxno" placeholder="请输入税号"/>
       </FormItem>
       <FormItem  label="注册地址">
         <Input style="width:300px" v-model="infoForm.registerAddress" placeholder="请输入公司注册地址"/>
       </FormItem>
       <FormItem label="联系电话">
         <Input style="width:300px" v-model="infoForm.phone" placeholder="请输入电话"/>
       </FormItem>
       <FormItem label="座机">
         <Input style="width:300px" v-model="infoForm.mobile" placeholder="请输入座机号码"/>
       </FormItem>
       <FormItem label="公司性质">
         <Select style="width:300px" v-model="infoForm.companyNature">
           <Option  v-for="item in companyNatureList" :value="item.value" :key="item.value">{{item.label}}</Option>
         </Select>
       </FormItem>
       <FormItem label='公司类型'>
         <Select style="width:300px" v-model="infoForm.companyType">
           <Option v-for="item in companyTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
         </Select>
       </FormItem>
       <FormItem label='成立日期'>
         <DatePicker type="date" v-model="infoForm.registeredTime" placeholder="请选择日期" style="width:300px"></DatePicker>
       </FormItem>
       <FormItem label='注册资金'>
         <Input style='width:300px' v-model='infoForm.registeredMoney' placeholder='请输入注册资金'/>
       </FormItem>
       <FormItem label='法人姓名'>
       <Input style='width:300px' v-model='infoForm.legalPersonName' placeholder='请输入法人姓名'/>
       </FormItem>
       <FormItem label='法人身份证号码'>
       <Input style='width:300px' v-model='infoForm.legalPersonIDcard' placeholder='请输入法人身份证号码'/>
       </FormItem>
       <br/>
       <b style="font-size: 32;">开票资料</b>
       <br/>
       <FormItem label='地址'>
       <Input style='width:300px' v-model='infoForm.billingAddress' placeholder='开票地址'/>
       </FormItem>
       <FormItem label='开户行'>
       <Input style='width:300px' v-model='infoForm.bankName' placeholder='开户行名称'/>
       </FormItem>
       <FormItem label='账户'>
       <Input style='width:300px' v-model='infoForm.bankCardNumber' placeholder='银行卡号'/>
       </FormItem>
       <FormItem label='电话'>
       <Input style='width:300px' v-model='infoForm.billPhone' placeholder='电话'/>
       </FormItem>
       <br/>
       <b style="font-size: 32;">其他</b>
       <br/>
       <FormItem label='公司简介'>
        <Input type="textarea" :row="4" style='width:600px' v-model='infoForm.note' placeholder='公司简介'/>
       </FormItem>
       <br/>
       <FormItem  label='营业执照'>
          <template >
            <img  style="width:500px;height:300px" :src=" ossUrl +infoForm.contractPicture">
            <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccessChange"
            :format="['jpg','jpeg','png']"
            :max-size="20480"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            multiple
            v-model="infoForm.contractPicture"
            type="drag"
            :action="updateImgUrl " 
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="md-add" size="50"></Icon>
            </div>
          </Upload>
          </template>
       </FormItem>
       <br/>
       <FormItem  label='开票资料图片'>
          <template >
            <img  style="width:500px;height:300px" :src=" ossUrl +infoForm.billImage">
             <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccessBIChange"
            v-model="infoForm.billImage"
            :format="['jpg','jpeg','png']"
            :max-size="20480"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
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
     </Form>
     <div slot="footer">
       <Button type="text" @click="modalCancel">取消</Button>
        <Button v-show="isShowChange" type="primary" @click="changeInfo">修改</Button>
     </div>
    </Modal>
    
    <!-- 审核使用的modal -->
    <Modal 
    v-model="modal_review" fullscreen  title="审核公司信息"   
      width="1000" :styles="{top:'0px'}" >
     <Form ref="reviewForm" :model="reviewForm" :label-width="120"  inline>
       <b style="font-size: 32;">开票资料</b>
       <br/>
       <FormItem  label="公司名称">
         <Input   style="width:300px" v-model="reviewForm.companyName" placeholder="请输入公司名称">
         </Input>
       </FormItem>
       <FormItem  label="税号">
         <Input style="width:300px" v-model="reviewForm.taxno" placeholder="请输入税号"/>
       </FormItem>
       <FormItem  label="注册地址">
         <Input style="width:300px" v-model="reviewForm.registerAddress" placeholder="请输入公司注册地址"/>
       </FormItem>
       <FormItem label="联系电话">
         <Input style="width:300px" v-model="reviewForm.phone" placeholder="请输入电话"/>
       </FormItem>
       <FormItem label="座机">
         <Input style="width:300px" v-model="reviewForm.mobile" placeholder="请输入座机号码"/>
       </FormItem>
       <FormItem label="公司性质">
         <Select style="width:300px" v-model="reviewForm.companyNature">
           <Option  v-for="item in companyNatureList" :value="item.value" :key="item.value">{{item.label}}</Option>
         </Select>
       </FormItem>
       <FormItem label='公司类型'>
         <Select style="width:300px" v-model="reviewForm.companyType">
           <Option v-for="item in companyTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
         </Select>
       </FormItem>
       <FormItem label='成立日期'>
         <DatePicker type="date" v-model="reviewForm.registeredTime" placeholder="请选择日期" style="width:300px"></DatePicker>
       </FormItem>
       <FormItem label='注册资金'>
         <Input style='width:300px' v-model='reviewForm.registeredMoney' placeholder='请输入注册资金'/>
       </FormItem>
       <FormItem label='法人姓名'>
       <Input style='width:300px' v-model='reviewForm.legalPersonName' placeholder='请输入法人姓名'/>
       </FormItem>
       <FormItem label='法人身份证号码'>
       <Input style='width:300px' v-model='reviewForm.legalPersonIDcard' placeholder='请输入法人身份证号码'/>
       </FormItem>
       <br/>
       <b style="font-size: 32;">开票资料</b>
       <br/>
       <FormItem label='地址'>
       <Input style='width:300px' v-model='reviewForm.billingAddress' placeholder='开票地址'/>
       </FormItem>
       <FormItem label='开户行'>
       <Input style='width:300px' v-model='reviewForm.bankName' placeholder='开户行名称'/>
       </FormItem>
       <FormItem label='账户'>
       <Input style='width:300px' v-model='reviewForm.bankCardNumber' placeholder='银行卡号'/>
       </FormItem>
       <FormItem label='电话'>
       <Input style='width:300px' v-model='reviewForm.billPhone' placeholder='电话'/>
       </FormItem>
       <br/>
       <b style="font-size: 32;">其他</b>
       <br/>
       <FormItem label='公司简介'>
        <Input type="textarea" :row="4" style='width:600px' v-model='reviewForm.note' placeholder='公司简介'/>
       </FormItem>
       <br/>
       <FormItem  label='营业执照'>
          <template >
            <img  style="width:500px;height:300px" :src=" ossUrl +reviewForm.contractPicture">
          </template>
       </FormItem>
       <br/>
       <FormItem  label='开票资料图片'>
          <template >
            <img  style="width:500px;height:300px" :src=" ossUrl +reviewForm.billImage">
          </template>
       </FormItem>
     </Form>
     <div slot="footer">
       <Button type="text" @click="modalCancel">取消</Button>
        <Button type="warning" @click="audit(1)">运营总监审核</Button>
        <Button type="warning" @click="audit(99)">驳回</Button>
     </div>
    </Modal>

      <!-- 查询搜索div -->
      <div >
        <Card :bordered="false">
          <Button type="info" icon="md-add" ghost @click="addModal = true">新增买家</Button>
          <Input v-model="input_company_name" placeholder="请输入公司名称" style="width: 300px" />
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
import {addcus,findOrgList,updateCusVipStatus,updateOrgVipStatus,updateOrgCus} from '@/api/data'
import { companyNatureList,companyTypeList } from "./../../libs/global_type";
export default {
   name: 'upload-excel',
  data(){
    return {
      //审核使用的modal
      isShowChange:false,
      choseItem:'',
      modal_review:false,
      reviewForm:{
        companyName:'',
        taxno:'',
        registerAddress:'',
        phone:'',
        mobile:'',
        companyNature:'',
        companyType:'',
        registeredTime:'',
        registeredMoney:'',
        legalPersonName:'',
        legalPersonIDcard:'',
        billingAddress:'',
        bankName:'',
        bankCardNumber:'',
        billPhone:'',
        note:'',
        contractPicture:'',
        billImage:''
      },
      // 分割线------------
      //查看使用的数据
      modal_info:false,
      infoForm:{
        companyName:'',
        taxno:'',
        registerAddress:'',
        phone:'',
        mobile:'',
        companyNature:'',
        companyType:'',
        registeredTime:'',
        registeredMoney:'',
        legalPersonName:'',
        legalPersonIDcard:'',
        billingAddress:'',
        bankName:'',
        bankCardNumber:'',
        billPhone:'',
        note:'',
        contractPicture:'',
        billImage:''
      },
      // 分割线--------------------------
      isShowCp:false,
      isShowBI:false,
      companyNatureList,
      companyTypeList,
      updateImgUrl:this.$global.updateImgUrl,
      addForm:{
        companyName:'',
        taxno:'',
        registerAddress:'',
        phone:'',
        mobile:'',
        companyNature:'',
        companyType:'',
        registeredTime:'',
        registeredMoney:'',
        legalPersonName:'',
        legalPersonIDcard:'',
        billingAddress:'',
        bankName:'',
        bankCardNumber:'',
        billPhone:'',
        note:'',
        contractPicture:{
          url:'',
          name:''
        },
        billImage:{
          url:'',
          name:''
        }
      },
      addFormRule:{
        companyName:[
          {required:true,message:'请输入公司名称',trigger:'blur'}
        ],
        taxno:[{
          required:true,message:'请输入税号',trigger:'blur'
        }],
      },
      input_company_name:'',//公司名称查询输入框
      addModal:false,//添加modal
      modal_delete:false,//删除modal
      modal_delete_message:'',//删除modal的内容
      model_item:false,//公司信息，查看并编辑
      updateImgUrl:this.$global.updateImgUrl,
      ossUrl:this.$global.ossUrl,
      columns1:[{
        title:'ID',
        key:'cusid',
        width:60,
        tooltip:true,
        fixed:'left'
      },{
        title:'公司名称',
        key:'orgorgName',
        width:250
      },{
        title:'税号',
        key:'orgtaxNo',
        width:200
      },{
        title:'电话号码',
        key:'cusphone',
        width:150
      },{
        title:'成立日期',
        key:'orgcreatedDate',
        width:120
      },{
        title:'申请日期',
        key:'cuscreateTime',
        width:200
      },{
        title:'添加人名称',
        key:'cusadminName',
        width:100
      },{
        title:'备注',
        key:'orgnote',
        width:100

      },{
        title:'操作',
        key:'actions',
        fixed:'right',
        width:230,
        render:(h,params) =>{
          return h('div',[
            h('Button',{
              props:{
                type:'warning',
                size:'small'
              },
              style:{
                display:this.isShowTableBtn(params.row,'审核')
              },
              on:{
                click:()=>{
                  this.modal_review = true;
                  let item = params.row;
                  this.choseItem = item;
                  this.reviewForm.companyName   =item.orgorgName;
                  this.reviewForm.taxno   =item.orgtaxNo
                  this.reviewForm.registerAddress   =item.orgregisteredMoney
                  this.reviewForm.phone   =item.cusphone
                  this.reviewForm.mobile   =item.cusseatNumber;
                  this.reviewForm.companyNature   =item.orgnature
                  this.reviewForm.companyType   =item.org
                  this.reviewForm.registeredTime   =item.orgcreatedDate
                  this.reviewForm.registeredMoney   =item.orgregisteredMoney
                  this.reviewForm.legalPersonName   =item.orglegalPerson
                  this.reviewForm.legalPersonIDcard   =item.orglegalPersonNo
                  this.reviewForm.billingAddress   =item.orgorgAddress
                  this.reviewForm.bankName   =item.orgBillBankNo
                  this.reviewForm.bankCardNumber   =item.orgBillBankCard
                  this.reviewForm.billPhone   =item.orgorgPhone
                  this.reviewForm.note   =item.orgnote
                  this.reviewForm.contractPicture   =item.orgsanzhengheyiPhoto
                  this.reviewForm.billImage = item.orgkaipiaoPhoto
                }
              }
            },'审核'),
            h('Button',{
              props:{
                type:'primary',
                size:"small",
                ghost:true
              },
              style:{
                marginLeft:'4px'
              },
              on:{
                click:() =>{
                  this.modal_info = true;
                  let item = params.row;
                  this.choseItem = item;
                  this.infoForm.companyName   =item.orgorgName;
                  this.infoForm.taxno   =item.orgtaxNo
                  this.infoForm.registerAddress   =item.cusaddress
                  this.infoForm.phone   =item.cusphone
                  this.infoForm.mobile   =item.cusseatNumber;
                  this.infoForm.companyNature   =item.orgnature
                  this.infoForm.companyType   =item.org
                  this.infoForm.registeredTime   =item.orgcreatedDate
                  this.infoForm.registeredMoney   =item.orgregisteredMoney
                  this.infoForm.legalPersonName   =item.orglegalPerson
                  this.infoForm.legalPersonIDcard   =item.orglegalPersonNo
                  this.infoForm.billingAddress   =item.orgorgAddress
                  this.infoForm.bankName   =item.orgBillBankNo
                  this.infoForm.bankCardNumber   =item.orgBillBankCard
                  this.infoForm.billPhone   =item.orgorgPhone
                  this.infoForm.note   =item.orgnote
                  this.infoForm.contractPicture   =item.orgsanzhengheyiPhoto
                  this.infoForm.billImage = item.orgkaipiaoPhoto
                }
              }
            },'查看'),
            h('Button',{
              props:{
                type:'default',
                size:"small",
              },
              style:{
                marginLeft:'4px'
              },
              on:{
                click:()=>{
                  // 编辑信息
                  this.isShowChange = true;
                  this.modal_info = true;
                  let item = params.row;
                  console.log("编辑信息");
                  this.choseItem = item;
                  console.log(this.choseItem.orgcreatedDate)
                  this.infoForm.companyName   =item.orgorgName;
                  this.infoForm.taxno   =item.orgtaxNo
                  this.infoForm.registerAddress   =item.cusaddress
                  this.infoForm.phone   =item.cusphone
                  this.infoForm.mobile   =item.cusseatNumber;
                  this.infoForm.companyNature   =item.orgnature
                  this.infoForm.companyType   =item.org
                  this.infoForm.registeredTime   =item.orgcreatedDate
                  this.infoForm.registeredMoney   =item.orgregisteredMoney
                  this.infoForm.legalPersonName   =item.orglegalPerson
                  this.infoForm.legalPersonIDcard   =item.orglegalPersonNo
                  this.infoForm.billingAddress   =item.orgorgAddress
                  this.infoForm.bankName   =item.orgBillBankNo
                  this.infoForm.bankCardNumber   =item.orgBillBankCard
                  this.infoForm.billPhone   =item.orgorgPhone
                  this.infoForm.note   =item.orgnote
                  this.infoForm.contractPicture   =item.orgsanzhengheyiPhoto
                  this.infoForm.billImage = item.orgkaipiaoPhoto
                }
              }
            },'编辑'),
            h('Poptip',{
              props:{
                confirm:true,
                title:'你确定要删除吗',
                transfer:true
              },
              on:{
                'on-ok':()=>{
                  this.choseItem = params.row;
                  this.delete_modal_ok();
                }
              }
            },[h('Button',{
              props:{
                type:'error',
                ghost:true,
                size:"small",
              },
              style:{
                marginLeft:'4px'
              },
            },'删除')])
            // h('Button',{
            //   props:{
            //     type:'primary',
            //     ghost:true,
            //     size:"small",
            //   },
            //   style:{
            //     marginLeft:'4px',
            //     marginTop:'4px'
            //   },
            //   on:{
            //     click:()=>{
            //       // todo
            //     }
            //   }
            // },'查看全部信息')
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
    clearinfoForm(){
        this.infoForm.companyName='',
        this.infoForm.taxno='',
        this.infoForm.registerAddress='',
        this.infoForm.phone='',
        this.infoForm.mobile='',
        this.infoForm.companyNature='',
        this.infoForm.companyType='',
        this.infoForm.registeredTime='',
        this.infoForm.registeredMoney='',
        this.infoForm.legalPersonName='',
        this.infoForm.legalPersonIDcard='',
        this.infoForm.billingAddress='',
        this.infoForm.bankName='',
        this.infoForm.bankCardNumber='',
        this.infoForm.billPhone='',
        this.infoForm.note='',
        this.infoForm.contractPicture='',
        this.infoForm.billImage=''
    },
    changeInfo(){
      // this.modalCancel();
       console.log("开始")
       console.log(this.infoForm.registeredTime);
          let param = {};
          param.id = this.choseItem.cusid;
          param.orgId = this.choseItem.orgid;

          let month = this.infoForm.registeredTime.getMonth() +1;

            param.orgName            =this.infoForm.companyName;
            param.taxNo            =this.infoForm.taxno;

            param.address            =this.infoForm.registerAddress;
            param.phone            =this.infoForm.phone;
            param.cusSeatNumber            =this.infoForm.mobile;
            param.nature            =this.infoForm.companyNature;
            param.type            =this.infoForm.companyType;
            param.createdDate            =this.infoForm.registeredTime.getFullYear() +'-' +month +'-' +this.infoForm.registeredTime.getDate();
            param.registeredMoney            =this.infoForm.registeredMoney;
            param.legalPerson            =this.infoForm.legalPersonName;
            param.legalPersonNo            =this.infoForm.legalPersonIDcard;
                        
            param.orgAddress            =this.infoForm.billingAddress;
            param.billBankNo            =this.infoForm.bankName;
            param.billBankCard            =this.infoForm.bankCardNumber;
            param.orgPhone            =this.infoForm.billPhone;

            param.sanzhengheyiPhoto           =this.infoForm.contractPicture;
            param.kaipiaoPhoto            =this.infoForm.billImage;
            param.note            =this.infoForm.note;
            updateOrgCus(param).then(res=>{
              if(res.code =="100"){
                   this.$Message.success('修改成功');
                  this.modalCancel();
                  this.getTable();
              }else{
                this.$Message.error('修改失败')

              }
            })
            this.clearinfoForm();
    },
    isShowTableBtn(item,Btnname){
      let str ='none';
      if(Btnname =="审核"){
        if((this.userInfo.role_id == '100' ||this.userInfo.role_id=="9")&&item.cusvipStatus==1){
          return 'inline-block'
        }else{
        }
      }
      return str;
    },
    audit(key){//审核公司
    console.log(this.choseItem);
      if(key =="1"){
        //运营总监审核
        let param = {};
        param.id = this.choseItem.cusid;
        param.vipStatus = "8";
        updateCusVipStatus(param).then(res=>{
          if(res.code == "100"){
            let param1 ={}
            param1.id = this.choseItem.orgid;
            param1.orgVipStatus ="8";
            updateOrgVipStatus(param1).then(res=>{
              if(res.code =="100"){
                  this.$Message.success('审核成功');
                  this.modalCancel();
                  this.getTable();
              }else{
                this.$Message.error('审核失败')

              }
            })
          }else{
            this.$Message.error('审核失败')
          }
          
        })
      }else{
        //驳回
        let param = {};
        param.id = this.choseItem.cusid;
        param.vipStatus = "99";
        updateCusVipStatus(param).then(res=>{
          if(res.code == "100"){
            let param1 ={}
            param1.id = this.choseItem.orgid;
            param1.orgVipStatus ="99";
            updateOrgVipStatus(param1).then(res=>{
               if(res.code =="100"){
                  this.$Message.success('审核成功');
                  this.modalCancel();
                  this.getTable();
              }else{
                  this.$Message.error('审核失败')
              }
            })
          }else{
            this.$Message.error('审核失败')
          }
          
        })
      }
    },
    searchEvents(){
      this.getTable();
    },
     handleSuccess (res, file) {
                this.isShowCp= true;
                this.$Message.success('上传成功,营业执照')
                this.addForm.contractPicture.url =this.$global.baseUrl+res.msg;
                this.addForm.contractPicture.name = res.msg;
            },
      handleSuccessBI (res, file) {
                this.isShowBI= true;
                this.$Message.success('上传成功,开票资料图片')
                this.addForm.billImage.url =this.$global.baseUrl+res.msg;
                this.addForm.billImage.name = res.msg;
            },
    handleSuccessChange (res, file) {
                this.isShowCp= true;
                this.$Message.success('上传成功')
                file.url = this.$global.baseUrl+res.msg;
                file.name = res.msg;
                this.infoForm.contractPicture = res.msg;
            },
  
     handleSuccessBIChange (res, file) {
                this.$Message.success('上传成功')
                this.infoForm.billImage = res.msg;
            },
     handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确 ',
                    desc: '文件 ' + file.name + '格式不正确，请选择 jpg 或者 png.'
                });
            },
    handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件超出大小限制',
                    desc: '文件' + file.name + ' 太大，最大支持20M.'
                });
            },
    addcus(){
      this.$refs.addForm.validate((valid)=>{
        if(valid){
          console.log("开始")
          let param = {};
          let month = this.addForm.registeredTime.getMonth() +1;

            param.orgName            =this.addForm.companyName;
            param.taxNo            =this.addForm.taxno;
            param.address            =this.addForm.registerAddress;
            param.phone            =this.addForm.phone;
            param.cusSeatNumber            =this.addForm.mobile;
            param.nature            =this.addForm.companyNature;
            param.type            =this.addForm.companyType;
            param.createdDate            =this.addForm.registeredTime.getFullYear() +'-' +month +'-' +this.addForm.registeredTime.getDate();
            param.registeredMoney            =this.addForm.registeredMoney;
            param.legalPerson            =this.addForm.legalPersonName;
            param.legalPersonNo            =this.addForm.legalPersonIDcard;
                        
            param.orgAddress            =this.addForm.billingAddress;
            param.billBankNo            =this.addForm.bankName;
            param.billBankCard            =this.addForm.bankCardNumber;
            param.orgPhone            =this.addForm.billPhone;

            param.sanzhengheyiPhoto           =this.addForm.contractPicture.name;
            param.kaipiaoPhoto            =this.addForm.billImage.name;
            param.note            =this.addForm.note;
            
            param.adminId = this.userInfo.id;
            param.adminEname = this.userInfo.ename;
            param.adminCname = this.userInfo.cname;

            param.registerType = "0";//客户
            param.vipStatus = '1';
            // param.password = "null";
            // param.name = "null";
          addcus(param).then(res=>{
            if(res.code =="100"){
              this.modalCancel();
              this.$Message.success("添加成功");
              this.getTable();
            }else{
              this.$Message.error('添加失败'+res.code+res.msg)
            }
          })
        }else{
          this.$Message.error('验证不通过')
        }
      })
    },
    modalCancel(){
      this.addModal = false;
      this.modal_review =false;
      this.modal_info = false;
    },
    delete_modal_ok(){//删除ok事件
           //驳回
        let param = {};
        param.id = this.choseItem.cusid;
        param.status = "0";
        updateCusVipStatus(param).then(res=>{
          if(res.code == "100"){
            let param1 ={}
            param1.id = this.choseItem.orgid;
            param1.status ="0";
            updateOrgVipStatus(param1).then(res=>{
               if(res.code =="100"){
                  this.$Message.success('删除成功');
                  this.modalCancel();
                  this.getTable();
              }else{
                  this.$Message.error('删除失败')
              }
            })
          }else{
            this.$Message.error('删除失败')
          }
          
        })
    },
    refresh(){//刷新
      this.searchPage = "1";
      this.input_company_name = '';
      this.getTable();
    },
    changePage(index){
        this.searchPage = index;
        this.getTable();
    },
    getTable(){
      let param = {};
      param.pageNum = this.searchPage;
      param.orgName = this.input_company_name;
      param.registerType = "0";
      findOrgList(param).then(res=>{
        if(res.code =='100'){
          this.$Message.success('获取列表数据成功')
          this.dataCount = res.data.total;
          this.data1 = res.data.list;
        }
      })
    }
  },
  mounted(){
  },
  created(){
    this.getTable();
    console.log("开始运行")
    console.log(this.userInfo);
  }
}
</script>