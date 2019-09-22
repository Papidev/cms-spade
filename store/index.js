import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      language: 'en'
    },
    mutations: {
      setLanguage(state, language) {
        state.language = language
      }
    },
    actions: {
      // nuxtServerInit(vuexContext, context) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       vuexContext.commit("setPosts", [
      //         {
      //           id: "1",
      //           title: "First Post",
      //           previewText: "This is our first post!",
      //           thumbnail:
      //             "https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg"
      //         },
      //         {
      //           id: "2",
      //           title: "Second Post",
      //           previewText: "This is our second post!",
      //           thumbnail:
      //             "https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg"
      //         }
      //       ]);
      //       resolve();
      //     }, 1000);
      //   });
      // },
      setLanguage(vuexContext, language) {
        vuexContext.commit('setLanguage', language)
      }
    },
    getters: {
      getLanguage(state) {
        return state.language
      }
    }
  })
}

export default createStore
