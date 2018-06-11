/**
 * @overview Aggregator to collect information from multiple components
 * @author Leon Eck <leon.eck@smail.inf.h-brs.de> 2018
 * @license The MIT License (MIT)
 */

{

  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'aggregator',

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
        if ( callback ) callback();
      };


      /**
       * TODO:
       * - Meta Tag hinzufügen der die Config dokumentiert (source und settings)
       */

      /**
       * Aggregates information
       * @param {object} [settings]
       * @returns {object}
       */
      this.aggregate = settings => {
        let configuration = {};
        if (settings) {
          configuration = settings;
        } else if (self.settings) {
          configuration = self.settings;
        }

        let aggregatedInformation = {};

        if (!self.source) return aggregatedInformation;

        self.source.forEach(source => {
          if (isNotAnAggregatorType(source.aggregatable)) return;

          source.aggregatable.forEach(key => {
            if (isNotAnAggregatorType(source[key])) return;

            if (aggregatedInformation[key]) {
              if (configuration.allowDuplicates) {
                aggregatedInformation[key] = [...aggregatedInformation[key], ...source[key]];
              } else {
                aggregatedInformation[key] = mergeInformation(aggregatedInformation[key], source[key]);
              }
            } else {
              aggregatedInformation[key] = source[key];
            }
          });
        });

        if (configuration.log) {
          console.log(aggregatedInformation);
        }

        return aggregatedInformation;
      };

      function isNotAnAggregatorType(value) {
        return (!value || !Array.isArray(value) || typeof(value[0]) !== 'string');
      }

      function mergeInformation(currentInformation, newInformation) {
        return [...new Set([...currentInformation ,...newInformation])];
      }

    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
