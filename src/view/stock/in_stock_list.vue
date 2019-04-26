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
            <Select v-model="orgSearch" style="width:200px" filterable placeholder="请选择名称"  @on-change='getDian'  :label-in-value='true'>
               <Option v-for="(item,index) in shopList" :value="item.cusorgId" :label="item.cusorgName" :key="index" >{{ item.cusorgName }}</Option>
      
            </Select>
          </FormItem>
            <FormItem label='创建时间'>
              <DatePicker style="width:200px" @on-change="changeCreateTieme" format="yyyy-MM-dd" v-model="formItem.dateTime" type="daterange" :options="options" placement="bottom-end" placeholder="选择日期" >
              </DatePicker>
            </FormItem>
           
          <FormItem label="管理员查询:">
            <Select v-model="adminSearch"  style="width:200px" filterable placeholder="请选择名称"  @on-change='getAdmin'  :label-in-value='true'>
               <Option v-for="(item,index) in adminList " :value="item.id" :label="item.cname" :key="index" >{{ item.cname }}</Option>
      
            </Select>
          </FormItem>
           <FormItem label="每页显示:">
            <Select v-model="formItem.length"  style="width:200px"  placeholder="请选择"   >
               <Option v-for="(item,index) in lengthListThis " :value="item.value" :label="item.value" :key="index" >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label='入库号'>
            <Input style="width:200px" v-model='formItem.rukuNo' placeholder='请输入入库号码'/>
          </FormItem>
           <FormItem label='捆包号'>
            <Input style="width:200px" v-model='formItem.kunbaohao' placeholder='请输入捆包号'/>
          </FormItem>
          <FormItem label='是否显示全部'>
             <Select v-model="formItem.isAll"  style="width:200px"  placeholder="请选择"   >
               <Option  :value="-1"  >全部</Option>
               <Option  :value="0"  >已售完</Option>
               <Option  :value="1"  >未售完</Option>
            </Select>
          </FormItem>
          </Col>
        
          <Col span="3">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </Col>
        </Row>
        <Table border ref="selection" size="small" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            <!-- <div slot="footer" style="height:100px">
              <td style="width:660px">合计</td>
              <td style="width:100px;text-align: center;">11</td>
              <td style="width:100px">-</td>
              <td style="width:100px;text-align: center;">2222</td>
            </div> -->
        </Table>

        <Page @on-change="changePage" style="margin-top:10px;text-align:right;"   :total="totalM" show-total ></Page>
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
getUserList} from '@/api/data'
import {getReceiptStatusLabel,getInvoiceStatusLabel} from '@/libs/allStatus'
import Utils from '@/api/middle'
import {lengthList} from '@/libs/global_type'
import {
    findOrdersInfoAll,
            } from '@/api/data_8889'

export default {
    name: 'in_stock_list',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
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
        datam1:[],
        modal:false,
        modal1:false,
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
          length:'',
          rukuNo:'',//入库号码
          kunbaohao:'',//捆包号
          isAll:1,
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
          columns4: [
             {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'200',
                        render: (h, params) => {
                            return h('div', [

                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                          // this.remove(params.index);
                                          this.$Modal.confirm({
                                           title:"确定需要删除吗",
                                           onOk:()=>{
                                             this.deleteItem(params.row);
                                           }
                                         })
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                          this.modal = true;
                                          this.setModalItem(params.row);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                          this.getItemUserList(params.row);
                                        }
                                    }
                                }, '使用记录'),
                             ]);
                      }
                        
                    },
                     {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '入库单号',
                        key: 'inStockNo',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '捆包号',
                        key: 'kunbaohao',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '品名',
                        key: 'steelName',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '规格',
                        key: 'steelGuige',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '材质',
                        key: 'steelPaihao',
                        align: 'center',
                        width:'150',
                    },
                    {
                        title: '钢厂',
                        key: 'steelPinpai',
                        align: 'center',
                        width:'120',
                    },
                    // {
                    //     title: '提货方式',
                    //     key: 'steelWorks',
                    //     align: 'center',
                    //     width:'100',
                    // },
                    //  {
                    //     title: '交货地',
                    //     key: 'jiaohuodi',
                    //     align: 'center',
                    //     width:'100',
                    // },
                    {
                        title: '入库件数',
                        key: 'jianshu',
                        align: 'center',
                        width:'100',
                    },
                    
                     {
                        title: '剩余件数',
                        key: 'xuniJianshu',
                        align: 'center',
                        width:'100',
                    },
                    {
                        title: '单件重',
                        key: 'weight',
                        align: 'center',
                        width:'100',
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
                        width:'200',
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
                        width:'200',
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
                        title: '入库时间',
                        key: 'createTime',
                        align: 'center',
                        width:'200'
                    },
                    {
                        title: '供应商名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'200'
                    },
                    // {
                    //     title: '采购方名称',
                    //     key: 'customerOrgName',
                    //     align: 'center',
                    //     width:'200'
                    // },
                    // {
                    //     title: '管理员',
                    //     key: 'createCname',
                    //     align: 'center',
                    //     width:'200'
                    // },
                    
                ],
                data1: [],//表格展示的数据
                dataCount:0,//总页数
                // pageSize:10,  //每页总条数
                searchPage:1 //初始化时查询的页码数
                
      }
    },
    
    methods:{
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
        console.log(item)
        this.shopOrgName = item.label;
        this.shopOrgId = item.value;
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
        console.log(item);
        this.adminSearchId = item.value;
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
         param.pageNum     = this.pagesizea      //分页
         param.beginStatus = 1 ;
         param.endStatus   = 11 ;
         param.userId      = this.adminSearchId  //管理员查询
         param.shopOrgId   = this.shopOrgId      //供应商
         param.beginTime   = this.formItem.beginTime      //创建时间 
         param.endTime     = this.formItem.endTime        //供应商
         param.inStockNoLike     = this.formItem.rukuNo //入库单号        //供应商
         param.pageSize      = this.formItem.length;
         param.kunbaohao = this.formItem.kunbaohao;
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
    
    created(){
   
    },
}

</script>
<style  <style lang="less">
.width_150 {
width: 200px;
}

</style>
