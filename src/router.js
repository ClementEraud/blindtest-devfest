import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/players',
      name: 'players',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Players.vue')
    },
    {
      path: '/create-game/:gameId',
      name: 'createGame',
      props: true,
      component: () => import( './views/CreateGame.vue')
    },
    {
      path: '/game/administration/:gameId',
      name: 'managingGame',
      props: true,
      component: () => import('./views/ManagingGame.vue')
    }
  ]
})
