<script lang="ts" setup>

import { computed } from 'vue'
import escape from 'core-js/actual/regexp/escape'
import { _bucket_to_param_name, _get_subfacet_bucket_name, _params_to_query_structure, cancel_link, _query_param_sort } from '@/lib/utils';
import * as implementation from '@/implementationConfig'

const props = defineProps({
  element_name: { type: String, required: true },
  tag_text: { type: String, required: true },
  param_val: {type: String, required: false, default: ""},
  icon_css: { type: String, required: false },
  params: {type: Array as () => { key: string; value: string }[], required: true},
})

const facet_name = computed(() =>  _bucket_to_param_name(props.element_name))

const current_subfacet_selections = computed<string[]>(() => props.params
  .filter((item: { key: string; value: string }) => facet_name.value === item.key)
  .map((item: { key: string; value: string }) => item.value))

const is_selected = computed<boolean>(() => {
  const value: string = props.param_val
  return (current_subfacet_selections.value.some(
    (e: string) => {
      const para_val: string = String(e).replaceAll(/^"(.+?)"$/g, '$1')
      const re = new RegExp("^"+ escape(value) +'::')
      return para_val == value || re.test(para_val)
    }
  ))
})

const new_facet_params = computed<Record<string, string[]>>(() => {
  const param_array: { key: string; value: string }[] = [...props.params]
  param_array.push({key: facet_name.value, value: props.param_val||props.tag_text})

  param_array.sort((a, b) => {
    // First compare by key
    const keyComparison = _query_param_sort(a.key).localeCompare(_query_param_sort(b.key));
    if (keyComparison !== 0) return keyComparison;

    // If keys are the same, compare by value
    return a.value.localeCompare(b.value);
  });

  const result: Record<string, string[]>  = _params_to_query_structure(param_array)
  result['page'] = ['1']
  return result
})

const is_open = computed<boolean>(() => { return props.tag_text == '123' } )
const open_css = computed<string| null>(() => is_selected.value ? 'open' : '' )

</script>

<template>
  <span :class="open_css + ' tag'">
    <router-link
      :to="{ name: 'search', query: cancel_link(facet_name, param_val, params) }" class="d-flex justify-content-between align-items-center"
      v-if="is_selected">
      <i :class="icon_css" aria-hidden="true" v-if="icon_css"/>
      {{ tag_text }}
      &#160;
        <span><i class="fa fa-window-close" aria-hidden="true" /></span>
    </router-link>
    <router-link :to="{ name: 'search', query: new_facet_params }" v-else>
      <i :class="icon_css" aria-hidden="true" v-if="icon_css"/>
      {{ tag_text }}
    </router-link>
  </span>
</template>

<style scoped>
.tag i.fa.fa-window-close {
  vertical-align: middle;
}
span.tag.open {
  /* background-color: hsl(86, 56%, 90.4%) */
}
</style>
