<template>
  <div>
    <el-table :data="rolesList" stripe style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row v-for="item in scope.row.children" :key="item.id">
              <!-- 第一列 -->
              <el-col :span="4">{{ item.authName }}</el-col>
              <!-- 第二列 -->
              <el-col :span="20">
                <el-row v-for="item1 in item.children" :key="item1.id">
                  <el-col :span="4">{{ item1.authName }}</el-col>
                  <el-col :span="20">
                    <span v-for="item2 in item1.children" :key="item2.id">
                      {{ item2.authName }}
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <el-form-item label="商品名称">
              <span>{{ scope.row.name }}</span>
            </el-form-item> -->
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 修改 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="openrolesupdate(scope.row)"
          ></el-button>
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="deleteroles(scope.row.id)"
          ></el-button>
          <el-button type="success" size="mini" @click="opensetroles(scope.row.children,scope.row.id)"
            >权限管理</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑权限 -->
    <el-dialog
      title="编辑"
      :visible.sync="updaterolesdialog"
      @close="closeupdate"
    >
      <el-form v-model="updaterolesform" ref="rolesform">
        <el-form-item
          prop="roleName"
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input
            :value="updaterolesform.roleName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="roleDesc"
          label="角色描述"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="updaterolesform.roleDesc"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updaterolesdialog = false">取 消</el-button>
        <el-button type="primary" @click="updateRoles">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="权限管理" :visible.sync="rolesdialog">
      <el-tree
        :data="allrolesList"
        show-checkbox
        :default-expand-all="true"
        node-key="id"
        ref="allroles"
        highlight-current
        :props="defaultProps"
      >
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesdialog = false">取 消</el-button>
        <el-button type="primary" @click="putallroles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      updaterolesdialog: false,
      formLabelWidth: "120px",
      updaterolesform: [],
      //权限管理数据
      rolesdialog: false,
      allrolesList: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      rid: '',
    };
  },
  mounted() {
    this.getrolesdata();
    this.getallrolestree();
  },
  methods: {
    getrolesdata() {
      this.$http.get("/roles").then((res) => {
        const { data, meta } = res.data;
        if (meta.status === 200) {
          this.rolesList = data;
          console.log(this.rolesList[0].children);
        }
      });
    },
    openrolesupdate(data) {
      console.log(data);
      this.updaterolesdialog = true;
      this.updaterolesform = data;
    },
    deleteroles(id) {
      this.$http.delete(`/roles/${id}`).then((res) => {
        const meta = res.data.meta;
        if (meta.status === 200) {
          this.getrolesdata();
          this.$message({
            message: meta.msg,
            type: "success",
          });
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    closeupdate() {
      this.$refs.rolesform.resetFields();
    },
    updateRoles() {
      const id = this.updaterolesform.id;
      // console.log(id);
      this.$http
        .put(`/roles/${id}`, {
          roleName: this.updaterolesform.roleName,
          roleDesc: this.updaterolesform.roleDesc,
        })
        .then((res) => {
          console.log(res);
          const { data, meta } = res.data;
          if (meta.status === 200) {
            this.updaterolesdialog = false;
            this.getrolesdata();
            this.$message({
              message: "修改成功",
              type: "success",
            });
          }
        });
    },
    //打开权限管理框
    opensetroles(curRoleRights,id) {
      this.rolesdialog = true;
      this.rid = id;
      this.$nextTick(() => {
        const level3Ids = []
        curRoleRights.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              level3Ids.push(level3.id)
            })
          })
        })
        this.$refs.allroles.setCheckedKeys(level3Ids);
      })
    },
    //获取权限管理数据
    getallrolestree(){
      this.$http.get('/rights/tree')
      .then(res => {
        console.log(res);
        const { data,meta } = res.data;
        if( meta.status === 200){
          this.allrolesList = data;
        }
      })
    },
    //修改权限管理
    putallroles(){
      
      
      const checked = this.$refs.allroles.getCheckedKeys()
      const halfchecked = this.$refs.allroles.getHalfCheckedKeys();
      const allchecked=[...checked,...halfchecked];
      console.log(allchecked);
      const id = this.rid;
      this.$http.post(`/roles/${id}/rights`,{
        rids: allchecked.join(',')
      })
      .then(res => {
        this.rolesdialog = false;
        this.getrolesdata();
      })
    }
  },
};
</script>

<style>
</style>