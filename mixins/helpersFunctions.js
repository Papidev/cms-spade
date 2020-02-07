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
        // eslint-disable-next-line no-empty
      } finally {
      }

      return response
    },
    getVarName(variable) {
      return Object.keys(variable)[0]
    },

    getDataEndpoint(lang, source, operation) {
      return process.env.endpoints[source][lang][operation]
    },

    getProp(obj, prop) {
      if (typeof obj !== 'object') {
        return undefined
      }
      if (typeof prop !== 'string') {
        throw 'getProp: prop is not a string'
      }
      // Replace [] notation with dot notation
      prop = prop.replace(/\[["'`](.*)["'`]\]/g, '.$1')

      const returnValue = prop.split('.').reduce(function(acc, curr) {
        return acc ? acc[curr] : undefined
      }, obj)
      console.log('returnValue', returnValue)
      return returnValue
    },

    removeProps(obj, properties) {
      //if (obj && Object.entries(obj).length > 0) {
      if (obj) {
        let keys = Object.keys(obj)

        //remove provided properties from object keys array
        let intermediate = keys.filter((key) => !properties.includes(key))

        // map to each remaining key the value contained by "obj" for that key
        let intermediate2 = intermediate.map((key) => ({ [key]: obj[key] }))

        //reduce the array of objects in one single object
        let newObj = intermediate2.reduce(
          (result, current) => Object.assign(result, current),
          {}
        )
        return newObj
      } else {
        return {}
      }
    }

    // removeVoidProps(obj) {
    //   const keys = Object.keys(obj)

    //   const newObj = keys.reduce((accum, prop) => {
    //     if (obj[prop] != null) {
    //       accum[prop] = obj[prop]
    //     }
    //     return accum
    //   }, {})
    //
    //
    //   return newObj
    // }

    //       removeProps(obj,props) {
    // for (let currentProp of obj){

    // }
    //   const keys = Object.keys(obj)

    //   const newObj = keys.reduce((accum, prop) => {
    //     if (obj[prop] != null) {
    //       accum[prop] = obj[prop]
    //     }
    //     return accum
    //   }, {})
    //
    //
    //   return newObj

    // var scores = {
    // John: 2, Sarah: 3, Janet: 1
    // };

    // var filtered = Object.filter(scores, ([name, score]) => score > 1);
    //
  }
}
