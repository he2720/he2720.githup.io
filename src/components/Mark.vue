<template>
  <div>
    <div class="button-wrap">
      <el-alert
        title="在绘制模式时，双击图形可进行选中编辑；单击未选中图形区域或切换模式会取消选中"
        type="info"
        show-icon
      >
      </el-alert>
      <el-button type="primary" size="small" plain @click="setMode('PAN')"
        ><img class="logo" src="../assets/hand-index-thumb.svg" alt="" />
        平移</el-button
      >
      <el-button type="primary" size="small" plain @click="setMode('POINT')"
        ><img class="logo" src="../assets/disc.svg" alt="" />点</el-button
      >
      <el-button type="primary" size="small" plain @click="setMode('LINE')"
        ><img class="logo" src="../assets/slash-lg.svg" alt="" />线段</el-button
      >
      <el-button type="primary" size="small" plain @click="setMode('POLYLINE')"
        ><img
          class="logo"
          src="../assets/chevron-compact-left.svg"
          alt=""
        />多线段</el-button
      >
      <el-button type="primary" size="small" plain @click="setMode('RECT')"
        ><img class="logo" src="../assets/square.svg" alt="" /> 矩形</el-button
      >
      <el-button type="primary" size="small" plain @click="setMode('POLYGON')"
        ><img class="logo" src="../assets/hexagon.svg" alt="" />
        多边形</el-button
      >
      <el-button type="primary" size="small" plain @click="setMode('CIRCLE')"
        ><img class="logo" src="../assets/circle.svg" alt="" /> 圆</el-button
      >
      <!-- <el-button type="primary" size="small" plain @click="setMode('DRAWMASK')"
        ><img class="logo" src="../assets/brush.svg" alt="" /> 涂抹</el-button
      >
      <el-button type="primary" size="small" plain @click="setMode('CLEARMASK')"
        ><img class="logo" src="../assets/eraser.svg" alt="" />
        涂抹擦除</el-button
      >
      <el-button type="primary" size="small" plain @click="setMode('MARKER')"
        ><img class="logo" src="../assets/atpoint.svg" alt="" /> 标注</el-button
      >-->
      <el-button
        type="primary"
        size="small"
        plain
        @click="exportImage('base64')"
        >base64图片</el-button
      >
      <el-button type="primary" size="small" plain @click="exportImage('blob')"
        >blob图片</el-button
      >
      <el-button type="primary" size="small" plain @click="getFeatures()"
        >获取标注数据</el-button
      >
      <a href="javascript:;" class="file"
        >标注数据回显
        <input id="input" type="file" @change="displayFeatures()" />
      </a>
      <el-button type="primary" size="small" plain @click="preserveThis"
        >保存标注数据</el-button
      >
      <el-button type="primary" size="small" plain @click="reproduceThis"
        >显示存储数据</el-button
      >
      <el-button type="primary" size="small" plain @click="soundRecord"
        >录音</el-button
      >
      <el-button type="primary" size="small" plain @click="jumptogaze"
      >视线追踪</el-button
      >
      <!-- <el-button type="primary" size="small" plain @click="produceImg"
        >导出图片</el-button
      > -->
    </div>
    <div class="box">
      <div id="map"></div>
      <button @click="foldToolbar" id="btn">
        {{ foldSymbol }}
      </button>
      <div class="own">
        <div
          v-for="(lay, index) in layers"
          :key="index"
          class="lay"
          @click="active(index)"
          :class="[activeLayer == index + 1 ? 'active' : 'normal']"
        >
          <!-- icon="el-icon-view" -->
          <el-button
            align="left"
            style="height: 28px; float: left; margin-top: 12px"
            type="primary"
            plain
            size="mini"
            @click="look(index)"
          >
            <img v-if="lay.exit" src="../assets/eye.svg" alt="" />
            <img v-else src="../assets/eye-slash.svg" alt=""
          /></el-button>
          <el-button class="svgCss" type="primary" plain size="mini">
            <svg
              xmlns="http://127.0.0.1/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-eraser"
              viewBox="0 0 16 16"
            >
              <path :d="lay.svgcode" />
            </svg>
          </el-button>
          <el-select
            size="small"
            class="selFun"
            v-model="lay.type"
            @change="changeType(index)"
            @visible-change="tiShi($event, lay.type)"
          >
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span>&ensp;{{ item.label }} </span>
              <svg
                style="float: left; margin-top: 10px"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-eraser"
                viewBox="0 0 16 16"
              >
                <path :d="item.logoImg" />
              </svg>
            </el-option>
          </el-select>
          <el-input
            style="width: 70px; margin-top: 10px; vertical-align: 95%"
            type="text"
            class="name"
            v-model="lay.name"
            @blur="checkName(index)"
            size="small"
          ></el-input>
          <img v-show="isFold" class="thumbnail" :src="lay.imgArr" alt="" />
        </div>
        <div style="margin-left: 5%">
          <el-button
            style="margin: 2px"
            size="small"
            type="primary"
            @click="addLayer"
            class="add"
            >add</el-button
          >
          <el-button
            style="margin: 2px"
            size="small"
            type="primary"
            @click="setStyle"
            >样式</el-button
          >
          <el-button
            style="margin: 2px"
            size="small"
            type="primary"
            @click="setAttri"
            >属性</el-button
          >
          <el-button
            style="margin: 2px"
            size="small"
            type="primary"
            @click="deleteLay"
            >删除<i class="el-icon-delete"></i
          ></el-button>
        </div>
        <!-- 属性下拉框 -->
        <div
          style="float: left"
          v-for="(attrison, indexon) in attris"
          :key="indexon + 'c'"
        >
          <p
            v-show="indexon > 0"
            style="
              border: 1px solid #c0c4cc;
              font-size: small;
              color: #606266;
              width: 85px;
              height: 20px;
              overflow: hidden;
            "
          >
            {{ attrison.name }}
          </p>
          <el-select
            size="small"
            v-show="indexon > 0"
            v-model="form[attrison.name]"
            style="width: 90px"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in attrison.opts"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="select">
      <h1>点击选择标注图片</h1>
      <div class="accordion">
        <ul>
          <li
            v-for="(img, index) in imgUrl"
            :key="index"
            :tabindex="index + 1"
            @click="checkThis(index)"
          >
            <div></div>
          </li>
        </ul>
      </div>
    </div>
    <el-dialog
      style=""
      title="选择样式"
      :visible.sync="dialogVisible"
      width="30%"
    >
      线&emsp;&emsp;宽:&emsp;<input v-model="style.lineWidth" /><br />
      边框颜色:&emsp;<input type="color" v-model="style.strokeStyle" /><br />
      填&ensp;充&ensp;色:&emsp;<input
        type="color"
        v-model="style.fillStyle"
      /><br />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setStyle1">确 定</el-button>
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
        <!-- <el-button type="primary" @click="addAttri">添 加</el-button>
        <el-button @click="delAttri0">删 除</el-button>
        <el-button @click="SaveAttri0">保 存</el-button>
        <el-button @click="SelAttri0">选 择</el-button> -->
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
        <!-- <el-button type="primary" @click="setAttri1">确 定</el-button> -->
      </div>
    </el-dialog>
    <!-- 保存属性集 -->
    <el-dialog title="保存当前属性集" :visible.sync="dialogSaveFormVisible">
      <el-form :model="attriss">
        <!-- <div v-show="attriss.length>0" v-for="(item,index ) in attriss" :key="index">
          <el-form-item label="已有属性集名称" label-width="140px">
            <el-input readonly="readonly" v-model="item[index].name" autocomplete="off"></el-input>
          </el-form-item>
        </div> -->
        <el-form-item label="保存属性集名称" label-width="140px">
          <!-- <el-input v-model="attriss[attriss.length].name" autocomplete="off"></el-input> -->
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
          :key="index"
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
        <div v-for="(ar, ord) in arrys" :key="ord" @click="activeAttri(ord)">
          <el-form-item label="属性值" label-width="140px">
            <!-- <el-input v-model="attri.opts[ord]" autocomplete="off">{{a}}</el-input> -->
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
    <!-- 删除属性值对话框 -->
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
    <el-dialog title="录音" :visible.sync="dialogRecordVisible" width="30%">
      <el-button @click="start">录音</el-button>
      <el-button @click="stop">结束</el-button>
      <el-button @click="play">播放</el-button>
      <el-button @click="transtram">发送</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRecordVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogRecordVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AILabel from "ailabel";
