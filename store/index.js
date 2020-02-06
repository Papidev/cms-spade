export const state = () => ({
  language: 'en',
  selectedItem: '',
  selectedContentType: {}
})

export const mutations = {
  setLanguage(state, language) {
    state.language = language
  },
  setSelectedElement(state, selectedItem) {
    state.selectedItem = selectedItem
  },
  setCurrentCategory(state, selectedContentType) {
    state.selectedContentType = selectedContentType
  }
}

export const actions = {
  setSelectedElement(vuexContext, selectedItem) {
    vuexContext.commit('setSelectedElement', selectedItem)
  },
  setLanguage(vuexContext, language) {
    vuexContext.commit('setLanguage', language)
  },
  setCurrentCategory(vuexContext, selectedContentType) {
    vuexContext.commit('setCurrentCategory', selectedContentType)
  }
  // nuxtServerInit({ commit }, { req }) {
  //   // get last id from cms for current category
  //   // if (req.session.user) {
  //   //   commit('user', req.session.user)
  //   // }
  // }
}
