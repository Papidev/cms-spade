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
//import { axiosGet, getDataEndpoint } from '~/components/helpersFunctions.js'
import { mapState, mapActions } from 'vuex'
import helpersGraph from '~/mixins/helpersGraph'
//import axios from 'axios'
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
    // ...mapState(['selectedElement']),
    ...mapState(['language'])
    // ...mapState('cms', ['cmsElementDescription'])
  },

  methods: {
    ...mapActions({
      setSelectedElement: 'setSelectedElement',
      setWikiElementDescription: 'wiki/setWikiElementDescription'
    }),

    // This is what the <input/> value is set to when you are selecting a suggestion.
    getSuggestionItemName(suggestion) {
      return suggestion.item.name
    },

    // funzione TROPPO accoppiata con output opensearch di wikipedia
    async searchWiki(elementToSearch) {
      console.group('searchWiki')
      console.log(elementToSearch)
      if (!elementToSearch.length) {
        console.log('Elemento vuoto nella form')
        return
      }

      let url =
        this.getDataEndpoint(this.language, 'wikipedia', 'opensearch') +
        elementToSearch

      let resource = await this.axiosGet(url, 'get')

      if (!Array.isArray(resource.data) || !resource.data.length) {
        console.log('Cerco su Wikipedia ITA')
        url =
          this.getDataEndpoint('it', 'wikipedia', 'opensearch') +
          elementToSearch
        resource = await this.axiosGet(url, 'get')
      }
      if (Array.isArray(resource.data) && resource.data.length) {
        this.shownSuggestions = this.mergeNamesDescriptions(
          resource.data[1],
          resource.data[2]
        )
      }
    },

    // async getPlaceByNameCms(name, lang) {
    //   const query = this.queryPlacesByName(name)

    //   try {
    //     const url = this.getDataEndpoint(lang, 'cms', 'query') + '/graphql'
    //     const response = axiosGet(url, 'post', {
    //       query
    //     })

    //     const content = response.data.places[0].Description

    //     if (content !== null && content !== undefined) {
    //       this.setCmsElementDescription(content)
    //       return 'foundInCms'
    //     } else {
    //       return null
    //     }
    //   } catch (err) {
    //     return null
    //   }
    // },

    handleSelectedSuggestion(item) {
      console.group('handleSelectedSuggestion')

      if (typeof item === 'undefined') {
        console.log('item === undefined')
        return
      }
      const itemName = item.item.name
      console.log(itemName)
      if (itemName.length) {
        this.setSelectedElement(itemName)
        this.setWikiElementDescription(itemName)
      }

      this.$refs.autosuggest.$el.children.autosuggest_input.focus()
    },

    mergeNamesDescriptions(names, descriptions) {
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
