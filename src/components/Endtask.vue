<template>
  <div>
    <div>
      <el-button type="info" plain @click="logout">退出登录</el-button>
      <el-button type="info" plain @click="backend">返回主页</el-button>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="标注项目">
        <el-card>
          <el-button
            type="primary"
            v-for="(task, index) in tasks"
            :key="index + 'task'"
            @click="display1(index)"
            >{{ task.name }}</el-button
          ><br /><br />
          <div
            v-for="(task, index) in tasks"
            :key="index"
            v-show="Exhibition1[index]"
          >
            <h2>{{ task.name }}</h2>
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
                    :key="inLable.key"
                  >
                    <span>{{ inLable.value }}</span>
                    <span
                      v-for="(inConnect, index1) in task.inConnects"
                      :key="inConnect.key"
                      v-if="index1 == index"
                      >{{ inConnect.value }}</span
                    > </span
                  ><br />
                  输出文件格式：<span
                    v-for="(outLable, index) in task.outLables"
                    :key="outLable.key"
                  >
                    <span>{{ outLable.value }}</span>
                    <!-- <span v-if="index < task.outLables.length - 1">{{task.outConnects[index].value}}</span> -->
                    <span
                      v-for="(outConnect, index1) in task.outConnects"
                      :key="outConnect.key"
                      v-if="index1 == index"
                      >{{ outConnect.value }}</span
                    >
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
                <div v-for="(marked, index) in task.taggedfiles" :key="index">
                  <img
                    style="width: 188.7px; height: 90.3px"
                    :src="marked.img"
                    alt=""
                  /><span>{{ marked.feedback || "暂无" }}</span>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="管理项目">
        <el-button
          type="info"
          v-for="(task, index) in projects"
          :key="index + 'project'"
          @click="display(index)"
          >{{ task.name }}</el-button
        ><br /><br />
        <div
          v-for="(task, index) in projects"
          :key="index + 'tas'"
          v-show="Exhibition[index]"
        >
          <h2>{{ task.name }}</h2>
          <el-tabs v-model="task.activeName">
            <el-tab-pane label="任务总览" name="first">
              <el-card shadow="always">
                完成进度
                <el-progress :percentage="task.rate"></el-progress
                ><el-divider></el-divider>
                <div>创建日期:{{ task.begin }}</div>
                <el-divider></el-divider>
                <div>截止日期:{{ task.end }}</div>
                <el-divider></el-divider>
                <div>负责人：{{ task.director }}</div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="标注详情" name="second">
              <el-card shadow="always">
                <div>图片个数：{{ task.number }}</div>
                <el-divider></el-divider>
                <div>描述：{{ task.describe }}</div>
                <el-divider></el-divider>
                人员：<el-tag
                  v-for="(peo, index) in task.person"
                  :key="index + 'peo'"
                >
                  {{ peo.username }} </el-tag
                ><el-divider></el-divider>
                标注模板：
                <img
                  style="width: 100px; height: 100px"
                  :src="task.temple"
                  :alt="task.temple"
                /><el-divider></el-divider> 标注类型：<el-tag
                  v-for="(mark, index) in task.marks"
                  :key="index + 'mark'"
                >
                  {{ mark }} </el-tag
                ><el-divider></el-divider>输入文件格式：<span
                  v-for="(inLable, index) in task.inLables"
                  :key="inLable.key"
                >
                  <span>{{ inLable.value }}</span>
                  <span
                    v-for="(inConnect, index1) in task.inConnects"
                    :key="inConnect.key"
                    v-if="index1 == index"
                    >{{ inConnect.value }}</span
                  > </span
                ><br />
                输出文件格式：<span
                  v-for="(outLable, index) in task.outLables"
                  :key="outLable.key"
                >
                  <span>{{ outLable.value }}</span>
                  <span
                    v-for="(outConnect, index1) in task.outConnects"
                    :key="outConnect.key"
                    v-if="index1 == index"
                    >{{ outConnect.value }}</span
                  >
                </span>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="细节文档" name="third">
              <el-card>{{ task.file }}</el-card>
            </el-tab-pane>
            <el-tab-pane label="项目管理" name="fourth">
              <el-card>
                人员分配：
                <el-table :data="task.person" stripe style="width: 100%" border>
                  <el-table-column
                    prop="username"
                    label="姓名"
                    width="150"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="number"
                    label="任务量"
                    width="150"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="complete"
                    label="已完成"
                    width="150"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column label="完成比" align="center">
                    <template slot-scope="scope">
                      <el-progress :percentage="scope.row.rate"></el-progress>
                    </template>
                  </el-table-column>
                  <el-table-column prop="marks" label="标注类型" align="center">
                    <template slot-scope="scope">
                      <el-tag
                        size="medium"
                        v-for="(mark, index) in scope.row.marks"
                        :key="index + 'mar'"
                        style="margin-left: 10px"
                        >{{ mark }}</el-tag
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="jurisdiction"
                    label="权限"
                    width="150"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column label="标注内容" align="center"
                    ><template slot-scope="scope">
                      <el-button
                        type="info"
                        plain
                        @click="getMarkedImage(scope.row.username, index)"
                        >查看已标注图片</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="已标注数据" :visible.sync="dialogVisibleImage">
      <img
        :src="markedImg"
        alt=""
        style="width: 943.5px; height: 451.5px"
        id="fffff"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nextImage">下一张</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Exhibition: [],
      Exhibition1: [],
      activeTask: 0,
      activeTask1: 0,
      username: "",
      identity: "",
      projects: [],
      tasks: [],
      dialogVisibleImage: false,
      markedImg: "",
      number: 0, //已标注图片在数组的位置
      annotator: "", //当前标注员
      projectName: "", //当前项目
    };
  },
  methods: {
    display(index) {
      for (let i = 0; i < this.Exhibition.length; i++) {
        this.Exhibition[i] = false;
      }
      this.Exhibition[index] = true;
      this.activeTask = index;
      this.$forceUpdate();
    },
    display1(index) {
      for (let i = 0; i < this.Exhibition1.length; i++) {
        this.Exhibition1[i] = false;
      }
      this.Exhibition1[index] = true;
      this.activeTask1 = index;
      this.$forceUpdate();
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
    backend() {
      this.$router.push("/backend");
    },
    getMarkedImage(username, index) {
      this.annotator = username;
      let name = this.tasks[index].name;
      this.projectName = name;
      let data = {
        username: username,
        name: name,
      };
      data = JSON.stringify(data);
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/gettaggedpic/",
        //设置请求体
        data: data,
      }).then((response) => {
        this.markedImgs = response.data;
        for (let i = 0; i < this.markedImgs.length; i++) {
          this.markedImgs[i] += "?" + Math.random();
        }
        this.markedImg = this.markedImgs[0];
        this.dialogVisibleImage = true;
        console.log(this.markedImgs);
      });
    },
    nextImage() {
      if (this.number == this.markedImgs.length - 1) {
        this.$message({
          message: "当前已是最后一张",
          type: "warning",
        });
        return;
      }
      this.number++;
      this.markedImg = this.markedImgs[this.number];
    },
  },
  mounted() {
    const data = (this.username = this.$route.query.username);
    this.identity = this.$route.query.identity;
    let url = "";
    if (this.identity == 0) {
      url = "api/getproject/";
    } else {
      url = "api/deputygetproject/";
    }
    this.$axios({
      //请求类型
      method: "POST",
      //URL
      url: url,
      //设置请求体
      data: data,
    }).then((response) => {
      this.projects = JSON.parse(response.data.data);
      console.log("--------------", this.projects);
      for (let i = 0; i < this.projects.length; i++) {
        this.projects[i].attris = JSON.parse(
          this.projects[i].attris.replace(/'/g, '"')
        );
        this.Exhibition.push(false);
      }
    });
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
        data[i].attris = JSON.parse(data[i].attris.replace(/'/g, '"'));
        this.Exhibition1.push(false);
      }
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].taggedfiles.length; j++) {
          data[i].taggedfiles[j].img += "?" + Math.random();
        }
      }
      this.tasks = data;
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

<style scoped>
</style>
