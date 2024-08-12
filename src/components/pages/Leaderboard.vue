<template>
  <div class="stats-screen px-2 px-md-5 pt-4 m-auto">
    <div class="banner--highscore d-flex bg-primary" v-if="!isAuthenticated">
      <img src="../../assets/img/banner-highscore.png" class="d-inline-block align-middle mx-auto logo--size" alt="">
    </div>
    <h4 class="text-center text-white my-0">{{ game.name }} - {{ arcadeName }}</h4>
    <div class="text-center w-100 my-0">
      <h1 class="text-center my-0">{{ songInfo.name }}</h1>
<!--      // stoting dropdown-->
      <div class="dropdown my-2">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          {{ $t("listScreen." + difficulty) }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><a class="dropdown-item" @click="difficulty = 'normalScore'">Normal</a></li>
          <li><a class="dropdown-item" @click="difficulty = 'hardScore'" v-if="this.game.hasHardSongs">Hard</a></li>
          <li><a class="dropdown-item" @click="difficulty = 'anotherScore'" v-if="this.game.hasAnotherSongs">Another</a></li>
        </ul>
      </div>
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
            <th>Normal <span class="square bg-theme-1">{{ songInfo.difficultyNormal }}</span></th>
            <th v-if="this.game.hasHardSongs">Hard <span class="square bg-theme-2">{{ songInfo.difficultyHard }}</span></th>
            <th v-if="this.game.hasAnotherSongs">Another <span class="square bg-theme-3">{{ songInfo.difficultyAnother }}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in finalList" :key="player.name">
            <td style="width: 1px">{{ index + 1 }}</td>
            <td>{{ player.name }}</td>
            <td><i v-if="player.normalClear" class="fa fa-check text-success"></i> {{ player.normalScore }}</td>
            <td v-if="this.game.hasHardSongs"><i v-if="player.hardClear" class="fa fa-check text-success"></i> {{ player.hardScore }}</td>
            <td v-if="this.game.hasAnotherSongs"><i v-if="player.hardClear" class="fa fa-check text-success"></i> {{ player.anotherScore }}</td>
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
      songID: {},
      songInfo: '',
      nameSelectedArcade: '',
      nameSelectedGame: '',
      players: [],
      gameiD: '',
      game: '',
      loading: false,
      finalList: [],
      difficulty: 'normalScore',
      arcadeName: '',
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
    this.game = await this.$store.getters['games/getGames'].find((game) => game.id == this.$route.params.gameID);
    this.arcadeName = await this.$store.getters['arcades/getArcadeName'](this.arcadeID);
    this.loading = false;
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['isAuthenticated'];
    },
    nameOfSelectedGame() {
      return this.$store.getters['games/getGameName'](this.selectedGame);
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
        const scoreA = a[this.difficulty];
        const scoreB = b[this.difficulty];
        return this.compareScore(scoreA, scoreB);
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
    },
    compareScore(scoreA, scoreB) {
      const normalizedA = scoreA !== undefined && scoreA !== null && scoreA !== '0' ? scoreA : 0;
      const normalizedB = scoreB !== undefined && scoreB !== null && scoreB !== '0' ? scoreB : 0;
      return normalizedB - normalizedA;
    },
  },
  watch: {
    difficulty() {
      this.makeLeaderboard();
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
