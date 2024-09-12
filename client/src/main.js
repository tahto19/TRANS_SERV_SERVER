/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

//CSS
import '@/assets/css/style.css'

// Composables
import { createApp } from 'vue'

//mixin
import GlobalMixin from '@/mixin/GlobalMixin'
import FormMixin from '@/mixin/FormMixin'

//Cookie
import VueCookies from 'vue-cookies'

//Pinia
import { createPinia } from 'pinia'
const pinia = createPinia();

import "chartjs-adapter-date-fns";

//Charts
import Speedometer from "@/components/utils/Chart/Speedometer.vue";
import HorizontalBar from "@/components/utils/Chart/HorizontalBar.vue";
import Line from "@/components/utils/Chart/Line.vue";
import BarStack from "@/components/utils/Chart/BarStack.vue";
import HorizontalBarStack from "@/components/utils/Chart/HorizontalBarStack.vue";


//Expansion Looper
import AccessLooper from "@/components/utils/ExpansionLooper/AccessLooper.vue";

//Score Card
import ScoreCard from "@/components/utils/Scorecard/ScoreCard.vue";

//Clipboard
import VueClipboard from 'vue-clipboard2'

const app = createApp(App)

registerPlugins(app)

app.component('c-speedometer', Speedometer)
app.component('c-horizontal-bar', HorizontalBar)
app.component('c-horizontal-bar-stack', HorizontalBarStack)
app.component('c-bar-stack', BarStack)
app.component('c-line', Line)
app.component('score-card', ScoreCard)
app.component('l-access-looper', AccessLooper)


app.use(pinia)
app.use(VueCookies)
app.use(VueClipboard)

app.mixin(GlobalMixin)
app.mixin(FormMixin)


app.mount('#app')
