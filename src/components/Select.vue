<template>
  <div>
    <a href="javascript:;" class="file"
      >点击上传文件
      <input id="input" type="file" webkitdirectory @change="change" />
    </a>
    <el-button
      type="info"
      id="upload-btn"
      plain
      @click="upload()"
      >提交</el-button
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      files: "",
    };
  },
  methods: {
    change() {
      let file = document.querySelector("input[type=file]");
      console.log(typeof file)
      this.files = file.files;
      this.$alert("上传成功");
    },
    upload() {
      let that = this;
      var fd = new FormData();
      for (var i = 0; i < this.files.length; i++) {
        fd.append("file", this.files[i]);
      }
      console.log(this.files);
      console.log(fd);
      console.log(fd.get("file"))
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
                  let imgUrl = [];
                  for (i in result) {
                    imgUrl.push({ id: i, url: result[i] });
                  }
                  that.$router.push({
                    path: "/mark1",
                    query: {
                      imgUrl: imgUrl,
                    },
                  });
                }
              }
            };
          }
        }
      };
    },
  },
  mounted(){
    window.sessionStorage.setItem("mark", 1);
  }
};
</script>

<style scoped>
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
