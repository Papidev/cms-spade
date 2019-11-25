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

    // funzione TROPPO accoppiata con output opensearch di wikipedia
    async searchWiki(elementToSearch) {
      console.log('start searchWiki')
      if (!elementToSearch.length) {
        return
      }

      let resource
      let url =
        this.getDataEndpoint(this.language, 'wikipedia', 'opensearch') +
        elementToSearch
       
      try {
        resource = await this.axiosGet(url, 'get')
        console.dir(resource)
    
        if (Array.isArray(resource) && resource.length) {
           console.log('TROVATO QUALCOSA')
          this.shownSuggestions = this.suggestionsSetup(
            resource[1],
            resource[2]
          )
          console.log(
            `shownSuggestions riempita con searchWiki (${elementToSearch}, ${this.language})`
          )
          return
        }
      } catch (error) {
        console.log(`Error searchWiki (${elementToSearch}, ${this.language})`)
      }

      if ((!Array.isArray(resource.data) || !resource.data.length) && this.language !== 'it') {
        this.setLanguage('it')
        this.searchWiki(elementToSearch)
      }else{
        console.log('Trovato nulla neanche in it')
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
