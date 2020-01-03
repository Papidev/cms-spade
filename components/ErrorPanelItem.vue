<template>
  <div class="bg-red-200">
    {{ errorInfo.errorStep }} : {{ errorInfo.errorMessage }}
  </div>
</template>
<script>
export default {
  props: {
    errorId: {
      required: true,
      type: Number
    },
    errorInfo: {
      required: true,
      type: Object
    }
  },

  mounted() {
    //  this.$emit('errorShown', this.errorId)
  }
}
</script>
