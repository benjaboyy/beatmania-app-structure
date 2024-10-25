<template>
  <div v-if="open" class="backdrop" @click="hideDialog"></div>
  <transition name="modal">
    <dialog class="window" open v-if="open">
      <h3><i class="fas fa-user"></i> {{ player.name }}</h3>
      <hr>
      <h5>{{ $t("welcomeScreen.trackedGames") }}</h5>
      <div class="row">
        <table class="table mb-0 table-sm table-borderless">
          <tbody>
          <tr v-for="game in filteredTrackedGames" :key="game.index">
            <td>{{ getGameName(game.index) }}</td>
            <td class="text-end text-primary"><b>{{ game.total }}</b></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="d-grid mt-3 gap-2">
        <router-link :to="'/user/' + getPlayerKeyByName(arcadeID, player.name)" class="btn btn-primary">{{ $t("login.viewProfile") }}</router-link>
        <button class="btn btn-dark" @click="hideDialog">{{ $t("login.close") }}</button>
      </div>
    </dialog>
  </transition>
</template>

<script>
export default {
  props:
  {
    arcadeID: {
      type: String,
      required: true
    },
    open: {
      type: Boolean,
      required: true
    },
    player: {
      type: Object,
      required: true
    },
  },
  emits: ['close'],
  computed: {
    filteredTrackedGames() {
      const gamesArray = Object.entries(this.player.trackedGames)
          .map(([key, game]) => ({ index: key, ...game }))
          .filter(game => game.total > 0);
      return gamesArray;
    },
  },
  methods: {
    hideDialog() {
      this.$emit('close');
    },
    getGameName(gameID) {
      return this.$store.getters['games/getGameName'](gameID);
    },
    getPlayerKeyByName(arcadeID, playerName) {
      return this.$store.getters['arcades/getPlayerKeyByName'](arcadeID, playerName);
    },
  },
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.75);
}

dialog {
  position: fixed;
  top: 10%;
  max-height: 80%;
  max-width: 600px;
  overflow: auto;
  width: 90%;
  margin: 0 auto;
  bottom: 20vh;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 0;
  padding: 1rem;
  background-color: white;
  z-index: 100;
  border: none;
  /*animation: modal 0.5s ease-out forwards;*/
}



.table-sm td, .table-sm th {
  padding-top: 0!important;
  padding-bottom: 0!important;
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

.modal-enter-active {
  animation: modal 0.3s ease-out;
}

.modal-leave-active {
  animation: modal 0.3s ease-in reverse;
}

@keyframes modal {
  from {
    opacity: 0;
    transform: scale(0.75);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>