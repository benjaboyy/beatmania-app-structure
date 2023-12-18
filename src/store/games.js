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
        },
        getGameName: (state) => (gameID) => {
            const game = state.games.find(game => game.id === gameID);
            return game.name;
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
                    url: responseData[key].url,
                    icon: responseData[key].icon,
                    playStyle: responseData[key].playStyle,
                    courseSongs: responseData[key].courseSongs,
                    hasDoubleCharts: responseData[key].hasDoubleCharts,
                    hasCourseMode: responseData[key].hasCourseMode,
                    hasHardSongs: responseData[key].hasHardSongs,
                    hasAnotherSongs: responseData[key].hasAnotherSongs,
                    hasGenres: responseData[key].hasGenres,
                };
                gameList.push(game);
            }
            context.commit('setGames', gameList);
        }
    },
}