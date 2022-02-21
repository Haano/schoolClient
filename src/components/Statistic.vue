<template>
  <div>
    <div class="cat">
      <div class="cat-item">
        <input
          type="date"
          id="Date"
          class="form-control"
          required
          v-model="sDates.date"
          @change="findMarksThis()"
        />
        <button @click="findMarksThis()" class="btn btn-success">
          Обновить
        </button>
      </div>
    </div>
    <div class="shift-name">
      <div class="class-mark">
        <div class="class-mark-item-text">1 смена</div>
      </div>
      <div class="class-mark">
        <div class="class-mark-item-text">2 смена</div>
      </div>
    </div>

    <br />
    <div class="class-marks">
      <div class="class-mark">
        <div v-for="value in classList" :key="value.classname">
          <div
            v-if="
              value.marks.length != 0 &&
              value.shift === '1 смена' &&
              value.change === false
            "
            v-bind:class="activeClassOK"
          >
            {{ value.className }}
          </div>
          <div
            v-if="
              value.marks.length === 0 &&
              value.shift === '1 смена' &&
              value.change === false
            "
            v-bind:class="activeClassBAD"
          >
            {{ value.className }}
          </div>
          <div
            v-if="
              value.marks.length != 0 &&
              value.shift === '1 смена' &&
              value.change === true
            "
            v-bind:class="activeClassChange"
          >
            {{ value.className }}
          </div>
        </div>
      </div>
      <div class="class-mark">
        <div v-for="value in classList" :key="value.classname">
          <div
            v-if="
              value.marks.length != 0 &&
              value.shift === '2 смена' &&
              value.change === false
            "
            v-bind:class="activeClassOK"
          >
            {{ value.className }}
          </div>
          <div
            v-if="value.marks.length === 0 && value.shift === '2 смена'"
            v-bind:class="activeClassBAD"
          >
            {{ value.className }}
          </div>
          <div
            v-if="
              value.marks.length != 0 &&
              value.shift === '2 смена' &&
              value.change === true
            "
            v-bind:class="activeClassChange"
          >
            {{ value.className }}
          </div>
        </div>
      </div>
    </div>

    <v-col>
      <v-data-table
        :headers="headers"
        :items="this.marksPrint"
        :items-per-page="3000"
        hide-default-footer
      >
      </v-data-table>
    </v-col>

    <button @click="help()" class="btn btn-success">Помощь</button>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
export default {
  data() {
    return {
      headers: [
        {
          text: "Класс",
          value: "className",
          sortable: true,
        },
        {
          text: "Фамилия",
          value: "LastName",
          sortable: false,
        },
        {
          text: "Имя",
          value: "FirstName",
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
      ],
      marks: [],
      marksPrint: [],
      sDates: [],
      classList: [],
      studentsList: [{ FirstName: "1", LastName: "2" }],
      activeClassOK: "class-mark-item-ok",
      activeClassBAD: "class-mark-item-BAD",
      activeClassChange: "class-mark-item-change",
    };
  },
  methods: {
    help() {
      alert(
        "Красная - еще не подали \nСиняя - подали, но изменили в течении дня \nЗеленые - подали без изменения"
      );
    },
    async findMarksThis() {
      this.classList.splice(0);
      this.studentsList.splice(0);
      this.marks.splice(0);
      this.marksPrint.splice(0);
      await TutorialDataService.findStudentByClassID().then((response) => {
        var students = new Array();
        students = Object.values(response.data);
        for (var j = 0; j <= students.length - 1; j++) {
          if (students[j] != undefined) {
            this.studentsList.push(students[j]);
          }
          // this.$set(this.studentsList[j], "FirstName", students[j].FirstName);
          // this.$set(this.studentsList[j], "LastName", students[j].LastName);
          console.log("@@@", this.studentsList[j], j);
        }
      });

      TutorialDataService.getAllCLass()
        .then((response) => {
          this.classList = response.data.map(this.getDisplayClass);
        })
        .catch((e) => {
          console.log(e);
        });
      var temp1;
      temp1 = { classID: null, date: this.sDates.date }; //this.sDates.date };

      await TutorialDataService.findMarks(temp1)
        .then((response) => {
          var a = new Array();
          a = Object.values(response.data);

          console.log("111", a);
          for (var p = 0; p < a.length; p++) {
            if (a[p].causesID != "" && a[p].causesID != "Питался") {
              this.marksPrint.push(a[p]);
            }
          }
          this.marks = a;

          for (j = 0; j < this.classList.length; j++) {
            for (i = 0; i < a.length; i++) {
              if (this.classList[j].classID === a[i].classID) {
                if (a[i].classID === this.classList[j].classID) {
                  this.$set(a[i], "className", this.classList[j].className);
                }

                this.classList[j].marks.push(a[i]);

                if (a[i].createdAt != a[i].updatedAt) {
                  this.$set(this.classList[j], "change", true);
                }
              }
            }
          }

          for (var j = 0; j < a.length; j++) {
            for (var i = 0; i <= this.studentsList.length - 1; i++) {
              if (a[j].studentID === this.studentsList[i]._id) {
                this.$set(a[j], "FirstName", this.studentsList[j].FirstName);
                this.$set(a[j], "LastName", this.studentsList[j].LastName);
              }
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });

      return temp1;
    },

    retrieveData() {
      //поставить текущую дату
      document.getElementById("Date").value = new Date();
      this.$set(this.sDates, "date", new Date().toISOString().slice(0, 10));

      this.findMarksThis();
    },

    getDisplayClass(data) {
      return {
        classID: data._id,
        className: data.className,
        marks: [],
        shift: data.shift,
        change: false,
      };
    },
  },
  mounted() {
    this.retrieveData();
  },
};
</script>

<style>
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

  /* justify-self: center; */
}

.class-mark {
  max-width: 450px;
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
</style>
