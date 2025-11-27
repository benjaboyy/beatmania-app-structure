<template>
  <div class="stats-screen px-2 px-md-5 m-auto">
    <h1 class="text-center my-4">{{ $t('users.usersList') }}</h1>
    <div class="container">
      <div class="row d-flex">
        <div class="col-12 col-md-5 mx-auto">
          <div class="card">
            <div class="card-body">
              <table class="table table-small">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{{ $t('users.name') }}</th>
                    <th>{{ $t('users.lastLogin') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, index) in sortLastLogin" :key="user.id">
                    <td>{{ index + 1 }}</td>
                    <td><a :href="'/user/' + user.id">{{ user.name }}</a></td>
                    <td>{{ user.lastLogin }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsersView',
  data() {
    return {
      users: []
    }
  },
  props: {
    msg: String,
  },
  created() {
    this.getUsers();
  },
  computed: {
    sortLastLogin() {
      return [...this.users].sort((a, b) => {
        const dateA = new Date(a.lastLogin);
        const dateB = new Date(b.lastLogin);

        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;

        return dateB - dateA; // Sort by date descending
      });
    }
  },
  methods: {
    async getUsers() {
      const token = this.$store.getters.token;
      const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`);
      const data = await response.json();
      // Populate the users array
      const users = [];
      for (let key in data) {
        const user = data[key];
        users.push({
          id: key,
          name: user.name,
          lastLogin: user.lastLogin,
        });
      }

      // Update this.users with the fetched data
      this.users = users;
    }
  }
};
</script>

<style scoped>
td:hover {
  background-color: white !important;
  color: black !important;
}
</style>