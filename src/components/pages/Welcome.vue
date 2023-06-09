<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Welcome DJ {{ userName }}</h1>
    <div class="row">
      <div v-if="filteredGames < 1" class="col-12 my-4 text-center">
        <a class="btn btn-primary" @click="reload" href="#" type="button" role="button"><i class="fas fa-spin fa-redo me-2"></i> Reload</a>
        <div id="reloadHelp" class="form-text mt-3">If you have just added games to your account, click reload.</div>
      </div>
      <div v-for="game in filteredGames" v-bind:key="game" class="col-md-6 mt-4 m-auto">
        <div class="card">
          <div class="card-body">
            <span class="p-2 bg-dark text-white float-end"><strong>5K</strong></span>
            <h3><strong>{{ game.name }}</strong></h3>
            <div class="mb-2">
              <router-link :to="'/games/' + game.id" class="btn btn-primary me-2" href="#"><i class="fa fa-compact-disc"></i> Songlist</router-link>
              <router-link :to="'/g/course/' + game.id" class="btn btn-primary" href="#"><i class="fa fa-layer-group"></i> Courses</router-link>
            </div>
            <span class="text-primary">Songs: </span>{{ gamestats[game.id].songs }}<br>
            <span class="text-primary">System: </span>Arcade
            <hr class="my-2 border-primary">
            <div v-if="game.trackedGame.singles">
              <p class="my-1"><span class="text-primary">Singles: </span>{{ gamestats[game.id].singles.clear }}/{{ gamestats[game.id].singles.total }}</p>
              <progress-bar-stats :clear="gamestats[game.id].singles.clear" :total="gamestats[game.id].singles.total" :name="'primary'"></progress-bar-stats>
            </div>
            <div v-if="game.trackedGame.doubles">
              <p class="my-1"><span class="text-primary">Doubles: </span>{{ gamestats[game.id].doubles.clear }}/{{ gamestats[game.id].doubles.total }}</p>
              <progress-bar-stats :clear="gamestats[game.id].doubles.clear" :total="gamestats[game.id].doubles.total" :name="'primary'"></progress-bar-stats>
            </div>
            <div v-if="game.trackedGame.singleCourse">
              <p class="my-1"><span class="text-primary">Single Courses: </span>{{ gamestats[game.id].courses.singleClear }}/{{ gamestats[game.id].courses.singleTotal }}</p>
              <progress-bar-stats :clear="gamestats[game.id].courses.singleClear" :total="gamestats[game.id].courses.singleTotal" :name="'primary'"></progress-bar-stats>
            </div>
            <div v-if="game.trackedGame.doubleCourse">
              <p class="my-1"><span class="text-primary">Double Courses: </span>{{ gamestats[game.id].courses.doubleClear }}/{{ gamestats[game.id].courses.doubleTotal }}</p>
              <progress-bar-stats :clear="gamestats[game.id].courses.doubleClear" :total="gamestats[game.id].courses.doubleTotal" :name="'primary'"></progress-bar-stats>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 my-4 text-center">
        <router-link :to="{ path: '/settings', query: { ID: 'game' } }" class="btn btn-block btn-secondary" type="button" role="button"><i class="fas fa-check-square"></i> Select games</router-link>
        <router-link to="/tips" class="btn btn-block btn-secondary ms-3" href="#" type="button" role="button"><i class="far fa-lightbulb"></i> See tips</router-link>
        <div id="emailHelp" class="form-text mt-3">Find more games to track in your account settings.</div>
      </div>

    </div>
  </div>
</template>

<script>
import ProgressBarStats from "@/components/UI/ProgressBarStats";
export default {
  name: 'WelcomeScreen',
  components: {
    ProgressBarStats
  },
  data() {
    return {
      gamesToShow: [],
      userPassedSongs: [],
      gamestats: {}
    }
  },
  computed: {
    filteredGames() {
      const trackedGames = this.trackedGames;
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
  },
  methods: {
    setBaseStats() {
      for (const game of this.games) {
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
            clear: 1,
            total: 10,
            singleClear: 0,
            doubleClear: 0,
            singleTotal: 0,
            doubleTotal: 0,
          }
        }
      }
    },
    async testToken() {
      await this.$store.dispatch('games/fetchGameSongs');
      await this.$store.dispatch('loadUser');
      await this.$store.dispatch('songs/loadSongs');
      await this.$store.dispatch('courses/loadCourses');
      await this.$store.dispatch('loadUserSongs');
      await this.$store.dispatch('loadUserCourses');
      await this.calculateStats();
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
          courses: this.gamestats[item.id].courses.clear,
          total: this.gamestats[item.id].singles.clear + this.gamestats[item.id].doubles.clear + (this.gamestats[item.id].courses.clear*5),
        });
      }
    },
    reload () {
      window.location.reload()
    },
  },
  created() {
    this.setBaseStats();
    this.calculateStats();
  },
  props: {
    msg: String,
  },
  emits: ['select-view']
}
</script>
