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
        <div class="form-group">
          <label for="classLider">Пароль</label>
          <input
            type="text"
            class="form-control"
            id="classLider"
            required
            v-model="sclass.password"
            name="classLider"
          />
        </div>
        <br />
      </div>
      <div>
        Смена
        <select class="form-select" v-model="sclass.shiftSchool">
          <option
            v-for="cat in sShift"
            :key="cat.shiftSchool"
            v-bind:value="cat.shiftSchool"
          >
            {{ cat.shiftSchool }}
          </option>
        </select>
      </div>
      <br />
      <div style="display: flex; justify-content: center; padding: 0 0 10px 0">
        <button
          @click="create"
          class="btn btn-success"
          style="width: 500px; padding: 20px"
        >
          Создать класс
        </button>
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          padding: 0 0 10px 0;
        "
      >
        <button
          @click="importStudents()"
          class="btn btn-dark"
          style="width: 500px"
        >
          Импорт учеников
        </button>
      </div>
    </div>
    <br />
    <div>
      <v-col>
        <v-card>
          <v-card-title>Список классов</v-card-title>

          <v-data-table
            :headers="headers"
            :items="sclass"
            :items-per-page="100"
            hide-default-footer
          >
            <template v-slot:[`item.actions`]="{ item }">
              <div class="select-flex">
                <div class="select" style="padding-right: 20px">
                  <input
                    type="text"
                    class="form-control"
                    required
                    v-model="item.passwordChange"
                    name="classLider"
                    v-bind:id="item.id"
                  />
                </div>
                <div class="select">
                  <button class="btn btn-success" @click="updatePassword(item)">
                    Обновить пароль
                  </button>
                </div>

                <v-card-actions>
                  <button class="btn btn-danger" @click="deleteClass(item.id)">
                    Удалить
                  </button>
                </v-card-actions>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </div>

    <modal v-show="showModalCheck" @close="importStudents()" />
  </v-row>
</template>
<style>
@import "../assets/style.css";
</style>
<script>
import modal from "./importStudents.vue";
import TutorialDataService from "../services/TutorialDataService";
import ServerCommandLogin from "../services/ServerCommandLogin";
//import { default as AddClass } from "./AddClass.vue";

export default {
  components: { modal },

  name: "tutorials-list",
  data() {
    return {
      sShift: [{ shiftSchool: "1 смена" }, { shiftSchool: "2 смена" }],
      sclass: [],
      title: "",
      headers: [
        { text: "Класс", align: "start", sortable: true, value: "className" },
        { text: "Классный руководитель", value: "classLider", sortable: false },
        { text: "Смена", value: "shiftSchool", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      showModalCheck: false,
    };
  },
  methods: {
    importStudents() {
      this.showModalCheck = !this.showModalCheck;
    },
    updatePassword(data) {
      console.log(data);
      let sendData = {
        id: data.id,
        passwordChange: data.passwordChange,
        className: data.className,
      };
      console.log(sendData);

      ServerCommandLogin.updatePassword(data.id, sendData)
        .then((response) => {
          console.log(response.data);
          alert("Пароль успешно изменен");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    create() {
      console.log("this.Sclass.className", this.sclass.className);
      console.log("this.Sclass.classLider", this.sclass.classLider);

      var data = {
        className: this.sclass.className,
        classLider: this.sclass.classLider,
        shiftSchool: this.sclass.shiftSchool,
        password: this.sclass.password,
      };

      console.log("dATAAAA", this.sclass);
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
        shiftSchool: data.shift,
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
