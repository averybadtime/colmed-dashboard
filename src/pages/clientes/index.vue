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
              <tbody>
                <transition-group name="fade" mode="out-in">
                  <tr v-for="client in clients"
                    :key="client.objectId">
                    <td>{{ client.name }}</td>
                    <td>{{ client.position }}</td>
                    <td>{{ client.document }}</td>
                    <td>{{ client.code }}</td>
                    <td>
                      <div class="btn-toolbar" role="toolbar">
                        <div class="btn-group" role="group">
                          <button type="button" class="btn">
                            <feather type="eye"/>
                          </button>
                          <button type="button" class="btn">
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
                </transition-group>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CreateClientForm from "@/components/forms/create-client-form"
  export default {
    components: {
      CreateClientForm
    },
    data() {
      return {
        clients: [],
        showCreateClientForm: false
      }
    },
    methods: {
      async getClients() {
        let clients
        try {
          const query = this.$parse.createQuery( "Client" )
          query.descending( "createdAt" )
          query.limit( this.defaultTableRows || 50)
          clients = await query.find()
        } catch ( ex ) {
          return console.error(ex)
        }
        clients.forEach(client => {
          const _client = client.toJSON()
          const { objectId, name, position, document, code } = _client
          this.clients.push({
            name,
            objectId,
            position,
            document,
            code
          })
        })
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
        const { objectId, name, position, document, code } = _savedClient
        this.clients.push({
          name,
          objectId,
          position,
          document,
          code
        })
      }
    },
    created() {
      this.getClients()
    }
  }
</script>