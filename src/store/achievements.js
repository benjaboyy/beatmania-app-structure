const API_BASE_URL = process.env.VUE_APP_FIREBASE_BASE_URL;
export default {
    namespaced: true,
    state() {
        return {
            achievements: [],
            players: {

            }
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
    }
}