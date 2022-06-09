<template>
  <div>
    <br />
    <div class="flex-food-main">
      <div class="reciept">
        <div class="flex-food">
          <div>
            <b> Класс</b><b style="color: red">*</b>
            <select
              class="form-select"
              v-model="selectedClassID"
              @change="changeClass(selectedClassID)"
              name="class"
            >
              <option
                v-for="user in sClass"
                :key="user.className"
                v-bind:value="user"
              >
                {{ user.className }}
              </option>
            </select>
          </div>

          <div>
            <b> Ученик </b><b style="color: red">*</b>
            <select
              class="form-select"
              v-model="selectedStudentID"
              @change="changeStudent(selectedStudentID)"
            >
              <option>Все</option>
              <option
                v-for="user in Students"
                :key="user.FirstName"
                v-bind:value="user"
              >
                {{ user.FirstName }} {{ user.LastName }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex-food">
          <div>
            <b> Дата оплаты </b> <b style="color: red">*</b
            ><input
              type="date"
              v-model="date"
              id="date"
              required
              v-on:change="changeDate(date)"
              class="form-control"
            />
          </div>
          <div>
            <b> Идентификатор (СУИП) </b><b style="color: red">*</b
            ><input class="form-control" v-model="identifier" />
          </div>
        </div>
        <div class="flex-food">
          <div>
            <b
              >Сумма квитанции<br />
              (только число)
            </b>
            <b style="color: red">*</b>
            <input type="text" class="form-control" v-model="amount" />
          </div>
          <div style="margin: 24px 0 0 0">
            <b>Период </b> <b style="color: red">*</b>
            <input v-model="period" class="form-control" />
          </div>
        </div>
        <div class="flex-food">
          <div>
            <div>
              <b>Загрузите файл квитанции </b> <b style="color: red">*</b>
            </div>
            <input
              type="file"
              id="file"
              ref="file"
              class="form-control"
              name=""
              v-on:change="handleFileUpload()"
            />
            <br />
          </div>
        </div>
        <div>
          <b>Ученик: </b>{{ selectedStudentID.FirstName }}
          {{ selectedStudentID.LastName }}
          <br />
          <b> Дата: </b>{{ new Date(date).toLocaleDateString() }} <br />
          <b> ID:</b> {{ identifier }} <br />
          <b> Сумма квитанции:</b> {{ amount }} <br />
          <b> Период:</b> {{ period }} <br />
          <b> Файл:</b> {{ file.name }} <br />
        </div>
        <div
          v-if="
            amount != 0 &&
            identifier &&
            selectedStudentID != 'Все' &&
            selectedStudentID != '' &&
            period != '' &&
            file != ''
          "
          class="flex-food"
        >
          <button
            @click="createReciept()"
            id="createReciept"
            class="btn btn-success"
          >
            Создать квитанцию
          </button>
        </div>
        <div v-else class="flex-food">
          <button class="btn btn-success" disabled="true">
            Заполните все поля для создания квитацнии
          </button>
        </div>
      </div>

      <div class="reciept">
        <div class="flex-food-main">
          <div class="flex-food">
            <div>
              <b> Класс</b><b style="color: red">*</b>
              <select
                class="form-select"
                v-model="selectedClassID"
                @change="changeClass(selectedClassID)"
                name="class"
              >
                <option
                  v-for="user in sClass"
                  :key="user.className"
                  v-bind:value="user"
                >
                  {{ user.className }}
                </option>
              </select>
            </div>

            <div>
              <b> Ученик </b><b style="color: red">*</b>
              <select
                class="form-select"
                v-model="selectedStudentID"
                @change="changeStudent(selectedStudentID)"
              >
                <option>Все</option>
                <option
                  v-for="user in Students"
                  :key="user.FirstName"
                  v-bind:value="user"
                >
                  {{ user.FirstName }} {{ user.LastName }}
                </option>
              </select>
            </div>
            <div>
              Расчет по стоимости порции:
              <input type="text" class="form-control" v-model="foodPrice" />
            </div>
          </div>

          <div style="text-align: center">
            <b> Загрузить по диапазону</b>
            <div class="flex-food-main">
              <div class="flex-food-main">
                <div style="width: 30px; padding-top: 6px">От</div>
                <div class="flex" style="width: 220px">
                  <input
                    type="date"
                    v-model="dateFrom"
                    id="date"
                    required
                    class="form-control"
                  />
                </div>
              </div>
              <div class="flex-food-main">
                <div style="width: 30px; padding-top: 6px">До</div>
                <div class="flex" style="width: 220px">
                  <input
                    type="date"
                    v-model="dateBefore"
                    id="date"
                    required
                    class="form-control"
                  />
                </div>
              </div>
              <div class="flex-food-main">
                <div
                  class="flex-food"
                  style="width: 100px; padding: 2px 0 0 5px"
                >
                  <button
                    @click="getRecieptByRangeDate()"
                    class="btn btn-success"
                  >
                    Загрузить
                  </button>
                </div>
              </div>
            </div>
            <br />
          </div>

          <div class="flex-food-main">
            Показать категории в таблице
            <div class="flex-food-main" style="width: 30px">
              <input
                style="width: 30px; height: 20px"
                type="checkbox"
                v-model="showCategory"
              />
            </div>
          </div>
        </div>
        <table class="reciept-table">
          <thead>
            <tr>
              <th scope="col" style="width: 100px">Имя</th>
              <th scope="col">Всего питались</th>
              <th scope="col">Стоимость</th>
              <th scope="col">Денег сдано</th>
              <th scope="col" style="color: red">Долг</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>{{ selectedClassID.className }}</b>
              </td>
              <td>{{ amountFood.amount }}</td>
              <td>{{ amountFood.amount * foodPrice }}</td>
              <td>{{ amountGetReciept }}</td>

              <td
                v-if="amountFood.amount * foodPrice - amountGetReciept"
                :class="{
                  'color-red':
                    amountFood.amount * foodPrice - amountGetReciept > 0,
                  'color-green':
                    amountFood.amount * foodPrice - amountGetReciept <= 0,
                }"
              >
                {{ amountFood.amount * foodPrice - amountGetReciept }}
              </td>
              <td v-else>0</td>
            </tr>

            <tr v-for="item in sCategory" :key="item.message">
              <td v-if="showCategory">{{ item.sCategory }}</td>
              <td v-if="showCategory">{{ item.count }}</td>
              <td v-if="showCategory">{{ item.count * foodPrice }}</td>
              <td v-if="showCategory"></td>
              <td v-if="showCategory"></td>
            </tr>

            <template v-if="!chek">
              <tr v-if="selectedStudentID._id">
                <td style="width: 180px">
                  <b
                    >{{ selectedStudentID.FirstName }}
                    {{ selectedStudentID.LastName }}
                    {{ selectedStudentID.Category }}</b
                  >
                </td>
                <td>{{ selectedStudentID.amount }}</td>
                <td>{{ selectedStudentID.amount * foodPrice }}</td>
                <td>{{ selectedStudentID.amountReciept }}</td>

                <td
                  v-if="
                    selectedStudentID.amount * foodPrice -
                      selectedStudentID.amountReciept <=
                    0
                  "
                  style="color: green"
                >
                  {{
                    selectedStudentID.amount * foodPrice -
                    selectedStudentID.amountReciept
                  }}
                </td>
                <td
                  v-if="
                    selectedStudentID.amount * foodPrice -
                      selectedStudentID.amountReciept >
                    0
                  "
                  style="color: red"
                >
                  {{
                    selectedStudentID.amount * foodPrice -
                    selectedStudentID.amountReciept
                  }}
                </td>
                <!-- <td v-if="!selectedStudentID.amount && !check">0</td> -->
              </tr>
            </template>

            <template v-if="chek">
              <tr v-for="item in Students" :key="item.FirstName">
                <td style="width: 200px">
                  <b
                    >{{ item.FirstName }} {{ item.LastName }}
                    {{ item.Category }}</b
                  >
                </td>
                <td>{{ item.amount }}</td>
                <td>{{ item.amount * foodPrice }}</td>
                <td>{{ item.amountReciept }}</td>
                <td
                  v-if="item.amount * foodPrice - item.amountReciept <= 0"
                  style="color: green"
                >
                  {{ item.amount * foodPrice - item.amountReciept }}
                </td>
                <td
                  v-if="item.amount * foodPrice - item.amountReciept > 0"
                  style="color: red"
                >
                  {{ item.amount * foodPrice - item.amountReciept }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <!-- <div></div> -->
        <!-- <button
          class="btn btn-danger"
          style="padding: -20px -20px -20px -20px"
          @click="check()"
        >
          check
        </button> -->
      </div>
    </div>

    <br />
    <v-data-table
      :headers="headers"
      :items="receipts"
      disable-pagination
      :hide-default-footer="true"
      :loading="loading"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <button
          class="btn btn-primary"
          style="padding-right: 20px; margin-right: 20px"
          @click="downloadReceipt(item)"
        >
          Скачать
        </button>

        <button
          class="btn btn-danger"
          style="padding: -20px -20px -20px -20px"
          @click="deleteReciept(item)"
        >
          Удалить
        </button>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

//import axios from "axios";
export default {
  props: {
    selectedClass: Object,
  },
  data() {
    return {
      showCategory: false,
      loading: false,
      period: "",
      identifier: "",
      date: new Date(), //.toLocaleDateString(),
      dateFrom: new Date(),
      dateBefore: new Date(),
      chek: false,
      sCategory: [],
      foodPrice: 75,
      marks: [],
      amountFood: { amount: 0 },
      amountStudentFood: { amount: 0 },
      file: "",
      month: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Январь"],
      headers: [
        { text: "Фамилия", value: "FirstName" },
        { text: "Имя", value: "lastName" },
        { text: "Дата", value: "datePrint" },
        { text: "ID", value: "identifier" },
        { text: "Период", value: "period" },
        { text: "Сумма", value: "amount" },
        { text: "Действия", value: "actions", sortable: false },
      ],
      receipts: [],
      receiptsAll: [],
      selectedClassID: [{ lastName: "" }],
      selectedStudentID: [],
      amount: 0,
      amountGetReciept: 0,
      sClass: [],
      Students: [],
    };
  },
  methods: {
    // check() {
    //   console.log(this.selectedStudentID);
    // },
    clearFullData() {
      this.marks = [];
      this.amount = 0;
      this.amountGetReciept = 0;
      this.amountStudentFood = {};
      this.amountFood = {};
      this.receipts = [];
      this.receiptsAll = [];
      this.selectedStudentID = [];
      this.Students = [];
    },

    async changeClass(data) {
      this.clearFullData();
      this.loading = true;
      await this.getReciept(data);
      await this.getStudents(data);
      await this.getMarks(data);
      await this.getAmountCategory();
      await this.amountMarksFood();
      this.loading = false;
    },

    async getRecieptByRangeDate() {
      this.clearFullData();
      this.loading = true;
      await this.getRecieptsByRangeDatePOST();
      await this.getStudents(this.selectedClassID);
      await this.getMarksByRangeDatePOST(this.selectedClassID);
      await this.getAmountCategory();
      await this.amountMarksFood();
      this.loading = false;
    },

    async getRecieptsByRangeDatePOST() {
      console.log(this.dateFrom);
      // alert("нажата", this.dateFrom, this.dateBefore);
      this.amountGetReciept = 0;
      let data = {
        classID: this.selectedClassID.classID,
        studentID: this.selectedStudentID._id,
        dateFrom: this.dateFrom,
        dateBefore: this.dateBefore,
      };

      await TutorialDataService.findRecieptByDateRange(data).then(
        (response) => {
          this.receipts.splice(response.data);
          var a = new Array();
          a = Object.values(response.data);
          for (let i = 0; i < a.length; i++) {
            a[i].datePrint = new Date(a[i].date);

            a[i].datePrint = a[i].datePrint.toLocaleDateString();

            this.$set(this.receipts, i, a[i]);
            // this.$set(this.Students[i], amount, 0);
          }
          for (let j = 0; j < this.receipts.length; j++) {
            this.amountGetReciept += this.receipts[j].amount;
          }
        },
      );
      this.receiptsAll = this.receipts;
    },

    async getMarksByRangeDatePOST(ID) {
      await TutorialDataService.findMarksByDateRange({
        classID: ID,
        dateFrom: this.dateFrom,
        dateBefore: this.dateBefore,
      })
        .then((response) => {
          //this.getMarksToPrint(Object.values(response.data));

          this.marks = Object.values(response.data);
          for (let j = 0; j < this.Students.length; j++) {
            this.Students[j].amount = 0;

            for (let i = 0; i < this.marks.length; i++)
              if (
                this.marks[i].studentID === this.Students[j]._id &&
                this.marks[i].causesID === "Питался"
              ) {
                this.Students[j].amount += 1;
              }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async getReciept(data) {
      this.amountGetReciept = 0;
      if (data) {
        await TutorialDataService.findReciept(data)
          .then((response) => {
            this.receipts.splice(response.data);
            var a = new Array();
            a = Object.values(response.data);
            for (let i = 0; i < a.length; i++) {
              a[i].datePrint = new Date(a[i].date);

              a[i].datePrint = a[i].datePrint.toLocaleDateString();

              this.$set(this.receipts, i, a[i]);
              // this.$set(this.Students[i], amount, 0);
            }
            for (let j = 0; j < this.receipts.length; j++) {
              this.amountGetReciept += this.receipts[j].amount;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        await TutorialDataService.findReciept()
          .then((response) => {
            console.log("RECIEPT", response.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      this.receiptsAll = this.receipts;
    },

    deleteReciept(data) {
      let text =
        "Вы действительно хотите удалить квитанцию на сумму " +
        data.amount +
        " рублей с ID " +
        data.identifier;
      var isAdmin = confirm(text);

      if (isAdmin) {
        TutorialDataService.deleteReciept(data._id)
          .then((response) => {
            console.log(response);
            alert("Успешно!");
            this.getRecieptByRangeDate();
            // window.location.reload();
          })
          .catch((e) => {
            alert("Ошибка");
            console.log(e);
          });
      }
    },

    downloadReceipt(data) {
      let dataFile = {
        classID: data.classID,
        studentID: data.studentID,
        date: data.date,
        id: data.identifier,
        className: this.selectedClassID.className,
      };

      TutorialDataService.getFile(dataFile)
        .then((response) => {
          var blob = response.data;
          var contentType = response.data.type; //getResponseHeader("content-type");

          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              new Blob([blob], { type: contentType }),
              "fileName",
            );
          } else {
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.download =
              data.FirstName + "_" + data.amount + "_" + data.fileName; //data.amount + "_" + response.data.fileName;
            link.href = window.URL.createObjectURL(blob);
            link.click();
            document.body.removeChild(link);
          }
        })
        .catch((e) => {
          alert("Файла не найдено");
          console.log(e);
        });
    },

    changeStudent(student) {
      this.loading = true;
      if (student != "Все") {
        this.chek = false;
        this.receipts = [];
        for (let i = 0; i < this.receiptsAll.length; i++) {
          if (this.receiptsAll[i].studentID === student._id) {
            this.receipts.push(this.receiptsAll[i]);
          }
        }
        // document.getElementById("createReciept").disabled = false;
      } else {
        this.receipts = this.receiptsAll;

        this.chek = true;
        // document.getElementById("createReciept").disabled = true;
      }
      this.loading = false;
    },

    async getMarks(ID) {
      await TutorialDataService.findMarks({
        classID: ID,
      })
        .then((response) => {
          //this.getMarksToPrint(Object.values(response.data));

          this.marks = Object.values(response.data);
          for (let j = 0; j < this.Students.length; j++) {
            this.Students[j].amount = 0;

            for (let i = 0; i < this.marks.length; i++)
              if (
                this.marks[i].studentID === this.Students[j]._id &&
                this.marks[i].causesID === "Питался"
              ) {
                this.Students[j].amount += 1;
              }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    //считает по категориям, сколько питалась та или иная категория
    getAmountCategory() {
      for (let j = 0; j < this.sCategory.length; j++) {
        this.sCategory[j].count = 0;
      }
      for (let i = 0; i < this.marks.length; i++) {
        for (let j = 0; j < this.sCategory.length; j++) {
          if (
            this.marks[i].cat === this.sCategory[j].sCategory &&
            this.marks[i].causesID === "Питался"
          ) {
            this.sCategory[j].count += 1;
          }
        }
      }
    },

    amountMarksFood() {
      this.amountFood.amount = 0;
      for (let i = 0; i < this.marks.length; i++) {
        if (this.marks[i].causesID === "Питался") {
          this.amountFood.amount += 1;
        }
      }
    },

    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },

    async createReciept() {
      for (let i = 0; i < this.amount.length; i++) {
        this.amount[i];
      }
      if (this.file) {
        var data = {
          classID: this.selectedClassID.classID,
          studentID: this.selectedStudentID._id,
          date: this.date,
          cat: this.selectedStudentID.Category,
          amount: this.amount,
          identifier: this.identifier,
          period: this.period,
          fileName: this.file.name,
        };
      } else {
        data = {
          classID: this.selectedClassID.classID,
          studentID: this.selectedStudentID._id,
          date: this.date,
          cat: this.selectedStudentID.Category,
          amount: this.amount,
          identifier: this.identifier,
          period: this.period,
          fileName: "NON",
        };
      }
      if (this.file) {
        await this.sendFileToServer();
      }
      TutorialDataService.createReciept(data)
        .then((response) => {
          console.log(response.data);
          alert("Квитанция создана", data);
          this.changeClass(this.selectedClassID);
          //window.location.reload();
        })
        .catch((e) => {
          alert(
            "ОШИБКА, Квитанция не сохранена, повторите попытку позднее. Возможно такой ID уже существует.",
          );
          console.log(e);
        });
    },

    async sendFileToServer() {
      let data = new FormData();
      data.append("file", this.file, this.file.name); // очень важный data.append ("файл", файл); неудачно
      data.append("studentID", this.selectedStudentID._id);
      data.append("date", this.date);
      data.append("id", this.identifier);
      data.append("classID", this.selectedClassID.classID);
      data.append("className", this.selectedClassID.className);

      TutorialDataService.sendFile(data)
        .then(
          (res) =>
            function () {
              console.log("SUCCESS!!", res);
            },
        )
        .catch(
          (res) =>
            function () {
              console.log("FAILURE!!", res.data.files, res.status);
            },
        );
    },
    getStudents(data) {
      TutorialDataService.findStudentByClassID(data)
        .then((response) => {
          this.Students.splice(response.data);
          var a = new Array();
          a = Object.values(response.data);
          for (var i = 0; i < a.length; i++) {
            a[i].amount = 0;
            a[i].amountReciept = 0;
            for (let j = 0; j < this.receipts.length; j++) {
              if (a[i]._id === this.receipts[j].studentID) {
                a[i].amountReciept =
                  a[i].amountReciept + this.receipts[j].amount;
                this.receipts[j].FirstName = a[i].FirstName;
                this.receipts[j].lastName = a[i].LastName;
              }
            }
            this.$set(this.Students, i, a[i]);

            // this.$set(this.Students[i], amount, 0);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    changeDate(value) {
      // let a = new Date(value);
      this.date = value;
    },

    retriveDate() {
      //поставить текущую дату
      document.getElementById("date").value = new Date();
      this.date = new Date().toISOString().slice(0, 10);
      this.dateFrom = new Date().toISOString().slice(0, 10);
      this.dateBefore = new Date().toISOString().slice(0, 10);
      // this.$set(this.sDates, "date", new Date().toISOString().slice(0, 10));
    },

    async retrieveClass() {
      //получить список классов

      await TutorialDataService.getAllCLass()
        .then((response) => {
          this.sClass = response.data.map(this.getDisplayClass);
        })
        .catch((e) => {
          console.log(e);
        });

      if (this.selectedClass.classID != "admin") {
        this.selectedClassID = this.selectedClass;
        this.changeClass(this.selectedClassID);

        var highlightedItems = document.getElementsByName("class");

        highlightedItems.forEach(function (userItem) {
          userItem.disabled = true;
        });
      }
    },
    async retriveCategory() {
      TutorialDataService.getCategory()
        .then((response) => {
          this.sCategory = response.data.map(this.getDispleyCategory);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDispleyCategory(data) {
      return {
        sCategory: data.cat,
        id: data._id,
      };
    },
    getDisplayClass(data) {
      return {
        classID: data._id,
        className: data.className,
      };
    },
  },
  mounted() {
    this.retrieveClass();
    this.retriveCategory();
    this.retriveDate();
  },
  watch: {
    amount: function () {
      //this.amount = this.amount.replace(/[^0-9]+/g, "");
      this.amount = this.amount.toString().replace(/[^\d.]/g, ""); // Удаляем символы, кроме "числа" и "."
      this.amount = this.amount.toString().replace(/\.{2,}/g, "."); // Сохраняем только первую. Удаляем лишние.
      this.amount = this.amount
        .toString()
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      // this.amount = this.amount
      // .toString()
      // .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // Введите только два десятичных знака
      if (this.amount.indexOf(".") < 0 && this.amount != "") {
        // Вышеупомянутое было отфильтровано. Контроль здесь заключается в том, что если нет десятичной точки, первое место не может быть количеством, аналогичным 01, 02
        this.amount = parseFloat(this.amount);
      }
    },
  },
};
</script>

<style>
@import "../assets/style.css";

.color-green {
  color: green;
}

.color-red {
  color: red;
}
</style>
