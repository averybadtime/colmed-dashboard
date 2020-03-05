import Vue from "vue"
import VueRouter from "vue-router"
import Parse from "parse"
import Login from "@/pages/auth/Login"
import FV from "@/pages/FV/"
import MaterialDeEstudio from "@/pages/material-de-estudio/"
import Preguntas from "@/pages/preguntas/"
import Premios from "@/pages/premios/"
import Clientes from "@/pages/clientes/"
import BatchImporting from "@/pages/batch-importing"

Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [{
    path: "/batch-importing",
    component: BatchImporting,
    meta: { requiresAuth : true }
  }, {
    path: "/",
    component: FV,
    meta: {
      requiresAuth: true
    }
  }, {
    path: "/material-de-estudio",
    component: MaterialDeEstudio,
    meta: {
      requiresAuth: true
    }
  }, {
    path: "/preguntas",
    component: Preguntas,
    meta: {
      requiresAuth: true
    }
  }, {
    path: "/premios",
    component: Premios,
    meta: {
      requiresAuth: true
    }
  }, {
    path: "/clientes",
    component: Clientes,
    meta: {
      requiresAuth: true
    }
  }, {
    path: "/login",
    component: Login
  }]
})

router.beforeEach(( to, from, next ) => {
  const user         = Parse.User.current()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (!user && requiresAuth) next("/login")
  else if (!requiresAuth && user) next("/")
  else next()
})

export default router