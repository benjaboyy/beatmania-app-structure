<template>
  <div class="login-screen px-2 mx-auto">
    <h1 class="text-center my-4">Submit Song</h1>
    <div class="card">
      <div class="card-body">
        <div v-if="submitted" class="alert alert-success" role="alert">
          Submitted! {{ this.lastSubmittedID }}
        </div>
        <form @submit.prevent="submitSong">
          <div class="form-group">
            <label for="songName">Song Name</label>
            <input class="form-control" type="text" id="songName" v-model="enteredName" />
          </div>
          <div class="form-group">
            <label for="songArtist">Song Artist</label>
            <input class="form-control" type="text" id="songArtist" v-model="enteredArtist" />
          </div>
          <div class="form-group">
            <label for="formControlRangeN">Normal Difficulty {{ displayEnteredDifficultyNormal }}</label>
            <input data- type="range" max="9" min="0" class="form-control-range col-12" id="formControlRangeN" v-model="enteredDifficultyNormal" />
          </div>
          <div class="form-group">
            <label for="formControlRangeH">Hard Difficulty {{ displayEnteredDifficultyHard }}</label>
            <input type="range" max="9" min="0" class="form-control-range col-12" id="formControlRangeH" v-model="enteredDifficultyHard" />
          </div>
          <div class="form-group">
            <label for="formControlRangeA">Another Difficulty {{ displayEnteredDifficultyAnother }}</label>
            <input type="range" max="9" min="0" class="form-control-range col-12" id="formControlRangeA" v-model="enteredDifficultyAnother" />
          </div>
          <h5 class="mt-4">Game(s) the song is in</h5>
          <div class="form-group" v-for="game in getGames" :key="game.id">
            <input type="checkbox" id="gameSelect" value=" {{ game.id }}" v-model="selectedGames">
            <label class="form-check-label" for="bmFirstMix"> {{ game.name }}</label><br>
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

  name: "submitSong",
  data() {
    return {
      songID: "",
      enteredName: "",
      enteredArtist: "",
      enteredDifficultyNormal: 1,
      enteredDifficultyHard: 1,
      enteredDifficultyAnother: 1,
      selectedGames: [],
      invalidInput: false,
      error: null,
      submitted: false,
      lastSubmittedID: '',
    }
  },
  methods: {
    submitSong() {
      this.invalidInput = false;
      this.error = null;
      const SongID = this.songIDRandom;
      const token = this.$store.getters.token;
      fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/songs/${SongID}.json?auth=${token}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: SongID,
          name: this.enteredName,
          artist: this.enteredArtist,
          difficultyNormal: this.enteredDifficultyNormal,
          difficultyHard: this.enteredDifficultyHard,
          difficultyAnother: this.enteredDifficultyAnother,
        })
      }).then((response) => {
        if (response.ok) {
          this.lastSubmittedID = SongID;
          this.submitted = true;
          this.enteredName = "";
          this.enteredArtist = "";
          this.enteredDifficultyNormal = 1;
          this.enteredDifficultyHard = 1;
          this.enteredDifficultyAnother = 1;
          return response.json();
        } else {
          throw new Error('Something went wrong!');
        }
      }).then((data) => {
        console.log(data);
      })
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
      return this.enteredArtist.trim().replace(/\s/g, '') + Math.floor(Math.random() * 9999);
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
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-top: 13px;
}
</style>