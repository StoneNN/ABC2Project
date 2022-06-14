<template>
  <div>
    <div>
      {{ actionInfo.name }}
    </div>

    <div>
      <template v-if="viewType === 'tree'">
        <TreeView />
      </template>

      <template v-else-if="viewType === 'form'">
        <FormView />
      </template>

      <template v-else> todo:{{ viewType }}</template>
    </div>
  </div>
</template>

<script>
import api from '@/odoorpc'

import TreeView from '@/components/OView/TreeView.vue'
import FormView from '@/components/OView/FormView.vue'

export default {
  name: 'WebView',
  components: { TreeView, FormView },
  mixins: [],

  data() {
    return {
      actionInfo: {}, // action view info
      viewType: 'tree' // kanban/list/pivot/... view 切换
    }
  },

  computed: {},

  watch: {
    // 菜单切换时, 触发
    '$route.fullPath': {
      handler: function (/*val*/) {
        // console.log('in watch, $route.fullPath')
        // console.log('watch fullPath')
        this.init()
      },
      deep: true
    }
  },

  async created() {
    this.init()
  },

  mounted() {},

  methods: {
    init() {
      //
      const query = this.$route.query
      const { action: actionId, view_type: viewType } = query

      const action = api.env.action_info_get(actionId)

      this.actionInfo = action
      this.viewType = viewType

      // console.log(action)
    },

    onClickBreadcrumb(route) {
      //   console.log('onClickBreadcrumb', route)
      const { path, query } = route
      this.$router.push({ path, query })
    }
  }
}
</script>

<style type="text/css"></style>
