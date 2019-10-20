import Vue from 'vue'
import Router from 'vue-router'

import Admin from './views/Admin.vue'
import AdminGame from './views/admin/Game.vue'
import AdminGamePlay from './views/admin/game/Play.vue'
import AdminGameSet from './views/admin/game/Set.vue'
import AdminHome from './views/admin/Home.vue'

import Game from './views/Game.vue'
import GameHome from './views/game/Home.vue'
import GamePlay from './views/game/Play.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: '',
          name: 'admin-home',
          component: AdminHome
        },
        {
          path: 'game/:gameId',
          name: 'admin-game',
          props: true,
          component: AdminGame,
          children: [
            {
              path: 'play',
              name: 'admin-game-play',
              component: AdminGamePlay
            },
            {
              path: 'set',
              alias: '',
              name: 'admin-game-set',
              component: AdminGameSet
            }
          ]
        }
      ],
    },
    {
      path: '/game',
      component: Game,
      children: [
        {
          path: ':gameId',
          name: 'game',
          component: GameHome
        },
        {
          path: ':gameId/play',
          name: 'game-play',
          component: GamePlay
        }
      ],
    },
    // {
    //   path: '/players',
    //   name: 'players',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('./views/Players.vue')
    // },
    // {
    //   path: '/create-game/:gameId',
    //   name: 'createGame',
    //   props: true,
    //   component: () => import( './views/CreateGame.vue')
    // },
    // {
    //   path: '/game/administration/:gameId',
    //   name: 'managingGame',
    //   props: true,
    //   component: () => import('./views/ManagingGame.vue')
    // },
    // {
    //   path: '/game/players/:gameId',
    //   name: 'playersGame',
    //   props: true,
    //   component: () => import('./views/PlayersGame.vue')
    // }
  ]
})
