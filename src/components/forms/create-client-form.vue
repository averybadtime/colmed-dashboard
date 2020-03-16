<template>
  <el-dialog title="Registrar nuevo cliente"
    width="60%"
    :visible.sync="visible">
    <fieldset>
      <legend>Información básica</legend>
      <form v-on:submit.prevent="save">
        <div class="row">
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
          <div class="col-12">
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
          <div class="col-12">
            <div class="form-group">
              <label for="position">Cargo</label>
              <input type="text"
                placeholder="Cargo"
                name="position"
                id="position"
                class="form-control"
                v-model="client.position">
            </div>
          </div>
          <div class="col-12">
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
  export default {
    props: {
      value: Boolean
    },
    data() {
      return {
        client: {}
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
        const { name, position, document, email, company, code } = this.client
        if (
          name && name.trim() != "" &&
          position && position.trim() != "" &&
          document && document.toString().trim() != "" &&
          email && email.trim() != "" &&
          company && company.trim() != "" &&
          code && code.trim() != ""
        ) {
          const Client = this.$parse.createObject( "Client" )
          const instance = new Client()
          instance.set( "name", name )
          instance.set( "position", position )
          instance.set( "document", document )
          instance.set( "email", email )
          instance.set( "company", company )
          instance.set( "code", code )
          let savedClient
          try {
            savedClient = await instance.save()
          } catch ( ex ) {
            this.$message({
              duration: 4000,
              message : "Ocurrió un error al guardar nuevo cliente.",
              type    : "error"
            })
          }
          this.$message({
            duration: 4000,
            message : "Nuevo cliente guardado con éxito.",
            type    : "success"
          })
          this.$emit( "new-client-saved", savedClient )
          this.client = {}
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
      }
    }
  }
</script>