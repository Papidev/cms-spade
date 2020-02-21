import helperFunctions from '~/mixins/helpersFunctions.js'
export default {
  methods: {
    suggestionsSetup(names, descriptions) {
      const result = []
      for (let i = 0; i < names.length; i++) {
        result.push({
          id: i,
          name: names[i],
          description: descriptions[i]
        })
      }

      return [{ data: result }]
    },

    getSuggestionName(suggestion) {
      return helperFunctions.methods.getProp(suggestion, 'name')
      //suggestion.item.name
    }
  }
}
