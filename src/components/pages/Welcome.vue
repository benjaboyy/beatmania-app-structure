<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Welcome DJ {{ userName }}</h1>
    <div class="card">
      <div class="card-body">
        <h3>Admin</h3>
        <router-link to="/submitSong" class="btn btn-light me-2 mb-2" href="#" type="button" role="button">Update Song</router-link>
        <router-link to="/submitGame" class="btn btn-light me-2 mb-2" href="#" type="button" role="button">Update Game</router-link>
        <router-link to="/submitCourse" class="btn btn-light me-2 mb-2" href="#" type="button" role="button">Update Course</router-link>
        <a class="btn-primary btn me-2 mb-2" @click="testToken" href="#" type="button" role="button">Update stats</a>
      </div>
    </div>
    <div class="row">
      <div v-for="game in games" v-bind:key="game" class="col-md-6 mt-4">
        <div class="card">
          <div class="card-body">
            <h3>{{ game.name }} <i class="icon icon-5k text-primary"></i></h3>
            <router-link :to="'/games/' + game.id" class="btn btn-primary me-2" href="#"><i class="fa fa-compact-disc"></i> Songlist</router-link>
            <router-link :to="'/g/course/' + game.id" class="btn btn-primary" href="#"><i class="fa fa-layer-group"></i> Courses</router-link>
            <p class="mb-1">Singles: <span class="text-primary">Total: </span>{{ gamestats[game.id].singles.clear }}/{{ gamestats[game.id].singles.total }}</p>
            <progress-bar-stats :clear="gamestats[game.id].singles.clear" :total="gamestats[game.id].singles.total" :name="'beginner'"></progress-bar-stats>
    <!--            <span>Doubles</span>-->
    <!--            <progress-bar-stats v-for="mode in game.doubleMode" v-bind:key="mode.id" :clear="mode.clear" :total="mode.total" :name="mode.name"></progress-bar-stats>-->
            <p class="mb-1">Cources: <span class="text-primary">Total: </span>{{ gamestats[game.id].courses.clear }}/{{ gamestats[game.id].courses.total }}</p>
            <progress-bar-stats :clear="gamestats[game.id].courses.clear" :total="gamestats[game.id].courses.total" :name="'primary'"></progress-bar-stats>
          </div>
          <div class="col-12 my-2 text-center">
    <!--            <router-link to="/settings" class="btn btn-lg btn-block btn-light" href="#" type="button" role="button">Select games in account settings</router-link>-->
            <div id="emailHelp" class="form-text">Find more games to track in your account settings.</div>
          </div>
        </div>
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
      gamesToTrack: [],
      userPassedSongs: [],
      gamestats: {}
    }
  },
  computed: {
    games() {
      return this.$store.getters['games/getGames'];
    },
    userName() {
      return this.$store.getters['userName'];
    }
  },
  methods: {
    setBaseStats() {
      for (const game of this.games) {
        this.gamestats[game.id] = {
          singles: {
            clear: 10,
            total: 10
          },
          courses: {
            clear: 10,
            total: 10
          }
        }
      }
    },
    async testToken() {
      await this.$store.dispatch('games/fetchGameSongs');
      await this.$store.dispatch('loadUser');
      await this.$store.dispatch('songs/loadSongs');
      await this.$store.dispatch('loadUserSongs');
      await this.calculateStats();
    },
    async calculateStats() {
      const userSongs = await this.$store.getters['getUserSongs'];
      for (const item of this.games) {
        let clearedSongs = 0;
        let totalSongs = 0;
        const songsToLoad = await this.$store.getters['songs/getSongsByGame'](item.id)
        for (const song of songsToLoad) {
          const userSong = userSongs.find(userSong => userSong.id === song.id);
          if (userSong && song.difficultyNormal > 0) {
            if (userSong.normalClear) {
              clearedSongs++;
            }
            totalSongs++;
          } else if (song.difficultyNormal > 0) {
            totalSongs++;
          }
          if (userSong && song.difficultyHard > 0) {
            if (userSong.hardClear) {
              clearedSongs++;
            }
            totalSongs++;
          } else if (song.difficultyHard > 0) {
            totalSongs++;
          }
          if (userSong && song.difficultyAnother > 0) {
            if (userSong.anotherClear) {
              clearedSongs++;
            }
            totalSongs++;
          } else if (song.difficultyAnother > 0) {
            totalSongs++;
          }
        }
        this.gamestats[item.id].singles.total = totalSongs;
        this.gamestats[item.id].singles.clear = clearedSongs;
      }
    }
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
