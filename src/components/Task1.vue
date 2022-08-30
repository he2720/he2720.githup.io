<template>
  <div>
    <div>
      <el-button
        type="info"
        icon="el-icon-plus"
        @click="dialogVisible = true"
        >创建项目</el-button
      >
      <el-button
        type="info"
        v-for="(task, index) in tasks"
        :key="index+'task'"

        @click="display(index)"
        >{{ task.name }}</el-button
      ><br /><br />
      <a href="javascript:;" class="file"
        >点击上传文件
        <input :id="index" type="file" webkitdirectory @change="change" /> </a
      ><el-button type="info" plain id="upload-btn" @click="markDocument"
        >提交标注文件</el-button
      ><el-button type="info" plain id="upload-btn" @click="getMarkDocument"
        >查看已提交标注文件</el-button
      >
    </div>
    <br />
    <div v-for="(task, index) in tasks" :key="index+'tas'" v-show="Exhibition[index]">
      <el-button
        type="info" round
        plain
        icon="el-icon-edit"
        @click="editPro(index)"
        >{{ task.name }}</el-button
      >
      <el-button
        v-show="identity==1"
        type="info" round
        plain
        icon="el-icon-delete"
        @click="deletePro(index)"
        >删除项目</el-button
      >
      <el-button
      v-show="identity==1"
        type="info" round
        plain
        icon="el-icon-user"
        @click="dialogVisibleAdmin = true"
        >添加副管理员</el-button
      >
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
            人员：<el-tag v-for="(peo, index) in task" :key="index+'peo'">
              {{ peo.username }} </el-tag
            ><el-divider></el-divider>
            标注模板：
            <img
              style="width: 100px; height: 100px"
              :src="task.temple"
              :alt="task.temple"
            /><el-divider></el-divider> 标注类型：<el-tag
              v-for="(mark, index) in task.marks"
              :key="index+'mark'"
            >
              {{ mark }} </el-tag
            ><el-divider></el-divider>输入文件格式：<span
              v-for="(inLable, index) in task.inLables"
              :key="index"
            >
              <span>{{ inLable.value }}</span>
              <span
                v-for="(inConnect, index1) in task.inConnects"
                :key="index1"
                v-if="index1 == index"
                >{{ inConnect.value }}</span
              > </span
            ><br />
            输出文件格式：<span
              v-for="(outLable, index) in task.outLables"
              :key="index"
            >
              <span>{{ outLable.value }}</span>
              <span
                v-for="(outConnect, index1) in task.outConnects"
                :key="index1"
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
            <el-table :data="task.people" stripe style="width: 100%" border>
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
                    :key="index+'mar'"
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

    <el-dialog title="新建项目" :visible.sync="dialogVisible">
      创建日期<el-date-picker
        v-model="project.begin"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      >
      </el-date-picker>
      截止日期<el-date-picker
        v-model="project.end"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker
      ><br /><br />
      &nbsp&nbsp&nbsp负责人<el-input
        v-model="project.director"
        placeholder="请输入内容"
        style="width: 222px"
      ></el-input>
      图片数量<el-input-number v-model="project.number"></el-input-number
      ><br /><br />
      &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp描述<el-input
        v-model="project.describe"
        placeholder="请输入内容"
        style="width: 222px"
      ></el-input
      >项目名称<el-input
        v-model="project.name"
        placeholder="请输入内容"
        style="width: 222px"
      ></el-input
      ><br /><br />
      细节文档<el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="project.file"
        style="width: 600px"
      >
      </el-input
      ><br /><br />
      标注模板<el-input
        v-model="project.temple"
        placeholder="请输入内容"
        style="width: 222px"
      ></el-input>
      &nbsp&nbsp&nbsp&nbsp<el-button
        type="info"
        plain
        size="small"
        @click="format"
        >选择已保存文件格式</el-button
      >&nbsp<el-button type="info" plain size="small" @click="formatOwn"
        >自定义文件格式</el-button
      ><br /><br />
      输入文件格式：<span
        v-for="(inLable, index) in project.inLables"
        :key="index"
      >
        <span>{{ inLable.value }}</span>
        <span
          v-for="(inConnect, index1) in project.inConnects"
          :key="index1"
          v-if="index1 == index"
          >{{ inConnect.value }}</span
        > </span
      >&nbsp&nbsp 输出文件格式：<span
        v-for="(outLable, index) in project.outLables"
        :key="index"
      >
        <span>{{ outLable.value }}</span>
        <span
          v-for="(outConnect, index1) in project.outConnects"
          :key="index1"
          v-if="index1 == index"
          >{{ outConnect.value }}</span
        > </span
      ><br /><br />
      标注类型<br /><br />
      全局标注
      <el-button style="margin: 2px" size="small" @click="setAttri"
        >设置属性</el-button
      ><br /><br />
      局部标注
      <el-checkbox-group v-model="project.marks">
        <el-checkbox v-for="(tag,index) in tags" :label="tag" :key="index+'tagg'">{{
          tag
        }}</el-checkbox> </el-checkbox-group
      ><br />
      人员<el-button
        icon="el-icon-plus"
        size="mini"
        type="primary"
        plain
        @click="addPeo"
      ></el-button
      ><br />
      <div v-for="(peo, index) in project.people" :key="index+'peoo'">
        <el-button
          icon="el-icon-delete"
          size="mini"
          type="primary"
          plain
          @click="deletePeo(index)"
        ></el-button>
        姓名<el-input
          size="small"
          v-model="peo.username"
          placeholder="请输入内容"
          style="width: 100px"
        ></el-input>
        任务量<el-input
          size="small"
          v-model="peo.number"
          placeholder="请输入内容"
          style="width: 100px"
        ></el-input
        >权限<el-input
          size="small"
          v-model="peo.jurisdiction"
          placeholder="请输入内容"
          style="width: 100px"
        ></el-input
        ><br />
        标注类型<el-checkbox-group v-model="peo.marks" size="mini">
          <el-checkbox-button
            v-for="(tag,index) in project.marks"
            :label="tag"
            :key="index+'marks'"
            >{{ tag }}</el-checkbox-button
          > </el-checkbox-group
        ><br />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="send">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑项目" :visible.sync="dialogVisible1">
      创建日期<el-date-picker
        v-model="editTask.begin"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      >
      </el-date-picker>
      截止日期<el-date-picker
        v-model="editTask.end"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker
      ><br /><br />
      &nbsp&nbsp&nbsp负责人<el-input
        v-model="editTask.director"
        placeholder="请输入内容"
        style="width: 222px"
      ></el-input>
      图片数量<el-input-number v-model="editTask.number"></el-input-number
      ><br /><br />
      &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp描述<el-input
        v-model="editTask.describe"
        placeholder="请输入内容"
        style="width: 222px"
      ></el-input
      >项目名称<el-input
        v-model="editTask.name"
        placeholder="请输入内容"
        :disabled="true"
        style="width: 222px"
      ></el-input
      ><br /><br />
      细节文档<el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="editTask.file"
        style="width: 600px"
      >
      </el-input
      ><br /><br />
      标注模板<el-input
        v-model="editTask.temple"
        placeholder="请输入内容"
        style="width: 222px"
      ></el-input
      ><br /><br />
      输入文件格式：<span
        v-for="(inLable, index) in editTask.inLables"
        :key="index"
      >
        <span>{{ inLable.value }}</span>
        <span
          v-for="(inConnect, index1) in editTask.inConnects"
          :key="index1"
          v-if="index1 == index"
          >{{ inConnect.value }}</span
        > </span
      >&nbsp&nbsp 输出文件格式：<span
        v-for="(outLable, index) in editTask.outLables"
        :key="index"
      >
        <span>{{ outLable.value }}</span>
        <span
          v-for="(outConnect, index1) in editTask.outConnects"
          :key="index1"
          v-if="index1 == index"
          >{{ outConnect.value }}</span
        >
      </span>
      &nbsp&nbsp<el-button type="info" plain size="small" @click="formatEdit"
        >编辑</el-button
      >
      <br /><br />
      标注类型<br /><br />
      全局标注
      <el-button style="margin: 2px" size="small" @click="setAttri"
        >设置属性</el-button
      ><br /><br />
      局部标注<el-checkbox-group v-model="editTask.marks">
        <el-checkbox v-for="(tag,index) in tags" :label="tag" :key="index+'tagss'">{{
          tag
        }}</el-checkbox> </el-checkbox-group
      ><br />
      人员<el-button
        icon="el-icon-plus"
        size="mini"
        type="primary"
        plain
        @click="addPeoE"
      ></el-button>
      <div v-for="(peo, index) in editTask.person" :key="index+'peoss'">
        <el-button
          icon="el-icon-delete"
          size="mini"
          type="primary"
          plain
          @click="deletePeoE(index)"
        ></el-button>
        姓名<el-input
          size="small"
          v-model="peo.username"
          placeholder="请输入内容"
          style="width: 100px"
        ></el-input>
        任务量<el-input
          size="small"
          v-model="peo.number"
          placeholder="请输入内容"
          style="width: 100px"
        ></el-input
        >权限<el-input
          size="small"
          v-model="peo.jurisdiction"
          placeholder="请输入内容"
          style="width: 100px"
        ></el-input
        ><br />
        标注类型<el-checkbox-group v-model="peo.marks" size="mini">
          <el-checkbox-button
            v-for="(tag,index) in editTask.marks"
            :label="tag"
            :key="index+'tagmark'"
            >{{ tag }}</el-checkbox-button
          >
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible1">取 消</el-button>
        <el-button type="primary" @click="editPro1">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="已标注数据" :visible.sync="dialogVisibleImage">
      <img
        :src="markedImg"
        alt=""
        style="width: 85%; height: 85%"
        id="fffff"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="feedback">反馈</el-button>
        <el-button type="primary" @click="reMark">重新标注</el-button>
        <el-button type="primary" @click="nextImage">下一张</el-button>
      </span>
    </el-dialog>

    <el-dialog title="已上传图片" :visible.sync="dialogVisibleDocument">
      <img
        :src="markedDocuments1"
        alt=""
        style="width: 85%; height: 85%"
        id="ffff"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteDocument">删除</el-button>
        <el-button type="primary" @click="nextDocument">下一张</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加管理员" :visible.sync="dialogVisibleAdmin">
      <el-checkbox-group v-model="eputyAdministrator">
        <el-checkbox

          v-for="(peo,index) in tasks[activeTask]"
          :label="peo.username"
          :key="index+'admin'"
        ></el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdmin = false">取 消</el-button>
        <el-button type="primary" @click="addAdmin"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="创建查看文件格式"
      :visible.sync="dialogVisibleFormat"
      width="30%"
    >
      <h3>输入文件格式</h3>
      <div
        class="history"
        v-for="(data, index) in historyData.inData"
        :key="index + 'i'"
        :class="[histroyIndexIn == index + 1 ? 'activeHis' : 'normalHis']"
      >
        <el-button>
          <span v-for="(item, index) in data.label" :key="index+'inn'"
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
          <span v-for="(item, index) in data.label" :key="index+'outt'"
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
        <el-button @click="dialogVisibleFormat = false">关闭</el-button>
        <el-button type="primary" @click="chooseFormat">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑查看文件格式"
      :visible.sync="dialogVisibleFormat1"
      width="30%"
    >
      <h3>输入文件格式</h3>
      <div
        class="history"
        v-for="(data, index) in historyData.inData"
        :key="index + 'i'"
        :class="[histroyIndexIn == index + 1 ? 'activeHis' : 'normalHis']"
      >
        <el-button>
          <span v-for="(item, index) in data.label" :key="index+'innnn'"
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
          <span v-for="(item, index) in data.label" :key="index+'outtttt'"
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
        <el-button @click="dialogVisibleFormat1 = false">关闭</el-button>
        <el-button type="primary" @click="chooseFormat1">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置属性对话框 -->
    <el-dialog
      v-model="formAttris"
      title="设置属性"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <div
          v-for="(item, formi) in formAttris"
          :key="formi + 'b'"
          @click="activeForm(item)"
        >
          <el-form-item
            v-show="item != '__ob__'"
            :label="item"
            label-width="140px"
          >
            <el-input
              readonly="readonly"
              v-model="form[item]"
              autocomplete="off"
              >form[item]</el-input
            >
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAttri">添 加</el-button>
        <el-button @click="delAttri0">删 除</el-button>
        <el-button @click="chaAttri0">编 辑</el-button>
        <el-button @click="SaveAttri0">保 存</el-button>
        <el-button @click="SelAttri0">选 择</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 保存属性集 -->
    <el-dialog title="保存当前属性集" :visible.sync="dialogSaveFormVisible">
      <el-form :model="attriss">
        <el-form-item label="保存属性集名称" label-width="140px">
          <el-input v-model="attrissName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSaveFormVisible = false">关 闭</el-button>
        <el-button type="primary" @click="SaveAttri">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择属性集 -->
    <el-dialog title="选择已有属性集" :visible.sync="dialogSelFormVisible">
      <el-form :model="everyAttrissName">
        <div
          v-for="(item, index) in everyAttrissName"
          :key="index+'aaaaa'"
          @click="activeAttriss(item)"
        >
          <el-form-item label="已有属性集名称" label-width="140px">
            <el-input
              readonly="readonly"
              v-model="everyAttrissName[index]"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSelFormVisible = false">关 闭</el-button>
        <el-button type="primary" @click="SelAttri1">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 确定更换属性集对话框 -->
    <el-dialog title="更换属性集" :visible.sync="dialogChangeFormVisible">
      将目前属性集更换为
      <input
        style="border: 0px; background-color: transparent"
        readonly="readonly"
        v-model="activeAttrissName"
        autocomplete="off"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="SelAttri">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除属性对话框 -->
    <el-dialog title="删除属性" :visible.sync="dialogDelFormVisible">
      <input
        style="border: 0px; background-color: transparent"
        readonly="readonly"
        v-model="formid"
        autocomplete="off"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="delAttri">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加属性对话框 -->
    <el-dialog title="添加属性" :visible.sync="dialogAttriVisible">
      <el-form :model="attri">
        <el-form-item label="属性名称" label-width="140px">
          <el-input v-model="attri.name" autocomplete="off"></el-input>
        </el-form-item>
        <div v-for="(ar, ord) in arrys" :key="ord+'ooooo'" @click="activeAttri(ord)">
          <el-form-item label="属性值" label-width="140px">
            <el-input v-model="attri.opts[ord]" autocomplete="off"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAttri2">新增属性值</el-button>
        <el-button @click="delAttri2">删除该值</el-button>
        <el-button @click="dialogAttriVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttri1">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更改属性对话框 -->
    <el-dialog title="更改属性" :visible.sync="dialogChangeAttriVisible">
      <el-form :model="item">
        <el-form-item label="属性名称" label-width="140px">
          <el-input
            v-model="item.name"
            autocomplete="off"
            readonly="readonly"
          ></el-input>
        </el-form-item>
        <div v-for="(opt, index) in item.opts" :key="index+'index'">
          <el-form-item label="属性值" label-width="140px">
            <el-input
              style="width: 450px"
              v-model="item.opts[index]"
              autocomplete="off"
            ></el-input>
            <el-button
              style="margin-left: 20px"
              v-show="index > 0"
              @click="item.opts.splice(index, 1)"
              >删除</el-button
            >
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="item.opts.push('')">新增属性值</el-button>
        <el-button @click="dialogChangeAttriVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeAttri1">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除属性值对话框-->
    <el-dialog title="删除属性值" :visible.sync="dialogDelFormOptVisible">
      <input
        style="border: 0px; background-color: transparent"
        readonly="readonly"
        v-model="attri.opts[order]"
        autocomplete="off"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelFormOptVisible = false">取 消</el-button>
        <el-button type="primary" @click="delAttri1">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PubSub from "pubsub-js";
