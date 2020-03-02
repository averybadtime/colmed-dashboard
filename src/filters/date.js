export default {
  install: Vue => {
    Vue.filter("date", value => {
      if ( !value ) return "No definido"
      value = new Date(value)
      const day   = value.getDate()
      const month = value.getMonth() + 1
      const year  = value.getFullYear()
      if ( month < 10 ) {
        return `${day}-0${month}-${year}`
      } else {
        return `${day}-${month}-${year}`
      }
    })
  }
}