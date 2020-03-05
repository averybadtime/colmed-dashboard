<template>
  
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="form-group">
          <label for="file">Subir archivo para cotejar</label>
          <input type="file" name="file" id="file" class="form-control-file" v-on:change="handleChange">
        </div>
        <div class="form-group">
          <button class="btn btn-primary" v-on:click="save">Enviar</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import axios from "axios"
  export default {
    data() {
      return {
        file: null
      }
    },
    methods: {
      handleChange( ev ) {
        this.file = ev.target.files[0]
      },
      async save() {
        try {

          const form = new FormData()
          form.set("csvFile", this.file)

          const response = await axios.post("http://localhost:3000/afternoon", form)
          return console.log(response)

        } catch ( ex ) {
          console.error(ex)
        }
      }
    }
  }
</script>