<template>
  <div>
    <search-suggest
      ref="autosuggest"
      v-model="elementToSearch"
      class="bg-green-400 w-full"
      :suggestions="shownSuggestions"
      :get-suggestion-value="getSuggestionItemName"
      :input-props="{
        id: 'autosuggest_input',
        placeholder: 'Type here for Search'
      }"
      @input="searchWiki"
      @selected="handleSelectedSuggestion"
    >
      <template v-slot:default="{ suggestion }">
        <div>
          <strong>{{ suggestion.item.name }} </strong> ----
          {{ suggestion.item.description.substring(0, 75) }}
        </div>
      </template>
    </search-suggest>
  </div>
</template>


<script>
import { VueAutosuggest } from 'vue-autosuggest'
import { mapState, mapActions } from 'vuex'
import helpersGraph from '~/mixins/helpersGraph'
import helpersFunctions from '~/mixins/helpersFunctions.js'
import { WIKIPEDIA, SUGGEST_SEARCH, SUGGEST_SEARCH_CHARS } from '~/constants/'

export default {
  components: {
    'search-suggest': VueAutosuggest
  },
  mixins: [helpersFunctions, helpersGraph],

  props: {
    searchString: {
      required: false,
      default: '',
      type: String
    },
    suggestions: {
      required: false,
      default() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      elementToSearch: this.searchString,
      shownSuggestions: this.suggestions
    }
  },
  computed: {
    ...mapState(['language'])
  },

  methods: {
    ...mapActions({
      setSelectedElement: 'setSelectedElement',
      setWikiElementDescription: 'wiki/setWikiElementDescription',
      setLanguage: 'setLanguage'
    }),

    // This is what the <input/> value is set to when you are selecting a suggestion.
    getSuggestionItemName(suggestion) {
      return suggestion.item.name
    },

    // funzione TROPPO accoppiata con output SUGGEST_SEARCH di wikipedia
    async searchWiki(elementToSearch) {
      if (
        !elementToSearch.length ||
        elementToSearch.length < SUGGEST_SEARCH_CHARS
      ) {
        return
      }

      let url =
        this.getDataEndpoint(this.language, WIKIPEDIA, SUGGEST_SEARCH) +
        elementToSearch

      try {
        let resource = await this.axiosCall(url, 'get')

        if (Array.isArray(resource) && resource.length) {
          this.shownSuggestions = this.suggestionsSetup(
            resource[1],
            resource[2]
          )

          return
        }
      } catch (error) {}

      if (
        (!Array.isArray(resource.data) || !resource.data.length) &&
        this.language !== 'it'
      ) {
        this.setLanguage('it')
        this.searchWiki(elementToSearch)
      } else {
        return
      }
    },

    handleSelectedSuggestion(item) {
      if (typeof item === 'undefined') {
        return
      }
      const itemName = item.item.name

      if (itemName.length) {
        this.setSelectedElement(itemName)
        this.setWikiElementDescription(itemName)
      }

      this.$refs.autosuggest.$el.children.autosuggest_input.focus()
    },

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
    }
  }
}
</script>
