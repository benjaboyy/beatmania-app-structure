export default {
    namespaced: true,
    state() {
        return {
            courseByGame: {},
        }
    },
    mutations: {
        setCourseByGame(state, courseByGame) {
            state.courseByGame = courseByGame;
        }
    },
    actions: {
        async loadCourses(context) {
            const token = context.rootGetters.token;
            await fetch('https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/cources.json?auth=' + token)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then((data) => {
                    const courseByGame = {};
                    for (const gameKey in data) {
                        const gameData = data[gameKey];
                        courseByGame[gameKey] = [];
                        for (const courceKey in gameData) {
                            const song = {
                                id: gameData[courceKey].id,
                                name: gameData[courceKey].name,
                                rating: gameData[courceKey].rating,
                                songIDs: gameData[courceKey].songIDs,
                                type: gameData[courceKey].type,
                            };
                            courseByGame[gameKey].push(song);
                        }
                    }
                    context.commit('setCourseByGame', courseByGame);
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    },
    getters: {
        getCourses(state) {
            return state.courseByGame;
        },
        getCourseByGame: (state) => (game) => {
            const cources = [];
            const gameData = state.courseByGame[game];
            if (gameData) {
                for (const key in gameData) {
                    cources.push({
                        id: gameData[key].id,
                        name: gameData[key].name,
                        rating: gameData[key].rating,
                        songIDs: gameData[key].songIDs,
                        type: gameData[key].type,
                    });
                }
            }
            return cources;
        }
    }
}