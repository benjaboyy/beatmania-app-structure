<template>
  <div class="stats-screen px-2 mb-5">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col bg-primary pt-2 col-lg-6 profile--header">
        <div class=" text-white">
          <div class="card-body p-4">
            <div class="row ">
              <div v-if="player.profileUrl" class="col-6 mb-2 text-center mx-auto">
                <img :src="player.profileUrl"
                     alt="Generic placeholder image" class="img-fluid img-thumbnail"
                     style="width: 180px; border-radius: 10px;">
              </div>
              <div v-if="!player.profileUrl" class="col-12 mb-2 text-black">
                <div class="text-center">
                  <i class="fa fa-user-circle fa-6x"></i>
                </div>
              </div>
              <div class="text-center mb-0">
                <h2 class="mb-0">{{ player.name }}</h2>
                <small class="mb-2"><i><small>Last login {{ player.lastLogin }}</small></i>
                  <router-link to="/settings">
                    <a v-if="isAuthenticated" class="text-white ms-3" href="">
                      <i class="fa fa-cog"></i> <small>Settings</small>
                    </a>
                  </router-link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 mt-3 py-3 text-white">
      <div class="row">
        <div class="col-6 d-flex">
          <div class="ms-auto text-center">
            <div class="align-middle text-big mb-1"><i class="fa fa-star fa-2x"></i> {{ calculateTotalPoints }}
            </div>
            Points
          </div>
        </div>
        <div class="col-6 d-flex">
          <div class="me-auto text-center">
            <div class="align-middle text-big mb-1"><i class="fa fa-trophy fa-2x"></i> 0</div>
            (Soon)
          </div>
        </div>
      </div>
    </div>

    <h2 class="text-center my-3">{{ $t("welcomeScreen.trackedGames") }}</h2>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col col-lg-6">
        <div v-for="(value, key) in player" :key="key">
          <div v-if="key === 'trackedGames'">
            <table class="table mb-0 bg-light rounded">
              <tbody>
              <tr v-for="(game, gameKey) in value" :key="gameKey">
                <td v-if="game.total > 0">
                  <img v-if="getGamePlaystyle(gameKey) === 'Playstation'" src="../../assets/svg/playstation.svg"
                       class="icon" alt="arcade-icon">
                  <img v-else-if="getGamePlaystyle(gameKey) === 'Arcade'" src="../../assets/svg/arcade.svg" class="icon"
                       alt="arcade-icon">
                  <img v-else-if="getGamePlaystyle(gameKey) === 'Gameboy'" src="../../assets/svg/gameboy.svg"
                       class="icon" alt="arcade-icon">
                  <img v-else-if="getGamePlaystyle(gameKey) === 'Wonderswan'" src="../../assets/svg/wonder.svg"
                       class="icon" alt="arcade-icon">
                  {{ getGameName(gameKey) }}
                </td>
                <td v-if="game.total > 0" class="text-end text-primary"><b>{{ game.total }}<i
                    class="fa fa-star"></i></b></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <h2 class="text-center my-3">Linked arcades</h2>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col col-lg-6">
        <div v-for="(arcade, arcadeKey) in infoForPlayerArcade" :key="arcadeKey">
          <div class="card">
            <div class="card-body">
              <span class="d-flex">
                <img class="my-auto me-2" :src="'https://flagsapi.com/' + arcade.countryCode + '/flat/64.png'">
                <span class="me-auto my-auto">{{ arcade.name }} <br>
                  <small class="text-muted
                  ">{{ arcade.games.length }} Games / {{ Object.keys(arcade.players).length }} Players</small>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h2 class="text-center my-3">Last played song</h2>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col col-lg-6">
        <div v-for="(value, key) in player" :key="key">
          <div v-if="key === 'lastPlayedSong'">
            <div v-if="value">
              <div class="card">
                <div class="card-body p-4">
                  <div class="d-flex justify-content-between align-items-center mb-0">
                    <h5 class="mb-0">{{ player.lastPlayedSong.id }}</h5>
                    <div>
                      <span class="badge ms-2"
                            :class="player.lastPlayedSong.normalClear ? 'bg-success' : 'bg-secondary'">N</span>
                      <span class="badge ms-2"
                            :class="player.lastPlayedSong.hardClear ? 'bg-danger' : 'bg-secondary'">H</span>
                      <span class="badge ms-2"
                            :class="player.lastPlayedSong.anotherClear ? 'bg-warning' : 'bg-secondary'">A</span>
                      <span class="badge ms-2"
                            :class="player.lastPlayedSong.normalDoubleClear ? 'bg-success' : 'bg-secondary'">ND</span>
                      <span class="badge ms-2"
                            :class="player.lastPlayedSong.hardDoubleClear ? 'bg-danger' : 'bg-secondary'">HD</span>
                      <span class="badge ms-2"
                            :class="player.lastPlayedSong.anotherDoubleClear ? 'bg-warning' : 'bg-secondary'">AD</span>
                      <i class="fa fa-heart ms-2"
                         :class="player.lastPlayedSong.favorite ? 'text-danger' : 'text-muted'"></i>
                      <i class="fa fa-bullseye ms-2"
                         :class="player.lastPlayedSong.target ? 'text-success' : 'text-muted'"></i>
                    </div>
                  </div>
                  <div class="text-muted">
                    <p v-if="player.lastPlayedSong.normalScore" class="mb-1">Normal score:
                      {{ player.lastPlayedSong.normalScore }}</p>
                    <p v-if="player.lastPlayedSong.hardScore" class="mb-1">Hard score:
                      {{ player.lastPlayedSong.hardScore }}</p>
                    <p v-if="player.lastPlayedSong.anotherScore" class="mb-1">Another score:
                      {{ player.lastPlayedSong.anotherScore }}</p>
                    <p v-if="player.lastPlayedSong.scoreDoubleNormal" class="mb-1">Normal double score:
                      {{ player.lastPlayedSong.scoreDoubleNormal }}</p>
                    <p v-if="player.lastPlayedSong.scoreDoubleHard" class="mb-1">Hard double score:
                      {{ player.lastPlayedSong.scoreDoubleHard }}</p>
                    <p v-if="player.lastPlayedSong.scoreDoubleAnother" class="mb-1">Another double score:
                      {{ player.lastPlayedSong.scoreDoubleAnother }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h2 class="text-center my-3">Achievements</h2>
    <div class="text-white text-center">- Coming soon -</div>
  </div>
</template>

<script>
import info from '@/assets/locales/info.js'

export default {
  name: 'ProfileScreen',
  props: {
    msg: String,
  },
  data() {
    return {
      userID: '',
      player: '',
      loading: false,
      loadedArcadeInfo: '',
    };
  },
  async created() {
    this.loading = true;
    await this.$store.dispatch('arcades/loadArcades');
    await this.$store.dispatch('songs/loadSongs');
    this.userID = this.$route.params.userID;
    this.player = await this.$store.dispatch('loadUserStats', this.userID);
    this.getArcades();
    this.loading = false;
  },
  emits: ['select-view'],
  methods: {
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'ja' : 'en';
    },
    getGameName(gameID) {
      return this.$store.getters['games/getGameName'](gameID);
    },
    getGamePlaystyle(gameID) {
      return this.$store.getters['games/getGamePlayStyle'](gameID);
    },
    songInfo(gameID, songID) {
      return this.$store.getters['songs/getSongByID'](gameID, songID);
    },
    getArcades() {
      this.loadedArcadeInfo = this.$store.getters['arcades/getArcades'];
    },
    isAuthenticated() {
      return this.$store.getters['isAuthenticated'];
    },
  },
  computed: {
    infoForPlayerArcade() {
      const arcades = this.loadedArcadeInfo;
      const playerArcades = this.player.arcades;
      const playerArcadeInfo = [];
      for (const arcade in arcades) {
        if (playerArcades.includes(arcades[arcade].id)) {
          playerArcadeInfo.push(arcades[arcade]);
        }
      }
      return playerArcadeInfo;
    },
    games() {
      return this.$store.getters['games/getGames'];
    },
    calculateTotalGames() {
      return Object.keys(this.player.trackedGames).length;
    },
    calculateTotalPoints() {
      let total = 0;
      for (const game in this.player.trackedGames) {
        // skip if not defined so result is alway a number
        if (this.player.trackedGames[game].total === undefined) {
          continue;
        }
        total += this.player.trackedGames[game].total;
      }
      return total;
    },
  },
  i18n: {
    sharedMessages: info
  }
};
</script>

<style scoped>
.profile--header {
  border-radius: 0 0 3em 3em;
}

.float-left {
  float: right;
}

.img-fluid {
  object-fit: cover;
  aspect-ratio: 1/1;
}

.flex-shrink-0 {
  width: 45%;
  max-width: 180px;
}

.select-lang {
  cursor: pointer;
}

.stats-screen {
  margin-top: -20px;
}

.icon {
  width: 30px;
  height: 30px;
}

.text-big {
  font-size: 1.5rem;

  .fa {
    text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.3), /* First shadow */ 0px 4px 0px rgba(0, 0, 0, 0.2), /* Second shadow */ 0px 6px 0px rgba(0, 0, 0, 0.1) /* Third shadow */
  }

  .fa-star {
    color: #FFD700;
  }

  .fa-trophy {
    color: #C0C0C0;
  }
}

.img-thumbnail {
  border: 1px solid #000;
  object-fit: cover;
  border-radius: 25px !important;
}

.table td:hover {
  background-color: transparent;
  color: unset !important;
}
</style>
