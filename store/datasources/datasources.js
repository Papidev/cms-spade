import { CMS, WIKI } from '~/constants/'

export const state = () => ({
  sources: [
    {
      name: getpuppy,
      source: CMS,
      isLoading: false
    },
    {
      name: gethappy,
      source: WIKI,
      isLoading: false
    }
  ]
})
