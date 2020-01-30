export const state = () => ({
  language: 'en',
  selectedElement: '',
  currentContentType: {}
})

export const mutations = {
  setLanguage(state, language) {
    state.language = language
  },
  setSelectedElement(state, selectedElement) {
    state.selectedElement = selectedElement
  },
  setCurrentCategory(state, currentContentType) {
    state.currentContentType = currentContentType
  }
}

export const actions = {
  setSelectedElement(vuexContext, selectedElement) {
    vuexContext.commit('setSelectedElement', selectedElement)
  },
  setLanguage(vuexContext, language) {
    vuexContext.commit('setLanguage', language)
  },
  setCurrentCategory(vuexContext, currentContentType) {
    vuexContext.commit('setCurrentCategory', currentContentType)
  }
  // nuxtServerInit({ commit }, { req }) {
  //   // get last id from cms for current category
  //   // if (req.session.user) {
  //   //   commit('user', req.session.user)
  //   // }
  // }
}
