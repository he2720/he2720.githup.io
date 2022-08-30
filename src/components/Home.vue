<template>
  <el-container class="home-container">
    <el-header>
      <div class="login">
        <span>数据标定系统</span>
        <span>你好,{{ username }}</span>
        <span>
          <el-tooltip
            class="item"
            effect="dark"
            content="切换身份"
            placement="bottom"
          >
            <el-button v-show="change == 1" plain @click="changeIdentity">{{
              identity == 0 ? "标注员" : identity == 1 ? "管理员" : "副管理员"
            }}</el-button>
          </el-tooltip>
          <el-button plain @click="logout">退出登录</el-button>
        </span>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
        :default-active="activePath"
          background-color="#fff"
          text-color="rgb(14,13,13)"
          active-text-color="#20a0ff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-menu-item
            :index="item.path + ''"
            v-for="item in menulist"
            :key="item.id"
            :disabled="item.id == 2 ? true : task == 1 ? false : true"
            @click="saveNavState('/' + item.path)"
          >
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.authName }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>版权归中科院所属</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Task1 from "./Task1.vue";
import PubSub from "pubsub-js";
export default {
  components: {
    Task1,
  },
  data() {
    return {
      change: 1,
      username: "",
      times: 0,
      identity: "",
      gazedot: "",
      menulist: [
        {
          id: 0,
          icon: "el-icon-tickets",
          authName: "文件格式",
          path: "format",
        },
        {
          id: 1,
          icon:"el-icon-folder-opened",
          authName: "选择文件",
          path: "select",
        },
        {
          id: 2,
          icon:"el-icon-magic-stick",
          authName: "标注图像",
          path: "mark",
        },
      ],
      isCollapse: false,
      activePath: "",
      flag: 1,
      task: 1,
      status: 0, //1为管理员，0为副官理由
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    // this.$on('toFormat',(project)=>{
    //   console.log(project);
    // })
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    logout() {
      this.flag = 0;
      const data = window.sessionStorage.getItem("username");
      window.sessionStorage.clear();
      this.$axios({
        method: "POST",
        url: "api/logout/",
        data: data,
      }).then((response) => {
        console.log(response.data);
      });
      this.$router.push("/login");
    },
    changeIdentity() {
      if (this.status == 1) {
        this.identity = this.identity == 1 ? 0 : 1;
      } else {
        this.identity = this.identity == -1 ? 0 : -1;
      }
      console.log("status", this.status);
      window.sessionStorage.setItem("identity", this.identity);
      if (this.identity == "1" || this.identity == "-1") {
        console.log(this.identity);
        this.menulist.splice(3, 1, {
          id: 3,
          icon:"el-icon-mouse",
          authName: "标注任务",
          path: "task1",
        });
      } else {
        this.menulist.splice(3, 1, {
          id: 3,
          icon:"el-icon-mouse",
          authName: "标注任务",
          path: "task2",
        });
      }
      this.$router.push("/welcome");
    },
    getgazeDot() {
      if (document.getElementById("webgazerGazeDot")) {
        this.gazedot = window.getComputedStyle(document.getElementById("webgazerGazeDot")).transform;
      }
    }
  },
  watch: {
    // gazedot: {
    //   deep: true,
    //   handler(){
    //     var webgazerGazeDot = document.getElementById("webgazerGazeDot");
    //     var translate = window.getComputedStyle(webgazerGazeDot).transform;
    //     var left = parseFloat(translate.substring(7).split(',')[4]);
    //     var top = parseFloat(translate.replace(")", "").substring(7).split(',')[5]);
    //     var Uarry = document.getElementsByClassName("el-menu-item");
    //     var li1 = Uarry[0].getBoundingClientRect();
    //     var li2 = Uarry[1].getBoundingClientRect();
    //     var li3 = Uarry[2].getBoundingClientRect();
    //     var li4 = Uarry[3].getBoundingClientRect();
    //     var li1left = li1.left;
    //     var li2left = li2.left;
    //     var li3left = li3.left;
    //     var li4left = li4.left;
    //     var li1top = li1.top;
    //     var li2top = li2.top;
    //     var li3top = li3.top;
    //     var li4top = li4.top;
    //     var li1height = li1.height;
    //     var li2height = li2.height;
    //     var li3height = li3.height;
    //     var li4height = li4.height;
    //     var li1width = li1.width;
    //     var li2width = li2.width;
    //     var li3width = li3.width;
    //     var li4width = li4.width;
    //     if(left > li1left && left < li1left+li1width && top > li1top && top < li1top+li1height){
    //       if(this.times === 0){
    //         this.times = 1;
    //       }else if(this.times === 1){
    //         Uarry[0].click();
    //       }else{
    //         this.times = 1;
    //       }
    //     }else if(left > li2left && left < li2left+li2width && top > li2top && top < li2top+li2height){
    //       if(this.times === 0){
    //         this.times = 2;
    //       }else if(this.times === 2){
    //         Uarry[1].click();
    //       }else{
    //         this.times = 2;
    //       }
    //     }else if(left > li3left && left < li3left+li3width && top > li3top && top < li3top+li3height){
    //       if(this.times === 0){
    //         this.times = 3;
    //       }else if(this.times === 3){
    //         Uarry[2].click();
    //       }else{
    //         this.times = 3;
    //       }
    //     }else if(left > li4left && left < li4left+li4width && top > li4top && top < li4top+li4height){
    //       if(this.times === 0){
    //         this.times = 4;
    //       }else if(this.times === 4){
    //         Uarry[3].click();
    //       }else{
    //         this.times = 4;
    //       }
    //     }
    //   }
    // }
  },
  mounted() {
    this.username = window.sessionStorage.getItem("username");
    this.identity = window.sessionStorage.getItem("identity");
    if (this.identity == "0") {
      this.change = 0;
      this.menulist.push({
        id: 3,
        icon:"el-icon-mouse",
        authName: "标注任务",
        path: "task2",
      });
    } else {
      if (this.identity == 1) {
        this.status = 1;
      } else {
        this.status = 0;
      }
      console.log(this.status);
      this.change = 1;
      this.menulist.push({
        id: 3,
        icon:"el-icon-mouse",
        authName: "标注任务",
        path: "task1",
      });
    }
    window.sessionStorage.setItem("task", 0);
    PubSub.subscribe("toFormat", (msgName, data) => {
      window.sessionStorage.setItem("task", 1);
      this.task = 0;
      this.$router.push({
        path: "/format",
        query: {
          project: data,
        },
      });
    });
    PubSub.subscribe("goBack", () => {
      this.task = 1;
    });
    const that = this;
    setInterval(that.getgazeDot,1000);
    const data = window.sessionStorage.getItem("username");
    window.onbeforeunload = function () {
      that
        .$axios({
          method: "POST",
          url: "api/logout/",
          data: data,
        })
        .then((response) => {
          console.log(response.data);
        });
    };
  },
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: rgb(0, 118, 167);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: rgb(252, 249, 249);
  font-size: 22px;
}
  > div {
    display: flex;
    align-items: center;
  }
    span {
      margin-left: 15px;
    }


.el-aside {
  background-color: #fff;
}
  .el-menu {
    border-right: none;
  }

.el-main {
  background-color: #fff;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #fff;
  font-size: 10px;
  line-height: 24px;
  color: rgb(97, 186, 245);
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-footer {
  background-color: #fff;
  color: rgb(14, 13, 13);
}

.login {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style >
