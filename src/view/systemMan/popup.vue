<!--
 * @Description: 采购单付款列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-09 15:10:51
 -->
<template>
     <div>
       <Modal title="选择订单资源" v-model="modal2" @on-visible-change='getFan'  footer-hide :mask-closable="false"  width='1600px;' >
          <Row>
             <Form :label-width="100" inline >
                <!-- <FormItem label="供应商店铺查询:">
                    <Select v-model="gongYingShang" style="width:200px" placeholder="请输入店铺名称"  @on-change='getDian'  :label-in-value='true'>
                      <Option v-for="(item,index) in shopList" :value="JSON.stringify(item)" :label="item.name" :key="index" >{{ item.name }}</Option>
                    </Select>
                </FormItem> -->

                <!-- <FormItem label='采购方名称'>
                      <Select  @on-change='getCai' style='width:150px'
                                  
                          v-model="caigou"
                          filterable
                          remote
                          :remote-method="remoteMethod3"
                          :loading="loading3">
                            <Option v-for="(option, index) in options3" :value="option.value" :key="index">{{option.label}}</Option>
                      </Select>
                </!--> 

              <FormItem label="下单时间">
                 <i-Col span="12">
                      <DatePicker type="daterange" @on-change='getData' placement="bottom-end" placeholder="请选择日期" style="width: 200px"></DatePicker>
                 </i-Col>

              </FormItem>

             </Form>

             <!-- 查询 -->
             <Row style='padding-left:30px;'>
                 <Button @click='getMM'  type="primary">查询</Button>
             </Row>
             <!-- 选择订单资源的表格 -->
             <Row>
                <Table :columns="columnOne" :data="dataOne"></Table>
                <Page @on-change="changePageOne" style="margin-top:10px;text-align:right;"   :total="totalOne" show-total ></Page>
             </Row>



          </Row>

      
       
        
       </Modal>
     </div>
</template>

