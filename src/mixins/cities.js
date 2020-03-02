export default {
  data() {
    return {
      cities: []
    }
  },
  methods: {
    async getCities() {
      let cities
      try {
        const query = this.$parse.createQuery("City")
        cities = await query.find()
      } catch ( ex ) {
        return console.error("Ocurrió un error al obtener las ciudades. Intente nuevamente.")
      }
      cities.forEach(city => {
        const _city = city.toJSON()
        const { objectId, name } = _city
        this.cities.push({
          objectId, name
        })
      })
    }
  }
}