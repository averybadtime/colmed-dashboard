<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4 font-weight-bolder">Fuerza de Venta</h1>
        <p class="lead">Listado general de usuarios en Fuerza de Venta</p>
      </div>
    </div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-info float-right"
            v-on:click="showCreateFVForm = true">Nuevo usuario</button>
        </div>
      </div>
      <div class="row">
        <create-fv-form v-on:new-fv-saved="handleNewFVSaved"
          v-show="showCreateFVForm"
          v-model="showCreateFVForm"/>
        <edit-fv-form :user-to-edit="userToEdit"
          v-if="showEditFVForm"
          v-on:fv-updated="handleFVUpdated"
          v-model="showEditFVForm"/>
        <div class="col-12">
          <vue-good-table :rows="users"
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
  import CreateFvForm from "@/components/forms/create-fv-form"
  import EditFvForm from "@/components/forms/edit-fv-form"
  import replies from "@/mixins/replies"
  import VueGoodTableProps from "@/mixins/vue-good-table-props"
  export default {
    components: {
      EditFvForm,
      CreateFvForm
    },
    mixins: [
      replies,
      VueGoodTableProps
    ],
    data() {
      return {
        columns: [{
          label   : "Fecha",
          field   : "createdAt",
          formatFn: this.formatDate
        }, {
          label: "Nombre",
          field: "name"
        }, {
          label: "Ciudad",
          field: "city.name"
        }, {
          label   : "Puntos",
          field   : "points",
          formatFn: this.formatQuantity,
          sortable: false
        }, {
          label   : "Resueltas",
          field   : "total",
          formatFn: this.formatQuantity,
          sortable: false
        }, {
          label   : "Perdidas",
          field   : "losses",
          formatFn: this.formatQuantity,
          sortable: false
        }, {
          label   : "Acertadas",
          field   : "wins",
          formatFn: this.formatQuantity,
          sortable: false
        }, {
          label   : "Recompensas",
          field   : "claims",
          formatFn: this.formatQuantity,
          sortable: false
        }],
        users: [],
        selectedRow: null,
        showCreateFVForm: false,
        showEditFVForm: false
      }
    },
    computed: {
      userToEdit() {
        if ( this.selectedRow ) {
          const user = this.users.find(x => x.objectId == this.selectedRow)
          return Object.assign({}, user)
        }
        return {}
      }
    },
    methods: {
      async getUsers() {
        let users
        try {
          const query = this.$parse.createQuery( "User" )
          query.equalTo( "rol", "fv" )
          query.include( "city" )
          query.descending( "createdAt" )
          users = await query.find()
        } catch ( ex ) {
          return this.$message({
            duration: 4000,
            message : "Ocurrió un error al descargar los usuarios.",
            type    : "error"
          })
        }
        users.forEach(async user => {
          const _user = user.toJSON()
          const { objectId, createdAt, name, city, points } = _user
          // User Parse Object
          const User         = this.$parse.createObject( "User" )
          const UserInstance = new User()
          UserInstance.set( "objectId", objectId )
          // Recompensas
          const ClaimsQuery  = this.$parse.createQuery( "Claims" )
          ClaimsQuery.equalTo( "user", UserInstance )
          const _claims = await ClaimsQuery.count()
          // Respuestas
          const RepliesQuery = this.$parse.createQuery( "Reply" )
          RepliesQuery.equalTo( "user", UserInstance )
          const _replies = await RepliesQuery.find()
          let wins = 0
          let losses = 0
          _replies.forEach( reply => {
            const _reply = reply.toJSON()
            if ( _reply.valid ) wins++
            else losses++
          } )
          this.users.push({
            createdAt,
            name,
            objectId,
            city: {
              name: city ? city.name    : _user.username,
              id  : city ? city.objectId: "No objectId"
            },
            points,
            claims: _claims,
            total: _replies.length,
            wins,
            losses
          })
        })
      },
      async destroy( objectId, batch = false ) {
        const i = this.users.findIndex(x => x.objectId == objectId)
        let action
        if ( !batch ) {
          action = await this.$confirm( `¿Eliminar usuario "${ this.users[i].name }"?`, "Advertencia", { type: "warning" } )
        }
        if ( !action && batch || action ) {
          const query = this.$parse.createQuery("User")
          const user  = await query.get(objectId)
          try {
            await user.destroy({ useMasterKey: true })
          } catch ( ex ) {
            if ( batch ) throw "batch"
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar el usuario.",
              type    : "error"
            })
          }
          if ( !batch ) {
            this.$message({
              duration: 4000,
              message : "Usuario eliminado con éxito.",
              type    : "success"
            })
          }
          this.$delete(this.users, i)
        }
      },
      async destroyBatch() {
        const { selectedRows } = this.$refs.FV
        try {
          const action           = await this.$confirm(`¿Eliminar ${selectedRows.length} usuarios?`, "Advertencia", { type: "warning" })
          if ( action ) {
            selectedRows.forEach( async row => {
              await this.destroy( row.objectId, "batch" )
            } )
          }
        } catch ( ex ) {
          if ( ex == "batch" ) {
            this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar los usuarios.",
              type    : "error"
            })
          }
          return
        }
        this.$message({
          duration: 4000,
          message : "Usuarios eliminados con éxito.",
          type    : "success"
        })
      },
      handleRowClick( params ) {
        this.selectedRow = params.row.objectId
        this.showEditFVForm = true
      },
      handleNewFVSaved( savedFV ) {
        const _savedFV = savedFV.toJSON()
        const { objectId, createdAt, name, city, points } = _savedFV
        this.users.push({
          createdAt,
          name,
          objectId,
          city: {
            name: city.name,
            id  : city.objectId
          },
          points
        })
      },
      handleFVUpdated( updatedFV ) {
        const _updatedFV = updatedFV.toJSON()
        const { objectId, createdAt, name, city, points } = _updatedFV
        const index = this.users.findIndex( x => x.objectId == objectId )
        if ( index > -1 ) {
          this.$set( this.users, index, {
            createdAt,
            name,
            objectId,
            city: {
              name: city.name,
              id  : city.objectId
            },
            points
          })
        }
        this.selectedRow = null
      }
    },
    created() {
      this.getUsers()
    }
  }
</script>