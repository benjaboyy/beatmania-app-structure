<template>
  <div class="stats-screen px-2 px-md-5 pt-4 m-auto">
    <div class="banner--highscore d-flex bg-primary" v-if="!isAuthenticated">
      <img src="../../assets/img/banner-highscore.png" class="d-inline-block align-middle mx-auto logo--size" alt="">
    </div>
    <h1 v-if="!arcadeID && isAuthenticated" class="text-center my-0">{{ $t('arcade.arcadeRankings') }}</h1>
    <h1 v-if="selectedGame" class="text-center my-0">{{ nameOfSelectedGame }} {{ $t('arcade.selectGame') }}</h1>
    <div v-if="arcadeID" :class="{'h1': !selectedGame, 'h5': selectedGame}" class="text-center text-white my-0">{{ $t('arcade.location') }} {{ getArcadeName }}</div>
    <div class="mt-4">
      <div v-if="!arcadeID" class="card">
        <div class="card-body">
          <h3>{{ $t('arcade.selectArcade') }}</h3>
          <button v-for="arcade in getArcades" :key="arcade.id" class="btn btn-light w-100 text-start mt-2" @click="selectedArcade(arcade.id)">
            <span class="d-flex">
              <img class="my-auto me-2" :src="'https://flagsapi.com/' + arcade.countryCode + '/flat/64.png'" :alt="arcade.name">
              <span class="me-auto my-auto">{{ arcade.name }} <br>
                <small class="text-muted"  v-if="arcade.players">
                  {{ arcade.games.length }} Games / {{ Object.keys(arcade.players).length }} Players
                </small>
              </span>
               <i class="fa fa-arrow-right ms-2 my-auto float-end"></i>
            </span>
          </button>
          <hr>
          <router-link to="/about" class="btn btn-primary" href="#" type="button" role="button" exact><i class="fa fa-info me-1"></i> {{ $t("menu.aboutAndInfo") }}</router-link>
          <router-link to="/" class="btn btn-secondary ms-2" type="button" role="button" exact><i class="fa fa-lock me-1"></i> {{ $t("menu.login") }}</router-link>
        </div>
      </div>
      <div v-else>
        <div v-if="selectedGame">
          <table class="table table-striped table-hover table-ranking">
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
            <tr v-for="(player, key) in playersSortedOnStats" :key="player.rank" @click="showProfile(player)" class="bg-light">
              <th v-if="key === 0" scope="row"><i class="fas fa-trophy"></i></th>
              <th v-else>{{ key+1 }}</th>
              <td>{{ player.name }}</td>
              <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame]?.singles }}</td>
              <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame]?.doubles }}</td>
              <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame]?.courses }}</td>
              <td>{{ player.trackedGames[selectedGame]?.total }}</td>
            </tr>
            </tbody>
          </table>
          <small class="text-white">Clear = 1 point / Course = 5 points</small>
          <div class="card-footer d-flex mt-2 text-muted">
            <div class="select-lang" @click="showDialog"><i class="fas fa-globe"></i> {{ $t("login.selectLanguage") }}</div>
            <button class="btn btn-link ms-3 text-white btn-sm" @click="copyURL('https://bmgress.app/arcade/' + arcadeID + '/' + selectedGame)"><i class="fa fa-link"></i> {{ $t("login.rankingUrl") }}</button>
            <div class="ms-auto">© <a class="text-white" href="https://bmgress.app">BMGress</a> - {{ new Date().getFullYear() }}</div>
          </div>
        </div>
        <div class="card p-3" v-else>
          <h3>{{ $t('arcade.selectGame') }}</h3>
          <button v-for="game in getArcadeGames" :key="game" class="btn btn-primary mt-2 text-start" @click="selectedGame = game">{{ getGameName(game) }}
            <i class="fa fa-arrow-right ms-2 mt-1 float-end"></i>
          </button>
          <div>
            <hr>
            <button @click="removeArcadeID" class="btn btn-primary " type="button" role="button" ><i class="fa fa-home me-2"></i> {{ $t("menu.arcadesSelect") }}</button>
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
  <ProfileModal
      @close="hideProfile"
      :open="profileVisible"
      :player="loadedPlayer"
      :arcadeID="arcadeID"
  />
</template>

<script>
import LanguageModal from "@/components/UI/LanguageModal";
import ProfileModal from "@/components/UI/ProfileModal";
export default {
  name: 'ArcadeRankings',
  components: {
    LanguageModal, ProfileModal
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
      profileVisible: false,
      loadedPlayer: null,
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
      if (!this.selectedGame || this.players.length === 0) {
        return [];
      }

      const validPlayers = this.players.filter(player => {
        const trackedGames = player.trackedGames && player.trackedGames[this.selectedGame];
        return trackedGames && trackedGames.total > 0;
      });

      return validPlayers.sort((a, b) => {
        const totalA = (a.trackedGames && a.trackedGames[this.selectedGame]) ? a.trackedGames[this.selectedGame].total : 0;
        const totalB = (b.trackedGames && b.trackedGames[this.selectedGame]) ? b.trackedGames[this.selectedGame].total : 0;
        return totalB - totalA;
      });
    },

  },
  methods: {
    showDialog() {
      this.dialogIsVisible = true;
    },
    hideDialog() {
      this.dialogIsVisible = false;
    },
    showProfile(player) {
      console.log(player);
      this.loadedPlayer = player;
      this.profileVisible = true;
    },
    removeArcadeID() {
      this.arcadeID = '';
    },
    hideProfile() {
      this.profileVisible = false;
    },
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'ja' : 'en';
    },
    getGameName(gameID) {
      return this.$store.getters['games/getGameName'](gameID);
    },
    selectedArcade(arcadeID) {
      this.arcadeID = arcadeID;
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
.table-ranking {
  max-width: 500px;
  margin: 0 auto;
  thead {
    color: white;
  }
  tbody {
    tr {
      margin-bottom: 10px;

    }
  }
}
</style>
