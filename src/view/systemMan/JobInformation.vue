<!--
 * @Description: 
 * @Author: gmm
 * @Date: 2019-04-11 10:54:32
 * @其他: 
 -->
<template>
<div>
  <Table :columns="columns" :data="data" >
      <template slot-scope="{ row, index }" slot="kunBaoHao">
          
        <Input type="text" v-model="editName" v-if="editIndex === index" />
        <span v-else>{{ row.kunBaoHao }}</span>
      </template>
     <!-- 类别 -->
    <template slot-scope="{ row, index }" slot="steelName">
       
      <Select v-if="editIndex === index" v-model="leibie" style="width:200px"  @on-change='getChange'>
        <Option v-for="(item,index) in fildtps" :value="item" :key="index">{{ item }}</Option>
    </Select>
      <span v-else>{{ row.steelName }}</span>
    </template>
    <!-- 品名 -->
    <template slot-scope="{ row, index }" slot="pinming">
       
      <Select v-if="editIndex === index" v-model="pinM" style="width:200px"  @on-change='getPin'>
        <Option v-for="(item,index) in pinSHU" :value="item.steelName" :key="index">{{ item.steelName }}</Option>
    </Select>
      <span v-else>{{ row.pinming }}</span>
    </template>

    <!-- 规格 -->
    <template slot-scope="{ row, index }" slot="steelGuige">
       
      <Select v-if="editIndex === index" v-model="guiG" style="width:200px"  @on-change='getGui'>
        <Option v-for="(item,index) in guige" :value="item" :key="index">{{ item}}</Option>
    </Select>
      <span v-else>{{ row.steelGuige }}</span>
    </template>
    <!-- 牌号steelPaihao -->
    <template slot-scope="{ row, index }" slot="steelPaihao">
       
      <Select v-if="editIndex === index" v-model="paiH" style="width:200px"  @on-change='getPai'>
        <Option v-for="(item,index) in paihao" :value="item" :key="index">{{item}}</Option>
    </Select>
      <span v-else>{{ row.steelPaihao }}</span>
    </template>
    <!-- 产地、品牌 steelPinpai -->
    <template slot-scope="{ row, index }" slot="steelPinpai">
      <Input type="text" v-model="chanD" v-if="editIndex === index" />
      <span v-else>{{ row.steelPinpai }}</span>
    </template>
    <!-- 交货地 jiaoHuoDi -->
     <template slot-scope="{ row, index }" slot="jiaoHuoDi">
      <Input type="text" v-model="jiaoD" v-if="editIndex === index" />
      <span v-else>{{ row.jiaoHuoDi }}</span>
    </template>
    <!-- 仓库 warehouse -->
    <template slot-scope="{ row, index }" slot="warehouse"> 
      <Select v-if="editIndex === index" v-model="cangK" style="width:200px"  @on-change='getCangOne'>
        <Option v-for="(item,index) in cangku" :value="item" :key="index">{{item}}</Option>
      </Select>
      <span v-else>{{ row.warehouse }}</span>
    </template>
    <!-- 计重方式 jizhongType -->
     <template slot-scope="{ row, index }" slot="jizhongType"> 
      <Select v-if="editIndex === index" v-model="jiZ" style="width:200px"  @on-change='getjz'>
        <Option v-for="(item,index) in jizhongTypeListThis" :value="item" :key="index">{{item}}</Option>
      </Select>
      <span v-else>{{ row.jizhongType }}</span>
    </template>
    <!-- 件数 jianShu -->
    <template slot-scope="{ row, index }" slot="jianShu">
      <Input type="text" v-model="jianS" v-if="editIndex === index" />
      <span v-else>{{ row.jianShu }}</span>
    </template>
    <!-- 单件重 danjianweight -->
    <template slot-scope="{ row, index }" slot="danjianweight">
      <Input type="text" v-model="danJ" v-if="editIndex === index" />
      <span v-else>{{ row.danjianweight }}</span>
    </template>
    <!-- 总重 weightAll -->
    <template slot-scope="{ row, index }" slot="weightAll">
      <Input type="text" v-model="weightZ" v-if="editIndex === index" :disabled=true />
      <span v-else>{{ row.weightAll }}</span>
    </template>
    <!-- 采购单价 caigouprice-->
     <template slot-scope="{ row, index }" slot="caigouprice">
      <Input type="text" v-model="caiG" v-if="editIndex === index" />
      <span v-else>{{ row.caigouprice }}</span>
    </template>
    <!-- 采购总额 caigouzonge -->
     <template slot-scope="{ row, index }" slot="caigouzonge">
      <Input type="text" v-model="caiZ" v-if="editIndex === index" :disabled=true />
      <span v-else>{{ row.caigouzonge }}</span>
    </template>
    <!-- 杂费1名称 o1Name -->
     <template slot-scope="{ row, index }" slot="o1Name">
      <Input type="text" v-model="oneName" v-if="editIndex === index" />
      <span v-else>{{ row.o1Name }}</span>
    </template>
    <!-- 杂费1金额 o1Money -->
    <template slot-scope="{ row, index }" slot="o1Money">
      <Input type="text" v-model="oneMoney" v-if="editIndex === index" />
      <span v-else>{{ row.o1Money }}</span>
    </template>
    <!-- 选择杂费1公司 o1OrgName -->
     <template slot-scope="{ row, index }" slot="o1OrgName"> 
      <Select v-if="editIndex === index" v-model="comOne" style="width:200px"  @on-change='getComOne'>
        <Option v-for="(item,index) in zafei" :value="item.cusorgName" :key="index">{{item.cusorgName}}</Option>
      </Select>
      <span v-else>{{ row.o1OrgName }}</span>
    </template>
    <!-- ===== -->


    <template slot-scope="{ row, index }" slot="age">
      <Input type="text" v-model="editAge" v-if="editIndex === index" />
      <span v-else>{{ row.age }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="birthday">
      <Input type="text" v-model="editBirthday" v-if="editIndex === index" />
      <span v-else>{{row.birthday}}</span>
    </template>

    <template slot-scope="{ row, index }" slot="address">
      <Input type="text" v-model="editAddress" v-if="editIndex === index" />
      <span v-else>{{ row.address }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="action">
      <div v-if="editIndex === index">
        <Button @click="handleSave(index,row)"  type="primary" style='margin-right:5px;'>保存</Button>
        <Button @click="editIndex = -1"  type="primary">取消</Button>
      </div>
      <div v-else>
        <Button @click="handleEdit(row, index)"  type="primary" style='margin-right:5px;'>编辑</Button>
         <Button   type="primary" style='margin-right:5px;' @click='copyM(row,index)'>复制</Button>
         <Button  type="primary" @click='deleteM(index)'>删除</Button>
      </div>


    </template>
  </Table>
    <Button   type="primary" @click='getAdd' style='margin-right:15px;'>提交</Button>
        

      <row>

         <el-select v-model="value8" filterable placeholder="请选择" @change='getBB'>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
      </row>

      <row>
         <Col span="12" style="padding-right:10px">
            <Select v-model="model11" filterable @on-change="getCC">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.value }}</Option>
            </Select>
        </Col>
      </row>

      <!-- 测试大数据表格 -->

          <vxe-table
          border
          show-overflow
          :data.sync="tableData"
          :edit-config="{key: 'id',trigger: 'click', mode: 'cell'}">
          <vxe-table-column type="index" width="60"></vxe-table-column>
          <vxe-table-column field="name" title="Name" :edit-render="{name: 'input'}">
            <template v-slot:edit="{ row }">
              <input type="text" v-model="row.name" class="custom-input">
            </template>
          </vxe-table-column>
          <vxe-table-column field="age" title="Age" :edit-render="{autofocus: '.custom-input'}">
            <template v-slot:edit="{ row }">
              <input type="number" v-model="row.age" class="custom-input">
            </template>
          </vxe-table-column>
          <vxe-table-column field="date3" title="Date" :edit-render="{name: 'input'}">
            <template v-slot:edit="{ row }">
              <input type="date" v-model="row.date3" class="custom-input">
            </template>
            <template v-slot="{ row }">选中日期：{{ row.date3 }}</template>
          </vxe-table-column>
