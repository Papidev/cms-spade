<template>
  <div class="flex flex-col">
    <div v-if="selectedContentType">
      <div
        v-for="(propValue, name) in schemaFields"
        :key="name"
        class="px-4 py-2 m-2"
      >
        <Carousel
          :per-page="1"
          :mouse-drag="false"
          :navigation-enabled="true"
          :pagination-enabled="false"
        >
          <Slide
            v-for="(currentOccurrence, index) in f(propValue.name)"
            :key="index"
          >
            <user-input
              :label="propValue.name"
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
      ignoredSchemaFields: ['_id', 'id', 'createdAt', 'updatedAt']
      // schemaFields: []
    }
  },

  computed: {
    ...mapState(['selectedContentType']),

    schemaFields() {
      if (this.contentSchema) {
        let allfields = this.getProp(this.contentSchema, 'fields')

        return allfields.filter(
          (field) => !this.ignoredSchemaFields.includes(field.name)
        )
      } else {
        return []
      }
    }
  },

  methods: {
    f(propvalue) {
      console.log('propvalue', propvalue)
      let found = this.items.find((item) => item.name === propvalue)
      if (found) {
        console.log('found.occurrences', found.occurrences)
        return found.occurrences
      } else return []
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
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache'
    }
  }
}
</script>
