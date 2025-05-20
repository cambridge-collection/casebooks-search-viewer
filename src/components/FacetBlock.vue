<script lang="ts" setup>
import FacetItem from '../components/FacetItem.vue'
import { computed, ref } from 'vue'
import { _params_to_query_structure } from '@/lib/utils';
import * as implementation from '@/implementationConfig'
import type { Facet } from '@/implementationConfig';
import type { PropType } from 'vue'

const props = defineProps({
  section_id: { type: String, required: true },
  desired_facet: { type: String, required: true },
  facets: { type: Object as PropType<Record<string, { val: string; count: number }[]>>, required: true },
  has_facets: { type: Boolean, required: true },
  facet_key: { type: Object as PropType<Record<string, Facet>>, required: true },
  section_title: { type: String, required: true },
  index: { type: Number, required: true },
  params: {type: Array as () => { key: string; value: string }[], required: true},
})

const name = computed<string>(() => props.facet_key[props.desired_facet].name.replace(/(^"|"$)/g, ''))

const root_param_name = computed<string>(() => props.desired_facet.replace(/(^f\d+-)/g, ''))

const target_facets = computed<{ val: string; count: number; }[]>(() => {
  return props.facets[props.desired_facet]
})

const has_entries = computed<boolean>(() => {
  return (
    props.desired_facet in props.facets &&
    props.facets[props.desired_facet].length > 0
  )
})

// Refactor to generic function using implementation.facet (with subfacets)
// All subfacets for a given key have to be included, regardless of depth
const subfacets = computed(() => {
  const result = {} as Record<string, typeof props.facets[string]>;
  function walk(sub: Record<string, Facet> | undefined) {
    if (!sub) return
    for (const key in sub) {
      result[key] = props.facets[key]
      walk(sub[key].subfacet)
    }
  }
  walk(props.facet_key[props.desired_facet]?.subfacet)
  return result
})

const is_expandable = computed<boolean>(() => implementation.expandable.includes(root_param_name.value))

const is_expanded = computed<boolean>(() => props.params.filter(item => item.key == 'expand')[0]?.value === root_param_name.value)

const unexpand_link = computed<Record<string, string[]>>(() => _params_to_query_structure(props.params.filter(item => item.key !== 'expand')))

const expand_link = computed<Record<string, string[]>>(() => ({ ...unexpand_link.value, expand: [root_param_name.value] }));

const current_facet_selections = computed<string[]>(() => props.params
  .filter((item: { key: string; value: string }) => item.key === props.desired_facet)
  .map((item: { key: string; value: string }) => item.value))

const show_block = computed<boolean>(() => Object.values(props.facets).some(arr => arr.length > 0))
</script>

<template>
  <div :id="section_id" class="campl-content-container campl-no-top-padding" v-if="has_facets">
    <h3 v-if="section_title && index==0">{{section_title}}</h3>
    <div class="facet pb-2 mb-4" v-if="has_entries">
      <h6 class="facetName bg-info pt-2 pb-2 mb-0 text-center text-white">
        {{ name }}
      </h6>
      <div class="facetLess list-group-item d-flex justify-content-between align-items-center"  v-if="is_expanded && is_expandable && target_facets.length >= 5">
        <router-link :to="{ name: 'search', query: unexpand_link}" class="badge badge-light badge-pill border mx-auto mt-2 mb-2">
          <i>fewer</i>
        </router-link>
      </div>
      <ul class="facetGroup  list-group list-group-root">
        <facetItem
          v-for="facet in facets[desired_facet]"
          :facet="facet"
          :param_name="desired_facet"
          :params="params"
          :current_selections="current_facet_selections"
          :subfacets="subfacets"
          v-bind:is_subgroup="false"
          :key="JSON.stringify(facet)"
        />
        <div class="facetLess list-group-item d-flex justify-content-between align-items-center"  v-if="is_expandable && target_facets.length >= 5 && !is_expanded">
          <router-link :to="{ name: 'search', query: expand_link}" class="badge badge-light badge-pill border mx-auto mt-2 mb-2">
            <i>more</i>
          </router-link>
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>
