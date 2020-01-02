export default {
  methods: {
    getDataEndpoint(lang, source, operation) {
      //
      return process.env.endpoints[source][lang][operation]
    },

    getProp(obj, prop) {
      console.log(obj)
      console.log(prop)
      if (typeof obj !== 'object') {
        return undefined
      }
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
      schemaObject,
      primaryObj,
      secondaryObj,
      primaryLabel,
      secondaryLabel
    ) {
      console.group('mergeResultsProperties')
      console.log('secondaryObj')
      console.dir(secondaryObj)
      let merged = {}
      for (const prop of schemaObject) {
        if (primaryObj && primaryObj[prop])
          merged[prop] = { value: primaryObj[prop], source: primaryLabel }
        else {
          console.log('prop')
          console.log(prop)

          console.log('secondaryObject[prop]')
          console.log(secondaryObj[prop])
          merged[prop] = { value: secondaryObj[prop], source: secondaryLabel }
        }
      }
      console.log('merged')
      console.dir(merged)
      return merged
    }
  }
}
