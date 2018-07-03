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
    ccm: '../js/ccm-16.6.1.js',

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
              "inner": `
              <div id="spinner" class="spinner popup no-margin">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
              </div>
              <div class="row">
                <div class="col-md-3">
                  <select id="searchCategory"></select>
                </div>
                <div class="col-md-9">
                  <div class="input-group">
                    <input type="text" class="form-control" id="searchTerm" placeholder="Search">
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
                            <select id="filterBloom" multiple></select>
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
                  <div class="panel panel-default">
                    <div id="searchResults" class="panel-body">
                    </div>
                  </div>
                </div>
              </div>
              `
            }
          ]
        }
      },
      css: [ 'ccm.load', [ '../css/bootstrap.min.css', '../css/selectize.default.min.css', '../css/default.css', './main.css' ] ],
      js: [ 'ccm.load', [ '../js/jquery.min.js', '../js/bootstrap.min.js', '../js/selectize.min.js' ] ],
      no_bootstrap_container: false, // Set to true if embedded on a site that already has a bootstrap container div
      tags: ['HTML', 'JavaScript', 'CSS', 'Education'], // Tags the user can choose from
      categories: ['Art', 'Computer Science', 'Economy', 'History'], // Categories the user can choose from
      registry: "../dms_data/registry.json", // Path to the registry file
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

      /**
       * Registry of all resources
       * @type {{}}
       */
      let registryData = {};

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
        let tagOptions = [];
        self.tags.forEach(tag => {
          tagOptions.push({
            value: tag
          });
        });

        const tagSelector = $(mainElement.querySelector('#filterTags')).selectize({
          delimiter: ',',
          persist: false,
          create: true,
          plugins: ['remove_button'],
          maxItems: null,
          placeholder: 'Filter by tags. (Default: all)',
          valueField: 'value',
          labelField: 'value',
          searchField: 'value',
          options: tagOptions
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
          delimiter: ',',
          persist: false,
          create: false,
          plugins: ['remove_button'],
          maxItems: null,
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

        loadRegistry()
          .then(data => {
            registryData = data;
            // Load all metadata that is not yet present as an object
            Promise.all(Object.keys(registryData).map(fetchMetadata))
              .then(() => {
                displayResources();
              });
          })
          .catch(error => console.log(error.message))
          .then(() => hideSpinner());

        async function loadRegistry() {
          const response = await fetch(self.registry);
          return await response.json();
        }

        async function fetchMetadata(key) {
          const data = await fetch(registryData[key].metadata);
          const content = await data.json();
          if (content.metaFormat === 'ccm-meta' && content.metaVersion === '1.0.0') {
            registryData[key].metadata = content;
          } else {
            delete registryData[key].metadata;
          }
        }

        function displayResources() {
          clearSearchResults();
          const data = applyAllFilters(registryData);
          Object.keys(data).forEach(key => {
            if (data[key].metadata) {
              mainElement.querySelector('#searchResults').innerHTML += `
                <div class="panel panel-default searchResult">
                  <div class="panel-body">
                    <h4>${data[key].metadata.title}</h4>
                  </div>
                </div>
              `;
            }
          });
        }

        function applyAllFilters(data) {
          let filteredData = self.ccm.helper.clone(data);

          const searchTerm = mainElement.querySelector('#searchTerm').value;
          if (searchTerm !== '') {
            filteredData = searchByText(searchTerm, filteredData);
          }

          // TODO: Alle weiteren Filter hier aufrufen, solange sie aktiv sind (also etwas anderes als der Default wert ausgewählt wurde)

          return filteredData;
        }

        /**
         * Takes in an object of resources and returns an object of all matching ones
         * @param text
         * @param data
         * @returns {*}
         */
        function searchByText(text, data) {
          let matchingData = self.ccm.helper.clone(data);

          Object.keys(matchingData).forEach(key => {
            if (
              matchingData[key].metadata.title.includes(text) ||
              matchingData[key].metadata.description.includes(text) ||
              matchingData[key].metadata.subject.includes(text)
            ) {} else {
              delete matchingData[key];
            }
          });

          return matchingData;
        }

        function clearSearchResults() {
          mainElement.querySelector('#searchResults').innerHTML = '';
        }

        function hideSpinner() {
          mainElement.querySelector('#spinner').style.display = 'none';
        }

        if ( callback ) callback();
      };

    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
