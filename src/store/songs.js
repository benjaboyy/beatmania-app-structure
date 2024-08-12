const API_BASE_URL = process.env.VUE_APP_FIREBASE_BASE_URL;
export default {
    namespaced: true,
    state() {
        return {
            songsByGame: {},
        }
    },
    mutations: {
        setSongsByGame(state, songsByGame) {
            state.songsByGame = songsByGame;
        }
    },
    actions: {
        async loadSongs(context) {
            const token = context.rootGetters.token;
            await fetch(API_BASE_URL + '/songs.json?auth=' + token)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then((data) => {
                    const songsByGame = {};
                    for (const gameKey in data) {
                        const gameData = data[gameKey];
                        songsByGame[gameKey] = [];
                        for (const songKey in gameData) {
                            const song = {
                                id: gameData[songKey].id,
                                name: gameData[songKey].name,
                                artist: gameData[songKey].artist,
                                composer: gameData[songKey].composer,
                                genre: gameData[songKey].genre,
                                difficultyNormal: gameData[songKey].difficultyNormal,
                                difficultyHard: gameData[songKey].difficultyHard,
                                difficultyAnother: gameData[songKey].difficultyAnother,
                                difficultyDoubleNormal: gameData[songKey].difficultyDoubleNormal,
                                difficultyDoubleHard: gameData[songKey].difficultyDoubleHard,
                                difficultyDoubleAnother: gameData[songKey].difficultyDoubleAnother,
                            };
                            songsByGame[gameKey].push(song);
                        }
                    }
                    context.commit('setSongsByGame', songsByGame);
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        async getGameSongs(context, gameIDArray) {
            const token = context.rootGetters.token;
            const songsByGame = {};

            for (const gameID of gameIDArray) {
                try {
                    const response = await fetch(API_BASE_URL + `/songs/${gameID}.json?auth=${token}`);

                    if (response.ok) {
                        const data = await response.json();

                        // Initialize an array for the current game if it doesn't exist
                        songsByGame[gameID] = songsByGame[gameID] || [];

                        for (const songKey in data) {
                            const song = {
                                id: data[songKey].id,
                                name: data[songKey].name,
                                artist: data[songKey].artist,
                                composer: data[songKey].composer,
                                genre: data[songKey].genre,
                                difficultyNormal: data[songKey].difficultyNormal,
                                difficultyHard: data[songKey].difficultyHard,
                                difficultyAnother: data[songKey].difficultyAnother,
                                difficultyDoubleNormal: data[songKey].difficultyDoubleNormal,
                                difficultyDoubleHard: data[songKey].difficultyDoubleHard,
                                difficultyDoubleAnother: data[songKey].difficultyDoubleAnother,
                            };
                            songsByGame[gameID].push(song);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            // Commit the changes to the state after the loop
            context.commit('setSongsByGame', songsByGame);
        },

    },
    getters: {
        getSongs(state) {
            return state.songsByGame;
        },
        getSongByID: (state) => (game, songID) => {
            const gameData = state.songsByGame[game];
            if (gameData) {
                const song = gameData.find(song => song.id === songID);
                return song;
            }
        },
        getSongsByGame: (state) => (game) => {
            const songs = [];
            const gameData = state.songsByGame[game];
            if (gameData) {
                for (const key in gameData) {
                    songs.push({
                        id: gameData[key].id,
                        name: gameData[key].name,
                        artist: gameData[key].artist,
                        composer: gameData[key].composer,
                        genre: gameData[key].genre,
                        difficultyNormal: gameData[key].difficultyNormal,
                        difficultyHard: gameData[key].difficultyHard,
                        difficultyAnother: gameData[key].difficultyAnother,
                        difficultyDoubleNormal: gameData[key].difficultyDoubleNormal,
                        difficultyDoubleHard: gameData[key].difficultyDoubleHard,
                        difficultyDoubleAnother: gameData[key].difficultyDoubleAnother,
                    });
                }
            }
            return songs;
        }
    }
}