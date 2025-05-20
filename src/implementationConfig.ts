import { stringifyQuery } from 'vue-router'
import { _params_to_query_structure } from '@/lib/utils'

/* Define implementation settings */


/* Boolean toggle controlling whether _tracer_bullet should output to console log */
const debug: boolean = false

const api_url: string =  'https://casebooks-search.casebooks.lib.cam.ac.uk'

export interface Facet {
  name: string;
  alias?: string;
  count: number;
  subfacet?: Record<string, Facet>;
};

/* Translation table for facets
   keys contains the parameter bucket names. These will also be the url param name for facets without subfacets or parent facets
   alias contains the param name to use on a facet with subfacets. All subfacets of that item will use alias as their param name
   subfacet contains subfacet information (bucket name, etc)
   count is not used at present, but will eventually to control how many facets are displayed in unexpanded lists
*/
const facet_key: Record<string, Facet> = {
  'f1-document-type-0': {
    name: 'Document type', alias: 'f1-document-type', count: 999,
    subfacet: {
      'f1-document-type-1': {
        name: 'Document type', count: 999,
        subfacet: {
          'f1-document-type-2': {
            name: 'Document type', count: 999,
            subfacet: {
              'f1-document-type-3': { name: 'Document type', count: 999 }
            }
          }
        }
      }
    }
  },
  'f1-practice': { name: 'Practice', count: 5 },
  'f1-practitioner-0': {
    name: 'Practitioner', alias: 'f1-practitioner', count: 999,
    subfacet: {
      'f1-practitioner-1': {
        name: 'Practitioner', count: 999,
      }
    }
  },
  'f1-number-of-practitioners': { name: 'Number of practitioners', count: 5 },
  'f1-practitioner-is-querent': { name: 'Practitioner is querent', count: 5 },
  'f1-practitioner-is-patient': { name: 'Practitioner is patient', count: 5 },
  'f1-astrologer-0': {
    name: 'Astrologer', alias: 'f1-astrologer', count: 999,
    subfacet: {
      'f1-astrologer-1': {
        name: 'Astrologer', count: 999,
      }
    }
  },
  'f1-practitioner-is-astrologer': { name: 'Practitioner is astrologer', count: 5 },
  'f1-number-of-astrologers': { name: 'Number of astrologers', count: 5 },
  'f1-patient-sex': { name: 'Patient is', count: 5 },
  'f1-patient-age-band-0': {
    name: 'Patient’s age', alias: 'f1-patient-age-band', count: 999,
    subfacet: {
      'f1-patient-age-band-1': {
        name: 'Patient’s age', count: 999,
      }
    }
  },
  'f1-number-of-patients': { name: 'Number of patients', count: 5 },
  'f1-querent-is-asking-about': { name: 'Querent is asking about', count: 5 },
  'f1-patient-knowledge': { name: 'Consultation took place with patient’s knowledge', count: 5 },
  'f1-patient-consent': { name: 'Patient’s consent to the consultation is', count: 5 },
  'f1-how-did-it-take-place-0': {
    name: 'How did it take place', alias: 'f1-how-did-it-take-place', count: 999,
    subfacet: {
      'f1-how-did-it-take-place-1': {
        name: 'How did it take place', count: 999,
      }
    }
  },
  'f1-date-0': {
    name: 'Date', alias: 'f1-date', count: 999,
    subfacet: {
      'f1-date-1': {
        name: 'Date', count: 999,
        subfacet: {
          'f1-date-2': {
            name: 'Date', count: 999,
            subfacet: {
              'f1-date-3': { name: 'Date', count: 999 }
            }
          }
        }
      }
    }
  },
  'f1-time-of-day-0': {
    name: 'Date', alias: 'f1-time-of-day', count: 999,
    subfacet: {
      'f1-time-of-day-1': {
        name: 'Time of day', count: 999,
        subfacet: {
          'f1-time-of-day-2': {
            name: 'Time of day', count: 999,
          }
        }
      }
    }
  },
  'f1-question-asked-0': {
    name: 'Question asked', alias: 'f1-question-asked', count: 999,
    subfacet: {
      'f1-question-asked-1': {
        name: 'Question asked', count: 999,
        subfacet: {
          'f1-question-asked-2': {
            name: 'Question asked', count: 999,
            subfacet: {
              'f1-question-asked-3': { name: 'Question asked', count: 999 }
            }
          }
        }
      }
    }
  },
  'f1-info-0': {
    name: 'Case contains information about', alias: 'f1-info', count: 999,
    subfacet: {
      'f1-info-1': {
        name: 'Case contains information about', count: 999,
        subfacet: {
          'f1-info-2': {
            name: 'Case contains information about', count: 999,
            subfacet: {
              'f1-info-3': { name: 'Case contains information about', count: 999 }
            }
          }
        }
      }
    }
  },
  'f1-judgment': { name: 'Case contains judgment', count: 5 },
  'f1-treatment': { name: 'Case includes treatment information', count: 5 },
  'f1-recipe': { name: 'Case contains recipe\n', count: 5 },
  'f1-querent-sex': { name: 'Querent is', count: 5 },
  'f1-querent-age-band-0': {
    name: 'Querent’s age', alias: 'f1-querent-age-band', count: 999,
    subfacet: {
      'f1-querent-age-band-1': {
        name: 'Querent’s age', count: 999,
      }
    }
  },
  'f1-querent-identified': { name: 'Querent is identified', count: 5 },
  'f1-number-of-querents': { name: 'Number of querents', count: 5 },
  'f1-shelfmark': { name: 'Shelfmark', count: 5 },
  'f1-volume-name': { name: 'Volume name', count: 5 },
  'f1-deleted': { name: 'Case deleted', count: 5 },
  'f1-damaged': { name: 'Case text damaged', count: 5 },
  'f1-hands': { name: 'Hands', count: 5 },
  'f1-language': { name: 'Language', count: 5 },
  'f1-extent-of-transcription': { name: 'Extent of transcription', count: 5 },
  'f1-identified-entity-role-0': {
    name: 'Identified entity is', alias: 'f1-identified-entity-role', count: 999,
    subfacet: {
      'f1-identified-entity-role-1': {
        name: 'Identified entity is', count: 999,
        subfacet: {
          'f1-identified-entity-role-2': {
            name: 'Identified entity is', count: 999,
            subfacet: {
              'f1-identified-entity-role-3': { name: 'Identified entity is', count: 999 }
            }
          }
        }
      }
    }
  },
  'f1-identified-entity-was-never': { name: 'Identified entity was never', count: 5 },
  'f1-person-sex': { name: 'Person is', count: 5 },
  'f1-identified-entity-is-asking-about': { name: 'Identified entity is asking about', count: 999 },
  'f1-entity-age-band-0': {
    name: 'Entity’s age', alias: 'f1-entity-age-band', count: 999,
    subfacet: {
      'f1-entity-age-band-1': {
        name: 'Entity’s age', count: 999,
      }
    }
  },
  'f1-dob-cert': { name: 'Date of birth', count: 5 },
  'f1-death-cert': { name: 'Date of death', count: 5 },
  'f1-entity-question-asked-0': {
    name: 'Question asked', alias: 'f1-entity-question-asked', count: 999,
    subfacet: {
      'f1-entity-question-asked-1': {
        name: 'Question asked', count: 999,
        subfacet: {
          'f1-entity-question-asked-2': {
            name: 'Question asked', count: 999,
            subfacet: {
              'f1-entity-question-asked-3': { name: 'Question asked', count: 999 }
            }
          }
        }
      }
    }
  },
  'f1-occupation-mentioned': { name: 'Occupation mentioned', count: 5 },
  'f1-occupation-0': {
    name: 'Occupation', alias: 'f1-occupation', count: 999,
    subfacet: {
      'f1-occupation-1': {
        name: 'Occupation', count: 999,
        subfacet: {
          'f1-occupation-2': {
            name: 'Occupation', count: 999,
          }
        }
      }
    }
  },
  'f1-residence-mentioned': { name: 'Residence mentioned', count: 5 },
  'f1-residence-0': {
    name: 'Residence', alias: 'f1-residence', count: 999,
    subfacet: {
      'f1-residence-1': {
        name: 'Residence', count: 999,
        subfacet: {
          'f1-residence-2': {
            name: 'Residence', count: 999,
            subfacet: {
              'f1-residence-3': { name: 'Residence', count: 999,
                subfacet: {
                  'f1-residence-4': { name: 'Residence', count: 999 }
                }
              }
            }
          }
        }
      }
    }
  },
  'f1-event-mentioned': { name: 'Event mentioned', count: 5 },
  'f1-identified-entity-practice': { name: 'Identified entity practice', count: 5 },
  'f1-gentry': { name: 'Gentry', count: 5 },
  'f1-social-network-recorded': { name: 'Social network recorded', count: 5 },
  'f1-patient': { name: 'Patient', count: 5 },
  'f1-querent': { name: 'Querent', count: 5 },
  'f1-participant': { name: 'Participant', count: 5 },

}

