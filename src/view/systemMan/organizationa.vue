<template>
  <div>
    <Card :bordered="false" :dis-hover="true">
        <Row style="margin-bottom:20px;">
          <Col span="3">
            <Button  icon="md-add" type="primary" ghost @click="modal10 = true">添加人员</Button>
          </Col>
          <Col span="3">
            <Button  icon="md-add" type="success">修改</Button>
          </Col>
          <Col span="3">
            <Button  icon="ios-trash-outline" type="error">删除</Button>
          </Col>
        </Row>
    </Card>
    <!--slot表格 -->
    <Table :columns="columns" :data="data2" style='margin-bottom:20px;'>
      <template slot-scope="{ row, index }" slot="name">
        <Input type="text" v-model="editName" v-if="editIndex === index" />
        <span v-else>{{row.name}}</span>
      </template>

      <template slot-scope="{ row, index }" slot="age">
        <Input type="text" v-model="editAge" v-if="editIndex === index" />
        <span v-else>{{ row.age }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="birthday">
        <Input type="text" v-model="editBirthday" v-if="editIndex === index" />
        <span v-else>{{ getBirthday(row.birthday) }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="address">
        <Input type="text" v-model="editAddress" v-if="editIndex === index" />
        <span v-else>{{ row.address }}</span>
      </template>

      <template slot-scope="{ row, index }" slot="action">
        <div v-if="editIndex === index">
          <Button @click="handleSave(index)">保存</Button>
          <Button @click="editIndex = -1">取消</Button>
        </div>
        <div v-else>
          <Button @click="handleEdit(row, index)">操作</Button>
        </div>
      </template>
    </Table>
    <Page :total="100" />
    <!-- 添加人员的模态框 -->
    <Modal
        :title="Title"
        v-model="modal10"
        :mask-closable="false" width='700px'>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
    </Modal>
  </div>
</template>
<script>
  export default {
    name: 'organizationa',
    data(){
      return {
        Title:'添加工作人员',
        modal10: false,
        columns: [
          {
            title: '姓名',
            slot: 'name'
          },
          {
            title: '年龄',
            slot: 'age'
          },
          {
            title: '出生日期',
            slot: 'birthday'
          },
          {
            title: '地址',
            slot: 'address'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        data2: [
          {
            name: '王小明',
            age: 18,
            birthday: '919526400000',
            address: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            age: 25,
            birthday: '696096000000',
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            birthday: '563472000000',
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            birthday: '687024000000',
            address: '深圳市南山区深南大道'
          }
        ],
        editIndex: -1,  // 当前聚焦的输入框的行数
        editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
        editAge: '',  // 第二列输入框
        editBirthday: '',  // 第三列输入框
        editAddress: '',  // 第四列输入框
      
      }
    },
    methods:{
        handleEdit (row, index) {
        this.editName = row.name;
        this.editAge = row.age;
        this.editAddress = row.address;
        this.editBirthday = this.getBirthday(row.birthday);
        this.editIndex = index;
      },
      handleSave (index) {
        this.data2[index].name = this.editName;
        this.data2[index].age = this.editAge;
        this.data2[index].birthday = this.getBirthday(this.editBirthday);
        this.data2[index].address = this.editAddress;
        this.editIndex = -1;
      },
      getBirthday (birthday) {
        const date = new Date(parseInt(birthday));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
      },
    },
    mounted () {
        
     },
    created(){

    }
  }
</script>

<style lang="less" scoped>

</style>

