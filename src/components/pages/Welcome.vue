<template>
  <div class="stats-screen px-md-5 m-auto">
    <div class="container">
      <div class="row">
        <div class="col-md-6 py-2 mx-auto">
          <img v-if="profileUrl" :src="profileUrl" class="rounded img-thumbnail float-left" alt="profile image">
          <span @click="showShare" class="float-right d-flex h-100 text-white"><i class="fas fa-qrcode fa-2x my-auto"></i></span>
          <div class="d-flex flex-column my-auto ps-2">
            <h5 class="m-0 text-white mt-2 mt-md-0"> {{ $t("welcomeScreen.welcome") }}</h5>
            <h1>DJ {{ userName }}</h1>
          </div>
        </div>
      </div>
      <div class="row">
        <div v-if="filteredGames < 1" class="col-12 my-0 text-center">
          <div id="reloadHelp" class="form-text mb-3">{{ $t("welcomeScreen.clickReload") }}</div>
          <router-link :to="{ path: '/settings', query: { ID: 'game' } }" class="btn w-100 mb-3 btn-block btn-lg btn-secondary" type="button" role="button"><i class="fas fa-check-square"></i> {{ $t("welcomeScreen.selectGames") }}</router-link>
        </div>
      </div>
      <div v-if="isDataLoaded" class="row">
        <div v-if="allArcadeCodes > 0" class="col-md-6 mx-auto">
          <div v-for="code in allArcadeCodes" v-bind:key="code" class="card text-bg-primary">
            <div class="card-body">
              <div class="row g-3 mb-2">
                <div class="col-12">
                  <h4 class="card-title"><strong>{{ getArcadeName(code) }}</strong></h4>
                </div>
                <div class="col-6">
                  <router-link :to="{ path: '/arcade/' + code }" class="btn w-100 btn-outline-light me-2" href="#">{{ $t("welcomeScreen.leaderboard") }}</router-link>
                </div>
                <div class="col-6">
                  <router-link :to="{ path: '/leaderboard/' + code }" class="btn w-100 btn-outline-light me-2" href="#">{{ $t("welcomeScreen.highScore") }}</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isDataLoaded" class="login-screen mt-2 px-2 mx-auto text-center">
        <h1 class="display-2"><i class="fa fa-compact-disc fa-spin"></i></h1>
        <h2>Loading...</h2>
      </div>
      <div v-for="game in filteredGames" v-bind:key="game" class="row">
        <div v-if="isDataLoaded" class="col-md-6 mt-4 mx-auto">
          <div v-if="gamestats[game.id]" class="card h-100">
            <div class="card-body pb-2">
              <h4 class="card-title">
                <img v-if="game.playStyle === 'Playstation'" src="../../assets/svg/playstation.svg" class="icon" alt="arcade-icon">
                <img v-else-if="game.playStyle === 'Arcade'" src="../../assets/svg/arcade.svg" class="icon" alt="arcade-icon">
                <img v-else-if="game.playStyle === 'Gameboy'" src="../../assets/svg/gameboy.svg" class="icon" alt="arcade-icon">
                <img v-else-if="game.playStyle === 'Wonderswan'" src="../../assets/svg/wonder.svg" class="icon" alt="arcade-icon">
                <strong>{{ game.name }}</strong></h4>
              <div class="row g-3 mb-2 mt-0">
                <div class="col-6">
                  <router-link :to="'/games/' + game.id" class="btn w-100 btn-primary me-2" href="#"><i class="fa fa-compact-disc"></i> {{ $t("welcomeScreen.songList") }}</router-link>
                </div>
                <div class="col-6">
                  <router-link  v-if="game.trackedGame.doubleCourse || game.trackedGame.singleCourse" :to="'/g/course/' + game.id" class="btn w-100 btn-primary" href="#"><i class="fa fa-layer-group"></i> {{ $t("welcomeScreen.courses") }}</router-link>
                  <button v-else class="btn w-100 btn-secondary" disabled><i class="fa fa-layer-group"></i> {{ $t("welcomeScreen.courses") }}</button>
                </div>
              </div>
              <div :id="'collapseOne' + game.id.replace(/[+\[\-:]/g, '')" class="accordion-collapse collapse text-start">
                <span class="text-primary">{{ $t("welcomeScreen.songs") }}: </span>{{ gamestats[game.id].songs }}<br>
                <span class="text-primary">{{ $t("welcomeScreen.system") }}: </span>{{ game.playStyle }}

                <div v-if="game.trackedGame.singlesSet">
                  <progress-bar-stats :clear="gamestats[game.id].singles.clear" :total="gamestats[game.id].singles.total" :name="'primary'" :type="$t('welcomeScreen.singles')"></progress-bar-stats>
                </div>
                <div v-if="game.trackedGame.doublesSet">
                  <progress-bar-stats :clear="gamestats[game.id].doubles.clear" :total="gamestats[game.id].doubles.total" :name="'primary'" :type="$t('welcomeScreen.doubles')"></progress-bar-stats>
                </div>
                <div v-if="game.trackedGame.singleCourse">
                  <progress-bar-stats :clear="gamestats[game.id].courses.singleClear" :total="gamestats[game.id].courses.singleTotal" :name="'primary'" :type="$t('welcomeScreen.singleCourses')"></progress-bar-stats>
                </div>
                <div v-if="game.trackedGame.doubleCourse">
                  <progress-bar-stats :clear="gamestats[game.id].courses.doubleClear" :total="gamestats[game.id].courses.doubleTotal" :name="'primary'" :type="$t('welcomeScreen.doubleCourses')"></progress-bar-stats>
                </div>
              </div>
              <button class="btn btn-sm w-100 m-0 p-0 mt-1" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapseOne' + game.id.replace(/[+\[\-:]/g, '')" aria-expanded="true" aria-controls="collapseOne">
                {{ $t("welcomeScreen.seeInfo") }} <i class="fas fa-eye ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredGames.length > 0" class="col-12 my-4 text-center">
        <router-link :to="{ path: '/settings', query: { ID: 'game' } }" class="btn btn-block btn-secondary" type="button" role="button"><i class="fas fa-check-square"></i> {{ $t("welcomeScreen.selectGames") }}</router-link>
        <router-link to="/tips" class="btn btn-block btn-secondary ms-3" href="#" type="button" role="button"><i class="far fa-lightbulb"></i> {{ $t("welcomeScreen.tips") }}</router-link>
        <div id="emailHelp" class="form-text mt-3">{{ $t("welcomeScreen.findMore") }}</div>
      </div>
    </div>
  </div>
  <ShareModal
      @close="hideShareModal"
      :open="shareVisible"
      :url="shareUrl"
      :userID="userID"
  />
