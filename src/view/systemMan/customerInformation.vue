<template>
  <div>
      <!-- 1 -->
      <Layout >
        <div id='lay_con'>
            <!-- LEFT -->
            <div class='lay_left'>
              <Row class='row_left'>
                  <dl>
                      <dt>账户余额</dt>
                      <dd>56757<time> 万元</time></dd>
                  </dl>
                  <dl>
                      <dt>可用余额</dt>
                      <dd>56757<time> 万元</time></dd>
                  </dl>
                  <dl>
                      <dt>冻结金额</dt>
                      <dd>568757 <time> 万元</time> </dd>
                  </dl>
              </Row> 
           
              <!-- 更多 -->
              <Row class='row_account'>
                  <span class='row_span'>账户流水</span>
                  <span class=row_more>更多>> </span>
              </Row>
              <!-- 账户流水 表格height="447"-->
            <Row>        
                <Table border   ref="selection" :columns="columns4" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'></Table>
                
                
                <Row span='8' style="margin-bottom:20px;display:flex;">
                    <!-- 功能添加删除 -->
                    <div style='flex:1'>
                    <Button  icon="md-add" type="primary"  @click='modal3=true'>采购下单</Button>
            
            
                    <Button  icon="md-add" type="primary">销售合同</Button>
            
            
                    <Button  icon="ios-trash-outline" type="primary">指派</Button>
            
                    <Button  icon="ios-trash-outline" type="primary">部门</Button>
                    <Button  icon="ios-trash-outline" type="primary" @click='modal5=true'>联系人</Button>
                    <Button  icon="ios-trash-outline" type="primary"  @click='modal4=true'>地址</Button>
                    <Button  icon="ios-trash-outline" type="primary">升级为供应商</Button>
                   
                    </div>
            
                    <!-- 分页 -->
                    <!-- <Page  @on-change='changePage'  :total="totalM"  show-elevator show-sizer  show-total style='flex:1'/> -->
                
                </Row>
            </Row>
            </div>
            <!-- right -->
            <div class='lay_right'>
                <!-- 基本信息 -->
                <div class='basicInfo'>
                    <h1 class='h_info'>基本信息</h1>
                    <div class='info_con'>
                        <p>单元来源：平台注册</p>
                        <p>单位名称：福建亿钢钢厂</p>
                        <p>单位简称：亿钢</p>
                        <p>单位类型：钢厂</p>
                        <p>成立日期：2017-12-22</p>
                        <p>单位性质：民企</p>
                        <p>法人名称：陈魁</p>
                        <p>法人身份证号：350123434423455</p>
                        <p>注册资金：80000万元</p>
                        <p>单位地址：福建省泉州XXXXXXXXXXX</p>
                        <p>单位电话：</p>
                        <p>单位传真:</p>
                    </div>

                </div>
                <!-- 主联系人 开票信息 -->
                <div class='phone_info'>
                    <h1 class="phone_title">主联系人:<time>李先生</time></h1>
                </div>
                <!-- 手机   qq -->
                <div class='phone_qq' style='display:flex; width:100%;margin-bottom:10px;
            border:1px solid rgba(221,221,221,1);border-top:0;margin-bottom:20px;'>
                    <Button disabled style='    padding-left: 5px;color:rgba(51,51,51,1);font-size:14px;border:none;flex:1;padding-right:0;'  icon="ios-phone-portrait">15936911908</Button>
                    <Button disabled style='    padding-left: 5px;color:rgba(51,51,51,1);font-size:14px;border:none;flex:1;'  icon="logo-snapchat">1374265277</Button>
                </div>
                <!-- 开票信息 -->
                 <div class='infoF'>
                     <span class='spanKai'>开票信息</span>
                     <div class='iconT'>  
                       <Icon type="ios-share-alt-outline" /> 
                       <Icon type="ios-trash-outline" />
                     </div>
                 </div>
                 <div class='p_con'>
                       <p>*税号:这个不能改</p>
                       <p>*联系电话:05050550505</p>
                       <p>*公司地址:上海市宝山区许竞争</p>
                       <p>*开户银行:建设银行上海分行</p>
                       <p>*银行账号:11313131313131313</p>
                       <p>*退款银行账号:1131313131215151</p>
                       <p>*退款银行开户网点:建设银行上海分行</p>
                       <p>*采购打款账号:1113313313</p>
                  </div>

            </div>
        </div>
      </Layout>
      <!-- 2 -->
    <!-- 弹窗1 -->
    <Modal v-model="modal3" width='722px' :mask-closable="false"  :closable="false">
          <Row class='contacts'>
              <span class='span_contacts'>该公司联系人</span>
              <Col class='span_btn'><Button  type='error'  icon="md-add">新增</Button></Col>
          </Row>
          <!-- TAB表格 -->
          <Row>
              <Table border   :columns="columnsShop" :data="dataShop"></Table>
          </Row>
    </Modal>
    <!-- 弹窗地址 -->
     <Modal v-model="modal4" width='777px' :mask-closable="false"  :closable="false">
          <Row class='contacts'>
              <span class='span_contacts'>该公司联系人</span>
              <Col class='span_btn'><Button  type='error'  icon="md-add">新增</Button></Col>
          </Row>
          <!-- TAB表格 -->
          <Row>
              <Table border   :columns="columnsAdd" :data="dataAdd"></Table>
          </Row>
    </Modal>

    <!-- 弹窗联系人 -->
     <Modal v-model="modal5" width='1067px' :mask-closable="false"  :closable="false">
          <Row class='contacts'>
              <span class='span_contacts'>该公司联系人</span>
              <Col class='span_btn'><Button  type='error'  icon="md-add">新增</Button></Col>
          </Row>
          <!-- TAB表格 -->
          <Row>
              <Table border   :columns="columnsCon" :data="dataCon"></Table>
          </Row>
    </Modal>

  </div>
