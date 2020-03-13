export default {
  data() {
    return {
      paginationOptions: {
        enabled         : true,
        mode            : "records",
        perPage         : 25,
        position        : "bottom",
        perPageDropdown : [25, 50, 100],
        dropdownAllowAll: false,
        setCurrentPage  : 1,
        nextLabel       : "siguiente",
        prevLabel       : "anterior",
        rowsPerPageLabel: "Filas por página",
        ofLabel         : "de",
        pageLabel       : "página",
        allLabel        : "Todos"
      },
      searchOptions: {
        enabled       : true,
        trigger       : "enter",
        skipDiacritics: true,
        placeholder   : "Buscar en esta tabla"
      },
      selectOptions: {
        enabled             : true,
        selectOnCheckboxOnly: true,
        selectionText       : "filas seleccionadas",
        clearSelectionText  : "Borrar selección"
      }
    }
  },
  methods: {
    formatCurrency: value => {
      const currencyFormatter = new Intl.NumberFormat( "es-CO", {
        style: "currency",
        currency: "COP"
      } )
      return currencyFormatter.format( value )
    },
    formatDate    : value => {
      const options = {
        year   : "numeric",
        month  : "short",
        day    : "numeric"
      }
      return new Date(value).toLocaleString("es-ES", options)
    },
    formatFile    : value => `<a href="${value}" target="_blank">Enlace</a>`,
    formatQuantity: value =>  value > 0 ? value                             : null,
    formatStatus  : value => value ? "Activo"                               : "Inactivo",
  }
}