<!-- 
          <vxe-table-column field="sex" title="下拉" :edit-render="{name: 'ElSelect'}">
            <template v-slot:edit="{row}">
              <Select v-model="sex" filterable style="width:200px" placeholder="请选择" >

              <Option v-for="(item,index) in sexList" :value="item.label" :label="item.value" :key="index" >{{ item.label }}</Option>

            </Select>
              
            </template>
          </vxe-table-column> -->


           <vxe-table-column field="sex" title="下拉" :edit-render="{name: 'ElSelect'}" :footer-method="footerMethod">
            <template v-slot:edit="{ row }">
             <el-select v-model="row.sex" placeholder="请选择">
                <el-option @change='getComOne' 
                  v-for="item in sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <template v-slot="{ row }">选中性别：{{ row.sex }}</template>
          </vxe-table-column>

        </vxe-table>


         <vxe-table
          class="mytable-footer"
          border
          show-footer
          height="400"
          show-overflow="tooltip"
          :footer-method="footerMethod"
          :footer-cell-class-name="footerCellClassName"
          :data.sync="tableData">
          <vxe-table-column type="index" width="60" fixed="left"></vxe-table-column>
          <vxe-table-column title="基本信息">
            <vxe-table-column field="name" title="Name" min-width="600" sortable></vxe-table-column>
            <vxe-table-column field="age" title="Age" min-width="600"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column field="date" title="Date" min-width="600"></vxe-table-column>
          <vxe-table-column field="rate" title="Rate" width="200" fixed="right"></vxe-table-column>
        </vxe-table>


            <vxe-table
          ref="xTable"
          border
          max-height="400"
          :span-method="rowspanMethod"
          :data.sync="tableData55">
       
          <vxe-table-column field="id" title="id"></vxe-table-column>
          <vxe-table-column field="name" title="name"></vxe-table-column>
          <vxe-table-column field="amount3" title="amount3"></vxe-table-column>
          
        </vxe-table>



        <!-- 11 -->
          <vxe-toolbar>
      <template v-slot:buttons>
        <vxe-button @click="$refs.xTable1.setRadioRow(tableData[1])">我是设置第二行选中</vxe-button>
        <vxe-button @click="clearRadioRowEevnt">取消选中</vxe-button>
        <vxe-button @click="getRadioEvent1">获取选中</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      border
      ref="xTable1"
      class="radio-table"
      height="300"
      :data.sync="tableData"
      @radio-change="radioChangeEvent">
      <vxe-table-column type="radio" width="60">
        <!-- <template v-slot:header>
          <vxe-button type="text" @click="clearRadioRowEevnt" :disabled="!selectRow">取消</vxe-button>
        </template> -->
      </vxe-table-column>
      <vxe-table-column field="sex" title="Sex"></vxe-table-column>
      <vxe-table-column field="age" title="Age"></vxe-table-column>
      <vxe-table-column field="address" title="Address" show-overflow></vxe-table-column>
    </vxe-table>
        <!-- 22 -->
        

