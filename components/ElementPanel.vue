<template>
  <div>
    <div
      class="bg-red-200"
    >
      <h1 v-if="selectedElement">
        Hai selezionato {{ selectedElement }}
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
        Identifier: '',
        Name: '',
        Description: ''
      },
      wikiItem: {
        Identifier: '',
        Name: '',
        Description: ''
      }
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language'])
  },
  watch: {
    selectedElement: async function(newSelectedElement) {
      console.group('watch selectedElement')
      const query = this.queryPlacesByName(newSelectedElement)
      const url = this.getDataEndpoint(this.language, CMS, QUERY) + GRAPHQL_URI

      try {
        const response = await this.axiosCall(url, 'post', { query })
        console.dir(response)
        const placesFound = response.data.data.places

        if (placesFound.length) {
          console.log(placesFound[0])
          this.cmsItem.Identifier = placesFound[0].Identifier
          this.cmsItem.Name = placesFound[0].Name
          this.cmsItem.Description = placesFound[0].Description
        } else {
          console.log('Non ho trovato niente su CMS')
          const url =
            this.getDataEndpoint(this.language, WIKIPEDIA, CONTENT_SEARCH) +
            newSelectedElement

          const response = await this.axiosCall(url, 'get')

          if (typeof response !== 'undefined') {
            const page = Object.keys(response.data.query.pages)[0]

            this.wikiItem.Description = response.data.query.pages[page].extract
          } else {
          }
        }
      } catch (error) {
        console.log('ramo catch watcher selectedElement')
        throw error
      }
    }
  },
  methods: {
    async getData(source, operation) {
      let query, uri, response, retrievedData, responseFormat, destObj

      if (source === CMS) {
        uri = GRAPHQL_URI
        method = 'post'
        responseFormat = 'data.places'
        destObj = this.cmsItem
        query = this.queryPlacesByName(this.selectedElement)

        //const placesFound = retrievedData['data']['places']
      } else if (source === WIKIPEDIA) {
        uri = newSelectedElement
        method = 'get'
        responseFormat = 'query.pages'
        destObj = this.wikiItem
      } else {
        console.log('source not valid')
        return null
      }
      console.log('uri ', uri)
      console.log('method ', method)
      console.log('responseFormat ', responseFormat)
      console.log('query ', query)
      console.dir(destObj)

      const url = this.getDataEndpoint(this.language, source, operation) + uri
      console.log('url ', url)
      try {
        response = await this.axiosCall(url, method, { query })
      } catch {
        console.log('catch chiamata axios di recupero dati')
      }
      console.log(response)
      retrievedData = response.data
      console.log(retrievedData)
      itemfound = this.getProp(retrievedData, responseFormat)
      console.log(itemfound)

      if (itemfound) {
        if (source === CMS) {
          console.log(itemfound[0])
          this.cmsItem.Identifier = itemfound[0].Identifier
          this.cmsItem.Name = itemfound[0].Name
          this.cmsItem.Description = itemfound[0].Description
        } else if (source === WIKIPEDIA) {
          const page = Object.keys(itemfound)[0]
          this.wikiItem.Description = itemfound[page].extract
        }
        // this.wikiItem.Description = retrievedData['query']['pages'][page].extract
      }

      // if (placesFound.length) {
      //  console.log(placesFound[0])
      //  this.cmsItem.Identifier = placesFound[0].Identifier
      //  this.cmsItem.Name = placesFound[0].Name
      //  this.cmsItem.Description = placesFound[0].Description

      // }elsif  (source === 'WIKI'){
      //uri = newSelectedElement

      // if (typeof response !== 'undefined') {
      // const page = Object.keys(retrievedData['query']['pages'])[0]

      // this.wikiItem.Description = retrievedData['query']['pages'][page].extract
    }
  }
}
</script>
