<template>
  <div class="container-fluid bg-dark">
    <div class="row text-center mx-md-3">
      <div class="col-12 p-0 text pt-4">
        <h1 class="text-center">{{ game.name }} <i :class="'icon ' + game.icon + ' text-primary'"></i></h1>
        <div class="px-2 px-md-0">
          <div class="input-group mt-4">
            <input type="text" class="form-control" placeholder="Song name" aria-label="Recipient's username" aria-describedby="button-addon2"
                   v-model="searchWord"
                   v-on:keyup.enter="search">
            <button class="btn btn-primary" type="button" id="button-search" @click="search"><i class="fa fa-search"></i></button>
            <button @click="showFilter" class="btn btn-primary ms-3" type="button"><i class="fa fa-sliders-h"></i> Filter</button>
          </div>
          <div class="my-2 my-md-4 text-start">
            <span v-if="!noFilter" class="text-white me-2">Filter:</span>
            <span v-if="!noFilter && searchWord !== '' && searchWord !== undefined" class="badge rounded-pill bg-light text-dark me-2">Name/ artist</span>
            <span v-if="!noFilter && filters.filterLevel !== 0 && filters.filterLevel !== undefined" class="badge rounded-pill pill bg-light text-dark me-2">Level {{ filters.filterLevel }}</span>
            <span v-if="!noFilter && filters.filteredClear !== '' && filters.filteredClear !== undefined" class="badge rounded-pill bg-light text-dark me-2">On {{ filters.filteredClear }}</span>
            <span v-if="!noFilter && filters.filterFavorite !== false && filters.filterFavorite !== undefined" class="badge rounded-pill bg-light text-dark me-2">Favorite</span>
          </div>
        </div>
        <table class="table table-borderless bg-light table-striped table-songs">
          <thead>
          <tr class="d-none d-sm-table-row text-white bg-dark">
            <th class="indicator"></th>
            <th class="text-start">Song</th>
            <th class="text-start d-none d-md-block">Artist/ Alias</th>
            <th class="text-center text-theme-1">SN</th>
            <th class="text-center text-theme-2">SH</th>
            <th class="text-center text-theme-3">SA</th>
            <th class="text-center text-theme-1">DN</th>
            <th class="text-center text-theme-2">DH</th>
            <th class="text-center text-theme-3">DA</th>
            <th class="text-center">Favorite</th>
          </tr>
          </thead>
          <tbody v-if="!loading">
            <tr @click="showDialog(song)" v-for="song in setSongs" v-bind:key="song.id">
              <th class="indicator"
                  :class="checkSongStatus(song)">
              </th>
              <th class="text-start">
                {{ song.name }}
              </th>
              <td class="text-start d-none d-md-table-cell">{{ song.artist }}</td>
              <td v-if="song.difficultyNormal > 0"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.normalClear, 'bg-theme-1': song.normalClear, 'flash': song.normalFC }">
                {{ song.difficultyNormal }}
              </td>
              <td v-else class="text-white diff-td bg-light">-</td>
              <td v-if="song.difficultyHard > 0"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.hardClear, 'bg-theme-2': song.hardClear, 'flash': song.hardFC }">
                {{ song.difficultyHard }}
              </td>
              <td v-else class="text-white diff-td bg-light">-</td>
              <td v-if="song.difficultyAnother > 0"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.anotherClear, 'bg-theme-3': song.anotherClear, 'flash': song.anotherFC }">
                {{ song.difficultyAnother }}
              </td>
              <td v-else class="text-white diff-td bg-light">-</td>
              <td v-if="song.difficultyDoubleNormal > 0"
                  class="text-black diff-td d-none d-sm-table-cell"
                  :class="{ 'bg-light': !song.normalDoubleClear, 'bg-theme-1': song.normalDoubleClear, 'flash': song.normalDoubleFC }">
                {{ song.difficultyDoubleNormal }}
              </td>
              <td v-else class="text-white diff-td bg-light d-none d-sm-table-cell">-</td>
              <td v-if="song.difficultyDoubleHard > 0"
                  class="text-black diff-td d-none d-sm-table-cell"
                  :class="{ 'bg-light': !song.hardDoubleClear, 'bg-theme-2': song.hardDoubleClear, 'flash': song.hardDoubleFC }">
                {{ song.difficultyDoubleHard }}
              </td>
              <td v-else class="text-white diff-td bg-light d-none d-sm-table-cell">-</td>
              <td v-if="song.difficultyDoubleAnother > 0"
                  class="text-black diff-td d-none d-sm-table-cell"
                  :class="{ 'bg-light': !song.anotherDoubleClear, 'bg-theme-3': song.anotherDoubleClear, 'flash': song.anotherDoubleFC }">
                {{ song.difficultyDoubleAnother }}
              </td>
              <td v-else class="text-white diff-td bg-light d-none d-sm-table-cell">-</td>
              <td class=" diff-td pb-0" :class="{ 'bg-light text-dark': !song.favorite, 'bg-primary text-white': song.favorite }"><i class="fa favo fa-heart"></i></td>
            </tr>
          </tbody>
        </table>
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
        return 'bg-light';
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
          userSong.difficultyDoubleNormal = song.difficultyDoubleNormal;
          userSong.difficultyDoubleHard = song.difficultyDoubleHard;
          userSong.difficultyDoubleAnother = song.difficultyDoubleAnother;
          userSong.name = song.name;
          userSong.artist = song.artist;
          userSong.composer = song.composer;
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
                // TODO: add composer
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
  .diff-td {
    width: 50px;
    text-align: center;
  }
  .table-songs {
    font-size: 0.8rem;
  }
  td:hover, diff-td:hover {
    cursor: pointer;
    background-color: #f5f5f5 !important;
    color: black !important;
   }
  .indicator {
    width: 10px;
    padding: 0 !important;
  }
  .flash {
    animation: flash 0.6s infinite;
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
  .favo {
    font-size: 1.rem;
  }
</style>