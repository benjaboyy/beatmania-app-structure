<template>
  <div class="container-fluid bg-dark">
    <div class="row text-center mx-md-3">
      <div class="col-12 p-0 text pt-4">
        <h1 class="text-center mb-2">{{ game.name }} <i :class="'icon ' + game.icon + ' text-primary'"></i></h1>
        <div class="container">
          <div class="row mb-2">
            <div v-if="game.hasDoubleCharts" class="pb-2 col-12">
              <a class="btn btn-primary" @click="courseDoubleSwitch" :class="courseDouble === false ? 'btn-primary' : 'btn-light'"><i class="fa fa-compact-disc"></i> {{ $t("filter.singles") }}</a>
              <a class="btn btn-primary" @click="courseDoubleSwitch" :class="courseDouble === true ? 'btn-primary' : 'btn-light'"><i class="fa fa-compact-disc"></i> <i class="fa fa-compact-disc"></i> {{ $t("filter.doubles") }}</a>
              <a class="btn ms-2 btn-primary" @click="toggleFilter" :class="toggleFilted === true ? 'btn-primary' : 'btn-light'"><i class="fa fa-filter"></i></a>
            </div>
            <div v-if="toggleFilted" class="pb-2 col-12">
              <div id="emailHelp" class="form-text">{{ $t("filter.filterOn") }}:</div>
              <a class="btn btn-primary" @click="courseFilterCleared" :class="filterCleared === true ? 'btn-primary' : 'btn-light'"><i class="fa fa-check"></i> {{ $t("filter.cleared") }}</a>
              <a class="btn btn-primary" @click="courseFilterFailed" :class="filterFailed === true ? 'btn-primary' : 'btn-light'"><i class="fa fa-times"></i> {{ $t("filter.failed") }}</a>
              <a class="btn btn-primary" @click="courseFilterFC" :class="filterFC === true ? 'btn-primary' : 'btn-light'"><i class="fas fa-crosshairs"></i> {{ $t("filter.fullCombo") }}</a>
              <a class="btn btn-primary" @click="courseFilterGrade" :class="filterGrade === true ? 'btn-primary' : 'btn-light'"><i class="fas fa-graduation-cap"></i> {{ $t("filter.grade") }}</a>
              <a class="btn btn-primary" @click="courseFilterScore" :class="filterScore === true ? 'btn-primary' : 'btn-light'"><i class="fas fa-star"></i> {{ $t("filter.score") }}</a>
            </div>
          </div>
        </div>
        <div class="container-fluid">
          <div class="row">

            <!--TODO: Courses Cards-->
            <div v-for="course in filteredsetCourses" :key="course.id" class="col-12 col-md-6 col-lg-4 col-xxl-3 mb-3">
              <span>
                <div :class="course.clear ? ' ' : 'opacity-down'" class="card h-100 border-primary">
                  <div class="card-header bg-primary">
                  </div>
                  <div class="card-body">
                    <div class="row g-0">
                      <div class="col-9 text-start">
                        <h2 class="text-dark mb-2">{{ course.name }}</h2>
                        <span v-for="n in 5" :key="n">
                          <i class="fa fa-star h4" :class="n <= course.rating ? 'text-primary' : 'text-light'"></i>
                        </span>
                        <div v-if="course.score">
                          <h6 class="text-dark mb-0 mt-1"><b>{{ $t("filter.score") }}:</b> <span class="text-primary">{{ course.score }}</span></h6>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class=" w-100 h-100 d-flex grade-border"
                        :class="course.FC ? 'border-primary flash' : course.clear ? 'border-primary' : 'border-secondary'">
                          <span class="text-primary fw-bolder header-text m-auto">
                              <span v-if="course.clear || course.grade">
                                <h6 v-if="course.FC && !course.grade" class="m-0">{{ $t("listScreen.fullComboCap") }}</h6>
                                <h6 v-if="course.clear && !course.FC && !course.grade" class="m-0">{{ $t("filter.cleared") }}</h6>
                                <span v-if="course.grade">
                                  <span v-if="course.FC" class="text-primary">{{ $t("filter.fullComboShort") }}</span>
                                  <span v-if="course.grade">{{ course.grade }}</span>
                                </span>
                              </span>
                              <span v-else class="text-secondary">-</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="transition" v-if="course.show">
                      <hr>
                      <table class="w-100 text-start table table-borderless table-sm mb-0">
                        <tr v-for="(song, index) in course.songIDs" :key="song.id">
                          <td style="width: 10px">#{{ index + 1 }}</td>
                          <th class="w-75 p-2">{{ song.name }}</th>
                          <td class="text-end">
                            <span class="text-white p-2 px-3" :class="setBG(song.diff)">{{ song.value }}</span>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!-- update button-->
                    <div class="row g-3 mt-2">
                      <div class="col-6">
                        <div class="d-grid gap-2">
                          <button class="btn btn-secondary btn-sm btn-block" @click="showDialog(course)"><i class="fa fa-edit me-1"></i> {{ $t("filter.update") }}</button>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="d-grid gap-2">
                          <button
                              class="btn btn-sm btn-block"
                              @click="course.show = !course.show"
                              :class="course.show === true ? 'btn-primary' : 'btn-secondary'"
                              data-bs-toggle="collapse"
                              :data-bs-target="'#collapseSongs-' + course.id"
                              aria-expanded="false"
                              :aria-controls="'collapseSongs-' + course.id"
                              ><i :class="course.show === true ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                              {{ $t("filter.show") }}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
