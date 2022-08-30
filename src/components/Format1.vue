<template>
  <div>
    <el-card class="box-card">
      <el-alert
        title="标签与衔接符左键点击加号添加至输入格式，右键添加至输出格式，衔接符数量不足时，默认为“-”,格式预览中点击即可删除"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-form
        :inline="true"
        :model="imageForm"
        class="demo-form-inline"
        ref="imageForm"
      >
        <div>
          <h2>标签池</h2>
          <div>
            <el-button @click="empty('lables')">清空</el-button
            ><el-button @click="addLable">新增标签</el-button><br />
            <el-form-item
              v-for="(lable, index) in imageForm.lables"
              :key="lable.key"
              :prop="'lables.' + index + '.value'"
              :rules="{
                required: true,
                message: '标签不能为空',
                trigger: 'blur',
              }"
            >
              <button
                class="buu"
                @mousedown.prevent="addInLable($event, lable.value)"
              >
                <i class="el-icon-circle-plus-outline"></i></button
              ><el-input v-model="lable.value"></el-input>
              <el-button @click.prevent="removeLable(lable)"
                ><i class="el-icon-delete"></i
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="拖动更改标签"
                placement="bottom"
              >
                <button
                  class="buu"
                  id="index"
                  draggable="true"
                  @dragstart="end(lable.value, 0)"
                >
                  <i class="el-icon-thumb"></i>
                </button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>

        <div>
          <h2>衔接符池</h2>
          <div>
            <el-button @click="empty('connects')">清空</el-button
            ><el-button @click="addConnect">新增标签</el-button><br />
            <el-form-item
              v-for="(connect, index) in imageForm.connects"
              :key="connect.key"
              :prop="'connects.' + index + '.value'"
              :rules="{
                required: true,
                message: '标签不能为空',
                trigger: 'blur',
              }"
            >
              <button
                class="buu"
                @mousedown.prevent="addInConnect($event, connect.value)"
              >
                <i class="el-icon-circle-plus-outline"></i></button
              ><el-input v-model="connect.value"></el-input
              ><el-button @click.prevent="removeConnect(connect)"
                ><i class="el-icon-delete"></i
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="拖动更改标签"
                placement="bottom"
              >
                <button
                  class="buu"
                  id="index"
                  draggable="true"
                  @dragstart="end(connect.value, 0)"
                >
                  <i class="el-icon-thumb"></i>
                </button>
              </el-tooltip>
            </el-form-item>
          </div>
        </div>

        <div>
                     
          <h2>输入文件格式</h2>
                     
          <div class="inputStyle" id="div1">
                       
            <span
              v-for="(inLable, index) in imageForm.inLables"
              :key="inLable.key"
            >
                           
              <button
                type="success"
                class="btu1"
                @click="remove('inLables', index)"
                draggable="true"
                @dragstart="end1('inLables', index, 1)"
                @dragenter="edit('inLables', $event, index)"
              >
                {{ inLable.value }}
              </button>
               <span v-if="index < imageForm.inLables.length - 1">
                <button
                  v-if="index < imageForm.inConnects.length"
                  type="warning"
                  class="btu2"
                  @click="remove('inConnects', index)"
                  draggable="true"
                  @dragstart="end1('inConnects', index, 1)"
                  @dragenter="edit('inConnects', $event, index)"
                >
                  {{ imageForm.inConnects[index].value }}
                </button>
                <button
                  v-else
                  class="btu3"
                  @click="remove('inConnects', index)"
                  draggable="true"
                  @dragstart="end1('inConnects', index, 1)"
                  @dragenter="edit('inConnects', $event, index)"
                >
                  -
                </button></span
              >
                         
            </span>
          </div>
                   
        </div>

        <div>
                     
          <h2>输出文件格式</h2>
                     
          <div class="inputStyle" id="div1">
                       
            <span
              v-for="(outLable, index) in imageForm.outLables"
              :key="outLable.key"
            >
                           
              <button
                type="success"
                class="btu1"
                @click="remove('outLables', index)"
                draggable="true"
                @dragstart="end1('outLables', index, 1)"
                @dragenter="edit('outLables', $event, index)"
              >
                {{ outLable.value }}
              </button>
               <span v-if="index < imageForm.outLables.length - 1">
                <button
                  v-if="index < imageForm.outConnects.length"
                  type="warning"
                  class="btu2"
                  @click="remove('outConnects', index)"
                   draggable="true"
                  @dragstart="end1('outConnects', index, 1)"
                  @dragenter="edit('outConnects', $event, index)"
                >
                  {{ imageForm.outConnects[index].value }}
                </button>
                <button
                  v-else
                  type="warning"
                  class="btu3"
                  @click="remove('outConnects', index)"
                   draggable="true"
                  @dragstart="end1('outConnects', index, 1)"
                  @dragenter="edit('outConnects', $event, index)"
                >
                  -
                </button></span
              >
                         
            </span>
          </div>
                   
        </div>

        <div class="next">
          <el-button type="primary" @click="submitForm('imageForm')"
            >提交</el-button
          >
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
document.oncontextmenu = function () {
  return false;
};
export default {
  data() {
    return {
      editBefore: "",
      type: 0,
      item: "",
      index: 0,
      imageForm: {
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
        connects: [
          {
            value: "-",
          },
          {
            value: "+",
          },
          {
            value: "_",
          },
        ],
        inLables: [],
        outLables: [],
        inConnects: [],
        outConnects: [],
      },
    };
  },
  methods: {
    end(e, type) {
      this.editBefore = e;
      this.type = type;
    },
    end1(item, index, type) {
      this.type = type;
      //this.editBefore=this.imageForm[item][index]['value'];
      this.item = item;
      this.index = index;
      if (index >= this.imageForm[item].length) {
        for (let i = this.imageForm[item].length; i <= index; i++) {
          this.imageForm[item].push({
            value: "-",
            key: Date.now(),
          });
        }
      }
    },
    edit(item, e, index) {
      if (this.type == 0) {
        if (index >= this.imageForm[item].length) {
          if (index > this.imageForm[item].length) {
            for (let i = this.imageForm[item].length; i < index; i++) {
              this.imageForm[item].push({
                value: "-",
                key: Date.now(),
              });
            }
          }
          this.imageForm[item].push({
            value: this.editBefore,
            key: Date.now(),
          });
        } else {
          this.imageForm[item][index].value = this.editBefore;
        }
      } else {
        if (index >= this.imageForm[item].length) {
          for (let i = this.imageForm[item].length; i <= index; i++) {
            this.imageForm[item].push({
              value: "-",
              key: Date.now(),
            });
          }
        }
        let tepm = this.imageForm[this.item][this.index]["value"];
        this.imageForm[this.item][this.index]["value"] =
          this.imageForm[item][index]["value"];
        this.imageForm[item][index]["value"] = tepm;
      }
    },
    empty(name) {
      this.imageForm[name] = [];
    },
    addLable() {
      this.imageForm.lables.push({
        value: "",
        key: Date.now(),
      });
    },
    removeLable(item) {
      var index = this.imageForm.lables.indexOf(item);
      if (index !== -1) {
        this.imageForm.lables.splice(index, 1);
      }
    },
    addConnect() {
      this.imageForm.connects.push({
        value: "",
        key: Date.now(),
      });
    },
    removeConnect(item) {
      var index = this.imageForm.connects.indexOf(item);
      if (index !== -1) {
        this.imageForm.connects.splice(index, 1);
      }
    },
    addInLable(e, item) {
      if (e.which === 1) {
        this.imageForm.inLables.push({
          value: item,
          key: Date.now(),
        });
      } else {
        this.imageForm.outLables.push({
          value: item,
          key: Date.now(),
        });
      }
    },
    addInConnect(e, item) {
      if (e.which === 1) {
        this.imageForm.inConnects.push({
          value: item,
          key: Date.now(),
        });
      } else {
        this.imageForm.outConnects.push({
          value: item,
          key: Date.now(),
        });
      }
    },
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
    remove(item, index) {
      if (index !== -1) {
        this.imageForm[item].splice(index, 1);
      }
    },
  },
  computed: {
    inputNumber() {
      return this.imageForm.inLables.length;
    },
    OutNumber() {
      return this.imageForm.outLables.length;
    },
  },
  watch: {
    "imageForm.inConnects": function () {
      this.$forceUpdate;
    },
    "imageForm.outConnects": function () {
      this.$forceUpdate;
    },
  },
};
</script>

<style scoped>
.el-card {
  margin-top: 10px;
}

.el-input {
  width: 80px;
}

.btu1 {
  margin-left: 10px;
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.btu2 {
  margin-left: 10px;
  color: #fff;
  background-color: orange;
  border-color: orange;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.btu3 {
  margin-left: 10px;
  color: #fff;
  background-color: rgb(223, 211, 189);
  border-color: rgb(223, 211, 189);
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.next {
  margin-top: 20px;
}

.inputStyle {
  border: yellowgreen solid 1px;
  height: 80px;
  width: 900px;
  overflow: scroll;
}

.buu {
  height: 35px;
  background-color: white;
  border: darkgray;
}
</style>