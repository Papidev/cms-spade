<template>
  <div class="flex">
    <div class="bg-green-100 h-screen w-1/2">
      PIPPONE
      <search-suggest
        ref="autosuggest"
        v-model="searchString"
        class="bg-green-200 h-screen w-full"
        :suggestions="suggestions"
        :get-suggestion-value="getSuggestionValue"
        :input-props="{
          id: 'autosuggest_input',
          placeholder: 'Type here for Search'
        }"
        @input="getSuggestions"
        @selected="getPageContent"
      >
        <template v-slot:default="{ suggestion }">
          <div>
            <strong>{{ suggestion.item.name }} </strong> ----
            {{ suggestion.item.description.substring(0, 75) }}
          </div>
        </template>
      </search-suggest>
    </div>

    <main class="bg-red-100 h-screen w-1/2 border-2 border-black">
      <new-markdown-editor v-model="wikiContent"></new-markdown-editor>
    </main>
    <!--
    <div class="w-1/4">
      <json-tree :data="jsonSource" @selected="itemSelected" />
    </div>
    -->
  </div>
</template>

<script>
import { VueAutosuggest } from 'vue-autosuggest'
// import markdownEditor from 'vue-simplemde/src/markdown-editor'
// import { JSONView } from 'vue-json-component'
import newMarkdownEditor from '~/components/MarkdownEditor.vue'
import {
  getDataEndpoint,
  mergeNamesDescriptions,
  fetchData
} from '~/components/helpers.js'
require('easymde/dist/easymde.min.css')

export default {
  components: {
    'search-suggest': VueAutosuggest,
    // 'markdown-editor': markdownEditor
    'new-markdown-editor': newMarkdownEditor
    // 'json-tree': JSONView
  },

  data() {
    return {
      searchString: '',
      selected: '',
      suggestions: [],
      wikiContent: '',
      jsonSource: {}
    }
  },
  watch: {
    searchString(val) {
      this.getSuggestions(val)
      const inputField = this.$refs.autosuggest.$el.children.autosuggest_input
      inputField.click()
      inputField.focus()
    }
  },

  created() {
    fetchData('/data/Chiese_Abbazie_ProvinciaMilano.json').then((response) => {
      this.jsonSource = response.data
    })
  },
  methods: {
    itemSelected(event) {
      this.searchString = event.value
    },

    onChangeJson(data) {
      this.jsonSource = data
    },

    async getPageContent(item) {
      this.selected = item.item.name
      const queryUrl =
        getDataEndpoint('en', 'wikipedia', 'query') + item.item.name
      console.log(queryUrl)
      const resource = await fetchData(queryUrl)
      const page = Object.keys(resource.data.query.pages)[0]
      this.wikiContent = resource.data.query.pages[page].extract
      this.$refs.autosuggest.$el.children.autosuggest_input.focus()
    },

    async getSuggestions(searchString) {
      // console.log('getSuggestions ' + searchString)
      let url = getDataEndpoint('en', 'wikipedia', 'opensearch') + searchString
      // console.log(url)
      let resource = await fetchData(url)
      // console.log(resource)

      if (resource.data[1].length === 0) {
        url = getDataEndpoint('it', 'wikipedia', 'opensearch') + searchString
        resource = await fetchData(url)

        // console.log('switchato it')
        // console.log(resource)
      }
      this.suggestions = mergeNamesDescriptions(
        resource.data[1],
        resource.data[2]
      )
    },

    /**
     * This is what the <input/> value is set to when you are selecting a suggestion.
     */
    getSuggestionValue(suggestion) {
      return suggestion.item.name
    }

    /* FocusEvent
    onFocus(e) {
      console.log(e)
    } */
  }
}
</script>
