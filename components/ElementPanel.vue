/* eslint-disable vue/html-closing-bracket-spacing */ /* eslint-disable
vue/html-self-closing */
<template>
  <div>
    <div class="bg-red-200">
      <h1 v-if="selectedElement">
        // eslint-disable-next-line vue/html-indent Hai selezionato
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
      console.group('watcher selectedElement')
      this.getDataCms(QUERY)
      // const result= await this.getData(CMS, QUERY,'post')
      //if(!result){
      //await this.getData(WIKIPEDIA, CONTENT_SEARCH)
      // }
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

      console.group('getDataCms')
      console.log('url ', url)
      console.log('uri ', uri)
      console.log('method ', method)
      console.log('responseFormat ', responseFormat)
      console.log('query ', query)
      try {
        response = await this.axiosCall(url, method, { query })
      } catch {
        console.log('getDataCms: catch chiamata axios')
        return null
      }

      console.log('RESPONSE')
      console.log(response)
      retrievedData = response.data
      console.log('retrievedData')
      console.log(retrievedData)

      itemfound = this.getProp(retrievedData, responseFormat)
      console.log('itemfound')
      console.log(itemfound)
      if (itemfound) {
        this.cmsItem.Identifier = itemfound[0].Identifier
        this.cmsItem.Name = itemfound[0].Name
        this.cmsItem.Description = itemfound[0].Description
        return true
      }
    },

    async getData(source, operation, method) {
      // console.log ('cazzo di source ',source)
      // let query, uri, response, retrievedData, responseFormat, destObj,itemfound

      if (source === CMS) {
        // uri = GRAPHQL_URI
        // responseFormat = 'data.places'
        // destObj = this.cmsItem
        // query = this.queryPlacesByName(this.selectedElement)

        // const url = this.getDataEndpoint(this.language, source, operation) + uri

        itemfound = this.getProp(retrievedData, responseFormat)
        console.log('itemfound')
        console.log(itemfound)
        if (itemfound) {
          this.cmsItem.Identifier = itemfound[0].Identifier
          this.cmsItem.Name = itemfound[0].Name
          this.cmsItem.Description = itemfound[0].Description
          return true
          //const placesFound = retrievedData['data']['places']
        }
      } else if (source === WIKIPEDIA) {
        console.log('ramo wiki')

        //console.dir(this.wikiItem)
        //this.wikiItem.Description =await wtf(this.selectedElement);
        this.wikiItem.Description = await wtf.fetch(
          this.selectedElement,
          this.language
        )

        console.log(this.wikiItem.Description.text())

        // responseFormat = 'query.pages'
        // destObj = this.wikiItem
      } else {
        console.log('source not valid')
        return null
      }
    }
  }
}
</script>
