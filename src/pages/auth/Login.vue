<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center text-bold">Colmed</h5>
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
            this.$store.commit("SET_USER", user)
            this.$router.replace("/")
          } catch (ex) {
            console.error("Ocurrió un error al iniciar sesión. Intente nuevamente.")
            console.error(ex)
          }
        } else {
          console.error("Asegúrese de rellenar todos los campos.")
          console.error(ex)
        }
      }
    }
  }
</script>