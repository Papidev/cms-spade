import { CMS, WIKI } from '~/constants/'

export const state = () => ({
  sources: [
    {
      name: 'cmsContent',
      source: CMS,
      isLoading: false
    },
    {
      name: 'wikiContent',
      source: WIKI,
      isLoading: false
    }
  ]
})

export const mutations = {
  setLoading(state, payload) {
    console.log('setLoading mutation')
    let foundSource = state.sources.find((x) => x.source === payload.source)
    foundSource.isLoading = payload.loadingState
    console.log(foundSource.isLoading)
  }
}
