<template>
  <div class="login-screen px-2 mx-auto">
    <h1 class="text-center my-4">Update Course</h1>
    <div class="card">
      <div class="card-body">
        <div v-if="submitted" class="alert alert-success" role="alert">
          Submitted! {{ this.lastSubmittedID }}
        </div>
        <form @submit.prevent="submitCourse">
          <label for="gameID">Choose game</label>
          <select class="form-select " v-model="gameID">
            <option class="dropdown-item" v-for="game in getGames" :key="game.id" :value="game.id">
              {{ game.name }}
            </option>
          </select>
          <div v-if="gameID !== ''">
            <div class="form-group">
              <label for="songName">Course Name</label>
              <input class="form-control" type="text" id="songName" v-model="enteredName" />
            </div>
            <div class="form-group">
              <label for="formControlRangeN">Course rating
                <span v-for="n in 5" :key="n"><i class="fa fa-star" :class="n <= enteredRating ? 'text-primary' : 'text-dark'"></i></span>
              </label>
              <input data- type="range" max="5" min="1" class="form-range col-12" id="formControlRangeN" v-model="enteredRating" />
            </div>
            <div v-for="(courseSong, index) in songIDs" :key="index">
              <label for="songName">Song {{ index + 1 }}</label>
              <div class="input-group mb-2">
                <select class="form-select " v-model="songIDs[index]">
                  <option class="dropdown-item " v-for="song in songList" :key="song.id" :value="song.id">
                    {{ song.name }}
                  </option>
                </select>
                <a class="btn btn-light text-danger" @click="deleteSong(index)"><i class="fa fa-trash-alt"></i></a>
              </div>
            </div>
            <a class="btn btn-primary" @click="addSong('songIDs')">Add Song</a>
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
      songIDs: [],
      gameID: "",
      CourseID: "",
      enteredName: "",
      enteredRating: 1,
      invalidInput: false,
      error: null,
      submitted: false,
      gameChoises: [],
      lastSubmittedID: '',
      songList: [],
      courseUpdate: false,
    }
  },
  methods: {
    submitCourse() {
      this.invalidInput = false;
      this.error = null;
      if (this.enteredName.trim().length <= 0) {
        this.invalidInput = true;
        return;
      }
      const course = {
        name: this.enteredName,
        songIDs: this.songIDs,
        gameID: this.gameID,
      };
      const token = this.$store.getters.token;
      let CourseID = '';
      if (this.courseUpdate === false) {
        CourseID = this.enteredName.trim().replace(/\s/g, '');
      } else {
        CourseID = this.CourseID;
      }
      const gameID = this.gameID;
      fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/courses/${gameID}/${CourseID}.json?auth=${token}`, {
        method: 'PUT',
        body: JSON.stringify(course)
      })
        .then(res => {
          this.submitted = true;
          this.lastSubmittedID = res.name;
          this.enteredName = '';
          this.enteredRating = 1;
          this.songIDs = [];
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    addSong(toUpdate) {
      this[toUpdate].push('');
    },
    deleteSong(index) {
      this.songIDs.splice(index, 1);
    },
    setNumber(num) {
      if (num < 1) {
        return "not set";
      } else {
        return num;
      }
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
        };
        songs.push(song);
      }
      this.songList = songs;
    },
  },
  computed: {
    getGames() {
      return this.$store.getters["games/getGames"];
    },
    displayEnteredRating() {
      return this.setNumber(this.enteredRating);
    },
  },
  watch: {
    gameID() {
      this.getGameSongs();
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-top: 13px;
}
</style>