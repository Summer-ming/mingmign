<template>
  <div>
    <row>
      <Form :label-width="120" inline :model="addForm">

        <row>
          <h2 style='text-indent:20px;'>采购单-库存采购开单</h2><br/>
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
         
          <FormItem label="工程名称:" >
           <i-input   style="width:200px" v-model="addForm.engineering" placeholder="请输入工程名称"/>
         </FormItem>
          <p style="visibility: hidden;">{{total}}</p>

      </Form>
    </row>
    <!-- 合同明细 -->
    <row style='margin-bottom:15px;'> 
           <!-- 新增一行 -->
           <row style='margin-bottom:10px;'>
              <Button  type="primary" @click='getZeng'>新增一行</Button>
           </row>
           <!-- table表格 -->
         <row>
              <!-- <Table :columns="columnsNew" :data="tableNew"></Table>   -->

               <el-table @cell-click="clickTd" :data="tableData" style="width: 100%" empty-text='没有数据'>

                 <el-table-column label="序号" fixed='left' align='center' width='60'>
                    <!-- scope.$index -->
                     <template  scope="scope">
                        {{scope.$index+1}}
                   </template>
                               
                 </el-table-column>
                  

                 <el-table-column prop="kunBaoHao" label="捆包号" width='160' >
                   <template  scope="scope">
                     <span v-if="!scope.row.kunBaoHaoShow">{{scope.row.kunBaoHao}}</span>
                     <el-input
                     @blur="blurTd(scope.$index, scope.row,'kunBaoHao')"
                     v-if="scope.row.kunBaoHaoShow"
                     v-focus="scope.row.kunBaoHaoFocus"
                      size="mini" v-model="scope.row.kunBaoHao" ></el-input>
                   </template>
                 </el-table-column>

                 <!-- <el-table-column prop="steelName" label="类别" width='160'>
                   <template scope="scope">
                     <el-select v-model="scope.row.steelName" clearable filterable  placeholder="请选择"  @change='getFen'>
                       <el-option
                         v-for="(item,index) in fildtps"
                         :key="index"
                         :label="item"
                         :value="item">
                       </el-option>
                     </el-select>
                   </template>
                 </el-table-column>

                 <el-table-column prop="pinming" label="品名" width='160' >
                   <template scope="scope">
                       <el-select v-model="scope.row.pinming" clearable filterable  placeholder="请选择">
                         <el-option
                           v-for="(item,index) in pinSHU"
                           :key="index"
                           :value="item.steelName">
                         </el-option>
                     </el-select>
                   </template>
                 </el-table-column>

                 <el-table-column prop="steelGuige" label="规格" width='160'>
                   <template scope="scope">
                       <el-select v-model="scope.row.steelGuige" allow-create clearable filterable placeholder="请选择">
                         <el-option
                           v-for="(item,index) in guige"
                           :key="index"
                           :value="item">
                         </el-option>
                     </el-select>
                   </template>
                 </el-table-column>


                  <el-table-column prop="steelPaihao" label="牌号" width='160'>
                   <template scope="scope">
                       <el-select v-model="scope.row.steelPaihao" allow-create clearable filterable placeholder="请选择">
                         <el-option
                           v-for="(item,index) in paihao"
                           :key="index"
                           :value="item">
                         </el-option>
                     </el-select>
                   </template>
                 </el-table-column>-->


                  <el-table-column prop="steelPinpai" label="产地/品牌" width='160' >
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.steelPinpai"  ></el-input>
                   </template>
                 </el-table-column>

                  <el-table-column prop="jiaoHuoDi" label="交货地"  width='160'>
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.jiaoHuoDi"  ></el-input>
                   </template>
                 </el-table-column>

                <!-- <el-table-column prop="warehouse" label="仓库" width='160'>
                   <template scope="scope">
                       <el-select v-model="scope.row.warehouse" clearable filterable placeholder="请选择">
                         <el-option
                           v-for="(item,index) in cangku"
                           :key="index"
                           
                           :value="item">
                         </el-option>
                     </el-select>
                   </template>
                 </el-table-column>

                  <el-table-column prop="jizhongType" label="计重方式" width='160' >
                   <template scope="scope">
                     <el-select v-model="scope.row.jizhongType" clearable filterable placeholder="请选择">
                         <el-option
                           v-for="(item,index) in jizhongTypeListThis"
                           :key="index"
                           :value="item">
                         </el-option>
                    </el-select>
                   </template>
                 </el-table-column>


                <el-table-column prop="jianShu" label="件数" width='160' >
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.jianShu"  ></el-input>
                   </template>
                 </el-table-column>
                 
                <el-table-column prop="danjianweight" label="单件重"  width='160'>
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.danjianweight"  ></el-input>
                   </template>
                 </el-table-column>

                 <el-table-column prop="weightAll" label="总重" width='160' >
                   <template scope="scope">
                     {{scope.row.weightAll}}

                   </template>
                 </el-table-column>

                 

                  <el-table-column prop="caigouprice" label="采购单价"  width='160'>
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.caigouprice"  ></el-input>
                   </template>
                 </el-table-column>

                  <el-table-column prop="caigouzonge" label="采购总额"  width='160'>
                   <template scope="scope">
                     {{scope.row.caigouzonge}}
                   </template>
                 </el-table-column>


                  <el-table-column prop="o1Name" label="杂费1名称" width='160' >
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o1Name"  ></el-input>
                   </template>
                 </el-table-column>

                  <el-table-column prop="o1Money" label="杂费1金额" width='160' >
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o1Money"  ></el-input>
                   </template>
                 </el-table-column>

                 <el-table-column prop="o1OrgName" label="选择杂费1公司" width='160'>
                   <template scope="scope">
                       <el-select v-model="scope.row.o1OrgName" clearable filterable placeholder="请选择" @change='getCompanyOne(scope.$index,scope.row)' >
                         <el-option
                           v-for="(item,index) in zafei"
                           :key="index"
                           :value="item.cusorgName">
                         </el-option>
                     </el-select>
                   </template>
                 </el-table-column>

                <el-table-column prop="o1OrgId" label="杂费1公司id" width='160' >
                   <template scope="scope">
                     {{scope.row.o1OrgId}}
                   </template>
                </el-table-column>

                 <el-table-column prop="o2Name" label="杂费2名称"  width='160'>
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o2Name"  ></el-input>
                   </template>
                </el-table-column>

                <el-table-column prop="o2Money" label="杂费2金额" width='160' >
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o2Money"  ></el-input>
                   </template>
                </el-table-column>

                <el-table-column prop="o2OrgName" label="选择杂费2公司"  width='160'>
                   <template scope="scope">
                       <el-select v-model="scope.row.o2OrgName" clearable filterable placeholder="请选择" @change='getCompanyTwo(scope.$index,scope.row)' >
                         <el-option
                           v-for="(item,index) in zafei"
                           :key="index"
                           
                           :value="item.cusorgName">
                         </el-option>
                     </el-select>
                   </template>
                 </el-table-column>


                <el-table-column prop="o2OrgId" label="杂费2公司id"  width='160' >
                   <template scope="scope">
                      {{scope.row.o2OrgId}}
                   </template>
                </el-table-column>

                <el-table-column prop="o3Name" label="杂费3名称" width='160' >
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o3Name"  ></el-input>
                   </template>
                </el-table-column>


                <el-table-column prop="o3Money" label="杂费3金额"  width='160'>
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o3Money"  ></el-input>
                   </template>
                </el-table-column>


                <el-table-column prop="o3OrgName" label="选择杂费3公司" width='160'>
                   <template scope="scope">
                       <el-select v-model="scope.row.o3OrgName" clearable filterable  placeholder="请选择" @change='getCompanyThree(scope.$index,scope.row)'>
                         <el-option
                           v-for="(item,index) in zafei"
                           :key="index"
                           
                           :value="item.cusorgName">
                         </el-option>
                     </el-select>
                   </template>
                </el-table-column>


                 <el-table-column prop="o3OrgId" label="杂费3公司id"  width='160'>
                   <template scope="scope">
                      {{scope.row.o3OrgId}}
                   </template>
                </el-table-column>


                 <el-table-column prop="o4Name" label="杂费4名称"  width='160'>
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o4Name"  ></el-input>
                   </template>
                </el-table-column>


                <el-table-column prop="o4Money" label="杂费4金额" width='160' >
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o4Money"  ></el-input>
                   </template>
                </el-table-column>


                <el-table-column prop="o4OrgName" label="选择杂费4公司" width='160' >
                   <template scope="scope">
                       <el-select v-model="scope.row.o4OrgName" clearable filterable placeholder="请选择" @change='getCompanyFour(scope.$index,scope.row)'>
                         <el-option
                           v-for="(item,index) in zafei"
                           :key="index"
                           
                           :value="item.cusorgName">
                         </el-option>
                     </el-select>
                   </template>
                </el-table-column>


                 <el-table-column prop="o4OrgId" label="杂费4公司id" width='160' >
                   <template scope="scope">
                      {{scope.row.o4OrgId}}
                   </template>
                </el-table-column>



                 <el-table-column prop="o5Name" label="杂费5名称"  width='160'>
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o5Name"  ></el-input>
                   </template>
                </el-table-column>


                <el-table-column prop="o5Money" label="杂费5金额"  width='160'>
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o5Money"  ></el-input>
                   </template>
                </el-table-column>


                <el-table-column prop="o5OrgName" label="选择杂费5公司" width='160'>
                   <template scope="scope">
                       <el-select v-model="scope.row.o5OrgName" clearable filterable placeholder="请选择" @change='getCompanyFive(scope.$index,scope.row)'>
                         <el-option
                           v-for="(item,index) in zafei"
                           :key="index"
                           
                           :value="item.cusorgName">
                         </el-option>
                     </el-select>
                   </template>
                </el-table-column>


                 <el-table-column prop="o5OrgId" label="杂费5公司id"  width='160'>
                   <template scope="scope">
                      {{scope.row.o5OrgId}}
                   </template>
                </el-table-column>


                 <el-table-column prop="o6Name" label="杂费6名称"  width='160'>
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o6Name"  ></el-input>
                   </template>
                </el-table-column>


                <el-table-column prop="o6Money" label="杂费6金额" width='160' >
                   <template scope="scope">
                     <el-input size="mini" v-model="scope.row.o6Money"  ></el-input>
                   </template>
                </el-table-column>


                <el-table-column prop="o6OrgName" label="选择杂费6公司" width='160'>
                   <template scope="scope">
                       <el-select v-model="scope.row.o6OrgName" clearable filterable placeholder="请选择" @change='getCompanySix(scope.$index,scope.row)'>
                         <el-option
                           v-for="(item,index) in zafei"
                           :key="index"
                           
                           :value="item.cusorgName">
                         </el-option>
                     </el-select>
                   </template>
                </el-table-column>


                 <el-table-column prop="o6OrgId" label="杂费6公司id" width='160' >
                   <template scope="scope">
                      {{scope.row.o6OrgId}}
                   </template>
                </el-table-column> -->


                 <el-table-column label="操作" width='145' fixed='right' align='center'>
                   <template  scope="scope">
                     <el-button
                       size="mini"
                       type="primary"
                       @click="handleCopy(scope.$index, scope.row)">复制</el-button>
                     <el-button
                       size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                   </template>

                 </el-table-column>




               </el-table>
              <!-- 22 -->
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

      <Button   type="primary" @click='getAdd' style='margin-right:15px;' :disabled="isDisable">提交</Button>


      <Button   type="primary">取消</Button> 
    </row>


   
    <!-- 2 -->
     

  </div>
