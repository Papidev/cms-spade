<template>
  <div>
    <app-header />
    <Nuxt />
    <app-error />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Error from '~/components/ErrorPanel.vue'

export default {
  components: {
    'app-header': Header,
    'app-error': Error
  }
}
</script>

<style></style>
