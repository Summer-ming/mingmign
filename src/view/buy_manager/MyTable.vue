<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-09-06 13:52:44
 * @其他: 
 -->
<template>
    <div>
        <Button type='primary' style='margin-left:30px;margin-bottom:15px;' @click="serach" >查询</Button>

        <FilterTable :columns="columns" :data="data" @on-gong='getGong' @on-esea="getParams" @on-search="onSearch" @on-data="getData"></FilterTable>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Component from "vue-class-component";
    import FilterTable from "@/view/FilterTable.vue"
    //新增
    import {findOrdersAll,findShop,updateShop,updateOrderStatus,findOrgCusAcc,findOrderEngineering} from '@/api/data'
    import {buyTypeList,orderStatusList,lengthList,belongCompanyList} from '@/libs/global_type'
    import {getBuyTypeLabel} from '@/libs/status_type_color'
    import { getBuyOrderStatus,getBuyOrderIsInStockStatus,getBuyOrderIsInvoiceStatus,getBuyOrderIsPayMoneyStatus} from '@/libs/allStatus'
    import { setTimeout } from 'timers';
    import Utils from '@/api/middle'

    @Component({
        components: { FilterTable }
    })
    export default class MyTable extends Vue {
        tableSize = 'default';
        columnWidth = 200;
        //定义传过来的参数
        params={};
        belongCompanyListThis=belongCompanyList; //公司抬头
        shopList=[];//供应商公司名称
        ageOptions = [
            {
                value: '12',
                name: '全部'
            },
            {
                value: 18,
                name: '18'
            },
            {
                value: 26,
                name: '26'
            },
            {
                value: 30,
                name: '30'
            },
        ];


        //表头
        columns = [
          {
            title: 'ID',
            key: 'id',
            align: 'center',
            width: 60,
            fixed:"left",
          },
          {
            title: '下单时间',
            key: 'createTime',
            align: 'center',
             fixed:"left",
            width: this.columnWidth,
           
            filter: {
                    type: 'DatePicker',
                    stype: 'date',
                    placeholder: '选择日期',
                    size: this.tableSize,	// 和table的size尽量一致
                    margin: '5px auto',
            },
            render:(h,params) =>{
              return  h('div',{
                style:{

                  color: 'red'
                }

              },params.row.createTime.substr(0,10))
            }


          },
          {
            title: '订单号',
            key: 'ordersNo',
            align: 'center',
            width: this.columnWidth,
            filter: {
                        type: 'Input',
                        stype: 'text',
                        placeholder: '订单号',
                        size: this.tableSize,	// 和table的size尽量一致
                        margin: '5px auto',
            },
            render:(h,params) =>{
              return h('a',{
                on:{
                  click: () => {
                    // this.pushOrderInfo(params)

                  }
                }
              },params.row.ordersNo);
            }
          },
          {
            title: '采购方名称',
            key: 'customerOrgName',
            align: 'center',
            width: this.columnWidth,
            filter: {
                 type: 'Select',
                 options:this.belongCompanyListThis,
                 placeholder: '请选择',
                 size: this.tableSize,	// 和table的size尽量一致
                 margin: '5px auto',
            },
            render:(h,params) =>{
              return  h('div',{

              },params.row.customerOrgName.substr(0,5))
            }
          },
          {
            title: '供应商名称',
            key: 'shopOrgName',
            align: 'center',
            width: this.columnWidth,
            filter: {
                type: 'Select',
                options:this.shopList,
                placeholder: '请选择供应商',
                size: this.tableSize,	// 和table的size尽量一致
                margin: '5px auto',
            },
            render:(h,params) =>{
              return h('a',{
                on:{
                  click: () => {
                    // localStorage.setItem('a',true)
                    // const route = {
                    //   name: 'Supplier_business',
                    //   query:params.row

                    // }
                    // this.$router.push(route)
                  }
                }
              },params.row.shopOrgName);
            }

          },
          {
            title: '合同金额(元)',
            key: 'moneyAll',
            align: 'center',
           width: this.columnWidth,
           
            render:(h,params) =>{
              return h('div',{
              },this.$global.isMoneyShow(params.row.moneyAll))
            }
          },
          {
            title: '合同重量(吨)',
            key: 'zhongliangAll',
            align: 'center',
           width: this.columnWidth,
            render:(h,params) =>{
              return h('div',{
              },this.$global.accPrecision(params.row.zhongliangAll,3))
            }
          },
          {
            title: '实提重量(吨)',
            key: 'deliveryTotalWeight',
            align: 'center',
            width: this.columnWidth,
            render:(h,params) =>{
              return h('div',{
              },this.$global.accPrecision(params.row.deliveryTotalWeight,3))
            }
          },
          {
            title: '实提总货款(元)',
            key: 'deliveryTotalMoneyCus',
            align: 'center',
            width: this.columnWidth,
            render:(h,params) =>{
              return h('div',{
              },this.$global.isMoneyShow(params.row.deliveryTotalMoneyCus))
            }
          },

          {
            title: '工程名称',
            key: 'gongcheng',
            align: 'center',
           width: this.columnWidth,
          },
          {
            title: '采购类型',
            key: 'buyType',
            align: 'center',
           width: this.columnWidth,
            render:(h,params)=>{
              return h('div',{
              },getBuyTypeLabel(params.row.buyType))
            }
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            width: this.columnWidth,
            render:(h,params)=>{
              return h('div',{
                props:{
                },
                attrs:{
                  id:params.index
                },
              },getBuyOrderStatus(params.row.status))
            }
          },
          {
            title: '付款状态',
            key: 'payMoneyStatus',
            align: 'center',
            width: this.columnWidth,
            render:(h,params)=>{
              return h('div',{
                props:{
                },
                attrs:{
                  id:params.index
                },
              },getBuyOrderIsPayMoneyStatus(params.row.payMoneyStatus))
            }
          },
          {
            title: '入库状态',
            key: '',
            align: 'center',
            width: this.columnWidth,
            render:(h,params)=>{
              return h('div',{
                props:{
                },
                attrs:{
                  id:params.index
                },
              },getBuyOrderIsInStockStatus(params.row.status))
            }
          },
          {
            title: '开票状态',
            key: '',
            align: 'center',
            width: this.columnWidth,
            render:(h,params)=>{
              return h('div',{
                props:{
                },
                attrs:{
                  id:params.index
                },
              },getBuyOrderIsInvoiceStatus(params.row.status))
            }
          },

          {
            title: '管理员',
            key: 'userName',
            align: 'center',
            width: this.columnWidth,
          },
          //剩余应付金额 = 合同金额 - 已付金额；
          {
            title: '已付金额(元)',
            key: 'receivedMoney',
            align: 'center',
            width: this.columnWidth,
            render:(h,params) =>{
              return h('div',{
              },this.$global.isMoneyShow(params.row.receivedMoney))
            }
          },
          {
            title: '剩余应付金额(元)',
            key: '',
            align: 'center',
            width: this.columnWidth,
            render:(h,params) =>{
              //订单未实提之前 用合同金额 - 收款金额
              //订单实提之后 用实提金额 - 收款金额
              let b = params.row.moneyAll;
              if(Number(params.row.status)>=8 && Number(params.row.status)<=90){//已经实提
                b= params.row.deliveryTotalMoneyCus
              }
              let a = this.$global.accMinus(b,params.row.receivedMoney)
              return h('div',{
              },this.$global.isMoneyShow(a))
            }
          },
        ];
        //表数据
        data = [];

     
        //查看
        showIndex(index) {
            this.$Modal.info({
                title: "User Info",
                content: `Name：${this.data[index].name}<br>Age：${this.data[index].age}<br>Address：${this.data[index].address}`
            })
        }
        //删除
        removeIndex(index) {
            alert(index);
        }

        screen(item, search) {
            for (let s in search) {
                if (!item.includes(search[s])) {
                    return
                }
            }
            return true;
        }

        onSearch(search) {
            let data = [];

            console.log('要结束')
            console.log(this.params)

            console.log('=====')
            console.log(search)
            for (let item of this.data1) {
                if (this.screen(Object.values(item), Object.values(search))) {
                    data.push(item)
                }
            }
            this.data = data;
        }
        //获取表格数据
        getData(data){
            console.log('我是传过来的数据')
            console.log(data)
            this.data=data
        }
        //获取供应商的数据
        getGong(data){
            console.log('我是供应商')
               data.map((item)=>{
                let paGong={};
                paGong.value=item.cusorgName; 
                paGong.label=item.cusorgId;
                this.shopList.push(paGong)           
            })
           
           console.log(this.shopList)
           console.log(this.belongCompanyListThis)

        }
        getParams(params){
            console.log('我是传传过来的参数')
            this.params=params;
            console.log(params)
        }
        serach(){
            let search=this.params

            this.onSearch(search);
        }

    }
</script>

<style lang="stylus" scoped>
</style>

