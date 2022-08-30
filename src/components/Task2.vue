<template>
  <div>
    <el-card>
      <div v-for="(task, index) in tasks" :key="index">
        <h2>项目{{ conversion[index] }}</h2>
        <div>
          完成图片总量<el-input
            v-model="task.complete"
            placeholder="请输入内容"
          ></el-input>
          <el-button
            type="info"
            plain
            icon="el-icon-magic-stick"
            @click="mark(index)"
            >开始标注</el-button
          >
          <el-button
            type="info"
            plain
            icon="el-icon-upload"
            @click="update(index)"
            >更新进度</el-button
          >
        </div>
        <el-tabs v-model="task.activeName">
          <el-tab-pane label="任务总览" name="first">
            <el-card shadow="always">
              <div>创建日期:{{ task.begin }}</div>
              <el-divider></el-divider>
              <div>截止日期:{{ task.end }}</div>
              <el-divider></el-divider>
              <div>负责人：{{ task.director }}</div>
              <el-divider></el-divider>
              <div>项目描述：{{ task.describe }}</div>
              <el-divider></el-divider>
              标注模板：
              <img
                style="width: 100px; height: 100px"
                :src="task.temple"
                :alt="task.temple"
              /><el-divider></el-divider>输入文件格式：<span
              v-for="(inLable, index) in task.inLables"
              :key="index"
            >
              <span>{{ inLable.value }}</span>
              <span
              v-for="(inConnect, index1) in task.inConnects"
              :key="index1"
              v-if="index1==index"
            >{{inConnect.value}}</span>
            </span><br>
             输出文件格式：<span
              v-for="(outLable, index) in task.outLables"
              :key="index"
            >
              <span>{{ outLable.value }}</span>
              <!-- <span v-if="index < task.outLables.length - 1">{{task.outConnects[index].value}}</span> -->
              <span
              v-for="(outConnect, index1) in task.outConnects"
              :key="index1"
              v-if="index1==index"
            >{{outConnect.value}}</span>
            </span>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="我的标注" name="second">
            <div>用户名:{{ task.username }}</div>
            <el-divider></el-divider>
            <div>图片任务:{{ task.number }}</div>
            <el-divider></el-divider> 完成进度
            <el-progress :percentage="task.rate"></el-progress
            ><el-divider></el-divider> 标注类型：<el-tag
              v-for="(mark, index) in task.marks"
              :key="index"
            >
              {{ mark }} </el-tag
            ><el-divider></el-divider>
            <div>权限:{{ task.jurisdiction }}</div>
          </el-tab-pane>
          <el-tab-pane label="细节文档" name="third">
            <el-card>{{ task.file }}</el-card>
          </el-tab-pane>
          <el-tab-pane label="已标注反馈" name="forth">
            <div v-for="(marked,index) in task.taggedfiles" :key="index">
            <img
                style="width: 188.7px; height: 90.3px"
                :src="marked.img"
                alt=""
              /><span>{{marked.feedback||"暂无"}}</span></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      conversion: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
      tasks: [
        {
          begin: "0",
          end: "0",
          director: "",
          describe: "",
          file: "",
          temple: "",
          username: "袁朗",
          number: "30",
          complete: "30",
          rate: 45,
          marks: ["多边形", "矩形"],
          jurisdiction: "可标注指定内容",
          activeName: "first",
        },
      ],
    };
  },
  methods: {
    update(index) {
      let that = this;
      let user = window.sessionStorage.getItem("username");
      let data = JSON.stringify({
        username: user,
        progress: this.tasks[index].complete,
        id: this.tasks[index].id,
      });
      console.log(data);
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/updaterate/",
        //设置请求体
        data: data,
      }).then((response) => {
        console.log(response);
        if (response.data == "ok") {
          that.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "api/getpersonalproject/",
            //设置请求体
            data: user,
          }).then((response) => {
            let data = response.data;
            console.log(data);

            for (let i = 0; i < data.length; i++) {
              console.log(data[i].replace(/'/g, '"'));
              data[i] = JSON.parse(data[i].replace(/'/g, '"'));
            }
            //let data2 = response.data.replace(/'/g, '"');
            console.log(data);
            that.tasks = data;
          });
          that.$message({
            message: "更新成功",
            type: "success",
          });
        }
      });
    },
    mark(index) {
      window.sessionStorage.setItem("mark", 2);
      window.sessionStorage.setItem("index", index);
      this.$router.push({
        path: "/mark",
      });
    },
  },
  mounted() {
    let data = window.sessionStorage.getItem("username");
    this.$axios({
      //请求类型
      method: "POST",
      //URL
      url: "api/getpersonalproject/",
      //设置请求体
      data: data,
    }).then((response) => {
      console.log(response.data);
      let data = response.data;
      for (let i = 0; i < data.length; i++) {
        data[i] = JSON.parse(data[i]);
        data[i].attris=JSON.parse(data[i].attris.replace(/'/g, '"'));
      }
      for(let i=0;i<data.length;i++){
        for(let j=0;j<data[i].taggedfiles.length;j++){
        data[i].taggedfiles[j].img+="?"+Math.random();
      }
      }
      this.tasks = data;
    });
  },
};
</script>

<style scoped>
.el-input {
  width: 130px;
}
</style>
