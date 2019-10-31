export const state = () => ({
  wikiElement: '',
  wikiElementDescription: ''
})

export const mutations = {
  setWikiElement(state, wikiElement) {
    state.wikiElement = wikiElement
  },
  setWikiElementDescription(state, wikiElementDescription) {
    state.wikiElementDescription = wikiElementDescription
  }
}
export const actions = {
  setWikiElement(vuexContext, wikiElement) {
    vuexContext.commit('setWikiElement', wikiElement)
  },
  setWikiElementDescription(vuexContext, wikiElementDescription) {
    vuexContext.commit('setWikiElementDescription', wikiElementDescription)
  }
}
