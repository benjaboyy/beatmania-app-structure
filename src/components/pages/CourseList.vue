<template>
  <div class="container-fluid bg-dark">
    <div class="row text-center mx-md-3">
      <div class="col-12 p-0 text pt-4">
        <h1 class="text-center mb-3">{{ game.name }} <i :class="'icon ' + game.icon + ' text-primary'"></i></h1>
        <div class="pb-3">
          <a class="btn btn-primary" @click="courseDoubleSwitch" :class="courseDouble === false ? 'btn-primary' : 'btn-light'"><i class="fa fa-compact-disc"></i> Single Courses</a>
          <a class="btn btn-primary" @click="courseDoubleSwitch" :class="courseDouble === true ? 'btn-primary' : 'btn-light'"><i class="fa fa-compact-disc"></i> <i class="fa fa-compact-disc"></i> Double Courses</a>
        </div>
        <div class="container-fluid">
          <div class="row">

            <!--TODO: Courses Cards-->
            <div v-for="course in setCourses" :key="course.id">
              <div v-if="course.type === getType" class="col-12 col-md-6 col-lg-4 col-xxl-3 mb-3">
                <div class="card border-primary">
                  <div class="card-header bg-primary">
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9 text-start">
                        <h2 class="text-dark mb-2">{{ course.name }}</h2>
                        <span v-for="n in 5" :key="n">
                          <i class="fa fa-star h4" :class="n <= course.rating ? 'text-primary' : 'text-light'"></i>
                        </span>
                      </div>
                      <div class="col-3">
                        <div class="bg-primary w-100 h-100 d-flex">
                          <span class="text-white fw-bolder header-text m-auto">A</span>
                        </div>
                      </div>
                    </div>
                    <hr>
                    <table class="w-100 text-start table table-borderless table-sm mb-0">
                      <tr v-for="(song, index) in course.songIDs" :key="song.id">
                        <td style="width: 10px">#{{ index + 1 }}</td>
                        <th class="w-50">{{ song.name }}</th>
                        <th class="text-end">
                          <span class="text-white p-2 px-3" :class="setBG(song.diff)">{{ song.value }}</span>
                        </th>
                      </tr>
                    </table>
                    <!--                  update button-->
                    <div class="text-start mt-2">
                      <button class="btn btn-primary btn-sm" @click="showDialog(course)">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
<!--TODO: Courses update modal-->
  <add-course-modal
      @close="hideDialog"
      @addSongUser="addSongToUser"
      :open="dialogIsVisible"
      :infoSong="loadInfoSong"
  ></add-course-modal>
</template>
<script>
export default {
  components: {},
  emits: ['loaded'],
  name: 'CourseList',
  data() {
    return {
      game: '',
      setCourses: [],
      dialogIsVisible: false,
      filterVisible: false,
      infoSong: {},
      filters: {},
      isLoaded: false,
      loading: false,
      noFilter: true,
      searchWord: '',
      courseDouble: false,
    }
  },
  methods: {
    courseDoubleSwitch() {
      this.courseDouble = !this.courseDouble;
    },
    setBG(value) {
      if (value === 'difficultyHard') {
        return { 'bg-theme-1': true };
      } else if (value === 'difficultyNormal') {
        return { 'bg-theme-2': true };
      } else {
        return { 'bg-theme-3': true };
      }
    },
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
    async loadPage(selectedGame, theCourses) {
      this.loading = true;
      const userCourseAddition = await this.getUserCourses();
      const mergedUserCourses = [];
      for (const song of theCourses) {
        const userSong = userCourseAddition.find((sung) => sung.id == song.id);
        if (userSong) {
          userSong.name = song.name;
          mergedUserCourses.push(userSong);
        } else {
          mergedUserCourses.push(song);
        }
      }

      this.game = selectedGame;
      this.setCourses = mergedUserCourses;
      this.loading = false;
    },
    async getUserCourses() {
      return await this.$store.getters['getUserCourses'];
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
      await this.$store.dispatch('addCourseToUser', data);
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
      const songsToLoad = await this.$store.getters['courses/getCourseByGame'](this.gameID);
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
    getType() {
      if (this.courseDouble) {
        return 'doubles';
      } else {
        return 'singles';
      }
    },
  },
  created() {
    this.reset();
  },
  watch: {
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
  .bg-difficultyHard {
    background-color: #ff0000;
  }
  .bg-difficultyNormal {
    background-color: #00ff00;
  }
  .bg-difficultyAnother {
    background-color: #0000ff;
  }
</style>