<template>
  <div>
    <div v-for="(errorItem, index) of errors" :key="index">
      <error-panel-item
        :error-info="errorItem"
        :error-id="index"
      ></error-panel-item>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    'error-panel-item': () => import('~/components/ErrorPanelItem.vue')
  },
  computed: {
    errors() {
      return this.$store.state.errors.errors
    }
  }
}
</script>
