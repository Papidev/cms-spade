import { CMS } from '~/constants/'
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

    // calbback: (contentItem) => {
    //   console.log('contentItem della calback')
    //   console.log(contentItem)

    //   console.log("contentItem['Name']")
    //   console.log(contentItem['Name'])
    //   return contentItem['Name']
    // },

    mergeContentResults(schema, contents) {
      console.log('Start mergeContentResults')
      let mergedItem = {}

      //console.log(' contents : ', contents)
      for (const schemaField of schema) {
        let foundContentItem
        // console.log(' schemaField : ', schemaField)
        foundContentItem = contents.find(
          (contentItem) => contentItem[schemaField]
        )
        // console.log(' foundContentItem : ', foundContentItem)
        if (foundContentItem) {
          console.log('What about this second IF ?')
          console.log(foundContentItem[schemaField])
          mergedItem[schemaField] = {
            value: foundContentItem[schemaField],
            source: CMS
          }
        }
      }
      return mergedItem
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
