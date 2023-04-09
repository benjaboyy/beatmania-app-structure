import { createStore } from "vuex";

import gamesModule from "./games.js";
import songsModule from "./songs.js";
import userModule from "./user.js";

const store = createStore({
    modules: {
        games: gamesModule,
        songs: songsModule,
        user: userModule,
    },
    state() {
        return {
            name: 'behy',
            password: '1234',
        }
    },
});

export default store;