<script>
import {findJgJieSuanInfo,updateShopMoneyJieSuanMer} from '@/api/data'
import {findShop,findOrgCusAcc,findOrdersAll} from '@/api/data';//查询店铺  查询公司
import Utils from '@/api/middle'
import {findOrdersAll89} from '@/api/data_8889'
export default {
    name: 'popup',
    props:['message','message1','choseItem'],
    //choseItem 中 type  1 = 客户订单 2= 供应商订单 
    data(){
      return {
        dataOne:[],//选择资源数组
        dataTwo:[],//选择资源添加后的数组
        columnOne:[
                    {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        fixed:'left',
                        width:'100',
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled:params.row.showa
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                               params.row.showa=true
                                               this.dataTwo.push(params.row)
                                               //向选择添加资源的弹窗列表添加一个字段来保存选择金额
                                               this.dataTwo.map((item)=>{
                                                      item.xuanMoney=''
                                               })
                                               let dataNm={
                                                   //a:this.columnTwo, //子组件向父组件传的值columnThree
                                                   a:this.columnThree,
                                                   b:this.dataTwo
                                               };
                                               this.$emit('mychildOne',dataNm) //退客户款
                                               this.$emit('mychildOne1',dataNm)//退款供应商
                                               console.log(this.dataTwo)
                                               console.log(params.row)
                                        }
                                    }
                                }, '添加11'),
                             ]);
                             }    
                    },
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'60',
                    },
                    {
                        title: '订单号',
                        key: 'ordersNo',
                        align: 'center',
                        width:'120',
                    },
                      {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'120',
                    },
                     {
                        title: '销售方名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'120',
                    },
                  
                    {
                        title: '剩余可抵扣金额',
                        key: '',
                        align: 'center',
                        width:'120',
                        render:(h,params)=>{
                            if(this.choseItemChild.type =="2"){//采购单
                                //出金额
                                    let a = this.$global.accAdd(params.row.receivedMoney,params.row.tixianSMoney)
                                         a = this.$global.accAdd(a,params.row.dikouSmoney)
                                    //入金额
                                    let b = this.$global.accAdd(params.row.deliveryTotalMoneyCus,params.row.skSmoney)
                                    // let c = this.$global.accAdd(b,params.row.dikouSmoney)
                                        //差额 出 - 入
                                        let d = this.$global.accMinus(a,b)
                                        return h('div',[
                                            h('div',{
                                                
                                                style:{
                                                
                                            },
                                            },this.$global.isMoneyShow(d)),
                                        ])
                            }else{// 销售单 = 1
                                //出金额
                                    let a = this.$global.accAdd(params.row.tixianSMoney,params.row.dikouSmoney)
                                    let b = this.$global.accAdd(b,params.row.deliveryTotalMoneyCus)

                                    //入金额
                                    let c = this.$global.accAdd(params.row.skSmoney,params.row.receivedMoney)
                                        //差额 出 - 入
                                        let d = this.$global.accMinus(a,c)
                                        return h('div',[
                                            h('div',{
                                                
                                                style:{
                                                
                                            },
                                            },this.$global.isMoneyShow(d)),
                                        ])
                            }
                          
                        }
                    },
                    {
                        title: '合同金额',
                        key: 'moneyAll',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.moneyAll))
                        }
                    },
                    {
                        title: '合同重量',
                        key: 'zhongliangAll',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.accPrecision(params.row.zhongliangAll,3))
                        }

                    },
                    {
                        title: '结算重量',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                        }
                    },
                    {
                        title: '结算金额',
                        key: 'deliveryTotalMoneyCus',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.deliveryTotalMoneyCus))
                        }
                    },
                    //下面是用来计算的值
                    //下面是用来显示计算的数值
                     {
                        title: '已付款金额',
                        key: 'receivedMoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.receivedMoney))
                        }
                    },
                    {
                        title: '已提现金额',
                        key: 'tixianSMoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.tixianSMoney))
                        }
                    },
                     {
                        title: '已抵扣金额',
                        key: 'dikouSmoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.dikouSmoney))
                        }
                    },
                     
                     {
                        title: '已二次收款金额',
                        key: 'skSmoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.skSmoney))
                        }
                    },
                    //计算一共入金 多少，出金多少
                     {
                        title: '出金额',
                        key: '',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                             let t = 0;
                             if(this.choseItemChild.type =="2"){//采购单
                                let a = this.$global.accAdd(params.row.receivedMoney,params.row.tixianSMoney)
                                t = a;
                             }else{//销售单
                                      let a = this.$global.accAdd(params.row.tixianSMoney,params.row.dikouSmoney)
                                    let b = this.$global.accAdd(a,params.row.deliveryTotalMoneyCus)
                                    t = b;
                             }
                              return h('div',{

                                        },this.$global.isMoneyShow(t))
                         
                        }
                    },
                    {
                        title: '入金额',
                        key: '',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                             //计算采购单入的金额
                             let t = 0;
                             if(this.choseItemChild.type =="2"){//采购单
                                  let a = this.$global.accAdd(params.row.deliveryTotalMoneyCus,params.row.skSmoney)
                                let b = this.$global.accAdd(a,params.row.dikouSmoney)
                                    t = b
                             }else{
                                    let c = this.$global.accAdd(params.row.skSmoney,params.row.receivedMoney)
                                    t =c;
                             }
                          

                          return h('div',{

                          },this.$global.isMoneyShow(t))
                        }
                    },
                  
        ],//公共子组件的表头
        columnTwo:[
                   {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        fixed:'left',
                        width:'100',
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                            
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                             //this.dataTwo
                                             this.dataTwo.splice(params.index, 1);
                                             this.searchOne();
                                             //this.remove(params.index)
                                        }
                                    }
                                }, '删除d1'),
                             ]);
                        }    
                    },
                    {
                        title: '订单号',
                        key: 'ordersNo',
                        align: 'center',
                        width:'120',
                    },
                     {
                        title: '销售方名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '剩余可抵扣金额',
                        key: 'dikouMoney',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '合同金额',
                        key: 'moneyAll',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '合同重量',
                        key: 'zhongliangAll',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '结算重量',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '结算金额',
                        key: 'deliveryRequestMoneyOrg',
                        align: 'center',
                        width:'120',
                        
                    },
        ],//添加抵扣来源 子组件添加传到父组件的表头
        columnThree:[
                   {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        fixed:'left',
                        width:'100',
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                            
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                             //this.dataTwo
                                             this.dataTwo.splice(params.index, 1);
                                             this.searchOne();
                                             //this.remove(params.index)
                                        }
                                    }
                                }, '删除222'),
                             ]);
                        }    
                    },
                    {
                        title: '订单号',
                        key: 'ordersNo',
                        align: 'center',
                        width:'120',
                    },
                     {
                        title: '销售方名称',
                        key: 'shopOrgName',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '采购方名称',
                        key: 'customerOrgName',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '剩余可抵扣金额',
                        key: '',
                        align: 'center',
                        width:'120',
                        render:(h,params)=>{
                            if(this.choseItemChild.type =="2"){//采购单
                                //出金额
                                    let a = this.$global.accAdd(params.row.receivedMoney,params.row.tixianSMoney)
                                    //入金额
                                    let b = this.$global.accAdd(params.row.deliveryTotalMoneyCus,params.row.skSmoney)
                                    let c = this.$global.accAdd(b,params.row.dikouSmoney)
                                        //差额 出 - 入
                                        let d = this.$global.accMinus(a,c)
                                        return h('div',[
                                            h('div',{
                                                
                                                style:{
                                                
                                            },
                                            },this.$global.isMoneyShow(d)),
                                        ])
                            }else{// 销售单 = 1
                                //出金额
                                    let a = this.$global.accAdd(params.row.tixianSMoney,params.row.dikouSmoney)
                                    let b = this.$global.accAdd(b,params.row.deliveryTotalMoneyCus)

                                    //入金额
                                    let c = this.$global.accAdd(params.row.skSmoney,params.row.receivedMoney)
                                        //差额 出 - 入
                                        let d = this.$global.accMinus(a,c)
                                        return h('div',[
                                            h('div',{
                                                
                                                style:{
                                                
                                            },
                                            },this.$global.isMoneyShow(d)),
                                        ])
                            }
                          
                        }
                    },
                    {
                        title: '合同金额',
                        key: 'moneyAll',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.moneyAll))
                        }
                    },
                    {
                        title: '合同重量',
                        key: 'zhongliangAll',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.accPrecision(params.row.zhongliangAll,3))
                        }
                    },
                    {
                        title: '结算重量',
                        key: 'deliveryTotalWeight',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
                        }
                    },
                    {
                        title: '结算金额',
                        key: 'deliveryRequestMoneyOrg',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.deliveryRequestMoneyOrg))
                        }
                        
                    },
                    {
                        title: '选择金额',
                        key: 'xuanMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.xuanMoney,
                              type:'text',
                             
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-blur':(event)=>{
                                   this.dataTwo[params.index].xuanMoney=event.target.value
                                             let dataNm={
                                                   //a:this.columnTwo, //子组件向父组件传的值columnThree
                                                   a:this.columnThree,
                                                   b:this.dataTwo
                                               };
                                             this.$emit('mychildOne',dataNm) //退客户款
                                               this.$emit('mychildOne1',dataNm)//退款供应商
                              }
                            }

                          })
                        } 
                    },
                    //下面是用来显示计算的数值
                     {
                        title: '已付款金额',
                        key: 'receivedMoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.receivedMoney))
                        }
                    },
                    {
                        title: '已提现金额',
                        key: 'tixianSMoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.tixianSMoney))
                        }
                    },
                     {
                        title: '已抵扣金额',
                        key: 'dikouSmoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.dikouSmoney))
                        }
                    },
                     
                     {
                        title: '已二次收款金额',
                        key: 'skSmoney',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                          return h('div',{

                          },this.$global.isMoneyShow(params.row.skSmoney))
                        }
                    },
                    //计算一共入金 多少，出金多少
                     {
                        title: '出金额',
                        key: '',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
                             let t = 0;
                             if(this.choseItemChild.type =="2"){//采购单
                                let a = this.$global.accAdd(params.row.receivedMoney,params.row.tixianSMoney)
                                t= a;
                             }else{
                                      let a = this.$global.accAdd(params.row.tixianSMoney,params.row.dikouSmoney)
                                    let b = this.$global.accAdd(a,params.row.deliveryTotalMoneyCus)
                                    t =  b
                             }
                          return h('div',{

                          },this.$global.isMoneyShow(t))
                        }
                    },
                    {
                        title: '入金额',
                        key: '',
                        align: 'center',
                        width:'120',
                         render:(h,params) =>{
 //计算采购单入的金额
                             let t = 0;
                             if(this.choseItemChild.type =="2"){//采购单
                                  let a = this.$global.accAdd(params.row.deliveryTotalMoneyCus,params.row.skSmoney)
                                let b = this.$global.accAdd(a,params.row.dikouSmoney)
                                    t = b
                             }else{
                                    let c = this.$global.accAdd(params.row.skSmoney,params.row.receivedMoney)
                                    t =c;
                             }
                          return h('div',{

                          },this.$global.isMoneyShow(t))
                        }
                    },
        ],//可以选择金额的  子组件添加到传到父组件的表头

        totalOne:0, //表格分页总天数
        pagesizeaOne:1,//默认分页第一页
        beginTime:'',//下单开始时间
        stopTime:'',//下单结束时间


        
        caigou:'',//采购方
        loading3:false,
        options3:[],//采购方
        caigouData:[],
        caigouOne:[],
        paramCaiGou:{},//采购列表
        caiGouName:'',//采购方名称
        paramFirst:{},//查询采购方参数对像
        gongYingShang:"",//供应商初始值
        gongYingShangName:'',//供应商名字
        gongYingShangId:'',//供应商id
        shopList:[],//供应商数组
        param1:{pageSize:"999999"},//查询店铺参数
        //弹出框使用的数据
        modal2:false,//添加资源弹窗
        //弹出框使用的数据结束 
        choseItemChild:{},
      }
    },
    
    methods:{
        //弹窗显示状态发生变化时触发
        getFan(item){
           console.log(item+'动态改变')
           if(item==false){
                this.$emit('mychild',false)
                this.$emit('mychild1',false)
           }
        },
       //查询表格
      searchOne(){
         //获取查询的input的值
         let param             = {};
            param.beginTime   =this.beginTime;//下单开始时间
             param.endTime     =this.stopTime;//下单结束时间
             param.pageNum     = this.pagesizeaOne;//分页
             param.beginStatus = 8 ;
             param.endStatus   = 10 ;
         if(this.choseItemChild.type =="1"){// 销售单
             param.dayu = "Y";
             param.cusMerName  =this.choseItemChild.orgName;//采购方名字
             this.getSerchOne(param)

         }else if(this.choseItemChild.type =="2"){//采购单
             param.xiaoyu = "Y";
             param.orderShopOrgId    =this.choseItemChild.orgId;//供应商公司id
             this.getSearchShop(param)

         }
             
             
       },
       //点击选择资源的查询
       getMM(){
         this.searchOne();
       },
       //查询接口 客户
       getSerchOne(param){ 
         findOrdersAll89(param).then(res=>{
            if(res.code =="100"){
            this.dataOne=res.data.list;
            let showa=false;
            this.dataOne.map((item)=>{
              item.showa=showa
            })
            this.totalOne=res.data.total; 
          }  
        })
      },
      getSearchShop(param){//查询供应商
         findOrdersAll(param).then(res=>{
            if(res.code =="100"){
            this.dataOne=res.data.list;
            let showa=false;
            this.dataOne.map((item)=>{
              item.showa=showa
            })
            this.totalOne=res.data.total; 
          }  
        })
      },
      //获取采购方名称
      getCai(item){
       //this.caigou=item;
      // this.paramFirst.orderShopCompanyName= item
      this.caiGouName=item;//采购方名称赋值

       console.log(item)
      },
        //采购方名称
      remoteMethod3 (query) {
           if (query !== '') {
                this.loading3 = true;
                this.paramCaiGou.orgName = query ;
                this.paramCaiGou.pageNum = '9999' //分页
                this.paramCaiGou.orgRoleType = "2"
                  findOrgCusAcc(this.paramCaiGou).then(res=>{
                      if(res.code =="100"){
                      this.caigouData=res.data.list
                      this.caigouData.map((value,key,arr)=>{
                      this.caigouOne.push(arr[key].cusorgName)
                        })
                      }  
                    })
                setTimeout(() => {
                      this.loading3 = false;
                      const list = this.caigouOne.map(item => {
                          return {
                              value: item,
                              label: item
                            };
                });
                this.options3 = list.filter(item => item.label.indexOf(query) > -1);
                    }, 200);
                } else {
                    this.options3 = [];
            }
       },
      //供应商店铺
      getShop(param){
        param.status = 1;
        param.pageSize = "999999"
        findShop(param).then(res=>{
          if(res.code =="100"){
            this.shopList=res.data.list
          }
        })
      },
      //获取供应商选中的值
      getDian(item){
        const stingR=eval('(' + item.value + ')')
        console.log(stingR) 
        this.gongYingShangName=stingR.name;//供应商店铺名称
        this.gongYingShangId=stingR.id;//供应商店铺id
      },
      //获取下单时间的值
      getData(item){
        console.log(item)
        this.beginTime=item[0];//下单开始时间
        this.stopTime=item[1];//下单结束时间

      },
      //选择资源分页
      changePageOne(index){
          this.pagesizeaOne=index;
          this.searchOne();
      },
    
    },
    
    mounted(){
     this.getShop(this.param1);//查询店铺
     //子组件接受父组件传来的值
     console.log("获取父组件数据")
    //  console.log(this.choseItem);
    //  console.log(this.message+'我是父组件传的值'+this.message1)
    var that = this;
    Utils.$on('orgItem',function(msg){
            that.choseItemChild = msg; //父组件传过来的公司

            that.searchOne();//选择资源列表


     })
    },
    watch:{
        message(){
            this.modal2=this.message;//退款客户
        },
        message1(){
            this.modal2=this.message1;//退款供应商
        },

    },
    created(){
   
    },
}

</script>
