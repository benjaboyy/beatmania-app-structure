<template>
  <div class="container-fluid bg-dark">
    <div class="row text-center mx-md-3">
      <div class="col-12 p-0 text pt-4">
        <h1 class="text-center">{{ game.name }} <i :class="'icon ' + game.icon + ' text-primary'"></i></h1>
        <div class="px-2 px-md-0">
          <div class="input-group mt-4">
            <input type="text" class="form-control" placeholder="Song name" aria-label="Recipient's username" aria-describedby="button-addon2">
            <button class="btn btn-primary" type="button"><i class="fa fa-search"></i> Search</button>
            <button @click="showFilter" class="btn btn-primary ms-3" type="button"><i class="fa fa-sliders-h"></i> Filter</button>
          </div>
          <div class="my-2 my-md-4 text-start">
            <span class="text-white me-2">Filter:</span>
            <span class="badge rounded-pill bg-light text-dark me-2">Level 9</span>
            <span class="badge rounded-pill bg-light text-dark me-2">Not cleared</span>
          </div>
        </div>
        <table class="table table-borderless bg-light table-striped table-songs">
          <tbody v-if="!loading">
            <tr @click="showDialog(song)" v-for="song in setSongs" v-bind:key="song.id">
              <th class="indicator"
                  :class="checkSongStatus(song)">
              </th>
              <th class="text-start">
                {{ song.name }}
              </th>
              <td class="d-none d-md-block">{{ song.artist }}</td>
              <td v-if="song.difficultyNormal > 0"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.normalClear, 'bg-theme-1': song.normalClear, 'flash': song.normalFC }">
                {{ song.difficultyNormal }}
              </td>
              <td v-else class="text-white diff-td bg-dark">-</td>
              <td v-if="song.difficultyHard > 0"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.hardClear, 'bg-theme-2': song.hardClear, 'flash': song.hardFC }">
                {{ song.difficultyHard }}
              </td>
              <td v-else class="text-white diff-td bg-dark">-</td>
              <td v-if="song.difficultyAnother > 0"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.anotherClear, 'bg-theme-3': song.anotherClear, 'flash': song.anotherFC }">
                {{ song.difficultyAnother }}
              </td>
              <td v-else class="text-white diff-td bg-dark">-</td>
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
    }
  },
  methods: {
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
      const pickSongs = selectedGame.songs;
      const selectedSongs = [];
      for (const song of pickSongs) {
        const selectedSong = theSongs.find((sung) => sung.id == song);
        selectedSongs.push(selectedSong);
      }
      const userSongsAddition = await this.getUserSongs();
      const mergedUserSongs = [];
      for (const song of selectedSongs) {
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
    // loadUserSongs() {
    //   this.$store.dispatch('loadUserSongs');
    // },
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
      if (data.levelNone === true && data.filteredClear === '' && data.filterFavorite === false) {
        this.noFilter = true;
        this.filters = {};
      } else {
        this.noFilter = false;
        this.filters = data;
      }
    },
    async addSongToUser(data) {
      // hier moet de song worden toegevoegd aan de user "addScore"
      await this.$store.dispatch('addSongToUser', data);
      await this.reset();
    },
    addFilters(songs) {
      if (this.noFilter === false) {
        const filteredSongs = [];
        for (const song of songs) {
          if (this.filters !== {} || this.filters.levelNone === true) {
            let levelMatched = false;
            for (const level of this.filters.levels) {
              // TODO: levels is not defined probably for correct filtering
              if (level === song.difficultyNormal || level === song.difficultyHard || level === song.difficultyAnother) {
                levelMatched = true;
              }
            }
            if (levelMatched === true) {
              filteredSongs.push(song);
            }
          } else {
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
      const songsToLoad = await this.$store.getters['songs/getSongsByGame']('thefinal');
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