<template>
  <div :class="inputWrapperClasses">
    <div>{{ label }}</div>
    <input
      v-model="content.value"
      :class="inputClasses"
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
    inputClasses() {
      if (this.content.source === CMS) {
        return ['input', 'input-cms']
      } else if (this.content.source === WIKIPEDIA)
        return ['input', 'input-wiki']
      else return ''
    },

    inputWrapperClasses() {
      if (this.content.source === CMS) {
        return 'input-cms-wrapper '
      } else if (this.content.source === WIKIPEDIA) return 'input-wiki-wrapper'
      else return ''
    }
  }
}
</script>