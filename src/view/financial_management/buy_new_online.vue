<!--
 * @Description: 采购单线上付款列表
 * @Author: wb
 * @others: 
 * @Date: 2019-04-09 15:10:51
 -->



<template>
     <div>
     <Card :border="false" :dis-hover="true">  <!--border是否显示边框,dis-hover禁用鼠标悬停显示阴影-->
     <Form inline :model="formItem" :label-width="140">
        <Row>
          <i-Col span="24">
          <!-- <FormItem label="公司名称:" style="margin-right:10px;">
          <Input  placeholder="请输入公司名称" v-model="formItem.companyName"></Input>
          </FormItem> -->
          <FormItem label="打款公司与卡号:" style="margin-right:10px;">
                <Select  v-model='taitou' :label-in-value='true' style="width:420px" placeholder="请选择公司抬头与卡号" @on-change='getChange'>
                   <Option  v-for='(item,index) in zhidanOrderType' :value="JSON.stringify(item)" v-if='item.type==1' :key='index'>{{item.label}}</Option>
                </Select>
          </FormItem>
          </i-Col>
           <br/>
           <FormItem label="收款公司抬头与卡号:" style="margin-right:10px;">
                <Select  v-model='taitou1' :label-in-value='true' style="width:420px" placeholder="请选收款择公司抬头与卡号" @on-change='getChange1'>
                   <Option  v-for='(item,index) in zhidanOrderType' :value="JSON.stringify(item)" :key='index'>{{item.label}}</Option>
                </Select>
          </FormItem>
         <br/>
         <FormItem label="用途:" style="margin-right:10px;">
                <Select  v-model='taitou2' style="width:220px" :label-in-value="true" placeholder="请选择" @on-change='getChangeYong'>
                   <Option  v-for='(item,index) in YongTu' :value="item.value" :key='index'>{{item.label}}</Option>
                </Select>
          </FormItem>
            <br/>
            <FormItem label="备注:" style="margin-right:10px;">
                <Select  v-model='taitou3' style="width:220px" :label-in-value="true" placeholder="请选择" @on-change='getChangeBeiZhu'>
                   <Option  v-for='(item,index) in YongTu' :value="item.value"  :key='index'>{{item.label}}</Option>
                </Select>
          </FormItem> 
          <br/>
          <FormItem label="打款金额:" style="margin-right:10px;">
            <InputNumber
            style="width:220px"
            @on-change='getChangeMoney'
            v-model="formItem.money"
            :formatter="value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"></InputNumber>
              <!-- <i-Input  placeholder="请输入打款金额" v-model="formItem.money" @on-blur='getChangeMoney'> </i-Input> -->
          </FormItem>
         <row style='padding-left:30px;'>
                <Button :disabled="isdisabled" style="margin-right:10px"   type="primary" @click='getAdd'>提交</Button>
             <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
         </row>
        </Row>
     </Form>
     </Card>    
     </div>
</template>

<script>
import {companyCardTypeListNew} from '@/libs/global_type'
import config from '@/config'
import axios from 'axios'
let url = '';

