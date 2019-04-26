<style lang="less">
  //@import "../excel/common.less";
</style>
<template>
  <div>
      <Table :columns="columns10" :data="data9"></Table>
  </div>
</template>
<script>
import expandRow from './tableExpand.vue';
  export default {
    name: 'addM',
    components: { expandRow }, //引入组件
    data(){
      return {
          columns10: [
              {
                  type: 'expand',
                  width: 50,
                  render: (h, params) => {
                      console.log(h)
                      console.log(params)
                      return h(expandRow, {
                          props: {
                              row: params.row
                          }
                      })
                  }
              },
              {
                  title: '名字',
                  key: 'name'
              },
              {
                  title: '年纪',
                  key: 'age'
              },
              {
                  title: '性别',
                  key: 'sex'
              },
               {
                  title: '兴趣',
                  key: 'love'
              },
              {
                  title: '地址',
                  key: 'address'
              }
          ],
          data9: [
              {
                  name: 'John Brown',
                  age: 18,
                  address: 'New York No. 1 Lake Park',
                  job: 'Data engineer',
                  interest: 'badminton',
                  love:'打球',
                  sex:"不男",
                  birthday: '1991-05-14',
                  book: 'Steve Jobs',
                  movie: 'The Prestige',
                  music: 'I Cry'
              },
              {
                  name: 'Jim Green',
                  age: 25,
                  address: 'London No. 1 Lake Park',
                  job: 'Data Scientist',
                  interest: 'volleyball',
                  birthday: '1989-03-18',
                   love:'打球',
                  sex:"不男",
                  book: 'My Struggle',
                  movie: 'Roman Holiday',
                  music: 'My Heart Will Go On'
              },
              {
                  name: 'Joe Black',
                  age: 30,
                  address: 'Sydney No. 1 Lake Park',
                  job: 'Data Product Manager',
                  interest: 'tennis',
                   love:'打球',
                  sex:"不男",
                  birthday: '1992-01-31',
                  book: 'Win',
                  movie: 'Jobs',
                  music: 'Don’t Cry'
              },
              {
                  name: 'Jon Snow',
                  age: 26,
                  address: 'Ottawa No. 2 Lake Park',
                  job: 'Data Analyst',
                   love:'打球',
                  sex:"不男",
                  interest: 'snooker',
                  birthday: '1988-7-25',
                  book: 'A Dream in Red Mansions',
                  movie: 'A Chinese Ghost Story',
                  music: 'actor'
              },
              {
                  name: '王斌',
                  age: 26,
                  address: 'Ottawa No. 2 Lake Park',
                  job: 'Data Analyst',
                   love:'打球',
                  sex:"不男",
                  interest: 'snooker',
                  birthday: '1988-7-25',
                  book: 'A Dream in Red Mansions',
                  movie: 'A Chinese Ghost Story',
                  music: 'actor'
              },
              {
                  name: '王斌2号',
                  age: 26,
                  address: 'Ottawa No. 2 Lake Park',
                  job: 'Data Analyst',
                  interest: 'snooker',
                  birthday: '1988-7-25',
                   love:'打球',
                  sex:"不男",
                  book: 'A Dream in Red Mansions',
                  movie: 'A Chinese Ghost Story',
                  music: 'actor'
              }
          ],
      }
    },
    methods:{

    },
    created(){

    }
  }
</script>
