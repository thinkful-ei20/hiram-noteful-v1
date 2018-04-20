/* global $ noteful api store */
$(document).ready(function() {
  noteful.bindEventListeners()

  api.search({}).then(response => {
    store.notes = response
    noteful.render()
  })
})
