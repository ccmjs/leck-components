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
    version: [ 1, 0, 0 ],

    /**
     * recommended used framework version
     * @type {string}
     */
    ccm: 'https://ccmjs.github.io/leck-components/js/ccm-18.0.6.js',

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
                <div id="resourceDisplayArea" class="col-xs-12">
                </div>
              </div>
              <button id="closeFullscreenButton" class="btn btn-default" type="button" style="display: none; position: fixed; right: 0; top: 0; padding: 5px; z-index: 10000;"><span style="font-size: 1.5rem; line-height: 1;">X</span></button>
              `
            }
          ]
        }
      },
      css: [ 'ccm.load', 'https://ccmjs.github.io/leck-components/css/bootstrap.min.css', 'https://ccmjs.github.io/leck-components/css/default.css' ],
      js: [ 'ccm.load', [ 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js', 'https://ccmjs.github.io/leck-components/js/FileSaver.js', 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.0/qrcode.min.js' ] ],
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
       */
      this.start = async () => {

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
        
        mainElement.querySelector('#closeFullscreenButton').addEventListener('click', function(event) {
          event.preventDefault();
          closeFullscreenDemo();
        });

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
              case 'demofullscreen':
                /**
                 * Note: This gets handled after the resource is displayed
                 */
                break;
              default:
                //console.log(`Unknown URL parameter: ${key}`);
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
              createQRCodeForFullscreenDemo();
            })
            .catch(error => {
              console.log('loadResource error:', error);
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

          self.ccm.get(metadataStore['path-config'], metadataStore['config-key'])
            .then(config => {
              self.ccm.instance(metadataStore['path-component'], config)
                .then(instance => {
                  const appDemoSpace = mainElement.querySelector('#appDemoSpace');
                  appDemoSpace.style.border = '1px solid #ddd';
                  appDemoSpace.style.borderRadius = '4px';
                  appDemoSpace.style.boxShadow = '0 1px 1px rgba(0,0,0,.05)';
                  appDemoSpace.style.padding = '9px';
                  appDemoSpace.appendChild(instance.root);
                  let componentTag = instance.index.split('-');
                  componentTag.pop();
                  componentTag = componentTag.join('-');
                  displayEmbedCode(componentTag);
                  generateResourceDownloads(componentTag);
                  instance.start();
                });
            });
        }

        function createQRCodeForFullscreenDemo() {
          let fullscreenURL = window.location.href;
          if (!fullscreenURL.includes('demofullscreen=true')) {
            fullscreenURL += '&demofullscreen=true';
          }
          let demoQRCode = qrcode(0, 'M');
          demoQRCode.addData(fullscreenURL);
          demoQRCode.make();
          let qrCodeSVGTag = document.createElement('div');
          qrCodeSVGTag.innerHTML = demoQRCode.createSvgTag().trim();
          qrCodeSVGTag = qrCodeSVGTag.firstChild;
          mainElement.querySelector('#fullscreenDemoQRCodeArea').appendChild(qrCodeSVGTag);
        }

        function displayEmbedCode(componentTag) {
          const embedCodeArea = mainElement.querySelector('#embedCodeArea');
          if (!embedCodeArea) return;

          if (metadataStore['path-component'] && metadataStore['path-config'] && metadataStore['config-key']) {
            const embedCode = generateEmbedCode(componentTag);
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

        function generateEmbedCode(componentTag) {
          return `&lt;script src=&quot;${metadataStore['path-component']}&quot;&gt;&lt;/script&gt;
