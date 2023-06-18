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
                    <div class="row g-0">
                      <div class="col-9 text-start">
                        <h2 class="text-dark mb-2">{{ course.name }}</h2>
                        <span v-for="n in 5" :key="n">
                          <i class="fa fa-star h4" :class="n <= course.rating ? 'text-primary' : 'text-light'"></i>
                        </span>
                      </div>
                      <div class="col-3">
                        <div class=" w-100 h-100 d-flex grade-border"
                        :class="course.clear ? 'border-primary' : 'border-secondary'">
                          <span class="text-primary fw-bolder header-text m-auto">
                              <span v-if="course.clear || course.grade">
                                <h6 v-if="course.FC" class="m-0">FULL-COMBO</h6>
                                <h6 v-if="course.clear && !course.FC" class="m-0">CLEAR</h6>
                                <div v-if="course.grade">
                                  <span v-if="course.grade">{{ course.grade }}</span>
                                </div>
                              </span>
                              <span v-else class="text-secondary">-</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="collapse" :id="'collapseSongs-' + course.id">
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
                          <button class="btn btn-secondary btn-sm btn-block" @click="showDialog(course)"><i class="fa fa-edit me-1"></i> Update</button>
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
                              Show</button>
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
          userSong.type = song.type;
          userSong.rating = song.rating;
          userSong.songIDs = song.songIDs;
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
  .grade-border {
    border: 3px solid;
  }
</style>