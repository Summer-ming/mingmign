<!--
 * @Description: 新增供应商
 * @Author: gmm
 * @其他: 
 * @Date: 2019-03-21 15:23:25
 * @LastEditTime: 2019-04-23 09:47:51
 -->
 
<template>
  <div style='background: #ffffff;'>
       <Form :label-width="120" inline :model="addForm">
        <row>
            <h2 style='text-indent:20px;'>基本信息</h2>

            <FormItem label="公司名称:" prop="company">
              <i-input   style="width:300px" v-model="addForm.company" placeholder="请输入公司名称"/>
            </FormItem>

             <FormItem label="成立日期:" prop="dateEstablishment">
               <i-input   style="width:300px" v-model="addForm.dateEstablishment" placeholder="请输入公司"/>
            </FormItem>

             <FormItem label="公司类型">
              <Select v-model="addForm.companyType"  style="width:300px">
                <Option value="贸易商">贸易商</Option>
                <Option value="钢厂">钢厂</Option>
              </Select>
             </FormItem>

             <FormItem label="企业性质">
              <Select v-model="addForm.NatureEnterprise"  style="width:300px">
                <Option value="贸易商">上市公司</Option>
                <Option value="民企钢厂">民企钢厂</Option>
                <Option value="民企">民企</Option>
                <Option value="国企">国企</Option>
              </Select>
             </FormItem>

             <FormItem label="法人姓名:" prop="name">
               <i-input   style="width:300px" v-model="addForm.name" placeholder="请输入法人姓名"/>
            </FormItem>

            <FormItem label="注册资金:" prop="money">
             <i-input   style="width:300px" v-model="addForm.money" placeholder="请输入注册基金"/>万元
            </FormItem>

             <FormItem label="法人身份证号:" prop="idCard">
             <i-input   style="width:300px" v-model="addForm.idCard" placeholder="请输入法人身份证号"/>
            </FormItem>
           
        </row>

        <row>
            <h2 style='text-indent:20px;'>业务信息</h2>

            <FormItem label="联系人:" prop="Contacts">
               <i-input   style="width:300px" v-model="addForm.Contacts" placeholder="请输入联系人"/>
            </FormItem>

            <FormItem label="手机:" prop="phone">
               <i-input   style="width:300px" v-model="addForm.phone" placeholder="请输入手机号"/>
            </FormItem>

            <FormItem label="座机:" prop="Landline">
               <i-input   style="width:300px" v-model="addForm.Landline" placeholder="请输入座机号"/>
            </FormItem>

            <FormItem label="传真:" prop="Fax">
               <i-input   style="width:300px" v-model="addForm.Fax" placeholder="请输入传真号"/>
            </FormItem>

            <FormItem label="分机:" prop="extension">
               <i-input   style="width:300px" v-model="addForm.extension" placeholder="请输入分机号"/>
            </FormItem>

           <FormItem label="QQ:" prop="qq">
               <i-input   style="width:300px" v-model="addForm.qq" placeholder="请输入QQ机号"/>
            </FormItem>

            <FormItem label="账务对账人:" prop="accountReconciler">
               <i-input   style="width:300px" v-model="addForm.accountReconciler" placeholder="请输入QQ机号"/>
            </FormItem>

            <FormItem label="对账人手机:" prop="phoneDui">
               <i-input   style="width:300px" v-model="addForm.phoneDui" placeholder="请输入手机号"/>
            </FormItem>

            <FormItem label="对账人QQ:" prop="phoneQQ">
               <i-input   style="width:300px" v-model="addForm.phoneQQ" placeholder="请输入对账人qq"/>
            </FormItem>

            <FormItem label="办公地址:" prop="Citywhere">
             <Cascader :data="dataOne" v-model="value1" @on-change='getCity' style='width:300px'></Cascader>
            </FormItem>

             <FormItem label="主营城市">
              <Select style='width:300px'
                multiple
                v-model="model13"
                filterable
                remote
                :remote-method="remoteMethod1"
                :loading="loading1">
                <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.label}}</Option>
            </Select>
            </FormItem>

            <FormItem label='钢厂'>
                <Select style='width:300px'
                      multiple
                      v-model="model14"
                      filterable
                      remote
                      :remote-method="remoteMethod2"
                      :loading="loading2">
                      <Option v-for="(option, index) in options2" :value="option.value" :key="index">{{option.label}}</Option>
                  </Select>
            </FormItem>


            <FormItem label="销售品种">
              <Select v-model="addForm.Salesvarieties"  multiple style="width:300px">
                <Option value="建筑钢材">建筑钢材</Option>
                <Option value="热轧板卷">热轧板卷</Option>
                <Option value="带钢">带钢</Option>
                <Option value="管材">管材</Option>
                <Option value="尤特钢">尤特钢</Option>
                <Option value="钢坯(钢锭)">钢坯(钢锭)</Option>
                <Option value="不锈钢">不锈钢</Option>
              </Select>
             </FormItem>

        </row>
           <!-- 仓库信息 -->
        <row>
           <h2 style='text-indent:20px;'>仓库信息</h2>
           
           <FormItem label='仓库选择'>
                <Select style='width:300px'
                      multiple
                      v-model="model15"
                      filterable
                      remote
                      :remote-method="remoteMethod3"
                      :loading="loading3">
                      <Option v-for="(option, index) in options3" :value="option.value" :key="index">{{option.label}}</Option>
                  </Select>
            </FormItem>
        </row>
        <!-- 打款信息 -->
        <row>
          <h2>打款信息</h2>

          <FormItem label="银行账号:" prop="bankAccount">
           <i-input   style="width:300px" v-model="addForm.bankAccount" placeholder="请输入银行账号"/>
          </FormItem>

          <FormItem label="开户行">
            <Select v-model="openBank" filterable style='width:300px;' @on-change='getChange'>
                <Option v-for="(item,index) in bankAdd" :value="item" :key="index">{{ item}}</Option>
            </Select>
          </FormItem>

            <FormItem label="所在地区:" prop="Citywhere">
             <Cascader :data="dataOne" v-model="valueOne" @on-change='getCityOne' style='width:300px'></Cascader>
            </FormItem>


          <FormItem label="开户网点名称">
            <Select v-model="bankDot" filterable style='width:300px;' @on-change='getChangeDot'>
                <Option v-for="(item,index) in bankDotList" :value="item.branchFullName" :key="index">{{ item.branchFullName}}</Option>
            </Select>
          </FormItem>


           <FormItem label="税号:" prop="taxNo">
           <i-input   style="width:300px" v-model="addForm.taxNo" placeholder="请输入税号"/>
          </FormItem> 

        </row>


         <!-- 备注 -->
         <row>
           <h2>备注信息</h2>

           
          <FormItem label="备注:" prop="note">
           <i-input  style="width:300px"  type="textarea" :rows="3"  v-model="addForm.note" placeholder="请输入备注"/>
          </FormItem>

         </row>


         <!-- 公司其他信息--简称打款信息 -->

         <row>
            <h2>公司其他信息</h2>
             
             
         <FormItem label="开户银行:" prop="bankDeposit">
           <i-input   style="width:300px" v-model="addForm.bankDeposit" placeholder="请输入开户银行"/>
         </FormItem>
        
         
        
          <FormItem label="退款开户行:" prop="refundBank">
           <i-input   style="width:300px" v-model="addForm.refundBank" placeholder="请输入退款账开户行"/>
         </FormItem>
         <FormItem label="退款银行开户网点:" prop="nameRefund">
           <i-input   style="width:300px" v-model="addForm.nameRefund" placeholder="请选择开户网点"/>
         </FormItem>
    
          <FormItem label="退款银行账号:" prop="refundAccount">
           <i-input   style="width:300px" v-model="addForm.refundAccount" placeholder="请输入退款银行账号"/>
         </FormItem>

         </row>
         <!-- 合同图片上传 -->
         <row>
             <h2>图片</h2>
          <FormItem :required="true" label="合同图片" prop="images">
            <template >
              <div class="demo-upload-list" v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                    <img :src="item.url">
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
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                action="//jsonplaceholder.typicode.com/posts/"
                style="display: inline-block;width:58px;">
                <div style="width: 58px;height:58px;line-height: 58px;">
                    <Icon type="ios-camera" size="20"></Icon>
                </div>
            </Upload>
          <Modal title="View Image" v-model="visible">
              <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
          </Modal>

            </template>
          </FormItem>
         </row>
        <br>
      </Form>
   
  </div>
