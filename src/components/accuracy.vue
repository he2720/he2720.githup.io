<template>
    <div>
        <el-dialog :visible.sync="dialogFormVisible" title="输入测试行列值"
                   :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form :model="form">
                <el-form-item label="行" :label-width="formLabelWidth">
                    <el-input-number v-model="form.hang" autocomplete="off"
                                     :min=1 :max=10 />
                </el-form-item>
                <el-form-item label="列" :label-width="formLabelWidth">
                    <el-input-number v-model="form.lie" autocomplete="off"
                                     :min=1 :max=10 />
                </el-form-item>
                <el-form-item label="点保存次数" :label-width="formLabelWidth">
                    <el-input-number v-model="form.pointnum" autocomplete="off"
                                     :min=1 :max=10 />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm"
                >Confirm</el-button
                >
            </div>
        </el-dialog>
        <div class="pointsDiv" id="myDiv">
            <input type="button" class="test" id="P1" @click="p1click"/>
        </div>
        <div class="go-top" id="go-top">
            <a href="#"></a>
        </div>
    </div>
</template>

<script>
  export default {
    name: "accuracy",
    data(){
      return{
        dialogFormVisible: false,
        formLabelWidth: '140px',
        idd: 0,
        form: {
          hang: 1,
          lie: 1,
          pointnum:1,
        },
      }
    },
    mounted() {
        this.dialogFormVisible = true;
        // console.log(this.dialogFormVisible);
      $("#P1").hide();
      $(".go-top").hide();
    },
    methods:{
        confirm(){
          this.dialogFormVisible = false;
          webgazer.params.m = this.form.hang;
          webgazer.params.n = this.form.lie;
          webgazer.params.fixm = this.form.hang;
          webgazer.params.fixn = this.form.lie;
          webgazer.params.pointnum = this.form.pointnum;
          this.$swal({
            title: "Calculating measurement",
            text: "Please don't move your mouse & stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
            closeOnEsc: false,
            allowOutsideClick: false,
            closeModal: true
          }).then( (isConfirm) => {
            if (isConfirm.value) {
              $(".go-top").show();
              $("#P1").show();
              const that = this;
              // makes the variables true for 5 seconds & plots the points
              console.log(window.getComputedStyle(document.getElementById("P1")).left);
              $(document).ready(function () {
                console.log("lllllllllllllllll");
                webgazer.params.count = setInterval(that.preUpdate, 1100);
              });
            }
          });
        },
      sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
      },
      p1click(){
        var past50 = webgazer.getStoredPoints(); // retrieve the stored points
        var sumx = 0;
        var sumy = 0;
        var xnum = 0;
        var ynum = 0;
        for (var i = 0; i < 50; i++) {
          if (past50[0][i]) {
            xnum++;
            sumx += past50[0][i];
          }
          if (past50[1][i]) {
            ynum++;
            sumy += past50[1][i];
          }
        }
        var x50 = sumx/xnum;
        var y50 = sumy/ynum;
        $("#P1").css('background-color', 'yellow');
        var P1 = document.getElementById("P1");
        if (webgazer.params.fixn === 4 && webgazer.params.fixm === 4) {
          if (webgazer.params.n !== 1) {
            webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
            webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
            this.idd++;
            webgazer.params.n--;
            var P1left = window.getComputedStyle(P1).left;
            var p1leftnum = Number(P1left.replace("px", ""));
            P1.style.left = p1leftnum+307.2+"px";
            $("#P1").show();
          } else if (webgazer.params.m !== 1) {
            webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
            webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
            this.idd++;
            var P1top = window.getComputedStyle(P1).top;
            var p1topnum = Number(P1top.replace("px", ""));
            P1.style.top = p1topnum+167.2+"px";
            P1.style.left = 179.2 + "px";
            webgazer.params.n = webgazer.params.fixn;
            webgazer.params.m--;
            $("#P1").show();
          } else if (webgazer.params.pointnum !== 1){
            webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
            webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
            this.idd++;
            webgazer.params.m = webgazer.params.fixm;
            webgazer.params.n = webgazer.params.fixn;
            P1.style.top = 109.2+"px";
            P1.style.left = 179.2 + "px";
            webgazer.params.pointnum--;
          } else {
            webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
            webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
            this.download("test_origin.txt", webgazer.params.str1);
            this.download("test_predict", webgazer.params.str2);
            $("#P1").hide();
            this.$swal({
              title: "warning",
              text: "测试结束，返回上一页面",
              closeOnEsc: false,
              allowOutsideClick: false,
              closeModal: false
            }).then( (isConfirm) => {
              clearInterval(webgazer.params.count);
              if (isConfirm.value) {
                this.$router.go(-1);
              }
            });
          }
        }else if (webgazer.params.n != 1) {
          webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
          webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
          this.idd++;
          webgazer.params.n--;
          var P1left = window.getComputedStyle(P1).left;
          var p1leftnum = Number(P1left.replace("px", ""));
          var temp = 220/$(window).width()*100;
          P1.style.left = (temp+((100-2*temp)/Number(webgazer.params.fixn-1))*Number(webgazer.params.fixn-webgazer.params.n))+"vw";
          $("#P1").show();
          console.log("--------------------");
          console.log(webgazer.params.n);
          console.log(webgazer.params.m);
          console.log(webgazer.params.pointnum);
          console.log("--------------------");
        } else if (webgazer.params.m != 1) {
          webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
          webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
          this.idd++;
          var y = Number(0.2*$(window).height()-70);
          var temp = $(window).height()/100*90;
          P1.style.top = (70+y+(temp-70-y)/(Number(Number(webgazer.params.fixm)-1))*Number(webgazer.params.fixm-webgazer.params.m+1))+"px";
          P1.style.left = 220 + "px";
          webgazer.params.n = webgazer.params.fixn;
          webgazer.params.m--;
          $("#P1").show();
          console.log("--------------------");
          console.log(webgazer.params.n);
          console.log(webgazer.params.m);
          console.log(webgazer.params.pointnum);
          console.log("--------------------");
        } else if (webgazer.params.pointnum != 1){
          webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
          webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
          this.idd++;
          webgazer.params.m = webgazer.params.fixm;
          webgazer.params.n = webgazer.params.fixn;
          P1.style.top = 109.2+"px";
          P1.style.left = 179.2 + "px";
          webgazer.params.pointnum--;
          console.log("--------------------");
          console.log(webgazer.params.n);
          console.log(webgazer.params.m);
          console.log(webgazer.params.pointnum);
          console.log("--------------------");
        } else {
          console.log("000000000000000001111111111111111");
          webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
          webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
          this.download("test_origin.txt", webgazer.params.str1);
          this.download("test_predict", webgazer.params.str2);
          $("#P1").hide();
          this.$swal({
            title: "warning",
            text: "测试结束",
            closeOnEsc: false,
            allowOutsideClick: false,
            closeModal: true
          }).then( (isConfirm) => {
            clearInterval(webgazer.params.count);
            if (isConfirm.value) {
              this.$router.go(-1);
            }
          });
        }
      },
      preUpdate() {
        this.store_points_variable(); // start storing the prediction points
        this.sleep(1000).then(() => {

          this.stop_storing_points_variable(); // stop storing the prediction points
          // console.log("ladkladjgla");
          var past50 = webgazer.getStoredPoints(); // retrieve the stored points
          var precision_measurement = this.calculatePrecision(past50);
          var sumx = 0;
          var sumy = 0;
          var xnum = 0;
          var ynum = 0;
          for (var i = 0; i < 50; i++) {
            if (past50[0][i]) {
              xnum++;
              sumx += past50[0][i];
            }
            if (past50[0][i]) {
              ynum++;
              sumy += past50[1][i];
            }
          }
          var x50 = sumx/xnum;
          var y50 = sumy/ynum;
          var P1 = document.getElementById("P1");
          var accuracyLabel = "Accuracy | " + precision_measurement + "%<br>" + "windows size | ("
            + $(window).width() + ", " + $(window).height() + ") </a><br>"
            + "now points | (" + window.getComputedStyle(P1).left + ", " + window.getComputedStyle(P1).top + ")<br>"
            + "predict points | (" + x50 + ", " + y50 + ")<br>";
          document.getElementById("go-top").innerHTML = accuracyLabel; // Show the accuracy in the nav bar.
        });
      },


      calculatePrecision(past50Array) {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();

        // Retrieve the last 50 gaze prediction points
        var x50 = past50Array[0];
        var y50 = past50Array[1];

        // Calculate the position of the point the user is staring at
        var staringPointX = Number(window.getComputedStyle(document.getElementById("P1")).left.replace("px", ""));
        var staringPointY = Number(window.getComputedStyle(document.getElementById("P1")).top.replace("px", ""));
        // console.log(staringPointX);
        // console.log(staringPointY);
        var precisionPercentages = new Array(50);
        this.calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY);
        var precision = this.calculateAverage(precisionPercentages);

        // Return the precision measurement as a rounded percentage
        return Math.round(precision);
      },

      calculatePrecisionPercentages(precisionPercentages, windowHeight, x50, y50, staringPointX, staringPointY) {
        for (var x = 0; x < x50.length; x++) {
          // Calculate distance between each prediction and staring point
          var xDiff = staringPointX - x50[x];
          var yDiff = staringPointY - y50[x];
          var distance = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

          // Calculate precision percentage
          var halfWindowHeight = windowHeight / 2;
          var precision = 0;
          if (distance <= halfWindowHeight && distance > -1) {
            precision = 100 - (distance / halfWindowHeight * 100);
          } else if (distance > halfWindowHeight) {
            precision = 0;
          } else if (distance > -1) {
            precision = 100;
          }

          // Store the precision
          precisionPercentages[x] = precision;
        }
      },

      calculateAverage(precisionPercentages) {
        var precision = 0;
        for (var x = 0; x < 50; x++) {
          precision += precisionPercentages[x];
        }
        precision = precision / 50;
        return precision;
      },

      store_points_variable(){
        webgazer.params.storingPoints = true;
      },

      stop_storing_points_variable(){
        webgazer.params.storingPoints = false;
      },

      download(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        if (document.createEvent) {
          var event = document.createEvent('MouseEvents');
          event.initEvent('click', true, true);
          pom.dispatchEvent(event);
        } else {
          pom.click();
        }
      },
    }
  }
