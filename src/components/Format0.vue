<template>
  <div>
    <el-card class="box-card">
      <el-steps :active="activeNumber - 0">
        <el-step
          title="步骤 1"
          description="自定义输入文件格式-标签池"
        ></el-step>
        <el-step
          title="步骤 2"
          description="自定义输入文件格式-衔接符池"
        ></el-step>
        <el-step title="步骤 3" description="输入格式预览"></el-step>
        <el-step
          title="步骤 4"
          description="自定义输出文件格式-标签池"
        ></el-step>
        <el-step
          title="步骤 5"
          description="自定义输出文件格式-衔接符池"
        ></el-step>
        <el-step title="步骤 6" description="输出文件格式预览"></el-step>
      </el-steps>

      <el-tabs
        tab-position="left"
        v-model="activeNumber"
        :before-leave="beforeTabLeave"
      >
        <el-tab-pane label="输入定义标签" name="0">
          <el-form
            :model="imageLableForm"
            ref="imageLableForm"
            label-width="100px"
            class="demo-dynamic"
          >
            <el-form-item
              v-for="(lable, index) in imageLableForm.lables"
              :label="'标签' + index"
              :key="lable.key"
              :prop="'lables.' + index + '.value'"
              :rules="{
                required: true,
                message: '标签名不能为空',
                trigger: 'blur',
              }"
            >
              <el-input v-model="lable.value"></el-input
              ><el-button @click.prevent="removeLable(lable)">删除</el-button>
            </el-form-item>
            <el-form-item>
              <!-- <el-button
                        type="primary"
                        @click="submitForm('imageLableForm')"
                        >提交</el-button
                      > -->
              <el-button @click="addLable">新增标签</el-button>
              <el-button @click="resetForm('imageLableForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="输入定义衔接符" name="1">
          <el-form
            :model="imageConnectForm"
            ref="imageConnectForm"
            label-width="100px"
            class="demo-dynamic"
          >
            请输入衔接符<el-input
              placeholder="请输入衔接符"
              v-model="imageConnectForm.imageConnect"
              clearable
            >
            </el-input>
            <!-- <el-button
                      type="primary"
                      @click="submitForm('imageConnectForm')"
                      >提交</el-button
                    > -->
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="输入格式预览" name="2">
          <span
            v-for="(lable, index) in imageLableForm.lables"
            :key="lable.key"
          >
            <el-button type="success" class="btu">{{ lable.value }}</el-button>
            <el-button type="warning" class="btu" v-if="index != inputNumber">{{
              imageConnectForm.imageConnect
            }}</el-button>
          </span>
          <div class="next">
            <!-- <el-button type="primary" @click="nextStep"
                      >下一步</el-button
                    > -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="输出定义标签" name="3">
          <el-form
            :model="imageLableFormOut"
            ref="imageLableFormOut"
            label-width="100px"
            class="demo-dynamic"
          >
            <el-form-item
              v-for="(lable, index) in imageLableFormOut.lables"
              :label="'标签' + index"
              :key="lable.key"
              :prop="'lables.' + index + '.value'"
              :rules="{
                required: true,
                message: '标签名不能为空',
                trigger: 'blur',
              }"
            >
              <el-input v-model="lable.value"></el-input
              ><el-button @click.prevent="removeLableOut(lable)"
                >删除</el-button
              >
            </el-form-item>
            <el-form-item>
              <!-- <el-button
                        type="primary"
                        @click="submitForm('imageLableFormOut')"
                        >提交</el-button
                      > -->
              <el-button @click="addLable">新增标签</el-button>
              <el-button @click="resetForm('imageLableFormOut')"
                >重置</el-button
              >
            </el-form-item>
          </el-form></el-tab-pane
        >
        <el-tab-pane label="输出定义衔接符" name="4"
          ><el-form
            :model="imageConnectFormOut"
            ref="imageConnectFormOut"
            label-width="100px"
            class="demo-dynamic"
          >
            请输入衔接符<el-input
              placeholder="请输入衔接符"
              v-model="imageConnectFormOut.imageConnect"
              clearable
            >
            </el-input>
            <!-- <el-button
                      type="primary"
                      @click="submitForm('imageConnectFormOut')"
                      >提交</el-button
                    > -->
          </el-form></el-tab-pane
        >
        <el-tab-pane label="输出格式预览" name="5"
          ><span
            v-for="(lable, index) in imageLableFormOut.lables"
            :key="lable.key"
          >
            <el-button type="success" class="btu">{{ lable.value }}</el-button>
            <el-button type="warning" class="btu" v-if="index != OutNumber">{{
              imageConnectFormOut.imageConnect
            }}</el-button>
          </span>
          <div class="next">
            <el-button type="primary" @click="nextStep">确认提交</el-button>
          </div></el-tab-pane
        >
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNumber: "0",
      imageLableForm: {
        lables: [
          {
            value: "姓名",
          },
          {
            value: "编号",
          },
          {
            value: "科室",
          },
          {
            value: "住院号",
          },
        ],
      },
      imageConnectForm: {
        imageConnect: "-",
      },
      imageLableFormOut: {
        lables: [
          {
            value: "姓名",
          },
          {
            value: "编号",
          },
          {
            value: "科室",
          },
          {
            value: "住院号",
          },
        ],
      },
      imageConnectFormOut: {
        imageConnect: "-",
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
          this.activeNumber++;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeLable(item) {
      var index = this.imageLableForm.lables.indexOf(item);
      if (index !== -1) {
        this.imageLableForm.lables.splice(index, 1);
      }
    },
    addLable() {
      this.imageLableForm.lables.push({
        value: "",
        key: Date.now(),
      });
    },
    nextStep() {
      this.activeNumber++;
      alert("提交成功");
    },
    removeLableOut(item) {
      var index = this.imageLableFormOut.lables.indexOf(item);
      if (index !== -1) {
        this.imageLableFormOut.lables.splice(index, 1);
      }
    },
    addLableOut() {
      this.imageLableFormOut.lables.push({
        value: "",
        key: Date.now(),
      });
    },
    beforeTabLeave(activeName, oldActiveName) {
      console.log("即将离开的标签页名字是：" + oldActiveName);
      console.log("即将进入的标签页名字是：" + activeName);
      // return false
    },
  },
  computed: {
    inputNumber() {
      return this.imageLableForm.lables.length - 1;
    },
    OutNumber() {
      return this.imageLableFormOut.lables.length - 1;
    },
  },
};
</script>

<style scoped>

.el-card {
  margin-top: 10px;
}

.demo-dynamic {
  margin-top: 20px;
}

.el-tabs {
  margin-top: 20px;
}

.btu {
  margin-left: 10px;
}

.next {
  margin-top: 20px;
  margin-left: 50%;
}
</style>