export default {
  data() {
    return {
      identity:0,
      Exhibition: [],
      tags: ["圆", "矩形", "多边形", "线段", "多线段", "点"],
      project: {
        name: "",
        rate: 0,
        begin: "",
        end: "",
        director: "",
        number: 0,
        describe: "",
        inLables: [],
        outLables: [],
        inConnects: [],
        outConnects: [],
        people: [
          {
            username: "",
            number: "",
            complete: "0",
            rate: 0,
            marks: ["圆"],
            jurisdiction: "",
          },
        ],
        file: "",
        temple: "",
        marks: ["圆", "矩形"],
        attris: [
          {
            name: "",
            opts: [],
            // opt2:"",
            // opt3:"",
          },
        ], //添加属性的属性名和属性选项的集合
      },
      tasks: [{name: "测试",
        rate: 0,
        begin: "",
        end: "",
        director: "",
        number: 0,
        describe: "",
        inLables: [],
        outLables: [],
        inConnects: [],
        outConnects: [],
        people: [
          {
            username: "aaa",
            number: "",
            complete: "0",
            rate: 0,
            marks: ["圆"],
            jurisdiction: "",
          },
        ],
        file: "",
        temple: "",
        marks: ["圆", "矩形"],
        attris: [
          {
            name: "",
            opts: [],
            // opt2:"",
            // opt3:"",
          },
        ],}],
      activeTask: 0,
      files: "",
      dialogVisible: false,
      dialogVisible1: false,
      editTask: {},
      order: -1, //记录当前选中的属性值
      formid: "", //记录当前选中的属性
      item: {}, //临时存放更改属性
      dialogFormVisible: false,
      dialogVisibleFormat: false,
      dialogVisibleFormat1: false,
      dialogVisibleImage: false,
      dialogVisibleAdmin: false,
      dialogVisibleDocument: false,
      historyData: {
        inData: [],
        outData: [],
      },
      histroyIndexIn: 0,
      histroyIndexOut: 0,
      dialogAttriVisible: false,
      dialogDelFormVisible: false, //删除属性提示框
      dialogChangeAttriVisible: false, //更改属性对话框
      dialogDelFormOptVisible: false, //删除属性值提示框
      dialogSaveFormVisible: false, //保存当前属性集提示框
      dialogSelFormVisible: false, //选择属性集提示框
      dialogChangeFormVisible: false, //更换属性集提示框
      activeAttrissName: "", //当前选中的属性集的名称
      index: 0,
      attrissName: "",
      attriss: [], //创建的属性集的集合
      everyAttrissName: [], //属性集的名称
      attrii: {
        name: "",
        opts: [],
      }, //更新
      attri: {
        name: "",
        opts: [],
      }, //每次新增一个属性，该属性存放的位置
      form: {}, //图片现有的属性以及属性值
      formAttris: [], //form,即现有属性的属性名的集合
      arrysi: [0, 1], //更新
      arrys: [0, 1], //记录添加的属性有多少属性值
      markedImgs: [
        "https://img2.baidu.com/it/u=1346170842,3497350237&fm=253&fmt=auto&app=120&f=JPEG?w=753&h=500",
        "https://img0.baidu.com/it/u=2463602844,2410523677&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333",
      ],
      markedImg: "",
      markedDocuments:[],//已上传的标注文件
      markedDocuments1:'',
      number: 0, //已标注图片在数组的位置
      number1: 0, //已上传图片在数组的位置
      annotator: "", //当前标注员
      projectName: "", //当前项目
      eputyAdministrator: [], //副官理员
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
    send() {
      let user = window.sessionStorage.getItem("username");
      let data1 = [];
      data1.push(this.project);
      let data = JSON.stringify({
        username: user,
        data: JSON.stringify(data1),
      });
      console.log(data);
      let that = this;
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/saveproject/",
        //设置请求体
        data: data,
      })
        .then((response) => {
          console.log("——————————————————————", response.data);
          if (response.data == "保存成功") {
            that.$message({
              message: "创建成功",
              type: "success",
            });
            let data = window.sessionStorage.getItem("username");
            this.$axios({
              //请求类型
              method: "POST",
              //URL
              url: "api/getproject/",
              //设置请求体
              data: data,
            }).then((response) => {
              console.log(JSON.parse(response.data.data));
              that.tasks = JSON.parse(response.data.data);
            });
            that.dialogVisible = false;
          }
        })
        .catch((error) => {
          that.$message.error("创建失败");
        });
    },
    addPeo() {
      this.project.people.push({
        username: "",
        number: "",
        complete: "0",
        rate: 0,
        marks: ["圆"],
        jurisdiction: "",
      });
    },
    addPeoE() {
      this.editTask.people.push({
        username: "",
        number: "",
        complete: "0",
        rate: 0,
        marks: ["圆"],
        jurisdiction: "",
      });
    },
    deletePeo(index) {
      this.project.person.splice(index, 1);
    },
    deletePeoE(index) {
      this.editTask.person.splice(index, 1);
    },
    closeDialogVisible1() {
      this.dialogVisible1 = false;
      //改完的属性赋给编辑项目的属性，并清空当前项目属性
      this.editTask.attris = this.deepClone(this.project.attris);
      this.project.attris = {};
      this.form = {};
      this.formAttris = [];
    },
    editPro(index) {
      this.dialogVisible1 = true;
      this.editTask = this.tasks[index];
      this.project.attris = this.deepClone(this.tasks[index].attris);
      console.log("editPro..........", this.project.attris);
      console.log("this.project.attris[7]..........", this.project.attris[7]);
      //更改form
      this.form = {};
      for (let j = 0; j < this.project.attris.length; j++) {
        if (this.project.attris[j].name != "") {
          this.$set(
            this.form,
            this.project.attris[j].name,
            this.project.attris[j].opts[0]
          );
        }
      }
      console.log("this.form", this.form);
      //将图片的属性的属性名给formAttris，在设置属性的对话框中显示
      this.formAttris = Object.getOwnPropertyNames(this.form).sort();
      console.log("editPro..........", this.formAttris);
      console.log(this.editTask);
    },
    editPro1(index) {
      this.editTask.attris = this.deepClone(this.project.attris);
      this.project.attris = {};
      this.form = {};
      this.formAttris = [];
      let user = window.sessionStorage.getItem("username");
      let data1 = [];
      data1.push(this.editTask);
      let data = JSON.stringify({
        username: user,
        data: JSON.stringify(data1),
      });
      console.log(data);
      let that = this;
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/editproject/",
        //设置请求体
        data: data,
      })
        .then((response) => {
          console.log(response.data);
          if (response.data == "修改成功") {
            that.$message({
              message: "修改成功",
              type: "success",
            });
            let data = window.sessionStorage.getItem("username");
            that
              .$axios({
                //请求类型
                method: "POST",
                //URL
                url: "api/getproject/",
                //设置请求体
                data: data,
              })
              .then((response) => {
                console.log(JSON.parse(response.data.data));
                that.tasks = JSON.parse(response.data.data);
                for (let i = 0; i < that.tasks.length; i++) {
                  that.tasks[i].attris = JSON.parse(
                    that.tasks[i].attris.replace(/'/g, '"')
                  );
                }
              });
            that.dialogVisible1 = false;
          }
        })
        .catch((error) => {
          that.$message.error("创建失败");
        });
    },
    deletePro(index) {
      let that = this;
      this.$confirm("此操作将永久删除该项目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = JSON.stringify(this.tasks[index]);
          console.log(data);
          this.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "api/deleteproject/",
            //设置请求体
            data: data,
          }).then((response) => {
            if (response.data == "删除成功") {
              that.tasks.splice(index, 1);
              that.$message({
                type: "success",
                message: "删除成功!",
              });
            } else {
              that.$message.error("删除失败!");
            }
          });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //属性名给formAttris
    setAttri() {
      this.dialogFormVisible = true;
      this.formAttris = Object.getOwnPropertyNames(this.form).sort();
    },
    //当前选中的属性
    activeForm(item) {
      this.formid = item;
    },
    //弹出删除属性提示框
    delAttri0() {
      if (this.formid == "") {
        this.$message({
          message: "请正确选择要删除的属性",
          type: "error",
        });
      } else {
        this.dialogDelFormVisible = true;
      }
    },
    //删除当前属性
    delAttri() {
      let i, j, ki, kj;
      let iflag = false,
        jflag = false;
      console.log("this.formid = " + this.formid);
      //判斷属性集合中是否存在当前属性
      for (i = 0; i < this.project.attris.length; i++) {
        if (this.project.attris[i].name == this.formid) {
          ki = i;
          iflag = true;
        }
      }
      //判斷属性表是否存在当前属性
      for (j = 0; j < this.formAttris.length; j++) {
        if (this.formAttris[j] == this.formid) {
          j;
          kj = j;
          jflag = true;
        }
      }
      //删除图片属性集中的当前属性，要删除三个地方，attris，formAttris，form
      if (jflag && iflag) {
        this.project.attris.splice(ki, 1);
        this.formAttris.splice(kj, 1);
        delete this.form[this.formid];
        this.$message({
          message: "属性删除成功",
          type: "success",
        });
      } else {
        this.$message({
          message: "请正确选择要删除的属性",
          type: "error",
        });
      }
      this.dialogDelFormVisible = false;
      this.formid = "";
    },
    //当前选中的属性值
    activeAttri(ord) {
      this.order = ord;
    },
    //弹出删除属性值对话框
    delAttri2() {
      if (this.order == -1) {
        this.$message({
          message: "请正确选择要删除的属性值",
          type: "error",
        });
      } else if (this.order == 0) {
        this.$message({
          message: "要保留至少一个属性值",
          type: "error",
        });
      } else {
        this.dialogDelFormOptVisible = true;
      }
    },
    //删除当前属性值
    delAttri1() {
      if (this.order == 0) {
        this.$message({
          message: "要保留至少一个属性值",
          type: "error",
        });
      } else if (this.order == -1) {
        this.$message({
          message: "请正确选择要删除的属性值",
          type: "error",
        });
      } else {
        this.arrys.splice(this.order, 1);
        this.attri.opts.splice(this.order, 1);
        this.$message({
          message: "属性值删除成功",
          type: "success",
        });
      }
      this.dialogDelFormOptVisible = false;
      this.order = -1;
    },
    //添加后的属性点击后，弹出更改属性值对话框
    chaAttri0() {
      //框框，类似于添加属性，但是里面有内容
      //先选出要编辑的属性，
      //判斷属性集合中是否存在当前属性
      let flag = true;
      console.log("要更改的是this.formid:" + this.formid);
      if (this.formid == "") {
        this.$message({
          message: "请正确选择要更改的属性",
          type: "error",
        });
      } else {
        for (let i = 0; i < this.project.attris.length; i++) {
          if (this.project.attris[i].name == this.formid) {
            this.item = this.deepClone(this.project.attris[i]);
            console.log("item:");
            console.log(this.item);
            this.dialogChangeAttriVisible = true;
            flag = false;
            this.formid = "";
            break;
          }
        }
        if (flag) {
          this.$message({
            message: "请正确选择要更改的属性",
            type: "error",
          });
        }
      }
    },
    //保存修改过的属性
    changeAttri1() {
      //将project.attris[]替换为更改过的item
      for (let i = 0; i < this.project.attris.length; i++) {
        if (this.project.attris[i].name == this.item.name) {
          this.project.attris[i] = this.deepClone(this.item);
          console.log("this.project.attris:");
          console.log(this.project.attris);
          this.$message({
            message: "属性更改成功",
            type: "success",
          });
          this.dialogChangeAttriVisible = false;
          break;
        }
      }
    },
    //添加属性值的框框
    addAttri2() {
      this.arrys.push(0);
    },
    //添加属性
    addAttri1() {
      console.log("addAttri1.........");
      let flag = true;
      for (let i = 0; i < this.project.attris.length; i++) {
        // if (this.project.attris[i].name == '') {
        //   this.$message({
        //   message: "属性名不可为空",
        //   type: "error",
        // });
        //   flag = false;
        // }else
        if (this.project.attris[i].name == this.attri.name) {
          this.$message({
            message: "属性名不可重复或为空",
            type: "error",
          });
          flag = false;
        }
      }
      if (flag) {
        this.project.attris.push({
          name: this.attri.name,
          opts: [],
        });
        let n = this.project.attris.length;
        console.log("现有属性集" + this.project.attris);
        for (let m = 0; m < this.attri.opts.length; m++) {
          // console.log(this.attri.opts.length);
          // console.log(this.attri.opts);
          if (this.attri.opts[m] != " ") {
            // console.log(this.attri.opts)
            this.project.attris[n - 1].opts.push(this.attri.opts[m]);
          }
        }
        // 将第一个属性值作为所添加的属性的选择
        this.$set(this.form, this.attri.name, this.attri.opts[0]);
        //将图片的属性的属性名给formAttris，在设置属性的对话框中显示
        this.formAttris = Object.getOwnPropertyNames(this.form).sort();
        this.attri = this.attrii; //清空綁定值
        this.arrys = this.arrysi;
        this.dialogAttriVisible = false;
        // 查看是否清空
        // console.log("this.arrys="+this.arrys);
        // console.log("this.arrysi="+this.arrysi);
        // console.log("this.attri="+this.attri);
      }
    },
    //弹出添加属性对话框
    addAttri() {
      this.attri = { name: "", opts: [] }; //清空綁定值
      this.arrys = [0, 1];
      this.dialogAttriVisible = true;
    },
    //弹出保存属性集对话框
    SaveAttri0() {
      this.dialogSaveFormVisible = true;
    },
    //深克隆属性集
    deepClone(o) {
      let result;
      if (Array.isArray(o)) {
        result = [];
        for (let i = 0; i < o.length; i++) {
          result.push(this.deepClone(o[i]));
        }
      } else if (typeof o == "object") {
        result = {};
        for (let k in o) {
          result[k] = this.deepClone(o[k]);
        }
      } else {
        result = o;
      }
      return result;
    },
    //保存属性集
    SaveAttri() {
      let item;
      if (this.attrissName == "") {
        this.$message({
          message: "属性集名不可为空",
          type: "error",
        });
      } else {
        let iflag = 1;
        item = { name: "", attris: [] };
        for (let i = 0; i < this.attriss.length; i++) {
          if (this.attrissName == this.attriss[i].name) {
            iflag = 0;
            break;
          }
        }
        if (iflag == 0) {
          this.$message({
            message: "属性集名不可重复",
            type: "error",
          });
        } else {
          item.name = this.attrissName;
          item.attris = this.deepClone(this.project.attris);
          const that = this;
          let data = JSON.stringify(that.attriss);
          let whole = JSON.stringify({
            username: window.sessionStorage.getItem("username"),
            data: item,
          });
          this.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "api/saveUserProperty/",
            //设置请求体
            data: whole,
          })
            .then((response) => {
              console.log(response.data);
              if (response.data == "保存成功") {
                that.$alert("保存成功");
                this.attriss.push(item);
              }
            })
            .catch(function (error) {
              that.$alert("保存失败");
            });
          this.attrissName = "";
          this.dialogSaveFormVisible = false;
          item = { name: "", attris: [] };
        }
      }
    },
    //弹出选择属性集对话框
    SelAttri0() {
      this.attriss = [];
      let that = this;
      let data = JSON.stringify(window.sessionStorage.getItem("username"));
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/getUserProperty/",
        //设置请求体
        data: data,
      })
        .then((response) => {
          this.dialogSelFormVisible = true;
          // let data2 = response.data.replace(/'/g, '"');
          let data1 = response.data;
          let data3 = [];
          for (let obj in data1) {
            data3.push(JSON.parse(data1[obj].replace(/'/g, '"')));
          }
          console.log("data3:", data3);
          console.log("-------------------", response.data);
          // that.attriss = JSON.parse(data1);
          console.log("+++++++++++++++++++++++++++++++++++++++++" + data1["0"]);
          console.log("data1[1]" + data1[1]);
          that.attriss = data3;
          that.everyAttrissName = [];
          console.log("当前属性集合为：" + that.attriss);
          console.log(that.attriss);
          console.log(that.attriss.length);
          console.log(that.attriss[0]);
          console.log(that.attriss[0][7]);
          for (let i = 0; i < that.attriss.length; i++) {
            if (that.attriss[i].name != "" || that.attriss[i].name != null) {
              console.log(
                "attriss的第" + i + "个属性集合的名字为" + that.attriss[i].name
              );
              that.everyAttrissName.push(that.attriss[i].name);
            }
          }
          console.log("当前属性集合名称为：" + that.everyAttrissName);
        })
        .catch(function (error) {
          that.$alert(error);
          that.$alert("您还未保存过属性集");
          that.dialogSelFormVisible = false;
        });
    },
    //弹出确定更换属性集对话框
    SelAttri1() {
      if (this.activeAttrissName == "") {
        this.$message({
          message: "请正确选择要更换的属性集",
          type: "error",
        });
      } else {
        this.dialogChangeFormVisible = true;
      }
    },
    //当前选中的属性集
    activeAttriss(item) {
      this.activeAttrissName = item;
    },
    //选择属性集
    SelAttri() {
      // console.log(this.activeAttrissName);
      // console.log("当前属性集合attris为：");
      // console.log(this.project.attris);

      if (this.activeAttrissName == "") {
        this.$message({
          message: "请正确选择要更换的属性集",
          type: "error",
        });
      } else {
        for (let i = 0; i < this.attriss.length; i++) {
          if (this.attriss[i].name == this.activeAttrissName) {
            // console.log("要更换的属性集合attriss[i].attris为：");
            // console.log(this.attriss[i].attris);
            // this.project.attris = this.attriss[i].attris; //后面要改成深克隆
            this.project.attris = this.deepClone(this.attriss[i].attris);
            //更改form
            this.form = {};
            for (let j = 0; j < this.project.attris.length; j++) {
              if (this.project.attris[j].name != "") {
                this.$set(
                  this.form,
                  this.project.attris[j].name,
                  this.project.attris[j].opts[0]
                );
              }
            }
            console.log(this.form);
            //将图片的属性的属性名给formAttris，在设置属性的对话框中显示
            this.formAttris = Object.getOwnPropertyNames(this.form).sort();
            this.$message({
              message: "属性集更换成功",
              type: "success",
            });
            this.dialogChangeFormVisible = false;
            this.dialogSelFormVisible = false;
            this.activeAttrissName = "";
          }
        }
      }
    },
    formatOwn() {
      // console.log(this.project);
      const project = this.project;
      // this.$emit('toFormat',project)
      PubSub.publish("toFormat", project);
    },
    format() {
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
          if (data1 != "none") {
            that.historyData = JSON.parse(data1);
          }
          that.dialogVisibleFormat = true;
        })
        .catch(function (error) {
          that.$alert("获取失败");
        });
    },
    chooseIn(index) {
      if (this.histroyIndexIn == index + 1) {
        this.histroyIndexIn = 0;
      } else {
        this.histroyIndexIn = index + 1;
      }
    },
    chooseOut(index) {
      if (this.histroyIndexOut == index + 1) {
        this.histroyIndexOut = 0;
      } else {
        this.histroyIndexOut = index + 1;
      }
    },
    chooseFormat() {
      if (this.histroyIndexIn != 0) {
        this.historyIn();
      }
      if (this.histroyIndexOut != 0) {
        this.historyOut();
      }
      this.dialogVisibleFormat = false;
      console.log(this.project);
    },
    historyIn() {
      this.project.inLables = [];
      this.project.inConnects = [];
      for (
        let i = 0;
        i < this.historyData.inData[this.histroyIndexIn - 1].label.length;
        i++
      ) {
        this.project.inLables.push(
          this.historyData.inData[this.histroyIndexIn - 1].label[i]
        );
        if (
          i <
          this.historyData.inData[this.histroyIndexIn - 1].label.length - 1
        ) {
          this.project.inConnects.push(
            this.historyData.inData[this.histroyIndexIn - 1].connect[i]
          );
        }
      }
    },
    historyOut() {
      this.project.outLables = [];
      this.project.outConnects = [];
      for (
        let i = 0;
        i < this.historyData.outData[this.histroyIndexOut - 1].label.length;
        i++
      ) {
        this.project.outLables.push(
          this.historyData.outData[this.histroyIndexOut - 1].label[i]
        );
        if (
          i <
          this.historyData.outData[this.histroyIndexOut - 1].label.length - 1
        ) {
          this.project.outConnects.push(
            this.historyData.outData[this.histroyIndexOut - 1].connect[i]
          );
        }
      }
    },
    formatEdit() {
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
          if (data1 != "none") {
            that.historyData = JSON.parse(data1);
          }
          that.dialogVisibleFormat1 = true;
        })
        .catch(function (error) {
          that.$alert("获取失败");
        });
    },
    chooseFormat1() {
      if (this.histroyIndexIn != 0) {
        this.historyIn1();
      }
      if (this.histroyIndexOut != 0) {
        this.historyOut1();
      }
      this.dialogVisibleFormat1 = false;
      console.log(this.editTask);
    },
    historyIn1() {
      this.editTask.inLables = [];
      this.editTask.inConnects = [];
      for (
        let i = 0;
        i < this.historyData.inData[this.histroyIndexIn - 1].label.length;
        i++
      ) {
        this.editTask.inLables.push(
          this.historyData.inData[this.histroyIndexIn - 1].label[i]
        );
        if (
          i <
          this.historyData.inData[this.histroyIndexIn - 1].label.length - 1
        ) {
          this.editTask.inConnects.push(
            this.historyData.inData[this.histroyIndexIn - 1].connect[i]
          );
        }
      }
    },
    historyOut1() {
      this.editTask.outLables = [];
      this.editTask.outConnects = [];
      for (
        let i = 0;
        i < this.historyData.outData[this.histroyIndexOut - 1].label.length;
        i++
      ) {
        this.editTask.outLables.push(
          this.historyData.outData[this.histroyIndexOut - 1].label[i]
        );
        if (
          i <
          this.historyData.outData[this.histroyIndexOut - 1].label.length - 1
        ) {
          this.editTask.outConnects.push(
            this.historyData.outData[this.histroyIndexOut - 1].connect[i]
          );
        }
      }
    },
    change() {
      let file = document.querySelector("input[type=file]");
      console.log(file.files);
      this.files = file.files;
      this.$alert("上传成功");
    },
    markDocument() {
      let that = this;
      let name = this.tasks[this.activeTask].name;
      var fd = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        fd.append("file", this.files[i]);
      }
      fd.append("name", name);
      console.log(fd.get("name"));
      // console.log(this.files)
      // console.log(fd);
      console.log(fd.get("file"));
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "api/savefiles/");
      xhr.send(fd);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            if (xhr.response == "保存成功") {
              that.$message("提交成功");
            } else {
              that.$message.error("提交失败");
            }
          }
        }
      };
    },
    getMarkDocument(){
      let name = this.tasks[this.activeTask].name;
      this.$axios({
        method: "POST",
        url: "api/getallprojectpic/ ",
        data: name,
      }).then((response) => {
        console.log(response.data);
        this.markedDocuments = response.data;
        this.markedDocument = this.markedDocuments[0];
        this.dialogVisibleDocument = true;
      });
    },
    nextDocument(){
      if (this.number1 == this.markedDocuments.length - 1) {
        this.$message({
          message: "当前已是最后一张",
          type: "warning",
        });
        return;
      }
      this.number1++;
      this.markedDocument = this.markedDocuments[this.number1];
      this.$forceUpdate();
      console.log(this.markedDocument)
    },
    deleteDocument(){
      const pname = this.tasks[this.activeTask].name;
      const name=this.markedDocuments[this.number1];
      let data={pname,name};
      data=JSON.stringify(data);
      console.log(data)
      this.$axios({
        method: "POST",
        url: "api/deleteprojectpic/",
        data: data,
      }).then((response) => {
        console.log(response.data);
       if(response.data=='删除成功'){
         this.$message.success("删除成功");
       }else{
         this.$message.error("删除失败！");
       }
      });
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
    feedback() {
      this.$prompt("请输入反馈意见", "反馈", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          let data = {
            name: this.projectName, //项目的名称
            username: this.annotator, //标注员名字
            index: this.markedImg.split('?')[0], //当前图片名字
            feedback: value, //反馈意见
          };
          data = JSON.stringify(data);
          console.log(data);
          this.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "api/savefeedback/",
            //设置请求体
            data: data,
          }).then((response) => {
            if (response.data == "收到了，小老弟") {
              this.$message({
                type: "success",
                message: "提交成功",
              });
            } else {
              this.$message({
                message: "提交失败",
                type: "warning",
              });
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
    reMark() {
      this.$router.push({
        path: "/mark3",
        query: {
          image: this.markedImg,
          name: this.projectName, //项目的名称
          username: this.annotator, //标注员名字
        },
      });
    },
    addAdmin() {
      let name=this.tasks[this.activeTask].name;//项目名称
      let eputyAdministrator=this.eputyAdministrator;//副官理员（数组）
      let data={name,eputyAdministrator};
      data=JSON.stringify(data);
      this.$axios({
            //请求类型
            method: "POST",
            //URL
            url: "api/savedeputyman/",
            //设置请求体
            data: data,
          }).then((response) => {
            if (response.data == "收到了，小老弟") {
              this.$message({
                type: "success",
                message: "提交成功",
              });
              this.dialogVisibleAdmin=false;
            } else {
              this.$message({
                message: "提交失败",
                type: "warning",
              });
            }
          })
    },
  },
  mounted() {
    this.identity = window.sessionStorage.getItem("identity");
    let that = this;
    let data = window.sessionStorage.getItem("username");
    let url="api/getproject/";
    if(this.identity==-1){
      url="api/deputygetproject/"
    }
    this.$axios({
      //请求类型
      method: "POST",
      //URL
      url: url,
      //设置请求体
      data: data,
    }).then((response) => {
      that.tasks = JSON.parse(response.data.data);
      console.log("--------------",that.tasks);
      for (let i = 0; i < that.tasks.length; i++) {
        that.tasks[i].attris = JSON.parse(
          that.tasks[i].attris.replace(/'/g, '"')
        );
        that.Exhibition.push(false);
      }
    });
    if (this.$route.query.task) {
      this.project = this.$route.query.task;
      this.dialogVisible = true;
    }
  },
};
</script>

<style scoped>
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

.file {
  position: relative;
  display: inline-block;
  background: #f2f3f5;
  border: 1px solid #d5d6d6;
  right: 10px;
  top: 13px;
  border-radius: 4px;
  padding: 8px 12px;
  overflow: hidden;
  font-size: small;
  color: #747679;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
  margin: 0px 10px -1px;
}

.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}

.file:hover {
  background: #959697;
  border-color: #424242;
  color: #faf6f6;
  text-decoration: none;
}
</style>
