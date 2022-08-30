<template>
  <div class="login_container">
    <img
      src="../assets/login_background.png"
      width="100%"
      height="100%"
      alt=""
    />
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/register.jpg" alt="" />
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            type="text"
            v-model.number="ruleForm.phone"
            placeholder="手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            placeholder="确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button @click="register">注册</el-button>
          <el-button @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleFormRef.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        phone: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入注册名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "手机号不能为空" },
          { type: "number", message: "手机号必须为数字值" },
        ],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.ruleFormRef.resetFields();
    },
    login() {
      this.$router.push("/login");
    },
    register() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (valid) {
          let loginForm = {
            username: this.ruleForm.username,
            phone: this.ruleForm.phone,
            password: this.ruleForm.pass,
          };
          let data = JSON.stringify(loginForm);
          this.$axios({
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            url: "api/register/",
            data: data,
          }).then((response) => {
            console.log(response.data);
            if (response.data == "保存成功") {
              this.$message.success("注册成功");
            } else {
              this.$message.error("注册失败");
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #121213;
  height: 100%;
  width: 100%;
}
.login_box {
  width: 450px;
  height: 400px;
  background-color: rgb(39, 40, 43);
  border: rgb(47, 86, 145) solid 10px;
  border-radius: 15%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid rgb(17, 17, 17);
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px rgb(17, 16, 16);
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(80, 98, 121);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
