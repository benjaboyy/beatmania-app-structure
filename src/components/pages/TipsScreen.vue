<template>
  <div class="stats-screen px-2 px-md-5 m-auto mb-5">
    <h1 class="text-center my-4">Tips for users</h1>
    <div class="card">
      <div class="card-body">
        <h3>Find info on how to use this app</h3>

        <div class="accordion my-4" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                What is this app?
              </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <p>
                  A app is designed to enhance your arcade experience by providing a simple way to track your progress and scores in multiple rhythm games which do not support tracking native.
                  <br>
                  It is not a game, but a tool.
                </p>
                <h5>Games supported:</h5>
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
                How to submit
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
                Best way to use this app
              </button>
            </h2>
            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <strong>Single songs:</strong> <br>
                Search for the song you want to play and click on it. <br>
                You will see the song info and the difficulty levels. <br>
                Play the song and enter your score. <br>
                <br>
                <strong>Full courses:</strong> <br>
                Search for the course you want to play and click on it. <br>
                You will see the course info and the songs in the course. <br>
                Play the course and enter your score for each song. <br><br>

                The app will save your score and calculate your progress. <br>
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Arcade Code an Ranking
              </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                The arcade code is used to link your account to the arcade you play at, you can find the code at the arcade. <br>
                when you play at a new arcade, you can add it to the app, your progress will be to the ranking for that arcade. <br>
                <br>
                Is your arcade not listed?
                Arcades can be added on request. <br>
                <router-link to="/arcade" class="btn btn-outline-primary me-2 mt-2"><i class="fas fa-trophy me-2"></i> Arcade Ranking</router-link>
            </div>
          </div>
        </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                TIP: Take score pictures
              </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                Since the sore is shown for a short period in some game, make sure to take a picture. <br>
                Uploading them at the end of your play session is the easiest way to make sure you don't forget/miss any scores. <br>              </div>
            </div>
          </div>
        </div>

        <router-link to="/" class="btn btn-primary mb-2 me-2" href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> {{ $t("menu.back") }}</router-link>
        <router-link to="/about" class="btn btn-primary mb-2" href="#" type="button" role="button" exact><i class="fa fa-question me-2"></i> About & Info</router-link>
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
