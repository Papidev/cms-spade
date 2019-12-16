export const state = () => ({
  language: 'en',
  selectedElement: '',
  currentCategory: ''
})

export const mutations = {
  setLanguage(state, language) {
    state.language = language
  },
  setSelectedElement(state, selectedElement) {
    state.selectedElement = selectedElement
  },
  setCurrentCategory(state, currentCategory) {
    state.currentCategory = currentCategory
  }
}

export const actions = {
  setSelectedElement(vuexContext, selectedElement) {
    vuexContext.commit('setSelectedElement', selectedElement)
  },
  setLanguage(vuexContext, language) {
    vuexContext.commit('setLanguage', language)
  },
  setCurrentCategory(vuexContext, currentCategory) {
    vuexContext.commit('setCurrentCategory', currentCategory)
  },
  nuxtServerInit({ commit }, { req }) {
    // get last id from cms for current category
    // if (req.session.user) {
    //   commit('user', req.session.user)
    // }
  }
}
