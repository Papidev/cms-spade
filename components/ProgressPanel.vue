<template>
  <div class="bg-blue-400">
    <div v-if="msg">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      required: false,
      default: '',
      type: String
    }
  }
}
</script>
