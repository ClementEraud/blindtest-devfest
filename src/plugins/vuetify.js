import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#871C45',
        secondary: '#E2E1CC',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
    options: {
      customProperties: true,
    },
  },
});
