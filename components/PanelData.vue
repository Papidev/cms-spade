<template>
  <div class="flex flex-col">
    <div v-if="!selectedElement" class="px-4 py-2 m-2">
      <h1>
        Non hai selezionato nulla 😢
      </h1>
    </div>
    <div
      v-for="(propValue, name) in schemaFields"
      v-else
      :key="name"
      class="px-4 py-2 m-2"
    >
      <user-input
        :label="propValue.name"
        :content="cleanedMergedItem[propValue.name]"
      />
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
    cleanedMergedItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  computed: {
    ...mapState(['selectedElement'])
  }
}
</script>
