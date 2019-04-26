<!--
 * @Description: 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-02 18:01:33
 -->

 
<template>
  <div style='background: #ffffff;'>
       <Form :label-width="120" inline  :model="addForm">
        <row>
            <h2 style='text-indent:20px;'>基本信息</h2>
             <FormItem label="公司名称:" >
              <i-input   class="width_300 "  v-model="addForm.basic_companyName" placeholder="请输入公司名称"/>
            </FormItem>
            <FormItem label="主联系人姓名:" >
              <i-input class="width_300"    v-model="addForm.basic_name" placeholder="主联系人姓名"/>
            </FormItem>
            <FormItem label="主联系人电话:" >
              <i-input   class="width_300"  v-model="addForm.basic_phone" placeholder="请输入主联系人电话"/>
            </FormItem>
             <!-- <FormItem label="所在城市:" >
                <Cascader class="width_300"  :data="dataOne"  :placeholder="addForm.cityWhere_placeholder" v-model="addForm.basic_city" @on-change='getCityBasic' style='width:180px'></Cascader>
            </FormItem> -->
            <FormItem label='开票公司地址:'>
              <Input class="width_300"  v-model='addForm.basic_address' placeholder='请输入开票资料上的公司地址'/>
            </FormItem>
             <FormItem label="开票联系电话：" >
              <Input class="width_300"  v-model='addForm.basic_contenePhone' placeholder='请输入开票资料上的电话'/>
            </FormItem>
           

             <FormItem label="成立日期:" >
               <DatePicker type="date"  v-model="addForm.basic_dateEstablishment" @on-change="changeCreateTieme"  format="yyyy-MM-dd" :placeholder="addForm.basic_dateEstablishmentValue" class="width_300"></DatePicker>
            </FormItem>
            
             <FormItem label="公司类型">
              <Select v-model="addForm.basic_companyType" :placeholder="addForm.basic_companyTypePH" class="width_300">
                <Option v-for="(item, index) in orgCompanyTypeList" :value="item.value" :key="item.vaule">{{item.label}}</Option>
              </Select>
             </FormItem>

             <FormItem label="企业性质">
              <Select v-model="addForm.basic_NatureEnterprise" :placeholder="addForm.basic_NatureEnterprisePH"  class="width_300">
                <Option v-for="(item, index) in companyNatureList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
             </FormItem>

             <FormItem label="法人姓名:" >
               <i-input   class="width_300" v-model="addForm.basic_legalName" placeholder="请输入法人姓名"/>
            </FormItem>

            <FormItem label="注册资金:" >
             <i-input   class="width_300"  v-model="addForm.basic_registMoney" placeholder="请输入注册基金"/>万元
            </FormItem>
             <FormItem label="法人身份证号:" >
             <i-input   class="width_300"  v-model="addForm.basic_idCard" placeholder="请输入法人身份证号"/>
            </FormItem>
           
        </row>

        <row>
            <h2 style='text-indent:20px;'>业务信息</h2>

            <FormItem label="联系人:" >
               <i-input   class="width_300" v-model="addForm.business_Contacts" placeholder="请输入联系人"/>
            </FormItem>

            <FormItem label="手机:" >
               <i-input   class="width_300" v-model="addForm.business_phone" placeholder="请输入手机号"/>
            </FormItem>

            <FormItem label="座机:" >
               <i-input   class="width_300" v-model="addForm.business_Landline" placeholder="请输入座机号"/>
            </FormItem>

            <FormItem label="传真:" >
               <i-input   class="width_300" v-model="addForm.business_Fax" placeholder="请输入传真号"/>
            </FormItem>

            <FormItem label="分机:" >
               <i-input   class="width_300" v-model="addForm.business_extension" placeholder="请输入分机号"/>
            </FormItem>

           <FormItem label="QQ:" >
               <i-input   class="width_300" v-model="addForm.business_qq" placeholder="请输入QQ机号"/>
            </FormItem>

            <FormItem label="账务对账人:" >
               <i-input   class="width_300" v-model="addForm.business_nameDui" placeholder="请输入对账人姓名"/>
            </FormItem>

            <FormItem label="对账人手机:" >
               <i-input   class="width_300" v-model="addForm.business_phoneDui" placeholder="请输入手机号"/>
            </FormItem>

            <FormItem label="对账人QQ:" >
               <i-input   class="width_300" v-model="addForm.business_qqDui" placeholder="请输入对账人qq"/>
            </FormItem>

            <!-- <FormItem label="办公地址:" >
             <Cascader :data="dataOne" v-model="addForm.business_workcity" @on-change='getCity' class="width_300"></Cascader>
            </FormItem> -->
            <FormItem label='办公详细地址：'>
              <Input class="width_300" v-model='addForm.business_workAddress' placeholder='请输入办公详细地址'/>
            </FormItem>
             <FormItem label="主营城市">
              <Select class="width_300"
                multiple
                @on-change="change_business_mainCity"
                v-model="addForm.business_mainCity"
                filterable
                :placeholder="addForm.business_mainCityPH"
                remote
                :remote-method="remoteMethod1"
                :loading="loading1">
                <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
            </Select>
            </FormItem>

            <FormItem label='钢厂'>
                <Select class="width_300"
                      multiple
                      @on-change="change_business_factory"
                      v-model="addForm.business_factory"
                      filterable
                      remote
                      :placeholder="addForm.business_factoryPH"
                      :remote-method="remoteMethod2"
                      :loading="loading2">
                      <Option v-for="(option, index) in options2" :value="option.value" :key="index">{{option.label}}</Option>
                  </Select>
            </FormItem>


            <FormItem label="销售品种">
              <Select @on-change='changeOpation_business_Salesvarieties'
               v-model="addForm.business_Salesvarieties"  
               multiple class="width_300">
                <Option   v-for="(item, index) in salesVarietiesListThis" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
             </FormItem>

        </row>
           <!-- 仓库信息 -->
        <row class="displayNone">
           <h2 style='text-indent:20px;'>仓库信息</h2>
           
           <FormItem label='仓库选择'>
                <Select class="width_300"
                      multiple
                      v-model="model15"
                      filterable
                      remote
                      :remote-method="remoteMethod3"
                      :loading="loading3">
                      <Option v-for="(option, index) in options3" :value="option.value" :key="index">{{option.label}}</Option>
                  </Select>
            </FormItem>
        </row>
        <!-- 打款信息 -->
        <row>
          <h2>退款银行信息</h2>

          <FormItem label="银行账号:" >
           <i-input   class="width_300" v-model="addForm.tkAccBankCode" placeholder="请输入银行账号"/>
          </FormItem>

          <FormItem label="开户行">
            <Select v-model="openBank" filterable class="width_300" @on-change='getChange'>
                <Option v-for="(item,index) in bankAdd" :value="item" :key="index">{{ item}}</Option>
            </Select>
          </FormItem>

            <FormItem label="所在地区:" >
             <Cascader :data="dataOne" v-model="valueOne" @on-change='getCityOne' class="width_300"></Cascader>
            </FormItem>


          <FormItem label="开户网点名称">
            <Select :label-in-value="true" :placeholder="bankDotPH" v-model="bankDot" filterable class="width_300" @on-change='getChangeDot'>
                <Option v-for="(item,index) in bankDotList" :value="item.bankBranchLineId" :key="index">{{ item.branchFullName}}</Option>
            </Select>
          </FormItem>


           <FormItem label="税号:" >
           <i-input   class="width_300" v-model="addForm.taxNo" placeholder="请输入税号"/>
          </FormItem> 

        </row>


         <!-- 备注 -->
         <row>
           <h2>备注信息</h2>

           
          <FormItem label="备注:" >
           <i-input  class="width_300"  type="textarea" :rows="3"  v-model="addForm.note" placeholder="请输入备注"/>
          </FormItem>

         </row>


         <!-- 公司其他信息--简称打款信息 -->

         <row>
            <h2>打款银行信息</h2>
             
             
         <FormItem label="开户银行:" >
           <i-input   class="width_300" v-model="addForm.dkAccBank" placeholder="请输入开户银行"/>
         </FormItem>
        
         
        
          <FormItem label="银行账号:" >
           <i-input   class="width_300" v-model="addForm.dkAccBankCode" placeholder="请输入退款账开户行"/>
         </FormItem>

         </row>
         <!-- 合同图片上传 -->
         <row>
             <h2>图片</h2>
            <Tag type="border" color="error">第一张为营业执照</Tag>
            <Tag type="border" color="error">第二张为开票资料</Tag> 
            <Tag type="border" color="error">第三张为法人身份证</Tag> 
          <br>
          <FormItem :required="true" label="合同图片">
            <template >
              <div class="demo-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
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
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                :action="updateImgUrl"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="20"></Icon>
                </div>
            </Upload>
          <Modal title="查看图片" v-model="visible">
              <img :src="this.$global.ossUrl + imgName" v-if="visible" style="width: 100%">
          </Modal>

            </template>
          </FormItem>
         </row>
         <row>
           <div class="margin-top-20">
            <Button v-show="addBtn" type="primary" @click="addNewCustomer">添加</Button>
            <Button v-show="changeBtn"  type="primary" @click="changeCustomer">修改</Button>
            <Button  type="primary" @click="closeSelf">关闭</Button>

          </div>
         </row>
      </Form>
   
  </div>
