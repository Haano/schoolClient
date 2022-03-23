<template>
  <div>
    <div class="flex">
      <div>
        <br />
        Класс
        <select
          class="form-select"
          v-model="selectedClassID"
          @change="show(selectedClassID)"
        >
          <option
            v-for="user in sClass"
            :key="user.className"
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
        <div v-if="selectedClassID">
          <br />
          <button @click="loadLastDay()" id="loadLast" class="btn btn-success">
            Загрузить значения прошлого дня
          </button>
        </div>
      </div>
      <div>
        <div class="flex-ul">
          <ul>
            <li v-for="caus in causesDefault" :key="caus.causes">
              {{ caus.causes }}
              = {{ caus.count }}
            </li>
          </ul>
          <ul>
            <li v-for="caus in causes" :key="caus.causes">
              {{ caus.causes }}
              = {{ caus.count }}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div v-if="marks.length == 0">
          <button
            id="sendData"
            class="btn btn-primary"
            @click="send()"
            color="primary"
          >
            ОТПРАВИТЬ ДАННЫЕ
          </button>
        </div>

        <div v-else>
          <button
            id="sendData"
            class="btn btn-primary"
            @click="send()"
            color="primary"
            disabled="true"
          >
            ОТПРАВИТЬ ДАННЫЕ
          </button>
        </div>
      </div>
    </div>
    <div class="myTable">
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
              <v-card-actions id="update" v-show="marks.length > 0">
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
  </div>
</template>

<style>
@import "../assets/style.css";
</style>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  data() {
    return {
      countMark: [],
      sClass: [{ className: "123", classID: "sadasd" }],
      sClassInput: [],
      selectedClassID: [],
      selectedMarks: [],
      sDates: [],
      marks: [],
      causesDefault: [
        { id: "1", causes: "Всего учеников:", count: 0 },
        { id: "2", causes: "Присутствует:", count: 0 },
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
    async pow(x, data, test, data2) {
      if (x === 0) {
        return;
      }
      if (Object.keys(await test).length > 0) {
        await this.load(data);
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
      let bottomHidden = document.querySelectorAll("#update");

      for (var i = 0; i < bottomHidden.length; i++) {
        bottomHidden[i].hidden = true;
      }
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
        // if (this.sClassInput[i].count) {
        //
        // }
      }
    },

    async load(data) {
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
      });

      this.$set(this.causesDefault[1], "count", 0);

      for (i = 0; i < this.sClassInput.length; i++) {
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

      let toDay = new Date().toISOString().slice(0, 10);
      // this.$set(this.causesDefault[1], "count", this.sClassInput.length);
      if (this.marks.length > 0) {
        document.getElementById("loadLast").disabled = true;
        document.getElementById("sendData").disabled = true;

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
          }
        }
      } else {
        document.getElementById("loadLast").disabled = false;
        document.getElementById("sendData").disabled = false;
      }
    },

    async selectedSelect() {
      var a;

      for (var i = 0; i < this.sClassInput.length; i++) {
        for (var j = 0; j <= this.causes.length; j++) {
          a = document.getElementById(this.sClassInput[i]._id);
          if (a.options[j].text === this.sClassInput[i].date) {
            a.options[j].selected = true;

            if (a.options[j].text === "") {
              a.name = "";
            } else {
              a.name = a.options[j].text;
            }
          }

          // else {
          //   if (a.options[j].text === "Питался") {
          //     a.options[j].selected = true;
          //     a.name = a.options[j].text;
          //     this.$set(
          //       this.causes[j - 1],
          //       "count",
          //       (this.causes[j - 1].count += 1)
          //     );
          //     console.log("asdasd");
          //   }
          // }
        }
      }
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

      TutorialDataService.updateMark(markID, datas)
        .then((response) => {
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
        })
        .catch((e) => {
          console.log("1111111111", e);
        });

      document.getElementById(data._id + "update").disabled = true;
    },

    send() {
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
      TutorialDataService.createMarks(datas)
        .then((response) => {
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
        })
        .catch((e) => {
          console.log("1111111111", e);
        });

      document.getElementById("sendData").disabled = true;
      let bottomHidden = document.querySelectorAll("#update");
      for (i = 0; i < bottomHidden.length; i++) {
        bottomHidden[i].hidden = false;
        bottomHidden[i].style = "display: flex";
      }
      document.getElementById("loadLast").disabled = true;

      // this.show(this.selectedClassID);
    },

    show(data) {
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

    retrieveClass() {
      //поставить текущую дату
      document.getElementById("Date").value = new Date();
      this.$set(this.sDates, "date", new Date().toISOString().slice(0, 10));
      // добавить колонку с датой и выбором
      this.$set(this.headers, 4, {
        text: this.sDates.date,
        value: "date",
        width: "40%",
        sortable: false,
      });

      //получить список классов
      TutorialDataService.getAllCLass()
        .then((response) => {
          this.sClass = response.data.map(this.getDisplayClass);
        })
        .catch((e) => {
          console.log(e);
        });
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
  },
  mounted() {
    this.retrieveClass();
  },
};
</script>

<style></style>
