import "babel-polyfill"
import "bootstrap/dist/css/bootstrap.css"
import "jquery/src/jquery"
import "popper.js/dist/popper"
import "bootstrap/dist/js/bootstrap.min.js"
import "element-ui/lib/theme-chalk/index.css"

import Vue from "vue"
import App from "./App.vue"
import store from "./store"
import router from "./router"

import DateFilter from "./filters/date"
Vue.use(DateFilter)
import StatusFilter from "./filters/status"
Vue.use(StatusFilter)

import ParsePlugin from "./plugins/parse"
Vue.use(ParsePlugin)

import VueFeather from "vue-feather"
Vue.use(VueFeather)

import VueGoodTable from "vue-good-table"
import "vue-good-table/dist/vue-good-table.css"
Vue.use(VueGoodTable)

import {
  Message,
  MessageBox
} from "element-ui"

import lang from "element-ui/lib/locale/lang/es"
import locale from "element-ui/lib/locale"
locale.use(lang)

Vue.prototype.$msgbox  = MessageBox
Vue.prototype.$alert   = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt  = MessageBox.prompt
Vue.prototype.$message = Message

import Parse from "parse"
const user = Parse.User.current()
store.commit("SET_USER", user)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})