/* eslint-disable no-prototype-builtins */ /* eslint-disable
no-prototype-builtins */
<template>
  <section class="flex flex-row bg-gray-200 w-screen">
    <panel-data
      :content-items="contentItems"
      class="w-auto px-4 py-2 m-2"
      @descriptionFound="setItemDescription"
    >
    </panel-data>

    <client-only placeholder="Loading panel-writing">
      <panel-writing
        v-model="itemDescription.value"
        class="w-auto px-4 py-2 m-2"
        :source="itemDescription.source"
      ></panel-writing>
    </client-only>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
//import helpersFunctions from '~/mixins/helpersFunctions.js'
import { CMS, WIKI } from '~/constants/'

import { placesByName } from '~/apollo/cms/queries/place/places'

import wtf from 'wtf_wikipedia'

export default {
  components: {
    'panel-data': () => import('~/components/PanelData.vue'),
    'panel-writing': () => import('~/components/PanelWritingArea.vue')
  },
  //mixins: [helpersFunctions],

  data() {
    return {
      cmsData: {},
      wikiItem: {},
      itemDescription: {}
    }
  },

  computed: {
    ...mapState(['selectedItem', 'language', 'selectedContentType']),
    ...mapState('datasources', ['sources']),

    contentItems() {
      return [this.cmsItem, this.wikiItem]
    },
    cmsItem() {
      return this.cmsData ? { ...this.cmsData[0], source: CMS } : {}
    }
  },
  watch: {
    async selectedItem() {
      await this.getDataWiki(this.selectedItem, this.language)
    }
  },

  methods: {
    ...mapActions(['errors/addError']),
    setItemDescription(descOccurrence) {
      if (descOccurrence[0]) {
        this.itemDescription = {
          value: descOccurrence[0].value || '',
          source: descOccurrence[0].source || CMS
        }
      }
    },

    async getDataWiki(name, language) {
      this.toggleLoading(WIKI, true)
      try {
        const content = await wtf.fetch(name, language)
        this.wikiItem = {
          name: name,
          description: content.text(),
          source: WIKI
        }
      } catch (error) {
        this.$store.dispatch('errors/addError', {
          description: error.message,
          step: 'getWikiContent'
        })

        return
      } finally {
        this.toggleLoading(WIKI, false)

        // this.createMergedItem(
        //   ['identifier', 'name', 'description'],
        //   [this.cmsItem, this.wikiItem]
        // )
      }
    },

    // merge "contentItems" depending on "schema"
    // createMergedItem(schema, contentItems) {
    //   let merged = {}

    //   // filter falsy values
    //   let cleanedContentItems = contentItems.filter(Boolean)

    //   for (const schemaField of schema) {
    //     let foundContentItem
    //     // cerco un contentItem che abbia schemaField non vuoto
    //     foundContentItem = cleanedContentItems.find((contentItem) =>
    //       // eslint-disable-next-line no-prototype-builtins
    //       contentItem.hasOwnProperty(schemaField)
    //     )

    //     //
    //     if (foundContentItem) {
    //       if (schemaField === 'description') {
    //         this.itemDescription.value = foundContentItem[schemaField]
    //         this.itemDescription.source = foundContentItem.source
    //       } else {
    //         merged[schemaField] = {
    //           value: foundContentItem[schemaField], // valore di schemaField dentro a content item che lo possiede
    //           source: foundContentItem.source // TO DO: fix this hardcoding
    //         }
    //       }
    //     }
    //   }

    //   this.itemInfo = merged
    // },

    toggleLoading(source, value) {
      this.$store.commit('datasources/setLoading', {
        source: source,
        loadingState: value
      })
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
        this.$store.dispatch('errors/addError', {
          description: error.message,
          step: 'getCmsContent'
        })
      },
      result() {
        // this.generateSchemaFieldsValues(this.contentItems, this.schemaFields)
      },

      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      watchLoading(isLoading) {
        this.toggleLoading(CMS, isLoading)
        if (!isLoading) {
          // this.createMergedItem(
          //   ['Identifier', 'Name', 'Description'],
          //   [this.cmsItem, this.wikiItem]
          // )
        }
      }
    }
  }
}
</script>
