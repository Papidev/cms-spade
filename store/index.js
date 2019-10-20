import Vuex from 'vuex'
import wiki from './modules/wiki'

const createStore = () => {
  return new Vuex.Store({
    state: {
      language: 'en',
      //wikiSelectedElement: '',
      cmsSelectedElement: ''
    },
    mutations: {
      setLanguage(state, language) {
        state.language = language
      },

      setCmsSelectedElement(state, cmsSelectedElement) {
        state.cmsSelectedElement = cmsSelectedElement
      }
    },

    getters: {
      // getLanguage(state) {
      //   return state.language
      // },
      // getWikiSelectedElement(state) {
      //   return state.wikiSelectedElement
      // },
      // getCmsSelectedElement(state) {
      //   return state.cmsSelectedElement
      // }
    },

    actions: {
      setLanguage(vuexContext, language) {
        vuexContext.commit('setLanguage', language)
      }
    },
    modules: {
      wiki
    }
  })
}

export default createStore
