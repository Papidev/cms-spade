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

export default {
  mixins: [helpersFunctions, helpersGraph],

  data() {
    return {
      cmsItem: {
        id: '',
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
      console.log('start watcher selectedElement')
      // let { methods: helpers } = helperMixin
      // let { methods: helpersGraph } = helperGraphMixin

      const query = this.queryPlacesByName(newSelectedElement)

      const url =
        this.getDataEndpoint(this.language, 'cms', 'query') + '/graphql'

      try {
        const response = await this.axiosGet(url, 'post', { query })
        console.log(response.data.data.places)
        if (response.data.data.places.length) {
          this.cmsItem.Description = response.data.places[0].Description

          //vuexContext.commit('setCmsElementDescription', content)
        } else {
          console.log('Non ho trovato niente su CMS')
        }
      } catch (error) {
        console.log('ramo catch watcher selectedElement')
        throw error
      }
    }
  }
}
</script>