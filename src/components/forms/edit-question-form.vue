<template>
  <el-dialog title="Actualizar información de pregunta y respuestas"
    width="60%"
    :visible.sync="visible">
    <fieldset>
      <legend>Información de pregunta</legend>
      <form v-on:submit.prevent="update">
        <div class="row">
          <div class="col-12">
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
                <option :value="null" disabled>--- Seleccione el estado ---</option>
                <option :value="true">Activo</option>
                <option :value="false">Inactivo</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </fieldset>
    <fieldset>
      <legend>Respuestas</legend>
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
                {{ answer.text }}
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
              <option :value="null" disabled>--- Seleccione la respuesta ---</option>
              <option v-for="( answer, index ) in question.answers"
                :key="index"
                :value="index">
                {{ answer.text }}
              </option>
            </select>
          </div>
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
  export default {
    props: {
      questionToEdit: Object,
      value         : Boolean
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
      async update() {
        const { objectId, text, points, active, answers, rightAnswer } = this.question
        if (
          text && text.trim() != "" &&
          points && points.toString().trim() != "" &&
          rightAnswer != undefined && text.toString().trim() != "" &&
          answers && answers.length > 1 &&
          active != undefined
        ) {
          const QuestionQuery = this.$parse.createQuery( "Question" )
          const Question = await QuestionQuery.get( objectId )
          Question.set( "text", text )
          Question.set( "points", points )
          Question.set( "active", active )
          try {
            const updatedQuestion = await Question.save()
            answers.forEach(async ( answer, index ) => {
              if ( answer.objectId ) {
                const AnswerQuery = this.$parse.createQuery( "Answer" )
                const _answer = await AnswerQuery.get( answer.objectId )
                _answer.set("valid", index == rightAnswer ? true : false)
                await _answer.save()
              } else {
                const Answer = this.$parse.createObject( "Answer" )
                const answerInstance = new Answer()
                answerInstance.set( "question", Question )
                answerInstance.set( "text", answer.text )
                answerInstance.set( "valid", index == rightAnswer ? true : false )
                await answerInstance.save()
              }
            })
          } catch ( ex ) {
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al guardar la información de la pregunta y sus respuestas.",
              type    : "error"
            })
          }
          this.$emit( "question-updated", Question )
          this.$message({
            duration: 4000,
            message : "Información de la pregunta y respuestas actualizada con éxito.",
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
      add() {
        if ( this.question.answers.length < 4 ) {
          if ( this.answer && this.answer.trim() != "" ) {
            this.question.answers.push({
              text: this.answer
            })
            this.answer = null
          }
        }
      },
      async remove( index ) {
        const answer = this.question.answers[index]
        if ( answer.objectId ) {
          const action = confirm(`¿Eliminar respuesta "${ answer.text }"?`)
          if ( action ) {
            const AnswerQuery = this.$parse.createQuery( "Answer" )
            const _answer     = await AnswerQuery.get(answer.objectId)
            await _answer.destroy({ useMasterKey: true })
            this.$delete(this.question.answers, index)
          }
        }
      }, 
      async getAnswers() {
        try {
          const AnswersQuery = this.$parse.createQuery( "Answer" )
          const Question = this.$parse.createObject( "Question" )
          const QuestionInstance = new Question()
          QuestionInstance.set( "objectId", this.question.objectId )
          AnswersQuery.equalTo( "question", QuestionInstance )
          AnswersQuery.ascending( "createdAt" )
          const _answers = await AnswersQuery.find()
          _answers.forEach( answer => {
            const _answer = answer.toJSON()
            const { objectId, text, valid } = _answer
            this.question.answers.push( { objectId, text, valid } )
          } )
        } catch ( ex ) {
          console.error( ex )
        }
      },
      setRightAnswer() {
        const index = this.question.answers.findIndex(x => x.valid)
        if ( index > -1 ) this.$set( this.question, "rightAnswer", index )
      }
    },
    async created() {
      Object.assign( this.question, this.questionToEdit )
      await this.getAnswers()
      this.setRightAnswer()
    }
  }
</script>