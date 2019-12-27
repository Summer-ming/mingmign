<!--
 * @Description:审核采购单 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-10 10:27:38
 -->



<template>
     <div id='xiao'>
        <b class="font_32">基础信息</b>
        <row class='order_all'>
      <dl>
        <dt>销售单号：{{formItem.orderNo}}</dt>
        <!-- <dd>客户：{{formItem.cusOrgName}}</dd> -->
        <dd>
          客户：
          <Select id='kehu' v-model="cusOrg" 
            style="width:200px" 
            :placeholder="cusOrgPl" 
             @on-change='getDian'  
             filterable
             :label-in-value='true'
             >
               <Option v-for="(item,index) in optionsList" :value="JSON.stringify(item)"  :key="index" >{{ item.cusorgName }}</Option>
      
            </Select>
        </dd>
      </dl>
      <dl>
        <dt>供应商公司：{{formItem.shopOrgName}}</dt>
        <dd>管理员：{{formItem.adminName}}</dd>
      </dl>
      <dl>
        <dt>合同金额：{{formItem.money}}</dt>
        <dd>工程名称：
          <el-select @change="changeEngerName" size="small" style="width:220px" v-model="formItem.engerName" clearable  filterable  default-first-option placeholder="请输入工程名称">
             <el-option v-for="item in engineerNameList" :key="item.value" :label="item.label" :value="item.label" ></el-option>
              </el-option>
          </el-select>
          <!-- <Input v-model="formItem.engerName" @on-change="changeEngerName" style="width:160px;" /> -->
        </dd>
      </dl>
        
    </row>
    <row>
        <b class="font_32">合同信息</b>
        <span style="margin-right:20px">蓝色区域点击修改</span>
         <!-- 开始 -->
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
            </RadioGroup>

            <Input v-model="yijian" placeholder="请输入" @on-change='paiceName' style="width: 150px" />
            <Button type='primary' style='margin-left:8px; margin-right:10px;' @click='addAll'>一键添加——></Button>
            <Select v-model="chosePrice" style="width:150px" @on-change='getValue'>
                <Option v-for="(item,index) in priceChose" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
         <!-- 结束 -->
        <Button  type='primary' style='margin-left:30px;margin-bottom:15px;' @click="modal8 = true" >选择库存资源</Button>

           <!-- 新修改的table -->
        <vxe-table size="mini" 
        border class="vxe-table-element" 
        :highlight-cell='false'  
        :data.sync="tableData"
        @edit-actived="currentChangeNew" 
         :edit-config="{key: 'id', trigger: 'click', mode: 'row',} ">
                 <vxe-table-column  fixed="left" label="操作"  min-width="100" align="center">
            
                    <template v-slot="{ row,rowIndex}">
                        <vxe-button type="text" @click='addNewItemFromTable(row,rowIndex)'  v-if="row.vType==1" >复制一行</vxe-button>
                        <vxe-button type="text"  v-if="row.vType==2||row.vType==3" @click='deleteRow(row,rowIndex)'>删除</vxe-button>

                    </template>
               </vxe-table-column>
                <vxe-table-column fixed="left" prop='vType' :formatter="tableType" width="60" label="类型"></vxe-table-column> 

                <vxe-table-column  prop='id' width="60"  label="ID">
                        <template v-slot="{ row,rowIndex}">
                          <span v-if="row.vType==1" >{{row.id}}</span>

                    </template>
                  </vxe-table-column> 
                 <!-- 可编辑 -->
                <vxe-table-column fixed="left" prop="steelType" label="类别" width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column fixed="left" prop="steelName" label="品名" width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column fixed="left" prop="steelGuige" label="规格" min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column fixed="left" prop="steelPaihao" label="材质" min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="steelPinpai" label="钢厂" min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="steelWorks" label="提货方式" min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="jiaohuodi" label="交货地" min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="jizhongType" label="计重方式" min-width="80" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="jianshu" label="件数" min-width="100" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="weight" label="单件重" :formatter="this.$global.vxeTableWeight" min-width="120" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="zongzhongliang" label="总重量" :formatter="this.$global.vxeTableWeight" min-width="120" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="guapaijia" label="单价" :formatter="this.$global.vxeTableMoney" min-width="120" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="cusMoney" label="总金额" :formatter="this.$global.vxeTableMoney" min-width="120" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <!-- 新增网价 浮动价格  网价区域 网价备注 浮动价格-->
                <vxe-table-column prop="internetMoney" label="网价" min-width="140" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="floatMoney" label="浮动价格" min-width="140" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="region" label="网价区域" min-width="140" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="internetMoneyNote" label="网价备注" min-width="140" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                 <!-- 不可编辑 -->
                <vxe-table-column prop="kunbaohao" label="捆包号" min-width="140"  :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="jiesuanJianshu" label="结算件数" min-width="140" ></vxe-table-column>
                <vxe-table-column prop="jiesuanDanjia" label="结算单价" min-width="140" :formatter="this.$global.vxeTableMoney" ></vxe-table-column>
                <vxe-table-column prop="jiesuanWeight" label="结算重量" min-width="140"  :formatter="this.$global.vxeTableWeight"  ></vxe-table-column>
                <vxe-table-column prop="jiesuanMoney" label="结算金额" min-width="140"  :formatter="this.$global.vxeTableMoney"  ></vxe-table-column>
                <vxe-table-column prop="receiptStatus" label="是否收货" min-width="140"  :edit-render="{name: 'ElSelect',options:selectData}"></vxe-table-column>
                <vxe-table-column prop="invoiceWeight" label="收票重量" min-width="140" :formatter="this.$global.vxeTableWeight"  :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="invoiceMoney" label="收票金额" min-width="140" :formatter="this.$global.vxeTableMoney"  :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="invoiceNo" label="收票号码" min-width="140"  :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="invoiceStatus" label="是否收票" min-width="140"  :edit-render="{name: 'ElSelect',options:selectData}"></vxe-table-column>

                <!-- 可编辑 -->
                <vxe-table-column prop="buyRealDanjia" label="采购结算单价" :formatter="this.$global.vxeTableMoney" min-width="140" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="buyRealWeight" label="采购结算重量" :formatter="this.$global.vxeTableWeight" min-width="140" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>
                <vxe-table-column prop="buyRealMoney" label="采购结算金额" :formatter="this.$global.vxeTableWeight" min-width="140" :edit-render="{name: 'ElInput',autoselect: true}"></vxe-table-column>


        </vxe-table>
        <!-- 结束 -->
    </row>
    <row>
        <!-- 结束 -->
        <!-- 添加资源的时候的弹窗 -->
      
        <Modal
            title="库存资源"
            v-model="modal8"
            width='1300'
            :footer-hide="true"
            :mask-closable="false">
            <row>
                <Form :label-width="80" inline  :model="addFormOne">

                    <row>
                        <FormItem label="入库单号:" >
                        <i-input style="width:120px"  v-model="addFormOne.inStockNoLike" placeholder="请输入采购单号" />
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
                          <Select v-model="addFormOne.cname" @on-change='getSelectAdmin'  :label-in-value='true'  style="width:200px"  placeholder="请选择"   >
                            <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
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
                        <Page style='text-align:right;' @on-change='getChangeFen' :total="totalM" show-total  /> 
                    </row>

                  </Form>

            </row>
        </Modal>
        <!-- 22 -->
    </row>
    <row>
      <span>合同重量合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.accPrecision(contractTWeight,3)}}吨</span>
      <span>合同金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(contractTMoney)}}元</span>
      <span>件数合计：</span>
      <span style="color:red">{{contractTNumber}}件</span>
      <br>
      <span>实提重量合计：</span>
      <span  style="color:red;margin-right:20px">{{this.$global.accPrecision(tWeight,3)}}吨</span>
      <span>实提金额合计：</span>
      <span style="color:red">{{this.$global.isMoneyShow(tMoney)}}元</span>
      <p v-show="false">{{getTotal}}</p>
      <br>
      <Button type="primary" @click="addBtn"> 修改提交</Button>
    </row>
  </div>

