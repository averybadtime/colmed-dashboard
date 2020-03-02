<template>
  <form v-on:submit.prevent="update">
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text"
            name="name"
            id="name"
            class="form-control"
            v-model="user.name">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="name">Ciudad</label>
          <select name="city"
            id="city"
            class="form-control"
            v-model="user.city">
            <option :value="null" disabled>---Seleccione ciudad ---</option>
            <option v-for="city in cities"
              :key="city.objectId">
              {{ city.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="form-group">
          <label for="points">Puntos</label>
          <input type="number"
            name="points"
            id="points"
            class="form-control"
            :value="user.points"
            readonly>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <label for="resolved">Preguntas resueltas</label>
        <input type="number"
          name="resolved"
          id="resolved"
          class="form-control"
          :value="user.resolved"
          readonly>
      </div>
      <div class="col-12 col-md-3">
        <label for="wins">Preguntas acertadas</label>
        <input type="number"
          name="wins"
          id="wins"
          class="form-control"
          :value="user.wins"
          readonly>
      </div>
      <div class="col-12 col-md-3">
        <label for="losses">Preguntas perdidas</label>
        <input type="number"
          name="losses"
          id="losses"
          class="form-control"
          :value="user.losses"
          readonly>
      </div>
      <div class="col-12">
        <button class="btn btn-primary float-right mb-3">Guardar cambios</button>
      </div>
    </div>
  </form>
</template>

<script>
  import cities from "@/mixins/cities"
  export default {
    props: {
      value: Object
    },
    mixins: [
      cities
    ],
    computed: {
      user: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit("input", value)
        }
      }
    },
    methods: {
      update() {
        console.log("Guardando...")
        console.log(this.user)
      }
    },
    created() {
      this.getCities()
    }
  }
</script>