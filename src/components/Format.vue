<template>
  <div>
    <el-card class="box-card">
      <el-alert
        title="标签与衔接符左键点击加号添加至输入格式，右键添加至输出格式，衔接符数量不足时，默认为“-”,格式预览中左键删除，右键更改，拖拽插入"
        type="info"
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
            <div class="lable_butten_warp">
              <el-button type="primary" plain @click="empty('lables')" icon="el-icon-minus">清空</el-button>
              <el-button type="primary" plain @click="addLable" icon="el-icon-plus">新增标签</el-button>
              <el-button type="primary" plain @click="getHistoryLabel" icon="el-icon-download">获取历史标签</el-button>
              <el-button type="primary" plain @click="saveHistoryLabel" icon="el-icon-upload">保存标签</el-button>
            </div>
            <el-form-item
              v-for="(lable, index) in imageForm.lables"
              :key="index"
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
            </el-form-item>
          </div>
        </div>

        <div>
          <h2>衔接符池</h2>
          <div>
            <div class="lable_butten_warp">
              <el-button type="primary" plain @click="empty('connects')" icon="el-icon-minus">清空</el-button>
              <el-button type="primary" plain @click="addConnect" icon="el-icon-plus">新增标签</el-button>
              <el-button type="primary" plain @click="getHistoryConnect" icon="el-icon-download">获取历史衔接符</el-button>
              <el-button type="primary" plain @click="saveHistoryConnect" icon="el-icon-upload">保存衔接符</el-button>
            </div>
            <el-form-item
              v-for="(connect, index) in imageForm.connects"
              :key="index"
              :prop="'connects.' + index + '.value'"
              :rules="{
                required: true,
                message: '衔接符不能为空',
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
                class="btu1"
                @mousedown="down"
                @mouseup="beginEdit('inLables', index, 1, 1, $event)"
                draggable="true"
                @dragstart="end('inLables', index, 1, 1)"
                @dragenter="insert('inConnects', $event, index, 1)"
              >
                {{ inLable.value }}
              </button>
               <span v-if="index < imageForm.inLables.length - 1">
                <button
                  v-if="index < imageForm.inConnects.length"
                  :class="
                    imageForm.inConnects[index].value == '-' ? 'btu3' : 'btu2'
                  "
                  @mousedown="down"
                  @mouseup="beginEdit('inConnects', index, 0, 2, $event)"
                  draggable="true"
                  @dragstart="end('inConnects', index, 0, 2)"
                  @dragenter="insert('inConnects', $event, index, 2)"
                >
                  {{ imageForm.inConnects[index].value }}
                </button>
                <button
                  v-else
                  class="btu3"
                  @mousedown="down"
                  @mouseup="beginEdit('inConnects', index, 0, 2, $event)"
                  draggable="true"
                  @dragstart="end('inConnects', index, 0, 2)"
                  @dragenter="insert('inConnects', $event, index, 2)"
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
                class="btu1"
                @mousedown="down"
                @mouseup="beginEdit('outLables', index, 1, 1, $event)"
                draggable="true"
                @dragstart="end('outLables', index, 1, 1)"
                @dragenter="insert('outConnects', $event, index, 1)"
              >
                {{ outLable.value }}
              </button>
               <span v-if="index < imageForm.outLables.length - 1">
                <button
                  v-if="index < imageForm.outConnects.length"
                  :class="
                    imageForm.outConnects[index].value == '-' ? 'btu3' : 'btu2'
                  "
                  @mousedown="down"
                  @mouseup="beginEdit('outConnects', index, 0, 2, $event)"
                  draggable="true"
                  @dragstart="end('outConnects', index, 0, 2)"
                  @dragenter="insert('outConnects', $event, index, 2)"
                >
                  {{ imageForm.outConnects[index].value }}
                </button>
                <button
                  v-else
                  class="btu3"
                  @mousedown="down"
                  @mouseup="beginEdit('outConnects', index, 0, 2, $event)"
                  draggable="true"
                  @dragstart="end('outConnects', index, 0, 2)"
                  @dragenter="insert('outConnects', $event, index, 2)"
                >
                  -
                </button></span
              >
                         
            </span>
          </div>
                   
        </div>

        <div class="next">
          <el-button type="primary" v-if="project == 0" @click="submitForm">保存</el-button>
          <el-button type="primary" v-if="project == 0" @click="getHistoryData"
            >查看历史数据</el-button
          >
          <el-button type="primary" plain v-if="project == 1" @click="goTask"
            >返回继续创建</el-button
          >
        </div>
      </el-form>
    </el-card>

    <el-dialog title="更改标签为" :visible.sync="dialogFormVisible1">
      <el-select v-model="targetIndex" placeholder="请选择">
        <el-option
          v-for="(lable, index) in imageForm.lables"
          :key="index + 1"
          :value="index + 1"
          :label="lable.value"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="change('lables', targetIndex)"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="更改衔接符为" :visible.sync="dialogFormVisible2">
      <el-select v-model="targetIndex" placeholder="请选择">
        <el-option
          v-for="(connect, index) in imageForm.connects"
          :key="index + 1"
          :value="index + 1"
          :label="connect.value"
        >
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="change('connects', targetIndex)"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="查看历史数据" :visible.sync="dialogVisible3">
      <h3>输入文件格式</h3>
      <div
        class="history"
        v-for="(data, index) in historyData.inData"
        :key="index + 'i'"
        :class="[histroyIndexIn == index + 1 ? 'activeHis' : 'normalHis']"
      >
        <el-button>
          <span v-for="(item, index) in data.label" :key="index"
            >{{ item.value
            }}<span v-if="index < data.label.length - 1">{{
              data.connect[index].value
            }}</span></span
          > </el-button
        ><el-button
          icon="el-icon-edit"
          circle
          @click="chooseIn(index)"
        ></el-button>
      </div>
      <h3>输出文件格式</h3>
      <div
        class="history"
        v-for="(data, index) in historyData.outData"
        :key="index + 'o'"
        :class="[histroyIndexOut == index + 1 ? 'activeHis' : 'normalHis']"
      >
        <el-button>
          <span v-for="(item, index) in data.label" :key="index"
            >{{ item.value
            }}<span v-if="index < data.label.length - 1">{{
              data.connect[index].value
            }}</span></span
          ></el-button
        ><el-button
          icon="el-icon-edit"
          circle
          @click="chooseOut(index)"
        ></el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">关闭</el-button>
        <el-button type="primary" @click="editHistory">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看历史标签" :visible.sync="dialogVisibleLable">
      <div v-for="(lable, index) in historyLable" :key="index">
        <el-tag >{{ lable.name }}</el-tag>
        <span v-for="(item, index) in lable.lables" :key="index">&nbsp{{
          item.value
        }}&nbsp</span>
        <input v-model="lable.checked" type="checkbox">选择</input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleLable = false">取 消</el-button>
        <el-button type="primary" @click="chooseHistoryLabel">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看历史衔接符" :visible.sync="dialogVisibleConnect">
      <div v-for="(connect, index) in historyConnect" :key="index">
        <el-tag >{{ connect.name }}</el-tag>
        <span v-for="(item, index) in connect.connects" :key="index">&nbsp{{
          item.value
        }}&nbsp</span>
        <input v-model="connect.checked" type="checkbox">选择</input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleConnect = false">取 消</el-button>
        <el-button type="primary" @click="chooseHistoryConnect"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
