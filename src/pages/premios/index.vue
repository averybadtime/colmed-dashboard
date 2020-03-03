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
            <table class="table table-bordered">
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
              <tbody>
                <transition-group name="fade" mode="out-in">
                  <tr v-for="reward in rewards"
                    :key="reward.objectId">
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
                          <button type="button" class="btn">
                            <feather type="eye"/>
                          </button>
                          <button type="button" class="btn">
                            <feather type="edit-3"/>
                          </button>
                          <button type="button" class="btn btn-danger"
                            v-on:click="destroy(reward.objectId)">
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
  import CreateRewardForm from "@/components/forms/create-reward-form"
  export default {
    components: {
      CreateRewardForm
    },
    data() {
      return {
        rewards: [],
        showCreateRewardForm: false
      }
    },
    methods: {
      async getRewards() {
        let rewards
        try {
          const query = this.$parse.createQuery( "Award" )
          query.descending( "createdAt" )
          query.limit( this.defaultTableRows || 50)
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
      }
    },
    created() {
      this.getRewards()
    }
  }
</script>