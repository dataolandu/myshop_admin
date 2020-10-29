<template>
  <div class="bgcbox">
    <div class="logincss">
    <el-form
    :model="loginForm"
    :rules="rules"
    ref="loginForm"
    label-width="100px"
    class="demo-loginForm "
  >
    <el-form-item label="用户名" prop="name">
      <el-input v-model="loginForm.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="loginForm.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">登录</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
  </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
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
    };
  },
  methods: {
    islogin() {
      axios
        .post("http://localhost:8888/api/private/v1/login", this.loginForm)
        .then((res) => {
          // console.log(res);
          const { data, meta } = res.data;
          if (meta.status === 200) {
            localStorage.setItem('token',data.token);
            // console.log(localStorage.getItem('token'));
            this.$router.push("/home");//编程式导航，跳转到主页
          } else {
            this.$message({
              showClose: true,
              message: meta.msg,
              type: "error",
            });
          }
        });
    },
    submitForm() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.islogin();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
  },
};
</script>

<style>
    
    .bgcbox{
      background-color: #2C414C;
      width: 100%;
      height: 100%;
    }
    .logincss{
      width: 460px;
      height: 350px;
      border: 1px solid #000;
      border-radius: 25px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #FFFFFF;
      
    }
    .demo-loginForm{
      width: 400px;
      height: 100%;
      padding-top: 100px;
      
    }
</style>