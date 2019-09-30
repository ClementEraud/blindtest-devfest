import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import PageHeader from '@/components/PageHeader.vue'

Vue.config.productionTip = false

Vue.component('page-header', PageHeader);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
