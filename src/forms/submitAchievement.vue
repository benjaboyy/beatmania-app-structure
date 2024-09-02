<template>
  <div class="login-screen px-2 mx-auto">
    <h1 class="text-center my-4">Achievements
      <router-link to="/admin" class="btn btn-secondary ms-3" href="#" type="button" role="button"><i class="fa fa-arrow-left"></i> {{ $t("menu.back") }}</router-link>
    </h1>
    <div class="card">
      <div class="card-body">
        <div v-if="submitted" class="alert alert-success" role="alert">
          Submitted! {{ this.lastSubmittedID }}
        </div>
        <form @submit.prevent="submitArcade">
          <div>
            <div class="mt-3">
              <a class="btn btn-primary" @click="arcadeUpdateSwitch" :class="arcadeUpdate === false ? 'btn-primary' : 'btn-light'">Make new</a>
              <a class="btn btn-primary" @click="arcadeUpdateSwitch" :class="arcadeUpdate === true ? 'btn-primary' : 'btn-light'">Give player</a>
              <a v-if="isArcadeName" class="btn btn-outline-primary ms-3" @click="reset"><i class="fa fa-sync-alt"></i> Reset</a>
            </div>
            <div v-if="!arcadeUpdate">
              <div class="form-group">
                <label for="songName">Achievement Name</label>
                <input class="form-control" type="text" id="songName" v-model="enteredName" />
              </div>
              <div class="form-group">
                <label for="songName">Choose icon</label>
                <div>
                  <button class="btn btn-link " v-for="arcade in iconList" :key="arcade.id" :value="arcade.id">
                    <i class="fa-2x" :class="arcade.fontAwesomeCode"></i>
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <textarea class="form-control" id="description" v-model="enteredCode"></textarea>
              </div>
            </div>
            <div v-else>
              <h6 class="mt-3">Achievement</h6>
              <select class="form-select my-2">
                <option value="" selected disabled>Select arcade</option>
                <option v-for="arcade in arcadeList" :key="arcade.id" :value="arcade.id">{{ arcade.name }}</option>
              </select>
              <h6 class="mt-3">Arcade</h6>
              <select class="form-select mb-2" v-model="arcadeID">
                <option value="" selected disabled>Select arcade</option>
                <option v-for="arcade in arcadeList" :key="arcade.id" :value="arcade.id">{{ arcade.name }}</option>
              </select>
              <h6>Given to</h6>
              <div class="mb-3 text-muted">0 players have received this achievement</div>
              <h6>Add</h6>
              <select class="form-select mb-2">
                <option value="" selected disabled>Select player</option>
                <option v-for="player in enteredPlayers" :key="player.id" :value="player.id">{{ player.name }}</option>
              </select>
            </div>

            <p v-if="invalidInput">One or more input fields are invalid. Please check your provided data.</p>
            <p v-if="error">{{ error }}</p>
            <hr>
            <div class="form-group">
              <button class="btn btn-primary"><i class="fa fa-paper-plane"></i> Submit</button>
              <router-link to="/" class="btn btn-outline-primary ms-3" href="#" type="button" role="button"><i class="fa fa-home"></i> {{ $t("menu.back") }}</router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  name: "submitArcade",
  data() {
    return {
      arcadeID: "",
      arcadeList: [],
      enteredPlayers: [],
      enteredName: "",
      enteredCode: "",
      enteredCountry: "",
      enteredGames: [],
      arcadeUpdate: false,
      gameChoises: [],
      iconList: [
        { fontAwesomeCode: "fa fa-trophy" },
        { fontAwesomeCode: "fa fa-star" },
        { fontAwesomeCode: "fa fa-medal" },
        { fontAwesomeCode: "fa fa-crown" },
        { fontAwesomeCode: "fa fa-award" },
        { fontAwesomeCode: "fa fa-ribbon" },
        { fontAwesomeCode: "fa fa-gem" },
        { fontAwesomeCode: "fa fa-gift" },
        { fontAwesomeCode: "fas fa-graduation-cap" },
        { fontAwesomeCode: "fas fa-rocket" },
        { fontAwesomeCode: "fas fa-umbrella-beach" },
        { fontAwesomeCode: "fas fa-utensils" },
        { fontAwesomeCode: "fas fa-calendar-alt" },
        { fontAwesomeCode: "fas fa-birthday-cake" },
        { fontAwesomeCode: "fas fa-briefcase" },
        { fontAwesomeCode: "fas fa-bullhorn" },
        { fontAwesomeCode: "fas fa-camera" },

      ]
    }
  },
  async created() {
    await this.$store.dispatch('arcades/loadArcades');
    const getGames = this.getGames;
    const getArcades = this.getArcades;
    this.gameChoises = getGames;
    this.arcadeList = getArcades;
    const arcadeID = this.$route.query.arcadeID;
    if (arcadeID) {
      this.arcadeID = arcadeID;
    }
  },
  methods: {
    reset() {
      this.enteredName = "";
      this.enteredCode = "";
      this.enteredCountry = "";
      this.enteredGames = [];
      this.enteredPlayers = [];
      this.arcadeID = "";
      this.songID = "";
      this.songUpdate = false;
      this.arcadeUpdate = false;
      this.invalidInput = false;
      this.error = null;
    },
    arcadeUpdateSwitch() {
      this.arcadeUpdate = !this.arcadeUpdate;
      if (this.arcadeUpdate === false) {
        this.reset();
      }
    },
    submitArcade() {

    }
  },
  computed: {
    getGames() {
      return this.$store.getters["games/getGames"];
    },
    getArcades() {
      return this.$store.getters["arcades/getArcades"];
    },
    isArcadeName() {
      if (this.enteredName === "") {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    arcadeID() {
      if (this.arcadeID !== "") {
        this.arcadeUpdate = true;
        const arcade = this.arcadeList.find(arcade => arcade.id === this.arcadeID);
        this.enteredName = arcade.name;
        this.enteredCode = arcade.code;
        this.enteredCountry = arcade.country;
        this.enteredGames = arcade.games;
        this.enteredPlayers = arcade.players;
      }
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-top: 13px;
}
</style>
