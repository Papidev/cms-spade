import { CMS, WIKI } from '~/constants/'

export const state = () => ({
  sources: [
    {
      name: 'getpuppy',
      source: CMS,
      isLoading: false
    },
    {
      name: 'gethappy',
      source: WIKI,
      isLoading: false
    }
  ]
})

export const mutations = {
  setLoading(state, payload) {
    console.log('setLoading mutation')
    state.sources.find((x) => x.source === payload.source).isLoading =
      payload.loadingState
    console.log(
      state.sources.find((x) => x.source === payload.source).isLoading
    )
  }
}
