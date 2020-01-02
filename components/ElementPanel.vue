<template>
  <div>
    <h1 v-if="!selectedElement">
      Non hai selezionato nulla 😢
    </h1>

    <form action="" method="post">
      <div
        v-for="(propValue, name, index) in cleanedMergedItem"
        :key="(propValue, name, index).index"
      >
        <wrapper-input :label="name" :content="propValue" />
      </div>
      <div v-if="$apollo.loading">Loading APOLLO...</div>
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
import placesQuery from '~/apollo/cms/queries/place/places'

export default {
  components: {
    'wrapper-input': () => import('~/components/WrapperInput.vue'),
    'new-markdown-editor': () => import('~/components/MarkdownEditor.vue')
  },

  mixins: [helpersFunctions],

  data() {
    return {
      cmsItem: {},
      wikiItem: {},
      wikiLoading: false
    }
  },

  computed: {
    ...mapState(['selectedElement']),
    ...mapState(['language']),

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
      if (!this.selectedElement || this.wikiLoading || this.cmsLoading) {
        console.log('mergedItem aborting')
        return {}
      }

      console.log('mergedItem executing')
      return this.mergeResultsProperties(
        ['Identifier', 'Name', 'Description'],
        this.cmsItem[0],
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

    async submit() {},

    async getDataWiki(name, language) {
      this.wikiLoading = true
      try {
        const content = await wtf.fetch(name, language)
        this.wikiItem.Name = name
        this.wikiItem.Description = content.text()
      } catch {
        return false
      } finally {
        this.wikiLoading = false
      }
    }
  },

  apollo: {
    cmsItem: {
      prefetch: false,
      query: placesQuery,

      variables() {
        return {
          name: this.selectedElement
        }
      },

      skip() {
        return this.cmsSkipQuery
      }
    }
  }
}
</script>
