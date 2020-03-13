<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4 font-weight-bolder">Premios</h1>
        <p class="lead">Listado general de premios</p>
      </div>
    </div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-info float-right"
            v-on:click="showCreateRewardForm = true">Nuevo premio</button>
        </div>
      </div>
      <div class="row">
        <create-reward-form v-show="showCreateRewardForm"
          v-model="showCreateRewardForm"
          v-on:new-reward-saved="handleNewRewardSaved"/>
        <edit-reward-form :reward-to-edit="rewardToEdit"
          v-if="showEditRewardForm"
          v-on:reward-updated="handleRewardUpdated"
          v-model="showEditRewardForm"/>
        <div class="col-12">
          <vue-good-table :rows="rewards"
            ref="Rewards"
            styleClass="vgt-table striped condensed"
            v-on:on-cell-click="handleRowClick"
            :columns="columns"
            :pagination-options="paginationOptions"
            :search-options="searchOptions"
            :select-options="selectOptions">
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'icon'">
                <a :href="props.row.icon"
                  target="_blank"
                  v-if="props.row.icon">
                  <img :src="props.row.icon"
                    alt="Imagen de referencia"
                    class="avatar avatar-48">
                </a>
                <span v-else>--</span>
              </span>
              <span v-else>
                {{ props.formattedRow[props.column.field] }}
              </span>
            </template>
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
  import CreateRewardForm from "@/components/forms/create-reward-form"
  import EditRewardForm from "@/components/forms/edit-reward-form"
  import VueGoodTableProps from "@/mixins/vue-good-table-props"
  export default {
    components: {
      CreateRewardForm,
      EditRewardForm
    },
    mixins: [
      VueGoodTableProps
    ],
    data() {
      return {
        columns: [{
          label: "Preview",
          field: "icon"
        }, {
          label: "Nombre",
          field: "name"
        }, {
          label: "Valor",
          field: "value",
          formatFn: this.formatCurrency,
          type : "number"
        }, {
          label   : "Puntos",
          field   : "points",
          type    : "number"
        }, {
          label   : "Estado",
          field   : "active",
          formatFn: this.formatStatus,
          sortable: false
        }],
        rewards: [],
        selectedRow: null,
        showCreateRewardForm: false,
        showEditRewardForm: false
      }
    },
    computed: {
      rewardToEdit() {
        if ( this.selectedRow ) {
          const reward = this.rewards.find(x => x.objectId == this.selectedRow)
          return Object.assign({}, reward)
        }
        return {}
      }
    },
    methods: {
      async getRewards() {
        let rewards
        try {
          const query = this.$parse.createQuery( "Award" )
          query.descending( "createdAt" )
          rewards = await query.find()
        } catch ( ex ) {
          return this.$message({
            duration: 4000,
            message : "Ocurrió un error al descargar los premios.",
            type    : "error"
          })
        }
        rewards.forEach(reward => {
          const _reward = reward.toJSON()
          const { objectId, name, value, points, active, icon  } = _reward
          this.rewards.push({
            name,
            objectId,
            points,
            value,
            active,
            icon: icon.url
          })
        })
      },
      async edit( objectId ) {
        if ( this.selectedRow == objectId ) return this.selectedRow = null
        this.selectedRow = objectId
      },
      async destroy( objectId, batch = false ) {
        const i = this.rewards.findIndex(x => x.objectId == objectId)
        let action
        if ( !batch ) {
          action = await this.$confirm( `¿Eliminar premio "${ this.rewards[i].name }"?`, "Advertencia", { type: "warning" } )
        }
        if ( !action && batch || action ) {
          const query = this.$parse.createQuery("Award")
          const reward = await query.get(objectId)
          try {
            await reward.destroy({ useMasterKey: true })
          } catch ( ex ) {
            if ( batch ) throw "batch"
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar el premio.",
              type    : "error"
            })
          }
          if ( !batch ) {
            this.$message({
              duration: 4000,
              message : "Premio eliminado con éxito.",
              type    : "success"
            })
          }
          this.$delete(this.rewards, i)
        }
      },
      async destroyBatch() {
        const { selectedRows } = this.$refs.Rewards
        try {
          const action           = await this.$confirm(`¿Eliminar ${selectedRows.length} premios?`, "Advertencia", { type: "warning" })
          if ( action ) {
            selectedRows.forEach( async row => {
              await this.destroy( row.objectId, "batch" )
            } )
          }
        } catch ( ex ) {
          if ( ex == "batch" ) {
            this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar los premios.",
              type    : "error"
            })
          }
          return
        }
        this.$message({
          duration: 4000,
          message : "Premios eliminados con éxito.",
          type    : "success"
        })
      },
      handleRowClick( params ) {
        this.selectedRow = params.row.objectId
        this.showEditRewardForm = true
      },
      handleNewRewardSaved( savedReward ) {
        const _savedReward = savedReward.toJSON()
        const { objectId, name, value, points, active, icon  } = _savedReward
        this.rewards.push({
          name,
          objectId,
          points,
          value,
          active,
          icon: icon.url
        })
        this.showCreateRewardForm = false
      },
      handleRewardUpdated( updatedReward ) {
        const _updatedReward = updatedReward.toJSON()
        const { objectId, name, value, points, active, icon  } = _updatedReward
        const index = this.rewards.findIndex(x => x.objectId == _updatedReward.objectId)
        this.$set(this.rewards, index, {
          name,
          objectId,
          points,
          value,
          active,
          icon: icon.url
        })
        this.selectedRow = null
      }
    },
    created() {
      this.getRewards()
    }
  }
</script>