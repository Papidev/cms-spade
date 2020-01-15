export default {
  methods: {
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
      let merged = {}
      for (const prop of schemaObject) {
        if (primaryObj && primaryObj[prop])
          merged[prop] = { value: primaryObj[prop], source: primaryLabel }
        else {
          console.log('Ramo else')
          console.log('schemaObject')
          console.dir(schemaObject)
          console.log('primaryObj')
          console.dir(primaryObj)
          console.log('secondaryObj')
          console.dir(secondaryObj)
          console.log('PROP')
          console.dir(prop)
          console.log('secondaryObj[prop]')
          console.log(secondaryObj[prop])

          merged[prop] = { value: secondaryObj[prop], source: secondaryLabel }
        }
      }

      return merged
    },

    getCurrentDateTime() {
      var today = new Date()
      var date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate()
      var time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      return date + ' ' + time
    }
  }
}