</template>
<script>
import {accountManagement} from '@/api/data'
  export default {
    name: 'customerInformation',
    data(){
      return {
        modal3:false,
        modal4:false,
        modal5:false,
        totalM:0, //表格分页总天数
        pagesizea:1,//默认分页第一页
        columns4: [
                    {   title: '选中',
                        type: 'selection',
                        width: '60',
                        align: 'center'
                    },
                    {
                        title: '发生时间',
                        key: 'id',
                       align: 'center',
                        width:'90'
                       
                    },
                    {
                        title: '账单类型',
                        key: 'createCname',
                         align: 'center',
                         width:'90'
                    },
                    {
                        title: '发生金额',
                        key: 'postW',
                        align: 'center',
                         width:'90'
                    },
                     {
                        title: '账户余额',
                        key: 'departmentName',
                        align: 'center',
                        width:'90'
                    },
                      {
                        title: '账户可用余额',
                        key: 'sex',
                         align: 'center',
                         width:'110'
                    },
                      {
                        title: '账户冻结金额',
                        key: 'acount',
                        align: 'center',
                        width:'110'
                        
                    },
                     
                     {
                        title: '账单备注',
                        key: 'mail',
                        align: 'center',
                         width:'150'

                     
                    },
                    
                ],
                data1: [],//表格展示的数据
                columnsShop:[
                    
                    {
                        title: '部门Id',
                        key: 'id',
                        align: 'center',
                        width:'110'
                       
                    },
                    {
                        title: '部门名称',
                        key: 'shopCname',
                        align: 'center',
                         width:'110'
                    },
                    {
                        title: '部门负责人',
                        key: 'postW',
                        align: 'center',
                         width:'110'
                    },
                     {
                        title: '部门地址',
                        key: 'departmentName',
                        align: 'center',
                        width:'100'
                    },
                      {
                        title: '部门备注',
                        key: 'sex',
                        align: 'center',
                         width:'100'
                    },
                     {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'130',
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '编辑'),
                                   h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                      
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '删除'),
                             ]);
                    }
                        
                    },
                    
                ],
                dataShop:[
                     {
                        id: '12',
                        shopCname: '福建建刚钢厂',
                        postW: '开通',
                        departmentName: '现货交易',
                        sex:'上海市宝山区许竞争',
                    },
                ],//店铺表格
                columnsAdd:[
                    
                    {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'110'
                       
                    },
                    {
                        title: '部门负责人',
                        key: 'shopCname',
                        align: 'center',
                         width:'110'
                    },
                    {
                        title: '联系人类型',
                        key: 'postW',
                        align: 'center',
                         width:'125'
                    },
                     {
                        title: '所属部门',
                        key: 'departmentName',
                        align: 'center',
                        width:'120'
                    },
                      {
                        title: '联系人电话',
                        key: 'sex',
                        align: 'center',
                         width:'120'
                    },
                 
                     {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'130',
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '编辑'),
                                   h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                      
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '删除'),
                             ]);
                    }
                        
                    },
                    
                ],//表格地址
                dataAdd:[
                     {
                        id: '12',
                        shopCname: '福建建刚钢厂',
                        postW: '开通',
                        departmentName: '现货交易',
                        sex:'上海市宝山区许竞争',
                    },
                ],//表格地址
                 columnsCon:[
                    
                    {
                        title: '售票信息Id',
                        key: 'id',
                        align: 'center',
                        width:'110'
                       
                    },
                    {
                        title: '售票人',
                        key: 'shopCname',
                        align: 'center',
                         width:'90'
                    },
                    {
                        title: '售票人联系方式',
                        key: 'postW',
                        align: 'center',
                         width:'125'
                    },
                     {
                        title: '收票人地址',
                        key: 'departmentName',
                        align: 'center',
                        width:'120'
                    },
                      {
                        title: '默认售票地址',
                        key: 'sex',
                        align: 'center',
                         width:'120'
                    },
                       {
                        title: 'QQ',
                        key: 'qq',
                        align: 'center',
                         width:'90'
                    },
                     {
                        title: '微信号',
                        key: 'weChat',
                        align: 'center',
                         width:'90'
                    },
                     {
                        title: '邮箱',
                        key: 'eMail',
                        align: 'center',
                         width:'90'
                    },
                     {
                        title: '操作',
                        key: 'operate',
                        align: 'center',
                        width:'170',
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '沟通'),
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '编辑'),
                                   h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                      
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '删除'),
                             ]);
                    }
                        
                    },
                    
                ],//表格联系人
                dataCon:[
                     {
                        id: '12',
                        shopCname: '福建建刚钢厂',
                        postW: '开通',
                        qq:'1221212',
                        departmentName: '现货交易',
                        eMail:'你好',
                        weChat:'121212',
                        sex:'上海市宝山区许竞争',
                    },
                ],//表格联系人
      }
    },
    methods:{
       selectOne(row){
         console.log(row)
       },
       //查询表格
       searchM(){
         //获取查询的input的值
         let param={};
         param.pageNum=this.pagesizea//分页
         this.getSerch(param)
       },
       //查询接口
       getSerch(param){
         accountManagement(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
       }
    },
    mounted(){
      //账户管理接口
     this.searchM();
    },
    created(){
    
    },
  }
