<template>
  <span>
    <div>
      <template v-if="editable && !readonly">
        <a-popconfirm
          v-if="rowEditchanged"
          ok-text="确认"
          cancel-text="取消"
          @confirm="handleOnCreateO2m"
        >
          <template slot="title">
            当前行已经编辑, <br />确认要放弃编辑, <br />创建一新行?
          </template>

          <a-button size="small">
            {{ fieldInfo.type === 'many2many' ? '添加' : '创建' }}
          </a-button>
        </a-popconfirm>

        <a-button v-else size="small" @click="handleOnCreateO2m">
          {{ fieldInfo.type === 'many2many' ? '添加' : '创建' }}
        </a-button>
      </template>
    </div>

    <a-table
      :columns="columns"
      :data-source="values_display"
      rowKey="id"
      :customRow="tableCustomRow"
    >
    </a-table>

    <template v-if="fieldInfo.type === 'many2many'"> // </template>

    <template v-else>
      <O2mForm
        ref="subForm"
        :editable="editable"
        :relationInfo="relationInfo"
        :parentViewInfo="parentViewInfo"
        :parentData="parentData"
      />
    </template>

    <!-- :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel" -->
  </span>
</template>

<script>
import api from '@/odoorpc'

import O2mForm from './O2mForm.vue'

export default {
  name: 'O2mTree',
  components: { O2mForm },
  mixins: [],
  props: {
    editable: { type: Boolean, default: false },
    relationInfo: { type: Object, default: undefined },
    records: { type: Array, default: () => [] },

    parentViewInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    parentData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      rowEditchanged: false,

      values: []
    }
  },
  computed: {
    relation() {
      if (this.relationInfo) {
        return api.env.relation(this.relationInfo, {
          parent: this.parentViewInfo
        })
      } else {
        return undefined
      }
    },

    fieldInfo() {
      return this.relationInfo || {}
    },

    readonly() {
      return this.fieldInfo.readonly
    },

    columns() {
      const get_render = (col, meta) => {
        if (meta.type === 'many2one') {
          // eslint-disable-next-line no-unused-vars
          return (value, row, index) => (value ? value[1] : '')
        }
        if (meta.type === 'selection') {
          const get_label = value => {
            const elm = meta.selection.find(item => item[0] === value)
            return elm ? elm[1] : ''
          }
          // eslint-disable-next-line no-unused-vars
          return (value, row, index) => (value ? get_label(value) : '')
        }
        return undefined
      }

      if (!this.relation) {
        return []
      }

      const fields = this.relation.tree.fields

      // const views = this.fieldInfo.views || {}
      // const { fields = {} } = views.tree || {}
      const cols = Object.keys(fields).map(fld => {
        const meta = fields[fld]
        const col = { dataIndex: fld, key: fld, title: meta.string }
        const render = get_render(fld, meta)
        if (render) {
          col.customRender = render
        }
        return col
      })
      return cols
    },

    values_display() {
      if (!this.relation) {
        return []
      }

      const vals = this.relation.tree.values_display(this.records, this.values)
      return vals
    }
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {
    async handleOnCreateO2m() {
      console.log('createO2m')

      this.$refs.subForm.handleCreate()
    },

    async handleOnRowClick(record) {
      console.log('handleOnRowClick')

      this.$refs.subForm.handleShowForm(record)
    },

    tableCustomRow(record) {
      return {
        // props: {
        //   xxx... //属性
        // },
        on: {
          // eslint-disable-next-line no-unused-vars
          click: event => {
            console.log(record)
            this.handleOnRowClick(record)
          } // 点击行
        }
      }
    }
  }
}
</script>

<style type="text/css"></style>
