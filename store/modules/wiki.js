const state = {
  wikiSelectedElement: '',
  wikiSelectedElementDescription: ''
}
const getters = {}
const mutations = {
  setWikiSelectedElement(state, wikiSelectedElement) {
    state.wikiSelectedElement = wikiSelectedElement
  },
  setWikiSelectedElementDescription(state, wikiSelectedElementDescription) {
    state.wikiSelectedElementDescription = wikiSelectedElementDescription
  }
}
const actions = {
  setWikiSelectedElement(vuexContext, wikiSelectedElement) {
    vuexContext.commit('setWikiSelectedElement', wikiSelectedElement)
  },
  setWikiSelectedElementDescription(
    vuexContext,
    wikiSelectedElementDescription
  ) {
    vuexContext.commit(
      'setWikiSelectedElementDescription',
      wikiSelectedElementDescription
    )
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
