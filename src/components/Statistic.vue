<template>
  <div>
    <div class="flex">
      <div>
        <label for="className">Выбрать день</label>
        <input
          type="date"
          id="Date"
          class="form-control"
          required
          v-model="sDates.date"
        />
      </div>
    </div>
    <div class="shift-name">
      <div class="class-mark">
        <div class="class-mark-item-ok">1 смена</div>
      </div>
      <div class="class-mark">
        <div class="class-mark-item-ok">2 смена</div>
      </div>
    </div>

    <br />
    <div class="class-marks">
      <div class="class-mark">
        <div v-for="value in classList" :key="value.classname">
          <div
            v-if="value.marks.length != 0 && value.shift === '1 смена'"
            v-bind:class="activeClassOK"
          >
            {{ value.className }}
          </div>
          <div
            v-if="value.marks.length === 0 && value.shift === '1 смена'"
            v-bind:class="activeClassBAD"
          >
            {{ value.className }}
          </div>
        </div>
      </div>
      <div class="class-mark">
        <div v-for="value in classList" :key="value.classname">
          <div
            v-if="value.marks.length != 0 && value.shift === '2 смена'"
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
        </div>
      </div>
    </div>

    <button @click="findMarksThis()" class="btn btn-success">Обновить</button>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
export default {
  data() {
    return {
      marks: [],
      sDates: [],
      classList: [],
      activeClassOK: "class-mark-item-ok",
      activeClassBAD: "class-mark-item-BAD",
    };
  },
  methods: {
    async findMarksThis() {
      this.classList.splice(0);
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
          temp1 = response.data;
          console.log("Я ПОЛУЧИЛ ВСЕ", a);
          for (var j = 0; j <= this.classList.length; j++) {
            for (var i = 0; i < a.length; i++) {
              console.log("Я  ВСЕ", a[i].classID);
              console.log(this.classList[j].classID, "DDD");
              if (this.classList[j].classID === a[i].classID) {
                console.log(this.classList[j].classID, "DDD");
                this.classList[j].marks.push(a[i]);
                //  this.$push(this.classList[j].marks, a[i]);
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
      console.log(this.sDates);
      document.getElementById("Date").value = new Date();
      console.log(this.sDates);
      this.$set(this.sDates, "date", new Date().toISOString().slice(0, 10));

      this.findMarksThis();
    },

    getDisplayClass(data) {
      return {
        classID: data._id,
        className: data.className,
        marks: [],
        shift: data.shift,
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
.class-mark-item-ok {
  background-color: green;
  margin: 1px;
  color: white;
  padding: 10px 10px 10px 10px;
}
.class-mark-item-BAD {
  background-color: rgb(128, 0, 0);
  color: white;
  margin: 1px;
  padding: 10px 10px 10px 10px;
}
</style>
