const API_BASE_URL = process.env.VUE_APP_FIREBASE_BASE_URL;
export default {
    namespaced: true,
    state() {
        return {
            achievements: []
        }
    },
    getters: {
        getAchievements() {
            return this.state.achievements;
        }
    },
    mutations: {
        addAchievement(state, payload) {
            state.achievements.push(payload);
        },
        setAchievements(state, payload) {
            state.achievements = payload;
        }
    },
    actions: {
        async laodAchievements(context) {
            const token = context.rootGetters.token;
            const response = await fetch(API_BASE_URL + '/achievements.json?auth=' + token);
            const responseData = await response.json();
            if (!response.ok) {
                const error = new Error(responseData.message || 'Failed to fetch achievements.');
                throw error;
            }
            const achievements = [];
            for (let key in responseData) {
                const achievement = {
                    id: responseData[key].id,
                    name: responseData[key].name,
                    description: responseData[key].description,
                    icon: responseData[key].icon,
                    points: responseData[key].points,
                    gameID: responseData[key].gameID,
                    arcadeID: responseData[key].arcadeID,
                };
                achievements.push(achievement);
            }

        },
        async addAchievement() {
            const token = this.rootGetters.token;
            const response = await fetch(`${API_BASE_URL}/achievements.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // Add the achievement data here
                })
            });
            const responseData = await response.json();
            if (!response.ok) {
                const error = new Error(responseData.message || 'Failed to add achievement.');
                throw error;
            }
            this.commit('addAchievement', {
                id: responseData.name,
                // Add other achievement properties here
            });
        },
        async linkAchievementToUser() {

        }
    }
}