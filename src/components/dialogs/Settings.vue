<template>
  <el-dialog title="Ajustes del sistema"
    width="50%"
    :visible.sync="visible">
    <fieldset>
      <legend>Configuraciones</legend>
      <form v-on:submit.prevent="save">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="pointsPerLevel">Puntos por nivel</label>
              <input type="number"
                class="form-control"
                name="pointsPerLevel"
                id="pointsPerLevel"
                v-model.number="config.pointsPerLevel">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="pointsPerQuestion">Puntos por pregunta</label>
              <input type="number"
                class="form-control"
                name="pointsPerQuestion"
                id="pointsPerQuestion"
                v-model.number="config.pointsPerQuestion">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="questionPerClient">Preguntas por cliente</label>
              <input type="number"
                class="form-control"
                name="questionPerClient"
                id="questionPerClient"
                v-model.number="config.questionPerClient">
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="form-group">
              <label for="questionPerDay">Preguntas por día</label>
              <input type="number"
                class="form-control"
                name="questionPerDay"
                id="questionPerDay"
                v-model.number="config.questionPerDay">
            </div>
          </div>
        </div>
      </form>
    </fieldset>
    <span slot="footer" class="dialog-footer">
      <button class="btn" v-on:click="visible = false">Cancelar</button>
      <button class="btn btn-info" v-on:click="save">Guardar</button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      value: Boolean
    },
    data() {
      return {
        config: {}
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
      async getConfigs() {
        const ConfigQuery = this.$parse.createQuery( "Config" )
        let Configs
        try {
          Configs = (await ConfigQuery.find()).pop()
        } catch ( ex ) {
          return this.$message( {
            duration: 4000,
            message : "Ocurrió un error al descargar las configuraciones.",
            type    : "error"
          } )
        }
        const { objectId, pointsPerLevel, pointsPerQuestion, questionPerClient, questionPerDay } = Configs.toJSON()
        this.config = {
          objectId,
          pointsPerLevel,
          pointsPerQuestion,
          questionPerClient,
          questionPerDay
        }
      },
      async save() {
        const { objectId, pointsPerLevel, pointsPerQuestion, questionPerClient, questionPerDay } = this.config
        if (
          !pointsPerLevel || pointsPerLevel.toString().trim() == "" ||
          !pointsPerQuestion || pointsPerQuestion.toString().trim() == "" ||
          !questionPerClient || questionPerClient.toString().trim() == "" ||
          !questionPerDay || questionPerDay.toString().trim() == ""
        ) {
          return this.$message({
            duration: 4000,
            message : "Asegúrese de rellenar todos los campos.",
            type    : "error"
          })
        }
        if (
          pointsPerLevel    <= 0 ||
          pointsPerQuestion <= 0 ||
          questionPerClient <= 0 ||
          questionPerDay    <= 0
        ) {
          return this.$message({
            duration: 4000,
            message : "Los valores deben ser mayores a 0.",
            type    : "error"
          })
        }
        const Config = this.$parse.createQuery( "Config" )
        const _Config = await Config.get( objectId )
        _Config.set({ pointsPerLevel, pointsPerQuestion, questionPerClient, questionPerDay })
        try {
          await _Config.save()
        } catch ( ex ) {
          return this.$message({
            duration: 4000,
            message : "Ocurrió un error al guardar las configuraciones. Intente nuevamente.",
            type    : "error"
          })
        }
        this.visible = false
        this.$message({
          duration: 4000,
          message : "Configuraciones guardadas con éxito.",
          type    : "success"
        })
      }
    },
    created() {
      this.getConfigs()
    }
  }
</script>