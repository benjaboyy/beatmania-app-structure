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
            await fetch('https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/songs.json?auth=' + token)
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
        }
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