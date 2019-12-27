<!--
 * @Description: 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-16 10:31:18
 -->
<!--
 * @Description:新增库存销售单  
 * @Author: wb
 * @others: 
 * @Date: 2019-04-16 10:31:18
 -->

<template>
  <div>
    <row>
      <Form :label-width="120" inline :model="addForm">

        <row>
          <h2 style='text-indent:20px;'>库存销售开单</h2>
          <h3 style='text-indent:40px;'>基本信息</h3>

           <FormItem label="工程名称:" >
                 <Select size="small" v-model="addForm.engineering" filterable style="width:650px" placeholder="工程名称"  @on-change='getChange2'  :label-in-value='true'>
                  <Option v-for="(item,index) in engineerNameList" :value="JSON.stringify(item)" :label="item.cname" :key="index" >{{ item.cname }}</Option>
                </Select>
           <Button  size="small" style="margin-left:4px" shape="circle" icon="md-refresh" @click="getGongcheng"></Button>
          <Button size="small" style="margin-left:4px" shape="circle" icon="md-add" @click="addNew2"></Button>

         </FormItem>

          <FormItem  label="客户查询:">
            <Select size="small" v-model="shopO" 
            style="width:650px" 
            placeholder="请输入客户名称" 
             @on-change='getDian'  
             filterable
             :label-in-value='true'
             >
               <Option v-for="(item,index) in optionsList" :value="JSON.stringify(item)"  :key="item.orgid" >{{ item.cusorgName }}</Option>
      
            </Select>
          </FormItem>
         <br>
          <FormItem label="本公司抬头:">
            <Select size="small" v-model="taiT" style="width:150px" placeholder="请输入公司抬头" @on-change='getTai'  :label-in-value='true'>
              <Option v-for="(item,index) in rise" :value="item.value" :key='index'>{{item.label}}</Option>
            </Select>
          </FormItem>

          <!-- <FormItem label="查询代理商">
            <Select :label-in-value='true' v-model='dai' style="width:200px" placeholder="请选择代理商" @on-change='getChange'>
              <Option  v-for='(item,index) in daiLi' :value="item.id" :key='index'>{{item.shortName}}</Option>
            </Select>
          </FormItem> -->
          <FormItem label="到货时间">
            <DatePicker size="small" @on-change='getData' v-model="addForm.time" format="yyyy-MM-dd" type="date" placeholder="请选择日期" style="width:150px"></DatePicker>
          </FormItem>
        </row>

           <FormItem label="销售总金额:" prop="totalSum">
           <div   style="width:200px;color:red" v-model="addForm.totalSum" placeholder="请输入总金额">{{this.$global.isMoneyShow(addForm.totalSum)}}元</div>
         </FormItem>

         <FormItem label="销售总重量:" prop="totalWeight">
           <div   style="width:200px;color:red" v-model="addForm.totalWeight" placeholder="请输入总重量">{{addForm.totalWeight}}吨</div>
         </FormItem>
           <FormItem label="杂费总金额:" prop="totalOMoney">
           <div   style="width:200px;color:red" v-model="addForm.totalOMoney" placeholder="请输入杂费总金额">{{this.$global.isMoneyShow(addForm.totalOMoney)}}元</div>
         </FormItem>
          <FormItem label="总件数:" prop="totalNum">
           <div   style="width:200px;color:red" v-model="addForm.totalNum" placeholder="请输入总件数">{{addForm.totalNum}}件</div>
         </FormItem>
          <p style="visibility: hidden;">{{totalZongoing}}</p>
      </Form>
        
    </row>
    <!-- 合同明细 -->
    <row style="margin-top:8px">
      <h3 style='text-indent:40px;margin-bottom:10px'>合同明细</h3>
      <span style="color:red">注：网价备注中填写到货日期：例子：2019-07-25到货，;若没有后续录入实提时录入</span>
      <br>
         <Button size="small" type='primary' style='margin-left:8px;margin-bottom:15px;' @click="modal8 = true" >选择库存资源</Button>
              <!-- 新增excel上传表格 -->
         <Form :label-width="100" inline style='display:inline-block;width:120px;' id='gpm'>
            <FormItem style='margin-left:8px!important;margin-top:-13px;' >
                <Upload   action="" :before-upload="handleBeforeUpload1" accept=".xls, .xlsx">
                  <Button size="small"  style='' type='primary' icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile1">上传销售单价</Button>
                </Upload>
                
                <Row style=''> 
                  <div  class="ivu-upload-list-file" v-if="file !== null">
                    <Icon type="ios-stats"></Icon>
                    {{ file.name }}
                    <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove1()"></Icon>
                  </div>
                </Row>

                <Row>
                  <transition name="fade">
                    <Progress v-if="showProgress1" :percent="progressPercent" :stroke-width="2">
                      <div v-if="progressPercent == 100">
                        <Icon type="ios-checkmark-circle"></Icon>
                        <span>成功</span>
                      </div>
                    </Progress>
                  </transition>
                </Row>
            </FormItem>
         </Form>
           <Button size="small" type="info" @click="exportData(3)" style='margin-top:-10px;margin-left:8px!important'>下载excel模板</Button>
           <Button size="small" type="warning" @click="upsideDown" style='margin-top:-10px;margin-left:8px!important'>反向排列列表</Button>
           
           <br/>
            <RadioGroup style='margin-left:28px;'   v-model="phone" @on-change='getRadio'>
                <Radio label="1">
                    <span>根据网价计算浮动价格</span>
                </Radio>
                <Radio label="2">
                    <span>根据浮动价格计算网价</span>
                </Radio>
                 <Radio label="3">
                    <span>无</span>
                </Radio>

                <Radio label="4">
                    <span>计算销售单价</span>
                </Radio>
            </RadioGroup>
            <Input size="small" v-model="yijian" placeholder="请输入" @on-change='paiceName' style="width: 150px" />
            <Button size="small" type='primary' style='margin-left:8px; margin-right:10px;' @click='addAll'>一键添加——></Button>
            <Select size="small" v-model="chosePrice" style="width:150px" @on-change='getValue'>
                <Option v-for="(item,index) in priceChose" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
        <!-- TABLE表格 -->
       <row style='margin-top:8px;'> 
       
       <!-- 测试table -->
         <vxe-table size="mini" border 
         class="vxe-table-element" 
         :highlight-cell='false'  
         :data.sync="tableDataTwo"
         @edit-actived="currentChangeNew"
         :edit-config="{key: 'keyId', trigger: 'click', mode: 'row',} ">
                <vxe-table-column prop="keyId" label="#" min-width="30" fixed="left"></vxe-table-column>
                <vxe-table-column prop="steelType" label="类别" min-width="60" fixed="left"></vxe-table-column>
                <vxe-table-column prop="steelName" label="品名" width="60" fixed="left"></vxe-table-column>
                <vxe-table-column prop="steelGuige" label="规格" min-width="60" fixed="left"></vxe-table-column>
                <vxe-table-column prop="steelPaihao" label="牌号" min-width="60" fixed="left"></vxe-table-column>
                <vxe-table-column prop="steelPinpai" label="产地/品牌" min-width="60"></vxe-table-column>
                <vxe-table-column prop="jiaohuodi" label="交货地" min-width="60"></vxe-table-column>
                <vxe-table-column prop="steelWorks" label="仓库" min-width="60"></vxe-table-column>
                <vxe-table-column prop="jizhongType" label="计重方式" min-width="60"></vxe-table-column>

                <vxe-table-column prop="xuniJianshu" label="件数" min-width="60" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="zongzhongliang" :edit-render="{name:'ElInput',autoselect:true}"  :formatter="this.$global.vxeTableWeight" label="总重" min-width="60"></vxe-table-column>

                <vxe-table-column prop="weight" label="单件重"  :formatter="this.$global.vxeTableWeight" min-width="60"></vxe-table-column>
                <vxe-table-column prop="guapaijia" label="销售单价"  :formatter="this.$global.vxeTableMoney"  min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="moneyAll" label="销售总额" :formatter="this.$global.vxeTableMoney" min-width="100" ></vxe-table-column>
                <vxe-table-column prop="internetPrice" label="网价" min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="floatPrice" label="浮动价格" min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="internetPriceArea" label="网价所属区域" min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="internetPriceNote" label="网价备注" min-width="140" :edit-render="{name: 'ElInput',autoselect: true}" ></vxe-table-column>
                <vxe-table-column prop="kunbaohao" label="捆包号" min-width="100" :edit-render="{name: 'ElInput'}"></vxe-table-column>
      
                <vxe-table-column  fixed="right" label="操作"  min-width="100" align="center">
            
                    <template v-slot="{ row,rowIndex}">
                        <vxe-button type="text" @click='getDelete(row,rowIndex)'>删除</vxe-button>
                        <vxe-button type="text" @click='copyRow(row,rowIndex)'>复制库存</vxe-button>
                    </template>
               </vxe-table-column>
        </vxe-table>
      </row>
       <!-- 结束 -->
    </row>

    <!-- 上传图片 -->
    <row style='margin-bottom:20px;'>
        <b class="font_32">图片信息</b> 
        <!-- <Tag type="border" color="error">第一张为营业执照</Tag>
        <Tag type="border" color="error">第二张为开票资料</Tag>        -->
        <br>
        <div  class="demo-upload-list" v-for="(item,index) in uploadList" :key='index'>
            <template v-if="item.status === 'finished'">
                <img :src="item.url" v-if="item.url.indexOf('.pdf') ==-1" >
                <img src="https://jgys.oss-cn-shenzhen.aliyuncs.com/baseImg/pdf.jpg" v-else >
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
        :format="['jpg','jepg','png','pdf']" 
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
      <Button   type="primary" @click='getAdd' style='margin-right:15px;' :disabled="isDisable">提交</Button>
      <Button   type="primary">取消</Button> 
    </row>

    <!-- 2 点击选择库存资源弹窗 -->
     <Modal
        title="库存资源"
        v-model="modal8"
        width='1300'
        :footer-hide="true"
        :mask-closable="false">
        <row>
             <Form :label-width="80" inline  :model="addFormOne">

                 <row>
                   <FormItem label="采购单号:" >
                     <i-input style="width:120px"  v-model="addFormOne.buyOrderNo" placeholder="请输入采购单号" />
                   </FormItem>
                    <FormItem label="入库单号:" >
                     <i-input style="width:120px"  v-model="addFormOne.inStockNoLike" placeholder="请输入入库单号" />
                   </FormItem>

                   <FormItem label="捆包号:" >
                     <i-input style="width:120px"  v-model="addFormOne.kunbaohao" placeholder="请输入捆包号" />
                   </FormItem>

                   <FormItem label="钢厂:" >
                     <i-input style="width:120px"  v-model="addFormOne.gangCang" placeholder="请输入钢厂" />
                   </FormItem>

                   <FormItem label="品名:" >
                     <i-input style="width:120px"  v-model="addFormOne.pinMing" placeholder="请输入品名" />
                   </FormItem>
                   <FormItem label="规格:" >
                     <i-input style="width:120px"  v-model="addFormOne.guiGe" placeholder="请输入规格" />
                   </FormItem>

                   <FormItem label="材质:" >
                     <i-input style="width:120px"  v-model="addFormOne.caiZhi" placeholder="请输入材质" />
                   </FormItem>

                   <FormItem label="入库时间">
                            <i-Col span="12">
                                <DatePicker type="daterange"  placeholder="选择日期" style="width: 200px" @on-change='geiRuTime'></DatePicker>
                            </i-Col>
                   </FormItem>

                   <FormItem label="管理员名称">
                      <Select clearable v-model="addFormOne.cname" @on-change='getSelectAdmin'  :label-in-value='true'  style="width:200px"  placeholder="请选择"   >
                        <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
                      </Select>
                   </FormItem>

                   <FormItem label="每页显示:">
                      <Select v-model="addFormOne.length"  style="width:200px"  placeholder="请选择"   >
                        <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="公司抬头:">
                      <Select v-model="addFormOne.bankJgId"  style="width:200px"  placeholder="请选择"   >
                        <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                </row>
                
                <!-- 查询 -->
                <row >
                    <Button type='primary'  style='margin-left:35px;margin-bottom:10px;' @click='getCha'>查询</Button>
                </row>
                <!-- 根据查询条件查出来的table -->
                <row >
                   <Table size="small"  :columns="columnsSlip" :data="dataSlip"></Table> 
                </row>

                <!-- 分页 -->
                <row>
                    <Page :page-size="addFormOne.length" style='text-align:right;'  @on-change='getChangeFen' :total="totalM" show-total  /> 
                </row>

              </Form>

        </row>
    </Modal>

  </div>
