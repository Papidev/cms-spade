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
    // console.group('wikiElementDescription')
    // console.log('wikiElement ', wikiElement)
    // console.log('language ', vuexContext.rootState.language)

    let { methods: helpers } = helperMixin
    try {
      console.log(helpers)
      const url =
        helpers.getDataEndpoint(
          vuexContext.rootState.language,
          'wikipedia',
          'query'
        ) + wikiElement
      console.log('url  ', url)
      const response = await helpers.axiosGet(url)
      console.log('response  ', response)
      if (typeof response !== 'undefined') {
        const page = Object.keys(response.data.query.pages)[0]
        console.log('page  ', page)
        wikiContent = response.data.query.pages[page].extract
        console.log('wikiContent  ', wikiContent)
      } else {
      }
    } catch (err) {
      console.log('getPlaceByNameWiki ', err)
    }
    console.log('wikiElementDescription ', wikiContent)
    vuexContext.commit('setWikiElementDescription', wikiContent)
  }

  // async getPlaceByNameWiki(vuexContext, name) {

  //   }
}
