<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <button class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbar"
      aria-controls="navbar"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="#">Colmed</a>
    <div class="collapse navbar-collapse" id="navbar">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <li v-for="(item, index) in menu"
          :key="index">
          <router-link class="nav-link"
            :to="item.to">
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>
    <form class="form-inline my-2 my-lg-0"
      v-on:submit.prevent="signOut">
      <button class="btn btn-link my-2 my-sm-0"
        type="submit">
        Cerrar sesión
      </button>
    </form>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        menu:[{
          label: "Fuerza de Venta",
          to: "/fuerza-de-venta"
        }, {
          label: "Material de Estudio",
          to: "/material-de-estudio"
        }, {
          label: "Preguntas",
          to: "/preguntas"
        }, {
          label: "Premios",
          to: "/premios"
        }, {
          label: "Clientes",
          to: "/clientes"
        }]
      }
    },
    methods: {
      async signOut() {
        try {
          await this.$parse.User.logOut()
        } catch ( ex ) {
          return console.error("Ocurrió un error al cerrar sesión. Intente nuevamente.")
        }
        this.$store.commit("SET_USER", null)
        this.$router.replace("/login")
      }
    }
  }
</script>