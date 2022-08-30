<template>
  <div  class="max_cont">
    <div class="container1">
        <div class="tit">登录</div>
        <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item prop="username">
          <input
            v-model="loginForm.username"
            placeholder="用户名"
          ></input>
        </el-form-item>
        <el-form-item prop="password">
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
          ></input>
        </el-form-item><br>
        <el-form-item class="btns">
          <span><a href="#" @click="register">注册</a></span>&nbsp
          <span><a href="#"  @click="backstage">登录后台</a></span>&nbsp
          <span><a href="#" @click="dialogVisible = true">忘记密码</a></span><br>
          <button @click="login">登录</button>
        </el-form-item>
      </el-form>


    </div>
    <div class="square">
        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
    <div class="circle">
        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-input v-model="reset.username" placeholder="用户名"></el-input>
      <el-input
        v-model="reset.phone"
        placeholder="手机号"
        class="phone"
      ></el-input
      ><el-button type="primary" size="small">发送验证码</el-button>
      <el-input v-model="reset.yanzheng" placeholder="验证码"></el-input>
      <el-input
        v-model="reset.newpassword"
        placeholder="密码"
        type="password"
      ></el-input>
      <el-input
        type="password"
        v-model="reset.checkpassword"
        placeholder="确认密码"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      reset: {
        username: "",
        phone: "",
        yanzheng: "",
        newpassword: "",
        checkpassword: "",
      },
      loginForm: {
        username: "",
        password: "",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 5 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        let data = JSON.stringify(this.loginForm);
        console.log(data);
        this.$axios({
          //请求类型
          method: "POST",
          contentType: "application/x-www-form-urlencoded",
          //URL
          url: "api/login/",
          //设置请求体
          data: data,
        }).then((response) => {
          console.log(response.data);
          if (response.data == "密码错误") {
            this.$message.error("登录失败！");
          } else if (response.data == "您已在其它地方登陆，请勿重复登录") {
            this.$message.error("您已在其它地方登陆，请勿重复登录！");
          } else {
            this.$message.success("登录成功");
            window.sessionStorage.setItem("username", this.loginForm.username);
            let identity=response.data.identity;
            if(identity==0){
              identity=1
            }else if(identity==1){
              identity=-1
            }else{
              identity=0
            }
            window.sessionStorage.setItem("identity", identity);
            this.$router.push("/home");
          }
        });
      });
    },
    register() {
      this.$router.push("/register");
    },
    resetPass() {
      if (this.reset.newpassword != this.reset.checkpassword) {
        this.$message.error("两次密码不一致");
        return;
      }
      let that = this;
      let data = JSON.stringify(this.reset);
      console.log(data);
      this.$axios({
        method: "POST",
        url: "api/forgetpassword/",
        data: data,
      }).then((response) => {
        console.log(response.data);
        if (response.data == "修改成功") {
          that.$message({
            message: "修改成功",
            type: "success",
          });
          that.dialogVisible = false;
        } else {
          that.$message.error("修改失败");
        }
      });
    },
    backstage(){
      this.$router.push("/backstage");
    },
  },
};
</script>


<style scoped>
* {
  /* 初始化 */
  margin: 0;
  padding: 0;
}
.max_cont {
  /* 100%窗口高度 */
  height: 100vh;
  /* 弹性布局 居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 渐变背景 */
  background: linear-gradient(200deg, #9ff372, #7dd8eb);
  /* 溢出隐藏 */
  overflow: hidden;
}
.container1 {
  /* 相对定位 */
  position: relative;
  z-index: 1;
  background-color: #fff;
  border-radius: 15px;
  /* 弹性布局 垂直排列 */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  height: 500px;
  /* 阴影 */
  box-shadow: 0 5px 20px rgba(28, 225, 239, 0.1);
}
.container1 .tit {
  font-size: 26px;
  margin: 65px auto 70px auto;
}
.container1 input {
  width: 280px;
  height: 30px;
  text-indent: 8px;
  border: none;
  border-bottom: 1px solid #ddd;
  outline: none;
  margin: 12px auto;
}
.container1 button {
  width: 280px;
  height: 40px;
  margin: 35px auto 40px auto;
  border: none;
  background: linear-gradient(-200deg, #7dd8eb, #9ff372);
  color: #fff;
  font-weight: bold;
  letter-spacing: 8px;
  border-radius: 10px;
  cursor: pointer;
  /* 动画过渡 */
  transition: 0.5s;
}
.container1 button:hover {
  background: linear-gradient(-200deg, #9ff372, #7dd8eb);
  background-position-x: -280px;
}
.container1 span {
  font-size: 14px;
}
.container1 a {
  color: rgb(71, 210, 235);
  text-decoration: none;
}
ul li {
  position: absolute;
  border: 1px solid #fff;
  background-color: #fff;
  width: 30px;
  height: 30px;
  list-style: none;
  opacity: 0;
}
.square li {
  top: 40vh;
  left: 60vw;
  /* 执行动画：动画名 时长 线性的 无限次播放 */
  animation: square 10s linear infinite;
}
.square li:nth-child(2) {
  top: 80vh;
  left: 10vw;
  /* 设置动画延迟时间 */
  animation-delay: 2s;
}
.square li:nth-child(3) {
  top: 80vh;
  left: 85vw;
  /* 设置动画延迟时间 */
  animation-delay: 4s;
}
.square li:nth-child(4) {
  top: 10vh;
  left: 70vw;
  /* 设置动画延迟时间 */
  animation-delay: 6s;
}
.square li:nth-child(5) {
  top: 10vh;
  left: 10vw;
  /* 设置动画延迟时间 */
  animation-delay: 8s;
}
.circle li {
  bottom: 0;
  left: 15vw;
  /* 执行动画 */
  animation: circle 10s linear infinite;
}
.circle li:nth-child(2) {
  left: 35vw;
  /* 设置动画延迟时间 */
  animation-delay: 2s;
}
.circle li:nth-child(3) {
  left: 55vw;
  /* 设置动画延迟时间 */
  animation-delay: 6s;
}
.circle li:nth-child(4) {
  left: 75vw;
  /* 设置动画延迟时间 */
  animation-delay: 4s;
}
.circle li:nth-child(5) {
  left: 90vw;
  /* 设置动画延迟时间 */
  animation-delay: 8s;
}

/* 定义动画 */
@keyframes square {
  0% {
    transform: scale(0) rotateY(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(5) rotateY(1000deg);
    opacity: 0;
  }
}
@keyframes circle {
  0% {
    transform: scale(0) rotateY(0deg);
    opacity: 1;
    bottom: 0;
    border-radius: 0;
  }
  100% {
    transform: scale(5) rotateY(1000deg);
    opacity: 0;
    bottom: 90vh;
    border-radius: 50%;
  }
}
</style>
