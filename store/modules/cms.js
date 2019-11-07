const state = () => ({
  cmsElement: '',
  cmsElementDescription: ''
})

const mutations = {
  setCmsElement(state, cmsElement) {
    state.cmsElement = cmsElement
  },

  setCmsElementDescription(state, cmsElementDescription) {
    state.cmsElementDescription = cmsElementDescription
  }
}
const actions = {
  setCmsElement(vuexContext, cmsElement) {
    vuexContext.commit('setCmsElement', cmsElement)
  },
  setCmsElementDescription(vuexContext, cmsElementDescription) {
    vuexContext.commit('setCmsElementDescription', cmsElementDescription)
  }
}

export default {
  state,
  mutations,
  actions
  // getters
}
