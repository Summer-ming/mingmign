<template>
  <div>
    <row>
      <Form :label-width="120" inline :model="addForm">

        <row>
          <h2 style='text-indent:20px;'>采购单</h2><br/>
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
           <i-input   style="width:200px" v-model="addForm.totalSum" placeholder="请输入总金额"/>
         </FormItem>

         <FormItem label="采购总重量:" prop="totalWeight">
           <i-input   style="width:200px" v-model="addForm.totalWeight" placeholder="请输入总重量"/>
         </FormItem>
          <p style="visibility: hidden;">{{total}}</p>

      </Form>
    </row>
    <!-- 合同明细 -->
    <row>
      <h3 style='text-indent:40px;'>合同明细</h3>
      <row style='padding-left:40px;padding-top:10px;;'>
          <Upload 
                    ref="upload"
                    :action="this.$global.baseUrl+'goldfinger/ShopSpringUpload'"    
                     name="file"
                    :show-upload-list="true"
                    :data="{file_id: 0,shopId:this.showIdK}"
                    :on-format-error="handleFormatError"
                    :on-success="handleSuccess1"
                    :on-error="handleError"
                    :format ="['xlsx','xls']">
                        <Button type="info" icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
      </row>
        <!-- TABLE表格 -->
       <row style='margin-bottom:20px;'> 
           <Table :columns="columnsOne" v-show='tabShow' :data="dataOne"></Table>
       </row>
    </row>

    <!-- 上传图片 -->
    <row style='margin-bottom:20px;'>
        <b class="font_32">图片信息</b> 
        <!-- <Tag type="border" color="error">第一张为营业执照</Tag>
        <Tag type="border" color="error">第二张为开票资料</Tag>        -->
        <br>
        <div  class="demo-upload-list" v-for="item in uploadList">
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
      <Button   type="primary" @click='getAdd'>提交</Button>
      <Button   type="primary">取消</Button> 
    </row>


   
    <!-- 2 -->
     

  </div>
</template>
<script>
import {findShop} from '@/api/data';//查询店铺
import {getAgent,getTi} from '@/api/cusData'//查询代理商
import {companyTypeListAllName} from '@/libs/global_type'//公司抬头