const structured_desired = [
  {title: "", id:"document-type", facets: ['f1-document-type-0']},
  {title: "Practitioner details", id:"practitioner_facets", facets: ['f1-practice','f1-practitioner-0','f1-number-of-practitioners','f1-practitioner-is-querent','f1-practitioner-is-patient']},
  {title: "Astrologer details", id:"astrologer_facets", facets: ['f1-astrologer-0','f1-practitioner-is-astrologer','f1-number-of-astrologers']},
  {title: "Patient details", id: "patient_facets", facets: ['f1-patient-sex',
      'f1-patient-age-band-0',
      'f1-number-of-patients',]},
  {title: "How & where did it take place", id: "how_did_it_take_place", facets: ['f1-querent-is-asking-about',
      'f1-patient-knowledge',
      'f1-patient-consent',
      'f1-how-did-it-take-place-0',]},
  {title: "When did it take place", id:"when_did_it_take_place", facets: ['f1-date-0',
      'f1-time-of-day-0',]},
  {title: "Consultation details", id: "details_facets", facets: ['f1-question-asked-0',
      'f1-info-0',
      'f1-judgment',
      'f1-treatment',
      'f1-recipe',]},
  {title: "Person asking the question", id: "querent_facets", facets: ['f1-querent-sex',
      'f1-querent-age-band-0',
      'f1-querent-identified',
      'f1-number-of-querents',]},
  {title: "Editorial information", id: "editorial_facets", facets: ['f1-shelfmark',
      'f1-volume-name',
      'f1-deleted',
      'f1-damaged',
      'f1-hands',
      'f1-language',
      'f1-extent-of-transcription',]},
  {title: "Identified entities", id:"person", facets: ['f1-identified-entity-role-0',
      'f1-identified-entity-was-never',
      'f1-person-sex',
      'f1-identified-entity-is-asking-about',
      'f1-entity-age-band-0',
      'f1-dob-cert',
      'f1-death-cert',
      'f1-entity-question-asked-0',
      'f1-occupation-mentioned',
      'f1-occupation-0',
      'f1-residence-mentioned',
      'f1-residence-0',
      'f1-event-mentioned',
      'f1-identified-entity-practice',
      'f1-gentry',
      'f1-social-network-recorded',]},
  {title: "Top ten", id: "top_ten", facets: ['f1-patient',
      'f1-querent',]},
]
/*  An ordered array of the facet buckets to be displayed in the sidebar */
const desired_facets: string[] = ['f1-document-type-0',
  'f1-practice',
  'f1-practitioner-0',
  'f1-number-of-practitioners',
  'f1-practitioner-is-querent',
  'f1-practitioner-is-patient',
  'f1-astrologer-0',
  'f1-practitioner-is-astrologer',
  'f1-number-of-astrologers',
  'f1-patient-sex',
  'f1-patient-age-band-0',
  'f1-number-of-patients',
  'f1-querent-is-asking-about',
  'f1-patient-knowledge',
  'f1-patient-consent',
  'f1-how-did-it-take-place-0',
  'f1-date-0',
  'f1-time-of-day-0',
  'f1-question-asked-0',
  'f1-info-0',
  'f1-judgment',
  'f1-treatment',
  'f1-recipe',
  'f1-querent-sex',
  'f1-querent-age-band-0',
  'f1-querent-identified',
  'f1-number-of-querents',
  'f1-shelfmark',
  'f1-volume-name',
  'f1-deleted',
  'f1-damaged',
  'f1-hands',
  'f1-language',
  'f1-extent-of-transcription',
  'f1-identified-entity-role-0',
  'f1-identified-entity-was-never',
  'f1-person-sex',
  'f1-identified-entity-is-asking-about',
  'f1-entity-age-band-0',
  'f1-dob-cert',
  'f1-death-cert',
  'f1-entity-question-asked-0',
  'f1-occupation-mentioned',
  'f1-occupation-0',
  'f1-residence-mentioned',
  'f1-residence-0',
  'f1-event-mentioned',
  'f1-identified-entity-practice',
  'f1-gentry',
  'f1-social-network-recorded',
  'f1-patient',
  'f1-querent',
]

