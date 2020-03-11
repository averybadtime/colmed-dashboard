<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4 font-weight-bolder">Premios</h1>
        <p class="lead">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium rem est cupiditate in qui exercitationem. Consequuntur eum aut corporis sint eius mollitia voluptate repellendus, ex dolor veritatis id. Voluptates, ipsa.</p>
      </div>
    </div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-info float-right"
            v-on:click="showCreateRewardForm = !showCreateRewardForm">Nuevo premio</button>
        </div>
        <div class="col-12">
          <create-reward-form v-if="showCreateRewardForm"
            v-on:new-reward-saved="handleNewRewardSaved"/>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Preview</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Puntos</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <transition-group name="fade" mode="out-in">
                <tbody v-for="reward in rewards"
                  :key="reward.objectId">
                  <tr>
                    <td>
                      <img :src="reward.icon"
                        alt="Reward icon"
                        class="avatar avatar-48">
                    </td>
                    <td>{{ reward.name }}</td>
                    <td>{{ reward.value }}</td>
                    <td>{{ reward.points }}</td>
                    <td>{{ reward.active | status }}</td>
                    <td>
                      <div class="btn-toolbar" role="toolbar">
                        <div class="btn-group" role="group">
                          <button type="button" class="btn"
                            v-on:click="edit(reward.objectId)">
                            <feather type="edit-3"/>
                          </button>
                          <button type="button" class="btn text-danger"
                            v-on:click="destroy(reward.objectId)">
                            <feather type="trash-2"/>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="selectedRow == reward.objectId">
                    <td colspan="8">
                      <edit-reward-form :reward-to-edit="rewardToEdit"
                        v-on:reward-updated="handleRewardUpdated"/>
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
  import CreateRewardForm from "@/components/forms/create-reward-form"
  import EditRewardForm from "@/components/forms/edit-reward-form"
  export default {
    components: {
      CreateRewardForm,
      EditRewardForm
    },
    data() {
      return {
        rewards: [],
        selectedRow: null,
        showCreateRewardForm: false
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
          return console.error(ex)
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
      async destroy(objectId) {
        const i = this.rewards.findIndex(x => x.objectId == objectId)
        const action = confirm(`¿Eliminar premio "${ this.rewards[i].name }"?`)
        if ( action ) {
          const query = this.$parse.createQuery("Award")
          const reward = await query.get(objectId)
          await reward.destroy({ useMasterKey: true })
          this.$delete(this.rewards, i)
          console.log("Eliminado con éxito.")
        }
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