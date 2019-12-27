

<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form  :label-width="80">
        <Row>
          <i-Col span="3">
             <Button type='primary' icon="ios-search" @click='searchM()'>查询</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>

          </i-Col>
        </Row>
        <Table border ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            
        </Table>

        <Page @on-change="changePage" style="margin-top:10px"   :total="totalM" show-total ></Page>
     </Form>
     </Card> 
     
     <!-- 审核提现申请弹窗 -->
          <Modal v-model="modal3" width='754px' title="申请提现申请" :mask-closable='false' :closable='false' :footer-hide='true' >
          <P style='margin-bottom:10px;'>申请总额:{{this.$global.isMoneyShow(tMoney)}}</P>
            <Row>
                <!-- 第二层级的tbale-->
                <Row>
                    <!-- <Table :columns="columns1" :data="data1"></Table> -->
                  <Table border :columns="columns5" :data="data2"  style='margin-bottom:10px;'></Table>
                </Row>
                <Row>
                     <Button type="primary" style='margin-right:5px;' @click='tongYi'>同意</Button>
                     <Button type="error" style='margin-right:5px;' @click='refuse'>拒绝</Button>
                      <Button @click='modal3=false'>取消</Button>
                </Row>
              
            </Row>
          </Modal>


      

     </div>
</template>

<script>
import {findShop,updateShop,updateOrgMoneyRecord} from '@/api/data'               
import {getTiXian,getRefus} from '@/api/cusData'//getTiXian
import {zhidanTypeLis} from '@/libs/allStatus'

export default {
    name: 'tiXianShenHe',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        modal3:false,
        tableItem:{},
        tMoney:0,
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        columns4: [
                    {
                        title: 'ID',
                        key: 'jgJieSuanId',
                        align: 'center',
                        width:'60'
                    },
                    {
                        title: '收款公司名称',
                        key: 'skOrgName',
                        align: 'center',
                        width:'180'
                    },

                      {
                        title: '实际付款金额(元)',
                        key: 'actualApyMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.actualApyMoney))
                        }
                        
                    },
                      {
                        title: '实际抵扣金额 (元)',
                        key: 'dikouMoney',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.dikouMoney))
                        }
                    },
                     {
                        title: '申请金额(元)',
                        key: 'money',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.money))
                        }
                        
                    },
                      {
                        title: '申请抵扣金额 (元)',
                        key: 'updateDiKou',
                        align: 'center',
                        width:'120',
                        render:(h,params) =>{
                          return h('div',{
                          },this.$global.isMoneyShow(params.row.updateDiKou))
                        }
                    },
                     {
                        title: '申请时间',
                        key: 'createTime',
                        align: 'center',
                        width:'140'
                    },
                     {
                        title: '管理员',
                        key: 'userName',
                        align: 'center',
                        width:'100'
                    },
                    {
                        title: '类型',
                        key: 'jgJieSuanOperatorType',
                        align: 'center',
                        width:'100',
                        render:(h,params) =>{
                          return h('div',{

                          },zhidanTypeLis(params.row.jgJieSuanOperatorType))
                        }
                    },
                     {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'100',
                        fixed:'right',
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
                                          this.tableItem  = params.row
                                          this.tMoney = params.row.money
                                           this.shenHe(params.row);
                                        }
                                    }
                                }, '审核'),
                                
                            ]);
                    }
                        
                    },
                    
        ],
        columns5:[
          {
              title: 'ID',
              key: 'id',
              align: 'center',
              width:'120'
            },
          {
              title: '到账单id',
              key: 'daozhangdanId',
              align: 'center',
              width:'120'
            },
          {
              title: '订单id',
              key: 'orderId',
              align: 'center',
              width:'120'
            },
            {
              title: '订单号',
              key: 'orderNo',
              align: 'center',
              width:'120'
            },
            {
              title: '公司名称',
              key: 'orgName',
              align: 'center',
              width:'120'
            },
            {
              title: '申请金额',
              key: 'outMoney',
              align: 'center',
              width:'120'
            },
            {
              title: '备注',
              key: 'note',
              align: 'center',
              width:'120'
            },
        ],
        data2:[],//审核弹窗的数组
        data1: [],//表格展示的数据
        dataCount:0,//总页数
        // pageSize:10,  //每页总条数
        searchPage:1 ,//初始化时查询的页码数
        jieSuanId:'',//拒绝的id
                
      }
    },
    
    methods:{
      //点击审核显示出弹窗
      shenHe(row){
          this.modal3=true;
          this.data2=row.orgnizations;//数组获取值
          this.jieSuanId=row.jiesuanPid;//获取拒绝的id

      },
      //同意
      tongYi(){
          let a='8'
         this.getTongYong(a)
      },
      //拒绝
      refuse(){
          let a= '-1'
          this.getTongYong(a)
        // let param2={
        //     auditStatus:'-1',
        //     pageCustomerStatuses:[],
        // }; //getRefus
        // let dic={};
        // dic.jieSuanId=this.jieSuanId;
        // param2.pageCustomerStatuses.push(dic)
        // getRefus(param2).then(res=>{
        //     console.log(res)
        //     if(res.code =="100"){
             
        //   }  
        //  })

      },
      //同意和拒绝通用的接口
      getTongYong(a){
           let param2={
            auditStatus:a,
            pageCustomerStatuses:[],
        }; //getRefus
        let dic={};
        dic.jieSuanId=this.tableItem.jgJieSuanId;
        param2.pageCustomerStatuses.push(dic)
        getRefus(param2).then(res=>{
            if(res.code =="100"){
               this.$Notice.success({
                  title:'审核成功',
                  duration:1,
                  onClose:res =>{
                    this.reload();
                  }
               })
              if(a == "8"){
            this.step2OK();
            }
          }  
         })
      },
      step2OK(){//修改流水表状态
        let p  = {};
        let plist = [];
        if(this.tableItem.orgnizations.length<=0){
          return false;
        }
        this.tableItem.orgnizations.map(item =>{
          let dic = {};
          dic.id = item.id;
          dic.status = "1"
          plist.push(dic);
        })
        p.list = plist;
        updateOrgMoneyRecord(p).then(res =>{
         })
      },


      deleteShop(item){

         this.$Modal.confirm({
                                           title:"确定需要删除吗",
                                           onOk:()=>{
                                               let param = {};
                                               param.id = item.id;
                                               param.status = "0";
                                                updateShop(param).then(res=>{
                                                 if(res.code =="100"){
                                                   this.$Notice.success({
                                                     title:'删除成功'
                                                   })
                                                   this.reload();
                                                 }else{
                                                   this.$Notice.error({
                                                     title:'修改失败'
                                                   })
                                                 }
                                               })

                                           }
                                         })
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
         param.pageNum=this.pagesizea //分页
         param.auditStatus = 1 ;
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         getTiXian(param).then(res=>{
            console.log('我是查询的数据')
            console.log(res)
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
       },
    },
    
    mounted(){
     this.searchM();
    },
    
    created(){
   
    },
}

</script>
