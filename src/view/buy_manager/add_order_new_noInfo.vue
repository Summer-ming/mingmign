<template>
  <div>
    <row>
      <Form :label-width="120" inline :model="addForm">

        <row>
          <h2 style='text-indent:20px;'>采购单-快速打款单</h2><br/>
          <h3 style='text-indent:40px;'>基本信息</h3>

          <FormItem label="供应商店铺查询:">
            <Select v-model="shopO" style="width:200px" placeholder="请输入店铺名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="JSON.stringify(item)" :label="item.name" :key="index" >{{ item.name }}</Option>
      
            </Select>
          </FormItem>

          <FormItem label="本公司抬头:">
            <Select v-model="taiT" style="width:200px" placeholder="请输入公司抬头" @on-change='getTai'  :label-in-value='true'>
              <Option v-for="(item,index) in rise" :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>

          <FormItem label="查询代理商">
            <Select :label-in-value='true' v-model='dai' style="width:200px" placeholder="请选择代理商" @on-change='getChange'>
              <Option  v-for='(item,index) in daiLi' :value="item.id" :key='index'>{{item.shortName}}</Option>
            </Select>
          </FormItem>
        </row>

         <FormItem label="采购总金额:" prop="totalSum">
           <Input   style="width:200px;color:red" v-model="addForm.totalSum" placeholder="请输入总金额" />元
         </FormItem>

         <FormItem label="采购总重量:" prop="totalWeight">
           <Input   style="width:200px;color:red" v-model="addForm.totalWeight" placeholder="请输入总重量"/>吨
         </FormItem>
           <!-- <FormItem label="杂费总金额:" prop="totalOMoney">
           <Input   style="width:200px;color:red" v-model="addForm.totalOMoney" placeholder="请输入杂费总金额"/>元
         </FormItem> -->
          <FormItem label="总件数:" prop="totalOMoney">
           <Input   style="width:200px;color:red" v-model="addForm.totalNum" placeholder="请输入总件数"/>件
         </FormItem>

      </Form>
    </row>

    <!-- 上传图片 -->
    <row style='margin-bottom:20px;'>
        <b class="font_32">图片信息</b> 
        <!-- <Tag type="border" color="error">第一张为营业执照</Tag>
        <Tag type="border" color="error">第二张为开票资料</Tag>        -->
        <br>
        <div  class="demo-upload-list" v-for="(item,index) in uploadList" :key='index'>
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

    </row>

    <!--提交取消按钮 -->
    <row style='padding-left:10px;'>

      <Button   type="primary" @click='getAdd' style='margin-right:15px;'>提交</Button>


      <Button   type="primary">取消</Button> 
    </row>


   
    <!-- 2 -->
     

  </div>
</template>
<script>
import {findShop,findOrgCusAcc} from '@/api/data';//查询店铺  查询公司
import {getAgent,getTi,getWarehouse} from '@/api/cusData'//查询代理商
import {companyTypeListAllName,guigeTyoeList,paihaoTypeList} from '@/libs/global_type'//公司抬头,规格的数组,牌号的数组
import {getLeiBie} from '@/api/data_8889'//引入8889的接口
import { constants } from 'crypto';
import { mapMutations } from 'vuex'


