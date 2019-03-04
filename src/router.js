import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Auth from "./views/Auth.vue";
import Forgot from "./views/Forgot.vue";
import Portfolio from "./components/home/Portfolio";
import Exchange from "./components/home/Exchange";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/auth"
    },
    {
      path: "/auth",
      name: "auth",
      component: Auth
    },
    {
      path: "/forgot",
      name: "forgot",
      component: Forgot
    },
    {
      path: "/auth/reset/:magicLinkToken",
      name: "reset",
      component: Auth,
      props: true
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      redirect: "/home/portfolio",
      children: [
        { path: "portfolio", component: Portfolio },
        { path: "exchange", component: Exchange }
      ]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

export default router;
