<template>
  <div class="container-fluid bg-dark">
    <div class="row text-center mx-md-3">
      <div class="col-12 p-0 text pt-4">
        <h1 class="text-center mb-3">{{ game.name }} <i :class="'icon ' + game.icon + ' text-primary'"></i></h1>
        <a class="btn btn-primary me-2 mb-3" href="#"><i class="fa fa-compact-disc"></i> Single Courses</a>
        <a class="btn btn-primary mb-3" href="#"><i class="fa fa-compact-disc"></i> <i class="fa fa-compact-disc"></i> Double Courses</a>
        <div class="container-fluid">
          <div class="row">

            <div v-for="n in 5" :key="n" class="col-12 col-md-6 col-lg-4 col-xxl-3 mb-3">
              <div class="card border-primary">
                <div class="card-header bg-primary">
                  <div class="row">
                    <div class="col-2 text-start">
                      <span class="text-white fw-bolder header-text">A</span>
                    </div>
                    <div class="col-8">
                    </div>
                    <div class="col-2 text-end">
                      <span class=" header-text"><i class="fa fa-heart text-dark"></i></span>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <span v-for="n in 5" :key="n"><i class="fa fa-star" :class="n <= 3 ? 'text-primary' : 'text-dark'"></i></span>
                  <h2 class="text-dark mb-0">Course name</h2>
                  <hr>
                  <table class="w-100 text-start table table-borderless table-sm mb-0">
                    <tr>
                      <td style="width: 10px">#1</td>
                      <th class="w-50">Kiss Kiss Kiss</th>
                      <th class="text-primary">1</th>
                    </tr>
                    <tr>
                      <td style="width: 10px">#2</td>
                      <th class="w-50">Quick Step</th>
                      <th class="text-primary">3</th>
                    </tr>
                    <tr>
                      <td style="width: 10px">#3</td>
                      <th class="w-50">Quick Step</th>
                      <th class="text-primary">3</th>
                    </tr>
                    <tr>
                      <td style="width: 10px">#4</td>
                      <th class="w-50">Quick Step</th>
                      <th class="text-primary">3</th>
                    </tr>
                    <tr>
                      <td style="width: 10px">#5</td>
                      <th class="w-50">Quick Step</th>
                      <th class="text-primary">3</th>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
  <add-song-modal
      @close="hideDialog"
      @addSongUser="addSongToUser"
      :open="dialogIsVisible"
      :infoSong="loadInfoSong"
  ></add-song-modal>
  <add-filter-modal
      @close="hideFilter"
      @addFilter="addFilter"
      :open="filterVisible"
  ></add-filter-modal>
