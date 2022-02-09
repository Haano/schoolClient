<template>
  <div>
    <div class="submit-form">
      <div class="form-group">
        <label for="className">Создать день</label>
        <input
          type="date"
          class="form-control"
          required
          v-model="sDates.date"
        />
      </div>
      <button @click="createDate" class="btn btn-success">Создать День</button>
    </div>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  data() {
    return {
      sDates: [],
    };
  },
  methods: {
    createDate() {
      var data = {
        date: this.sDates.date,
      };
      console.log(data);
      TutorialDataService.createDate(data)
        .then((response) => {
          console.log("УСПЕШНО ОТПРАВЛЕНО", response);
        })
        .catch((e) => {
          console.log("1111111111", e);
        });
    },
  },
};
</script>

<style></style>
