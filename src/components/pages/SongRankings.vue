<template>
  <div class="stats-screen px-2 px-md-5 pt-4 m-auto">
    <div class="banner--highscore d-flex bg-primary" v-if="!isAuthenticated">
      <img src="../../assets/img/banner-highscore.png" class="d-inline-block align-middle mx-auto logo--size" alt="">
    </div>
    <h1 v-if="!arcadeID && isAuthenticated" class="text-center my-0">Leaderboard Rankings</h1>
    <h1 v-if="selectedGame" class="text-center my-0">{{ nameOfSelectedGame }} Ranking</h1>
    <div v-if="arcadeID" :class="{'h1': !selectedGame, 'h5': selectedGame}" class="text-center text-white my-0">Location: {{ getArcadeName }}</div>
    <div class="mt-4">
      <div v-if="!arcadeID" class="card">
        <div class="card-body">
          <h3>Select Arcade</h3>
          <div class="input-group mb-0">
            <select class="form-select" v-model="arcadeID">
              <option class="dropdown-item text-theme-1" v-for="arcade in getArcades" :key="arcade.id" :value="arcade.id">
                {{ arcade.name }}
              </option>
            </select>
          </div>
          <hr>
          <router-link to="/" class="btn btn-primary " href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> {{ $t("menu.back") }}</router-link>
          <router-link to="/about" class="btn btn-link" href="#" type="button" role="button" exact>{{ $t("menu.aboutAndInfo") }}</router-link>
        </div>
      </div>
      <div v-else>
        <div v-if="selectedGame">
          <div class="card">
            <div class="card-body">
              <label for="songName ">Choose song</label>
              <div v-if="loaded" class="input-group mt-4">
                <input type="text" class="form-control" :placeholder="$t('listScreen.searchName')" aria-label="Recipient's username" aria-describedby="button-addon2"
                       v-model="searchWord"
                       @input="filterSongs">
                <button class="btn btn-primary" type="button" id="button-search" @click="search"><i class="fa fa-search me-md-1"></i>  <span class="d-none d-md-inline">{{ $t("listScreen.search") }}</span></button>
              </div>
              <div v-else>Loading...</div>
              <hr>
              <span class="w-100" v-for="song in filteredSongs" :key="song.id" :value="song.id">
                <router-link :to="'/leaderboard/' + arcadeID + '/' + selectedGame + '/' + song.id"
                             class="btn btn-light w-100 text-start mb-1">
                  {{ song.name }} - {{ song.artist }}
                   <i class="fa fa-arrow-right ms-2 float-end"></i>
                </router-link>
              </span>
              <div v-if="songID">
                <router-link :to="'/leaderboard/' + arcadeID + '/' + selectedGame + '/' + songID"
                             class="btn btn-primary w-100">
                  Go to Ranking <i class="fa fa-external-link-alt ms-2"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="card p-3" v-else>
          <h3>Select Game</h3>
          <button v-for="game in getArcadeGames" :key="game" class="btn btn-primary mt-2" @click="selectedGame = game">{{ getGameName(game) }}</button>
          <div>
            <hr>
            <router-link to="/" class="btn btn-primary " href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> {{ $t("menu.back") }}</router-link>
            <router-link to="/about" class="btn btn-link" href="#" type="button" role="button" exact>{{ $t("menu.aboutAndInfo") }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LanguageModal
      @close="hideDialog"
      :open="dialogIsVisible"
  />
  <ProfileModal
      @close="hideProfile"
      :open="profileVisible"
      :player="loadedPlayer"
      :arcadeID="arcadeID"
  />
</template>

<script>
import LanguageModal from "@/components/UI/LanguageModal";
import ProfileModal from "@/components/UI/ProfileModal";
export default {
  name: 'SongRankings',
  components: {
    LanguageModal, ProfileModal
  },
  data() {
    return {
      arcadeID: '',
      selectedGame: '',
      songID: '',
      nameSelectedArcade: '',
      nameSelectedGame: '',
      players: [],
      arcadeList: [],
      dialogIsVisible: false,
      profileVisible: false,
      loadedPlayer: null,
      songList: [],
      searchWord: '',
      filteredSongs: [],
      loaded: false,
    };
  },
  props: {
    msg: String,
  },
  async created() {
    await this.$store.dispatch('arcades/loadArcades');
    await this.$store.dispatch('games/fetchGameSongs');
    const arcadeID = this.$route.params.arcadeID;
    if (arcadeID) {
      this.arcadeID = arcadeID;
      this.nameSelectedArcade = this.getArcadeName;
    }
    const gameID = this.$route.params.gameID;
    if (gameID) {
      this.selectedGame = gameID;
      this.nameSelectedGame = this.nameOfSelectedGame;
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['isAuthenticated'];
    },
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
    }
  },
  methods: {
    filterSongs() {
      this.filteredSongs = this.songList.filter(song => {
        return song.name.toLowerCase().includes(this.searchWord.toLowerCase());
      });
    },
    async getGameSongs() {
      const token = this.$store.getters.token;
      const gameID = this.selectedGame;
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
      this.filterSongs();
      this.loaded = true;
    },
    showDialog() {
      this.dialogIsVisible = true;
    },
    hideDialog() {
      this.dialogIsVisible = false;
    },
    showProfile(player) {
      console.log(player);
      this.loadedPlayer = player;
      this.profileVisible = true;
    },
    hideProfile() {
      this.profileVisible = false;
    },
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'ja' : 'en';
    },
    getGameName(gameID) {
      return this.$store.getters['games/getGameName'](gameID);
    },
    async copyURL(url) {
      try {
        await navigator.clipboard.writeText(url);
        alert('Copied');
      } catch ($e) {
        alert('Cannot copy');
      }
    }
  },
  watch: {
    selectedGame: function (val) {
      this.getGameSongs(val);
    },
    async arcadeID() {
      for (let player in this.getPlayers) {
        this.players.push(await this.$store.dispatch('loadUserStats', player));
      }
    },
  },
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
