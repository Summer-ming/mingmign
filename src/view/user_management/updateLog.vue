/*
 * @Author: mikey.zhaopeng 
 * @Date: 2019-05-10 10:54:37 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-06-28 14:04:22
 */
<!--
 * @Description:审核采购单 
 * @Author: wb
 * @others: 
 * @Date: 2019-04-10 10:27:38
 -->



<template>
     <div>
         <Timeline>
            <TimelineItem v-for=" (item,index) in dataArr" :key='index'>
                <h2 class="time">{{item.versions}}</h2>
                <p class="content"><code>{{item.time}}</code></p>
                <ul class='ul_list' v-for="(dic,diindex) in item.children" :key='diindex'>
                    <li>{{dic.content}} </li>
                </ul>
            </TimelineItem>


            <!-- <TimelineItem>
                <p class="time">3.42</p>
                <p class="content">2019-05-21</p>
                <ul class='ul_list'>
                    <li>1111111111111111111 <time>#5800</time></li>
                    <li>2222222222222222<time>#5800</time></li>
                    <li>33333333333333<time>#5800</time></li>
                </ul>
            </TimelineItem>

            <TimelineItem>
                <p class="time">3.42</p>
                <p class="content">2019-05-21</p>
                <ul class='ul_list'>
                    <li>1111111111111111111 <time>#5800</time></li>
                    <li>2222222222222222<time>#5800</time></li>
                    <li>33333333333333<time>#5800</time></li>
                </ul>
            </TimelineItem> -->
       
    
    </Timeline>
     </div>
</template>

<script>

export default {
    name: 'updateLog',
    inject:['reload'],  //調用組建app.vue
    data(){
      return {
          dataArr:[
              {
                "versions":"1.2",
                "time":"2019年8月19日 星期一",
                "children":[
                    {"content":"采购单列表，销售单列表加入快捷调整对应页数"},

                ]
            },
            {
                "versions":"1.1",
                "time":"2019年6月28日 星期五",
                "children":[
                    {"content":"采购单下单，excel 上传"},
                    {"content":"采购单申请付款时，显示当前采购商的余额；方便进行抵扣"},
                    {"content":"采购单下单时筛选中的材质规格数组，使用jiangangyun.com中的材质规格数组"},
                    {"content":"客户余额和供应商余额分开显示"},
                    {"content":"订单提交后，如果审核拒绝，则业务员可以先修改订单，然后再次提交审核"},
                    {"content":"修改订单明细，以及修改订单公司相关信息。即修改采购单和销售单，都可以在订单开票或者收票之前修改完成。收票之后不可以在修改"},
                    {"content":"显示公司剩余杂费多少，已付多少"},
                    {"content":"销售单中——》到账单收款步骤，可以撤销。"},
                    {"content":"采购单和销售单添加更详细的状态区分。采购单，已入库，未入库；已开票，未开票；销售单-已收款，未收款，已实提，未实提；已开票，未开票；并列向后方显示"},
                    {"content":"销售单下单时，选择库存资源时，捆包号，钢厂，品名，规格，材质，变更为模糊查询"},
                    {"content":"客户/供应商业务往来表 中——往来金额（进） 变更——》已付金额；往来金额（出）——》应付金额"},
                    {"content":"客户业务余额表中；供应商入账金额变更——》供货金额；供应商出账金额变更——》已付金额"},
                    {"content":"采购单和销售单的实提信息可以修改"},
                    {"content":"客户和供应商添加时可以不填写所有信息，包括公司名称，公司名称只填写简称。后续可以在修改。修改必须在开发票之前。并且审查客户和供应商资料是否完整"},
                    {"content":"其他一些功能优化"},

                ]
            }

          ]
      }
    },
    
    methods:{
    
    },
    
    mounted(){
   
    },
    
    created(){
   
    },
}

</script>
<style <style lang="less">
   .time{
        font-size: 20px;
        font-weight: bold;
        margin-bottom:6px!important;
    }
    .content{
        padding-left: 5px;
        margin-bottom:6px!important;
        background: #f7f7f7;
        color: #666;
        font-size: 16px;

    }
    .ul_list{
        li{
             margin-left: 20px;
             line-height:25px;
             font-size:14px;
             time{
                 color:blue;
             }
        }
    }
    
</style>