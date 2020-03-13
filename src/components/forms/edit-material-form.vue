<template>
  <el-dialog :title="`Actualizar información <${material.name}>`"
    width="60%"
    :visible.sync="visible">
    <fieldset>
      <legend>Información básica</legend>
      <form v-on:submit.prevent="update">
        <div class="row">
          <div class="col-6">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input type="text"
                name="name"
                id="name"
                class="form-control"
                v-model="material.name">
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="active">Estado</label>
              <select name="active"
                id="active"
                class="form-control"
                v-model="material.active">
                <option :value="null" disabled>--- Seleccione el estado ---</option>
                <option :value="true">Activo</option>
                <option :value="false">Inactivo</option>
              </select>
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea name="description"
                id="description"
                cols="30"
                rows="10"
                placeholder="Descripción del material"
                class="form-control"
                v-model="material.description">
              </textarea>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="preview">Preview</label>
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
              <label for="file">Archivo</label>
              <input type="file"
                name="file"
                id="file"
                class="form-control-file btn btn-light"
                v-on:change="handleFile">
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
      materialToEdit: Object,
      value         : Boolean
    },
    data() {
      return {
        material: {}
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
        const { objectId, image, name, description, file, active } = this.material
        if (
          name && name.trim() != "" &&
          description && description.trim() != ""
        ) {
          const query = this.$parse.createQuery( "StudyMaterial" )
          const Material = await query.get( objectId )
          Material.set( "name", name )
          Material.set( "description", description )
          Material.set( "active", active )
          if ( image && image != this.materialToEdit.image ) Material.set( "image", image )
          if ( file && file != this.materialToEdit.file ) Material.set( "file", file )
          try {
            await Material.save()
          } catch ( ex ) {
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al guardar la información del material de estudio.",
              type    : "error"
            })
          }
          this.$emit( "material-updated", Material )
          this.$message({
            duration: 4000,
            message : "Información de material de estudio actualizada con éxito.",
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
        this.$set( this.material, "image", Preview )
      },
      async handleFile( ev ) {
        const PDF = new Parse.File( ev.target.files[0].name, ev.target.files[0] )
        this.$set( this.material, "file", PDF )
      }
    },
    created() {
      Object.assign( this.material, this.materialToEdit )
    }
  }
</script>