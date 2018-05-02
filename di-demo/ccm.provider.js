/**
 * @overview ccm dependency injection demo
 * @author Leon Eck <leon.eck@smail.inf.h-brs.de> 2018
 * @license The MIT License (MIT)
 */

{

  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'provider',

    /**
     * recommended used framework version
     * @type {string}
     */
    ccm: '../js/ccm-16.3.0.js',

    /**
     * default instance configuration
     * @type {object}
     */
    config: {
      html: {
        "main": {
          "id": "main",
          "inner": ""
        }
      },
      providing: { // Keys that are provided
        "info": "Information that is provided"
      },
      requester: [ 'ccm.instance', 'ccm.requester.js' ]
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

        const mainElement = self.ccm.helper.html(self.html.main, {
        });
        self.element.appendChild(mainElement);
        self.element.appendChild(self.requester.root);

        document.addEventListener('request-provider', (event) => {
          let key = event.detail.key;
          if (self.providing.hasOwnProperty(key)) {
            event.detail.provider = self.providing[key];
            event.preventDefault();
            event.stopPropagation();
          }
        });

        self.requester.start();

        if (callback) callback();
      };

    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
