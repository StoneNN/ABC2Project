<template>
  <div>
    <div>
      <a-button v-if="buttons.create" @click="onClickNew"> 创建 </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="records"
      rowKey="id"
      :customRow="tableCustomRow"
    >
    </a-table>
  </div>
</template>

<script>
import treeMixin from '@/mixins/treeMixin'

export default {
  name: 'TreeView',
  components: {},
  mixins: [treeMixin],

  props: {},

  data() {
    return {}
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {
    // // eslint-disable-next-line no-unused-vars
    // handleTableChange(pagination, filters, sorter) {
    //   // console.log(pagination, filters, sorter)
    //   const page = pagination.current
    //   this.handlePageChange(page)
    // },

    tableCustomRow(record) {
      const that = this
      return {
        // props: {
        //   xxx... //属性
        // },
        on: {
          // 事件
          // eslint-disable-next-line no-unused-vars
          click: event => {
            // console.log(record, event)
            that.handleOnRowClick(record)
          } // 点击行
        }
      }
    }
  }
}
</script>

<style type="text/css"></style>
