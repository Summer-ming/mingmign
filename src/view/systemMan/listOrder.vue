<template>
  <div>
    <row>
      <Form :label-width="120" inline :model="addForm">

        <row>
          <h2 style='text-indent:20px;'>销售单</h2>

          <FormItem label="客户名称:">
            <Select v-model="addForm.cusName" style="width:300px">
              <Option value="贸易商">上市公司</Option>
              <Option value="民企钢厂">民企钢厂</Option>
              <Option value="民企">民企</Option>
              <Option value="国企">国企</Option>
            </Select>
          </FormItem>

          <FormItem label="代理商名称">
            <Select v-model="addForm.agentName" style="width:300px">
              <Option value="贸易商">上市公司</Option>
              <Option value="民企钢厂">民企钢厂</Option>
              <Option value="民企">民企</Option>
              <Option value="国企">国企</Option>
            </Select>
          </FormItem>

          <FormItem label="备注:" prop="note">
            <i-input style="width:300px" type="textarea" :rows="3" v-model="addForm.note" placeholder="请输入备注" />
          </FormItem>

          <FormItem label="导入excel:">
            <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
              <Button type='primary' icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
            </Upload>

            <Row>
              <div class="ivu-upload-list-file" v-if="file !== null">
                <Icon type="ios-stats"></Icon>
                {{ file.name }}
                <Icon v-show="showRemoveFile" type="ios-close" class="ivu-upload-list-remove" @click.native="handleRemove()"></Icon>
              </div>
            </Row>
            <Row>
              <transition name="fade">
                <Progress v-if="showProgress" :percent="progressPercent" :stroke-width="2">
                  <div v-if="progressPercent == 100">
                    <Icon type="ios-checkmark-circle"></Icon>
                    <span>成功</span>
                  </div>
                </Progress>
              </transition>
            </Row>

          </FormItem>
        </row>
      </Form>
    </row>
    <Row class="margin-top-10" style='margin-bottom:20px;'>
      <Table :columns="tableTitle" :data="tableData" :loading="tableLoading"></Table>
    </Row>
    <!-- 添加采购单 -->
    <row class='buy_m'>
      <i-col span='3'><Button icon="ios-trash-outline" type="primary" @click='getList'>添加采购单</Button></i-col>
      <i-col span='9' class='clo_span'>采购单总合计吨位：500吨 买方总金额：50000.00 卖方总金额 ：50000.00</i-col>

    </row>
    <!-- 添加到列表 -->
    <Modal v-model="modal3" @on-ok='confirm' @on-cancel='missOn'>
      <row>
        <Form :label-width="140" inline :model="addSale">
          <FormItem label="请选择要添加的销售单:">
            <Select v-model="modelSaleName" style="width:300px" placeholder="请选择要添加的销售单">
              <Option v-for='(item,index) in da' :value='index' :key='index'>采购单{{index}}</Option>
            </Select>
          </FormItem>
        </Form>

        <Form :label-width="140" inline :model="addSale">
          <FormItem label="请选择件数:">
            <i-input style="width:300px" v-model="addSale.Number" placeholder="请输入剩余件数" />
          </FormItem>
        </Form>
      </row>

    </Modal>
    <!-- 1添加采购单 -->
    <row style='padding-top:30px;' v-for="(item,index) in da" :key='index'>
      <h2 style='margin-bottom:10px;'>采购单{{index}}</h2>
      <Form :label-width="120" inline :model="addOne">
        <FormItem label="代理商名称">
          <Select v-model="addOne.agentName1" style="width:200px">
            <Option value="贸易商">上市公司</Option>
            <Option value="民企钢厂">民企钢厂</Option>
            <Option value="民企">民企</Option>
            <Option value="国企">国企</Option>
          </Select>
        </FormItem>

        <FormItem label="客户名称">
          <Select v-model="addOne.cusName1" style="width:200px">
            <Option value="贸易商">上市公司</Option>
            <Option value="民企钢厂">民企钢厂</Option>
            <Option value="民企">民企</Option>
            <Option value="国企">国企</Option>
          </Select>
        </FormItem>
        <FormItem label="客户名称">
          <Select v-model="addOne.daiName1" style="width:200px">
            <Option value="贸易商">上市公司</Option>
            <Option value="民企钢厂">民企钢厂</Option>
            <Option value="民企">民企</Option>
            <Option value="国企">国企</Option>
          </Select>
        </FormItem>
      </Form>
      <row style='padding-left:47px;margin-bottom:10px;'>
        <Button icon="ios-trash-outline" type="primary" style='margin-right:15px;' @click='romoverO(index)'>删除本单</Button>
        <Button icon="ios-trash-outline" type="primary"  @click='add(index)'>新增一行</Button>
      </row>
      <row>
        <Table :columns="tabThreeTittle" :data="item.tableTwo"></Table>
      </row>

    </row>
    <!-- 2 -->
     <!-- <Table :columns="columns1" :data="data1"></Table> -->

  </div>
