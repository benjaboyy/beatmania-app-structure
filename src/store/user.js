let timer;
const API_KEY = process.env.VUE_APP_FIREBASE_API_KEY;
const API_BASE_URL = process.env.VUE_APP_FIREBASE_BASE_URL;
const APP_URL = process.env.VUE_APP_URL;
const REFRESH_TOKEN_INTERVAL = 60000; // 1 minute
import router from '../main';

export default {
    state() {
        return {
            appUrl: APP_URL,
            userSongs: [],
            userCourses: [],
            user: {},
            userId: '',
            token: '',
            admin: false,
            achievements: {
                total: 0,
                achievements: [],
            },
            language: '',
            theme: '',
            name: '',
            successUpdate: false,
            didLogout: false,
            accountSettings: {
                trackedGames: {},
                favoriteGame: '',
                arcadeCode01: '',
                arcadeCode02: '',
                arcadeCode03: '',
            }
        }
    },
    mutations: {
        setUser(state, payload) {
            state.token = payload.token;
            state.userId = payload.userId;
            state.didLogout = false;
        },
        setUserInfo(state, payload) {
            state.name = payload;
        },
        setUserprofileUrl(state, payload) {
            state.profileUrl = payload;
        },
        setAdmin(state, payload) {
            state.admin = payload;
        },
        setUserSongs(state, payload) {
            state.userSongs = payload;
        },
        setUserCourses(state, payload) {
            state.userCourses = payload;
        },
        setSuccessUpdate(state, payload) {
            state.successUpdate = payload;
        },
        setLanguage(state, payload) {
            state.language = payload;
        },
        setTheme(state, payload) {
            state.theme = payload;
        },
        addSong(state, payload) {
            const index = state.userSongs.findIndex(s => s.id === payload.id);
            if (index !== -1) {
                Object.assign(state.userSongs[index], payload);
            } else {
                state.userSongs.push(payload);
            }
        },
        addLastPlayed(state, payload) {
            // replace the last played song with the new one
            state.lastPlayedSong = payload;
        },
        addCourse(state, payload) {
            const index = state.userCourses.findIndex(s => s.id === payload.id);
            if (index !== -1) {
                Object.assign(state.userCourses[index], payload);
            } else {
                state.userCourses.push(payload);
            }
        },
        didLogout(state) {
            state.didLogout = true;
        },
        setAccountSettings(state, payload) {
            state.accountSettings = payload;
        }
    },
    actions: {
        async updateTrackGames({ commit, getters }, payload) {
            const userId = getters.userId;
            const token = getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}/accountSettings/trackedGames.json?auth=` + token, {
                method: 'put',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                alert('Error while updating tracked games');
                router.push({ name: 'login' });
            } else {
                const updatedAccountSettings = { ...getters.accountSettings, trackedGames: payload };
                commit('setAccountSettings', updatedAccountSettings);
            }
        },
        async updateSettings({ commit, getters }, payload) {
            const userId = getters.userId;
            const token = getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}/accountSettings.json?auth=` + token, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                alert('Error while updating settings');
                router.push({ name: 'login' });
            } else {
                const updatedAccountSettings = { ...getters.accountSettings, ...payload };
                // get trackedgames and add to payload
                const trackedGames = getters.accountSettings.trackedGames;
                updatedAccountSettings.trackedGames = trackedGames;
                commit('setAccountSettings', updatedAccountSettings);
                commit('setSuccessUpdate', true);
                router.push({ name: 'login' });
            }
        },
        async updateUsername({ commit, getters }, payload) {
            const userId = getters.userId;
            const token = getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}.json?auth=` + token, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                alert('Error while updating username');
                router.push({ name: 'login' });
            } else {
                commit('setUserInfo', payload.name);
                commit('setSuccessUpdate', true);
            }
        },
        async updateUserUrl({ commit, getters }, payload) {
            const userId = getters.userId;
            const token = getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}.json?auth=` + token, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                alert('Error while updating user url');
                router.push({ name: 'login' });
            } else {
                commit('setSuccessUpdate', true);
            }
        },
        async updateLanguage({ commit, getters }, payload) {
            const userId = getters.userId;
            const token = getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}.json?auth=` + token, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                console.log('Error while updating language to user');
                router.push({ name: 'login' });
            } else {
                commit('setLanguage', payload.language);
                commit('setSuccessUpdate', true);
            }
        },
        async updateTheme({ commit, getters }, payload) {
            const userId = getters.userId;
            const token = getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}.json?auth=` + token, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                console.log('Error while updating theme to user');
                router.push({ name: 'login' });
            } else {
                commit('setTheme', payload.theme);
                commit('setSuccessUpdate', true);
            }
        },
        async addSongToUser (context, payload) {
            await context.dispatch('checkTokenExpiration');
            let userId = context.getters.userId;
            const songID = payload.id;
            const songData = {
                id: payload.id,
                name: payload.name,
                easyScore: payload.easyScore,
                easyClear: payload.easyClear,
                easyFC: payload.easyFC,
                normalScore: payload.scoreNormal,
                normalClear: payload.normalClear,
                normalFC: payload.normalFC,
                hardScore: payload.scoreHard,
                hardClear: payload.hardClear,
                hardFC: payload.hardFC,
                anotherScore: payload.scoreAnother,
                anotherClear: payload.anotherClear,
                anotherFC: payload.anotherFC,
                scoreDoubleEasy: payload.scoreDoubleEasy,
                easyDoubleFC: payload.easyDoubleFC,
                easyDoubleClear: payload.easyDoubleClear,
                scoreDoubleNormal: payload.scoreDoubleNormal,
                normalDoubleFC: payload.normalDoubleFC,
                normalDoubleClear: payload.normalDoubleClear,
                scoreDoubleHard: payload.scoreDoubleHard,
                hardDoubleFC: payload.hardDoubleFC,
                hardDoubleClear: payload.hardDoubleClear,
                scoreDoubleAnother: payload.scoreDoubleAnother,
                anotherDoubleFC: payload.anotherDoubleFC,
                anotherDoubleClear: payload.anotherDoubleClear,
                favorite: payload.favorite,
                target: payload.target,
                userID: payload.userID,
            }

            const token = context.getters.token;
            if (payload.userID && payload.userID !== '') {
                userId = payload.userID;
            }
            const response = await fetch(`${API_BASE_URL}users/${userId}/songs/${songID}.json?auth=` + token, {
                method: 'put',
                body: JSON.stringify(songData)
            });
            if (!response.ok) {
                alert('Error while adding song');
                router.push({ name: 'login' });
            }
            const response2 = await fetch(`${API_BASE_URL}users/${userId}/lastPlayedSong.json?auth=` + token, {
                method: 'put',
                body: JSON.stringify(songData)
            });
            if (!response2.ok) {
                alert('Error while adding song');
                router.push({ name: 'login' });
            }
            context.commit('addSong', {
                ...songData,
            });
            context.commit('addLastPlayed', {
                ...songData,
            });
        },
        async addCourseToUser (context, payload) {
            await context.dispatch('checkTokenExpiration');
            const userId = context.getters.userId;
            const songID = payload.id;
            const songData = {
                normal: payload.score, ...payload
            }

            console.log(payload);

            const token = context.getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}/courses/${songID}.json?auth=` + token, {
                method: 'put',
                body: JSON.stringify(songData)
            });
            if (!response.ok) {
                alert('Error while adding song');
                router.push({ name: 'login' });
            }
            context.commit('addCourse', {
                ...songData,
            });
        },
        async registerUser(context, payload) {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + API_KEY, {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                const error = new Error(responseData.message || 'Failed to authenticate');
                throw error;
            }

            context.commit('setUser', {
                token: responseData.idToken,
                userId: responseData.localId,
                tokenExpiration: responseData.expiresIn
            });
            const userId = responseData.localId;
            const token = responseData.idToken;
            const response2 = await fetch(`${API_BASE_URL}users/${userId}.json?auth=${token}`, {
                method: 'PUT',
                body: JSON.stringify({
                    id: userId,
                    email: payload.email,
                    name: payload.name,
                    accountSettings: {
                        trackedGames: {},
                        favoriteGame: '',
                        arcadeCode01: '',
                        arcadeCode02: '',
                        arcadeCode03: '',
                    }
                })
            });
            const responseData2 = await response2.json();
            //
            if (!response2.ok) {
                alert(responseData2.message + 'Error while registering user');
                router.push({ name: 'login' });
            }
        },
        async loadTrackedGames(context) {
            const userId = context.getters.userId;
            const token = context.getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}/accountSettings.json?auth=` + token);
            const responseData = await response.json();

            if (!response.ok) {
                alert('Error while loading tracked games');
                router.push({ name: 'login' });
            }

            context.commit('setAccountSettings', responseData);
        },
        async login(context, payload) {
            return context.dispatch('auth', {
                ...payload,
                mode: 'login'
            });
        },
        async loadUser(context) {
            const userId = context.getters.userId;
            const token = context.getters.token;

            try {
                // Fetch user information and user songs in a single request
                const response = await fetch(`${API_BASE_URL}users/${userId}.json?auth=` + token);

                if (!response.ok) {
                    alert('Error while loading user info');
                    router.push({ name: 'login' });
                    return;
                }

                const userData = await response.json();

                // Commit user information to the state
                context.commit('setUserInfo', userData.name);
                context.commit('setUserprofileUrl', userData.profileUrl);
                context.commit('setLanguage', userData.language);
                context.commit('setTheme', userData.theme);
                context.commit('setAdmin', userData.admin);
            } catch (error) {
                console.log(error);
            }
        },
        async loadUserSongs(context) {
            const userId = context.getters.userId;
            const token = context.getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}/songs.json?auth=` + token);
            const responseData = await response.json();

            if (!response.ok) {
                alert('Error while loading songs in');
                router.push({ name: 'login' });
            }
            const userSongs = [];

            for (const key in responseData) {
                const song = {
                    id: responseData[key].id,
                    name: responseData[key].name,
                    profileUrl: responseData[key].profileUrl,
                    easyScore: responseData[key].easyScore,
                    easyClear: responseData[key].easyClear,
                    easyFC: responseData[key].easyFC,
                    normalScore: responseData[key].normalScore,
                    normalClear: responseData[key].normalClear,
                    normalFC: responseData[key].normalFC,
                    hardScore: responseData[key].hardScore,
                    hardClear: responseData[key].hardClear,
                    hardFC: responseData[key].hardFC,
                    anotherScore: responseData[key].anotherScore,
                    anotherClear: responseData[key].anotherClear,
                    anotherFC: responseData[key].anotherFC,
                    scoreDoubleEasy: responseData[key].scoreDoubleEasy,
                    easyDoubleFC: responseData[key].easyDoubleFC,
                    easyDoubleClear: responseData[key].easyDoubleClear,
                    scoreDoubleNormal: responseData[key].scoreDoubleNormal,
                    normalDoubleFC: responseData[key].normalDoubleFC,
                    normalDoubleClear: responseData[key].normalDoubleClear,
                    scoreDoubleHard: responseData[key].scoreDoubleHard,
                    hardDoubleFC: responseData[key].hardDoubleFC,
                    hardDoubleClear: responseData[key].hardDoubleClear,
                    scoreDoubleAnother: responseData[key].scoreDoubleAnother,
                    anotherDoubleFC: responseData[key].anotherDoubleFC,
                    anotherDoubleClear: responseData[key].anotherDoubleClear,
                    favorite: responseData[key].favorite,
                    target: responseData[key].target,
                }
                userSongs.push(song)
            }

            context.commit('setUserSongs', userSongs);
        },
        async loadUserCourses(context) {
            const userId = context.getters.userId;
            const token = context.getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}/courses.json?auth=` + token);
            const responseData = await response.json();

            if (!response.ok) {
                alert('Error while logging in');
                router.push({ name: 'login' });
            }
            const userCourses = [];

            for (const key in responseData) {
                const course = {
                    id: responseData[key].id,
                    name: responseData[key].name,
                    score: responseData[key].score,
                    clear: responseData[key].clear,
                    FC: responseData[key].FC,
                    favorite: responseData[key].favorite,
                    grade: responseData[key].grade,
                }
                userCourses.push(course)
            }

            context.commit('setUserCourses', userCourses);
        },

        async loadUserStats(context, payload) {
            const userId = payload;
            const token = context.getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}.json?auth=` + token);
            const responseData = await response.json();

            if (!response.ok) {
                alert('Error while logging in');
                router.push({ name: 'login' });
            }
            // arcades: [responseData.accountSettings.arcadeCode01, responseData.accountSettings.arcadeCode02, responseData.accountSettings.arcadeCode03]
            const arcades = [
                responseData.accountSettings.arcadeCode01,
                responseData.accountSettings.arcadeCode02,
                responseData.accountSettings.arcadeCode03,
            ].filter(code => code);

            const userStats = {
                name: responseData.name,
                lastLogin: responseData.lastLogin,
                lastPlayedSong: responseData.lastPlayedSong,
                profileUrl: responseData.profileUrl,
                trackedGames: responseData.accountSettings.trackedGames,
                arcades: arcades,
            }

            return userStats;
        },

        async setUserLoginDate(context, payload) {
            const userId = context.getters.userId;
            const token = context.getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}.json?auth=` + token, {
                method: 'PATCH',
                body: JSON.stringify({
                    lastLogin: payload,
                })
            });

            if (!response.ok) {
                alert('Error while submission stats');
                await context.dispatch('logout');
            }
        },

        async setUserStatsForGame(context, payload) {
            const userId = context.getters.userId;
            const token = context.getters.token;
            const response = await fetch(`${API_BASE_URL}users/${userId}/accountSettings/trackedGames/${payload.game}.json?auth=` + token, {
                method: 'PATCH',
                body: JSON.stringify({
                    singles: payload.singles,
                    doubles: payload.doubles,
                    courses: payload.courses,
                    total: payload.total,
                })
            });

            if (!response.ok) {
                alert('Error while submission stats');
                await context.dispatch('logout');
            }
        },

        async passwordMailRequest(context, payload) {
            let url = 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' + API_KEY;
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    requestType: 'PASSWORD_RESET',
                    email: payload.email,
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                const error = new Error(responseData.message || 'Failed to authenticate');
                throw error;
            }

            alert('Password reset email sent');
        },

        async auth(context, payload) {
            let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + API_KEY;
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                alert('Error failed to authenticate');
                router.push({ name: 'login' });
            }

            const expirationDate = new Date().getTime() + +responseData.expiresIn * 1000;

            localStorage.setItem('token', responseData.idToken);
            localStorage.setItem('userId', responseData.localId);
            localStorage.setItem('refreshToken', responseData.refreshToken);
            localStorage.setItem('tokenExpiration', expirationDate);

            // Calculate the remaining time before token expiration
            const expiresIn = +responseData.expiresIn * 1000;
            const refreshTokenInterval = expiresIn - 60000; // Refresh token 1 minute before it expires

            timer = setTimeout(function() {
                context.dispatch('refreshToken');
            }, refreshTokenInterval);


            context.commit('setUser', {
                token: responseData.idToken,
                userId: responseData.localId,
                refreshToken: responseData.refreshToken,
                expirationDate: responseData.expiresIn,
            });

            await context.dispatch('checkTokenExpiration');
        },
        async refreshToken(context) {
            const refreshToken = localStorage.getItem('refreshToken');
            const refreshTokenUrl = 'https://securetoken.googleapis.com/v1/token?key=' + API_KEY;

            try {
                const response = await fetch(refreshTokenUrl, {
                    method: 'POST',
                    body: JSON.stringify({
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken
                    })
                });

                if (!response.ok) {
                    await context.dispatch('logout');
                }

                const responseData = await response.json();
                const expirationDate = new Date().getTime() + +responseData.expires_in * 1000;

                localStorage.setItem('token', responseData.id_token);
                localStorage.setItem('tokenExpiration', expirationDate);

                const expiresIn = +responseData.expires_in * 1000;
                const refreshTokenInterval = expiresIn - REFRESH_TOKEN_INTERVAL;

                clearTimeout(timer);

                timer = setTimeout(async () => {
                    await context.dispatch('refreshToken');
                }, refreshTokenInterval);

                context.commit('setUser', {
                    token: responseData.id_token,
                    userId: responseData.user_id,
                    expirationDate: responseData.expires_in,
                });
            } catch (error) {
                console.error(error);
                await context.dispatch('logout');
            }
        },

        async checkTokenExpiration({ dispatch }) {
            const tokenExpiration = localStorage.getItem('tokenExpiration');
            const expiresIn = +tokenExpiration - new Date().getTime();

            if (expiresIn < 0) {
                await dispatch('refreshToken');
            } else {
                clearTimeout(timer);
                timer = setTimeout(async () => {
                    await dispatch('refreshToken');
                }, expiresIn - REFRESH_TOKEN_INTERVAL);
            }
        },

        tryLogin(context) {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const tokenExpiration = localStorage.getItem('tokenExpiration');

            const expiresIn = +tokenExpiration - new Date().getTime();
            if (expiresIn < 0) {
                return;
            }

            clearTimeout(timer);
            timer = setTimeout(async () => {
                await context.dispatch('checkTokenExpiration');
            }, expiresIn);

            if (token && userId) {
                context.commit('setUser', {
                    token: token,
                    userId: userId,
                    tokenExpiration: null
                });
            }
        },
        logout(context) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('tokenExpiration');

            clearTimeout(timer);

            context.commit('setUser', {
                token: null,
                userId: null,
                tokenExpiration: null,
                name: null,
            });
            router.push({ name: 'login' });
        },
    },
    getters: {
        getUserSongs(state) {
            return state.userSongs;
        },
        getUserCourses(state) {
            return state.userCourses;
        },
        getUserArcadeCodes(state) {
            const arcadeCodes = [];
            arcadeCodes.push(state.accountSettings.arcadeCode01);
            arcadeCodes.push(state.accountSettings.arcadeCode02);
            arcadeCodes.push(state.accountSettings.arcadeCode03);
            return arcadeCodes;
        },
        userId(state) {
            return state.userId;
        },
        getAppURL(state) {
            return state.appUrl;
        },
        isAdmin(state) {
            if (state.admin === true) {
                return true;
            } else {
                return false;
            }
        },
        token(state) {
            return state.token;
        },
        isAuthenticated(state) {
            return !!state.token;
        },
        userName(state) {
            return state.name;
        },
        userID(state) {
            return state.userId;
        },
        profileUrl(state) {
            return state.profileUrl;
        },
        favoriteGame(state) {
            return state.accountSettings.favoriteGame;
        },
        getArcadeCode01(state) {
            return state.accountSettings.arcadeCode01;
        },
        getArcadeCode02(state) {
            return state.accountSettings.arcadeCode02;
        },
        getArcadeCode03(state) {
            return state.accountSettings.arcadeCode03;
        },
        getSuccessUpdate(state) {
            return state.successUpdate;
        },
        getTrackGames(state) {
            if (!state.accountSettings) {
                return [];
            }
            return state.accountSettings.trackedGames;
        },
        didAutoLogout(state) {
            return state.didLogout;
        },
        getLanguage(state) {
            return state.language;
        },
        getTheme(state) {
            return state.theme;
        }
    }
}