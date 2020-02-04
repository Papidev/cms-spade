<template>
  <div class="flex flex-col bg-gray-400">
    <search-suggest :search-string="searchString" class="px-4 py-2 m-2" />
    <content-panel class="px-4 py-2 m-2" />
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
    'search-suggest': () => import('~/components/SearchSuggest.vue'),
    'content-panel': () => import('~/components/Panel.vue')
  },
  mixins: [helpersMixin],

  data() {
    return {
      searchString: '',

      jsonSource: {}
    }
  },
  computed: {
    ...mapState(['selectedElement'])
  },

  watch: {
    searchString(val) {
      this.getSuggestions(val)

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
