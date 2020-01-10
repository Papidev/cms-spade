<template>
  <div>
    <h1 v-if="!selectedElement">
      Non hai selezionato nulla 😢
    </h1>

    <error-panel :errors="errors"></error-panel>
    <!-- <progress-panel :datasources="datasources"></progress-panel> -->

    <form action="" method="post">
      <div v-for="(propValue, name) in schemaFieldsList" :key="name">
        <wrapper-input
          :label="propValue.name"
          :content="cleanedMergedItem[propValue.name]"
        />
      </div>

      <client-only placeholder="Loading markdown-editor">
        <new-markdown-editor
          v-model="textareaContent"
          :source="textAreaSource"
        />
      </client-only>
      <input type="submit" value="Submit" @click="submit" />
    </form>
  </div>
</template>

<script>
import wtf from 'wtf_wikipedia'
import { mapState } from 'vuex'
import helpersFunctions from '~/mixins/helpersFunctions.js'
import { CMS, WIKI } from '~/constants/'
import { placesByName } from '~/apollo/cms/queries/place/places'
import { schemaIntrospection } from '~/apollo/cms/queries/schemas'

export default {
  components: {
    'wrapper-input': () => import('~/components/WrapperInput.vue'),
    'new-markdown-editor': () => import('~/components/MarkdownEditor.vue'),
    'error-panel': () => import('~/components/ErrorPanel.vue') //,
    //'progress-panel': () => import('~/components/ProgressPanel.vue')
  },

  mixins: [helpersFunctions],

  data() {
    return {
      errors: []

      // TODO : dynamically create this object on mount
      // datasources: [
      //   contentSchema: {
      //     item: {},
      //     loading: this.contentSchemaLoading
      //   },
      //   wiki: {
      //     item: {},
      //     loading: false
      //   },
      //   cms: {
      //     item: {},
      //     loading: this.cmsItemLoading
      //   }
      // ]
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language']),

    wikiItem: {
      get: function() {
        // return this.datasources.wiki.item
        return true
      },
      set: function(newValue) {
        console.log(newValue)
        // this.datasources.wiki.item = newValue
      }
    },

    cmsItem: {
      get: function() {
        return true
        //return this.datasources.cms.item
      },
      set: function(newValue) {
        console.log(newValue)
        //this.datasources.cms.item = newValue
      }
    },
    contentSchema: {
      get: function() {
        return true
        //return this.datasources.contentSchema.item
      },
      set: function(newValue) {
        console.log(newValue)
        //this.datasources.contentSchema.item = newValue
      }
    },

    contentSchemaLoading() {
      return this.$apollo.queries
        ? this.$apollo.queries.contentSchema.loading
        : false
    },

    cmsItemLoading() {
      return this.$apollo.queries ? this.$apollo.queries.cmsItem.loading : false
    },

    schemaFieldsList() {
      // content type schema
      return this.contentSchema ? this.contentSchema.fields : []
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
    },

    mergedItem() {
      if (
        !this.selectedElement ||
        !this.contentSchema ||
        //  this.datasources.wiki.loading ||
        this.cmsItemLoading
      ) {
        console.log('mergedItem aborting')
        return {}
      }

      console.log('mergedItem executing')
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
    }
  },

  watch: {
    async selectedElement() {
      await this.getDataWiki(this.selectedElement, this.language)
    }
  },

  methods: {
    toggleLoading(source) {
      console.log('toggleLoading iniziato')

      source.loading = !source.loading
      console.log('toggleLoading completato')
    },
    onErrorShown(toDeleteKey) {
      console.log('toDeleteKey', toDeleteKey)
      console.dir(this.errors[toDeleteKey])
      //   this.errors.splice(toDeleteKey, 1)
    },
    async submit() {},

    async getDataWiki(name, language) {
      console.log('getDataWiki ci prova')
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