&lt;ccm-${componentTag} key='[&quot;ccm.get&quot;,&quot;${metadataStore['path-config']}&quot;,&quot;${metadataStore['config-key']}&quot;]'&gt;&lt;/ccm-${componentTag}&gt;`
        }

        function generateResourceDownloads(componentTag) {
          const resourceDownloadArea = mainElement.querySelector('#resourceDownloadArea');
          if (!resourceDownloadArea) return;

          if (!metadataStore['path-component'] || !metadataStore['path-config'] || !metadataStore['config-key']) {
            return;
          }

          resourceDownloadArea.innerHTML = `
            <div class="top-buffer">
              <a id="downloadAppButton" class="btn btn-primary btn-block" href="#" role="button" data-componenttag="${componentTag}">Download App</a>
              <div class="btn-group btn-group-justified" role="group">
                <a id="downloadWidgetButton" class="btn btn-warning" href="#" role="button" data-componenttag="${componentTag}">iBooks Author</a>
                <a id="downloadSCORMButton" class="btn btn-info" href="#" role="button" data-componenttag="${componentTag}">SCORM</a>
              </div>
            </div>
          `;

          resourceDownloadArea.querySelector('#downloadAppButton').addEventListener('click', function (event) {
            event.preventDefault();
            downloadApp(event.target.dataset.componenttag);
          });

          resourceDownloadArea.querySelector('#downloadWidgetButton').addEventListener('click', function (event) {
            event.preventDefault();
            downloadWidget(event.target.dataset.componenttag);
          });

          resourceDownloadArea.querySelector('#downloadSCORMButton').addEventListener('click', function (event) {
            event.preventDefault();
            downloadSCORM(event.target.dataset.componenttag);
          });
        }
        
        function downloadApp(componentTag) {
          showSpinner();
          fetch('https://ccmjs.github.io/leck-components/resource_display/resource/iBooksWidgetBoilerplate/index.html')
            .then(htmlFileBoilerplate => {
              htmlFileBoilerplate.text().then(htmlFileContent => {
                fetch(metadataStore['path-component'])
                  .then(componentFile => {
                    fetch(metadataStore['path-config'])
                      .then(configFile => {
                        let widgetZip = new JSZip();
                        widgetZip.file('index.html', replaceHtmlFileContent(htmlFileContent, componentTag));
                        widgetZip.file(getComponentFilename(), componentFile.blob());
                        widgetZip.file(getConfigFilename(), configFile.blob());
                        widgetZip.generateAsync({type: "blob"})
                          .then(function (content) {
                            hideSpinner();
                            saveAs(content, `${componentTag}.zip`);
                          });
                      });
                  });
              });
            });
        }

        function downloadWidget(componentTag) {
          showSpinner();
          fetch('https://ccmjs.github.io/leck-components/resource_display/resource/iBooksWidgetBoilerplate/index.html')
            .then(htmlFileBoilerplate => {
              htmlFileBoilerplate.text().then(htmlFileContent => {
                fetch('https://ccmjs.github.io/leck-components/resource_display/resource/iBooksWidgetBoilerplate/Info.plist')
                  .then(infoFile => {
                    fetch('https://ccmjs.github.io/leck-components/resource_display/resource/iBooksWidgetBoilerplate/Default.png')
                      .then(imageFile => {
                        fetch(metadataStore['path-component'])
                          .then(componentFile => {
                            fetch(metadataStore['path-config'])
                              .then(configFile => {
                                let widgetZip = new JSZip();
                                widgetZip.folder(`${componentTag}.wdgt`).file('index.html', replaceHtmlFileContent(htmlFileContent, componentTag));
                                widgetZip.folder(`${componentTag}.wdgt`).file('Info.plist', infoFile.blob());
                                widgetZip.folder(`${componentTag}.wdgt`).file('Default.png', imageFile.blob());
                                widgetZip.folder(`${componentTag}.wdgt`).file(getComponentFilename(), componentFile.blob());
                                widgetZip.folder(`${componentTag}.wdgt`).file(getConfigFilename(), configFile.blob());
                                widgetZip.generateAsync({type:"blob"})
                                  .then(function (content) {
                                    hideSpinner();
                                    saveAs(content, `${componentTag}.zip`);
                                  });
                              });
                          });
                      });
                  });
              });
            });
        }

        function downloadSCORM(componentTag) {
          showSpinner();
          const randomNumber = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
          fetch('https://ccmjs.github.io/leck-components/resource_display/resource/SCORMBoilerplate/index.html')
            .then(htmlFileBoilerplate => {
              htmlFileBoilerplate.text().then(htmlFileContent => {
                fetch('https://ccmjs.github.io/leck-components/resource_display/resource/SCORMBoilerplate/imsmanifest.xml')
                  .then(manifestFileBoilerplate => {
                    manifestFileBoilerplate.text().then(manifestFileContent => {
                      fetch('https://ccmjs.github.io/leck-components/resource_display/resource/SCORMBoilerplate/SCORM_API_wrapper.js')
                        .then(scormAPIFile => {
                          let widgetZip = new JSZip();
                          widgetZip.file('index.html', replaceHtmlFileContentSCORM(htmlFileContent, componentTag));
                          widgetZip.file('imsmanifest.xml', replaceManifestFileContentSCORM(manifestFileContent));
                          widgetZip.file('SCORM_API_wrapper.js', scormAPIFile.blob());
                          widgetZip.generateAsync({type: "blob"})
                            .then(function (content) {
                              hideSpinner();
                              saveAs(content, `ccm_SCORM_${randomNumber}.zip`);
                            });
                        });
                    });
                  });
              });
            });
        }

        function getComponentFilename() {
          return metadataStore['path-component'].split('/').pop();
        }

        function getConfigFilename() {
          return metadataStore['path-config'].split('/').pop();
        }

        function replaceHtmlFileContent(htmlFileContent, componentTag) {
          return htmlFileContent
            .replace('$$COMPONENT-FILE$$', getComponentFilename())
            .replace(/\$\$COMPONENT-TAG\$\$/g, componentTag)
            .replace('$$CONFIG-FILE$$', getConfigFilename())
            .replace('$$CONFIG-KEY$$', metadataStore['config-key']);
        }

        function replaceHtmlFileContentSCORM(htmlFileContent, componentTag) {
          const parser = new DOMParser;
          const tmpDomForParsing = parser.parseFromString(generateEmbedCode(componentTag), 'text/html');
          const decodedEmbedCode = tmpDomForParsing.body.textContent;
          return htmlFileContent
            .replace('$$TITLE$$', metadataStore['title'])
            .replace('$$EMBED-CODE$$', decodedEmbedCode);
        }

        function replaceManifestFileContentSCORM(manifestFileContent) {
          return manifestFileContent
            .replace('$$IDENTIFIER$$', metadataStore['title'])
            .replace('$$TITLE$$', metadataStore['title']);
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
              .fullscreen {
                position: fixed;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background: white;
                z-index: 9000;
                overflow: auto;
                -webkit-overflow-scrolling: touch;
              }
            </style>`;

          newDisplay += `
            <div class="row">
              <div class="col-sm-4">
                <h2>${metadataStore.title}<br><small>Version: ${metadataStore.version}&nbsp;•&nbsp;Published:  ${metadataStore.date}</small></h2>
              </div>
              <div class="col-sm-3" id="resourceDownloadArea">
              </div>
              <div class="col-sm-5" id="embedCodeArea">
              </div>
            </div>`;

          newDisplay += `
            <div class="row">
              <div class="col-md-7">
                <h4>Description</h4>
                <div style="white-space: pre-line; margin-bottom: 20px;">${metadataStore.description}</div>
                <h4>Demo <button id="demoToFullscreenButton" type="button" class="btn btn-default btn-xs pull-right">Fullscreen</button></h4>
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

          if (metadataStore['path-component'] && metadataStore['path-config'] && metadataStore['config-key']) {
            newDisplay += `
              <tr>
                <td colspan="2">
                  <div class="additionalInfoHeader">QR Code to fullscreen demo</div>
                  <div id="fullscreenDemoQRCodeArea"></div>
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

          hideSpinner();

          mainElement.querySelector('#demoToFullscreenButton').addEventListener('click', function(event) {
            event.preventDefault();
            showDemoFullscreen();
          });

          addCopyEventListeners('copyToClipboardButtonInfo');

          if (window.location.hash.substr(1).includes('demofullscreen=true')) {
            showDemoFullscreen();
          }
        }

        function showDemoFullscreen() {
          addParameterToURLHash('demofullscreen', 'true');
          mainElement.querySelector('#appDemoSpace').style.marginBottom = '0';
          mainElement.querySelector('#appDemoSpace').className = 'fullscreen';
          mainElement.querySelector('#closeFullscreenButton').style.display = 'block';
        }

        function closeFullscreenDemo() {
          removeParameterFromURLHash('demofullscreen');
          mainElement.querySelector('#appDemoSpace').style.marginBottom = '20px';
          mainElement.querySelector('#appDemoSpace').className = '';
          mainElement.querySelector('#closeFullscreenButton').style.display = 'none';
        }

        function addCopyEventListeners(className) {
          mainElement.querySelectorAll(`.${className}`).forEach(button => {
            button.addEventListener('click', function(event) {
              event.preventDefault();
              copyToClipboard(event.target.dataset.copytext);
            });
          });
        }

        function addParameterToURLHash(key, value) {
          if (window.location.hash.substr(1).includes(`${key}=${value}`)) return;

          if (window.location.hash.substr(1) === '') {
            window.location.hash = `${key}=${value}`;
          } else {
            window.location.hash += `&${key}=${value}`;
          }
        }

        function removeParameterFromURLHash(key) {
          if (!window.location.hash.substr(1).includes(`${key}=`)) return;
          const removeExpression = new RegExp('&?' + key + '=[^.&]*', 'g');
          window.location.hash = window.location.hash.replace(removeExpression, '');
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

        function showSpinner() {
          mainElement.querySelector('#spinner').style.display = 'block';
        }

        function hideSpinner() {
          mainElement.querySelector('#spinner').style.display = 'none';
        }

      };

    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