</div>
</template>
<script>
import XEUtils from 'xe-utils'
  import {findShop,findOrgCusAcc} from '@/api/data';//查询店铺  查询公司
  import {getLeiBie} from '@/api/data_8889'//引入8889的接口
  import {companyTypeListAllName,guigeTyoeList,paihaoTypeList,jizhongTypeList} from '@/libs/global_type'
  import {getAgent,getTi,getWarehouse} from '@/api/cusData'//查询代理商
  export default {
    data () {
      return {
          selectRow: null,
        value:'',
        sex:'',
        tableData55:[
          {
          id: '0',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
          le:3
          },
          {
          id: '0',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
          le:3
          },
          {
          id: '0',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
          le:3
          },
           {
          id: '1',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
          le:3
          },
           {
          id: '2',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
          le:3
          },
        ],
        tableData: [
        {
          id: 100,
          name: 'test',
          age: 26,
          sex: '',
          region: ['shenzhen'],
          date: null,
          date1: null,
          date2: null,
          rate: 2,
          flag: true
        }
      ],
      sexList: [
        {
          'label': '男',
          'value': '男,1'
        },
        {
          'label': '女',
          'value': '女,2'
        }
      ],
      regionList: [
        {
          'label': '深圳',
          'value': 'shenzhen'
        },
        {
          'label': '广州',
          'value': 'guangzhou'
        }
      ],
        //=========
          cityList: [
                    {
                        value: '英国',
                        label: 'London'
                    },
                    {
                        value: '美国',
                        label: 'New York'
                    },
                    {
                        value: '新西兰',
                        label: 'Sydney'
                    },
                    {
                        value: '澳大利亚',
                        label: 'Ottawa'
                    },
                    {
                        value: '法国',
                        label: 'Paris'
                    },
                   
                ],
                model11: '澳大利亚',
        //--=-=-=
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, 
        ],
        value8: '1111',
        fildtps:[],//类别数组
        model1:"",
        pinSHU:[],//品名的数组
        paihao:paihaoTypeList,//牌号的数组
        dataNew:[],
        guige:guigeTyoeList,//定义规格的数组
        cangku:[],//仓库的数组
        zafei:[],//杂费的数组
        jizhongTypeListThis:jizhongTypeList,//计重方式
        columns: [
          {
            title:'序号',
            width:'60',
            render: (h, params) => {
                            return h('span', params.index+1);
                        }
          },
          {
            title: '捆包号',
              width:'80',
            slot: 'kunBaoHao'
          },
          {
            title: '类别',
            width:'80',
            slot: 'steelName',
          },//pinming
           {
            title: '品名',
             width:'80',
            slot: 'pinming'
          },
           {
            title: '规格',
             width:'80',
            slot: 'steelGuige'
          },//steelGuige
          {
            title: '牌号',
             width:'80',
            slot: 'steelPaihao'
          },//steelPaihao
          {//steelPinpai
            title: '产地品牌',
             width:'100',
            slot: 'steelPinpai'
          },
          {//交货地 jiaoHuoDi
            title: '交货地',
             width:'80',
            slot: 'jiaoHuoDi'
          },
          {//仓库 warehouse
            title: '仓库',
             width:'80',
            slot: 'warehouse'
          },
          {//击中方式jizhongType
            title: '计重方式',
             width:'100',
            slot: 'jizhongType'
          },
          {//件数jianShu
            title: '件数',
             width:'80',
            slot: 'jianShu'
          },
          {//单件重 danjianweight
            title: '单件重',
             width:'80',
            slot: 'danjianweight'
          },
          {//总重 weightAll
            title: '总重',
             width:'80',
            slot: 'weightAll'
          },
          {//采购单价 caigouprice
            title: '采购单价',
             width:'100',
            slot: 'caigouprice'
          },
          {//采购总额 caigouzonge
           title: '采购总额',
            width:'100',
           slot: 'caigouzonge'
          },
          {//杂费1名称  o1Name
           title: '杂费1名称',
            width:'100',
           slot: 'o1Name'
          },
          {//杂费1金额 o1Money
           title: '杂费1金额',
            width:'100',
           slot: 'o1Money'
          },
          {//选择杂费1公司 o1OrgName
           title: '选择杂费1公司',
            width:'120',
           slot: 'o1OrgName'
          },
          {
            title: '年龄',
             width:'80',
            slot: 'age'
          },
          {
            title: '出生日期',
             width:'80',
            slot: 'birthday'
          },
          {
            title: '地址',
             width:'80',
            slot: 'address'
          },
          {
            title: '操作',
            slot: 'action',
             width:'250',
            fixed:'right'
          }
        ],
        data: [
          {
            kunBaoHao: '捆包号',
            steelName:'类别',//
            pinming:"品名",
            steelGuige:'规格',
            steelPaihao:"牌号",
            steelPinpai:"产地、品牌",
            jiaoHuoDi:'交货地',
            warehouse:'仓库',
            jizhongType:'计重方式',
            jianShu:'件数',
            danjianweight:'单件重',
            weightAll:'总重',
            caigouprice:'采购单价',
            caigouzonge:'采购总额',
            o1Name:"杂费1名称",
            o1Money:'杂费1金额',
            o1OrgName:'选择杂费1公司',
            age: 18,
            birthday: '919526400000',
            address: '北京市朝阳区芍药居'
          },
          
        ],
        editIndex: -1,  // 当前聚焦的输入框的行数
        editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
        editAge: '',  // 第二列输入框
        editBirthday: '',  // 第三列输入框
        editAddress: '',  // 第四列输入框
        leibie:'',
        changeLei:'',//类别选中的值
        pinM:"",
        pinOne:"",//品名改变获取的值
        guiG:"",
        guiOne:'',//规格改变获取的值
        paiH:'',
        paiOne:'',//牌号改变获取的值
        chanD:'',//产地、品牌
        jiaoD:'',//交货地
        cangK:'',
        cangOne:"",//仓库的选中值
        jiZ:"",
        jiOne:'',//计重方式选中的值
        jianS:'',//件数
        danJ:'',//单件重
        weightZ:"",//总重
        caiG:"",//采购单价
        caiZ:'',//采购总额
        oneName:"",//杂费1名称
        oneMoney:'',//杂费1金额
        comOne:'',
        com1:'',//杂费1公司选中的值
        spanArr: [], //遍历数据时，根据相同的标识去存储记录
         pos: 0 // 二维数组的索引
      }
    },
    methods: {
        clearRadioRowEevnt () {
      this.selectRow = null
      this.$refs.xTable1.clearRadioRow()
    },
         radioChangeEvent ({ row }) {
      this.selectRow = row
      console.log('单选事件')
      console.log(row)
    },
     getRadioEvent1 () {
         console.log(JSON.stringify(this.$refs.xTable1.getRadioRow()))
    },
      //===

getSpanArr(data) {　
  for (var i = 0; i < data.length; i++) {
        if (i === 0) {
              this.spanArr.push(1);
              this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
    if (data[i].id === data[i - 1].id) {
                this.spanArr[this.pos] += 1;
                this.spanArr.push(0);
              } else {
                this.spanArr.push(1);
                this.pos = i;
              }
        }
    }
},
      rowspanMethod ({ row, rowIndex, column, columnIndex}) {
        if (columnIndex === 0) {
            const _row = this.spanArr[rowIndex];
           console.log(_row+'-------')
            const _col = _row > 0 ? 1 : 0;
            return {
                      rowspan: _row,
                     colspan: 1
                }
          }
                  // let prevRow = data[$rowIndex - 1]
              // let nextRow = data[$rowIndex + 1]
              // if (column.property === 'id') {
              //   if (prevRow && prevRow.id === row.id) {
              //     return {
              //       rowspan: 0,
              //       colspan: 0
              //     }
              //   }
              //   if (nextRow && nextRow.id === row.id) {
              //     return {
              //       rowspan: 3,
              //       colspan: 1
              //     }
              //   }
              // }
            },
      //==============
  footerCellClassName ({ $rowIndex, column, columnIndex }) {
              if (columnIndex === 0) {
                if ($rowIndex === 0) {
                  return 'col-blue'
                } else {
                  return 'col-red'
                }
              }
            },

      footerMethod ({ columns, data }) {
              return [
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '平均'
                  }
                  if (['age', 'rate'].includes(column.property)) {
                    return XEUtils.mean(data, column.property)
                  }
                  return '-'
                }),
                columns.map((column, columnIndex) => {
                  if (columnIndex === 0) {
                    return '和值'
                  }
                  if (['age', 'rate'].includes(column.property)) {
                    return XEUtils.sum(data, column.property)
                  }
                  return '-'
                })
              ]
            },
      getComOne(value){
         console.log(value)
      },
      getBB(value){
        console.log('我是value选中的值')
        console.log(value);
      

      },
      //测试结束
      getCC(value){
         console.log('我是iview里面的值')
         console.log(value)
         console.log(this.model11)
      },

      handleEdit(row, index) {
        this.editName = row.kunBaoHao; //捆包号
        this.editAge = row.age;
        this.leibie=row.steelName;//类别
        this.pinM=row.pinming//品名
        this.guiG=row.steelGuige//规格
        this.paiH=row.steelPaihao//牌号
        this.chanD=row.steelPinpai//产地、品牌
        this.jiaoD=row.jiaoHuoDi//交货地
        this.cangK=row.warehouse//仓库
        this.jiZ=row.jizhongType//计重方式
        this.danJ=row.danjianweight//单件重
        this.weightZ=row.weightAll//总重
        this.caiG=row.caigouprice//采购单价
        this.caiZ=row.caigouzonge//采购总额
        this.oneName=row.o1Name//杂费1名称
        this.oneMoney=row.o1Money//杂费1金额
        this.comOne=row.o1OrgName//杂费1公司名称
        this.editAddress = row.address;
        this.editBirthday = row.birthday;
        this.editIndex = index;
        console.log(this.editIndex)
        console.log(index)
      },
      //类别改变的时候获取的值
      getChange(value){
        console.log(value)
        this.changeLei=value
        this.dataNew.map((item)=>{
          if(item.steelName==value){
            this.pinSHU = item.children
          }
        })
      },
      //复制一行
      copyM(row,index){
            let obg={
            kunBaoHao: row.kunBaoHao,
            steelName:row.steelName,
            pinming:row.pinming,
            age: row.age,
            birthday: row.birthday,
            address: row.address
        }
        this.data.push(obg)
      },
      //删除
      deleteM(index){
          this.data.splice(index,1)
      },
      //获取类别
      getLei(){
        let param={};
        getLeiBie(param).then(res=>{

          this.dataNew = res.data;

          res.data.map((item)=>{
            this.fildtps.push(item.steelName)
          })
          this.fildtps=this.fildtps
          console.log(this.fildtps)
        })
      },
      //获取杂费公司名字
      getComPany(){
        let param={};

        findOrgCusAcc(param).then(res=>{
          //this.dataCompany=res.data.list
          this.zafei=res.data.list
        })
      },
      //获取仓库
      getCang(){
        let param={pageSize:'9999'};
        getWarehouse(param).then(res=>{
          res.data.list.map((item)=>{
            if(item.warehouseName==null){

            }else{
              this.cangku.push(item.warehouseName)
            }
          })
        })
      },
      //获取品名
      getPin(value){
          console.log(value)
          this.pinOne=value;
      },
      //获取规格改变的值
      getGui(value){
         this.guiOne=value
      },
      //获取牌号
      getPai(value){
        this.paiOne=value;
      },
      //获取仓库选中的值
      getCangOne(value){
        this.cangOne=value
      },
      //获取击中方式
      getjz(value){
         this.jiOne=value
      },
      //获取杂费1公司的值
      getComOne(value){
         console.log(value)
         this.com1=value
        // this.zafei.map((item)=>{
        //   if(item.cusorgName==row.o1OrgName){
        //     this.data[index].o1OrgId=item.cusorgId
        //   }
        // })
      },

      handleSave (index,row) {
        console.log(row)
        this.data[index].kunBaoHao = this.editName;
        this.data[index].age = this.editAge;
        this.data[index].birthday = this.editBirthday;
        this.data[index].address = this.editAddress;
        this.data[index].steelName=this.changeLei//类别
        this.data[index].pinming=this.pinOne//品名
        this.data[index].steelGuige=this.guiOne//规格
        this.data[index].steelPaihao=this.paiOne//牌号
        this.data[index].steelPinpai=this.chanD//产地品牌
        this.data[index].jiaoHuoDi=this.jiaoD//交货地
        this.data[index].warehouse=this.cangOne//仓库
        this.data[index].jizhongType=this.jiOne//计重方式
        this.data[index].jianShu=this.jianS//件数
        this.data[index].danjianweight=this.danJ//单价重
        this.data[index].weightAll=this.weightZ//总重
        this.data[index].caigouprice=this.caiG//采购单价 
        this.data[index].caigouzonge=this.caiZ//采购总额
        this.data[index].o1Name=this.oneName//杂费1名称
        this.data[index].o1Money=this.oneMoney//杂费1金额
        this.data[index].o1OrgName=this.com1//杂费1公司名称
        console.log('类别')
        console.log(this.data[index])
        console.log(this.data[index].steelName)
        this.editIndex = -1;
      },
      getAdd(){
        let obg={
            kunBaoHao: '捆包号',
            age: 18,
            birthday: '919526400000',
            address: '北京市朝阳区芍药居'
        }
        this.data.push(obg)
      }

    },
    mounted(){
       this.getSpanArr(this.tableData55)
       this.getLei();//获取类别
       this.getCang();//获取仓库
       this.getComPany();//获取杂费公司名称
    },
    created(){
      this.tableData55.map((item,index)=>{
        let s=this.tableData55[index];
        if(item.id=s.id){
          console.log(item.id+'我是相同的'+s.id)
          
        }
        console.log(item.id+'我是id')

      })
    }
  }
</script>