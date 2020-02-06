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
      console.log('result', result)
      return [{ data: result }]
    },

    getSuggestionName(suggestion) {
      return suggestion.item.name
    }
  }
}
