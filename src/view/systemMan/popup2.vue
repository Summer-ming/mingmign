<!--
 * @Description: 采购单付款列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-09 15:10:51
 -->
<template>
     <div>
       <Modal title="选择到账单资源" v-model="modal2" @on-visible-change='getFan'  footer-hide :mask-closable="false"  width='600px;' >
          <Row>
        
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

import {getChaXunDaoDan} from '@/api/cusData';//查询公司
import Utils from '@/api/middle'

export default {
    name: 'popup',
    // props:['message','message1'],
    props:['message2','message3'],
    data(){
      return {
        choseItemChild:{},
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
                                               this.$emit('mychildTwo',dataNm) //到账单退款客户
                                               this.$emit('mychildFour',dataNm)
                                              // this.$emit('mychildOne1',dataNm)//退款供应商
                                               console.log(this.dataTwo)
                                               console.log(params.row)
                                        }
                                    }
                                }, '添加22'),
                             ]);
                             }    
                    },
                    {
                        title: 'ID',
                        key: 'daozhangdanId',
                        align: 'center',
                        width:'120',
                    },
                     {
                        title: '公司抬头',
                        key: 'creditedCompany',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '到账金额',
                        key: 'payMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.payMoney))
                        }
                    },
                    {
                        title: '剩余可用金额',
                        key: 'dealMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dealMoney))
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
                                }, '删除222'),
                             ]);
                        }    
                    },
                    {
                        title: 'ID',
                        key: 'daozhangdanId',
                        align: 'center',
                        width:'120',
                    },
                     {
                        title: '公司抬头',
                        key: 'creditedCompany',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '到账金额',
                        key: 'payMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.payMoney))
                        }
                    },
                    {
                        title: '剩余可抵扣金额',
                        key: 'dealMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dealMoney))
                        }
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
                        title: 'ID',
                        key: 'daozhangdanId',
                        align: 'center',
                        width:'120',
                    },
                     {
                        title: '公司抬头',
                        key: 'creditedCompany',
                        align: 'center',
                        width:'120',
                    },
                    {
                        title: '到账金额',
                        key: 'payMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.payMoney))
                        }
                    },
                    {
                        title: '剩余可用金额',
                        key: 'dealMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dealMoney))
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
                                               this.$emit('mychildTwo',dataNm) //到账单退款客户
                                               this.$emit('mychildFour',dataNm)
                              }
                            }

                          })
                        } 
                    }
        ],//可以选择金额的  子组件添加到传到父组件的表头

        totalOne:0, //表格分页总天数
        pagesizeaOne:1,//默认分页第一页
       


        
        
        param1:{pageSize:"999999"},//查询店铺参数
        //弹出框使用的数据
        modal2:false,//添加资源弹窗
        //弹出框使用的数据结束         
      }
    },
    
    methods:{
        //弹窗显示状态发生变化时触发
        getFan(item){
           console.log(item+'动态改变')
           if(item==false){
                this.$emit('mychild2',false)
                this.$emit('mychild3',false)
         
           }
        },
       //查询表格
      searchOne(){
         //获取查询的input的值
         let param             = {};
             param.pageNum     = this.pagesizeaOne;//分页
             param.beginStatus = 1 ;
             param.endStatus   = 11 ;
             param.allEqualcreditedCompany = this.choseItemChild.orgName
             this.getSerchOne(param)
       },
       //点击选择资源的查询
       getMM(){
         this.searchOne();
       },
       //查询接口
       getSerchOne(param){
         getChaXunDaoDan(param).then(res=>{
             console.log('我是到账单数据')
             console.log(res)
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
      //选择资源分页
      changePageOne(index){
          this.pagesizeaOne=index;
          this.searchOne();
      },
    
    },
    
    mounted(){
     //子组件接受父组件传来的值
      var that = this;
    Utils.$on('orgItem',function(msg){
      console.log(msg)
            that.choseItemChild = msg; //父组件传过来的公司

            that.searchOne();//选择资源列表


     })
    },
    watch:{
        // message(){
        //     this.modal2=this.message;//退款客户
        // },
        // message1(){
        //     this.modal2=this.message1;//退款供应商
        // },
           message2(){
               this.modal2=this.message2  //到账单退款客户
           },
           message3(){
               this.modal2=this.message3  //到账单退款供应商
           }

    },
    created(){
   
    },
}

</script>
