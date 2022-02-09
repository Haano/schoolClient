<template>
  <div>
    <v-row align="center" class="list px-3 mx-auto">
      <div class="myTable">
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
      </div>
      <div class="myTable">
        <label for="className">Выбрать день</label>
        <input
          type="date"
          id="Date"
          class="form-control"
          value="2018-07-22"
          required
          v-model="sDates.date"
          @change="load"
        />
      </div>
      <div>
        <div class="flex">
          <button @click="load" class="btn btn-success">Загрузить</button>
          <v-card-actions v-if="marks.length == 0">
            <button
              id="sendData"
              class="btn btn-primary"
              @click="send()"
              color="primary"
            >
              ОТПРАВИТЬ ДАННЫЕ
            </button>
          </v-card-actions>
          <v-card-actions v-else>
            <button
              id="sendData"
              class="btn btn-primary"
              @click="send()"
              color="primary"
              disabled="true"
            >
              ОТПРАВИТЬ ДАННЫЕ
            </button>
          </v-card-actions>
        </div>
      </div>
    </v-row>
    <div class="flex">
      <ul v-for="caus in causes" :key="caus.causes" class="flex2">
        <li>
          {{ caus.causes }}
          = {{ caus.count }}
        </li>
      </ul>
    </div>

    <div class="myTable">
      <v-col>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="this.sClassInput"
            :items-per-page="10"
            required
          >
            <template v-slot:[`item.date`]="{ item }">
              <div class="d-flex flex-column">
                <select
                  class="form-select"
                  name="marks"
                  v-bind:id="item._id"
                  @change="countMarks(item.mark, item._id, item)"
                  v-bind:title="item.date"
                >
                  <!-- v-model="item.mark" -->
                  <option value=""></option>
                  <option v-for="caus in causes" :key="caus.causes">
                    {{ caus.causes }}
                  </option>
                </select>
                <!-- <span>{{ item.date }}{{ item }}</span> -->
                <!-- <v-card-actions v-if="marks.length > 0">
                  <button @click="test2(item)" class="btn btn-success">
                    Обновить
                  </button>
                </v-card-actions>
                <v-card-actions v-else>
                  <button
                    @click="test2(item)"
                    class="btn btn-success"
                    disabled="true"
                  >
                    Обновить
                  </button>
                </v-card-actions> -->
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </div>
  </div>
</template>

<style>
.flex {
  padding-top: 2%;
  text-align: center;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  flex-direction: row;
  justify-content: center;
}

