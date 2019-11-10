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

  async setWikiElementDescription(vuexContext, wikiElement, language) {
    let wikiElementDescription = await getPlaceByName(wikiElement, language)
    console.log('wikiElementDescription ' + wikiElementDescription)
    vuexContext.commit('setWikiElementDescription', wikiElementDescription)
  }
}

// const state = () => ({

// })

// const mutations = {

// }
// const actions = {

// }

// export default {
//   state,
//   mutations,
//   actions
//   // getters
// }