</template>

<script>
import {findOrdersInfoAll,
updateOrderInfo,
addOrderInfo,
updateOrderStatus} from '@/api/data_8889'
import {findOrgCusAcc,findInStock,xiangMu} from '@/api/data'
import { mapMutations } from 'vuex'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {updateInStockInfo} from '@/api/cusData'
export default {
    name: 'sell_order_change_info',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        engineerNameList:[],//工程名称数组
        contractTWeight:0,
        contractTMoney:0,
        contractTNumber:0,
        tWeight:0,
        tMoney:0,
        ciickItem:'',
        // 开始
        tableData:[],//表格1展示的数据
        ids:0,
        dataZFei:[], //定义选择杂费公司的数组 
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
        tableDataTwo:'',//提交到数据的表格
        modal8:false,//添加资源到表格弹窗
        addFormOne:{ //添加资源弹窗的默认数据
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
        },
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
                        title: '入库单号',
                        key: 'inStockNo',
                        align: 'center',
                        width:'180'
                    },
                    
        ],//添加资源的弹窗的表格column
        dataSlip: [],//表格数组
        totalM:0, //添加资源表格分页总天数
        pagesizea:1,//添加资源默认分页第一页
        timeRuBeStart:'',//入库开始时间
        timeRuBeStop:'',//入库结束时间
        adminList:[],
        tableDataThree:'',//查询表格的数据
        // 结束
        cusOrg:"",
        cusOrgPl:'',
        optionsList:[],
        cusOrgItem:'',
        customerId:'',
        customerName:'',
        customerOrgId:'',
        customerOrgName:'',
        customerPhone:'',
        isChangeCus:false,
        isChangeEnger:false,
        dataCompany:[],
        tableItem:{},
        selectData:[{
          value:'1',
          label:'是'
        },{
          value:'0',
          label:"否"
        }],
      
        formItem: {
          companyName:'',
          orderNo:'',
          cusOrgName:'',
          shopOrgName:'',
          adminName:'',
          money:'',
          engerName:""
          },
          // ++++++++++++++++++++++++++++++++++++++++++++++
         data2:[],//添加表格使用的列表
         }
    },
    
    methods:{
        //查询工程
      getGongcheng(){
        let p  ={};
        p.pageSize ="99999"
        p.status = 1;
        this.engineerNameList = [];
        //替换接口 查询工程名称 xiangMu findOrderEngineering
        xiangMu(p).then(res=>{
          if(res.code =="100"){
            this.$Message.success("获取工程名称成功")
              res.data.list.map(item =>{
                let dic = {};
                dic.label =item.cname;
                dic.value =item.id;
                this.engineerNameList.push(dic);
              })
          }
        })
      },
      
       pushOrderInfo(){
         let row = this.$route.query;
        row.operateType  ="1"//查看
        sessionStorage.setItem('XiaoShou','')
        sessionStorage.setItem('XiaoShou',JSON.stringify(row))
            const route = {
               name: 'sell_order_info',
             }
             this.$router.push(route)
      },
      tableType({cellValue, row, column}){
            let a = ''
            switch (Number(cellValue)) {
              case 1:
                a = '原数据(1)'
                break;
             case 2:
                a = '复制一行数据(2)'
                break;
              case 3:
                a = '库存资源数据(3)'
                break;
              default:
                break;
            }
            return a;
      },
     //入库时间查询
     geiRuTime(item){
         this.timeRuBeStart=item[0];
         this.timeRuBeStop=item[1];
     },
     //获取管理员的名称
     getSelectAdmin(item){
      console.log(item);
      this.addFormOne.adminCname = item.label;
      },
      //table分页
      getChangeFen(page){
          
           this.pagesizea =page;
           this.searchM();
       },
      //销售单列表添加资源
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

         findInStock(param).then(res=>{
            if(res.code =="100"){
               
                let showA=false;
                res.data.list.map((item)=>{
                      item.showa=showA
               item.zongzhongliang = this.$global.accPrecision(item.zongzhongliang,3);  //总重量
               item.guapaijia      = this.$global.accPrecision(item.guapaijia,2);       //单价
               item.cusMoney       = this.$global.accPrecision(item.cusMoney,2);       //总金额
               item.jiesuanWeight  = this.$global.accPrecision(item.jiesuanWeight,3);   //结算重量
               item.jiesuanMoney   = this.$global.accPrecision(item.jiesuanMoney,2);    //结算金额
               item.invoiceWeight  = this.$global.accPrecision(item.invoiceWeight,3)    //收货重量
               item.invoiceMoney   = this.$global.accPrecision(item.invoiceMoney,2);    //收票金额
               item.inStockId = item.id;//库存id用来 修改库存信息使用
               item.jiesuanDanjia  = item.guapaijia;//结算单价没有值，赋值
               item.buyRealDanjia = item.guapaijia;
               item.buyRealWeight = this.$global.accMul(item.weight,item.xuniJianshu);//重量 = 单件重 *剩余件数
               item.buyRealMoney = this.$global.accMul(item.buyRealWeight,item.buyRealDanjia);//结算总金额 = 总重量 * 单价
                    if(this.data2.length>0){
                      this.data2.map(cell=>{
                          if(Number(cell.id) == Number(item.id)){
                             item.showa = true;
                            console.log("相等");
                            
                          }else{
                            console.log("不相等");

                          }
                          console.log("判断相等");

                          console.log(cell.id);
                          console.log(item.id);
                      })
                    }

                  })
                  console.log(res.data.list)
                  console.log(this.dataSlip)

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
      //点击查询销售单添加资源
      getCha(){
           this.searchM();
       },
             //添加到销售单
       tianAdd(index,row){

          //  //默认从库存中选择资源后，销售单价默认应为0或空
          //  row.guapaijia = 0;
          //  row.moneyAll = 0;
           //重新计算 总重量，用剩余件数 * 单件重
           let a = {};
           a= this.copyDeep(row);
           if(Number(a.xuniJianshu) != Number(a.jianshu)){
            a.zongzhongliang = this.$global.accMul(a.xuniJianshu,a.weight)
           }
           a.idStatus='2'//记录添加资源的数据来源
           a.vType = "3"
           this.ids ++;
           a.id = this.ids;
           this.tableData.push(a)
          //  this.copyDeep(this.data2)
           console.log('我是测试的数组')
           console.log(this.data2)
       },
       
     // templateData 是要复制的数组或对象，这样的数组或者对象就是指向新的地址的
      copyDeep(templateData) {
   
        return JSON.parse(JSON.stringify(templateData));
      },
       //获取radio的值
      getRadio(item){//根据radio的值去计算网价和浮动价
          this.radioValue=item
      },
        //获取一键添加input的值
    paiceName(e){
      this.namePrice=e.target.value;

    },
      //获取select的值
    getValue(item){
      console.log(item)
     this.priceVa=item

    },
     //一键添加
     addAll(){
       console.log(this.tableData)
       if(this.priceVa==''){
          this.$Notice.error({
                    title: '请选择添加类型',
                }); 
       }
       this.tableData.map((item)=>{ 
          if(this.priceVa==1){//浮动价
                    item.floatMoney=this.namePrice
          }
          else if(this.priceVa==2){//网价
                     item.internetMoney=this.namePrice
          }
          else if(this.priceVa==3){//所属区域
                     item.region=this.namePrice
          }
        
       })
     },
     //删除新增合同明细
     chanchu(row,rowIndex){
        this.data2.splice(rowIndex,1);
     },
      //查询公司
       getOrg(name){
       },
      //获取供应商选中的值
       getDian(item){
        const d=eval('(' + item.value + ')')
        this.cusOrgItem = d;
        this.customerId         = d.cusid           
        this.customerName       = d.cus              
        this.customerOrgId      = d.cusorgId                
        this.customerOrgName    = d.cusorgName                  
        this.customerPhone      = d.cusphone 
        
        this.isChangeCus = true;
       },
      changeEngerName(item){
        this.isChangeEnger = true;
      },
      //获取公司名字
      getComPany(){
             let param={};
          param.pageSize = 999999;
              
             findOrgCusAcc(param).then(res=>{
                  this.dataCompany=res.data.list
                 this.optionsList=res.data.list           
            })
         },
      setOrderInfo(){
          this.formItem.orderNo               = this.$route.query.ordersNo     
          this.formItem.cusOrgName            = this.$route.query.customerOrgName        
          this.formItem.shopOrgName           = this.$route.query.shopOrgName          
          this.formItem.adminName             = this.$route.query.userName        
          this.formItem.money                 = this.$global.isMoneyShow(this.$route.query.moneyAll) 
          this.formItem.engerName             = this.$route.query.gongcheng;
          this.cusOrgPl = this.$route.query.customerOrgName
          this.getOrderInfo(); 
      },
      getOrderInfo(){//查询订单明细信息
          let params = {};
          params.orderNo = this.$route.query.ordersNo;
          params.pageSize = 10000;
          findOrdersInfoAll(params).then(res =>{
            if(res.code =="100"){
              res.data.list.map(item=>{
                item.vType = "1" //1是原数据从后台获取的数据 2是 复制一行的数据 3是从库存选择的数据
               //添加默认条件进行判断
                item.isDelete              = false;
                item.changeStatus          = false;
                item.weight         = this.$global.accPrecision(item.weight,3);          //单件重
                item.zongzhongliang = this.$global.accPrecision(item.zongzhongliang,3);  //总重量
                item.guapaijia      = this.$global.accPrecision(item.guapaijia,2);       //单价
                item.cusMoney       = this.$global.accPrecision(item.cusMoney,2);       //总金额
                item.jiesuanWeight  = this.$global.accPrecision(item.jiesuanWeight,3);   //结算重量
                item.jiesuanMoney   = this.$global.accPrecision(item.jiesuanMoney,2);    //结算金额
                item.jiesuanDanjia  = this.$global.accPrecision(item.jiesuanDanjia,2);   //结算单价
                item.invoiceWeight  = this.$global.accPrecision(item.invoiceWeight,3)    //收货重量
                item.invoiceMoney   = this.$global.accPrecision(item.invoiceMoney,2);    //收票金额
                item.buyRealDanjia  = this.$global.accPrecision(item.buyRealDanjia,2);   //采购结算单价
                item.buyRealWeight  = this.$global.accPrecision(item.buyRealWeight,3)    //采购结算重量
                item.buyRealMoney   = this.$global.accPrecision(item.buyRealMoney,2);    //采购结算金额
                this.ids = item.id;//给ids 赋值，防止复制一行时 出现错误
               })
              this.tableData=res.data.list
            }else{
            }
          })
      },
    
      addBtn(){//TODO:
    
          this.updateOrderInfoFunciton();//修改订单明细
          this.updateOrderTInfo();//修改订单总信息
          this.addNewitemOrder();//如果有新的明细添加，调用添加接口
          this.updateISNumber();//记录添加资源数据
       },
       updateISNumber(){
             let p     = {};
                let plist = [];
                this.tableData.map(item=>{
                  if(item.vType==3){
                       let dic             = {};
                        dic.id          = item.inStockId
                        dic.xuniJianshu = item.xuniJianshu
                      plist.push(dic); 
                  } })
                  if(plist.length<=0){//没有数据不用提交
                    return false;
                  }
              p.pageOrderInfoList = plist
              updateInStockInfo(p).then(res =>{
                    if(res.code =='100'){
                      this.$Notice.success({
                        title:'修改库存成功',
                     })
                  }else{
                       this.$Notice.error({
                       title:'修改库存失败'
                      })
                  }
               })
       },
     
       updateOrderInfoFunciton(){
          let params = {};
          let pageOrderInfoList = [];
          this.tableData.map(item=>{
            let dic = {};
            dic.id             = item.id;
            dic.steelName      = item.steelName;      //品名
            dic.steelGuige     = item.steelGuige;     //规格
            dic.steelPaihao    = item.steelPaihao;    //材质
            dic.steelPinpai    = item.steelPinpai;    //钢厂
            dic.steelWorks     = item.steelWorks      //提货方式
            dic.jiaohuodi      = item.jiaohuodi       //交货地
            dic.jianshu        = item.jianshu         //件数
            dic.jizhongType    = item.jizhongType //计重方式
            
            // dic.xuniJianshu    = item.jianshu         //件数 虚拟件数是个减法

            dic.zongzhongliang = item.zongzhongliang  //总重量
            dic.weight         = item.weight          //单件重
            dic.guapaijia      = item.guapaijia       //单价
            dic.dijia      = item.guapaijia       //单价
            dic.cusMoney      = item.cusMoney       //总金额
            dic.orgMoney      = item.cusMoney       //总金额
            dic.kunbaohao      = item.kunbaohao       //捆包号

            // dic.jiesuanDanjia  = item.jiesuanDanjia   //结算单价 不修改
            // dic.jiesuanWeight  = item.jiesuanWeight   //结算重量
            // dic.jiesuanMoney   = item.jiesuanMoney    //结算金额

            dic.receiptStatus  = item.receiptStatus   //是否收货
            dic.invoiceWeight  = item.invoiceWeight   //开票重量
            dic.invoiceMoney   = item.invoiceMoney    //开票金额
            dic.invoiceNo      = item.invoiceNo       //开票号码
            dic.invoiceStatus  = item.invoiceStatus   //是否收票

                          //2019年5月5日13:40:08 新增 a:网价，b:浮动价,c:区域,d:网价备注;
                        dic.internetMoney     = item.internetMoney
                        dic.floatMoney        = item.floatMoney
                        dic.region            = item.region
                        dic.internetMoneyNote = item.internetMoneyNote
                        
                               //2019年7月10日14:37:25
                        dic.buyRealDanjia = item.buyRealDanjia
                        dic.buyRealWeight = item.buyRealWeight
                        dic.buyRealMoney =  item.buyRealMoney
                        //2019年6月25日15:32:05 添加修改客户信息
                        if(this.isChangeCus == true){
                            dic.customerId = this.customerId;
                            dic.cusName    = this.customerName
                            dic.cusOrgId   = this.customerOrgId
                            dic.cusOrgName = this.customerOrgName
                            dic.cusPhone   = this.customerPhone
                          }
                          if(item.vType == 1){
                              pageOrderInfoList.push(dic);
                          }
          })
          params.pageOrderInfoList = pageOrderInfoList; //第一个table的数组
          updateOrderInfo(params).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'修改订单明细成功',
                     duration:2,
                     onClose:res =>{
                         this.closeSelf();
                         this.pushOrderInfo();
                     }
                 })
             }else{
                 this.$Notice.error({
                     title:'修改订单明细失败'
                 })
             }
          })
       },
      updateOrderTInfo(){//修改订单的店铺信息和工程名称
              // if(this.isChangeCus ==false  && this.isChangeEnger == false){
              //   return false;
              // }
              let p = {};
              let plist = [];
              let dic = {};
              dic.id = this.$route.query.id;
              if(this.isChangeCus == true){

                      dic.customerId = this.customerId;
                      dic.cusName    = this.customerName
                      dic.cusOrgId   = this.customerOrgId
                      dic.cusOrgName = this.customerOrgName
                      dic.cusPhone   = this.customerPhone
              }
            
                if(this.isChangeEnger == true){
                  dic.gongcheng = this.formItem.engerName;
                }
                dic.zongzhongliang = this.contractTWeight;          //合同重量
                dic.zongjianshu    = this.contractTNumber;  //总件数
                dic.moneyAll       = this.contractTMoney;//总金额
                dic.orgMoneyAll    = this.contractTMoney;
                dic.beifenCusMoney = this.contractTMoney;
                dic.beifenMerMoney = this.contractTMoney;
              plist.push(dic);
              p.pageUpdateOrderList = plist;//
          updateOrderStatus(p).then(res =>{
                if(res.code =='100'){
                  this.$Notice.success({
                    title:'修改总订单信息成功',
                    duration:1,
                    onClose:res =>{
                    }
                 })
              }else{
                   this.$Notice.error({
                   title:'修改总订单信息失败'
                  })
              }
           })
       },
       addNewitemOrder(){//新增订单明细
          
          let params ={};
          let orderInfoList = [];
          let baseItem = this.tableData[0];//第二个table列表
            this.tableData.map(dic=>{
             let item = {};
             //传参时 不变的内容
                        item.ordersId           = baseItem.ordersId;
                        item.orderNo            = baseItem.orderNo;
                        item.status             = "1";

                        item.agentId            = baseItem.agentId
                        item.agentName          = baseItem.agentName
                        item.agentShortName     = baseItem.agentName
                        item.bankJgId           = baseItem.bankJgId
                        item.businessType       = baseItem.businessType
                        item.buyType            = baseItem.buyType
                        item.createCname        = this.$global.adminInfo.cname
                        item.createEname        = this.$global.adminInfo.ename
                        item.customerId         = baseItem.customerId
                        item.customerName       = baseItem.customerName;
                        item.customerOrgId      = baseItem.customerOrgId
                        item.customerOrgName    = baseItem.customerOrgName;
                        item.customerPhone      = baseItem.customerPhone
                        item.invoiceApplyMoney  = "0"
                        item.invoiceApplyWeight = "0"
                        item.ordersType         = baseItem.ordersType
                        item.payType            = baseItem.payType
                        item.shopId             = baseItem.shopId
                        item.shopName           = baseItem.shopName
                        item.shopOrgId          = baseItem.shopOrgId
                        item.shopOrgName        = baseItem.shopOrgName;
                        item.shopSteelId        = '';
                        item.shopUserId         = baseItem.shopUserId;
                        item.userId             = baseItem.userId

                        //下面是根据列表取的内容
                        item.inStockId    = dic.inStockId;

                        item.cusMoney     = dic.cusMoney
                        item.orgMoney     = dic.cusMoney//底价总额

                        item.dijia        = dic.guapaijia
                        item.guapaijia    = dic.guapaijia

                        item.jianshu      = dic.jianshu
                        item.xuniJianshu  = dic.jianshu

                        item.jiaohuodi    = dic.jiaohuodi
                        item.jizhongType  = dic.jizhongType
                        item.kunbaohao    = dic.kunbaohao
                        item.merMoney     = dic.cusMoney
                        item.steelGuige   = dic.steelGuige
                        item.steelName    = dic.steelName
                        item.steelPaihao  = dic.steelPaihao
                        item.steelPinpai  = dic.steelPinpai
                        item.steelWorks   = dic.steelWorks
                        item.steelType    = dic.steelType//类别

                        item.weight       = dic.weight
                        item.zongzhongliang = dic.zongzhongliang
                        //新增的字段
                        item.jiesuanDanjia = dic.jiesuanDanjia
                        item.jiesuanMoney  = dic.jiesuanMoney
                        item.jiesuanWeight = dic.jiesuanWeight
                        item.jiesuanJianshu =  dic.jianshu

                        item.receiptStatus = dic.receiptStatus
                        item.invoiceMoney  = dic.invoiceMoney
                        item.invoiceWeight = dic.invoiceWeight
                        item.invoiceStatus = dic.invoiceStatus
                        item.invoiceNo     = dic.invoiceNo


                        //2019年5月5日13:40:08 新增 a:网价，b:浮动价,c:区域,d:网价备注;
                        item.internetMoney     = dic.internetMoney
                        item.floatMoney        = dic.floatMoney
                        item.region            = dic.region
                        item.internetMoneyNote = dic.internetMoneyNote
                        //2019年7月10日14:37:25
                        item.buyRealDanjia = dic.buyRealDanjia
                        item.buyRealWeight = dic.buyRealWeight
                        item.buyRealMoney = dic.buyRealMoney
                          if(dic.vType != 1){
                            orderInfoList.push(item);  
                          }
          })
          if(orderInfoList.length<=0){
            return;
          }
          params.pageOrderInfoList= orderInfoList;
          addOrderInfo(params).then(res =>{
             if(res.code =='100'){
                 this.$Notice.success({
                     title:'订单添加明细成功',
                      duration:1,
                      onClose:res =>{
                   }
                 })
             }else{
                 this.$Notice.error({
                     title:'订单添加明细失败'
                 })
             }
          })
       },
       //记录添加资源的数据接口
      updateInstockFunction(){//提交成功后修改库存件数
                let p     = {};
                let plist = [];
                this.tableData.map(item=>{
                  if(item.vType==3){
                       let dic             = {};
                        dic.id          = item.inStockId
                        dic.xuniJianshu = item.xuniJianshu
                      plist.push(dic); 
                  } })
              p.pageOrderInfoList = plist
              console.log(plist);
              updateInStock(p).then(res =>{
                    
               })
             
             
       },
       toreload(){//通知列表页面刷新数据
          console.log("准备关闭2")
           Utils.$emit('demo','reload');
       },
        ...mapMutations([
        'closeTag'
      ]),
      closeSelf(){
        this.closeTag({
          name:'sell_order_change_oinfo_vxeTable',
          query:this.$route.query
        })
      },
      deleteRow(row,rowIndex){//删除一行
          this.tableData.splice(rowIndex,1);
      },
    //复制一行到table表格
    addNewItemFromTable(row,rowIndex){//TODO
      let a = {};
      a = this.copyDeep(row);
      a.vType = "2"
       this.ids++;
       a.id = this.ids;
      this.tableData.push(a);
    },
     currentChangeNew({row,rowIndex,$rowIndex,column,columnIndex,$columnIndex,cell},event){
        this.ciickItem =column.label; 
      },

    },
    
    mounted(){
     this.searchM();//查询接口table
     this.setOrderInfo();
     this.getComPany();
     this.getGongcheng();
    },
    watch: {
      tableData:{
          deep:true,
            handler:function(newVal,oldval){
            this.tableData.map(item=>{
               if(this.radioValue==1){
                    item.floatMoney = this.$global.accMinus(item.guapaijia,item.internetMoney)
                  }else if(this.radioValue==2){
                    item.internetMoney = this.$global.accMinus(item.guapaijia,item.floatMoney)
                  }
                  else{
                  }
            })
         },  
      },
      phone(value){
        console.log(value);
        this.tableData.map(item=>{
               if(this.radioValue==1){
                    item.floatMoney = this.$global.accMinus(item.guapaijia,item.internetMoney)
                  }else if(this.radioValue==2){
                    item.internetMoney = this.$global.accMinus(item.guapaijia,item.floatMoney)
                  }
                  else{
                  }
            })
      }
    },
     computed:{
      getTotal(){
        let  a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        let f= 0;

        // tWeight:0,//实提重量
        // tMoney:0,//实提金额
        // contractTMoney:0,//合同金额
        // contractTWeight:0,//合同重量
        console.log("kaishine")
        this.tableData.map(item=>{

            //自动计算 结算单价* 结算重量  = 结算金额
            if(this.ciickItem =="结算单价" || this.ciickItem == "结算重量"){

                item.jiesuanMoney=item.jiesuanDanjia*item.jiesuanWeight
            }
            if(this.ciickItem =="总重量" || this.ciickItem == "单价"){
                item.cusMoney = this.$global.accMul(item.guapaijia,item.zongzhongliang)
                item.cusMoney = this.$global.accPrecision(item.cusMoney,3);
            }
            
           a = this.$global.accAdd(a,item.jiesuanWeight)
           b = this.$global.accAdd(b,item.jiesuanMoney)
           c = this.$global.accAdd(c,item.zongzhongliang)
           d = this.$global.accAdd(d,item.cusMoney)
           f = this.$global.accAdd(f,item.jianshu)
        })
        this.tWeight         = a;
        this.tMoney          = b;
        this.contractTWeight = c;
        this.contractTMoney  = d;
        this.contractTNumber  = f;
        return this.tableData
      }
    },
    created(){
    
    },
}

</script>
<style <style lang="less">
#kehu .ivu-select-input::-webkit-input-placeholder{
  color:red
}

.order_all{
  height:100px;
  background:rgba(235,254,255,1);
  border:1px dashed rgba(134,223,228,1);
  display:flex;
  dl{
    flex:1;
    padding-top:20px;
    dt{
     height:14px;
      font-size:14px;
      font-family:SourceHanSansCN-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:14px;
      text-indent:20px;
      margin-bottom:20px;
    }
    dd{
      height:14px;
      font-size:14px;
      text-indent:20px;
      font-family:SourceHanSansCN-Regular;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:14px
    }
  }
}
.font_32 {
        font-size: 32;
    }
        .vxe-table--body {
    padding-left: 0 !important;
    padding-right: 0 !important;
}

 #xaio .vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
      }
     #xaio .vxe-table .vxe-cell {
      padding: 0 2px;
      }
     #xaio .vxe-table.vxe-editable.size--mini .vxe-body--column{
       height:20px!important
     }

</style>