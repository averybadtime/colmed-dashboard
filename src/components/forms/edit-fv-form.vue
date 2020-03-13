<template>
  <el-dialog :title="`Actualizar información <${user.name}>`"
    width="60%"
    :visible.sync="visible">
    <fieldset>
      <legend>Información básica</legend>
      <form v-on:submit.prevent="update">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input type="text"
                name="name"
                id="name"
                class="form-control"
                v-model="user.name">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="name">Ciudad</label>
              <select name="city"
                id="city"
                class="form-control"
                v-model="user.city.id">
                <option :value="null" disabled>--- Seleccione ciudad ---</option>
                <option v-for="city in cities"
                  :key="city.objectId"
                  :value="city.objectId">
                  {{ city.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </fieldset>
    <fieldset v-if="user.total && user.total > 0">
      <legend>Repuestas (Solo lectura)</legend>
      <div class="row">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Respuesta</th>
                <th>Válida</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hola</td>
                <td>Cómo</td>
                <td>Estás?</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </fieldset>
    <span slot="footer" class="dialog-footer">
      <button class="btn" v-on:click="closeDialog">Cancelar</button>
      <button class="btn btn-info" v-on:click="update">Guardar cambios</button>
    </span>
  </el-dialog>
</template>

<script>
  import cities from "@/mixins/cities"
  export default {
    props: {
      userToEdit: Object,
      value     : Boolean
    },
    mixins: [
      cities
    ],
    data() {
      return {
        user: {},
        replies: []
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
        const { objectId, name, city } = this.user
        if (
          name && name.trim() != "" &&
          city.id && city.id.trim() != ""
        ) {
          const query = this.$parse.createQuery( "_User" )
          const User = await query.get(objectId)
          User.set( "name", name )
          const City = this.$parse.createObject( "City" )
          const cityInstance = new City()
          cityInstance.set("id", city.id)
          User.set( "city", cityInstance )
          try {
            await User.save( null, { useMasterKey: true } )
          } catch ( ex ) {
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al guardar la información del usuario.",
              type    : "error"
            })
          }
          this.$emit( "fv-updated", User )
          this.$message({
            duration: 4000,
            message : "Información de usuario actualizada con éxito.",
            type    : "success"
          })
          this.closeDialog()
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
      },
      async getQuestionsAndAnswers() {

        const User = this.$parse.createObject( "User" )
        const UserInstance = new User()
        UserInstance.set( "objectId", this.user.objectId )

        const RepliesQuery = this.$parse.createQuery( "Reply" )
        RepliesQuery.equalTo( "user", UserInstance )
        const Replies = await RepliesQuery.find()

        Replies.forEach( Reply => {

          const _Reply = Reply.toJSON()
          const { question, answer, valid } = _Reply
          this.replies.push({
            question: question.get("objectId"),
            answer: answer.get("objectId"),
            valid: true
          })

        } )

        try {

        } catch ( ex ) {
          console.error( ex )
        }
      }
    },
    created() {
      Object.assign( this.user, this.userToEdit )
      this.getCities()
      if ( this.user.total && this.user.total > 0 ) {
        this.getQuestionsAndAnswers()
      }
    }
  }
</script>