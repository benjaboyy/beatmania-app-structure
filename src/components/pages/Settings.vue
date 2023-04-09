<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">Account settings</h1>
    <div class="card bg-dark text-white">
      <div class="card-body">
        <h3>Game select</h3>
        <div id="emailHelp" class="form-text">Choose the games you want to track.</div>
        <div class="card mb-2">
          <div class="card-body card-mix--choices">
            <h5 class=" text-dark">Beatmania The Final <i class="icon icon-5k text-primary"></i></h5>
            <input type="checkbox" class="btn-check" id="btn-check-outlined" autocomplete="off">
            <label class="btn btn-outline-primary me-1" for="btn-check-outlined">SP</label>
            <input type="checkbox" class="btn-check" id="btn-check-outlined2" autocomplete="off">
            <label class="btn btn-outline-primary me-1" for="btn-check-outlined2">DP</label>
            <input type="checkbox" class="btn-check" id="btn-check-outlined3" autocomplete="off">
            <label class="btn btn-outline-primary me-1" for="btn-check-outlined3">SC</label>
            <input type="checkbox" class="btn-check" id="btn-check-outlined4" autocomplete="off">
            <label class="btn btn-outline-primary me-1" for="btn-check-outlined4">DC</label>
          </div>
        </div>
        <div class="card mb-2">
          <div class="card-body card-mix--choices">
            <h5 class=" text-dark">Beatmania IIDX 26 Rootage <i class="icon icon-7k text-primary"></i></h5>
            <input type="checkbox" class="btn-check" id="btn-check-outlined5" autocomplete="off">
            <label class="btn btn-outline-primary me-1" for="btn-check-outlined5">SP</label>
            <input type="checkbox" class="btn-check" id="btn-check-outlined6" autocomplete="off">
            <label class="btn btn-outline-primary me-1" for="btn-check-outlined6">DP</label>
            <input type="checkbox" class="btn-check" id="btn-check-outlined7" autocomplete="off">
            <label class="btn btn-outline-primary me-1" for="btn-check-outlined7">SC</label>
            <input type="checkbox" class="btn-check" id="btn-check-outlined8" autocomplete="off">
            <label class="btn btn-outline-primary me-1" for="btn-check-outlined8">DC</label>
          </div>
        </div>
        <h3>Account details</h3>
        <div class="mb-3">
          <label for="exampleInputEmail1" class="form-label">Username</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input type="email" class="form-control" id="email" aria-describedby="emailHelp">
        </div>
        <div class="mb-3">
          <label for="Select" class="form-label">Favorite Game</label>
          <select id="Select" class="form-select">
            <option>Disabled select</option>
          </select>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsScreen',
  props: {
    msg: String
  }
}
</script>
