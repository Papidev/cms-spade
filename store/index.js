export const state = () => ({
  language: 'en',
  selectedElement: ''
})

export const mutations = {
  setLanguage(state, language) {
    state.language = language
  },
  setSelectedElement(state, selectedElement) {
    state.selectedElement = selectedElement
  }
}

export const actions = {
  setSelectedElement(vuexContext, selectedElement) {
    vuexContext.commit('setSelectedElement', selectedElement)
  },
  setLanguage(vuexContext, language) {
    vuexContext.commit('setLanguage', language)
  }
}
