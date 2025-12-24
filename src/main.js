import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'

import HeaderApp from "@/components/widgets/HeaderApp";
import AddCourseModal from "@/components/UI/AddCourseModal";

import './assets/css/all.css'
import './assets/css/extras.css'

import store from './store/index.js'

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

const messages = {
    en: en,
    ja: ja,
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

export const version = '1.0.0';
