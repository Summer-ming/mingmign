<!--
 * @Description: 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-11 18:58:00
 -->
<!--
 * @Description: 审核采购单列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-08 13:31:05
 -->


<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form :model="formItem" inline :label-width="100">
        <Row>
          <Col span="24">
           <FormItem label="供应商查询:">
            <Select clearable v-model="orgSearch" style="width:100px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
      
            </Select>
          </FormItem>
            <FormItem label='创建时间'>
              <DatePicker style="width:100px" @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" >
              </DatePicker>
            </FormItem>
           
          <FormItem label="管理员查询:">
            <Select clearable v-model="adminSearch"  style="width:100px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
      
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label='入库号'>
            <Input clearable style="width:100px" v-model='formItem.rukuNo' placeholder='请输入入库号码'/>
          </FormItem>
           <FormItem label='捆包号'>
            <Input clearable style="width:100px" v-model='formItem.kunbaohao' placeholder='请输入捆包号'/>
          </FormItem>
          <FormItem label='是否显示全部'>
             <Select clearable v-model="formItem.isAll"  style="width:100px"  placeholder="请选择"   >
               <Option  :value="-1"  >全部</Option>
               <Option  :value="0"  >已售完</Option>
               <Option  :value="1"  >未售完</Option>
            </Select>
          </FormItem>
          <FormItem label="入库类型">
            <Select clearable v-model="formItem.businessType" style="width:100px" placeholder="请选择入库类型">
                <Option v-for="(item,index) in ISBusinessTypeListThis" :value="item.value" :lable="item.value" :key="index">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="公司抬头:">
            <Select clearable v-model="formItem.bankJgId"  style="width:100px"  placeholder="请选择"   >
               <Option v-for="(item,index) in belongCompanyListThis " :value="item.value" :label="item.label" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>

          <Col span="3">
             <Button size="small" type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button size="small" shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
        </Row>
       <vxe-toolbar>
          <template v-slot:buttons>
             <Button  size='small'   @click="deleteRowItem">删除</Button>
             <Button  size='small' style="margin-left:20px"  @click="changeRowItem">修改</Button>
             <Button  size='small' style="margin-left:20px"  @click="getHistoryRowItem">使用记录</Button>
             <Button  size='small' style="margin-left:20px"  @click="exportCsvEvent">默认导出csv</Button>

          </template>
        </vxe-toolbar>
       <vxe-table
              border
              ref="xTable1"
              size="mini"
              height="400"
              :data.sync="data1">
              <!-- //第一部分采购单相关信息 -->
           <vxe-table-column  width="80"  title="单选">
                   <template v-slot="{row}">
                        <el-radio v-model="single" @change="radioChangeEvent" :label="JSON.stringify(row)">{{row.id}}</el-radio>
                    </template>
          </vxe-table-column>
              <!-- <vxe-table-column field="id"   title="ID"  min-width='80'></vxe-table-column> -->
                <vxe-table-column width="100" field="steelName" title="品名"  ></vxe-table-column>
                <vxe-table-column width="100" field="steelGuige" title="规格" ></vxe-table-column>
                <vxe-table-column width="100" field="steelPaihao" title="材质" ></vxe-table-column>
                <vxe-table-column width="100" field="steelPinpai" title="钢厂"></vxe-table-column>

                <vxe-table-column width="100" field="jianshu"  title="入库件数"></vxe-table-column>
                <vxe-table-column width="100" field="xuniJianshu"  title="剩余件数"></vxe-table-column>
                <vxe-table-column width="100" field="weight" :formatter="this.$global.vxeTableWeight" title="单件重"></vxe-table-column>
                <vxe-table-column width="100" field="zongzhongliang" :formatter="this.$global.vxeTableWeight" title="入库总重量"></vxe-table-column>
                <vxe-table-column width="100" field="createTime"  title="入库时间"></vxe-table-column>
                <vxe-table-column width="100" field="shopOrgName"  title="供应商名称"></vxe-table-column>
                <vxe-table-column width="100" field="kunbaohao"  title="捆包号"></vxe-table-column>
                <vxe-table-column width="100" field="inStockNo"  title="入库单号"></vxe-table-column>
                <vxe-table-column width="100" field="guapaijia" :formatter="this.$global.vxeTableMoney"  title="入库单价"></vxe-table-column>
                <vxe-table-column width="100" field="cusMoney" :formatter="this.$global.vxeTableMoney" title="入库总金额"></vxe-table-column>
                <vxe-table-column width="100" field="businessType" :formatter="getBusinessTypeList" title="入库类型"></vxe-table-column>
            </vxe-table>

      <span>当页：入库重量合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.accPrecision(tWeight,3)}}吨</span>
      <br>
      <span>全部：入库重量合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.accPrecision(tAllWeight,3)}}吨</span>
      <span>入库金额合计：</span>
      <span style="color:red;margin-right:20px">{{this.$global.isMoneyShow(tAllMoney,2)}}元</span>
     <p style="disaply:none">{{getTotal}}</p>

      <br>
        <Page @on-change="changePage" style="margin-top:10px;text-align:right;" :page-size="formItem.length"  :total="totalM" show-total ></Page>
        <br>
     </Form>
     </Card>    
      <Modal
        title="修改库存"
        v-model="modal" 
        :mask-closable="false" :footer-hide="true"  width='900px;' >
        <Form  inline :model="changeItem"  :label-width="100">
          <p>ID:{{changeItem.id}}</p>
        <FormItem label="捆包号" style="width:200px" >
            <Input v-model="changeItem.kunbaohao" placeholder="输入捆包号"></Input>
        </FormItem>
        <FormItem label="品名"  style="width:200px" >
            <Input v-model="changeItem.steelName" placeholder="输入品名"></Input>
        </FormItem>
        <FormItem label="规格" style="width:200px" >
            <Input v-model="changeItem.steelGuige" placeholder="输入规格"></Input>
        </FormItem>
        <FormItem label="材质" style="width:200px" >
            <Input v-model="changeItem.steelPaihao" placeholder="输入材质"></Input>
        </FormItem>
        <FormItem label="钢厂" style="width:200px" >
            <Input v-model="changeItem.steelPinpai" placeholder="输入钢厂"></Input>
        </FormItem>
        <FormItem label="入库件数" style="width:200px" >
            <Input v-model="changeItem.jianshu" placeholder="输入入库件数"></Input>
        </FormItem>
        <FormItem label="剩余件数" style="width:200px" >
            <Input v-model="changeItem.xuniJianshu" placeholder="输入剩余件数"></Input>
        </FormItem>
        <FormItem label="单件重" style="width:200px" >
            <Input v-model="changeItem.weight" placeholder="输入单件重"></Input>
        </FormItem>
        <FormItem label="入库总重量" style="width:200px" >
            <Input v-model="changeItem.zongzhongliang" placeholder="输入入库总重量"></Input>
        </FormItem>
        <FormItem label="入库单价" style="width:200px" >
            <Input v-model="changeItem.guapaijia" placeholder="输入单价"></Input>
        </FormItem>
        <FormItem label="入库总金额" style="width:200px" >
            <Input v-model="changeItem.cusMoney" placeholder="输入总金额"></Input>
        </FormItem>
            <div class="margin-top-20">
                  <Button style="margin-right:10px" type="primary" @click="changeBtn">修改</Button>
                  <Button  type="default" @click="modalCancel">取消</Button>
            </div>
    </Form>
    </Modal>

    <!-- 显示库存使用记录的modal -->
    <Modal
        title="库存记录"
        v-model="modal1" 
        :mask-closable="false" :footer-hide="true"  width='900px;' >
             <Table border  size="small" :columns="columnsm1" :data="datam1" style='margin-bottom:10px;'>
             </Table>
            <div class="margin-top-20">
                  <Button  type="default" @click="modalCancel">取消</Button>
            </div>
    </Modal>
     </div>
