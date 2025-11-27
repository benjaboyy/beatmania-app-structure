<template>
  <div class="stats-screen px-2 px-md-5 pt-4 m-auto">
    <transition name="fade">
      <div class="banner--highscore d-flex bg-primary" v-if="!isAuthenticated">
        <img src="../../assets/img/banner-highscore.png" class="d-inline-block align-middle mx-auto logo--size animate-banner" alt="Highscore Banner">
      </div>
    </transition>
    <h1 v-if="!arcadeID && isAuthenticated" class="text-center my-0 text-glow">{{ $t('arcade.arcadeRankings') }}</h1>
    <h1 v-if="selectedGame" class="text-center my-0 text-glow">{{ nameOfSelectedGame }} {{ $t('arcade.selectGame') }}</h1>
    <div v-if="arcadeID" :class="{'h1': !selectedGame, 'h5': selectedGame}" class="text-center text-white my-0 text-glow">{{ $t('arcade.location') }} {{ getArcadeName }}</div>
    <div class="mt-4">
      <div v-if="!arcadeID" class="card card-arcade shadow-lg">
        <div class="card-body">
          <h3 class="text-gradient">{{ $t('arcade.selectArcade') }}</h3>
          <button v-for="arcade in getArcades" :key="arcade.id" class="btn btn-light w-100 text-start mt-2 arcade-btn" @click="selectedArcade(arcade.id)">
            <span class="d-flex">
              <img class="my-auto me-2 flag-img" :src="'https://flagsapi.com/' + arcade.countryCode + '/flat/64.png'" :alt="arcade.name">
              <span class="me-auto my-auto">
                {{ arcade.name }} <br>
                <small class="text-muted" v-if="arcade.players">
                  {{ arcade.games.length }} Games / {{ Object.keys(arcade.players).length }} Players
                </small>
              </span>
              <i class="fa fa-arrow-right ms-2 my-auto float-end"></i>
            </span>
          </button>
          <hr>
          <router-link to="/about" class="btn btn-primary gradient-btn" type="button" role="button" exact><i class="fa fa-info me-1"></i> {{ $t("menu.aboutAndInfo") }}</router-link>
          <router-link to="/" class="btn btn-secondary ms-2 gradient-btn" type="button" role="button" exact><i class="fa fa-lock me-1"></i> {{ $t("menu.login") }}</router-link>
        </div>
      </div>
      <div v-else>
        <div v-if="selectedGame">
          <div v-if="loading" class="d-flex justify-content-center align-items-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <table v-else class="table table-striped table-hover table-ranking shadow-lg">
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
            <tr v-for="(player, key) in playersSortedOnStats" :key="player.rank" @click="showProfile(player)" class="bg-light ranking-row" :class="{'top-rank': key < 3}" title="Click to view profile">
              <th v-if="key === 0" scope="row"><i class="fas fa-trophy trophy-animate" aria-label="Top Rank"></i></th>
              <th v-else>{{ key+1 }}</th>
              <td>{{ player.name }}</td>
              <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame]?.singles }}</td>
              <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame]?.doubles }}</td>
              <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame]?.courses }}</td>
              <td>{{ player.trackedGames[selectedGame]?.total }}</td>
            </tr>
            <tr v-if="playersSortedOnStats.length === 0">
              <td colspan="6" class="text-center text-muted py-4">
                <i class="fas fa-user-slash fa-2x"></i><br>
                No players found for this game.
              </td>
            </tr>
            </tbody>
          </table>
          <small class="text-white">Clear = 1 point / Course = 5 points</small>
          <div class="card-footer d-flex mt-2 text-muted">
            <div class="select-lang" @click="showDialog" title="Change Language"><i class="fas fa-globe"></i> {{ $t("login.selectLanguage") }}</div>
            <button class="btn btn-link ms-3 text-white btn-sm" @click="copyURL('https://bmgress.app/arcade/' + arcadeID + '/' + selectedGame)" title="Copy ranking URL"><i class="fa fa-link"></i> {{ $t("login.rankingUrl") }}</button>
            <div class="ms-auto">© <a class="text-white" href="https://bmgress.app">BMGress</a> - {{ new Date().getFullYear() }}</div>
          </div>
          <button class="btn btn-floating gradient-btn" @click="removeArcadeID" aria-label="Back to Arcades"><i class="fa fa-arrow-left"></i></button>
        </div>
        <div class="card p-3 card-game shadow-lg" v-else>
          <h3 class="text-gradient">{{ $t('arcade.selectGame') }}</h3>
          <button v-for="game in getArcadeGames" :key="game" class="btn btn-primary mt-2 text-start game-btn gradient-btn" @click="selectedGame = game">{{ getGameName(game) }}
            <i class="fa fa-arrow-right ms-2 mt-1 float-end"></i>
          </button>
          <div>
            <hr>
            <button @click="removeArcadeID" class="btn btn-primary gradient-btn" type="button" role="button" ><i class="fa fa-home me-2"></i> {{ $t("menu.arcadesSelect") }}</button>
            <router-link to="/about" class="btn btn-link" type="button" role="button" exact>{{ $t("menu.aboutAndInfo") }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <transition name="modal">
    <LanguageModal
        @close="hideDialog"
        :open="dialogIsVisible"
    />
  </transition>
  <transition name="modal">
    <ProfileModal
        @close="hideProfile"
        :open="profileVisible"
        :player="loadedPlayer"
        :arcadeID="arcadeID"
    />
  </transition>
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
      loading: false,
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
      this.loadedPlayer = player;
      this.profileVisible = true;
    },
    removeArcadeID() {
      this.arcadeID = '';
      this.selectedGame = '';
      this.players = [];
    },
    hideProfile() {
      this.profileVisible = false;
    },
    getGameName(gameID) {
      return this.$store.getters['games/getGameName'](gameID);
    },
    selectedArcade(arcadeID) {
      this.arcadeID = arcadeID;
      this.selectedGame = '';
      this.players = [];
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
      this.loading = true;
      this.players = [];
      for (let player in this.getPlayers) {
        this.players.push(await this.$store.dispatch('loadUserStats', player));
      }
      this.loading = false;
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
@keyframes bannerPulse {
  0% { filter: brightness(1); }
  100% { filter: brightness(1.2) drop-shadow(0 0 10px #2575fc); }
}
.stats-screen {
  margin-top: 75px!important;
}
.card-arcade, .card-game {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  background: linear-gradient(135deg, #f8fafc 80%, #e0e7ff 100%);
}
.gradient-btn {
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(106,17,203,0.15);
  transition: background 0.3s, box-shadow 0.3s;
}
.gradient-btn:hover {
  background: linear-gradient(90deg, #2575fc 0%, #6a11cb 100%);
  box-shadow: 0 4px 16px rgba(106,17,203,0.25);
}
.text-gradient {
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
.text-glow {
  text-shadow: 0 0 8px #2575fc, 0 0 2px #6a11cb;
}
.select-lang {
  cursor: pointer;
  transition: color 0.2s;
}
.select-lang:hover {
  color: #6a11cb;
}
.table-ranking {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(106,17,203,0.08);
}
.table-ranking thead {
  color: white;
  background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
}
.ranking-row {
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.ranking-row:hover {
  background: linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%);
  box-shadow: 0 2px 8px #2575fc33;
}
.top-rank {
  background: linear-gradient(90deg, #ffe259 0%, #ffa751 100%)!important;
  font-weight: bold;
  box-shadow: 0 2px 12px #ffa75155;
}
.trophy-animate {
  color: black;
  animation: trophyBounce 1s infinite alternate;
}
@keyframes trophyBounce {
  0% { transform: scale(1); }
  100% { transform: scale(1.2) rotate(-10deg); }
}
.btn-floating {
  position: fixed;
  bottom: 32px;
  left: 32px;
  z-index: 100;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 16px #2575fc55;
}
.flag-img {
  border-radius: 8px;
  box-shadow: 0 2px 8px #2575fc22;
}
.arcade-btn, .game-btn {
  border-radius: 12px;
  font-weight: 500;
  transition: box-shadow 0.2s, background 0.2s;
}
.arcade-btn:hover, .game-btn:hover {
  box-shadow: 0 2px 12px #6a11cb33;
  background: linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%);
  /* Prevent contraction/shrink on hover */
  color: black;
  transform: none;
}
</style>
