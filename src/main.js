import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import '@/components/firebaseConfig.js'
import VueFire from 'vuefire'
import InstantSearch from 'vue-instantsearch';


Vue.use(VueFire)
Vue.use(InstantSearch)
Vue.use(require('vue-moment'));

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
