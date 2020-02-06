export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/axios'],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['nuxt-rfg-icon', '@nuxtjs/apollo', '@nuxtjs/axios', '@nuxtjs/pwa'],
  apollo: {
    tokenName: 'MyApollo',
    clientConfigs: {
      default: {
        httpEndpoint:
          process.env.CMS_GRAPHQL_URL || 'http://localhost:1337/graphql'
      }
    },
    defaultOptions: {
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network'
      }
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},

  env: {
    endpoints: {
      wikipedia: {
        en: {
          // query:
          //   'https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&explaintext&titles=',
          opensearch:
            'https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&origin=*&namespace=0&format=json&search='
        },
        it: {
          // query:
          //   'https://it.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&explaintext&titles=',
          opensearch:
            'https://it.wikipedia.org/w/api.php?action=opensearch&limit=10&origin=*&namespace=0&format=json&search='
        }
      },

      cms: {
        en: {
          graphql:
            process.env.CMS_GRAPHQL_URL || 'http://localhost:1337/graphql'
        }
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */

    extend(config, ctx) {
      config.devtool = 'source-map'
      // Run ESLint on save
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }

      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
