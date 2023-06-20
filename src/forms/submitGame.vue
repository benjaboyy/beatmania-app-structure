<template>
  <div class="login-screen px-2 mx-auto">
    <h1 class="text-center my-4">Update  Games
      <router-link to="/admin" class="btn btn-secondary ms-3" href="#" type="button" role="button"><i class="fa fa-arrow-left"></i> Back</router-link>
    </h1>
    <div class="card">
      <div class="card-body">
        <div v-if="submitted" class="alert alert-success" role="alert">
          Submitted!
        </div>
        <form @submit.prevent="submitGame">
          <label for="gameID">Choose game to update</label>
          <div class="dropdown">
            <select class="form-select " v-model="gameID">
              <option class="dropdown-item" v-for="game in gameChoises" :key="game.id" :value="game.id">
                {{ game.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="gameName">Game Name</label>
            <input class="form-control" type="text" id="gameName" v-model="enteredName" />
          </div>
          <div class="form-group">
            <label for="gameName">Logo Url</label>
            <input class="form-control" type="text" id="gameName" v-model="enteredUrl" />
          </div>
          <div class="form-group">
            <label for="gameType">Game Type</label>
            <div class="dropdown">
              <select class="form-select " v-model="enteredPlayStyle">
                <option class="dropdown-item" v-for="type in playStyles" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>

          <router-link to="/submitSong" class="btn btn-primary mt-3">Manage songs</router-link>

          <div class="form-group">
            <label for="songID">Song courses ID's</label>
            <div class="row">
              <span class="col-6 col-sm-4 col-md-2" v-for="(song, index) in songIDsEnteredCourses" :key="index">
                <input class="form-control mb-2" type="text" id="songID" v-model="songIDsEnteredCourses[index]" />
              </span>
            </div>
            <a class="btn btn-primary" @click="addSong('songIDsEnteredCourses')">Add Song</a>
          </div>

          <p v-if="invalidInput">One or more input fields are invalid. Please check your provided data.</p>
          <p v-if="error">{{ error }}</p>
          <hr>
          <div class="form-group">
            <button class="btn btn-primary"><i class="fa fa-paper-plane"></i> Submit</button>
            <router-link to="/" class="btn btn-outline-primary ms-3" href="#" type="button" role="button"><i class="fa fa-home"></i> Back</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "submitGame",
  data() {
    return {
      gameID: "",
      enteredName: "",
      enteredUrl: "",
      songIDsEnteredCourses: [],
      iconChoice: "",
      invalidInput: false,
      error: null,
      enteredPlayStyle: "",
      playStyles: ['Beatmania', 'Beatmania III'],
      submitted: false,
      gameChoises: [],
    }
  },
  methods: {
    addSong(toUpdate) {
      this[toUpdate].push('');
    },
    submitGame() {
      this.invalidInput = false;
      this.error = null;
      let gameID = this.gameID;
      if (!this.gameID) {
        gameID = this.enteredName.trim().toLowerCase().replace(/\s/g, '');
      } else {
        gameID = this.gameID;
      }
      const token = this.$store.getters.token;
      fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/games/${gameID}.json?auth=${token}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: gameID,
          name: this.enteredName,
          url: this.enteredUrl,
          playStyle: this.enteredPlayStyle,
          courseSongs: this.songIDsEnteredCourses,
        })
      }).then(res => {
        if (res.ok) {
          this.submitted = true;
          this.enteredName = "";
          this.enteredUrl = "";
          this.enteredArtist = "";
          this.songIDsEnteredCourses = [];
          this.iconChoice = "";
          this.enteredPlayStyle = "";
          this.gameID = "";
        } else {
          return res.json().then(data => {
            let errorMessage = 'Authentication failed!';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      }).catch(err => {
        this.error = err.message;
      });
    }
  },
  async created() {
    const getGames = await this.$store.getters['games/getGames'];
    this.gameChoises = getGames;
  },
  watch: {
    gameID: function (val) {
      this.gameChoises.forEach(game => {
        if (game.id === val) {
          this.enteredName = game.name;
          this.enteredUrl = game.url;
          this.enteredArtist = game.artist;
          this.enteredPlayStyle = game.playStyle;
          this.songIDsEnteredCourses = game.courseSongs;
        }
      });
    }
  },
}
</script>

<style scoped>
  .form-group {
    margin-top: 13px;
  }
</style>