</template>

<script>
import ProgressBarStats from "@/components/UI/ProgressBarStats";
import ShareModal from "@/components/UI/ShareModal.vue";
export default {
  name: 'WelcomeScreen',
  components: {
    ProgressBarStats,
    ShareModal
  },
  data() {
    return {
      gamesToShow: [],
      userPassedSongs: [],
      gamestats: {},
      isDataLoaded: false,
      shareUrl: '',
      shareVisible: false,
    }
  },
  computed: {
    getGamePlaystyle(gameID) {
      return this.$store.getters['games/getGamePlayStyle'](gameID);
    },
    isUserNotLoaded() {
      const userName = this.$store.getters['userName'];
      if (userName !== undefined &&
          userName !== null &&
          userName !== '') {
        return false;
      } else {
        return true;
      }
    },
    filteredGames() {
      const trackedGames = this.trackedGames;
      if (trackedGames === undefined || trackedGames === null) {
        return [];
      }
      return this.games
        .filter(game => {
          const gameTrackInfo = trackedGames[game.id];
          return gameTrackInfo && Object.values(gameTrackInfo).includes(true);
        })
        .map(game => ({
          ...game,
          trackedGame: trackedGames[game.id],
        }));
    },
    trackedGames() {
      return this.$store.getters['getTrackGames'];
    },
    games() {
      return this.$store.getters['games/getGames'];
    },
    userName() {
      return this.$store.getters['userName'];
    },
    userID() {
      return this.$store.getters['userID'];
    },
    allArcadeCodes() {
      const arcadeCodes = [];
      if (this.arcadeCode01) {
        arcadeCodes.push(this.arcadeCode01);
      }
      if (this.arcadeCode02) {
        arcadeCodes.push(this.arcadeCode02);
      }
      if (this.arcadeCode03) {
        arcadeCodes.push(this.arcadeCode03);
      }
      return arcadeCodes;
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
    profileUrl() {
      return this.$store.getters['profileUrl'];
    },
  },
  methods: {
    showShare() {
      this.shareUrl = 'https://beatmania-pro.web.app/user/' + this.userID;
      this.shareVisible = true;
    },
    hideShareModal() {
      this.shareVisible = false;
    },
    getArcadeName(arcadeID) {
      return this.$store.getters['arcades/getArcadeName'](arcadeID);
    },
    setBaseStats() {
      for (const game of this.filteredGames) {
        this.gamestats[game.id] = {
          songs: 0,
          singles: {
            clear: 0,
            total: 0,
          },
          doubles: {
            clear: 0,
            total: 0,
          },
          courses: {
            clear: 0,
            total: 0,
            singleClear: 0,
            doubleClear: 0,
            singleTotal: 0,
            doubleTotal: 0,
          }
        }
      }
    },
    async calculateStats() {
      const userSongs = await this.$store.getters['getUserSongs'];
      const userCourses = await this.$store.getters['getUserCourses'];
      for (const item of this.filteredGames) {
        let singleCleared = 0;
        let doublesCleared = 0;
        let totalSingleCleared = 0;
        let totalDoublesCleared = 0;
        let totalSongs = 0;
        const songsToLoad = await this.$store.getters['songs/getSongsByGame'](item.id)
        for (const song of songsToLoad) {
          totalSongs++;
          const userSong = userSongs.find(userSong => userSong.id === song.id);
          if (userSong && song.difficultyNormal > 0) {
            if (userSong.normalClear) {
              singleCleared++;
            }
            totalSingleCleared++;
          } else if (song.difficultyNormal > 0) {
            totalSingleCleared++;
          }
          if (userSong && song.difficultyHard > 0) {
            if (userSong.hardClear) {
              singleCleared++;
            }
            totalSingleCleared++;
          } else if (song.difficultyHard > 0) {
            totalSingleCleared++;
          }
          if (userSong && song.difficultyAnother > 0) {
            if (userSong.anotherClear) {
              singleCleared++;
            }
            totalSingleCleared++;
          } else if (song.difficultyAnother > 0) {
            totalSingleCleared++;
          }
          if (userSong && song.difficultyDoubleNormal > 0) {
            if (userSong.normalDoubleClear) {
              doublesCleared++;
            }
            totalDoublesCleared++;
          } else if (song.difficultyDoubleNormal > 0) {
            totalDoublesCleared++;
          }
          if (userSong && song.difficultyDoubleHard > 0) {
            if (userSong.hardDoubleClear) {
              doublesCleared++;
            }
            totalDoublesCleared++;
          } else if (song.difficultyDoubleHard > 0) {
            totalDoublesCleared++;
          }
          if (userSong && song.difficultyDoubleAnother > 0) {
            if (userSong.anotherDoubleClear) {
              doublesCleared++;
            }
            totalDoublesCleared++;
          } else if (song.difficultyDoubleAnother > 0) {
            totalDoublesCleared++;
          }
        }

        let totalSingleCoursesCleared = 0;
        let singleCoursesCleared = 0;
        let totalDoubleCoursesCleared = 0;
        let doublesCoursesCleared = 0;
        let totalCourses = 0;
        const coursesToLoad = await this.$store.getters['courses/getCourseByGame'](item.id)
        for (const course of coursesToLoad) {
          totalCourses++
          if (course.type === 'singles') {
            totalSingleCoursesCleared++;
          } else {
            totalDoubleCoursesCleared++;
          }
          const userCourse = userCourses.find(userCourse => userCourse.id === course.id);
          if (userCourse) {
            if (course.type === 'singles') {
              if (userCourse.clear) {
                singleCoursesCleared++;
              }
            } else {
              if (userCourse.clear) {
                doublesCoursesCleared++;
              }
            }
          }
        }

        this.gamestats[item.id].singles.total = totalSingleCleared;
        this.gamestats[item.id].singles.clear = singleCleared;
        this.gamestats[item.id].doubles.total = totalDoublesCleared;
        this.gamestats[item.id].doubles.clear = doublesCleared;
        this.gamestats[item.id].courses.singleClear = singleCoursesCleared;
        this.gamestats[item.id].courses.doubleClear = doublesCoursesCleared;
        this.gamestats[item.id].courses.singleTotal = totalSingleCoursesCleared;
        this.gamestats[item.id].courses.doubleTotal = totalDoubleCoursesCleared;
        this.gamestats[item.id].courses.clear = singleCoursesCleared + doublesCoursesCleared;
        this.gamestats[item.id].courses.total = totalCourses;
        this.gamestats[item.id].songs = totalSongs;

        this.$store.dispatch('setUserStatsForGame', {
          game: item.id,
          singles: this.gamestats[item.id].singles.clear,
          doubles: this.gamestats[item.id].doubles.clear,
          courses: this.gamestats[item.id].courses.clear*5,
          total: this.gamestats[item.id].singles.clear + this.gamestats[item.id].doubles.clear + (this.gamestats[item.id].courses.clear*5),
        });
      }
    },
    setUserLoginDate() {
      const date = new Date();
      const listOfMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const today = date.getDate() + ' ' + listOfMonths[date.getMonth()] + ' ' + date.getFullYear();
      this.$store.dispatch('setUserLoginDate', today);
    },
    reload () {
      window.location.reload()
    },
  },
  async created() {
    await this.$store.dispatch('arcades/loadArcades');
    if (this.isUserNotLoaded) {
      console.log('created-welcome');
      await this.$store.dispatch('games/fetchGameSongs');
      await this.$store.dispatch('loadUser');
      await this.$store.dispatch('loadTrackedGames');

      const trackedGames = await this.$store.getters['getTrackGames'];
      const listOfGames = [];
      for (const game in trackedGames) {
        listOfGames.push(game);
      }
      await this.$store.dispatch('songs/getGameSongs', listOfGames);
      await this.$store.dispatch('courses/loadCourses');
      await this.$store.dispatch('loadUserCourses');
      await this.$store.dispatch('loadUserSongs');
      this.$i18n.locale = await this.$store.getters['getLanguage'];
    }
    await this.setBaseStats();
    await this.calculateStats();
    await this.setUserLoginDate();
    this.isDataLoaded = true;
  },
  props: {
    msg: String,
  },
  emits: ['select-view', 'loaded', 'data']
}
</script>

<style scoped>
  .float-left {
    float: left;
  }
  .float-right {
    float: right;
  }
  .img-thumbnail {
    border: 1px solid #000;
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 35px !important;
  }
  .text-white {
    color: #fff !important;
  }
  .icon {
    width: 30px;
    height: 30px;
    filter: invert(1);
    /* or to blue */
    filter: invert(0.7) sepia(1) saturate(0) hue-rotate(175deg);
    float: right;
  }
</style>