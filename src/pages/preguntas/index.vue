<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4 font-weight-bolder">Preguntas</h1>
        <p class="lead">Listado general de preguntas guardadas en el sistema</p>
      </div>
    </div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-info float-right"
            v-on:click="showCreateQuestionForm = true">Nueva pregunta</button>
        </div>
      </div>
      <div class="row">
        <create-question-form v-show="showCreateQuestionForm"
          v-model="showCreateQuestionForm"
          v-on:new-question-saved="handleNewQuestionForm"/>
        <edit-question-form :question-to-edit="questionToEdit"
          v-if="showEditQuestionForm"
          v-on:question-updated="handleQuestionUpdated"
          v-model="showEditQuestionForm"/>
        <div class="col-12">
          <vue-good-table :rows="questions"
            ref="Questions"
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
  import CreateQuestionForm from "@/components/forms/create-question-form"
  import EditQuestionForm from "@/components/forms/edit-question-form"
  import VueGoodTableProps from "@/mixins/vue-good-table-props"
  export default {
    components: {
      CreateQuestionForm,
      EditQuestionForm
    },
    mixins: [
      VueGoodTableProps
    ],
    data() {
      return {
        columns: [{
          label   : "Fecha",
          field   : "createdAt",
          formatFn: this.formatDate
        }, {
          label: "Pregunta",
          field: "text"
        }, {
          label: "Puntos",
          field: "points"
        }, {
          label: "Respuestas",
          field: "answersCount"
        }, {
          label   : "Estado",
          field   : "active",
          formatFn: this.formatStatus
        }],
        questions: [],
        selectedRow: null,
        showCreateQuestionForm: false,
        showEditQuestionForm: false
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
          return this.$message({
            duration: 4000,
            message : "Ocurrió un error al descargar las preguntas.",
            type    : "error"
          })
        }
        questions.forEach( async question => {
          const _question = question.toJSON()
          const { objectId, createdAt, text, active, points  } = _question
          const answersCount = await this.getAnswersCount( objectId )
          this.questions.push({
            createdAt,
            text,
            objectId,
            active,
            points,
            answersCount
          })
        } )
      },
      async getAnswersCount( questionId ) {
        try {
          const AnswerQuery = this.$parse.createQuery( "Answer" )
          const Question = this.$parse.createObject( "Question" )
          const QuestionInstance = new Question()
          QuestionInstance.set( "objectId", questionId )
          AnswerQuery.equalTo( "question", QuestionInstance )
          const count = await AnswerQuery.count()
          return count
        } catch ( ex ) {
          return "--"
        }
      },
      async destroy( objectId, batch = false ) {
        const i = this.questions.findIndex(x => x.objectId == objectId)
        let action
        if ( !batch ) {
          action = await this.$confirm( `¿Eliminar pregunta "${ this.questions[i].text }"?`, "Advertencia", { type: "warning" } )
        }
        if ( !action && batch || action ) {
          const query = this.$parse.createQuery("Question")
          const question = await query.get(objectId)
          try {
            await question.destroy({ useMasterKey: true })
          } catch ( ex ) {
            if ( batch ) throw "batch"
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar la pregunta.",
              type    : "error"
            })
          }
          if ( !batch ) {
            this.$message({
              duration: 4000,
              message : "Pregunta eliminada con éxito.",
              type    : "success"
            })
          }
          this.$delete(this.questions, i)
        }
      },
      async destroyBatch() {
        const { selectedRows } = this.$refs.Questions
        try {
          const action           = await this.$confirm(`¿Eliminar ${selectedRows.length} preguntas?`, "Advertencia", { type: "warning" })
          if ( action ) {
            selectedRows.forEach( async row => {
              await this.destroy( row.objectId, "batch" )
            } )
          }
        } catch ( ex ) {
          if ( ex == "batch" ) {
            this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar las preguntas.",
              type    : "error"
            })
          }
          return
        }
        this.$message({
          duration: 4000,
          message : "Preguntas eliminados con éxito.",
          type    : "success"
        })
      },
      handleRowClick( params ) {
        this.selectedRow = params.row.objectId
        this.showEditQuestionForm = true
      },
      async handleNewQuestionForm( savedQuestion ) {
        const _savedQuestion = savedQuestion.toJSON()
        const { objectId, createdAt, text, active, points  } = _savedQuestion
        const answersCount = await this.getAnswersCount( objectId )
        this.questions.push({
          createdAt,
          text,
          objectId,
          active,
          points,
          answersCount
        })
      },
      async handleQuestionUpdated( updatedQuestion ) {
        const _updatedQuestion = updatedQuestion.toJSON()
        const { objectId, createdAt, text, active, points  } = _updatedQuestion
        const index = this.questions.findIndex(x => x.objectId == _updatedQuestion.objectId)
        const answersCount = await this.getAnswersCount( objectId )
        this.$set(this.questions, index, {
          createdAt,
          text,
          objectId,
          active,
          points,
          answersCount
        })
        this.selectedRow = null
      }
    },
    created() {
      this.getQuestions()
    }
  }
</script>