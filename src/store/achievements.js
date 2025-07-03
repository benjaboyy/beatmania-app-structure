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
        },
        removeAchievements(state, payload) {
            // todo
        }
    },
    actions: {
        async laodAchievements(context) {
            const token = context.rootGetters.token;
            const response = await fetch(API_BASE_URL + '/achievements.json?auth=' + token);

        },
        async addAchievement() {

        },
        async linkAchievementToUser() {

        }
    }
}