</template>
<script>
import {getCity,getGang,getWarehouse,getOpeningBank,getBankDot} from '@/api/cusData' //主营城市 钢厂  仓库  打款开户行
import city from '@/api/city_houtai' //三级城市
import { mapMutations } from 'vuex'
import {salesVarietiesList,companyNatureList,orgCompanyTypeList} from '../../libs/global_type'
import {
        updatePaymentRequest,
        addOrgCustomer,
        findOrginization,
        findOrgCusAcc,
        updateOrgCus,
        addShop
    } from '@/api/data'

  export default {
    name: 'supplierList_add',
    inject: ['reload'],
    props:["orgItema"],
    data(){
      return {
        updateImgUrl: this.$global.updateImgUrl,
        returnBankItem:{},
        addBtn:true,
        changeBtn:true,
        orgCompanyTypeList:orgCompanyTypeList,
        companyNatureList:companyNatureList,
        salesVarietiesListThis:salesVarietiesList,//销售品种字典
         bankDotList:[],//存放开户网点
         bankDot:'', 
         bankDotPH:'请选择',   //以上是开户网点数据
         bankString:'',//开户银行字段
         bankOpen:[],//保存银行
         bankAdd:[],
         param4:{bankName:'',pageSize:'99999'},
         options4:[],
         openBank:"",//以上是开户行字段
         model15:'',
         loading3: false,
         options3: [],
         param3:{},
         listHouseName:[],//保存仓库名字
         listHouse:[],//以上是仓库信息
         model14:'',
         loading2: false,
         options2: [],
         param1:{},
         gangName:[],//保存钢厂名字
         listGang:[],//以上是钢厂
         model13: '',
         loading1: false,
         options1: [],
         list: ['中国', '香港', '美国', '台湾', '调鱼岛'],
         listCon:[],//
         params:{},//主营城市
         listCname:[],//保存业务员名字
         businessName:'',//下拉框选中时业务员的名字
         value1: [],//省市默认
         cityString:'',//省市区
         valueOne:[], //银行省市默认
         cityStringOne:"",//银行省市区
         Provinces:"",//省
         city:"",//市
         dataOne:city,
         defaultList: [
                ],
         imgName: '',
         visible: false,
         uploadList: [],//图片上传
         addForm:{
           //基本信息
            cusId:'',
            orgId:'',
            basic_name:'',//主联系人姓名
            basic_phone:'',//主联系人电话
            basic_city:[],//所在城市 
            basic_cityStr:'',//所在城市 

            basic_address:'',//开票公司地址
            basic_contenePhone:'',//开票联系电话
            basic_dateEstablishment:'',//成立日期
            basic_dateEstablishmentValue:'请选择一个日期',
            basic_dateEstablishmentStr:'',//成立日期
            basic_companyName:'',//公司名称
            basic_companyType:'',//公司类型
            basic_companyTypePH:'请选择',//公司类型

            basic_NatureEnterprise:'',//企业性质
            basic_NatureEnterprisePH:'请选择',//企业性质

            basic_legalName:'',//法人姓名
            basic_registMoney:'',//注册资金
            basic_idCard:'',//法人身份证号

            //业务信息
            business_Contacts:'',//联系人
            business_phone:'',//手机
            business_Landline:'',//座机
            business_Fax:'',//传真
            business_extension:'',//分机:
            business_qq:'',//QQ
            business_nameDui:'',//账务对账人
            business_phoneDui:'',//对账人手机:
            business_qqDui:'',//对账人QQ:
            business_workcity:[],//办公地址:
            business_workAddress:'',//办公详细地址
            business_mainCity:'',//主营城市
            business_mainCityPH:'请选择',//主营城市
            business_mainCityStr:'',
            business_factory:'',//钢厂
            business_factoryPH:'请选择',//钢厂
            business_factoryStr:'',//钢厂
            business_SalesvarietiesPH:'请选择',//销售品种
            business_Salesvarieties:'',//销售品种
            business_SalesvarietiesStr:'',//销售品种

            //备注
            note:'',//备注
            taxNo:'',//税号
            tkAccBankCode:'',
            //打款信息
            dkAccBankCode:'',
            dkAccBank:''
            //退款信息
         },
      }
    },
    methods:{
      ...mapMutations([
      'closeTag'
    ]),
    changeCreateTieme(data1){
      this.addForm.basic_dateEstablishmentStr = data1;
    },
    change_business_mainCity(value){
      this.addForm.business_mainCityStr = this.$global.getListStr(value)
    },
    change_business_factory(value){
      this.addForm.business_factoryStr = this.$global.getListStr(value)
      
    },
    changeOpation_business_Salesvarieties(value){
      this.addForm.business_SalesvarietiesStr = this.$global.getListStr(value)
    },
    addNewCustomer(){
      // TODO
      let param = {};
      //默认值
      param.isMain            = "1";
      param.orgRoleType       = "2";
      param.registerType      = "6"
      param.dongjieMoney      = "0"
      param.money             = "0"
      param.password          = "123456"
      param.vipStatus         = "16"
      param.adminCname        = this.$global.adminInfo.cname;
      param.adminEname        = this.$global.adminInfo.ename
      param.adminId           = this.$global.adminInfo.ename;
      param.adminName         = this.$global.adminInfo.cname
      param.createCname       = this.$global.adminInfo.cname
      param.createEname       = this.$global.adminInfo.ename
      param.createUserId      = this.$global.adminInfo.id
      //默认值结束
      //基本信息开始
        // 主联系人姓名
        param.name              = this.addForm.basic_name //姓名:
        // 主联系人电话
        param.phone             = this.addForm.basic_phone //手机号码
        // 所在城市+开票公司地址
        param.address        = this.addForm.basic_address;//公司地址
        // 开票联系电话
        param.orgPhone          = this.addForm.basic_contenePhone//联系电话
        param.cusSeatNumber     = this.addForm.basic_contenePhone//座机
        // 成立日期
        param.createdDate       = this.addForm.basic_dateEstablishmentStr;
         
        // 公司名称
        param.orgName           = this.addForm.basic_companyName;//公司
        // 公司类型
        param.type              = this.addForm.basic_companyType
        // 企业性质
        param.nature            = this.addForm.basic_NatureEnterprise
        // 法人姓名
        param.legalPerson       = this.addForm.basic_legalName
        // 注册资金
        param.registeredMoney   = this.addForm.basic_registMoney;
        // 法人身份证号
        param.legalPersonNo     = this.addForm.basic_idCard
      // 基本信息结束

      // 业务信息
        // 联系人:
        param.bName = this.addForm.business_Contacts
        // 手机:
        param.bMobile = this.addForm.business_phone
        // 座机:
        param.bPhone = this.addForm.business_Landline
        // 传真
        param.fax = this.addForm.business_Fax
        // 分机
        param.fenPhone = this.addForm.business_extension
        // QQ
        param.qq = this.addForm.business_qq
        // 账务对账人
        param.bmpName = this.addForm.business_nameDui
        // 对账人手机
        param.bmpMobile = this.addForm.business_phoneDui
        // 对账人QQ
        param.bmpQQ = this.addForm.business_qqDui
        // 办公详细地址
        param.orgAddress = this.addForm.business_workAddress
        // 主营城市
        param.mainCity = this.addForm.business_mainCityStr
        // 钢厂
        param.steelMills =this.addForm.business_factoryStr;
        // 销售品种
        param.mainSteel = this.addForm.business_SalesvarietiesStr
      // 业务信息结束

      //税号
      param.taxNo             = this.addForm.taxNo//税号

      // 备注信息
      param.note              =this.addForm.note
      // 备注信息结束
      // 公司其他信息
     
      //打款银行卡
      param.dkAccBank         = this.addForm.dkAccBank
      param.dkAccBankCode     = this.addForm.dkAccBankCode
      param.dkAccType         = "0"
      param.dkAccAuditStatus  = "8"
      //打款银行卡结束

      // 退款银行卡开始
      param.tkAccBank         = this.returnBankItem.label?this.returnBankItem.label:''
      param.tkAccBblId        = this.returnBankItem.value?this.returnBankItem.value:''
      param.tkAccBankCode     = this.addForm.tkAccBankCode
      param.tkAccType         = "1"
      param.tkAccAuditStatus  = "8"
      // 退款银行卡结束

      // 制单银行卡开始
      param.fkAccBank         = this.returnBankItem.label?this.returnBankItem.label:''
      param.fkAccBblId        = this.returnBankItem.value?this.returnBankItem.value:''
      param.fkAccBankCode     = this.addForm.tkAccBankCode
      param.fkAccType         = "30"
      param.fkAccAuditStatus  = "8"
      // 制单银行卡结束

     param.shuiwudengjiPhoto = this.uploadList.length>=1?this.uploadList[0].url:'';
     param.kaipiaoPhoto      = this.uploadList.length>=2?this.uploadList[1].url:''
     param.farenCodePhoto      = this.uploadList.length>=3?this.uploadList[2].url:''
      addOrgCustomer(param).then(res =>{
                    if(res.code =="100"){
                      if(res.data.orgId.length>0){
                        this.addNewShop(res.data)
                      }else{
                        console.log("orgId小于0")
                      }
                        this.$Notice.success({
                            title:'添加供应商成功',
                        })
                        // this.reload();
                    }
                })
    },
    //添加成功后主动新增一个店铺
    addNewShop(item){
      console.log("开始添加")
      let param = {};
        param.adminId = this.$global.adminInfo.id;
        param.adminName= this.$global.adminInfo.cname
        param.createCname = this.$global.adminInfo.cname;
        param.createEname = this.$global.adminInfo.ename;
        param.auditStatus = "8"
        param.creditShop  = "1"
        param.dongjieMoney= "0"
        param.fwMoney="0"
        param.money= "0"
        param.fwModel= "T+0"
        param.status= "1"

        param.accountId= item.fkAccId
        param.name     = item.orgName +'店铺'
        param.orgId    = item.orgId
        param.orgName  = item.orgName
        console.log(param);
        addShop(param).then(res =>{
            if(res.code =="100"){
                        this.$Notice.success({
                            title:'已经新增一个店铺',
                        })
                        this.closeSelf();
                    }
        })
    },
    changeCustomer(){ 
       let param = {};
       param.id = this.addForm.cusId ;
       param.orgId = this.addForm.orgId;
      //默认值
      param.isMain            = "1";//是否主账号
      param.orgRoleType       = "2";
      // param.registerType      = "6"
      param.vipStatus         = "16"
      param.orgVipStatus         = "16"
      
      param.adminCname        = this.$global.adminInfo.cname;
      param.adminEname        = this.$global.adminInfo.ename
      param.adminId           = this.$global.adminInfo.ename;
      //默认值结束
      //基本信息开始
        // 主联系人姓名
        param.name              = this.addForm.basic_name //姓名:
        // 主联系人电话
        param.phone             = this.addForm.basic_phone //手机号码
        // 所在城市+开票公司地址
        param.address        = this.addForm.basic_address;//公司地址
        // 开票联系电话
        param.orgPhone          = this.addForm.basic_contenePhone//联系电话
        param.cusSeatNumber     = this.addForm.basic_contenePhone//座机
        // 成立日期
        param.createdDate       = this.addForm.basic_dateEstablishmentStr;
         
        // 公司名称
        param.orgName           = this.addForm.basic_companyName;//公司
        // 公司类型
        param.type              = this.addForm.basic_companyType
        // 企业性质
        param.nature            = this.addForm.basic_NatureEnterprise
        // 法人姓名
        param.legalPerson       = this.addForm.basic_legalName
        // 注册资金
        param.registeredMoney   = this.addForm.basic_registMoney;
        // 法人身份证号
        param.legalPersonNo     = this.addForm.basic_idCard
      // 基本信息结束

      // 业务信息
        // 联系人:
        param.bName = this.addForm.business_Contacts
        // 手机:
        param.bMobile = this.addForm.business_phone
        // 座机:
        param.bPhone = this.addForm.business_Landline
        // 传真
        param.fax = this.addForm.business_Fax
        // 分机
        param.fenPhone = this.addForm.business_extension
        // QQ
        param.qq = this.addForm.business_qq
        // 账务对账人
        param.bmpName = this.addForm.business_nameDui
        // 对账人手机
        param.bmpMobile = this.addForm.business_phoneDui
        // 对账人QQ
        param.bmpQQ = this.addForm.business_qqDui
        // 办公详细地址
        param.orgAddress = this.addForm.business_workAddress
        // 主营城市
        param.mainCity = this.addForm.business_mainCityStr
        // 钢厂
        param.steelMills =this.addForm.business_factoryStr;
        // 销售品种
        param.mainSteel = this.addForm.business_SalesvarietiesStr
      // 业务信息结束

      //税号
      param.taxNo             = this.addForm.taxNo//税号

      // 备注信息
      param.note              =this.addForm.note
      // 备注信息结束
      // 公司其他信息
     
      //打款银行卡
      param.dkAccBank         = this.addForm.dkAccBank
      param.dkAccBankCode     = this.addForm.dkAccBankCode
      param.dkAccType         = "0"
      param.dkAccAuditStatus  = "8"
      //打款银行卡结束

      // 退款银行卡开始
      param.tkAccBank         = this.returnBankItem.label?this.returnBankItem.label:''
      param.tkAccBblId        = this.returnBankItem.value?this.returnBankItem.value:''
      param.tkAccBankCode     = this.addForm.tkAccBankCode
      param.tkAccType         = "1"
      param.tkAccAuditStatus  = "8"
      // 退款银行卡结束

      // 制单银行卡开始
      param.fkAccBank         = this.returnBankItem.label?this.returnBankItem.label:''
      param.fkAccBblId        = this.returnBankItem.value?this.returnBankItem.value:''
      param.fkAccBankCode     = this.addForm.tkAccBankCode
      param.fkAccType         = "30"
      param.fkAccAuditStatus  = "8"
      // 制单银行卡结束

     param.shuiwudengjiPhoto = this.uploadList.length>=1?this.uploadList[0].url:'';
     param.kaipiaoPhoto      = this.uploadList.length>=2?this.uploadList[1].url:''
     param.farenCodePhoto      = this.uploadList.length>=3?this.uploadList[2].url:''
     console.log(param);
     //修改信息
     updateOrgCus(param).then(res=>{
       if(res.code =="100"){
           this.$Notice.success({
                            title:'修改成功,2秒后自动刷新',
                        })
                        this.closeSelf();
       }
      

     })
    },
    closeSelf(){
      console.log("开始关闭")
       this.closeTag({
        name: 'supplierList_add'
      })
    },
         //上传图片
      handleView (name) {
            this.imgName = name;
            this.visible = true;
       },
       handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
       },
       handleSuccess (res, file) {
          this.$Message.success('上传成功');
                console.log("上传成功");
                file.name = res.msg;
                file.url = this.$global.ossUrl + res.msg;
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
                console.log("验证最大上传张数")
                console.log(this.uploadList.length)

                const check = this.uploadList.length < 3;
                if (!check) {
                    this.$Notice.warning({
                        title: '最大支持上传2张图片'
                    });
                }else{
                    console.log("大大大")
                }
                return check;
      },
    // 省市区
     getCityBasic(value,selectedData){
         console.log(selectedData.length)
          if(selectedData.length =='2'){
             this.addForm.basic_cityStr= selectedData[0].label+','+ selectedData[1].label
          }else {
            this.addForm.basic_cityStr= selectedData[0].label+','+ selectedData[1].label+','+ selectedData[2].label
          }
      },
      //银行所在地区
      getCityOne(value,selectedData){
          this.Provinces=selectedData[0].label
          this.city=selectedData[1].label
          if(selectedData.length =='2'){
             this.cityStringOne= selectedData[0].label+','+ selectedData[1].label
          }else {
            this.cityStringOne= selectedData[0].label+','+ selectedData[1].label+','+ selectedData[2].label  
          }
          this.getBankDotName();
      },
    //主营城市多级搜索
      //业务员远程搜锁
      remoteMethod1 (query) {
               console.log(query)
                if (query !== '') {
                    this.loading1 = true;
                   // console.log(this.params)
                    this.params.city = query ;
                    getCity(this.params).then(res=>{
                        if(res.code =="100"){
                        this.listCon=res.data
                        this.listCon.map((value,key,arr)=>{
                             this.listCname.push(arr[key].city)
                        })
                      }  
                    })
                    setTimeout(() => {
                        this.loading1 = false;
                        const list = this.listCname.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options1 = list.filter(item => item.label.indexOf(query) > -1);
                       // this.businessName=query;
                    }, 200);
                } else {
                    this.options1 = [];
                }
       },
      //钢厂列表多选
      remoteMethod2 (query) {
               console.log(query)
                if (query !== '') {
                    this.loading2 = true;
                    // console.log(this.params)
                    this.param1.steelWorksName = query ;
                    getGang(this.param1).then(res=>{
                        if(res.code =="100"){
                        this.listGang=res.data
                        this.listGang.map((value,key,arr)=>{
                             this.gangName.push(arr[key].brand)
                        })
                      }  
                    })
                    setTimeout(() => {
                        this.loading2 = false;
                        //console.log(this.listCon)
                        const list = this.gangName.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options2 = list.filter(item => item.label.indexOf(query) > -1);
                       // this.businessName=query;
                    }, 200);
                } else {
                    this.options2 = [];
                }
       },

    //仓库多选列表
      remoteMethod3 (query) {
               console.log(query)
                if (query !== '') {
                    this.loading3 = true;
                    // console.log(this.params)
                    this.param3.warehouseName = query ;
                    getWarehouse(this.param3).then(res=>{
                        if(res.code =="100"){
                        this.listHouse=res.data
                        this.listHouse.map((value,key,arr)=>{
                             this.listHouseName.push(arr[key].warehouseName)
                        })
                      }  
                    })
                    setTimeout(() => {
                        this.loading3 = false;
                        //console.log(this.listCon)
                        const list = this.listHouseName.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options3 = list.filter(item => item.label.indexOf(query) > -1);
                       // this.businessName=query;
                    }, 200);
                } else {
                    this.options3 = [];
                }
    },
   //直接获取银行开户行数据
    getBan(param){
            //let param4={bankName:"123"},//开户行参数
            getOpeningBank(param).then(res=>{
                        if(res.code =="100"){   
                        this.bankOpen=res.data
                        this.bankOpen.map((value,key,arr)=>{
                             this.bankAdd.push(arr[key].bankAbbreviation)    
                        })
                         this.options4=this.bankAdd
                      }  
                    })
       },
    //选中开户行确定的数据
    getChange(value){
      this.bankString=value;
      this.getBankDotName();
      //console.log(value)
    },
    //选中开户网点的名字
    getChangeDot(item){
                console.log(item)
                this.returnBankItem = item;
    },
    //获取开户网点的数据
    getBankDotName(){ 
      if(this.Provinces =='' && this.city=='' ) return false
      const paramB={};
      paramB.bankAbbreviation=this.bankString //银行名称
      paramB.bankBranchLineCity=this.Provinces //省
      paramB.prefectureLevel = this.city //市
      getBankDot(paramB).then(res=>{
        if(res.code =="100"){
          console.log("我调用了")
          console.log(res)
          this.bankDotList=res.data;
          // res.data.map((value,index,arr)=>{
          //        this.bankDotList.push(arr[index].branchFullName)
          // })
        }
      })

    },
    getCity(){

    },
    setFormItem(){
        //赋值
      console.log("开始赋值")
      console.log(this.$route.query);
      if(this.$route.query.orgAddType == "1"){//1是新增
        this.addBtn = true;
        this.changeBtn  = false;
        return ;
      }
       this.addBtn = false;
        this.changeBtn  = true;
      //赋值
      this.addForm.cusId     = this.$route.query.cusid;
      this.addForm.orgId     = this.$route.query.cusorgId;

      this.addForm.basic_name = this.$route.query.cus
      this.addForm.basic_phone = this.$route.query.cusphone
      this.addForm.basic_address = this.$route.query.cusaddress
      this.addForm.basic_contenePhone = this.$route.query.cusseatNumber

      this.addForm.basic_dateEstablishmentValue    = this.$route.query.orgcreatedDate
      this.addForm.basic_dateEstablishmentStr = this.$route.query.orgcreatedDate//起始日期

      this.addForm.basic_companyName = this.$route.query.orgorgName

      this.addForm.basic_companyType = this.$route.query.org
      // this.addForm.basic_companyTypePH = this.$route.query.org

      this.addForm.basic_NatureEnterprise = this.$route.query.orgnature
      // this.addForm.basic_NatureEnterprisePH = this.$route.query.orgnature
      
      this.addForm.basic_legalName = this.$route.query.orglegalPerson
      this.addForm.basic_registMoney = this.$route.query.orgregisteredMoney
      this.addForm.basic_idCard = this.$route.query.orglegalPersonNo
      //业务信息
      this.addForm.business_Contacts = this.$route.query.orgbName
      this.addForm.business_phone = this.$route.query.orgbMobile
      this.addForm.business_Landline = this.$route.query.orgbPhone
      this.addForm.business_Fax = this.$route.query.orgfax
      this.addForm.business_extension = this.$route.query.orgfenPhone
      this.addForm.business_qq = this.$route.query.orgqq
      this.addForm.business_nameDui = this.$route.query.orgbmpName
      this.addForm.business_phoneDui = this.$route.query.orgbmpMobile
      this.addForm.business_qqDui = this.$route.query.orgbmpQQ
      this.addForm.business_workAddress = this.$route.query.orgorgAddress

      this.addForm.business_mainCityStr = this.$route.query.orgmainCity
      this.addForm.business_mainCityPH = this.$route.query.orgmainCity
      
      this.addForm.business_factoryStr = this.$route.query.orgsteelMills
      this.addForm.business_factoryPH = this.$route.query.orgsteelMills

      this.addForm.business_SalesvarietiesStr = this.$route.query.orgmainSteel
      this.addForm.business_Salesvarieties = this.$route.query.orgmainSteel


      this.addForm.taxNo = this.$route.query.orgtaxNo
      this.addForm.note = this.$route.query.orgnote
      // 图片
      this.uploadList                     = this.$global.setDefaultImgList([this.$route.query.orgshuiwudengjiPhoto,this.$route.query.orgkaipiaoPhoto,this.$route.query.orgfarenCodePhoto]);

       //打款银行卡 TODO 需要赋值，然后修改
       this.addForm.dkAccBank =  this.$route.query.dkaccBank
       this.addForm.dkAccBankCode =  this.$route.query.dkaccBankCode
      //打款银行卡结束

      // 退款银行卡开始
      this.addForm.tkAccBankCode = this.$route.query.fkaccBankCode;
      // returnBankItem
      this.returnBankItem.label  = this.$route.query.fkaccBank
      this.returnBankItem.value  = this.$route.query.fkaccBblId
      // 退款银行卡结束
      this.bankDotPH     = this.$route.query.fkaccBank;
      
    } 
       
    },
    mounted(){
      this.getBan(this.param4);  //开户行数据
      this.getBankDotName();//开户网点数据
      console.log("mounted")
        this.setFormItem()

      // this.addForm.company = this.$route.query.orgorgName;
    },
    created(){
      console.log("created")
      console.log(this.orgItem)

    },
  }
</script>
<style <style lang="less">
.displayNone{
  display: none
}
.width_300{
  width: 250px
}
.red{
  color: red
}
</style>