<!--TODO: Courses update modal-->
  <add-course-modal
      @close="hideDialog"
      @addCourseToUser="addCourseToUser"
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
      filterCleared:  false,
      filterFailed: false,
      filterFC: false,
      filterGrade: false,
      filterScore: false,
      toggleFilted: false,
      infoSong: {},
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
    //TODO: Make filters code efficient
    courseFilterCleared() {
      this.filterCleared = !this.filterCleared;
      if (this.filterCleared) {
        this.filterFailed = false;
      }
    },
    courseFilterFailed() {
      this.filterFailed = !this.filterFailed;
      if (this.filterFailed) {
        this.filterCleared = false;
      }
    },
    courseFilterFC() {
      this.filterFC = !this.filterFC;
    },
    courseFilterGrade() {
      this.filterGrade = !this.filterGrade;
    },
    courseFilterScore() {
      this.filterScore = !this.filterScore;
    },
    toggleFilter() {
      this.toggleFilted = !this.toggleFilted;
    },
    //end filters
    setBG(value) {
      if (value === 'difficultyNormal') {
        return { 'bg-theme-1': true };
      } else if (value === 'difficultyHard') {
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
          userSong.type = song.type;
          userSong.rating = song.rating;
          userSong.songIDs = song.songIDs;
          userSong.show = false;
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
    hideDialog() {
      this.dialogIsVisible = false;
    },
    async addCourseToUser(data) {
      await this.$store.dispatch('addCourseToUser', data);
      await this.reset();
    },
    async reset() {
      this.isLoaded = true;
      const coursesToLoad = await this.$store.getters['courses/getCourseByGame'](this.gameID);
      const selectedGame = await this.$store.getters['games/getGames'].find((game) => game.id == this.gameID);
      await this.loadPage(selectedGame, coursesToLoad);
      this.$emit('loaded', true);
      this.isLoaded = false;
    },
    loadSongs() {
      this.$store.dispatch('songs/loadSongs');
    },
    loadCourse() {
      this.$store.dispatch('courses/loadCourses');
    },
  },
  computed: {
    getType() {
      if (this.courseDouble) {
        return 'doubles';
      } else {
        return 'singles';
      }
    },
    filteredsetCourses () {
      let filteredCourses = this.setCourses;
      if (this.filterCleared) {
        filteredCourses = filteredCourses.filter(course => course.clear);
      }
      if (this.filterFailed) {
        filteredCourses = filteredCourses.filter(course => !course.clear);
      }
      if (this.filterFC) {
        filteredCourses = filteredCourses.filter(course => course.FC);
      }
      if (this.filterGrade) {
        filteredCourses = filteredCourses.filter(course => course.grade);
      }
      if (this.filterScore) {
        filteredCourses = filteredCourses.filter(course => course.score);
      }
      if (this.courseDouble) {
        filteredCourses = filteredCourses.filter(course => course.type === 'doubles');
      } else {
        filteredCourses = filteredCourses.filter(course => course.type === 'singles');
      }
      return filteredCourses;
    },
    loadInfoSong() {
      return this.infoSong;
    },
  },
  created() {
    this.reset();
  },
  watch: {
    gameID: function(newVal) {
      this.loadCourse(newVal);
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
  tr,  td {
    padding: 0 !important;
    padding-top: 5px !important;
    padding-bottom: 5px !important;
  }
  .header-text {
    font-size: 1.5rem;
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
  .grade-border {
    border: 3px solid;
  }
  .card-header {
    padding: 4px;
  }
  .opacity-down {
    opacity: 73%;
  }
  .transition {
    transition: 1s;

  }

</style>