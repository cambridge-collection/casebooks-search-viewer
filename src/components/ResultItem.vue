<script lang="ts" setup>
import { computed, ref } from 'vue'
import DataTag from '@/components/DataTag.vue'
import TopicTags from '@/components/TopicTags.vue'
import { _get_first_value } from '@/lib/utils'
import * as implementation from '@/implementationConfig'

const props = defineProps({
  item: { type: Object, required: true },
  params: {type: Array as () => { key: string; value: string }[], required: true},
  currentPage: { type: Number, required: true },
  index: { type: Number, required: true },
})

const show_snippets = ref(false)

const doc_type = computed<string>(() => {
  const val: string | string[] = props.item['facet-document-type-0'] ?? ''
  return Array.isArray(val) ? val[0] : val
})

const container_width = computed<string>(() => {
  return props.item?.thumbnail != '' ||
    ['Identified entity', 'Text', 'Note', 'Letter', 'Site'].includes(
      doc_type.value,
    )
    ? 'campl-column10'
    : 'campl-column12'
})


const view_mode = computed<string>(() => {
  const show_obj = Array.isArray(props.params.filter(item => item.key == 'show')) ? props.params.filter(item => item.key == 'show')[0]: {"key": "show", "value": ""}
  const show = show_obj?.value
  let result: string  = "diplomatic"
  if (['normalised', 'translation'].includes(show))  { result = show}
  return result
})

const item_path = computed<string>(() => (view_mode.value == 'diplomatic' || ['Site','Identified entity'].includes(doc_type.value)) ? props.item.path : props.item.path+'?show='+view_mode.value )
</script>

