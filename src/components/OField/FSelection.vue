<template>
  <span>
    <template v-if="!editable || readonly">
      {{ value_display2 }}
    </template>

    <template v-else>
      <a-select v-model="value2" :style="compute_style" @change="handleChange">
        <template v-for="op in fieldInfo.selection || []">
          <a-select-option :key="op[0]" :value="op[0]">
            {{ op[1] }}
          </a-select-option>
        </template>
      </a-select>
    </template>
  </span>
</template>

<script>
import OFMixin from './OFMixin'

export default {
  name: 'FSelection',
  components: {},
  mixins: [OFMixin],
  props: {},

  data() {
    return {}
  },
  computed: {
    value_display2() {
      const value = this.value_display
      const selection = this.fieldInfo.selection || []

      const get_label = v => {
        const elm = selection.find(item => item[0] === v)
        return elm ? elm[1] : ''
      }

      return value ? get_label(value) : ''
    }
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {}
}
</script>

<style type="text/css"></style>
