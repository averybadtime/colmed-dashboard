<template>
  <form v-on:submit.prevent="save">
    <div class="row mb-5">
      <div class="col-12">
        <h4>Registrar nuevo premio</h4>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text"
            placeholder="Nombre del premio"
            name="name"
            id="name"
            class="form-control"
            v-model="reward.name">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="value">Valor</label>
          <input type="number"
            placeholder="Valor en pesos del producto"
            name="value"
            id="value"
            class="form-control"
            v-model.number="reward.value">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="points">Puntos</label>
          <input type="number"
            placeholder="Puntos"
            name="points"
            id="points"
            class="form-control"
            v-model.number="reward.points">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="email">Preview</label>
          <input type="file"
            name="preview"
            id="preview"
            class="form-control-file"
            accept="image/*"
            v-on:change="handlePreview">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="company">Estado</label>
          <select name="active"
            id="active"
            class="form-control"
            v-model="reward.active">
            <option :value="null" disabled>--- Seleccione el estado ---</option>
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>
      </div>
      <div class="col-12">
        <button class="btn btn-info float-right">Guardar nuevo</button>
      </div>
    </div>
    <hr class="my-4">
  </form>
</template>

<script>
  import Parse from "parse"
  export default {
    data() {
      return {
        reward: {}
      }
    },
    methods: {
      async save() {
        const { name, value, points, icon, active } = this.reward
        if (
          name && name.trim() != "" &&
          value && value.toString().trim() != "" &&
          points && points.toString().trim() != "" &&
          icon &&
          active != undefined
        ) {
          try {
            const Reward = this.$parse.createObject( "Award" )
            const instance = new Reward()
            instance.set( "name", name )
            instance.set( "value", value )
            instance.set( "points", points )
            instance.set( "icon", icon )
            instance.set( "active", active )
            
            const savedReward = await instance.save()
            alert("Nuevo premio guardado con éxito.")
            this.$emit( "new-reward-saved", savedReward )
            this.reward = {}
          } catch ( ex ) {
            alert("Ocurrió un error al guardar nuevo premio. Intente nuevamente.")
          }
        } else {
          alert("Asegúrese de rellenar todos los campos.")
        }
      },
      async handlePreview( ev ) {
        const Preview = new Parse.File( ev.target.files[0].name, ev.target.files[0] )
        this.$set( this.reward, "icon", Preview )
      }
    }
  }
</script>