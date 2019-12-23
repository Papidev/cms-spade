<template>
  <div>
    <h1 v-if="!selectedElement">
      Non hai selezionato nulla 😢
    </h1>
    // eslint-disable-next-line vue/html-closing-bracket-spacing

    <form action="" method="post">
      <div
        v-for="(propValue, name, index) in mergedItemNoDesc"
        :key="(propValue, name, index).index"
      >
        <wrapper-input :label="name" :content="propValue" />
      </div>
      <div v-if="$apollo.loading">Loading...</div>
      <client-only placeholder="Loading...">
        <new-markdown-editor
          v-model="textareaContent"
          :source="mergedItem.Description ? mergedItem.Description.source : ''"
        />
      </client-only>
      <input type="submit" value="Submit" @click="submit" />
    </form>
  </div>
</template>

<script>
import wtf from 'wtf_wikipedia'
import { mapState } from 'vuex'
import helpersGraph from '~/mixins/helpersGraph'
import helpersFunctions from '~/mixins/helpersFunctions.js'
import helpersGetData from '~/mixins/helpersGetData.js'
import { CMS, CMS_TARGET, WIKI, CMS_PLACES_ROOT } from '~/constants/'
import placesQuery from '~/apollo/queries/place/places'

export default {
  components: {
    'wrapper-input': () => import('~/components/WrapperInput.vue'),
    'new-markdown-editor': () => import('~/components/MarkdownEditor.vue')
  },

  mixins: [helpersFunctions, helpersGraph, helpersGetData],

  data() {
    return {
      places: [],
      cmsItem: {},
      wikiItem: {
        Name: null,
        Description: null
      },
      mergedItem: {
        Identifier: null,
        Name: null,
        Description: null
      }
    }
  },
  apollo: {
    places: {
      prefetch: true,
      query: placesQuery,
      variables() {
        return {
          name: this.selectedElement
        }
      },
      fetchPolicy: 'cache-and-network'
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language']),
    mergedItemNoDesc() {
      const newObj = { ...this.mergedItem }
      delete newObj.Description
      return newObj
    },

    textareaContent() {
      return this.mergedItem.Description
        ? this.mergedItem.Description.value
        : this.cmsItem.Description
    }
  },
  watch: {
    async selectedElement() {
      this.resetCmsItem()
      const results = await Promise.all([
        this.getDataCms(CMS_TARGET),
        this.getDataWiki()
      ])

      if (results) {
        this.mergedItem = this.mergeResultsProperties(
          this.cmsItem,
          this.wikiItem,
          CMS,
          WIKI
        )
      }
    }
  },

  mounted() {
    this.resetCmsItem()
  },

  methods: {
    resetCmsItem() {
      this.cmsItem = {
        Identifier: null,
        Name: null,
        Description: null
      }
    },

    async submit() {
      // send cms item to strapi with axios
      // const { firstName, lastName } = this;
      // const opts = {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ firstName, lastName })
      // };
      // const res = await fetch('https://httpbin.org/post', opts).
      //   then(res => res.json()).
      //   then(res => JSON.parse(res.data));
      // console.log('done', res.firstName, res.lastName);
      // this.firstName = '';
      // this.lastName = '';
    },

    async getDataCms(operation) {
      let response
      const responseFormat = CMS_PLACES_ROOT

      const method = 'post'
      const url = this.getDataEndpoint(this.language, CMS, operation)
      const query = this.queryPlacesByName(this.selectedElement)

      try {
        response = await this.axiosCall(url, method, { query })
      } catch {
        return false
      }

      const itemfound = this.getProp(response, responseFormat)

      if (!itemfound || itemfound.length == 0) {
        return false
      } else {
        this.cmsItem.Identifier = itemfound[0].Identifier
        this.cmsItem.Name = itemfound[0].Name
        this.cmsItem.Description = itemfound[0].Description
        return true
      }
    },

    async getDataWiki() {
      try {
        const content = await wtf.fetch(this.selectedElement, this.language)

        this.wikiItem.Name = this.selectedElement
        this.wikiItem.Description = content.text()
      } catch {
        return false
      }
    }
  }
}
</script>