</template>
<script>
export default {
  name: 'listOrder',
  components: {

  },
  data() {
    return {
      columns1: [
                    {
                        title: 'Name',
                        key: 'name',
                        render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.name,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
                        
                    },
                    {
                        title: 'Age',
                        key: 'age',
                        render:(h,params)=>{
                          return h('div',[
                             h('InputNumber',{
                              
                             on:{
                      'on-change':(event)=>{
                        console.log(event)
                        console.log(params)
                      }
                    }
                          })
                          ])
                        }
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    }
                ],
                data1: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ],
      modelSaleName: '',
      indexOne: '',//保存下下标
      da: [{
        tableTwo: []
      }],
      columsOne:[
        {
          key:'品名',
          title:'品名',
        },
        {
          key:'规格',
          title:'规格',
        },
         {
          key:'牌号',
          title:'牌号',
        },
        {
          key:'产地/品牌',
          title:'产地/品牌',
        },
        {
          key:'交货地	',
          title:'交货地',
        },
        {
          key:'仓库',
          title:'仓库',
        },
        {
          key:'件数',
          title:'件数',
        },
        {
          key:'总重',
          title:'总重',
        },
        {
          key:'挂牌价格',
          title:'挂牌价格',
        },
        {
          key:'底价',
          title:'底价',
        },
        {
          key:'捆包号',
          title:'捆包号',
        },
        {
          key:'备注',
          title:'备注',
        },

      ],
      tableData1: [],//采购单数组
      tableOne: '',//添加数组
      tableTwo: [],//添加到数组
      tabThreeTittle: [],//添加到采购单的表头
      modal3: false,
      uploadLoading: false, //上传进度条
      progressPercent: 0,//默认进度条为0
      showProgress: false,//是否显示进度条
      showRemoveFile: false,//移除
      file: null,//上传文件的名字
      tableData: [],//上传的表格数据
      tableTitle: [],//表格表头
      tableLoading: false,//表格显示进度
      addForm: {
        cusName: '',//客户名称
        agentName: "",//代理商名称
        note: "",//备注
      },
      addOne: { //添加采购单的form
        agentName1: "",
        cusName1: "",
        daiName1: ""
      },
      addSale: {
        SaleName: '',//销售的name
        Number: "",//选择件数
      }
    }
  },
  methods: {
    initUpload() {
      this.file = null
      this.showProgress = false
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
    },
    handleUploadFile() {
      this.initUpload()
    },
    handleRemove() {
      this.initUpload()
      this.$Message.info('上传的文件已删除！')
    },
    handleBeforeUpload(file) {
      const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      if (fileExt === 'xlsx' || fileExt === 'xls') {
        this.readFile(file)
        this.file = file
      } else {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
        })
      }
      return false
    },
    // 读取文件
    readFile(file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.tableLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {//进度条
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {//文件报错
        this.$Message.error('文件读取出错')
      }
      reader.onload = e => {//excel文件读取成功
        this.$Message.info('文件读取成功')
        console.log(e)
        const data = e.target.result
        import('@/libs/excel').then(excel => {
          const { header, results } = excel.read(data, 'array')
          const tableTitle = header.map(item => { return { title: item, key: item } })
          const tabThreeTittle = header.map(item => { return { title: item, key: item } }) //添加到表单的表头
          console.log('表头')
          console.log(tableTitle)
          this.tableData = results
          console.log(results)
          this.tableData1 = results//采购单数组
          this.tabThreeTittle = tabThreeTittle //添加到采购单的表单
          let obj = {
            title: '操作',
            key: '操作',
            align: 'center',
            width: '160',
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
                }, '添加到'),

              ]);
            }          }
          let obj1 = {
            title: '操作',
            key: '操作',
            align: 'center',
            width: '100',
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
                      this.remove1(params.index)
                    }
                  }
                }, '删除'),
              ]);
            }          }
          this.tabThreeTittle.push(obj1)//添加采购单的表头
          this.columsOne.push(obj1)
          this.tableTitle = tableTitle
          this.tableTitle.push(obj)
          this.uploadLoading = false
          this.tableLoading = false
          this.showRemoveFile = true
        })
      }
    },
    //添加到
    show(index) {
      this.modal3 = true;
      this.indexOne = index;
      this.tableOne = this.tableData1[index]
      console.log(this.tableData1[index])
    },
    //删除  
    remove(index) {
      this.tableData.splice(index, 1);
    },
    //添加到采购单的删除
    remove1(index) {
      console.log(index)
      console.log(this.modelSaleName)
      this.da[this.modelSaleName].tableTwo.splice(this.modelSaleName, 1);
    },
    //确定添加
    confirm() {
      console.log(this.indexOne, this.modelSaleName)
      this.da[this.modelSaleName].tableTwo.push(this.tableOne)
      console.log(this.da[this.modelSaleName])
      console.log('确定添加----结束')
      console.log(this.da)
    },
    //取消
    missOn() {

    },
    //添加销售单
    getList() {
      this.da.push({
        tableTwo: []
      })
      console.log(this.da)
    },
    //删除本单
    romoverO(index) {
      this.da.splice(index, 1);
    },
    //新增一行
    add(index) {
      console.log(index+'几个采购单的下标')
      var colp=[
        {
          key:'品名',
          title:'品名',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.品名,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'规格',
          title:'规格',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.规格,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
         {
          key:'牌号',
          title:'牌号',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.牌号,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'产地/品牌',
          title:'产地/品牌',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.产地/品牌,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'交货地	',
          title:'交货地',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.交货地,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'仓库',
          title:'仓库',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.仓库,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'件数',
          title:'件数',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.件数,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'总重',
          title:'总重',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.总重,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'挂牌价格',
          title:'挂牌价格',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.挂牌价格,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'底价',
          title:'底价',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.底价,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'捆包号',
          title:'捆包号',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.捆包号,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },
        {
          key:'备注',
          title:'备注',
           render:(h,params)=>{
                          return h('Input',{
                            props:{
                              value:params.row.备注,
                              autosize:true
                            },
                            attrs:{
                              id:params.index
                            },

                          })
                        }
        },

      ]
      this.columsOne=colp
      console.log(this.columsOne)
      let obja = {
        '交货地': this.aa,
        '产地/品牌': "镔鑫特钢",
        '仓库': "厂提",
        '件数': "30",
        '品名': "盘螺",
        '底价': "3860",
        '总重': "32.000 ",
        '挂牌价格': "3860",
        '牌号': "HRB400E",
        '规格': "8",
        '计重方式': "121212",
      };
     // this.da[index].tableTwo.push(obja)
  
    },
    aa(){
      return '112'
    }

  },

  mounted() {
    console.log('mounts======')
  },
}
</script>
<style <style lang="less">
.buy_m {
  display: flex;
  background: #ffffff;
  .clo_span {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 8px;
  }
}
</style>

