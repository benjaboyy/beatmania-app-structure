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
            </div>
            <div v-else class="form-group">
              <label for="songName">Choose Course</label>
              <div class="input-group mb-3">
                <select class="form-select " v-model="CourseID">
                  <option class="dropdown-item " v-for="course in courseChoises" :key="course.id" :value="course.id">
                    {{ course.name }}
                  </option>
                </select>
                <a v-if="CourseID" class="btn btn-light text-danger" @click="deleteSong"><i class="fa fa-trash-alt"></i></a>
                <a v-else class="btn btn-light text-dark disabled" @click="deleteSong"><i class="fa fa-trash-alt"></i></a>
              </div>
            </div>
              <div class="mt-3">
                <label class="w-100" for="songName">Play style</label>
                <a class="btn btn-primary" @click="courseDoubleSwitch" :class="courseDouble === false ? 'btn-primary' : 'btn-light'"><i class="fa fa-compact-disc"></i> Single Courses</a>
                <a class="btn btn-primary" @click="courseDoubleSwitch" :class="courseDouble === true ? 'btn-primary' : 'btn-light'"><i class="fa fa-compact-disc"></i> <i class="fa fa-compact-disc"></i> Double Courses</a>
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
                    <option class="dropdown-item text-theme-1" v-for="song in songList" :key="song.id" :value="song">
                      {{ song.name }}
                    </option>
                  </select>
                </div>
                <div class="mb-2">
                  <a v-if="courseDouble === false" class="btn  w-25" :class="songIDs[index].diff === 'difficultyNormal'? 'btn-primary' : 'btn-light'" @click="setDifficulty(index, 'difficultyNormal', songIDs[index].difficultyNormal)">S{{ songIDs[index].difficultyNormal }}</a>
                  <a v-if="courseDouble === false" class="btn w-25" :class="songIDs[index].diff === 'difficultyHard' ? 'btn-primary' : 'btn-light'"  @click="setDifficulty(index, 'difficultyHard', songIDs[index].difficultyHard)">S{{ songIDs[index].difficultyHard }}</a>
                  <a v-if="courseDouble === false" class="btn w-25" :class="songIDs[index].diff === 'difficultyAnother' ? 'btn-primary' : 'btn-light'" @click="setDifficulty(index, 'difficultyAnother', songIDs[index].difficultyAnother)">S{{ songIDs[index].difficultyAnother }}</a>
                  <a v-if="courseDouble === true" class="btn w-25" :class="songIDs[index].diff === 'difficultyDoubleNormal'? 'btn-primary' : 'btn-light'" @click="setDifficulty(index, 'difficultyDoubleNormal', songIDs[index].difficultyDoubleNormal)">D{{ songIDs[index].difficultyDoubleNormal }}</a>
                  <a v-if="courseDouble === true" class="btn w-25" :class="songIDs[index].diff === 'difficultyDoubleHard' ? 'btn-primary' : 'btn-light'" @click="setDifficulty(index, 'difficultyDoubleHard', songIDs[index].difficultyDoubleHard)">D{{ songIDs[index].difficultyDoubleHard }}</a>
                  <a v-if="courseDouble === true" class="btn w-25" :class="songIDs[index].diff === 'difficultyDoubleAnother' ? 'btn-primary' : 'btn-light'" @click="setDifficulty(index, 'difficultyDoubleAnother', songIDs[index].difficultyDoubleAnother)">D{{ songIDs[index].difficultyDoubleAnother }}</a>
                  <a class="btn btn-light text-danger w-25" @click="deleteSong(index)"><i class="fa fa-trash-alt"></i></a>
                </div>
              </div>
              <a class="btn btn-primary" @click="addSong('songIDs')">Add Song</a>
              <p v-if="invalidInput" class="my-2">One or more input fields are invalid. Please check your provided data.</p>
              <p v-if="error">{{ error }}</p>
            <div class="form-group" v-if="canSubmit">
              <hr>
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
      courseChoises: [],
      lastSubmittedID: '',
      songList: [],
      courseDouble: false,
      courseUpdate: false,
      type: 'singles'
    }
  },
  methods: {
    reset() {
      this.songIDs = [];
      this.CourseID = "";
      this.enteredName = "";
      this.enteredRating = 1;
      this.invalidInput = false;
      this.error = null;
      this.submitted = false;
      this.lastSubmittedID = "";
      this.courseDouble = false;
      this.courseUpdate = false;
      this.invalidInput = false;
    },
    courseUpdateSwitch() {
      this.courseUpdate = !this.courseUpdate;
      if (this.courseUpdate === false) {
        this.reset();
      }
    },
    courseDoubleSwitch() {
      this.courseDouble = !this.courseDouble;
    },
    submitCourse() {
      this.invalidInput = false;
      this.error = null;
      if (this.enteredName.trim().length <= 0) {
        this.invalidInput = true;
        return;
      }
      if (this.songIDs.length <= 0) {
        this.invalidInput = true;
        return;
      }
      for (let i = 0; i < this.songIDs.length; i++) {
        if (this.songIDs[i].diff === undefined) {
          this.invalidInput = true;
          return;
        }
      }

      if (this.courseDouble === false) {
        this.type = 'singles';
      } else {
        this.type = 'doubles';
      }

      // Remove the unwanted properties from each songID
      // eslint-disable-next-line no-unused-vars
      const sanitizedSongIDs = this.songIDs.map(({ difficultyAnother, difficultyDoubleAnother, difficultyDoubleHard, difficultyDoubleNormal, difficultyHard, difficultyNormal, ...rest }) => rest);

      const course = {
        name: this.enteredName,
        songIDs: sanitizedSongIDs,
        id: this.enteredName.trim().replace(/\s/g, ''),
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
    setDifficulty(index, difficulty, value) {
      this.songIDs[index].diff = difficulty;
      this.songIDs[index].value = value;
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
    async getGameCourses() {
      const token = this.$store.getters.token;
      const gameID = this.gameID;
      const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/courses/${gameID}.json?auth=${token}`);
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(responseData.message || 'Failed to fetch!');
        throw error;
      }
      const item = [];
      for (const key in responseData) {
        const song = {
          id: responseData[key].id,
          name: responseData[key].name,
          rating: responseData[key].rating,
          songIDs: responseData[key].songIDs,
          type: responseData[key].type,
        };
        item.push(song);
      }
      this.courseChoises = item;
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
    canSubmit() {
      if (this.songIDs.length <= 0) {
        return false;
      } else {
        for (let i = 0; i < this.songIDs.length; i++) {
          if (this.songIDs[i].diff === undefined) {

            return false;
          }
        }
        // if all good return true
        return true;
      }
    },
  },
  watch: {
    gameID() {
      this.getGameCourses();
      this.getGameSongs();
    },
    CourseID: function (val) {
      this.courseChoises.forEach(game => {
        if (game.id === val) {
          this.enteredName = game.name;
          this.enteredRating = game.rating;
          this.songIDs = game.songIDs;
          this.type = game.type;
          if (this.type === 'singles') {
            this.courseDouble = false;
          } else {
            this.courseDouble = true;
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-top: 13px;
}
</style>