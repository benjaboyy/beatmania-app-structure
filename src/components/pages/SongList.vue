<template>
  <div class="container-fluid max-width bg-dark">
    <div class="row text-center mx-md-3">
      <div class="col-12 p-0 text pt-4">
        <h1 class="text-center">{{ game.name }} <i :class="'icon ' + game.icon + ' text-primary'"></i></h1>
        <div class="px-2 px-md-0">
          <div class="input-group mt-4">
            <input type="text" class="form-control" :placeholder="$t('listScreen.searchName')" aria-label="Recipient's username" aria-describedby="button-addon2"
                   v-model="searchWord"
                   @input="search">
            <button class="btn btn-primary" type="button" id="button-search" @click="search"><i class="fa fa-search me-md-1"></i>  <span class="d-none d-md-inline">{{ $t("listScreen.search") }}</span></button>

            <button v-if="game.hasDoubleCharts && type === 'single'" @click="toggleType" class="btn ms-2 d-md-none" :class="type === 'single' ? 'btn-primary' : 'btn-light'" type="button"><i class="fa fa-compact-disc"></i></button>
            <button v-if="game.hasDoubleCharts && type === 'double'" @click="toggleType" class="btn ms-2 d-md-none" :class="type === 'double' ? 'btn-primary' : 'btn-light'" type="button"><i class="fa fa-compact-disc"></i><i class="fa fa-compact-disc ms-1"></i></button>

            <div class="dropdown">
              <button class="btn btn-primary ms-2 dropdown-toggle rounded-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-sort-alpha-down"></i> <span class="d-none d-md-inline ms-1">{{ $t("listScreen." + filterSorting) }}</span>
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <small class="dropdown-item disabled">Sort By</small>
                <a :class="filterSorting === 'title' ? 'dropdown-item active' : 'dropdown-item text-dark'" @click="changeSort('title')">{{ $t("listScreen.title") }}</a>
                <a :class="filterSorting === 'artist' ? 'dropdown-item active' : 'dropdown-item text-dark'" @click="changeSort('artist')">{{ $t("listScreen.artist") }}</a>
                <a v-if="game.hasGenres" :class="filterSorting === 'genre' ? 'dropdown-item active' : 'dropdown-item text-dark'" @click="changeSort('genre')">{{ $t("listScreen.genre") }}</a>
                <li><hr class="dropdown-divider"></li>
                <small class="dropdown-item disabled">Level Singles</small>
                <a :class="filterSorting === 'normalLevel' ? 'dropdown-item active' : 'dropdown-item text-dark'" @click="changeSort('normalLevel')"><i class="fas fa-compact-disc text-theme-1"></i> {{ $t("listScreen.normal") }}</a>
                <a v-if="game.hasHardSongs" :class="filterSorting === 'hardLevel' ? 'dropdown-item active' : 'dropdown-item text-dark'" @click="changeSort('hardLevel')"><i class="fas fa-compact-disc text-theme-2"></i> {{ $t("listScreen.hard") }}</a>
                <a v-if="game.hasAnotherSongs" :class="filterSorting === 'anotherLevel' ? 'dropdown-item active' : 'dropdown-item text-dark'" @click="changeSort('anotherLevel')"><i class="fas fa-compact-disc text-theme-3"></i> {{ $t("listScreen.another") }}</a>
                <li v-if="game.hasDoubleCharts"><hr class="dropdown-divider"></li>
                <small v-if="game.hasDoubleCharts" class="dropdown-item disabled">Level Doubles</small>
                <a v-if="game.hasDoubleCharts" :class="filterSorting === 'normalDoubleLevel' ? 'dropdown-item active' : 'dropdown-item text-dark'" @click="changeSort('normalDoubleLevel')"><i class="fas fa-compact-disc text-theme-1"></i><i class="fas fa-compact-disc ms-1 text-theme-1"></i> {{ $t("listScreen.normal") }}</a>
                <a v-if="game.hasDoubleCharts && game.hasHardSongs" :class="filterSorting === 'hardDoubleLevel' ? 'dropdown-item active' : 'dropdown-item text-dark'" @click="changeSort('hardDoubleLevel')"><i class="fas fa-compact-disc text-theme-2"></i><i class="fas fa-compact-disc ms-1 text-theme-2"></i> {{ $t("listScreen.hard") }}</a>
                <a v-if="game.hasDoubleCharts && game.hasAnotherSongs" :class="filterSorting === 'anotherDoubleLevel' ? 'dropdown-item active' : 'dropdown-item text-dark'" @click="changeSort('anotherDoubleLevel')"><i class="fas fa-compact-disc text-theme-3"></i><i class="fas fa-compact-disc ms-1 text-theme-3"></i> {{ $t("listScreen.another") }}</a>
              </div>
            </div>
            <button @click="showFilter" class="btn btn-primary ms-2" type="button"><i class="fa fa-sliders-h me-md-1"></i> <span class="d-none d-md-inline">{{ $t("listScreen.filters") }}</span></button>
          </div>
          <div class="my-2 text-start">
            <span v-if="!filters" class="text-white me-2">{{ $t("listScreen.filter") }}:</span>
            <span v-if="!noFilter && searchWord !== '' && searchWord !== undefined" @click="removeFilter('search')" class="badge rounded-pill bg-light text-dark me-2" role="button">{{ $t("listScreen.nameArtist") }} <i class="fa fa-times"></i></span>
            <span v-if="!noFilter && filters.filterLevel > 0 && filters.filterLevel !== undefined" @click="removeFilter('level')" class="badge rounded-pill pill bg-light text-dark me-2" role="button">{{ $t("listScreen.level") }} {{ filters.filterLevel }} <i class="fa fa-times"></i></span>
            <span v-if="!noFilter && filters.filteredClear !== '' && filters.filteredClear !== undefined" @click="removeFilter('clear')" class="badge rounded-pill bg-light text-dark me-2" role="button">{{ $t("listScreen.filterOn") }} {{ filters.filteredClear }} <i class="fa fa-times"></i></span>
            <span v-if="!noFilter && filters.filterFavorite !== false && filters.filterFavorite !== undefined" @click="removeFilter('favorite')" class="badge rounded-pill bg-light text-dark me-2" role="button">{{ $t("listScreen.favorite") }} <i class="fa fa-times"></i></span>
            <span v-if="!noFilter && filters.filterTarget !== false && filters.filterTarget !== undefined" @click="removeFilter('target')" class="badge rounded-pill bg-light text-dark me-2" role="button">{{ $t("listScreen.target") }} <i class="fa fa-times"></i></span>
            <span v-if="filterSorting !== 'title'" @click="changeSort('title')" class="badge rounded-pill d-md-none bg-light text-dark me-2"  role="button">Sort: {{ $t("listScreen." + filterSorting) }} <i class="fa fa-times"></i></span>
          </div>
        </div>
        <table class="table table-borderless bg-light table-striped table-songs">
          <thead>
          <tr class=" text-white bg-dark">
            <th class="indicator d-none d-md-table-cell"></th>
            <th class="text-start">{{ $t("listScreen.songName") }}</th>
            <th class="text-start d-none d-md-table-cell">{{ $t("listScreen.artistAlias") }}</th>
            <th v-if="this.game.hasGenres" class="text-start d-none d-md-table-cell">Genre</th>
            <th class="text-center text-theme-1"
                :class="{ 'd-none d-md-table-cell': this.type !== 'single' }">SN</th>
            <th v-if="this.game.hasHardSongs" class="text-center text-theme-2"
                :class="{ 'd-none d-md-table-cell': this.type !== 'single' }">SH</th>
            <th v-if="this.game.hasAnotherSongs" class="text-center text-theme-3"
                :class="{ 'd-none d-md-table-cell': this.type !== 'single' }">SA</th>
            <th v-if="this.game.hasDoubleCharts" class="text-center text-theme-1"
                :class="{ 'd-none d-md-table-cell': this.type !== 'double' }">DN</th>
            <th v-if="this.game.hasHardSongs && game.hasDoubleCharts" class="text-center text-theme-2"
                :class="{ 'd-none d-md-table-cell': this.type !== 'double' }">DH</th>
            <th v-if="this.game.hasAnotherSongs && game.hasDoubleCharts" class="text-center text-theme-3"
                :class="{ 'd-none d-md-table-cell': this.type !== 'double' }">DA</th>
            <th class="text-center">{{ $t("listScreen.favoriteShort") }}</th>
            <th class="text-center px-0">{{ $t("listScreen.targetShort") }}</th>
          </tr>
          </thead>
          <tbody v-if="!loading">
            <tr @click="showDialog(song)"
                v-for="song in setSongs" v-bind:key="song.id"
                :class="checkSongBg(song)">
              <th class="indicator d-none d-md-table-cell"
                  :class="checkSongStatus(song)">
              </th>
              <th class="text-start">
                {{ song.name }}
              </th>
              <th class="text-start d-none d-md-table-cell">{{ song.artist }}</th>
              <th v-if="this.game.hasGenres" class="text-start d-none d-md-table-cell">{{ song.genre }}</th>
              <td v-if="song.difficultyNormal > 0"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.normalClear, 'bg-theme-1': song.normalClear, 'flash': song.normalFC, 'd-none d-md-table-cell': this.type !== 'single' }">
                {{ song.difficultyNormal }}
              </td>
              <td v-else class="text-white diff-td"
                  :class="{'d-none d-md-table-cell': this.type !== 'single'}">-</td>
              <td v-if="song.difficultyHard > 0 && this.game.hasHardSongs"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.hardClear, 'bg-theme-2': song.hardClear, 'flash': song.hardFC, 'd-none d-md-table-cell': this.type !== 'single' }">
                {{ song.difficultyHard }}
              </td>
              <td v-else-if="this.game.hasHardSongs" class="text-white diff-td"
                  :class="{'d-none d-md-table-cell': this.type !== 'single'}">-</td>
              <td v-if="song.difficultyAnother > 0 && this.game.hasAnotherSongs"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.anotherClear, 'bg-theme-3': song.anotherClear, 'flash': song.anotherFC, 'd-none d-md-table-cell': this.type !== 'single' }">
                {{ song.difficultyAnother }}
              </td>
              <td v-else-if="this.game.hasAnotherSongs" class="text-white diff-td"
                  :class="{'d-none d-md-table-cell': this.type !== 'single'}">-</td>
              <td v-if="song.difficultyDoubleNormal > 0 && this.game.hasDoubleCharts"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.normalDoubleClear, 'bg-theme-1': song.normalDoubleClear, 'flash': song.normalDoubleFC, 'd-none d-md-table-cell': this.type !== 'double' }">
                {{ song.difficultyDoubleNormal }}
              </td>
              <td v-else-if="this.game.hasDoubleCharts"
                  class="text-white diff-td"
                  :class="{'d-none d-md-table-cell': this.type !== 'double'}">-</td>
              <td v-if="song.difficultyDoubleHard > 0 && this.game.hasHardSongs && this.game.hasDoubleCharts"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.hardDoubleClear, 'bg-theme-2': song.hardDoubleClear, 'flash': song.hardDoubleFC, 'd-none d-md-table-cell': this.type !== 'double' || !this.game.hasHardSongs }">
                {{ song.difficultyDoubleHard }}
              </td>
              <td v-else-if="this.game.hasHardSongs && this.game.hasDoubleCharts" class="text-white diff-td"
                  :class="{'d-none d-md-table-cell': this.type !== 'double' || !this.game.hasHardSongs}">-</td>
              <td v-if="song.difficultyDoubleAnother > 0 && this.game.hasAnotherSongs && this.game.hasDoubleCharts"
                  class="text-black diff-td"
                  :class="{ 'bg-light': !song.anotherDoubleClear, 'bg-theme-3': song.anotherDoubleClear, 'flash': song.anotherDoubleFC, 'd-none d-md-table-cell': this.type !== 'double' }">
                {{ song.difficultyDoubleAnother }}
              </td>
              <td v-else-if="this.game.hasAnotherSongs && this.game.hasDoubleCharts" class="text-white diff-td"
                  :class="{'d-none d-md-table-cell': this.type !== 'double'}">-</td>
              <td class=" diff-td pb-0" :class="{ ' text-dark': !song.favorite, 'bg-primary text-white': song.favorite }"><i class="fa favo fa-heart"></i></td>
              <td class=" diff-td pb-0" :class="{ ' text-dark': !song.target, 'bg-danger text-white': song.target }"><i class="fa favo fa-bullseye"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <add-song-modal
      @close="hideDialog"
      @addSongUser="addSongToUser"
      @number="updatePoint"
      :open="dialogIsVisible"
      :infoSong="loadInfoSong"
      :type="type"
  ></add-song-modal>
  <add-filter-modal
      @close="hideFilter"
      @addFilter="addFilter"
      :open="filterVisible"
      :current-filters="filters"
  ></add-filter-modal>
  <point-alert
      @close="hidePointAlert"
      :open="pointAlertVisible"
      :number="point"
  ></point-alert>
