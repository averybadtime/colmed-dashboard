<template>
  <div class="container">
    <div class="row vh_100">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <figure>
              <img src="~@/assets/logo.svg" alt="Logo" class="main_logo">
            </figure>
            <form class="form-signin"
              v-on:submit.prevent="signIn">
              <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email"
                  id="email"
                  class="form-control"
                  placeholder="Correo Electrónico"
                  required
                  autofocus
                  v-model="email">
              </div>
              <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password"
                  id="password"
                  class="form-control"
                  placeholder="Contraseña"
                  required
                  v-model="password">
              </div>
              <button class="btn btn-primary btn-block text-uppercase" type="submit">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        email   : "",
        password: ""
      }
    },
    methods: {
      async signIn() {
        if (this.email.trim() != "" && this.password.trim() != "") {
          try {
            const user = await this.$parse.User.logIn(this.email, this.password)
            if ( user.toJSON().rol != "admin" ) {
              await this.$parse.User.logOut()
              throw "UNAUTHORIZED"
            }
            this.$store.commit("SET_USER", user)
            this.$router.replace("/")
          } catch (ex) {
            let message
            if ( ex == "UNAUTHORIZED" ) message = "No tiene permiso de ingresar al dashboard."
            else message = "Ocurrió un error al iniciar sesión. Intente nuevamente."
            this.$message({
              duration: 4000,
              message,
              type: "error"
            })
          }
        } else {
          this.$message({
            duration: 4000,
            message: "Asegúrese de rellenar todos los campos.",
            type: "error"
          })
        }
      }
    }
  }
</script>
<style scoped>
  figure {
    margin: 24px 0px 36px;
    text-align: center;
  }
  .main_logo {
    height: auto;
    max-width: 180px;
    width: 100%;
  }
  .vh_100 {
    align-items: center;
    display: flex;
    height: 100vh;
  }
</style>