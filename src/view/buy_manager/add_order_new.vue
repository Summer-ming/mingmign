<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-09-23 09:15:10
 * @其他: 
 -->
<template>
  <div>
    <row>
      <Form :label-width="120" inline :model="addForm">

        <row>
          <h2 style='text-indent:20px;'>采购单-库存采购开单</h2><br/>
          <h3 style='text-indent:40px;'>基本信息</h3>

          <FormItem label="供应商店铺查询:">
            <Select size="small" v-model="shopO" filterable style="width:650px" placeholder="请输入店铺名称"  @on-change='getDian'  :label-in-value='true'>
              <Option v-for="(item,index) in shopList" :value="JSON.stringify(item)" :label="item.name" :key="index" >{{ item.name }}</Option>

            </Select>
          </FormItem>
           <FormItem label="工程名称:" >

           <Select size="small" v-model="addForm.engineering" filterable style="width:650px" placeholder="工程名称"  @on-change='getChange2'  :label-in-value='true'>
              <Option v-for="(item,index) in engineerNameList" :value="JSON.stringify(item)" :label="item.cname" :key="index" >{{ item.cname }}</Option>

            </Select>
          <Button style="margin-left:4px" shape="circle" icon="md-refresh" @click="getGongcheng"></Button>
          <Button style="margin-left:4px" shape="circle" icon="md-add" @click="addNew2"></Button>
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
          </!--> 
          <FormItem label="选择下单时间">
            <DatePicker size="small"  v-model="addForm.time" format="yyyy-MM-dd" type="date" placeholder="请选择日期" style="width:150px"></DatePicker>
          </FormItem>
        </row>

        <FormItem label="采购总金额:" prop="totalSum">
          <div   style="width:200px;color:red" v-model="addForm.totalSum" placeholder="请输入总金额">{{this.$global.isMoneyShow(addForm.totalSum)}}元</div>
        </FormItem>

        <FormItem label="采购总重量:" prop="totalWeight">
          <div   style="width:200px;color:red" v-model="addForm.totalWeight" placeholder="请输入总重量">{{addForm.totalWeight}}吨</div>
        </FormItem>

        <FormItem label="杂费总金额:" prop="totalOMoney">
          <div   style="width:200px;color:red" v-model="addForm.totalOMoney" placeholder="请输入杂费总金额">{{this.$global.isMoneyShow(addForm.totalOMoney)}}元</div>
        </FormItem>

        <FormItem label="总件数:" prop="totalOMoney">
          <div   style="width:200px;color:red" v-model="addForm.totalNum" placeholder="请输入总件数">{{addForm.totalNum}}件</div>
        </FormItem>
        <p style="visibility: hidden;">{{total}}</p>
      </Form>
    </row>
    <!-- 合同明细 -->
    <row style='margin-bottom:15px;'>
         <time style='color:red;margin-left:26px;'>说明:不可以先点击新增一行再点击上传文件,不要修改单件重</time>

      <!-- 新增一行 -->
      <row style='margin-bottom:10px;'>
       
         <!-- 新增excel上传表格 -->
         <Form :label-width="120" inline style='display:inline-block;margin-left:-107px;'>
            <FormItem >
                <Upload   action="" :before-upload="handleBeforeUpload1" accept=".xls, .xlsx">
                  <Button size="small"  style='margin-left:10px;margin-top:-11px;' type='primary' icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile1">上传文件</Button>
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
         
          <Button size="small"  type="primary" @click='getZeng' v-show='showNew' style='margin-right:20px;'>新增一行</Button>

          <Button size="small" type="info" @click="exportData(3)">下载excel模板</Button>
      </row>
      <!-- table表格 -->
      <row>
          <!-- 修改新增采购单表格 -->
          <vxe-table size="mini" border 
              class="vxe-table-element" 
              :data.sync="tableData"
              ref="table" 
              :highlight-cell='false'  
             @edit-closed='getClose'
              :edit-config="{key: 'id', trigger: 'click', mode: 'cell',} ">
             <vxe-table-column type="index" label="#"  min-width="30"></vxe-table-column>
             <!-- <vxe-table-column  label="ID" prop="id"   min-width="30"></vxe-table-column> -->
             <!-- 测试开始 -->
              <vxe-table-column prop="steelName"    min-width="100" title="类别" :edit-render="{name: 'ElSelect'}">
                <template v-slot:edit="{ row }">
                <el-select v-model="row.steelName" placeholder="请选择" filterable>
                    <el-option  
                      v-for="(item,index) in fildtps"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-slot="{ row }">{{ row.steelName }}</template>
            </vxe-table-column>
             <!-- 测试结束 -->
             <!-- 品名 -->
             <vxe-table-column prop="pinming"  min-width="100" title="品名" :edit-render="{name: 'ElSelect',options:pinSHU}">
                <template v-slot:edit="{ row }">
                <el-select v-model="row.pinming" filterable placeholder="请选择"  no-match-text='没有找到'>
                    <el-option  
                      v-for="(item,index) in pinSHU"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-slot="{ row }">{{ row.pinming }}</template>
            </vxe-table-column>
            <!-- 规格 -->
            <vxe-table-column prop="steelGuige"  min-width="100" title="规格" :edit-render="{name: 'ElSelect',options:guige}">
                <template v-slot:edit="{ row }">
                <el-select v-model="row.steelGuige" filterable placeholder="请选择" no-match-text='没有找到'>
                    <el-option  
                      v-for="(item,index) in guige"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-slot="{ row }">{{ row.steelGuige }}</template>
            </vxe-table-column>
            <!-- 牌号 -->
             <vxe-table-column prop="steelPaihao"  min-width="100" title="牌号" :edit-render="{name: 'ElSelect',options:paihao}">
                <template v-slot:edit="{ row }">
                <el-select v-model="row.steelPaihao"  filterable  placeholder="请选择" no-match-text='没有找到'>
                    <el-option  
                      v-for="(item,index) in paihao"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-slot="{ row }">{{ row.steelPaihao }}</template>
            </vxe-table-column>
             <vxe-table-column prop="steelPinpai" label="产地品牌" @change='geta()' :edit-render="{name: 'ElInput',autoselect: true}" min-width="80"></vxe-table-column>
             <vxe-table-column prop="jiaoHuoDi" label="交货地" :edit-render="{name: 'ElInput',autoselect: true}" min-width="80"></vxe-table-column>
             <!-- 仓库 -->
             <vxe-table-column prop="warehouse"  min-width="100" title="仓库" :edit-render="{name: 'ElSelect',options:cangku}">
                <template v-slot:edit="{ row }">
                <el-select v-model="row.warehouse" filterable  placeholder="请选择" no-match-text='没有找到'>
                    <el-option  
                      v-for="(item,index) in cangku"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-slot="{ row }">{{ row.warehouse }}</template>
            </vxe-table-column>
            <!-- 计重方式 -->
            <vxe-table-column prop="jizhongType"  min-width="80" title="计重方式" :edit-render="{name: 'ElSelect',options:jizhongTypeListThis}">
                <template v-slot:edit="{ row }">
                <el-select v-model="row.jizhongType" placeholder="请选择" >
                    <el-option  
                      v-for="(item,index) in jizhongTypeListThis"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-slot="{ row }">{{ row.jizhongType }}</template>
           </vxe-table-column>
             <vxe-table-column prop="jianShu" label="件数" :edit-render="{name: 'ElInput',autoselect: true}" min-width="80"></vxe-table-column>
             <vxe-table-column prop="danjianweight" label="单件重" :edit-render="{name: 'ElInput',autoselect: true}" min-width="80"></vxe-table-column>
             <vxe-table-column prop="weightAll" label="总重" :edit-render="{name: 'ElInput',autoselect: true}" min-width="80"></vxe-table-column>
             <vxe-table-column prop="caigouprice" label="采购单价" :edit-render="{name: 'ElInput',autoselect: true}" min-width="80"></vxe-table-column>
             <vxe-table-column prop="caigouzonge" label="采购总额" :edit-render="{name: 'ElInput',autoselect: true}" min-width="80"></vxe-table-column>
             <vxe-table-column prop="kunBaoHao" label="捆包号" :edit-render="{name: 'ElInput',autoselect: true}" min-width="100"></vxe-table-column>
         
         
          <vxe-table-column  fixed="right" label="操作"  min-width="150" align="center">
                    <template v-slot="{row,rowIndex}">
                        <vxe-button type="text" @click='handleCopy(row,rowIndex)' >复制一行</vxe-button>
                        <vxe-button type="text" @click='handleDelete(row,rowIndex)' >删除</vxe-button>
                    </template>
        </vxe-table-column>
         
          </vxe-table>
          
        <!-- 22 -->
      </row>
     

    </row>
    <span>合同总金额<span style="color:red;font-size:18px">{{this.$global.isMoneyShow(addForm.totalSum)}}</span>元</span>
    <span style="margin-left:20px;">合同总吨位<span style="color:red;font-size:18px">{{this.$global.accPrecision(addForm.totalWeight,3)}}</span>吨</span>
    <span style="margin-left:20px">合同总件数<span style="color:red;font-size:18px">{{addForm.totalNum}}</span>件</span>
    

    <!-- 上传图片 -->
    <row style='margin-bottom:20px;'>
      <b class="font_32">图片信息</b>
      <!-- <Tag type="border" color="error">第一张为营业执照</Tag>
      <Tag type="border" color="error">第二张为开票资料</Tag>        -->
      <br>
      <div  class="demo-upload-list" v-for="(item,index) in uploadList" :key='index'>
        <template v-if="item.status === 'finished'">
          <template v-if="item.url.indexOf('.pdf') !=-1">
            <img src="https://jgys.oss-cn-shenzhen.aliyuncs.com/baseImg/pdf.jpg"  >
          </template>
          <template v-else-if="item.url.indexOf('.xlsx') !=-1 || item.url.indexOf('.xls') !=-1">
            <img src="https://jgys.oss-cn-shenzhen.aliyuncs.com/baseImg/excel.jpg"  >
          </template>
          <template v-else>
            <img :src="item.url"  >
          </template>
          <div class="demo-upload-list-cover">
            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          </div>
        </template>

        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>

      <Upload ref="upload" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess"
       :format="['jpg','jepg','png','pdf','xls','xlsx']" 
       :max-size="5120"
        :on-format-error="handleFormatError" 
        :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :action="updateImgUrl" style="display:inline-block;width:58px">
        <div style="width: 58px;height:58px;line-height: 58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
        <Modal title="查看图片"  v-model="visible">
          <img :src="this.$global.ossUrl + imgName" v-if="visible" style="width: 100%">
        </Modal>
      </Upload>

    </row>

    <!--提交取消按钮 -->
    <row style='padding-left:10px;'>

      <Button   type="primary" @click='getAdd' style='margin-right:15px;' :disabled="isDisable">提交</Button>


      <Button   type="primary">取消</Button>
    </row>



    <!-- 2 -->


  </div>
