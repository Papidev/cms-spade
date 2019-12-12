<template>
  <div :class="computedClasses" >
    <textarea
      id="my-text-area"
      ref="mytextarea"
    />
  </div>
</template>


<script>
import EasyMDE from 'easymde'
import {
  CMS,
  WIKIPEDIA
} from '~/constants/'

let easyMDE = {}

export default {
  props: {
    value: {
      required: true,
      type: String
    },
    source:{
      required: true,
      type: String
    }

  },
  data() {
    return {
       
    }
  },

  watch: {
    value(newValue) {
      easyMDE.value(newValue)
    }
  },
  computed:{
    computedClasses() {
      return {
        "bg-red-600": this.source === CMS ,
        "bg-blue-600": this.source === WIKIPEDIA
      };
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
