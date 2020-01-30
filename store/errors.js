export const state = () => ({
  errors: []
})

export const mutations = {
  addError(state, error) {
    pushError(state.errors, error.description, error.step)
  }
}

function getCurrentDateTime() {
  var today = new Date()
  var date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  var time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  return date + ' ' + time
}

function pushError(errorStore, errorMessage, errorStep) {
  let newError = {}
  newError.description = errorMessage
  newError.step = errorStep
  newError.dateTime = getCurrentDateTime()
  errorStore.push(newError)
}
