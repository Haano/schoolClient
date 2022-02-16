<template>
  <div class="cat">
    <div class="cat">
      <div class="cat-item">
        <label for="className">Категория</label>
        <input
          type="text"
          class="form-control"
          required
          v-model="sCategory.Category"
        />
        <button @click="createCategory" class="btn btn-success">
          Создать Категорию
        </button>
        <v-data-table
          :headers="headersCat"
          :items="sCategory"
          disable-pagination
          :hide-default-footer="true"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="deleteCategory(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </div>
      <div class="cat-item">
        <label for="className">Причины</label>
        <input
          type="text"
          class="form-control"
          required
          v-model="sCauses.causes"
        />
        <button @click="createCauses" class="btn btn-success">
          Создать Причину
        </button>

        <v-data-table
          :headers="headers"
          :items="sCauses"
          disable-pagination
          :hide-default-footer="true"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small @click="deleteCauses(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </div>
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
      sCategory: [],
      sCauses: [{ sCauses: "123" }],
      headers: [
        { text: "Причина", value: "sCauses" },
        { text: "Удаление", value: "actions", sortable: false },
      ],
      headersCat: [
        { text: "Категория", value: "sCategory" },
        { text: "Удаление", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    show() {
      TutorialDataService.getAllCauses()
        .then((response) => {
          this.sCauses = response.data.map(this.getDisplayTutorial);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      TutorialDataService.getCategory()
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
      };
    },

    createCategory() {
      var data = {
        Category: this.sCategory.Category,
      };

      console.log(data);
      TutorialDataService.createCategory(data)
        .then((response) => {
          console.log(response.data);
          this.submitted = true;
          this.show();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayTutorial(data) {
      return {
        sCauses: data.causes,
        id: data._id,
      };
    },

    createCauses() {
      var data = {
        causes: this.sCauses.causes,
      };

      console.log(data);
      TutorialDataService.createCauses(data)
        .then((response) => {
          console.log(response.data);
          this.submitted = true;
          this.show();
        })
        .catch((e) => {
          console.log(e);
        });
      this.show();
    },

    deleteCauses(id) {
      console.log("ID============", id);
      TutorialDataService.deleteCauses(id)
        .then(() => {
          // this.refreshList();
          this.show();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteCategory(id) {
      console.log("ID============", id);
      TutorialDataService.deleteCategory(id)
        .then(() => {
          // this.refreshList();
          this.show();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.show();
  },
};
</script>

<style></style>
