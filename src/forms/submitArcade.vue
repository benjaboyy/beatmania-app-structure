<template>
  <div class="login-screen px-2 mx-auto">
    <h1 class="text-center my-4">Update Arcade
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
              <a class="btn btn-primary" @click="arcadeUpdateSwitch" :class="arcadeUpdate === false ? 'btn-primary' : 'btn-light'">New</a>
              <a class="btn btn-primary" @click="arcadeUpdateSwitch" :class="arcadeUpdate === true ? 'btn-primary' : 'btn-light'">Update</a>
              <a v-if="isArcadeName" class="btn btn-outline-primary ms-3" @click="reset"><i class="fa fa-sync-alt"></i> Reset</a>
            </div>
            <div v-if="!arcadeUpdate">
              <div class="form-group">
                <label for="songName">Arcade Name</label>
                <input class="form-control" type="text" id="songName" v-model="enteredName" />
              </div>
            </div>
            <div v-else class="form-group">
              <label for="songName">Choose arcade</label>
              <div class="input-group mb-3">
                <select class="form-select " v-model="arcadeID">
                  <option class="dropdown-item " v-for="arcade in arcadeList" :key="arcade.id" :value="arcade.id">
                    {{ arcade.name }}
                  </option>
                </select>
                <a v-if="isArcadeID" class="btn btn-light text-danger" @click="deleteArcade"><i class="fa fa-trash-alt"></i></a>
                <a v-else class="btn btn-light text-dark disabled"><i class="fa fa-trash-alt"></i></a>
              </div>
            </div>
            <div class="form-group">
              <label for="songArtist">Country</label>
              <input class="form-control" type="text" id="songArtist" v-model="enteredCountry" />
            </div>
            <div class="form-group">
              <label for="songArtist">Arcade code</label>
              <input class="form-control" type="text" id="songArtist" v-model="enteredCode" />
            </div>

            <h6 class="mt-3">Playable games</h6>
<!--              select multiple playable games as chackboxes-->
            <div class="form-check" v-for="game in gameChoises" :key="game.id">
              <input class="form-check-input" type="checkbox" :id="game.id" :value="game.id" v-model="enteredGames">
              <label class="form-check-label" :for="game.id">{{ game.name }}</label>
            </div>
            <div v-if="arcadeUpdate">
              <h6 class="mt-3">Players</h6>
              <div v-for="player in enteredPlayers " :key="player.id" class="input-group mb-3">
                <p>{{ player.name }} <a class="btn btn-light text-danger" @click="removePlayer(player.id)"><i class="fa fa-trash-alt"></i></a></p>
              </div>
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
      this.arcadePlayers = [];
      this.arcadeID = "";
      this.songID = "";
      this.songUpdate = false;
      this.arcadeUpdate = false;
      this.invalidInput = false;
      this.error = null;
    },
    deleteArcade() {
      const token = this.$store.getters.token;
      fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/arcades/${this.arcadeID}.json?auth=${token}`, {
        method: 'DELETE',
      }).then((response) => {
        if (response.ok) {
          this.reset();
        } else {
          this.error = "Something went wrong. Please try again later.";
        }
      });
    },
    arcadeUpdateSwitch() {
      this.arcadeUpdate = !this.arcadeUpdate;
      if (this.arcadeUpdate === false) {
        this.reset();
      }
    },
    submitArcade() {
      this.invalidInput = false;
      this.error = null;
      let ID = "";
      ID = this.enteredCode;
      const token = this.$store.getters.token;
      fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/arcades/${ID}.json?auth=${token}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: this.enteredCode,
          name: this.enteredName,
          code: this.enteredCode,
          country: this.enteredCountry,
          games: this.enteredGames,
          players: this.arcadePlayers,
        })
      }).then((response) => {
        if (response.ok) {
          // update to store
          this.$store.dispatch('arcades/updateArcade', {
            id: this.enteredCode,
            name: this.enteredName,
            code: this.enteredCode,
            country: this.enteredCountry,
            games: this.enteredGames,
            players: this.arcadePlayers,
          });
          this.reset()
          window.scrollTo(0,0);
          return response.json();
        } else {
          throw new Error('Something went wrong!');
        }
      }).then((data) => {
        console.log(data);
      })
    }
  },
  computed: {
    getGames() {
      return this.$store.getters["games/getGames"];
    },
    getArcades() {
      return this.$store.getters["arcades/getArcades"];
    },
    isArcadeID() {
      if (this.arcadeID === "") {
        return false;
      } else {
        return true;
      }
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