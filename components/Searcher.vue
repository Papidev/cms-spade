<template>
  <div>
    <prompter
      ref="autosuggest"
      v-model="elementToSearch"
      class="bg-green-400 w-full"
      :suggestions="shownSuggestions"
      :get-suggestion-value="getSuggestionItemName"
      :input-props="{
        id: 'autosuggest_input',
        placeholder: 'Type here for Search'
      }"
      @input="searchWikiSuggestions"
      @selected="handleSelectedSuggestion"
      @keydown="onKeyDown"
    >
      <template v-slot:default="{ suggestion }">
        <div>
          <strong>{{ suggestion.item.name }} </strong> ----
          {{ suggestion.item.description.substring(0, 75) }}
        </div>
      </template>
    </prompter>

    <div v-if="!selectedItem" class="px-4 py-2 m-2">
      <h1>
        Non hai selezionato nulla 😢
      </h1>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { VueAutosuggest } from 'vue-autosuggest'

import helpersGraph from '~/mixins/helpersGraph'
import helpersFunctions from '~/mixins/helpersFunctions.js'
import helpersWiki from '~/mixins/helpersWiki.js'
import { WIKI, WIKI_SUGGEST_SEARCH, WIKI_SUGG_SEARCH_CHARS } from '~/constants/'

export default {
  components: {
    prompter: VueAutosuggest
  },
  mixins: [helpersFunctions, helpersGraph, helpersWiki],

  props: {
    // searchString: {
    //   required: false,
    //   default: '',
    //   type: String
    // }
  },
  data() {
    return {
      elementToSearch: '',
      shownSuggestions: []
    }
  },
  computed: {
    ...mapState(['language', 'selectedItem', 'selectedContentType']),
    autosuggestionInput() {
      return this.$refs.autosuggest.$el.children.autosuggest_input
    }
  },

  methods: {
    ...mapActions({
      setSelectedElement: 'setSelectedElement',
      setLanguage: 'setLanguage'
    }),

    onKeyDown(e) {
      if (e.keyCode === 13) {
        this.searchWikiSuggestions(this.elementToSearch)
      }
    },
    // This is what the <input/> value is set to when you are selecting a suggestion.
    getSuggestionItemName(suggestion) {
      return suggestion.item.name
    },

    async searchWikiSuggestions(elementToSearch) {
      if (!elementToSearch || elementToSearch.length < WIKI_SUGG_SEARCH_CHARS) {
        console.log(
          'searchWikiSuggestions exit right away : elementToSearch',
          elementToSearch
        )
        this.shownSuggestions = []
        return
      }

      let url =
        this.getDataEndpoint(this.language, WIKI, WIKI_SUGGEST_SEARCH) +
        elementToSearch
      let resource
      try {
        resource = await this.axiosCall(url, 'get')
      } catch (error) {
        return
      }

      if (Array.isArray(resource) && resource.length) {
        this.shownSuggestions = this.suggestionsSetup(
          resource[1], //names
          resource[2] //descriptions
        )
      }

      return
    },

    handleSelectedSuggestion(suggestion) {
      if (!suggestion) {
        //suggestion void or null
        console.log(
          `handleSelectedSuggestion : exit for suggestion falsy --> ${suggestion} `
        )
        return
      }

      const suggestionName = this.getSuggestionName(suggestion)
      console.log(
        `handleSelectedSuggestion : suggestionName --> ${suggestionName}`
      )
      this.setSelectedElement(suggestionName)

      this.autosuggestionInput.focus()
    }
  }
}
</script>
