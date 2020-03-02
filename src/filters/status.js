export default {
  install: Vue => {
    Vue.filter("status", value => value ? "Activo" : "Inactivo")
  }
}