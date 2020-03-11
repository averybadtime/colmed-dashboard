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
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Pregunta</th>
                  <th scope="col" class="text-success">Puntos</th>
                  <th scope="col">Respuestas</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <transition-group name="fade" mode="out-in">
                <tbody v-for="question in questions"
                  :key="question.objectId">
                  <tr>
                    <td>
                      <small>{{ question.createdAt | date }}</small>
                    </td>
                    <td>{{ question.text }}</td>
                    <td>{{ question.points }}</td>
                    <td>
                      <a href="javascript:void(0)">Ver</a>
                    </td>
                    <td>{{ question.active | status }}</td>
                    <td>
                      <div class="btn-toolbar" role="toolbar">
                        <div class="btn-group" role="group">
                          <button type="button" class="btn"
                            v-on:click="edit(question.objectId)">
                            <feather type="edit-3"/>
                          </button>
                          <button type="button" class="btn text-danger"
                            v-on:click="destroy(question.objectId)">
                            <feather type="trash-2"/>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="selectedRow == question.objectId">
                    <td colspan="8">
                      <edit-question-form :question-to-edit="questionToEdit"
                        v-on:question-updated="handleQuestionUpdated"/>
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
  import CreateQuestionForm from "@/components/forms/create-question-form"
  import EditQuestionForm from "@/components/forms/edit-question-form"
  export default {
    components: {
      CreateQuestionForm,
      EditQuestionForm
    },
    data() {
      return {
        questions: [],
        selectedRow: null,
        showCreateQuestionForm: false
      }
    },
    computed: {
      questionToEdit() {
        if ( this.selectedRow ) {
          const question = this.questions.find(x => x.objectId == this.selectedRow)
          return Object.assign({}, question)
        }
        return {}
      }
    },
    methods: {
      async getQuestions() {
        let questions
        try {
          const query = this.$parse.createQuery( "Question" )
          query.descending( "createdAt" )
          questions = await query.find()
        } catch ( ex ) {
          return console.error(ex)
        }
        questions.forEach(question => {
          const _question = question.toJSON()
          const { objectId, createdAt, text, active, points  } = _question
          this.questions.push({
            createdAt,
            text,
            objectId,
            active,
            points
          })
        })
      },
      getAnswers() {
        console.log("Obteniendo respuestas...")
      },
      async edit( objectId ) {
        if ( this.selectedRow == objectId ) return this.selectedRow = null
        this.selectedRow = objectId
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
        const { objectId, createdAt, text, active, points  } = _savedQuestion
        this.questions.push({
          createdAt,
          text,
          objectId,
          active,
          points
        })
      },
      handleQuestionUpdated( updatedQuestion ) {
        const _updatedQuestion = updatedQuestion.toJSON()
        const { objectId, createdAt, text, active, points  } = _updatedQuestion
        const index = this.questions.findIndex(x => x.objectId == _updatedQuestion.objectId)
        this.$set(this.questions, index, {
          createdAt,
          text,
          objectId,
          active,
          points
        })
        this.selectedRow = null
      }
    },
    created() {
      this.getQuestions()
    }
  }
</script>