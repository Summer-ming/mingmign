<template>
  <div>
    <row class='ti_title'>
        <h2>提货申请</h2>
    </row>
    <row class='detail_ti'>
       <h2>订单明细</h2>
       <i-col offset="12">
          <Button   type="primary" style='margin-right:15px;' @click='getBeiZ'>批量添加备注</Button>
          <input type="text" placeholder="请输入" class='beizhu' v-model="beiz">
       </i-col>
    </row>
    <!-- 提单申请的table -->
    <row style="margin-bottom:15px;">
        <Table  :columns="columns1" :data="data1"></Table>
    </row>
    <!-- 提货信息 -->
    <row>
        <h2 style='line-height: 28px;font-size: 16px;margin: 0 4px;font-weight: 500!important;font-family: "Microsoft Yahei";color: #555;'>提货信息</h2>     
        <row>
             <Form :label-width="120"  :model="addForm">
                 <row>
                    <FormItem label="买家手机号:" prop="buyPhone">
                     <i-input style="width:300px"  v-model="addForm.buyPhone" placeholder="请输入手机号" />
                   </FormItem>


                    <FormItem label="提货方式:">
                    <Select v-model="addForm.tifang" style="width:300px" @on-change='getOption'>
                        <Option value="直接过户">直接过户</Option>
                        <Option value="凭车船号提货">凭车船号提货</Option>
                        <Option value="凭身份证提货">凭身份证提货</Option>
                        <Option value="凭买家提单提货">凭买家提单提货</Option>
                        <Option value="凭原件提货">凭原件提货</Option>
                        <Option value="补单">补单</Option>
                    </Select>
                   </FormItem>

                   <!-- 买家名称 -->
                   <FormItem label="买家名称:" v-show='guoHu'>
                     <p><time>湖南凯泽建材贸易有限公司</time></p>
                   </FormItem>

                   <!-- 凭车船号提货 -->
                   <FormItem label="提货信息:" v-show='chuanhao'>
                     <Table  :columns="columnShip" :data="dataShip"></Table>
                   </FormItem>
                   <!--凭身份证提货-->
                   <FormItem label="提货信息:" v-show='idCard'>
                     <Table  :columns="columnIcrd" :data="dataIcrd"></Table>
                   </FormItem>
                   <!-- 凭买家提单提货货 -->
                   <FormItem label="提货信息:" v-show='buyjia'>
                     <Table  :columns="columnBuy" :data="dataBuy"></Table>
                   </FormItem>

                   

                   <FormItem label="备注:" prop="note">
                     <i-input style="width:300px" type="textarea" :rows="3" v-model="addForm.note" placeholder="请输入备注" />
                   </FormItem>
                </row>
              </Form>

        </row>
     <!--确认提货  取消返回 -->
     <row style='text-align:center'>
          <Button   type="primary" style='margin-right:15px;' >确认提货</Button>
          <Button>取消返回</Button>
     </row>
       
    </row>

  </div>
