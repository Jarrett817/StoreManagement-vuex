<template>
     <el-breadcrumb  separator="/">
      <el-breadcrumb-item class="line" :to="{ path: $route.path}">{{this.$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
export default {
  watch: {
        $route(to) {
            console.log(to)
           
        }
    }
}
</script>
<style scoped>
.el-breadcrumb{
  height:10px;
  padding:20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0,0, 0.1);
}
.line{
  border-left: 3px solid #31c17d;
  padding-left:10px ;
}
</style>