<template>
  <div
    :id="'main_' + index"
    class="docHit campl-listing-item campl-search-listing clearfix campl-no-top-padding"
  >
    <div
      class="campl-column2"
      v-if="item.thumbnail != '' || container_width == 'campl-column10'"
    >
      <div class="campl-content-container campl-no-padding campl-listing-img">
        <a :href="item_path" v-if="item.thumbnail">
          <img
            class="img-fluid"
            alt="thumbnail"
            :src="item['thumbnail']"
            width="120"
        /></a>
        <p class="fa-thumbnail" v-if="doc_type == 'Identified entity'">
          <i class="fa fa-user-o"></i>
        </p>
        <p class="fa-thumbnail" v-if="doc_type == 'Site'">
          <i class="fa fa-file-text-o"></i>
        </p>
        <p
          class="fa-thumbnail"
          v-if="
            ['Text', 'Note', 'Letter'].includes(doc_type) &&
            !item.thumbnail
          "
        >
          <i class="fa fa-file-text-o"></i>
        </p>
      </div>
    </div>
    <div :class="container_width + ' campl-listing-txt'">
      <div class="campl-content-container campl-no-padding">
        <div
          class="transcription_container"
          v-if="['Text', 'Note', 'Letter', 'Case'].includes(doc_type)"
        >
          <div class="docHit-body">
            <div class="transcription">
              <div class="ribbon" v-if="view_mode == 'translation' && item?.has_translation == true">
                <span>TRANSLATION</span>
              </div>
              <h4 class="bold campl-listing-title">
                <a :href="item_path">{{ item.display_title }}</a
                ><span
                  v-if="item.display_subtitle"
                  v-html="item.display_subtitle"
                />
              </h4>
              <p
                class="how-did-it-take-place"
                v-html="item.display_how_did_it_take_place"
              />
              <p
                class="author smallest"
                v-if="['Text', 'Letter'].includes(doc_type)"
              >
                {{ item.creator.join('; ') }}
              </p>
              <div
                v-if="item?.content_display_summary"
                v-html="item.content_display_summary"
              />
              <div
                class="case-text"
                v-if="
                  view_mode == 'diplomatic' &&
                  item?.content_display_content_diplomatic
                "
                v-html="item.content_display_content_diplomatic"
              />
              <div
                class="case-text"
                v-else-if="
                  view_mode == 'normalised' &&
                  item?.content_display_content_normalised
                "
                v-html="item.content_display_content_normalised"
              />
              <div
                class="case-text"
                v-else-if="
                  view_mode == 'translation' &&
                  item?.content_display_content_translation
                "
                v-html="item.content_display_content_translation"
              />
              <p class="classmark">
                <i class="fa fa-file-text-o" aria-hidden="true" />&#160;<span
                  v-html="item.display_classmark"
                />
              </p>
            </div>
          </div>
        </div>
        <div
          class="transcription identified-entity"
          v-if="doc_type == 'Identified entity'"
        >
          <h4 class="campl-listing-title">
            <a :href="item.path">{{ item.display_title }}</a>
          </h4>

          <p v-if="item?.display_person_details">
            {{ item.display_person_details[0] }}
          </p>
          <div
            v-if="item?.display_occupations"
            v-html="item.display_occupations"
          />
          <div
            v-if="item?.display_residences"
            v-html="item.display_residences"
          />
          <div v-if="item?.display_events" v-html="item.display_events" />
        </div>
        <div class="campl-column10 campl-listing-txt" v-if="['Site'].includes(doc_type)">
          <div class="campl-content-container campl-no-padding">
            <div class="transcription">
              <h4 class="bold campl-listing-title"><a :href="item_path">{{ item.display_title }}</a></h4>
              <p class="author smallest">{{ item.creator.join('; ') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tag_container campl-column12" v-if="doc_type == 'Case'">
      <div class="campl-content-container campl-right-padding">
        <p class="participants">
          <DataTag
            v-for="item in [
              ...new Set([...item['facet-querent'], ...item['facet-patient']]),
            ]"
            :element_name="'f1-participant'"
            :tag_text="item"
            :icon_css="'fa fa-user'"
            :param_val="item"
            :params="params"
            :key="JSON.stringify(item)"
          />
        </p>
        <div class="topics">
          <TopicTags
            v-for="question in item['facet-question-asked']"
            :tag_text="question"
            element_name="f1-question-asked-0"
            :params="params"
            :key="'f1-question-asked::' + question"
          />
        </div>
        <p class="info_tags">
          <span class="practitioner">
            <DataTag
              v-for="item in [...new Set([...item['facet-practitioner']])]"
              element_name="f1-practitioner-0"
              :tag_text="item.replace(/^Other::/, '')"
              :param_val="item"
              :params="params"
              icon_css="fa fa-star"
              :key="JSON.stringify(item)"
            />

            <DataTag
              v-if="item['facet-treatment'].includes('Yes')"
              element_name="f1-treatment"
              tag_text="Treatment"
              param_val="Yes"
              :params="params"
              icon_css="fa fa-star"
            />

            <DataTag
              v-if="item['facet-recipe'].includes('Yes')"
              element_name="f1-recipe"
              tag_text="Recipe"
              param_val="Yes"
              :params="params"
              icon_css="fa fa-star"
            />

            <DataTag
              v-if="item['facet-judgment'].includes('Yes')"
              element_name="f1-judgment"
              tag_text="Judgment"
              param_val="Yes"
              :params="params"
              icon_css="fa fa-star"
            />

            <DataTag
              v-if="item['facet-info']?.includes('Payment')"
              element_name="f1-info-0"
              tag_text="Payment"
              :params="params"
              icon_css="fa fa-star"
            />

            <DataTag
              v-if="item['facet-info']?.includes('Previous consultation(s)')"
              element_name="f1-info-0"
              tag_text="Previous consultation(s)"
              :params="params"
              icon_css="fa fa-star"
            />

            <DataTag
              v-if="item['facet-info']?.includes('Outcome(s)')"
              element_name="f1-info-0"
              tag_text="Outcome(s)"
              :params="params"
              icon_css="fa fa-star"
            />

            <DataTag
              v-for="val in item['facet-info']?.filter((item: string) =>
                /(Angelic consultation|Divination):*/.test(item),
              )"
              element_name="f1-info-0"
              :tag_text="val.split(':')[0]"
              :params="params"
              icon_css="fa fa-star"
              :key="'facet-info:' + val"
            />

            <DataTag
              v-if="item['facet-info']?.includes('Geomantic chart')"
              element_name="f1-info-0"
              tag_text="Geomantic chart"
              :params="params"
              icon_css="fa fa-star"
            />

            <DataTag
              v-if="item['facet-info']?.includes('Patient’s death recorded')"
              element_name="f1-info-0"
              tag_text="Patient’s death recorded"
              :params="params"
              icon_css="fa fa-star"
            />
          </span>
          <!-- TAG -->
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.summary_row p {
  margin: 0;
}
.docHit .snippet_container {
  width: 100%;
  margin-left: 15px;
  margin-right: 15px;
}

.docHit .snippet br {
  display: none;
}

.docHit .snippet .match {
  color: #d32535;
  font-weight: bold;
  font-style: normal;
}

.snippet_header {
  padding: 1em 0 0.5em 0;
  font-weight: bold;
  font-size: 1rem;
}

.ribbon span {
  box-shadow: 0 3px 3px -5px black;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