</template>
<script>
import {getCity,getGang,getWarehouse,getOpeningBank,getBankDot} from '@/api/cusData' //主营城市 钢厂  仓库  打款开户行
import city from '@/api/city_houtai' //三级城市
  export default {
    name: 'supCustomers',
    data(){
      return {
         bankDotList:[],//存放开户网点
         bankDot:'',    //以上是开户网点数据
         bankString:'',//开户银行字段
         bankOpen:[],//保存银行
         bankAdd:[],
         param4:{bankName:'',pageSize:'99999'},
         options4:[],
         openBank:"",//以上是开户行字段
         model15:'',
         loading3: false,
         options3: [],
         param3:{},
         listHouseName:[],//保存仓库名字
         listHouse:[],//以上是仓库信息
         model14:'',
         loading2: false,
         options2: [],
         param1:{},
         gangName:[],//保存钢厂名字
         listGang:[],//以上是钢厂
         model13: '',
         loading1: false,
         options1: [],
         list: ['中国', '香港', '美国', '台湾', '调鱼岛'],
         listCon:[],//
         params:{},//主营城市
         listCname:[],//保存业务员名字
         businessName:'',//下拉框选中时业务员的名字
         value1: [],//省市默认
         cityString:'',//省市区
         valueOne:[], //银行省市默认
         cityStringOne:"",//银行省市区
         Provinces:"",//省
         city:"",//市
         dataOne:city,
         defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
         imgName: '',
         visible: false,
         uploadList: [],//图片上传
         addForm:{
            name:'',//名字
            phone:'',//手机号
            accountReconciler:'',//账务对接人
            phoneDui:'',//对账人手机
            Landline:"",//座机
            phoneQQ:"",//对账人qq
            Fax:"",//传真
            company:"",//公司姓名
            bankDeposit:'',//开户银行
            bankAccount:'',//银行账号
            refundBank:'',//退款开户行
            nameRefund:"",//退款银行开户网点
            refundAccount:'',//退款银行账号
            dateEstablishment:"",//成立日期
            companyType:"",//公司类型
            NatureEnterprise:"",//企业性质
            money:"",//注册资金
            idCard:"",//法人身份证号
            Contacts:'',//联系人
            Salesvarieties:"",//销售品种
            taxNo:'',//税号
            note:"",//备注
         },
      }
    },
    methods:{
         //上传图片
      handleView (name) {
            this.imgName = name;
            this.visible = true;
       },
       handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
       },
       handleSuccess (res, file) {
            file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            file.name = '7eb99afb9d5f317c912f08b5212fd69a';
       },
       handleFormatError (file) {
            this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
       },
       handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
       },
       handleBeforeUpload () {
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
      },
    // 省市区
     getCity(value,selectedData){
         console.log(selectedData.length)
          if(selectedData.length =='2'){
             this.cityString= selectedData[0].label+','+ selectedData[1].label
          }else {
            this.cityString= selectedData[0].label+','+ selectedData[1].label+','+ selectedData[2].label
          }
      },
      //银行所在地区
      getCityOne(value,selectedData){
          this.Provinces=selectedData[0].label
          this.city=selectedData[1].label
          if(selectedData.length =='2'){
             this.cityStringOne= selectedData[0].label+','+ selectedData[1].label
          }else {
            this.cityStringOne= selectedData[0].label+','+ selectedData[1].label+','+ selectedData[2].label  
          }
          this.getBankDotName();
      },
    //主营城市多级搜索
      //业务员远程搜锁
      remoteMethod1 (query) {
               console.log(query)
                if (query !== '') {
                    this.loading1 = true;
                   // console.log(this.params)
                    this.params.city = query ;
                    getCity(this.params).then(res=>{
                        if(res.code =="100"){
                        this.listCon=res.data
                        this.listCon.map((value,key,arr)=>{
                             this.listCname.push(arr[key].city)
                        })
                      }  
                    })
                    setTimeout(() => {
                        this.loading1 = false;
                        const list = this.listCname.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options1 = list.filter(item => item.label.indexOf(query) > -1);
                       // this.businessName=query;
                    }, 200);
                } else {
                    this.options1 = [];
                }
       },
      //钢厂列表多选
      remoteMethod2 (query) {
               console.log(query)
                if (query !== '') {
                    this.loading2 = true;
                    // console.log(this.params)
                    this.param1.steelWorksName = query ;
                    getGang(this.param1).then(res=>{
                        if(res.code =="100"){
                        this.listGang=res.data
                        this.listGang.map((value,key,arr)=>{
                             this.gangName.push(arr[key].brand)
                        })
                      }  
                    })
                    setTimeout(() => {
                        this.loading2 = false;
                        //console.log(this.listCon)
                        const list = this.gangName.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options2 = list.filter(item => item.label.indexOf(query) > -1);
                       // this.businessName=query;
                    }, 200);
                } else {
                    this.options2 = [];
                }
       },

    //仓库多选列表
      remoteMethod3 (query) {
               console.log(query)
                if (query !== '') {
                    this.loading3 = true;
                    // console.log(this.params)
                    this.param3.warehouseName = query ;
                    getWarehouse(this.param3).then(res=>{
                        if(res.code =="100"){
                        this.listHouse=res.data.list
                        this.listHouse.map((value,key,arr)=>{
                             this.listHouseName.push(arr[key].warehouseName)
                        })
                      }  
                    })
                    setTimeout(() => {
                        this.loading3 = false;
                        //console.log(this.listCon)
                        const list = this.listHouseName.map(item => {
                            return {
                                value: item,
                                label: item
                            };
                        });
                        this.options3 = list.filter(item => item.label.indexOf(query) > -1);
                       // this.businessName=query;
                    }, 200);
                } else {
                    this.options3 = [];
                }
    },
   //直接获取银行开户行数据
    getBan(param){
            //let param4={bankName:"123"},//开户行参数
            getOpeningBank(param).then(res=>{
                        if(res.code =="100"){   
                        this.bankOpen=res.data
                        this.bankOpen.map((value,key,arr)=>{
                             this.bankAdd.push(arr[key].bankAbbreviation)    
                        })
                         this.options4=this.bankAdd
                      }  
                    })
       },
    //选中开户行确定的数据
    getChange(value){
      this.bankString=value;
      this.getBankDotName();
      //console.log(value)
    },
    //选中开户网点的名字
    getChangeDot(name){
      console.log(name)
    },
    //获取开户网点的数据
    getBankDotName(){ 
      if(this.Provinces =='' && this.city=='' ) return false
      const paramB={};
      paramB.bankAbbreviation=this.bankString //银行名称
      paramB.bankBranchLineCity=this.Provinces //省
      paramB.prefectureLevel = this.city //市
      getBankDot(paramB).then(res=>{
        if(res.code =="100"){
          console.log("我调用了")
          console.log(res)
          this.bankDotList=res.data;
          // res.data.map((value,index,arr)=>{
          //        this.bankDotList.push(arr[index].branchFullName)
          // })
        }
      })

    }   
       
    },
    mounted(){
      this.getBan(this.param4);  //开户行数据
      this.getBankDotName();//开户网点数据
    },
    created(){
    
    },
  }
</script>
<style <style lang="less">
</style>

