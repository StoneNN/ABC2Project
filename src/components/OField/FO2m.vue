<template>
  <span>
    <O2mTree
      :editable="editable"
      :relationInfo="relation && relation.field_info"
      :parentViewInfo="viewInfo"
      :records="subRecords"
      :parentData="{ record, values }"
    />
  </span>
</template>

<script>
import OFMixin from './OFMixin'

import api from '@/odoorpc'

import O2mTree from '@/components/OSubView/O2mTree.vue'

// eslint-disable-next-line no-unused-vars
const cp = val => JSON.parse(JSON.stringify(val))

const check_array_equ = (listA, listB) => {
  let result =
    listA.length === listB.length &&
    listA.every(a => listB.some(b => a === b)) &&
    listB.every(_b => listA.some(_a => _a === _b))

  return result
}

const tuples2ids = tuples => {
  const ids = tuples.reduce((acc, tup) => {
    const op = tup[0]
    if (op === 6) acc = [...tup[2]]
    return acc
  }, [])

  return ids
}

export default {
  name: 'FO2m',
  components: { O2mTree },
  mixins: [OFMixin],
  props: {
    value: { type: Array, default: () => [] },
    viewInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {
      relation: undefined,
      subRecords: []

      // value3: [],
      //
    }
  },
  computed: {
    value_readonly() {
      return this.record[this.fname] || []
    },

    dataLoadStatus() {
      if (!this.relation) return 'wait_relation_load'
      const ids = this.record[this.fname]
      if (!ids) return 'wait_parent_data'
      if (!ids.length) return 'need_not_load'
      const ids_loaded = this.subRecords.map(item => item.id)
      if (check_array_equ(ids, ids_loaded)) return 'loaded'
      else return 'toload'
    }
  },

  watch: {
    dataLoadStatus: {
      // eslint-disable-next-line no-unused-vars
      handler: function (newValue, oldValue) {
        // console.log('watch dataLoadStatus', this.fname, newValue, oldValue)
        if (newValue === 'toload') {
          this.load_relation_data()
        }
      },
      deep: true,
      immediate: true
    }
  },

  async created() {},

  async mounted() {
    // console.log('m2m mounted', this.fname)
    if (!this.relation) {
      this.load_relation()
    }
  },

  methods: {
    tuples2ids(tuples) {
      return tuples2ids(tuples)
    },

    check_array_equ(listA, listB) {
      return check_array_equ(listA, listB)
    },

    async load_relation() {
      // console.log('load_relation: ', cp(this.fieldInfo))
      const relation = api.env.relation(this.fieldInfo, {
        parent: this.viewInfo
      })
      await relation.load_views()
      this.relation = relation
      console.log('load_relation ok: ', relation, this.viewInfo)
    },

    async load_relation_data() {
      // console.log('load_relation_data: ')
      const ids = this.record[this.fname]

      const treeview = this.relation.tree
      const records = await treeview.read(ids)
      this.subRecords = records

      // console.log('o2m load_data', this.fname, ids, this.subRecords)
    },

    async handleChange(value) {
      console.log('handleChange', value)
      // const value2 = value.map(item => item.key)
      // this.$emit('change', this.fieldInfo.name, [[6, false, value2]])
    }
  }
}
</script>

<style type="text/css" scoped></style>
