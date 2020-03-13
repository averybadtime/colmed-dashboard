<template>
  <el-dialog title="Registrar nuevo premio"
    width="60%"
    :visible.sync="visible">
    <fieldset>
      <legend>Información de premio</legend>
      <form>
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
                class="form-control-file btn btn-light"
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
      <button class="btn btn-info" v-on:click="save">Guardar</button>
    </span>
  </el-dialog>
</template>

<script>
  import Parse from "parse"
  export default {
    props: {
      value: Boolean
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
      async save() {
        const { name, value, points, icon, active } = this.reward
        if (
          name && name.trim() != "" &&
          value && value.toString().trim() != "" &&
          points && points.toString().trim() != "" &&
          icon &&
          active != undefined
        ) {
          const Reward = this.$parse.createObject( "Award" )
          const instance = new Reward()
          instance.set( "name", name )
          instance.set( "value", value )
          instance.set( "points", points )
          instance.set( "icon", icon )
          instance.set( "active", active )
          let savedReward
          try {
            savedReward = await instance.save()
          } catch ( ex ) {
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al guardar nuevo premio.",
              type    : "error"
            })
          }
          this.$message({
            duration: 4000,
            message : "Nuevo premio guardado con éxito.",
            type    : "success"
          })
          this.$emit( "new-reward-saved", savedReward )
          this.reward = {}
          this.closeDialog()
        } else {
          return this.$message({
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
    }
  }
</script>