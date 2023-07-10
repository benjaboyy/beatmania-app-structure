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
        getArcadeGames: (state) => (arcadeID) => {
            const arcade = state.arcades.find(arcade => arcade.code === arcadeID);
            return arcade.games;
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
        },
        addArcade(state, payload) {
            state.arcades.push(payload);
        },
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
        },
        async updatePlayerOnArcade(context, payload) {
            const token = context.rootGetters.token;
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/arcades/${payload.arcadeID}/players/${payload.userID}.json?auth=` + token, {
                method: 'PUT',
                body: JSON.stringify(payload.name),
            });
            const responseData = await response.json();
            if (!response.ok) {
                const error = new Error(responseData.message || 'Failed to update player.');
                throw error;
            }
        },
        async deletePlayerOnArcade(context, payload) {
            const token = context.rootGetters.token;
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/arcades/${payload.arcadeID}/players/${payload.userID}.json?auth=` + token, {
                method: 'DELETE',
            });
            const responseData = await response.json();
            if (!response.ok) {
                const error = new Error(responseData.message || 'Failed to delete player.');
                throw error;
            }
        }
    }
}