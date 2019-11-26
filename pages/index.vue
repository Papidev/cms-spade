<template>
  <div class="flex">
    <div class="bg-green-100 h-screen w-1/2">
      <cms-panel />
      <div class="bg-gray-400">
        <button
          class="rounded mx-auto px-10"
          type="button"
        >
          <!-- @click="clickHandler(searchString)" -->     
          Click Me!
        </button>
      </div>
      <hr>
      <search-suggest
        :search-string="searchString"
        :suggestions="suggestions"
      />
    </div>
    <div class="bg-red-100 h-screen w-1/2 border-2 border-black">
      <!-- this component will only be rendered on client-side -->
      <main>
        <client-only placeholder="Loading...">
          <new-markdown-editor v-model="wikiElementDescription" />
        </client-only>
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
import { mapState } from 'vuex'
import helpersMixin from '~/mixins/helpersFunctions.js'

if (process.client) {
  require('easymde/dist/easymde.min.css')
}

export default {
  components: {
    'new-markdown-editor': () => import('~/components/MarkdownEditor.vue'),
    'search-suggest': () => import('~/components/SearchSuggest.vue'),
    'cms-panel': () => import('~/components/CmsPanel.vue')
  },
  mixins: [helpersMixin],

  data() {
    return {
      searchString: '',

      suggestions: [],

      jsonSource: {}
    }
  },
  computed: {
    ...mapState(['selectedElement']),
    ...mapState('wiki', ['wikiElementDescription'])
  },

  watch: {
    searchString(val) {
      this.getSuggestions(val)
      console.log(this.$refs)
      const inputField = this.$refs.autosuggest.$el.children.autosuggest_input
      inputField.click()
      inputField.focus()
    }
  },

  async created() {
    // let response = await this.axiosCall(
    //   '/data/Chiese_Abbazie_ProvinciaMilano.json',
    //   'get'
    // )
    // this.jsonSource = response.data
  },

  methods: {
    itemSelected(event) {
      this.searchString = event.value
    },

    onChangeJson(data) {
      this.jsonSource = data
    }
  }
}
</script>
