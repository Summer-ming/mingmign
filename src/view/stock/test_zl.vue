<!--
 * @Description: 
 * @Author: zl
 * @others: 
 * @Date: 2019-04-02 11:08:59
 -->

 <template>
  <div>
    <Card :border="false" :dis-hover="true">
        <Form  :model="formAgent" :label-width="80">
            <Row>
              <Col span="3">
                 <Button shape="circle" icon="md-refresh" @click="reloadSelf"></Button>
              </Col>
                 <Button type="info" icon="md-add" ghost @click="modelitem = true">选择Excel上传</Button>
            </Row>
            <Table border :columns="column1" :data="data1" @on-select='selectOne' style='margin-bottom:10px;'>
            </Table>
            <Page @on-change='changePage' style="margin-top:10px"   :total="totalM" show-total show-elevator ></Page>                
        </Form>
    </Card>

    <Modal v-model="modelitem" title="通过excel上传"  @on-ok="modal_ok" @on-cancel="modal_cancel" fullscreen  >
      <div>
        <Card title="导入EXCEL">
           <Row>
             <Upload action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
               <Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>
             </Upload>
           </Row>
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
         </Card>
    <Row class="margin-top-10">
      <Table :columns="tableTitle" :data="tableData" :loading="tableLoading"></Table>
    </Row>
    </div>
    </Modal>

  </div>
</template>

<script>
import {findAgent,addAgent,updateAgent} from '@/api/warehouse'

  export default {
    inject:['reload'],  //調用組建app.vue
            data () {
                return {
                    formAgent: {
                    },
                    totalM : 0,
                    pagesize:1,//默认分页第一页
                    data1 : [],   //表格展现的数据
                    
                   modalTitle : '',
                    column1 : [
                      { title: '选中',
                        type: 'selection',
                        width: 60,
                        align: 'center'
                      },
                      {
                        title: 'ID',
                        key: 'id',
                        align: 'center',
                        width:'60'
                      },
                      {
                        title: '代理简称',
                        key: 'shortName',
                        align: 'center',
                        width:'200'
                      },
                      {
                        title: '公司名称',
                        key: 'companyName',
                        align: 'center',
                        width:'300'
                      },
                      {
                        title: '管理员名称',
                        key: 'userName',
                        align: 'center',
                        width:'200'
                      },
                      {
                        title: '创建时间',
                        key: 'timeCreate',
                        align: 'center',
                        width:'250'
                      }
                        ],  //column1
                        modelitem:false,
                    } //return
            },

 methods:{
    selectOne(row){
         console.log(row)
       },

      //刷新页面
       reloadSelf(){
            this.reload();
        },

      //取消按钮
      cancel(name){
        this.$refs[name].resetFields();
      },


       //分页
       changePage(index){
           console.log(index)
           this.pagesize=index;
       },

       //查询接口
       getSerch(param){
         findAgent(param).then(res=>{
            if(res.code =="100"){
            this.data1=res.data.list;
            this.totalM=res.data.total; 
            console.log(res.data.total);//总条数 
          }  
         })
       },
        },//methods的后括号

        mounted(){
         //账户管理接口
          this.getSerch();
          },

//excel 上传使用
     initUpload () {
      this.file = null
      this.showProgress = false   
      this.loadingProgress = 0
      this.tableData = []
      this.tableTitle = []
    },
    handleUploadFile () {
      this.initUpload()
    },
    
    // handleRemove () {
    //   this.initUpload()
    //   this.$Message.info('上传的文件已删除！')
    // },

    //判断文件类型
    handleBeforeUpload (file) {
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
    readFile (file) {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadstart = e => {
        this.uploadLoading = true
        this.tableLoading = true
        this.showProgress = true
      }
      reader.onprogress = e => {
        this.progressPercent = Math.round(e.loaded / e.total * 100)
      }
      reader.onerror = e => {
        this.$Message.error('文件读取出错')
      }
      reader.onload = e => {
        this.$Message.info('文件读取成功')
        const data = e.target.result
        import('@/libs/excel').then(excel => {
          const {header, results} = excel.read(data, 'array')
          const tableTitle = header.map(item => { return { title: item, key: item } })
          this.tableData = results
          this.tableTitle = tableTitle
          this.uploadLoading = false
          this.tableLoading = false
          this.showRemoveFile = true
        })
      }
    }

  }
</script>

