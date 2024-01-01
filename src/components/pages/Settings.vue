<template>
  <div class="stats-screen px-md-5 m-auto">
    <h1 class="text-center my-4">{{ $t("settings.settings") }}</h1>
    <div class="my-3 d-flex">
      <div class="mx-auto">
        <a class="btn btn-primary" @click="tab = 'details'" :class="tab === 'details' ? 'btn-primary' : 'btn-light'">{{ $t("settings.accountDetails") }}</a>
        <a class="btn btn-primary" @click="tab = 'games'" :class="tab === 'games' ? 'btn-primary' : 'btn-light'">{{ $t("settings.gameSelect") }}</a>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div v-if="tab === 'games' && games">
          <div id="emailHelp" class="form-text mb-3">
            <strong>{{ $t("settings.gameSelectInfo") }}</strong>
            <ul class="list-unstyled">
              <li>SP - {{ $t("settings.singlePLay") }}</li>
              <li>DP - {{ $t("settings.doublePlay") }}</li>
              <li>SC - {{ $t("welcomeScreen.singleCourses") }}</li>
              <li>DC - {{ $t("welcomeScreen.doubleCourses") }}</li>
            </ul>
          </div>

          <table class="table table-sm table-borderless table-striped">
            <tbody v-for="system in gamesSortedBySystem" :key="system">
              <tr>
                <th class="text-start border-1-top border-dark" colspan="5">{{ system[0].playStyle }}</th>
              </tr>
              <tr v-for="game in system" :key="game">
                <td class="text-dark bg-light w-40">{{ game.name }}</td>
                <td class="text-center border-primary border-1" :class="{'bg-light text-primary': !enteredTrackGames[game.id].singlesSet, 'bg-primary text-white': enteredTrackGames[game.id].singlesSet}"
                    @click="updateTrackGames(game.id, 'singlesSet', !enteredTrackGames[game.id].singlesSet)">
                  SP
                </td>
                <td class="text-center border-primary border-1" v-if="game.hasDoubleCharts" :class="{'bg-light text-primary': !enteredTrackGames[game.id].doublesSet, 'bg-primary text-white': enteredTrackGames[game.id].doublesSet}"
                    @click="updateTrackGames(game.id, 'doublesSet', !enteredTrackGames[game.id].doublesSet)">
                  DP
                </td>
                <td v-else class="bg-dark diff-td"></td>
                <td class="text-center border-primary border-1" v-if="game.hasCourseMode" :class="{'bg-light text-primary': !enteredTrackGames[game.id].singleCourse, 'bg-primary text-white': enteredTrackGames[game.id].singleCourse}"
                    @click="updateTrackGames(game.id, 'singleCourse', !enteredTrackGames[game.id].singleCourse)">
                  SC
                </td>
                <td v-else class="bg-dark diff-td"></td>
                <td class="text-center border-primary border-1" v-if="game.hasDoubleCharts && game.hasCourseMode" :class="{'bg-light text-primary': !enteredTrackGames[game.id].doubleCourse, 'bg-primary text-white': enteredTrackGames[game.id].doubleCourse}"
                    @click="updateTrackGames(game.id, 'doubleCourse', !enteredTrackGames[game.id].doubleCourse)">
                  DC
                </td>
                <td v-else class="bg-dark diff-td"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="tab === 'details'">
          <div id="emailHelp" class="form-text mb-3">{{ $t("settings.accountInfo") }}</div>
          <div class="mb-3">
            <label for="Name" class="form-label">{{ $t("login.gametagName") }}</label>
            <input type="username" class="form-control" v-model="enteredName" id="username" aria-describedby="username">
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
<!--          <div class="mb-3">-->
<!--            <label for="Select" class="form-label">{{ $t("settings.favoriteGame")}}</label>-->
<!--            <select id="Select" class="form-select" placeholder="Choose" v-model="enteredFavoriteGame">-->
<!--              <option v-for="game in games" v-bind:key="game">{{ game.name }}</option>-->
<!--            </select>-->
<!--          </div>-->
          <div class="mb-0">
            <div>Current theme: <span class="text-primary ms-2">{{ themes[currentTheme-1] }}</span></div>
            <button @click="showThemeDialog" class="btn-primary btn" type="button">
              <i class="fas fa-palette text-contrast"></i> {{ $t("settings.selectTheme") }}
            </button>
          </div>
          <hr>
          <button type="submit" @click="updateSettings" class="btn btn-primary"><i class="fa fa-save me-1"></i> {{ $t("filter.save") }}</button>
          <button v-if="successUpdate" class="btn btn-success disabled"><i class="fa fa-check Reset me-1" ></i> {{ $t("settings.updated") }}</button>
        </div>
      </div>
    </div>
    <ThemeModal
        @close="hideThemeDialog"
        :open="dialogThemeIsVisible"
        class="z-top"
    />
  </div>
</template>

<script>
import ThemeModal from "@/components/UI/ThemeModal";
export default {
  name: 'SettingsScreen',
  components: {
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
      enteredAracdeCode01: '',
      enteredAracdeCode02: '',
      enteredAracdeCode03: '',
      codeSet01: false,
      codeSet02: false,
      codeSet03: false,
      enteredTrackGames: {},
      dialogThemeIsVisible: false,
      currentTheme: this.$store.getters['getTheme'], // gives number 1/4
      themes: ['Lumen', 'Space', 'Scrapbook', 'Bloom'],
    }
  },
  async created() {
    this.enteredFavoriteGame = this.favoriteGame;
    this.enteredName = this.userName;
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
      this.$store.dispatch('updateTrackGames', this.enteredTrackGames);
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
</style>