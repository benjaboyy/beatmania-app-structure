import { createRouter, createWebHistory } from 'vue-router'
import WelcomeScreen from '@/components/pages/Welcome.vue'
import LoginScreen from '@/forms/user/LoginScreen.vue'
import Settings from '@/components/pages/Settings.vue'
import SongList from '@/components/pages/SongList.vue'
import ProfileScreen from '@/components/pages/ProfileScreen.vue'
import submitSong from '@/forms/submitSong'
import submitGame from '@/forms/submitGame'
import submitArcade from '@/forms/submitArcade'
import submitAchievement from '@/forms/submitAchievement'
import usersView from '@/components/pages/usersView.vue'
import RegisterUser from '@/forms/user/RegisterUser'
import submitCourse from '@/forms/submitCourse'
import CourseList from '@/components/pages/CourseList'
import TipsScreen from '@/components/pages/TipsScreen'
import ArcadeRankings from '@/components/pages/ArcadeRankings'
import SongRankings from '@/components/pages/SongRankings'
import Leaderboard from '@/components/pages/Leaderboard'
import importSongs from '@/components/pages/ImportSongs'
import AboutUs from '@/components/pages/AboutUs'
import AdminPanel from '@/components/pages/AdminPanel'
import PasswordReset from '@/forms/user/PasswordReset'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/welcome'},
        { path: '/welcome', component: WelcomeScreen, meta: { requiresAuth: true } },
        { path: '/login', component: LoginScreen,
            meta: { requiresUnauth: false },
            name: 'login'},
        { path: '/settings', component: Settings, meta: { requiresAuth: true } },
        { path: '/games/:gameID', component: SongList, props: true, meta: { requiresAuth: true } },
        { path: '/g/course/:gameID', component: CourseList, props: true, meta: { requiresAuth: true } },
        { path: '/submitSong', component: submitSong, meta: { requiresAuth: true } },
        { path: '/submitGame', component: submitGame, meta: { requiresAuth: true } },
        { path: '/submitCourse', component: submitCourse, meta: { requiresAuth: true } },
        { path: '/submitArcade', component: submitArcade, meta: { requiresAuth: true } },
        { path: '/submitAchievement', component: submitAchievement, meta: { requiresAuth: true } },
        { path: '/import', component: importSongs, meta: { requiresAuth: true } },
        { path: '/admin', component: AdminPanel, meta: { requiresAuth: true } },
        { path: '/about', component: AboutUs, meta: { requiresAuth: false } },
        { path: '/tips', component: TipsScreen, meta: { requiresAuth: false } },
        { path: '/user/:userID', component: ProfileScreen, props: true, meta: { requiresAuth: false } },
        // arcade ranking
        { path: '/arcade', component: ArcadeRankings, meta: { requiresAuth: false } },
        { path: '/arcade/:arcadeID', component: ArcadeRankings, props: true, meta: { requiresAuth: false } },
        { path: '/arcade/:arcadeID/:gameID', component: ArcadeRankings, props: true, meta: { requiresAuth: false } },
        // song leaderboard
        { path: '/leaderboard', component: SongRankings, meta: { requiresAuth: false } },
        { path: '/leaderboard/:arcadeID', component: SongRankings, props: true, meta: { requiresAuth: false } },
        { path: '/leaderboard/:arcadeID/:gameID', component: SongRankings, props: true, meta: { requiresAuth: false } },
        { path: '/leaderboard/:arcadeID/:gameID/:songID', component: Leaderboard, props: true, meta: { requiresAuth: false } },
        { path: '/users', component: usersView, meta: { requiresAuth: true } },
        { path: '/register', component: RegisterUser },
        { path: '/reset', component: PasswordReset },
        { path: '/:notFound(.*)', redirect: '/welcome'},
    ],
    scrollBehavior() {
        return {x: 0, y: 0}
    },
    linkActiveClass: 'btn-active',
});

export default router;

