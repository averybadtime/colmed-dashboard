<template>
  <form v-on:submit.prevent="update">
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text"
            name="name"
            id="name"
            class="form-control"
            v-model="user.name">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="name">Ciudad</label>
          <select name="city"
            id="city"
            class="form-control"
            v-model="user.city.id">
            <option :value="null" disabled>---Seleccione ciudad ---</option>
            <option v-for="city in cities"
              :key="city.objectId"
              :value="city.objectId">
              {{ city.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12">
        <button class="btn btn-primary float-right mb-3">Guardar cambios</button>
      </div>
    </div>
  </form>
</template>

<script>
  import cities from "@/mixins/cities"
  export default {
    props: {
      userToEdit: Object
    },
    mixins: [
      cities
    ],
    data() {
      return {
        user: {}
      }
    },
    methods: {
      async update() {
        const { objectId, name, city } = this.user
        if (
          name && name.trim() != "" &&
          city.id && city.id.trim() != ""
        ) {
          const query = this.$parse.createQuery( "_User" )
          try {
            const User = await query.get(objectId)
            User.set( "name", name )

            const City = this.$parse.createObject( "City" )
            const cityInstance = new City()
            cityInstance.set("id", city.id)

            User.set( "city", cityInstance )

            await User.save( null, { useMasterKey: true } )
            this.$emit( "fv-updated", User )
          } catch ( ex ) {
            console.error( ex )
            return console.error("Ocurrió un error al guardar la información del usuario. Intente nuevamente.")
          }
          alert("Información de usuario actualizada con éxito.")
        } else {
          alert("Asegúrese de rellenar todos los campos.")
        }
      }
    },
    created() {
      Object.assign( this.user, this.userToEdit )
      this.getCities()
    }
  }
</script>