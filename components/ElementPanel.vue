
<template>
  <div>
    <div class="bg-red-200">
      <h1 v-if="selectedElement">
        Hai selezionato
        {{ selectedElement }}
      </h1>
      <h1 v-else>
        Non hai selezionato nulla 😢
      </h1>

      <br>
      <ul>
        <li
          v-for="(value, name, index) in cmsItem"
          :key="(value, name, index).index"
        >
          {{ index }}. {{ name }}: {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import wtf from 'wtf_wikipedia'
import { mapState } from 'vuex'
import helpersGraph from '~/mixins/helpersGraph'
import helpersFunctions from '~/mixins/helpersFunctions.js'
import {
  CMS,
  QUERY,
  GRAPHQL_URI,
  WIKIPEDIA,
  CONTENT_SEARCH
} from '~/constants/'
export default {
  mixins: [helpersFunctions, helpersGraph],

  data() {
    return {
      cmsItem: {
        Identifier: null,
        Name: null,
        Description: null
      },
      wikiItem: {
        // Identifier: null,
        Name: null,
        Description: null
      },
      cleaned: {}
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language'])
  },
  watch: {
    selectedElement: async function(newSelectedElement) {
      let response = await this.getDataCms(QUERY)

      if (!response) {
        await this.getDataWiki()
      }

      this.cleaned = Object.assign(
        {},
        this.removeVoidProps(this.wikiItem),
        this.removeVoidProps(this.cmsItem)
      )
    }
  },
  methods: {
    async getDataCms(operation) {
      let response
      const uri = GRAPHQL_URI // using graphql
      const url = this.getDataEndpoint(this.language, CMS, operation) + uri
      let method = 'post'
      let query = this.queryPlacesByName(this.selectedElement)
      let responseFormat = 'data.places'

      try {
        response = await this.axiosCall(url, method, { query })
      } catch {
        return false
      }

      let itemfound = this.getProp(response, responseFormat)

      if (itemfound.length > 0) {
        this.cmsItem.Identifier = itemfound[0].Identifier
        this.cmsItem.Name = itemfound[0].Name
        this.cmsItem.Description = itemfound[0].Description
        return true
      } else {
        return false
      }
    },

    async getDataWiki() {
      let response

      try {
        let content = await wtf.fetch(this.selectedElement, this.language)

        this.wikiItem.Description = content.text()
      } catch {
        return false
      }
    }
  }
}
</script>
