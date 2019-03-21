import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Auth from './views/Auth.vue'
import Registered from './views/Registered.vue'
import Forgot from './views/Forgot.vue'
import Portfolio from './components/home/Portfolio'
import Exchanges from './components/home/Exchanges'
import { EventBus } from './util/eventBus'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/auth'
    },
    {
      path: '/auth/registered/:signupToken',
      name: 'registered',
      component: Registered,
      props: true
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: Forgot
    },
    {
      path: '/auth/reset/:magicLinkToken',
      name: 'reset',
      component: Auth,
      props: true
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      redirect: '/home/portfolio',
      children: [
        { path: 'portfolio', component: Portfolio },
        {
          path: 'exchange',
          component: Exchanges,
          name: 'exchange',
          props: true
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})

router.afterEach((to, from) => {
  EventBus.$emit('hashchange', [to, from])
})

export default router
