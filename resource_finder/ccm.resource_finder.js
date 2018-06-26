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
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12">
                  <div class="panel panel-default">
                    <div class="panel-body">
                      TODO: Search results
                    </div>
                  </div>
                </div>
              </div>
              `
            }
          ]
        }
      },
      css: [ 'ccm.load', [ '../css/bootstrap.min.css', '../css/selectize.default.min.css', '../css/default.css' ] ],
      js: [ 'ccm.load', [ '../js/jquery.min.js', '../js/bootstrap.min.js', '../js/selectize.min.js' ] ],
      no_bootstrap_container: false, // Set to true if embedded on a site that already has a bootstrap container div
      tags: ['HTML', 'JavaScript', 'CSS', 'Education'], // Tags the user can choose from
      categories: ['Art', 'Computer Science', 'Economy', 'History'], // Categories the user can choose from
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
         * Initialize the category input
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
         * Initialize the tag input
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
         * Initialize the language input
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
         * Initialize the bloom taxonomy input
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




        if ( callback ) callback();
      };

    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
