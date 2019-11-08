export const state = () => ({
  cmsElement: '',
  cmsElementDescription: ''
})

export const mutations = {
  setCmsElement(state, cmsElement) {
    state.cmsElement = cmsElement
  },

  setCmsElementDescription(state, cmsElementDescription) {
    state.cmsElementDescription = cmsElementDescription
  }
}

export const actions = {
  setCmsElement(vuexContext, cmsElement) {
    vuexContext.commit('setCmsElement', cmsElement)
  },
  setCmsElementDescription(vuexContext, cmsElementDescription) {
    vuexContext.commit('setCmsElementDescription', cmsElementDescription)
  }
}
