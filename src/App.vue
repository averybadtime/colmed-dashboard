<template>
  <div id="app">
    <navbar v-if="authenticated"/>
    <router-view/>
  </div>
</template>

<script>
  import Navbar from "@/components/Navbar"
  export default {
    components: {
      Navbar
    },
    computed: {
      authenticated() {
        return this.$store.state.user
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400,600&display=swap');

  html,
  body {
    font-family: "Baloo Chettan 2", cursive !important;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: .25s;
  }

  .btn-group > .btn, .btn-group-vertical > .btn {
    max-height: 34px;
  }
  .feather {
    height: 16px;
    width: 16px;
  }
  .avatar.avatar-48 {
    height: auto;
    max-width: 48px;
    width: 100%;
  }
  table span {
    display: contents;
  }
</style>