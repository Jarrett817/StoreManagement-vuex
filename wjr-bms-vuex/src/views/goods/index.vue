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
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <!--  -->
        <el-input
          readonly
          @click.native="dialogSupplierVisible=true"
          v-model="searchMap.supplierName"
          placeholder="选择供应商"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button @click="handleAdd">新增</el-button>

        <el-button @click="$refs['searchForm'].resetFields()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" height="450" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>

      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>

      <el-table-column label="操作" width="150px">
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
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
      <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier>
    </el-dialog>
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :model="pojo"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            readonly
            aria-placeholder="选择供应商"
            @click.native="editOptionSupplier"
            v-model="pojo.supplierName"
            autocomplete="off"
          ></el-input>
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
import goodsApi from "@/api/goods";
import Supplier from "@/views/supplier";
export default {
  data() {
    return {
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      searchMap: {
        name: "",
        code: "",
        supplierName: ""
      },
      dialogSupplierVisible: false,
      dialogFormVisible: false,
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" }
        ]
      },
      pojo: {
        id: null,
        name:'',
        code: '',
        spec: '',
        retailPrice: 0.0,
        purchasePrice: 0.0,
        storageNum: 0,
        supplierName: '',
        supplierId: null
      },
      isEdit: false
    };
  },

  components: {
    Supplier
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const data = response.data.data;
          this.total = data.total;
          this.list = data.rows;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    //打开编辑窗口
    handleEdit(id) {
      this.handleAdd();
      goodsApi.getById(id).then(response => {
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
      })
        .then(() => {
          goodsApi.deleteById(id).then(response => {
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
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    optionSupplier(currentRow) {
      if (this.isEdit) {
        this.pojo.supplierName = currentRow.name;
        this.pojo.supplierId = currentRow.id;
      } else {
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.supplierId = currentRow.id;
      }
      this.isEdit = false;
      this.dialogSupplierVisible = false;
    },
    addData(formName) {
      console.log("add方法被调用了");

      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.add(this.pojo).then(response => {
            const resp = response.data;
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
          });
        } else {
          return false;
        }
      });
    },
    updateData(formName) {
 this.$refs[formName].validate(valid => {
        if (valid) {
          goodsApi.update(this.pojo).then(response => {
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
    editOptionSupplier() {
      this.isEdit = true;
      this.dialogSupplierVisible = true;
    }
  }
};
</script>

<style scoped>
</style>