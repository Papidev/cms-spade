<template>
  <div :class="inputWrapperClasses">
    <div>
      <label>{{ label }}</label>
    </div>
    <input
      v-model="defaultContent.value"
      :class="inputClasses"
      placeholder="edit me"
    />
  </div>
</template>

<script>
import { CMS, WIKI } from '~/constants/'

export default {
  props: {
    label: {
      required: true,
      type: String
    },
    // eslint-disable-next-line vue/require-default-prop
    content: {
      type: Object
      //defautl: ()=>{return {value: ''}}
    }
  },
  computed: {
    defaultContent() {
      if (this.content) return this.content
      else return { value: '', source: CMS }
    },

    inputClasses() {
      if (this.defaultContent.source === CMS) {
        return ['input', 'input-cms']
      } else if (this.defaultContent.source === WIKI)
        return ['input', 'input-wiki']
      else return ''
    },

    inputWrapperClasses() {
      if (this.defaultContent.source === CMS) {
        return 'input-cms-wrapper '
      } else if (this.defaultContent.source === WIKI) {
        return 'input-wiki-wrapper'
      } else return ''
    }
  }
}
</script>