</template>
<script>
import {findOrgCusAcc,findInStock,updateInStock,xiangMu,
findOrderEngineering,getUserList} from '@/api/data';//查询客户  //销售单列表查询
import {getAgent} from '@/api/cusData'//查询代理商
import {addPrepaidOrdersSell} from '@/api/data_8889'//新增销售单

import {companyTypeListAllName,lengthList,belongCompanyList} from '@/libs/global_type'//公司抬头
import { EventEmitter } from 'events';
import { mapMutations } from 'vuex'
import Utils from '@/api/middle'
export default {
  name: 'add_sell_order',
  components: {

  },
  data() {
    return {
      engineerNameList:[],//工程名称数组
        priceVa:'',
        namePrice:'',//一键添加获取input的值
        priceChose: [
                    {
                        value: '1',
                        label: '浮动价格'
                    },
                    {
                        value: '2',
                        label: '网价'
                    },
                    {
                        value: '3',
                        label: '网价所属区域'
                    },            
                ],
                chosePrice: '',
        yijian:"",//一键赋值获取input的值
        phone:'',
        tableDataTwo: [
      ],
      engineeringOne:'',
     //todo
     belongCompanyListThis:belongCompanyList,
      uploadLoading: false, //上传进度条
      tableLoading: false,//表格显示进度
      showProgress1: false,//是否显示进度条
      showRemoveFile: false,//移除
      progressPercent: 0,//默认进度条为0
      file: null,//上传文件的名字
      tableData: [],//上传的表格数据
      tableTitle: [],//表格表头
      //========------
      isDisable:false,
      dataCompany:[],
      optionsList:[],
      totalM:0, //表格分页总天数
      pagesizea:1,//默认分页第一页
      loading:false,
      columnsSlip: [
                    {
                        title:'操作',
                        key:'operate',
                        width:'80',
                        fixed:'left',
                        align:"center",
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
                    },
                    {
                        title: 'ID1',
                        key: 'id',
                        align: 'center',
                        width:'60'
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'80',
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'80',
                    },
                    {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'80',
                    },
                    {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'80',
                    },
                     {
                        title: '剩余件数',
                        key: 'xuniJianshu',
                        align: 'center',
                        width:'80',
                    },
                    {
                        title: '单件重',
                        key: 'weight',
                        align: 'center',
                        width:'80',
                         render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.weight,3))
                        }
                    },
                     {
                        title: '入库总重量',
                        key: 'zongzhongliang',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.zongzhongliang,3))
                        }
                    },
                     {
                        title: '入库单价',
                        key: 'guapaijia',
                        align: 'center',
                        width:'100',
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
                        title: '入库总金额',
                        key: 'cusMoney',
                        align: 'center',
                        width:'100',
                        render:(h,params)=>{
                          return h('div',{
                            props:{
                            },
                            attrs:{
                              id:params.index
                            },
                          },this.$global.accPrecision(params.row.cusMoney,2))
                        }
                    },
                    {
                        title: '管理员名称',
                        key: 'cname',
                        align: 'center',
                        width:'80'
                    },
                    {
                        title: '入库时间',
                        key: 'createTime',
                        align: 'center',
                        width:'100'
                    },
                     {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '入库采购单号',
                        key: 'orderNo',
                        align: 'center',
                        width:'180',
                    },
                    {
                        title: '入库采购单id',
                        key: 'ordersId',
                        align: 'center',
                        width:'60',
                    },
                     {
                        title: '入库单号',
                        key: 'inStockNo',
                        align: 'center',
                        width:'180'
                    },
                    
                ],
      dataSlip: [],
      keyId:0,//用来列表点击锁定当前行的id
      lengthListThis:lengthList,
      addFormOne:{ //添加新的采购单
        danhao:"",
        chandi:"",
        jiaohuo:"",
        inStockNoLike:'',
        kunbaohao:"",
        gangCang:"",//钢厂
        pinMing:"",//品名
        guiGe:"",//规格
        caiZhi:'',//材质
        cname:'',//管理员的名称
        adminCname:"",//管理员名称用于搜索
        length:10,
        buyOrderNo:'',//采购单订单号

      },
      adminList:[],//管理员所属数组
      modal8:false,//添加资源弹窗
      tabShow:false,
      addForm: {
        totalSum: '',//总金额
        totalDijia:'',//底价总金额
        totalWeight: "",//总重量
        totalNum:'',//总件数
        totalOMoney:'',//总杂费金额
        engineering:'',//工程名称
        time:new Date(),//下单时间
        bankJgId:''
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
      param14:{},//提交后台数据进行过滤
      dataThree:[],//数组
      updateImgUrl: this.$global.updateImgUrl, //上传图片
      visible: false,
      defaultList: [],
      uploadList: [],
      isAllowSubmit:true,//是否可以提交
      imgString:"",//图片的参数
      timeRuBeStart:'',//入库开始时间
      timeRuBeStop:'',//入库结束时间
      radioValue:"",//选中radio的值
      ciickItem:''
    }
  }, 
  methods: {
     getChange2(item){
       
         const stingR=eval('(' + item.value+ ')')
         this.taiT=stingR.bankJgId
         console.log(stingR)
         this.engineeringOne=stingR.cname
         console.log(stingR.ename)

         let dic = {};
         dic.value = stingR.bankJgId;
         dic.label = stingR.bankJgId=="1"?"福建省亿钢电子商务有限公司":"上海市闽航电子商务有限公司"
         this.getTai(dic);
         
      
      // this.addForm.engineering = stingR.cname;
      //选择工程后给客户查询里面赋值
      // this.shopO = dic.companyId
          console.log("xxx")
      for(var i = 0;i<this.optionsList.length;i++){
          let item = this.optionsList[i];
          if(item.cusorgId == stingR.companyId){
          console.log("相等")
          console.log(item);
           this.shopO = JSON.stringify(item);
            //循环找到对应公司在公司数组中的全部数据
            let adic = {};
            adic.label = item.cusorgName;
            adic.value = JSON.stringify(item)
            this.getDian(adic);
            return false;
          
        }else{
          console.log("不相等")

        }
      }
    
     
    },
     //新增项目
       addNew2(){
          sessionStorage.setItem('statusOne','')
           sessionStorage.setItem('statusOne','2')
                 const route = {
                       name: 'xiangDetail',
                  }
                  this.$router.push(route)

       },
    copyRow(row,index){
      let newRow = this.$global.copyDeep(row);
      newRow.keyId = this.keyId;
      this.keyId++;
      this.tableDataTwo.push(newRow);
    },
    currentChangeNew({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event){
        this.ciickItem =column.label; 
      },
    //开始
    getData(label){
           this.tableDataTwo.map((item)=>{
            //  item.internetPriceArea=label+'到货'
            //  item.kunbaohao = label+'到货'
             item.internetPriceNote = label+'到货'
              item.kunbaohao = item.kunbaohao;
       })
    },
    //结束
    getSelectAdmin(item){
      console.log(item);
      if(item){//调用clearAble方法时，item是undefined
        this.addFormOne.adminCname = item.label;
      }else{
        this.addFormOne.adminCname = ''
      }
    },
     getAdminList(){//获取公司名称
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
          getUserList(param).then(res=>{
            if(res.code =="100"){
             this.adminList=res.data.list
          }  
         })
       },
    //获取浮动价格
    getValue(item){
     this.priceVa=item

    },
    //获取一键添加input的值
    paiceName(e){
      this.namePrice=e.target.value;

    },
     //一键添加
     addAll(){
       if(this.priceVa==''){
          this.$Notice.error({
                    title: '请选择添加类型',
                }); 
       }
       this.tableDataTwo.map((item)=>{
          if(this.radioValue==1){
             item.internetPrice=this.namePrice

          }else if(this.radioValue==2){
             item.floatPrice=this.namePrice
          } else if(this.radioValue==3||this.radioValue==''){
               if(this.priceVa==1){//浮动价
                    item.floatPrice=this.namePrice
               }
               else if(this.priceVa==2){//网价
                   
                     item.internetPrice=this.namePrice
               }else  if(this.priceVa==3){//所属区域
                     item.internetPriceArea=this.namePrice
               }
               else if(this.priceVa==''){
               }


          }
        
       })
     },
      //获取radio的值
      getRadio(item){//根据radio的值去计算网价和浮动价
          this.radioValue=item
          if(item==1){//根据网价计算浮动价
          }else if(item==2){//根据浮动价计算网价
          }else if(item==3){//手动收入
          }
      },
      //删除
      getDelete(item,rowIndex){
       
        this.tableDataTwo.splice(rowIndex,1)

      },
      upsideDown(){//颠倒列表数组
          this.tableDataTwo = this.tableDataTwo.reverse();
      },
       //导出excel
      exportData (type) {
        window.location.href ="https://jgys.oss-cn-shenzhen.aliyuncs.com/webFiles/%E9%94%80%E5%94%AE%E5%8D%95%E4%BB%B7%E6%A0%BC%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF.xlsx"
      },
       //点击上传文件
      initUpload() {
        this.file = null
        this.showProgress1 = false
    
        this.loadingProgress = 0
        this.tableData = []
        this.tableTitle = []
      },
      handleUploadFile1() {
        this.initUpload()
      },
      //上传excel文件的检验
      handleBeforeUpload1(file) {
        const fileExt = file.name.split('.').pop().toLocaleLowerCase()
        if (fileExt === 'xlsx' || fileExt === 'xls') {
          this.readFile(file)
          this.file = file
        } else {
          this.$Notice.warning({
            title: '文件类型错误',
            desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
          })
        }
        return false
      },
      //删除删除上传文件
      handleRemove1() {
        this.initUpload()
        this.tableDataTwo.map((item)=>{
           item.guapaijia='';
           item.internetPrice='';
           item.floatPrice='';
           item.internetPriceArea='';
           item.internetPriceNote='';

        })
        this.$Message.info('上传的文件已删除！')
      },
            // 读取文件
      readFile(file) {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadstart = e => {
            this.uploadLoading = true
            this.tableLoading = true
            this.showProgress1 = true
        }
        reader.onprogress = e => {//进度条
            this.progressPercent = Math.round(e.loaded / e.total * 100)
        }
      reader.onerror = e => {//文件报错
        this.$Message.error('文件读取出错')
      }
      reader.onload = e => {//excel文件读取成功
        this.$Message.info('文件读取成功')
        this.uploadLoading = false
        this.tableLoading = false
        this.showRemoveFile = true
        this.showNew=true;//读取数据成功后新增一行按钮显示
     
        const data = e.target.result
        import('@/libs/excel').then(excel => {
          const { header, results } = excel.read(data, 'array')
          const tableTitle = header.map(item => { return { title: item, key: item } })
          let addData=[]; //excel 表格上传的数据进行处理

          results.map((item)=>{
            let dic={};
            dic.guapaijia=item.销售单价;
            dic.internetPrice=item.网价;
            dic.floatPrice=item.浮动价格;
            dic.internetPriceArea=item.网价所属区域;
            dic.internetPriceNote=item.网价备注;
            addData.push(dic)
          })
         
         this.tableData=addData
          for(var i=0;i<this.tableDataTwo.length;i++){
            for(var l=0;l<this.tableData.length;l++){
                this.tableDataTwo[i].guapaijia=this.tableData[i].guapaijia
                this.tableDataTwo[i].internetPrice=this.tableData[i].internetPrice
                this.tableDataTwo[i].floatPrice=this.tableData[i].floatPrice
                this.tableDataTwo[i].internetPriceArea=this.tableData[i].internetPriceArea
                this.tableDataTwo[i].internetPriceNote=this.tableData[i].internetPriceNote
            }

          }
        })
        }
      },
    
    // 结束
     ...mapMutations([
        'closeTag'
      ]),
         //查询工程
      getGongcheng(){
        let p  ={};
        p.pageSize ="99999"
        p.staus = 1;
        p.type = '2'
        this.engineerNameList = [];
        xiangMu(p).then(res=>{
          if(res.code =="100"){
            this.engineerNameList  =res.data.list;
              // res.data.list.map(item =>{
              //   let dic = {};
              //   dic.label =item.cname;
              //   dic.value =item.id;
              //   this.engineerNameList.push(dic);
              // })
          }
        })
      },
     //入库时间查询
     geiRuTime(item){
         this.timeRuBeStart=item[0];
         this.timeRuBeStop=item[1];
     },
     
       //查询公司
       getOrg(name){
         let p  ={}
         p.orgName = name;
         p.pageSize = '99999';
         this.loading = true
         this.optionsList = [];

          findOrgCusAcc(p).then(res=>{
            this.loading = false;

            if(res.code =="100"){
              res.data.list.map(item=>{
                //格式化一下数据，只取有用的
                let dic = {};
                dic.cusid      = item.cusid
                dic.cus        = item.cus
                dic.cusorgId   = item.cusorgId
                dic.cusorgName = item.cusorgName
                dic.cusphone   = item.cusphone
                this.optionsList.push(dic);
              })
            }  
         })
       },
       //查询代理商 getAgent
       getDai(param){
         param.pageSize = '99999';

          getAgent(param).then(res=>{
            if(res.code =="100"){
             this.daiLi=res.data.list;
          }  
         })
       },
       //获取代理商的值
       getChange(item){
         this.agentId = item.value;
         this.agentShortName = item.label;

       },
       //公司抬头的值
       getTai(e){
          if(e.value=='1'){
                  this.bankJgId    = '1'
                  this.shopId      = this.$global.ourFJOrgItem.shopId;
                  this.shopName    = this.$global.ourFJOrgItem.shopName
                  this.shopOrgId   = this.$global.ourFJOrgItem.orgId;
                  this.shopOrgName = this.$global.ourFJOrgItem.orgName;
                  this.shopUserId  = this.$global.ourFJOrgItem.shopUserId;

            }else if(e.value=='2'){
                  this.bankJgId='2';
                  this.shopId      = this.$global.ourSHOrgItem.shopId;
                  this.shopName    = this.$global.ourSHOrgItem.shopName
                  this.shopOrgId   = this.$global.ourSHOrgItem.orgId;
                  this.shopOrgName = this.$global.ourSHOrgItem.orgName;
                  this.shopUserId  = this.$global.ourSHOrgItem.shopUserId;
          }
       },
       //获取供应商选中的值
       getDian(item){
        const d=eval('(' + item.value + ')')
        this.customerId         = d.cusid           
        this.customerName       = d.cus              
        this.customerOrgId      = d.cusorgId                
        this.customerOrgName    = d.cusorgName                  
        this.customerPhone      = d.cusphone
       },
       //上传图片
       handleView(name) {
                //判断如果是pdf 则打开新的窗口
                if(name.indexOf('.pdf') == -1){
                  this.imgName = name;
                  this.visible = true;
                }else{
                  window.open(this.$global.ossUrl+name);

                }
            },
            handleRemove(file) {
                this.uploadList.splice(this.uploadList.indexOf(file), 1);
            },
            handleSuccess(res, file) {
                this.$Message.success('上传成功');
                file.name = res.msg;
                file.url = this.$global.ossUrl + res.msg;
                this.uploadList.push(file);
                const reg=/,$/gi;//此处是正则

                
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
             
               

                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最大支持上传5张图片'
                    });
                }else{
                }
                return check;
            },
       //添加订单提交
       reloadData(){
         this.dataThree = [];
         this.tableDataTwo.map((item)=>{
          
           let dic = {};
           //判断
           if(item.guapaijia == 0 || item.guapaijia ==""){
              this.isAllowSubmit = false;
              return ; 
           }
                        dic.inStockId           =item.id;
                        dic.agentId            = this.agentId
                        dic.agentName          = this.agentShortName
                        
                        dic.bankJgId           = this.bankJgId
                        dic.businessType       = '1'
                        dic.buyType            = '1'

                        dic.createEname        = this.$global.adminInfo.ename
                        dic.createCname        = this.$global.adminInfo.cname

                        dic.cusMoney           = item.moneyAll//买家总价格
                        dic.merMoney           = item.moneyAll//底价总额

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
                        
                        dic.jianshu            = item.xuniJianshu
                        dic.xuniJianshu        = item.xuniJianshu

                        dic.jiaohuodi          = item.jiaohuodi
                        dic.jizhongType        = item.jizhongType
                        dic.kunbaohao          = item.kunbaohao

                        dic.ordersType         = "1"
                        dic.payType            = '1'

                        dic.shopId             = this.shopId
                        dic.shopName           = this.shopName
                        dic.shopOrgId          = this.shopOrgId;
                        dic.shopOrgName        = this.shopOrgName;
                        dic.shopUserId         = this.shopUserId;

                        dic.shopSteelId        = ''; 

                        
                        dic.steelGuige         = item.steelGuige
                        dic.steelName          = item.steelName
                        dic.steelPaihao        = item.steelPaihao
                        dic.steelPinpai        = item.steelPinpai
                        dic.steelWorks         = item.steelWorks
                        dic.steelType          = item.steelType//类别

                        dic.userId             = this.$global.adminInfo.id

                        dic.weight             = item.weight //单件重
                        dic.zongzhonglia       = item.zongzhongliang//总重量
                        //下面是新增的字段
                        // dic.jiesuanMoney       = item.moneyAll
                        // dic.jiesuanWeight      = item.zongzhongliang
                        // dic.jiesuanDanjia      = item.guapaijia
                        // dic.jiesuanJianshu      = item.xuniJianshu
                        dic.jiesuanMoney       = 0;
                        dic.jiesuanWeight      = 0;
                        dic.jiesuanDanjia      = 0;
                        dic.jiesuanJianshu      = 0; 
                        //2019年5月5日13:40:08 新增 a:网价，b:浮动价,c:区域,d:网价备注;
                        dic.internetMoney     = item.internetPrice
                        dic.floatMoney        = item.floatPrice
                        dic.region            = item.internetPriceArea
                        dic.internetMoneyNote = item.internetPriceNote

                        //2019年7月9日15:56:29 新增
                        dic.buyRealDanjia = item.dijia;//采购结算单价
                        dic.buyRealWeight = item.zongzhongliang;//选择的采购重量
                        dic.buyRealMoney  = this.$global.accMul(item.dijia,item.zongzhongliang) //采购结算金额

                        this.dataThree.push(dic)
                  })
       },
       getAdd(){
         this.uploadList.map((item)=>{
                
                     this.imgString += item.url+','    
                }) 
       this.isAllowSubmit = true;
       this.reloadData();
              
        if(this.isAllowSubmit == false){
            this.$Notice.error({
                title:'单价不可为空'
              })
          return;
        }
         if(this.bankJgId == ""){
            this.$Notice.error({
                title:'请选择本公司抬头'
              })
          return;
        }
        if(this.customerOrgId ==""){
          this.$Notice.error({
            title:'请选择客户'
          })
          return;
        }
        
        this.updateInstock();//先修改库存，库存会判断是否可以修改，如果修改成功后，则可以继续添加订单
          
       },
        updateInstock(){//提交成功后修改库存件数
                let p     = {};
                let plist = [];
     this.tableDataTwo.map(item=>{
          let dic             = {};
              dic.id          = item.id
              dic.xuniJianshu = item.xuniJianshu
          plist.push(dic); 
      })
      p.pageOrderInfoList = plist
        updateInStock(p).then(res =>{
           if(res.code =='100'){
             this.isDisable=true;
                this.step1AddOrder();

               this.$Notice.success({
                   title:'修改库存成功'
               })
           }else{
               this.$Notice.error({
                   title:'修改库存失败,库存不足，不可添加订单'
               })
           }
        })
       },
       step1AddOrder(){//添加订单
               const param                = {};
               param.agentId        = this.agentId;
               param.agentShortName = this.agentShortName,            //代理商名称
               param.bankJgId       = this.bankJgId,                  //本公司抬头类型，1上海闽航，2福建亿钢
               param.businessType   = '1',                            //写死
               param.buyType        = "1",                            //写死
               param.createCname    = this.$global.adminInfo.cname,   //登录人的名称
               param.createEname    = this.$global.adminInfo.ename,   //登录人的英文名称
               param.payMoneyStatus = "0";//未付款，默认
         //cus的信息根据 bankJgId的类型来区分填写
         param.customerId          = this.customerId,            //bankJgId = 1,写死1，bankJgId = 2,写死2
         param.customerName        = this.customerName,          //bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
         param.customerOrgId       = this.customerOrgId,         //bankJgId = 1,写死"1"bankJgId = 2,写死2
         param.customerOrgName     = this.customerOrgName,       //bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
         param.customerPhone       = "",                         //传空
         //买家信息结束
         param.merMoneyAll         = this.addForm.totalDijia,                        //卖家总金额 :
         param.moneyAll            = this.addForm.totalSum,                        //买家总金额
         
         param.orderType           = "1",                        //订单类型,写1
          param.oasrOrderType = "2"//订单类型 1=采购单 2=销售单,插入到采购单列表中的信息
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
         //2019年5月5日15:35:06 
         param.gongcheng = this.engineeringOne;//工程名称
          //2019年7月9日11:16:41 下单日期
        let dates = this.$global.formatDate(this.addForm.time,"yyyy-MM-dd");//选择的日期
        let times = this.$global.formatDate(new Date(),"hh:mm:ss");
        let allTimes = dates +' '+times;
        param.createTimes = allTimes;//订单下单时间
        param.createTimeFormat = this.$global.formatDate(this.addForm.time,"yyMMdd")//订单号使用的时间
          addPrepaidOrdersSell(param).then(res=>{
              if(res.code =="100"){
                 this.$Notice.success({
                            title:'添加成功',
                             duration:2,
                            onClose:res =>{
                                        this.closeTag({
                                                  name:'add_sell_order'
                                      })
                                  setTimeout(() => {
                                      const route = { 
                                        name: 'sell_order_list',
                                        query: ''
                                    }
                                    this.$router.push(route)
                                Utils.$emit('sell_order_list','reload');
                                }, 100);
                          }
                    })
                    
            }  
          })
       },
      
       //添加到销售单
       tianAdd(index,row){
          let newRow = this.$global.copyDeep(row)
           //默认从库存中选择资源后，销售单价默认应为0或空
           newRow.guapaijia = 0;
           newRow.moneyAll = 0;
           newRow.keyId = this.keyId;
           this.keyId++;
           //重新计算 总重量，用剩余件数 * 单件重
           if(Number(newRow.xuniJianshu) != Number(newRow.jianshu)){
            newRow.zongzhongliang = this.$global.accMul(newRow.xuniJianshu,newRow.weight)
           }
           this.tableDataTwo.push(newRow)

           this.tableDataTwo.map((item)=>{
             //todo
             item.internetPriceNote=this.$global.formatDate(this.addForm.time,"yyyy-MM-dd")+'到货'
            //  item.internetPriceArea=this.$global.formatDate(this.addForm.time,"yyyy-MM-dd")+'到货'
            //  item.kunbaohao=this.$global.formatDate(this.addForm.time,"yyyy-MM-dd")+'到货'
           })
          //  this.dataOne.push(row)
       },
       //销售单列表
        searchM(){
        //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum       = this.pagesizea                  //分页
         param.inStockNoLike = this.addFormOne.inStockNoLike;  //入库号
         param.kunbaohao     = this.addFormOne.kunbaohao;      //捆包号
         param.steelPinpai   = this.addFormOne.gangCang;       //钢厂
         param.steelName     = this.addFormOne.pinMing;        //品名
         param.steelGuige    = this.addFormOne.guiGe;          //规格
         param.steelPaihao   = this.addFormOne.caiZhi;         //材质
         param.cname         = this.addFormOne.adminCname;     //管理员名称
         if(this.timeRuBeStart!=''){
            param.beginTime     = this.timeRuBeStart+' '+'00:00:00';             //入库开始时间
            param.endTime       = this.timeRuBeStop+' '+'24:00:00';              //入库结束时间

         }
         //Todo
         param.xuniJianshuBig0 = 0;
        param.pageSize = this.addFormOne.length;
        param.orderNo = this.addFormOne.buyOrderNo;
        param.bankJgId = this.addFormOne.bankJgId;
         findInStock(param).then(res=>{
            if(res.code =="100"){
               
                let showA=false;
                res.data.list.map((item)=>{
                      item.showa=showA
                     //四舍五入 处理总重
                     item.zongzhongliang = this.$global.accPrecision(item.zongzhongliang,3)
                    if(this.tableDataTwo.length>0){
                      this.tableDataTwo.map(cell=>{
                          if(Number(cell.id) == Number(item.id)){
                             item.showa = true;
                            
                          }else{

                          }
                      })
                    }

                  })

                this.dataSlip=res.data.list;//table表格
                //初始化值
                this.dataSlip.map((item)=>{
                  item.internetPriceArea = ""
                  item.internetPrice='';
                  item.floatPrice='';
                })
                
                this.totalM=res.data.total;//分页条数
          }  
         })  
       },
       //点击查询销售单
       getCha(){
           this.searchM();
           
       },
       //table分页
       getChangeFen(page){
          
           this.pagesizea =page;
           this.searchM();
       }
  },
  watch:{
        phone(){//监控radio的值得变化
            // this.radioValue=this.phone
        }
       
  },
  //totalSum
   computed:{ //计算总金额和总重量
        totalZongoing(){
              this.tableDataTwo.map((item)=>{
                  item.internetPriceNote=this.$global.formatDate(this.addForm.time,"yyyy-MM-dd")+'到货'

              })
            let total      = 0;
            let tolWeight  = 0;
            let totJianshu = 0;
            let totalDijia = 0;
            let caiTol=0; //添加采购单的总价
            let totalOM = 0;//杂费总金额
           
            this.tableDataTwo.map((item) => {
              if(this.ciickItem == "件数"){
                //如果件数变化，需要计算总重 = 单件重 * 件数
                item.zongzhongliang = this.$global.accMul(item.xuniJianshu,item.weight)
              }
                if(this.ciickItem =="总重" ){//修改总重会变化 单件重
                  item.weight=this.$global.accPrecision(this.$global.accDiv(item.zongzhongliang,item.xuniJianshu),3);
                } 
                  if(this.radioValue==1){//根据网价计算浮动价格
                  item.floatPrice = this.$global.accMinus(item.guapaijia,item.internetPrice)
                }else if(this.radioValue==2){//根据浮动价格计算网价
                  item.internetPrice = this.$global.accMinus(item.guapaijia,item.floatPrice)
                }else if(this.radioValue==3){//手动录入
                         

                }else if(this.radioValue==4){
                
                    item.guapaijia=this.$global.accAdd(item.internetPrice,item.floatPrice)
                }
                //重新计算 moneyAll，必须先计算，否则后续计算总值错误 取2位小数点
                caiTol = this.$global.accPrecision(this.$global.accMul(item.zongzhongliang,item.guapaijia),2);
                item.moneyAll=caiTol

                total      += Number(item.moneyAll)
                
                totalDijia += Number(item.moneyAll);
                tolWeight  += Number(item.zongzhongliang)
                totJianshu += Number(item.xuniJianshu)
                totalOM += Number(item.om1Money) + Number(item.om2Money) + Number(item.om3Money)+ Number(item.om4Money)+ Number(item.om5Money)+ Number(item.om6Money)
              
              
            })
      
            this.addForm.totalSum    = total  //总金额
            this.addForm.totalDijia  = totalDijia //总单价
            this.addForm.totalWeight = this.$global.accPrecision(tolWeight,3) //总重量
            this.addForm.totalNum    = totJianshu //总件数
            this.addForm.totalOMoney = totalOM 
            

            return  this.addForm.totalSum, this.addForm.totalWeight
        }
    },
  mounted() {
    this.addFormOne.cname = Number(this.$global.adminInfo.id);
    this.addFormOne.adminCname = this.$global.adminInfo.cname;
    this.searchM();//查询接口table
    // this.total;
    // this.getShop(this.param1);//查询店铺
    this.getDai(this.param2);//查询代理商
    this.getGongcheng();//获取工程名称
    this.getAdminList();//获取管理员名称
    this.getOrg('');
  },
  watch: {
    
  }
}
</script>

<style  lang="less">
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
  .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
   
      #apop .ivu-card-body{
        padding-top:0px!important;
      }
      // 让表格紧凑，并宽度统一
      .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table .vxe-cell {
        padding: 0 2px;
      }
#gpm .ivu-form-item-content{
 margin-left:0!important;
}

.ivu-form-item {
    margin-bottom: 0px;
}
</style>

