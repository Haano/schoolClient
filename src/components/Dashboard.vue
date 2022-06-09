<template>
  <div>
    <!-- <button @click="check()">ПРОВЕРКА</button> -->

    <div class="flex">
      <div class="dashboard-main">
        <v-progress-linear
          v-if="progress < 100"
          v-model="progress"
        ></v-progress-linear>
        Класс
        <select
          class="form-select"
          v-model="selectedClassID"
          @change="show(selectedClassID)"
          id="class"
        >
          <option
            v-for="(user, index) in sClass"
            :key="index"
            v-bind:value="user"
          >
            {{ user.className }}
          </option>
        </select>
        <label for="className">Выбрать день</label>
        <input
          type="date"
          id="Date"
          class="form-control"
          required
          v-model="sDates.date"
          @change="show()"
        />
        <div
          v-if="
            selectedClassID &&
            sDates.date === new Date(DateInternet).toISOString().slice(0, 10)
          "
        >
          <button
            @click="loadLastDay()"
            id="loadLast"
            class="btn btn-success"
            style="margin-top: 10px; margin-left: auto; margin-right: auto"
          >
            Загрузить значения прошлого дня
          </button>
        </div>
        <transition class="reciept-table" name="list">
          <div
            v-if="checkShowTable"
            style="margin-top: 10px; margin-left: auto; margin-right: auto"
          >
            <table class="reciept-table">
              <thead>
                <tr>
                  <th v-for="(cat, index) in categoryCount" :key="index">
                    {{ cat.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-for="(cat, index) in categoryCount" :key="index">
                    {{ cat.count }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition>
      </div>
      <transition class="reciept-table" name="list">
        <div v-if="checkShowTable" class="dashboard-main">
          <div class="flex-ul">
            <table
              class="reciept-table"
              style="
                margin-bottom: 10px;
                margin-left: auto;
                margin-right: auto;
                width: 274px;
              "
            >
              <thead>
                <tr>
                  <th
                    v-for="(caus, index) in causesDefault"
                    :key="index"
                    style="max-width: 180px"
                  >
                    {{ caus.causes }}
                  </th>
                  <th>Отсутствует</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    v-for="(caus, index) in causesDefault"
                    :key="index"
                    style="max-width: 180px"
                  >
                    {{ caus.count }}
                  </td>
                  <td>{{ countedCausesDef }}</td>
                </tr>
              </tbody>
            </table>

            <div v-if="checkShowTable">
              <table class="reciept-table" style="margin-bottom: 10px">
                <thead>
                  <tr>
                    <th style="max-width: 180px">Причина</th>
                    <th>Количество</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(caus, index) in causes" :key="index">
                    <td style="max-width: 180px">{{ caus.causes }}</td>
                    <td>{{ caus.count }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="align-items: center">
            <transition name="fade" mode="out-in">
              <div v-if="!checkSendData">
                <button
                  id="sendData"
                  class="btn btn-primary"
                  @click="send()"
                  color="primary"
                  style="margin-left: auto; margin-right: auto"
                >
                  ОТПРАВИТЬ ДАННЫЕ
                </button>
              </div>

              <div v-else>
                <button
                  id="sendData"
                  class="btn btn-danger"
                  color="primary"
                  disabled="true"
                  style="margin-left: auto; margin-right: auto"
                >
                  Данные были отправлены
                </button>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>

    <transition class="reciept-table" name="list">
      <div v-if="checkShowTable" class="myTable">
        <v-col>
          <v-data-table
            :headers="headers"
            :items="this.sClassInput"
            :items-per-page="50"
            hide-default-footer
          >
            <template v-slot:[`item.index`]="{ index }">
              {{ index + 1 }}
            </template>

            <template v-slot:[`item.date`]="{ item }">
              <div class="select-flex">
                <div class="select">
                  <select
                    class="form-select"
                    name="marks"
                    v-bind:id="item._id"
                    @change="countMarks(item._id, item)"
                    v-bind:title="item.date"
                  >
                    <!-- v-model="item.mark" -->
                    <option value=""></option>
                    <option v-for="caus in causes" :key="caus.causes">
                      {{ caus.causes }}
                    </option>
                  </select>
                </div>

                <!-- <span>{{ item.date }}{{ item }}</span> -->
                <!-- <div v-if="item.date === this.sDates">
                {{ item }}
              </div> -->
                <v-card-actions id="update" v-show="checkSendData">
                  <button
                    v-bind:id="item._id + 'update'"
                    @click="updateThisMark(item)"
                    class="btn btn-success"
                  >
                    Обновить
                  </button>
                </v-card-actions>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/style.css";

.component-fade-enter-active,
.component-fade-leave-active {
  //transition: opacity 0.3s ease;

  transition: all 0.2s ease-out;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateY(100px);
}

.dashboard-main {
  // width: 630px;
  border-radius: 3px;
  box-shadow: 0 0 3px #4d4d4d;
  padding: 10px 10px 10px 10px;
  margin: 15px 10px 15px 15px;
}
</style>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  props: {
    selectedClass: Object,
  },
  data() {
    return {
      DateInternet: new Date(),
      progress: 0,
      checkShowTable: false,
      checkSendData: false,
      countMark: [],
      sClass: [{ className: "123", classID: "sadasd" }],
      sClassInput: [],
      categoryCount: [],
      selectedClassID: [],
      selectedMarks: [],
      sDates: [],
      marks: [],
      causesDefault: [
        { id: "1", causes: "Всего", count: 0 },
        { id: "2", causes: "В школе", count: 0 },
      ],
      causes: [{ id: "1", causes: "-", count: 0 }],
      title: "",
      headers: [
        {
          value: "index",
          text: "#",
          width: "30px",
        },
        {
          text: "Фамилия",
          value: "FirstName",
          sortable: false,
          width: "90px",
        },
        { text: "Имя", value: "LastName", sortable: false, width: "10px" },
        {
          text: "Категория",
          value: "Category",
          sortable: false,
          width: "30px",
        },
      ],
    };
  },

  methods: {
    clearFullData() {
      this.progress = 0;
      this.checkShowTable = false;
      this.checkSendData = false;
      this.countMark = [];
      this.sClass = [{ className: "123", classID: "sadasd" }];
      this.sClassInput = [];
      this.categoryCount = [];
      this.selectedClassID = [];
      this.selectedMarks = [];
      // this.sDates = [];
      this.marks = [];
      this.causesDefault = [
        { id: "1", causes: "Всего", count: 0 },
        { id: "2", causes: "В школе", count: 0 },
      ];
      this.causes = [{ id: "1", causes: "-", count: 0 }];
      this.title = "";
      this.headers = [
        {
          value: "index",
          text: "#",
          width: "30px",
        },
        {
          text: "Фамилия",
          value: "FirstName",
          sortable: false,
          width: "90px",
        },
        { text: "Имя", value: "LastName", sortable: false, width: "10px" },
        {
          text: "Категория",
          value: "Category",
          sortable: false,
          width: "30px",
        },
      ];
    },
    check() {
      console.log(this.selectedClass);
    },

    //загрузка значений прошлого дня
    async pow(x, data, test, data2) {
      if (x === 0) {
        return;
      }
      if (Object.keys(await test).length > 0) {
        await this.load(data, 1);
        document.getElementById("sendData").disabled = false;
        return;
      } else {
        data2 = data2 - 86400000;
        var date = new Date(data2);
        data = date.toISOString().slice(0, 10);
        test = await this.findMarksThis(date.toISOString().slice(0, 10));

        this.pow(x - 1, data, test, data2);
      }
      //load(data);
      return;
    },

    async loadLastDay() {
      var data = document.getElementById("Date").valueAsNumber;
      data = data - 86400000;
      var data2 = data;
      var date = new Date(data);
      data = date.toISOString().slice(0, 10);
      var test = this.findMarksThis(date.toISOString().slice(0, 10));
      await this.pow(3, data, test, data2);
      //let bottomHidden = document.querySelectorAll("#update");

      // for (let i = 0; i < bottomHidden.length; i++) {
      //   bottomHidden[i].hidden = true;
      // }
      console.log(this.marks.length, "FAWFAWFAWF");
    },

    countMarks(id, mark) {
      var a = document.getElementById(id);
      //this.$set(this.causesDefault[0], "count", this.sClassInput.length);
      var b = a.options[a.selectedIndex || 0].value;
      mark.mark = b;

      // this.$set(this.mark, "mark", b);

      this.$set(this.causesDefault[1], "count", 0);

      for (var j = 0; j < this.causes.length; j++) {
        if (a.name === this.causes[j].causes) {
          this.causes[j].count -= 1;
        }
        if (mark.mark === this.causes[j].causes) {
          this.causes[j].count += 1;
        }
      }
      a.name = mark.mark;

      // let presentCount = Document.getElementsByClassName(".form-select");
      // console.log("!!!!!!!!! presentCount", presentCount);

      for (let c = 0; c < this.categoryCount.length; c++) {
        this.categoryCount[c].count = 0;
      }
      for (var i = 0; i < this.sClassInput.length; i++) {
        if (
          this.sClassInput[i].mark === "Питался" ||
          this.sClassInput[i].mark === ""
        ) {
          this.$set(
            this.causesDefault[1],
            "count",
            this.causesDefault[1].count + 1
          );
        }

        if (
          this.sClassInput[i].Category !== "" &&
          this.sClassInput[i].mark === "Питался"
        ) {
          for (let c = 0; c < this.categoryCount.length; c++) {
            if (this.sClassInput[i].Category === this.categoryCount[c].name) {
              this.categoryCount[c].count += 1;
            }
          }
        }
      }
    },

    async load(data, checkLoadLast) {
      this.progress = 10;
      let bottomHidden = document.querySelectorAll("#update");

      for (i = 0; i < bottomHidden.length; i++) {
        bottomHidden[i].style = "display: none";
      }
      // document.getElementById("sendData").disabled = true;
      this.headers[4].text = data;
      this.marks = Array();
      this.marks.splice(0);

      for (var i = 0; i < this.sClassInput.length; i++) {
        this.$set(this.sClassInput[i], "date", "");
      }

      await this.findMarksThis(data);

      await TutorialDataService.getAllCauses().then((response) => {
        this.causes = response.data.map(this.getDisplayCauses);
        this.progress = 50;
      });

      this.$set(this.causesDefault[1], "count", 0);
      await this.showTable();

      for (i = 0; i < this.sClassInput.length; i++) {
        let tempObjCat = new Object();
        tempObjCat.name = this.sClassInput[i].Category;
        tempObjCat.count = 0;
        this.categoryCount[i] = tempObjCat;

        console.log(this.categoryCount, "categoryCOUNT");

        document.getElementById(
          this.sClassInput[i]._id + "update"
        ).disabled = false;
        for (var j = 0; j < this.marks.length; j++) {
          if (this.sClassInput[i]._id === this.marks[j].studentID) {
            this.$set(this.sClassInput[i], "date", this.marks[j].causesID);
            this.$set(this.sClassInput[i], "mark", this.marks[j].causesID);
            this.$set(this.sClassInput[i], "Category", this.marks[j].cat);
            for (var c = 0; c < this.causes.length; c++) {
              if (this.causes[c].causes === this.marks[j].causesID) {
                this.$set(this.causes[c], "count", (this.causes[c].count += 1));
              }
            }
          }
        }
        if (this.marks.length === 0) {
          this.$set(this.sClassInput[i], "date", "");
          this.$set(this.sClassInput[i], "mark", "");
        }
        if (
          this.sClassInput[i].date === "" ||
          this.sClassInput[i].date === "Питался"
        ) {
          this.$set(
            this.causesDefault[1],
            "count",
            this.causesDefault[1].count + 1
          );
        } else {
          this.sClassInput[i].count = false;
        }
      }

      await this.selectedSelect();
      this.$set(this.causesDefault[0], "count", this.sClassInput.length);

      let toDay = new Date(this.DateInternet).toISOString().slice(0, 10);
      // this.$set(this.causesDefault[1], "count", this.sClassInput.length);
      if (this.marks.length > 0) {
        if (document.getElementById("loadLast"))
          document.getElementById("loadLast").disabled = true;
        // document.getElementById("sendData").disabled = true;
        // this.checkSendData = true;
        for (i = 0; i < this.marks.length; i++) {
          if (
            this.marks[i].change &&
            toDay === this.marks[i].date.slice(0, 10)
          ) {
            document.getElementById(
              this.marks[i].studentID + "update"
            ).disabled = false;
          } else {
            document.getElementById(
              this.marks[i].studentID + "update"
            ).disabled = true;
            // document
            //   .getElementById(this.marks[i].studentID + "update")
            //   .remove();

            document.getElementById(this.marks[i].studentID).disabled = true;
          }
        }
      } else {
        this.checkSendData = false;
        if (document.getElementById("loadLast")) {
          document.getElementById("loadLast").disabled = false;
        }

        document.getElementById("sendData").disabled = false;
      }

      if (checkLoadLast) {
        for (let i = 0; i < this.marks.length; i++) {
          console.log("ЗАКОНЧИЛ123", i);
          // document.getElementById(this.marks[i]._id).disabled = false;
          console.log("ИЩЕТ ЭТОТ ID", this.marks[i].studentID);
          document.getElementById(this.marks[i].studentID).disabled = false;

          console.log("ИЩЕТ ЭТОТ ID", this.marks[i].studentID);
        }
      }

      let newArray = this.categoryCount.filter(function (f) {
        return f.name !== "";
      });
      newArray = newArray.filter(function (f) {
        return f.name !== undefined;
      });
      this.categoryCount = this.removeDuplicates(newArray);

      this.checkButtonHidden();
      await this.fullDownload();
    },

    selectedSelect() {
      let a;

      for (let i = 0; i < this.sClassInput.length; i++) {
        a = document.getElementById(this.sClassInput[i]._id);

        if (
          this.sClassInput[i].date === "Питался" &&
          this.sClassInput[i].Category !== ""
        ) {
          for (let c = 0; c < this.categoryCount.length; c++) {
            if (this.sClassInput[i].Category === this.categoryCount[c].name) {
              this.categoryCount[c].count += 1;
            }
          }
        }
        for (let j = 0; j <= this.causes.length; j++) {
          if (a.options[j].text === this.sClassInput[i].date) {
            a.options[j].selected = true;

            if (a.options[j].text === "") {
              a.name = "";
            } else {
              a.name = a.options[j].text;
            }
          }
        }
      }

      this.progress = 80;
    },

    async findMarksThis(data) {
      var temp1;
      temp1 = { classID: this.selectedClassID.classID, date: data }; //this.sDates.date };
      await TutorialDataService.findMarks(temp1)
        .then((response) => {
          var a = new Array();
          a = Object.values(response.data);
          temp1 = response.data;

          for (var i = 0; i < a.length; i++) {
            if (a[i].createdAt === a[i].updatedAt) {
              a[i].change = true;
            } else {
              a[i].change = false;
            }
            this.$set(this.marks, i, a[i]);
            //this.$set(this.marks, i, { change: true });
          }
        })
        .catch((e) => {
          console.log(e);
        });

      return temp1;
    },

    updateThisMark(data) {
      var markID;

      for (var j = 0; j < this.marks.length; j++) {
        if (this.marks[j].studentID === data._id) {
          markID = this.marks[j]._id;
        }
      }
      var datas = {
        causes: data.mark,
      };
      console.log(data, "DADADADAD", markID);
      TutorialDataService.updateMark(markID, datas)
        .then((response) => {
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
        })
        .catch((e) => {
          console.log("1111111111", e);
        });

      document.getElementById(data._id + "update").disabled = true;

      document.getElementById(data._id).disabled = true;
      document.getElementById(data._id + "update").remove();
    },

    async send() {
      this.progress = 10;
      let temp;
      var data = this.sClassInput;
      var datas = new Array();
      for (var i = 0; i < data.length; i++) {
        if (data[i].mark === undefined || data[i].mark === "") {
          temp = "";

          datas[i] = {
            date: this.sDates.date,
            classID: data[i].classID,
            studentID: data[i]._id,
            causesID: temp,
            cat: data[i].Category,
          };
        } else {
          temp = data[i].mark;
          datas[i] = {
            date: this.sDates.date,
            classID: data[i].classID,
            studentID: data[i]._id,
            causesID: temp,
            cat: data[i].Category,
          };
        }
      }
      this.progress = 30;
      await TutorialDataService.createMarks(datas)
        .then(async (response) => {
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
          this.checkSendData = true;
          this.progress = 50;
          if (this.selectedClass.classID != "admin" && response) {
            await this.clearFullData();
            this.progress = 60;
            this.$set(this.headers, 4, {
              text: this.sDates.date,
              value: "date",
              width: "40%",
              sortable: false,
            });
            await TutorialDataService.getAllCLass()
              .then((response) => {
                this.sClass = response.data.map(this.getDisplayClass);
              })
              .catch((e) => {
                console.log(e);
              });
            console.log(this.selectedClass);
            this.selectedClassID = this.selectedClass;
            this.progress = 80;
            await this.show(this.selectedClassID);
          }
        })
        .catch((e) => {
          console.log("1111111111", e);
        });
      //await this.retrieveClass();

      // document.getElementById("sendData").disabled = true;
      // this.checkSendData = true;
      // let bottomHidden = document.querySelectorAll("#update");
      // console.log(bottomHidden, "bottomHidden");
      // for (i = 0; i < bottomHidden.length; i++) {
      //   bottomHidden[i].hidden = false;
      //   bottomHidden[i].style = "display: flex";
      // }
      // for (i = 0; i < this.marks.length; i++) {
      //   console.log(i, this.marks, this.marks[i]._id);
      //   console.log(
      //     document.getElementById(this.marks[i].studentID + "update")
      //   );
      //   if (document.getElementById(this.marks[i].studentID + "update"))
      //     document.getElementById(
      //       this.marks[i].studentID + "update"
      //     ).disabled = false;
      // }
      // document.getElementById("loadLast").disabled = true;

      // this.show(data);
    },

    show(data) {
      this.checkSendData = true;
      this.sClassInput = [];
      data = this.selectedClassID;
      console.log(data);
      TutorialDataService.findStudentByClassID(data)
        .then((response) => {
          this.sClassInput.splice(response.data);
          var a = new Array();
          a = Object.values(response.data);
          for (var i = 0; i < a.length; i++) {
            this.$set(this.sClassInput, i, a[i]);
          }

          // this.$set(this.sClassInput, 3, a);
        })
        .catch((e) => {
          console.log(e);
        });

      if (this.sDates.date) {
        this.load(this.sDates.date);
      }
    },

    getDate() {
      let plus = 3; // Сколько времени прибавляем (+3 это время по Москве)
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "http://worldtimeapi.org/api/timezone/Europe/London",
        false
      ); // Делаем запрос по Лондону
      xhr.send(); // отправляем
      if (xhr.status != 200) {
        console.log(xhr.status + ": " + xhr.statusText); // Если статус не равен 200, то выводим ошибку.
      } else {
        let time = xhr.responseText; // получаем текст ответа
        let z = JSON.parse(time).utc_datetime; // Получаем время utc
        let time1 = new Date(z).getTime(); // Переводим в timestamp
        let timestampPlus = time1 + plus * 60 * 60 * 1000; // Воемя +3 часа. Если надо получить время UTC, то убираем просто параметр plus
        let timePlus = new Date(timestampPlus); // Переводим во время (Тут надо понимать, что система сама переведёт его в текущую временную зону
        let result = timePlus.toUTCString(); // Переводим в строку UTC;
        console.log(result, "!!!!!!!!!!!!!!!"); // Выводим дату.
        return result;
      }
    },

    async retrieveClass() {
      //поставить текущую дату
      document.getElementById("Date").value = this.DateInternet;

      console.log(new Date(this.DateInternet));
      this.$set(
        this.sDates,
        "date",
        new Date(this.DateInternet).toISOString().slice(0, 10)
      );
      // добавить колонку с датой и выбором
      this.$set(this.headers, 4, {
        text: this.sDates.date,
        value: "date",
        width: "40%",
        sortable: false,
      });

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
        await this.show();
        document.getElementById("class").disabled = true;
      }
    },

    getDisplayClassID(data) {
      return {
        classID: data.data._id,
        className: data.data.className,
        classLider: data.data.classLider,
      };
    },
    getDisplayCauses(data) {
      return {
        id: data._id,
        causes: data.causes,
        count: 0,
      };
    },

    getDisplayClass(data) {
      return {
        classID: data._id,
        className: data.className,
      };
    },

    checkButtonHidden() {
      if (
        this.sDates.date ===
        new Date(this.DateInternet).toISOString().slice(0, 10)
      ) {
        console.log(this.sDates.date, "OKKKKKKKKK");

        for (let i = 0; i < this.marks.length; i++) {
          let but = document.getElementById(this.marks[i].studentID + "update");
          //let inputBut = document.getElementById(this.marks[i].studentID);
          if (but != null && but.disabled) {
            but.remove();
          }
        }
      } else {
        console.log("BADDD");
        for (let i = 0; i < this.marks.length; i++) {
          let but = document.getElementById(this.marks[i].studentID + "update");
          if (but != null) {
            but.remove();
          }
        }
      }
    },

    removeDuplicates(arr) {
      const result = [];
      const duplicatesIndices = [];

      // Перебираем каждый элемент в исходном массиве
      arr.forEach((current, index) => {
        if (duplicatesIndices.includes(index)) return;

        result.push(current);

        // Сравниваем каждый элемент в массиве после текущего
        for (
          let comparisonIndex = index + 1;
          comparisonIndex < arr.length;
          comparisonIndex++
        ) {
          const comparison = arr[comparisonIndex];
          const currentKeys = Object.keys(current);
          const comparisonKeys = Object.keys(comparison);

          // Проверяем длину массивов
          if (currentKeys.length !== comparisonKeys.length) continue;

          // Проверяем значение ключей
          const currentKeysString = currentKeys.sort().join("").toLowerCase();
          const comparisonKeysString = comparisonKeys
            .sort()
            .join("")
            .toLowerCase();
          if (currentKeysString !== comparisonKeysString) continue;

          // Проверяем индексы ключей
          let valuesEqual = true;
          for (let i = 0; i < currentKeys.length; i++) {
            const key = currentKeys[i];
            if (current[key] !== comparison[key]) {
              valuesEqual = false;
              break;
            }
          }
          if (valuesEqual) duplicatesIndices.push(comparisonIndex);
        } // Конец цикла
      });
      return result;
    },

    showTable() {
      this.checkShowTable = true;
    },

    fullDownload() {
      console.log("123");
      this.progress = 100;
    },
  },
  mounted() {
    this.DateInternet = this.getDate();
    console.log(this.DateInternet);
    this.retrieveClass();
  },

  computed: {
    // геттер вычисляемого значения

    countedCausesDef: function () {
      // `this` указывает на экземпляр vm
      return this.causesDefault[0].count - this.causesDefault[1].count;
    },
  },
};
</script>

<style>
.v-data-table > .v-data-table > table > tbody > tr > td,
.v-data-table > .v-data-table > table > thead > tr > td,
.v-data-table > .v-data-table > table > tfoot > tr > td {
  height: 10px;
}
.form-select {
  height: 40px;
}
</style>
