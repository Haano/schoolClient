<template>
  <div class="cat-student">
    <div>
      <div>
        Класс
        <select
          class="form-select light"
          v-model="selectedClassID"
          @change="getStudents(selectedClassID)"
          id="class"
        >
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
        <div class="submit-form">
          <div class="form-group">
            <label for="className">Фамилия</label>
            <input
              type="text"
              class="form-control"
              required
              v-model="FirstName"
            />
          </div>
          <div class="form-group">
            <label for="classLider">Имя</label>
            <input
              type="text"
              class="form-control"
              required
              v-model="LastName"
            />
          </div>
          <div class="form-group">
            <label for="classLider">Отчество</label>
            <input
              type="text"
              class="form-control"
              required
              v-model="Surname"
            />
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
        <br />
        <button @click="createStudent" class="btn btn-success">
          Создать ученика
        </button>
      </div>
    </div>

    <div>
      <div class="myTable">
        <v-col>
          <v-data-table
            :headers="headers"
            :items="this.classList"
            :items-per-page="1500"
            hide-default-footer
          >
            <template v-slot:[`item.actions`]="{ item }">
              <div class="select-flex">
                <div class="select">
                  <select
                    class="form-select"
                    name="marks"
                    v-bind:title="item.Category"
                    v-bind:id="item._id"
                  >
                    <option value=""></option>
                    <option v-for="caus in sCategory" :key="caus.Category">
                      {{ caus.Category }}
                    </option>
                  </select>
                </div>

                <v-card-actions>
                  <button class="btn btn-success" @click="updateCat(item._id)">
                    Обновить
                  </button>
                </v-card-actions>
              </div>
            </template>
            <template v-slot:[`item.delete`]="{ item }">
              <div class="select-flex">
                <v-card-actions>
                  <button
                    class="btn btn-danger"
                    @click="deleteStudent(item._id)"
                  >
                    Удалить
                  </button>
                </v-card-actions>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </div>
    </div>
  </div>
</template>

<style>
.cat-student {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.class-student {
  padding: 5px 10px 10px 10px;
  text-align: center;
  width: 350px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  border-radius: 3px;
  box-shadow: 0 0 3px #4d4d4d;
  margin-top: 10px;
}
</style>
<script>
import TutorialDataService from "../services/TutorialDataService";
export default {
  props: {
    selectedClass: Object,
  },
  data() {
    return {
      headers: [
        {
          text: "Фамилия",
          value: "FirstName",
          sortable: true,
        },
        {
          text: "Имя",
          value: "LastName",
          sortable: true,
        },
        {
          text: "Категория",
          value: "Category",
          sortable: true,
        },

        { text: "Обновить категорию", value: "actions", sortable: false },
        {
          text: "Действия",
          value: "delete",
          sortable: true,
        },
      ],
      sClass: [{ className: "NO" }],
      sCategory: [{ Category: "1" }],
      classList: [{ FirstName: "TEST" }],
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
    initialization() {
      this.clearFullData();
      this.retrieveTutorials();
      this.retrieveCategory();
      if (this.selectedClassID) {
        this.classList.splice(0);
        this.getStudents(this.selectedClassID);
      } else {
        this.classList.splice(0);
      }
      console.log(this.classList);
    },
    clearFullData() {
      this.classList.splice(0);
    },

    deleteStudent(id) {
      let result = confirm("Вы действительно хотите удалить ученика " + id);
      if (result) {
        TutorialDataService.deleteStudent(id)
          .then(() => {
            this.initialization();
          })
          .catch((e) => {
            console.log(e);
          });

        this.initialization();
      }
    },

    async updateCat(ID) {
      var data = new Array();
      data[0] = document.getElementById(ID).value;

      await TutorialDataService.updateCat(ID, data)
        .then((response) => {
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
        })
        .catch((e) => {
          console.log("1111111111", e);
        });
      this.initialization();
    },

    getStudents(data) {
      TutorialDataService.findStudentByClassID(data)
        .then((response) => {
          this.classList.splice(response.data);
          var a = new Array();
          a = Object.values(response.data);
          for (var i = 0; i < a.length; i++) {
            this.$set(this.classList, i, a[i]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

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
      this.initialization();
    },

    retrieveCategory() {
      TutorialDataService.getCategory()
        .then((response) => {
          this.sCategory = response.data.map(this.getDisplayCategory);
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

      if (this.selectedClass.classID != "admin") {
        this.selectedClassID = this.selectedClass;
        document.getElementById("class").disabled = true;

        this.getStudents(this.selectedClassID);
      }
    },
    refreshList() {
      this.initialization();
    },

    getDisplayTutorial(data) {
      return {
        classID: data._id,
        className: data.className,
      };
    },

    getDisplayCategory(data) {
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
