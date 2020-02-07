<template>
  <div class="flex flex-col">
    <div v-if="selectedContentType">
      <div
        v-for="(propValue, name) in schemaFields"
        :key="name"
        class="px-4 py-2 m-2"
      >
        <user-input :label="propValue.name" :content="Item[propValue.name]" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  components: {
    'user-input': () => import('~/components/UserInput.vue')
  },

  props: {
    schemaFields: {
      type: Array,
      default: () => {
        return []
      }
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  computed: {
    ...mapState(['selectedContentType'])
  }
}
</script>