export default {
  name: 'listOrder',
  components: {

  },
  data() {
    return {
      tabShow:false,
      addForm: {
        totalSum: '',//总金额
        totalWeight: "",//总重量
      },
      param1:{name:""},//查询店铺参数
      shopList:[],//店铺data
      showIdK:'',//保存供应商的showid
      shopO:"",
      rise:companyTypeListAllName,//公司抬头
      taiT:"",
      param2:{shortName:""},//查寻代理商接口
      daiLi:[],//代理商data
      dai:'',
      columnsOne: [
                    {
                        title: '品名',
                        key: 'steelName',
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                    },
                    {
                        title: '牌号',
                        key: 'steelPaihao',
                    },
                     {
                        title: '产地/品牌',
                        key: 'steelPinpai',
                    
                    },
                    {
                        title: '交货地',
                        key: 'jiaoHuoDi',
                        
                    },
                    {
                        title: '仓库',
                        key: 'warehouse',
                       
                    },
                    {
                        title: '件数',
                        key: 'jianShu',
                       
                    },
                    {
                        title: '总重',
                        key: 'weightAll',
                       
                        
                    },
                    {
                        title: '挂牌价格',
                        key: 'money',
                       
                    },
                    {
                        title: '底价',
                        key: 'dijia',
                       
                      
                    },
                      {
                        title: '总价',
                        key: 'moneyzong',
                       
                      
                    },
                    {
                        title: '抵价总价',
                        key: 'dijiazong',
                      
                      
                    },
                    {
                        title: '捆包号',
                        key: 'kunBaoHao',
                        
                    },
                    {
                      key:'steelNote',
                      title:'备注',
                     
                    },
                     {
                      key:'operate',
                      title:'操作',
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
                                this.remove(params.index,params.row)
                              }
                            }
                          },'删除')
                        ])

                      }},
                    ],
      dataOne:[],
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
      dataTwo:[],//提交后台的数据
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
       //查询店铺
       getShop(param){
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
            this.bankJgId='1'
            this.customerId='1'
            this.customerOrgId='1'
            this.customerName=e.label;
            this.customerOrgName=e.label;
            }else if(e.value=='2'){
            this.bankJgId='2';
            this.customerId='2'
            this.customerOrgId='2'
            this.customerName=e.label;
            this.customerOrgName=e.label;
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
       },
       //导入excel的信息
       handleFormatError(file){
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传.xls,.xlsx文件。'
                })
        },
       handleSuccess1(res,file){
                if(res.code === '100'){
                  console.log('导入数据成功')
                  this.tabShow=true;
                  this.dataOne=res.data //导入excel 进行表格赋值
                  this.dataTwo=res.data
                  // this.dataTwo.map((item)=>{
                  //      console.log(item.jianShu) //TODO:
                  //       this.param14.agentId            = this.agentId
                  //       this.param14.agentShortName     = this.agentShortName
                  //       this.param14.shopId             = this.shopId
                  //       this.param14.shopName           = this.shopName
                  //       this.param14.shopOrgName        = this.shopOrgName;
                  //       this.param14.shopUserId         = this.shopUserId;
                  //       this.param14.customerId         = this.customerId
                  //       this.param14.customerOrgId      = this.customerOrgId
                  //       this.param14.customerName       = this.customerName;
                  //       this.param14.customerOrgName    = this.customerOrgName;
                  //       this.param14.agentName          = item.adminName
                  //       this.param14.bankJgId           = this.bankJgId
                  //       this.param14.businessType       = this.businessType
                  //       this.param14.buyType            = '1'
                  //       this.param14.createEname        = item.createEname
                  //       this.param14.cusMoney           = item.money
                  //       this.param14.customerPhone      = ''
                  //       this.param14.dijia              = item.dijia
                  //       this.param14.guapaijia          = item.money
                  //       this.param14.invoiceApplyMoney  = "0"
                  //       this.param14.invoiceApplyWeight = "0"
                  //       this.param14.jianshu            = item.jianShu
                  //       this.param14.jiaohuodi          = item.jiaoHuoDi
                  //       this.param14.jizhongType        = item.jizhongType
                  //       this.param14.kunbaohao          = item.kunBaoHao
                  //       this.param14.merMoney           = "81122.30000000"
                  //       this.param14.ordersType         = item.ordersType
                  //       this.param14.payType            = item.payType
                  //       this.param14.shopSteelId        = "f3a9af79-fa27-4647-9b5a-b7096c9064aa"  //TODO:
                  //       this.param14.shopUserId         = this.shopUserId
                  //       this.param14.steelGuige         = item.steelGuige
                  //       this.param14.steelName          = item.steelName
                  //       this.param14.steelPaihao        = item.steelPaihao
                  //       this.param14.steelPinpai        = item.steelPinpai
                  //       this.param14.steelWorks         = item.warehouse
                  //       this.param14.userId             = this.userId
                  //       this.param14.walletId           = ""
                  //       this.param14.weight             = item.weightAll
                  //       this.param14.zongzhonglia       = item.weightAll
                  //       this.dataThree.push(this.param14)
                  // })
                  console.log('我是push的值')
                  console.log(this.dataThree)
                  console.log('导入数据的值')
                  console.log(res)
                  this.dataOne.map((item)=>{
                      item.dijia     = this.$global.accPrecision(item.dijia,2)
                      item.moneyzong = this.$global.accPrecision(item.moneyzong,2)
                      item.dijiazong = this.$global.accPrecision(item.dijiazong,2)
                      item.money     = this.$global.accPrecision(item.money,2)
                      item.weightAll = this.$global.accPrecision(item.weightAll,2)
                  })
                  this.dialoLead = false
                  this.$Message.success("数据导入成功！")
                   // this._getBookList()
                  //this.$refs.upload.clearFiles()
                }
        },
       handleError(error,file){
            this.$Message.error("数据导入失败！")
       },
       //table表格删除
       remove(index,row){
         console.log(row.shopSteelId);
           this.dataOne.splice(index,1)
          //  this.dataTwo.splice(index,1)

           for(var i in this.dataTwo){
             if(this.dataTwo[i].shopSteelId == row.shopSteelId){
               this.dataTwo.splice(i,1)
             }
           }

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
       //添加订单提交
       reloadData(){
         this.dataThree = [];
         this.dataTwo.map((item)=>{
                        this.param14.agentId            = this.agentId
                        this.param14.agentShortName     = this.agentShortName
                        this.param14.shopId             = this.shopId
                        this.param14.shopName           = this.shopName
                        this.param14.shopOrgName        = this.shopOrgName;
                        this.param14.shopUserId         = this.shopUserId;
                        this.param14.customerId         = this.customerId
                        this.param14.customerOrgId      = this.customerOrgId
                        this.param14.customerName       = this.customerName;
                        this.param14.customerOrgName    = this.customerOrgName;
                        this.param14.agentName          = item.adminName
                        this.param14.bankJgId           = this.bankJgId
                        this.param14.businessType       = this.businessType
                        this.param14.buyType            = '1'
                        this.param14.createEname        = item.createEname
                        this.param14.cusMoney           = item.money
                        this.param14.customerPhone      = ''
                        this.param14.dijia              = item.dijia
                        this.param14.guapaijia          = item.money
                        this.param14.invoiceApplyMoney  = "0"
                        this.param14.invoiceApplyWeight = "0"
                        this.param14.jianshu            = item.jianShu
                        this.param14.jiaohuodi          = item.jiaoHuoDi
                        this.param14.jizhongType        = item.jizhongType
                        this.param14.kunbaohao          = item.kunBaoHao
                        this.param14.merMoney           = "81122.30000000"
                        this.param14.ordersType         = item.ordersType
                        this.param14.payType            = item.payType
                        this.param14.shopSteelId        = "f3a9af79-fa27-4647-9b5a-b7096c9064aa"  //TODO:
                        this.param14.shopUserId         = this.shopUserId
                        this.param14.steelGuige         = item.steelGuige
                        this.param14.steelName          = item.steelName
                        this.param14.steelPaihao        = item.steelPaihao
                        this.param14.steelPinpai        = item.steelPinpai
                        this.param14.steelWorks         = item.warehouse
                        this.param14.userId             = this.userId
                        this.param14.walletId           = ""
                        this.param14.weight             = item.weightAll
                        this.param14.zongzhonglia       = item.weightAll
                        this.dataThree.push(this.param14)
                  })
       },
       getAdd(){ //TODO:
       this.reloadData();
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
         param.merMoneyAll         = "0",                        //卖家总金额 TODO:
         param.moneyAll            = "0",                        //买家总金额
         
         param.orderType           = "1",                        //订单类型,写1
         param.payType             = "1",                        //写死
         param.pid                 = "0",                        //写死
         //店铺信息
         param.shopId              = this.shopId,                //供应商店铺id
         param.shopName            = this.shopName,              //供应商店铺名称
         param.shopOrgId           = this.shopOrgId,             //供应商店铺公司id
         param.shopOrgName         = this.shopOrgName,           //供应商店铺公司名称
         param.shopUserId          = this.shopUserId,            //供应商店铺所属管理员id
         
         param.staus               = "1",                        //状态 写1
         param.userId              = this.userId,                // 管理员id，登录人员的id
         param.zhouqijiesuanStatus = "0",                        //写死0
         param.zongjianshu         = this.addForm.totalSum,      //总件数
         param.zongzhongliang      = this.addForm.totalWeight,   //总重量
         param.pictures            = this.imgString              //上传的图片
          //明细信息
         param.orderInfoList       = this.dataThree
        console.log(param);
          return;
          getTi(param).then(res=>{
              if(res.code =="100"){
                console.log(res)
                 this.$Notice.success({
                            title:'添加成功',
                    })
            }  
          })
       }

  

   
  
 
  },
  //totalSum
   computed:{ //计算总金额和总重量
        total(){
            let total = 0;
            let tolWeight=0;
           
            this.dataTwo.map((item) => {
              total += Number(item.moneyzong)
              tolWeight += Number(item.weightAll)
            })
            this.addForm.totalSum=total
            this.addForm.totalWeight=tolWeight
            console.log("计算成功")
            console.log(tolWeight)
            return  this.addForm.totalSum, this.addForm.totalWeight
        }
    },
  mounted() {
    this.total;
    console.log(this.$global.baseUrl)
    this.getShop(this.param1);//查询店铺
    this.getDai(this.param2);//查询代理商
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
</style>

