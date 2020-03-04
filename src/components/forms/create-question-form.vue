<template>
  <form v-on:submit.prevent="save">
    <div class="row mb-5">
      <div class="col-12">
        <h4>Registrar nueva pregunta</h4>
      </div>
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
      <div class="col-12">
        <label for="answers" class="mb-4">Respuestas</label>
        <button class="btn btn-link float-right" v-on:click.prevent="add">Agregar respuesta</button>
        <input type="text"
          placeholder="Respuesta"
          class="form-control mb-3"
          name="answer"
          id="answer"
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
      <div class="col-12">
        <button class="btn btn-info float-right">Guardar nueva</button>
      </div>
    </div>
    <hr class="my-4">
  </form>
</template>

<script>
  export default {
    data() {
      return {
        answer: null,
        question: {
          answers: []
        }
      }
    },
    methods: {
      async save() {
        const { answers, text, points, active, rightAnswer } = this.question
        if (
          text && text.trim() != "" &&
          points && points.toString().trim() != "" &&
          active != undefined &&
          answers && answers.length > 0 &&
          rightAnswer != undefined && text.toString().trim() != ""
        ) {
          try {
            const Question = this.$parse.createObject( "Question" )
            const instance = new Question()
            instance.set( "text", text )
            instance.set( "points", points )
            instance.set( "active", active )
            const savedQuestion = await instance.save()
            answers.forEach(async ( x, index ) => {
              const Answer = this.$parse.createObject( "Answer" )
              const answerInstance = new Answer()
              answerInstance.set( "question", instance )
              answerInstance.set( "text", x )
              answerInstance.set( "valid", index == rightAnswer ? true : false )
              await answerInstance.save()
            })
            alert("Nueva pregunta guardada con éxito.")
            this.$emit( "new-question-saved", savedQuestion )
            this.question = {
              answers: []
            }
          } catch ( ex ) {
            alert("Ocurrió un error al guardar nueva pregunta. Intente nuevamente.")
          }
        } else {
          alert("Asegúrese de rellenar todos los campos.")
        }
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
    list-style: lower-alpha;
  }
</style>