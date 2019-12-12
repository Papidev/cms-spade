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
          v-for="(propValue, name, index) in mergedItemNoDesc"
          :key="(propValue, name, index).index"
        >
          <wrapper-input
            :label="name"
            :content="propValue"
          />
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
  components: {
    'wrapper-input': () => import('~/components/WrapperInput.vue')
  },

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
      mergedItem: {}
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language']),
    mergedItemNoDesc() {
      const newObj = { ...this.mergedItem }
      delete newObj.Description
      return newObj
    }
  },
  watch: {
    selectedElement: async function(newSelectedElement) {
      await Promise.all([this.getDataCms(QUERY), this.getDataWiki()])

      this.mergedItem = this.mergeResultsProperties(
        this.cmsItem,
        this.wikiItem,
        CMS,
        WIKIPEDIA
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