</template>
<script>

  export default {
    name: 'takeGoods',
 
    data(){
      return {
       tiHuoStatus:'',//提货方式的值
       guoHu:true,//直接过户的状态显示
       chuanhao:false,//凭船号的状态显示
       idCard:false,//凭身份证的状态显示
       buyjia:false,//凭买家的状态显示
       yuanjian:false,//凭原件的状态显示
       budan:false,//凭补单的状态显示
       addForm:{
           buyPhone:"",//买家手机号
           tifang:"直接过户",//提货方式
           note:'',//备注
       },//提货信息的字段
       beiz:"",//批量添加备注
       columns1: [
                    {
                        title: '仓库',
                        key: 'cangku'
                    },
                    {
                        title: '品名',
                        key: 'pinm'
                    },
                    {
                        title: '规格',
                        key: 'guige'
                    },
                     {
                        title: '材质',
                        key: 'caizhi'
                    },
                     {
                        title: '钢厂',
                        key: 'gangc'
                    },
                     {
                        title: '件重(吨)',
                        key: 'jianz'
                    },
                     {
                        title: '单价(元)',
                        key: 'danjia'
                    },
                     {
                        title: '件数',
                        key: 'jianshu',
                        render:(h,params)=>{
                        return h('div',[
                            h('span',{
                                style:{
                                display:'block',
                                color:'red',
                                }
            
                            },params.row.jianshu),
                            h('span',{
                            style:{
                                 color:'blue',
                                 display:'block'
                            }
                            },'提货数量'+1),
                            h('span',{
                            style:{
                                color:'green',
                                display:'block'
                            }
                            },"退货数量"+2+'层')
                        ])
                        }
                    },
                     {
                        title: '可提件数(件)',
                        key: 'keti'
                    },
                     {
                        title: '提货件数',
                        key: 'tihuo',
                        className:"jianshum",
                        render:(h,params)=>{
                            return h('div',[
                                h('Icon',{
                                   props:{ //<Icon type="ios-remove" />
                                      type:'ios-remove',
                                      color:'red',
                                   },
                                   style:{
                                       display:"inline",
                                       fontSize:'20px',    
                                   },
                                   on:{
                                       click:(e)=>{
                                           e.stopPropagation();
                                           this.getJian(params.index)
                                       }
                                   }
                                },''),
                                h('Input',{
                                    props:{
                                        type:'text',
                                        value:params.row.tihuo
                                    },
                                    style:{
                                       display:"inline",
                                       width:'50px!important',
                                   },
                                   },),

                                h('Icon',{
                                  props:{ //<Icon type="ios-add" />
                                      type:'ios-add',
                                       color:'red',
                                   },
                                   style:{
                                       display:"inline",
                                       fontSize:'20px',
                                    
                                   },
                                    on:{
                                       click:(e)=>{
                                           e.stopPropagation();
                                           this.getAdd(params.index)
                                       }
                                   }

                                },),
                            ])
                        }
                    },
                     {
                        title: '备注',
                        key: 'beizhu',
                         render:(h,params)=>{
                            return h('div',[
                                 h('Input',{
                                    props:{
                                        type:'text',
                                        value:params.row.beizhu
                                    },
                                    style:{
                                      
                                   },
                                   },),
                            ])
                        }

                    },
                ],
       data1: [
                    {
                        cangku: '厂提',
                        pinm: "盘螺",
                        guige: '10',
                        caizhi: 'hrb400e',
                        gangc:"大冶钢厂",
                        jianz:"0.060",
                        danjia:"4079.005",
                        jianshu:'合同数量:100',
                        keti:"500",
                        tihuo:"100",
                        beizhu:"beizhu"
                    },],
       //根据船号提货             
       columnShip:[
           {
             title: '司机姓名',
             key: 'sijiname',
             render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.sijiname,
                              autosize:true,
                             
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-change':(event)=>{
                                   console.log(event.target.value)
                                   this.dataShip[params.index].sijiname=event.target.value
                                   this.dataShip=this.dataShip
                                   console.log(this.dataShip)

                              }
                            }

                          })
                        }
           },
           {
             title: '手机',
             key: 'sijiphone',
             render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.sijiphone,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-change':(event)=>{
                                   console.log(event.target.value)
                                   this.dataShip[params.index].sijiphone=event.target.value
                                   this.dataShip=this.dataShip
                              }
                            }

                          })
                        }
           },
           {
             title: '车牌号',
             key: 'sijichepai',
             render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.sijichepai,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-change':(event)=>{
                                   console.log(event.target.value)
                                   this.dataShip[params.index].sijichepai=event.target.value
                                   this.dataShip=this.dataShip
                                   console.log(this.dataShip)
                              }
                            }

                          })
                        }
           },
           {
             title: '操作',
             key: 'opaerate',
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
                      this.remove(params.index)
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
                      this.show(params.index)
                    }
                  }
                }, '添加'),

              ]);
            }
           }
       ],
       //根据船号提货
       dataShip:[
           {
              sijiname:"" ,
              sijiphone:"",
              sijichepai: '',
           },
       ],
       //根据身份证提货
       columnIcrd:[
           {
             title: '身份证号',
             key: 'icrd',
             render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.icrd,
                              autosize:true,
                             
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-change':(event)=>{
                                   console.log(event.target.value)
                                   this.dataIcrd[params.index].icrd=event.target.value
                                   this.dataIcrd=this.dataIcrd
                                   console.log(this.dataIcrd)

                              }
                            }

                          })
                        }
           },
           {
             title: '联系方式',
             key: 'contact',
             render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.contact,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-change':(event)=>{
                                   console.log(event.target.value)
                                   this.dataIcrd[params.index].contact=event.target.value
                                   this.dataIcrd=this.dataIcrd
                              }
                            }

                          })
                        }
           },
           {
             title: '操作',
             key: 'opaerate',
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
                      this.remove(params.index)
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
                      this.show(params.index)
                    }
                  }
                }, '添加'),

              ]);
            }
           }
       ],
       //根据身份证提货
       dataIcrd:[
           {
              icrd:"",
              contact:"",

           }
       ],
       //根据买家提单提货
       columnBuy:[
            {
             title: '买家提单编号',
             key: 'bianhao',
             render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.bianhao,
                              autosize:true,
                             
                            },
                            attrs:{
                              id:params.index,
                            },
                            on:{
                              'on-change':(event)=>{
                                   console.log(event.target.value)
                                   this.dataBuy[params.index].bianhao=event.target.value
                                   this.dataBuy=this.dataBuy
                                   console.log(this.dataBuy)

                              }
                            }

                          })
                        }
           },
           {
             title: '联系方式',
             key: 'contactOne',
             render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.contactOne,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },
                            on:{
                              'on-change':(event)=>{
                                   console.log(event.target.value)
                                   this.dataBuy[params.index].contactOne=event.target.value
                                   this.dataBuy=this.dataBuy
                              }
                            }

                          })
                        }
           },
           {
             title: '操作',
             key: 'opaerate',
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
                      this.remove(params.index)
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
                      this.show(params.index)
                    }
                  }
                }, '添加'),

              ]);
            }
           }
       ],
       //根据买家提单提货
       dataBuy:[
           {
              contactOne:'', 
              bianhao:"",
           }
       ],

              
      }
    },
    methods:{
       //获取input的值
    //    change(e){
    //      console.log(this.beiz)
    //      console.log(e.target.value)
    //    },
       //add添加
       getAdd(index){
          console.log(index)
          this.data1[index].tihuo++
          this.data1[index].tihuo=(this.data1[index].tihuo)
          console.log( this.data1[index])
        },
       //添加
       getJian(index){
           console.log('-------')
           this.data1[index].tihuo--
           this.data1[index].tihuo=(this.data1[index].tihuo)
       },
       //批量添加备注
       getBeiZ(){
           console.log(this.beiz)
           this.data1.map((item)=>{
               item.beizhu=this.beiz
           })
       },
       //提货方式的几种状态
       getOption(item){
           if(item=='直接过户'){
            this.guoHu=true//直接过户的状态显示
            this.chuanhao=false//凭船号的状态显示
            this.idCard=false//凭身份证的状态显示
            this.buyjia=false//凭买家的状态显示
            }else if(item=='凭车船号提货'){
            this.guoHu=false//直接过户的状态显示
            this.chuanhao=true//凭船号的状态显示
            this.idCard=false//凭身份证的状态显示
            this.buyjia=false//凭买家的状态显示
            }else if(item=='凭身份证提货'){
            this.guoHu=false//直接过户的状态显示
            this.chuanhao=false//凭船号的状态显示
            this.idCard=true//凭身份证的状态显示
            this.buyjia=false//凭买家的状态显示
            }else if(item=='凭买家提单提货'){
            this.guoHu=false//直接过户的状态显示
            this.chuanhao=false//凭船号的状态显示
            this.idCard=false//凭身份证的状态显示
            this.buyjia=true//凭买家的状态显示
            }else if(item=='凭原件提货' || item=='补单' ){
            this.guoHu=false//直接过户的状态显示
            this.chuanhao=false//凭船号的状态显示
            this.idCard=false//凭身份证的状态显示
            this.buyjia=false//凭买家的状态显示
            }
           console.log(item)
           this.tiHuoStatus=item
           console.log(this.addForm.tifang)
       },
       //凭车船提货的table添加
        show(index){
          if(this.tiHuoStatus=='凭车船号提货'){
            var obj={
              sijiname:"" ,
              sijiphone:"",
              sijichepai: '',
            }
           this.dataShip.push(obj)
           this.dataShip=this.dataShip
            }else if(this.tiHuoStatus=='凭身份证提货'){
            var obj1={
               icrd:"",
               contact:"",
            }
           this.dataIcrd.push(obj1)
           this.dataIcrd=this.dataIcrd
            }else if(this.tiHuoStatus=='凭买家提单提货'){
                var obj2={
                contactOne:'', 
                bianhao:"",
            }
           this.dataBuy.push(obj2)
           this.dataBuy=this.dataBuy
            }
        
        },
       //凭车船提货的table删除
        remove(index){
            // if(this.dataShip.length=='1'){
            //       return false
            // }
            if(this.tiHuoStatus=='凭车船号提货'){
                this.dataShip.splice(index,1)
                this.dataShip=this.dataShip
                }else if(this.tiHuoStatus=='凭身份证提货'){
                this.dataIcrd.splice(index,1)
                this.dataIcrd=this.dataIcrd
                }else if(this.tiHuoStatus=='凭买家提单提货'){
                this.dataBuy.splice(index,1)
                this.dataBuy=this.dataBuy
                }
           
        }
        //
      
    },
    mounted(){
      console.log(this.$router)
    },
  }
</script>
<style <style lang="less">
.ti_title{
    margin-bottom:20px;

    h2{
    padding: 0;
    margin: 0 4px;
    font-size: 18px;
    font-weight: lighter;
    color: #333;
    line-height: 45px;
    display: inline-block;
    font-weight: 500!important;
    font-family: "Microsoft Yahei";
    }
}
.detail_ti{
    display: flex;
    margin-bottom:15px;
    h2{
    line-height: 28px;
    font-size: 16px;
    margin: 0 4px;
    font-weight: 500!important;
    font-family: "Microsoft Yahei";
    color: #555;
    }
}
.beizhu{
    width: 200px;
    height: 30px;

}

.ivu-input{
     padding: 0!important;
}
.ivu-icon{
    padding-top:5px!important;
}
//.ivu-table-row{
// .ivu-table-cell:nth-of-type(10){
//     div{
//      display:flex!important;
//     }
// }
// }
.ivu-table-row{
.jianshum{
   div{
        display:flex!important;
   }
}
}
</style>

