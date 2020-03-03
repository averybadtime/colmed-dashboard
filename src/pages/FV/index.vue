<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4">Fuerza de Venta</h1>
        <p class="lead">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium rem est cupiditate in qui exercitationem. Consequuntur eum aut corporis sint eius mollitia voluptate repellendus, ex dolor veritatis id. Voluptates, ipsa.</p>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th colspan="4"></th>
                  <th colspan="3" class="text-center">Preguntas</th>
                  <th></th>
                </tr>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Ciudad</th>
                  <th scope="col">Puntos</th>
                  <th scope="col">Resueltas</th>
                  <th scope="col">Acertadas</th>
                  <th scope="col">Perdidas</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <transition-group name="fade" mode="out-in">
                <tbody v-for="user in users"
                    :key="user.objectId">
                  <tr>
                    <td>
                      <small>{{ user.createdAt | date }}</small>
                    </td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.city }}</td>
                    <td>{{ user.points }}</td>
                    <td>{{ user.points }}</td>
                    <td>{{ user.points }}</td>
                    <td>{{ user.points }}</td>
                    <td>
                      <div class="btn-toolbar" role="toolbar">
                        <div class="btn-group" role="group">
                          <button type="button" class="btn">
                            <feather type="eye"/>
                          </button>
                          <button type="button"
                            class="btn"
                            v-on:click="edit(user.objectId)">
                            <feather type="edit-3"/>
                          </button>
                          <button type="button"
                            class="btn btn-danger"
                            v-on:click="destroy(user.objectId)">
                            <feather type="trash-2"/>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="selectedRow == user.objectId">
                    <td colspan="8">
                      <edit-fv-form v-model="userToEdit"/>
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
  import EditFvForm from "@/components/forms/edit-fv-form"
  import replies from "@/mixins/replies"
  export default {
    components: {
      EditFvForm
    },
    mixins: [
      replies
    ],
    data() {
      return {
        users: [],
        selectedRow: null
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
          query.limit( this.defaultTableRows || 50 )
          users = await query.find()
        } catch ( ex ) {
          return console.error( ex )
        }
        users.forEach(user => {
          const _user = user.toJSON()
          const { objectId, createdAt, name, city, points } = _user
          this.getRepliesByUserId( objectId )



          this.users.push({
            createdAt,
            name,
            objectId,
            city: city.name,
            points
          })
        })
      },
      async edit( objectId ) {
        if ( this.selectedRow == objectId ) return this.selectedRow = null
        this.selectedRow = objectId
      },
      async destroy( objectId ) {
        const i = this.users.findIndex(x => x.objectId == objectId)
        const action = confirm(`¿Eliminar usuario "${ this.users[i].name }"?`)
        if ( action ) {
          const query = this.$parse.createQuery("User")
          const user = await query.get(objectId)
          await user.destroy({ useMasterKey: true })
          this.$delete(this.users, i)
        }
      }
    },
    created() {
      this.getUsers()
    }
  }
</script>