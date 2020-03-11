<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4 font-weight-bolder">Clientes</h1>
        <p class="lead">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium rem est cupiditate in qui exercitationem. Consequuntur eum aut corporis sint eius mollitia voluptate repellendus, ex dolor veritatis id. Voluptates, ipsa.</p>
      </div>
    </div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-info float-right"
            v-on:click="showCreateClientForm = !showCreateClientForm">Nuevo cliente</button>
        </div>
        <div class="col-12">
          <create-client-form v-if="showCreateClientForm"
            v-on:new-client-saved="handleNewClientSaved"/>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Cargo</th>
                  <th scope="col">Cédula</th>
                  <th scope="col">Código</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <transition-group name="fade" mode="out-in">
                <tbody v-for="client in clients"
                  :key="client.objectId">
                  <tr>
                    <td>{{ client.name }}</td>
                    <td>{{ client.position }}</td>
                    <td>{{ client.document }}</td>
                    <td>{{ client.code }}</td>
                    <td>
                      <div class="btn-toolbar" role="toolbar">
                        <div class="btn-group" role="group">
                          <button type="button" class="btn"
                            v-on:click="edit(client.objectId)">
                            <feather type="edit-3"/>
                          </button>
                          <button type="button" class="btn btn-danger"
                            v-on:click="destroy(client.objectId)">
                            <feather type="trash-2"/>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="selectedRow == client.objectId">
                    <td colspan="8">
                      <edit-client-form :client-to-edit="clientToEdit"
                        v-on:client-updated="handleClientUpdated"/>
                    </td>
                  </tr>
                </tbody>
              </transition-group>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CreateClientForm from "@/components/forms/create-client-form"
  import EditClientForm from "@/components/forms/edit-client-form"
  export default {
    components: {
      CreateClientForm,
      EditClientForm
    },
    data() {
      return {
        clients: [],
        selectedRow: null,
        showCreateClientForm: false
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
          clients = await query.find()
        } catch ( ex ) {
          return console.error(ex)
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
      async destroy(objectId) {
        const i = this.clients.findIndex(x => x.objectId == objectId)
        const action = confirm(`¿Eliminar cliente "${ this.clients[i].name }"?`)
        if ( action ) {
          const query = this.$parse.createQuery("Client")
          const client = await query.get(objectId)
          await client.destroy({ useMasterKey: true })
          this.$delete(this.clients, i)
          console.log("Eliminado con éxito.")
        }
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