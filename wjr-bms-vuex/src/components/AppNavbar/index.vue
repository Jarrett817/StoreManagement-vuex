<template>
  <div class="navbar">
    <el-menu
      :router="true"
      default-active="/home"
      class="el-menu-vertical-demo"
      background-color="#cdd1d3"
      text-color="#22a2c3"
      active-text-color="#eef7f2"
    >
      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/member/">
        <i class="el-icon-user-solid"></i>
        <span slot="title">会员管理</span>
      </el-menu-item>
      <el-menu-item index="/supplier/">
        <i class="el-icon-s-goods"></i>
        <span slot="title">供应商管理</span>
      </el-menu-item>
      <el-menu-item index="/goods/">
        <i class="el-icon-goods"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>
      <el-menu-item index="/staff/">
        <i class="el-icon-user"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  methods: {}
};
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>