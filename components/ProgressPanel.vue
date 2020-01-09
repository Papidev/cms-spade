<template>
  <div class="bg-blue-400">
    <div v-for="(source, index) in datasources" :key="index">
      {{ index }} : {{ source.loading }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datasources: {
      required: true,
      type: Object
    }
  }
}
</script>