</template>

<script>
import {findInStock,
findShop,
findOrgCusAcc,
updateInStock,
getUserList,findInStockSum} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel,ISBusinessTypeStr} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList,ISBusinessTypeList,belongCompanyList} from '@/libs/global_type'
import {
    findOrdersInfoAll,
            } from '@/api/data_8889'

export default {
    name: 'in_stock_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        single:false,
        tAllMoney:0,
        tAllWeight:0,
        columnsm1:[
                    {
                        title: '序号',
                        width:'80',
                        render: (h, params) => {
                            return h('span', params.index+1);
                        }
                    },
                     {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'60'
                    },
                    {
                        title: '订单号',
                        key: 'orderNo',
                        align: 'center',
                        width:'200',
                    },
                     {
                        title: '件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '时间',
                        key: 'createTime',
                        align: 'center',
                        width:'200'
                    },
        ],
        belongCompanyListThis:belongCompanyList,
        ISBusinessTypeListThis:ISBusinessTypeList,
        datam1:[],
        modal:false,
        modal1:false,
        tWeight:0,
        selectRow: null,
        changeItem:{
          id:'',
          kunbaohao:'',
          steelName:'',
          steelGuige:'',
          steelPaihao:'',
          steelPinpai:'',
          jianshu:'',
          xuniJianshu:'',
          weight:'',
          zongzhongliang:'',
          guapaijia:'',
          cusMoney:'',
        },
        shopList:[],
        lengthListThis:lengthList,
        showIdK       :'',
        agentId       :'',
        agentShortName:'',
        shopId        :'',
        shopName      :'',
        shopOrgName   :'',
        shopUserId    :'',
        shopOrgId     :'',
        orgSearch:'',
        adminSearchId:"",
        adminSearch:'',
        adminList:[],
        tableItem:{},
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        formItem: {
          companyName:'',
          dateTime:'',
          beginTime:"",
          endTime:"",
          length:10,
          rukuNo:'',//入库号码
          kunbaohao:'',//捆包号
          isAll:1,
          businessType:'',//入库类型
          bankJgId:''
          },
        options:{
          shortcuts:[
             {
                            text: '1周',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '一个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '3个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
          ]
        },
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
      exportCsvEvent () {
              this.$refs.xTable1.exportCsv()
            },
      deleteRowItem(){
        if(this.selectRow){
               this.$Modal.confirm({
                         title:"确定需要删除吗",
                         onOk:()=>{
                           this.deleteItem(this.selectRow);
                         }
                       })
        }else{
          this.$Message.warning("请选择一条明细")
        }
      },
      changeRowItem(){

         if(this.selectRow){
            this.modal = true;
              this.setModalItem(this.selectRow);
        }else{
          this.$Message.warning("请选择一条明细")
        }
      },
      getHistoryRowItem(){
         if(this.selectRow){
            this.getItemUserList(this.selectRow);
        }else{
          this.$Message.warning("请选择一条明细")
        }
      },
      getBusinessTypeList({cellValue, row, column}){
        return ISBusinessTypeStr(cellValue)
      },
       radioChangeEvent(row){
            row = eval('('+row+')');;
              this.selectRow = row
              console.log('单选事件')
              console.log(this.selectRow);
            },
           
          
            getRadioEvent1 () {
              console.log(JSON.stringify(this.$refs.xTable1.getRadioRow()))
            },
      getItemUserList(row){//获取库存明细的使用记录；即库存明细的订单明细
        // datam1
        let p  ={};
          p.inStockId = row.id
          p.pageSize = 10000;
          this.datam1 = [];
        findOrdersInfoAll(p).then(res =>{
           if(res.code =='100'){
               this.datam1 = res.data.list;
               this.$Notice.success({
                   title:'获取库存明细成功',
               })
           }else{
               this.$Notice.error({
                   title:'获取库存明细失败'
               })
           }
        })
        this.modal1 = true;
      },
      setModalItem(row){
          this.changeItem.id             = row.id;
          this.changeItem.kunbaohao      = row.kunbaohao
          this.changeItem.steelName      = row.steelName
          this.changeItem.steelGuige     = row.steelGuige
          this.changeItem.steelPaihao    = row.steelPaihao
          this.changeItem.steelPinpai    = row.steelPinpai
          this.changeItem.jianshu        = row.jianshu
          this.changeItem.xuniJianshu    = row.xuniJianshu
          this.changeItem.weight         = this.$global.accPrecision(row.weight,3)
          this.changeItem.zongzhongliang = this.$global.accPrecision(row.zongzhongliang,2)
          this.changeItem.guapaijia      = this.$global.accPrecision( row.guapaijia,2)
          this.changeItem.cusMoney       = this.$global.accPrecision(row.cusMoney,2)
      },
      changeBtn(){//提交修改
            
      let p          = {};
      let plist      = [];
      let dic        = {};
          dic.id               = this.changeItem.id
          dic.kunbaohao        = this.changeItem.kunbaohao
          dic.steelName        = this.changeItem.steelName
          dic.steelGuige       = this.changeItem.steelGuige
          dic.steelPaihao      = this.changeItem.steelPaihao
          dic.steelPinpai      = this.changeItem.steelPinpai
          dic.jianshu          = this.changeItem.jianshu
          dic.xuniJianshuEqual = this.changeItem.xuniJianshu
          dic.weight           = this.changeItem.weight
          dic.zongzhongliang   = this.changeItem.zongzhongliang
          dic.guapaijia        = this.changeItem.guapaijia
          dic.cusMoney         = this.changeItem.cusMoney
      plist.push(dic); 
      p.pageOrderInfoList = plist 
        updateInStock(p).then(res =>{
           if(res.code =='100'){
               this.$Notice.success({
                   title:'修改成功',
                    duration:2,
                    onClose:res =>{
                      this.reload();
                 }
               })
           }else{
               this.$Notice.error({
                   title:'修改失败'
               })
           }
        })
      },
      modalCancel(){
        this.modal =false;
        this.modal1 = false;

      },
      deleteItem(row){//删除库存

      let p          = {};
      let plist      = [];
      let dic        = {};
          dic.id     = row.id;
          dic.status = 0;
      plist.push(dic); 
      p.pageOrderInfoList = plist 
        updateInStock(p).then(res =>{
           if(res.code =='100'){
               this.$Notice.success({
                   title:'删除成功',
                    duration:1,
                    onClose:res =>{
                      this.reload();
                 }
               })
           }else{
               this.$Notice.error({
                   title:'修改失败'
               })
           }
        })
      },
      getShop(){
        let param = {};
        param.pageNum ="1";
        param.orgRoleType = "2";
        param.pageSize = "999999"
          findOrgCusAcc(param).then(res=>{
            if(res.code =="100"){
             this.shopList=res.data.list
          }  
         })
       },
        getDian(item){
          if(item){
            this.shopOrgName = item.label;
            this.shopOrgId = item.value;
          }
        
       },
      changeCreateTieme(data){
        console.log(data);
        this.formItem.beginTime  =data[0] +' 00:00:00';
        this.formItem.endTime  =data[1]+' 24:00:00';

      },
      propsClick(){
        console.log("回调成功");
        this.reload();
      },
      getAdmin(item){
        if(item){
        this.adminSearchId = item.value;
        }
      },
        reloadSelf(){
            this.reload();
        },
       //分页
       changePage(index){
           console.log(index)
           this.pagesizea=index;
           this.searchM();
       },
       selectOne(row){
         console.log(row)
       },
       //查询表格
       searchM(){

         //获取查询的input的值
         let param={};
        //  shopOrgId //店铺id
         param.pageNum       = this.pagesizea               //分页
         param.beginStatus   = 1 ;
         param.endStatus     = 11 ;
         param.userId        = this.adminSearchId           //管理员查询
         param.shopOrgId     = this.shopOrgId               //供应商
         param.beginTime     = this.formItem.beginTime      //创建时间 
         param.endTime       = this.formItem.endTime        //供应商
         param.inStockNoLike = this.formItem.rukuNo         //入库单号        //供应商
         param.pageSize      = this.formItem.length;
         param.kunbaohao     = this.formItem.kunbaohao;
         param.businessType  = this.formItem.businessType;
         param.bankJgId = this.formItem.bankJgId;
         switch (this.formItem.isAll) {
           case -1:
             
             break;
         case 0:
         param.xuniJianshu = 0;
             break;
             case 1:
         param.xuniJianshuBig0 = 0;
             break;
           default:
             break;
         }

          console.log(param);
          this.data1 = [];
           findInStock(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
            this.getListTotal(param);
          }  
         })
       },
       getListTotal(p){//获取汇总数据
          findInStockSum(p).then(res =>{
                if(res.code =='100'){
                  let dic =res.data.list[0];
                  this.tAllMoney =dic.cusMoney;
                  this.tAllWeight = dic.zongzhongliang;
                  this.$Notice.success({
                    title:'查询汇总数据成功',
                 })
              }else{
                   this.$Notice.error({
                   title:'查询汇总数据失败'
                  })
              }
           })
       },
       getAdminList(){
         let param = {};
         param.pageSize = "99999"
         param.status  ="1"
        //  adminList
        getUserList(param).then(res=>{
            if(res.code =="100"){
            this.adminList=res.data.list;
          }  
         })
       }
    },
    
    mounted(){
     this.searchM();
     this.getShop();
     this.getAdminList();
     var that = this;
     Utils.$on('demo',function(msg){
       console.log(msg);
       if(msg == "reload"){
        that.propsClick();
       }
     })
    },
    watch: {
        radioChangeEvent(row){
          console.log("watch")
          console.log(row)
        }
    },
    computed:{
      getTotal(){
        let  a = 0;

        this.data1.map(item=>{
           a = this.$global.accAdd(a,item.zongzhongliang)
        })
        this.tWeight         = a;
      }
    },
    created(){
   
    },
}

</script>
<style  <style lang="less">
.width_150 {
width: 200px;
}
.vxe-table.size--mini .vxe-body--column{
        padding: 0px 0!important;
       
      }
      .vxe-table{
        padding: 0px 0!important;
      }
</style>
