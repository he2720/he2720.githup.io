<template>
  <div>
    <el-button type="info" plain @click="logout">退出登录</el-button>
    <el-table :data="users" stripe style="width: 80%">
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="identity1" label="身份"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="task(scope.row)" type="primary"
            >查看项目</el-button
          >
          <el-button size="mini" @click="open(scope.row)" type="warning"
            >重置密码</el-button
          ><el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            type="success"
            v-show="scope.row.identity != 0"
            >设置为管理员</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        {
          usernmae: "111",
          password: "222",
          identity: 1,
          identity1: "副管理员",
        },
      ],
    };
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
      let usernmae = row.username;
      this.$axios({
        method: "POST",
        url: "api/setAdmin/  ",
        data: usernmae,
      }).then((response) => {
        console.log(response.data);
        if (response.data == "已更改") {
          this.$message.success("更改成功！");
          this.users[index].identity = 1;
          this.users[index].identity1 = "管理员";
          this.$forceUpdate();
        } else {
          this.$message.error("更改失败！");
        }
      });
    },
    open(row) {
      this.$prompt("请输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          console.log(row.username, value);
          let data = {
            username: row.username,
            password: value,
          };
          data = JSON.stringify(data);
          this.$axios({
            method: "POST",
            url: "api/changeuserpassword/  ",
            data: data,
          }).then((response) => {
            console.log(response.data);
            if (response.data == "修改成功") {
              this.$message.success("更改成功！");
            } else {
              this.$message.error("更改失败！");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    task(row){
      console.log(row.username,row.identity)
      this.$router.push({
        path: "/endtask",
        query: {
          identity:row.identity,
          username: row.username,
        },
      });
    },
    logout() {
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
  },
  mounted() {
    let username = window.localStorage.getItem("username");
    this.$axios({
      method: "POST",
      url: "api/getalluser/",
      data: username,
    }).then((response) => {
      let data = response.data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].identity == 0) {
          data[i].identity1 = "管理员";
        } else if (data.identity1 == 1) {
          data[i].identity = "副管理员";
        } else {
          data[i].identity1 = "标注员";
        }
      }
      this.users = data;
      console.log(this.users);
    });
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


