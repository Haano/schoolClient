<!--// 17 03 22 -->
<template>
  <div>
    <br />
    <div class="flex-food-main">
      <div>
        <div class="flex-food">
          <div>
            Класс
            <select
              class="form-select"
              v-model="selectedClassID"
              @change="changeClass(selectedClassID)"
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
            Ученик
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
            Дата оплаты <b style="color: red">*</b
            ><input
              type="date"
              v-model="date"
              required
              v-on:change="changeDate(date)"
              class="form-control"
            />
          </div>
          <div>
            Идентификатор (СУИП) <b style="color: red">*</b
            ><input class="form-control" v-model="identifier" />
          </div>
        </div>
        <div class="flex-food">
          <div>
            Сумма квитанции<br />
            (только число) <b style="color: red">*</b>
            <input type="number" class="form-control" v-model="amount" />
          </div>
          <div style="margin: 24px 0 0 0">
            Период <b style="color: red">*</b>
            <input v-model="period" class="form-control" />
          </div>
        </div>
        <div class="flex-food-main">
          <div>
            <div>
              Можно загрузить<br />
              файл квитанции
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
        <div class="flex-food">
          Дата: {{ new Date(date).toLocaleDateString() }} <br />
          ID: {{ identifier }} <br />
          Сумма квитанции: {{ amount }} <br />
        </div>
        <div class="flex-food">
          <button @click="createReciept()" class="btn btn-success">
            Создать квитанцию
          </button>
        </div>
      </div>
      <br />
      <span>
        Расчет по стоимости порции:
        <input type="text" class="form-control" v-model="foodPrice" />
        <br />
        <table class="table table-bordered">
          <caption>
            Сводка по питанию
          </caption>
          <thead>
            <tr>
              <th scope="col" style="width: 100px"></th>
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
              <td>{{ amount }}</td>
              <td style="color: red">
                {{ amount - amountFood.amount * foodPrice }}
              </td>
            </tr>
            <tr v-for="item in sCategory" :key="item.message">
              <td>{{ item.sCategory }}</td>
              <td>{{ item.count }}</td>
              <td>{{ item.count * foodPrice }}</td>
            </tr>
            <template v-if="!chek">
              <tr>
                <td style="width: 200px">
                  <b
                    >{{ selectedStudentID.FirstName }}
                    {{ selectedStudentID.LastName }}
                    {{ selectedStudentID.Category }}</b
                  >
                </td>
                <td>{{ amountStudentFood.amount }}</td>
                <td>{{ amountStudentFood.amount * foodPrice }}</td>
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
              </tr>
            </template>
          </tbody>
        </table>
      </span>
    </div>
    <br />
    <v-data-table
      :headers="headers"
      :items="receipts"
      disable-pagination
      :hide-default-footer="true"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <button class="btn btn-primary" @click="deleteStudent(item._id)">
          Скачать
        </button>
        <button class="btn btn-danger" @click="deleteStudent(item._id)">
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
  data() {
    return {
      period: "",
      identifier: "",
      date: new Date(), //.toLocaleDateString(),
      chek: false,
      sCategory: [],
      foodPrice: 25,
      marks: [],
      amountFood: { amount: 0 },
      amountStudentFood: { amount: 0 },
      file: "",
      month: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Январь"],
      headers: [
        { text: "Фамилия", value: "FirstName" },
        { text: "Имя", value: "lastName" },
        { text: "Дата", value: "date" },
        { text: "ID", value: "identifier" },
        { text: "Период", value: "period" },
        { text: "Сумма", value: "amount" },
        { text: "Действия", value: "actions", sortable: false },
      ],
      receipts: [
        {
          FirstName: "123",
          lastName: "123131",
          date: "12.05.2020 15:33",
          identifier: "142124425125125RFS",
          amount: 500,
        },
        {
          FirstName: "123",
          lastName: "123131",
          date: "13.05.2020 15:33",
          identifier: "142124125125125RFS",
          amount: 600,
        },
        {
          FirstName: "123",
          lastName: "123131",
          date: "14.05.2020 15:33",
          identifier: "142124225125125RFS",
          amount: 2700,
        },
        {
          FirstName: "123",
          lastName: "123131",
          date: "15.05.2020 15:33",
          identifier: "142124325125125RFS",
          amount: 200,
        },
        {
          FirstName: "123",
          lastName: "123131",
          date: "12.05.2020 15:33",
          identifier: "142124025125125RFS",
          amount: 200,
        },
      ],
      selectedClassID: [{ lastName: "" }],
      selectedStudentID: [""],
      amount: 0,
      sClass: [],
      Students: [{ FirstName: "TEST" }],
    };
  },
  methods: {
    async changeClass(data) {
      await this.getStudents(data);
      await this.getMarks(data);
      await this.getAmountCategory();
      this.amountMarksFood();
    },
    changeStudent(student) {
      for (let j = 0; j < this.Students.length; j++) {
        this.Students[j].amount = 0;
      }

      if (student != "Все") {
        this.chek = false;
        this.amountStudentFood.amount = 0;
        console.log(student);
        for (let i = 0; i < this.marks.length; i++) {
          if (
            this.marks[i].studentID === student._id &&
            this.marks[i].causesID === "Питался"
          ) {
            this.amountStudentFood.amount += 1;
          }
        }
      } else {
        this.chek = true;
        this.amountStudentFood.amount = 0;
        console.log(this.Students);
        for (let i = 0; i < this.marks.length; i++) {
          for (let j = 0; j < this.Students.length; j++)
            if (
              this.marks[i].studentID === this.Students[j]._id &&
              this.marks[i].causesID === "Питался"
            ) {
              this.Students[j].amount += 1;
            }
        }
        console.log("DCT");
      }
    },

    async getMarks(ID) {
      await TutorialDataService.findMarks({
        classID: ID,
      })
        .then((response) => {
          //this.getMarksToPrint(Object.values(response.data));
          console.log("ответ", response.data);
          this.marks = Object.values(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(this.mark);
    },
    getAmountCategory() {
      for (let j = 0; j < this.sCategory.length; j++) {
        this.sCategory[j].count = 0;
      }
      console.log("!!!!!", this.marks, this.sCategory);
      for (let i = 0; i < this.marks.length; i++) {
        for (let j = 0; j < this.sCategory.length; j++) {
          if (this.marks[i].cat === this.sCategory[j].sCategory) {
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
      console.log(this.file);
    },

    async createReciept() {
      for (let i = 0; i < this.amount.length; i++) {
        this.amount[i];
      }
      console.log("this.selectedStudentID._id", this.selectedStudentID);
      var data = {
        classID: this.selectedClassID.classID,
        studentID: this.selectedStudentID._id,
        date: this.date,
        cat: this.selectedStudentID.Category,
        amount: this.amount,
        identifier: this.identifier,
        period: this.period,
      };

      console.log(data);

      TutorialDataService.createReciept(data)
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    test() {
      // this.handleFileUpload();
      const data = new FormData();
      data.append("file", this.file);
      TutorialDataService.sendFile(data)
        .then(
          (res) =>
            function () {
              console.log("SUCCESS!!");

              res.data.files; // binary representation of the file
              res.status; // HTTP status
            },
        )
        .catch(
          (res) =>
            function () {
              console.log("FAILURE!!", res.data.files, res.status);
            },
        );
      // axios
      //   .post("http://192.168.1.152:8081/single-file", formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   })
      //   .then(function () {
      //     console.log("SUCCESS!!");
      //   })
      //   .catch(function () {
      //     console.log("FAILURE!!");
      //   });
    },
    getStudents(data) {
      TutorialDataService.findStudentByClassID(data)
        .then((response) => {
          this.Students.splice(response.data);
          var a = new Array();
          a = Object.values(response.data);
          for (var i = 0; i < a.length; i++) {
            a[i].amount = 0;
            this.$set(this.Students, i, a[i]);
            // this.$set(this.Students[i], amount, 0);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    changeDate(value) {
      let a = new Date(value);
      console.log(value, a);
      this.date = value;
    },

    async retrieveClass() {
      //получить список классов
      for (let i = 0; i < this.receipts.length; i++) {
        this.amount += this.receipts[i].amount;
      }
      await TutorialDataService.getAllCLass()
        .then((response) => {
          this.sClass = response.data.map(this.getDisplayClass);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async retriveCategory() {
      TutorialDataService.getCategory()
        .then((response) => {
          this.sCategory = response.data.map(this.getDispleyCategory);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });

      console.log(this.sCategory);
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
  },
  watch: {
    amount: function () {
      //this.amount = this.amount.replace(/[^0-9]+/g, "");
      this.amount = this.amount.replace(/[^\d.]/g, ""); // Удаляем символы, кроме "числа" и "."
      this.amount = this.amount.replace(/\.{2,}/g, "."); // Сохраняем только первую. Удаляем лишние.
      this.amount = this.amount
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      //this.amount = this.amount.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // Введите только два десятичных знака
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
</style>