export default {
    name: 'buy_new_online',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
        isdisabled:false,
          taitou:"",//打款公司抬头与卡号默认
          taitou1:"",//打款公司抬头与卡号默认
          taitou2:1,//打款公司抬头与卡号默认
          taitou3:1,//打款公司抬头与卡号默认
          selectValue:'',
          bankNo:'',
          formItem:{
            money:0,
            actualMoney:''
          },
          zhidanOrderType:companyCardTypeListNew,
          YongTu:[
              {
                  value:1,
                  label:'内部转账'
              },
          ],//用途
          params:{
              userId:this.$global.adminInfo.id,
              userName:this.$global.adminInfo.cname,
              yongtu:'内部转账',
              note:'内部转账'
          },//制单参数
          
      }
    },
    
    methods:{
      //获取打款公司与卡号
      getChange(item){
        const stingR=eval('(' + item.value + ')')
        console.log(stingR.value);
        //判断value
        this.selectValue = stingR.value
         if(stingR.value == "2"){//上海兴业银行
        url = process.env.NODE_ENV === 'development' ? 'http://10.100.16.65:88/niubee/orders/internalZhidan' : config.baseUrl.nbzd_SH
         }else if(stingR.value == "1")//福建兴业银行
         {
        url = process.env.NODE_ENV === 'development' ? 'http://10.100.16.65:8083/jg/orders/internalZhidan' : config.baseUrl.nbzd_FJ

         }
      },
      //获取打款公司getChange1
       getChange1(item){
         const stingR=eval('(' + item.value + ')')
           this.bankNo=stingR.cardNoValue
        this.params.bankNo= this.bankNo

        this.params.merchantsName=stingR.companyName;//公司名称

        this.params.kaihubanknames=stingR.branchFullName;//支行全称

        this.params. serialNumber=stingR.serialNumber;//支付行号

        this.params.city=stingR.city;//省

        this.params.bankCode=stingR.bankCode;//数组中的bankCode
      },
      //使用的用途
      getChangeYong(value){
         console.log(value+'使用用途')
          this.params.yongtu=value.label;//用途
      },
      //备注
      getChangeBeiZhu(value){
          this.params.note=value.label;//备注
         console.log(value+"备注")
      },
      //打款金额
      getChangeMoney(e){
        console.log(e);
        this.params.money = e;
        //  this.formItem.money= this.$global.isMoneyShow(e.target.value)
        //  this.params.money= this.$global.unFormatCurrency(this.formItem.money);//金额 金额传入的时候需要去除千分隔
        // console.log(this.params.money)
      },
      //提交
      getAdd(){
          if(this.selectValue==3){
            this.HZbank_SH();//杭州银行制单
          }else{
            this.CIB_zhidan();//原先的营业银行制单
          }
            
      },
      CIB_zhidan(){
        this.isdisabled =true;
            console.log(this.params);
            console.log(url);
             this.$http.jsonp(url,{params:this.params,jsonp:'callback',jsonpCallback:'successCallback'})
                        .then(function(res){
                          console.log("请求成功");
                          if(res.body =="100"){
                              this.$Notice.success({
                              title:'提交制单成功',
                            })
                          }else{
                                 this.$Notice.error({
                                                            title:'提交制单失败'
                                                        })
                          }
                        },function(res){
                            this.$Notice.error({
                                                            title:'提交制单失败,请联系管理员'
                                                        })
                        })
      },
      HZbank_SH(){
        let a ='http://10.100.16.65:8889/jgerp-hz-YQZL/';
        // let a ='http://10.100.16.4:8889/jgerp-hz-YQZL/';

          const baseUrl = process.env.NODE_ENV === 'development' ? a : config.baseUrl.HZbank_SH
        let p  ={};
        let plist= [];
            let dic                  = {};
            dic.payerCorpName     = "上海市闽航电子商务有限公司"                //付款单位名称 我司名称
            dic.jiesuanId         = ''  //系统结算id
            dic.payeeAccName      = this.params.merchantsName                //收款人户名
            dic.payeeBankName     = this.params.kaihubanknames                //收款人银行支行全称
            dic.payeeBankCode     = this.params.serialNumber                //收款银行人行联行号
            dic.payeeAccNo        = this.params.bankNo                //收款人账号
            dic.payMoney          = this.$global.accPrecision(this.params.money,2)                // 付款金额2位小数点
            dic.payPurpose        = this.params.yongtu                //付款用途 “货款”
            dic.rmk               = this.params.note               //付款附言最大50个汉字
            dic.erpReqUser        = ""                //
            dic.retCode           = ""                //
            dic.retMsg            = ""                //
            dic.type              = "0"               //
            dic.bankConnectedType = "3"                // 3:上海杭州 7 福建杭州
            dic.isErpCode         = "1"               //                                    
            plist.push(dic);
        p.pagePayList = plist;
        console.log(p);
        axios({
          url:baseUrl+'pay/zhidanSH',
          method:'post',
          data:p
        })
        .then((res)=>{
          console.log("获取到结果")
          console.log(res);
          let resData =res.data;
          if(resData.code =='100'){
            this.$Notice.success({
              title:'提交上海杭州银行制单申请成功',
              duration:1,
              onClose:res =>{
                 console.log('关闭时回调')
                // this.reload();
              }
            })
          }else{
            this.$Notice.error({
              title:'提交上海杭州银行制单申请失败'
            })
          }
        })
        .catch((res)=>{
          console.log("获取失败")
          console.log(res);
          this.$Notice.error({
              title:'请联系管理员',
              desc:res
            })
          
        })
      },
      reloadSelf(){
            this.reload();
        },
    },
    
    mounted(){
    
    },
    
    created(){
   
    },
}

</script>
<style <style lang="less">
  .ivu-table-cell{
        padding-left: 0!important;
        padding-right: 0!important;;
      }
</style>
