import helperGraphMixin from '~/mixins/helpersGraph'
import helperMixin from '~/mixins/helpersFunctions'

export const state = () => ({
  // cmsElement: '',
  cmsElementDescription: ''
})

export const mutations = {
  // setCmsElement(state, cmsElement) {
  //   state.cmsElement = cmsElement
  // },

  setCmsElementDescription(state, cmsElementDescription) {
    state.cmsElementDescription = cmsElementDescription
  }
}

export const actions = {
  // setCmsElement(vuexContext, cmsElement) {
  //   vuexContext.commit('setCmsElement', cmsElement)
  // },

  async setCmsElementDescription(vuexContext, nameToSearch) {
    console.group('setCmsElementDescription')
    //console.log(vuexContext.rootState)
    console.log(nameToSearch)

    let { methods: helpers } = helperMixin
    let { methods: helpersGraph } = helperGraphMixin

    const query = helpersGraph.queryPlacesByName(nameToSearch)

    const url =
      helpers.getDataEndpoint(vuexContext.rootState.language, 'cms', 'query') +
      '/graphql'
    console.log(query)
    console.log(url)

    try {
      const response = await helpers.axiosGet(url, 'post', { query })
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