</script>

<style scoped>
    .el-button--text {
        margin-right: 15px;
    }
    .el-select {
        width: 300px;
    }
    .el-input {
        width: 300px;
    }
    .dialog-footer button:first-child {
        margin-right: 10px;
    }
    #P1{
        /*top:20vh;*/
        /*left:220px;*/
        top:109.2px;
        left: 179.2px;
        z-index: 1000000;
    }
    .go-top{
        z-index: -1;
        position: fixed;	        /* 设置fixed固定定位 */
        bottom: 20px;		/* 距离浏览器窗口下边框20px */
        right: 20px;		/* 距离浏览器窗口右边框20px */
    }
    .go-top a {
        display: block;			/* 将<a>标签设为块元素，用于美化样式 */
        text-decoration: none;		/* 取消超链接下画线 */
        color: #333;			/* 设置文本颜色 */
        background-color: #f2f2f2;		/* 设置背景颜色 */
        border: 1px solid #ccc;		/* 设置边框样式 */
        padding: 10px 20px;			/* 设置内边距 */
        border-radius: 5px;			/* 设置圆角矩形 */
        letter-spacing: 2px;		/* 设置文字间距 */
    }
    button {
        border-radius: 4px;
    }
    .test{
        width: 20px;
        height: 20px;
        -webkit-border-radius: 25px;
        -moz-border-radius: 25px;
        border-radius: 25px;
        background-color: red;
        opacity: 1;
        border-color: black;
        border-style: solid;
        position:fixed;
    }
    .pointsDiv{
        z-index: 10;
    }
</style>