<template>
  <div>
    <!--  <sidebar-menu :menu="menu" :collapsed="true" :rtl="true" /> -->
    <div class="w-1/5">
      <Multiselect
        v-if="filteredContentTypes"
        v-model="selectedContentType"
        :options="filteredContentTypes"
        :searchable="false"
        :close-on-select="true"
        :show-labels="false"
        :allow-empty="false"
        placeholder="Pick a ContentType"
        track-by="name"
        label="name"
      ></Multiselect>
    </div>
    <nuxt />
  </div>
</template>
<script>
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Multiselect from 'vue-multiselect'
import { mapState } from 'vuex'
import { allSchemaTypes } from '~/apollo/cms/queries/schema'
import CMS_MYTYPES_PREFIX from '~/constants/cms'

export default {
  components: {
    Multiselect
  },

  data() {
    return {
      menu: this.$store.state.datasources.datasources.sources,
      selectedContentType: null,
      contentTypes: []
    }
  },
  computed: {
    ...mapState(['datasources']),

    filteredContentTypes() {
      if (this.contentTypes) {
        let castedToArrayTypes = Array.from(this.contentTypes.types)
        let filteredArrayTypes = castedToArrayTypes.filter((item) =>
          item.description.startsWith(CMS_MYTYPES_PREFIX)
        )
        return filteredArrayTypes
      } else {
        return []
      }
    }
  },
  apollo: {
    contentTypes: {
      prefetch: true,
      query: allSchemaTypes,
      error(error) {
        console.log(' contentTypes :  Apollo error hook', error)
        this.$store.commit('errors/addError', {
          description: error.message,
          step: 'getContentTypes'
        })
      },

      result(data) {
        console.log(' contentTypes :  Apollo result hook')
        console.log(this.contentTypes)
        console.log(data)
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache'
    }
  }
}
</script>
