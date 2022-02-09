<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center mr-2">Отсутствующие</div>

      <v-btn to="/Dashboard" text> ГЛАВНАЯ </v-btn>
      <v-btn to="/class" text> Классы </v-btn>
      <v-btn to="/CreateStudent" text> Ученики </v-btn>
      <v-btn to="/Categories" text> Категории </v-btn>
      <v-btn to="/Statistic" text> Статистика </v-btn>
      <!-- <v-btn to="/CreateDate" text> Даты </v-btn> -->

      <!-- <v-btn to="/tutorials" text> Tutorials </v-btn>
      <v-btn to="/add" text> Add </v-btn> -->
    </v-app-bar>

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
