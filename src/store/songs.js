const API_BASE_URL = process.env.VUE_APP_FIREBASE_BASE_URL;

function mapSongData(songData) {
    return {
        id: songData.id,
        name: songData.name,
        artist: songData.artist,
        composer: songData.composer,
        genre: songData.genre,
        difficultyEasy: songData.difficultyEasy,
        difficultyNormal: songData.difficultyNormal,
        difficultyHard: songData.difficultyHard,
        difficultyAnother: songData.difficultyAnother,
        difficultyDoubleNormal: songData.difficultyDoubleNormal,
        difficultyDoubleHard: songData.difficultyDoubleHard,
        difficultyDoubleAnother: songData.difficultyDoubleAnother,
    };
}

export default {
    namespaced: true,
    state: () => ({
        songsByGame: {},
    }),
    mutations: {
        setSongsByGame(state, songsByGame) {
            state.songsByGame = songsByGame;
        },
    },
    actions: {
        async loadSongs({ commit, rootGetters }) {
            try {
                const token = rootGetters.token;
                const response = await fetch(`${API_BASE_URL}/songs.json?auth=${token}`);
                if (!response.ok) throw new Error('Failed to fetch songs');

                const data = await response.json();
                const songsByGame = Object.fromEntries(
                    Object.entries(data).map(([gameKey, gameData]) => [
                        gameKey,
                        Object.values(gameData).map(mapSongData),
                    ])
                );

                commit('setSongsByGame', songsByGame);
            } catch (error) {
                console.error(error);
            }
        },

        async getGameSongs({ commit, rootGetters }, gameIDArray) {
            try {
                const token = rootGetters.token;
                const songsByGame = {};

                for (const gameID of gameIDArray) {
                    const response = await fetch(`${API_BASE_URL}/songs/${gameID}.json?auth=${token}`);
                    if (response.ok) {
                        const data = await response.json();
                        songsByGame[gameID] = Object.values(data).map(mapSongData);
                    }
                }

                commit('setSongsByGame', songsByGame);
            } catch (error) {
                console.error(error);
            }
        },
    },
    getters: {
        getSongs: (state) => state.songsByGame,
        getSongByID: (state) => (game, songID) => {
            const gameData = state.songsByGame[game] || [];
            return gameData.find(song => song.id === songID);
        },
        getSongsByGame: (state) => (game) => {
            return state.songsByGame[game] || [];
        },
    },
};
