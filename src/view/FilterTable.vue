<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-09-06 13:46:19
 * @其他: 
 -->
<template>
    <div>
        <Table :loading="loading" :border="border" :size="size" :height="height" :highlight-row="highlightRow" :no-data-text="noDataText"
               :no-filtered-data-text="noFilteredDataText" @on-current-change="onCurrentChange"
               @on-select="onSelect" @on-select-all="onSelectAll"
               @on-selection-change="onSelectionChange" :columns="columns" :data="data"></Table>
    </div>
    <!-- @on-row-dblclick="onRowDbclick"-->
</template>

<script>
    import Vue from 'vue'
    import Component from "vue-class-component";
    import {findOrdersAll,findShop,updateShop,updateOrderStatus,findOrgCusAcc,findOrderEngineering} from '@/api/data'
import { stringify } from 'querystring';

    @Component({
        props: {
            columns: {type: Array, required: true},
            data: {type: Array, required: true},
            size: {type: String, default: 'default'},
            height: {type: Number, default: null},
            highlightRow: {type: Boolean, default: true},
            border: {type: Boolean, default: true},
            loading: {type: Boolean, default: false},
            noDataText: {type: String, default: '暂无数据'},
            noFilteredDataText: {type: String, default: '没有找到你要搜索的数据'},
        }
    })
    export default class FilterTable extends Vue {

        search = {};  //过滤条件保存的对象,就是保存Input框和Select中值
        orderStatus='';

        created() {
            for (let col of this.columns) {
                let childColumn = {...col};
                delete childColumn.filter;
                let children = [];
                let renderHeader = (h) => {
                };
                // 如果存在过滤选项
                if (col.filter) {
                    //过滤为下拉选择框
                    if (col.filter.type && col.filter.type === 'Select') {
                        renderHeader = (h) => {
                            return h(col.filter.type, {
                                props: {
                                    value: null,   // Select选项列表一般 '' 或 null 为全部
                                    placeholder: col.filter.placeholder ? col.filter.placeholder : "请选择",
                                    size: col.filter.size ? col.filter.size : 'default'
                                },
                                style: {
                                    width: col.width ? col.width - 40 + 'px' : null,
                                    margin: col.filter.margin ? col.filter.margin : '5px auto'
                                },
                                on: {
                                    'on-change': (val) => {
                                        if (val === '' || val === null) {
                                            // 当选项是全部的时候删除search中该字段的过滤条件
                                            this.$delete(this.search, col.key);
                                            this.load();
                                            return;
                                        }
                                        //添加字段过滤条件
                                        this.$set(this.search, col.key, val);
                                        this.load();
                                    }
                                }
                            }, this.createOptionsRender(col, h));
                        }
                    } else if (col.filter.type && col.filter.type === 'Input') {
                        // 如果是输入框
                        renderHeader = (h) => {
                            // 通过回车和点击搜索按钮才进行数据过滤查询,如果
                            // 要输入框变化就进行过滤,把 this.load()放到
                            // input事件方法就行了
                            let inputValue = {};
                            return h(col.filter.type, {
                                props: {
                                    // icon: 'ios-search'
                                    type: col.filter.stype ? col.filter.stype : 'text',
                                    placeholder: col.filter.placeholder ? col.filter.placeholder : "",
                                    size: col.filter.size ? col.filter.size : 'default'
                                },
                                style: {
                                    width: col.width ? col.width - 40 + 'px' : null,
                                    margin: col.filter.margin ? col.filter.margin : '5px auto'
                                },
                                on: {
                                    input: val => {
                                        inputValue = val;
                                        console.log('input得知')
                                        console.log(inputValue)
                                        console.log('我是参数')
                                        console.log(col)
                                        console.log(this.search)
                                        //下面是新加的gmm
                                        this.$set(this.search, col.key, val);
                                        if (!inputValue) {
                                            this.validInputValue(col, inputValue);
                                        }

                                    },
                                    // input框后面的搜索按钮的点击事件
                                    'on-click': () => {
                                        this.validInputValue(col, inputValue);
                                    },
                                    'on-enter': () => {
                                        this.validInputValue(col, inputValue);
                                    }
                                }
                            })
                        };
                    } else if (col.filter.type && col.filter.type === 'DatePicker') {
                        // 如果是时间框
                        renderHeader = (h) => {
                            let inputValue = {};
                            return h(col.filter.type, {
                                props: {
                                    type: col.filter.stype ? col.filter.stype : "date",
                                    placement: "bottom-end",
                                    placeholder: col.filter.placeholder ? col.filter.placeholder : "查询日期",
                                    size: col.filter.size ? col.filter.size : 'default'
                                },
                                style: {
                                    width: col.width ? col.width - 40 + 'px' : null,
                                    margin: col.filter.margin ? col.filter.margin : '5px auto'
                                },
                                on: {
                                    'on-change': (val) => {
                                        if (!val) {
                                            this.$delete(this.search, col.key);
                                        } else {
                                            this.$set(this.search, col.key, val);
                                        }
                                        this.load();
                                        console.log(this.search)
                                    },
                                    // 'on-clear': () => {
                                    //     alert(3)
                                    //     this.$delete(this.search, col.key);
                                    //     this.load();
                                    // },
                                }
                            })
                        };
                    }
                    this.$set(childColumn, 'renderHeader', renderHeader);
                    children.push(childColumn);
                    this.$set(col, 'children', children);
                }
            }
          
            this.searchM();//列表查询
            this.getShop();//供应商查询
            this.$emit('on-esea', this.search);//这里传的参数调接口使用
        }

        createOptionsRender(col, h) {
            // 选项渲染
            let optionRender = [];
            if (col.filter.options) {
                let options = col.filter.options;
                for (let option of options) {
                    optionRender.push(h('Option', {
                        props: {
                            value: option.value
                        }
                    }, option.name))
                }
            }
            return optionRender;
        }
        //table默认加载数据
        //查询表格
      searchM(){
        //获取查询的input的值
        let param             = {};
        param.orderShopOrgId = ''  //name
        param.pageNum        = 10           //分页
        param.beginTime      = ''    //创建时间
        param.endTime        = ''      //截止时间
        //根据订单状态查询
        if(this.orderStatus == "1"){
          param.beginStatus = -1 ;
          param.endStatus   = 1 ;
        }else if(this.orderStatus == "2" || this.orderStatus == "6"){
          param.beginStatus = 2 ;
          param.endStatus   = 7 ;
        }else if( this.orderStatus=="") {
          //默认查询 1到90的
          param.beginStatus = -1 ;
          param.endStatus   = 90 ;
        }else{
          param.beginStatus = this.orderStatus ;
          param.endStatus   = this.orderStatus ;
        }

        param.ordersType   = ''
        param.ordersNoLike = ''
        param.userId       = this.$global.adminInfo.id;
        param.pageSize     = 10;
        param.bankJgId     = '';
        param.engineering    = '';  //工程名称
        console.log("查询"+this.$global.adminInfo.id +"_"+this.$global.adminInfo.cname)
        this.getSerch(param)
      }

        //查询接口
      getSerch(param){
        findOrdersAll(param).then(res=>{
          if(res.code =="100"){
               //这里是想table组件传递数据
           console.log(res)
           //this.data1=res.data.list;
            //this.totalM=res.data.total;
            this.$emit('on-data',res.data.list);//这里是接口请求的数据
          }
        })
      }
      //查询供应商公司的名字
    getShop(){
        let param = {};
        param.pageNum ="1";
        // param.orgRoleType = "2";
        param.pageSize = "999999"
        findOrgCusAcc(param).then(res=>{
          if(res.code =="100"){
            //this.shopList=res.data.list
        
            this.$emit('on-gong',res.data.list);//这里传的参数调接口使用

          }
        })
      }

        // 重新加载数据
        load() {
            // 会执行一个load的事件
            this.$emit('on-search', this.search);
        }

        // 验证输入框的值
        validInputValue(col, inputValue) {
            console.log('input的值=========')
            console.log(col)
            console.log(inputValue)

            if (!inputValue) {
                this.$delete(this.search, col.key);
                this.load();
                return;
            }
            this.$set(this.search, col.key, inputValue);
            this.load();
        }

        onCurrentChange(currentRow, oldCurrentRow) {
            this.$emit('on-current-change', currentRow, oldCurrentRow)
        }

//        onRowDbclick(currentRow, index) {
//            this.$emit('on-row-dblclick', currentRow, index)
//        }

        onSelect(selection) {
            this.$emit('on-select', selection)
        }

        onSelectAll(selection) {
            this.$emit('on-select-all', selection)
        }

        onSelectionChange(selection) {
            this.$emit('on-selection-change', selection)
        }
    }
</script>

<style lang="stylus" scoped>
</style>
