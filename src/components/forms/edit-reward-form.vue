<template>
  <el-dialog :title="`Actualizar información <${reward.name}>`"
    width="60%"
    :visible.sync="visible">
    <fieldset>
      <legend>Información básica</legend>
      <form v-on:submit.prevent="update">
        <div class="row">
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
        </div>
      </form>
    </fieldset>
    <span slot="footer" class="dialog-footer">
      <button class="btn" v-on:click="closeDialog">Cancelar</button>
      <button class="btn btn-info" v-on:click="update">Guardar cambios</button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      rewardToEdit: Object,
      value       : Boolean
    },
    data() {
      return {
        reward: {}
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
      async update() {
        const { objectId, name, value, points, active, icon } = this.reward
        if (
          name && name.trim() != "" &&
          value && value.toString().trim() != "" &&
          points && points.toString().trim() != "" &&
          active != undefined
        ) {
          const query = this.$parse.createQuery( "Award" )
          const Reward = await query.get( objectId )
          Reward.set( "name", name )
          Reward.set( "value", value )
          Reward.set( "points", points )
          Reward.set( "active", active )
          if ( icon && icon != this.rewardToEdit.icon ) Reward.set( "icon", icon )
          try {
            await Reward.save()
          } catch ( ex ) {
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al guardar la información del premio.",
              type    : "error"
            })
          }
          this.$emit( "reward-updated", Reward )
          this.$message({
            duration: 4000,
            message : "Información de premio actualizada con éxito.",
            type    : "success"
          })
          this.closeDialog()
        } else {
          this.$message({
            duration: 4000,
            message : "Asegúrese de rellenar todos los campos.",
            type    : "error"
          })
        }
      },
      closeDialog() {
        this.visible = false
      },
      async handlePreview( ev ) {
        const Preview = new Parse.File( ev.target.files[0].name, ev.target.files[0] )
        this.$set( this.reward, "icon", Preview )
      }
    },
    created() {
      Object.assign( this.reward, this.rewardToEdit )
    }
  }
</script>