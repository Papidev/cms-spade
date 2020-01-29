<template>
  <div>
    <div class="w-1/5">
      <multiselect
        v-if="myContentTypes"
        v-model="this.$store.state.currentContentType"
        :options="myContentTypes"
        :searchable="false"
        :close-on-select="true"
        :show-labels="false"
        :allow-empty="false"
        placeholder="Pick a ContentType"
        track-by="name"
        label="name"
      ></multiselect>
    </div>
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
    multiselect: Multiselect
  },

  data() {
    return {
     // selectedContentType: null,
      contentTypes: []
    }
  },
  computed: {
    ...mapState(['datasources']),

    myContentTypes() {
      if (this.contentTypes) {
        let arrayTypes = Array.from(this.contentTypes.types)
        let filteredArrayTypes = arrayTypes.filter((item) =>
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
        console.log(' contentTypes :  Apollo error ', error)
        this.$store.commit('errors/addError', {
          description: error.message,
          step: 'getContentTypes'
        })
          // this.contentTypes = [{description : 'MyDummy'}]
          // console.log(this.contentTypes)
      },

      // result(data) {
      //   console.log(' contentTypes :  Apollo result hook')
      //   console.log(this.contentTypes)
      //   console.log(data)
      // },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache'
    }
  }
}
</script>
