<template>
  <div class="mainLogin">
    <div style="width: 200px; display: inline-block">
      <h2>Вход в систему ACT</h2>
      Класс
      <select
        class="form-select"
        v-model="selectedClassID"
        @change="changeClass(selectedClassID)"
      >
        <option
          v-for="user in classList"
          :key="user.className"
          v-bind:value="user"
        >
          {{ user.className }}
        </option>
      </select>

      Пароль
      <input type="password" class="form-control" v-model="password" />

      <!-- <button @click="del">DELETE</button> -->
    </div>
  </div>
</template>

<script>
import ServerCommandLogin from "../services/ServerCommandLogin";

export default {
  data: function () {
    return {
      classList: [],
      selectedClassID: "",
      password: "",
      selectedClass: {},
    };
  },
  methods: {
    del() {
      localStorage.clear();
    },

    async getClassList() {
      await ServerCommandLogin.getAllCLass().then((res) => {
        let admin = {
          className: "АДМИНИСТРАТОР",
          classID: "admin",
        };
        this.classList = res.data.map(this.getDisplayClass);
        this.classList.push(admin);
        console.log(res, this.classList);
      });
    },
    changeClass(data) {
      console.log(data);
      this.$emit("example", this.selectedClassID);
    },

    getDisplayClass(data) {
      return {
        classID: data._id,
        className: data.className,
      };
    },
  },
  mounted() {
    this.del();
    this.getClassList();
  },
  watch: {
    password: function () {
      let data = {
        _id: this.selectedClassID.classID,
        className: this.selectedClassID.className,
        password: this.password,
      };

      ServerCommandLogin.userLogin(data).then((res) => {
        console.log(res, "ОТДАЧА ОТ СЕРВЕРА");
        if (res.data.auth) {
          localStorage.setItem("user", res.data.accessRights);
          this.$router.push("/dashboard");
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
div {
  background-color: rgb(172, 172, 172);
}
.mainLogin {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // align-content: center;
  // flex-wrap: wrap;
  // flex-direction: column;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto;
}
.mainLogin div {
  width: 250px;
  height: 250px;
  position: absolute;
  top: 80px;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  h2 {
    display: flex;
    width: 300px;
    height: auto;
    align-content: center;
    margin-left: -35px;
  }
}
</style>
