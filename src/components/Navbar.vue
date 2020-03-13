<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <settings-dialog v-if="showSettingsDialog"
      v-model="showSettingsDialog"/>
    <user-settings-dialog v-if="showUserSettingsDialog"
      v-model="showUserSettingsDialog"
      v-on:username-updated="handleUsernameUpdated"/>
    <button class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbar"
      aria-controls="navbar"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <router-link class="navbar-brand" to="/">Colmed</router-link>
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
        <button class="btn btn-link text-white dropdown-toggle" type="button" id="authMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {{ authUsernameComputed }}
        </button>
        <div class="dropdown-menu" aria-labelledby="authMenu">
          <a class="dropdown-item" v-on:click.prevent="showUserSettingsDialog = true">Editar perfil</a>
          <a class="dropdown-item" v-on:click.prevent="showSettingsDialog = true">Ajustes del sistema</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" v-on:click.prevent="signOut">Cerrar sesión</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  import SettingsDialog from "@/components/dialogs/Settings"
  import UserSettingsDialog from "@/components/dialogs/UserSettings"
  export default {
    components: {
      SettingsDialog,
      UserSettingsDialog
    },
    data() {
      return {
        authUsername: null,
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
        showSettingsDialog: false,
        showUserSettingsDialog: false
      }
    },
    computed: {
      authUsernameComputed() {
        return this.authUsername
      }
    },
    methods: {
      getUsername() {
        return this.$parse.User.current().get( "username" )
      },
      handleUsernameUpdated( newUsername ) {
        this.authUsername = this.getUsername()
      },
      async signOut() {
        try {
          await this.$parse.User.logOut()
        } catch ( ex ) {
          return this.$message({
            duration: 4000,
            message : "Ocurrió un error al cerrar sesión. Intente nuevamente.",
            type    : "error"
          })
        }
        this.$store.commit("SET_USER", null)
        this.$router.replace("/login")
      },
    },
    created() {
      this.authUsername = this.getUsername()
    }
  }
</script>