/* Facets that are expandable */
const expandable: string[] = [
  'volume-name','shelfmark', 'hands'
]

/* Search params used in the advanced search page */
const advanced_params = [
  'text',
  'sectionType',
  'search-addressee',
  'search-author',
  'search-correspondent',
  'year',
  'month',
  'day',
  'year-max',
  'month-max',
  'day-max',
  'search-date-type',
  'exclude-widedate',
  'search-repository',
  'exclude-cancelled'
]

const exclusion_rules: { [conditionKey: string]: string[] } = {
  age: ["age-role", "age-search-type"],
  search_date_type: ["year-max", "month-max", "day-max"]
};

const advanced_exclusions: {
  requiredKeys: string[];           // All must exist with non-empty values
  targetKey: string;               // Only remove this key if conditions fail
  targetValueEquals?: string;      // Optional: only remove if target value matches this
}[] = [
  {
    requiredKeys: ["year-max", "month-max", "day-max"],
    targetKey: "search-date-type",
    targetValueEquals: "between"
  }
];

/* Conditional function that will be run if it exists when first processing all url parameters
*
*  'page' should always be removed and this is the default if this function is not defined in the implementation file
*  The other params in this list are removed because they legacy params that are no longer supported (or needed) in the new
*  site.
*
*/
const params_to_remove: string[] = ['start', 'page', 'tab', 'smode', 'text-exclude', 'name-type', 'question-asked-join']
/* Both the following affect the results. It's nice to be able to x them out
   but I wonder whether a better ui might be possible.
   Certainly better listing of the info (name and value) can be done.
   age-role
   age-search-type */

