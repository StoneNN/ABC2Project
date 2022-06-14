<template>
  <span>
    <template v-if="!editable || readonly">
      {{ value_display }}
    </template>

    <template v-else>
      <OInput v-model="value2" :width="width" @change="handleChange" />
    </template>
  </span>
</template>

<script>
import OFMixin from './OFMixin'
import OInput from '@/components/OInput/OInput.vue'

export default {
  name: 'FString',
  components: { OInput },
  mixins: [OFMixin],
  props: {},
  data() {
    return {}
  },
  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {}
}
</script>

<style type="text/css"></style>
