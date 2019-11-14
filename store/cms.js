import { queryPlacesByName } from '~/components/helpersGraph'
import { getDataEndpoint, axiosGet } from '~/components/helpersFunctions'

export const state = () => ({
  cmsElement: '',
  cmsElementDescription: ''
})

export const mutations = {
  setCmsElement(state, cmsElement) {
    state.cmsElement = cmsElement
  },

  setCmsElementDescription(state, cmsElementDescription) {
    state.cmsElementDescription = cmsElementDescription
  }
}

export const actions = {
  setCmsElement(vuexContext, cmsElement) {
    vuexContext.commit('setCmsElement', cmsElement)
  },

  async setCmsElementDescription(vuexContext, nameToSearch) {
    console.group('setCmsElementDescription')
    console.log(vuexContext.rootState)
    console.log(vuexContext.state)
    const query = queryPlacesByName(nameToSearch)
    console.log(query)
    const url =
      getDataEndpoint(vuexContext.rootState.language, 'cms', 'query') +
      '/graphql'
    console.log(url)
    // const response = await axios({
    //   url,
    //   method: 'post',
    //   data: {
    //     query
    //   }
    // })
    try {
      const response = await axiosGet(url, 'post', { query })
      console.log(`ECCA A' risposta :  ${response}`)
      console.log(response)
      const content = response.data.places[0].Description
      vuexContext.commit('setCmsElementDescription', content)
    } catch (error) {
      console.log('Fallita action setCmsElementDescription')
      throw error
    }
  }
}
