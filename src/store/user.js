let timer;

export default {
    state() {
        return {
            userSongs: [],
            user: {},
            userId: '',
            token: '',
            name: '',
            didLogout: false,
            accountSettings: {
                trackedGames: {
                    thefinal: {
                        singles: false,
                        doubles: true,
                        singleCourse: false,
                        doubleCourse: false
                    },
                    sixthmix: {
                        singles: false,
                        doubles: false,
                        singleCourse: false,
                        doubleCourse: false
                    },
                },
                favoriteGame: '',
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
        setUserSongs(state, payload) {
            state.userSongs = payload;
        },
        addSong(state, payload) {
            const index = state.userSongs.findIndex(s => s.id === payload.id);
            if (index !== -1) {
                Object.assign(state.userSongs[index], payload);
            } else {
                state.userSongs.push(payload);
            }
        },
        didLogout(state) {
            state.didLogout = true;
        },
        setAccountSettings(state, payload) {
            state.accountSettings.trackedGames = payload;
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
            const response = await fetch(`https://beatmania-pro-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/accountSettings/trackedGames.json?auth=` + token);
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

            // const user = {
            //     name: responseData.name,
            // };
            context.commit('setUserInfo', responseData.name);
            // TODO: load user info
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
                }
                userSongs.push(song)
            }

            context.commit('setUserSongs', userSongs);
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

            // timer = setTimeout(function() {
            //     context.dispatch('autoLogout');
            // }, expirationDate);

            context.commit('setUser', {
                token: responseData.idToken,
                userId: responseData.localId,
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
        userId(state) {
            return state.userId;
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
            return state.favoriteGame;
        },
        getTrackGames(state) {
            return state.accountSettings.trackedGames;
        },
        didAutoLogout(state) {
            return state.didLogout;
        }
    }
}