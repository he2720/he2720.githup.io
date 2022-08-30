<template>
  <div>
    <div class="button-wrap">
      <el-alert
        title="在绘制模式时，双击图形可进行选中编辑；单击未选中图形区域或切换模式会取消选中"
        type="info"
        show-icon
      >
      </el-alert>
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
      <!-- <el-button type="primary" size="small" plain @click="produceImg"
        >导出图片</el-button
      > -->
      <el-button type="info" size="mini" plain @click="jumptogaze"
      >视线追踪</el-button
      >
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
            type="info"
            plain
            size="mini"
            @click="look(index)"
          >
            <img v-if="lay.exit" src="../assets/eye.svg" alt="" />
            <img v-else src="../assets/eye-slash.svg" alt=""
          /></el-button>
          <el-button
            type="info"
            plain
            size="mini"
            style="height: 28px; float: left; margin-top: 12px"
          >
            {{ lay.type }}
          </el-button>
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
            type="info"
            @click="setStyle"
            >样式</el-button
          >
          <el-button
            style="margin: 2px"
            size="small"
            type="info"
            @click="submitPicture"
            >提交该图片</el-button
          >
        </div>
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
      id: 0,
      gMap: "",
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
      dialogRecordVisible: false,
      index: 0,
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
      projectImgs: [],
      name: "",
      annotator: "",
      recorder: new Recorder({
        sampleBits: 16, // 采样位数，范围8或16
        sampleRate: 16000, // 采样率，范围11025、16000、22050、24000、44100、48000
        numChannels: 1, // 声道，范围1或2
      }),
    };
  },
  methods: {
    setMode(mode) {
      this.gMap.setMode(mode);
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
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "LINE": {
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "POLYLINE": {
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "RECT": {
          // this.drawingStyle = { strokeStyle: "#0f0", lineWidth: 1 };
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "POLYGON": {
          this.gMap.setDrawingStyle(this.layers[this.activeLayer - 1].style);
          break;
        }
        case "DRAWMASK": {
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

      for (let i = 0; i < this.layers.length; i++) {
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
    sert(str, timer) {
      this.$message({
        showClose: true,
        message: str,
        str: timer,
      });
      // let that = this
      // this.$confirm(str, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'success',
      // }).then(() => {

      // }).catch(() => {

      // });
      // setTimeout(() => {
      //   that.$MessageBox.close(false)  //重要
      // }, timer);
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
        console.log("dianji");
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
    submitPicture() {
      const username = this.annotator;
      const filename = this.activeImage;
      const name = this.name;
      let that = this;
      let map = document.querySelector("#map");
      domtoimage.toPng(map).then(function (dataUrl) {
        var fd = new FormData();
        fd.append("file", dataUrl); //图片
        fd.append("username", username); //标注员姓名
        // fd.append("index", index); //项目index
        fd.append("name", name); //项目名
        fd.append("filename", filename); //图片名

        that
          .$axios({
            //请求类型
            method: "POST",
            //URL
            url: "api/savetaggedpic/",
            //设置请求体
            data: fd,
          })
          .then((response) => {
            console.log(response.data);
            if (response.data == "保存成功") {
              that.$message({
                message: "提交成功",
                type: "success",
              });
            } else {
              that.$message.error("提交失败");
            }
          });
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

    window.SpeechRecognition = window.SpeechRecognition ||
            window.webkitSpeechRecognition;
    this.recognition = new window.SpeechRecognition();
    this.recording = false;

    this.recognition.continuous = true;
    this.recognition.lang = "cmn-Hans-CN";

    this.recognition.addEventListener('result', that.onSpeak);
    console.log(this.recognition);
    console.log(this.recording);

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

    let image = this.$route.query.image;
    let name = this.$route.query.name;
    let data = this.$route.query.username;
    this.annotator=data;
    this.name = name;
    let index = 0;
    this.$axios({
      //请求类型
      method: "POST",
      //URL
      url: "api/getpersonalproject/",
      //设置请求体
      data: data,
    }).then((response) => {
      let data = response.data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].name == name) {
          index = i;
          break;
        }
      }
      let project = JSON.parse(data[index]);
      this.activeImage = image.split("api/")[1];
      for (let i = 0; i < project.marks.length; i++) {
        this.addLayer();
        switch (project.marks[i]) {
          case "点": {
            this.layers[i + 1].type = "POINT";
            // this.types.push({
            //   label: "点",
            //   logoImg: "M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
            //   value: "POINT",
            // });
            break;
          }
          case "线段": {
            this.layers[i + 1].type = "LINE";
            // this.types.push({
            //   label: "线段",
            //   logoImg:
            //     "M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z",
            //   value: "LINE",
            // });
            break;
          }
          case "多线段": {
            this.layers[i + 1].type = "POLYLINE";
            // this.types.push({
            //   label: "多线段",
            //   logoImg:
            //     "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z",
            //   value: "POLYLINE",
            // });
            break;
          }
          case "矩形": {
            this.layers[i + 1].type = "RECT";
            // this.types.push({
            //   label: "矩形",
            //   logoImg:
            //     "M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z",
            //   value: "RECT",
            // });
            break;
          }
          case "多边形": {
            this.layers[i + 1].type = "POLYGON";
            // this.types.push({
            //   label: "多边形",
            //   logoImg:
            //     "M14 4.577v6.846L8 15l-6-3.577V4.577L8 1l6 3.577zM8.5.134a1 1 0 0 0-1 0l-6 3.577a1 1 0 0 0-.5.866v6.846a1 1 0 0 0 .5.866l6 3.577a1 1 0 0 0 1 0l6-3.577a1 1 0 0 0 .5-.866V4.577a1 1 0 0 0-.5-.866L8.5.134z",
            //   value: "POLYGON",
            // });
            break;
          }
          case "圆": {
            this.layers[i + 1].type = "CIRCLE";
            // this.types.push({
            //   label: "圆",
            //   logoImg:
            //     "M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z",
            //   value: "CIRCLE",
            // });
            break;
          }
        }
      }

      this.$axios({
        //请求类型
        method: "POST",
        //URL
        url: "api/retag/",
        //设置请求体
        data: image,
      }).then((response) => {
        image = response.data;
        // 图片层添加
        const gFirstImageLayer = new AILabel.Layer.Image(
          "first-layer-image", // id
          {
            src: image,
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
      });
    });

    window.onresize = function () {
      this.gMap && this.gMap.resize();
    };
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
        if(left < 75 && top > 280 && top < 335){
          if (this.id > 0) {
            this.checkThis(this.id - 1);
          } else {
            this.sert("超界", 1000);
          }
        }
        if(left > 1200 && top > 280 && top < 335){
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
