<template>
  <div class="page">
    <div class="container-fluid">
      <div class="jumbotron jumbotron-fluid bg-primary">
        <div class="container text-white">
          <h1 class="display-4">Fuerza de Venta</h1>
          <p class="lead">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium rem est cupiditate in qui exercitationem. Consequuntur eum aut corporis sint eius mollitia voluptate repellendus, ex dolor veritatis id. Voluptates, ipsa.</p>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table table-striped table-bordered">
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
                <tbody>
                  <tr v-for="user in users"
                    :key="user.objectId">
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
                          <button type="button" class="btn">
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        users: []
      }
    },
    methods: {
      async getUsers() {
        let users
        try {
          const query = this.$parse.createQuery( "User" )
          query.equalTo( "rol", "fv" )
          query.include("city")
          query.descending( "createdAt" )
          query.limit( this.defaultTableRows || 50)
          users = await query.find()
        } catch ( ex ) {
          return console.error(ex)
        }
        users.forEach(user => {
          const _user = user.toJSON()
          const { objectId, createdAt, name, city, points } = _user
          this.users.push({
            createdAt,
            name,
            objectId,
            city: city.name,
            points
          })
        })
      },
      async destroy(objectId) {
        const i = this.users.findIndex(x => x.objectId == objectId)
        const action = confirm(`¿Eliminar usuario "${ this.users[i].name }"?`)
        if ( action ) {
          const query = this.$parse.createQuery("User")
          const user = await query.get(objectId)
          await user.destroy({ useMasterKey: true })
          this.$delete(this.users, i)
          console.log("Eliminado con éxito.")
        }
      }
    },
    created() {
      this.getUsers()
    }
  }
</script>