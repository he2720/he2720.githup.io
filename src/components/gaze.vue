<template>
    <div>
        <canvas id="plotting_canvas" width="500" height="500" style="cursor:crosshair;z-index:-1;background-color: #FAF9DE"></canvas>
        <nav id="webgazerNavbar" class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <!-- The hamburger menu button -->
                        <el-button id='start_calibration' class="icon-bar" data-dismiss="modal" @click="Restart">Recalibrate</el-button>
                        <el-button id='changepage' class="icon-bar" data-dismiss="modal" @click="ChangePage">mark</el-button>
                </div>
            </div>
        </nav>
        <!-- Calibration points -->
        <div class="calibrationDiv">
            <input type="button" class="Calibration" id="Pt1" @click="ptclick($event)"/>
            <input type="button" class="Calibration" id="Pt2" @click="ptclick($event)"/>
            <input type="button" class="Calibration" id="Pt3" @click="ptclick($event)"/>
            <input type="button" class="Calibration" id="Pt4" @click="ptclick($event)"/>
            <input type="button" class="Calibration" id="Pt5" @click="pt5click($event)"/>
            <input type="button" class="Calibration" id="Pt6" @click="ptclick($event)"/>
            <input type="button" class="Calibration" id="Pt7" @click="ptclick($event)"/>
            <input type="button" class="Calibration" id="Pt8" @click="ptclick($event)"/>
            <input type="button" class="Calibration" id="Pt9" @click="ptclick($event)"/>
        </div>
        <div class="pointsDiv" id="myDiv">
            <input type="button" class="test" id="P1" @click="p1click"/>
        </div>
        <div class="go-top" id="go-top">
            <a href="#"></a>
        </div>
    </div>
</template>

