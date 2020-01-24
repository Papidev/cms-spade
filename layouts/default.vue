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
//import { SidebarMenu } from 'vue-sidebar-menu'
//import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Multiselect from 'vue-multiselect'
import CMS_MYTYPES_PREFIX from '~/constants/cms'
import { mapState } from 'vuex'
import { allSchemaTypes } from '~/apollo/cms/queries/schema'

export default {
  components: {
    //  'sidebar-menu': SidebarMenu
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
        console.log(' contentTypes :  Apollo error hook')
        this.pushError(this.errors, error.message, 'getContentTypes')
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

<style>
/* html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
} */
</style>
