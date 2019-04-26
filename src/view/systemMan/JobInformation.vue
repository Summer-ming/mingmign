<template>
  <div>
    <Card :border="false" :dis-hover="true">
      <Form :model="formItem" :label-width="80">
        <Row>
          <Col span="5"><FormItem label="岗位名称">
          <Input  placeholder="请输入岗位名称" v-model='formItem.gang'></Input>
        </FormItem>
        </Col>
          <Col span="7" style='margin-right:20px;'>
            <FormItem label="部门">
              <Select v-model="formItem.select">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="5">
             <Button type='primary' @click='searchM()'>查询</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false" :dis-hover="true">
        <Row style="margin-bottom:20px;">
          <Col span="3">
            <Button  icon="md-add" type="primary" ghost @click='modal10 = true'>添加人员</Button>
          </Col>
          <Col span="3">
            <Button  icon="md-add" type="success">修改</Button>
          </Col>
          <Col span="3">
            <Button  icon="ios-trash-outline" type="error">删除</Button>
          </Col>
        </Row>
    </Card>

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
          <Button @click="handleEdit(row, index)">编辑</Button>
        </div>
      </template>
    </Table>
    <Page :total="100" />
    <Button type='success' @click='tianjia'>点击出现提示</Button>
    <!-- 表格 -->
     <Table border :columns="columns7" :data="data6"></Table>
    <!--添加人员弹窗-->
    <Modal
        :title="Title"
        v-model="modal10"
        :mask-closable="false" width='700px'>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="mail">
            <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
        </FormItem>
        <FormItem label="城市" prop="city">
            <Select v-model="formValidate.city" placeholder="Select your city">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
        <FormItem label="日期">
            <Row>
                <Col span="11">
                    <FormItem prop="date">
                        <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="11">
                    <FormItem prop="time">
                        <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem label="性别" prop="gender">
            <RadioGroup v-model="formValidate.gender">
                <Radio label="male">Male</Radio>
                <Radio label="female">Female</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="兴趣" prop="interest">
            <CheckboxGroup v-model="formValidate.interest">
                <Checkbox label="吃"></Checkbox>
                <Checkbox label="睡"></Checkbox>
                <Checkbox label="跑"></Checkbox>
                <Checkbox label="电影"></Checkbox>
            </CheckboxGroup>
        </FormItem>
        <FormItem label="备注" prop="desc">
            <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
    </Modal>

  </div>
</template>
<script>
  export default {
    name: 'addM',
    data(){
      return {
        formItem: {
          gang: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: '',
        },
         formValidate: {
          name: '',
          mail: '',
          city: '',
          gender: '',
          interest: [],
          date: '',
          time: '',
          desc: ''
        },
        ruleValidate: {
                    name: [
                        { required: true, message: '名字不能为空', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: '邮箱不能为空', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    gender: [
                        { required: true, message: '选择性别', trigger: 'change' }
                    ],
                    interest: [
                        { required: true, type: 'array', min: 1, message: '选择至少一个兴趣', trigger: 'change' },
                        { type: 'array', max: 2, message: '最好多选择两个', trigger: 'change' }
                    ],
                    date: [
                        { required: true, type: 'date', message: '请选则日期', trigger: 'change' }
                    ],
                    time: [
                        { required: true, type: 'string', message: '请选择时间', trigger: 'change' }
                    ],
                    desc: [
                        { required: true, message: '请输入一个人的描述', trigger: 'blur' },
                        { type: 'string', min: 20, message: '不能超过20个字', trigger: 'blur' }
                    ]
                },
        // 111
        modal10:false, //控制添加人员弹窗
        Title:'添加人员',
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
        dataMM:['明明','小明','日月','星辰'],
        dataMM1:['1','2','3','4'],
        dataMM2:['天','地','玄'],
        columns7: [
                    {
                        title: 'Name',
                        key: 'name',
                        render:(h,params)=>{
                        return h('Select', {
                        props:{
                            value:params.row.name,
                        },
                        on: {
                            'on-open-change':() => {
                                 console.log('112121212')
                                //  this.data6[params.index].name=event
                                //  console.log(this.data6)
                                 console.log(event)
                                },
                             'on-change':(event)=>{
                               this.data6[params.index].name=event
                                console.log(event)
                            }
                            },
                        },
                        [
                            h('Option',{
                                props: {
                                    value: '建材'
                                }
                            },'建材'),
                            h('Option',{
                                props: {
                                    value: '销售'
                                }
                            },'销售'),
                             h('Option',{
                                props: {
                                    value: '买家'
                                }
                            },'买家'),
                            h('Option',{
                                props: {
                                    value: '卖家'
                                }
                            },'卖家'),
                        ]
                  );
                        }
                    },
                    {
                        title: 'Age',
                        key: 'age',
                        render:(h,params)=>{
                        return h('Select', {
                        props:{
                            value: '',
                            filterable:true,
                        },
                        on: {
                           'on-open-change':(event) => {
                                
                                 if(event==true){
                                    console.log('112121212')
                                     if(this.data6[params.index].name=='建材'){
                                          console.log('我是建材')
                                          this.dataMM=this.dataMM1


                                      }else if(this.data6[params.index].name=='买家'){
                                        console.log('我是买家')
                                        this.dataMM=this.dataMM2
                                      }
                                 }
                                 
                                //  this.data6[params.index].name=event
                                //  console.log(this.data6)
                                 console.log(event)
                                },
                            'on-change':(event) => {
                                 console.log(this.data6)
                                 console.log(event)
                              }
                            },
                        },
                        this.dataMM.map((item)=>{
                          return h('Option',{
                            props:{value:item}
                          },item)
                        })
                  
                  );
                        }

                    },
                    {
                        title: 'Address',
                        key: 'address',
                        render:(h,params)=>{
                            return h('div',[
                                 h('Input',{
                                    props:{
                                        type:'text',
                                        value:params.row.address
                                    },
                                    style:{
                                      
                                   },
                                   },),
                            ])
                        }
                        
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 150,
                        align: 'center',
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
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data6: [
                    {
                        name: '123',
                        age: '',
                        address: ''
                    },
                ]
      }
    },
    methods:{
      tianjia(){
        console.log('1111')
        this.$Message.success('1231111');
      },
      //编辑
      handleEdit (row, index) {
        this.editName = row.name;
        this.editAge = row.age;
        this.editAddress = row.address;
        this.editBirthday = row.birthday;
        this.editIndex = index;
      },
      //保存
      handleSave (index) {
        this.data[index].name = this.editName;
        this.data[index].age = this.editAge;
        this.data[index].birthday = this.editBirthday;
        this.data[index].address = this.editAddress;
        this.editIndex = -1;
      },
      //数据格式化日期
      getBirthday (birthday) {
        const date = new Date(parseInt(birthday));
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month}-${day}`;
      },
      //查看
      show (index) {
                this.$Modal.info({
                    title: 'User Info',
                    content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                })
            },
      remove (index) {
                this.data6.splice(index, 1);
          },
      
      
      
      searchM(){
        console.log(this.formItem)
      },
      //表单提交
      handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
     },
     handleReset (name) {
                this.$refs[name].resetFields();
     },
    modal_ok(){
      console.log(this.formValidate.name)
    },
    },
    created(){
         //console.log(this.columns)
    },
  }
</script>
<style>
  .ivu-card-body{
    padding-bottom:0!important;
  }
</style>
