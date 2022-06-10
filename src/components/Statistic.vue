<template>
  <div class="main-stat">
    <div>
      <div class="class-marks">
        <div class="class-mark">
          <div class="class-mark-change">
            <div>
              Сформировать отчет на:
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
            </div>
            <div>
              <input
                type="date"
                id="Date"
                class="form-control"
                required
                v-model="sDates.date"
                @change="initialization()"
              />
            </div>

            <div>
              <button @click="initialization()" class="btn btn-success">
                Обновить
              </button>

              <button
                target="_blank"
                @click="newPrintStat()"
                class="btn btn-secondary"
              >
                Печать
              </button>
            </div>

            <div class="class-mark-change">
              <b> Загрузить по диапазону</b>
              <div class="flex-food-main">
                <div class="flex-food-main">
                  <div style="width: 30px; padding-top: 6px">От</div>
                  <div class="flex" style="width: 220px">
                    <input
                      type="date"
                      v-model="dateFrom"
                      id="DateFrom"
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
                      id="DateBefore"
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
                      @click="initializationByRange()"
                      class="btn btn-success"
                    >
                      Загрузить
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-food">
              <div style="display: flex; align-items: stretch">
                <div>
                  <b> Класс</b>
                  <select class="form-select" v-model="selectedClassID">
                    <option
                      v-for="user in classList"
                      :key="user.className"
                      v-bind:value="user"
                    >
                      {{ user.className }}
                    </option>
                  </select>
                </div>
                <div style="width: 200px">
                  <b>Ученик</b>
                  <select class="form-select" v-model="selectedStudentID">
                    <option
                      v-for="user in studentsListByClassID"
                      :key="user._id"
                      v-bind:value="user"
                    >
                      {{ user.FirstName }} {{ user.LastName }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="flex-food">
                <button
                  @click="initializationByClass()"
                  class="btn btn-success"
                >
                  Загрузить
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="class-mark">
            <ul id="ul-stat">
              <li>
                Всего учеников:
                <b style="padding: 0 5px 0 5px">
                  {{ studentsList.length }} (на
                  {{ new Date().toLocaleDateString() }})</b
                >
              </li>

              <li>Данные отправлены на: {{ marks.length }}</li>
              <li>
                Отсутствует: {{ marksPrint.length }} ({{
                  reversedMessage(marksPrint.length)
                }}%)
              </li>
            </ul>

            <ul id="ul-stat3">
              <transition-group name="list" id="ul-stat2">
                <li v-for="caus in countAll" :key="caus.causes">
                  {{ caus.causes }} = {{ caus.count }} ({{
                    reversedMessage(caus.count)
                  }}%)
                </li>
              </transition-group>
            </ul>
            <!-- </ul> -->
          </div>
          <button @click="help()" class="btn btn-warning">Помощь</button>
        </div>

        <div>
          <div>
            <div class="class-mark">
              <section class="class-mark-shift">
                <header>1 смена</header>
              </section>
              <transition-group class="class-mark-noBoard" name="list">
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
              </transition-group>
            </div>
          </div>

          <div>
            <div class="class-mark">
              <section class="class-mark-shift">
                <header>2 смена</header>
              </section>

              <transition-group class="class-mark-noBoard" name="list">
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
              </transition-group>
            </div>
          </div>
        </div>
      </div>
      <transition name="component-fade" mode="out-in">
        <div v-if="globalOption === 'Отсутствующие'">
          <div class="myTable">
            <v-col>
              <v-data-table
                :headers="headers"
                :items="this.marksPrint"
                :items-per-page="3000"
                hide-default-footer
                id="table"
              >
                <template v-slot:[`item.index`]="{ index }">
                  {{ index + 1 }}
                </template>
              </v-data-table>
            </v-col>
          </div>
        </div>

        <transition name="component-fade" mode="out-in">
          <div
            v-if="
              globalOption === 'Питание' ||
              globalOption === 'Питание 1 смена' ||
              globalOption === 'Питание 2 смена'
            "
            class="myTable"
          >
            <!-- fixed-header
        height="40vh" -->

            <div class="myTable">
              <transition name="list">
                <v-data-table
                  :headers="headersEat"
                  :items="this.classListAll"
                  :items-per-page="3000"
                  hide-default-footer
                  id="table"
                >
                </v-data-table>
              </transition>
            </div>
          </div>
        </transition>
      </transition>
    </div>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
export default {
  data() {
    return {
      dateFrom: [],
      dateBefore: [],
      sCategory: [],
      globalOption: [],
      headers: [
        {
          value: "index",
          text: "#",
          width: "30px",
        },
        {
          text: "Класс",
          value: "className",
          sortable: true,
        },
        {
          text: "Фамилия",
          value: "FirstName",
          sortable: true,
        },
        {
          text: "Имя",
          value: "LastName",
          sortable: false,
        },
        {
          text: "Категория",
          value: "cat",
          sortable: false,
        },
        {
          text: "Причина",
          value: "causesID",
          sortable: false,
        },
        {
          text: "Дата",
          value: "date",
          sortable: false,
        },
      ],
      headersEat: [
        {
          text: "Класс",
          value: "className",
          sortable: true,
          style: "",
        },
      ],
      marks: [],
      marksPrint: [],
      sDates: [],
      classList: [],
      classListOption: [],
      classListAll: [],
      studentsList: [{}],
      countAll: [{}],
      activeClassOK: "class-mark-item-ok",
      activeClassBAD: "class-mark-item-BAD",
      activeClassChange: "class-mark-item-change",
      selectedClassID: "",
      studentsListByClassID: [{}],
      selectedStudentID: "",
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
      this.changeGlobalOption(this.globalOption);
      //посчитать данные
    },
    async initializationByRange() {
      this.clearFullData();

      await this.getAllClass(); //get классов в classList
      await this.getMarksByDateRange(); // получить все марки (marks and marksPrint)
      await this.findAllStudents(); // получить всех учеников (students)
      await this.defineTileColorClass(); //покрасить плитки в нужный цвет
      await this.countStat();
      this.changeGlobalOption(this.globalOption);
      //посчитать данные
    },
    async initializationByClass() {
      this.clearFullDataClass();

      await this.changeClass();
      await this.getMarksByDateRange(); // получить все марки (marks and marksPrint)
      await this.findAllStudents(); // получить всех учеников (students)
      await this.defineTileColorClass(); //покрасить плитки в нужный цвет
      await this.countStat();
      this.changeGlobalOption(this.globalOption);
      await this.getAllClass();
    },

    clearFullData() {
      this.classList = [];
      this.studentsList = [];
      this.selectedClassID = "";
      this.studentsListByClassID = [{}];
      this.selectedStudentID = "";
      this.marks = [];
      this.students = [];
      this.marksPrint = [];
      this.countAll = [{}];
    },

    clearFullDataClass() {
      this.studentsList = [];
      this.studentsListByClassID = [{}];
      this.selectedStudentID = "";
      this.marks = [];
      this.students = [];
      this.marksPrint = [];
      this.countAll = [{}];
    },

    changeClass() {
      this.studentsListByClassID = [{}];
      this.selectedStudentID = "";

      this.classList = this.classList.filter(
        (ID) => ID === this.selectedClassID
      );
      // console.log("@@@@@@@@@@@@@@", this.classList);

      this.changeGlobalOption(this.globalOption);
      for (let i = 0; i < this.studentsList.length; i++) {
        if (this.studentsList[i].classID === this.selectedClassID.classID) {
          this.studentsListByClassID.push(this.studentsList[i]);
        }
      }
    },

    async getAllClass() {
      //получить список всех классов (classList)
      await TutorialDataService.getAllCLass()
        .then((response) => {
          this.classList = response.data.map(this.getDisplayClass);
          this.classListOption = response.data.map(this.getDisplayClass);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getMarks() {
      let classID = this.selectedClassID;
      console.log("@@@@@@@@", classID);
      if (classID.length === 0) {
        classID = null;
      }

      await TutorialDataService.findMarks({
        classID: classID,
        date: this.sDates.date,
      })
        .then((response) => {
          let temp = Object.values(response.data);

          for (let i = 0; i < temp.length; i++) {
            temp[i].date = new Date(temp[i].date).toLocaleDateString();
          }
          this.getMarksToPrint(Object.values(temp));
          this.marks = Object.values(temp);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async getMarksByDateRange() {
      let classID = this.selectedClassID;

      if (classID.length === 0) {
        classID = null;
      }

      await TutorialDataService.findMarksByDateRange({
        classID: classID,
        dateFrom: this.dateFrom,
        dateBefore: this.dateBefore,
      })
        .then((response) => {
          let temp = Object.values(response.data);

          for (let i = 0; i < temp.length; i++) {
            temp[i].date = new Date(temp[i].date).toLocaleDateString();
          }
          this.getMarksToPrint(Object.values(temp));
          this.marks = Object.values(temp);
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
      console.log("this.classListAll", this.classListAll);
      console.log("this.studentsList", this.studentsList);
      console.log("this.marks", this.marks);
      console.log("this.countAll", this.countAll);
      alert(
        "Красная - еще не подали \nСиняя - подали, но изменили в течении дня \nЗеленые - подали без изменения \nПроценты считаются от количества учеников, на которых подали данные (Данные отправлены на: Х)"
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
      // document.getElementById("Date").value = new Date();
      // document.getElementById("DateBefore").value = new Date();
      // document.getElementById("DateFrom").value = new Date();
      this.$set(this.sDates, "date", new Date().toISOString().slice(0, 10));
      this.dateFrom = new Date().toISOString().slice(0, 10);
      this.dateBefore = new Date().toISOString().slice(0, 10);
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

      let auth = localStorage.getItem("user");
      if (this.globalOption === "Отсутвующие") {
        // Получаем ссылку на элемент в который мы хотим добавить новый элемент ul-stat
        let top =
          "<h2> МБОУ СОШ №24</h2> <h3>Отсутствующие на " + data + "</h3>";
        let printHtml = document.getElementById("table").innerHTML; // Получаем содержимое узла для печати
        let printHtml2 = document.getElementById("ul-stat").innerHTML;

        printHtml2 += printHtml;
        top += printHtml2;

        let tab = window.open("");
        tab.document.write(top);
        // tab.document.close();
        //window.location.href=url;

        // window.document.body.innerHTML = top; // Присваиваем напечатанное содержимое содержимому страницы

        tab.print(); // Вызов метода печати

        localStorage.setItem("user", auth);
        // window.location.reload(); // Страница перезагружается после печати
        this.$router.push({ name: "Statistic" });
      } else {
        // Получаем ссылку на элемент в который мы хотим добавить новый элемент ul-stat
        let top = "<h2> МБОУ СОШ №24</h2> <h3>Питание на " + data + "</h3>";
        let printHtml = document.getElementById("table").innerHTML; // Получаем содержимое узла для печати
        let printHtml2 = document.getElementById("ul-stat").innerHTML;

        printHtml2 += printHtml;
        top += printHtml2;

        let tab = window.open("");
        tab.document.write(top);

        //  window.document.body.innerHTML = top; // Присваиваем напечатанное содержимое содержимому страницы

        //window.print(); // Вызов метода печати
        //window.location.reload(); // Страница перезагружается после печати
        //  this.$router.push({ name: "Dashboard" });
        localStorage.setItem("user", auth);
        this.$router.push({ name: "Statistic" });
      }
    },

    newPrintStat() {
      let auth = localStorage.getItem("user");
      let data = this.sDates.date;

      let top =
        "<head>" +
        "</head><body onload='window.print()'><h2> МБОУ СОШ №24</h2> <h3>Отсутствующие на " +
        data +
        "</h3>";
      let printHtml = document.getElementById("table").innerHTML; // Получаем содержимое узла для печати
      let printHtml2 = document.getElementById("ul-stat").innerHTML;

      let style =
        "<style type='text/css'>table {border: 1px solid black; border-collapse: collapse;}  th,td { padding: 2px;border: 1px solid black; } </style> ";

      let ulstat3 = document.getElementById("ul-stat3").innerHTML;

      printHtml2 += ulstat3;
      printHtml2 += printHtml;
      top += printHtml2;
      top += style;

      console.log(top);
      let tab = window.open(
        "",
        "",
        "left=50,top=50,width=800,height=640,toolbar=0,scrollbars=1,status=0"
      );
      tab.document.write(top);
      tab.document.close();
      tab.focus();
      localStorage.setItem("user", auth);

      tab.print();

      tab.onfocus = function () {
        setTimeout(function () {
          tab.close();
        }, 500);
      };
    },

    async changeGlobalOption(globalOption) {
      //clear class print
      this.classListAll = [];
      let arrayCat = [];

      //добавить столбец в таблицу (всего)
      this.$set(this.headersEat, 1, {
        text: "Всего",
        value: "count",
        sortable: false,
      });

      //получить категории
      await this.getAllCategory();
      //добавить столбцы категорий
      //let textValue = "";
      for (let i = 0; i < this.sCategory.length; i++) {
        console.log(this.sCategory[i]);
        // textValue = "" + this.sCategory[i].id;
        this.$set(this.headersEat, i + 2, {
          text: this.sCategory[i].sCategory,
          value: this.sCategory[i].id,

          sortable: false,
        });
      }

      //сформировать список классов согласно выбору
      if (globalOption === "Питание") {
        for (let j = 0; j < this.classList.length; j++) {
          this.classListAll.push(this.classList[j]);
        }
      }
      if (globalOption === "Питание 1 смена") {
        for (let j = 0; j < this.classList.length; j++) {
          if (this.classList[j].shift === "1 смена") {
            console.log("1 смена");
            this.classListAll.push(this.classList[j]);
          }
        }
        console.log("1 смена", this.classListAll);
      }
      if (globalOption === "Питание 2 смена") {
        for (let j = 0; j < this.classList.length; j++) {
          if (this.classList[j].shift === "2 смена")
            this.classListAll.push(this.classList[j]);
        }
      }

      //добавить в переменную чистый параметр для подсчета общей суммы
      for (let j = 0; j < this.classListAll.length; j++) {
        this.$set(this.classListAll[j], "count", 0);
        for (let i = 0; i < this.sCategory.length; i++) {
          this.$set(this.classListAll[j], this.sCategory[i].id, 0);
          arrayCat[i] = 0;
        }
      }

      //добавить последнюю строку с ИТОГО
      if (this.classListAll[this.classListAll.length - 1].className != "Итого")
        this.classListAll.push({ className: "Итого", count: 0 });

      //посчитать количество питающихся для классов всего + cat
      let temp = 0;
      for (let j = 0; j < this.classListAll.length - 1; j++) {
        for (let i = 0; i < this.sCategory.length; i++) {
          arrayCat[i] = 0;
        }
        for (let y = 0; y < this.marks.length; y++) {
          if (
            this.marks[y].causesID === "Питался" &&
            this.marks[y].classID === this.classListAll[j].classID
          ) {
            this.$set(
              this.classListAll[j],
              "count",
              this.classListAll[j].count + 1
            );

            // let countCat = this.sCategory[i].sCategory;
            for (let i = 0; i < this.sCategory.length; i++) {
              if (this.marks[y].cat === this.sCategory[i].sCategory) {
                arrayCat[i] = arrayCat[i] + 1;

                this.$set(
                  this.classListAll[j],
                  this.sCategory[i].id,
                  arrayCat[i]
                );
                this.$set(
                  this.sCategory[i],
                  "count",
                  this.sCategory[i].count + 1
                );
                console.log("СЛОЖИЛ", this.sCategory[i]);
              }
            }
            temp += 1;
          }
        }
      }

      this.$set(this.classListAll[this.classListAll.length - 1], "count", temp);

      for (let i = 0; i < this.sCategory.length; i++) {
        console.log(this.sCategory[i].count);
        this.$set(
          this.classListAll[this.classListAll.length - 1],
          this.sCategory[i].id,
          this.sCategory[i].count
        );
      }

      console.log(this.sCategory);
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
        count: 0,
      };
    },

    reversedMessage: function (data) {
      let a = (data / this.marks.length) * 100;
      console.log(a);
      // `this` указывает на экземпляр vm
      return a.toFixed(2);
    },
  },
  mounted() {
    this.initialization();
    this.retrieveData();
  },
  computed: {
    // геттер вычисляемого значения
    // reversedMessage: function (data) {
    //   let a = (data.count / this.studentsList.length) * 100;
    //   // `this` указывает на экземпляр vm
    //   return a.slice(2, 2);
    // },
  },
};
</script>

<style scoped>
@import "../assets/style.css";
.shift-name {
  display: flex;
  justify-content: space-around;
  flex-direction: row;
}
.main-stat {
  text-align: center;
  display: flex;
  justify-content: center;
}
.class-marks {
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  margin: 1px;
  justify-content: start;
  column-gap: none;
}

.class-mark {
  margin: 5px;
  text-align: center;
  width: 350px;
  display: flex;
  justify-content: center;

  flex-wrap: wrap;
  border-radius: 3px;
  box-shadow: 0 0 3px #4d4d4d;

  margin: 5px 5px 5px 5px;
}

.class-mark-noBoard {
  margin: 5px;
  text-align: center;
  width: 350px;
  display: flex;
  justify-content: center;

  flex-wrap: wrap;

  margin: 5px 5px 5px 5px;
}

.class-mark-shift {
  text-align: center;
  width: 350px;
  display: flex;
  justify-content: center;

  flex-wrap: wrap;
}

.class-mark-change {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 300px;
}
.class-mark-change div {
  padding: 2px;
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
