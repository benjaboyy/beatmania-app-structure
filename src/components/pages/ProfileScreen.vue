<template>
  <div class="stats-screen px-2 px-md-5 m-auto mb-5">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col mt-4 col-lg-6">
            <div class="card">
              <div class="card-body p-4">
                <div class="d-flex text-black">
                  <div class="flex-shrink-0">
                    <img v-if="player.profileUrl"  :src="player.profileUrl"
                         alt="Generic placeholder image" class="img-fluid"
                         style="width: 180px; border-radius: 10px;">
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h5 class="mb-1">{{ player.name }}</h5>
                    <div class="d-flex justify-content-start rounded-3 p-2 mb-2"
                         style="background-color: #efefef;">
                      <div>
                        <p class="small text-muted mb-1">Points</p>
                        <p class="mb-0">{{ calculateTotalPoints }}</p>
                      </div>
                      <div class="px-3">
                        <p class="small text-muted mb-1">Games</p>
                        <p class="mb-0">{{ calculateTotalGames }}</p>
                      </div>
                      <div>
                        <p class="small text-muted mb-1">Rating</p>
                        <p class="mb-0">8.5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

    <h2 class="text-center my-3">Tracked games</h2>
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col col-lg-6">
    <!--        example player data:-->
    <!--        {"name":"Behy","profileUrl":"https://i0.wp.com/www.deschuurr.nl/wp-content/uploads/2023/03/IMG_20230312_175249_944.jpg","trackedGames":{"beatmania":{"courses":0,"doubleCourse":false,"doubles":0,"doublesSet":false,"singleCourse":false,"singles":0,"singlesSet":false,"total":0},"beatmania6thmix+coreremix":{"courses":0,"doubleCourse":false,"doubles":0,"doublesSet":false,"singleCourse":false,"singles":0,"singlesSet":false,"total":0},"beatmaniagb":{"courses":5,"doubleCourse":false,"doubles":0,"singleCourse":true,"singles":12,"singlesSet":true,"total":17},"beatmaniawonderswanq":{"courses":0,"doubleCourse":false,"doubles":0,"doublesSet":false,"singleCourse":false,"singles":4,"singlesSet":true,"total":4},"crackindjpart2":{"courses":0,"doubleCourse":false,"doubles":0,"doublesSet":false,"singleCourse":false,"singles":9,"singlesSet":true,"total":9},"popnmusicgb":{"courses":0,"doubleCourse":false,"doubles":0,"doublesSet":false,"singleCourse":false,"singles":0,"singlesSet":false,"total":0},"thefinal":{"courses":55,"doubleCourse":false,"doubleCourseSet":false,"doubles":56,"doublesSet":true,"singleCourse":true,"singleCourseSet":false,"singles":411,"singlesSet":true,"total":522}}}-->
            <div v-for="(value, key) in player" :key="key">
              <div v-if="key === 'trackedGames'">
                <table class="table mb-0 bg-light rounded">
                  <tbody>
                  <tr v-for="(game, gameKey) in value" :key="gameKey">
                    <td v-if="game.total > 0">
                      <img v-if="getGamePlaystyle(gameKey) === 'Playstation'" src="../../assets/svg/playstation.svg" class="icon" alt="arcade-icon">
                      <img v-else-if="getGamePlaystyle(gameKey) === 'Arcade'" src="../../assets/svg/arcade.svg" class="icon" alt="arcade-icon">
                      <img v-else-if="getGamePlaystyle(gameKey) === 'Gameboy'" src="../../assets/svg/gameboy.svg" class="icon" alt="arcade-icon">
                      <img v-else-if="getGamePlaystyle(gameKey) === 'Wonderswan'" src="../../assets/svg/wonder.svg" class="icon" alt="arcade-icon">
                      {{ getGameName(gameKey) }}
                    </td>
                    <td v-if="game.total > 0" class="text-end text-primary"><b>{{ game.total }}</b></td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
import info from '@/assets/locales/info.js' // import common locale messages
export default {
  name: 'AdminUs',
  props: {
    msg: String,
  },
  data() {
    return {
      arcadeID: '',
      player: '',
      loading: false,
    };
  },
  async created() {
    this.loading = true;
    await this.$store.dispatch('arcades/loadArcades');
    await this.$store.dispatch('songs/loadSongs');
    this.arcadeID = this.$route.params.userID;
    this.player = await this.$store.dispatch('loadUserStats', this.arcadeID);
    this.loading = false;
  },
  emits: ['select-view'],
  methods: {
    toggleLanguage() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'ja' : 'en';
    },
    getGameName(gameID) {
      return this.$store.getters['games/getGameName'](gameID);
    },
    getGamePlaystyle(gameID) {
      return this.$store.getters['games/getGamePlayStyle'](gameID);
    },
  },
  computed: {
    games() {
      return this.$store.getters['games/getGames'];
    },
    calculateTotalGames() {
      return Object.keys(this.player.trackedGames).length;
    },
    calculateTotalPoints() {
      let total = 0;
      for (const game in this.player.trackedGames) {
        total += this.player.trackedGames[game].total;
      }
      return total;
    },
  },
  i18n: {
    sharedMessages: info
  }
};
</script>

<style scoped>
  .float-left {
    float: right;
  }
  .img-fluid {
    object-fit: cover;
    aspect-ratio: 1/1;
  }
  .flex-shrink-0 {
    width: 45%;
    max-width: 180px;
  }
  .select-lang {
    cursor: pointer;
  }
  .icon {
    width: 30px;
    height: 30px;
  }
</style>
