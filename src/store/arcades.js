const API_BASE_URL = process.env.VUE_APP_FIREBASE_BASE_URL;
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
            return arcade.players || {};
        },
        getPlayerKeyByName: (state) => (arcadeID, playerName) => {
            const arcade = state.arcades.find(arcade => arcade.code === arcadeID);
            const playerKey = Object.keys(arcade.players).find(key => arcade.players[key] === playerName);
            return playerKey;
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
            const response = await fetch(API_BASE_URL + '/arcades.json?auth=' + token);
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
                    countryCode: responseData[key].countryCode,
                    games: responseData[key].games,
                    players: responseData[key].players,
                };
                arcadeList.push(arcade);
            }
            context.commit('setArcades', arcadeList);
        },
        async updatePlayerOnArcade(context, payload) {
            const token = context.rootGetters.token;
            const response = await fetch(API_BASE_URL + `/arcades/${payload.arcadeID}/players/${payload.userID}.json?auth=` + token, {
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
            const response = await fetch(API_BASE_URL + `/arcades/${payload.arcadeID}/players/${payload.userID}.json?auth=` + token, {
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