<script>
    import "bootstrap/dist/js/bootstrap.min"
    export default {
        name: "gaze",
        data() {
            return {
                idd: 0,
                PointCalibrate: 0,
                CalibrationPoints: {},
            }
        },
        watch:{
            PointCalibrate: function(){
                if (this.PointCalibrate === 8){
                    $("#Pt5").show();
                    webgazer.params.Pt7 = Number(window.getComputedStyle(document.getElementById("Pt7")).top.replace("px", ""));
                }
            }
        },
        destroyed() {
          window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
        },
        mounted() {
          window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
            window.onload = async function() {

                webgazer.params.showVideoPreview = true;
                //start the webgazer tracker
                await webgazer.setRegression('ridge') /* currently must set regression and tracker */
                    //.setTracker('clmtrackr')
                    .setGazeListener(function(data, clock) {
                        //   console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
                        //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
                    })
                    .saveDataAcrossSessions(true)
                    .begin();
                webgazer.showVideoPreview(true) /* shows all video previews */
                    .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
                    .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */

                //Set up the webgazer video feedback.
                var setup = function() {

                    //Set up the main canvas. The main canvas is used to calibrate the webgazer.
                    var canvas = document.getElementById("plotting_canvas");
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    canvas.style.position = 'fixed';
                };
                setup();
            };
            window.saveDataAcrossSessions = true;
            window.addEventListener('resize', this.resize, false);
            this.ClearCanvas();
            this.PopUpInstruction();
            $("#P1").hide();
            $(".go-top").hide();
        },
        methods: {
          beforeunloadHandler(e){
            window.removeEventListener('resize', this.resize, false);
            clearInterval(webgazer.params.count);
          },
            resize() {
                var canvas = document.getElementById('plotting_canvas');
                var context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            },
            ptclick(event){
                console.log("wrng");
                var id = event.currentTarget.id;
                console.log(id);
                if(!this.CalibrationPoints[id]){
                    this.CalibrationPoints[id] = 0;
                }
                this.CalibrationPoints[id]++; // increments values

                if (this.CalibrationPoints[id]===5){ //only turn to yellow after 5 clicks
                    $("#" + event.currentTarget.id).css('background-color','yellow');
                    $("#" + event.currentTarget.id).prop('disabled', true); //disables the button

                    this.PointCalibrate++;
                }else if (this.CalibrationPoints[id]<5){
                    //Gradually increase the opacity of calibration points when click to give some indication to user.
                    var opacity = 0.2*this.CalibrationPoints[id]+0.2;
                    $("#" + event.currentTarget.id).css('opacity',opacity);
                }
            },
            pt5click(event){
                var id = event.currentTarget.id;
                if(!this.CalibrationPoints[id]){
                    this.CalibrationPoints[id] = 0;
                }
                this.CalibrationPoints[id]++;
                if (this.CalibrationPoints[id]===5){ //only turn to yellow after 5 clicks
                    $("#" + event.currentTarget.id).css('background-color','yellow');
                    $("#" + event.currentTarget.id).prop('disabled', true); //disables the button
                    this.PointCalibrate++;
                    $(".Calibration").hide();
                    $(".go-top").show();
                    $("#P1").show();
                    // clears the canvas
                    var canvas = document.getElementById("plotting_canvas");
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

                    var hang = prompt("请输入行数:","");
                    var lie = prompt("请输入列数：", "");
                    webgazer.params.pointnum = prompt("请输入每个点的保存次数：", "");
                    if (hang === "" || lie === "") {
                        this.$swal.showInputError("请填写数字");
                        return false;
                    }else{
                        webgazer.params.m = Number(hang);
                        webgazer.params.n = Number(lie);
                        webgazer.params.fixm = Number(hang);
                        webgazer.params.fixn = Number(lie);
                        // notification for the measurement process
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
                                $(document).ready(function () {
                                    console.log("lllllllllllllllll");
                                    webgazer.params.count = setInterval(that.preUpdate, 1100);
                                });
                            }
                        });
                    }
                }else if (this.CalibrationPoints[id]<5){
                    //Gradually increase the opacity of calibration points when click to give some indication to user.
                    var opacity = 0.2*this.CalibrationPoints[id]+0.2;
                    $("#" + event.currentTarget.id).css('opacity',opacity);
                }
            },
            Restart(){
                $("#P1").hide();
                $(".go-top").hide();
                // document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
                webgazer.clearData();
                this.ClearCalibration();
                this.PopUpInstruction();
                clearInterval(webgazer.params.count);
                webgazer.params.count = 0;
                webgazer.params.fixm = 0;
                webgazer.params.fixn = 0;
                webgazer.params.m = 0;
                webgazer.params.n = 0;
                webgazer.params.str1 = "M     N   T\n";
                webgazer.params.str2 = "M                        N                       T\n";
            },
            ClearCalibration(){
                // Clear data from WebGazer

                $(".Calibration").css('background-color','red');
                $(".Calibration").css('opacity',0.2);
                $(".Calibration").prop('disabled',false);

                this.CalibrationPoints = {};
                this.PointCalibrate = 0;
            },
            ClearCanvas(){
                $(".Calibration").hide();
                var canvas = document.getElementById("plotting_canvas");
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            },
            ShowCalibrationPoint() {
                $(".Calibration").show();
                $("#Pt5").hide(); // initially hides the middle button
            },
            ChangePage() {
                let that = this;
                clearInterval(webgazer.params.count);
                that.params.gazestate = true;
                console.log("shenmogui");
                that.$router.push({
                  path: "/mark1",
                });
                // window.location.reload();
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
                        var str3 = "M     N   T\n";
                        webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
                        webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
                        this.download("test_origin.txt", webgazer.params.str1);
                        this.download("test_predict", webgazer.params.str2);
                        str3 += window.getComputedStyle(document.getElementById("Pt1")).left.replace("px", "") + " " + window.getComputedStyle(document.getElementById("Pt1")).top.replace("px", "") + " " + "1" + "\n";
                        str3 += window.getComputedStyle(document.getElementById("Pt2")).left.replace("px", "") + " " + window.getComputedStyle(document.getElementById("Pt2")).top.replace("px", "") + " " + "2" + "\n";
                        str3 += ($(window).width()-window.getComputedStyle(document.getElementById("Pt3")).right.replace("px", "")) + " " + window.getComputedStyle(document.getElementById("Pt3")).top.replace("px", "") + " " + "3" + "\n";
                        str3 += window.getComputedStyle(document.getElementById("Pt4")).left.replace("px", "") + " " + window.getComputedStyle(document.getElementById("Pt4")).top.replace("px", "") + " " + "4" + "\n";
                        str3 += window.getComputedStyle(document.getElementById("Pt5")).left.replace("px", "") + " " + window.getComputedStyle(document.getElementById("Pt5")).top.replace("px", "") + " " + "5" + "\n";
                        str3 += ($(window).width()-window.getComputedStyle(document.getElementById("Pt6")).right.replace("px", "")) + " " + window.getComputedStyle(document.getElementById("Pt6")).top.replace("px", "") + " " + "6" + "\n";
                        str3 += window.getComputedStyle(document.getElementById("Pt7")).left.replace("px", "") + " " + ($(window).height()-window.getComputedStyle(document.getElementById("Pt7")).bottom.replace("px", "")) + " " + "7" + "\n";
                        str3 += window.getComputedStyle(document.getElementById("Pt8")).left.replace("px", "") + " " + ($(window).height()-window.getComputedStyle(document.getElementById("Pt8")).bottom.replace("px", "")) + " " + "8" + "\n";
                        str3 += ($(window).width()-window.getComputedStyle(document.getElementById("Pt9")).right.replace("px", "")) + " " + ($(window).height()-window.getComputedStyle(document.getElementById("Pt9")).bottom.replace("px", "")) + " " + "9" + "\n";
                        this.download("label_points", str3);
                        $("#P1").hide();
                        this.$swal({
                            title: "warning",
                            text: "测试结束",
                            closeOnEsc: false,
                            allowOutsideClick: false,
                            closeModal: true
                        });
                        clearInterval(webgazer.params.count);
                    }
                }else if (webgazer.params.n != 1) {
                    var left = Number(window.getComputedStyle(P1).left.replace("px", ""));
                    var top = Number(window.getComputedStyle(P1).top.replace("px", ""));
                    var distance = Math.sqrt(Math.pow(left-x50, 2)+Math.pow(top-y50, 2));
                    webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + " " +
                      + distance + "\n";
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
                  var left = Number(window.getComputedStyle(P1).left.replace("px", ""));
                  var top = Number(window.getComputedStyle(P1).top.replace("px", ""));
                  var distance = Math.sqrt(Math.pow(left-x50, 2)+Math.pow(top-y50, 2));
                  webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + " " +
                    + distance + "\n";
                    webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
                    this.idd++;
                    var y = Number(0.2*$(window).height()-70);
                    var temp = Number(Number(webgazer.params.Pt7)-y);
                    P1.style.top = (70+y+(temp-70-y)/(Number(Number(webgazer.params.fixm)-1))*Number(webgazer.params.fixm-webgazer.params.m+1))+"px";
                    P1.style.left = 179.2 + "px";
                    webgazer.params.n = webgazer.params.fixn;
                    webgazer.params.m--;
                    $("#P1").show();
                } else if (webgazer.params.pointnum != 1){
                  var left = Number(window.getComputedStyle(P1).left.replace("px", ""));
                  var top = Number(window.getComputedStyle(P1).top.replace("px", ""));
                  var distance = Math.sqrt(Math.pow(left-x50, 2)+Math.pow(top-y50, 2));
                  webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + " " +
                    + distance + "\n";
                    webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
                    this.idd++;
                    webgazer.params.m = webgazer.params.fixm;
                    webgazer.params.n = webgazer.params.fixn;
                    P1.style.top = 109.2+"px";
                    P1.style.left = 179.2 + "px";
                    webgazer.params.pointnum--;
                } else {
                  var left = Number(window.getComputedStyle(P1).left.replace("px", ""));
                  var top = Number(window.getComputedStyle(P1).top.replace("px", ""));
                  var distance = Math.sqrt(Math.pow(left-x50, 2)+Math.pow(top-y50, 2));
                    var str3 = "M     N   T\n";
                    console.log("000000000000000001111111111111111");
                    webgazer.params.str1 += window.getComputedStyle(P1).left.replace("px", "") + " " + window.getComputedStyle(P1).top.replace("px", "") + " " + this.idd + "\n";
                    webgazer.params.str2 += x50 + " " + y50 + " " + this.idd + "\n";
                    this.download("test_origin.txt", webgazer.params.str1);
                    this.download("test_predict", webgazer.params.str2);
                    str3 += window.getComputedStyle(document.getElementById("Pt1")).left.replace("px", "") + " " + window.getComputedStyle(document.getElementById("Pt1")).top.replace("px", "") + " " + "1" + "\n";
                    str3 += window.getComputedStyle(document.getElementById("Pt2")).left.replace("px", "") + " " + window.getComputedStyle(document.getElementById("Pt2")).top.replace("px", "") + " " + "2" + "\n";
                    str3 += ($(window).width()-window.getComputedStyle(document.getElementById("Pt3")).right.replace("px", "")) + " " + window.getComputedStyle(document.getElementById("Pt3")).top.replace("px", "") + " " + "3" + "\n";
                    str3 += window.getComputedStyle(document.getElementById("Pt4")).left.replace("px", "") + " " + window.getComputedStyle(document.getElementById("Pt4")).top.replace("px", "") + " " + "4" + "\n";
                    str3 += window.getComputedStyle(document.getElementById("Pt5")).left.replace("px", "") + " " + window.getComputedStyle(document.getElementById("Pt5")).top.replace("px", "") + " " + "5" + "\n";
                    str3 += ($(window).width()-window.getComputedStyle(document.getElementById("Pt6")).right.replace("px", "")) + " " + window.getComputedStyle(document.getElementById("Pt6")).top.replace("px", "") + " " + "6" + "\n";
                    str3 += window.getComputedStyle(document.getElementById("Pt7")).left.replace("px", "") + " " + ($(window).height()-window.getComputedStyle(document.getElementById("Pt7")).bottom.replace("px", "")) + " " + "7" + "\n";
                    str3 += window.getComputedStyle(document.getElementById("Pt8")).left.replace("px", "") + " " + ($(window).height()-window.getComputedStyle(document.getElementById("Pt8")).bottom.replace("px", "")) + " " + "8" + "\n";
                    str3 += ($(window).width()-window.getComputedStyle(document.getElementById("Pt9")).right.replace("px", "")) + " " + ($(window).height()-window.getComputedStyle(document.getElementById("Pt9")).bottom.replace("px", "")) + " " + "9" + "\n";
                    this.download("label_points", str3);
                    $("#P1").hide();
                    this.$swal({
                        title: "warning",
                        text: "测试结束",
                        closeOnEsc: false,
                        allowOutsideClick: false,
                        closeModal: true
                    });
                    clearInterval(webgazer.params.count);
                }
            },

            PopUpInstruction(){
                this.ClearCanvas();
                this.$swal({
                    title:"Calibration",
                    text: "Please click on each of the 9 points on the screen. You must click on each point 5 times till it goes yellow. This will calibrate your eye movements.",
                    buttons:{
                        cancel: false,
                        confirm: true
                    }
                }).then((isConfirm) => {
                    if(isConfirm.value)
                        this.ShowCalibrationPoint();
                });
            },
            sleep (time) {
                return new Promise((resolve) => setTimeout(resolve, time));
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
                    // $("#P1").show();
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
                console.log(staringPointX);
                console.log(staringPointY);
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
        },
    }

