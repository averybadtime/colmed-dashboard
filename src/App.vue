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
  .btn-group > .btn, .btn-group-vertical > .btn {
    max-height: 34px;
  }
  .feather {
    height: auto;
    max-width: 16px;
    width: 100%;
  }
  .avatar.avatar-48 {
    height: auto;
    max-width: 48px;
    width: 100%;
  }
</style>