</template>
<script>
  import {findShop,findOrgCusAcc,xiangMu,
  findOrderEngineering} from '@/api/data';//查询店铺  查询公司
  import {getAgent,getTi,getWarehouse} from '@/api/cusData'//查询代理商
  import {companyTypeListAllName,guigeTyoeList,paihaoTypeList,jizhongTypeList} from '@/libs/global_type'//公司抬头,规格的数组,牌号的数组
  import {getLeiBie} from '@/api/data_8889'//引入8889的接口
  import { constants } from 'crypto';
  import { mapMutations } from 'vuex'
  import Utils from '@/api/middle'
  //import caiGouDan from '@/xml/caiGouDan'
  export default {
    name: 'add_order_new',
    components: {

    },
    data() {
      return {
        engineeringOne:'',
        engineerNameList:[],//工程名称数组
        showNew:true,//新增一行的显示隐藏
        uploadLoading: false, //上传进度条
        file: null,//上传文件的名字
        tableData1: [],//上传的表格数据
        tableTitle: [],//表格表头
        tableLoading: false,//表格显示进度
        showProgress1: false,//是否显示进度条
        showRemoveFile: false,//移除
      
        progressPercent: 0,//默认进度条为0
        //========
        editIndexOne:'',//点击编辑的保存下标
        editRow:'',//点击编辑的时候报存当前行的数据
        editName:"",
        editIndex: -1,  // 当前聚焦的输入框的行数
        leibie:'',
        changeLei:'',//类别选中的值
        pinM:"",
        pinOne:"",//品名改变获取的值
        guiG:"",
        guiOne:'',//规格改变获取的值
        paiH:'',
        paiOne:'',//牌号改变获取的值
        chanD:'',//产地、品牌
        jiaoD:'',//交货地
        cangK:'',
        cangOne:"",//仓库的选中值
        jiZ:"",
        jiOne:'',//计重方式选中的值
        jianS:'',//件数
        danJ:'',//单件重
        weightZ:"",//总重
        caiG:"",//采购单价
        caiZ:'',//采购总额
        
        // 结束
        pinSHU:[],
        pinSHU1:[],
        guige:guigeTyoeList,
        paihao:paihaoTypeList,
        jizhongTypeListThis:jizhongTypeList,
        cangku:[],
        zafei:[],
        fildtps:[],//类别
        tableData:[],//ELEMENT数组
        isDisable:false,
        dataNew:[],
        addForm: {
          totalSum: '',//总金额
          totalDijia:'',//底价总金额
          totalWeight: "",//总重量
          totalNum:'',//总件数
          totalOMoney:'',//总杂费金额
          engineering:'',//工程名称
          time:new Date,//下单时间
        },
        templeId:0,
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
        b:0,
      }
    },
    methods: {
      getChange2(item){
         const stingR=eval('(' + item.value+ ')')
         this.taiT=stingR.bankJgId
         console.log(stingR)
         this.engineeringOne=stingR.cname
         let dic = {};
         dic.value = stingR.bankJgId;
         dic.label = stingR.bankJgId=="1"?"福建省亿钢电子商务有限公司":"上海市闽航电子商务有限公司"
         this.getTai(dic);
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
     //新增
     //按钮激活后的值
     getClose({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell}){
        console.log(row)
    

     },

geta(value){
 console.log('woshi')
 console.log(value)
},

      //结束
      ...mapMutations([
        'closeTag'
      ]),
      //新增excel上传
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
          console.log(e)
          const data = e.target.result
          import('@/libs/excel').then(excel => {
            const { header, results } = excel.read(data, 'array')
            const tableTitle = header.map(item => { return { title: item, key: item } })
            
            console.log('表头')
            console.log(tableTitle)
            let addData=[]; //excel 表格上传的数据进行处理

            results.map((item)=>{
              let dic={};
            dic.kunBaoHao=item.捆包号;
            dic.steelName=item.类别;
            dic.pinming=item.品名;
            dic.steelGuige=item.规格;
            dic.steelPaihao=item.牌号;
            dic.steelPinpai=item.产地品牌;
            //dic.weight="",
            dic.guapaijia='';
            dic.jiaoHuoDi=item.交货地;
            dic.warehouse=item.仓库;
            dic.jizhongType=item.计重方式;
            dic.jianShu=item.件数;
            dic.weightAll=item.总重;
            dic.caigouprice=item.采购价格;
            dic.caigouzonge="";
            dic.steelNote="";

            dic.danjianweight='';
            dic.id = this.templeId;
            this.templeId++;
            addData.push(dic)
            })
            this.tableData = addData  //上传的数据
            console.log('我是上传的数据')
            console.log(this.tableData)
            this.tableTitle = tableTitle
            
          })
        }
    },
      // 结束
        //导出excel
      exportData (type) {
        window.location.href ="https://jgys.oss-cn-shenzhen.aliyuncs.com/webFiles/%E9%87%87%E8%B4%AD%E5%8D%95%E4%B8%8A%E4%BC%A0%E6%A8%A1%E6%9D%BF.xlsx"
       
      },
      //查询店铺
      getShop(param){
        param.status = 1;
        param.pageSize = "999999"
        findShop(param).then(res=>{
          if(res.code =="100"){
            this.shopList=res.data.list
          }
        })
      },
      //查询工程
      getGongcheng(){
        let p  ={};
        p.pageSize ="99999"
        p.status = 1;
        p.type = '2'
        this.engineerNameList = [];
        //替换接口 查询工程名称 xiangMu findOrderEngineering
        xiangMu(p).then(res=>{
          if(res.code =="100"){
            this.$Message.success("获取工程名称成功")
              // res.data.list.map(item =>{
              //   let dic = {};
              //   dic.label =item.cname;
              //   dic.value =item.id;
              //   this.engineerNameList.push(dic);
              // })
              this.engineerNameList=res.data.list;
              console.log('我是工程')
              console.log(this.engineerNameList)
          }
        })
      },
      
      //查询代理商 getAgent
      getDai(param){
        param.pageSize = "999999"
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
        //item= eval('(' + item + ')');
        const stingR=eval('(' + item.value + ')')
        this.showIdK=stingR.id;
        this.shopId=stingR.id;
        this.shopName=stingR.name;
        this.shopOrgName=stingR.orgName;
        this.shopUserId=stingR.adminId;

        this.shopOrgId=stingR.orgId;

      },
      //上传图片
      handleView(name) {
        console.log(name)
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
        this.tableData.map((item)=>{
          let dic = {};
          dic.agentId            = this.agentId
          dic.agentName          = this.agentShortName

          dic.bankJgId           = this.bankJgId
          dic.businessType       = '1'
          dic.buyType            = '1'

          dic.createEname        = this.$global.adminInfo.ename
          dic.createCname        = this.$global.adminInfo.cname

          dic.cusMoney           = item.caigouzonge//买家总价格
          dic.merMoney           = item.caigouzonge//底价总额

          //买家信息
          dic.customerId         = this.customerId
          dic.customerName       = this.customerName;
          dic.customerOrgId      = this.customerOrgId
          dic.customerOrgName    = this.customerOrgName;
          dic.customerPhone      = ''

          dic.dijia              = item.caigouprice
          dic.guapaijia          = item.caigouprice

          dic.invoiceApplyMoney  = "0"
          dic.invoiceApplyWeight = "0"

          dic.jianshu            = item.jianShu
          dic.xuniJianshu        = item.jianShu

          dic.jiaohuodi          = item.jiaoHuoDi
          dic.jizhongType        = item.jizhongType
          dic.kunbaohao          = item.kunBaoHao

          dic.ordersType         = "1"
          dic.payType            = '1'

          dic.shopId             = this.shopId
          dic.shopName           = this.shopName
          dic.shopOrgId          = this.shopOrgId;
          dic.shopOrgName        = this.shopOrgName;
          dic.shopSteelId        = "";
          dic.shopUserId         = this.shopUserId;

          dic.steelType          = item.steelName//类别
          dic.steelName          = item.pinming//品名
          dic.steelGuige         = item.steelGuige//规格
          dic.steelPaihao        = item.steelPaihao//牌号
          dic.steelPinpai        = item.steelPinpai//品牌
          dic.steelWorks         = item.warehouse//仓库

          dic.userId             = this.$global.adminInfo.id

          // dic.weight             =item.danjianweight //单件重
          dic.weight             = this.$global.accDiv(item.weightAll,item.jianShu);
          dic.zongzhonglia       = item.weightAll//总重量
          //下面是新增的字段
          dic.jiesuanMoney       = 0
          dic.jiesuanWeight      = 0
          dic.jiesuanDanjia      = 0
          dic.jiesuanJianshu      = 0

          this.dataThree.push(dic)
        })
      },
      getAdd(){
        //获取图片地址
          this.uploadList.map((item)=>{
          this.imgString += item.url+','
        })
        if(this.bankJgId==''||this.shopId==''){
              alert('请选择本公司抬头和供应商名称')
              return false
        }
        this.reloadData();
        const param                = {};
        param.agentId        = this.agentId;
        param.agentShortName = this.agentShortName,            //代理商名称
          param.bankJgId       = this.bankJgId,                  //本公司抬头类型，1上海闽航，2福建亿钢
          param.businessType   = '1',                            //写死
          param.buyType        = "1",                            //写死
          param.createCname    = this.$global.adminInfo.cname,   //登录人的名称
          param.createEname    = this.$global.adminInfo.ename,   //登录人的英文名称
          param.payMoneyStatus = "0"
          //cus的信息根据 bankJgId的类型来区分填写
          param.customerId          = this.customerId,            //bankJgId = 1,写死1，bankJgId = 2,写死2
          param.customerName        = this.customerName,          //bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
          param.customerOrgId       = this.customerOrgId,         //bankJgId = 1,写死"1"bankJgId = 2,写死2
          param.customerOrgName     = this.customerOrgName,       //bankJgId = 1,写死"上海市闽航电子商务有限公司"，bankJgId = 2,写死‘福建省亿钢电子商务有限公司’
          param.customerPhone       = "",                         //传空
          //买家信息结束
          param.moneyAll            = this.addForm.totalSum,                        //买家总金额
          param.merMoneyAll         = this.addForm.totalSum,                        //卖家总金额

          param.orderType           = "1",                        //订单类型,写1
          param.oasrOrderType = "1"//订单类型 1=采购单 2=销售单,插入到采购单列表中的信息
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
        //2019年5月5日15:35:06 添加
        param.gongcheng = this.engineeringOne;//工程名称
        //2019年7月9日11:16:41 添加下单日期
        let dates = this.$global.formatDate(this.addForm.time,"yyyy-MM-dd");//选择的日期
        let times = this.$global.formatDate(new Date(),"hh:mm:ss");
        let allTimes = dates +' '+times;
        param.createTimes = allTimes;//订单下单时间
        param.createTimeFormat = this.$global.formatDate(this.addForm.time,"yyMMdd")//订单号使用的时间
        getTi(param).then(res=>{
          if(res.code =="100"){
            this.isDisable=true
            this.$Notice.success({
              title:'添加成功',
              duration:1,
              onClose:res =>{
                this.closeTag({
                  name: 'add_order_new'
                })
                setTimeout(() => {
                  const route = { 
                    name: 'buy_order_list',
                    query:''
                }
                this.$router.push(route);
                console.log("添加订单开始发送")
                 Utils.$emit('buy_order_list','reload');

               }, 100);
              }
            })
          }
        })


      },
      //新增一行
      getZeng(){
          this.templeId++;
        var obj={
         id:this.templeId,
          kunBaoHao:"",
          steelName:"",
          pinming:"",
          steelGuige:"",
          steelPaihao:"",
          steelPinpai:"",
          weight:"",
          guapaijia:'',
          jiaoHuoDi:"",
          warehouse:"",
          jizhongType:"",
          jianShu:0,
          weightAll:0,
          caigouprice:0,
          caigouzonge:"",
          steelNote:"",
          danjianweight:0,
         // danjiazhong:""
        }
        this.tableData.push(obj)
        console.log(this.tableData)
      },
      //复制一行
      handleCopy(row,index){
        console.log(row);
        this.templeId ++;
        let obj={
          id:this.templeId,
          kunBaoHao  : row.kunBaoHao,
          steelName  : row.steelName,
          pinming    : row.pinming,
          steelGuige : row.steelGuige,
          steelPaihao: row.steelPaihao,
          steelPinpai: row.steelPinpai,
          jiaoHuoDi  : row.jiaoHuoDi,
          warehouse  : row.warehouse,
          jizhongType: row.jizhongType,
          jianShu    : row.jianShu,
          weightAll  : row.weightAll,
          caigouprice: row.caigouprice,
          caigouzonge: row.caigouzonge,
          steelNote  : row.steelNote,

          danjiazhong: row.danjiazhong
        }
        console.log(obj);
        this.tableData.push(obj)
      },
      //删除一行
      handleDelete(index,row){
        this.tableData.splice(row,1)
      },
      //总重
      changeWeight(item){
        this.weightZ = this.$global.accMul(this.jianS,this.danJ);
        this.changetMoney();
      },
      //采购总额变化引起的其他变化
      getMoneyZ(){
         if(this.caiZ=='0'||this.caiZ==''){
               this.weightZ=0
               this.caiG=0
         }else{
             this.weightZ=(this.caiZ)/(this.caiG) 
             this.caiG=(this.caiZ)/(this.weightZ)
         }
          this.changetMoney();
      },
      //总重变化引起件数变化
      changeZhong(item){
        console.log(this.weightZ)
         if(this.weightZ=='0'||this.weightZ==null||this.weightZ==''){
             this.jianS =0;
             this.danJ=0
         }else{
           this.danJ = this.$global.accDiv(this.weightZ,this.jianS)
         }
         //   console.log(this.weightZ+'总重')
        // console.log(this.danJ+"单间重")
        // console.log(this.jianS+"件数")
         this.changetMoney();
      },
      //单件数
      changejianshu(){                    //件数       单件重
        this.weightZ = this.$global.accMul(this.jianS,this.danJ);
        this.changetMoney();
      },
      //采购总价
      changetMoney(){                   //采购单价     总重
        this.caiZ = this.$global.accMul(this.caiG,this.weightZ);
      },
      //获取类别
      getLei(){
        let param={};
        getLeiBie(param).then(res=>{
        
          res.data.map((item)=>{
            this.fildtps.push(item.steelName)
            this.dataNew=item.children;//获取品名的值
          })
          this.dataNew.map((item)=>{
              this.pinSHU.push(item.steelName)
          })
          this.pinSHU=this.pinSHU.map((item)=>{
             return {value:item,label:item}
          })
         
          this.fildtps=this.fildtps.map((item)=>{
              return { value:item,label:item}
          })
          console.log('我是类别')
          console.log(this.fildtps)
        })
      },
      //获取所有仓库getWarehouse
      getCang(){
        let param={pageSize:'9999'};
        getWarehouse(param).then(res=>{
          res.data.list.map((item)=>{
            if(item.warehouseName==null){

            }else{
              let dic={}
              dic.value=item.warehouseName
              dic.label=item.warehouseName
              this.cangku.push(dic)
             
             
            }
          })
        })
      },
      //获取公司名字
      getComPany(){
        let param={};
        param.pageSize = "999999"
        findOrgCusAcc(param).then(res=>{
          //this.dataCompany=res.data.list
          this.zafei=res.data.list
        })
      },
     
      //当一行被点击时会触发事件
      handleCurrentChange(row, event, column) {
        // console.log(row, event, column, event.currentTarget)
      },
    },
    //totalSum
    computed:{ //计算总金额和总重量
      total(){
        let total      = 0;
        let tolWeight  = 0;
        let totJianshu = 0;
        let danjianZ = 0
        let totalOM = 0;//杂费总金额

        this.tableData.map((item) => {
          //计算单件重
          item.danjianweight = this.$global.accPrecision(this.$global.accDiv(item.weightAll,item.jianShu),3)

          //计算总金额，必须放在循环上面，否则计算总额会有问题
          item.caigouzonge = this.$global.accPrecision(this.$global.accMul(item.caigouprice,item.weightAll),2)
          total      = this.$global.accAdd(item.caigouzonge,total);
          tolWeight  += Number(item.weightAll)
          totJianshu += Number(item.jianShu)
          totalOM += Number(item.o1Money) + Number(item.o2Money) + Number(item.o3Money)+ Number(item.o4Money)+ Number(item.o5Money)+ Number(item.o6Money)
        })
        this.addForm.totalSum    = total
        this.addForm.totalDijia  = total
        this.addForm.totalWeight = this.$global.accPrecision(tolWeight,3)
        this.addForm.totalNum    = totJianshu
        this.addForm.totalOMoney = totalOM
        
        //table 表格计算总中
        console.log("计算成功----")

        return  this.addForm.totalSum, this.addForm.totalWeight
      }
    },
    mounted() {
     
      Array.prototype.notempty = function() {
        var arr = [];
        this.map(function(val, index) {
          //过滤规则为，不为空串、不为null、不为undefined
          if (val !== "" && val != undefined) { arr.push(val); }});
        return arr;
      };
      this.total;
      this.getShop(this.param1);//查询店铺
      this.getDai(this.param2);//查询代理商
      this.getLei();//获取类别
      this.getCang();//获取所有仓库
      this.getComPany();//获取公司名称
      this.getGongcheng();//获取工程名称

    
                
    },
    created(){
      this.guige=this.guige.map((item)=>{
        return {value:item,label:item}
      })
      this.paihao=this.paihao.map((item)=>{
        return {value:item,label:item}
      })
   
      this.jizhongTypeListThis=this.jizhongTypeListThis.map((item)=>{
        return {value:item,label:item}
      })
     
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

  .tb-edit .el-input {
    display: none
  }
  .tb-edit .current-row .el-input {
    display: block
  }
  .tb-edit .current-row .el-input+span {
    display: none
  }
  .tb-edit .current-row .el-select+span {
    display: none
  }
  .ivu-table-cell{
      padding-left: 0 !important;
      padding-right:0 !important;
    }
    .ivu-input[disabled]{
          color: #e21e1e;
    }
    .ivu-form-item {
    margin-bottom: 0px;
}
</style>

