<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">

    <settings-dialog v-if="showSettingsDialog" v-model="showSettingsDialog"/>

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
    <div class="form-inline my-2 my-lg-0">
      
      <div class="dropdown">
        <button class="btn btn-link text-white dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ authUserName }}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item" href="#">Editar perfil</a>

          <a class="dropdown-item" v-on:click.prevent="showSettingsDialog = true">Ajustes del sistema</a>
          

          <div class="dropdown-divider"></div>

          <a class="dropdown-item" href="#">Cerrar sesión</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  import SettingsDialog from "@/components/dialogs/Settings"
  export default {
    components: {
      SettingsDialog
    },
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
        }],
        showSettingsDialog: false
      }
    },
    computed: {
      authUserName() {
        return this.$parse.User.current().get( "username" )
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