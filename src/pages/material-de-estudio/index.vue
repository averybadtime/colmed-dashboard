<template>
  <div class="page">
    <div class="jumbotron jumbotron-fluid bg-info">
      <div class="container text-white">
        <h1 class="display-4 font-weight-bolder">Material de Estudio</h1>
        <p class="lead">Listado general de materiales de estudio</p>
      </div>
    </div>
    <div class="container">
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-info float-right"
            v-on:click="showCreateMaterialForm = true">Nuevo material de estudio</button>
        </div>
      </div>
      <div class="row">
        <create-material-form v-show="showCreateMaterialForm"
          v-model="showCreateMaterialForm"
          v-on:new-material-saved="handleNewMaterialSaved"/>
        <edit-material-form :material-to-edit="materialToEdit"
          v-if="showEditMaterialForm"
          v-on:material-updated="handleMaterialUpdated"
          v-model="showEditMaterialForm"/>
        <div class="col-12">
          <vue-good-table :rows="materials"
            ref="Materials"
            styleClass="vgt-table striped condensed"
            v-on:on-cell-click="handleRowClick"
            :columns="columns"
            :pagination-options="paginationOptions"
            :search-options="searchOptions"
            :select-options="selectOptions">
            <template slot="table-row" slot-scope="props">
              <span v-if="props.column.field == 'imageURL'">
                <a :href="props.row.imageURL"
                  target="_blank"
                  v-if="props.row.imageURL">
                  <img :src="props.row.imageURL"
                    alt="Imagen de referencia"
                    class="avatar avatar-48">
                </a>
                <span v-else>--</span>
              </span>
              <span v-else-if="props.column.field == 'fileURL'">
                <a :href="props.row.fileURL" target="_blank">Enlace</a>
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
  import CreateMaterialForm from "@/components/forms/create-material-form"
  import EditMaterialForm from "@/components/forms/edit-material-form"
  import VueGoodTableProps from "@/mixins/vue-good-table-props"
  export default {
    components: {
      CreateMaterialForm,
      EditMaterialForm
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
          label   : "Preview",
          field   : "imageURL",
          sortable: false
        }, {
          label: "Título",
          field: "name"
        }, {
          label   : "Descripción",
          field   : "description",
          sortable: false
        }, {
          label   : "Archivo",
          field   : "fileURL",
          formatFn: this.formatFile,
          sortable: false
        }, {
          label   : "Estado",
          field   : "active",
          formatFn: this.formatStatus,
          sortable: false
        }],
        materials: [],
        selectedRow: null,
        showCreateMaterialForm: false,
        showEditMaterialForm: false
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
          return this.$message({
            duration: 4000,
            message : "Ocurrió un error al descargar los materiales.",
            type    : "error"
          })
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
      async destroy( objectId, batch = false ) {
        const i = this.materials.findIndex(x => x.objectId == objectId)
        let action
        if ( !batch ) {
          action = await this.$confirm( `¿Eliminar material "${ this.materials[i].name }"?`, "Advertencia", { type: "warning" } )
        }
        if ( !action && batch || action ) {
          const query = this.$parse.createQuery( "StudyMaterial" )
          const material = await query.get( objectId )
          try {
            await material.destroy({ useMasterKey: true })
          } catch ( ex ) {
            if ( batch ) throw "batch"
            return this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar el material.",
              type    : "error"
            })
          }
          if ( !batch ) {
            this.$message({
              duration: 4000,
              message : "Material eliminado con éxito.",
              type    : "success"
            })
          }
          this.$delete( this.materials, i )
        }
      },
      async destroyBatch() {
        const { selectedRows } = this.$refs.Materials
        try {
          const action           = await this.$confirm(`¿Eliminar ${selectedRows.length} materiales?`, "Advertencia", { type: "warning" })
          if ( action ) {
            selectedRows.forEach( async row => {
              await this.destroy( row.objectId, "batch" )
            } )
          }
        } catch ( ex ) {
          if ( ex == "batch" ) {
            this.$message({
              duration: 4000,
              message : "Ocurrió un error al eliminar los materiales.",
              type    : "error"
            })
          }
          return
        }
        this.$message({
          duration: 4000,
          message : "Materiales eliminados con éxito.",
          type    : "success"
        })
      },
      handleRowClick( params ) {
        this.selectedRow = params.row.objectId
        this.showEditMaterialForm = true
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