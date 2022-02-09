<template>
  <v-row align="center" class="list px-3 mx-auto">
    <div>
      <br />
      <br />
      <br />
      Класс
      <select class="form-select" v-model="selectedClassID">
        <option
          v-for="user in sClass"
          :key="user.className"
          v-bind:value="user"
        >
          {{ user.className }}
        </option>
      </select>
      <span
        >Выбрано: {{ selectedClassID.classID }}
        {{ selectedClassID.className }}</span
      >
    </div>

    <div>
      Категория
      <select class="form-select" v-model="Category">
        <option
          v-for="cat in sCategory"
          :key="cat.Category"
          v-bind:value="cat.Category"
        >
          {{ cat.Category }}
        </option>
      </select>
    </div>

    <div class="submit-form mt-3 mx-auto">
      <div class="submit-form">
        <div class="form-group">
          <label for="className">Фамилия</label>
          <input type="text" class="form-control" required v-model="LastName" />
        </div>
        <div class="form-group">
          <label for="classLider">Имя</label>
          <input
            type="text"
            class="form-control"
            required
            v-model="FirstName"
          />
        </div>
        <div class="form-group">
          <label for="classLider">Отчество</label>
          <input type="text" class="form-control" required v-model="Surname" />
        </div>
        <div class="form-group">
          <label for="classLider">Дата поступления</label>
          <input
            type="date"
            class="form-control"
            required
            v-model="ReceiptDate"
          />
        </div>
        <div class="form-group">
          <label for="classLider">Категория</label>
          <input type="text" class="form-control" required v-model="Category" />
        </div>
      </div>
      <br />
      <button @click="createStudent" class="btn btn-success">
        Создать ученика
      </button>
    </div>
  </v-row>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
export default {
  data() {
    return {
      sClass: [{ className: "NO" }],
      sCategory: [{ Category: "1" }],
      selectedClassID: "",
      classID: "",
      LastName: "",
      FirstName: "",
      Surname: "",
      ReceiptDate: "",
      Category: "",
    };
  },

  methods: {
    createStudent() {
      var data = {
        classID: this.selectedClassID.classID,
        LastName: this.LastName,
        FirstName: this.FirstName,
        Surname: this.Surname,
        // ReceiptDate: "2",
        Category: this.Category,
      };

      TutorialDataService.createStudent(data)
        .then((response) => {
          //this.sClass.id = response.data.id;
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
          this.refreshList();
        })
        .catch((e) => {
          console.log("1111111111", e);
        });
    },

    retrieveCategory() {
      TutorialDataService.getCategory()
        .then((response) => {
          this.sCategory = response.data.map(this.getDisplayCategory);
          console.log("sdasdad", response.data);
          console.log("sdasdad", this.sCategory);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    retrieveTutorials() {
      TutorialDataService.getAllCLass()
        .then((response) => {
          this.sClass = response.data.map(this.getDisplayTutorial);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    refreshList() {
      this.retrieveTutorials();
      this.retrieveCategory();
    },

    getDisplayTutorial(data) {
      return {
        classID: data._id,
        className: data.className,
      };
    },

    getDisplayCategory(data) {
      console.log("dadadadad", data);
      return {
        Category: data.cat,
      };
    },
  },
  mounted() {
    this.retrieveTutorials();
    this.retrieveCategory();
  },
};
</script>

<style></style>
