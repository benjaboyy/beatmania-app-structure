let timer;

export default {
    state() {
        return {
            userSongs: [],
            userCourses: [],
            user: {},
            userId: '',
            token: '',
            admin: false,
            name: '',
            successUpdate: false,
            didLogout: false,
            accountSettings: {
                trackedGames: {
                    thefinal: {
                        singles: false,
                        doubles: true,
                        singleCourse: false,
                        doubleCourse: false
                    }
                },
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
        addSong(state, payload) {
            const index = state.userSongs.findIndex(s => s.id === payload.id);
            if (index !== -1) {
                Object.assign(state.userSongs[index], payload);
            } else {
                state.userSongs.push(payload);
            }
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
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/accountSettings/trackedGames.json?auth=` + token, {
                method: 'put',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                alert('Error while updating tracked games');
            } else {
                const updatedAccountSettings = { ...getters.accountSettings, trackedGames: payload };
                commit('setAccountSettings', updatedAccountSettings);
            }
        },
        async updateSettings({ commit, getters }, payload) {
            const userId = getters.userId;
            const token = getters.token;
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/accountSettings.json?auth=` + token, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                alert('Error while updating settings');
            } else {
                const updatedAccountSettings = { ...getters.accountSettings, ...payload };
                commit('setAccountSettings', updatedAccountSettings);
                commit('setSuccessUpdate', true);
            }
        },
        async updateUsername({ commit, getters }, payload) {
            const userId = getters.userId;
            const token = getters.token;
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=` + token, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                alert('Error while updating username');
            } else {
                commit('setUserInfo', payload.name);
                commit('setSuccessUpdate', true);
            }
        },
        async addSongToUser (context, payload) {
            const userId = context.getters.userId;
            const songID = payload.id;
            const songData = {
                id: payload.id,
                name: payload.name,
                normalScore: payload.scoreNormal,
                normalClear: payload.normalClear,
                normalFC: payload.normalFC,
                hardScore: payload.scoreHard,
                hardClear: payload.hardClear,
                hardFC: payload.hardFC,
                anotherScore: payload.scoreAnother,
                anotherClear: payload.anotherClear,
                anotherFC: payload.anotherFC,
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
            }

            const token = context.getters.token;
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/songs/${songID}.json?auth=` + token, {
                method: 'put',
                body: JSON.stringify(songData)
            });
            if (!response.ok) {
                alert('Error while adding song');
            }
            context.commit('addSong', {
                ...songData,
            });
        },
        async addCourseToUser (context, payload) {
            const userId = context.getters.userId;
            const songID = payload.id;
            const songData = {
                id: payload.id,
                name: payload.name,
                normal: payload.score,
                clear: payload.clear,
                FC: payload.FC,
                grade: payload.grade,
                favorite: payload.favorite,
                score: payload.score,
            }

            const token = context.getters.token;
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/courses/${songID}.json?auth=` + token, {
                method: 'put',
                body: JSON.stringify(songData)
            });
            if (!response.ok) {
                alert('Error while adding song');
            }
            context.commit('addCourse', {
                ...songData,
            });
        },
        async registerUser(context, payload) {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA-o_3wteXq2TeoHwnVC5fCSyr_dzVd_j0', {
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
            const response2 = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=${token}`, {
                method: 'PUT',
                body: JSON.stringify({
                    id: userId,
                    email: payload.email,
                    name: payload.name,
                })
            });
            const responseData2 = await response2.json();
            //
            if (!response2.ok) {
                alert(responseData2.message + 'Error while registering user');
            }
        },
        async loadTrackedGames(context) {
            const userId = context.getters.userId;
            const token = context.getters.token;
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/accountSettings.json?auth=` + token);
            const responseData = await response.json();

            if (!response.ok) {
                alert('Error while loading tracked games');
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
            //
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=` + token);
            const responseData = await response.json();

            if (!response.ok) {
                alert('Error while logging in');
            }

            context.commit('setUserInfo', responseData.name);
            context.commit('setAdmin', responseData.admin);
        },
        async loadUserSongs(context) {
            const userId = context.getters.userId;
            const token = context.getters.token;
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/songs.json?auth=` + token);
            const responseData = await response.json();

            if (!response.ok) {
                alert('Error while logging in');
            }
            const userSongs = [];

            for (const key in responseData) {
                const song = {
                    id: responseData[key].id,
                    name: responseData[key].name,
                    normalScore: responseData[key].normalScore,
                    normalClear: responseData[key].normalClear,
                    normalFC: responseData[key].normalFC,
                    hardScore: responseData[key].hardScore,
                    hardClear: responseData[key].hardClear,
                    hardFC: responseData[key].hardFC,
                    anotherScore: responseData[key].anotherScore,
                    anotherClear: responseData[key].anotherClear,
                    anotherFC: responseData[key].anotherFC,
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
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/courses.json?auth=` + token);
            const responseData = await response.json();

            if (!response.ok) {
                alert('Error while logging in');
            }
            const userCourses = [];

            for (const key in responseData) {
                const course = {
                    id: responseData[key].id,
                    name: responseData[key].name,
                    score: responseData[key].score,
                    clear: responseData[key].clear,
                    fc: responseData[key].fc,
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
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=` + token);
            const responseData = await response.json();

            if (!response.ok) {
                alert('Error while logging in');
            }
            const userStats = {
                name: responseData.name,
                trackedGames: responseData.accountSettings.trackedGames,
            }

            return userStats;
        },

        async setUserStatsForGame(context, payload) {
            const userId = context.getters.userId;
            const token = context.getters.token;
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/accountSettings/trackedGames/${payload.game}.json?auth=` + token, {
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
            }
        },

        async auth(context, payload) {
            let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-o_3wteXq2TeoHwnVC5fCSyr_dzVd_j0';
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
                const error = new Error(responseData.message || 'Failed to authenticate');
                throw error;
            }

            const expirationDate = new Date().getTime() + +responseData.expiresIn * 1000;

            localStorage.setItem('token', responseData.idToken);
            localStorage.setItem('userId', responseData.localId);
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
                expirationDate: responseData.expirationDate,
            });
        },
        async refreshToken(context) {
            const token = localStorage.getItem('token');
            const refreshTokenUrl = 'https://securetoken.googleapis.com/v1/token?key=AIzaSyA-o_3wteXq2TeoHwnVC5fCSyr_dzVd_j0';
            const response = await fetch(refreshTokenUrl, {
                method: 'POST',
                body: JSON.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: token
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Handle token refresh failure
                // For example, logout the user or show an error message
                context.dispatch('logout');
                return;
            }

            const expirationDate = new Date().getTime() + +responseData.expires_in * 1000;

            localStorage.setItem('token', responseData.id_token);
            localStorage.setItem('tokenExpiration', expirationDate);

            const expiresIn = +responseData.expires_in * 1000;
            const refreshTokenInterval = expiresIn - 60000;

            timer = setTimeout(function() {
                context.dispatch('refreshToken');
            }, refreshTokenInterval);

            context.commit('setUser', {
                token: responseData.id_token,
                userId: responseData.user_id,
                expirationDate: responseData.expires_in,
            });
        },

        tryLogin(context) {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const tokenExpiration = localStorage.getItem('tokenExpiration');

            const expiresIn = +tokenExpiration - new Date().getTime();
            if (expiresIn < 0) {
                return;
            }

            timer = setTimeout(() => {
                context.dispatch('autoLogout');
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
            localStorage.removeItem('tokenExpiration');

            clearTimeout(timer);

            context.commit('setUser', {
                token: null,
                userId: null,
                name: null,
            });
        },
        autoLogout(context) {
            context.dispatch('logout');
            context.commit('didLogout');
        }
    },
    getters: {
        getUserSongs(state) {
            return state.userSongs;
        },
        getUserCourses(state) {
            return state.userCourses;
        },
        userId(state) {
            return state.userId;
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
            return state.accountSettings.trackedGames;
        },
        didAutoLogout(state) {
            return state.didLogout;
        }
    }
}