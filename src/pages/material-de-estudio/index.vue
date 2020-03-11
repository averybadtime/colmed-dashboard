<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4 font-weight-bolder">Material de Estudio</h1>
        <p class="lead">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium rem est cupiditate in qui exercitationem. Consequuntur eum aut corporis sint eius mollitia voluptate repellendus, ex dolor veritatis id. Voluptates, ipsa.</p>
      </div>
    </div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-info float-right"
            v-on:click="showCreateMaterialForm = !showCreateMaterialForm">Nuevo material de estudio</button>
        </div>
        <div class="col-12">
          <create-material-form v-if="showCreateMaterialForm"
            v-on:new-material-saved="handleNewMaterialSaved"/>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Preview</th>
                  <th scope="col">Título</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Archivo</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <transition-group name="fade" mode="out-in">
                <tbody v-for="material in materials"
                  :key="material.objectId">
                  <tr>
                    <td>
                      <small>{{ material.createdAt | date }}</small>
                    </td>
                    <td>
                      <img :src="material.imageURL"
                        class="avatar avatar-48"
                        alt="Preview"
                        v-if="material.imageURL">
                    </td>
                    <td>{{ material.name }}</td>
                    <td>{{ material.description }}</td>
                    <td>
                      <a :href="material.fileURL"
                        target="_blank">
                        Ver material
                      </a>
                    </td>
                    <td>{{ material.active | status }}</td>
                    <td>
                      <div class="btn-toolbar" role="toolbar">
                        <div class="btn-group" role="group">
                          <button type="button" class="btn"
                            v-on:click="edit(material.objectId)">
                            <feather type="edit-3"/>
                          </button>
                          <button type="button" class="btn btn-danger"
                            v-on:click="destroy(material.objectId)">
                            <feather type="trash-2"/>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="selectedRow == material.objectId">
                    <td colspan="8">
                      <edit-material-form :material-to-edit="materialToEdit"
                        v-on:material-updated="handleMaterialUpdated"/>
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
  import CreateMaterialForm from "@/components/forms/create-material-form"
  import EditMaterialForm from "@/components/forms/edit-material-form"
  export default {
    components: {
      CreateMaterialForm,
      EditMaterialForm
    },
    data() {
      return {
        materials: [],
        selectedRow: null,
        showCreateMaterialForm: false
      }
    },
    computed: {
      materialToEdit() {
        if ( this.selectedRow ) {
          const material = this.materials.find(x => x.objectId == this.selectedRow)
          return Object.assign({}, material)
        }
        return {}
      }
    },
    methods: {
      async getStudyMaterials() {
        let materials
        try {
          const query = this.$parse.createQuery( "StudyMaterial" )
          query.descending( "createdAt" )
          materials = await query.find()
        } catch ( ex ) {
          return console.error(ex)
        }
        materials.forEach(material => {
          const _material = material.toJSON()
          const { objectId, createdAt, name, description, active, image, file } = _material
          this.materials.push({
            createdAt,
            name,
            objectId,
            description,
            active,
            imageURL: image ? image.url : null,
            fileURL: file ? file.url : null
          })
        })
      },
      async edit( objectId ) {
        if ( this.selectedRow == objectId ) return this.selectedRow = null
        this.selectedRow = objectId
      },
      async destroy(objectId) {
        const i = this.materials.findIndex(x => x.objectId == objectId)
        const action = confirm(`¿Eliminar material "${ this.materials[i].name }"?`)
        if ( action ) {
          const query = this.$parse.createQuery( "StudyMaterial" )
          const material = await query.get( objectId )
          await material.destroy({ useMasterKey: true })
          this.$delete( this.materials, i )
        }
      },
      handleNewMaterialSaved( savedMaterial ) {
        const _savedMaterial = savedMaterial.toJSON()
        const { objectId, createdAt, name, description, active, image, file } = _savedMaterial
        this.materials.push({
          createdAt,
          name,
          objectId,
          description,
          active,
          imageURL: image ? image.url : null,
          fileURL: file ? file.url : null
        })
        this.showCreateMaterialForm = false
      },
      handleMaterialUpdated( updatedMaterial ) {
        const _updatedMaterial = updatedMaterial.toJSON()
        const { objectId, createdAt, name, description, active, image, file } = _updatedMaterial
        const index = this.materials.findIndex(x => x.objectId == _updatedMaterial.objectId)
        this.$set(this.materials, index, {
          createdAt,
          name,
          objectId,
          description,
          active,
          imageURL: image ? image.url : null,
          fileURL: file ? file.url : null
        })
        this.selectedRow = null
      }
    },
    created() {
      this.getStudyMaterials()
    }
  }
</script>