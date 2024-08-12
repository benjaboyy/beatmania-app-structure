const API_BASE_URL = process.env.VUE_APP_FIREBASE_BASE_URL;
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
            await fetch(API_BASE_URL + '/courses.json?auth=' + token)
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
                        for (const courseKey in gameData) {
                            const course = {
                                id: gameData[courseKey].id,
                                name: gameData[courseKey].name,
                                rating: gameData[courseKey].rating,
                                songIDs: gameData[courseKey].songIDs,
                                type: gameData[courseKey].type,
                                onlySinglePlayer: gameData[courseKey].onlySinglePlayer,
                            };
                            courseByGame[gameKey].push(course);
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
            const courses = [];
            const gameData = state.courseByGame[game];
            if (gameData) {
                for (const key in gameData) {
                    courses.push({
                        id: gameData[key].id,
                        name: gameData[key].name,
                        rating: gameData[key].rating,
                        songIDs: gameData[key].songIDs,
                        type: gameData[key].type,
                        onlySinglePlayer: gameData[key].onlySinglePlayer,
                    });
                }
            }
            return courses;
        }
    }
}