export default {
  name: 'add_order_new_noInfo',
  components: {

  },
  data() {
    return {
      datalei:[],
      dataPin:[],
      tableNew:[],//tablle 表格
      dataGui:guigeTyoeList,
      dataPai:paihaoTypeList,
      dataCang:[],//仓库的数组
      dataCompany:[],
        dataNew:[],
    
      addForm: {
        totalSum: '',//总金额
        totalDijia:'',//底价总金额
        totalWeight: "",//总重量
        totalNum:'',//总件数
        totalOMoney:'',//总杂费金额
      },
      param1:{pageSize:"999999"},//查询店铺参数
      shopList:[],//店铺data
      showIdK:'',//保存供应商的showid
      shopO:"",
      rise:companyTypeListAllName,//公司抬头
      taiT:"",
      param2:{shortName:""},//查寻代理商接口
      daiLi:[],//代理商data
      dai:'',
      agentId: "",// 代理商id
      agentShortName: "",//代理商名称
      bankJgId: "",//本公司抬头类型，1上海闽航，2福建亿钢
      businessType: "1",//写死
      buyType: "1",//写死
      createCname: "",//登录人的名称
      createEname: "",//登录人的英文名称
      //cus的信息根据 bankJgId的类型来区分填写
      customerId: "",//bankJgId = 1,写死1，bankJgId = 2,写死2
      customerName: "",//bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
      customerOrgId: "",//bankJgId = 1,写死"1"bankJgId = 2,写死2
      customerOrgName: "",//bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
      customerPhone: "",//传空
      merMoneyAll: "0",//卖家总金额
      moneyAll: "0",//买家总金额
      orderType: "1",//订单类型,写1
      payType: "1",//写死
      pid: "0",//写死
      shopId: "",//供应商店铺id
      shopName: "",//供应商店铺名称
      shopOrgId: "",//供应商店铺公司id
      shopOrgName: "",//供应商店铺公司名称
      shopUserId: "",//供应商店铺所属管理员id
      staus: "1",//状态 写1
      userId: "",// 管理员id，登录人员的id
      zhouqijiesuanStatus: "0",//写死0
      zongjianshu: "",//总件数
      zongzhongliang: "",//总重量
      param14:{},//提交后台数据进行过滤
      dataThree:[],//数组
      updateImgUrl: this.$global.updateImgUrl, //上传图片
      visible: false,
      defaultList: [],
      uploadList: [],
      imgString:"",//图片的参数
    }
  },
  methods: {
     ...mapMutations([
      'closeTag'
    ]),
       //查询店铺
       getShop(param){
         param.status = 1;
          findShop(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
       //查询代理商 getAgent
       getDai(param){
          getAgent(param).then(res=>{
            if(res.code =="100"){
             this.daiLi=res.data.list;
          }  
         })
       },
       //获取代理商的值
       getChange(item){
         console.log(item)
         this.agentId = item.value;
         this.agentShortName = item.label;

       },
       //公司抬头的值
       getTai(e){
         console.log('公司抬头的值')
          console.log(e)
          if(e.value=='1'){
              this.bankJgId        = '1'
              this.customerId      = '1'
              this.customerOrgId   = '1'
              this.customerName    = e.label;
              this.customerOrgName = e.label;
            }else if(e.value=='2'){
              this.bankJgId        = '2';
              this.customerId      = '2'
              this.customerOrgId   = '2'
              this.customerName    = e.label;
              this.customerOrgName = e.label;
          }
       },
       //获取供应商选中的值
       getDian(item){
        console.log(item)
        //item= eval('(' + item + ')');
        const stingR=eval('(' + item.value + ')')
        this.showIdK=stingR.id;
        this.agentId=stingR.id;
        this.agentShortName=stingR.name;
        this.shopId=stingR.id;
        this.shopName=stingR.name;
        this.shopOrgName=stingR.orgName;
        this.shopUserId=stingR.adminId;

        this.shopOrgId=stingR.orgId;

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
                console.log('我是上传的图片')
                const reg=/,$/gi;//此处是正则

                this.uploadList.map((item)=>{
                  console.log(this.imgString.length+'我是打印的长度')
                     this.imgString += item.url+','    
                })
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

                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最大支持上传5张图片'
                    });
                }else{
                    console.log("大大大")
                }
                return check;
            },
       getAdd(){ 
         const param                = {};
               param.agentId        = this.agentId;
               param.agentShortName = this.agentShortName,            //代理商名称
               param.bankJgId       = this.bankJgId,                  //本公司抬头类型，1上海闽航，2福建亿钢
               param.businessType   = '1',                            //写死
               param.buyType        = "1",                            //写死
               param.createCname    = this.$global.adminInfo.cname,   //登录人的名称
               param.createEname    = this.$global.adminInfo.ename,   //登录人的英文名称
         //cus的信息根据 bankJgId的类型来区分填写
         param.customerId          = this.customerId,            //bankJgId = 1,写死1，bankJgId = 2,写死2
         param.customerName        = this.customerName,          //bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
         param.customerOrgId       = this.customerOrgId,         //bankJgId = 1,写死"1"bankJgId = 2,写死2
         param.customerOrgName     = this.customerOrgName,       //bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
         param.customerPhone       = "",                         //传空
         //买家信息结束
         param.moneyAll            = this.addForm.totalSum,                        //买家总金额
         param.merMoneyAll         = this.addForm.totalSum,                        //卖家总金额 
         
         param.orderType           = "8",                        //订单类型,写8
         param.payType             = "1",                        //写死
         param.pid                 = "0",                        //写死
         //店铺信息
         param.shopId              = this.shopId,                //供应商店铺id
         param.shopName            = this.shopName,              //供应商店铺名称
         param.shopOrgId           = this.shopOrgId,             //供应商店铺公司id
         param.shopOrgName         = this.shopOrgName,           //供应商店铺公司名称
         param.shopUserId          = this.shopUserId,            //供应商店铺所属管理员id
         
         param.staus               = "1",                        //状态 写1
         param.userId              = this.$global.adminInfo.id,                // 管理员id，登录人员的id
         param.zhouqijiesuanStatus = "0",                        //写死0
         param.zongjianshu         = this.addForm.totalNum,      //总件数
         param.zongzhongliang      = this.addForm.totalWeight,   //总重量
         param.pictures            = this.imgString              //上传的图片
          //明细信息
         param.orderInfoList       = []
          getTi(param).then(res=>{
              if(res.code =="100"){
                console.log(res)
                 this.$Notice.success({
                            title:'添加成功',
                    })
                    this.closeSelf();
            }  
          })
       },
        //获取类别
        getLei(){
            let param={};
            getLeiBie(param).then(res=>{

               this.dataNew = res.data;
               res.data.map((item)=>{
                  this.datalei.push(item.steelName)
               })    
               this.datalei=this.datalei
         })
        },
         //获取公司名字
         getComPany(){
             let param={};
              
             findOrgCusAcc(param).then(res=>{
        
                  this.dataCompany=res.data.list            
            })
         },
         closeSelf(){
         this.closeTag({
              name: 'add_order_new_noInfo',
          })
       }
 
  },
   mounted() {
      // Array.prototype.notempty = function() {
      //       var arr = [];
      //       this.map(function(val, index) {
      //       //过滤规则为，不为空串、不为null、不为undefined
      //       if (val !== "" && val != undefined) { arr.push(val); }});
      //       return arr;
      //   };
    this.getShop(this.param1);//查询店铺
    this.getDai(this.param2);//查询代理商
    this.getComPany();//获取公司名称
  },
  watch: {
    
  }
}
</script>
<style <style lang="less">
.buy_m {
  display: flex;
  background: #ffffff;
  .clo_span {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 8px;
  }
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
</style>

