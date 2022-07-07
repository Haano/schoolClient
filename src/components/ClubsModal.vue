<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header class="modal-header" id="modalTitle">
          <slot name="header">
            Список кружков
            <button
              type="button"
              class="btn-close"
              @click="close"
              aria-label="Close modal"
            >
              x
            </button>
          </slot>
        </header>
        <section class="modal-body" id="modalDescription">
          <div>
            <button
              type="button"
              class="btn-green"
              @click="getClubs"
              aria-label="Close modal"
            >
              Обновить
            </button>

            <div>Всего кружков: {{ clubsList.length }}</div>
          </div>
          <v-data-table
            v-model="selectedClub"
            :headers="headers"
            :items="this.clubsList"
            group-by="location"
            :items-per-page="1500"
            hide-default-footer
            :single-select="false"
            item-key="name"
            show-select
          ></v-data-table>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button
              type="button"
              class="btn-green"
              @click="close"
              aria-label="Close modal"
            >
              Закрыть
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";

export default {
  name: "modal",
  data() {
    return {
      selectedClub: [],
      clubsList: [{ name: "123", location: "Школа" }],
      headers: [
        {
          text: "Название",
          value: "name",
          sortable: true,
        },
        {
          text: "Нахождение",
          value: "location",
          sortable: true,
        },
        {
          text: "Уровень",
          value: "level",
          sortable: true,
        },
        {
          text: "Профиль",
          value: "profile",
          sortable: true,
        },
      ],
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },

    async getClubs() {
      await TutorialDataService.getClubs()
        .then((response) => {
          var a = new Array();
          a = Object.values(response.data);

          console.log(a);
          this.clubsList = a;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.getClubs();
    console.log("Clubs GET");
  },
};
</script>
<style>
.v-row-group__header td {
  background-color: #9370db;
  color: white;
}
.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  max-height: 350px;

  vertical-align: middle;
  position: relative;
  text-align: left;
  background: #fff;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #4aae9b;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
  padding: 2px;
}
</style>
