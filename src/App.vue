<template>
  <v-app>
    <div>
      <transition name="component-fade" mode="out-in">
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
            <v-btn to="/Clubs" text> Доп. образование </v-btn>
            <!-- <v-btn to="/test" text> TEST </v-btn> -->

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

            <v-btn class="btn btn-danger" @click="del" to="/" text>
              ВЫХОД
            </v-btn>

            <div style="padding-left: 20px">
              Вход выполнен для класса: {{ selectedClass.className }}
            </div>
            <!-- <v-btn to="/tutorials" text> Tutorials </v-btn>
      <v-btn to="/add" text> Add </v-btn> -->
          </navbar>
        </div>
      </transition>
    </div>
    <v-main>
      <!-- <button @click="checked()">CHECK</button> -->
      <transition name="component-fade" mode="out-in" appear>
        <router-view @example="methodName" :selectedClass="selectedClass" />
      </transition>
      <transition name="fade">
        <div v-if="buttonShow" @click="click" class="button">
          <div class="arrow-1">
            <div></div>
          </div>
          <div style="margin: 45px -10px 0 25px">Вверх!</div>
        </div>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "app",
  data: function () {
    return {
      buttonShow: false,
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

    checkScrollPosition() {
      this.buttonShow = window.pageYOffset > 750;
    },
    click() {
      scroll({
        top: 0,
        behavior: "smooth",
      });
    },
  },
  mounted() {
    console.log(this.selectedClass.className, "this.selectedClass");
    if (this.selectedClass.className === undefined) {
      localStorage.clear();
      this.$router.push("/login");
    }

    this.checkScrollPosition();
    window.addEventListener("scroll", this.checkScrollPosition);
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
<style lang="scss">
.navbar {
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.div {
  display: flex;
  justify-content: center;
  align-items: center;
}
.component-fade-enter-active,
.component-fade-leave-active {
  //transition: opacity 0.3s ease;

  transition: all 0.2s ease-out;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform: translateY(100px);
}

.content {
  height: 1000px;
  background-color: #ffdddd;
}

.button {
  color: rgb(0, 0, 0);

  position: fixed;
  left: 20px;
  bottom: 25px;
  cursor: pointer;
  padding: 10px 30px 10px 0px;
  margin: 0 0 10px 0;
  background-color: #b4ffcd48;
  border-radius: 30px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 1000;
}

.arrow-1 {
  transform: rotate(-90deg);
  cursor: pointer;
  position: relative;

  margin: 20px 0 20px -10px;
}
.arrow-1 div {
  position: relative;
  top: 20px;
  width: 50px;
  height: 10px;
  background-color: #33b733;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);

  display: block;
}
.arrow-1 div::after {
  content: "";
  position: absolute;
  width: 40px;
  height: 10px;
  top: -11px;
  right: -8px;
  background-color: #33b733;
  transform: rotate(45deg);
}
.arrow-1 div::before {
  content: "";
  position: absolute;
  width: 40px;
  height: 10px;
  top: 11px;
  right: -8px;
  background-color: #33b733;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  transform: rotate(-45deg);
}
.button:hover {
  animation: arrow-1 1s linear infinite;
}
@keyframes arrow-1 {
  0% {
    bottom: 20px;
  }
  50% {
    bottom: 25px;
  }
  100% {
    bottom: 20px;
  }
}
</style>
