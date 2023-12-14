<template>
  <div class="stats-screen px-2 px-md-5 pt-4 m-auto">
    <div class="banner--highscore d-flex bg-primary" v-if="!isAuthenticated">
      <img src="../../assets/img/banner-highscore.png" class="d-inline-block align-middle mx-auto logo--size" alt="">
    </div>
    <h1 class="text-center my-0">Leaderboard Scores</h1>
    <div v-if="loading" class="login-screen mt-5 pt-5 px-2 mx-auto text-center">
      <h1 class="display-2"><i class="fa fa-compact-disc fa-spin"></i></h1>
      <h2>Loading...</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUs',
  data() {
    return {
      arcadeID: '',
      songID: '',
      nameSelectedArcade: '',
      nameSelectedGame: '',
      players: [],
      gameiD: '',
      loading: false,
      finalList: [],
    };
  },
  props: {
    msg: String,
  },
  async created() {
    this.loading = true;
    await this.$store.dispatch('arcades/loadArcades');
    this.arcadeID = this.$route.params.arcadeID;
    this.gameiD = this.$route.params.gameID;
    this.songID = this.$route.params.songID;
    this.players = await this.$store.getters['arcades/getPlayers'](this.arcadeID);
    // todo: make function to prepair leaderboard
    await this.makeLeaderboard();
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
    }
  },
  methods: {
    async makeLeaderboard() {
      const token = this.$store.getters.token;
      const list = [];
      // player = {"0YV4DS5MvSbdh1AtR9V6r0dqaxB3":"Elex"}
      for (const player in this.players) {
        const userId = player;
        const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/songs/${this.songID}.json?auth=${token}`);
        const responseData = await response.json();
        if (!response.ok) {
          const error = new Error(responseData.message || 'Failed to fetch!');
          throw error;
        }
        // merge responce and playername
        const playerData = {
          ...responseData,
          name: this.players[player],
        };
        list.push(playerData);

      }
      // sort list
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
</style>
