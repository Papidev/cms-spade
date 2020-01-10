import { CMS, WIKI } from '~/constants/'
export const state = () => ({
  datasources: [
    {
      name: 'contentSchema',
      retrievedItem: {},
      isloading: false
    },
    {
      name: CMS,
      retrievedItem: {},
      isloading: false
    },
    {
      name: WIKI,
      retrievedItem: {},
      isloading: false
    }
  ]
})