</script>

<style scoped>
    .go-top {
        position: fixed;	        /* 设置fixed固定定位 */
        bottom: 20px;		/* 距离浏览器窗口下边框20px */
        right: 20px;		/* 距离浏览器窗口右边框20px */
    }
    .modal-open .modal-backdrop {
        opacity: 0.6 !important;
    }
    .modal-open .modal {
        opacity: 0.9 !important;
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
    body {
        min-width:600px!important;
    }

    .modal {
        display: block;
    }

    button {
        border-radius: 4px;
    }
    /* Video Feed Styling */
    #overlay {
        /* Video Feed Styling:
         * Include the !important keyword to override default styles applied by JS.
         * webgazer.js sets defaults for: display, position, top, left, width, height
         */
    }
    #webgazerVideoContainer {
        display: block !important;
        position: fixed !important;
        top: 0px !important;
        left: 0px !important;
        /*width: 320px !important;*/
        /*height: 240px !important;*/
        width: 16vw !important;
        height: 12vh !important;
        z-index: 1;
    }

    /* Navbar styling */
    #webgazerNavbar {
        left: 200px;
        z-index: 0;
        box-shadow: 0px 3px 5px #ddd;
        border:0px;
        background-color: #fff;
    }

    #Accuracy a{
        background-color: #222;
        color: #eee;
        left: -15px;
        padding-left: 80px;
        padding-right: 40px;
    }
    #Accuracy {
        background-color: #222;
        padding-left: inherit;
    }

    li {
        padding-left: 50px;
    }
    .navbar-right li {
        padding-right: 20px;
    }

    .helpBtn {
        padding: 15px;
        border: none;
        background: none;
        color: #777;
    }
    .helpBtn a {
        background: none;
        color: #777;
    }
    .helpBtn a:hover {
        color: black!important;
        text-decoration: none;
    }
    .modal-header {
        border-bottom: none!important;
    }

    /* Calibration button styling */

    .Calibration{
        width: 20px;
        height: 20px;
        -webkit-border-radius: 25px;
        -moz-border-radius: 25px;
        border-radius: 25px;
        background-color: red;
        opacity: 0.2;
        border-color: black;
        border-style: solid;
        position:fixed;
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

    .go-top{
        z-index: -1;
    }
    /* Calibration point position */
    #Pt1{
        top: 70px;
        left:220px;
    }
    #Pt2{
        top: 70px;
        left:50vw;
    }
    #Pt3{
        top: 70px;
        right:2vw;
    }
    #Pt4{
        top:50vh;
        left:2vw;
    }
    #Pt5{
        top: 50vh;
        left: 50vw;
    }
    #Pt6{
        top: 50vh;
        right:2vw;
    }
    #Pt7{
        bottom:2vw;
        left: 2vw;
    }
    #Pt8{
        bottom:2vw;
        left:50vw;
    }
    #Pt9{
        bottom:2vw;
        right:2vw;
    }

    #P1{
        /*top:20vh;*/
        /*left:220px;*/
        top:109.2px;
        left: 179.2px;
        z-index: 1000000;
    }
</style>