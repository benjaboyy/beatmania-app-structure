<template>
  <div class="stats-screen px-md-5 m-auto">
    <h1 class="text-center my-4">{{ $t("settings.settings") }}</h1>
    <div class="mb-3 d-flex">
      <div class="mx-auto">
        <a class="btn me-2" @click="tab = 'details'" :class="tab === 'details' ? 'btn-primary disabled' : 'btn-primary'">{{ $t("settings.accountDetails") }}</a>
        <a class="btn" @click="tab = 'games'" :class="tab === 'games' ? 'btn-primary disabled' : 'btn-primary'">{{ $t("settings.gameSelect") }}</a>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div v-if="tab === 'games' && games">
          <p>Select the games you want to track</p>
          <div class="row">
            <table class="table table-sm table-borderless table-striped">
              <tbody v-for="system in gamesSortedBySystem" :key="system">
              <tr>
                <th class="text-start bg-light-primary" colspan="5">
                  <img v-if="system[0].playStyle === 'Playstation'" src="@/assets/svg/playstation.svg" class="icon me-2" alt="playstation-icon">
                  <img v-else-if="system[0].playStyle === 'Arcade'" src="@/assets/svg/arcade.svg" class="icon me-2" alt="arcade-icon">
                  <img v-else-if="system[0].playStyle === 'Gameboy'" src="@/assets/svg/gameboy.svg" class="icon me-2" alt="gameboy-icon">
                  <img v-else-if="system[0].playStyle === 'Wonderswan'" src="@/assets/svg/wonder.svg" class="icon me-2" alt="wonderswan-icon">
                  <span class="fw-bold mb-0">{{ system[0].playStyle }}</span>
                </th>
              </tr>
              <tr v-for="game in system" :key="game">
                <td class="text-dark bg-light w-40 d-flex justify-content-between w-100">
                  <span class="my-auto">
                    <h6 class="mb-0">{{ game.name }}</h6>
