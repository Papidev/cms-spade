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
      cmsItem: {},
      wikiItem: {},
      contentSchema: {}
    }
  },

  computed: {
    ...mapState(['selectedItem', 'language', 'selectedContentType']),
    ...mapState('datasources', ['sources']),
    ...mapMutations(['errors/addError']),

    isCmsItemLoading() {
      return this.getSourceByName(CMS)
    },

    isWikiItemLoading() {
      // console.log('isWikiItemLoading')
      // console.log(this.getSourceByName(WIKI))
      return this.getSourceByName(WIKI)
    },

    schemaFields() {
      // content type schema
      return this.getProp(this.contentSchema, 'fields')
    },

    mergedItem() {
      console.log('mergedItem sono partita cazzo')
      if (
        !this.selectedItem ||
        !this.contentSchema ||
        this.isWikiItemLoading ||
        this.isCmsItemLoading
      ) {
        console.log('mergedItem mi sono bloccata cazzo')

        console.log(this.isWikiItemLoading)
        console.log(this.isCmsItemLoading)
        return
      }

      return this.mergeContentResults(
        ['Identifier', 'Name', 'Description'],
        [this.cmsItem[0], this.wikiItem]
      )
    },

    // TODO: call a reusable function to clean undesired properties from an object
    cleanedMergedItem() {
      let array = ['Description']

      let predicate = function(key) {
        !array.includes(key)
      }

      let newObject = this.filterProperties(this.mergedItem, predicate)

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

    iswikiLoading(value) {
      this.toggleLoading(WIKI, value)
    },

    async selectedItem() {
      await this.getDataWiki(this.selectedItem, this.language)
    }
  },

  methods: {
    async getSourceByName(currentSourceName) {
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
      this.iswikiLoading = true

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
        this.iswikiLoading = false
      }
    },

    mergeContentResults(schema, contentItems) {
      //merge "contentItems" depending on "schema"

      let mergedItem

      //
      for (const schemaField in schema) {
        let foundContentItem

        // cerco un contentItem che abbia schemaField non vuoto
        foundContentItem = contentItems.find(
          (contentItem) => contentItem[schemaField]
        )
        //
        if (foundContentItem) {
          mergedItem[schemaField] = {
            value: foundContentItem[schemaField], // valore di schemaField dentro a content item che lo possiede
            source: CMS // TO DO: fix this hardcoding
          }
        }
      }
      return mergedItem
    }
  },

  apollo: {
    cmsItem: {
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
          description: error.message,
          step: 'getCmsContent'
        })
      },

      result() {},
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      watchLoading(isLoading) {
        this.toggleLoading(CMS, isLoading)
      }
    },

    contentSchema: {
      prefetch: true,
      query: schemaIntrospection,
      variables() {
        return {
          name: this.selectedContentType.name
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
