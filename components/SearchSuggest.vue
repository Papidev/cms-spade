<template>
  <div>
    <search-suggest
      ref="autosuggest"
      v-model="searchedElement"
      class="bg-green-400 w-full"
      :suggestions="shownSuggestions"
      :get-suggestion-value="getSuggestionValue"
      :input-props="{
        id: 'autosuggest_input',
        placeholder: 'Type here for Search'
      }"
      @input="getSuggestions"
      @selected="handleSelected"
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
import { axiosGet } from '~/components/helpersFunctions.js'
export default {
  components: {
    'search-suggest': VueAutosuggest
  },

  props: {
    searchString: {
      required: false,
      type: String
    },
    suggestions: {
      required: false,
      type: Array
    }
  },
  data() {
    return {
      searchedElement: this.searchString,
      shownSuggestions: this.suggestions
    }
  },
  methods: {
    getDataEndpoint(lang, source, operation) {
      return process.env.endpoints[source][lang][operation]
    },
    /**
     * This is what the <input/> value is set to when you are selecting a suggestion.
     */
    getSuggestionValue(suggestion) {
      return suggestion.item.name
    },
    async getSuggestions(searchedElement) {
      // console.log('getSuggestions ' + searchedElement)
      let url =
        this.getDataEndpoint(
          this.$store.getters.getLanguage,
          'wikipedia',
          'opensearch'
        ) + searchedElement
      // console.log(url)
      let resource = await axiosGet(url)
      // console.log(resource)

      if (resource.data[1].length === 0) {
        url =
          this.getDataEndpoint('it', 'wikipedia', 'opensearch') +
          searchedElement
        resource = await axiosGet(url)

        // console.log('switchato it')
        // console.log(resource)
      }
      this.shownSuggestions = this.mergeNamesDescriptions(
        resource.data[1],
        resource.data[2]
      )
    },
    async handleSelected(item) {
      console.log('item : ', item)
      this.selected = item.item.name
      console.log('this.selected : ', this.selected)
      this.wikiContent = await this.getPlaceByName(
        item.item.name,
        this.$store.getters.getLanguage
      )
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
      let wikiResult
      const cmsResult = ''
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
