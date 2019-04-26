<template>
  <div>
    <span>添加用户</span>
    <Button type="warning" @click="close()">关闭当前页面</Button>
  </div>
</template>
<script>
export default {
  methods:{
    close(){
      const list = JSON.parse(localStorage.tagNaveList);
      const newlist = list.filter(function(item){
        return item.name !='user_add';
      });
      this.$router;
      console.log(this.$router)

      // this.$router.push({
      //   name:'user_list'
      // })
    }
  }
}
</script>
