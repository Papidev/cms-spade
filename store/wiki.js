import helperMixin from '~/mixins/helpersFunctions.js'

export const state = () => ({
  wikiElementDescription: ''
})

export const mutations = {
  setWikiElementDescription(state, wikiElementDescription) {
    state.wikiElementDescription = wikiElementDescription
  }
}

export const actions = {
  async setWikiElementDescription(vuexContext, wikiElement) {
    let wikiContent
    //
    //
    //

    let { methods: helpers } = helperMixin
    try {
      const url =
        helpers.getDataEndpoint(
          vuexContext.rootState.language,
          'wikipedia',
          'query'
        ) + wikiElement

      const response = await helpers.axiosGet(url)

      if (typeof response !== 'undefined') {
        const page = Object.keys(response.data.query.pages)[0]

        wikiContent = response.data.query.pages[page].extract
      } else {
      }
    } catch (err) {}

    vuexContext.commit('setWikiElementDescription', wikiContent)
  }

  // async getPlaceByNameWiki(vuexContext, name) {

  //   }
}