/* Conditional function that will be run if it exists when creating the array containing all params that reflect the
*  choices the user has made to filter the data. It is used to display these choices to the user at the top of the
*  search results (ie. in pills/options that can be cancelled).
*
*  'sort' will be removed if this function is not defined in the implementation file
*  'tc' is removed because it is the param determining which solr core to search
*/
const non_filtering_keys: string[] = ['sort', 'show']

/* Define the sort fields
*  Used to create the sort dropdown
*  The current implementation of this site assumes that the fieldname is the
*  as the user-friendly textual representation presented to the user.
*  `Score` is currently hard-coded to display as 'relevance'
*/
const sort_fields: string[] = ['score', 'sort-date', 'sort-date-desc', 'sort-shelfmark', 'sort-volume-name', 'sort-title']

/* Conditional function that will be run if it exists when first processing url parameters.
*  It is used to tidy up URL parameters. It will likely only ever be used on former XTF sites
*  XTF used to number facets by the order in which they were sleected by the user. You could consequently have
*  f1-document-type=letter&f2-date=1868 AND f1-date=1868&f2-document-type
*  Both produce the same ouput but make it more difficult for crawlers to the site.
*  This function standardises all facets to f1-{face-name}.
*/
const _tidy_facet_paramname = (str: string) => {
  return str.replace(/^f\d+-/, 'f1-')
}

/* Conditional function that will be run if it exists when first processing url parameters.
*  It is used to perform more complex removals of parameters.
*  For example, 'tc' (the param determining which solr core to use) is only necessary when searching the site pages.
*  This function consequently removes it when searching 'items'.
*  Similarly, search-date-type is a parameter that defaults to 'on' when performing an advanced search. However, it's
*  only actually used when some temporal parameters are set.
*/
const _remove_unused_params = (params: Array<{ key: string; value: string }>): Array<{
  key: string;
  value: string
}> => {
  let newParams = [...params]

  if (!['year', 'month', 'day'].some(key => newParams.some(item => item.key === key))) {
    newParams = newParams.filter(item => item.key !== 'search-date-type')
  }

  if (!newParams.some(item => item.key === 'age' && item.value)) {
    newParams = newParams.filter(item => !['age-role', 'age-search-type'].includes(item.key))
  }

  if (!newParams.some(item => item.key === 'text' && item.value)) {
    newParams = newParams.filter(item => item.key !== 'sectionType');
  }

  // Remove param for core if it's the main tei core. That's the default
  newParams = newParams.filter(item => !(item.key === 'tc' && item.value === 'items'))
  return newParams
}

/* Darwin specific functions used in the view
   They control the styling and url of the 'Letters, People and References' and 'Articles' tabs based on the user's
   query.
 */
function tab_active(name: string, core: string): boolean {
  return (
    (name == 'this-site' && core === 'pages') ||
    (name == 'cudl-results' && core !== 'pages')
  )
}

function tab_class(name: string, core: string) {
  const active_class = tab_active(name, core) ? 'active' : null
  return [name, active_class].join(' ')
}

function tab_href(name: string, core: string, all_params: { key: string; value: string }[]) {
  let path = tab_active(name, core) ? '#' : '/search?'
  const params = all_params.filter(item => item.key === 'keyword')
  params.push({ key: 'page', value: '1' })

  if (name === 'this-site') {
    params.push({ key: 'tc', value: 'pages' })
  }

  if (!tab_active(name, core)) {
    path += stringifyQuery(_params_to_query_structure(params))
  }
  return path
}

export {
  api_url,
  desired_facets,
  structured_desired,
  facet_key,
  advanced_params,
  params_to_remove,
  non_filtering_keys,
  sort_fields,
  exclusion_rules,
  advanced_exclusions,
  expandable,
  debug,
  _tidy_facet_paramname,
  _remove_unused_params,
  tab_class,
  tab_href,
}
