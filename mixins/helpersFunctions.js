export default {
  methods: {
    async axiosCall(url, method, data) {
      //
      let response
      try {
        if (method === 'get') {
          response = await this.$axios.$get(url)
        } else {
          response = await this.$axios.$post(url, data)
        }
      } catch (error) {
        console.log(error)
        throw error
      }

      return response
    },

    getDataEndpoint(lang, source, operation) {
      //
      return process.env.endpoints[source][lang][operation]
    },

    getProp(obj, prop) {
      if (typeof obj !== 'object') throw 'getProp: obj is not an object'
      if (typeof prop !== 'string') throw 'getProp: prop is not a string'

      // Replace [] notation with dot notation
      //prop = prop.replace(/\[["'`](.*)["'`]\]/g,".$1")

      return prop.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined
      }, obj || self)
    }
  }
}
