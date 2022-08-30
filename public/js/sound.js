window.SpeechRecognition = window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();
let recording = false;

recognition.continuous = true;
recognition.lang = "cmn-Hans-CN";

let resultstr = "";

function soundRecon() {
  if(recording){
    recognition.onend = null;
    recognition.stop();
    recording = false;
  }else{
    recognition.onend = onEnd;
    recognition.start();
    recording = true;
  }

}

function onEnd() {
  console.log("Speech recognition has stopped. Starting again ...");
  recognition.start();
  recording = true;

}

function onSpeak(e) {
  var flag = 0;
  console.log(e.results[e.results.length-1][0].transcript);
  if(e.results[e.results.length-1][0].transcript.match("点击")){
    flag = 1;
    resultstr = "点击";
    if(document.getElementById("webgazerGazeDot")){
      var webgazerGazeDot = document.getElementById("webgazerGazeDot");
      var translate = window.getComputedStyle(webgazerGazeDot).transform;
      var left = parseFloat(translate.substring(7).split(',')[4]);
      var top = parseFloat(translate.replace(")", "").substring(7).split(',')[5]);
      document.elementFromPoint(left+7, top).click();
      console.log(document.elementFromPoint(left+7, top+7));
    }else{
      console.log("dianji");
    }
  }else if(e.results[e.results.length-1][0].transcript.match("下一张")){
    flag = 1;
    resultstr = "下一张";
    if (id < imgUrl.length) {
      checkThis(id + 1);
      console.log(id);
    } else {
      sert("超界", 1000);
    }
  }else if(e.results[e.results.length-1][0].transcript.match("上一张")) {
    flag = 1;
    resultstr = "上一张";
    if (id > 0) {
      checkThis(id - 1);
    } else {
      sert("超界", 1000);
    }
  }
  let str = "";
  if(attris.length === 0){
    return ;
  }
  for (let i = 0; i < attris.length; i++) {
    if(e.results[e.results.length-1][0].transcript.match(attris[i].name) && attris[i].name != ""){
      console.log("找到该属性了，属性是" + attris[i].name);
      str += attris[i].name + ":";
      for (let j = 0; j < attris[i].opts.length; j++) {
        if(e.results[e.results.length-1][0].transcript.match(attris[i].opts[j])){
          console.log(
            "找到该属性值了，属性值是" +
            attris[i].opts[j]
          );
          flag = 1;
          str += attris[i].opts[j] + ";";
          resultstr = str;
          //将form中的对应的属性的属性值换为现在的属性值
          form[attris[i].name] =
            attris[i].opts[j];
          sert("更改成功" + str, 1000);
        }
      }
    }
  }
  if(flag === 0){
    console.log("没听清，再说一次");
  }
}

recognition.addEventListener('result', onSpeak);

