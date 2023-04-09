export default {
    namespaced: true,
    state() {
        return {
            games: [],
        };
    },
    getters: {
        getGames(state) {
            return state.games;
        }
    },
    mutations: {
        setGames(state, payload) {
            state.games = payload;
        },
    },
    actions: {
        async fetchGameSongs(context) {
            const token = context.rootGetters.token;
            const fetchedSongs = await fetch('https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/games.json?auth=' + token);
            const responseData = await fetchedSongs.json();

            if (!fetchedSongs.ok) {
                const error = new Error(responseData.message || 'Failed to fetch songs.');
                throw error;
            }
            const gameList = [];
            for (let key in responseData) {
                const game = {
                    id: responseData[key].id,
                    name: responseData[key].name,
                    icon: responseData[key].icon,
                    playStyle: responseData[key].playStyle,
                    courseSongs: responseData[key].courseSongs,
                };
                gameList.push(game);
            }
            context.commit('setGames', gameList);
        }
    },
}