import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueFrappe from 'vue2-frappe'
import VueTour from 'vue-tour'
import 'vue-tour/dist/vue-tour.css'
import 'element-ui/lib/theme-chalk/index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBalanceScale,
  faSyncAlt,
  faSignOutAlt,
  faCheck,
  faKey,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBalanceScale,
  faSyncAlt,
  faSignOutAlt,
  faCheck,
  faKey,
  faExclamationTriangle
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueFrappe)
Vue.use(VueTour)

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

vm.$on('401', () => {
  router.push('/')
})

global.vm = vm
