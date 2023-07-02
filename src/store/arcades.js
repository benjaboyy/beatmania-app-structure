export default {
    namespaced: true,
    state() {
        return {
            arcades: [],
        }
    },
    getters: {
        getArcades(state) {
            return state.arcades;
        },
        getArcadeName: (state) => (arcadeID) => {
            const arcade = state.arcades.find(arcade => arcade.code === arcadeID);
            return arcade.name;
        },
        getPlayers: (state) => (arcadeID) => {
            const arcade = state.arcades.find(arcade => arcade.code === arcadeID);
            return arcade.players;
        }
    },
    mutations: {
        setCourseByGame(state, courseByGame) {
            state.courseByGame = courseByGame;
        },
        setArcades(state, payload) {
            state.arcades = payload;
        }
    },
    actions: {
        async loadArcades(context) {
            const token = context.rootGetters.token;
            const response = await fetch('https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/arcades.json?auth=' + token);
            const responseData = await response.json();

            if (!response.ok) {
                const error = new Error(responseData.message || 'Failed to fetch arcades.');
                throw error;
            }
            const arcadeList = [];
            for (let key in responseData) {
                const arcade = {
                    id: responseData[key].code,
                    name: responseData[key].name,
                    code: responseData[key].code,
                    country: responseData[key].country,
                    games: responseData[key].games,
                    players: responseData[key].players,
                };
                arcadeList.push(arcade);
            }
            context.commit('setArcades', arcadeList);
        }
    }
}