<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Welcome DJ {{ userName }}</h1>
    <div class="row">
      <div v-for="game in filteredGames" v-bind:key="game" class="col-md-6 mt-4">
        <div class="card">
          <div class="card-body">
            <span class="p-2 bg-dark text-white float-end"><strong>5K</strong></span>
            <h3><strong>{{ game.name }}</strong></h3>
            <div class="mb-2">
              <router-link :to="'/games/' + game.id" class="btn btn-primary me-2" href="#"><i class="fa fa-compact-disc"></i> Songlist</router-link>
              <router-link :to="'/g/course/' + game.id" class="btn btn-primary" href="#"><i class="fa fa-layer-group"></i> Courses</router-link>
            </div>
            <span class="text-primary">Songs: </span>{{ gamestats[game.id].songs }}<br>
            <span class="text-primary">System: </span>Arcade<br>
            <div v-if="game.trackedGame.singles">
              <p class="mb-1"><span class="text-primary">Singles: </span>{{ gamestats[game.id].singles.clear }}/{{ gamestats[game.id].singles.total }}</p>
              <progress-bar-stats :clear="gamestats[game.id].singles.clear" :total="gamestats[game.id].singles.total" :name="'primary'"></progress-bar-stats>
            </div>
            <div v-if="game.trackedGame.doubles">
              <p class="mb-1"><span class="text-primary">Doubles: </span>{{ gamestats[game.id].doubles.clear }}/{{ gamestats[game.id].doubles.total }}</p>
              <progress-bar-stats :clear="gamestats[game.id].doubles.clear" :total="gamestats[game.id].doubles.total" :name="'primary'"></progress-bar-stats>
            </div>
            <div v-if="game.trackedGame.singleCourse || game.trackedGame.doubleCourse">
              <p class="mb-1"><span class="text-primary">Cources:: </span>{{ gamestats[game.id].courses.clear }}/{{ gamestats[game.id].courses.total }}</p>
              <progress-bar-stats :clear="gamestats[game.id].courses.clear" :total="gamestats[game.id].courses.total" :name="'primary'"></progress-bar-stats>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 my-4 text-center">
        <router-link to="/settings" class="btn btn-block btn-secondary" href="#" type="button" role="button">Select games</router-link>
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
          courses: 0,
          singles: {
            clear: 0,
            total: 0,
          },
          doubles: {
            clear: 0,
            total: 0,
          },
          singleCourses: {
            clear: 1,
            total: 10
          },
          doubleCourses: {
            clear: 1,
            total: 10
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
        this.gamestats[item.id].singles.total = totalSingleCleared;
        this.gamestats[item.id].singles.clear = singleCleared;
        this.gamestats[item.id].doubles.total = totalDoublesCleared;
        this.gamestats[item.id].doubles.clear = doublesCleared;
        this.gamestats[item.id].songs = totalSongs;
      }
      for (const item of this.filteredGames) {
        let coursesCleared = 0;
        let totalCleared = 0;
        const coursesToLoad // get course by game
        for (course of coursesToLoad) {
          totalCleared++
          for (const song of songsToLoad) {
            totalSongs++;
            // fix this
            const userSong = userSongs.find(userSong => userSong.id === song.id);
            if (userSong && song.difficultyNormal > 0) {
              coursesCleared++;
            }
          }
        }
        console.log(userCourses + item)
      }
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
