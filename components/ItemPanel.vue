<template>
  <div class="flex flex-col">
    <h1 v-if="!selectedElement" class="px-4 py-2 m-2">
      Non hai selezionato nulla 😢
    </h1>

    <!-- <error-panel :errors="errors"></error-panel>
    <progress-panel :datasources="datasources"></progress-panel> -->

    <form action="" method="post" class="px-4 py-2 m-2">
      <div v-for="(propValue, name) in schemaFields" :key="name">
        <wrapper-input
          :label="propValue.name"
          :content="cleanedMergedItem[propValue.name]"
        />
      </div>

      <!-- <client-only placeholder="Loading markdown-editor">
        <new-markdown-editor
          v-model="textareaContent"
          :source="textAreaSource"
        />
      </client-only> -->
      <!-- <input type="submit" value="Submit" @click="submit" /> -->
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { CMS, WIKI } from '~/constants/'

export default {
  components: {
    'wrapper-input': () => import('~/components/WrapperInput.vue')
    // 'new-markdown-editor': () => import('~/components/MarkdownEditor.vue'),
    // 'error-panel': () => import('~/components/ErrorPanel.vue') //,
    //'progress-panel': () => import('~/components/ProgressPanel.vue')
  },

  props: {
    schemaFields: {
      type: Array,
      default: () => {
        return []
      }
    },
    cleanedMergedItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  // data() {
  //   return {
  //     errors: [],
  //     cmsItem: null,
  //     wikiItem: null,
  //     contentSchema: null
  //   }
  // },

  computed: {
    ...mapState(['selectedElement'])
    // ...mapState(['language']),

    // contentSchemaLoading() {
    //   return this.$apollo.queries
    //     ? this.$apollo.queries.contentSchema.loading
    //     : false
    // },

    // cmsItemLoading() {
    //   return this.$apollo.queries ? this.$apollo.queries.cmsItem.loading : false
    // },

    // schemaFieldsList() {
    //   // content type schema
    //   return this.contentSchema ? this.contentSchema.fields : []
    // },

    // mergedItem() {
    //   if (
    //     !this.selectedElement ||
    //     !this.contentSchema ||
    //     //  this.datasources.wiki.loading ||
    //     this.cmsItemLoading
    //   ) {
    //     return {}
    //   }

    //   return this.mergeResultsProperties(
    //     ['Identifier', 'Name', 'Description'],
    //     this.cmsItem ? this.cmsItem[0] : {},
    //     this.wikiItem,
    //     CMS,
    //     WIKI
    //   )
    // },
  }

  // watch: {
  //   async selectedElement() {
  //     await this.getDataWiki(this.selectedElement, this.language)
  //   }
  // },

  // methods: {
  //   toggleLoading(source) {
  //     source.loading = !source.loading
  //   },
  //   // onErrorShown(toDeleteKey) {
  //   //   //   this.errors.splice(toDeleteKey, 1)
  //   // },
  //   async submit() {},

  //   async getDataWiki(name, language) {
  //     // this.toggleLoading(this.datasources.wiki, true)

  //     try {
  //       const content = await wtf.fetch(name, language)
  //       this.wikiItem.Name = name
  //       this.wikiItem.Description = content.text()
  //     } catch (error) {
  //       this.pushError(this.errors, error.message, 'getWikiContent')
  //       return false
  //     } finally {
  //       //this.toggleLoading(this.datasources.wiki, false)
  //     }
  //   },

  //   pushError(errorStore, errorMessage, errorStep) {
  //     let newError = {}
  //     newError.description = errorMessage
  //     newError.step = errorStep
  //     newError.DateTime = this.getCurrentDateTime()
  //     errorStore.push(newError)
  //   }
  // },

  // apollo: {
  //   cmsItem: {
  //     prefetch: false,
  //     query: placesByName,

  //     variables() {
  //       return {
  //         name: this.selectedElement
  //       }
  //     },

  //     skip() {
  //       return !this.selectedElement
  //     },
  //     error(error) {
  //       this.pushError(this.errors, error.message, 'getCmsContent')
  //     }
  //   },
  //   contentSchema: {
  //     prefetch: true,
  //     query: schemaIntrospection,

  //     variables() {
  //       return {
  //         name: 'Place' //TODO: make input dynamic when content type will be selectable
  //       }
  //     },
  //     error(error) {
  //       this.pushError(this.errors, error.message, 'getCmsContentSchema')
  //     }
  //   }
  // }
}
</script>
