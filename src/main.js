import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import App from './App.vue'

import HeaderApp from "@/components/UI/HeaderApp";
import WelcomeScreen from './components/pages/Welcome.vue'
import LoginScreen from "@/forms/user/LoginScreen.vue";
import Settings from "@/components/pages/Settings.vue";
import SongList from "@/components/pages/SongList.vue";
import submitSong from "@/forms/submitSong";
import submitGame from "@/forms/submitGame";
import submitArcade from "@/forms/submitArcade";
import AddCourseModal from "@/components/UI/AddCourseModal";
import RegisterUser from "@/forms/user/RegisterUser";
import submitCourse from "@/forms/submitCourse";
import CourseList from "@/components/pages/CourseList";
import TipsScreen from "@/components/pages/TipsScreen";
import ArcadeRankings from "@/components/pages/ArcadeRankings";

import './assets/main.css'
import './assets/css/all.css'

import store from './store/index.js'
import importSongs from "@/components/pages/ImportSongs";
import AboutUs from "@/components/pages/AboutUs";
import AdminPanel from "@/components/pages/AdminPanel";


// Create a router instance for navigation between pages
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
        { path: '/submitArcade', component: submitArcade, meta: { requiresAuth: true } },
        { path: '/import', component: importSongs, meta: { requiresAuth: true } },
        { path: '/Admin', component: AdminPanel, meta: { requiresAuth: true } },
        { path: '/about', component: AboutUs, meta: { requiresAuth: false } },
        { path: '/tips', component: TipsScreen, meta: { requiresAuth: false } },
        { path: '/arcade', component: ArcadeRankings, meta: { requiresAuth: false } },
        { path: '/arcade/:arcadeID', component: ArcadeRankings, props: true, meta: { requiresAuth: false } },
        { path: '/arcade/:arcadeID/:gameID', component: ArcadeRankings, props: true, meta: { requiresAuth: false } },
        { path: '/register', component: RegisterUser },
        { path: '/reset', component: PasswordReset },
        { path: '/:notFound(.*)', redirect: '/welcome'},
    ],
    scrollBehavior() {
        return {x: 0, y: 0}
    },
    linkActiveClass: 'btn-active',
});

// Check if user is authenticated before each route change
router.beforeEach(function(to, from, next) {
    if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
        next('/login');
    } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
        next('/welcome');
    } else {
        next();
    }
});

// Create VueI18n instance with options for language detection
import en from './assets/locales/en.js'
import ja from './assets/locales/ja.js'
import nl from './assets/locales/nl.js'
import PasswordReset from "@/forms/user/PasswordReset";

const messages = {
    en: en,
    ja: ja,
    nl: nl
}

const i18n = createI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
})

// Create a new app
const app = createApp(App)
app.component('header-app', HeaderApp);
app.component('add-course-modal', AddCourseModal);

app.use(store);
app.use(router);
app.use(i18n)

app.mount('#app')
