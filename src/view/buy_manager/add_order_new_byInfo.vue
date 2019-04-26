<!--
 * @Description:新增先销代采单 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-16 10:31:18
 -->

<template>
  <div>
    <row>
      <Form :label-width="120" inline :model="addForm">

        <row>
          <h2 style='text-indent:20px;'>采购单-先销待采开单</h2><br/>
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
           <i-input   style="width:200px" v-model="addForm.totalSum" placeholder="请输入总金额"/>元
         </FormItem>

         <FormItem label="采购总重量:" prop="totalWeight">
           <i-input   style="width:200px" v-model="addForm.totalWeight" placeholder="请输入总重量"/>吨
         </FormItem>
          <p style="visibility: hidden;">{{total}}</p>

      </Form>
    </row>
    <!-- 合同明细 -->
    <row>
      <h3 style='text-indent:40px;margin-bottom:10px'>合同明细</h3>
         <Button type='primary' style='margin-left:30px;margin-bottom:15px;' @click="modal8 = true" >选择已采购资源</Button>
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

    <!-- 2 点击选择库存资源弹窗 -->
     <Modal
        title="销售单"
        v-model="modal8"
        width='1300'
        :footer-hide="true"
        :mask-closable="false">
        <row>
             <Form :label-width="100" inline  :model="addFormOne">

                 <row>
                    <FormItem label="采购单号:" prop="danhao">
                     <i-input style="width:200px"  v-model="addFormOne.danhao" placeholder="请输入采购单号" />
                   </FormItem>

                   <FormItem label="产地:" prop="chandi">
                     <i-input style="width:200px"  v-model="addFormOne.chandi" placeholder="请输入产地" />
                   </FormItem>

                   <FormItem label="交货地:" prop="jiaohuo">
                     <i-input style="width:200px"  v-model="addFormOne.jiaohuo" placeholder="请输入交货地" />
                   </FormItem>
                </row>
                
                <!-- 查询 -->
                <row style='margin-bottom:10px;'>
                    <Button type='primary'  style='margin-left:35px;' @click='getCha'>查询</Button>
                </row>
                <!-- 根据查询条件查出来的table -->
                <row style='margin-bottom:15px;'>
                   <Table  :columns="columnsSlip" :data="dataSlip"></Table> 
                </row>

                <!-- 分页 -->
                <row>
                    <Page style='text-align:right;' @on-change='getChangeFen' :total="totalM" show-total show-sizer /> 
                </row>

              </Form>

        </row>
    </Modal>

  </div>
</template>
<script>
import {findShop} from '@/api/data';//查询客户  //销售单列表查询
import {getAgent,getTi} from '@/api/cusData'//查询代理商
import {findOrdersInfoAll} from '@/api/data_8889';//查询客户  //销售单列表查询

import {companyTypeListAllName} from '@/libs/global_type'//公司抬头

