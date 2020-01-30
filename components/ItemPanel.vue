<template>
  <div class="flex flex-col">
    <h1 v-if="!selectedElement" class="px-4 py-2 m-2">
      Non hai selezionato nulla 😢
    </h1>

    <!-- <progress-panel :datasources="datasources"></progress-panel> -->

    <form action="" method="post" class="px-4 py-2 m-2">
      <div v-for="(propValue, name) in schemaFields" :key="name">
        <user-input
          :label="propValue.name"
          :content="cleanedMergedItem[propValue.name]"
        />
      </div>
      <!-- </client-only> -->
      <!-- <input type="submit" value="Submit" @click="submit" /> -->
    </form>
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
