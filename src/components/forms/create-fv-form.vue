<template>
  <el-dialog title="Registrar nuevo usuario"
    width="60%"
    :visible.sync="visible">
    <fieldset>
      <legend>Información básica</legend>
      <form>
        <div class="row">
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
        </div>
      </form>
    </fieldset>
    <span slot="footer" class="dialog-footer">
      <button class="btn" v-on:click="closeDialog">Cancelar</button>
      <button class="btn btn-info" v-on:click="save">Guardar</button>
    </span>
  </el-dialog>
</template>

<script>
  import cities from "@/mixins/cities"
  import Parse from "parse"
  export default {
    mixins: [
      cities
    ],
    props: {
      value: Boolean
    },
    data() {
      return {
        user: {}
      }
    },
    computed: {
      visible: {
        get() {
          return this.value
        },
        set( value ) {
          this.$emit( "input", value )
        }
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
          let savedFV
          try {
            savedFV = await fvInstance.save()
          } catch ( ex ) {
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al guardar nuevo usuario.",
              type    : "error"
            })
          }
          this.$message({
            duration: 4000,
            message : "Nuevo usuario guardado con éxito.",
            type    : "success"
          })
          this.$emit( "new-fv-saved", savedFV )
          this.user = {}
          this.closeDialog()
        } else {
          this.$message({
            duration: 4000,
            message : "Asegúrese de rellenar todos los campos.",
            type    : "error"
          })
        }
      },
      closeDialog() {
        this.visible = false
      }
    },
    created() {
      this.getCities()
    }
  }
</script>