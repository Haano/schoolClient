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
              <li><v-btn to="/class" text> Классы </v-btn></li>
              <!-- <li><a class="dropdown-item" href="/">Другое действие</a></li> -->
              <li><v-btn to="/CreateStudent" text> Ученики </v-btn></li>
              <li>
                <v-btn to="/Categories" text> Категории и причины </v-btn>
              </li>
            </ul>
          </div>

          <v-btn class="btn btn-danger" @click="del" to="/" text> ВЫХОД </v-btn>
          <!-- <v-btn to="/tutorials" text> Tutorials </v-btn>
      <v-btn to="/add" text> Add </v-btn> -->
        </navbar>
      </div>
    </div>
    <v-main>
      <button @click="checked()">CHECK</button>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "app",
  data: function () {
    return {
      router: this.$router.currentRoute.name,
      check: false,
    };
  },
  methods: {
    checked() {
      console.log(localStorage);
      //this.check = !this.check;
    },

    del() {
      localStorage.clear();
    },
  },
  watch: {
    "$route.query": {
      handler: function () {
        // здесь код
        console.log("123123");
        if (this.$router.currentRoute.name !== "login") {
          this.check = true;
          console.log("123123OKKK");
        } else {
          this.check = false;
        }
      },
    },
  },
};
</script>
<style lang="scss"></style>
