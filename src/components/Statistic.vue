<template>
  <div>
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

      //получить список всех учеников (запись в переменную students)
      await TutorialDataService.findStudentByClassID().then((response) => {
        var students = new Array();
        students = Object.values(response.data);
        for (var j = 0; j <= students.length - 1; j++) {
          if (students[j] != undefined) {
            this.studentsList.push(students[j]);
          }
          // this.$set(this.studentsList[j], "FirstName", students[j].FirstName);
          // this.$set(this.studentsList[j], "LastName", students[j].LastName);
        }
      });

      //получить список всех классов (classList)
      TutorialDataService.getAllCLass()
        .then((response) => {
          this.classList = response.data.map(this.getDisplayClass);
        })
        .catch((e) => {
          console.log(e);
        });
      var temp1;
      temp1 = { classID: null, date: this.sDates.date }; //this.sDates.date };

      // получить отметки за день marks - все, marksPrint - только те, которые НЕ Питался и НЕ пустые
      await TutorialDataService.findMarks(temp1)
        .then((response) => {
          var a = new Array();
          a = Object.values(response.data);

          for (var p = 0; p < a.length; p++) {
            if (a[p].causesID != "" && a[p].causesID != "Питался") {
              this.marksPrint.push(a[p]);
            }
          }
          this.marks = a;

          //поместить в массив marksPrint имя класса, для отображения в таблице, а также для плиток сдачи отчета (зеленые, синие)
          for (var i = 0; i < this.classList.length; i++) {
            for (p = 0; p < this.marks.length; p++) {
              if (this.marks[p].classID === this.classList[i].classID) {
                this.classList[i].marks.push(this.marks[p].causesID);
                console.log("НАшел student");
                if (this.marks[p].createdAt != this.marks[p].updatedAt) {
                  this.$set(this.classList[i], "change", true);
                }
              }
            }
            for (var j = 0; j < this.marksPrint.length; j++) {
              if (this.marksPrint[j].classID === this.classList[i].classID) {
                this.$set(
                  this.marksPrint[j],
                  "className",
                  this.classList[i].className
                );
                // this.classList[i].marks.push(a[i]);
                // if (
                //   this.marksPrint[j].createdAt != this.marksPrint[j].updatedAt
                // ) {
                //   this.$set(this.classList[i], "change", true);
                // }
              }
            }
          }

          // поместить в массив  marksPrint имена и фамилии учеников
          console.log("STUDENST LIST", this.studentsList);
          for (i = 0; i < this.studentsList.length; i++) {
            for (j = 0; j < this.marksPrint.length; j++) {
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
              }
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });

      console.log(this.marks);
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
