<template>
  <el-dialog title="Registrar nuevo material de estudio"
    width="60%"
    :visible.sync="visible">
    <fieldset>
      <legend>Información básica</legend>
      <form>
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input type="text"
                placeholder="Nombre del material"
                name="name"
                id="name"
                class="form-control"
                v-model="material.name">
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
      async save() {
        const { name, description, image, file } = this.material
        if (
          name && name.trim() != "" &&
          description && description.trim() != "" &&
          image &&
          file
        ) {
          const Material = this.$parse.createObject( "StudyMaterial" )
          const instance = new Material()
          instance.set( "name", name )
          instance.set( "description", description )
          instance.set( "file", file )
          instance.set( "image", image )
          instance.set( "active", true )
          let savedMaterial
          try {
            savedMaterial = await instance.save()
          } catch ( ex ) {
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al guardar nuevo material.",
              type    : "error"
            })
          }
          this.$message({
            duration: 4000,
            message : "Nuevo material guardado con éxito.",
            type    : "success"
          })
          this.$emit( "new-material-saved", savedMaterial )
          this.material = {}
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
    }
  }
</script>