<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Welcome {{ userName }}</h1>
    <div class="card">
      <div class="card-body">
        <h3>Admin</h3>
        <router-link to="/submitSong" class="btn btn-light me-2 mb-2" href="#" type="button" role="button">Submit Song</router-link>
        <router-link to="/submitGame" class="btn btn-light me-2 mb-2" href="#" type="button" role="button">Update Game</router-link>
        <a class="btn-primary btn me-2 mb-2" @click="testToken" href="#" type="button" role="button">Reset Data</a>
        <div class="row">
          <div v-for="game in games" v-bind:key="game" class="col-md-6 mt-4">
            <router-link :to="'/games/' + game.id" class="btn btn-primary float-end" href="#">Go to game</router-link>
            <h3>{{ game.name }} <i class="icon icon-5k text-primary"></i></h3>
            <p class="mb-1">Singles: <span class="text-primary">Total: </span></p>{{ game.clear }}/{{ game.total }}
            <progress-bar-stats :clear="game.clear" :total="game.total" :name="game.name"></progress-bar-stats>
<!--            <span>Doubles</span>-->
<!--            <progress-bar-stats v-for="mode in game.doubleMode" v-bind:key="mode.id" :clear="mode.clear" :total="mode.total" :name="mode.name">-->
<!--              {{ mode.clear }}/{{ mode.total }}-->
<!--            </progress-bar-stats>-->
<!--            <span>Courses</span>-->
<!--            <progress-bar-stats class="mb-2" v-for="mode in game.courses" v-bind:key="mode.id" :clear="mode.clear" :total="mode.total" :name="mode.name">-->
<!--              {{ mode.name }}: {{ mode.clear }}/{{ mode.total }}-->
<!--            </progress-bar-stats>-->
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
      gameID: 1,
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
    async testToken() {
      await this.$store.dispatch('games/fetchGameSongs');
      await this.$store.dispatch('loadUser');
      await this.$store.dispatch('songs/loadSongs');
      await this.$store.dispatch('loadUserSongs');
    }
  },

  props: {
    msg: String,
  },
  emits: ['select-view']
}
</script>
