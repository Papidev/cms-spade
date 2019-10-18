import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      language: 'en',
      wikiSelectedElement: '',
      cmsSelectedElement: ''
    },
    mutations: {
      setLanguage(state, language) {
        state.language = language
      },
      setWikiSelectedElement(state, wikiSelectedElement) {
        state.wikiSelectedElement = wikiSelectedElement
      },
      setCmsSelectedElement(state, cmsSelectedElement) {
        state.cmsSelectedElement = cmsSelectedElement
      }
    },

    getters: {
      getLanguage(state) {
        return state.language
      }
    },

    actions: {
      setLanguage(vuexContext, language) {
        vuexContext.commit('setLanguage', language)
      }
    }
  })
}

export default createStore
