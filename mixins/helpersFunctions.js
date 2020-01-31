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

    filterObject(obj, predicate) {
      return bject.fromEntries(Object.entries(obj).filter(predicate))
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
    // console.log(filtered);
  }
}
