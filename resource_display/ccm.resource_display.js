/**
 * @overview Display a resource
 * @author Leon Eck <leon.eck@smail.inf.h-brs.de> 2018
 * @license The MIT License (MIT)
 */

{

  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'resource_display',

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
                <div id="resourceDisplayArea" class="col-xs-12">
                </div>
              </div>
              `
            }
          ]
        }
      },
      css: [ 'ccm.load', 'https://ccmjs.github.io/leck-components/css/bootstrap.min.css', 'https://ccmjs.github.io/leck-components/css/default.css' ],
      no_bootstrap_container: false // Set to true if embedded on a site that already has a bootstrap container div
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
       * Stores the metadata of the resource, that should be displayed
       * @type {{}}
       */
      let metadataStore = {};

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

        const mainElement = this.ccm.helper.html(this.html.main, {
        });
        this.element.appendChild(mainElement);

        let urlHash = window.location.hash.substr(1);
        if (urlHash !== '') {
          const hashParameters = urlHash.split('&');
          hashParameters.forEach(parameter => {
            const key = parameter.split('=')[0];
            const value = parameter.split('=')[1];
            switch (key) {
              case 'displaymetadata':
                loadResource(value);
                break;
              default:
                console.log(`Unknown URL parameter: ${key}`);
            }
          });
        }

        /**
         * Display resource
         * @param url URL to the metadata file
         */
        function loadResource(url) {
          fetchMetadata(url)
            .then(metadata => {
              metadataStore = metadata;
              renderResourceInformation();
              startResourceDemo();
            });
        }

        async function fetchMetadata(url) {
          const data = await fetch(url);
          return await data.json();
        }

        function startResourceDemo() {
          if (!metadataStore['path-component'] || !metadataStore['path-config'] || !metadataStore['config-key']) {
            return;
          }

          self.ccm.get(metadataStore['path-config'], metadataStore['config-key'], config => {
            self.ccm.instance(metadataStore['path-component'], config, instance => {
              const appDemoSpace = mainElement.querySelector('#appDemoSpace');
              appDemoSpace.style.border = '1px solid rgba(0,0,0,.5)';
              appDemoSpace.appendChild(instance.root);
              let componentTag = instance.index.split('-');
              componentTag.pop();
              componentTag = componentTag.join('-');
              displayEmbedCode(componentTag);
              instance.start();
            });
          });
        }

        function displayEmbedCode(componentTag) {
          const embedCodeArea = mainElement.querySelector('#embedCodeArea');
          if (!embedCodeArea) return;

          if (metadataStore['path-component'] && metadataStore['path-config'] && metadataStore['config-key']) {
            const embedCode = `&lt;script src=&quot;${metadataStore['path-component']}&quot;&gt;&lt;/script&gt;
&lt;ccm-${componentTag} key='[&quot;ccm.get&quot;,&quot;${metadataStore['path-config']}&quot;,&quot;${metadataStore['config-key']}&quot;]'&gt;&lt;/ccm-${componentTag}&gt;`;
            embedCodeArea.innerHTML = `
              <form>
                <div class="form-group top-buffer">
                  <label for="embedCodeDisplay">Embed Code</label>
                  <div class="input-group">
                    <span class="input-group-btn">
                      <button class="btn btn-success copyToClipboardButtonEmbed" type="button" data-copytext="${embedCode}">Copy</button>
                    </span>
                    <input type="text" class="form-control" id="embedCodeDisplay" readonly value="${embedCode}">
                  </div>
                </div>
              </form>
            `;

            addCopyEventListeners('copyToClipboardButtonEmbed');
          }
        }

        function renderResourceInformation() {
          const displayArea = mainElement.querySelector('#resourceDisplayArea');
          // Replace values that are not present with " - "
          if (!metadataStore.title) metadataStore.title = '-';
          if (!metadataStore.version) metadataStore.version = '-';
          if (!metadataStore.date) metadataStore.date = '-';
          if (!metadataStore.description) metadataStore.description = '-';
          if (!metadataStore.identifier) metadataStore.identifier = '-';
          displayArea.innerHTML = '';
          let newDisplay = '';

          newDisplay += `
            <style>
              .additionalInfoHeader {
                font-size: 1rem;
                color: rgba(0,0,0,.5);
                font-weight: 500;
              }
              .additionalInfoValue {
                margin-bottom: 0 !important;
              }
            </style>`;

          newDisplay += `
            <div class="row">
              <div class="col-xs-4">
                <h2>${metadataStore.title}<br><small>Version: ${metadataStore.version}&nbsp;•&nbsp;Published:  ${metadataStore.date}</small></h2>
              </div>
              <div class="col-xs-8" id="embedCodeArea">
              </div>
            </div>`;

          newDisplay += `
            <div class="row">
              <div class="col-md-7">
                <h4>Description</h4>
                <div style="white-space: pre-line; margin-bottom: 20px;">${metadataStore.description}</div>
                <h4>Demo</h4>
                <div id="appDemoSpace" style="margin-bottom: 20px;"></div>
              </div>
              <div class="col-md-5">`;

          newDisplay += `
                <table class="table">
                  <caption>Additional information <a href="mailto:developer@ccmjs.eu?subject=Issue%20with%20${metadataStore.identifier}&body=Here%20is%20some%20additional%20information%3A" class="text-danger pull-right"><span>&#9873;</span> Report issue</a></caption>
                  <tbody>`;

          if (metadataStore.license && metadataStore.license.content && metadataStore.license.software) {
            newDisplay += `
              <tr>
                <td>
                  <div class="additionalInfoHeader">Content-License</div>
                  <div class="h4 additionalInfoValue">${metadataStore.license.content}</div>
                </td>
                <td>
                  <div class="additionalInfoHeader">Software-License</div>
                  <div class="h4 additionalInfoValue">${metadataStore.license.software}</div>
                </td>
              </tr>
            `;
          } else if (metadataStore.license && metadataStore.license.content) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Content-License</div>
                  <div class="h4 additionalInfoValue">${metadataStore.license.content}</div>
                </td>
              </tr>
            `;
          } else if (metadataStore.license && metadataStore.license.software) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Software-License</div>
                  <div class="h4 additionalInfoValue">${metadataStore.license.software}</div>
                </td>
              </tr>
            `;
          }

          if (metadataStore.subject && metadataStore.category) {
            newDisplay += `
              <tr>
                <td>
                  <div class="additionalInfoHeader">Subject</div>
                  <div class="h4 additionalInfoValue">${metadataStore.subject}</div>
                </td>
                <td>
                  <div class="additionalInfoHeader">Category</div>
                  <div class="h4 additionalInfoValue">${metadataStore.category}</div>
                </td>
              </tr>
            `;
          } else if (metadataStore.subject) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Subject</div>
                  <div class="h4 additionalInfoValue">${metadataStore.subject}</div>
                </td>
              </tr>
            `;
          } else if (metadataStore.category) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Category</div>
                  <div class="h4 additionalInfoValue">${metadataStore.category}</div>
                </td>
              </tr>
            `;
          }

          if (metadataStore.tags) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Tags</div>
                  <div class="h4 additionalInfoValue">${metadataStore.tags}</div>
                </td>
              </tr>
            `;
          }

          if (metadataStore.language) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Languages</div>
                  <div class="h4 additionalInfoValue">`;

            let languageDisplay = [];
            metadataStore.language.split(/[ ,]+/).forEach(lang => {
              languageDisplay.push(languages[lang]);
            });
            newDisplay += languageDisplay.join(', ');

            newDisplay += `
                  </div>
                </td>
              </tr>
            `;
          }

          if (metadataStore.bloomTaxonomy) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Bloom’s Taxonomy</div>
                  <div class="h4 additionalInfoValue">${metadataStore.bloomTaxonomy}</div>
                </td>
              </tr>
            `;
          }

          if (metadataStore.creator && metadataStore.contributor) {
            newDisplay += `
              <tr>
                <td>
                  <div class="additionalInfoHeader">Creator</div>
                  <div class="h4 additionalInfoValue">${metadataStore.creator}</div>
                </td>
                <td>
                  <div class="additionalInfoHeader">Contributor</div>
                  <div class="h4 additionalInfoValue">${metadataStore.contributor}</div>
                </td>
              </tr>
            `;
          } else if (metadataStore.creator) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Creator</div>
                  <div class="h4 additionalInfoValue">${metadataStore.creator}</div>
                </td>
              </tr>
            `;
          } else if (metadataStore.contributor) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Contributor</div>
                  <div class="h4 additionalInfoValue">${metadataStore.contributor}</div>
                </td>
              </tr>
            `;
          }

          if (metadataStore.publisher) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">Publisher</div>
                  <div class="h4 additionalInfoValue">${metadataStore.publisher}</div>
                </td>
              </tr>
            `;
          }

          newDisplay += `
              </tbody>
            </table>
          `;

          if (metadataStore['path-component']) {
            newDisplay += `
              <form>
                <div class="form-group">
                  <label for="urlToComponent">URL to component</label>
                  <div class="input-group">
                    <input type="text" class="form-control" id="urlToComponent" readonly value="${metadataStore['path-component']}">
                    <span class="input-group-btn">
                      <button class="btn btn-default copyToClipboardButtonInfo" type="button" data-copytext="${metadataStore['path-component']}">Copy</button>
                    </span>
                  </div>
                </div>
              </form>
            `;
          }

          if (metadataStore['path-config'] && metadataStore['config-key']) {
            newDisplay += `
              <form>
                <div class="form-group">
                  <label for="urlToConfigAndKey">Config-Key and URL to configuration file</label>
                  <div class="input-group">
                    <span class="input-group-addon"><kbd>${metadataStore['config-key']}</kbd></span>
                    <input type="text" class="form-control" id="urlToConfigAndKey" readonly value="${metadataStore['path-config']}">
                    <span class="input-group-btn">
                      <button class="btn btn-default copyToClipboardButtonInfo" type="button" data-copytext="${metadataStore['path-config']}">Copy</button>
                    </span>
                  </div>
                </div>
              </form>
            `;
          }

          newDisplay +=`
              </div>
            </div>
          `;

          displayArea.innerHTML = newDisplay;

          addCopyEventListeners('copyToClipboardButtonInfo');
        }

        function addCopyEventListeners(className) {
          mainElement.querySelectorAll(`.${className}`).forEach(button => {
            button.addEventListener('click', function(event) {
              event.preventDefault();
              copyToClipboard(event.target.dataset.copytext);
            });
          });
        }

        // https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
        function copyToClipboard(str) {
          const el = document.createElement('textarea');  // Create a <textarea> element
          el.value = str;                                 // Set its value to the string that you want copied
          el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
          el.style.position = 'absolute';
          el.style.left = '-9999px';                      // Move outside the screen to make it invisible
          document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
          const selected =
            document.getSelection().rangeCount > 0        // Check if there is any content selected previously
              ? document.getSelection().getRangeAt(0)     // Store selection if found
              : false;                                    // Mark as false to know no selection existed before
          el.select();                                    // Select the <textarea> content
          document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
          document.body.removeChild(el);                  // Remove the <textarea> element
          if (selected) {                                 // If a selection existed before copying
            document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
            document.getSelection().addRange(selected);   // Restore the original selection
          }
        }

        if ( callback ) callback();
      };

    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
