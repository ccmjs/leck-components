/**
 * @overview Searching and finding resources
 * @author Leon Eck <leon.eck@smail.inf.h-brs.de> 2018
 * @license The MIT License (MIT)
 */

{

  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'resource_finder',

    /**
     * recommended used framework version
     * @type {string}
     */
    ccm: 'https://ccmjs.github.io/leck-components/js/ccm-16.6.1.js',

    /**
     * default instance configuration
     * @type {{}}
     */
    config: {
      html: {
        "main": {
          "id": "main",
          "class": "container bootfont",
          "inner": [
            {
              "id": "resource_finder",
              "inner": `
              <div id="spinner" class="spinner popup no-margin">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
              </div>
              <div class="row text-center">
                <h1 id="performanceOutput" style="display: inline;"></h1><h2 style="display: inline;"> ms</h2>
              </div>
              <div class="row top-buffer">
                <div class="col-md-3">
                  <select id="searchCategory"></select>
                </div>
                <div class="col-md-9">
                  <div class="input-group">
                    <input type="text" class="form-control" id="searchTerm" placeholder="Search (Searches in title, description and subject)">
                    <span class="input-group-btn">
                      <button type="button" id="buttonSearch" class="btn btn-primary">Search</button>
                    </span>
                  </div>
                </div>
              </div>
              <div class="row sm-top-buffer">
                <div class="col-xs-12">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group">
                            <label for="filterTags">Tags</label>
                            <select id="filterTags" multiple></select>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label for="filterLanguage">Language</label>
                            <select id="filterLanguage" multiple></select>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group">
                            <label for="filterBloom">Bloom’s Taxonomy</label>
                            <select id="filterBloom"></select>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="filterLicenseSoftware">Software License</label>
                            <select id="filterLicenseSoftware"></select>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group">
                            <label for="filterLicenseContent">Content License</label>
                            <select id="filterLicenseContent"></select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12">
                  <span class="greyHeading">Results</span>
                  <form class="form-inline pull-right">
                    <div class="form-group">
                      <label for="sortSelector">Sort by:</label>
                      <select id="sortSelector">
                        <option value="dateNewOld">Release date (new-old)</option>
                        <option value="dateOldNew">Release date (old-new)</option>
                        <option value="nameAZ">Name (a-z)</option>
                        <option value="nameZA">Name (z-a)</option>
                        <option value="creatorAZ">Creator (a-z)</option>
                        <option value="creatorZA">Creator (z-a)</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12">
                  <div class="panel panel-default">
                    <div id="searchResults" class="panel-body">
                    </div>
                    <nav>
                      <ul class="pager">
                        <li><a href="#" id="previousPage"><span aria-hidden="true">&larr;</span> Previous page</a></li>
                        <li><a href="#" id="nextPage">Next page <span aria-hidden="true">&rarr;</span></a></li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              `
            }, {
              "id": "resourceDisplaySpace"
            }
          ]
        }
      },
      css: [ 'ccm.load', [
        'https://ccmjs.github.io/leck-components/css/bootstrap.min.css',
        'https://ccmjs.github.io/leck-components/css/selectize.default.min.css',
        '../css/default.css',
        './main.css'
      ] ],
      js: [ 'ccm.load', [
        'https://ccmjs.github.io/leck-components/js/jquery.min.js',
        'https://ccmjs.github.io/leck-components/js/bootstrap.min.js',
        'https://ccmjs.github.io/leck-components/js/selectize.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/elasticlunr/0.9.6/elasticlunr.min.js'
      ] ],
      resource_display: [ 'ccm.component', '../resource_display/ccm.resource_display.js' ],
      no_bootstrap_container: false, // Set to true if embedded on a site that already has a bootstrap container div
      categories: [ 'Anthropology', 'Art', 'Astronomy', 'Biology', 'Chemistry', 'Classic culture', 'Computer Science', 'Craft', 'Design', 'Economy', 'Emotional education', 'Engineering', 'English', 'Environment', 'Experimental sciences', 'French', 'General Studies', 'Geography', 'Geology', 'German', 'Health', 'History', 'Italian', 'Language', 'Latin', 'Laws', 'Literature', 'Mathematics', 'Music', 'Others', 'Pedagogy', 'Philosophy', 'Physical education', 'Physics', 'Politics', 'Psychology', 'Religion', 'Russian', 'Social sciences', 'Spanish', 'Sport', 'Teaching Tools', 'Technical Drawing', 'Technology', 'Values education', 'Vocational education' ], // Categories the user can choose from
      registry: "https://leoneck.github.io/dms-performance-test/registry10000.json", // Path to the registry file
    },

    /**
     * for creating instances of this component
     * @constructor
     */
    Instance: function() {

      /**
       * own reference for inner functions
       * @type {Instance}
       */
      const self = this;

      let startTime = 0;

      /**
       * Registry of all resources
       * @type {[]}
       */
      let registryData = [];

      /**
       * Keep track of the start index for the current page
       * @type {number}
       */
      let paginationStartIndex = 0;

      const itemsPerPage = 20;

      /**
       * Value of all filters
       * @type {{}}
       */
      let filter = {
        sort: 'dateNewOld',
        category: '',
        tags: [],
        languages: [],
        bloom: '',
        licenseSoftware: '',
        licenseContent: ''
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        /**
         * Remove the bootstrap container class if config value no_bootstrap_container is true
         */
        if (self.no_bootstrap_container) {
          this.html.main.class = '';
        }

        const mainElement = this.ccm.helper.html(this.html.main, {
        });
        this.element.appendChild(mainElement);

        /**
         * Initialize the category filter
         */
        let categoryOptions = [{
          value: 'All categories'
        }]; // Prepend an option to search in all categories
        self.categories.forEach(category => {
          categoryOptions.push({
            value: category
          });
        });

        const categorySelector = $(mainElement.querySelector('#searchCategory')).selectize({
          inputClass: 'form-control selectize-input',
          persist: false,
          create: false,
          maxItems: 1,
          placeholder: 'Category for searching',
          valueField: 'value',
          labelField: 'value',
          searchField: 'value',
          options: categoryOptions,
          items: ['All categories']
        })[0].selectize;

        /**
         * Initialize the tag filter
         */
        const tagSelector = $(mainElement.querySelector('#filterTags')).selectize({
          delimiter: ',',
          persist: true,
          create: true,
          plugins: ['remove_button'],
          maxItems: null,
          placeholder: 'Filter by tags. (Default: all)',
          valueField: 'value',
          labelField: 'value',
          searchField: 'value',
          options: []
        })[0].selectize;

        const languages = {
          "ab": "Abkhazian",
          "aa": "Afar",
          "af": "Afrikaans",
          "ak": "Akan",
          "sq": "Albanian",
          "am": "Amharic",
          "ar": "Arabic",
          "an": "Aragonese",
          "hy": "Armenian",
          "as": "Assamese",
          "av": "Avaric",
          "ae": "Avestan",
          "ay": "Aymara",
          "az": "Azerbaijani",
          "bm": "Bambara",
          "ba": "Bashkir",
          "eu": "Basque",
          "be": "Belarusian",
          "bn": "Bengali (Bangla)",
          "bh": "Bihari",
          "bi": "Bislama",
          "bs": "Bosnian",
          "br": "Breton",
          "bg": "Bulgarian",
          "my": "Burmese",
          "ca": "Catalan",
          "ch": "Chamorro",
          "ce": "Chechen",
          "ny": "Chichewa, Chewa, Nyanja",
          "zh": "Chinese",
          "cv": "Chuvash",
          "kw": "Cornish",
          "co": "Corsican",
          "cr": "Cree",
          "hr": "Croatian",
          "cs": "Czech",
          "da": "Danish",
          "dv": "Divehi, Dhivehi, Maldivian",
          "nl": "Dutch",
          "dz": "Dzongkha",
          "en": "English",
          "eo": "Esperanto",
          "et": "Estonian",
          "ee": "Ewe",
          "fo": "Faroese",
          "fj": "Fijian",
          "fi": "Finnish",
          "fr": "French",
          "ff": "Fula, Fulah, Pulaar, Pular",
          "gl": "Galician",
          "gd": "Gaelic (Scottish)",
          "gv": "Gaelic (Manx)",
          "ka": "Georgian",
          "de": "German",
          "el": "Greek",
          "kl": "Greenlandic",
          "gn": "Guarani",
          "gu": "Gujarati",
          "ht": "Haitian Creole",
          "ha": "Hausa",
          "he": "Hebrew",
          "hz": "Herero",
          "hi": "Hindi",
          "ho": "Hiri Motu",
          "hu": "Hungarian",
          "is": "Icelandic",
          "io": "Ido",
          "ig": "Igbo",
          "id": "Indonesian",
          "ia": "Interlingua",
          "ie": "Interlingue",
          "iu": "Inuktitut",
          "ik": "Inupiak",
          "ga": "Irish",
          "it": "Italian",
          "ja": "Japanese",
          "jv": "Javanese",
          "kn": "Kannada",
          "kr": "Kanuri",
          "ks": "Kashmiri",
          "kk": "Kazakh",
          "km": "Khmer",
          "ki": "Kikuyu",
          "rw": "Kinyarwanda (Rwanda)",
          "rn": "Kirundi",
          "ky": "Kyrgyz",
          "kv": "Komi",
          "kg": "Kongo",
          "ko": "Korean",
          "ku": "Kurdish",
          "kj": "Kwanyama",
          "lo": "Lao",
          "la": "Latin",
          "lv": "Latvian (Lettish)",
          "li": "Limburgish (Limburger)",
          "ln": "Lingala",
          "lt": "Lithuanian",
          "lu": "Luga-Katanga",
          "lg": "Luganda, Ganda",
          "lb": "Luxembourgish",
          "mk": "Macedonian",
          "mg": "Malagasy",
          "ms": "Malay",
          "ml": "Malayalam",
          "mt": "Maltese",
          "mi": "Maori",
          "mr": "Marathi",
          "mh": "Marshallese",
          "mo": "Moldavian",
          "mn": "Mongolian",
          "na": "Nauru",
          "nv": "Navajo",
          "ng": "Ndonga",
          "nd": "Northern Ndebele",
          "ne": "Nepali",
          "no": "Norwegian",
          "nb": "Norwegian bokmål",
          "nn": "Norwegian nynorsk",
          "ii": "Nuosu",
          "oc": "Occitan",
          "oj": "Ojibwe",
          "cu": "Old Church Slavonic, Old Bulgarian",
          "or": "Oriya",
          "om": "Oromo (Afaan Oromo)",
          "os": "Ossetian",
          "pi": "Pāli",
          "ps": "Pashto, Pushto",
          "fa": "Persian (Farsi)",
          "pl": "Polish",
          "pt": "Portuguese",
          "pa": "Punjabi (Eastern)",
          "qu": "Quechua",
          "rm": "Romansh",
          "ro": "Romanian",
          "ru": "Russian",
          "se": "Sami",
          "sm": "Samoan",
          "sg": "Sango",
          "sa": "Sanskrit",
          "sr": "Serbian",
          "sh": "Serbo-Croatian",
          "st": "Sesotho",
          "tn": "Setswana",
          "sn": "Shona",
          "sd": "Sindhi",
          "si": "Sinhalese",
          "ss": "Siswati",
          "sk": "Slovak",
          "sl": "Slovenian",
          "so": "Somali",
          "nr": "Southern Ndebele",
          "es": "Spanish",
          "su": "Sundanese",
          "sw": "Swahili (Kiswahili)",
          "sv": "Swedish",
          "tl": "Tagalog",
          "ty": "Tahitian",
          "tg": "Tajik",
          "ta": "Tamil",
          "tt": "Tatar",
          "te": "Telugu",
          "th": "Thai",
          "bo": "Tibetan",
          "ti": "Tigrinya",
          "to": "Tonga",
          "ts": "Tsonga",
          "tr": "Turkish",
          "tk": "Turkmen",
          "tw": "Twi",
          "ug": "Uyghur",
          "uk": "Ukrainian",
          "ur": "Urdu",
          "uz": "Uzbek",
          "ve": "Venda",
          "vi": "Vietnamese",
          "vo": "Volapük",
          "wa": "Wallon",
          "cy": "Welsh",
          "wo": "Wolof",
          "fy": "Western Frisian",
          "xh": "Xhosa",
          "yi": "Yiddish",
          "yo": "Yoruba",
          "za": "Zhuang, Chuang",
          "zu": "Zulu"
        };

        /**
         * Initialize the language filter
         */
        let languageOptions = [];
        Object.keys(languages).forEach(key => {
          languageOptions.push({
            value: key,
            label: languages[key]
          });
        });

        const languageSelector = $(mainElement.querySelector('#filterLanguage')).selectize({
          delimiter: ',',
          persist: false,
          create: false,
          plugins: ['remove_button'],
          maxItems: null,
          placeholder: 'Filter by language. (Default: all)',
          valueField: 'value',
          labelField: 'label',
          searchField: 'label',
          options: languageOptions
        })[0].selectize;

        /**
         * Initialize the bloom taxonomy filter
         */
        let bloomTaxonomyOptions = [
          {
            value: 'Remember'
          },
          {
            value: 'Understand'
          },
          {
            value: 'Apply'
          },
          {
            value: 'Analyze'
          },
          {
            value: 'Evaluate'
          },
          {
            value: 'Create'
          }
        ];

        const bloomTaxonomySelector = $(mainElement.querySelector('#filterBloom')).selectize({
          persist: false,
          create: false,
          maxItems: 1,
          placeholder: 'Filter by Bloom’s Taxonomy. (Default: all)',
          valueField: 'value',
          labelField: 'value',
          searchField: 'value',
          options: bloomTaxonomyOptions
        })[0].selectize;

        /**
         * Initialize the software license filter
         */
        const softwareLicenseOptions = [
          {
            value: 'MIT',
            label: '﻿﻿MIT License (MIT)'
          },
          {
            value: 'AGPL',
            label: '﻿GNU Affero General Public License (﻿AGPL)'
          },
          {
            value: 'GPL',
            label: '﻿GNU General Public License (﻿GPL)'
          },
          {
            value: 'LGPL',
            label: '﻿GNU Lesser General Public License (﻿LGPL)'
          },
          {
            value: 'MPL',
            label: '﻿﻿Mozilla Public License (MPL)'
          },
          {
            value: 'Apache',
            label: '﻿﻿Apache License (Apache)'
          },
          {
            value: 'Unlicense',
            label: '﻿The Unlicense (﻿Unlicense)'
          }
        ];

        const softwareLicenseSelector = $(mainElement.querySelector('#filterLicenseSoftware')).selectize({
          persist: false,
          create: false,
          maxItems: 1,
          placeholder: 'Select a software license (Default: All)',
          valueField: 'value',
          labelField: 'label',
          searchField: 'label',
          options: softwareLicenseOptions
        })[0].selectize;

        /**
         * Initialize the content license filter
         */
        const contentLicenseOptions = [
          {
            value: 'CC-BY-4.0',
            label: '﻿﻿Creative Commons Attribution 4.0 International (CC-BY-4.0)'
          },
          {
            value: 'CC-BY-SA-4.0',
            label: '﻿﻿﻿Creative Commons Attribution Share Alike 4.0 International (﻿CC-BY-SA-4.0)'
          },
          {
            value: 'CC-BY-ND-4.0',
            label: '﻿﻿﻿﻿Creative Commons Attribution No Derivatives 4.0 International (﻿CC-BY-ND-4.0)'
          },
          {
            value: 'CC-BY-NC-4.0',
            label: '﻿Creative Commons Attribution Non Commercial 4.0 International (﻿CC-BY-NC-4.0)'
          },
          {
            value: 'CC-BY-NC-SA-4.0',
            label: '﻿Creative Commons Attribution Non Commercial Share Alike 4.0 International (﻿CC-BY-NC-SA-4.0)'
          },
          {
            value: 'CC-BY-NC-ND-4.0',
            label: '﻿Creative Commons Attribution Non Commercial No Derivatives 4.0 International﻿ (﻿CC-BY-NC-ND-4.0)'
          }
        ];

        const contentLicenseSelector = $(mainElement.querySelector('#filterLicenseContent')).selectize({
          persist: false,
          create: false,
          maxItems: 1,
          placeholder: 'Select a content license (Default: All)',
          valueField: 'value',
          labelField: 'label',
          searchField: 'label',
          options: contentLicenseOptions
        })[0].selectize;

        mainElement.querySelector('#sortSelector').addEventListener('input', function () {
          filter.sort = this.value;
          showSpinner();
          sortRegistryData();
          displayResources();
        });

        mainElement.querySelector('#previousPage').addEventListener('click', function(event) {
          event.preventDefault();
          paginationStartIndex = paginationStartIndex - itemsPerPage;
          if (paginationStartIndex < 0) {
            paginationStartIndex = 0;
          }
          displayResources(true);
        });

        mainElement.querySelector('#nextPage').addEventListener('click', function(event) {
          event.preventDefault();
          paginationStartIndex = paginationStartIndex + itemsPerPage;
          displayResources(true);
        });

        function rerenderPagingButtons(data) {
          if (paginationStartIndex === 0) {
            mainElement.querySelector('#previousPage').parentNode.classList.add('disabled');
          } else {
            mainElement.querySelector('#previousPage').parentNode.classList.remove('disabled');
          }
          if ((paginationStartIndex + itemsPerPage) >= data.length) {
            mainElement.querySelector('#nextPage').parentNode.classList.add('disabled');
          } else {
            mainElement.querySelector('#nextPage').parentNode.classList.remove('disabled');
          }
        }

        function sortRegistryData() {
          switch (filter.sort) {
            case 'dateNewOld':
              registryData.sort((a, b) => {
                const {firstDate, secondDate} = getDateObjectsFromStrings(a, b);
                if (firstDate < secondDate) {
                  return -1;
                }
                if (firstDate > secondDate) {
                  return 1;
                }
                return -1;
              });
              break;
            case 'dateOldNew':
              registryData.sort((a, b) => {
                const {firstDate, secondDate} = getDateObjectsFromStrings(a, b);
                if (firstDate > secondDate) {
                  return -1;
                }
                if (firstDate < secondDate) {
                  return 1;
                }
                return -1;
              });
              break;
            case 'nameAZ':
              registryData.sort((a, b) => {
                return a.metadata.title.localeCompare(b.metadata.title);
              });
              break;
            case 'nameZA':
              registryData.sort((a, b) => {
                return b.metadata.title.localeCompare(a.metadata.title);
              });
              break;
            case 'creatorAZ':
              registryData.sort((a, b) => {
                return a.metadata.creator.localeCompare(b.metadata.creator);
              });
              break;
            case 'creatorZA':
              registryData.sort((a, b) => {
                return b.metadata.creator.localeCompare(a.metadata.creator);
              });
              break;
            default:
              console.log('Unknown sort');
              break;
          }

          function getDateObjectsFromStrings(a, b) {
            let firstDateParams = a.metadata.date.split('-');
            firstDateParams = firstDateParams.map(num => parseInt(num, 10));
            let secondDateParams = b.metadata.date.split('-');
            secondDateParams = secondDateParams.map(num => parseInt(num, 10));
            return {
              firstDate: new Date(firstDateParams[0], firstDateParams[1] - 1, firstDateParams[2]),
              secondDate: new Date(secondDateParams[0], secondDateParams[1] - 1, secondDateParams[2])
            };
          }
        }

        /**
         * Trigger a search by clicking on the search button or hitting the enter key while in search term input
         */
        mainElement.querySelector('#buttonSearch').addEventListener('click', function (event) {
          event.preventDefault();
          displayResources();
        });
        mainElement.querySelector('#searchTerm').addEventListener('keyup', function (event) {
          event.preventDefault();
          if (event.keyCode === 13) {
            displayResources();
          }
        });

        categorySelector.on('change', () => {
          const category = categorySelector.getValue();
          if (category === 'All categories') {
            filter.category = '';
          } else {
            filter.category = categorySelector.getValue();
          }
          displayResources();
        });
        tagSelector.on('change', () => {
          filter.tags = tagSelector.getValue();
          displayResources();
        });
        languageSelector.on('change', () => {
          filter.languages = languageSelector.getValue();
          displayResources();
        });
        bloomTaxonomySelector.on('change', () => {
          filter.bloom = bloomTaxonomySelector.getValue();
          displayResources();
        });
        softwareLicenseSelector.on('change', () => {
          filter.licenseSoftware = softwareLicenseSelector.getValue();
          displayResources();
        });
        contentLicenseSelector.on('change', () => {
          filter.licenseContent = contentLicenseSelector.getValue();
          displayResources();
        });

        window.addEventListener('hashchange', function() {
          /**
           * Note:
           * This event is fired every time the hash changes.
           * In this component we want to use this behaviour to detect,
           * if the user hit the browser back or forward button.
           */
          const urlHash = window.location.hash.substr(1);
          if (!urlHash.includes('displaymetadata')) {
            // Show finder
            mainElement.querySelector('#resource_finder').style.display = 'block';

            clearResourceDisplay();
          } else {
            displayOneResource();
          }
        });

        let urlHash = window.location.hash.substr(1);
        if (urlHash !== '') {
          const hashParameters = urlHash.split('&');
          hashParameters.forEach(parameter => {
            const key = parameter.split('=')[0];
            const value = parameter.split('=')[1];
            switch (key) {
              case 'displaymetadata':
                displayOneResource();
                break;
              case 'demofullscreen':
                break;
              default:
                //console.log(`Unknown URL parameter: ${key}`);
            }
          });
        }

        loadRegistry()
          .then(data => {
            const begin = performance.now() - startTime;
            registryData = data;
            //sortRegistryData();
            const sortFinished = performance.now() - startTime;
            fillInTags();
            const fillInTagsFinished = performance.now() - startTime;
            displayResources();
            const performanceTime = performance.now() - startTime;
            mainElement.querySelector('#performanceOutput').innerHTML = `${begin}, ${sortFinished}, ${fillInTagsFinished}, ${performanceTime}`;
            console.log(`${performanceTime} ms`);
            /*data.forEach(value => {
              registryData.push(value);
            });*/
            // Load all metadata
            /*Promise.all(registryData.map(fetchMetadata))
              .then(() => {
                sortRegistryData();
                fillInTags();
                displayResources();
                console.log(`${performance.now() - startTime} ms`);
              });*/
            /*const BATCH_SIZE = 20;

            let promiseChain = Promise.resolve();
            for(let i = 0; i < registryData.length; i += BATCH_SIZE) {
              promiseChain = promiseChain
                .then(() => Promise.all(
                  registryData
                    .slice(i, i + BATCH_SIZE)
                    .map((object, index) => fetchMetadata(object, i + index))
                ));
            }

            promiseChain.then(() => {
              sortRegistryData();
              fillInTags();
              displayResources();
              console.log(`${performance.now() - startTime} ms`);
              console.log(registryData);
            });*/

          })
          .catch(error => {
            console.log(error.message);
            hideSpinner();
          });

        async function loadRegistry() {
          startTime = performance.now();
          const response = await fetch(self.registry);
          return await response.json();
        }

        /*async function fetchMetadata(object, index) {
          const data = await fetch(object.metadata);
          const content = await data.json();
          if (content.metaFormat === 'ccm-meta' && content.metaVersion === '1.0.0') {
            const metaURL = registryData[index].metadata;
            registryData[index].metadata = content;
            registryData[index].metadataURL = metaURL;
          } else {
            delete registryData[index].metadata;
          }
        }*/

        function fillInTags() {
          const possibleTags = new Set();
          registryData.forEach(entry => {
            if (entry.metadata.tags) {
              entry.metadata.tags.split(/[ ,]+/).forEach(tag => {
                possibleTags.add(tag);
              });
            }
          });

          const tagOptions = [];

          possibleTags.forEach(possibleTag => {
            tagOptions.push({
              value: possibleTag
            });
          });

          tagSelector.clearOptions();
          tagSelector.load(function(callback) {
            callback(tagOptions);
          });
        }

        function displayResources(withoutPaginationReset) {
          showSpinner();
          clearSearchResults();
          const data = applyAllFilters(registryData);

          if (!withoutPaginationReset) {
            paginationStartIndex = 0;
          }

          rerenderPagingButtons(data);

          for (let i = paginationStartIndex; i < Math.min(paginationStartIndex + itemsPerPage, data.length); i++) {
            let object = data[i];
            if (object.metadata) {
              if (!object.metadata.title) object.metadata.title = '-';
              if (!object.metadata.creator) object.metadata.creator = '-';
              if (!object.metadata.date) object.metadata.date = '-';
              mainElement.querySelector('#searchResults').innerHTML += `
                <div class="panel panel-default searchResult resourceCard" data-metaurl="${object.metadataURL}">
                  <div class="panel-body" style="width: 100%;">
                    <h4 style="margin-top: 0;" class="containText">${object.metadata.title}</h4>
                    <span class="containText">${object.metadata.creator}</span><span class="pull-right containText">${object.metadata.date}</span>
                  </div>
                </div>
              `;
            }
          }

          // Add event listeners to the resource cards
          mainElement.querySelectorAll('.resourceCard').forEach(card => {
            card.addEventListener('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
              navigateToResource(getResourceMetaURL(event.target));
            });
          });

          hideSpinner();
        }

        /**
         * Recursively check parent nodes for meta url
         * @param node
         */
        function getResourceMetaURL(node) {
          if (node.dataset.metaurl) {
            return node.dataset.metaurl;
          } else {
            return getResourceMetaURL(node.parentNode);
          }
        }

        function applyAllFilters(data) {
          let filteredData = self.ccm.helper.clone(data);

          const searchTerm = mainElement.querySelector('#searchTerm').value;
          if (searchTerm !== '') {
            filteredData = searchByText(searchTerm, filteredData);
          }

          if (filter.category !== '') {
            filteredData = searchByCategory(filter.category, filteredData);
          }
          if (filter.tags.length !== 0) {
            filteredData = searchByTags(filter.tags, filteredData);
          }
          if (filter.languages.length !== 0) {
            filteredData = searchByLanguages(filter.languages, filteredData);
          }
          if (filter.bloom.length !== 0) {
            filteredData = searchByBloom(filter.bloom, filteredData);
          }
          if (filter.licenseSoftware !== '') {
            filteredData = searchByLicenseSoftware(filter.licenseSoftware, filteredData);
          }
          if (filter.licenseContent !== '') {
            filteredData = searchByLicenseContent(filter.licenseContent, filteredData);
          }

          return filteredData;
        }

        /**
         * Takes in an object of resources and returns an object of all matching ones
         * @param text
         * @param data
         * @returns {*}
         */
        function searchByText(text, data) {
          const matchingData = self.ccm.helper.clone(data);

          let searchIndex = elasticlunr(function () {
            this.addField('title');
            this.addField('description');
            this.addField('subject');
            this.setRef('id');
            this.saveDocument(false);
          });

          matchingData.forEach((element, index) => {
            searchIndex.addDoc({
              "title": element.metadata.title,
              "description": element.metadata.description,
              "subject": element.metadata.subject,
              "id": index
            });
          });

          const searchResults = searchIndex.search(text, {
            fields: {
              "title": {
               boost: 10,
               expand: true
              },
              "description": {
                expand: true
              },
              "subject": {
                expand: true
              }
            }
          });

          let searchResultIndexes = [];
          searchResults.forEach(result => {
            searchResultIndexes.push(parseInt(result.ref));
          });

          let index = matchingData.length;
          while(index--) {
            if (
              searchResultIndexes.includes(index)
            ) {} else {
              matchingData.splice(index, 1);
            }
          }

          return matchingData;
        }

        /**
         * Takes in an object of resources and returns an object of all matching ones
         * @param category
         * @param data
         * @returns {*}
         */
        function searchByCategory(category, data) {
          let matchingData = self.ccm.helper.clone(data);

          let index = matchingData.length;
          while(index--) {
            if (
              matchingData[index].metadata.category === category
            ) {} else {
              matchingData.splice(index, 1);
            }
          }

          return matchingData;
        }

        /**
         * Takes in an object of resources and returns an object of all matching ones
         * @param tags
         * @param data
         * @returns {*}
         */
        function searchByTags(tags, data) {
          let matchingData = self.ccm.helper.clone(data);

          let index = matchingData.length;
          while(index--) {
            tags.some(tag => {
              if (!matchingData[index].metadata.tags.includes(tag)) {
                matchingData.splice(index, 1);
                return true;
              }
            });
          }

          return matchingData;
        }

        /**
         * Takes in an object of resources and returns an object of all matching ones
         * @param languages
         * @param data
         * @returns {*}
         */
        function searchByLanguages(languages, data) {
          let matchingData = self.ccm.helper.clone(data);

          let index = matchingData.length;
          while(index--) {
            languages.some(language => {
              if (!matchingData[index].metadata.language.includes(language)) {
                matchingData.splice(index, 1);
                return true;
              }
            });
          }

          return matchingData;
        }

        /**
         * Takes in an object of resources and returns an object of all matching ones
         * @param bloom
         * @param data
         * @returns {*}
         */
        function searchByBloom(bloom, data) {
          let matchingData = self.ccm.helper.clone(data);

          let index = matchingData.length;
          while(index--) {
            if (
              matchingData[index].metadata.bloomTaxonomy === bloom
            ) {} else {
              matchingData.splice(index, 1);
            }
          }

          return matchingData;
        }

        /**
         * Takes in an object of resources and returns an object of all matching ones
         * @param license
         * @param data
         * @returns {*}
         */
        function searchByLicenseSoftware(license, data) {
          let matchingData = self.ccm.helper.clone(data);

          let index = matchingData.length;
          while(index--) {
            if (
              matchingData[index].metadata.license.software === license
            ) {} else {
              matchingData.splice(index, 1);
            }
          }

          return matchingData;
        }

        /**
         * Takes in an object of resources and returns an object of all matching ones
         * @param license
         * @param data
         * @returns {*}
         */
        function searchByLicenseContent(license, data) {
          let matchingData = self.ccm.helper.clone(data);

          let index = matchingData.length;
          while(index--) {
            if (
              matchingData[index].metadata.license.content === license
            ) {} else {
              matchingData.splice(index, 1);
            }
          }

          return matchingData;
        }

        function navigateToResource(url) {
          addParameterToURLHash('displaymetadata', url);
        }

        function displayOneResource() {
          clearResourceDisplay();

          // Hide finder
          mainElement.querySelector('#resource_finder').style.display = 'none';

          // Create instance of the resource display
          self.resource_display.start({}, instance => {
            mainElement.querySelector('#resourceDisplaySpace').appendChild(instance.root);
          });
        }

        function clearSearchResults() {
          mainElement.querySelector('#searchResults').innerHTML = '';
        }

        function clearResourceDisplay() {
          mainElement.querySelector('#resourceDisplaySpace').innerHTML = '';
        }

        function showSpinner() {
          mainElement.querySelector('#spinner').style.display = 'block';
        }

        function hideSpinner() {
          mainElement.querySelector('#spinner').style.display = 'none';
        }

        function addParameterToURLHash(key, value) {
          if (window.location.hash.substr(1).includes(`${key}=${value}`)) return;

          if (window.location.hash.substr(1) === '') {
            window.location.hash = `${key}=${value}`;
          } else {
            window.location.hash += `&${key}=${value}`;
          }
        }

        if ( callback ) callback();
      };

    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
