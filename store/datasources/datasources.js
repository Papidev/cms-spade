import { CMS, WIKI } from '~/constants/'

import ErrorPanel from '~/components/ErrorPanel'
export const state = () => ({
  sources: [
    {
      header: true,
      title: 'Main Navigation',
      hiddenOnCollapse: true
    },
    {
      title: CMS,
      icon: 'fa fa-user',
      hiddenOnCollapse: false
    },
    {
      component: ErrorPanel,
      props: { errors: [{ errorStep: 'pipperostep' }] },
      // hidden: false
      hiddenOnCollapse: true
    },
    {
      title: WIKI,
      icon: 'fa fa-user',
      hiddenOnCollapse: false
    },

    {
      component: ErrorPanel,
      props: { errors: [{ errorStep: 'pipperostep' }] },
      // hidden: false
      hiddenOnCollapse: true
    }
  ]
})
