<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Admin Panel</h1>
        <router-link to="/submitSong" class="btn w-100 btn-light me-2 mb-2" href="#" type="button" role="button">Update Song</router-link>
        <router-link to="/submitGame" class="btn w-100 btn-light me-2 mb-2" href="#" type="button" role="button">Update Game</router-link>
        <router-link to="/submitCourse" class="btn w-100 btn-light me-2 mb-2" href="#" type="button" role="button">Update Course</router-link>
        <router-link to="/import" class="btn w-100 btn-theme-1 me-2 mb-2" href="#" type="button" role="button">Song to JSON</router-link>
        <a class="btn w-100 btn-primary me-2 mb-2" @click="testToken" href="#" type="button" role="button">Update stats</a>

  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
  props: {
    msg: String,
  },
  emits: ['select-view'],
};
</script>
