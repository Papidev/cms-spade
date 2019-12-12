<template>
  <div :class="computedClasses">
    <textarea
      id="my-text-area"
      ref="mytextarea"
    />
  </div>
</template>


<script>
import EasyMDE from 'easymde'
import { CMS, WIKIPEDIA } from '~/constants/'

let easyMDE = {}

export default {
  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
      // type: String
    },
    source: {
      required: true,
      type: String
    }
  },
  data() {
    return {}
  },
  computed: {
    computedClasses() {
      if (this.source === CMS) {
        return 'input-cms'
      } else if (this.source === WIKIPEDIA) return 'input-wiki'
      else return ''
    }
  },

  watch: {
    value(newValue) {
      easyMDE.value(newValue)
    }
  },

  mounted() {
    easyMDE = new EasyMDE({
      autofocus: true,
      element: this.$refs.mytextarea,
      autosave: {
        enabled: true,
        uniqueId: 'MyMDE'
      },
      minHeight: '700px',
      spellChecker: false
    })
  },
  methods: {}
}
</script>
