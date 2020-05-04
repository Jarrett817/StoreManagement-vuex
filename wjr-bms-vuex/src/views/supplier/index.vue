<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="!isDialog">
        <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="!isDialog">
        <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="handleAdd" v-if="!isDialog">新增</el-button>

        <el-button @click="resetDataForm('searchForm')" v-if="!isDialog">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 激活单选 -->
    <el-table
    
      :highlight-current-row="isDialog"
      @current-change="clickCurrentChange"
      :data="list"
      height="450"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>

      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" v-if="!isDialog"></el-table-column>
      <el-table-column prop="remark" label="备注" v-if="!isDialog"></el-table-column>

      <el-table-column label="操作" width="150px" v-if="!isDialog">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :layout="!isDialog?'total, sizes, prev, pager, next, jumper':'prev, pager, next'"
      :total="total"
    ></el-pagination>

    <el-dialog v-if="isDialog" title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :model="pojo"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark" autocomplete="off" type="textarea"></el-input>
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
import supplierApi from "@/api/supplier";

export default {
  props: {
    isDialog: Boolean
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      }, //用于条件查询绑定字段值
      dialogFormVisible: false,
      rules: {
        //校验规则
        name: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
        linkman: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      },
      pojo: {
        name: "",
        linkman: "",
        mobile: "",
        remark: "",
        id: ""
      }
    };
  },

  components: {},

  methods: {
    fetchData() {
      supplierApi
        .search(this.currentPage, this.pageSzie, this.searchMap)
        .then(response => {
          const data = response.data.data;
          this.list = data.rows;
          this.total = data.total;
        });
    },
    handleEdit(id) {
      this.handleAdd();
      supplierApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          this.$message({
            message: resp.message,
            type: "warning"
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(() => {
          supplierApi.deleteById(id).then(response => {
            const resp = response.data;
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
    handleSizeChange(val) {
      this.pageSzie = val;
      this.fetchData();
    },
    handCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetDataForm(formName) {
      this.$refs[formName].resetFields();
    },
    addData() {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = true;
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
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.update(this.pojo).then(response => {
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
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
      clickCurrentChange(currentRow) {
      this.$emit("option-supplier", currentRow);
     
    }
 
  }
};
</script>

<style scoped>
</style>