</template>
<script>
import AddFilterModal from "@/components/UI/AddFilterModal";
import AddSongModal from "@/components/UI/AddSongModal";
import PointAlert from "@/components/widgets/PointAlert";
export default {
  components: {AddFilterModal, AddSongModal, PointAlert},
  emits: ['loaded'],
  name: 'SongList',
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
      type: 'single',
      filterSorting: 'title',

      pointAlertVisible: false,
      point: 1,
    }
  },
  methods: {
    sortSongs(songs) {
      // Make a copy of the original array to avoid mutating it directly
      const sortedSongs = [...songs];

      // Sort the songs based on the selected sorting criteria
      switch (this.filterSorting) {
        case 'title':
          sortedSongs.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          break;
        case 'artist':
          sortedSongs.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''));
          break;
        case 'genre':
          sortedSongs.sort((a, b) => (a.genre || '').localeCompare(b.genre || ''));
          break;
        case 'normalLevel':
          sortedSongs.sort((a, b) => this.compareDifficulty(a.difficultyNormal, b.difficultyNormal));
          break;
        case 'hardLevel':
          sortedSongs.sort((a, b) => this.compareDifficulty(a.difficultyHard, b.difficultyHard));
          break;
        case 'anotherLevel':
          sortedSongs.sort((a, b) => this.compareDifficulty(a.difficultyAnother, b.difficultyAnother));
          break;
        case 'normalDoubleLevel':
          sortedSongs.sort((a, b) => this.compareDifficulty(a.difficultyDoubleNormal, b.difficultyDoubleNormal));
          break;
        case 'hardDoubleLevel':
          sortedSongs.sort((a, b) => this.compareDifficulty(a.difficultyDoubleHard, b.difficultyDoubleHard));
          break;
        case 'anotherDoubleLevel':
          sortedSongs.sort((a, b) => this.compareDifficulty(a.difficultyDoubleAnother, b.difficultyDoubleAnother));
          break;
        default:
          // Default sorting criteria, e.g., by title
          sortedSongs.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      }

      return sortedSongs;
    },
    compareDifficulty(difficultyA, difficultyB) {
      // Convert undefined or null to a value that will be sorted to the bottom
      const normalizedA = difficultyA !== undefined && difficultyA !== null && difficultyA !== '0' ? difficultyA : 100;
      const normalizedB = difficultyB !== undefined && difficultyB !== null && difficultyB !== '0' ? difficultyB : 100;
      return normalizedA - normalizedB;
    },
    changeSort(sort) {
      this.filterSorting = sort;
      this.reset();
    },
    removeFilter(filter) {
      if (filter === 'level') {
        this.filters.filterLevel = '';
      }
      if (filter === 'clear') {
        this.filters.filteredClear = '';
      }
      if (filter === 'favorite') {
        this.filters.filterFavorite = false;
      }
      if (filter === 'target') {
        this.filters.filterTarget = false;
      }
      if (filter === 'search') {
        this.searchWord = '';
      }
      this.reset();
    },
    async search() {
      if (this.searchWord.length > 2) {
        this.noFilter = false;
      }
      await this.reset();
    },
    hidePointAlert() {
      this.pointAlertVisible = false;
    },
    updatePoint(number) {
      this.point = number;
      this.pointAlertVisible = true;
    },
    clearFilter() {
      this.noFilter = true;
      this.filters = {};
      this.searchWord = '';
    },
    checkSongStatus(song) {
      if ((song.normalClear || song.difficultyNormal < 1) &&
          (song.hardClear || song.difficultyHard < 1) &&
          (song.anotherClear || song.difficultyAnother < 1)
          // &&
          // (song.normalDoubleClear || song.difficultyDoubleNormal < 1) &&
          // (song.hardDoubleClear || song.difficultyDoubleHard < 1) &&
          // (song.anotherDoubleClear || song.difficultyDoubleAnother < 1)
      ) {
        if ((song.normalFC || song.difficultyNormal < 1) &&
            (song.hardFC || song.difficultyHard < 1) &&
            (song.anotherFC || song.difficultyAnother < 1)
            // &&
            // (song.normalDoubleFC || song.difficultyDoubleNormal < 1) &&
            // (song.hardDoubleFC || song.difficultyDoubleHard < 1) &&
            // (song.anotherDoubleFC || song.difficultyDoubleAnother < 1)
        ) {
          return 'bg-primary flash';
        } else {
          return 'bg-primary';
        }
      } else {
        return '';
      }
    },
    checkSongBg(song) {
      if ((song.normalClear || song.difficultyNormal < 1) &&
          (song.hardClear || song.difficultyHard < 1) &&
          (song.anotherClear || song.difficultyAnother < 1)
          &&
          (song.normalDoubleClear || song.difficultyDoubleNormal < 1) &&
          (song.hardDoubleClear || song.difficultyDoubleHard < 1) &&
          (song.anotherDoubleClear || song.difficultyDoubleAnother < 1)
      ) {
        if ((song.normalFC || song.difficultyNormal < 1) &&
            (song.hardFC || song.difficultyHard < 1) &&
            (song.anotherFC || song.difficultyAnother < 1)
            &&
            (song.normalDoubleFC || song.difficultyDoubleNormal < 1) &&
            (song.hardDoubleFC || song.difficultyDoubleHard < 1) &&
            (song.anotherDoubleFC || song.difficultyDoubleAnother < 1)
            ) {
          return 'table-active';
        } else {
          return 'table-active';
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
          userSong.genre = song.genre;
          mergedUserSongs.push(userSong);
        } else {
          mergedUserSongs.push(song);
        }
      }

      const filteredSongs = this.addFilters(mergedUserSongs);
      const sortedSongs = this.sortSongs(filteredSongs);
      this.game = selectedGame;
      this.setSongs = sortedSongs;
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
    toggleType() {
      if (this.type === 'single') {
        this.type = 'double';
      } else {
        this.type = 'single';
      }
      this.reset();
    },
    addFilter(data) {
      if (data.filterLevel === 0 && data.filteredClear === '' && data.filterFavorite === false && data.filterTarget === false && this.searchWord === '') {
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
                !((song.artist || '').toLowerCase() + (song.composer || '').toLowerCase()).includes(searchWord)
            ) {
              matchesFilter = false;
            }
          }
          if (Object.keys(this.filters).length > 0) {
            // filter songs based on the filters
            if (this.typeIs === 'single') {
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
            } else {
              if (this.filters.filterLevel > 0) {
                if (
                    song.difficultyDoubleNormal !== this.filters.filterLevel &&
                    song.difficultyDoubleHard !== this.filters.filterLevel &&
                    song.difficultyDoubleAnother !== this.filters.filterLevel
                ) {
                  matchesFilter = false;
                }
              }
              if (this.filters.filteredClear) {
                if (this.filters.filteredClear === 'clear') {
                  if (
                      (song.difficultyDoubleNormal > 0 && !song.normalDoubleClear) ||
                      (song.difficultyDoubleHard > 0 && !song.hardDoubleClear) ||
                      (song.difficultyDoubleAnother > 0 && !song.anotherDoubleClear)
                  ) {
                    matchesFilter = false;
                  }
                } else if (this.filters.filteredClear === 'fullcombo') {
                  if (
                      !song.normalDoubleFC &&
                      !song.hardDoubleFC &&
                      !song.anotherDoubleFC
                  ) {
                    matchesFilter = false;
                  }
                } else if (this.filters.filteredClear === 'failed') {
                  if (
                      (song.difficultyDoubleNormal < 1 || song.normalDoubleClear) &&
                      (song.difficultyDoubleHard < 1 || song.hardDoubleClear) &&
                      (song.difficultyDoubleAnother < 1 || song.anotherDoubleClear)
                  ) {
                    matchesFilter = false;
                  }
                }
              }
            }
            if (this.filters.filterFavorite) {
              if (!song.favorite) {
                matchesFilter = false;
              }
            }
            if (this.filters.filterTarget) {
              if (!song.target) {
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
    typeIs() {
      return this.type;
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
    width: 12px;
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
  .max-width {
    max-width: 1100px;
  }
  tbody > tr:hover {
    opacity: 60%;
  }
  .dropdown-toggle::after {
    display: none;
  }
  .input-group {
    background-color: #dddddd18;
    border-radius: 1rem;
  }
</style>