<template>
  <div>
    <div class="shift-name">
      <section class="class-mark">
        <header class="class-mark-item-text">1 смена</header>
      </section>

      <section class="class-mark">
        <header class="class-mark-item-text">2 смена</header>
      </section>
    </div>

    <div class="class-marks">
      <div class="class-mark">
        <div v-for="value in classList" :key="value.className">
          <div
            v-if="value.shift === '1 смена'"
            :class="{
              'class-mark-item-change': value.change,
              'class-mark-item-BAD': !value.created,
              'class-mark-item-ok': value.created,
            }"
          >
            {{ value.className }}
          </div>
        </div>
      </div>
      <div class="cat">
        <select
          name=""
          v-model="globalOption"
          class="form-select"
          id=""
          @change="changeGlobalOption(globalOption)"
        >
          <option>Отсутствующие</option>
          <option>Питание</option>
          <option>Питание 1 смена</option>
          <option>Питание 2 смена</option>
        </select>
        <div class="cat-item">
          <input
            type="date"
            id="Date"
            class="form-control"
            required
            v-model="sDates.date"
            @change="initialization()"
          />
          <button @click="initialization()" class="btn btn-success">
            Обновить
          </button>
          <button @click="printStat()" class="btn btn-secondary">Печать</button>
        </div>
      </div>
      <div class="class-mark">
        <div v-for="value in classList" :key="value.className">
          <div
            v-if="value.shift === '2 смена'"
            :class="{
              'class-mark-item-change': value.change,
              'class-mark-item-BAD': !value.created,
              'class-mark-item-ok': value.created,
            }"
          >
            {{ value.className }}
          </div>
        </div>
      </div>
    </div>

    <div>
      <ul class="ul-stat" id="ul-stat">
        <li>
          Всего учеников:
          <b style="padding: 0 5px 0 5px">
            {{ studentsList.length }} (на
            {{ new Date().toLocaleDateString() }})</b
          >
        </li>

        <li>Данные отправлены на: {{ marks.length }}</li>
        <li>Отсутствует: {{ marksPrint.length }}</li>
        <li v-for="caus in countAll" :key="caus.causes">
          {{ caus.causes }} = {{ caus.count }}
        </li>
      </ul>
    </div>

    <div v-if="globalOption === 'Отсутствующие'">
      <div class="myTable" id="table">
        <v-col>
          <v-data-table
            :headers="headers"
            :items="this.marksPrint"
            :items-per-page="3000"
            hide-default-footer
          >
          </v-data-table>
        </v-col>
      </div>
    </div>

    <div v-if="globalOption === 'Питание'">
      <div class="myTable" id="table">
        <v-col>
          <v-data-table
            :headers="headersEat"
            :items="this.classList"
            :items-per-page="3000"
            hide-default-footer
          >
          </v-data-table>
        </v-col>
      </div>
    </div>
    <button @click="help()" class="btn btn-success">Помощь</button>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
