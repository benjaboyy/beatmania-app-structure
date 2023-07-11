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
            <input type="username" class="form-control" v-model="enteredName" id="username" aria-describedby="username">
          </div>
          <div class="mb-3">
            <label for="Select" class="form-label">
              Arcade code <router-link to="/tips" class="text-primary"><i class="fa fa-question-circle ms-2"></i> info</router-link>
            </label>
            <div class="row">
              <div class="col-12 col-md">
                <div class="input-group">
                  <input type="arcadecode01" :disabled="codeSet01" class="form-control" v-model="enteredAracdeCode01" id="arcadecode01" aria-describedby="arcadecode01" placeholder="Slot 1">
                  <router-link v-if="codeSet01" :to="'/arcade/'+enteredAracdeCode01" class="btn btn-primary"><i class="fa fa-link"></i></router-link>
                  <button v-if="codeSet01" @click="deleteFromArcade(enteredAracdeCode01)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                </div>
              </div>
              <div v-if="enteredAracdeCode01" class="col-12 col-md mt-2 mt-md-0">
                <div class="input-group">
                  <input type="arcadecode02" :disabled="codeSet02" class="form-control" v-model="enteredAracdeCode02" id="arcadecode02" aria-describedby="arcadecode02" placeholder="Slot 2">
                  <router-link v-if="codeSet02" :to="'/arcade/'+enteredAracdeCode02" class="btn btn-primary"><i class="fa fa-link"></i></router-link>
                  <button v-if="codeSet02" @click="deleteFromArcade(enteredAracdeCode02)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                </div>
              </div>
              <div v-if="enteredAracdeCode02 || enteredAracdeCode01" class="col-12 col-md mt-2 mt-md-0">
                <div class="input-group">
                  <input type="arcadecode03" :disabled="codeSet03" class="form-control" v-model="enteredAracdeCode03" id="arcadecode03" aria-describedby="arcadecode03" placeholder="Slot 3">
                  <router-link v-if="codeSet03" :to="'/arcade/'+enteredAracdeCode03" class="btn btn-primary"><i class="fa fa-link"></i></router-link>
                  <button v-if="codeSet03" @click="deleteFromArcade(enteredAracdeCode03)" class="btn btn-danger"><i class="fa fa-trash"></i></button>
                </div>
              </div>
            </div>
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
              <option selected>Flat</option>
              <option>Old-school</option>
            </select>
          </div>
          <button type="submit" @click="updateSettings" class="btn btn-primary"><i class="fa fa-save me-1"></i> Save</button>
          <button v-if="successUpdate" class="btn btn-success disabled"><i class="fa fa-check Reset me-1" ></i> Updated</button>
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
      enteredAracdeCode01: '',
      enteredAracdeCode02: '',
      enteredAracdeCode03: '',
      codeSet01: false,
      codeSet02: false,
      codeSet03: false,
      enteredTrackGames: {},
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
    }
  },
  computed: {
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
