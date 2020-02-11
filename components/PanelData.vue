<template>
  <div class="flex flex-col">
    <div v-if="selectedContentType">
      <div
        v-for="(propValue, name) in schemaFields"
        :key="name"
        class="px-4 py-2 m-2"
      >
        <user-input :label="propValue.name" :content="item[propValue.name]" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { schemaIntrospection } from '~/apollo/cms/queries/schema'
import helpersFunctions from '~/mixins/helpersFunctions.js'

export default {
  components: {
    'user-input': () => import('~/components/UserInput.vue')
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
