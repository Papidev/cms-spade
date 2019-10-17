import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      language: 'en',
      wikiResult:'',
      cmsResult:''
    },
    mutations: {
      setLanguage(state, language) {
        state.language = language
      },
      setWikiResult(state, wikiResult) {
        state.wikiResult = wikiResult
      },
      setCmsResult(state, cmsResult) {
        state.cmsResult = cmsResult
      }
    },
    actions: {
      async  axiosGet(url) {
  
        const response = await $axios.$get(url)
        return response
      
    }
,    
async  getPlaceByNameWiki(name, lang) {
  try {
    const url =
      getDataEndpoint(createStore().getters.getLanguage, 'wikipedia', 'query') +
      name

    console.log('url ' + url)
    const response = await axiosGet(url)

    if (typeof response !== 'undefined') {
      console.log('getPlaceByNameWiki : response trovata su wikipedia')

      const page = Object.keys(response.data.query.pages)[0]
      const wikiContent = response.data.query.pages[page].extract
      return wikiContent
    } else {
      console.log('getPlaceByNameWiki : response vuota')
      return null
    }
  } catch (err) {
    console.log('fetch failed', err)
    return null
  }
},


      async  getPlaceByNameCms(name, lang) {
        const query = queryPlacesByName(name)
        console.log(query)
        try {
          const url = getDataEndpoint(lang, 'cms', 'query') + '/graphql'
      
          const response = await axios({
            url,
            method: 'post',
            data: {
              query
            }
          })
      
      
      
      
      
          //const strapi = new Strapi(url)
          // const response = await strapi.request('post', '/graphql', {
          //   data: {
          //     query
          //   }
          // })
          const content = response.data.places[0]
          if (typeof content !== 'undefined') {
            console.log(
              'getPlaceByNameCms : content.Description ' + content.Description
            )
            return content.Description
          } else {
            console.log('getPlaceByNameCms : response vuota')
            return null
          }
        } catch (err) {
          console.log('fetch failed', err)
          return null
        }
      },

      async  getPlaceByName(vuexContext,name, lang) {
        let wikiResult
        let cmsResult = ''
        cmsResult = await dispatch('getPlaceByNameCms', {
          name: name,
          lang: lang
        })

        if (cmsResult !== null && cmsResult !== undefined) {
          console.log('Trovato record su CMS')
          vuexContext.commit('setCmsResult', cmsResult)
          //return cmsResult
        } else {
          console.log('Non ho trovato niente su CMS')
          wikiResult = await getPlaceByNameWiki(name, lang)
          vuexContext.commit('setWikiResult', wikiResult)
          //return wikiResult
        }
      },
     
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
