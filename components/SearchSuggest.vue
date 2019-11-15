<template>
  <div>
    <search-suggest
      ref="autosuggest"
      v-model="searchedElement"
      class="bg-green-400 w-full"
      :suggestions="shownSuggestions"
      :get-suggestion-value="getSuggestionItemName"
      :input-props="{
        id: 'autosuggest_input',
        placeholder: 'Type here for Search'
      }"
      @input="searchWikiSuggestions"
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
import { queryPlacesByName } from '~/mixins/helpersGraph'
import axios from 'axios'
import helpersFunctions from '~/mixins/helpersFunctions.js'

export default {
  components: {
    'search-suggest': VueAutosuggest
  },
  mixins: [helpersFunctions],

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
      searchedElement: this.searchString,
      shownSuggestions: this.suggestions
    }
  },
  computed: {
    ...mapState('wiki', ['wikiElement']),
    ...mapState(['language'])
  },

  methods: {
    ...mapActions({
      setWikiElement: 'wiki/setWikiElement',
      setWikiElementDescription: 'wiki/setWikiElementDescription' // map `this.setWikiElement(payload)` to `this.$store.dispatch('setWikiElement', payload)`
    }),

    // This is what the <input/> value is set to when you are selecting a suggestion.
    getSuggestionItemName(suggestion) {
      return suggestion.item.name
    },

    // funzione TROPPO accoppiata con output opensearch di wikipedia
    async searchWikiSuggestions(searchedElement) {
      let url =
        this.getDataEndpoint(this.language, 'wikipedia', 'opensearch') +
        searchedElement

      let resource = await this.axiosGet(url, 'get')

      if (resource.data[1].length === 0) {
        url =
          this.getDataEndpoint('it', 'wikipedia', 'opensearch') +
          searchedElement
        resource = await this.axiosGet(url, 'get')
      }

      this.shownSuggestions = this.mergeNamesDescriptions(
        resource.data[1],
        resource.data[2]
      )
    },

    async getPlaceByNameCms(name, lang) {
      const query = queryPlacesByName(name)

      try {
        const url = this.getDataEndpoint(lang, 'cms', 'query') + '/graphql'

        const response = await axios({
          url,
          method: 'post',
          data: {
            query
          }
        })

        const content = response.data.places[0].Description

        if (content !== null && content !== undefined) {
          this.setCmsElementDescription(content)
          return 'foundInCms'
        } else {
          return null
        }
      } catch (err) {
        return null
      }
    },

    async handleSelectedSuggestion(item) {
      let wikiContent, payload
      this.setWikiElement(item.item.name)

      // put selected suggestion from wiki in store

      let cmsResult = await this.getPlaceByNameCms(
        this.wikiElement,
        this.language
      )

      if (cmsResult === null) {
        this.setWikiElementDescription(this.wikiElement)
        //wikiContent = await this.getPlaceByNameWiki(this.wikiElement, this.language)
      }
      //wikiContent = await this.getPlaceByName(this.wikiElement, this.language)

      // this.setWikiElementDescription(this.wikiElement, this.language)
      // console.log ('setWikiElementDescription done')
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
