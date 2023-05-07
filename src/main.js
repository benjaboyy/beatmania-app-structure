import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HeaderApp from "@/components/UI/HeaderApp";

import WelcomeScreen from './components/pages/Welcome.vue'
import LoginScreen from "@/forms/user/LoginScreen.vue";
import Settings from "@/components/pages/Settings.vue";
import SongList from "@/components/pages/SongList.vue";
import submitSong from "@/forms/submitSong";
import submitGame from "@/forms/submitGame";
import AddSongModal from "@/components/UI/AddSongModal";
import RegisterUser from "@/forms/user/RegisterUser";
import submitCourse from "@/forms/submitCourse";
import CourseList from "@/components/pages/CourseList";

import './assets/main.css'
import './assets/css/all.css'

import store from './store/index.js'
import importSongs from "@/components/pages/ImportSongs";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/welcome'},
        { path: '/welcome', component: WelcomeScreen, meta: { requiresAuth: true } },
        { path: '/login', component: LoginScreen, meta: { requiresUnauth: false } },
        { path: '/settings', component: Settings, meta: { requiresAuth: true } },
        { path: '/games/:gameID', component: SongList, props: true, meta: { requiresAuth: true } },
        { path: '/g/course/:gameID', component: CourseList, props: true, meta: { requiresAuth: true } },
        { path: '/submitSong', component: submitSong, meta: { requiresAuth: true } },
        { path: '/submitGame', component: submitGame, meta: { requiresAuth: true } },
        { path: '/submitCourse', component: submitCourse, meta: { requiresAuth: true } },
        { path: '/import', component: importSongs, meta: { requiresAuth: true } },
        { path: '/register', component: RegisterUser },
        { path: '/:notFound(.*)', redirect: '/welcome'},
    ],
    linkActiveClass: 'btn-active',
});

router.beforeEach(function(to, from, next) {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        next('/login');
    } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
        next('/welcome');
    } else {
        next();
    }
});

const app = createApp(App)
app.component('header-app', HeaderApp);
app.component('add-song-modal', AddSongModal);

app.use(store);

app.use(router);

app.mount('#app')
