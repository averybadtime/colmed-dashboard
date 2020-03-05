<template>
  <form v-on:submit.prevent="update">
    <div class="row">
      <div class="col-12">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text"
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
        <button class="btn btn-primary float-right mb-3">Guardar cambios</button>
      </div>
    </div>
  </form>
</template>
<script>
  export default {
    props: {
      materialToEdit: Object
    },
    data() {
      return {
        material: {}
      }
    },
    methods: {
      async update() {
        const { objectId, image, name, description, file } = this.material
        if (
          name && name.trim() != "" &&
          description && description.trim() != ""
        ) {
          const query = this.$parse.createQuery( "StudyMaterial" )
          try {
            const Material = await query.get( objectId )
            Material.set( "name", name )
            Material.set( "description", description )
            if ( image && image != this.materialToEdit.image ) Material.set( "image", image )
            if ( file && file != this.materialToEdit.file ) Material.set( "file", file )
            await Material.save()
            this.$emit( "material-updated", Material )
          } catch ( ex ) {
            return console.error("Ocurrió un error al guardar la información del material de estudio. Intente nuevamente.")
          }
          alert("Información de material de estudio actualizada con éxito.")
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
    },
    created() {
      Object.assign( this.material, this.materialToEdit )
    }
  }
</script>