</script>
<style <style lang="less">
#lay_con{
    display: flex;
    .lay_left{
      width:100%;
      flex: 3;
    };
    .lay_right{
      width:100%;
      flex:1;
      .basicInfo{
          height:360px;
          width:100%;
          border:1px solid rgba(221,221,221,1);
          margin-bottom:10px;
          .h_info{
            height:40px;
            text-indent: 10px;
            background:rgba(238,238,238,1);
            line-height:40px;
            font-size:14px;
            font-weight:400;
            color:rgba(51,51,51,1)
          }
          .info_con{
             padding-top:16px;
             padding-left:16px;
          
             p{
                 font-size:14px;
                 color:rgba(51,51,51,1)
             }

          }
      }
      .phone_info{
           border:1px solid rgba(221,221,221,1);
        .phone_title{
            height:40px;
            text-indent: 10px;
            background:rgba(238,238,238,1);
            line-height:40px;
            font-size:14px;
            font-weight:400;
            color:rgba(51,51,51,1);
            time{
                font-size:16px;
            };
        }
        .phone_qq{
            height:40px;
        }
      }
      .infoF{
        height:40px;
        background:rgba(238,238,238,1);
        border:1px solid rgba(245,245,245,1);
        overflow: hidden;
        margin-bottom:20px;
        .spanKai{
          float:left;
          height:40px;
          font-size:14px;
          color:rgba(51,51,51,1);
          line-height:40px;
          text-indent: 10px;
        }
        .iconT{
        float:right;
        line-height:40px;
        font-size:18px;
        margin-right:17px;
      }}
    
     .p_con{
        width:100%;
        padding-left:10px;
        p{
          font-size:14px;
          line-height:25px;
          color:rgba(51,51,51,1);
          min-height:20px;
        }
      }
}

}
.row_left{
  display:flex;
  height:90px;
  background:rgba(236,248,255,1);
  border:1px dashed #94d6ff;
  padding-top:10px;
  margin-bottom:30px;

   
  dl{
      flex:1;
      dt{
          text-align:center;
          font-size:16px;
      }
      dd{
          text-align:center;
          font-size:24px;
          color:red;
          time{
              font-size:14px;
              color:rgba(51,51,51,1);
          }
      }
  } 
}
.row_shop{
    height:45px;
    border:1px solid rgba(221,221,221,1);
    border-bottom:0;
    .shop_info{
        height:45px;
        line-height:45px;
        font-size:16px;
        text-indent: 10px;
        color:rgba(51,51,51,1);
    }
    .shop_add{
        height:45px;
        padding-top:7px;
        .but_on{
            height:30px;
            font-size:13px;
            float:right;
            margin-right:10px

        }
    }

}
.row_account{
  height:45px;
  border:1px solid rgba(221,221,221,1);
  border-bottom:0;
  .row_span{
      float:left;
      height:45px;
      text-indent: 10px;
      font-size:16px;
      color:rgba(51,51,51,1);
      line-height:45px;
  }
  .row_more{
      float:right;
      height:45px;
     font-size:13px;
     color:rgba(27,151,229,1);
     line-height:45px;
     margin-right:10px
  }

}
.ivu-card-body{
   padding-bottom:0;
 }
 .width_150{
   width:500px;
 }
.ivu-modal-content{
  padding-left:20px;
 
}
.ivu-modal-footer{
  display: none;
}
#formM{
  .ivu-form-item-content{
    margin-left:357px!important;
  }
}
.ivu-form-item{
    margin-bottom:16px!important;
}
.contacts{
   height:45px;
   border:1px solid rgba(221,221,221,1);
   border-bottom:0;
   .span_contacts{
       height:45px;
       line-height:45px;
       text-indent:10px;
       font-size:16px;
       color:rgba(51,51,51,1);
       float:left;
   }
   .span_btn{
       float:right;
       width:60px;
       
       border-radius:3px;
       margin-right:24px;
       margin-top:5px;
      .ivu-btn >.ivu-icon + span{
          margin-left:0!important;
      }
   }
}
.ivu-modal-body{
    padding:31px 30px;
}
.ivu-modal-content{
    padding-left:0!important;
}
</style>

