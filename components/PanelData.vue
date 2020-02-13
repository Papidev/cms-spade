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
          <Slide v-for="(currentOccurrence, index) in f(field)" :key="index">
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
import { mapState } from 'vuex'
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
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    items: {
      // array of items [cmsItem,wikiItem,jsonItem]
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data: function() {
    return {
      contentSchema: {},
      ignoredSchemaFields: ['_id', 'id', 'createdAt', 'updatedAt'],
      pappo: []
      // schemaFields: []
    }
  },

  computed: {
    ...mapState(['selectedContentType']),

    schemaFields() {
      if (this.contentSchema) {
        let allfields = this.getProp(this.contentSchema, 'fields')

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
    items: function(newItems) {
      this.pppp(newItems, this.schemaFields)
    }
  },

  methods: {
    f(propvalue) {
      console.log('partito f')
      let found = this.pappo.find((item) => item.name === propvalue)

      if (found && found.occurrences.length > 0) {
        return found.occurrences
      } else {
        return [{ value: '', source: CMS }]
      }
    },

    pppp(items, schemaFields) {
      console.log('start generazione Pappo')
      let resultArray = []
      for (let field of schemaFields) {
        let occurrArray = []
        for (const item of items) {
          if (item[field])
            occurrArray.push({ value: item[field], source: item.source })
        }

        resultArray.push({ name: field, occurrences: occurrArray })
      }
      this.pappo = resultArray
      console.log('modificato pappo')
    }
  },

  apollo: {
    contentSchema: {
      prefetch: true,
      query: schemaIntrospection,
      variables() {
        return {
          name: this.selectedContentType.name || ''
        }
      },
      error(error) {
        this.addError(error.message, 'getCmsContentSchema')
      },
      result() {
        this.pppp(this.items, this.schemaFields)
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache'
    }
  }
}
</script>
