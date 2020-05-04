<template>
  <div>
    <!-- 搜索查询框 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="account">
        <el-input v-model="searchMap.account" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handlAdd">新增</el-button>

        <el-button @click="resetDataForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" height="450" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>

      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="salary" label="薪酬"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间"></el-table-column>

      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 新增员工弹出窗口 -->
    <el-dialog title="编辑员工" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :model="pojo"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="pojo.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <el-input v-model="pojo.entryDate" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
        <el-button
          type="primary"
          @click="pojo.id===null?addData('pojoForm'):updateData('pojoForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import staffApi from "@/api/staff";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      total: 0,
      dialogFormVisible: false,
      searchMap: {
        account: "",
        name: ""
      },
      pojo: {
        account: "",
        name: "",
        age: "",
        mobile: "",
        salary: "",
        entryDate: ""
      },
      rules: {
        account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
      },
      list: []
    };
  },

  methods: {
    fetchData() {
      staffApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const data = response.data.data;
          this.total = data.total;
          this.list = data.rows;
        });
    },
    handlAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    resetDataForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleEdit(id) {
        this.handlAdd();
        //打开视窗，通过id获取当前选中的员工数据，实现数据回显
      staffApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    handleDelete(id) {
         this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      }).then(() => {
          staffApi.deleteById(id).then(response => {
            const resp = response.data;
            console.log('删除成功')
            this.$message({
              message: resp.message,
              type: resp.flag ? "success" : "error"
            });

            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    addData(formName) {
      this.$refs[formName].validate(valid=>{
        if(valid){
            staffApi.add(this.pojo).then(response => {
          const resp=response.data
         if (resp.flag) {
              console.log("新增成功");
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
            
            })
            }else{
              return false
            }
      })
            },
       
   

    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    handleSizeChange(val){
this.pageSize=val;
this.fetchData();
    },
    handCurrentChange(val){
this.currentPage=val;
this.fetchData();
    }
  }
};
</script>

<style scoped>
</style>