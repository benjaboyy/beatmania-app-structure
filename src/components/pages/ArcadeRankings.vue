<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 v-if="!arcadeID" class="text-center my-4">Arcade Rankings</h1>
    <h1 v-else class="text-center my-4">{{ getArcadeName }} Ranking</h1>
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
      <table class="table table-dark table-striped table-hover">
        <thead>
          <tr>
            <th style="width: 1px" scope="col">Rank</th>
            <th scope="col">Player</th>
            <th class="d-none d-md-table-cell" scope="col">Singles</th>
            <th class="d-none d-md-table-cell" scope="col">Doubles</th>
            <th class="d-none d-md-table-cell" scope="col">Courses</th>
            <th class="d-none d-md-table-cell" scope="col">Double Courses</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in players" :key="player.rank">
            <th scope="row">{{ player.rank }}</th>
            <td>{{ player.name }}</td>
            <td class="d-none d-md-table-cell">{{ player.singles }}</td>
            <td class="d-none d-md-table-cell">{{ player.doubles }}</td>
            <td class="d-none d-md-table-cell">{{ player.courses }}</td>
            <td class="d-none d-md-table-cell">{{ player.doubleCourses }}</td>
            <td>{{ player.total }}</td>
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
      arcadeName: 'DDR-EXP Arcade',
      selectedGame: '',
      players: [{
        rank: 1,
        name: 'Behy',
        singles: 147,
        doubles: 0,
        courses: 6,
        doubleCourses: 0,
        total: 159,
      },{
        rank: 2,
        name: 'Player 2',
        singles: 132,
        doubles: 0,
        courses: 7,
        doubleCourses: 0,
        total: 148,
      },{
        rank: 3,
        name: 'Player 3',
        singles: 40,
        doubles: 0,
        courses: 6,
        doubleCourses: 0,
        total: 52,
      },{
        rank: 4,
        name: 'Player 4',
        singles: 12,
        doubles: 0,
        courses: 2,
        doubleCourses: 0,
        total: 16,
      },],
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
  },
  computed: {
    getArcades() {
      return this.$store.getters['arcades/getArcades'];
    },
    getArcadeName() {
      return this.$store.getters['arcades/getArcadeName'](this.arcadeID);
    },
    getPlayers() {
      return this.$store.getters['arcades/getPlayers'](this.arcadeID);
    },
  },
  watch: {
    arcadeID() {
      // TODO: build new ranking table
    },
  },
};
</script>
