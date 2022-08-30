<template>
  <div class="form-structor">
    <div class="signup">
      <!-- <h2 class="form-title" id="signup"><span>或</span>注册</h2> -->
      <el-form :model="users">
        <div class="form-holder">
          <input
            v-model="users.name"
            type="text"
            class="input"
            placeholder="用户名"
          />
          <!-- <input
            v-model="users.email"
            type="email"
            class="input"
            @blur="sendEmail"
            placeholder="邮箱"
          /> -->
          <input
            v-model="users.password"
            :type="pwIsShow ? 'text':'password'"
            class="input"
            @blur="sendPassword"
            placeholder="密码(密码必须由数字、字母、特殊字符组合,请输入6-16位)"
          />
          <button style="background-color: transparent;float: right; margin-top: -35px" @click="pwShow">
            <img v-if="pwIsShow" src="../assets/eye.svg" alt="" />
            <img v-else src="../assets/eye-slash.svg" alt="" />
          </button>
          <input
            v-model="users.repw"
            :type="repwIsShow ? 'text':'password'"
            class="input"
            @blur="isSame"
            placeholder="再次输入密码"
          />
          <button style="background-color: transparent;float: right; margin-top: -35px" @click="repwShow">
            <img v-if="repwIsShow" src="../assets/eye.svg" alt="" />
            <img v-else src="../assets/eye-slash.svg" alt="" />
          </button>
        </div>
      </el-form>
      <button class="submit-btn" @click="reg">注册</button>
     
    </div>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      pwIsShow: false,
      repwIsShow: false,
      users: {
        name: "",
        email: "",
        password: "",
        repw: "",
      },
    };
  },
  methods: {
    // sendEmail() {  //邮箱格式是否正确
    //   var regEmail =
    //     /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    //   if (this.users.email != "" && !regEmail.test(this.users.email)) {
    //     console.log("邮箱格式不正确！！！");
    //     // alert("邮箱格式不正确！")
    //     this.users.email = "";
    //     this.$message({
    //       message: "邮箱格式不正确",
    //       type: "error",
    //     });
    //     console.log("现在邮箱为" + this.users.email);
    //   }
    // },
    // sendPassword() {  //密码格式是否正确
    //   var regPassword = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/;
    //   if (this.users.password != "" && !regPassword.test(this.users.password)) {
    //     console.log("密码格式不正确！！！");
    //     this.$message({
    //       message: "密码格式不正确",
    //       type: "error",
    //     });
    //     this.users.password = "";
    //     console.log("现在密码为" + this.users.password);
    //   }
    // },
    isSame() {  //两次密码是否一致
      if (this.users.password == "" && this.users.repw != "") {
        this.$message({
          message: "密码不可为空",
          type: "error",
        });
        // this.users.repw = ""
      } else if (this.users.password != "" && this.users.repw == "") {
        console.log("没有输入确认密码");
        this.$message({
          message: "请输入确认密码",
          type: "error",
        });
        console.log("isSame.reqw is null 现在密码为" + this.users.password);
      } else if (this.users.repw != this.users.password) {
        console.log("两次密码不一致");
        this.$message({
          message: "两次密码不一致",
          type: "error",
        });
        this.users.repw = "";
        console.log("isSame.reqw is not same 现在密码为" + this.users.password);
      }
    },
    reg() {  //注册
      if (this.users.name == "") {
        this.$message({
          message: "用户名不可为空",
          type: "error",
        });
      // } else if (this.users.email == "") {
      //   this.$message({
      //     message: "邮箱不可为空",
      //     type: "error",
      //   });
      } else if (this.users.password == "") {
        this.$message({
          message: "密码不可为空",
          type: "error",
        });
      } else if (this.users.password != this.users.repw) {
        this.$message({
          message: "两次密码必须一致",
          type: "error",
        });
      } else {
        this.$message({
          message: "注册成功",
          type: "error",
        });
      }
    },
    pwShow(){  //密码显示与隐藏
        this.pwIsShow=!this.pwIsShow
    },
    repwShow(){  //确认密码显示与隐藏
        this.repwIsShow=!this.repwIsShow
    }
  },
};
</script>
<style scoped>
.form-structor {
  background-color: #222;
  border-radius: 15px;
  height: 550px;
  width: 600px;
  position: relative;
  overflow: hidden;
}
.form-structor::after {
  content: "";
  opacity: 0.8;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: 700px;
  background-image: url("../assets/32.jpg");
}
.form-structor .signup {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  width: 65%;
  z-index: 5;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup.slide-up {
  top: 5%;
  -webkit-transform: translate(-50%, 0%);
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup.slide-up .form-holder,
.form-structor .signup.slide-up .submit-btn {
  opacity: 0;
  visibility: hidden;
}
.form-structor .signup.slide-up .form-title {
  font-size: 1em;
  cursor: pointer;
}
.form-structor .signup.slide-up .form-title span {
  margin-right: 5px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .form-title {
  color: #fff;
  font-size: 1.7em;
  text-align: center;
}
.form-structor .signup .form-title span {
  color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .form-holder {
  border-radius: 15px;
  background-color: #fff;
  overflow: hidden;
  margin-top: 50px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .form-holder .input {
  border: 0;
  outline: none;
  box-shadow: none;
  display: block;
  height: 30px;
  line-height: 30px;
  padding: 8px 15px;
  border-bottom: 1px solid #eee;
  width: 100%;
  font-size: 12px;
}
.form-structor .signup .form-holder .input:last-child {
  border-bottom: 0;
}
.form-structor .signup .form-holder .input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.form-structor .signup .submit-btn {
  background-color: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.7);
  border: 0;
  border-radius: 15px;
  display: block;
  margin: 15px auto;
  padding: 15px 45px;
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .signup .submit-btn:hover {
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.8);
}
.form-structor .login {
  position: absolute;
  top: 20%;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 5;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login::before {
  content: "";
  position: absolute;
  left: 50%;
  top: -20px;
  -webkit-transform: translate(-50%, 0);
  background-color: #fff;
  width: 200%;
  height: 250px;
  border-radius: 50%;
  z-index: 4;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center {
  position: absolute;
  top: calc(50% - 10%);
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  width: 65%;
  z-index: 5;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .form-title {
  color: #000;
  font-size: 1.7em;
  text-align: center;
}
.form-structor .login .center .form-title span {
  color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .form-holder {
  border-radius: 15px;
  background-color: #fff;
  border: 1px solid #eee;
  overflow: hidden;
  margin-top: 50px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .form-holder .input {
  border: 0;
  outline: none;
  box-shadow: none;
  display: block;
  height: 30px;
  line-height: 30px;
  padding: 8px 15px;
  border-bottom: 1px solid #eee;
  width: 100%;
  font-size: 12px;
}
.form-structor .login .center .form-holder .input:last-child {
  border-bottom: 0;
}
.form-structor .login .center .form-holder .input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.form-structor .login .center .submit-btn {
  background-color: #6b92a4;
  color: rgba(255, 255, 255, 0.7);
  border: 0;
  border-radius: 15px;
  display: block;
  margin: 15px auto;
  padding: 15px 45px;
  width: 100%;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login .center .submit-btn:hover {
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.8);
}
.form-structor .login.slide-up {
  top: 90%;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .center {
  top: 10%;
  -webkit-transform: translate(-50%, 0%);
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .form-holder,
.form-structor .login.slide-up .submit-btn {
  opacity: 0;
  visibility: hidden;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .form-title {
  font-size: 1em;
  margin: 0;
  padding: 0;
  cursor: pointer;
  -webkit-transition: all 0.3s ease;
}
.form-structor .login.slide-up .form-title span {
  margin-right: 5px;
  opacity: 1;
  visibility: visible;
  -webkit-transition: all 0.3s ease;
}
</style>