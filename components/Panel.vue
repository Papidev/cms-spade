/* eslint-disable no-prototype-builtins */ /* eslint-disable
no-prototype-builtins */
<template>
  <section class="flex flex-row bg-gray-200 w-screen">
    <panel-data
      :schema-fields="schemaFields"
      :cleaned-merged-item="cleanedMergedItem"
      class="w-auto px-4 py-2 m-2"
    >
    </panel-data>

    <client-only placeholder="Loading panel-writing">
      <panel-writing
        v-model="textareaContent"
        class="w-auto px-4 py-2 m-2"
        :source="textAreaSource"
      ></panel-writing>
    </client-only>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import helpersFunctions from '~/mixins/helpersFunctions.js'
import { CMS, WIKI } from '~/constants/'

import { placesByName } from '~/apollo/cms/queries/place/places'
import { schemaIntrospection } from '~/apollo/cms/queries/schema'

import wtf from 'wtf_wikipedia'

export default {
  components: {
    'panel-data': () => import('~/components/PanelData.vue'),
    'panel-writing': () => import('~/components/PanelWritingArea.vue')
  },
  mixins: [helpersFunctions],

  data() {
    return {
      cmsData: {},
      wikiItem: {},
      contentSchema: {},
      mergedItem: {}
    }
  },

  computed: {
    ...mapState(['selectedItem', 'language', 'selectedContentType']),
    ...mapState('datasources', ['sources']),
    ...mapMutations(['errors/addError']),

    cmsItem() {
      return this.cmsData ? this.cmsData[0] : null
    },

    isCmsItemLoading() {
      return this.getSourceByName(CMS).isLoading
    },

    isWikiItemLoading() {
      //
      //
      return this.getSourceByName(WIKI).isLoading
    },

    schemaFields() {
      // content type schema
      return this.getProp(this.contentSchema, 'fields')
    },

    // mergedItem() {
    //
    //   if (
    //     !this.selectedItem ||
    //     !this.contentSchema ||
    //     this.isWikiItemLoading ||
    //     this.isCmsItemLoading
    //   ) {
    //
    //     return
    //   } else {
    //
    //     return this.mergeContentResults(
    //       ['Identifier', 'Name', 'Description'],
    //       [this.cmsItem, this.wikiItem]
    //     )
    //   }
    // },

    // TODO: call a reusable function to clean undesired properties from an object
    cleanedMergedItem() {
      //
      let newObject = this.filterProperties(this.mergedItem)

      return newObject
      // const newObj = { ...this.mergedItem }
      // delete newObj.Description
      // delete newObj.__typename
      // return newObj
    },

    textAreaSource() {
      if (this.mergedItem) {
        return this.mergedItem.Description
          ? this.mergedItem.Description.source
          : ''
      } else {
        return ''
      }
    },

    textareaContent() {
      let content = this.getProp(this.mergedItem, 'Description.value')

      if (!content) {
        content = this.getProp(this.cmsItem, 'Description')
      }
      return content
    }
  },

  watch: {
    isCmsItemLoading(value) {
      this.toggleLoading(CMS, value)
    },

    async selectedItem() {
      await this.getDataWiki(this.selectedItem, this.language)
    }
  },

  methods: {
    getSourceByName(currentSourceName) {
      let predicate = function(x) {
        return x.source === currentSourceName
      }
      return this.sources.find(predicate)
    },

    toggleLoading(source, value) {
      this.$store.commit('datasources/setLoading', {
        source: source,
        loadingState: value
      })
    },

    async submit() {},

    async getDataWiki(name, language) {
      this.toggleLoading(WIKI, true)
      try {
        const content = await wtf.fetch(name, language)
        this.wikiItem.Name = name
        this.wikiItem.Description = content.text()
      } catch (error) {
        this.$store.commit('errors/addError', {
          description: error.message,
          step: 'getWikiContent'
        })

        return false
      } finally {
        this.toggleLoading(WIKI, false)

        this.mergeContentResults(
          ['Identifier', 'Name', 'Description'],
          [this.cmsItem, this.wikiItem]
        )
      }
    },

    // eslint-disable-next-line no-unused-vars
    mergeContentResults(schema, contentItems) {
      console.log('Start mergeContentResults')
      function findo(contentItem) {
        // eslint-disable-next-line no-prototype-builtins
        return contentItem.hasOwnProperty('Name')
      }

      // merge "contentItems" depending on "schema"
      let merged = {}
      let cleanedContentItems = contentItems.filter(Boolean)

      //
      for (const schemaField of schema) {
        let foundContentItem
        // cerco un contentItem che abbia schemaField non vuoto
        foundContentItem = cleanedContentItems.find(findo)

        //
        if (foundContentItem) {
          merged[schemaField] = {
            value: foundContentItem[schemaField], // valore di schemaField dentro a content item che lo possiede
            source: CMS // TO DO: fix this hardcoding
          }
        }
      }

      this.mergedItem = merged
    }
  },

  apollo: {
    cmsData: {
      prefetch: false,
      query: placesByName,
      variables() {
        return {
          name: this.selectedItem
        }
      },
      skip() {
        return !this.selectedItem
      },
      error(error) {
        this.$store.commit('errors/addError', {
          description: error,
          step: 'getCmsContent'
        })
      },

      result() {},
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      watchLoading(isLoading) {
        this.toggleLoading(CMS, isLoading)
        if (!isLoading) {
          this.mergeContentResults(
            ['Identifier', 'Name', 'Description'],
            [this.cmsItem, this.wikiItem]
          )
        }
      }
    },

    contentSchema: {
      prefetch: true,
      query: schemaIntrospection,
      variables() {
        return {
          name: this.selectedContentType.name || ''
        }
      },
      error(error) {
        this.$store.commit('errors/addError', {
          description: error.message,
          step: 'getCmsContentSchema'
        })
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache'
      //watchLoading(isLoading) {}
    }
  }
}
</script>
