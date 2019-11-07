const state = () => ({
  wikiElement: '',
  wikiElementDescription: ''
})

const mutations = {
  setWikiElement(state, wikiElement) {
    state.wikiElement = wikiElement
  },
  setWikiElementDescription(state, wikiElementDescription) {
    state.wikiElementDescription = wikiElementDescription
  }
}
const actions = {
  setWikiElement(vuexContext, wikiElement) {
    vuexContext.commit('setWikiElement', wikiElement)
  },
  setWikiElementDescription(vuexContext, wikiElementDescription) {
    vuexContext.commit('setWikiElementDescription', wikiElementDescription)
  }
}

export default {
  state,
  mutations,
  actions
  // getters
}
