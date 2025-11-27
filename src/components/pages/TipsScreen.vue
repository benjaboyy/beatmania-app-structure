<template>
  <div class="stats-screen px-2 px-md-5 m-auto mb-5">
    <h1 class="text-center my-4">{{ $t('tips.tipsForUsers') }}</h1>
    <div class="card">
      <div class="card-body">
        <h3>{{ $t('tips.findInfo') }}</h3>
        <div class="accordion my-4" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                {{ $t('tips.whatIsApp') }}
              </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <p>
                  {{ $t('about.trackerApp') }}<br>
                  {{ $t('tips.notAGame') }}
                </p>
                <h5>{{ $t('about.gamesSupported') }}</h5>
                <ul>
                  <li v-for="game in games" :key="game.id">
                    {{ game.name }} <br>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseHow" aria-expanded="false" aria-controls="collapseHow">
                {{ $t('about.howToSubmit') }}
              </button>
            </h2>
            <div id="collapseHow" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <img src="../../assets/img/howto.png" class="w-100" alt="">
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                {{ $t('tips.bestWay') }}
              </button>
            </h2>
            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <strong>{{ $t('tips.singleSongs') }}</strong> <br>
                Search for the song you want to play, then select it. View the song details, including available difficulty levels. Play the song and enter your score when finished. <br>
                <br>
                <strong>{{ $t('tips.fullCourses') }}</strong> <br>
                Search for the course you want to play, then select it. View the course details and a list of songs included in the course. Play through each song in the course and enter your score for each one. <br>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                {{ $t('tips.arcadeCodeRanking') }}
              </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                {{ $t('tips.arcadeCodeInfo') }} <br>
                when you play at a new arcade, you can add it to the app, your progress will be to the ranking for that arcade. <br>
                <br>
                {{ $t('tips.arcadeNotListed') }}
                {{ $t('tips.arcadesOnRequest') }} <br>
                <router-link to="/arcade" class="btn btn-outline-primary me-2 mt-2"><i class="fas fa-trophy me-2"></i> {{ $t('menu.arcadeRanking') }}</router-link>
            </div>
          </div>
        </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                {{ $t('tips.tipScorePictures') }}
              </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                {{ $t('tips.scoreShownShort') }} <br>
                {{ $t('tips.uploadEndSession') }} <br>              </div>
            </div>
          </div>
        </div>
        <router-link to="/" class="btn btn-primary mb-2 me-2" href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> {{ $t("menu.back") }}</router-link>
        <router-link to="/about" class="btn btn-primary mb-2" href="#" type="button" role="button" exact><i class="fa fa-question me-2"></i> {{ $t('menu.aboutAndInfo') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TipsScreen',
  props: {
    msg: String,
  },
  emits: ['select-view'],
  computed: {
    games() {
      return this.$store.getters['games/getGames'];
    },
  }
};
</script>

<style scoped>
.accordion {
  max-width: 600px;
}
.stats-screen {
  max-width: 900px;
}
</style>
