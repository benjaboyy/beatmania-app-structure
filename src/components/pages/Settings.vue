<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Account settings</h1>
    <div class="card">
      <div class="card-body">
        <h3>Game select</h3>
        <div class="mt-3">
          <a class="btn btn-primary" @click="tab = 'details'" :class="tab === 'details' ? 'btn-primary' : 'btn-light'">Account Details</a>
          <a class="btn btn-primary" @click="tab = 'games'" :class="tab === 'games' ? 'btn-primary' : 'btn-light'">Game select</a>
        </div>
        <div v-if="tab === 'games'">
          <div id="emailHelp" class="form-text">Choose the games you want to track.</div>
          <div v-for="game in games" v-bind:key="game" class="card mb-2">
            <div class="card-body card-mix--choices">
              <h5 class=" text-dark">{{ game.name }}<i class="icon icon-5k text-primary"></i></h5>
              <a class="btn btn-sm me-1 mb-1" type="button"
                 :class="{'bg-light text-primary': !trackGames[game.id].singles, 'bg-primary text-white': trackGames[game.id].singles}"
                 @click="trackGames[game.id].singles = !trackGames[game.id].singles">Single Play</a>
              <a class="btn btn-sm me-1 mb-1" type="button"
                 :class="{'bg-light text-primary': !trackGames[game.id].doubles, 'bg-primary text-white': trackGames[game.id].doubles}"
                 @click="trackGames[game.id].doubles = !trackGames[game.id].doubles">Double Play</a>
              <a class="btn btn-sm me-1 mb-1" type="button"
                 :class="{'bg-light text-primary': !trackGames[game.id].singleCourse, 'bg-primary text-white': trackGames[game.id].singleCourse}"
                 @click="trackGames[game.id].singleCourse = !trackGames[game.id].singleCourse">Single Courses</a>
              <a class="btn btn-sm me-1 mb-1" type="button"
                 :class="{'bg-light text-primary': !trackGames[game.id].doubleCourse, 'bg-primary text-white': trackGames[game.id].doubleCourse}"
                 @click="trackGames[game.id].doubleCourse = !trackGames[game.id].doubleCourse">Double Courses</a>
            </div>
          </div>
        </div>
        <div v-if="tab === 'details'">
          <div id="emailHelp" class="form-text">Set your account information.</div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Game tag/ name</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <label for="Select" class="form-label">Favorite Game</label>
            <select id="Select" class="form-select">
              <option selected>Choose...</option>
              <option v-for="game in games" v-bind:key="game">{{ game.name }}</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsScreen',
  props: {
    msg: String
  },
  data() {
    return {
      tab: 'details',
      enteredFavoriteGame: '',
      enteredName: '',

    }
  },
  created() {
    console.log('created');
    console.log(this.games);
    console.log(this.trackGames);
  },
  computed: {
    games() {
      return this.$store.getters['games/getGames'];
    },
    trackGames() {
      return this.$store.getters['getTrackGames'];
    },
    favoriteGame() {
      return this.$store.getters['favoriteGame'];
    },
  },
}
</script>
