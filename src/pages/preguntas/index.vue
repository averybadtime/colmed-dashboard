<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4 font-weight-bolder">Preguntas</h1>
        <p class="lead">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium rem est cupiditate in qui exercitationem. Consequuntur eum aut corporis sint eius mollitia voluptate repellendus, ex dolor veritatis id. Voluptates, ipsa.</p>
      </div>
    </div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-info float-right"
            v-on:click="showCreateQuestionForm = !showCreateQuestionForm">Nueva pregunta</button>
        </div>
        <div class="col-12">
          <create-question-form v-if="showCreateQuestionForm"
            v-on:new-question-saved="handleNewQuestionForm"/>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Pregunta</th>
                  <th scope="col">Respuestas</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <transition-group name="fade" mode="out-in">
                  <tr v-for="question in questions"
                    :key="question.objectId">
                    <td>
                      <small>{{ question.createdAt | date }}</small>
                    </td>
                    <td>{{ question.text }}</td>
                    <td>
                      <a href="javascript:void(0)">Ver respuestas</a>
                    </td>
                    <td>{{ question.active | status }}</td>
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
                            v-on:click="destroy(question.objectId)">
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
  import CreateQuestionForm from "@/components/forms/create-question-form"
  export default {
    components: {
      CreateQuestionForm
    },
    data() {
      return {
        questions: [],
        showCreateQuestionForm: false
      }
    },
    methods: {
      async getQuestions() {
        let questions
        try {
          const query = this.$parse.createQuery( "Question" )
          query.descending( "createdAt" )
          query.limit( this.defaultTableRows || 50)
          questions = await query.find()
        } catch ( ex ) {
          return console.error(ex)
        }
        questions.forEach(question => {
          const _question = question.toJSON()
          const { objectId, createdAt, text, active  } = _question
          this.questions.push({
            createdAt,
            text,
            objectId,
            active
          })
        })
      },
      getAnswers() {
        console.log("Obteniendo respuestas...")
      },
      async destroy(objectId) {
        const i = this.questions.findIndex(x => x.objectId == objectId)
        const action = confirm(`¿Eliminar pregunta "${ this.questions[i].text }"?`)
        if ( action ) {
          const query = this.$parse.createQuery("Question")
          const question = await query.get(objectId)
          await question.destroy({ useMasterKey: true })
          this.$delete(this.questions, i)
          console.log("Eliminado con éxito.")
        }
      },
      handleNewQuestionForm( savedQuestion ) {
        const _savedQuestion = savedQuestion.toJSON()
        const { objectId, createdAt, text, active  } = _savedQuestion
        this.questions.push({
          createdAt,
          text,
          objectId,
          active
        })
      }
    },
    created() {
      this.getQuestions()
    }
  }
</script>