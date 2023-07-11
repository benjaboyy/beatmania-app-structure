<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">About the app</h1>
    <div class="card">
      <div class="card-body">
        <h3>Beatmania Progress Tracker App</h3>
        <p>Welcome to the Beatmania Progress Tracker App,<br>
          A app is designed to enhance your arcade experience by providing a simple way to track your progress and scores in the rhythm game, Beatmania.
          This app is to help you stay organized and motivated on your Beatmania journey.
          I have developed this app free and open-source, to provide a tool for Beatmania players.
        </p>
          <h5>Key Features:</h5>
      <ul>
        <li>Progress Tracking: Keep track of your scores and progress in Beatmania.</li>
        <li>User-Friendly: Intuitive interface, making it easy to navigate and use.</li>
      </ul>
        <p>Set the app to your homescreen or use the website and start tracking your progress in Beatmania!</p>
        <div class="mb-2">
          <button class="btn btn-outline-primary me-2" disabled><i class="fa fa-mobile-alt me-2"></i> Add to homescreen</button>
          <a href="https://github.com/benjaboyy/beatmania-app-structure" class="btn btn-outline-primary"><i class="fab fa-github me-2"></i> Github</a>
        </div>
        <p>For any questions or feedback, <br>please reach out to us at <a href="mailto:benjaboyy@hotmail.nl">benjaboyy@hotmail.nl</a>.
          <br>We value your input and are continuously working to improve the app for the community. <br><br>
            Brought you by <a href="https://deschuurr.nl/?lang=en">deschuurr.nl</a>
          </p>
        <p>
          The app is not affiliated with Konami or any other company.
        </p>
        <router-link to="/" class="btn btn-primary mb-2" href="#" type="button" role="button" exact><i class="fa fa-home me-2"></i> Back</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUs',
  props: {
    msg: String,
  },
  emits: ['select-view'],
};
</script>
