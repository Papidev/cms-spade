export default {
  methods: {

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
    },

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

    mergeResultsProperties(
      primaryObj,
      secondaryObj,
      primaryLabel,
      secondaryLabel
    ) {
      let merged = {}
      for (const prop in primaryObj) {
        if (primaryObj[prop])
          merged[prop] = { value: primaryObj[prop], source: primaryLabel }
        else
          merged[prop] = { value: secondaryObj[prop], source: secondaryLabel }
      }

      return merged
    }
  }
}
