export default {
  components: {},
  mixins: [],

  props: {
    width: { type: String, default: undefined },
    editable: { type: Boolean, default: false },
    value: { type: String, default: undefined },

    fieldInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },

    dataInfo: {
      type: Object,
      default: () => {
        return { record: {} }
      }
    }
  },
  data() {
    return {
      value_input: undefined
    }
  },
  computed: {
    value2: {
      get() {
        if (this.value_input === undefined) {
          return this.value_edit
        } else {
          return this.value_input
        }
      },
      set(val) {
        this.value_input = val
      }
    },

    record() {
      return this.dataInfo.record || {}
    },

    values() {
      return this.dataInfo.values || {}
    },

    fname() {
      return this.fieldInfo.name
    },

    widget() {
      return this.fieldInfo.widget
    },

    readonly() {
      return this.fieldInfo.readonly
    },

    value_readonly() {
      return this.record[this.fname]
    },

    value_edit() {
      // this.editable ?
      if (this.fname in this.values) return this.values[this.fname]
      else return this.value_readonly
    },

    value_display() {
      return this.value_edit
    },

    compute_style() {
      if (this.width) {
        return `width: ${this.width}`
      } else {
        return undefined
      }
    }
  },

  watch: {},

  async created() {},
  async mounted() {},

  methods: {
    async handleChange(value) {
      console.log('handleChange', this.fieldInfo.name, value)
      this.$emit('change', this.fieldInfo.name, value)
    }
  }
}
