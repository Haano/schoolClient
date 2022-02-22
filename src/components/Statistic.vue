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

    <div class="myTable">
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
    async initialization() {
      this.clearFullData();

      await this.getAllClass(); //get классов в classList
      await this.getMarks(); // получить все марки (marks and marksPrint)
      await this.findAllStudents(); // получить всех учеников (students)
      await this.defineTileColorClass(); //покрасить плитки в нужный цвет

      //посчитать данные
    },

    clearFullData() {
      this.classList = [];
      this.marks = [];
      this.students = [];
      this.marksPrint = [];
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
          console.log("MARKS", this.sDates.date);
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
      alert(
        "Красная - еще не подали \nСиняя - подали, но изменили в течении дня \nЗеленые - подали без изменения",
      );
    },
    async getFullNameStudents() {
      // поместить в массив  marksPrint имена и фамилии учеников
      for (let i = 0; i < this.studentsList.length; i++) {
        for (let j = 0; j < this.marksPrint.length; j++) {
          if (this.marksPrint[j].studentID === this.studentsList[i]._id) {
            this.$set(
              this.marksPrint[j],
              "FirstName",
              this.studentsList[i].FirstName,
            );
            this.$set(
              this.marksPrint[j],
              "LastName",
              this.studentsList[i].LastName,
            );
          }
        }
      }

      return;
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
      };
    },
  },
  mounted() {
    this.initialization();
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
</style>
