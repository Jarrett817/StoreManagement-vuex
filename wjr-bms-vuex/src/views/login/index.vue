<template>
  <div class="login-container">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-tetle">后台管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login, getUserInfo } from "@/api/login";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      // alert('提交执行了')
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('Login', this.form)
            .then(response => {
            if(response.flag){
              this.$router.push('/')
            }else{
              this.$message({
                message:response.message,
                type:'warning'
              })
            }
            })
            .catch(error => {});

          // login(this.form.username, this.form.password).then(response => {
          //   const resp=response.data;

          //   console.log(resp.code,resp.message,resp.data.token,resp.code===2000);
          //   if(resp.flag){
          //     getUserInfo(resp.data.token).then(response=>{
          //       const respUser=response.data;
          //       if(respUser.flag){
          //         localStorage.setItem('wjr-bms-user',JSON.stringify(respUser.data));
          //         localStorage.setItem('wjr-bms-token',resp.data.token)
          //         this.$router.push("/")
          //       }else{
          //         this.$message({
          //           message:respUser.message,
          //           type:"warning"
          //         })
          //       }
          //     })
          //   }else{
          //     this.$message({
          //       message:resp.message,
          //       type:"warning"
          //     })
          //   }
          // });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 28px;
  border-radius: 20px;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/login.jpg");
}
.login-tetle {
  color: #103133;
  text-align: center;
}
</style>