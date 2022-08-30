<template>
  <div>
    <div class="button-wrap">
      <el-alert
        title="在绘制模式时，双击图形可进行选中编辑；单击未选中图形区域或切换模式会取消选中"
        type="info"
        show-icon
      >
      </el-alert>
      <el-button type="info" size="small" plain @click="setMode('PAN')"
        ><img class="logo" src="../assets/hand-index-thumb.svg" alt="" />
        平移</el-button
      >
      <el-button type="info" size="small" plain @click="setMode('CLEARMASK')"
        ><img class="logo" src="../assets/eraser.svg" alt="" />
        涂抹擦除</el-button
      >
      <el-button
        type="info"
        size="small"
        style="margin-top: 10px; margin-left: -2px"
        plain
        @click="magicWind"
        >魔棒</el-button
      >
      <el-button
        type="info"
        size="small"
        plain
        @click="exportImage('base64')"
        >base64图片</el-button
      >
      <el-button type="info" size="small" plain @click="exportImage('blob')"
        >blob图片</el-button
      >
      <el-button type="info" size="small" plain @click="getFeatures()"
        >获取标注数据</el-button
      >
      <a href="javascript:;" class="file"
        >标注数据回显
        <input id="input" type="file" @change="displayFeatures()" />
      </a>
      <el-button type="info" size="small" plain @click="preserveThis"
        >保存标注数据</el-button
      >
      <el-button type="info" size="small" plain @click="reproduceThis"
        >显示存储数据</el-button
      >
      <el-button
        type="info"
        size="small"
        plain
        @click="soundRecon"
        class="record-btn"
        >语音识别</el-button
      >
      <el-button type="info" size="small" plain @click="produceImg"
        >导出图片</el-button
      >
      <el-button type="info" size="small" plain @click="setGaze"
      >视线追踪</el-button
      >
      <el-button type="info" size="small" plain @click="exportDrawImage()"
        >涂抹保存</el-button>
        <el-button type="info" size="small" plain @click="showDraw()"
        >涂抹显示</el-button>
    <!-- 魔棒的容差 -->
    <div v-show="tolVisible" class="slider-demo-block">
      <el-slider type="info" size="mini" v-model="tol" :max="255" show-input />
    </div>
    </div>
    <div class="box">
      <div id="map"></div>
      <div class="own">
        <div id="fold_btn_div">
          <button @click="foldToolbar" id="fold_btn">
          {{ foldSymbol }}
          </button>
        </div>
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
            type="info"
            plain
            size="mini"
            @click="look(index)"
          >
            <img v-if="lay.exit" src="../assets/eye.svg" alt="" />
            <img v-else src="../assets/eye-slash.svg" alt=""
          /></el-button>
          <el-button class="svgCss" type="info" plain size="mini">
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
            :disabled="activeLayer==1"
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
            type="info" plain
            @click="addLayerOrMask"
            class="add"
            >add</el-button
          >
          <el-button
            style="margin: 2px"
            size="small"
            type="info" plain
            @click="setStyle"
            >样式</el-button
          >
          <el-button
            style="margin: 2px"
            size="small"
            type="info" plain
            @click="setAttri"
            >属性</el-button
          >
          <el-button
            style="margin: 2px"
            size="small"
            type="info" plain
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
      <p>线&emsp;&emsp;宽&emsp;:&emsp;&emsp;<input style="width:110px" v-model="style.lineWidth" /><br /></p>
      <p>涂抹/边框&ensp;:&emsp;&emsp;<input style="width:120px" type="color" v-model="style.strokeStyle" /><br /></p>
      <p v-show="fillstyleVisible"> 填&ensp;充&ensp;色&emsp;:&emsp;&emsp;<input
        style="width:120px"
        type="color"
        v-model="style.fillStyle"
      /><br /></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setStyle1">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择图层类别对话框 -->
    <el-dialog title="选择要添加得图层类别" :visible.sync="addLOMVisible" center>
      <div slot="footer" class="dialog-footer" style= "margin-right:10px">
        <el-button @click="addLayer">标注图层</el-button>
        <el-button @click="addMaskLayer">涂抹图层</el-button>
      </div>
    </el-dialog>
    <!-- 视线追踪菜单框 -->
    <el-dialog title="视线追踪" :visible.sync="manipulategaze" center>
      <el-switch
        :v-model="params.gazestate"
        active-text="追踪开启"
        inactive-text="追踪关闭"
        @change="gazestatechange"
      />
      <el-button @click="jumptogaze">重新标定</el-button>
      <el-button @click="accuracytest">准确度测试</el-button>
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
        <el-button type="primary" @click="addAttri">添 加</el-button>
        <el-button @click="delAttri0">删 除</el-button>
        <el-button @click="SaveAttri0">保 存</el-button>
        <el-button @click="SelAttri0">选 择</el-button>
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 定</el-button
        >
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
    <!-- <el-dialog title="录音" :visible.sync="dialogRecordVisible" width="30%">
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
    </el-dialog> -->
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
      recognition: null,
      recording: false,
      order: 0, //记录当前选中的属性值
      formid: "", //记录当前选中的属性
      drawType:0,//魔棒类别0表示点集显示
      atPixel:{}, //魔棒中在图片中点击的点坐标
      tol:20,//魔棒中的容差
      layers_stroke:[],//各个图层的边框颜色，为了记录涂抹层颜色的变化
      layer_fill:'',//当前样式的填充色
      isMaginWind : false,
      id: 0,
      gMap: "",
      gazedot: "",
      isButton: true,
      isFold: true,
      // divWidth: "width:230px",
      // foldSymbol: ">>",
      foldSymbol: ">",
      layers: [
        {
          id: "first-layer-mask",
          allFeatures: [],
          exit: true,
          svgcode:
            "M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z",
          imgArr:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F29381f30e924b899e7b98bc669061d950b7bf643.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638415117&t=10ad7679c9c07316fa9ecb143a1e813e",
          name: "涂抹层",
          style: {},
          type: "DRAWMASK",
        },
      ],
      attrissName: "",
      activeLayer: 0,
      drawingStyle: {}, // 绘制过程中样式
      tolVisible: false,//魔棒的容差显示
      fillstyleVisible: true,//样式中的fillstyle
      addLOMVisible: false, //添加标注图层或者涂抹图层
      dialogVisible: false,
      manipulategaze:false,//视线追踪提示框
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
        // {
        //   label: "平移",
        //   logoImg:
        //     "M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025zg",
        //   value: "PAN",
        // },
        {
          label: "点",
          logoImg: "M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
          value: "POINT",
        },
        {
          label: "线段",
          logoImg:
            "M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z",
          value: "LINE",
        },
        {
          label: "多线段",
          logoImg:
            "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z",
          value: "POLYLINE",
        },
        {
          label: "矩形",
          logoImg:
            "M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z",
          value: "RECT",
        },
        {
          label: "多边形",
          logoImg:
            "M14 4.577v6.846L8 15l-6-3.577V4.577L8 1l6 3.577zM8.5.134a1 1 0 0 0-1 0l-6 3.577a1 1 0 0 0-.5.866v6.846a1 1 0 0 0 .5.866l6 3.577a1 1 0 0 0 1 0l6-3.577a1 1 0 0 0 .5-.866V4.577a1 1 0 0 0-.5-.866L8.5.134z",
          value: "POLYGON",
        },
        {
          label: "圆",
          logoImg:
            "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z",
          value: "CIRCLE",
        },
        // {
        //   label: "涂抹",
        //   logoImg:
        //     "M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z",
        //   value: "DRAWMASK",
        // }
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
      recorder: new Recorder({
        sampleBits: 16, // 采样位数，范围8或16
        sampleRate: 16000, // 采样率，范围11025、16000、22050、24000、44100、48000
        numChannels: 1, // 声道，范围1或2
      }),
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
          this.drawingStyle = {
            strokeStyle: this.style.strokeStyle,
            fillStyle: this.style.fillStyle,
            lineWidth: this.style.lineWidth,
          };
          this.gMap.setDrawingStyle(this.drawingStyle);
          break;
        }
        case "CLEARMASK": {
          this.drawingStyle = { fillStyle: "#00f", lineWidth: 30 };
          this.gMap.setDrawingStyle(this.drawingStyle);
          break;
        }
        default:
          break;
      }
    },
    //折叠图片，改变toolbar的width
    foldToolbar() {
      // if (this.foldSymbol == ">>") {
      if (this.foldSymbol == ">") {
        // this.foldSymbol = "<<";
        this.foldSymbol = "<";
        this.isFold = !this.isFold;
      } else {
        // this.foldSymbol = ">>";
        this.foldSymbol = ">";
        this.isFold = !this.isFold;
      }
    },
    //
    closeTol(){
      this.tolVisible = false;
      // let that = this;
      // setTimeout("that.tolVisible = false",5000)
    },
    // 魔棒工具，22.4.13修改
    magicWind(){
      this.tolVisible = true;
      setTimeout(() => {this.closeTol()}, 4000);
      this.isMaginWind = true;
      this.setMode("POINT");
      console.log(this.atPixel.x, this.atPixel.y);

      if(this.atPixel.x == -1 && this.atPixel.y == -1){
      }else if(this.atPixel.x<0||this.atPixel.y<0){
        this.$message({
          message: "请在图片上进行点击",
          type: "error",
        });
      }else if(this.atPixel.x>=0&&this.atPixel.y>=0){
        //将点this.atPixel，img，tol传送，并且获得点集pixels
        // let tol = 2;
        console.log("容差为：",this.tol)
        // let alpha = 2;
        // this.drawType = 1; //0表示点集显示，1表示显示多边形
        // let temp = {
          //   url : this.activeImage,
        //   x : this.atPixel.y/354*500,
        //   y : this.atPixel.x/500*354,
        //   tol : this.tol,
        //   alpha : alpha,
        //   type : this.drawType,
        // };
        // 将图片中的黑色改成用户设置的颜色
        let x = this.atPixel.x;
        let y = this.atPixel.y;
        console.log("点击的位置：",x,y);
        let maskImageURL = this.imgUrl[this.id].url;
        // maskImageURL变后处理图像
        console.log("maskImageURL的值改变了！变为", maskImageURL);
        let image = new Image();
        image.src = maskImageURL;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        let width = 500;
        let height = 354;
        let flag = 0;//判断执行了几次
        canvas.width = width;
        canvas.height = height;
        let that = this;
        new Promise(function (resolve, reject) {
          image.onload = function () {
            // drawImage
            image.crossOrigin = "Anonymous";
            ctx.drawImage(image, 0, 0, width, height);
            // let point = that.gMap.transformScreenToGlobal({x, y})
            // x = point.x;
            // y = point.y;
            // console.log("x,y",x,y);
            // 改了
            console.log('黑色变指定色');
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let c = ctx.getImageData(x, y, 1, 1).data;
            let red = c[0];
            let green = c[1];
            let blue = c[2];
            console.log("点击的点的颜色值为：",red,green,blue);
            console.log("style",that.style.strokeStyle);
            console.log("r = "+ parseInt('0x' + that.style.strokeStyle.slice(1, 3)) + 'g = ' + parseInt('0x' + that.style.strokeStyle.slice(3, 5)) + 'b =' + parseInt('0x' + that.style.strokeStyle.slice(5, 7)));
            for(let i = 0; i < imageData.data.length; i += 4) {
                let redDif = Math.abs(red-imageData.data[i]);
                let greenDif = Math.abs(green-imageData.data[i+1]);
                let blueDif = Math.abs(blue-imageData.data[i+2]);
                if(redDif <= that.tol && greenDif <= that.tol && blueDif <= that.tol){
                  imageData.data[i] = parseInt('0x' + that.style.strokeStyle.slice(1, 3)),       //r
                  imageData.data[i + 1] = parseInt('0x' + that.style.strokeStyle.slice(3, 5)),   //g
                  imageData.data[i + 2] = parseInt('0x' + that.style.strokeStyle.slice(5, 7))   //b
                }else{
                  imageData.data[i + 3] = 0
                }
            }
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL());
            flag++;
            console.log("canvas.toDataURL()=",canvas.toDataURL(),'flag=',flag)
            // let isAdd = false;
            if(flag == 2){
              console.log(" 1111   canvas.toDataURL()=",canvas.toDataURL(),'flag=',flag)
              const gFirstMaskImageAction = new AILabel.Mask.Image(
              Date.now(), // id
              '钢笔',
              {
                src: canvas.toDataURL(),
                width: 500,
                height: 354,
                crossOrigin: false,
                position: { // 图片左上角坐标
                    x: 0,
                    y: -1
                }
              }, // imageInfo
              {}
              );
              that.gMap.getLayers()[that.activeLayer].addAction(gFirstMaskImageAction);
              // isAdd = true;
              console.log("刷新缩略图");
              that.setMode("DRAWMASK");
              that.exportLayer(that.activeLayer - 1);
            }
            // if (isAdd){

            // }
            };
          image.onerror = function () {
            reject(new Error('resize image error'));
          }
        })

      }
    },
    // 导出涂抹图片
    async exportDrawImage() {
      // const bounds = this.gMap.centerAndZoom({center: {x,y}, zoom: 1000});
      // let lay = this.gMap.getLayers()[1];
      let lay = this.gMap.getLayers()[this.activeLayer];
      this.gMap.centerAndZoom({center: {x:250,y:177}, zoom: 1000});
      const imagedata = await this.gMap.exportLayersToImage(
        // { x: 0, y: 0, width: 500, height: 354 },
        // { x: 0, y: 0, width: 475, height: 336  },
        { x: 0, y: 0, width: 485, height: 342 },
        { layers: [lay],  type: "base64", format: "image/png" }
      );
      const imageDom = new Image();
      imageDom.src = imagedata;
      let aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = imageDom.src;
      aLink.download = "export.png";
      // 触发点击-然后移除
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
    },
    //涂抹图片回显
    showDraw(){
      let aLink = document.createElement("input");
      aLink.id = "inputPng";
      aLink.style.display = "none";
      aLink.type = "file";
      aLink.accept = "image/png";
      // 触发点击-然后移除
      document.body.appendChild(aLink);
      aLink.click();
      let thePng = document.getElementById("inputPng");
      let file;  //file为获取到的png图片
      let maskImageURL;
      let dataURL;
      let that = this;
      thePng.onchange = function(){
        file = thePng.files;
        if (file[0].type != "image/png"){
          alert("请选择PNG图片");  //选择的不是png图片给出提示
        }else{
          console.log(file);
          var fd = new FormData();
          let imgUrl = [];
          for (var i = 0; i < this.files.length; i++) {
            fd.append("file", this.files[i]);
          }
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "api/receiveFiles");
          xhr.send(fd);
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.response);
                const xh = new XMLHttpRequest();
                xh.open("GET", "api/obtainAllImg/");
                xh.send();
                xh.onreadystatechange = function () {
                  if (xh.readyState === 4) {
                    if (xh.status >= 200 && xhr.status < 300) {
                      let result = JSON.parse(xh.response);
                      console.log("result", result);
                      for (i in result) {
                          imgUrl.push({ id: i, url: result[i] });
                      }
                      console.log(imgUrl);
                      // 将图片中的黑色改成用户设置的颜色
                      maskImageURL = imgUrl[0].url;
                      // maskImageURL变后处理图像
                      console.log("maskImageURL的值改变了！变为", maskImageURL);
                      let image = new Image();
                      image.src = maskImageURL;
                      var canvas = document.createElement('canvas');
                      var ctx = canvas.getContext('2d');
                      let width = 500;
                      let height = 354;
                      let flag = 0;//判断执行了几次
                      canvas.width = width;
                      canvas.height = height;
                      new Promise(function (resolve, reject) {
                        image.onload = function () {
                          // drawImage
                          image.crossOrigin = "Anonymous";
                          ctx.drawImage(image, 0, 0, width, height);
                          // 改了
                          console.log('黑色变指定色');
                          let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                          console.log("style",that.style.strokeStyle);
                          console.log("r = "+ parseInt('0x' + that.style.strokeStyle.slice(1, 3)) + 'g = ' + parseInt('0x' + that.style.strokeStyle.slice(3, 5)) + 'b =' + parseInt('0x' + that.style.strokeStyle.slice(5, 7)));
                          for(let i = 0; i < imageData.data.length; i += 4) {
                              // 当该像素不透明时，则设置成指定的颜色
                              if(imageData.data[i + 3] != 0) {
                                imageData.data[i] = parseInt('0x' + that.style.strokeStyle.slice(1, 3)),       //r
                                imageData.data[i + 1] = parseInt('0x' + that.style.strokeStyle.slice(3, 5)),   //g
                                imageData.data[i + 2] = parseInt('0x' + that.style.strokeStyle.slice(5, 7))   //b
                              }
                          }
                          ctx.putImageData(imageData, 0, 0);
                          resolve(canvas.toDataURL());
                          flag++;
                          console.log("canvas.toDataURL()=",canvas.toDataURL(),'flag=',flag)
                          // let isAdd = false;
                          if(flag == 2){
                            console.log(" 1111   canvas.toDataURL()=",canvas.toDataURL(),'flag=',flag)
                            const gFirstMaskImageAction = new AILabel.Mask.Image(
                            Date.now(), // id
                            '钢笔',
                            {
                              src: canvas.toDataURL(),
                              width: 500,
                              height: 354,
                              crossOrigin: false,
                              position: { // 图片左上角坐标
                                  x: 0,
                                  y: -1
                              }
                            }, // imageInfo
                            {}
                            );
                            that.gMap.getLayers()[that.activeLayer].addAction(gFirstMaskImageAction);
                            // isAdd = true;
                            console.log("刷新缩略图");
                            that.setMode("DRAWMASK");
                            that.exportLayer(that.activeLayer - 1);
                          }
                          // if (isAdd){

                          // }
                          };
                        image.onerror = function () {
                          reject(new Error('resize image error'));
                        };
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
      document.body.removeChild(aLink);

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
      for (let j = 1; j < this.layers.length; j++) {
        allFeatures += "lay:\n";
        allFeatures += this.layers[j].name;
        allFeatures += "\n";
        console.log(this.gMap.getLayers());
        let gFirstFeatureLayer = this.gMap.getLayers()[j + 1];
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
      if (this.layers.length > 1) {
        this.$alert("已存在其他图层，请在除默认图层外无图层情况下回显数据");
        return;
      }
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
          for (let k = 1; k < this.layers.length; k++) {
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
              this.layers[number].type = type;
              let arrFilter = this.types.filter(
                      (ele) => ele.value == this.layers[number].type
              );
              this.layers[number].svgcode = arrFilter[0].logoImg;
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
              this.layers[this.layers.length - 1].type = type;
              let arrFilter = this.types.filter(
                      (ele) => ele.value == this.layers[this.layers.length - 1].type
              );
              this.layers[this.layers.length - 1].svgcode =
                      arrFilter[0].logoImg;
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
        for (let i = 1; i < this.layers.length; i++) {
          this.exportLayer(i);
        }
      };
    },
    hide(index) {
      const gFirstFeatureLayer = this.gMap.getLayers()[index + 1];
      if (this.layers[this.index].type == "DRAWMASK") {
        gFirstFeatureLayer.removeAllActions();
      } else {
        gFirstFeatureLayer.removeAllFeatures();
      }
    },
    backMe(index) {
      const gFirstFeatureLayer = this.gMap.getLayers()[index + 1];
      if (this.layers[this.index].type == "DRAWMASK") {
        for (let i = 0; i < this.layers[index].allFeatures.length; i++) {
          gFirstFeatureLayer.addAction(this.layers[index].allFeatures[i]);
        }
      } else {
        for (let i = 0; i < this.layers[index].allFeatures.length; i++) {
          gFirstFeatureLayer.addFeature(this.layers[index].allFeatures[i]);
        }
      }
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
      // this.activeLayer = index + 1;
      // this.drawingStyle = this.layers[index].style;
      // this.setMode(this.layers[index].type);
      // 如果是涂抹涂层的话，要判断一下颜色
      // 颜色为初始值，则要选定颜色。
      // 颜色不是初始值，则将涂抹颜色赋给当前的样式
      console.log("layers_stroke",this.layers_stroke);
      if(this.layers[index].type == "DRAWMASK"){
        console.log(!this.layers[index].style.hasOwnProperty('stroksStyle'));
        if(!this.layers[index].style.hasOwnProperty('strokeStyle')){
          this.activeLayer = index + 1;
          this.setMode("PAN");
          this.$alert('请先确定涂抹颜色！');
        }else if(this.layers[index].style.strokeStyle != 'unknow'){
          console.log("已经存在边框颜色",this.layers[index].style.strokeStyle);
          this.activeLayer = index + 1;
          this.drawingStyle.strokeStyle = this.layers_stroke[index];
          this.layers[index].style.strokeStyle = this.layers_stroke[index];
          this.style.strokeStyle = this.layers_stroke[index];
          this.setMode(this.layers[index].type);
        }
      }else{
        this.activeLayer = index + 1;
        this.drawingStyle = this.layers[index].style;
        this.setMode(this.layers[index].type);
      }
    },
    addLayerOrMask(){
      this.addLOMVisible = true;
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
      this.addLOMVisible = false;
    },
    // 添加涂抹层
    addMaskLayer() {
      const id = this.layers.length + "";
      // const FeatureLayer = new AILabel.Layer.Feature(
      //   id, // id
      //   { name: "矢量图层" }, // props
      //   { zIndex: 20 } // style
      // );
      // this.gMap.addLayer(FeatureLayer);
      const MaskLayer = new AILabel.Layer.Mask(
        'first-layer-mask', // id
        {name: '涂抹图层'}, // props
        {zIndex: 11, opacity: .5} // style
      );
      this.gMap.addLayer(MaskLayer);
      this.layers.push({
        id: id,
        allFeatures: [],
        svgcode:
            "M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z",
        exit: true,
        name: id + "",
        style: {},
        type: "DRAWMASK",
      });
      this.addLOMVisible = false;
    },
    //改变缩略图颜色
    changePicColor(index){
      let color = this.layers_stroke[this.index];
      console.log("r = "+ parseInt('0x' + color.slice(1, 3)) + 'g = ' + parseInt('0x' + color.slice(3, 5)) + 'b =' + parseInt('0x' + color.slice(5, 7)));
      let image = new Image();
      image.src = this.layers[index].imgArr;
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      let width = 500;
      let height = 354;
      let flag = 0;//判断执行了几次
      canvas.width = width;
      canvas.height = height;
      let that = this;
      new Promise(function (resolve, reject) {
        image.onload = function () {
          // drawImage
          image.crossOrigin = "Anonymous";
          ctx.drawImage(image, 0, 0, width, height);
          // 改了
          console.log('黑色变指定色');
          let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for(let i = 0; i < imageData.data.length; i += 4) {
              // 当该像素不透明时，则设置成指定的颜色
              if(imageData.data[i + 3] != 0) {
                imageData.data[i] = parseInt('0x' + color.slice(1, 3)),       //r
                imageData.data[i + 1] = parseInt('0x' + color.slice(3, 5)),   //g
                imageData.data[i + 2] = parseInt('0x' + color.slice(5, 7))   //b
              }
          }
          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL());
          flag++;
          console.log("canvas.toDataURL()=",canvas.toDataURL(),'flag=',flag)
          // let isAdd = false;
          if(flag == 2){
            console.log(" 1111   canvas.toDataURL()=",canvas.toDataURL(),'flag=',flag)
            const gFirstMaskImageAction = new AILabel.Mask.Image(
            Date.now(), // id
            '钢笔',
            {
              src: canvas.toDataURL(),
              width: 500,
              height: 354,
              crossOrigin: false,
              position: { // 图片左上角坐标
                  x: 0,
                  y: -1
              }
            }, // imageInfo
            {}
            );
            // console.log(that.gMap.getLayers()[that.activeLayer].actions);
            that.gMap.getLayers()[that.activeLayer].actions = [];
            that.gMap.getLayers()[that.activeLayer].addAction(gFirstMaskImageAction);
            console.log(that.gMap.getLayers()[that.activeLayer]);
            console.log(that.gMap.getLayers()[that.activeLayer].actions);
            console.log("刷新缩略图");
            that.setMode("DRAWMASK");
            that.exportLayer(that.activeLayer - 1);
          }
        };
        image.onerror = function () {
          reject(new Error('resize image error'));
        };
      });

    },
    setStyle1() {
      // this.layers[this.index].style = this.style;
      // this.dialogVisible = false;
      // if (this.activeLayer == this.index + 1) {
      //   this.drawingStyle = this.layers[this.index].style;
      // }
      // //console.log(this.layers[this.index].style);
      // 如果是涂抹涂层的话，要判断一下颜色
      // 将所有的颜色改为指定颜色。
      // 颜色不是初始值，则将涂抹颜色赋给当前的样式
      if(this.layers[this.index].type == "DRAWMASK" && this.layers[this.index].style.hasOwnProperty('strokeStyle')){
        if(this.layers_stroke[this.index] != this.style.strokeStyle){
          // this.style.strokeStyle = this.layers[this.index].style.strokeStyle;
          // this.setMode("PAN");
          // this.$alert("此操作会更改当前涂抹涂层的颜色，是否继续");
          this.$confirm("此操作会更改当前涂抹涂层的颜色，是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // 将缩略图颜色改为指定颜色添加到图片中
              this.layers_stroke[this.index] = this.style.strokeStyle;
              this.layers[this.index].style = this.style;
              this.changePicColor(this.index);
              this.dialogVisible = false;
              if (this.activeLayer == this.index + 1) {
                this.drawingStyle = this.layers[this.index].style;
              }
              this.active(this.index);
            })
            .catch(() => {
              this.layers[this.index].style.strokeStyle = this.layers_stroke[this.index];
              this.style.strokeStyle = this.layers_stroke[this.index];
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        }else{
          // 只改了宽度，没有改颜色
          this.layers[this.index].style = this.style;
          this.dialogVisible = false;
          if (this.activeLayer == this.index + 1) {
            this.drawingStyle = this.layers[this.index].style;
          }
          this.active(this.index);
        }
      }else{
        // 不是涂抹层或者是涂抹层但是还没有设定颜色值
        // console.log("layers",this.layers[this.index].style.strokeStyle);
        // console.log(this.style.strokeStyle);
        this.layers_stroke[this.index] = this.style.strokeStyle;
        this.layers[this.index].style = this.style;
        this.dialogVisible = false;
        if (this.activeLayer == this.index + 1) {
          this.drawingStyle = this.layers[this.index].style;
        }
        this.active(this.index);
        //console.log(this.layers[this.index].style);
      }
    },
    setStyle(index) {
      // this.dialogVisible = true;
      // this.index = this.activeLayer - 1;
      // 在设置样式前，把所有图层的边框颜色记录下来
      this.dialogVisible = true;
      this.index = this.activeLayer - 1;
      //如果是涂抹图层则不显示fillstyle
      if(this.layers[this.index].type == "DRAWMASK"){
        this.fillstyleVisible = false;
        for (let i = 0; i<this.layers.length; i++){
          if(this.layers[i].style.hasOwnProperty('strokeStyle')){
            // this.layers_stroke[i] = this.layers[i].style.strokeStyle;
          }else{
            this.layers_stroke[i] = "unknow";
          }
        }
      }else{
        this.fillstyleVisible = true;
      }
    },
    // setAttri1() {
    //   this.dialogFormVisible = false;
    // },
    setAttri() {
      this.dialogFormVisible = true;
      this.formAttris = Object.getOwnPropertyNames(this.form).sort();
    },
    setGaze(){
      this.manipulategaze = true;
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
      if (this.layers[this.activeLayer - 1].type == "DRAWMASK"){
        this.gMap.getLayers()[this.activeLayer].actions = [];
      }
      const id = this.layers[this.activeLayer - 1].id;
      this.gMap.removeLayerById(id);
      this.layers.splice(this.activeLayer - 1, 1);
    },
    checkThis(index) {
      this.id = index;
      this.activeImage = this.imgUrl[index].url.split(
        "api/"
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

      this.layers[0].imgArr =
        "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F29381f30e924b899e7b98bc669061d950b7bf643.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638415117&t=10ad7679c9c07316fa9ecb143a1e813e";
      for (let i = 1; i < this.layers.length; i++) {
        this.layers[i].imgArr =
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F29381f30e924b899e7b98bc669061d950b7bf643.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638415117&t=10ad7679c9c07316fa9ecb143a1e813e";
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
      for (let j = 1; j < this.layers.length; j++) {
        allFeatures += "lay:\n";
        allFeatures += this.layers[j].name;
        allFeatures += "\n";
        let gFirstFeatureLayer = this.gMap.getLayers()[j + 1];
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
      if (this.layers.length > 1) {
        this.$alert("已存在其他图层，请在除默认图层外无图层情况下回显数据");
        return;
      }
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
          for (let k = 1; k < this.layers.length; k++) {
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
              this.layers[this.layers.length - 1].type = type;
              let arrFilter = this.types.filter(
                      (ele) => ele.value == this.layers[this.layers.length - 1].type
              );
              this.layers[this.layers.length - 1].svgcode =
                      arrFilter[0].logoImg;
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
        for (let i = 1; i < this.layers.length; i++) {
          this.exportLayer(i);
        }
        this.$forceUpdate();
      });
    },
    async exportLayer(index) {
      const lay = this.gMap.getLayers()[index + 1];
      let range = {};
      if (this.gMap.getLayers()[index + 1].type == "MASK") {
        this.gMap.centerAndZoom({center: {x:250,y:177}, zoom: 1000});
        range = { x: 0, y: 0, width: 475, height: 336 };
      } else {
        range = { x: 0, y: 0, width: 500, height: 354 };
      }
      const imagedata = await this.gMap.exportLayersToImage(range, {
        layers: [lay],
        type: "base64",
        format: "image/png",
      });

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
    sert(str, timer) {
      this.$message({
        showClose: true,
        message: str,
        str: timer,
      });
    },
    accuracytest(){
      if(this.params.gazestate){
        this.$router.push('/accuracy');
      }else{
        this.sert("未开启视线追踪", 1000);
      }
    },
    gazestatechange(){
      let self = this;
      if(self.params.gazestate === true){
        self.params.gazestate = false;
        document.getElementById("webgazerVideoContainer").remove();
        document.getElementById("webgazerGazeDot").remove();
        // webgazer.end();
      }else if(self.params.gazestate === false){
        self.params.gazestate = true;
        self.jumptogaze();
      }
    },
    jumptogaze(){
      this.$router.push('/gaze');
      window.location.reload();
    },
    onEnd() {
      console.log('Speech recognition has stopped. Starting again ...');
      this.recognition.start();
      this.recording = true;
    },
    onSpeak(e){
      var flag = 0;
      console.log(e.results[e.results.length-1][0].transcript);
      if(e.results[e.results.length-1][0].transcript.match("点击")){
        flag = 1;
        if(document.getElementById("webgazerGazeDot")){
          var webgazerGazeDot = document.getElementById("webgazerGazeDot");
          var translate = window.getComputedStyle(webgazerGazeDot).transform;
          var left = parseFloat(translate.substring(7).split(',')[4]);
          var top = parseFloat(translate.replace(")", "").substring(7).split(',')[5]);
          document.elementFromPoint(left+7, top).click();
          // console.log(document.elementFromPoint(left+7, top+7));
        }else{
          console.log("dianji");
        }
      }else if(e.results[e.results.length-1][0].transcript.match("下一张")){
        flag = 1;
        if (this.id < this.imgUrl.length) {
          this.checkThis(this.id + 1);
          console.log(this.id);
        } else {
          this.sert("超界", 1000);
        }
      }else if(e.results[e.results.length-1][0].transcript.match("上一张")) {
        flag = 1;
        if (this.id > 0) {
          this.checkThis(this.id - 1);
        } else {
          this.sert("超界", 1000);
        }
      }
      let str = "";
      if(this.attris.length === 0){
        return ;
      }
      for (let i = 0; i < this.attris.length; i++) {
        if(e.results[e.results.length-1][0].transcript.match(this.attris[i].name)){
          console.log("找到该属性了，属性是" + this.attris[i].name);
          str += this.attris[i].name + ":";
          for (let j = 0; j < this.attris[i].opts.length; j++) {
            if(e.results[e.results.length-1][0].transcript.match(this.attris[i].opts[j])){
              console.log(
                      "找到该属性值了，属性值是" +
                      this.attris[i].opts[j]
              );
              flag = 1;
              str += this.attris[i].opts[j] + ";";
              //将form中的对应的属性的属性值换为现在的属性值
              this.form[this.attris[i].name] =
                      this.attris[i].opts[j];
              this.sert("更改成功" + str, 1000);
            }
          }
        }
      }
      if(flag === 0){
        console.log("没听清，再说一次");
      }
    },
    soundRecon(){
      if(this.recording){
        console.log("语音结束");
        this.recognition.onend = null;
        this.recognition.stop();
        this.recording = false;
      }else{
        console.log("语音启动");
        this.recognition.onend = this.onEnd;
        console.log();
        console.log("kaishi");
        this.recognition.start();
        this.recording = true;
      }
    },
    // soundRecon() {
    //   const data = JSON.stringify(this.attris);
    //   console.log(data);
    //   this.$axios({
    //     method: "POST",
    //     url: "api/receiveProperty/",
    //     //
    //     data: data,
    //   }).then((response) => {
    //     console.log(response.data);
    //   });
    //   const recordBtn = document.querySelector(".record-btn");
    //   var timer;
    //   recordBtn.onclick = () => {
    //     console.log("录音器状态：", this.recorder.state);
    //     if (this.recorder.state === "recording") {
    //       this.recorder.stop();
    //       recordBtn.textContent = "语音识别";
    //       console.log("录音结束");
    //       this.recorder.state = "stop";
    //     } else {
    //       this.recorder.start();
    //       console.log("录音中...");
    //       recordBtn.textContent = "停止录音";
    //       this.recorder.state = "recording";
    //       timer = setInterval(() => {
    //         if (this.recorder.state === "stop") clearInterval(timer);
    //         const that = this;
    //         let pcm = this.recorder.getPCMBlob();
    //         let fd = new FormData();
    //         fd.append("file", pcm);
    //         this.$axios({
    //           //请求类型
    //           method: "POST",
    //           //URL
    //           url: "api/speechConvertText/",
    //           //设置请求体
    //           data: fd,
    //         }).then((response) => {
    //           console.log(response.data);
    //           if (response.data == 0) {
    //             // this.sert("没听清，再说一次", 1000);
    //             console.log("没听清，再说一次");
    //           } else {
    //             //that.$alert('关键词是：'+response.data)
    //             let str = "";
    //             for (let i = 0; i < response.data.length; i++) {
    //               if (response.data[i] == "下一张") {
    //                 if (this.id < this.imgUrl.length) {
    //                   this.checkThis(this.id + 1);
    //                   console.log(this.id);
    //                 } else {
    //                   this.sert("超界", 1000);
    //                 }
    //               }
    //               if (response.data[i] == "上一张") {
    //                 if (this.id > 0) {
    //                   this.checkThis(this.id - 1);
    //                 } else {
    //                   this.sert("超界", 1000);
    //                 }
    //               }
    //             }
    //             for (let i = 0; i < response.data.length; i++) {
    //               for (let j = 0; j < this.attris.length; j++) {
    //                 if (response.data[i] == this.attris[j].name) {
    //                   console.log("找到该属性了，属性是" + this.attris[j].name);
    //                   str += this.attris[j].name + ":";
    //                   for (let k = 0; k < response.data.length; k++) {
    //                     for (let l = 0; l < this.attris[j].opts.length; l++) {
    //                       if (response.data[k] == this.attris[j].opts[l]) {
    //                         console.log(
    //                           "找到该属性值了，属性值是" +
    //                             this.attris[j].opts[l]
    //                         );
    //                         str += this.attris[j].opts[l] + ";";
    //                         //将form中的对应的属性的属性值换为现在的属性值
    //                         this.form[this.attris[j].name] =
    //                           this.attris[j].opts[l];
    //                         this.sert("更改成功" + str, 1000);
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         });
    //         this.recorder.start();
    //       }, 7000);
    //     }
    //     console.log("录音器状态：", this.recorder.state);
    //   };
    // },
    getgazeDot(){
      if(document.getElementById("webgazerGazeDot")){
        this.gazedot = window.getComputedStyle(document.getElementById("webgazerGazeDot")).transform;
      }
    },
  },
  destroyed() {
    this.recognition.removeEventListener('result', that.onSpeak)
  },
  mounted() {
    const that = this;

    window.SpeechRecognition = window.SpeechRecognition ||
            window.webkitSpeechRecognition;
    this.recognition = new window.SpeechRecognition();
    this.recording = false;

    this.recognition.continuous = true;
    this.recognition.lang = "cmn-Hans-CN";
    // this.gazestate = webgazer.params.gazestate;
    this.recognition.addEventListener('result', that.onSpeak);
    console.log(this.recognition);
    console.log(this.recording);

    //初始化容器
    setInterval(that.getgazeDot,1000);

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
      } else if (type === "POINT" && this.isMaginWind) {
        console.log("POINT and MagicWind")
        const gFirstFeatureLayer = new AILabel.Layer.Feature(
          'first-layer-feature', // id
          {name: '第一个矢量图层'}, // props
          {zIndex: 10} // style
        );
        this.gMap.addLayer(gFirstFeatureLayer);
        this.activeLayer = this.layers.length;
        console.log("this.activeLayer", this.activeLayer);
        //画点，得到坐标atPixel
        const pointFeature = new AILabel.Feature.Point(
          Date.now(), // id
          { ...data, sr: 3 }, // shape
          { name: "第一个矢量图层" }, // props
          this.drawingStyle // style
        );
        console.log(this.gMap.getLayers());
        this.gMap.getLayers()[this.activeLayer + 1].addFeature(pointFeature);
        // this.gMap.getLayers()[this.activeLayer + 1].addFeature(pointFeature);
        // this.layers[this.activeLayer - 1].allFeatures.push(pointFeature);
        let item = {};
        item.x = this.gMap.layers[this.gMap.layers.length-1].features[this.gMap.layers[this.gMap.layers.length-1].features.length-1].shape.x;
        item.y = this.gMap.layers[this.gMap.layers.length-1].features[this.gMap.layers[this.gMap.layers.length-1].features.length-1].shape.y;
        this.atPixel = item;
        console.log("画点得到坐标：",this.atPixel.x,this.atPixel.y);
        this.magicWind();
        this.atPixel.x = -1;
        this.atPixel.y = -1;
        console.log(this.atPixel.x);
        this.isMaginWind = false;
        this.tolVisible = false;
        this.setMode("PAN");
        console.log(this.isMaginWind);
        this.gMap.removeLayerById('first-layer-feature');
        //gFirstFeatureLayer.addFeature(pointFeature);
      } else if (type === "POINT") {
        const pointFeature = new AILabel.Feature.Point(
          Date.now(), // id
          { ...data, sr: 3 }, // shape
          { name: "第一个矢量图层" }, // props
          this.drawingStyle // style
        );
        console.log(this.gMap.getLayers());
        this.gMap.getLayers()[this.activeLayer].addFeature(pointFeature);
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
        this.gMap.getLayers()[this.activeLayer].addFeature(circleFeature);
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
        this.gMap.getLayers()[this.activeLayer].addFeature(lineFeature);
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
        this.gMap.getLayers()[this.activeLayer].addFeature(polylineFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(polylineFeature);
      } else if (type === "RECT") {
        const rectFeature = new AILabel.Feature.Rect(
          Date.now(), // id
          data, // shape
          { name: "矢量图形" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer].addFeature(rectFeature);
        this.layers[this.activeLayer - 1].allFeatures.push(rectFeature);
      } else if (type === "POLYGON") {
        const polygonFeature = new AILabel.Feature.Polygon(
          Date.now(), // id
          { points: data }, // shape
          { name: "矢量图形" }, // props
          this.drawingStyle // style
        );
        this.gMap.getLayers()[this.activeLayer].addFeature(polygonFeature);
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
        this.gMap.getLayers()[this.activeLayer].addAction(drawMaskAction);
        this.layers[this.activeLayer-1].allFeatures.push(drawMaskAction);
      } else if (type === "CLEARMASK") {
        const scale = this.gMap.getScale();
        const width = this.drawingStyle.lineWidth / scale;
        const clearMaskAction = new AILabel.Mask.Clear(
          Date.now(), // id
          { points: data, width } // shape
        );
        this.gMap.getLayers()[this.activeLayer].addAction(clearMaskAction);
        this.layers[this.activeLayer-1].allFeatures.push(clearMaskAction);
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

    // const gFirstFeatureLayer = new AILabel.Layer.Feature(
    //   "first-layer-feature", // id
    //   { name: "第一个矢量图层" }, // props
    //   { zIndex: 10 } // style
    // );
    // this.gMap.addLayer(gFirstFeatureLayer);

    window.onresize = function () {
      this.gMap && this.gMap.resize();
    };

    this.imgUrl = this.$route.query.imgUrl;
    for (let i = 0; i < this.imgUrl.length; i++) {
      let url = this.imgUrl[i].url;
      let element = document.querySelector(
        `.accordion ul li:nth-child(${i + 1})`
      );
      element.style.backgroundImage = 'url("' + url + '")';
    }
  },
  watch: {
    layers: {
      deep: true,
      handler() {
        this.$forceUpdate();
      },
    },
    // gazedot: {
    //   deep: true,
    //   handler(){
    //     var webgazerGazeDot = document.getElementById("webgazerGazeDot");
    //     var translate = window.getComputedStyle(webgazerGazeDot).transform;
    //     var left = parseFloat(translate.substring(7).split(',')[4]);
    //     var top = parseFloat(translate.replace(")", "").substring(7).split(',')[5]);
    //     if(left < 75 && top > 280 && top < 335){
    //       if (this.id > 0) {
    //         this.checkThis(this.id - 1);
    //       } else {
    //         this.sert("超界", 1000);
    //       }
    //     }
    //     if(left > 1200 && top > 280 && top < 335){
    //       if (this.id < this.imgUrl.length) {
    //         this.checkThis(this.id + 1);
    //         console.log(this.id);
    //       } else {
    //         this.sert("超界", 1000);
    //       }
    //     }
    //   }
    // }
  },
};
</script>

<style scoped>
.slider-demo-block {
  /* display: flex; */
  align-items: center;
  width: 500px;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.el-button + .el-button {
  margin-left: 0px;
}

.svgCss {
  height: 28px;
  float: left;
  margin-top: 12px;
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
  background: #f2f3f5;
  border: 1px solid #d5d6d6;
  /* right: -10px; */
  top: 10px;
  border-radius: 4px;
  padding: 5px 12px;
  overflow: hidden;
  font-size: small;
  color: #747679;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
  margin: 0px 10px -1px;
}

#fold_btn_div {
  position: absolute;
  /* top: 50%; */
  margin-left: -10px;
  font-size: 8px;
  width: 10px;
  height: 590px;
  border: 0;
  /* border-left: 1px solid rgb(23, 32, 43, 0.2);
  border-right: 1px solid rgb(23, 32, 43, 0.2);
  border-top: 1px solid rgb(23, 32, 43, 0.2);
  border-bottom: 1px solid rgb(23, 32, 43, 0.2); */
  background: #eff5f7;
  color: rgb(108, 108, 112);
  cursor: pointer;
}

#fold_btn {
  /* /* position: absolute; */
  /* top: 50%; */
  /* /* right: 310px;
  font-size: 8px; */
  width: 10px;
  /* height: 50px; */
  border: 0;
  height: 590px;
  /* border-left: 1px solid rgb(23, 32, 43, 0.2);
  border-top: 1px solid rgb(23, 32, 43, 0.2);
  border-bottom: 1px solid rgb(23, 32, 43, 0.2); */
  border: 1px solid rgb(23, 32, 43, 0.2);
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
  background: #959697;
  border-color: #424242;
  color: #faf6f6;
  text-decoration: none;
}

.attribute {
  margin-left: 10px;
}

.name {
  width: 50px;
}

.lay {
  /* Firefox */
  /* display: -moz-box;
  -moz-box-align: center; */
  /* Safari、Opera 以及 Chrome */
  /* display: -webkit-box;
  -webkit-box-align: center; */
  /* position: absolute; */
  /* margin-left: 10%; */
  border: solid 3px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin: 3px;
  padding: 5px 1px;
}

.active {
  border-color: rgb(12, 12, 12);
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
