export default {
  data() {
    return {
      medicines: []
    }
  },
  methods: {
    async getMedicines() {
      let Medicines
      const MedicineQuery = this.$parse.createQuery( "Medicine" )
      try {
        Medicines = await MedicineQuery.find()
      } catch ( ex ) {
        return this.$message({
          duration: 4000,
          message : "Ocurrió un error al descargar las categorías.",
          type    : "error"
        })
      }

      Medicines.forEach( Medicine => {
        const { objectId, name } = Medicine.toJSON()
        this.medicines.push({ objectId, name })
      } )
    }
  },
  created() {
    this.getMedicines()
  }
}