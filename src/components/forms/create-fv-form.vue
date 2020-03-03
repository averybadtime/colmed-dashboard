<template>
  <form v-on:submit.prevent="save">
    <div class="row mb-5">
      <div class="col-12">
        <h4>Registrar nuevo usuario</h4>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text"
            placeholder="Nombre del Usuario"
            name="name"
            id="name"
            class="form-control"
            v-model="user.name">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email"
            placeholder="john@doe.com"
            name="email"
            id="email"
            class="form-control"
            v-model="user.email">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password"
            placeholder="······"
            name="password"
            id="password"
            class="form-control"
            v-model="user.password">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="city">Ciudad</label>
          <select id="city"
            name="city"
            class="form-control"
            v-model="user.city">
            <option :value="null" disabled>--- Seleccione ciudad ---</option>
            <option v-for="city in cities"
              :key="city.objectId"
              :value="city.objectId">
              {{ city.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12">
        <button class="btn btn-info float-right">Guardar nuevo</button>
      </div>
    </div>
    <hr class="my-4">
  </form>
</template>

<script>
  import cities from "@/mixins/cities"
  import Parse from "parse"
  export default {
    mixins: [
      cities
    ],
    data() {
      return {
        user: {}
      }
    },
    methods: {
      async save() {
        const { name, email, city, password } = this.user
        if (
          name && name.trim() != "" &&
          email && email.trim() != "" &&
          password && password.trim() != "" &&
          city && city.trim() != ""
        ) {
          try {
            const FV = this.$parse.createObject( "User" )
            const City = this.$parse.createObject( "City" )
            const cityInstance = new City()
            cityInstance.set("id", city)
            const fvInstance = new FV()
            fvInstance.set( "name", name )
            fvInstance.set( "email", email )
            fvInstance.set( "password", password )
            fvInstance.set( "username", email )
            fvInstance.set( "rol", "fv" )
            fvInstance.set( "city", cityInstance )
            const savedFV = await fvInstance.save()
            alert("Nuevo usuario guardado con éxito.")
            this.$emit( "new-fv-saved", savedFV )
            this.user = {}
          } catch ( ex ) {
            alert("Ocurrió un error al guardar nuevo usuario. Intente nuevamente.")
          }
        } else {
          alert("Asegúrese de rellenar todos los campos.")
        }
      }
    },
    created() {
      this.getCities()
    }
  }
</script>