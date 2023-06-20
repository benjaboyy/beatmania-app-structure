<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Account settings</h1>
    <div class="card">
      <div class="card-body">
        <div class="mt-3">
          <a class="btn btn-primary" @click="tab = 'details'" :class="tab === 'details' ? 'btn-primary' : 'btn-light'">Account Details</a>
          <a class="btn btn-primary" @click="tab = 'games'" :class="tab === 'games' ? 'btn-primary' : 'btn-light'">Game select</a>
        </div>
        <div v-if="tab === 'games' && games">
          <div id="emailHelp" class="form-text my-3">Choose the games you want to track.</div>
          <div v-for="game in games" v-bind:key="game" class="card mb-2">
            <div class="card-body card-mix--choices">
              <h5 class=" text-dark">{{ game.name }}<i class="icon icon-5k text-primary"></i></h5>
              <a class="btn btn-sm me-1 mb-1" type="button"
                 :class="{'bg-light text-primary': !enteredTrackGames[game.id].singles, 'bg-primary text-white': enteredTrackGames[game.id].singles}"
                 @click="updateTrackGames(game.id, 'singles', !enteredTrackGames[game.id].singles)">Single Play</a>
              <a class="btn btn-sm me-1 mb-1" type="button"
                 :class="{'bg-light text-primary': !enteredTrackGames[game.id].doubles, 'bg-primary text-white': enteredTrackGames[game.id].doubles}"
                 @click="updateTrackGames(game.id, 'doubles', !enteredTrackGames[game.id].doubles)">Double Play</a>
              <a class="btn btn-sm me-1 mb-1"
                 :class="{'bg-light text-primary': !enteredTrackGames[game.id].singleCourse, 'bg-primary text-white': enteredTrackGames[game.id].singleCourse}"
                 @click="updateTrackGames(game.id, 'singleCourse', !enteredTrackGames[game.id].singleCourse)">Single Courses</a>
              <a class="btn btn-sm me-1 mb-1" type="button"
                 :class="{'bg-light text-primary': !enteredTrackGames[game.id].doubleCourse, 'bg-primary text-white': enteredTrackGames[game.id].doubleCourse}"
                  @click="updateTrackGames(game.id, 'doubleCourse', !enteredTrackGames[game.id].doubleCourse)">Double Courses</a>
            </div>
          </div>
        </div>
        <div v-if="tab === 'details'">
          <div id="emailHelp" class="form-text my-3">Set your account information.</div>
          <div class="mb-3">
            <label for="Name" class="form-label">Game tag/ name</label>
            <input type="username" class="form-control" v-model="enteredName" id="exampleInputEmail1" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <label for="Select" class="form-label">
              Arcade code <router-link to="/tips" class="text-primary"><i class="fa fa-question-circle ms-2"></i> info</router-link>
            </label>
            <input type="arcadecode" class="form-control" v-model="enteredAracdeCode" id="exampleInputEmail1" aria-describedby="emailHelp">
          </div>
          <div class="mb-3">
            <label for="Select" class="form-label">Favorite Game</label>
            <select id="Select" class="form-select" placeholder="Choose" v-model="enteredFavoriteGame">
              <option v-for="game in games" v-bind:key="game">{{ game.name }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="Select" class="form-label">Select theme</label>
            <select id="Select" class="form-select" disabled>
              <option selected>Choose...</option>
            </select>
          </div>
          <button type="submit" @click="updateSettings" class="btn btn-primary"><i class="fa fa-save"></i> Save</button>
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
      enteredAracdeCode: '',
      enteredTrackGames: {},
    }
  },
  async created() {
    this.enteredFavoriteGame = this.favoriteGame;
    this.enteredName = this.userName;
    this.enteredAracdeCode = this.arcadeCode;
    await this.$store.dispatch('loadTrackedGames');
    await this.games.forEach(game => {
      this.enteredTrackGames[game.id] = {
        singles: false,
        doubles: false,
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
      if (option === 'singles') {
        this.enteredTrackGames[gameId].singles = value;
      } else if (option === 'doubles') {
        this.enteredTrackGames[gameId].doubles = value;
      } else if (option === 'singleCourse') {
        this.enteredTrackGames[gameId].singleCourse = value;
      } else if (option === 'doubleCourse') {
        this.enteredTrackGames[gameId].doubleCourse = value;
      }
      this.$store.dispatch('updateTrackGames', this.enteredTrackGames);
    },
    updateSettings() {
      this.$store.dispatch('updateSettings', {
        arcadeCode: this.enteredAracdeCode,
        favoriteGame: this.enteredFavoriteGame
      });
      this.$store.dispatch('updateUsername', this.enteredName);
    }
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
    arcadeCode() {
      return this.$store.getters['getArcadeCode'];
    },
    userName() {
      return this.$store.getters['userName'];
    }
  },
}
</script>
