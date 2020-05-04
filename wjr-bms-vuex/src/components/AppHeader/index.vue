<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/会员.png" alt="图标" />
      <span class="company">后台管理系统</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="edit">修改密码</el-dropdown-item>
        <el-dropdown-item icon="el-icon-switch-button" command="quit">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- <修改密码> -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        style="width:400px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from "@/api/login";
import passwordApi from "@/api/password";
export default {
  data() {
    const validateOldPass = (rule, value, callback) => {
      passwordApi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    const validateNewPass = (rule, value, callback) => {
      if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      user: this.$store.state.user.user,
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        newPass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { validator: validateOldPass, trigger: "blur" }
        ],
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" }
          // { validator: validateOldPass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: validateNewPass, trigger: "change" }
        ]
      }
    };
  },

  compoments: {},

  methods: {
    handleCommand(command) {
      // this.$message(`点击了${command}`);
      switch (command) {
        case "edit":
          this.handlePwd();
          break;
        case "quit":
          this.handleLogout();
          break;
        default:
          break;
      }
    },
    handleLogout() {
      this.$store.dispatch("Logout").then(response => {
        if (response.flag) {
          this.$router.push("/login");
        } else {
          this.$message({
            message: resp.message,
            type: "warning",
            duration: 500 //弹出停留时间
          }); 
        }
      });
      // this.$message("退出系统");
      // const token = localStorage.getItem("wjr-bms-token");
      // logout(token).then(response => {
      //   const resp = response.data;
      //   if (resp.flag) {
      //     localStorage.removeItem("wjr-bms-token");
      //     localStorage.removeItem("wjr-bms-user");
      //     this.$router.push("/login");
      //   } else {
      //     this.$message({
      //       message: resp.message,
      //       type: "warning",
      //       duration: 500
      //     });
      //   }
      // });
    },
    handlePwd() {
      // this.$message("密码修改");
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          passwordApi
            .updatePwd(this.user.id, this.ruleForm.checkPass)
            .then(response => {
              const resp = response.data;
              this.$message({
                message: resp.message,
                type: resp.flag ? "success" : "warning"
              });
              if (resp.flag) {
                setTimeout(this.handleLogout(), 3000);
                this.dialogFormVisible = false;
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
  width: 25px;
}
.company {
  position: absolute;
  color: rgb(red, rgba(81, 0, 128, 0.932), blue);
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: rgb(red, rgba(81, 0, 128, 0.932), blue);
  cursor: pointer;
}
</style>