<template>
  <section class="flex flex-row bg-gray-200 w-screen">
    <item-panel
      :schema-fields="schemaFields"
      :cleaned-merged-item="cleanedMergedItem"
      class="w-auto px-4 py-2 m-2"
    >
    </item-panel>

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
import { mapMutations } from 'vuex'
import helpersFunctions from '~/mixins/helpersFunctions.js'
import { CMS, WIKI } from '~/constants/'

import { placesByName } from '~/apollo/cms/queries/place/places'
import { schemaIntrospection } from '~/apollo/cms/queries/schema'

import wtf from 'wtf_wikipedia'

export default {
  components: {
    'item-panel': () => import('~/components/ItemPanel.vue'),
    'item-textarea': () => import('~/components/ItemTextArea.vue')
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
    ...mapState(['selectedElement']),
    ...mapState(['language']),
    ...mapState('datasources', ['sources']),
    ...mapMutations(['errors/addError']),

    isCmsItemLoading() {
      return this.getSourceByName(CMS)
    },

    isWikiItemLoading() {
      return this.getSourceByName(WIKI)
    },

    schemaFields() {
      // content type schema
      return this.getProp(this.contentSchema, 'fields')
    },

    mergedItem() {
      if (
        !this.selectedElement ||
        !this.contentSchema ||
        this.isWikiItemLoading ||
        this.isCmsItemLoading
      ) {
        return
      }

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
      console.log('watcher isCmsItemLoading')
      this.toggleLoading(CMS, value)
    },

    iswikiLoading(value) {
      console.log('watcher isWikiItemLoading')
      this.toggleLoading(WIKI, value)
    },

    async selectedElement() {
      await this.getDataWiki(this.selectedElement, this.language)
    }
  },

  methods: {
    getSourceByName(currentSourceName) {
      return this.sources.find((x) => x.source === currentSourceName)
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
      //merge contentItems depending on provided schema

      let mergedItem = {}

      //console.log(' contentItems : ', contentItems)
      for (const schemaField of schema) {
        let foundContentItem

        foundContentItem = contentItems.find(
          (contentItem) => contentItem[schemaField] // cerco un contentItem che abbia schemaField non vuoto
        )
        // console.log(' foundContentItem : ', foundContentItem)
        if (foundContentItem) {
          console.log('foundContentItem non vuoto')
          console.log(foundContentItem[schemaField])

          mergedItem[schemaField] = {
            value: foundContentItem[schemaField], // valore di schemaField dentro a content item che lo possiede
            source: CMS
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
          name: this.selectedElement
        }
      },
      skip() {
        return !this.selectedElement
      },
      error(error) {
        console.log(' cmsItem Apollo error hook')

        this.$store.commit('errors/addError', {
          description: error.message,
          step: 'getCmsContent'
        })
      },

      result(data) {
        console.log(' cmsItem Apollo result hook')
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
        this.$store.commit('errors/addError', {
          description: error.message,
          step: 'getCmsContentSchema'
        })
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      watchLoading(isLoading, countModifier) {
        console.log('watch hook contentSchema : ', isLoading, countModifier)
      }
    }
  }
}
</script>
