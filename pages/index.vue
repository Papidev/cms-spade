/* eslint-disable prefer-const */
<template>
  <div class="flex">
    <div class="bg-green-100 h-screen w-1/2">
      <div class="bg-red-200 ">
        <h1 v-if="selected">Hai selezionato {{ selected }}</h1>
        <h1 v-else>Non hai selezionato nulla 😢</h1>
      </div>
      <br />
      <ul>
        <li
          v-for="(value, name, index) in cmsItem"
          :key="(value, name, index).index"
        >
          {{ index }}. {{ name }}: {{ value }}
        </li>
      </ul>
      <button type="button" @click="queryCms('en')">
        Click Me!
      </button>
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
    <div class="bg-red-100 h-screen w-1/2 border-2 border-black">
      <!-- this component will only be rendered on client-side -->
      <main>
        <no-ssr placeholder="Loading...">
          <new-markdown-editor v-model="wikiContent"></new-markdown-editor>
        </no-ssr>
      </main>
    </div>
    <!--
    <div class="w-1/4">
      <json-tree :data="jsonSource" @selected="itemSelected" />
    </div>
    -->
  </div>
</template>

<script>
import { VueAutosuggest } from 'vue-autosuggest'
// import newMarkdownEditor from ''
import {
  getDataEndpoint,
  mergeNamesDescriptions,
  axiosGet,
  // eslint-disable-next-line no-unused-vars
  queryCms
} from '~/components/helpersFunctions.js'
// import markdownEditor from 'vue-simplemde/src/markdown-editor'
// import { JSONView } from 'vue-json-component'
// let newMarkdownEditor
if (process.client) {
  console.log('ONLY ON BROWSER')
  // newMarkdownEditor = require('~/components/MarkdownEditor.vue')
  require('easymde/dist/easymde.min.css')
}

export default {
  components: {
    'search-suggest': VueAutosuggest,
    // 'markdown-editor': markdownEditor
    // 'new-markdown-editor': newMarkdownEditor
    'new-markdown-editor': () => import('~/components/MarkdownEditor.vue')
    // 'json-tree': JSONView
  },

  data() {
    return {
      cmsItem: {
        id: '',
        Identifier: '',
        Name: '',
        Description: ''
      },

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
    axiosGet('/data/Chiese_Abbazie_ProvinciaMilano.json').then((response) => {
      this.jsonSource = response.data
    })
  },

  methods: {
    async queryCms(lang) {
      console.log('CLICK')
      let attribute, searchString

      if (this.selected !== '') {
        searchString = this.selected
      } else return null

      const url = getDataEndpoint(lang, 'cms', 'query')
      // "convertToSome" inside is the imported function
      if (this.Identifier !== '' && typeof this.Identifier !== 'undefined') {
        attribute = 'Identifier'
      } else {
        attribute = 'Name'
      }

      this.resultItem = await queryCms(attribute, searchString, lang, url)
      if (this.resultItem !== null) {
        for (const k in this.resultItem) {
          console.log(this.resultItem[k])
          this.cmsItem[k] = this.resultItem[k]
        }
      }
      // console.log(this.cmsItem.Identifier)
    },
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
      const resource = await axiosGet(queryUrl)
      const page = Object.keys(resource.data.query.pages)[0]
      this.wikiContent = resource.data.query.pages[page].extract
      this.$refs.autosuggest.$el.children.autosuggest_input.focus()
    },

    async getSuggestions(searchString) {
      // console.log('getSuggestions ' + searchString)
      let url = getDataEndpoint('en', 'wikipedia', 'opensearch') + searchString
      // console.log(url)
      let resource = await axiosGet(url)
      // console.log(resource)

      if (resource.data[1].length === 0) {
        url = getDataEndpoint('it', 'wikipedia', 'opensearch') + searchString
        resource = await axiosGet(url)

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
