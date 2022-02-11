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
          @change="load(sDates.date)"
        />
        <div v-if="selectedClassID">
          <br />
          <button @click="loadLastDay" id="loadLast" class="btn btn-success">
            Загрузить значения прошлого дня
          </button>
        </div>
      </div>
      <div>
        <div class="flex-ul">
          <ul v-for="caus in causes" :key="caus.causes">
            <li>
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
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0 1%;
  margin: 0 0px 0px 0px;
}
.flex:only-child {
  margin: 200px 200px 200px 200px;
}
.flex-bottom {
  padding-top: 2px;
  text-align: center;
  display: flex;
  flex-direction: column;
}
.flex-input {
  padding-top: 2px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.flex li {
  text-align: center;
  display: flex;
  padding-bottom: 0px;
}
.flex button {
  text-align: center;
  display: flex;
  margin-bottom: 20px;
  margin-left: 20px;
}

.myTable {
  display: flex;
  max-width: 800px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

tbody tr:nth-of-type(even) {
  background-color: rgb(245, 245, 245);
}

tbody tr:nth-of-type(odd) {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
}

.v-data-table-header {
  background-color: rgb(80, 81, 141);
}
.v-data-table-header span {
  color: rgb(255, 255, 255);
  font-size: 16px;
}

.v-data-footer {
  background-color: rgb(255, 255, 255);
}
.text-start {
  border: 1px solid grey;
}
navbar {
  border: 1px solid grey;
  background-color: rgb(204, 204, 204);
}

.flex2 {
  padding-top: 2%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 150%;
}
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
      await console.log(this.marks);
      var data = document.getElementById("Date").valueAsNumber;
      data = data - 86400000;
      var data2 = data;
      var date = new Date(data);
      data = date.toISOString().slice(0, 10);
      var test = this.findMarksThis(date.toISOString().slice(0, 10));
      await this.pow(3, data, test, data2);
    },

    countMarks(data, id, mark) {
      var a = document.getElementById(id);

      var b = a.options[a.selectedIndex || 0].value;
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
    },

    async load(data) {
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
      // console.log("ЬФФФФФФФФФФФФФКФЫВА", this.marks.length);
      if (this.marks.length > 0) {
        document.getElementById("loadLast").disabled = true;
      } else {
        document.getElementById("loadLast").disabled = false;
      }
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
      // console.log("END");
      // console.log(this.sDates);
    },

    async findMarksThis(data) {
      var temp1;
      temp1 = { classID: this.selectedClassID.classID, date: data }; //this.sDates.date };
      await TutorialDataService.findMarks(temp1)
        .then((response) => {
          var a = new Array();
          a = Object.values(response.data);
          temp1 = response.data;
          // if (a.length > 0) {
          //   console.log("@@@нашелЯ", response.data);
          // } else {
          //   console.log("@@@@НЕнашелЯ", response.data);
          // }
          for (var i = 0; i < a.length; i++) {
            this.$set(this.marks, i, a[i]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      return temp1;
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
          };
        } else {
          temp = data[i].mark;
          datas[i] = {
            date: this.sDates.date,
            classID: data[i].classID,
            studentID: data[i]._id,
            causesID: temp,
          };
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

      console.log(document.getElementById("sendData"));
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
        this.load(this.sDates.date);
      }
    },

    retrieveClass() {
      //поставить текущую дату
      console.log(this.sDates);
      document.getElementById("Date").value = new Date();
      console.log(this.sDates);
      this.$set(this.sDates, "date", new Date().toISOString().slice(0, 10));
      // добавить колонку с датой и выбором
      this.$set(this.headers, 4, {
        text: this.sDates.date,
        value: "date",
        width: "20%",
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
