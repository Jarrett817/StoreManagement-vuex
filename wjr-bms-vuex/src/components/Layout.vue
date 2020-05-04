<template>
  <div>
    <app-header></app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>
  </div>
</template>


<script>
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain";

export default {
  data() {
    return {};
  },

  components: {
    AppHeader,
    AppNavbar,
    AppMain
  },

  methods: {}
};
</script>

<style scoped>
/* scoped只作用于当前组件 */
.header {
  position: absolute;
  height: 50px;
  line-height: 50px;
  top: 0px;
  left: 0px;
  right: 0px;
  padding: 0px;
  /* margin: 0px; */
  background-color: #d8e3e7;
}
.navbar {
  position: absolute;
  width: 230px;
  background-color: #cdd1d3;
  top: 50px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
}
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  padding: 10px;
  background-color: white;
  bottom: 0px;
  right: 0px;
  overflow-y: auto;
}
</style>