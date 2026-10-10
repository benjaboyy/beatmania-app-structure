import { createStore } from "vuex";

import gamesModule from "./games.js";
import songsModule from "./songs.js";
import userModule from "./user.js";
import coursesModule from "./courses.js";
import arcadesModule from "./arcades.js";
import challengesModule from "./challenges.js";

const store = createStore({
    modules: {
        games: gamesModule,
        songs: songsModule,
        user: userModule,
        courses: coursesModule,
        arcades: arcadesModule,
        challenges: challengesModule,
    },
    state() {
        return {
            name: 'behy',
            password: '1234',
        }
    },
});

export default store;
