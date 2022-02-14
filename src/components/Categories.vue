<template>
  <div class="flex">
    <div>
      <div class="form-group">
        <label for="className">Категория</label>
        <input
          type="text"
          class="form-control"
          required
          v-model="sCategory.Category"
        />
      </div>
      <button @click="createCategory" class="btn btn-success">
        Создать Категорию
      </button>
      <div>
        <v-data-table
          :headers="headersCat"
          :items="sCategory"
          disable-pagination
          :hide-default-footer="true"
        >
        </v-data-table>
      </div>
    </div>
    <br />
    <div>
      <div>
        <div>
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
  </div>
</template>

<style>
.select {
  width: 100%;
}
.select-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
}
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
  max-width: 900px;
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
  background-color: rgb(105, 106, 172);
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
      sCategory: [],
      sCauses: [{ sCauses: "123" }],
      headers: [{ text: "Причина", value: "sCauses" }],
      headersCat: [{ text: "Категория", value: "sCategory" }],
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
  },
  mounted() {
    this.show();
  },
};
</script>

<style></style>
