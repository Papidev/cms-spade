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
      cmsItem: null,
      wikiItem: null,
      contentSchema: null
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language']),
    ...mapState(['datasources/datasources/state/sources']),

    schemaFieldsList() {
      // content type schema
      return this.contentSchema ? this.contentSchema.fields : []
    },

    mergedItem() {
      if (
        !this.selectedElement ||
        !this.contentSchema ||
        this.sources.find((x) => x.source === WIKI).isLoading ||
        this.sources.find((x) => x.source === CMS).isLoading
      ) {
        return {}
      }

      return this.mergeResultsProperties(
        ['Identifier', 'Name', 'Description'],
        this.cmsItem ? this.cmsItem[0] : {},
        this.wikiItem,
        CMS,
        WIKI
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
  },
  watch: {
    async selectedElement() {
      await this.getDataWiki(this.selectedElement, this.language)
    }
  },

  methods: {
    toggleLoading(source) {
      source.isLoading = !source.isLoading
    },
    // onErrorShown(toDeleteKey) {
    //   //   this.errors.splice(toDeleteKey, 1)
    // },
    async submit() {},

    async getDataWiki(name, language) {
      // this.toggleLoading(this.datasources.wiki, true)

      try {
        const content = await wtf.fetch(name, language)
        this.wikiItem.Name = name
        this.wikiItem.Description = content.text()
      } catch (error) {
        this.pushError(this.errors, error.message, 'getWikiContent')
        return false
      } finally {
        //this.toggleLoading(this.datasources.wiki, false)
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
        this.pushError(this.errors, error.message, 'getCmsContent')
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
      }
    }
  }
}
</script>
