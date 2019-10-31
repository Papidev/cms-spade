<template>
  <div>
    <textarea
      id="my-text-area"
      ref="mytextarea"
    />
  </div>
</template>


<script>
import EasyMDE from 'easymde'

let easyMDE = {}

export default {
  props: {
    value: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      // easyMDE: {}
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
