<template>
  <v-app>
    <navbar
      class="navbar navbar-expand-lg navbar-light"
      style="background-color: #e3f2fd border: 1px solid grey;"
    >
      <div class="d-flex align-center mr-2">Отсутствующие</div>
      <v-btn to="/" text> ГЛАВНАЯ </v-btn>
      <!-- <v-btn to="/class" text> Классы </v-btn> -->
      <!-- <v-btn to="/CreateStudent" text> Ученики </v-btn> -->
      <!-- <v-btn to="/Categories" text> Категории </v-btn> -->
      <v-btn to="/Statistic" text> Статистика </v-btn>

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
          <li><v-btn to="/Categories" text> Категории и причины </v-btn></li>
        </ul>
      </div>
      <!-- <v-btn to="/tutorials" text> Tutorials </v-btn>
      <v-btn to="/add" text> Add </v-btn> -->
    </navbar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "app",
};
</script>
