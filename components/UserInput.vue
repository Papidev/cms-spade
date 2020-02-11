<template>
  <div>
    <Carousel
      :per-page="1"
      :navigate-to="someLocalProperty"
      :mouse-drag="false"
    >
      <Slide>
        Slide 1 Content
      </Slide>
      <Slide>
        Slide 2 Content
      </Slide>
    </Carousel>
    <div :class="inputWrapperClasses">
      <div>
        <label>{{ label }}</label>
      </div>
      <input
        v-model="content.value"
        :class="inputClasses"
        placeholder="edit me"
      />
    </div>
  </div>
</template>

<script>
import { CMS, WIKI } from '~/constants/'
import { Carousel, Slide } from 'vue-carousel'

export default {
  components: {
    Carousel,
    Slide
  },
  props: {
    label: {
      required: true,
      type: String
    },

    content: {
      type: Object,
      default: function() {
        return this.content ? this.content : { value: '', source: CMS }
      }
    }
  },
  computed: {
    // defaultContent() {
    //   if (this.content) return this.content
    //   else return { value: '', source: CMS }
    // },

    inputClasses() {
      switch (this.content.source) {
        case CMS:
          return ['input', 'input-cms']
        case WIKI:
          return ['input', 'input-wiki']
        default:
          return ''
      }
    },

    inputWrapperClasses() {
      switch (this.content.source) {
        case CMS:
          return 'input-cms-wrapper '
        case WIKI:
          return 'input-wiki-wrapper'
        default:
          return ''
      }
    }
  }
}
</script>
