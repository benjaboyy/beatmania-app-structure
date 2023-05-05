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
            <div class="mt-3">
              <a class="btn btn-primary" @click="courseUpdateSwitch" :class="courseUpdate === false ? 'btn-primary' : 'btn-light'">New</a>
              <a class="btn btn-primary" @click="courseUpdateSwitch" :class="courseUpdate === true ? 'btn-primary' : 'btn-light'">Update</a>
              <a v-if="isSongName" class="btn btn-outline-primary ms-3" @click="reset"><i class="fa fa-sync-alt"></i> Reset</a>
            </div>
            <div v-if="!courseUpdate">
              <div class="form-group">
                <label for="songName">Course Name</label>
                <input class="form-control" type="text" id="songName" v-model="enteredName" />
              </div>
              <div class="form-group">
                <label for="formControlRangeN">Course rating <h3>
                  <span v-for="n in 5" :key="n"><i class="fa fa-star" :class="n <= enteredRating ? 'text-primary' : 'text-light'"></i></span></h3>
                </label>
                <input data- type="range" max="5" min="1" class="form-range col-12" id="formControlRangeN" v-model="enteredRating" />
              </div>
              <div v-for="(courseSong, index) in songIDs" :key="index">
                <label for="songName">Song {{ index + 1 }}</label>
                <div class="input-group mb-0">
                  <select class="form-select " v-model="songIDs[index]">
                    <option class="dropdown-item " v-for="song in songList" :key="song.id" :value="song">
                      {{ song }}
                    </option>
                  </select>
                </div>
                <div class="mb-2">
                  <a class="btn btn-light w-25" :class="{ 'btn-primary':songIDs[index].diff === 'difficultyNormal' }" @click="setDifficulty(index, 'difficultyNormal')">S{{ songIDs[index].difficultyNormal }}</a>
                  <a class="btn btn-light w-25" :class="{ 'btn-primary':songIDs[index].diff === 'difficultyHard' }"  @click="setDifficulty(index, 'difficultyHard')">S{{ songIDs[index].difficultyHard }}</a>
                  <a class="btn btn-light w-25" :class="{ 'btn-primary':songIDs[index].diff === 'difficultyAnother' }" @click="setDifficulty(index, 'difficultyAnother')">S{{ songIDs[index].difficultyAnother }}</a>
                  <a class="btn btn-light w-25" :class="{ 'btn-primary':songIDs[index].diff === 'difficultyDoubleNormal' }" @click="setDifficulty(index, 'difficultyDoubleNormal')">D{{ songIDs[index].difficultyDoubleNormal }}</a>
                  <a class="btn btn-light w-25" :class="{ 'btn-primary':songIDs[index].diff === 'difficultyDoubleHard' }" @click="setDifficulty(index, 'difficultyDoubleHard')">D{{ songIDs[index].difficultyDoubleHard }}</a>
                  <a class="btn btn-light w-25" :class="{ 'btn-primary':songIDs[index].diff === 'difficultyDoubleAnother' }" @click="setDifficulty(index, 'difficultyDoubleAnother')">D{{ songIDs[index].difficultyDoubleAnother }}</a>
                  <a class="btn btn-light text-danger w-25" @click="deleteSong(index)"><i class="fa fa-trash-alt"></i></a>
                </div>
              </div>
              <a class="btn btn-primary" @click="addSong('songIDs')">Add Song</a>
              <p v-if="invalidInput">One or more input fields are invalid. Please check your provided data.</p>
              <p v-if="error">{{ error }}</p>
              <div class="form-group" v-if="enteredName.trim().length > 0">
                <hr>
                <button class="btn btn-primary"><i class="fa fa-paper-plane"></i> Submit</button>
                <router-link to="/" class="btn btn-outline-primary ms-3" href="#" type="button" role="button"><i class="fa fa-home"></i> Back</router-link>
              </div>
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
      type: 'singles'
    }
  },
  methods: {
    courseUpdateSwitch() {
      this.courseUpdate = !this.courseUpdate;
      if (this.courseUpdate === false) {
        this.reset();
      }
    },
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
        rating: this.enteredRating,
        type: this.type,
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
      this[toUpdate].push({
        id: '',
        diff: '',
        difficultyNormal: '-',
        difficultyHard: '-',
        difficultyAnother: '-',
        difficultyDoubleNormal: '-',
        difficultyDoubleHard: '-',
        difficultyDoubleAnother: '-',
      });
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
    setDifficulty(index, difficulty) {
      this.songIDs[index].diff = difficulty;
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
  },
  computed: {
    getGames() {
      return this.$store.getters["games/getGames"];
    },
    displayEnteredRating() {
      return this.setNumber(this.enteredRating);
    },
    isSongName() {
      if (this.enteredName === "") {
        return false;
      } else {
        return true;
      }
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