<template>
  <section class="flex flex-row bg-gray-200 w-screen">
    <item-panel
      :schema-fields="schemaFieldsList"
      :cleaned-merged-item="cleanedMergedItem"
      class="w-auto px-4 py-2 m-2"
    ></item-panel>

    <client-only placeholder="Loading item-textarea">
      <item-textarea
        v-model="textareaContent"
        class="w-auto px-4 py-2 m-2"
        :source="textAreaSource"
      ></item-textarea>
    </client-only>
  </section>
</template>
<script>
import { mapState } from 'vuex'
//import { mapMutations } from 'vuex'
import { CMS, WIKI } from '~/constants/'
import wtf from 'wtf_wikipedia'
import { placesByName } from '~/apollo/cms/queries/place/places'
import { schemaIntrospection } from '~/apollo/cms/queries/schemas'

import helpersFunctions from '~/mixins/helpersFunctions.js'

export default {
  components: {
    'item-panel': () => import('~/components/ItemPanel.vue'),
    'item-textarea': () => import('~/components/ItemTextArea.vue')
  },
  mixins: [helpersFunctions],

  data() {
    return {
      errors: [],
      cmsItem: {},
      wikiItem: {},
      contentSchema: {},
      iswikiLoading: false
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language']),
    ...mapState('datasources/datasources', ['sources']),

    isCmsItemLoading() {
      console.log('start isCmsItemLoading computed')
      if (this.$apollo.queries) {
        console.log(this.$apollo.queries.cmsItem)
        return this.$apollo.queries.cmsItem
          ? this.$apollo.queries.cmsItem.loading
          : false
      } else return false
    },

    schemaFieldsList() {
      // content type schema
      return this.contentSchema ? this.contentSchema.fields : []
    },

    mergedItem() {
      console.log('start computed mergedItem')
      if (
        !this.selectedElement ||
        !this.contentSchema ||
        this.iswikiLoading ||
        this.isCmsItemLoading
      ) {
        console.log(' computed MemergedItemrged : esco subito')
        return
      }
      console.log(
        '%c dentro computed mergedItem loggo PIPPONI items',
        'background: #222; color: #bada55'
      )

      console.log(this.wikiItem.Name)
      console.log(this.cmsItem[0])
      return this.mergeContentResults(
        ['Identifier', 'Name', 'Description'],
        [this.cmsItem[0], this.wikiItem]
      )
    },
    // TODO: call a reusable function to clean undesired properties from an object
    cleanedMergedItem() {
      const newObj = { ...this.mergedItem }
      delete newObj.Description
      delete newObj.__typename
      return newObj
    },

    textAreaSource() {
      if (this.mergedItem) {
        return this.mergedItem.Description
          ? this.mergedItem.Description.source
          : ''
      } else return ''
    },

    textareaContent() {
      let content = this.getProp(this.mergedItem, 'Description.value')

      if (!content) {
        content = this.getProp(this.cmsItem, 'Description')
      }
      return content
    }

    // cmsItemName() {
    //   return this.cmsItem.Name
    // }
  },

  watch: {
    // cmsItem() {
    //   //   //   console.log('start watcher cms loading', value)
    //   //   //   this.toggleLoading(CMS, this.cmsLoading)
    //   //   //   if (
    //   //   //     !this.cmsLoading &&
    //   //   //     this.selectedElement &&
    //   //   //     this.cmsItem &&
    //   //   //     this.cmsItem.Name != ''
    //   //   //   ) {
    //   //   //     console.log('watcher cms loading: MERGIO')
    //   //   //     this.mergedItem()
    //   //   //   }
    // },

    isCmsItemLoading(value) {
      console.log('watcher isCmsItemLoading')
      this.toggleLoading(CMS, value)
    },

    iswikiLoading(value) {
      this.toggleLoading(WIKI, value)
    },

    async selectedElement() {
      await this.getDataWiki(this.selectedElement, this.language)
    }
  },

  methods: {
    // eslint-disable-next-line no-unused-vars

    getSourceByName(currentSourceName) {
      return this.sources.find((x) => x.source === currentSourceName)
    },

    // getLoading(currentSourceName) {
    //   let source = this.getSourceByName(currentSourceName)
    //   if (source) {
    //     return source.isLoading
    //   }
    // },

    toggleLoading(source, value) {
      this.$store.commit('datasources/datasources/setLoading', {
        source: source,
        loadingState: value
      })
    },

    async submit() {},

    async getDataWiki(name, language) {
      this.iswikiLoading = true

      try {
        const content = await wtf.fetch(name, language)
        this.wikiItem.Name = name
        this.wikiItem.Description = content.text()
      } catch (error) {
        this.pushError(this.errors, error.message, 'getWikiContent')
        return false
      } finally {
        this.iswikiLoading = false
      }
    },

    pushError(errorStore, errorMessage, errorStep) {
      let newError = {}
      newError.description = errorMessage
      newError.step = errorStep
      newError.DateTime = this.getCurrentDateTime()
      errorStore.push(newError)
    }
  },

  apollo: {
    cmsItem: {
      prefetch: false,
      query: placesByName,

      variables() {
        return {
          name: this.selectedElement
        }
      },

      skip() {
        return !this.selectedElement
      },
      error(error) {
        console.log('APOLLO HA ERRORATO')
        this.pushError(this.errors, error.message, 'getCmsContent')
      },
      // eslint-disable-next-line no-undef

      // eslint-disable-next-line no-unused-vars
      result(data) {
        console.log('APOLLO HA FINITO')
        console.log(this.cmsItem ? this.cmsItem[0] : 'trovato niente')
        console.log(data)
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      watchLoading(isLoading, countModifier) {
        console.log('watch hook cmsItem : ', isLoading, countModifier)
        this.toggleLoading(CMS, isLoading)
      }
    },
    contentSchema: {
      prefetch: true,
      query: schemaIntrospection,

      variables() {
        return {
          name: 'Place' //TODO: make input dynamic when content type will be selectable
        }
      },
      error(error) {
        this.pushError(this.errors, error.message, 'getCmsContentSchema')
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache'
    }
  }
}
</script>
