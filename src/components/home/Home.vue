<template>
  <div class="homecss">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="12" class="fontbox">
            <h2>商城后台管理系统</h2>
          </el-col>
          <el-col :span="12">
            <el-button type="warning" plain class="logout" @click="logout">退出</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
          :router="true"
            default-active="home/users"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="home/users">用户列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/rights">权限列表</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="/roles">角色列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logout() {
      this.$confirm("确定退出吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          localStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.homecss {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  padding: 0;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: rgb(84, 92, 100);
  color: #333;

  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}

.el-container {
  height: 100%;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.fontbox {
  height: 60px;
  text-align: left;
  padding: 0 20px;
}
.fontbox h2 {
  margin: 0;
}
.logout {
  position: absolute;
  top: 10px;
  right: 20px;
}
</style>