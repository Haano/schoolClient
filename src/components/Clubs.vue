<template>
  <div class="cat">
    
    <div class="cat">
      <div class="cat-item">
        <label for="className">Название</label>
        <input type="text" class="form-control" required v-model="nameClub" />
        <label for="className">Где находится?</label>
        <select
          @change="changeLocation"
          class="form-select"
          id=""
          v-model="locationClub"
        >
          <option></option>
          <option>Школа</option>
          <option>Станица</option>
          <option>Город</option>
        </select>
        <label for="className">Уровень</label>

        <select
          v-if="locationClub === 'Школа'"
          class="form-select"
          id=""
          v-model="levelClub"
        >
          <option></option>
          <option>Кружок</option>
          <option>Спортивная секция</option>
          <option>Точка роста (Школа)</option>
        </select>
        <select
          v-if="locationClub === 'Станица'"
          class="form-select"
          id=""
          v-model="levelClub"
        >
          <option></option>
          <option>Спортивный комплекс</option>
          <option>Пегас</option>
        </select>
        <select
          v-if="locationClub === 'Город'"
          class="form-select"
          id=""
          v-model="levelClub"
        >
          <option></option>
          <option>Дворец творчества</option>
        </select>
        <label for="className">Профиль</label>
        <select class="form-select" v-model="profileClub" id="profileSelect">
          <option>художественный</option>
          <option>технический</option>
          <option>естественнонаучный</option>
          <option>туристско-краеведческий</option>
          <option>социально-педагогический</option>
          <option>физкультурно-спортивный</option>
        </select>
        <button @click="createClub()" class="btn btn-success" id="test">
          Создать направление дополнительного <br />образования (кружок)
        </button>
        <div>
          Название:{{ nameClub }} <br />
          Место:{{ locationClub }} <br />{{ levelClub }} <br />{{ profileClub }}
        </div>
      </div>
    </div>
    <div>
      <button class="btn btn-danger" @click="showModal">
        Показать список кружков
      </button>
    </div>

    <modal v-show="showModalCheck" @close="showModal()" />
  </div>
</template>
<style scoped>
@import "../assets/style.css";
select {
  max-width: 250px;
}
#test {
  display: block;
  width: 200px;
  height: 80px;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-all;
  text-overflow: "_";
  hyphens: auto;
}
</style>
<script>
import TutorialDataService from "../services/TutorialDataService";
import modal from "./ClubsModal.vue";
export default {
  components: {
    modal,
  },

  data() {
    return {
      nameClub: "",
      locationClub: "",
      levelClub: "",
      profileClub: "",
      showModalCheck: false,
    };
  },
  methods: {
    showModal() {
      this.showModalCheck = !this.showModalCheck;
    },
    changeLocation() {
      this.levelClub = null;
    },
    createClub() {
      let data = {
        name: this.nameClub,
        location: this.locationClub,
        level: this.levelClub,
        profile: this.profileClub,
      };
      TutorialDataService.crateClub(data)
        .then((response) => {
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
          this.nameClub = null;
          this.levelClub = null;
        })
        .catch((e) => {
          console.log("1111111111", e);
        });
    },
  },
};
</script>

<style></style>