.myTable {
  max-width: 60%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

tbody tr:nth-of-type(even) {
  background-color: rgba(236, 237, 237);
}

tbody tr:nth-of-type(odd) {
  background-color: rgb(250, 250, 250);
}

.v-data-table-header {
  background-color: rgba(182, 183, 187);
  color: white;
}

.v-data-footer {
  background-color: rgb(250, 250, 250);
}

.theme--light.v-data-table thead tr th {
  color: white;
}

.flex2 {
  padding-top: 2%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 150%;
}

ul.flex2 li {
  display: inline;
  margin-right: 20px; /* Отступ слева */
  border: 1px solid #000; /* Рамка вокруг текста */
  padding: 3px; /* Поля вокруг текста */
}
</style>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  data() {
    return {
      countMark: [],
      sClass: [{ className: "123", classID: "sadasd" }, { className: "122" }],
      sClassInput: [
        {
          className: "123",
          classID: "sadasd",
          classLider: "asdasd",
          date: "123",
        },
        { classID: "123123" },
      ],
      selectedClassID: [],
      selectedMarks: [],
      sDates: [],
      marks: [],
      causes: [
        { id: "1", causes: "от", count: 0 },
        { id: "12", causes: "оd", count: 0 },
      ],
      title: "",
      headers: [
        { text: "Фамилия", value: "FirstName", sortable: false, width: "10%" },
        { text: "Имя", value: "LastName", sortable: false, width: "10%" },
        { text: "Категория", value: "Category", sortable: false, width: "5%" },
      ],
    };
  },

  methods: {
    countMarks(data, id, mark) {
      var a = document.getElementById(id);

      var b = a.options[a.selectedIndex || 0].value;
      console.log("a", a, "mark", mark, "id", id, data, "b,=", b);
      mark.mark = b;
      // this.$set(this.mark, "mark", b);

      console.log(mark);
      if (a.name === "marks") {
        for (var i = 0; i < this.causes.length; i++) {
          if (mark.mark === this.causes[i].causes) {
            this.causes[i].count += 1;
          }
        }
      } else {
        for (var j = 0; j < this.causes.length; j++) {
          if (a.name === this.causes[j].causes) {
            this.causes[j].count -= 1;
          }
        }
        for (i = 0; i < this.causes.length; i++) {
          if (mark.mark === this.causes[i].causes) {
            this.causes[i].count += 1;
          }
        }
      }
      a.name = mark.mark;
      console.log("стало", a.name);
    },

    async load() {
      // document.getElementById("sendData").disabled = true;
      this.headers[4].text = this.sDates.date;
      this.marks = Array();
      this.marks.splice(0);
      for (var i = 0; i < this.sClassInput.length; i++) {
        this.$set(this.sClassInput[i], "date", "");
      }
      await this.findMarksThis();
      console.log(
        "MAAAAAAAAssssssssAAAAAAAAAAAAAAAAARK",
        this.marks,
        this.marks.length,
        this.sClassInput
      );
      await TutorialDataService.getAllCauses().then((response) => {
        this.causes = response.data.map(this.getDisplayCauses);
      });

      for (i = 0; i < this.sClassInput.length; i++) {
        for (var j = 0; j < this.marks.length; j++) {
          if (this.sClassInput[i]._id === this.marks[j].studentID) {
            this.$set(this.sClassInput[i], "date", this.marks[j].causesID);

            for (var c = 0; c < this.causes.length; c++) {
              if (this.causes[c].causes === this.marks[j].causesID) {
                this.$set(this.causes[c], "count", (this.causes[c].count += 1));
              }
            }
          }
        }
      }
      await this.selectedSelect();
    },

    async selectedSelect() {
      var a;

      for (var i = 0; i < this.sClassInput.length; i++) {
        for (var j = 0; j <= this.causes.length; j++) {
          a = document.getElementById(this.sClassInput[i]._id);
          if (a.options[j].text === this.sClassInput[i].date) {
            a.options[j].selected = true;
            a.name = a.options[j].text;
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
      console.log("END");
      console.log(this.sDates);
    },

    async findMarksThis() {
      var temp1;
      temp1 = { classID: this.selectedClassID.classID, date: this.sDates.date };
      await TutorialDataService.findMarks(temp1)
        .then((response) => {
          var a = new Array();
          a = Object.values(response.data);
          for (var i = 0; i < a.length; i++) {
            this.$set(this.marks, i, a[i]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    test2(data) {
      var datas = {
        date: this.sDates.date,
        classID: data.classID,
        studentID: data._id,
        causesID: data.mark,
      };
      console.log("вывел2", datas);
      TutorialDataService.createMarks(datas)
        .then((response) => {
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
        })
        .catch((e) => {
          console.log("1111111111", e);
        });
    },

    send(id) {
      let temp;
      var data = this.sClassInput;
      console.log("вывел", data.length);
      var datas = new Array();
      var j = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].mark) {
          temp = data[i].mark;

          datas[j] = {
            date: this.sDates.date,
            classID: data[i].classID,
            studentID: data[i]._id,
            causesID: temp,
          };
          j++;
        }
      }
      console.log("вывел2", datas);
      TutorialDataService.createMarks(datas)
        .then((response) => {
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
        })
        .catch((e) => {
          console.log("1111111111", e);
        });

      console.log(id, document.getElementById("sendData"));
      document.getElementById("sendData").disabled = true;
    },

    show(data) {
      console.log("mAAAAAAARKS изначально", this.marks);

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
        this.load();
      }
    },

    retrieveClass() {
      console.log(this.sDates);
      document.getElementById("Date").value = new Date();
      console.log(this.sDates);
      this.$set(this.sDates, "date", new Date().toISOString().slice(0, 10));
      this.$set(this.headers, 4, {
        text: this.sDates.date,
        value: "date",
        width: "20%",
      });
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
