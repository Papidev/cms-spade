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
        throw error
      }

      return response
    }
  }
}
