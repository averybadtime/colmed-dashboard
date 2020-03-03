<template>
  <form v-on:submit.prevent="save">
    <div class="row mb-5">
      <div class="col-12">
        <h4>Registrar nuevo material de estudio</h4>
      </div>
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
            class="form-control-file"
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
            class="form-control-file"
            v-on:change="handleFile">
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
        material: {}
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
          try {
            const Material = this.$parse.createObject( "StudyMaterial" )
            const instance = new Material()
            instance.set( "name", name )
            instance.set( "description", description )
            instance.set( "file", file )
            instance.set( "image", image )
            instance.set( "active", true )
            const savedMaterial = await instance.save()
            alert("Nuevo material guardado con éxito.")
            this.$emit( "new-material-saved", savedMaterial )
            this.material = {}
          } catch ( ex ) {
            alert("Ocurrió un error al guardar nuevo material. Intente nuevamente.")
          }
        } else {
          alert("Asegúrese de rellenar todos los campos.")
        }
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