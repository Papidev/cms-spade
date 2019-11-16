export const state = () => ({
  language: 'en',
  selectedElement: ''
})

export const mutations = {
  setLanguage(state, language) {
    state.language = language
  },
  setSelectedElement(state, selectedElement) {
    state.selectedElement = selectedElement
  }
}

export const actions = {
  setSelectedElement(vuexContext, selectedElement) {
    vuexContext.commit('setSelectedElement', selectedElement)
  },
  setLanguage(vuexContext, language) {
    vuexContext.commit('setLanguage', language)
  }
}

// import Vuex from 'vuex'
// import wiki from '~/store/modules/wiki'
// import cms from '~/store/modules/cms'

// const createStore = () => {
//   return new Vuex.Store({
//     namespaced: true,

//     state: () => ({
//       language: 'en'
//     }),

//     mutations: {
//       setLanguage(state, language) {
//         state.language = language
//       }
//     },
//     actions: {
//       setLanguage(vuexContext, language) {
//         vuexContext.commit('setLanguage', language)
//       }
//     },
//     modules: {
//       wiki,
//       cms
//     }
//   })
// }

// export default createStore
