<template>
  <div>
  

    <el-table
      :data="tableData6"
      :span-method="objectSpanMethod"
      border
      show-summary
       :summary-method="getSummaries"
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
      type="index"
      :index="indexMethod">
    </el-table-column>
       <el-table-column
        prop="id"
        label="测试ID"
        width="180">
      </el-table-column>
       <el-table-column
        prop="cnum"
        label="cnum">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="amount1"
        label="数值 1（元）">
      </el-table-column>
      <el-table-column
        prop="amount2"
        label="数值 2（元）">
      </el-table-column>
      <el-table-column
        prop="amount3"
        label="数值 3（元）">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
  name: 'wb_test_1',
  components: {

  },
  data() {
    return {
      tableData6: [
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
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          le:0

        }, {
          id: '1',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9,
          le:0

        },
         {
          id: '2',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17,
          le:2

        }, 
         {
          id: '2',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17,
          le:2

        }, 
        {
          id: '1',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          le:2

        },
        {
          id: '1',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          le:0

        },
        {
          id: '1',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          le:0

        },
        {
          id: '3',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          le:0

        },
        {
          id: '1',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          le:0

        },
        {
          id: '1',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          le:0

        },
        {
          id: '1',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          le:0

        },
        {
          id: '1',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
          le:0

        },
        ],
      upId:'',//上一个ID，在开始获取数据后赋值
    }
  },
  methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {

        // console.log('row：'+row);
        // console.log(row);
        // console.log('column');
        // console.log(column);

        // console.log('rowIndex');
        // console.log(rowIndex);

        // console.log('columnIndex');
        // console.log(columnIndex);
        // let a  = {
        //   rowspan:0,
        //       colspan:0
        // }; 
        if(columnIndex === 0){
            if(row.cnum >0){
            return   {
              rowspan:row.cnum,
              colspan:1
            }
          }else{
            return  {
              rowspan:0,
              colspan:0
            }
          }
        }
        // this.upId = row.id;
        // console.log(a);
        // return a;
        // if (columnIndex === 0) {
        //   if (rowIndex % 2 === 0) {
        //     return {
        //       rowspan: 2,
        //       colspan: 1
        //     };
        //   } else {
        //     return {
        //       rowspan: 0,
        //       colspan: 0
        //     };
        //   }
        // }
      },
       getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += ' 元';
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
      },
      indexMethod(index) {
        return index+1;
      }
  },
  //totalSum
   computed:{ //计算总金额和总重量
    },
   mounted() {
     this.upId = this.tableData6[0].id;
     //提前处理数据；
    //  将当前行需要占用几列计算出来
    this.tableData6.forEach((item,index) => {
      console.log(item);
      console.log('外层循环:'+index);
      item.cnum = 0;

      if(index == 0){
           for(var j = 0;j <this.tableData6.length;j++){
                      let s = this.tableData6[j];
                      if(item.id == s.id){
                        item.cnum ++;
                      }else{
                        break;
                      }
                  }
      }else{
          
          if(this.tableData6[index-1].id == item.id){//当前item 的上一个item是否相同，相同当前的item为0
              item.cnum == 0;
              console.log("00")
          }else{//如果不相同，循环查找当前item 之后的
              console.log("11")
               for(var i = index;i <this.tableData6.length;i++){
                      let s = this.tableData6[i];
                      if(item.id == s.id){
                        item.cnum ++;
                      }else{
                        break;
                      }
                  }
          }
      }
      console.log(item.cnum);
     
    });
  },
  watch: {
    
  }
}
</script>
<style <style lang="less">

</style>

