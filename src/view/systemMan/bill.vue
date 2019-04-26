<template>
  <div>
  
      <row> 
           <h2>提单信息</h2>

           <Table :columns="columns1" :data="data1"></Table>

      </row>

        <row> 
           <h2>实提信息</h2>

           <Table :columns="columns1" :data="data1"></Table>

      </row>


  </div>
</template>
<script>
  export default {
    name: 'bill',
    data(){
      return {
       columns1: [
                    {
                        title: '品名',
                        key: 'Name'
                    },
                    {
                        title: '规格',
                        key: 'Specifications'
                    },
                    {
                        title: '材质',
                        key: 'material'
                    },
                     {
                        title: '钢厂',
                        key: 'steel'
                    },
                    {
                        title: '金额(元)',
                        key: 'amount'
                    },
                    {
                        title: '实提数量',
                        key: 'num'
                    },
                    {
                        title: '材实提重量(吨)',
                        key: 'num2'
                    },
                    {
                        title: '实提金额(元)',
                        key: 'money'
                    },
                    {
                        title: '开票重量',
                        key: 'kai'
                    },
                    {
                        title: '开票金额',
                        key: 'money2'
                    },
                    {
                        title: '开票号码',
                        key: 'number'
                    },
                ],
                data1: [
                    {
                        Name: '螺纹钢',
                        Specifications: 18,
                        material: 'hrb4000',
                        steel: '国茂钢厂',
                        amount: '140868',
                        num:'16',
                        num2:'16',
                        money:'140868',
                        kai:'140868',
                        money2:'140868',
                        number:'140868',
                    },
                    
                ]
              
      }
    },
    methods:{
       
    },
    mounted(){
     
    },
  }
</script>
<style <style lang="less">

</style>

