<template>
  <div>
    <br />
    <div class="flex-food-main">
      <div>
        <div class="flex-food">
          <div>
            Класс
            <select
              class="form-select"
              v-model="selectedClassID"
              @change="show(selectedClassID)"
            >
              <option
                v-for="user in sClass"
                :key="user.className"
                v-bind:value="user"
              >
                {{ user.className }}
              </option>
            </select>
          </div>

          <div>
            Ученик
            <select
              class="form-select"
              v-model="selectedStudentID"
              @change="show(selectedStudentID)"
            >
              <option
                v-for="user in Students"
                :key="user.FirstName"
                v-bind:value="user"
              >
                {{ user.FirstName }} {{ user.LastName }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex-food">
          <div>Время <input class="form-control" /></div>
          <div>Идентификатор <input class="form-control" /></div>
        </div>
        <div class="flex-food">
          <div>
            Сумма квитанции<br />
            (только число) <input class="form-control" />
          </div>
          <div>
            <div>
              Можно загрузить<br />
              файл квитанции
            </div>
            <input type="file" class="form-control" name="" id="" />
          </div>
        </div>
        <div class="flex-food">
          <button @click="test()" class="btn btn-success">
            Создать квитанцию
          </button>
        </div>
      </div>
      <br />
      <div>
        <br />
        <table class="table table-bordered">
          <caption>
            Сводка по питанию
          </caption>
          <thead>
            <tr>
              <th scope="col" style="width: 100px"></th>
              <th scope="col">Всего питались</th>
              <th scope="col">Стоимость</th>
              <th scope="col">Денег сдано</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>{{ selectedClassID.className }}</b>
              </td>
              <td>{{ sClass.length }}</td>
              <td>{{ selectedClassID.className }}</td>
              <td>{{ amount }}</td>
            </tr>
            <tr>
              <td>
                <b
                  >{{ selectedStudentID.FirstName }}<br />
                  {{ selectedStudentID.LastName }}</b
                >
              </td>
              <td>{{ selectedStudentID.LastName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br />
    <v-data-table
      :headers="headers"
      :items="receipts"
      disable-pagination
      :hide-default-footer="true"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <button class="btn btn-primary" @click="deleteStudent(item._id)">
          Скачать
        </button>
        <button class="btn btn-danger" @click="deleteStudent(item._id)">
          Удалить
        </button>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
export default {
  data() {
    return {
      headers: [
        { text: "Фамилия", value: "FirstName" },
        { text: "Имя", value: "lastName" },
        { text: "Дата", value: "date" },
        { text: "ID", value: "identifier" },
        { text: "Сумма", value: "amount" },
        { text: "Действия", value: "actions", sortable: false },
      ],
      receipts: [
        {
          FirstName: "123",
          lastName: "123131",
          date: "12.05.2020 15:33",
          identifier: "142124425125125RFS",
          amount: 500,
        },
        {
          FirstName: "123",
          lastName: "123131",
          date: "13.05.2020 15:33",
          identifier: "142124125125125RFS",
          amount: 600,
        },
        {
          FirstName: "123",
          lastName: "123131",
          date: "14.05.2020 15:33",
          identifier: "142124225125125RFS",
          amount: 2700,
        },
        {
          FirstName: "123",
          lastName: "123131",
          date: "15.05.2020 15:33",
          identifier: "142124325125125RFS",
          amount: 200,
        },
        {
          FirstName: "123",
          lastName: "123131",
          date: "12.05.2020 15:33",
          identifier: "142124025125125RFS",
          amount: 200,
        },
      ],
      selectedClassID: [{ lastName: "" }],
      selectedStudentID: [""],
      amount: 0,
      sClass: [],
      Students: [{ FirstName: "TEST" }],
    };
  },
  methods: {
    async show(data) {
      console.log(data);
      await this.getStudents(data);
    },

    getStudents(data) {
      TutorialDataService.findStudentByClassID(data)
        .then((response) => {
          this.Students.splice(response.data);
          var a = new Array();
          a = Object.values(response.data);
          for (var i = 0; i < a.length; i++) {
            this.$set(this.Students, i, a[i]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(this.Students);
    },

    async retrieveClass() {
      //получить список классов
      for (let i = 0; i < this.receipts.length; i++) {
        this.amount += this.receipts[i].amount;
      }
      await TutorialDataService.getAllCLass()
        .then((response) => {
          this.sClass = response.data.map(this.getDisplayClass);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getDisplayClass(data) {
      return {
        classID: data._id,
        className: data.className,
      };
    },
  },
  mounted() {
    this.retrieveClass();
  },
};
</script>

<style>
@import "../assets/style.css";
</style>
