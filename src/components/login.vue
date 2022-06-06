<template>
  <div class="mainLogin">
    <h2>Вход в систему ACT</h2>
    <div style="width: 200px">
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
    <!-- <div v-if="show" class="modal-shadow" @click.self="closeModal">
    <div>
      <div class="modal-close" @click="closeModal">&#10006;</div>
      <slot name="title">
        <h3 class="modal-title">Заголовок</h3>
      </slot>
      <slot name="body">
        <div class="modal-content">Дефолтный контент модального окна</div>
      </slot>
      <slot name="footer">
        <div class="modal-footer">
          <button class="modal-footer__button" @click="closeModal">Ок</button>
        </div>
      </slot>
    </div>
  </div> -->
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
      if (
        this.selectedClassID.className != "АДМИНИСТРАТОР" &&
        this.password === "1"
      ) {
        console.log("OK");
        localStorage.setItem("user", 1);

        this.$router.push("/dashboard");
      }
      if (
        this.selectedClassID.className === "АДМИНИСТРАТОР" &&
        this.password === "01091867"
      ) {
        console.log("вход под администратором");
        localStorage.setItem("user", 2);
        this.$router.push("/dashboard");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.mainLogin {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.modal-shadow {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.39);
}

.modal {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  min-width: 420px;
  max-width: 480px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &-close {
    border-radius: 50%;
    color: #fff;
    background: #2a4cc7;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 7px;
    right: 7px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  &-title {
    color: #0971c7;
  }

  &-content {
    margin-bottom: 20px;
  }

  &-footer {
    &__button {
      background-color: #0971c7;
      color: #fff;
      border: none;
      text-align: center;
      padding: 8px;
      font-size: 17px;
      font-weight: 500;
      border-radius: 8px;
      min-width: 150px;
    }
  }
}
</style>
