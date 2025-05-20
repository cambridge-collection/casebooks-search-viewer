<script lang="ts" setup>

import { computed } from 'vue'
import DataTag from '@/components/DataTag.vue'

const props = defineProps({
  element_name: { type: String, required: true },
  tag_text: { type: String, required: true },
  icon_css: { type: String, required: false },
  params: {type: Array as () => { key: string; value: string }[], required: true},
})

const is_open = computed<boolean>(() => { return props.tag_text == '123' } )
const open_css = computed<string| null>(() => is_open.value ? 'open' : '' )
const question_hierarchy = computed<string[]>(() => props.tag_text.split('::'))
const main_questions = computed<string[]>(() => question_hierarchy.value.length > 1 ? question_hierarchy.value.slice(0, -1): question_hierarchy.value )
const subquestion = computed<string>(() => question_hierarchy.value.length > 1 ? question_hierarchy.value.slice(-1)[0]: '')
</script>

<template>
  <p class="main_topic">
    <span v-for="(question, index) in main_questions" :key="question_hierarchy+index.toString()">
    <span v-if="index > 0 ">&gt;</span>
      <DataTag
      :element_name="element_name"
      :tag_text="question"
      :param_val="[...question_hierarchy].splice(0,index+1).join('::')"
      :params="params"
      icon_css="fa fa-heartbeat"
    />
    </span>
    <span class="subtopics" v-if="subquestion">
      <span class="marker"> (</span>
      <DataTag
        :element_name="element_name"
        :tag_text="subquestion"
        :param_val="question_hierarchy.join('::')"
        :params="params"
        icon_css="fa fa-heartbeat"
      />
      <span class="marker">)</span>
    </span>
  </p>
</template>

<style scoped>
</style>
