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

      return returnValue
    },

    filterProperties(obj) {
      let array = ['Description']

      // let predicate = function(key) {
      //  array.includes(key)
      // }

      if (obj && Object.entries(obj).length > 0) {
        let keys = Object.keys(obj)
        console.log('keys')
        console.log(keys)
        let intermediate = keys.filter((key) => !array.includes(key))
        console.log('intermediate')
        console.log(intermediate)

        let intermediate2 = intermediate.map((key) => ({ [key]: obj[key] }))
        console.log('intermediate2')
        console.log(intermediate2)

        let newObj = intermediate2.reduce(function(result, current) {
          return Object.assign(result, current)
        }, {})

        console.log('newObj')
        console.log(newObj)
        return newObj
      } else return {}
      //return Object.fromEntries(Object.entries(obj).filter(predicate))
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
