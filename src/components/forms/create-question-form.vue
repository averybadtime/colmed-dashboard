<template>
  <el-dialog title="Registrar nueva pregunta y sus respuestas"
    width="60%"
    :visible.sync="visible">
    <fieldset>
      <legend>Información de pregunta</legend>
      <form>
        <div class="row">
          <div class="col-6">
            <div class="form-group">
              <label for="name">Pregunta</label>
              <input type="text"
                placeholder="Enunciado"
                name="text"
                id="text"
                class="form-control"
                v-model="question.text">
            </div>
          </div>
          <div class="col-6">
            <div class="form-group">
              <label for="name">Categoría</label>
              <select id="medicine"
                name="medicine"
                class="form-control"
                v-model="question.medicine">
                <option :value="undefined" disabled>--- Seleccione categoría ---</option>
                <option v-for="medicine in medicines"
                  :key="medicine.objectId"
                  :value="medicine.objectId">
                  {{ medicine.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="position">Puntos</label>
              <input type="number"
                placeholder="Puntos que otorga"
                name="points"
                id="points"
                class="form-control"
                v-model.number="question.points">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="company">Estado</label>
              <select name="active"
                id="active"
                class="form-control"
                v-model="question.active">
                <option :value="undefined" disabled>--- Seleccione el estado ---</option>
                <option :value="true">Activo</option>
                <option :value="false">Inactivo</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </fieldset>
    <fieldset>
      <legend>Repuestas</legend>
      <div class="row">
        <div class="col-12">
          <label for="answers" class="mb-4">Respuestas</label>
          <button class="btn btn-link float-right" v-on:click.prevent="add">Agregar respuesta</button>
          <input type="text"
            placeholder="Respuesta"
            class="form-control mb-3"
            name="answer"
            id="answer"
            v-on:keyup.enter="add"
            v-model="answer">
          <ul v-if="question.answers.length > 0">
            <li v-for="( answer, index ) in question.answers"
              :key="index">
                {{ answer }}
                <button v-on:click.prevent="remove(index)" class="btn btn-link">Eliminar</button>
            </li>
          </ul>
          <span class="text-muted d-block" v-else>Ninguna pregunta registrada</span>
        </div>
        <div class="col-12" v-if="question.answers.length > 0">
          <div class="form-group">
            <label for="answer">Seleccionar respuesta</label>
            <select name="answer"
              id="answer"
              class="form-control"
              v-model="question.rightAnswer">
              <option v-for="( answer, index ) in question.answers"
                :key="index"
                :value="index">
                {{ answer }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </fieldset>
    <span slot="footer" class="dialog-footer">
      <button class="btn" v-on:click="closeDialog">Cancelar</button>
      <button class="btn btn-info" v-on:click="save">Guardar</button>
    </span>
  </el-dialog>
</template>

<script>
  import medicines from "@/mixins/medicines"
  export default {
    mixins: [
      medicines
    ],
    props: {
      value: Boolean
    },
    data() {
      return {
        answer: null,
        question: {
          answers: []
        }
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
        const { answers, text, points, active, rightAnswer, medicine } = this.question
        if (
          text && text.trim() != "" &&
          points && points.toString().trim() != "" &&
          active != undefined &&
          answers && answers.length > 0 &&
          rightAnswer != undefined && text.toString().trim() != "" &&
          medicine && medicine.toString() != ""
        ) {
          const Question = this.$parse.createObject( "Question" )
          const instance = new Question()
          instance.set( "text", text )
          instance.set( "points", points )
          instance.set( "active", active )
          const Medicine = this.$parse.createObject( "Medicine" )
          const MedicineInstance = new Medicine()
          MedicineInstance.set( "objectId", medicine )
          instance.set( "medicine", MedicineInstance )
          let savedQuestion
          try {
            savedQuestion = await instance.save()
            answers.forEach(async ( x, index ) => {
              const Answer = this.$parse.createObject( "Answer" )
              const answerInstance = new Answer()
              answerInstance.set( "question", instance )
              answerInstance.set( "text", x )
              answerInstance.set( "valid", index == rightAnswer ? true : false )
              await answerInstance.save()
            })
          } catch ( ex ) {
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al guardar nueva pregunta.",
              type    : "error"
            })
          }
          this.$message({
            duration: 4000,
            message : "Nueva pregunta guardada con éxito.",
            type    : "success"
          })
          this.$emit( "new-question-saved", savedQuestion )
          this.question = {
            answers: []
          }
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
      add() {
        if ( this.question.answers.length < 4 ) {
          if ( this.answer && this.answer.trim() != "" ) {
            this.question.answers.push(this.answer)
            this.answer = null
          }
        }
      },
      remove( index ) {
        this.$delete(this.question.answers, index)
      }
    }
  }
</script>

<style scoped>
  ul {
    list-style-type: lower-alpha;
  }
</style>