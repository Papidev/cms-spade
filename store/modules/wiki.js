
export const state = () => ({
  wikiSelectedElement: '',
  wikiSelectedElementDescription: ''
})




export const mutations = {
  setWikiSelectedElement(state, wikiSelectedElement) {
    state.wikiSelectedElement = wikiSelectedElement
  },
  setWikiSelectedElementDescription(state, wikiSelectedElementDescription) {
    state.wikiSelectedElementDescription = wikiSelectedElementDescription
  }
}
export const actions = {
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
