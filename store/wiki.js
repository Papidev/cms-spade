import { getDataEndpoint, axiosGet } from '~/components/helpersFunctions.js'

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

  async setWikiElementDescription(vuexContext, wikiElement) {
    let wikiContent
    // console.group('wikiElementDescription')
    // console.log('wikiElement ', wikiElement)
    // console.log('language ', vuexContext.rootState.language)

    try {
      const url =
        getDataEndpoint(vuexContext.rootState.language, 'wikipedia', 'query') +
        wikiElement
      console.log('url  ', url)
      const response = await axiosGet(url)
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
