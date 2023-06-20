<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Tips for users</h1>
    <div class="card">
      <div class="card-body">
        <h3>The app</h3>
        <p>
          This app is designed to help you keep track of your progress in Beatmania. <br>
          It is not a game, but a tool to help you keep track of your progress in the game. <br>
        </p>
          <h5>Progress pictures</h5>
        <p>
          Since the sore is shown for a short period in some game, make sure to take a picture. <br>
          Uploading them at the end of your play session is the easiest way to keep track of your progress. <br>
        </p>
        <h5>Set to homescreen</h5>
        <p>
          Set the app to your homescreen of your phone or tablet. <br>
          Go to menu and select "Add to homescreen". <br>
          than you can use the app as a normal app. <br>
        </p>
        <h5>Arcade Code</h5>
        <p class="text-secondary">
          <i>Coming soon. . .</i> <br>
        </p>

        <router-link to="/" class="btn btn-primary mb-2 me-2" href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> Back</router-link>
        <router-link to="/" class="btn btn-primary mb-2" href="#" type="button" role="button" exact><i class="fa fa-question me-2"></i> About & Info</router-link>
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
};
</script>
