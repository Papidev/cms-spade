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
import { axiosGet, getDataEndpoint } from '~/components/helpersFunctions.js'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    'search-suggest': VueAutosuggest
  },

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
    // ...mapState({
    //   language
    // }),
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
        getDataEndpoint(this.language, 'wikipedia', 'opensearch') +
        searchedElement

      let resource = await axiosGet(url)

      if (resource.data[1].length === 0) {
        url = getDataEndpoint('it', 'wikipedia', 'opensearch') + searchedElement
        resource = await axiosGet(url)
      }

      this.shownSuggestions = this.mergeNamesDescriptions(
        resource.data[1],
        resource.data[2]
      )
    },

    async handleSelectedSuggestion(item) {
      let wikiContent
      this.setWikiElement(item.item.name) // put selected suggestion from wiki in store

      wikiContent = await this.getPlaceByName(this.wikiElement, this.language)
      console.log(wikiContent)
      this.setWikiElementDescription(wikiContent)

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
    },
    async getPlaceByName(name, lang) {
      console.log('getPlaceByName : ' + name + ' ' + lang)
      // let wikiResult
      // const cmsResult = ''
      //   cmsResult = await getPlaceByNameCms(name, lang)

      //   if (cmsResult !== null && cmsResult !== undefined) {
      //     console.log('Trovato record su CMS')
      //     return cmsResult
      //   } else {
      //     console.log('Non ho trovato niente su CMS')
      //     wikiResult = await getPlaceByNameWiki(name, lang)
      //     return wikiResult
      //   }
    }
  }
}
</script>
