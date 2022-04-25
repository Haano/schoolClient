<template>
  <v-app>
    <div>
      <div v-if="check">
        <navbar
          class="navbar navbar-expand-lg navbar-light"
          style="background-color: #e3f2fd border: 1px solid grey;padding: -10px -20px 0px 0px;"
        >
          <div style="text-align: center; font-weight: bold; font-size: 16px">
            ACT
            <div style="font-size: 12px">assistant class teacher</div>
          </div>
          <v-btn to="/dashboard" text> ГЛАВНАЯ </v-btn>
          <!-- <v-btn to="/class" text> Классы </v-btn> -->
          <!-- <v-btn to="/CreateStudent" text> Ученики </v-btn> -->
          <!-- <v-btn to="/Categories" text> Категории </v-btn> -->
          <v-btn to="/Statistic" text> Статистика </v-btn>
          <v-btn to="/Receipt" text> Квитанции </v-btn>

          <!-- <v-btn to="/CreateDate" text> Даты </v-btn> -->
          <!-- v-if="selectedClass.classID === 'admin'" -->
          <div class="dropdown">
            <button
              class="btn btn-info dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              НАСТРОЙКА
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li v-if="selectedClass.classID === 'admin'">
                <v-btn to="/class" text> Классы </v-btn>
              </li>
              <!-- <li><a class="dropdown-item" href="/">Другое действие</a></li> -->
              <li><v-btn to="/CreateStudent" text> Ученики </v-btn></li>
              <li v-if="selectedClass.classID === 'admin'">
                <v-btn to="/Categories" text> Категории и причины </v-btn>
              </li>
            </ul>
          </div>

          <v-btn class="btn btn-danger" @click="del" to="/" text> ВЫХОД </v-btn>

          <div style="padding-left: 20px">
            Вход выполнен для класса: {{ selectedClass.className }}
          </div>
          <!-- <v-btn to="/tutorials" text> Tutorials </v-btn>
      <v-btn to="/add" text> Add </v-btn> -->
        </navbar>
      </div>
    </div>
    <v-main>
      <button @click="checked()">CHECK</button>
      <router-view @example="methodName" :selectedClass="selectedClass" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "app",
  data: function () {
    return {
      router: this.$router.currentRoute.name,
      localStorage: localStorage,
      check: false,
      selectedClass: {},
    };
  },
  methods: {
    checked() {
      console.log(localStorage.user);
      //this.check = !this.check;

      // this.$emit("selectedClassID", this.selectedClass);
      console.log(this.selectedClass);
    },

    methodName(variable) {
      console.log(variable, 4142141242);
      this.selectedClass = variable;
    },
    del() {
      localStorage.clear();
    },
  },
  mounted() {
    console.log(this.selectedClass.className, "this.selectedClass");
    if (this.selectedClass.className === undefined) {
      localStorage.clear();
      this.$router.push("/login");
    }
  },
  watch: {
    "$route.query": {
      handler: function () {
        if (this.$router.currentRoute.name !== "login") {
          this.check = true;
        } else {
          this.check = false;
        }
      },
    },
  },
};
</script>
<style lang="scss"></style>
