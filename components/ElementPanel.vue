<template>
  <div>
    <h1 v-if="!selectedElement">
      Non hai selezionato nulla 😢
    </h1>

    <error-panel :errors="errors"></error-panel>
    <progress-panel msg="CmsLoading"></progress-panel>

    <form action="" method="post">
      <div v-for="(propValue, name) in panelFieldList" :key="name">
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
    'error-panel': () => import('~/components/ErrorPanel.vue'),
    'progress-panel': () => import('~/components/ProgressPanel.vue')
  },

  mixins: [helpersFunctions],

  data() {
    return {
      cmsContentSchema: null,
      // cmsItem: null,
      errors: [],
      datasources: {
        // TODO : dynamically create this object on mount
        wiki: {
          item: {},
          loading: false
        },
        cms: {
          item: {},
          loading: false
        }
      }
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language']),

    wikiItem() {
      return this.datasources.wiki.item
    },

    panelFieldList() {
      // content type schema
      return this.cmsContentSchema ? this.cmsContentSchema.fields : []
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

    cmsSkipQuery() {
      return !this.selectedElement
    },

    cmsLoading() {
      return (
        this.$apollo.queries.cmsItem.loading ||
        this.$apollo.queries.cmsContentSchema.loading
      )
    },

    mergedItem() {
      if (
        !this.selectedElement ||
        !this.cmsContentSchema ||
        this.datasources.wiki.loading ||
        this.cmsLoading
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
    },

    cmsItem: {
      // getter
      get: function() {
        return this.datasources.wiki.item
      },
      // setter
      set: function(newValue) {
        this.datasources.wiki.item = newValue
      }
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
      //this.toggleLoading(this.datasources.wiki, true)

      try {
        const content = await wtf.fetch(name, language)
        this.wikiItem.Name = name
        this.wikiItem.Description = content.text()
      } catch (error) {
        this.pushError(JSON.stringify(error.message), 'getWikiContent')
        return false
      } finally {
        this.toggleLoading(this.datasources.wiki, false)
      }
    },
    pushError(errorMessage, errorStep) {
      this.errors.push({
        errorMessage: JSON.stringify(errorMessage),
        errorStep: errorStep
      })
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
        return this.cmsSkipQuery
      },
      error(error) {
        this.pushError(JSON.stringify(error.message), 'getCmsContent')
      }
    },
    cmsContentSchema: {
      prefetch: true,
      query: schemaIntrospection,

      variables() {
        return {
          name: 'Place' //TODO: make input dynamic when content type will be selectable
        }
      },
      error(error) {
        this.pushError(error.message, 'getCmsContentSchema')
      }
    }
  }
}
</script>
