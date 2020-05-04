<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名字"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <!-- 指定绑定值的格式 -->
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="出生日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handlAdd">新增</el-button>

        <el-button @click="resetDataForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>


    
    <el-table :data="list" height="450" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>

      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="birthday" label="生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{scope.row.payType | payTypeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"></el-table-column>

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
    <!-- 弹出新增窗口 -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
        :model="pojo"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="birthday" label="会员生日">
          <!-- 指定绑定值的格式 -->
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="出生日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input v-model="pojo.address" autocomplete="off" type="textarea"></el-input>
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
  </div>
</template>

<script>
import memberApi from "@/api/member";
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        //条件查询指定
        cardNum: "",
        name: "",
        type: "",
        birthday: ""
      },
      payTypeOptions,
      dialogFormVisible: false, //控制对话框
      pojo: {
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: 0,

        integral: 0,
        payType: "",
        address: ""
      },
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" }
        ]
      }
    };
  },

  components: {},

  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetDataForm(formName) {
      this.$refs[formName].resetFields();
    },
    fetchData() {
      //调用分页查询数据
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          console.log(resp);
        });
    },

    handleDelete(id) {
      this.$confirm("确认删除这条记录吗", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消"
      })
        .then(() => {
          memberApi.deleteById(id).then(response=>{
            const resp=response.data
            this.$message({
              message:resp.message,
              type:resp.flag?'success':'error'
            })
            if(resp.flag){
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.add(this.pojo).then(response => {
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
        }
      });
    },
    //弹出新增窗口
    handlAdd() {
      // this.pojo = {};
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    handleEdit(id) {
      this.handlAdd();
      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberApi.update(this.pojo).then(response => {
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
    }
  },
  filters: {
    payTypeFilter(type) {
      const payObj = payTypeOptions.find(obj => {
        return obj.type === type;
      });
      return payObj ? payObj.name : null;

      // return obj.type===type
    }
  }
};
</script>

<style scoped>
</style>