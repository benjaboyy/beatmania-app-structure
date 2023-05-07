<template>
  <div class="login-screen px-2 mx-auto">
    <h1 class="text-center my-4">Submit or update Song</h1>
    <div class="card">
      <div class="card-body">
        <div v-if="submitted" class="alert alert-success" role="alert">
          Submitted! {{ this.lastSubmittedID }}
        </div>
        <form @submit.prevent="submitSong">
          <label for="gameID">Choose game</label>
          <select class="form-select " v-model="gameID">
            <option class="dropdown-item" v-for="game in gameChoises" :key="game.id" :value="game.id">
              {{ game.name }}
            </option>
          </select>
          <div v-if="isGameSelected">
            <div class="mt-3">
              <a class="btn btn-primary" @click="songUpdateSwitch" :class="songUpdate === false ? 'btn-primary' : 'btn-light'">New</a>
              <a class="btn btn-primary" @click="songUpdateSwitch" :class="songUpdate === true ? 'btn-primary' : 'btn-light'">Update</a>
              <a v-if="isSongName" class="btn btn-outline-primary ms-3" @click="reset"><i class="fa fa-sync-alt"></i> Reset</a>
            </div>
            <div v-if="!songUpdate">
              <div class="form-group">
                <label for="songName">Song Name</label>
                <input class="form-control" type="text" id="songName" v-model="enteredName" />
              </div>
            </div>
              <div v-else class="form-group">
                <label for="songName">Choose song</label>
                <div class="input-group mb-3">
                  <select class="form-select " v-model="songID">
                    <option class="dropdown-item " v-for="song in songList" :key="song.id" :value="song.id">
                      {{ song.name }}
                    </option>
                  </select>
                  <a v-if="isSongID" class="btn btn-light text-danger" @click="deleteSong"><i class="fa fa-trash-alt"></i></a>
                  <a v-else class="btn btn-light text-dark disabled" @click="deleteSong"><i class="fa fa-trash-alt"></i></a>
                </div>
              </div>
            <div class="form-group">
              <label for="songArtist">Artist/ Alias</label>
              <input class="form-control" type="text" id="songArtist" v-model="enteredArtist" />
            </div>
            <div class="form-group">
              <label for="songArtist">Composer</label>
              <input class="form-control" type="text" id="songArtist" v-model="enteredComposer" />
            </div>
            <h5 class="mt-4">Difficulty Single</h5>
            <div class="form-group">
              <label for="formControlRangeN">Normal Difficulty {{ displayEnteredDifficultyNormal }}</label>
              <input data- type="range" max="9" min="0" class="form-range col-12" id="formControlRangeN" v-model="enteredDifficultyNormal" />
            </div>
            <div class="form-group">
              <label for="formControlRangeH">Hard Difficulty {{ displayEnteredDifficultyHard }}</label>
              <input type="range" max="9" min="0" class="form-range col-12" id="formControlRangeH" v-model="enteredDifficultyHard" />
            </div>
            <div class="form-group">
              <label for="formControlRangeA">Another Difficulty {{ displayEnteredDifficultyAnother }}</label>
              <input type="range" max="9" min="0" class="form-range col-12" id="formControlRangeA" v-model="enteredDifficultyAnother" />
            </div>
            <h5 class="mt-4">Difficulty Double</h5>
            <div class="form-group">
              <label for="formControlRangeDN">Normal Difficulty {{ displayEnteredDifficultyDoubleNormal }}</label>
              <input type="range" max="9" min="0" class="form-range col-12" id="formControlRangeDN" v-model="enteredDifficultyDoubleNormal" />
            </div>
            <div class="form-group">
              <label for="formControlRangeDH">Hard Difficulty {{ displayEnteredDifficultyDoubleHard }}</label>
              <input type="range" max="9" min="0" class="form-range col-12" id="formControlRangeDH" v-model="enteredDifficultyDoubleHard" />
            </div>
            <div class="form-group">
              <label for="formControlRangeDA">Another Difficulty {{ displayEnteredDifficultyDoubleAnother }}</label>
              <input type="range" max="9" min="0" class="form-range col-12" id="formControlRangeDA" v-model="enteredDifficultyDoubleAnother" />
            </div>
            <p v-if="invalidInput">One or more input fields are invalid. Please check your provided data.</p>
            <p v-if="error">{{ error }}</p>
            <hr>
            <div class="form-group">
              <button class="btn btn-primary"><i class="fa fa-paper-plane"></i> Submit</button>
              <router-link to="/" class="btn btn-outline-primary ms-3" href="#" type="button" role="button"><i class="fa fa-home"></i> Back</router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: "submitSong",
  data() {
    return {
      songID: "",
      gameID: "",
      songUpdate: false,
      enteredName: "",
      enteredArtist: "",
      enteredComposer: "",
      enteredDifficultyNormal: 1,
      enteredDifficultyHard: 1,
      enteredDifficultyAnother: 1,
      enteredDifficultyDoubleNormal: 1,
      enteredDifficultyDoubleHard: 1,
      enteredDifficultyDoubleAnother: 1,
      selectedGames: [],
      invalidInput: false,
      error: null,
      submitted: false,
      lastSubmittedID: '',
      gameChoises: [],
      songList: [],
    }
  },
  async created() {
    const getGames = this.getGames;
    this.gameChoises = getGames;
    const songID = this.$route.query.songID;
    const gameID = this.$route.query.gameID;
    if (gameID) {
      this.gameID = gameID;
    }
    if (songID) {
      this.songID = songID;
      this.songUpdate = true;
    }
  },
  watch: {
    gameID: function (val) {
      this.getGameSongs(val);
    },
    songID: function (val) {
      this.songList.forEach(game => {
        if (game.id === val) {
          this.enteredName = game.name;
          this.enteredArtist = game.artist;
          this.enteredDifficultyNormal = game.difficultyNormal;
          this.enteredDifficultyHard = game.difficultyHard;
          this.enteredDifficultyAnother = game.difficultyAnother;
          this.enteredDifficultyDoubleNormal = game.difficultyDoubleNormal;
          this.enteredDifficultyDoubleHard = game.difficultyDoubleHard;
          this.enteredDifficultyDoubleAnother = game.difficultyDoubleAnother;
        }
      });
    }
  },
  methods: {
    reset() {
      this.enteredName = "";
      this.enteredArtist = "";
      this.enteredDifficultyNormal = 1;
      this.enteredDifficultyHard = 1;
      this.enteredDifficultyAnother = 1;
      this.enteredDifficultyDoubleNormal = 1;
      this.enteredDifficultyDoubleHard = 1;
      this.enteredDifficultyDoubleAnother = 1;
      this.songID = "";
      this.songUpdate = false;
      this.invalidInput = false;
      this.error = null;
      this.submitted = false;
      this.lastSubmittedID = '';
    },
    deleteSong() {
      const token = this.$store.getters.token;
      const gameID = this.gameID;
      const songID = this.songID;
      if (songID === "" || gameID === "") {
        return;
      }
      fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/songs/${gameID}/${songID}.json?auth=${token}`, {
        method: 'DELETE',
      }).then(res => {
        if (res.ok) {
          this.reset();
        }
      });
    },
    songUpdateSwitch() {
      this.songUpdate = !this.songUpdate;
      if (this.songUpdate === false) {
        this.reset();
      }
    },
    submitSong() {
      this.invalidInput = false;
      this.error = null;
      let SongID = "";
      if (this.songUpdate === false) {
        SongID = this.songIDRandom;
      } else {
        SongID = this.songID;
      }
      const token = this.$store.getters.token;
      const gameID = this.gameID;
      fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/songs/${gameID}/${SongID}.json?auth=${token}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: SongID,
          name: this.enteredName,
          artist: this.enteredArtist,
          composer: this.enteredComposer,
          difficultyNormal: this.enteredDifficultyNormal,
          difficultyHard: this.enteredDifficultyHard,
          difficultyAnother: this.enteredDifficultyAnother,
          difficultyDoubleNormal: this.enteredDifficultyDoubleNormal,
          difficultyDoubleHard: this.enteredDifficultyDoubleHard,
          difficultyDoubleAnother: this.enteredDifficultyDoubleAnother,
        })
      }).then((response) => {
        if (response.ok) {
          this.lastSubmittedID = SongID;
          this.submitted = true;
          this.enteredName = "";
          this.enteredArtist = "";
          this.enteredComposer = "";
          this.enteredDifficultyNormal = 1;
          this.enteredDifficultyHard = 1;
          this.enteredDifficultyAnother = 1;
          this.enteredDifficultyDoubleNormal = 1;
          this.enteredDifficultyDoubleHard = 1;
          this.enteredDifficultyDoubleAnother = 1;
          this.songID = "";
          this.songUpdate = false;
          this.invalidInput = false;
          this.error = null;
          window.scrollTo(0,0);
          return response.json();
        } else {
          throw new Error('Something went wrong!');
        }
      }).then((data) => {
        console.log(data);
      })
    },
    async getGameSongs() {
      const token = this.$store.getters.token;
      const gameID = this.gameID;
      const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/songs/${gameID}.json?auth=${token}`);
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(responseData.message || 'Failed to fetch!');
        throw error;
      }
      const songs = [];
      for (const key in responseData) {
        const song = {
          id: responseData[key].id,
          name: responseData[key].name,
          artist: responseData[key].artist,
          composer: responseData[key].composer,
          difficultyNormal: responseData[key].difficultyNormal,
          difficultyHard: responseData[key].difficultyHard,
          difficultyAnother: responseData[key].difficultyAnother,
          difficultyDoubleNormal: responseData[key].difficultyDoubleNormal,
          difficultyDoubleHard: responseData[key].difficultyDoubleHard,
          difficultyDoubleAnother: responseData[key].difficultyDoubleAnother,
        };
        songs.push(song);
      }
      this.songList = songs;
    },
    setNumber(num) {
      if (num < 1) {
        return "not set";
      } else {
        return num;
      }
    }
  },
  computed: {
    songIDRandom() {
      return this.enteredArtist.trim().replace(/[^\w\s]/g, '') + Math.floor(Math.random() * 9999);
    },
    getGames() {
      return this.$store.getters["games/getGames"];
    },
    displayEnteredDifficultyNormal() {
      return this.setNumber(this.enteredDifficultyNormal);
    },
    displayEnteredDifficultyHard() {
      return this.setNumber(this.enteredDifficultyHard);
    },
    displayEnteredDifficultyAnother() {
      return this.setNumber(this.enteredDifficultyAnother);
    },
    displayEnteredDifficultyDoubleNormal() {
      return this.setNumber(this.enteredDifficultyDoubleNormal);
    },
    displayEnteredDifficultyDoubleHard() {
      return this.setNumber(this.enteredDifficultyDoubleHard);
    },
    displayEnteredDifficultyDoubleAnother() {
      return this.setNumber(this.enteredDifficultyDoubleAnother);
    },
    isSongID() {
      if (this.songID === "") {
        return false;
      } else {
        return true;
      }
    },
    isSongName() {
      if (this.enteredName === "") {
        return false;
      } else {
        return true;
      }
    },
    isGameSelected() {
      if (this.gameID === "") {
        return false;
      } else {
        return true;
      }
    },
  }
}
</script>

<style scoped>
.form-group {
  margin-top: 13px;
}
</style>