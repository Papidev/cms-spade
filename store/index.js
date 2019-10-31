export const state = () => ({
  language: 'en'
})

//  TODO implement changing language feature
export const mutations = {
  setLanguage(state, language) {
    state.language = language
  }
}

export const actions = {
  setLanguage(vuexContext, language) {
    vuexContext.commit('setLanguage', language)
  }
}