</template>
<script>
import {findShop,findOrgCusAcc} from '@/api/data';//查询店铺  查询公司
import {getAgent,getTi,getWarehouse} from '@/api/cusData'//查询代理商
import {companyTypeListAllName,guigeTyoeList,
paihaoTypeList,
jizhongTypeList} from '@/libs/global_type'//公司抬头,规格的数组,牌号的数组
import {getLeiBie} from '@/api/data_8889'//引入8889的接口
import { constants } from 'crypto';
import { mapMutations } from 'vuex'

export default {
  name: 'add_order_new',
  components: {

  },
  data() {
    return {
       pinSHU:[],
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
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    clickTd(row,column,cell,event){
      console.log("捆包号")
      // row[cell.property+'Show'] = true;
      // row[cell.property+'Focus'] = true;
      if(column.label !="操作"){
         let a = column.property+'Show';
        let b = column.property+'Focus';

      row[a] = true;
      row[b] = true;
        console.log("相等")

      }else{
        console.log("不相等")
      }
       

      // row[kunBaoHaoFocus] = true;
      console.log(row);
      console.log('kunBaoHaoShow:'+row.kunBaoHaoShow);
      console.log(column);
      console.log(cell);
      console.log(event);

    },
    blurTd(index,row,key){
       console.log("捆包号input blur"+index)
       let a = key+'Show';
        let b = key+'Focus';
      console.log(a);
      row[a] = false;
      row[b] = false;
      //  row.kunBaoHaoShow = false;
      //  row.kunBaoHaoFocus = false;
       console.log('kunBaoHaoShow:'+row.kunBaoHaoShow);
    },
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
       //添加订单提交
       reloadData(){
         this.dataThree = [];
         this.tableData.map((item)=>{
           console.log(item.weightAll);
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

                        dic.weight             =item.danjianweight //单件重
                        dic.zongzhonglia       = item.weightAll//总重量
                        //下面是新增的字段
                        dic.jiesuanMoney       = item.caigouzonge
                        dic.jiesuanWeight      = item.weightAll
                        //下面是杂费的字段
                        dic.om1Name             = item.o1Name        
                        dic.om1Money            = item.o1Money
                        dic.om1OrgId            = item.o1OrgId
                        dic.om1OrgName          = item.o1OrgName

                        dic.om2Name             = item.o2Name        
                        dic.om2Money            = item.o2Money
                        dic.om2OrgId            = item.o2OrgId
                        dic.om2OrgName          = item.o2OrgName

                        dic.om3Name             = item.o3Name        
                        dic.om3Money            = item.o3Money
                        dic.om3OrgId            = item.o3OrgId
                        dic.om3OrgName          = item.o3OrgName

                        dic.om4Name             = item.o4Name        
                        dic.om4Money            = item.o4Money
                        dic.om4OrgId            = item.o4OrgId
                        dic.om4OrgName          = item.o4OrgName

                        dic.om5Name             = item.o5Name        
                        dic.om5Money            = item.o5Money
                        dic.om5OrgId            = item.o5OrgId
                        dic.om5OrgName          = item.o5OrgName

                        dic.om6Name             = item.o6Name        
                        dic.om6Money            = item.o6Money
                        dic.om6OrgId            = item.o6OrgId
                        dic.om6OrgName          = item.o6OrgName

                        this.dataThree.push(dic)
                  })
       },
       getAdd(){ 
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
         param.moneyAll            = this.addForm.totalSum,                        //买家总金额
         param.merMoneyAll         = this.addForm.totalSum,                        //卖家总金额 
         
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
         //2019年5月5日15:35:06 添加
         param.gongcheng = this.addForm.engineering;//工程名称
          getTi(param).then(res=>{
              if(res.code =="100"){
                this.isDisable=true
                console.log(res)
                 this.$Notice.success({
                            title:'添加成功',
                              duration:2,
                                onClose:res =>{
                                console.log('关闭时回调')
                                this.closeTag({
                                    name: 'add_order_new'
                                })
                            }
                    })
            }  
          })

          
       },
       //新增一行
       getZeng(){
          var obj={
                kunBaoHao:"",
                kunBaoHaoShow:false,
                kunBaoHaoFocus:false,
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
                jianShu:"",
                weightAll:'',
                caigouprice:"",
                caigouzonge:"",
                steelNote:"",

                o1Name:"",
                o1Money:"",
                o1OrgId:"",
                o1OrgName:"",

                o2Name:"",
                o2Money:"",
                o2OrgId:"",
                o2OrgName:"",

                o3Name:"",
                o3Money:"",
                o3OrgId:"",
                o3OrgName:"",

                o4Name:"",
                o4Money:"",
                o4OrgId:"",
                o4OrgName:"",

                o5Name:"",
                o5Money:"",
                o5OrgId:"",
                o5OrgName:"",

                o6Name:"",
                o6Money:"",
                o6OrgId:"",
                o6OrgName:"",

                danjiazhong:""
              }
            //this.dataNew.push(obj)
           // this.tableNew.push(obj)
            this.tableData.push(obj)


        },
          //复制一行
       handleCopy(index,row){
          console.log(index)
          console.log(row)
       let obj={
                kunBaoHao:row.kunBaoHao,
                steelName:row.steelName,
                pinming:row.pinming,
                steelGuige:row.steelGuige,
                steelPaihao:row.steelPaihao,
                steelPinpai:row.steelPinpai,
                jiaoHuoDi:row.jiaoHuoDi,
                warehouse:row.warehouse,
                jizhongType:row.jizhongType,
                jianShu:row.jianShu,
                weightAll:row.weightAll,
                caigouprice:row.caigouprice,
                caigouzonge:row.caigouzonge,
                steelNote:row.steelNote,

                o1Name:row.o1Name,
                o1Money:row.o1Money,
                o1OrgId:row.o1OrgId,
                o1OrgName:row.o1OrgName,

                o2Name:row.o2Name,
                o2Money:row.o2Money,
                o2OrgId:row.o2OrgId,
                o2OrgName:row.o2OrgName,

                o3Name:row.o3Name,
                o3Money:row.o3Money,
                o3OrgId:row.o3OrgId,
                o3OrgName:row.o3OrgName,

                o4Name:row.o4Name,
                o4Money:row.o4Money,
                o4OrgId:row.o4OrgId,
                o4OrgName:row.o4OrgName,

                o5Name:row.o5Name,
                o5Money:row.o5Money,
                o5OrgId:row.o5OrgId,
                o5OrgName:row.o5OrgName,

                o6Name:row.o6Name,
                o6Money:row.o6Money,
                o6OrgId:row.o6OrgId,
                o6OrgName:row.o6OrgName,

                danjiazhong:row.danjiazhong
              }
        console.log(this.tableData)
        this.tableData.push(obj)
       },
      //删除一行
       handleDelete(index,row){
         this.tableData.splice(index,1) 
       },
        //获取类别
        getLei(){
            let param={};
            getLeiBie(param).then(res=>{

               this.dataNew = res.data;
               res.data.map((item)=>{
                  this.fildtps.push(item.steelName)
               })    
              this.fildtps=this.fildtps
         })
        },
          //获取分类的值
      getFen(event){
        console.log(event)
          this.dataNew.map((item)=>{
              if(item.steelName==event){
                    this.pinSHU = item.children
                 }
              })
      },
        //获取所有仓库getWarehouse
         getCang(){
            let param={pageSize:'9999'};
            getWarehouse(param).then(res=>{
                 res.data.list.map((item)=>{
                   if(item.warehouseName==null){
                             
                   }else{
                      this.cangku.push(item.warehouseName)
                   }
                 })                 
            })
         },
         //获取公司名字
         getComPany(){
             let param={};
              
             findOrgCusAcc(param).then(res=>{
        
                  this.dataCompany=res.data.list            
            })
         },
          //获取公司1的来获取id
      getCompanyOne(index,row){

        console.log(index)
        console.log(row)
        this.zafei.map((item)=>{
            if(item.cusorgName==row.o1OrgName){
                   console.log(item.cusorgId)
                   this.tableData[index].o1OrgId=item.cusorgId

            }
        })
      },
          //获取公司名字
         getComPany(){
             let param={};
              
             findOrgCusAcc(param).then(res=>{
        
                  //this.dataCompany=res.data.list 
                  this.zafei=res.data.list   
                  console.log('我是公司名称')  
                  console.log(res)      
            })
         },
      //获取公司2的来获取id
      getCompanyTwo(index,row){

        console.log(index)
        console.log(row)
        this.zafei.map((item)=>{
            if(item.cusorgName==row.o2OrgName){
                   console.log(item.cusorgId)
                   this.tableData[index].o2OrgId=item.cusorgId

            }
        })
      },
      //获取公司3的来获取id
      getCompanyThree(index,row){

        console.log(index)
        console.log(row)
        this.zafei.map((item)=>{
            if(item.cusorgName==row.o3OrgName){
                   console.log(item.cusorgId)
                   this.tableData[index].o3OrgId=item.cusorgId

            }
        })
      },
       //获取公司4的来获取id
      getCompanyFour(index,row){

        console.log(index)
        console.log(row)
        this.zafei.map((item)=>{
            if(item.cusorgName==row.o4OrgName){
                   console.log(item.cusorgId)
                   this.tableData[index].o4OrgId=item.cusorgId

            }
        })
      },
       //获取公司5的来获取id
      getCompanyFive(index,row){

        console.log(index)
        console.log(row)
        this.zafei.map((item)=>{
            if(item.cusorgName==row.o5OrgName){
                   console.log(item.cusorgId)
                   this.tableData[index].o5OrgId=item.cusorgId

            }
        })
      },
       //获取公司6的来获取id
      getCompanySix(index,row){

        console.log(index)
        console.log(row)
        this.zafei.map((item)=>{
            if(item.cusorgName==row.o6OrgName){
                   console.log(item.cusorgId)
                   this.tableData[index].o6OrgId=item.cusorgId

            }
        })
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
              item.caigouzonge = this.$global.accPrecision(this.$global.accMul(item.caigouprice,item.weightAll),3)
              
              total      += Number(item.caigouzonge)
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
    console.log(this.$global.baseUrl)
    this.getShop(this.param1);//查询店铺
    this.getDai(this.param2);//查询代理商
    this.getLei();//获取类别
    this.getCang();//获取所有仓库
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

