<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 v-if="!arcadeID" class="text-center my-4">Arcade Rankings</h1>
    <h1 v-else class="text-center my-4">{{ getArcadeName }} Ranking
      <small v-if="selectedGame">
        Game: {{ nameOfSelectedGame }}
      </small>
    </h1>
    <div v-if="!arcadeID" class="card">
      <div class="card-body">
        <h3>Select Arcade</h3>
        <div class="input-group mb-0">
          <select class="form-select" v-model="arcadeID">
            <option class="dropdown-item text-theme-1" value="573300">DDR-EXP Arcade</option>
          </select>
        </div>
        <hr>
        <router-link to="/about" class="btn btn-primary " href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> Back</router-link>
      </div>
    </div>
    <div v-else>
      <table v-if="selectedGame" class="table table-dark table-striped table-hover">
        <thead>
          <tr>
            <th style="width: 1px" scope="col">Rank</th>
            <th scope="col">Player</th>
            <th class="d-none d-md-table-cell" scope="col">Singles</th>
            <th class="d-none d-md-table-cell" scope="col">Doubles</th>
            <th class="d-none d-md-table-cell" scope="col">Courses</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player, key in playersSortedOnStats" :key="player.rank" class="bg-light">
            <th v-if="key === 0" scope="row"><i class="fas fa-trophy"></i></th>
            <th v-else>{{ key+1 }}</th>
            <td>{{ player.name }}</td>
            <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame].singles }}</td>
            <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame].doubles }}</td>
            <td class="d-none d-md-table-cell">{{ player.trackedGames[selectedGame].courses }}</td>
            <td>{{ player.trackedGames[selectedGame].singles + player.trackedGames[selectedGame].doubles + (player.trackedGames[selectedGame].courses*2) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="card p-3" v-else>
        <h3>Select Game</h3>
        <button v-for="game in getArcadeGames" :key="game" class="btn btn-primary" @click="selectedGame = game">{{ game }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUs',
  data() {
    return {
      arcadeID: '',
      selectedGame: '',
      players: [],
      arcadeList: [],
    };
  },
  props: {
    msg: String,
  },
  async created() {
    await this.$store.dispatch('arcades/loadArcades');
    const arcadeID = this.$route.params.arcadeID;
    if (arcadeID) {
      this.arcadeID = arcadeID;
    }
    const gameID = this.$route.params.gameID;
    if (gameID) {
      this.selectedGame = gameID;
    }
  },
  computed: {
    getArcades() {
      return this.$store.getters['arcades/getArcades'];
    },
    nameOfSelectedGame() {
      return this.$store.getters['games/getGameName'](this.selectedGame);
    },
    getArcadeName() {
      return this.$store.getters['arcades/getArcadeName'](this.arcadeID);
    },
    getArcadeGames() {
      return this.$store.getters['arcades/getArcadeGames'](this.arcadeID);
    },
    getPlayers() {
      return this.$store.getters['arcades/getPlayers'](this.arcadeID);
    },
    playersSortedOnStats() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      const sort = this.players.sort((a, b) => b.total - a.total);
      return sort;
    },
  },
  watch: {
    async arcadeID() {
      for (let player in this.getPlayers) {
        this.players.push(await this.$store.dispatch('loadUserStats', player));
      }
    },
  },
};
</script>
