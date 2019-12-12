<template>
  <div>
    {{ label }}
    <input v-model="content.value">
  </div>
</template>
<script>
//  {{ name }} --> {{ propValue.value }}   {{ propValue.source }}
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
  }
}
</script>