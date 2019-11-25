export default {
  methods: {
    async axiosGet(url, method, data) {
      //
      let response
      try {
        if (method === 'get') {
          response = await this.$axios.$get(url)
        } else {
          response = await this.$axios.$post({
            url,
            method: 'post',
            data
          })
        }
      } catch (error) {
        throw error
      }

      return response
    },

    getDataEndpoint(lang, source, operation) {
      //
      return process.env.endpoints[source][lang][operation]
    }
  }
}

// export { axiosGet, getDataEndpoint }
