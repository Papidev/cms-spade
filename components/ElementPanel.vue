<template>
  <div>
    <h1 v-if="!selectedElement">
      Non hai selezionato nulla 😢
    </h1>

    <error-panel :errors="errors"></error-panel>

    <form action="" method="post">
      <div v-for="(propValue, name) in panelFieldList" :key="name">
        <wrapper-input
          :label="propValue.name"
          :content="cleanedMergedItem[propValue.name]"
        />
      </div>
      <div v-if="cmsLoading">Loading content from CMS...</div>

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
    'error-panel': () => import('~/components/ErrorPanel.vue')
  },

  mixins: [helpersFunctions],

  data() {
    return {
      cmsContentSchema: null,
      cmsItem: {},
      wikiItem: {},
      wikiLoading: false,
      errors: []
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language']),

    panelFieldList() {
      return this.cmsContentSchema ? this.cmsContentSchema.fields : []
    },
    textAreaSource() {
      if (this.mergedItem) {
        return this.mergedItem.Description
          ? this.mergedItem.Description.source
          : ''
      } else return ''
    },

    cmsSkipQuery() {
      return !this.selectedElement
    },

    cmsLoading() {
      return this.$apollo.queries.cmsItem.loading
    },
    mergedItem() {
      console.log(`mergedItem ${this.wikiLoading} ${this.cmsLoading}`)
      if (
        !this.selectedElement ||
        !this.cmsContentSchema ||
        this.wikiLoading ||
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
    // triggerCmsQuery() {
    //   this.cmsSkipQuery = false
    // },
    onErrorShown(toDeleteKey) {
      console.log('toDeleteKey', toDeleteKey)
      console.dir(this.errors[toDeleteKey])
      //   this.errors.splice(toDeleteKey, 1)
    },
    async submit() {},

    async getDataWiki(name, language) {
      this.wikiLoading = true
      try {
        const content = await wtf.fetch(name, language)
        this.wikiItem.Name = name
        this.wikiItem.Description = content.text()
      } catch (error) {
        this.pushError(JSON.stringify(error.message), 'getWikiContent')
        return false
      } finally {
        this.wikiLoading = false
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