export default {
  name: 'add_order_new_byInfo',
  components: {

  },
  data() {
    return {
      optionsList:[],
      cusOrgItem:{},
      totalM:0, //表格分页总天数
      pagesizea:1,//默认分页第一页
      loading:false,
      columnsSlip: [
                    {
                        title: '采购单号',
                        key: 'orderNo'
                    },
                    {
                        title: '采购单id',
                        key: 'ordersId'
                    },
                    {
                        title: '品名',
                        key: 'steelName'
                    },
                    {
                        title: '规格',
                        key: 'steelGuige'
                    },
                    {
                        title: '牌号',
                        key: 'steelPaihao'
                    },
                    {
                        title: '产地/品牌',
                        key: 'steelPinpai'
                    },
                    {
                        title: '交货地',
                        key: 'jiaohuodi'
                    },
                    {
                        title: '仓库',
                        key: 'steelWorks'
                    },
                    {
                        title: '计重方式',
                        key: 'jizhongType'
                    },
                    {
                        title: '件数',
                        key: 'jianshu'
                    },
                    {
                        title: '总重',
                        key: 'zongzhongliang',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.zongzhongliang,2))
                        }
                    },
                    {
                        title: '挂牌价格',
                        key: 'guapaijia',
                        width:'150',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.guapaijia,2))
                        }
                    },
                   
                    {
                        title: '总价',
                        key: 'moneyzong'
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao'
                    },
                    {
                        title: '备注',
                        key: 'steelNote'
                    },
                    {
                        title:'操作',
                        key:'operate',
                        render:(h,params)=>{
                        return h('div',[
                          h('Button',{
                            props: {
                            type: 'primary',
                            size: 'small',
                            disabled:params.row.showa
                            },
                             attrs: {
                                 
                                },
                            style: {
                              marginRight: '5px'
                            },
                            on: {
                              click: () => {
                                params.row.showa=true
                                this.tianAdd(params.index,params.row)
                              }
                            }
                          },'添加')
                        ])
                      }
                    }
                ],
      dataSlip: [],
      addFormOne:{ //添加新的采购单
        danhao:"",
        chandi:"",
        jiaohuo:"",
      },
      modal8:false,//添加资源弹窗
      tabShow:false,
      addForm: {
        totalSum: '',//总金额
        totalDijia:'',//底价总金额
        totalWeight: "",//总重量
        totalNum:'',//总件数
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
                        key: 'jiaohuodi',
                        
                    },
                    {
                        title: '仓库',
                        key: 'steelWorks',
                       
                    },
                    {
                        title: '计重方式',
                        key: 'jizhongType',
                       
                    },
                    {
                        title: '件数',
                        key: 'jianshu',
                        render:(h,params)=>{
                            return h('div',[
                                 h('Input',{
                                    props:{
                                        type:'text',
                                        value:params.row.jianshu
                                    },
                                    style:{
                                      
                                   },
                                   on:{
                                  'on-blur':(event)=>{
                                    console.log(event.target.value)
                                    this.dataOne[params.index].jianshu=event.target.value
                                    this.dataOne=this.dataOne
                                    
                              }
                            }
                        },)
                            ])
                        }
                       
                    },
                    
                    {
                        title: '总重',
                        width:'100',
                        key: 'zongzhongliang',
                        render:(h,params)=>{
                            return h('div',[
                                 h('Input',{
                                    props:{
                                        type:'text',
                                        value:this.$global.accPrecision(params.row.zongzhongliang,3)
                                    },
                                    style:{
                                      
                                   },
                                   on:{
                                  'on-blur':(event)=>{
                                    console.log(event.target.value)
                                    this.dataOne[params.index].zongzhongliang=event.target.value
                                    this.dataOne=this.dataOne
                              }
                            }
                        },)
                            ])
                        }   
                    },
                    {
                        title: '销售价格',
                        key: 'guapaijia',
                        width:'120',
                        render:(h,params)=>{
                            return h('div',[
                                 h('Input',{
                                    props:{
                                        type:'text',
                                        value:this.$global.accPrecision(params.row.guapaijia,2)
                                    },
                                    style:{
                                      
                                   },
                                   on:{
                                  'on-blur':(event)=>{
                                    console.log(event.target.value)
                                    this.dataOne[params.index].guapaijia=event.target.value
                                    this.dataOne=this.dataOne
                              }
                            }
                        },)
                            ])
                        } 
                       
                    },
                  
                    {
                        title: '总价',
                        key: 'moneyAll',
                        width:'120',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.moneyAll,2))
                        }
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        
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
                  this.bankJgId        = '1'
                  this.customerId      = '1'
                  this.customerOrgId   = '1'
                  this.customerName    = e.label;
                  this.customerOrgName = e.label;

            }else if(e.value=='2'){
                  this.bankJgId        = '2';
                  this.bankJgId        = '2';
                  this.customerId      = '2'
                  this.customerOrgId   = '2'
                  this.customerName    = e.label;
                  this.customerOrgName = e.label;
          }
       },
       //获取供应商选中的值
       getDian(item){
         console.log("获取到了数据")
          console.log(item)
         const stingR=eval('(' + item.value + ')')
        this.showIdK=stingR.id;
        this.shopId=stingR.id;
        this.shopName=stingR.name;
        this.shopOrgName=stingR.orgName;
        this.shopUserId=stingR.adminId;

        this.shopOrgId=stingR.orgId;              
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
           this.searchM();

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
           console.log(item.weightAll);
           let dic = {};
                        dic.ordersInfoId = item.id;
                        dic.agentId            = this.agentId
                        dic.agentName          = this.agentShortName
                        
                        dic.bankJgId           = this.bankJgId
                        dic.businessType       = '1'
                        dic.buyType            = '1'

                        dic.createEname        = this.$global.adminInfo.ename
                        dic.createCname        = this.$global.adminInfo.cname

                        dic.cusMoney           = item.moneyAll//买家总价格
                        //买家信息
                        dic.customerId         = this.customerId
                        dic.customerName       = this.customerName;
                        dic.customerOrgId      = this.customerOrgId
                        dic.customerOrgName    = this.customerOrgName;
                        dic.customerPhone      = this.customerPhone

                        dic.dijia              = item.guapaijia
                        dic.guapaijia          = item.guapaijia

                        dic.invoiceApplyMoney  = "0"
                        dic.invoiceApplyWeight = "0"
                        
                        dic.jianshu            = item.jianshu
                        dic.xuniJianshu        = item.jianshu

                        dic.jiaohuodi          = item.jiaohuodi
                        dic.jizhongType        = item.jizhongType
                        dic.kunbaohao          = item.kunbaohao

                        dic.merMoney           = item.moneyAll//底价总额
                        dic.ordersType         = "1"
                        dic.payType            = '1'

                        dic.shopId             = this.shopId
                        dic.shopName           = this.shopName
                        dic.shopOrgId          = this.shopOrgId;
                        dic.shopOrgName        = this.shopOrgName;
                        dic.shopUserId         = this.shopUserId;

                        dic.shopSteelId        = item.shopSteelId; 

                        
                        dic.steelGuige         = item.steelGuige
                        dic.steelName          = item.steelName
                        dic.steelPaihao        = item.steelPaihao
                        dic.steelPinpai        = item.steelPinpai
                        dic.steelWorks         = item.steelWorks

                        dic.userId             = this.$global.adminInfo.id

                        dic.weight             = this.$global.accPrecision(this.$global.accDiv(item.zongzhongliang,item.jianshu),3) //单件重
                        dic.zongzhonglia       = item.zongzhongliang//总重量
                        //下面是新增的字段
                        dic.jiesuanMoney       = item.moneyAll
                        dic.jiesuanWeight      = item.zongzhongliang
                        this.dataThree.push(dic)
                  })
       },
       getAdd(){ 
       console.log(this.dataOne)
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
         param.merMoneyAll         = this.addForm.totalDijia,                        //卖家总金额 TODO:
         param.moneyAll            = this.addForm.totalSum,                        //买家总金额
         
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
         param.userId              = this.$global.adminInfo.id,                // 管理员id，登录人员的id
         param.zhouqijiesuanStatus = "0",                        //写死0
         param.zongjianshu         = this.addForm.totalNum,      //总件数
         param.zongzhongliang      = this.addForm.totalWeight,   //总重量
         param.pictures            = this.imgString              //上传的图片
    
          //明细信息
         param.orderInfoList       = this.dataThree
         console.log(param)
          getTi(param).then(res=>{//TODO:
              if(res.code =="100"){
                console.log(res)
                //  this.$Notice.success({
                //             title:'添加成功',
                //     })
                     this.$Message.success('添加成功');
                    // this.reload();
            }  
          })
       },
       //添加到销售单
       tianAdd(index,row){
           this.tabShow=true;
           this.dataOne.push(row)
           this.dataTwo=this.dataOne
             
           //this.dataSlip[index].showa=true;
           //this.dataSlip=this.dataSlip
           console.log(this.dataSlip[index])
       },
       //销售单列表
        searchM(){
        //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum     = this.pagesizea      //分页
         param.beginStatus = 1 ;
         param.endStatus   = 11 ;
         param.orderNo=this.addFormOne.danhao;//采购单号
         param.steelPinpai=this.addFormOne.chandi;//产地
         param.jiaohuodi=this.addFormOne.jiaohuo;//交货地
            console.log(param);
         findOrdersInfoAll(param).then(res=>{
            if(res.code =="100"){
                console.log(res)
                this.dataSlip=res.data.list;//table表格
                let showA=false;
                this.dataSlip.map((item)=>{
                      item.showa=showA
                  })
                this.totalM=res.data.total;//分页条数
          }  
         })  
       },
       //点击查询销售单
       getCha(){
           if(this.addFormOne.danhao==''||this.addFormOne.chandi==''|| this.addFormOne.jiaohuo){
               this.$Notice.warning({
                    title: '请输入查询条件',
                    desc:'',
                    duration: 2.5
                });

           }
           this.searchM();
       },
       //table分页
       getChangeFen(page){
           console.log(page)
           this.pagesizea =page;
           this.searchM();
       }

  

   
  
 
  },
  //totalSum
   computed:{ //计算总金额和总重量
        total(){
            let total      = 0;
            let tolWeight  = 0;
            let totJianshu = 0;
            let totalDijia = 0;
            let caiTol=0; //添加采购单的总价
           
            this.dataOne.map((item) => {
              //重新计算 moneyAll，必须先计算，否则后续计算总值错误
              caiTol=Number(item.zongzhongliang)*Number(item.guapaijia)
              item.moneyAll=caiTol

              total      += Number(item.moneyAll)
              console.log(item.moneyAll);
              totalDijia += Number(item.moneyAll);
              tolWeight  += Number(item.zongzhongliang)
              totJianshu += Number(item.jianshu)
              
            })
            this.addForm.totalSum    = total
            this.addForm.totalDijia  = totalDijia
            this.addForm.totalWeight = tolWeight
            this.addForm.totalNum    = totJianshu

            console.log("计算成功")

            return  this.addForm.totalSum, this.addForm.totalWeight
        }
    },
  mounted() {
    this.searchM();//查询接口table
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

