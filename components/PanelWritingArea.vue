<template>
  <div :class="computedClasses">
    <textarea ref="mytextarea" />
  </div>
</template>

<script>
import EasyMDE from 'easymde'
import { CMS, WIKI } from '~/constants/'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    source: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      easyMDE: {}
    }
  },
  computed: {
    computedClasses() {
      switch (this.source) {
        case CMS:
          return 'input-cms'
        case WIKI:
          return 'input-wiki'
        default:
          return ''
      }
    }
  },
  watch: {
    value(newValue) {
      this.easyMDE.value(newValue)
    }
  },

  mounted() {
    this.easyMDE = new EasyMDE({
      autofocus: true,
      element: this.$refs.mytextarea,
      autosave: {
        enabled: false,
        uniqueId: 'MyMDE'
      },
      minHeight: '700px',
      spellChecker: false,
      placeholder: 'Add Description'
    })
  }
}
</script>