<!--                    <span class="badge" :class="{' bg-dark': !enteredTrackGames[game.id].singlesSet, 'bg-primary': enteredTrackGames[game.id].singlesSet}">SP</span>-->
<!--                    <span class="badge ms-1" :class="{' bg-dark': game.hasDoubleCharts && !enteredTrackGames[game.id].doublesSet, 'bg-primary': enteredTrackGames[game.id].doublesSet, 'bg-light': !game.hasDoubleCharts}">DP</span>-->
<!--                    <span class="badge ms-1" :class="{' bg-dark': game.hasCourseMode && !enteredTrackGames[game.id].singleCourse, 'bg-primary': enteredTrackGames[game.id].singleCourse, 'bg-light': !game.hasCourseMode}">SC</span>-->
<!--                    <span class="badge ms-1" :class="{' bg-dark': game.hasDoubleCharts && game.hasCourseMode && !enteredTrackGames[game.id].doubleCourse, 'bg-primary': enteredTrackGames[game.id].doubleCourse, 'bg-light':!game.hasCourseMode || !game.hasDoubleCharts}">DC</span>-->
                  </span>
                  <button v-if="!enteredTrackGames[game.id].singlesSet && !enteredTrackGames[game.id].doublesSet && !enteredTrackGames[game.id].singleCourse && !enteredTrackGames[game.id].doubleCourse"
                          @click="toggleAllFilters(game.id)"
                          class="btn btn-success btn-sm">
                    <i class="fa fa-plus"></i> ADD
                  </button>
                  <div class="btn-group" v-else>
                    <button
                        @click="openModeEditModal(game.id, game.name, game.hasDoubleCharts, game.hasCourseMode)"
                        class="btn btn-warning btn-sm px-3"
                    >
                      <i class="fa fa-edit"></i>
                    </button>
                    <button
                        @click="removeFilters(game.id)"
                        class="btn btn-danger btn-sm px-3"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="tab === 'details'">
          <div class="mb-3">
            <label for="username" class="form-label">{{ $t("login.gametagName") }}</label>
            <input type="username" class="form-control" v-model="enteredName" id="username" aria-describedby="username">
          </div>
          <div class="mb-3">
            <label for="url" class="form-label">{{ $t("login.profileUrl") }}</label>
            <input type="url" class="form-control" v-model="enteredUrl" id="url" aria-describedby="url">
          </div>
          <div class="mb-3">
            <label for="Select" class="form-label">
              {{ $t("settings.arcadeCode") }}
              <router-link to="/tips" class="text-primary"><i class="fa fa-question-circle ms-2"></i> {{ $t("settings.info") }}</router-link>
            </label>
            <div class="row">
              <div class="col-12">
                <div class="input-group">
                  <input type="arcadecode01" :disabled="codeSet01" class="form-control" v-model="enteredAracdeCode01" id="arcadecode01" aria-describedby="arcadecode01" :placeholder="$t('settings.codeSlot1')">
                  <router-link v-if="codeSet01" :to="'/arcade/'+enteredAracdeCode01" class="btn btn-primary"><i class="fa fas fa-trophy"></i> {{ $t("settings.seeRanking") }}</router-link>
                  <button v-if="codeSet01" @click="deleteFromArcade(enteredAracdeCode01)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                </div>
              </div>
              <div v-if="enteredAracdeCode01" class="col-12 mt-2">
                <div class="input-group">
                  <input type="arcadecode02" :disabled="codeSet02" class="form-control" v-model="enteredAracdeCode02" id="arcadecode02" aria-describedby="arcadecode02"  :placeholder="$t('settings.codeSlot2')">
                  <router-link v-if="codeSet02" :to="'/arcade/'+enteredAracdeCode02" class="btn btn-primary"><i class="fa fas fa-trophy"></i> {{ $t("settings.seeRanking") }}</router-link>
                  <button v-if="codeSet02" @click="deleteFromArcade(enteredAracdeCode02)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                </div>
              </div>
              <div v-if="enteredAracdeCode02 || enteredAracdeCode01" class="col-12 mt-2">
                <div class="input-group">
                  <input type="arcadecode03" :disabled="codeSet03" class="form-control" v-model="enteredAracdeCode03" id="arcadecode03" aria-describedby="arcadecode03"  :placeholder="$t('settings.codeSlot3')">
                  <router-link v-if="codeSet03" :to="'/arcade/'+enteredAracdeCode03" class="btn btn-primary"><i class="fa fas fa-trophy"></i> {{ $t("settings.seeRanking") }}</router-link>
                  <button v-if="codeSet03" @click="deleteFromArcade(enteredAracdeCode03)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="Select" class="form-label">{{ $t("settings.favoriteGame")}}</label>
            <select id="Select" class="form-select" placeholder="Choose" v-model="enteredFavoriteGame">
              <option v-for="game in games" v-bind:key="game">{{ game.name }}</option>
            </select>
          </div>
          <div class="mb-0">
            <div>Current theme: <span class="text-primary ms-2">{{ themes[currentTheme-1] }}</span></div>
            <button @click="showThemeDialog" class="btn-primary btn" type="button">
              <i class="fas fa-palette text-contrast"></i> {{ $t("settings.selectTheme") }}
            </button>
            <div class="mt-2">Profile/ Statistics:</div>
            <router-link :to="'user/' + userID" class="btn btn-primary"><i class="fas fa-eye text-contrast"></i> {{ $t("login.viewProfile") }}</router-link>
          </div>
          <hr>
          <button type="submit" @click="updateSettings" class="btn btn-primary"><i class="fa fa-save me-1"></i> {{ $t("filter.save") }}</button>
          <button v-if="successUpdate" class="btn btn-success disabled"><i class="fa fa-check Reset me-1" ></i> {{ $t("settings.updated") }}</button>
        </div>
      </div>
    </div>
    <ModeSelectModal
        @close="hideDialog"
        @updateTrackGames="updateTrackGames"
        @remove-filters="removeFilters"
        @toggle-all-filters="toggleAllFilters"
        :open="dialogIsVisible"
        :info="modeInfo"
    />
    <ThemeModal
        @close="hideThemeDialog"
        :open="dialogThemeIsVisible"
        class="z-top"
    />
  </div>
</template>