document.oncontextmenu = function () {
  return false;
};
export default {
  data() {
    return {
      isDrag: true,
      timmerHandle: null,
      targetIndex: "",
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogVisible3: false,
      dialogVisibleLable: false,
      dialogVisibleConnect: false,
      editBefore: "",
      type: 0,
      item: "",
      index: 0,
      cate: 1,
      imageForm: {
        lables: [
          {
            value: "111",
            key: "1",
          },
        ],
        connects: [
          {
            value: "+",
            key: "1",
          },
        ],
        inLables: [],
        outLables: [],
        inConnects: [],
        outConnects: [],
      },
      historyData: {
        inData: [],
        outData: [],
      },
      histroyIndexIn: 0,
      histroyIndexOut: 0,
      project: 0,
      task: {},
      historyLable: [],
      historyConnect: [],
    };
  },
  methods: {
    setDragTrue() {
      this.isDrag = true;
    },
    down() {
      this.isDrag = false;
      this.timmerHandle = setTimeout(this.setDragTrue, 200);
    },
    beginEdit(item, index, type, cate, e) {
      if (!this.isDrag) {
        clearTimeout(this.timmerHandle);
        if (e.which == 1) {
          if (cate == 1) {
            this.imageForm[item].splice(index, 1);
          } else {
            this.imageForm[item].splice(index, 1, {
              value: "-",
              key: Date.now(),
            });
          }
        } else {
          if (cate == 1) {
            this.dialogFormVisible1 = true;
          } else {
            this.dialogFormVisible2 = true;
          }
          this.type = type;
          this.item = item;
          this.index = index;
          this.cate = cate;
          if (index >= this.imageForm[item].length) {
            for (let i = this.imageForm[item].length; i <= index; i++) {
              this.imageForm[item].push({
                value: "-",
                key: Date.now(),
              });
            }
          }
        }
      }
    },
    change(item, index) {
      if (this.cate == 1) {
        this.dialogFormVisible1 = false;
      } else {
        this.dialogFormVisible2 = false;
      }
      this.imageForm[this.item][this.index].value =
        this.imageForm[item][index - 1].value;
    },
    end(item, index, type, cate) {
      this.type = type;
      //this.editBefore=this.imageForm[item][index]['value'];
      this.item = item;
      this.index = index;
      this.cate = cate;
      if (index >= this.imageForm[item].length) {
        for (let i = this.imageForm[item].length; i <= index; i++) {
          this.imageForm[item].push({
            value: "-",
            key: Date.now(),
          });
        }
      }
    },
    insert(item, e, index, cate) {
      if (this.cate != cate) {
        if (this.type == 1) {
          if (index >= this.imageForm[item].length) {
            for (let i = this.imageForm[item].length; i <= index; i++) {
              this.imageForm[item].push({
                value: "-",
                key: Date.now(),
              });
            }
          }
          this.imageForm[this.item].splice(index + 1, 0, {
            key: Date.now(),
            value: this.imageForm[this.item][this.index].value,
          });
          this.imageForm[this.item].splice(this.index + 1, 1);
        } else {
          if (index >= this.imageForm[item].length) {
            for (let i = this.imageForm[item].length; i <= index; i++) {
              this.imageForm[item].push({
                value: "-",
                key: Date.now(),
              });
            }
          }
          this.imageForm[this.item].splice(index, 0, {
            key: Date.now(),
            value: this.imageForm[this.item][this.index].value,
          });
          this.imageForm[this.item].splice(this.index + 1, 1);
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
        for (let i = 0; i < this.imageForm.inLables.length; i++) {
          if (this.imageForm.inLables[i].value == item) {
            this.$message.error("输入格式不可以有重复标签");
            return;
          }
        }
        this.imageForm.inLables.push({
          value: item,
          key: Date.now(),
        });
      } else {
        for (let i = 0; i < this.imageForm.outLables.length; i++) {
          if (this.imageForm.outLables[i].value == item) {
            this.$message.error("输出格式不可以有重复标签");
            return;
          }
        }
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
    submitForm() {
      let that = this;
      let data = JSON.stringify(window.sessionStorage.getItem("username"));
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/getUserMarkData/",
        //设置请求体
        data: data,
      })
        .then((response) => {
          let data1 = response.data.replace(/'/g, '"');
          console.log(data1);
          if (data1 != "none") {
            that.historyData = JSON.parse(data1);
          }
          let numberIn = that.historyData.inData.length;
          let numberOut = that.historyData.outData.length;
          if (that.imageForm.inLables.length != 0) {
            that.historyData.inData.push({
              label: [],
              connect: [],
            });
            for (let i = 0; i < that.imageForm.inLables.length; i++) {
              that.historyData.inData[numberIn].label.push(
                that.imageForm.inLables[i]
              );
            }
            for (let i = 0; i < that.imageForm.inLables.length - 1; i++) {
              that.historyData.inData[numberIn].connect.push(
                that.imageForm.inConnects[i] || {
                  value: "-",
                  key: Date.now(),
                }
              );
            }
          }
          if (that.imageForm.outLables.length != 0) {
            that.historyData.outData.push({
              label: [],
              connect: [],
            });
            for (let i = 0; i < that.imageForm.outLables.length; i++) {
              that.historyData.outData[numberOut].label.push(
                that.imageForm.outLables[i]
              );
            }
            for (let i = 0; i < that.imageForm.outLables.length - 1; i++) {
              that.historyData.outData[numberOut].connect.push(
                that.imageForm.outConnects[i] || {
                  value: "-",
                  key: Date.now(),
                }
              );
            }
          }
          let data = JSON.stringify(that.historyData);
          console.log(data);
          let whole = JSON.stringify({
            username: window.sessionStorage.getItem("username"),
            data: data,
          });
          that
            .$axios({
              //请求类型
              method: "POST",
              //URL
              url: "api/saveUserMarkData/",
              //设置请求体
              data: whole,
            })
            .then((response) => {
              if (response.data == "保存成功") {
                that.$alert("保存成功");
              }
            });
        })
        .catch(function (error) {
          that.$alert("保存失败");
        });
    },
    getHistoryData() {
      let that = this;
      let data = JSON.stringify(window.sessionStorage.getItem("username"));
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/getUserMarkData/",
        //设置请求体
        data: data,
      })
        .then((response) => {
          let data1 = response.data.replace(/'/g, '"');
          console.log(data1);
          if (data1 != "none") {
            that.historyData = JSON.parse(data1);
          }
          that.dialogVisible3 = true;
        })
        .catch(function (error) {
          that.$alert("获取失败");
        });
    },
    remove(item, index) {
      if (index !== -1) {
        this.imageForm[item].splice(index, 1);
      }
    },
    chooseIn(index) {
      if (this.histroyIndexIn == index + 1) {
        this.histroyIndexIn = 0;
      } else {
        this.histroyIndexIn = index + 1;
      }
      console.log(index);
    },
    chooseOut(index) {
      if (this.histroyIndexOut == index + 1) {
        this.histroyIndexOut = 0;
      } else {
        this.histroyIndexOut = index + 1;
      }
      console.log(index);
    },
    historyIn() {
      this.imageForm.inLables = [];
      this.imageForm.inConnects = [];
      for (
        let i = 0;
        i < this.historyData.inData[this.histroyIndexIn - 1].label.length;
        i++
      ) {
        this.imageForm.inLables.push(
          this.historyData.inData[this.histroyIndexIn - 1].label[i]
        );
        let k = false;
        for (let j = 0; j < this.imageForm.lables.length; j++) {
          if (
            this.imageForm.lables[j].value ==
            this.historyData.inData[this.histroyIndexIn - 1].label[i].value
          ) {
            k = true;
            break;
          }
        }
        if (!k) {
          this.imageForm.lables.push({
            value:
              this.historyData.inData[this.histroyIndexIn - 1].label[i].value,
            key: Date.now(),
          });
        }
        if (
          i <
          this.historyData.inData[this.histroyIndexIn - 1].label.length - 1
        ) {
          this.imageForm.inConnects.push(
            this.historyData.inData[this.histroyIndexIn - 1].connect[i]
          );
          let k = false;
          for (let j = 0; j < this.imageForm.connects.length; j++) {
            if (
              this.imageForm.connects[j].value ==
              this.historyData.inData[this.histroyIndexIn - 1].connect[i].value
            ) {
              k = true;
              break;
            }
          }
          if (!k) {
            this.imageForm.connects.push({
              value:
                this.historyData.inData[this.histroyIndexIn - 1].connect[i]
                  .value,
              key: Date.now(),
            });
          }
        }
      }
    },
    historyOut() {
      this.imageForm.outLables = [];
      this.imageForm.outConnects = [];
      for (
        let i = 0;
        i < this.historyData.outData[this.histroyIndexOut - 1].label.length;
        i++
      ) {
        this.imageForm.outLables.push(
          this.historyData.outData[this.histroyIndexOut - 1].label[i]
        );
        let k = false;
        for (let j = 0; j < this.imageForm.lables.length; j++) {
          if (
            this.imageForm.lables[j].value ==
            this.historyData.outData[this.histroyIndexOut - 1].label[i].value
          ) {
            k = true;
            break;
          }
        }
        if (!k) {
          this.imageForm.lables.push({
            value:
              this.historyData.outData[this.histroyIndexOut - 1].label[i].value,
            key: Date.now(),
          });
        }
        if (
          i <
          this.historyData.outData[this.histroyIndexOut - 1].label.length - 1
        ) {
          this.imageForm.outConnects.push(
            this.historyData.outData[this.histroyIndexOut - 1].connect[i]
          );
          let k = false;
          for (let j = 0; j < this.imageForm.connects.length; j++) {
            if (
              this.imageForm.connects[j].value ==
              this.historyData.outData[this.histroyIndexOut - 1].connect[i]
                .value
            ) {
              k = true;
              break;
            }
          }
          if (!k) {
            this.imageForm.connects.push({
              value:
                this.historyData.outData[this.histroyIndexOut - 1].connect[i]
                  .value,
              key: Date.now(),
            });
          }
        }
      }
    },
    editHistory() {
      if (this.histroyIndexIn != 0) {
        this.historyIn();
      }
      if (this.histroyIndexOut != 0) {
        this.historyOut();
      }
      this.dialogVisible3 = false;
    },
    getHistoryLabel() {
      let that = this;
      let data = JSON.stringify(window.sessionStorage.getItem("username"));
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/getalllables/",
        //设置请求体
        data: data,
      })
        .then((response) => {
          //let data1 = response.data.replace(/'/g, '"');
          that.historyLable = response.data;
          for (let i = 0; i < that.historyLable.length; i++) {
            that.historyLable[i].checked = false;
          }
          console.log(that.historyLable);
          that.dialogVisibleLable = true;
        })
        .catch(function (error) {
          that.$alert("获取失败");
        });
    },
    chooseHistoryLabel() {
      for (let i = 0; i < this.historyLable.length; i++) {
        if (this.historyLable[i].checked) {
          for (let j = 0; j < this.historyLable[i].lables.length; j++) {
            this.imageForm.lables.push(this.historyLable[i].lables[j]);
          }
        }
      }
      this.dialogVisibleLable = false;
    },
    saveHistoryLabel() {
      this.$prompt("请输入标签名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          const that = this;
          let data = {
            name: value,
            lables: that.imageForm.lables,
            username: window.sessionStorage.getItem("username"),
          };
          console.log(data);
          data = JSON.stringify(data);
          this.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "api/savealllables/",
            //设置请求体
            data: data,
          })
            .then((response) => {
              if (response.data == "保存成功") {
                that.$alert("保存成功");
              }
            })
            .catch(function (error) {
              that.$alert("保存失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消保存",
          });
        });
      // let data = JSON.stringify(that.imageForm.lables);
      // console.log(data);
      // let whole = JSON.stringify({
      //   username: window.sessionStorage.getItem("username"),
      //   data: data,
      // });
    },
    getHistoryConnect() {
      let that = this;
      let data = JSON.stringify(window.sessionStorage.getItem("username"));
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/getallconnects/",
        //设置请求体
        data: data,
      })
        .then((response) => {
          // let data1 = response.data.replace(/'/g, '"');
          // that.imageForm.connects = JSON.parse(data1);
          that.historyConnect = response.data;
          for (let i = 0; i < that.historyConnect.length; i++) {
            that.historyConnect[i].checked = false;
          }
          that.dialogVisibleConnect = true;
        })
        .catch(function (error) {
          that.$alert("获取失败");
        });
    },
    chooseHistoryConnect() {
      for (let i = 0; i < this.historyConnect.length; i++) {
        if (this.historyConnect[i].checked) {
          for (let j = 0; j < this.historyConnect[i].connects.length; j++) {
            this.imageForm.connects.push(this.historyConnect[i].connects[j]);
          }
        }
      }
      this.dialogVisibleConnect = false;
    },
    saveHistoryConnect() {
      this.$prompt("请输入标签名", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          const that = this;
          let data = {
            name: value,
            connect: that.imageForm.connects,
            username: window.sessionStorage.getItem("username"),
          };
          data = JSON.stringify(data);
          this.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "api/saveallconnects/",
            //设置请求体
            data: data,
          })

            .then((response) => {
              if (response.data == "保存成功") {
                that.$alert("保存成功");
              }
            })
            .catch(function (error) {
              that.$alert("保存失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消保存",
          });
        });
    },
    goTask() {
      if (
        this.imageForm.inConnects.length <
        this.imageForm.inLables.length - 1
      ) {
        for (
          let i = this.imageForm.inConnects.length;
          i < this.imageForm.inLables.length - 1;
          i++
        ) {
          this.imageForm.inConnects.push({
            value: "-",
            key: Date.now(),
          });
        }
      }
      if (
        this.imageForm.outConnects.length <
        this.imageForm.outLables.length - 1
      ) {
        for (
          let i = this.imageForm.outConnects.length;
          i < this.imageForm.outLables.length - 1;
          i++
        ) {
          this.imageForm.outConnects.push({
            value: "-",
            key: Date.now(),
          });
        }
      }
      // console.log(this.imageForm);
      this.task.inLables = this.imageForm.inLables;
      this.task.inConnects = this.imageForm.inConnects;
      this.task.outLables = this.imageForm.outLables;
      this.task.outConnects = this.imageForm.outConnects;
      console.log(this.task);
      window.sessionStorage.setItem("task", 0);
      PubSub.publish("goBack");
      this.$router.push({
        path: "/task1",
        query: {
          task: this.task,
        },
      });
    },
  },
  mounted() {
    if (window.sessionStorage.getItem("task") == 1) {
      this.task = this.$route.query.project;
      this.project = 1;
    }
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
  padding: 12px 20px;
  color: #fff;
  background-color: #324157;
  border-color: #324157;
  font-size: 14px;
  border-radius: 4px;
}

.btu2 {
  margin-left: 10px;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.btu3 {
  margin-left: 10px;
  color: rgb(5, 5, 5);
  background-color: rgb(224, 222, 217);
  border-color: rgb(224, 222, 217);
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

.next {
  margin-top: 20px;
}

.inputStyle {
  border: rgb(33, 48, 61) solid 1px;
  height: auto;
  width: 900px;
  overflow: auto;
}

.buu {
  height: 35px;
  background-color: white;
  border: darkgray;
}

.history {
  margin: 2px;
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.activeHis {
  border: 1px rgb(86, 110, 241) solid;
  border-radius: 4px;
}

.normalHis {
  border: 1px rgb(206, 200, 200) solid;
  border-radius: 4px;
}

.lable_butten_warp {
  padding-bottom: 10px;
}
</style>
