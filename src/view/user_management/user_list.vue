<template>
  <div>
      <div>
        <Card :bordered="false">
          <Button type="info" @click="add()" icon="ios-add" ghost>添加用户</Button>
            <!-- <Input v-model="value" placeholder="Enter something..." style="width:300px" /> -->
            <Button type="info" @click="searchEvents()">查询</Button>
        </Card>
      </div>
      <div>
          <Card :bordered="false">
              <Table :columns="columns1" :data="data1"></Table>
              <Page @on-change="changePage" style="margin-top:10px" :page-size="pageSize" :total="dataCount" show-total></Page>
          </Card>
      </div>
  </div>
</template>
<script>
import {getUserList} from '@/api/data'
export default{
  data(){
    return {
      value:'',
      columns1:[{
        title:'ID',
        key:'id'
      },{
        title:'姓名',
        key:'cname'
      },{
        title:'手机号',
        key:'phone'
      },{
        title:'部门',
        key:'departmentName'
      }],
      data1:[],
      dataCount:0,
      pageSize:10,
      searchPage:1
    }
  },
  methods:{
    add(){
      console.log("去添加");
        this.$router.push(
          {
           name:'user_add'
          }
        )
    },
    searchEvents(){
      console.log("点击查询")
    },
    changePage(index){
      this.searchPage = index;
      this.getTable();
    },
    getTable(){
      let param = {};
      param.pageNum = this.searchPage;
      getUserList(param).then(res=>{
        if(res.code == "100"){
          this.dataCount = res.data.total;
          this.data1 = res.data.list;
        }
      })
    }
  },
  created(){
    this.getTable();
  }
}
</script>