<script>
import ThemeModal from "@/components/UI/ThemeModal";
import ModeSelectModal from "@/components/UI/ModeSelectModal.vue";
export default {
  name: 'SettingsScreen',
  components: {
    ModeSelectModal,
    ThemeModal
  },
  props: {
    msg: String
  },
  data() {
    return {
      tab: 'details',
      enteredFavoriteGame: '',
      enteredName: '',
      enteredUrl: '',
      enteredAracdeCode01: '',
      enteredAracdeCode02: '',
      enteredAracdeCode03: '',
      codeSet01: false,
      codeSet02: false,
      codeSet03: false,
      enteredTrackGames: {},
      dialogThemeIsVisible: false,
      dialogIsVisible: false,
      currentTheme: this.$store.getters['getTheme'], // gives number 1/4
      themes: ['Lumen', 'Scrapbook'],
      modeInfo: {}
    }
  },
  async created() {
    this.enteredFavoriteGame = this.favoriteGame;
    this.enteredName = this.userName;
    this.enteredUrl = this.profileUrl;
    if (this.arcadeCode01) {
      this.codeSet01 = true;
    }
    this.enteredAracdeCode01 = this.arcadeCode01;
    if (this.arcadeCode02) {
      this.codeSet02 = true;
    }
    this.enteredAracdeCode02 = this.arcadeCode02;
    if (this.arcadeCode03) {
      this.codeSet03 = true;
    }
    this.enteredAracdeCode03 = this.arcadeCode03;
    await this.$store.dispatch('loadTrackedGames');
    await this.games.forEach(game => {
      this.enteredTrackGames[game.id] = {
        singlesSet: false,
        doublesSet: false,
        singleCourse: false,
        doubleCourse: false
      };
    });
    const trackedGames = this.trackGames;
    for (let gameId in trackedGames) {
      if (gameId in this.enteredTrackGames) {
        this.enteredTrackGames[gameId] = trackedGames[gameId];
      }
    }
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('ID');
    if (gameId === 'game') {
      this.tab = 'games';
    }
    window.history.replaceState({}, document.title, "/" + "settings");
  },
  methods: {
    showDialog() {
      this.dialogIsVisible = true;
    },
    hideDialog() {
      this.dialogIsVisible = false;
    },
    getGamePlaystyle(gameID) {
      return this.$store.getters['games/getGamePlayStyle'](gameID);
    },
    updateTrackGames(gameId, option, value) {
      if (option === 'singlesSet') {
        this.enteredTrackGames[gameId].singlesSet = value;
      } else if (option === 'doublesSet') {
        this.enteredTrackGames[gameId].doublesSet = value;
      } else if (option === 'singleCourse') {
        this.enteredTrackGames[gameId].singleCourse = value;
      } else if (option === 'doubleCourse') {
        this.enteredTrackGames[gameId].doubleCourse = value;
      }
      if (!this.modeInfo.hasDoubleCharts) {
        this.enteredTrackGames[gameId].doublesSet = false;
        this.enteredTrackGames[gameId].doubleCourse = false;
      }
      if (!this.modeInfo.hasCourseMode) {
        this.enteredTrackGames[gameId].singleCourse = false;
        this.enteredTrackGames[gameId].doubleCourse = false;
      }
      this.$store.dispatch('updateTrackGames', this.enteredTrackGames);
    },
    removeFilters(gameId) {
      this.enteredTrackGames[gameId].singlesSet = false;
      this.enteredTrackGames[gameId].doublesSet = false;
      this.enteredTrackGames[gameId].singleCourse = false;
      this.enteredTrackGames[gameId].doubleCourse = false;
      this.$store.dispatch('updateTrackGames', this.enteredTrackGames);
    },
    toggleAllFilters(gameId) {
      this.enteredTrackGames[gameId].singlesSet = true;
      this.enteredTrackGames[gameId].doublesSet = true;
      this.enteredTrackGames[gameId].singleCourse = true;
      this.enteredTrackGames[gameId].doubleCourse = true;
      this.$store.dispatch('updateTrackGames', this.enteredTrackGames);
    },
    openModeEditModal(gameId, name, hasDoubleCharts, hasCourseMode) {
      this.dialogIsVisible = true;
      console.log(gameId);
      this.toggleAllFilters(gameId);
      this.modeInfo = {
        id: gameId,
        name: name,
        singlesSet: this.enteredTrackGames[gameId].singlesSet,
        doublesSet: this.enteredTrackGames[gameId].doublesSet,
        singleCourse: this.enteredTrackGames[gameId].singleCourse,
        doubleCourse: this.enteredTrackGames[gameId].doubleCourse,
        hasDoubleCharts: hasDoubleCharts,
        hasCourseMode: hasCourseMode
      };
    },
    updateSettings() {
      this.$store.dispatch('updateSettings', {
        arcadeCode01: this.enteredAracdeCode01,
        arcadeCode02: this.enteredAracdeCode02,
        arcadeCode03: this.enteredAracdeCode03,
        favoriteGame: this.enteredFavoriteGame
      });
      this.$store.dispatch('updateUsername', {
        name: this.enteredName
      });
      this.$store.dispatch('updateUserUrl', {
        profileUrl: this.enteredUrl
      });
      if (this.enteredAracdeCode01) {
        this.codeSet01 = true;
        this.$store.dispatch('arcades/updatePlayerOnArcade', {
          arcadeID: this.enteredAracdeCode01,
          name: this.enteredName,
          userID: this.$store.getters['userId']
        });
      }
      if (this.enteredAracdeCode02) {
        this.codeSet02 = true;
        this.$store.dispatch('arcades/updatePlayerOnArcade', {
          arcadeID: this.enteredAracdeCode02,
          name: this.enteredName,
          userID: this.$store.getters['userId']
        });
      }
      if (this.enteredAracdeCode03) {
        this.codeSet03 = true;
        this.$store.dispatch('arcades/updatePlayerOnArcade', {
          arcadeID: this.enteredAracdeCode03,
          name: this.enteredName,
          userID: this.$store.getters['userId']
        });
      }
    },
    deleteFromArcade(arcadeID) {
      if (arcadeID === this.enteredAracdeCode01) {
        this.enteredAracdeCode01 = '';
        this.codeSet01 = false;
      } else if (arcadeID === this.enteredAracdeCode02) {
        this.enteredAracdeCode02 = '';
        this.codeSet02 = false;
      } else if (arcadeID === this.enteredAracdeCode03) {
        this.enteredAracdeCode03 = '';
        this.codeSet03 = false;
      }
      this.$store.dispatch('arcades/deletePlayerOnArcade', {
        arcadeID: arcadeID,
        userID: this.$store.getters['userId']
      });
      this.$store.dispatch('updateSettings', {
        arcadeCode01: this.enteredAracdeCode01,
        arcadeCode02: this.enteredAracdeCode02,
        arcadeCode03: this.enteredAracdeCode03,
        favoriteGame: this.enteredFavoriteGame
      });
    },
    hideThemeDialog() {
      this.dialogThemeIsVisible = false;
      window.location.reload();
    },
    showThemeDialog() {
      this.dialogThemeIsVisible = true;
    }
  },
  computed: {
    userID() {
      return this.$store.getters['userID'];
    },
    systems() {
      const systems = [];
      for(const game in this.games) {
        if (!systems.includes(this.games[game].playStyle)) {
          systems.push(this.games[game].playStyle);
        }
      }
      return systems;
    },
    gamesSortedBySystem() {
      const gamesSortedBySystem = {};
      for(const game in this.games) {
        if (!gamesSortedBySystem[this.games[game].playStyle]) {
          gamesSortedBySystem[this.games[game].playStyle] = [];
        }
        gamesSortedBySystem[this.games[game].playStyle].push(this.games[game]);
      }
      return gamesSortedBySystem;
    },
    games() {
      return this.$store.getters['games/getGames'];
    },
    successUpdate() {
      return this.$store.getters['getSuccessUpdate'];
    },
    trackGames() {
      return this.$store.getters['getTrackGames'];
    },
    favoriteGame() {
      return this.$store.getters['favoriteGame'];
    },
    profileUrl() {
      return this.$store.getters['profileUrl'];
    },
    arcadeCode01() {
      return this.$store.getters['getArcadeCode01'];
    },
    arcadeCode02() {
      return this.$store.getters['getArcadeCode02'];
    },
    arcadeCode03() {
      return this.$store.getters['getArcadeCode03'];
    },
    userName() {
      return this.$store.getters['userName'];
    }
  },
}
</script>

<style scoped>
.stats-screen {
  max-width: 800px;
}
.z-top {
  z-index: 1000;
}
.diff-td {
  max-width: 60px;
  text-align: center;
  vertical-align: middle;
  color: white !important;
}
td:hover {
  color: black !important;
}
.w-40 {
  width: 40%;
}
.border-1 {
  border: 1px solid;
  vertical-align: middle;
}
.img-thumbnail {
  border: 1px solid #000000;
  width: 100px;
  height: 100px;
  /*/fit image in frame*/
  object-fit: cover;

}
.icon {
  width: 30px;
  height: 30px;
}

.bg-light-primary {
  background-color: rgba(7, 152, 255, 0.28) !important;
}
</style>