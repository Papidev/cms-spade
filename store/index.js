export const state = () => ({
      language: 'en',
      //wikiSelectedElement: '',
      cmsSelectedElement: ''
})

export const mutations = {
  setLanguage(state, language) {
    state.language = language
  },

  setCmsSelectedElement(state, cmsSelectedElement) {
    state.cmsSelectedElement = cmsSelectedElement
  }
}


export const actions = {
  setLanguage(vuexContext, language) {
    vuexContext.commit('setLanguage', language)
  }
}


