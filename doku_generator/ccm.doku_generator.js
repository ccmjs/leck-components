/**
 * @overview Generate a documentation for the configuration
 * @author Leon Eck <leon.eck@smail.inf.h-brs.de> 2018
 * @license The MIT License (MIT)
 */

{

  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'doku_generator',

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
              <div class="row text-center">
                <div class="col-xs-12">
                  <h1>Doku Generator</h1>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <h3>Input config<p><small>Paste the configuration object here. (The object must be a valid JavaScript or JSON Object)</small></p></h3>
                  <textarea id="inputConfig" class="form-control" rows="30"></textarea>
                </div>
                <div class="col-md-6">
                  <h3>Output documentation<p><small>The output updates live. You will need to provide descriptions for the fields and check if the inferred types are correct.</small></p></h3>
                  <p style="margin-bottom: 6px;">
                    <button id="copyToClipboard" type="button" class="btn btn-default">Copy to Clipboard</button>
                    <button id="editDocumentation" type="button" class="btn btn-primary">Edit documentation</button>
                  </p>
                  <textarea id="outputDocumentation" class="form-control" rows="28" readonly></textarea>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12">
                  <div class="bs-callout bs-callout-primary">
                    The generated documentation can be stored inside a <em>ccm</em> component or configuration.
                    <pre>
meta: {
  config: <b>Insert the documentation object here</b>
}</pre>
                    The information is used e.g. by the <a href="https://github.com/ccmjs/ccm-factory" target="_blank" rel="noopener noreferrer">ccm-factory</a>
                  </div>
                </div>
              </div>
              <!-- Modal -->
              <div class="modal fade" id="modalDocumentationEditor" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">Edit documentation</h4>
                    </div>
                    <div class="modal-body scrollable-modal-body" id="documentationEditorBody">
                      
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>
              `
            }
          ]
        }
      },
      css: [ 'ccm.load', '../css/bootstrap.min.css', '../css/default.css' ],
      js: [ 'ccm.load', [ 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js' ] ],
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
       * Generated documentation
       * @type {{}}
       */
      window.resultingDocumentation = {};

      /**
       * Keeps track of created editors
       * @type {number}
       */
      let docEditorIdCounter = 0;

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

        mainElement.querySelector('#inputConfig').addEventListener('input', function() {
          generateDocumentation(this.value);
        });

        mainElement.querySelector('#copyToClipboard').addEventListener('click', function() {
          copyToClipboard(JSON.stringify(resultingDocumentation, null, 2));
        });

        mainElement.querySelector('#editDocumentation').addEventListener('click', function() {
          displayDocumentationEditor();
        });

        /**
         * Generate documentation
         * @param configString
         */
        function generateDocumentation(configString) {
          mainElement.querySelector('#outputDocumentation').value = 'Input a valid JavaScript or JSON object';

          const config = parseConfigString(configString);
          if (config === null) return;

          resultingDocumentation = createDocumentation(self.ccm.helper.clone(config), '');

          displayDocumentation();
        }

        function displayDocumentation() {
          mainElement.querySelector('#outputDocumentation').value = JSON.stringify(resultingDocumentation, null, 2);
        }

        function displayDocumentationEditor() {
          $(mainElement.querySelector('#modalDocumentationEditor')).modal('show');

          $(mainElement.querySelector('#modalDocumentationEditor')).on('hide.bs.modal', function (e) {
            displayDocumentation();
          });
        }

        function parseConfigString(configString) {
          try {
            return eval('(' + configString + ')')
          } catch(err) {
            //console.log(err);
            return null;
          }
        }

        function createDocumentation(docu, completeKey) {
          const keysOnCurrentIteration = Object.keys(docu);
          if (keysOnCurrentIteration.length === 0) return;

          keysOnCurrentIteration.forEach(key => {
            if (typeof(docu[key]) !== 'object' || Array.isArray(docu[key]) || key === 'html') {
              const type = ccmDocType(docu, key);
              const oldValue = JSON.stringify(docu[key]);

              docu[key] = {
                "ccm_doc_type": [type],
                "ccm_doc_desc": "",
                "ccm_doc_examples": [{}]
              };
              docu[key].ccm_doc_examples[0][type] = stringifyValue(oldValue);

              if (key === 'html') docu[key].ccm_doc_examples[0] = {};

              generateDocEditor(key, completeKey, docu);

            } else {
              createDocumentation(docu[key], completeKey + key + '.');
            }
          });

          return docu;
        }

        function generateDocEditor(key, completeKey, docu) {
          docEditorIdCounter++;

          const docuEditor = mainElement.querySelector('#documentationEditorBody');
          docuEditor.innerHTML += `
                <form class="form-horizontal">
                  <h5>${completeKey + key}</h5>
                  <div class="form-group" style="margin-bottom: 0px;">
                    <label for="inputType${docEditorIdCounter}" class="col-sm-2 control-label">Type</label>
                    <div class="col-sm-10">
                      <input class="form-control" id="inputType${docEditorIdCounter}" value="${docu[key].ccm_doc_type.join(', ')}" oninput="
                      self.ccm.helper.deepValue(self.resultingDocumentation, this.dataset.wholekey + '.ccm_doc_type', this.value.split(/[ ,]+/));
                      this.parentNode.parentNode.parentNode.querySelector('#inputExampleLabel${docEditorIdCounter}').innerHTML = this.value.split(/[ ,]+/)[0];
                      let examples = self.ccm.helper.deepValue(self.resultingDocumentation, this.dataset.wholekey + '.ccm_doc_examples');
                      const currentExampleString = examples[0][Object.keys(examples[0])[0]];
                      let newExampleObject = {};
                      newExampleObject[this.value.split(/[ ,]+/)[0]] = currentExampleString;
                      examples[0] = newExampleObject;
                      self.ccm.helper.deepValue(self.resultingDocumentation, this.dataset.wholekey + '.ccm_doc_examples', examples);
                      " data-wholekey="${completeKey + key}">
                      <p class="help-block">Multiple types can be separated by commas.</p>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="inputDescription${docEditorIdCounter}" class="col-sm-2 control-label">Description</label>
                    <div class="col-sm-10">
                      <input class="form-control" id="inputDescription${docEditorIdCounter}" value="${docu[key].ccm_doc_desc}" oninput="self.ccm.helper.deepValue(self.resultingDocumentation, this.dataset.wholekey + '.ccm_doc_desc', this.value);" data-wholekey="${completeKey + key}">
                    </div>
                  </div>
                  <h6>Example</h6>
                  <div class="form-group">
                    <label for="inputExample${docEditorIdCounter}" id="inputExampleLabel${docEditorIdCounter}" class="col-sm-2 control-label">${self.ccm.helper.escapeHTML(docu[key].ccm_doc_type[0])}</label>
                    <div class="col-sm-10">
                      <input class="form-control" id="inputExample${docEditorIdCounter}" value="${docu[key].ccm_doc_examples[0][docu[key].ccm_doc_type[0]]}" oninput="
                      const exampleKey = this.parentNode.parentNode.parentNode.querySelector('#inputExampleLabel${docEditorIdCounter}').innerHTML;
                      let examples = self.ccm.helper.deepValue(self.resultingDocumentation, this.dataset.wholekey + '.ccm_doc_examples');
                      let newExampleObject = {};
                      newExampleObject[exampleKey] = this.value;
                      examples[0] = newExampleObject;
                      self.ccm.helper.deepValue(self.resultingDocumentation, this.dataset.wholekey + '.ccm_doc_examples', examples);
                      " data-wholekey="${completeKey + key}">
                    </div>
                  </div>
                </form>
                <hr>
              `;

        }

        function ccmDocType(docu, key) {
          if (typeof(docu[key]) === 'object') {
            if (!Array.isArray(docu[key])) {
              return 'object';
            } else {
              const ccmTypes = ['ccm.load', 'ccm.component', 'ccm.instance', 'ccm.proxy', 'ccm.start', 'ccm.store', 'ccm.get', 'ccm.set', 'ccm.del', 'ccm.module', 'ccm.polymer'];
              if (ccmTypes.includes(docu[key][0])) {
                return docu[key][0];
              }
              return `Array<${ccmDocType(docu[key], 0)}>`;
            }
          }

          return typeof(docu[key]);
        }

        function stringifyValue(value) {
          let returnValue = value;
          if (typeof(value) === 'object') {
            returnValue = JSON.stringify(value);
          }

          // Strip leading and trailing quotation marks
          if (returnValue.startsWith('"')) {
            returnValue = returnValue.substr(1, returnValue.length-2);
          }

          // Replace double quotes with single quotes in array
          if (returnValue.startsWith('[')) {
            returnValue = returnValue.replace(/"/g, '\'');
          }

          return returnValue;
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

      /**
       * Returns the new documentation of the resource
       * @returns {object} documentation
       */
      this.getValue = () => {
        return this.ccm.helper.clone(resultingDocumentation);
      };

      /**
       * Triggers the submit of the entered data
       * @param event
       */
      this.submit = event => {
        // prevent page reload
        if (event) event.preventDefault();

        // perform finish actions
        self.ccm.helper.onFinish(self);
      };
    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