//import html2canvas from "html2canvas";
import domtoimage from "dom-to-image";
import Recorder from "js-audio-recorder";

export default {
  data() {
    return {
      order: 0, //记录当前选中的属性值
      formid: "", //记录当前选中的属性
      gMap: "",
      gazedot: "",
      isButton: true,
      isFold: true,
      // divWidth: "width:230px",
      foldSymbol: ">>",
      layers: [
        {
          id: "first-layer-feature",
          allFeatures: [],
          exit: true,
          svgcode:
            "M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025zg",
          imgArr:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F29381f30e924b899e7b98bc669061d950b7bf643.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638415117&t=10ad7679c9c07316fa9ecb143a1e813e",
          name: "默认层",
          style: {},
          type: "PAN",
        },
      ],
      attrissName: "",
      activeLayer: 1,
      drawingStyle: {}, // 绘制过程中样式
      dialogVisible: false,
      dialogFormVisible: false,
      dialogAttriVisible: false,
      dialogDelFormVisible: false, //删除属性提示框
      dialogDelFormOptVisible: false, //删除属性值提示框
      dialogSaveFormVisible: false, //保存当前属性集提示框
      dialogSelFormVisible: false, //选择属性集提示框
      dialogChangeFormVisible: false, //更换属性集提示框
      dialogRecordVisible: false,
      activeAttrissName: "", //当前选中的属性集的名称
      index: 0,
      attriss: [], //创建的属性集的集合
      everyAttrissName: [], //属性集的名称
      attris: [
        {
          name: "",
          opts: [],
          // opt2:"",
          // opt3:"",
        },
      ], //添加属性的属性名和属性选项的集合
      attrii: {
        name: "",
        opts: [],
      }, //更新
      attri: {
        name: "",
        opts: [],
      }, //每次新增一个属性，该属性存放的位置
      style: {
        lineWidth: 1,
        strokeStyle: "#FF0000",
        fillStyle: "#FF0000",
      },
      form: {}, //图片现有的属性以及属性值
      formAttris: [], //form,即现有属性的属性名的集合
      arrysi: [0, 1], //更新
      arrys: [0, 1], //记录添加的属性有多少属性值
      types: [
        {
          label: "平移",
          logoImg:
            "M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025zg",
          value: "PAN",
        },
      ],
      type: "",
      imgUrl: [
        { id: 1, url: "https://source.unsplash.com/uYyLWm7V-9U" },
        { id: 2, url: "https://source.unsplash.com/LD4KsgYUjxI" },
        { id: 3, url: "https://source.unsplash.com/MQFNx9pVPRQ" },
        { id: 4, url: "https://source.unsplash.com/7gM1R2yLfXk" },
        { id: 5, url: "https://source.unsplash.com/jso_yKod6-c" },
        { id: 6, url: "https://source.unsplash.com/46vZtdZhWAs" },
        {
          id: 7,
          url: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.china-radiology.com%2Fdata%2Fattachment%2Fforum%2F201905%2F05%2F183106z6tmw11xz6f9tndi.jpg&refer=http%3A%2F%2Fwww.china-radiology.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1637231068&t=6ed268a030677e145cd16570f2a368f1",
        },
      ],
      activeImage: "",
      recorder: null,
    };
  },
  methods: {
    setMode(mode) {
      // console.log("-----------",this.marks);
      // let flag=false;
      // for(let i=0;i<this.marks.length;i++){
      //   if(this.marks[i]==mode){
      //     flag=true;
      //     break;
      //   }
      // }
      // if(!flag){
      //   this.$alert('抱歉，您没有这个标注方式的使用权限！！');
      //   return
      // }
      this.gMap.setMode(mode);
      // 后续对应模式处理
      switch (this.gMap.mode) {
        case "PAN": {
          break;
        }
        case "MARKER": {
          // 忽略
          break;
        }
        case "POINT": {
          // this.drawingStyle = { fillStyle: "#9370DB" };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "CIRCLE": {
          // this.drawingStyle = {
          //   fillStyle: "#9370DB",
          //   strokeStyle: "#0000FF",
          //   lineWidth: 2,
          // };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "LINE": {
          // this.drawingStyle = {
          //   strokeStyle: "#FF00FF",
          //   lineJoin: "round",
          //   lineCap: "round",
          //   lineWidth: 10,
          // };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "POLYLINE": {
          // this.drawingStyle = {
          //   strokeStyle: "#FF1493",
          //   lineJoin: "round",
          //   lineCap: "round",
          //   lineWidth: 10,
          // };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "RECT": {
          // this.drawingStyle = { strokeStyle: "#0f0", lineWidth: 1 };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "POLYGON": {
          // this.drawingStyle = {
          //   strokeStyle: "#00f",
          //   fillStyle: "#0f0",
          //   globalAlpha: 0.3,
          //   lineWidth: 1,
          //   fill: true,
          //   stroke: true,
          // };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "DRAWMASK": {
          // this.drawingStyle = {
          //   strokeStyle: "rgba(255, 0, 0, .5)",
          //   fillStyle: "#00f",
          //   lineWidth: 50,
          // };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "CLEARMASK": {
          // this.drawingStyle = { fillStyle: "#00f", lineWidth: 30 };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        default:
          break;
      }
    },
    //折叠图片，改变toolbar的width
    foldToolbar() {
      if (this.foldSymbol == ">>") {
        this.foldSymbol = "<<";
        this.isFold = !this.isFold;
      } else {
        this.foldSymbol = ">>";
        this.isFold = !this.isFold;
      }
    },
    // 导出图片
    async exportImage(type) {
      const imagedata = await this.gMap.exportLayersToImage(
        { x: 0, y: 0, width: 500, height: 354 },
        { type, format: "image/png" }
      );

      const imageDom = new Image();
      if (type === "base64") {
        // 导出base64格式
        imageDom.src = imagedata;
      } else {
        // 导出blob格式
        const url = URL.createObjectURL(imagedata);
        imageDom.src = url;
        imageDom.onload = () => {
          URL.revokeObjectURL(url);
        };
      }

      let aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = imageDom.src;
      aLink.download = "export.png";
      // 触发点击-然后移除
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
    },
    // 获取标注数据
    getFeatures() {
      let allFeatures = "";
      for (let j = 0; j < this.layers.length; j++) {
        allFeatures += "lay:\n";
        allFeatures += this.layers[j].name;
        allFeatures += "\n";
        let gFirstFeatureLayer = this.gMap.getLayers()[j + 2];
        let all = gFirstFeatureLayer.getAllFeatures();
        for (let i = 0; i < all.length; i++) {
          allFeatures += "id:\n";
          allFeatures += all[i].id;
          allFeatures += "\n";
          allFeatures += "type:\n";
          allFeatures += all[i].type;
          allFeatures += "\n";
          allFeatures += "shape:\n";
          allFeatures += JSON.stringify(all[i].shape);
          allFeatures += "\n";
          allFeatures += "props:\n";
          allFeatures += JSON.stringify(all[i].props);
          allFeatures += "\n";
          allFeatures += "style:\n";
          allFeatures += JSON.stringify(all[i].style);
          allFeatures += "\n----------\n";
        }
        allFeatures += "\n****************\n";
      }
      //console.log(allFeatures);
      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(allFeatures)
      );
      element.setAttribute("download", "features.txt");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    // 标注数据回显
    displayFeatures() {
      // const gFirstFeatureLayer = this.gMap.getLayers()[1];
      const input = document.querySelector("input[type=file]");
      const reader = new FileReader();
      reader.readAsText(input.files[0], "utf8"); // input.files[0]为第一个文件
      reader.onload = () => {
        const result = reader.result;
        //console.log(result); // reader.result为获取结果
        const allLayers = result.split("\n****************\n");
        console.log(allLayers);
        for (let j = 0; j < allLayers.length - 1; j++) {
          let name = allLayers[j].split("\n")[1];
          let exit = false;
          let number = 0;
          for (let k = 0; k < this.layers.length; k++) {
            if (this.layers[k].name == name) {
              exit = !exit;
              number = k;
            }
          }
          if (exit) {
            let lay = this.gMap.getLayers()[number + 2];
            const allMark = allLayers[j].split("\n----------\n");
            console.log(allMark);
            for (let i = 0; i < allMark.length - 1; i++) {
              const allAttribute = allMark[i].split("\n");
              let id, type, shape, props, style;
              if (i == 0) {
                id = allAttribute[3];
                type = allAttribute[5];
                shape = JSON.parse(allAttribute[7]);
                props = JSON.parse(allAttribute[9]);
                style = JSON.parse(allAttribute[11]);
              } else {
                id = allAttribute[1];
                type = allAttribute[3];
                shape = JSON.parse(allAttribute[5]);
                props = JSON.parse(allAttribute[7]);
                style = JSON.parse(allAttribute[9]);
              }
              //console.log(id, type, shape, props, style);
              switch (type) {
                case "POINT":
                  let gFirstFeaturePoint = new AILabel.Feature.Point(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePoint);
                  this.layers[number].allFeatures.push(gFirstFeaturePoint);
                  break;
                case "LINE":
                  let gFirstFeatureLine = new AILabel.Feature.Line(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureLine);
                  this.layers[number].allFeatures.push(gFirstFeatureLine);
                  break;
                case "POLYLINE":
                  let polylineFeature = new AILabel.Feature.Polyline(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(polylineFeature);
                  this.layers[number].allFeatures.push(polylineFeature);
                  break;
                case "RECT":
                  let gFirstFeatureRect = new AILabel.Feature.Rect(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureRect);
                  this.layers[number].allFeatures.push(gFirstFeatureRect);
                  break;
                case "POLYGON":
                  let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePolygon);
                  this.layers[number].allFeatures.push(gFirstFeaturePolygon);
                  break;
                case "CIRCLE":
                  let gFirstFeatureCircle = new AILabel.Feature.Circle(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureCircle);
                  this.layers[number].allFeatures.push(gFirstFeatureCircle);
                  break;
                default:
                  console.log("nonono");
              }
            }
          } else {
            const id = this.layers.length + "";
            const lay = new AILabel.Layer.Feature(
              id, // id
              { name: "矢量图层" }, // props
              { zIndex: 20 } // style
            );
            this.gMap.addLayer(lay);
            this.layers.push({
              id: id,
              allFeatures: [],
              exit: true,
              name: name,
            });
            const allMark = allLayers[j].split("\n----------\n");
            console.log(allMark);
            for (let i = 0; i < allMark.length - 1; i++) {
              const allAttribute = allMark[i].split("\n");
              let id, type, shape, props, style;
              if (i == 0) {
                id = allAttribute[3];
                type = allAttribute[5];
                shape = JSON.parse(allAttribute[7]);
                props = JSON.parse(allAttribute[9]);
                style = JSON.parse(allAttribute[11]);
              } else {
                id = allAttribute[1];
                type = allAttribute[3];
                shape = JSON.parse(allAttribute[5]);
                props = JSON.parse(allAttribute[7]);
                style = JSON.parse(allAttribute[9]);
              }
              //console.log(id, type, shape, props, style);
              switch (type) {
                case "POINT":
                  let gFirstFeaturePoint = new AILabel.Feature.Point(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePoint);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeaturePoint
                  );
                  break;
                case "LINE":
                  let gFirstFeatureLine = new AILabel.Feature.Line(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureLine);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeatureLine
                  );
                  break;
                case "POLYLINE":
                  let polylineFeature = new AILabel.Feature.Polyline(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(polylineFeature);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    polylineFeature
                  );
                  break;
                case "RECT":
                  let gFirstFeatureRect = new AILabel.Feature.Rect(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureRect);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeatureRect
                  );
                  break;
                case "POLYGON":
                  let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePolygon);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeaturePolygon
                  );
                  break;
                case "CIRCLE":
                  let gFirstFeatureCircle = new AILabel.Feature.Circle(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureCircle);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeatureCircle
                  );
                  break;
                default:
                  console.log("nonono");
              }
            }
          }
        }
      };
    },
    hide(index) {
      const gFirstFeatureLayer = this.gMap.getLayers()[index + 2];
      gFirstFeatureLayer.removeAllFeatures();
    },
    backMe(index) {
      const gFirstFeatureLayer = this.gMap.getLayers()[index + 2];
      for (let i = 0; i < this.layers[index].allFeatures.length; i++) {
        gFirstFeatureLayer.addFeature(this.layers[index].allFeatures[i]);
      }
      // gFirstFeatureLayer.addFeature(this.layers[0].allFeatures[0]);
    },
    look(index) {
      if (this.layers[index].exit) {
        this.hide(index);
      } else {
        this.backMe(index);
      }
      this.layers[index].exit = !this.layers[index].exit;
    },
    active(index) {
      this.activeLayer = index + 1;
      this.drawingStyle = this.layers[index].style;
      this.setMode(this.layers[index].type);
    },
    addLayer() {
      const id = this.layers.length + "";
      const FeatureLayer = new AILabel.Layer.Feature(
        id, // id
        { name: "矢量图层" }, // props
        { zIndex: 20 } // style
      );
      this.gMap.addLayer(FeatureLayer);
      this.layers.push({
        id: id,
        allFeatures: [],
        exit: true,
        name: id + "",
        style: {},
      });
    },
    setStyle1() {
      this.layers[this.index].style = this.style;
      this.dialogVisible = false;
      if (this.activeLayer == this.index + 1) {
        this.drawingStyle = this.layers[this.index].style;
      }
      //console.log(this.layers[this.index].style);
    },
    setStyle(index) {
      this.dialogVisible = true;
      this.index = this.activeLayer - 1;
    },
    // setAttri1() {
    //   this.dialogFormVisible = false;
    // },
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
      for (i = 0; i < this.attris.length; i++) {
        if (this.attris[i].name == this.formid) {
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
      //删除图片属性集中的当前属性
      if (jflag && iflag) {
        this.attris.splice(ki, 1);
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
    //添加属性值的框框
    addAttri2() {
      this.arrys.push(0);
    },
    //添加属性
    addAttri1() {
      console.log("addAttri1.........");
      let flag = true;
      for (let i = 0; i < this.attris.length; i++) {
        // if (this.attris[i].name == '') {
        //   this.$message({
        //   message: "属性名不可为空",
        //   type: "error",
        // });
        //   flag = false;
        // }else
        if (this.attris[i].name == this.attri.name) {
          this.$message({
            message: "属性名不可重复或为空",
            type: "error",
          });
          flag = false;
        }
      }
      if (flag) {
        this.attris.push({
          name: this.attri.name,
          opts: [],
        });
        let n = this.attris.length;
        console.log("现有属性集" + this.attris);
        for (let m = 0; m < this.attri.opts.length; m++) {
          // console.log(this.attri.opts.length);
          // console.log(this.attri.opts);
          if (this.attri.opts[m] != " ") {
            // console.log(this.attri.opts)
            this.attris[n - 1].opts.push(this.attri.opts[m]);
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
      // console.log("添加前属性集合为："+this.attriss);
      // console.log(this.attriss);
      // console.log("添加前attris为："+this.attris);
      // console.log(this.attris);
      // console.log("属性集合长度为："+this.attriss.length);
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
          // item.attris = this.attris;  //后面要改成深克隆
          item.attris = this.deepClone(this.attris);
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
                console.log("添加后属性集合为：" + this.attriss);
                console.log(this.attriss);
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
        });
    },
    //弹出确定更换属性集对话框
    SelAttri1() {
      if (this.activeAttrissName == "") {
        this.$message({
          message: "请正确选择要更换的属性集",
          type: "error",
        });
      }else{
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
      // console.log(this.attris);

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
            // this.attris = this.attriss[i].attris; //后面要改成深克隆
            this.attris = this.deepClone(this.attriss[i].attris);
            //更改form
            this.form = {};
            for (let j = 0; j < this.attris.length; j++) {
              if (this.attris[j].name != "") {
                this.$set(
                  this.form,
                  this.attris[j].name,
                  this.attris[j].opts[0]
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
    checkName(index) {
      for (let i = 0; i < this.layers.length; i++) {
        if (i != index) {
          if (this.layers[i].name == this.layers[index].name) {
            alert("图层名字不可重复!");
            this.layers[index].name = this.layers[index].id + "";
          }
        }
      }
    },
    isText() {
      if (!this.isButton) this.isButton = true;
    },
    changeContent(index) {
      if (this.isButton) this.isButton = false;
      for (let i = 0; i < this.layers.length; i++) {
        if (i != index) {
          if (this.layers[i].name == this.layers[index].name) {
            alert("图层名字不可重复!");
            this.layers[index].name = this.layers[index].id + "";
          }
        }
      }
    },
    changeType(index) {
      this.$confirm("此操作将永久删除该方式的标注内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.hide(index);
          this.layers[index].allFeatures = [];
          this.setMode(this.layers[index].type);
          console.log(this.type);
          let arrFilter = this.types.filter(
            (ele) => ele.value == this.layers[index].type
          );
          console.log(arrFilter);
          this.layers[index].svgcode = arrFilter[0].logoImg;
        })
        .catch(() => {
          this.layers[index].type = this.type;
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    tiShi(callback, type) {
      if (callback) {
        this.type = type;
      }
    },
    deleteLay() {
      const id = this.layers[this.activeLayer - 1].id;
      this.gMap.removeLayerById(id);
      this.layers.splice(this.activeLayer - 1, 1);
    },
    checkThis(index) {
      this.activeImage = this.imgUrl[index].url.split(
        "api:8888/"
      )[1];
      console.log(this.activeImage);
      this.gMap.removeAllLayers();
      for (let i = 0; i < this.layers.length; i++) {
        this.layers[i].allFeatures = [];
      }

      const gFirstImageLayer = new AILabel.Layer.Image(
        "first-layer-image", // id
        {
          src: this.imgUrl[index].url,
          width: 500,
          height: 354,
          crossOrigin: true, // 如果跨域图片，需要设置为true
          position: {
            // 左上角相对中心点偏移量
            x: 0,
            y: 0,
          },
          grid: {
            // 3 * 3
            columns: [{ color: "#9370DB" }, { color: "#FF6347" }],
            rows: [{ color: "#9370DB" }, { color: "#FF6347" }],
          },
        }, // imageInfo
        { name: "第一个图片图层" }, // props
        { zIndex: 5 } // style
      );
      this.gMap.addLayer(gFirstImageLayer);

      const gFirstMaskLayer = new AILabel.Layer.Mask(
        "first-layer-mask", // id
        { name: "第一个涂抹图层" }, // props
        { zIndex: 11, opacity: 0.5 } // style
      );
      this.gMap.addLayer(gFirstMaskLayer);

      for (let i = 0; i < this.layers.length; i++) {
        const FeatureLayer = new AILabel.Layer.Feature(
          this.layers[i].id, // id
          { name: "矢量图层" }, // props
          { zIndex: 20 } // style
        );
        this.gMap.addLayer(FeatureLayer);
      }
    },
    preserveThis() {
      let allFeatures = "";
      for (let j = 0; j < this.layers.length; j++) {
        allFeatures += "lay:\n";
        allFeatures += this.layers[j].name;
        allFeatures += "\n";
        let gFirstFeatureLayer = this.gMap.getLayers()[j + 2];
        let all = gFirstFeatureLayer.getAllFeatures();
        for (let i = 0; i < all.length; i++) {
          allFeatures += "id:\n";
          allFeatures += all[i].id;
          allFeatures += "\n";
          allFeatures += "type:\n";
          allFeatures += all[i].type;
          allFeatures += "\n";
          allFeatures += "shape:\n";
          allFeatures += JSON.stringify(all[i].shape);
          allFeatures += "\n";
          allFeatures += "props:\n";
          allFeatures += JSON.stringify(all[i].props);
          allFeatures += "\n";
          allFeatures += "style:\n";
          allFeatures += JSON.stringify(all[i].style);
          allFeatures += "\n----------\n";
        }
        allFeatures += "\n****************\n";
      }
      let key = this.activeImage;
      var data = {};
      data[key] = allFeatures;
      data = JSON.stringify(data);
      const that = this;
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/saveData/",
        //设置请求体
        data: data,
      }).then((response) => {
        console.log(response.data);
        if (response.data == "保存了，小老弟") {
          that.$alert("保存成功");
        }
      });
    },
    reproduceThis() {
      console.log(this.activeImage);
      let data = this.activeImage;
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/returnData/",
        //设置请求体
        data: data,
      }).then((response) => {
        console.log(response.data);
        const result = response.data;
        const allLayers = result.split("\n****************\n");
        console.log(allLayers);
        for (let j = 0; j < allLayers.length - 1; j++) {
          let name = allLayers[j].split("\n")[1];
          let exit = false;
          let number = 0;
          for (let k = 0; k < this.layers.length; k++) {
            if (this.layers[k].name == name) {
              exit = !exit;
              number = k;
            }
          }
          if (exit) {
            let lay = this.gMap.getLayers()[number + 2];
            const allMark = allLayers[j].split("\n----------\n");
            console.log(allMark);
            for (let i = 0; i < allMark.length - 1; i++) {
              const allAttribute = allMark[i].split("\n");
              let id, type, shape, props, style;
              if (i == 0) {
                id = allAttribute[3];
                type = allAttribute[5];
                shape = JSON.parse(allAttribute[7]);
                props = JSON.parse(allAttribute[9]);
                style = JSON.parse(allAttribute[11]);
              } else {
                id = allAttribute[1];
                type = allAttribute[3];
                shape = JSON.parse(allAttribute[5]);
                props = JSON.parse(allAttribute[7]);
                style = JSON.parse(allAttribute[9]);
              }
              //console.log(id, type, shape, props, style);
              switch (type) {
                case "POINT":
                  let gFirstFeaturePoint = new AILabel.Feature.Point(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePoint);
                  this.layers[number].allFeatures.push(gFirstFeaturePoint);
                  break;
                case "LINE":
                  let gFirstFeatureLine = new AILabel.Feature.Line(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureLine);
                  this.layers[number].allFeatures.push(gFirstFeatureLine);
                  break;
                case "POLYLINE":
                  let polylineFeature = new AILabel.Feature.Polyline(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(polylineFeature);
                  this.layers[number].allFeatures.push(polylineFeature);
                  break;
                case "RECT":
                  let gFirstFeatureRect = new AILabel.Feature.Rect(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureRect);
                  this.layers[number].allFeatures.push(gFirstFeatureRect);
                  break;
                case "POLYGON":
                  let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePolygon);
                  this.layers[number].allFeatures.push(gFirstFeaturePolygon);
                  break;
                case "CIRCLE":
                  let gFirstFeatureCircle = new AILabel.Feature.Circle(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureCircle);
                  this.layers[number].allFeatures.push(gFirstFeatureCircle);
                  break;
                default:
                  console.log("nonono");
              }
            }
          } else {
            const id = this.layers.length + "";
            const lay = new AILabel.Layer.Feature(
              id, // id
              { name: "矢量图层" }, // props
              { zIndex: 20 } // style
            );
            this.gMap.addLayer(lay);
            this.layers.push({
              id: id,
              allFeatures: [],
              exit: true,
              name: name,
            });
            const allMark = allLayers[j].split("\n----------\n");
            console.log(allMark);
            for (let i = 0; i < allMark.length - 1; i++) {
              const allAttribute = allMark[i].split("\n");
              let id, type, shape, props, style;
              if (i == 0) {
                id = allAttribute[3];
                type = allAttribute[5];
                shape = JSON.parse(allAttribute[7]);
                props = JSON.parse(allAttribute[9]);
                style = JSON.parse(allAttribute[11]);
              } else {
                id = allAttribute[1];
                type = allAttribute[3];
                shape = JSON.parse(allAttribute[5]);
                props = JSON.parse(allAttribute[7]);
                style = JSON.parse(allAttribute[9]);
              }
              //console.log(id, type, shape, props, style);
              switch (type) {
                case "POINT":
                  let gFirstFeaturePoint = new AILabel.Feature.Point(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePoint);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeaturePoint
                  );
                  break;
                case "LINE":
                  let gFirstFeatureLine = new AILabel.Feature.Line(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureLine);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeatureLine
                  );
                  break;
                case "POLYLINE":
                  let polylineFeature = new AILabel.Feature.Polyline(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(polylineFeature);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    polylineFeature
                  );
                  break;
                case "RECT":
                  let gFirstFeatureRect = new AILabel.Feature.Rect(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureRect);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeatureRect
                  );
                  break;
                case "POLYGON":
                  let gFirstFeaturePolygon = new AILabel.Feature.Polygon(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeaturePolygon);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeaturePolygon
                  );
                  break;
                case "CIRCLE":
                  let gFirstFeatureCircle = new AILabel.Feature.Circle(
                    id, // id
                    shape, // shape
                    props, // props
                    style // style
                  );
                  lay.addFeature(gFirstFeatureCircle);
                  this.layers[this.layers.length - 1].allFeatures.push(
                    gFirstFeatureCircle
                  );
                  break;
                default:
                  console.log("nonono");
              }
            }
          }
        }
      });
    },
    async exportLayer(index) {
      const lay = this.gMap.getLayers()[index + 2];
      const imagedata = await this.gMap.exportLayersToImage(
        { x: 0, y: 0, width: 500, height: 354 },
        { layers: [lay], type: "base64", format: "image/png" }
      );

      const imageDom = new Image();
      imageDom.src = imagedata;
      this.layers[index].imgArr = imagedata;
    },
    produceImg() {
      let map = document.querySelector("#map");
      domtoimage.toPng(map).then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = dataUrl;
        aLink.download = "export.png";
        // 触发点击-然后移除
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
      });

      // html2canvas(map).then(function (canvas) {
      //   let imgUri = canvas.toDataURL("image/png"); // 获取生成的图片的url
      // let aLink = document.createElement("a");
      // aLink.style.display = "none";
      // aLink.href = imgUri;
      // aLink.download = "export.png";
      // // 触发点击-然后移除
      // document.body.appendChild(aLink);
      // aLink.click();
      // document.body.removeChild(aLink);
      // });
    },
    jumptogaze(){
      this.$router.push('/gaze');
      window.location.reload();
    },
    soundRecord() {
      this.dialogRecordVisible = true;
      const data = JSON.stringify(this.attris);
      console.log(data);
      this.$axios({
        method: "POST",
        url: "api/receiveProperty/",
        data: data,
      }).then((response) => {
        console.log(response.data);
      });
    },
    start() {
      this.recorder = new Recorder({
        sampleBits: 16, // 采样位数，范围8或16
        sampleRate: 16000, // 采样率，范围11025、16000、22050、24000、44100、48000
        numChannels: 1, // 声道，范围1或2
      });
      this.recorder.start();
    },
    stop() {
      this.recorder.stop();
    },
    play() {
      this.recorder.play();
    },
    transtram() {
      const that = this;
      let pcm = this.recorder.getPCMBlob();
      let fd = new FormData();
      fd.append("file", pcm);
      //this.recorder.downloadPCM("fileName?");
      console.log(fd);
      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/speechConvertText/",
        //设置请求体
        data: fd,
      }).then((response) => {
        console.log(response.data);
        if (response.data == 0) {
          that.$alert("没听清，再说一次");
        } else {
          //that.$alert('关键词是：'+response.data)
          let str = "";
          for (let i = 0; i < response.data.length; i++) {
            for (let j = 0; j < this.attris.length; j++) {
              if (response.data[i] == this.attris[j].name) {
                console.log("找到该属性了，属性是" + this.attris[j].name);
                str += this.attris[j].name + ":";
                for (let k = 0; k < response.data.length; k++) {
                  for (let l = 0; l < this.attris[j].opts.length; l++) {
                    if (response.data[k] == this.attris[j].opts[l]) {
                      console.log(
                        "找到该属性值了，属性值是" + this.attris[j].opts[l]
                      );
                      str += this.attris[j].opts[l] + ";";
                      //将form中的对应的属性的属性值换为现在的属性值
                      this.form[this.attris[j].name] = this.attris[j].opts[l];
                      that.$alert("更改成功" + str);
                    }
                  }
                }
              }
            }
          }
        }
      });
    },
    getgazeDot(){
      if(document.getElementById("webgazerGazeDot")){
        this.gazedot = window.getComputedStyle(document.getElementById("webgazerGazeDot")).transform;
      }
    }
  },
  mounted() {
    //初始化容器
    const that = this;
    setInterval(that.getgazeDot,1000);
    //初始化容器
    this.gMap = new AILabel.Map("map", {
      center: { x: 250, y: 177 }, // 为了让图片居中
      zoom: 800,
      mode: "PAN", // 绘制线段
      refreshDelayWhenZooming: true, // 缩放时是否允许刷新延时，性能更优
      zoomWhenDrawing: true,
      panWhenDrawing: true,
      zoomWheelRatio: 5, // 控制滑轮缩放缩率[0, 10), 值越小，则缩放越快，反之越慢
      withHotKeys: false, // 关闭快捷键
    });

    this.gMap.events.on("drawDone", (type, data, data1) => {
      //console.log("type:", type, "data:", data);
      if (type === "MARKER") {
        const marker = new AILabel.Marker(
          Date.now(), // id
          {
            src: "http://ailabel.com.cn/public/ailabel/demo/marker.png",
            position: data,
            offset: {
              x: -16,
              y: 32,
            },
          }, // markerInfo
          { name: "第一个marker注记" } // props
        );
        marker.events.on("click", (marker) => {
          console.log("marker click");
          this.gMap.markerLayer.removeMarkerById(marker.id);
        });
        this.gMap.markerLayer.addMarker(marker);
      } else if (type === "POINT") {
        const pointFeature = new AILabel.Feature.Point(
          Date.now(), // id
          { ...data, sr: 3 }, // shape
          { name: "第一个矢量图层" }, // props
          this.drawingStyle // style
        );
        console.log(this.gMap.getLayers());
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(pointFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(pointFeature);
        //gFirstFeatureLayer.addFeature(pointFeature);
      } else if (type === "CIRCLE") {
        // console.log(data,data1)
        const circleFeature = new AILabel.Feature.Circle(
          Date.now(), // id
          data, // data1代表屏幕坐标
          { name: "第一个矢量图层" }, // props
          //{ fillStyle: "#F4A460", strokeStyle: "#D2691E", lineWidth: 2 } // style
          this.drawingStyle
        );
        console.log(this.drawingStyle);
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(circleFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(circleFeature);
      } else if (type === "LINE") {
        const scale = this.gMap.getScale();
        const width = this.drawingStyle.lineWidth / scale;
        const lineFeature = new AILabel.Feature.Line(
          Date.now(), // id
          { ...data, width }, // shape
          { name: "第一个矢量图层" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(lineFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(lineFeature);
      } else if (type === "POLYLINE") {
        const scale = this.gMap.getScale();
        const width = this.drawingStyle.lineWidth / scale;
        const polylineFeature = new AILabel.Feature.Polyline(
          Date.now(), // id
          { points: data, width }, // shape
          { name: "第一个矢量图层" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(polylineFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(polylineFeature);
      } else if (type === "RECT") {
        const rectFeature = new AILabel.Feature.Rect(
          Date.now(), // id
          data, // shape
          { name: "矢量图形" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(rectFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(rectFeature);
      } else if (type === "POLYGON") {
        const polygonFeature = new AILabel.Feature.Polygon(
          Date.now(), // id
          { points: data }, // shape
          { name: "矢量图形" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(polygonFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(polygonFeature);
      } else if (type === "DRAWMASK") {
        const scale = this.gMap.getScale();
        const width = this.drawingStyle.lineWidth / scale;
        const drawMaskAction = new AILabel.Mask.Draw(
          Date.now(), // id
          "铅笔",
          { points: data, width }, // shape
          { name: "港币", price: "1元" }, // props
          this.drawingStyle // style
        );
        gFirstMaskLayer.addAction(drawMaskAction);
      } else if (type === "CLEARMASK") {
        const scale = this.gMap.getScale();
        const width = this.drawingStyle.lineWidth / scale;
        const clearMaskAction = new AILabel.Mask.Clear(
          Date.now(), // id
          { points: data, width } // shape
        );
        gFirstMaskLayer.addAction(clearMaskAction);
      }
      this.exportLayer(this.activeLayer - 1);
    });
    this.gMap.events.on("featureSelected", (feature) => {
      this.gMap.setActiveFeature(feature);
    });
    this.gMap.events.on("featureUnselected", () => {
      this.gMap.setActiveFeature(null);
    });
    this.gMap.events.on("featureUpdated", (feature, shape) => {
      feature.updateShape(shape);
      this.exportLayer(this.activeLayer - 1);
    });
    this.gMap.events.on("featureDeleted", ({ id: featureId }) => {
      gFirstFeatureLayer.removeFeatureById(featureId);
    });

    // 图片层添加
    const gFirstImageLayer = new AILabel.Layer.Image(
      "first-layer-image", // id
      {
        src: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.china-radiology.com%2Fdata%2Fattachment%2Fforum%2F201905%2F05%2F183106z6tmw11xz6f9tndi.jpg&refer=http%3A%2F%2Fwww.china-radiology.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1637231068&t=6ed268a030677e145cd16570f2a368f1",
        width: 500,
        height: 354,
        crossOrigin: true, // 如果跨域图片，需要设置为true
        position: {
          // 左上角相对中心点偏移量
          x: 0,
          y: 0,
        },
        grid: {
          // 3 * 3
          columns: [{ color: "#9370DB" }, { color: "#FF6347" }],
          rows: [{ color: "#9370DB" }, { color: "#FF6347" }],
        },
      }, // imageInfo
      { name: "第一个图片图层" }, // props
      { zIndex: 5 } // style
    );
    this.gMap.addLayer(gFirstImageLayer);

    const gFirstMaskLayer = new AILabel.Layer.Mask(
      "first-layer-mask", // id
      { name: "第一个涂抹图层" }, // props
      { zIndex: 11, opacity: 0.5 } // style
    );
    this.gMap.addLayer(gFirstMaskLayer);

    const gFirstFeatureLayer = new AILabel.Layer.Feature(
      "first-layer-feature", // id
      { name: "第一个矢量图层" }, // props
      { zIndex: 10 } // style
    );
    this.gMap.addLayer(gFirstFeatureLayer);

    window.onresize = function () {
      this.gMap && this.gMap.resize();
    };

    // let data = window.sessionStorage.getItem("username");
    // this.$axios({
    //   //请求类型
    //   method: "POST",
    //   //URL
    //   url: "api/getpersonalproject/",
    //   //设置请求体
    //   data: data,
    // }).then((response) => {
    //   let data = response.data;

    //   for (let i = 0; i < data.length; i++) {
    //     data[i] = JSON.parse(data[i].replace(/'/g, '"'));
    //   }
    //   for (let i = 0; i < data[0].marks.length; i++) {
    //     switch (data[0].marks[i]) {
    //       case "点": {
    //         this.types.push({
    //           label: "点",
    //           logoImg: "M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
    //           value: "POINT",
    //         });
    //         break;
    //       }
    //       case "线段": {
    //         this.types.push({
    //           label: "线段",
    //           logoImg:
    //             "M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z",
    //           value: "LINE",
    //         });
    //         break;
    //       }
    //       case "多线段": {
    //         this.types.push({
    //           label: "多线段",
    //           logoImg:
    //             "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z",
    //           value: "POLYLINE",
    //         });
    //         break;
    //       }
    //       case "矩形": {
    //         this.types.push({
    //           label: "矩形",
    //           logoImg:
    //             "M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z",
    //           value: "RECT",
    //         });
    //         break;
    //       }
    //       case "多边形": {
    //         this.types.push({
    //           label: "多边形",
    //           logoImg:
    //             "M14 4.577v6.846L8 15l-6-3.577V4.577L8 1l6 3.577zM8.5.134a1 1 0 0 0-1 0l-6 3.577a1 1 0 0 0-.5.866v6.846a1 1 0 0 0 .5.866l6 3.577a1 1 0 0 0 1 0l6-3.577a1 1 0 0 0 .5-.866V4.577a1 1 0 0 0-.5-.866L8.5.134z",
    //           value: "POLYGON",
    //         });
    //         break;
    //       }
    //       case "圆": {
    //         this.types.push({
    //           label: "圆",
    //           logoImg:
    //             "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z",
    //           value: "CIRCLE",
    //         });
    //         break;
    //       }
    //     }
    //   }
    //   //更改attris
    //   this.attris = data.attris;
    //   //更改form
    //   this.form = {};
    //   for (let j = 0; j < data.attris.length; j++) {
    //     if (this.data.attris[j].name != "") {
    //       this.$set(
    //         this.form,
    //         data.attris[j].name,
    //         data.attris[j].opts[0]
    //       );
    //     }
    //   }
    //   console.log(this.form);
    //   //将图片的属性的属性名给formAttris，在设置属性的对话框中显示
    //   this.formAttris = Object.getOwnPropertyNames(this.form).sort();
    // });

    this.imgUrl = this.$route.query.imgUrl;
    for (let i = 0; i < this.imgUrl.length; i++) {
      let url = this.imgUrl[i].url;
      let element = document.querySelector(
        `.accordion ul li:nth-child(${i + 1})`
      );
      element.style.backgroundImage = 'url("' + url + '")';
    }

    // const gSecondFeatureLayer = new AILabel.Layer.Feature(
    //   "second-layer-feature", // id
    //   { name: "第二个矢量图层" }, // props
    //   { zIndex: 20 } // style
    // );
    // this.gMap.addLayer(gSecondFeatureLayer);

    // const gFirstTextLayer = new AILabel.Layer.Text(
    //   "first-layer-text", // id
    //   { name: "第一个文本图层" }, // props
    //   { zIndex: 12, opacity: 1 } // style
    // );
    // this.gMap.addLayer(gFirstTextLayer);

    // const gFirstText = new AILabel.Text(
    //   "first-text", // id
    //   {
    //     text: "暂无病史",
    //     position: { x: 300, y: 300 },
    //     offset: { x: 0, y: 0 },
    //   }, // shape
    //   { name: "第一个文本对象" }, // props
    //   {
    //     fillStyle: "#F4A460",
    //     strokeStyle: "#D2691E",
    //     background: true,
    //     globalAlpha: 1,
    //     fontColor: "#0f0",
    //   } // style
    // );
    // gFirstTextLayer.addText(gFirstText);

    // const gFirstMarker = new AILabel.Marker(
    //   "first-marker", // id
    //   {
    //     src: "http://ailabel.com.cn/public/ailabel/demo/marker.png",
    //     position: {
    //       // 左上角相对中心点偏移量
    //       x: 250,
    //       y: 177,
    //     },
    //     offset: {
    //       x: -16,
    //       y: 32,
    //     },
    //   }, // markerInfo
    //   { name: "第一个marker注记" } // props
    // );
    // gFirstMarker.events.on("dragEnd", (marker, newPosition) => {
    //   console.log("marker dragEnd");
    //   marker.updatePosition(newPosition);
    // });
    // gFirstMarker.events.on("rightClick", (marker) => {
    //   console.log("marker click");
    //   this.gMap.markerLayer.removeMarkerById(marker.id);
    // });
    // gFirstMarker.enableDragging();
    // this.gMap.markerLayer.addMarker(gFirstMarker);

    // gMap.events.on("mouseDown", (e) => {
    //   //console.log(e);
    //   this.points.push({
    //     x: e.global.x,
    //     y: e.global.y,
    //   });
    // });
    // gMap.events.on("dblClick", (e) => {
    //   //console.log(e);
    //   this.points.push({
    //     x: e.global.x,
    //     y: e.global.y,
    //   });
    //   const gFirstFeaturePolygon = new AILabel.Feature.Polygon(
    //     "first-feature-polygon", // id
    //     {
    //       points: this.points,
    //     }, // shape
    //     { name: "第一个多边形" }, // props
    //     { strokeStyle: "#FFD500", lineWidth: 1 } // style
    //   );
    //   gFirstFeatureLayer.addFeature(gFirstFeaturePolygon);
    // });
  },
  watch: {
    layers: {
      deep: true,
      handler() {
        this.$forceUpdate();
      },
    },
    gazedot: {
      deep: true,
      handler(){
        var webgazerGazeDot = document.getElementById("webgazerGazeDot");
        var translate = window.getComputedStyle(webgazerGazeDot).transform;
        var left = parseFloat(translate.substring(7).split(',')[4]);
        var top = parseFloat(translate.replace(")", "").substring(7).split(',')[5]);
        if(left < 130 && top > 240 && top < 350){
          if (this.id > 0) {
            this.checkThis(this.id - 1);
          } else {
            this.sert("超界", 1000);
          }
        }
        if(left > 1150 && top > 240 && top < 350){
          if (this.id < this.imgUrl.length) {
            this.checkThis(this.id + 1);
            console.log(this.id);
          } else {
            this.sert("超界", 1000);
          }
        }
      }
    }
  },
};
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0px;
}

.svgCss {
  vertical-align: 100%;
  height: 28px;
}
.el-select .el-input .el-select__caret::before {
  /*content: "\e78f"*/
  content: "";
  width: 2px;
  height: 2px;
}
.el-icon-arrow-up:before {
  content: "";
}
.selFun {
  width: 80px;
  /* display: block; */
  margin-top: 10px;
  vertical-align: 80%;
}

.logo {
  width: 10px;
  height: 10px;
}

.thumbnail {
  border: solid thin;
  /* position: relative; */
  margin-left: 30%;
  object-fit: contain;
  width: 80px;
  height: 80px;
}

.button-wrap {
  padding-bottom: 10px;
}

.box {
  display: flex;
  flex-direction: row;
}

#map {
  overflow: hidden;
  position: relative;
  height: 600px;
  width: 1300px;
  border: 1px dashed #ccc;
}

.own {
  overflow: hidden;
  background-color: rgb(239, 245, 247);
  width: 400px;
  height: 600px;
  padding: 10px;
  overflow-y: auto;
  /* position:relative; */
}

.file {
  position: relative;
  display: inline-block;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  /* right: -10px; */
  top: 10px;
  border-radius: 4px;
  padding: 5px 12px;
  overflow: hidden;
  font-size: small;
  color: #409eff;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
  margin: 0px 10px -1px;
}

#btn {
  position: absolute;
  top: 50%;
  right: 0px;
  height: 50px;
  border: 0;
  border-right: 1px solid rgb(23, 32, 43, 0.2);
  border-top: 1px solid rgb(23, 32, 43, 0.2);
  border-bottom: 1px solid rgb(23, 32, 43, 0.2);
  background: #eff5f7;
  color: rgb(108, 108, 112);
  cursor: pointer;
}

.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}

.file:hover {
  background: #aadffd;
  border-color: #78c3f3;
  color: #004974;
  text-decoration: none;
}

.attribute {
  margin-left: 10px;
}

.name {
  width: 50px;
}

.add {
  background-color: gold;
}

.lay {
  /* Firefox */
  /* display: -moz-box;
  -moz-box-align: center; */
  /* Safari、Opera 以及 Chrome */
  /* display: -webkit-box;
  -webkit-box-align: center; */
  border: solid 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 3px;
  padding: 5px 1px;
}

.active {
  border-color: hotpink;
}

.normal {
  border-color: lavender;
}

@import url(https://fonts.googleapis.com/css?family=Open+Sans);
@import url(https://fonts.googleapis.com/css?family=Montserrat:700);

h1 {
  text-align: center;
  font-family: Montserrat, sans-serif;
  color: #333;
}

.accordion {
  width: 100%;
  max-width: 1080px;
  height: 250px;
  overflow: hidden;
  margin: 50px auto;
}

.accordion ul {
  width: 100%;
  display: table;
  table-layout: fixed;
  margin: 0;
  padding: 0;
}

.accordion ul li {
  display: table-cell;
  vertical-align: bottom;
  position: relative;
  width: 16.666%;
  height: 250px;
  background-repeat: no-repeat;
  background-position: center center;
  transition: all 500ms ease;
}

.accordion ul li div {
  display: block;
  overflow: hidden;
  width: 100%;
}

.accordion ul:hover li,
.accordion ul:focus-within li {
  width: 8%;
}

.accordion ul li:focus {
  outline: none;
}

.accordion ul:hover li:hover,
.accordion ul li:focus,
.accordion ul:focus-within li:focus {
  width: 60%;
}

.accordion ul:hover li {
  width: 8% !important;
}

.accordion ul:hover li:hover {
  width: 60% !important;
}

@media screen and (max-width: 600px) {
  body {
    margin: 0;
  }

  .accordion {
    height: auto;
  }

  .accordion ul li,
  .accordion ul li:hover,
  .accordion ul:hover li,
  .accordion ul:hover li:hover {
    position: relative;
    display: table;
    table-layout: fixed;
    width: 100%;
    -webkit-transition: none;
    transition: none;
  }
}

.about {
  text-align: center;
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  color: #666;
}
</style>
