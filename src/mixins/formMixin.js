import api from '@/odoorpc'

// eslint-disable-next-line no-unused-vars
const cp = val => JSON.parse(JSON.stringify(val))

export default {
  components: {},
  mixins: [],
  props: {},

  data() {
    return {
      formview: undefined, // 对象, 接口函数的入口
      viewInfo: {},
      fields: {}, // 模型的字段信息
      buttons: {}, // 控制按钮显示和隐藏

      res_id: undefined,
      record: {},
      values: {},

      formValues: {}, // 编辑页面用
      editable: false // 编辑状态
    }
  },
  computed: {
    dataInfo() {
      return { record: this.record, values: this.values }
    }
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
      const { action: actionId, id: res_id1 } = query

      const res_id = res_id1 ? Number(res_id1) : undefined
      this.res_id = res_id

      this.editable = false

      const formview = api.env.formview(actionId)
      this.formview = formview
      this.buttons = formview.buttons
      this.fields = await formview.load_fields()
      this.viewInfo = formview.view_info

      if (res_id) {
        const record = await formview.read(res_id)
        this.record = record
        this.values = {}
        this.editable = false
      } else {
        const dataInfo = await formview.onchange_new()
        const { values } = dataInfo
        this.formValues = values
        this.record = {}
        this.values = values
        this.editable = true
      }
    },

    async set_editable() {
      this.formValues = this.formview.set_editable(this.record)
      this.values = {}
    },

    set_not_editable() {
      this.formValues = {}
      this.values = {}
    },

    // 任何字段 change时 触发
    async handleChange(fname, value) {
      // console.log('handleChange', fname, value)

      this.formview.onchange(fname, value, result => {
        const { values = {} } = result
        this.values = values
        this.formValues = { ...this.formValues, ...values }
      })
    },

    async handelCommit() {
      // 回调函数, 返回 记录的 id.
      this.formview.commit(async res_id => {
        // console.log('onclickSubmit  cb', result)

        if (this.res_id) {
          const record = await this.formview.read(res_id)

          this.record = record
          this.values = {}
          this.editable = false
        } else {
          const { action: actionId } = this.$route.query
          const query = { action: actionId, view_type: 'form', id: res_id }
          const path = this.$route.path
          this.$router.replace({ path, query })
        }
      })
    },

    // 新增按钮触发
    async onClickNew() {
      const { action: actionId } = this.$route.query
      const query = { action: actionId, view_type: 'form' }
      const path = this.$route.path
      this.$router.push({ path, query })
    },

    // 删除按钮触发
    async onClickDel() {
      await this.formview.unlink(this.res_id)

      const { action: actionId } = this.$route.query
      const query = { action: actionId, view_type: 'tree' }
      const path = this.$route.path
      this.$router.replace({ path, query })
    },

    // 编辑按钮触发
    async onClickEdit() {
      this.set_editable()
      this.editable = true
    },

    // 取消按钮触发
    onClickCancel() {
      if (this.res_id) {
        this.editable = false
        this.set_not_editable()
      } else {
        // 新增页面 , 点击取消, 返回列表页面
        const { action: actionId } = this.$route.query
        const query = { action: actionId, view_type: 'tree' }
        const path = this.$route.path
        this.$router.replace({ path, query })
      }
    },

    // 保存按钮触发
    onClickSave() {
      //   console.log('onclickSubmit')

      this.handelCommit()
    }
  }
}
