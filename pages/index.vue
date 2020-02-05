<template>
  <div class="flex flex-col bg-gray-400">
    <search-suggest class="px-4 py-2 m-2" />
    <panel class="px-4 py-2 m-2" />
  </div>
</template>

<script>
export default {
  components: {
    'search-suggest': () => import('~/components/Searcher.vue'),
    panel: () => import('~/components/Panel.vue')
  }
}
</script>
