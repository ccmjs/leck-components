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
                  <textarea id="outputDocumentation" class="form-control" rows="30"></textarea>
                </div>
              </div>
              `
            }
          ]
        }
      },
      css: [ 'ccm.load', '../css/bootstrap.min.css', '../css/default.css' ],
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
      let resultingDocumentation = {};

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

        /**
         * Generate documentation
         * @param configString
         */
        function generateDocumentation(configString) {
          mainElement.querySelector('#outputDocumentation').value = 'Input a valid JavaScript or JSON object';

          const config = parseConfigString(configString);
          if (config === null) return;

          let documentation = createDocumentation(self.ccm.helper.clone(config));

          mainElement.querySelector('#outputDocumentation').value = JSON.stringify(documentation, null, 2);
        }

        function parseConfigString(configString) {
          try {
            return eval('(' + configString + ')')
          } catch(err) {
            //console.log(err);
            return null;
          }
        }

        function createDocumentation(docu) {
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
            } else {
              createDocumentation(docu[key]);
            }
          });

          return docu;
        }

        function ccmDocType(docu, key) {
          if (typeof(docu[key]) === 'object') {
            if (!Array.isArray(docu[key])) {
              return 'object';
            } else {
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
