<template>
  <span>
    <!--  -->

    <a-modal v-model="showModal" :title="relationInfo && relationInfo.string">
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- {{ dataInfo }} -->

        <template v-for="meta in fields">
          <!-- required:{{ meta.required }} -->

          <a-form-model-item :key="meta.name" :label="meta.string">
            <template v-if="meta.type === 'selection'">
              <FSelection
                v-model="formValues[meta.name]"
                :editable="editable"
                :field-info="meta"
                :data-info="dataInfo"
                width="120px"
                @change="handleChange"
              />
            </template>

            <template v-else-if="meta.type === 'many2one'">
              <FMany2one
                v-model="formValues[meta.name]"
                :editable="editable"
                :field-info="meta"
                :data-info="dataInfo"
                width="120px"
                @change="handleChange"
              />
            </template>

            <template v-else-if="['char'].includes(meta.type)">
              <FString
                v-model="formValues[meta.name]"
                :field-info="meta"
                :editable="editable"
                :data-info="dataInfo"
                width="120px"
                @change="handleChange"
              />
            </template>

            <template v-else-if="['float', 'integer'].includes(meta.type)">
              <FNumber
                v-model="formValues[meta.name]"
                :field-info="meta"
                :editable="editable"
                :data-info="dataInfo"
                width="120px"
                @change="handleChange"
              />
            </template>

            <template v-else>
              todo: {{ (record || {})[meta.name] }}
              {{ meta.type }}
              required:{{ meta.required }}
            </template>
          </a-form-model-item>
        </template>
      </a-form-model>

      <template slot="footer">
        <a-space v-if="editable">
          <a-button key="commit" @click="() => handleOnCommit()">
            保存
          </a-button>
          <a-button key="rollback" @click="() => handleOnRollback()">
            丢弃
          </a-button>

          <a-button key="remove" @click="() => handleOnRemove()">
            移出
          </a-button>
        </a-space>

        <a-space v-else>
          <a-button key="back" @click="() => (showModal = false)">
            关闭
          </a-button>
        </a-space>
      </template>
    </a-modal>
  </span>
</template>

<script>
import FSelection from '@/components/OField/FSelection.vue'
import FMany2one from '@/components/OField/FMany2one.vue'
import FString from '@/components/OField/FString.vue'
import FNumber from '@/components/OField/FNumber.vue'

import api from '@/odoorpc'

export default {
  name: 'O2MForm',
  components: { FSelection, FMany2one, FString, FNumber },
  mixins: [],
  props: {
    editable: { type: Boolean, default: false },
    relationInfo: { type: Object, default: undefined },

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
      showModal: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 14 },

      formview: undefined, // 对象, 接口函数的入口
      record: {},
      formValues: {},
      values: {}
    }
  },
  computed: {
    dataInfo() {
      return { record: this.record, values: this.values }
    },

    relation() {
      if (this.relationInfo) {
        return api.env.relation(this.relationInfo, {
          parent: this.parentViewInfo
        })
      } else {
        return undefined
      }
    },

    fields() {
      if (!this.relation) {
        return {}
      }

      const fields = this.relation.form.fields
      return fields
    }
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {
    async handleCreate() {
      console.log('createO2m')

      // console.log(this.parentData)

      const view = this.relation.form
      const res = await view.onchange_new(this.parentData)

      const { record, values } = res
      this.record = record
      this.values = values

      this.formview = view

      this.showModal = true
    },

    async handleShowForm(record) {
      const row = { ...record }
      if (!row.id) delete row.id

      if (!this.editable) {
        const view = this.relation.form
        this.record = await view.read(record.id)
        this.values = {}
        //
      } else {
        const view = this.relation.form
        this.formview = view

        console.log('handleShowForm', record)
        this.formValues = this.formview.set_editable(record)
      }
      this.showModal = true
    },

    async handleChange(fname, value) {
      console.log('handleChange', fname, value)
      // this.formview.onchange(fname, value, result => {
      //   const { values = {} } = result
      //   this.values = values
      //   this.formValues = { ...this.formValues, ...values }
      // })
    },

    async handleOnRollback() {
      console.log('handleOnRollback subform')
      //   this.$emit('update:data', { ...this.data, values: {} })
      this.showModal = false
    },

    async handleOnRemove() {
      console.log('handleOnRemove', this.record)
      // const value = [2, this.record.id, false]
      // this.$emit('on-event', 'on-commit', { value })
      this.showModal = false
    },

    async handleOnCommit() {
      console.log('handleOnCommit subform')
      // console.log('handleOnCommit subform', cp(this.data))
      // const values = this.values
      // const vals_get = () => {
      //   if (!this.record.id) {
      //     return [0, false, values]
      //   } else {
      //     return [1, this.record.id, values]
      //   }
      // }
      // const vals = vals_get()
      // this.$emit('on-event', 'on-commit', { value: vals })
      this.showModal = false
    }
  }
}
</script>

<style type="text/css"></style>
