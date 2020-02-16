export const state = () => ({
  errors: []
})

export const mutations = {
  pushError(state, error) {
    let newError = {
      description: error.description,
      step: error.step,
      dateTime: getCurrentDateTime()
    }

    state.errors.push(newError)
  }
}

export const actions = {
  addError({ commit }, error) {
    commit('pushError', error)
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

// function pushError(errorStore, errorMessage, errorStep) {

// }
