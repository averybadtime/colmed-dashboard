<template>
  <el-dialog title="Ajustes de cuenta del usuario"
    width="50%"
    :visible.sync="visible">
    <fieldset>
      <legend>Configuraciones</legend>
      <form v-on:submit.prevent="save">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text"
                class="form-control"
                name="username"
                id="username"
                v-model="user.username">
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input type="text"
                class="form-control"
                name="name"
                id="name"
                v-model="user.name">
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password"
                class="form-control"
                name="password"
                id="password"
                placeholder="******"
                readonly>
              <a v-on:click.prevent="sendPasswordResetLink" class="btn btn-link pl-0">Envíar email de cambio de contraseña</a>
            </div>
          </div>
        </div>
      </form>
    </fieldset>
    <span slot="footer" class="dialog-footer">
      <button class="btn" v-on:click="visible = false">Cancelar</button>
      <button class="btn btn-info" v-on:click="update">Guardar</button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
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
      async sendPasswordResetLink() {
        let action
        try {
          action = await this.$confirm("¿Seguro desea restablecer su contraseña?", "warning")
          await this.$parse.User.requestPasswordReset( this.$parse.User.current().email )
        } catch ( ex ) {
          if ( ex != "cancel" ) {
            this.$message({
              duration: 4000,
              message : "Ocurrió un error al envíar enlace para restablecer contraseña. Intente nuevamente.",
              type    : "error"
            })
          }
          return
        }
        this.$message({
          duration: 4000,
          message : "Enlace de restablecimiento de contraseña enviado con éxito.",
          type    : "success"
        })
      },
      async update() {
        const { username, name } = this.user
        if (
          username && username.trim() != "" &&
          name && name.trim() != ""
        ) {

          try {
            await this.$parse.User.current().save( { name, username } )
          } catch ( ex ) {
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al actualizar la información del usuario.",
              type    : "error"
            })
          }
          this.$message({
            duration: 4000,
            message : "Información de usuario actualizada con éxito.",
            type    : "success"
          })
          this.$emit( "username-updated", username )
          this.visible = false
        } else {
          this.$message({
            duration: 4000,
            message : "Asegúrese de rellenar todos los campos.",
            type    : "error"
          })
        }
      }
    },
    created() {
      this.user = {
        username: this.$parse.User.current().get( "username" ),
        name    : this.$parse.User.current().get( "name" )
      }
    }
  }
</script>