</template>
<script>
import AddFilterModal from "@/components/UI/AddFilterModal";
export default {
  components: {AddFilterModal},
  emits: ['loaded'],
  name: 'SettingsScreen',
  data() {
    return {
      game: '',
      setSongs: [],
      dialogIsVisible: false,
      filterVisible: false,
      infoSong: {},
      filters: {},
      isLoaded: false,
      loading: false,
      noFilter: true,
      searchWord: '',
    }
  },
  methods: {
    async search() {
      if (this.searchWord.length > 2) {
        this.noFilter = false;
      }
      await this.reset();
    },
    clearFilter() {
      this.noFilter = true;
      this.filters = {};
      this.searchWord = '';
    },
    checkSongStatus(song) {
        if ((song.normalClear || song.difficultyNormal < 1) &&
            (song.hardClear || song.difficultyHard < 1) &&
            (song.anotherClear || song.difficultyAnother < 1)) {
        if ((song.normalFC || song.difficultyNormal < 1) &&
            (song.hardFC || song.difficultyHard < 1) &&
            (song.anotherFC || song.difficultyAnother < 1)) {
          return 'bg-primary flash';
        } else {
          return 'bg-primary';
        }
      } else {
        return 'bg-dark';
      }
    },
    async loadPage(selectedGame, theSongs) {
      this.loading = true;
      const userSongsAddition = await this.getUserSongs();
      const mergedUserSongs = [];
      for (const song of theSongs) {
        const userSong = userSongsAddition.find((sung) => sung.id == song.id);
        if (userSong) {
          userSong.difficultyNormal = song.difficultyNormal;
          userSong.difficultyHard = song.difficultyHard;
          userSong.difficultyAnother = song.difficultyAnother;
          userSong.name = song.name;
          userSong.artist = song.artist;
          mergedUserSongs.push(userSong);
        } else {
          mergedUserSongs.push(song);
        }
      }

      const filteredSongs = this.addFilters(mergedUserSongs);
      this.game = selectedGame;
      this.setSongs = filteredSongs;
      this.loading = false;
    },
    async getUserSongs() {
      return await this.$store.getters['getUserSongs'];
    },
    loadSongs() {
      this.$store.dispatch('songs/loadSongs');
    },
    showDialog(content) {
      this.infoSong = content;
      this.dialogIsVisible = true;
    },
    showFilter() {
      this.filterVisible = true;
    },
    hideDialog() {
      this.dialogIsVisible = false;
    },
    hideFilter() {
      this.filterVisible = false;
    },
    addFilter(data) {
      if (data.filterLevel === 0 && data.filteredClear === '' && data.filterFavorite === false && this.searchWord === '') {
        this.noFilter = true;
        this.filters = {};
      } else {
        this.noFilter = false;
        this.filters = data;
      }
    },
    async addSongToUser(data) {
      await this.$store.dispatch('addSongToUser', data);
      await this.reset();
    },
    addFilters(songs) {
      if (this.noFilter === false) {
        const filteredSongs = [];
        const searchWord = this.searchWord.toLowerCase().trim();
        for (const song of songs) {
          let matchesFilter = true;
          // Check if the song matches the search word
          if (searchWord !== '') {
            if (
                !song.name.toLowerCase().includes(searchWord) &&
                !song.artist.toLowerCase().includes(searchWord)
            ) {
              matchesFilter = false;
            }
          }
          if (Object.keys(this.filters).length > 0) {
            // filter songs based on the filters
            if (this.filters.filterLevel > 0) {
              if (
                  song.difficultyNormal !== this.filters.filterLevel &&
                  song.difficultyHard !== this.filters.filterLevel &&
                  song.difficultyAnother !== this.filters.filterLevel
              ) {
                matchesFilter = false;
              }
            }

            if (this.filters.filteredClear) {
              if (this.filters.filteredClear === 'clear') {
                if (
                    (song.difficultyNormal > 0 && !song.normalClear) ||
                    (song.difficultyHard > 0 && !song.hardClear) ||
                    (song.difficultyAnother > 0 && !song.anotherClear)
                ) {
                  matchesFilter = false;
                }
              } else if (this.filters.filteredClear === 'fullcombo') {
                if (
                    !song.normalFC &&
                    !song.hardFC &&
                    !song.anotherFC
                ) {
                  matchesFilter = false;
                }
              } else if (this.filters.filteredClear === 'failed') {
                if (
                    (song.difficultyNormal < 1 || song.normalClear) &&
                    (song.difficultyHard < 1 || song.hardClear) &&
                    (song.difficultyAnother < 1 || song.anotherClear)
                ) {
                  matchesFilter = false;
                }
              }
            }
            console.log(song);
            if (this.filters.filterFavorite) {
              if (!song.favorite) {
                matchesFilter = false;
              }
            }
          }

          if (matchesFilter) {
            filteredSongs.push(song);
          }
        }

        return filteredSongs;
      } else {
        return songs;
      }
    },
    async reset() {
      this.isLoaded = true;
      const songsToLoad = await this.$store.getters['songs/getSongsByGame'](this.gameID);
      const selectedGame = await this.$store.getters['games/getGames'].find((game) => game.id == this.gameID);
      await this.loadPage(selectedGame, songsToLoad);
      this.$emit('loaded', true);
      this.isLoaded = false;
    },
  },
  computed: {
    loadInfoSong() {
      return this.infoSong;
    },
  },
  created() {
    this.reset();
  },
  watch: {
    gameID: function(newVal) {
      this.loadSongs(newVal);
    },
    filters: function() {
      this.reset();
    }
  },
  props: {'msg': {
      type: String,
    },
    'gameID': {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
  tr, th, td {
    padding: 5px !important;
  }
  .header-text {
    font-size: 1.5rem;
  }
  @keyframes flash {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }
</style>