export default {
  data() {
    return {
      sCategory: [],
      globalOption: [],
      headers: [
        {
          text: "Класс",
          value: "className",
          sortable: true,
        },
        {
          text: "Фамилия",
          value: "FirstName",
          sortable: false,
        },
        {
          text: "Имя",
          value: "LastName",
          sortable: false,
        },
        // {
        //   text: "Категория",
        //   value: "cat",
        //   sortable: false,
        // },
        {
          text: "Причина",
          value: "causesID",
          sortable: false,
        },
      ],
      headersEat: [
        {
          text: "Класс",
          value: "className",
          sortable: true,
        },
      ],
      marks: [],
      marksPrint: [],
      sDates: [],
      classList: [],
      studentsList: [{ FirstName: "1", LastName: "2" }],
      countAll: [{ causes: "21231" }],
      activeClassOK: "class-mark-item-ok",
      activeClassBAD: "class-mark-item-BAD",
      activeClassChange: "class-mark-item-change",
    };
  },

  methods: {
    async initialization() {
      this.clearFullData();

      await this.getAllClass(); //get классов в classList
      await this.getMarks(); // получить все марки (marks and marksPrint)
      await this.findAllStudents(); // получить всех учеников (students)
      await this.defineTileColorClass(); //покрасить плитки в нужный цвет
      await this.countStat();
      //посчитать данные
    },

    clearFullData() {
      this.classList = [];
      this.studentsList = [];
      this.marks = [];
      this.students = [];
      this.marksPrint = [];
      this.countAll = [{ causes: "1", count: 0 }];
    },

    async getAllClass() {
      //получить список всех классов (classList)
      await TutorialDataService.getAllCLass()
        .then((response) => {
          this.classList = response.data.map(this.getDisplayClass);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getMarks() {
      await TutorialDataService.findMarks({
        classID: null,
        date: this.sDates.date,
      })
        .then((response) => {
          this.getMarksToPrint(Object.values(response.data));
          this.marks = Object.values(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getMarksToPrint(data) {
      data.map((mark) => {
        if (mark.causesID != "" && mark.causesID != "Питался") {
          this.marksPrint.push(mark);
        }
      });
    },
    async findAllStudents() {
      await TutorialDataService.findStudentByClassID().then((response) => {
        let students = Object.values(response.data);
        students.map((student) => {
          if (student != undefined) {
            this.studentsList.push(student);
          }
        });
      });
      this.getFullNameStudents();
    },

    defineTileColorClass() {
      for (let i = 0; i < this.classList.length; i++) {
        for (let p = 0; p < this.marks.length; p++) {
          if (this.marks[p].classID === this.classList[i].classID) {
            this.$set(this.marks[p], "className", this.classList[i].className);
            this.$set(this.classList[i], "created", true);
            if (this.marks[p].updatedAt !== this.marks[p].createdAt) {
              this.$set(this.classList[i], "change", true);
            }
          }
        }
      }
    },

    help() {
      console.log("Data", this.sDates.date);
      console.log("this.marks", this.marks);
      console.log("this.marksPrint", this.marksPrint);
      console.log("this.classList", this.classList);
      console.log("this.studentsList", this.studentsList);
      console.log("this.marks", this.marks);
      console.log("this.countAll", this.countAll);
      alert(
        "Красная - еще не подали \nСиняя - подали, но изменили в течении дня \nЗеленые - подали без изменения"
      );
    },
    async getFullNameStudents() {
      let change = false;
      // поместить в массив  marksPrint имена и фамилии учеников
      for (let j = 0; j < this.marksPrint.length; j++) {
        change = false;
        for (let i = 0; i < this.studentsList.length; i++) {
          if (this.marksPrint[j].studentID === this.studentsList[i]._id) {
            this.$set(
              this.marksPrint[j],
              "FirstName",
              this.studentsList[i].FirstName
            );
            this.$set(
              this.marksPrint[j],
              "LastName",
              this.studentsList[i].LastName
            );
            change = true;
            console.log(" BREAK j", j);
            break;
          }
          console.log("j", j);
        }
        if (!change) {
          this.$set(this.marksPrint[j], "FirstName", "DELETE");
          this.$set(this.marksPrint[j], "LastName", "DELETE");
        }
      }

      return;
    },

    async countStat() {
      let set = new Set();
      let arr = [];
      let obj = {};
      for (let i = 0; i < this.marks.length; i++) {
        set.add(this.marks[i].causesID);
      }
      i = 0;
      for (let value of set) {
        obj = { causes: value, count: 0 };

        this.countAll[i] = obj;
        if (value === "" && i != 0) {
          let temp = this.countAll[0];
          this.countAll[0] = this.countAll[i];
          this.countAll[i] = temp;
        } else {
          if (this.countAll[0].causes === "") {
            if (value === "Питался" && i != 1) {
              let temp = this.countAll[1];
              this.countAll[1] = this.countAll[i];
              this.countAll[i] = temp;
            } else {
              this.countAll[i] = obj;
            }
          } else {
            if (value === "Питался" && i != 0) {
              let temp = this.countAll[0];
              this.countAll[0] = this.countAll[i];
              this.countAll[i] = temp;
            } else {
              this.countAll[i] = obj;
            }
          }
        }
        arr[i] = obj;
        i += 1;
      }
      for (i = 0; i < this.marks.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (this.marks[i].causesID === arr[j].causes) {
            arr[j].count++;
          }
        }
      }

      let i, temp;
      for (let j = 0; j < arr.length; j++) {
        if (arr[j].causes === "") {
          arr[j].causes = "Присутствует";
          temp = j;
        }
        if (arr[j].causes === "Питался") {
          i = j;
        }
      }
      console.log(arr);
      if (temp) {
        arr[temp].count = arr[temp].count + arr[i].count;
      }

      this.$set(this.countAll, arr);
    },

    retrieveData() {
      //поставить текущую дату
      document.getElementById("Date").value = new Date();
      this.$set(this.sDates, "date", new Date().toISOString().slice(0, 10));
    },

    getDisplayClass(data) {
      return {
        classID: data._id,
        className: data.className,
        shift: data.shift,
        change: false,
        count: 0,
      };
    },

    // Метод печати
    printStat() {
      //let dataReportBox = document.getElementById("table"); // Получаем узел содержимого для печати
      // Берем узел, который не отображается, можно скрыть или удалить узел
      // let top = document.getElementsByClassName("top")[0];
      // dataReportBox.removeChild(top);

      // Создаем нужные вам узлы
      //
      //$("# dataReportBox").prepend(topdiv); // Вставляем вновь созданный узел div в верхнюю часть содержимого контейнера dataReportBox
      let data = this.sDates.date;
      // Получаем ссылку на элемент в который мы хотим добавить новый элемент ul-stat
      let top = "<h1> МБОУ СОШ №24</h1> <h2>Отсутствующие на " + data + "</h2>";
      let printHtml = document.getElementById("table").innerHTML; // Получаем содержимое узла для печати
      let printHtml2 = document.getElementById("ul-stat").innerHTML;

      printHtml2 += printHtml;
      top += printHtml2;
      window.document.body.innerHTML = top; // Присваиваем напечатанное содержимое содержимому страницы

      window.print(); // Вызов метода печати
      window.location.reload(); // Страница перезагружается после печати
    },

    async changeGlobalOption(globalOption) {
      let classListAll = [];

      this.$set(this.headersEat, 1, {
        text: "Всего",
        value: "count",
        width: "40%",
        sortable: false,
      });
      for (let i = 0; i < this.sCategory.length; i++) {
        console.log(this.sCategory[i]);
        this.$set(this.headersEat, i + 2, {
          text: this.sCategory[i].sCategory,
          value: this.sCategory.sCategory,
          width: "40%",
          sortable: false,
        });
      }
      if (globalOption === "Питание") {
        for (let j = 0; j < this.classList.length; j++) {
          classListAll.push(this.classList[j]);
        }
      }
      if (globalOption === "Питание 1 смена") {
        console.log(this.classList);
        for (let j = 0; j < this.classList.length; j++) {
          console.log(this.classList[j]);
          if (this.classList[j].shift === "1 смена") {
            console.log("1 смена");
            classListAll.push(this.classList[j]);
          }
        }
      }
      if (globalOption === "Питание 2 смена") {
        for (let j = 0; j < this.classList.length; j++) {
          if (this.classList[j].shift === "2 смена")
            classListAll.push(this.classList[j]);
        }
      }

      await this.getAllCategory();

      for (let j = 0; j < classListAll.length; j++) {
        this.$set(classListAll[j], "count", 0);
      }
      if (classListAll[classListAll.length - 1].className != "Итого")
        classListAll.push({ className: "Итого", count: 0 });

      for (let y = 0; y < this.marks.length; y++) {
        for (let j = 0; j < classListAll.length - 1; j++) {
          if (
            this.marks[y].causesID === "Питался" &&
            this.marks[y].classID === classListAll[j].classID
          ) {
            this.$set(classListAll[j], "count", classListAll[j].count + 1);
          }

          let temp = 0;
          for (let j = 0; j < classListAll.length - 1; j++) {
            temp = temp + classListAll[j].count;
          }
          this.$set(classListAll[classListAll.length - 1], "count", temp);
        }
      }
    },
    async getAllCategory() {
      await TutorialDataService.getCategory()
        .then((response) => {
          this.sCategory = response.data.map(this.getDispleyCategory);
          console.log(response.data);
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
  },
  mounted() {
    this.initialization();
    this.retrieveData();
  },
};
</script>

<style scoped>
@import "../assets/style.css";
.shift-name {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  margin: 20px 0px 0px 0px;
}
.class-marks {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 -50px;
}

.class-mark {
  max-width: 650px;
  display: flex;
  justify-self: center;
  margin: 0 0px;
  flex-wrap: wrap;
  padding: 0px 5% 0px 10%;
}
.class-mark-item-text {
  background-color: green;
  margin: 1px;
  color: white;
  padding: 5px 40px 5px 3px;
}
.class-mark-item-ok {
  background-color: green;
  margin: 1px;
  color: white;
  padding: 5px 30px 5px 3px;
  max-width: 10px;
}
.class-mark-item-BAD {
  background-color: rgb(128, 0, 0);
  color: white;
  margin: 1px;
  padding: 5px 30px 5px 3px;
  max-width: 10px;
}
.class-mark-item-change {
  background-color: rgb(0, 55, 128);
  color: white;
  margin: 1px;
  padding: 5px 30px 5px 3px;
  max-width: 10px;
}

.v-data-table td {
  border-bottom: none !important;
  height: 2px !important;
}

.v-data-table tbody tr:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}
</style>
