<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal-import"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <slot name="header">
            Выберите файл для импорта
            <button
              type="button"
              class="btn btn-link"
              @click="loadImportStudentsTemplates()"
            >
              Скачать шаблон
            </button>
            <button
              type="button"
              class="btn-close"
              @click="close"
              aria-label="Close modal"
            >
              x
            </button>
          </slot>
        </header>
        <div id="app" style="padding: 10px">
          <div>Импорт учеников (обязательно создайте классы до импорта)</div>
          <label>
            <input
              type="file"
              id="files"
              ref="files"
              class="form-control"
              multiple
              v-on:change="handleFilesUpload()"
              style="width: 300px"
            />
            <div v-if="files.type">
              <button @click="createStudents()" class="btn btn-success">
                Создать учеников
              </button>
            </div>
          </label>
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              :aria-valuenow="progress"
              v-bind:style="{ width: progress.toString() + '%' }"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {{ Math.round(progress) }}%
            </div>
          </div>
          <br />
          <div class="table_view" id="printFile"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import * as XLSX from "xlsx";
import TutorialDataService from "../services/TutorialDataService";

export default {
  data() {
    return {
      files: [],
      classList: [],
      studentsList: [],
      progress: 0,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },

    loadImportStudentsTemplates() {
      TutorialDataService.loadImportStudentsTemplates()
        .then((response) => {
          var blob = response.data;

          var contentType = response.data.type;
          var binaryData = [];
          console.log(contentType, response);
          binaryData.push(blob);
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              new Blob([binaryData], { type: contentType }),
              "fileName",
            );
          } else {
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.download = "import_students"; //data.amount + "_" + response.data.fileName;
            link.href = window.URL.createObjectURL(
              new Blob(binaryData, { type: contentType }),
            );
            link.click();
            document.body.removeChild(link);
          }
        })
        .catch((e) => {
          alert("Файла не найдено", e);
        });
    },
    async createStudents() {
      await TutorialDataService.getAllCLass()
        .then(async (response) => {
          this.classList = response.data.map(this.getDisplayClass);
          let check = false;
          for (let i = 0; i < this.studentsList.length; i++) {
            for (let j = 0; j < this.classList.length; j++) {
              if (
                this.studentsList[i].classID === this.classList[j].className
              ) {
                this.studentsList[i].classID = this.classList[j].classID;
                check = true;
              }
            }
            if (!check) {
              delete this.studentsList[i];
            }
            check = false;
          }

          this.studentsList = this.studentsList.filter(Boolean);
          console.log(this.studentsList);
          await this.createStudentDB();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async createStudentDB() {
      alert(
        "Сформировано " +
          this.studentsList.length +
          " записей учеников. Если есть ошибки, пожалуйста проверьте название класса. Создайте новый класс в случае необходимости",
      );
      this.progress = 30;

      let progressTemp = (100 - 30) / this.studentsList.length;
      console.log("processing", this.studentsList.length);
      for (let i = 0; i < this.studentsList.length; i++) {
        var data = {
          classID: this.studentsList[i].classID,
          LastName: this.studentsList[i].LastName,
          FirstName: this.studentsList[i].FirstName,
          Surname: this.studentsList[i].Surname,
          Category: "",
        };

        await TutorialDataService.createStudent(data)
          .then((response) => {
            //this.sClass.id = response.data.id;
            console.log("УСПЕШНО ОТПРАВЛЕНО", response);
            this.progress += progressTemp;
            if (this.progress >= 99.9) {
              var container = document.getElementById("printFile");
              container.innerHTML =
                "<div style='text-align: center; background-color: green; color: white'>УСПЕШНО!</div>";
              console.log(this.progress);
            }
          })
          .catch((e) => {
            console.log("1111111111", e);
            alert(e, "ОШИБКА");
          });
      }
    },
    handleFilesUpload() {
      this.files = this.$refs.files.files[0];
      let obj = [];
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
        document
          .querySelector("#printFile table")
          .classList.add("table_view_students_import");

        let keys = json[0];

        let objTemp = {};
        for (let i = 1; i < json.length; i++) {
          for (let j = 0; j < json[i].length; j++) {
            objTemp[keys[j]] = json[i][j];
            obj[i - 1] = objTemp;
          }
          objTemp = {};
        }
      };
      this.studentsList = obj;
      console.log(obj, this.studentsList);
      reader.readAsArrayBuffer(f);
    },

    getDisplayClass(data) {
      return {
        classID: data._id,
        className: data.className,
      };
    },
  },
};
</script>

<style>
.table_view {
  padding-bottom: 10px;
  padding-top: 10px;
  background: #ffffff;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  max-width: 700px;
  max-height: 240px;

  vertical-align: middle;
  position: relative;
  text-align: left;
  background: #fff;
}
label {
  display: flex;
  justify-content: space-between;
  padding: 5px;
  width: 100%;
}

.table_view_students_import th,
td {
  padding: 0px auto 0px auto;
  text-align: left;
}

.v-row-group__header td {
  background-color: #9370db;
  color: white;
}
.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-import {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  width: 700px;
  height: 450px;

  vertical-align: middle;
  position: relative;
  text-align: left;
  background: #fff;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
  padding: 2px;
}
</style>
