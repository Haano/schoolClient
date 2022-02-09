<template>
  <v-row align="center" class="list px-3 mx-auto">
    <div class="submit-form mt-3 mx-auto">
      <div class="submit-form">
        <div class="form-group">
          <label for="className">Название класса</label>
          <input
            type="text"
            class="form-control"
            id="className"
            required
            v-model="sclass.className"
            name="className"
          />
        </div>
        <div class="form-group">
          <label for="classLider">Классный руководитель</label>
          <input
            type="text"
            class="form-control"
            id="classLider"
            required
            v-model="sclass.classLider"
            name="classLider"
          />
        </div>
      </div>
      <br />
      <button @click="create" class="btn btn-success">Создать класс</button>
    </div>
    <br />
    <div>
      <v-col>
        <v-card>
          <v-card-title>Список классов</v-card-title>

          <v-data-table :headers="headers" :items="sclass" :items-per-page="5">
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="deleteClass(item.id)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </div>
  </v-row>
</template>
<script>
import TutorialDataService from "../services/TutorialDataService";
//import { default as AddClass } from "./AddClass.vue";

export default {
  // components: { AddClass },
  name: "tutorials-list",
  data() {
    return {
      sclass: [],
      title: "",
      headers: [
        { text: "Класс", align: "start", sortable: true, value: "className" },
        { text: "Классный руководитель", value: "classLider", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    create() {
      console.log("this.Sclass.className", this.sclass.className);
      console.log("this.Sclass.classLider", this.sclass.classLider);

      var data = {
        className: this.sclass.className,
        classLider: this.sclass.classLider,
      };
      // TutorialDataService.test(data);
      TutorialDataService.createClass(data)
        .then((response) => {
          this.sclass.id = response.data.id;

          console.log("УСПЕШНО ОТПРАВЛЕНО", response.data.id);
          this.refreshList();
        })
        .catch((e) => {
          console.log("1111111111", e);
        });
    },

    deleteClass(id) {
      console.log("ID============", id);
      TutorialDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    },

    retrieveTutorials() {
      TutorialDataService.getAllCLass()
        .then((response) => {
          this.sclass = response.data.map(this.getDisplayTutorial);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveTutorials();
    },

    getDisplayTutorial(data) {
      return {
        id: data._id,
        className: data.className,
        classLider: data.classLider,
      };
    },
  },
  mounted() {
    this.retrieveTutorials();
  },
};
</script>

<style>
.submit-form {
  max-width: 300px;
}
</style>
