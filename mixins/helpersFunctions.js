import axios from 'axios'

export default {
  methods: {
    async axiosGet(url, method, data) {
      console.group('axiosGet')
      // console.group(this.$axios)
      let response
      try {
        if (method === 'get') {
          response = await axios.get(url)
        } else {
          response = await axios({
            url,
            method: 'post',
            data
          })
        }
      } catch (error) {
        console.log('Fallita axiosGet')
        throw error
      }

      return response
    },

    getDataEndpoint(lang, source, operation) {
      // console.log(process.env.endpoints[source][lang][operation])
      return process.env.endpoints[source][lang][operation]
    }
  }
}

// export { axiosGet, getDataEndpoint }
