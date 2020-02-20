<template>
  <div class="flex flex-col">
    <div v-if="selectedContentType">
      <div
        v-for="(field, key) of schemaFields"
        :key="key"
        class="px-4 py-2 m-2"
      >
        <Carousel
          :per-page="1"
          :mouse-drag="false"
          :navigation-enabled="true"
          :pagination-enabled="false"
        >
          <Slide
            v-for="(currentOccurrence, index) in getOccurrences(field)"
            :key="index"
          >
            <user-input
              :label="field"
              :content="{
                value: currentOccurrence.value,
                source: currentOccurrence.source
              }"
            />
          </Slide>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { schemaIntrospection } from '~/apollo/cms/queries/schema'
import helpersFunctions from '~/mixins/helpersFunctions.js'
import { Carousel, Slide } from 'vue-carousel'
import { CMS } from '~/constants/'
export default {
  components: {
    'user-input': () => import('~/components/UserInput.vue'),
    Carousel,
    Slide
  },

  mixins: [helpersFunctions],

  props: {
    // item: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // },
    contentItems: {
      // array of contentItems [cmsItem,wikiItem,jsonItem]
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data: function() {
    return {
      contentTypeSchema: {},
      ignoredSchemaFields: ['_id', 'id', 'createdAt', 'updatedAt'],
      schemaFieldsOccurrences: []
      // schemaFields: []
    }
  },

  computed: {
    ...mapState(['selectedContentType']),

    schemaFields() {
      if (this.contentTypeSchema) {
        let allfields = this.getProp(this.contentTypeSchema, 'fields')

        allfields = allfields.filter(
          (field) => !this.ignoredSchemaFields.includes(field.name)
        )

        return allfields.map((item) => item.name.toLowerCase())
      } else {
        return []
      }
    }
  },
  watch: {
    contentItems: function(newItems) {
      this.generateSchemaFieldsValues(newItems, this.schemaFields)
    }
  },

  methods: {
    ...mapActions(['errors/addError']),
    getOccurrences(propvalue) {
      console.log('partito getOccurrences')

      let found = this.schemaFieldsOccurrences.find(
        (item) => item.name === propvalue
      )

      if (found) {
        if (propvalue === 'description') {
          this.$emit('descriptionFound', found.occurrences)
          return []
        }
        if (found.occurrences.length > 0) {
          return found.occurrences
        } else {
          return [{ value: '', source: CMS }]
        }
      }
    },

    generateSchemaFieldsValues(contentItems, schemaFields) {
      console.log('start generazione schemaFieldsOccurrences')
      let resultArray = []
      for (let field of schemaFields) {
        let occurrArray = []
        for (const item of contentItems) {
          if (item[field])
            occurrArray.push({ value: item[field], source: item.source })
        }

        resultArray.push({ name: field, occurrences: occurrArray })
      }
      this.schemaFieldsOccurrences = resultArray
      console.log('modificato schemaFieldsOccurrences')
    }
  },

  apollo: {
    contentTypeSchema: {
      prefetch: true,
      query: schemaIntrospection,
      variables() {
        return {
          name: this.selectedContentType.name || ''
        }
      },
      error(error) {
        this.$store.dispatch('errors/addError', {
          description: error.message,
          step: 'getCmsContentSchema'
        })
      },
      result() {
        this.generateSchemaFieldsValues(this.contentItems, this.schemaFields)
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache'
    }
  }
}
</script>
