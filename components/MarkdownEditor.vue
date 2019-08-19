<template>
  <div>
    <textarea id="my-text-area"></textarea>
  </div>
</template>

<script>
import EasyMDE from 'easymde'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: {
    value: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      easyMDE: ''
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
      element: document.getElementById('my-text-area'),
      autosave: {
        enabled: true,
        uniqueId: 'MyMDE'
      },
      minHeight: '700px',
      spellChecker: false
    })

    /* this.easyMDE.codemirror.on('inputRead', () => {
      this.$emit('input', this.easyMDE.value())
    }) */
  },
  methods: {}
}
</script>
