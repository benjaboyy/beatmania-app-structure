<template>
  <div class="stats-screen px-2 px-md-5 pt-4 m-auto">
    <div class="banner--highscore d-flex bg-primary" v-if="!isAuthenticated">
      <img src="../../assets/img/banner-highscore.png" class="d-inline-block align-middle mx-auto logo--size" alt="">
    </div>
    <h4 class="text-center text-white my-0">Leaderboard Scores - {{ nameSelectedArcade }} - {{ nameSelectedGame }}</h4>
    <div class="text-center my-0">
      <h1 class="text-center my-0">{{ songInfo.name }}</h1>
      <h2 class="text-center my-0">{{ songInfo.artist }}</h2>
    </div>
    <div v-if="loading" class="login-screen mt-5 pt-5 px-2 mx-auto text-center">
      <h1 class="display-2"><i class="fa fa-compact-disc fa-spin"></i></h1>
      <h2>Loading...</h2>
    </div>
    <div v-else>
      <table class="table table-dark table-striped table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Normal <span class="square bg-theme-1">{{ songInfo.difficultyDoubleNormal }}</span></th>
            <th>Hard <span class="square bg-theme-2">{{ songInfo.difficultyDoubleHard }}</span></th>
            <th>Another <span class="square bg-theme-3">{{ songInfo.difficultyDoubleAnother }}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in finalList" :key="player.name">
            <td style="width: 1px">{{ index + 1 }}</td>
            <td>{{ player.name }}</td>
            <td>{{ player.normalScore }}</td>
            <td>{{ player.hardScore }}</td>
            <td>{{ player.anotherScore }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUs',
  data() {
    return {
      arcadeID: '',
      songID: {
        "id": "9392",
        "name": "7000 Questions",
        "artist": "アルファ",
        "difficultyNormal": "5",
        "difficultyHard": "7",
        "difficultyAnother": "8",
        "difficultyDoubleNormal": "6",
        "difficultyDoubleHard": "8",
        "difficultyDoubleAnother": "9"
      },
      songInfo: '',
      nameSelectedArcade: '',
      nameSelectedGame: '',
      players: [],
      gameiD: '',
      loading: false,
      finalList: [],
      difficulty: 'normalScore',
    };
  },
  props: {
    msg: String,
  },
  async created() {
    this.loading = true;
    await this.$store.dispatch('arcades/loadArcades');
    await this.$store.dispatch('songs/loadSongs');
    this.arcadeID = this.$route.params.arcadeID;
    this.gameiD = this.$route.params.gameID;
    this.songID = this.$route.params.songID;
    this.players = await this.$store.getters['arcades/getPlayers'](this.arcadeID);
    // todo: make function to prepair leaderboard
    await this.makeLeaderboard();
    this.songInfo = await this.$store.getters['songs/getSongByID'](this.gameiD, this.songID);
    this.loading = false;
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['isAuthenticated'];
    },
    nameOfSelectedGame() {
      return this.$store.getters['games/getGameName'](this.selectedGame);
    },
    getArcadeName() {
      return this.$store.getters['arcades/getArcadeName'](this.arcadeID);
    },
    getPlayers() {
      return this.$store.getters['arcades/getPlayers'](this.arcadeID);
    },
    getSongInfo() {
      return this.$store.getters['songs/getSongsByGame'](this.gameiD);
    }
  },
  methods: {
    async makeLeaderboard() {
      const token = this.$store.getters.token;
      const list = [];
      for (const player in this.players) {
        const userId = player;
        const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/songs/${this.songID}.json?auth=${token}`);
        const responseData = await response.json();
        if (!response.ok) {
          const error = new Error(responseData.message || 'Failed to fetch!');
          throw error;
        }
        const playerData = {
          ...responseData,
          name: this.players[player],
        };
        list.push(playerData);
      }
      // sort list
      // data example: {"anotherScore":"190","favorite":true,"hardClear":true,"hardScore":"200","id":"9392","normalClear":true,"normalScore":"100","target":true,"name":"Behy"}
      list.sort((a, b) => {
        if (a[this.difficulty] > b[this.difficulty]) {
          return -1;
        }
        if (a[this.difficulty] < b[this.difficulty]) {
          return 1;
        }
        return 0;
      });
      this.finalList = list
    },
    async copyURL(url) {
      try {
        await navigator.clipboard.writeText(url);
        alert('Copied');
      } catch ($e) {
        alert('Cannot copy');
      }
    }
  }
};
</script>

<style scoped>
.banner--highscore {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.logo--size {
  width: 100%;
  max-width: 350px;
}
.stats-screen {
  margin-top: 75px!important;
}
.card {
  max-width: 500px;
  margin: 0 auto;
}
.select-lang {
  cursor: pointer;
}
.square {
  padding: 5px;
}
</style>
