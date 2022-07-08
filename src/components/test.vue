<template>
  <div id="app">
    <label
      ><div>Импорт учеников (обязательно создайте классы до импорта)</div>
      <input
        type="file"
        id="files"
        ref="files"
        class="form-control"
        multiple
        v-on:change="handleFilesUpload()"
      />
    </label>

    <div id="printFile"></div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      files: [],
    };
  },
  methods: {
    handleFilesUpload() {
      this.files = this.$refs.files.files[0];

      var f = this.files;
      var reader = new FileReader();
      reader.onload = function (e) {
        var data = e.target.result;
        data = new Uint8Array(data);
        var workbook = XLSX.read(data, {
          type: "array",
        });

        /* DO SOMETHING WITH workbook HERE */
        var first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];
        //It will prints with header and contents ex) Name, Home...
        var json = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });
        var container = document.getElementById("printFile");
        container.innerHTML = XLSX.utils.sheet_to_html(worksheet);
        console.log(json);

        let keys = json[0];
        let obj = [];
        console.log("json.length", json.length);
        let objTemp = {};
        for (let i = 1; i < json.length; i++) {
          console.log(json[i].length);
          for (let j = 0; j < json[i].length; j++) {
            console.log(123, json[i][j], keys[j]);
            objTemp[keys[j]] = json[i][j];
            obj[i - 1] = objTemp;
          }
          objTemp = {};
        }
        console.log(obj);
      };
      reader.readAsArrayBuffer(f);
    },
  },
};
</script>
