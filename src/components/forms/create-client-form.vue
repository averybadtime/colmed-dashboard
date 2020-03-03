<template>
  <form v-on:submit.prevent="save">
    <div class="row mb-5">
      <div class="col-12">
        <h4>Registrar nuevo cliente</h4>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text"
            placeholder="Nombre del cliente"
            name="name"
            id="name"
            class="form-control"
            v-model="client.name">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="position">Cargo</label>
          <input type="text"
            placeholder="Nombre del cliente"
            name="position"
            id="position"
            class="form-control"
            v-model="client.position">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="document">Cédula / DNI</label>
          <input type="number"
            placeholder="Documento"
            name="document"
            id="document"
            class="form-control"
            v-model.number="client.document">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="email"
            placeholder="john@doe.com"
            name="email"
            id="email"
            class="form-control"
            v-model="client.email">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="company">Empresa / Compañía</label>
          <input type="text"
            placeholder="Nombre de la compañía"
            name="company"
            id="company"
            class="form-control"
            v-model="client.company">
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label for="code">Código</label>
          <input type="text"
            placeholder="Código del cliente"
            name="code"
            id="code"
            class="form-control"
            v-model="client.code">
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
  export default {
    data() {
      return {
        client: {}
      }
    },
    methods: {
      async save() {
        const { name, position, document, email, company, code } = this.client
        if (
          name && name.trim() != "" &&
          position && position.trim() != "" &&
          document && document.toString().trim() != "" &&
          email && email.trim() != "" &&
          company && company.trim() != "" &&
          code && code.trim() != ""
        ) {
          try {
            const Client = this.$parse.createObject( "Client" )
            const instance = new Client()
            instance.set( "name", name )
            instance.set( "position", position )
            instance.set( "document", document )
            instance.set( "email", email )
            instance.set( "company", company )
            instance.set( "code", code )
            const savedClient = await instance.save()
            alert("Nuevo cliente guardado con éxito.")
            this.$emit( "new-client-saved", savedClient )
            this.client = {}
          } catch ( ex ) {
            alert("Ocurrió un error al guardar nuevo cliente. Intente nuevamente.")
          }
        } else {
          alert("Asegúrese de rellenar todos los campos.")
        }
      }
    }
  }
</script>