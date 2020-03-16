<template>
  <el-dialog :title="`Actualizar información <${client.name}>`"
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
      <button class="btn btn-info" v-on:click="update">Guardar cambios</button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      clientToEdit: Object,
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
      async update() {
        const { objectId, name, position, document, email, company, code  } = this.client
        if (
          name && name.trim() != "" &&
          position && position.trim() != "" &&
          document && document.toString().trim() != "" &&
          email && email.trim() != "" &&
          company && company.trim() != "" &&
          code && code.trim() != ""
        ) {
          let User
          try {
            const query = this.$parse.createQuery( "Client" )
            User = await query.get( objectId )
            User.set( "name", name )
            User.set( "position", position )
            User.set( "document", document )
            User.set( "email", email )
            User.set( "company", company )
            User.set( "code", code )
            await User.save()
          } catch ( ex ) {
            return this.$message({
               duration: 4000,
               message : "Ocurrió un error al guardar la información del cliente.",
               type    : "error"
            })
          }
          this.$emit( "client-updated", User )
          this.$message({
            duration: 4000,
            message: "Información de cliente actualizada con éxito.",
            type: "success"
          })
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
    },
    created() {
      Object.assign( this.client, this.clientToEdit )
    }
  }
</script>