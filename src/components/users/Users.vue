<template>
  <div>
    <el-row :gutter="20" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="search"
          class="input-with-select"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchdata"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="adduserdialog = true"
          >添加用户</el-button
        >
      </el-col>
    </el-row>

    <el-table :data="usersdata" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <!-- <el-table-column prop="mg_state" label="用户状态"> </el-table-column> -->
      <el-table-column label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changestate(scope.row.id, scope.row.mg_state)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="address">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="openupdate(scope.row)"
          ></el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="deleteuser(scope.row.id)"
          ></el-button>
          <el-button type="success" size="mini">角色管理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page.sync="curpage"
      @current-change="changecur"
    >
    </el-pagination>

    <!-- 弹出的添加模态框 -->
    <el-dialog title="添加" :visible.sync="adduserdialog" @close="clearuseradd">
      <el-form :model="adduserform" :rules="addrules" ref="addform">
        <el-form-item
          prop="username"
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="adduserform.username"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input
            type="password"
            v-model="adduserform.password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="adduserform.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" :label-width="formLabelWidth">
          <el-input v-model="adduserform.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adduserdialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      title="编辑"
      :visible.sync="updateuserdialog"
      @close="closeupdate"
    >
      <el-form
        :model="updateuserform"
        :rules="updateuserrules"
        ref="updateform"
      >
        <el-form-item
          prop="username"
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input
            :value="updateuserform.username"
            auto-complete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
          <el-input
            v-model="updateuserform.email"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" :label-width="formLabelWidth">
          <el-input
            v-model="updateuserform.mobile"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateuserdialog = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usersdata: [],
      curpage: 1,
      pagesize: 3,
      total: 0,
      search: "",
      adduserdialog: false,
      updateuserdialog: false,
      adduserform: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      formLabelWidth: "120px",
      addrules: {
        username: [
          // required 是否为必填项
          // message 当前规则校验失败时的提示
          // trigger 表单验证的触发实际，blur表示失去焦点时触发
          { required: true, message: "用户名为必填项", trigger: "blur" },
          // min 最小长度
          // max 最大长度
          {
            min: 3,
            max: 6,
            message: "用户名长度在 3 到 6 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码为必填项", trigger: "blur" },
          {
            min: 3,
            max: 6,
            message: "密码长度在 3 到 6 个字符",
            trigger: "blur",
          },
        ],
      },

      updateuserform: {
        username: "",
        email: "",
        mobile: "",
        id: "",
      },
      updateuserrules: {},
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata(curpage = 1) {
      this.$http
        .get("/users", {
          params: {
            pagenum: curpage,
            pagesize: 3,
            query: this.search || "",
          },
          //  headers:{
          //      Authorization: localStorage.getItem('token')
          //  }
        })
        .then((res) => {
          console.log(res);
          const { data, meta } = res.data;
          if (meta.status === 200) {
            this.usersdata = data.users;
            this.total = data.total;
          }
        });
    },
    //分页功能（这个方法是配合ui框架的事件来使用的，当当前页发生改变框架会让这个事件触发一次，使用利用这个特点，当当前页改变时，就获取当前页的数据然后渲染）
    //参数为获取的页码数
    changecur(curpage) {
      console.log(curpage);
      this.getdata(curpage);
    },
    //搜索功能
    searchdata() {
      this.curpage = 1;
      this.getdata();
    },
    //用户状态
    changestate(id, status) {
      console.log(id, status);
      this.$http.put(`/users/${id}/state/${status}`).then((res) => {
        console.log(res);
        const { data, meta } = res.data;
        if (meta.status === 200) {
          this.$message({
            message: meta.msg,
            type: "success",
          });
        }
      });
    },
    //添加用户
    addUser() {
      this.$refs.addform.validate((valid) => {
        if (valid) {
          // console.log(this.adduserform.username);
          this.$http.post("/users", this.adduserform).then((res) => {
            console.log(res);
            const { data, meta } = res.data;
            if (meta.status === 201) {
              this.$message({
                message: meta.msg,
                type: "success",
              });
              this.adduserdialog = false;
              this.getdata();
            } else {
              this.$message.error(meta.msg);
            }
          });
        } else {
          console.log("提交失败");
          return false;
        }
      });
    },
    //情况添加用户的模态框
    clearuseradd() {
      this.$refs.addform.resetFields();
    },
    //删除用户
    deleteuser(id) {
      this.$confirm("是否删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete(`users/${id}`).then((res) => {
            console.log(res);
          });

          this.getdata();
          this.curpage = 1;
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //编辑用户
    openupdate(data) {
      this.updateuserdialog = true;
      this.updateuserform = data;
    },

    updateUser() {
      const id = this.updateuserform.id;
      this.$http
        .put(`/users/${id}`, {
          email: this.updateuserform.email,
          mobile: this.updateuserform.mobile,
        })
        .then((res) => {
          const { data, meta } = res.data;
          if (meta.status === 200) {
            this.$message({
              message: meta.msg,
              type: "success",
            });
          };
          this.updateuserdialog = false;
          this.getdata();
          this.curpage = 1;
        });
    },
    closeupdate() {
      this.$refs.updateform.resetFields();
    },
  },
};
</script>

<style>
</style>