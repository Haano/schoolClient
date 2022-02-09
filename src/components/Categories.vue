<template>
  <v-row align="center" class="list px-3 mx-auto">
    <div class="submit-form mt-3 mx-auto">
      <div class="submit-form">
        <div class="form-group">
          <label for="className">Категория</label>
          <input
            type="text"
            class="form-control"
            required
            v-model="scategory.Category"
          />
        </div>
        <button @click="createCategory" class="btn btn-success">
          Создать Категорию
        </button>
      </div>
    </div>
    <br />
    <div class="submit-form mt-3 mx-auto">
      <div class="submit-form">
        <div class="form-group">
          <label for="className">Причины</label>
          <input
            type="text"
            class="form-control"
            required
            v-model="sCauses.causes"
          />
        </div>
        <button @click="createCauses" class="btn btn-success">
          Создать Причину
        </button>
      </div>
      <div>
        <v-data-table
          :headers="headers"
          :items="sCauses"
          disable-pagination
          :hide-default-footer="true"
        >
        </v-data-table>
      </div>
    </div>
  </v-row>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  data() {
    return {
      scategory: [],
      sCauses: [{ sCauses: "123" }],
      headers: [{ text: "Причина", value: "sCauses" }],
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
    },

    createCategory() {
      var data = {
        Category: this.scategory.Category,
      };

      console.log(data);
      TutorialDataService.createCategory(data)
        .then((response) => {
          console.log(response.data);
          this.submitted = true;
        })
        .catch((e) => {
          console.log(e);
        });
      this.show();
    },

    getDisplayTutorial(data) {
      return {
        sCauses: data.causes,
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
        })
        .catch((e) => {
          console.log(e);
        });
      this.show();
    },
  },
  mounted() {
    this.show();
  },
};
</script>

<style></style>
