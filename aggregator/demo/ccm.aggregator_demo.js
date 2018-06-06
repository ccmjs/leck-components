/**
 * @overview Demo for aggregator
 * @author Leon Eck <leon.eck@smail.inf.h-brs.de> 2018
 * @license The MIT License (MIT)
 */

{

  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'aggregator_demo',

    /**
     * recommended used framework version
     * @type {string}
     */
    ccm: '../../js/ccm-16.6.1.js',

    /**
     * default instance configuration
     * @type {{}}
     */
    config: {
      quiz: [ 'ccm.instance', 'js/ccm.quiz.js', [ "ccm.get", "js/configs.js", "quiz" ] ],
      cloze: [ 'ccm.instance', 'js/ccm.cloze.js', [ "ccm.get", "js/configs.js", "cloze" ] ],
      slidecast: [ 'ccm.instance', 'js/ccm.slidecast.js', [ "ccm.get", "js/configs.js", "slidecast" ] ],
      aggregator: [ 'ccm.instance', '../ccm.aggregator.js', {
        source: [
          [ "ccm.get", "js/configs.js", "quiz" ],
          [ "ccm.get", "js/configs.js", "cloze" ],
          [ "ccm.get", "js/configs.js", "slidecast" ]
        ]
      } ]
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
        self.element.appendChild(self.quiz.root);
        self.element.appendChild(self.cloze.root);
        self.element.appendChild(self.slidecast.root);

        self.quiz.start();
        self.cloze.start();
        self.slidecast.start();

        self.aggregator.start();


        if ( callback ) callback();
      };



    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
