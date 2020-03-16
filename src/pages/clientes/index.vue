<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4 font-weight-bolder">Clientes</h1>
        <p class="lead">Listado general de todos los clientes</p>
      </div>
    </div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-info float-right"
            v-on:click="showCreateClientForm = !showCreateClientForm">Nuevo cliente</button>
        </div>
      </div>
      <div class="row">
        <create-client-form v-on:new-client-saved="handleNewClientSaved"
          v-show="showCreateClientForm"
          v-model="showCreateClientForm"/>
        <edit-client-form :client-to-edit="clientToEdit"
          v-if="showEditClientForm"
          v-on:client-updated="handleClientUpdated"
          v-model="showEditClientForm"/>
        <div class="col-12">
          <vue-good-table :rows="clients"
            ref="FV"
            styleClass="vgt-table striped condensed"
            v-on:on-cell-click="handleRowClick"
            :columns="columns"
            :pagination-options="paginationOptions"
            :search-options="searchOptions"
            :select-options="selectOptions">
            <div slot="selected-row-actions">
              <button class="btn btn-danger btn-sm" v-on:click="destroyBatch">Eliminar</button>
            </div>
          </vue-good-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CreateClientForm from "@/components/forms/create-client-form"
  import EditClientForm from "@/components/forms/edit-client-form"
  import VueGoodTableProps from "@/mixins/vue-good-table-props"
  export default {
    components: {
      CreateClientForm,
      EditClientForm
    },
    mixins :[
      VueGoodTableProps
    ],
    data() {
      return {
        columns: [{
          label: "Nombre",
          field: "name"
        }, {
          label: "Empresa",
          field: "company"
        }, {
          label   : "Cargo",
          field   : "position",
          sortable: false
        }, {
          label   : "Documento",
          field   : "document",
          sortable: false
        }, {
          label: "Código",
          field: "code"
        }],
        clients: [],
        selectedRow: null,
        showCreateClientForm: false,
        showEditClientForm: false
      }
    },
    computed: {
      clientToEdit() {
        if ( this.selectedRow ) {
          const client = this.clients.find(x => x.objectId == this.selectedRow)
          return Object.assign({}, client)
        }
        return {}
      }
    },
    methods: {
      async getClients() {
        let clients
        try {
          const query = this.$parse.createQuery( "Client" )
          query.descending( "createdAt" )
          query.limit(5000)
          clients = await query.find()
        } catch ( ex ) {
          return this.$message({
            duration: 3000,
            message : "Ocurrió un error al descargar los clientes.",
            type    : "error"
          })
        }
        clients.forEach(client => {
          const _client = client.toJSON()
          const { objectId, name, position, document, code, company, email } = _client
          this.clients.push({
            name,
            objectId,
            position,
            document,
            code,
            company,
            email
          })
        })
      },
      async edit( objectId ) {
        if ( this.selectedRow == objectId ) return this.selectedRow = null
        this.selectedRow = objectId
      },
      async destroy( objectId, batch = false ) {
        const i = this.clients.findIndex(x => x.objectId == objectId)
        let action
        if ( !batch ) {
          action = await this.$confirm( `¿Eliminar cliente "${ this.clients[i].name }"?`, "Advertencia", { type: "warning" } )
        }
        if ( !action && batch || action ) {
          const query = this.$parse.createQuery("Client")
          const client = await query.get( objectId )
          try {
            await client.destroy({ useMasterKey: true })
          } catch ( ex ) {
            if ( batch ) throw "batch"
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar el cliente.",
              type    : "error"
            })
          }
          if ( !batch ) {
            this.$message({
              duration: 4000,
              message : "Cliente eliminado con éxito.",
              type    : "success"
            })
          }
          this.$delete(this.clients, i)
        }
      },
      async destroyBatch() {
        const { selectedRows } = this.$refs.FV
        try {
          const action           = await this.$confirm(`¿Eliminar ${selectedRows.length} clientes?`, "Advertencia", { type: "warning" })
          if ( action ) {
            selectedRows.forEach( async row => {
              await this.destroy( row.objectId, "batch" )
            } )
          }
        } catch ( ex ) {
          if ( ex == "batch" ) {
            this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar los clientes.",
              type    : "error"
            })
          }
          return
        }
        this.$message({
          duration: 4000,
          message : "Clientes eliminados con éxito.",
          type    : "success"
        })
      },
      handleRowClick( params ) {
        this.selectedRow = params.row.objectId
        this.showEditClientForm = true
      },
      handleNewClientSaved( savedClient ) {
        const _savedClient = savedClient.toJSON()
        const { objectId, name, position, document, code, company, email } = _savedClient
        this.clients.push({
          name,
          objectId,
          position,
          document,
          code,
          company,
          email
        })
      },
      handleClientUpdated( updatedClient ) {
        const _updatedClient = updatedClient.toJSON()
        const { objectId, name, position, document, code, company, email } = _updatedClient
        const index = this.clients.findIndex( x => x.objectId == objectId )
        if ( index > -1 ) {
          this.$set( this.clients, index, {
            name,
            objectId,
            position,
            document,
            code,
            company,
            email
          })
        }
        this.selectedRow = null
      }
    },
    created() {
      this.getClients()
    }
  }
</script>