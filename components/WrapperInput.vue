<template>
  <div>
    {{ label }}
    <input
      v-model="content.value"
      :class="computedClasses"
    >
  </div>
</template>
<script>
import { CMS, WIKIPEDIA } from '~/constants/'

export default {
  props: {
    label: {
      required: true,
      type: String
    },
    content: {
      required: true,
      type: Object
    }
  },
  computed: {
    computedClasses() {
      if (this.content.source === CMS) {
        return 'input-cms'
      } else if (this.content.source === WIKIPEDIA) return 'input-wiki'
      else return ''
    }
  }
}
</script>