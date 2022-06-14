import api from '@/odoorpc'

export default {
  components: {},
  mixins: [],
  props: {},

  data() {
    return {
      treeview: undefined, // 对象, 接口函数的入口
      fields: {}, // 模型的字段信息
      buttons: {}, // 控制按钮显示和隐藏

      records: [] // 列表页面的数据
    }
  },
  computed: {
    // table 的 列
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

      const fields = this.fields
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
    }

    // rowSelection() {
    //   return {
    //     selectedRowKeys: this.activeIdsWithGroupby,
    //     onChange: (selectedRowKeys, selectedRows) => {
    //       this.handleOnRowSelect(selectedRowKeys, selectedRows)
    //     }
    //   }
    // }
  },

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

  created() {},

  mounted() {
    this.init()
  },

  methods: {
    async init() {
      //
      const query = this.$route.query
      const { action: actionId } = query

      const treeview = api.env.treeview(actionId)
      this.treeview = treeview
      this.buttons = treeview.buttons
      this.fields = await treeview.load_fields()
      this.records = await treeview.search_read()
    },

    // 新增按钮触发
    onClickNew() {
      const { action: actionId } = this.$route.query
      const query = { action: actionId, view_type: 'form' }
      const path = this.$route.path
      this.$router.push({ path, query })
    },

    // 行点击事件触发
    async handleOnRowClick(row) {
      const { action: actionId } = this.$route.query
      const query = { action: actionId, view_type: 'form', id: row.id }
      const path = this.$route.path
      this.$router.push({ path, query })
    },

    asdasdas() {
      // this.treeview.searchxxxxxxxx()
    }
  }
}
