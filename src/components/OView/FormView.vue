<template>
  <div>
    <div>
      <template v-if="!editable">
        <a-button v-if="buttons.edit" @click="onClickEdit"> 编辑 </a-button>
        <a-button v-if="buttons.create" @click="onClickNew"> 创建 </a-button>
        <a-button v-if="buttons.delete" @click="onClickDel"> 删除 </a-button>
      </template>

      <template v-if="editable">
        <a-button @click="onClickSave"> 保存 </a-button>
        <a-button @click="onClickCancel"> 取消 </a-button>
      </template>
    </div>

    <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
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

          <template
            v-else-if="
              meta.type === 'many2many' && meta.widget === 'many2many_tags'
            "
          >
            <FM2mTags
              v-model="formValues[meta.name]"
              :editable="editable"
              :field-info="meta"
              :data-info="dataInfo"
              width="120px"
              @change="handleChange"
            />
          </template>

          <template
            v-else-if="
              meta.type === 'one2many' && meta.widget === 'x2many_tree'
            "
          >
            <FO2m
              v-model="formValues[meta.name]"
              :editable="editable"
              :field-info="meta"
              :view-info="viewInfo"
              :data-info="dataInfo"
              width="200px"
              @change="handleChange"
            />
          </template>

          <template
            v-else-if="
              meta.type === 'many2many' && meta.widget === 'x2many_tree'
            "
          >
            m2m tree
            <!-- <FMany2many
              v-model="formValues[meta.name]"
              :editable="editable"
              :field-info="meta"
              :view-info="viewInfo"
              :data-info="dataInfo"
              width="200px"
              @change="handleChange"
            /> -->
          </template>

          <template v-else>
            todo: {{ (dataInfo.record || {})[meta.name] }}
            {{ meta.type }}
            required:{{ meta.required }}
          </template>
        </a-form-model-item>
      </template>
    </a-form-model>
  </div>
</template>

<script>
import formMixin from '@/mixins/formMixin'

import FSelection from '@/components/OField/FSelection.vue'
import FMany2one from '@/components/OField/FMany2one.vue'
import FString from '@/components/OField/FString.vue'
import FNumber from '@/components/OField/FNumber.vue'
import FM2mTags from '@/components/OField/FM2mTags.vue'
import FO2m from '@/components/OField/FO2m.vue'

export default {
  name: 'FormView',
  components: { FSelection, FMany2one, FString, FNumber, FM2mTags, FO2m },

  mixins: [formMixin],

  props: {},

  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {}
}
</script>

<style scoped></style>
