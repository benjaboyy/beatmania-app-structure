<template>
  <div class="stats-screen px-2 px-md-5 pt-4 m-auto">
    <div class="banner--highscore d-flex bg-primary" v-if="!isAuthenticated">
      <img src="../../assets/img/banner-highscore.png" class="d-inline-block align-middle mx-auto logo--size" alt="">
    </div>
    <h1 v-if="!arcadeID && isAuthenticated" class="text-center my-0">Arcade Rankings</h1>
    <h1 v-if="selectedGame" class="text-center my-0">{{ nameOfSelectedGame }} Ranking</h1>
    <div v-if="arcadeID" :class="{'h1': !selectedGame, 'h5': selectedGame}" class="text-center text-white my-0">Location: {{ getArcadeName }}</div>
    <div class="mt-4">
      <div v-if="!arcadeID" class="card">
        <div class="card-body">
          <h3>Select Arcade</h3>
          <div class="input-group mb-0">
            <select class="form-select" v-model="arcadeID">
              <option class="dropdown-item text-theme-1" v-for="arcade in getArcades" :key="arcade.id" :value="arcade.id">
                {{ arcade.name }}
              </option>
            </select>
          </div>
          <hr>
          <router-link to="/" class="btn btn-primary " href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> {{ $t("menu.back") }}</router-link>
          <router-link to="/about" class="btn btn-link" href="#" type="button" role="button" exact>{{ $t("menu.aboutAndInfo") }}</router-link>
        </div>
      </div>
      <div v-else>
        <div v-if="selectedGame">
          <table class="table table-dark table-striped table-hover">
            <thead>
            <tr>
              <th style="width: 1px" scope="col">Rank</th>
              <th scope="col">Player</th>
              <th class="d-none d-md-table-cell" scope="col">Singles</th>
              <th class="d-none d-md-table-cell" scope="col">Doubles</th>
              <th class="d-none d-md-table-cell" scope="col">Courses</th>
              <th scope="col">Points</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="player, key in playersSortedOnStats" :key="player.rank" class="bg-light">
              <th v-if="key === 0" scope="row"><i class="fas fa-trophy"></i></th>
              <th v-else>{{ key+1 }}</th>
              <td>{{ player.name }}</td>
              <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame].singles }}</td>
              <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame].doubles }}</td>
              <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame].courses }}</td>
              <td>{{ player.trackedGames[selectedGame].total }}</td>
            </tr>
            </tbody>
          </table>
          <small class="text-white">Clear = 1 point / Course = 5 points</small>
          <div class="card-footer d-flex mt-2 text-muted">
            <div class="select-lang" @click="showDialog"><i class="fas fa-globe"></i> {{ $t("login.selectLanguage") }}</div>
            <button class="btn btn-link ms-3 text-white btn-sm" @click="copyURL('https://beatmania-pro.web.app/arcade/' + arcadeID + '/' + selectedGame)"><i class="fa fa-link"></i> {{ $t("login.rankingUrl") }}</button>
            <div class="ms-auto">© <a class="text-white" href="https://beatmania-pro.web.app">BMGress</a> - {{ new Date().getFullYear() }}</div>
          </div>
        </div>
        <div class="card p-3" v-else>
          <h3>Select Game</h3>
          <button v-for="game in getArcadeGames" :key="game" class="btn btn-primary mt-2" @click="selectedGame = game">{{ getGameName(game) }}</button>
          <div>
            <hr>
            <router-link to="/" class="btn btn-primary " href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> {{ $t("menu.back") }}</router-link>
            <router-link to="/about" class="btn btn-link" href="#" type="button" role="button" exact>{{ $t("menu.aboutAndInfo") }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LanguageModal
      @close="hideDialog"
      :open="dialogIsVisible"
  />
</template>

<script>
import LanguageModal from "@/components/UI/LanguageModal";
export default {
  name: 'AdminUs',
  components: {
    LanguageModal,
  },
  data() {
    return {
      arcadeID: '',
      selectedGame: '',
      nameSelectedArcade: '',
      nameSelectedGame: '',
      players: [],
      arcadeList: [],
      dialogIsVisible: false,
    };
  },
  props: {
    msg: String,
  },
  async created() {
    await this.$store.dispatch('arcades/loadArcades');
    await this.$store.dispatch('games/fetchGameSongs');
    const arcadeID = this.$route.params.arcadeID;
    if (arcadeID) {
      this.arcadeID = arcadeID;
      this.nameSelectedArcade = this.getArcadeName;
    }
    const gameID = this.$route.params.gameID;
    if (gameID) {
      this.selectedGame = gameID;
      this.nameSelectedGame = this.nameOfSelectedGame;
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['isAuthenticated'];
    },
    getArcades() {
      return this.$store.getters['arcades/getArcades'];
    },
    nameOfSelectedGame() {
      return this.$store.getters['games/getGameName'](this.selectedGame);
    },
    getArcadeName() {
      return this.$store.getters['arcades/getArcadeName'](this.arcadeID);
    },
    getArcadeGames() {
      return this.$store.getters['arcades/getArcadeGames'](this.arcadeID);
    },
    getPlayers() {
      return this.$store.getters['arcades/getPlayers'](this.arcadeID);
    },
    playersSortedOnStats() {
      let players = [];
      if (!this.selectedGame) {
        return [];
      }
      if (this.players.length > 0) {
        players = this.players;
      }
      // filter all players with no total
      players = players.filter((player) => {
        const trackedGames = player.trackedGames[this.selectedGame];
        return trackedGames && trackedGames.total > 0;
      });

      // sort the players on total
      const sort = players.sort((a, b) => {
        return b.trackedGames[this.selectedGame].total - a.trackedGames[this.selectedGame].total;
      });
      return sort;
    },
  },
  methods: {
    showDialog() {
      this.dialogIsVisible = true;
    },
    hideDialog() {
      this.dialogIsVisible = false;
    },
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'ja' : 'en';
    },
    getGameName(gameID) {
      return this.$store.getters['games/getGameName'](gameID);
    },
    async copyURL(url) {
      try {
        await navigator.clipboard.writeText(url);
        alert('Copied');
      } catch ($e) {
        alert('Cannot copy');
      }
    }
  },
  watch: {
    async arcadeID() {
      for (let player in this.getPlayers) {
        this.players.push(await this.$store.dispatch('loadUserStats', player));
      }
    },
  },
};
</script>

<style scoped>
.banner--highscore {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.logo--size {
  width: 100%;
  max-width: 350px;
}
.stats-screen {
  margin-top: 75px!important;
}
.card {
  max-width: 500px;
  margin: 0 auto;
}
.select-lang {
  cursor: pointer;
}
</style>
