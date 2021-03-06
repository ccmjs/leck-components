/**
 * @overview ccm component for rendering a fill-in-the-blank text
 * @author André Kless <andre.kless@web.de> 2017-2018
 * @license The MIT License (MIT)
 * @version latest (4.1.0)
 * @changes
 * version 4.1.0 (15.05.2018)
 * - supports initial values for text gaps by result data
 * - updated logging for ready and start event
 * - uses ccm v16.5.1
 * version 4.0.0 (13.04.2018): changed marking of gaps
 * - '*' instead of '[[' and ']]' (more easy to find on keyboards)
 * - '/' instead of '|' (more easy to find on keyboards)
 * - configurable character that marks a gap
 * - no default css
 * - uses ccm v16.5.0
 * (for older version changes see ccm.cloze-3.9.0.js)
 * TODO: $.html( my.text )
 */

{
  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'cloze',

    /**
     * recommended used framework version
     * @type {string|{url: string, integrity: string, crossorigin: string}}
     */
    ccm: 'https://ccmjs.github.io/ccm/ccm.js',

    /**
     * default instance configuration
     * @type {Object}
     */
    config: {

      "html": {
        "start": {
          "id": "start",
          "inner": {
            "tag": "button",
            "inner": "%caption%",
            "onclick": "%click%"
          }
        },
        "main": {
          "id": "main",
          "inner": [
            {
              "class": "row",
              "id": "keywords"
            },
            {
              "id": "box",
              "class": "row",
              "inner": [
                { "id": "text" },
                {
                  "id": "buttons",
                  "inner": [
                    { "id": "cancel" },
                    { "id": "submit" },
                    { "id": "finish" },
                    { "id": "timer" }
                  ]
                }
              ]
            },
            { "id": "conclusion" }
          ]
        },
        "keyword": {
          "class": "keyword",
          "inner": "%keyword%",
          "onclick": "%click%"
        },
        "input": {
          "tag": "input",
          "type": "text",
          "size": 10,
          "autocorrect": "off",
          "autocapitalize": "none",
          "required": true,
          "oninput": "%oninput%",
          "onchange": "%onchange%"
        },
        "button": {
          "tag": "button",
          "inner": "%caption%",
          "onclick": "%click%"
        },
        "timer": {
          "tag": "span",
          "inner": "%%"
        },
        "feedback": {
          "inner": [
            {
              "id": "points",
              "inner": "%points%"
            },
            {
              "id": "feedback",
              "inner": {
                "id": "progress-bar"
              }
            }
          ]
        }
      },
      "mark": "*",
      "text": "Hello, *(W)o(rl)d*!",
      "captions": {
        "start": "Start",
        "cancel": "Cancel",
        "submit": "Submit",
        "retry": "Retry",
        "finish": "Finish"
      }

  //  "css": [ "ccm.load", "https://ccmjs.github.io/akless-components/cloze/resources/default.css" ],
  //  "start_button": true,
  //  "keywords": [ "keyword1", "keyword2", "..." ],
  //  "blank": true,
  //  "time": 60,
  //  "feedback": true,
  //  "retry": true
  //  "solutions": true,
  //  "cancel_button": true,
  //  "user": [ "ccm.instance", "https://ccmjs.github.io/akless-components/user/versions/ccm.user-4.0.1.js" ],
  //  "logger": [ "ccm.instance", "https://ccmjs.github.io/akless-components/log/versions/ccm.log-3.1.0.js", [ "ccm.get", "https://ccmjs.github.io/akless-components/log/resources/configs.js", "greedy" ] ],
  //  "onstart": function ( instance ) { console.log( 'Fill-in-the-blank text started' ); },
  //  "oncancel": function ( instance ) { console.log( 'Fill-in-the-blank text canceled' ); },
  //  "onvalidation": function ( instance, data ) { if ( data.gap % 2 ) data.correct = data.nearly = true; console.log( data ); },
  //  "onfeedback": function ( instance, data ) { console.log( data ); },
  //  "onchange": function ( instance, data ) { console.log( data ); },
  //  "oninput":  function ( instance, data ) { console.log( data ); },
  //  "onfinish": { "clear": true, "log": true }

    },

    /**
     * for creating instances out of this component
     * @constructor
     */
    Instance: function () {

      /**
       * own reference for inner functions
       * @type {Instance}
       */
      const self = this;

      /**
       * privatized instance members
       * @type {Object}
       */
      let my;

      /**
       * shortcut to help functions
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * information data for each keyword
       * @type {Array}
       */
      let keywords = [];

      /**
       * result data
       * @type {Object}
       */
      let results = null;

      /**
       * is called once after all dependencies are solved and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.init = callback => {

        // fill-in-the-blank text is given via inner HTML of own Custom Element? => use it with higher priority
        if ( self.inner && self.inner.innerHTML.trim() ) self.text = self.inner.innerHTML;

        callback();
      };

      /**
       * is called once after the initialization and is then deleted
       * @param {function} callback - called after all synchronous and asynchronous operations are complete
       */
      this.ready = callback => {

        // set shortcut to help functions
        $ = self.ccm.helper;

        // privatize all possible instance members
        my = $.privatize( self );

        const regex_keyword   = new RegExp( '\\' + my.mark + '.+?\\' + my.mark, 'g' );  // regular expression for finding all gaps/keywords in the text
        const regex_given     = /\(.+?\)/g;                                             // regular expression for finding all given characters of a keyword
        const regex_reference = /^#(\d+)$/;                                             // regular expression for finding a gap reference

        // iterate all keywords in the text to determine the information data for each keyword
        ( my.text.match( regex_keyword ) || [] ).map( keyword => {

          // remove distinguishing characteristic '*'
          keyword = keyword.substr( 1, keyword.length - 2 );

          // the same as a previous gap? => use reference of previous gap
          if ( regex_reference.test( keyword ) ) return keywords.push( keywords[ keyword.substr( 1 ) - 1 ] );

          const entry = [];
          keyword.split( '/' ).map( keyword => entry.push( determineKeywordData( keyword.trim() ) ) );
          keywords.push( entry );

          function determineKeywordData( keyword ) {

            // replace all given characters of a keywords with '*'
            const keyw__d = keyword.replace( '*', '#' ).replace( regex_given, given => {
              const length = given.length - 2;
              given = '';
              for ( let i = 0; i < length; i++ )
                given += '*';
              return given;
            } );

            // determine given characters and hold this information in a single number (disadvantage: possible positions
            let givens = 0;                                                      // for given letters in a word are 0-31
            for ( let i = 0; i < keyw__d.length; i++ )                           // because of data type limitations)
              if ( keyw__d.charAt( i ) === '*' ) givens += Math.pow( 2, i );

            return {
              word: keyword.replace( regex_given, given => given.substr( 1, given.length - 2 ) ),
              givens: givens
            };

          }

        } );

        // replace gaps/keywords with empty span elements
        my.text = my.text.replace( regex_keyword, '<span class="gap"></span>' );

        // has logger instance? => log 'ready' event
        self.logger && self.logger.log( 'ready', $.clone( my ) );

        callback();
      };

      /**
       * starts the instance
       * @param {function} [callback] - called after all synchronous and asynchronous operations are complete
       */
      this.start = callback => {

        // set initial result data
        results = { details: [] };

        // has logger instance? => log 'render' event
        self.logger && self.logger.log( 'render' );

        // user must click on a start button before fill-in-the-blank text is starting? => render start button
        if ( my.start_button ) $.setContent( self.element, $.html( my.html.start, { caption: my.captions.start, click: start } ) );
        // no need for a start button? => start fill-in-the-blank text directly
        else start();

        // rendering completed => perform callback
        callback && callback();

        /** starts the fill-in-the-blank text */
        function start() {

          // get initial values for input fields
          $.dataset( my.data, dataset => {

            // has logger instance? => log 'start' event
            self.logger && self.logger.log( 'start', $.clone( dataset ) );

            // prepare main HTML structure
            const main_elem = $.html( my.html.main );

            // select inner containers (mostly for buttons)
            const   text_elem = main_elem.querySelector( '#text'   );
            const cancel_elem = main_elem.querySelector( '#cancel' );
            const submit_elem = main_elem.querySelector( '#submit' );
            const finish_elem = main_elem.querySelector( '#finish' );
            const  timer_elem = main_elem.querySelector( '#timer'  );

            // remove unneeded buttons
            !my.cancel_button && $.removeElement( cancel_elem );
            !my.feedback      && $.removeElement( submit_elem );

            // add content for inner containers
            renderKeywords();
            renderText();
            renderInitialButtons();
            renderTimer();

            // set content of own website area
            $.setContent( self.element, main_elem );

            // has individual 'start' callback? => perform it
            self.onstart && self.onstart( self );

            /**
             * @summary renders given keywords for text gaps
             * @description
             * Keywords could be given (individual) via instance configuration (my.keywords is string array)
             * or (automatic generated) via private variable 'keywords' (my.keywords is boolean true).
             */
            function renderKeywords() {

              /**
               * container for keywords
               * @type {Element}
               */
              const keywords_elem = main_elem.querySelector( '#keywords' );

              // rendering of given keywords not wanted? => abort and remove container for keywords and abort
              if ( !my.keywords ) return $.removeElement( keywords_elem );

              /**
               * contains inner container for each keyword
               * @type {Array}
               */
              const entries = [];

              // prepare keyword containers
              ( my.keywords === true ? keywords : my.keywords ).map( keyword => {
                entries.push( $.html( my.html.keyword, {
                  keyword: my.keywords === true ? keyword[ 0 ].word : keyword,
                  click: function () { this.classList.toggle( 'marked' ); }
                } ) );
              } );

              // generated keyword list? => sort keywords lexicographical (keyword order gives no hint about correct solution)
              if ( my.keywords === true )
                entries.sort( ( a, b ) => a.innerHTML.localeCompare( b.innerHTML ) );

              // add each inner keyword container to container for keywords
              entries.map( entry => keywords_elem.appendChild( entry ) );

            }

            /** renders the fill-in-the-blank text */
            function renderText() {

              // render text with containing gaps
              text_elem.innerHTML = my.text;

              let size = 0;
              keywords.map( keyword => keyword.map( keyword => {
                if ( keyword.word.length > size ) size = keyword.word.length;
              } ) );

              // iterate over all gap => render input field into each gap
              [ ...main_elem.querySelectorAll( '.gap' ) ].map( ( gap_elem, i ) => {

                // prepare ccm HTML data for the input field
                const input = $.html( my.html.input, { oninput: onInput, onchange: onChange } );

                // set initial value
                if ( dataset && dataset.details && dataset.details[ i ] && dataset.details[ i ].input ) input.value = dataset.details[ i ].input;

                // resizing of the input field
                input.onkeypress = input.onkeydown = function () { this.size = this.value.length > 10 ? this.value.length : 10; };
                input.onpaste = function () { $.wait( 0, () => this.size = this.value.length > 10 ? this.value.length : 10 ); };

                // no blank input fields? => set placeholder attribute (gives informations about the characters of the searched word)
                if ( !my.blank ) {
                  const keyword = keywords[ i ][ 0 ].word;
                  input.placeholder = '';
                  for ( let j = 0; j < keyword.length; j++ )
                    input.placeholder += Math.pow( 2, j ) & keywords[ i ][ 0 ].givens ? keyword.charAt( j ) : '_';
                }

                // render input field in the current gap
                gap_elem.appendChild( $.html( input ) );

                /** callback for 'input' event */
                function onInput() {

                  /**
                   * event data (contains informations about the input field)
                   * @type {Object}
                   */
                  const event_data = { gap: 1 + i, input: this.value };

                  // has logger instance? => log 'input' event
                  self.logger && self.logger.log( 'input', $.clone( event_data ) );

                  // has individual 'input' callback? => perform it
                  self.oninput && self.oninput( self, $.clone( event_data ) );

                }

                /** callback for 'change' event */
                function onChange() {

                  /**
                   * event data (contains informations about the input field)
                   * @type {Object}
                   */
                  const event_data = { gap: 1 + i, input: this.value };

                  // has logger instance? => log 'change' event
                  self.logger && self.logger.log( 'change', $.clone( event_data ) );

                  // has individual 'change' callback? => perform it
                  self.onchange && self.onchange( self, $.clone( event_data ) );

                }

              } );
            }

            /** renders the buttons */
            function renderInitialButtons() {

              // render 'cancel' button (if needed)
              my.cancel_button && renderButton( cancel_elem, my.captions.cancel, () => self.oncancel ? self.oncancel( self ) : self.start( callback ) );

              // render 'submit' button (if needed)
              my.feedback && renderButton( submit_elem, my.captions.submit, evaluate );

              // render 'finish' button (if needed)
              self.onfinish && renderButton( finish_elem, my.captions.finish, onFinish );

            }

            /** renders the timer */
            function renderTimer() {

              // no limited time? => remove timer button and abort
              if ( !my.time || ( !self.onfinish && !my.feedback ) ) return $.removeElement( timer_elem );

              /**
               * given seconds for working with the quiz
               * @type {number}
               */
              let timer_value = my.time;

              // start timer
              timer();

              /** updates countdown timer (recursive function) */
              function timer() {

                // no existing finish button? => stop timer
                if ( !finish_elem ) return;

                // (re)render timer value
                $.setContent( timer_elem, $.html( my.html.timer, timer_value ) );

                // countdown
                if ( timer_value-- )
                  $.wait( 1000, timer );    // recursive call
                else
                  my.feedback ? evaluate() : onFinish();  // finish at timeout

              }

            }

            /** evaluates the fill-in-the-blank text and shows feedback */
            function evaluate() {

              // set initial state for detail informations of the gap results
              results.details = []; results.correct = 0;

              // iterate over all gap input fields
              [ ...main_elem.querySelectorAll( '.gap input' ) ].map( ( gap, i ) => {

                /**
                 * event data (contains informations about the input field)
                 * @type {Object}
                 */
                const event_data = {
                  gap:      1 + i,      // number of the text gap
                  input:    gap.value,  // user input
                  solution: [],         // list of correct solution words
                  correct:  false,      // true: correct user input value
                  nearly:   false       // true: almost correct user input value
                };

                // add solution information to event data
                event_data.solution = [];
                keywords[ i ].map( keyword => {
                  event_data.solution.push( keyword.word );

                  // determine correctness of the user input value
                  if ( keyword.used ) return;
                  gap.value = gap.value.trim();
                  if ( gap.value === keyword.word ) { event_data.correct = true; results.correct++; }
                  if ( gap.value.toLowerCase() === keyword.word.toLowerCase() ) { event_data.nearly = true; keyword.used = true; }
                  self.onvalidation && !self.onvalidation( self, event_data );  // has individual 'validation' callback? => perform it
                } );

                // give visual feedback for correctness
                gap.disabled = true;
                if ( !event_data.nearly && my.solutions ) gap.value = '';
                if ( my.solutions ) {
                  let placeholder = '';
                  for ( let j = 0; j < keywords[ i ].length; j++ )
                    if ( !keywords[ i ][ j ].used ) { placeholder = keywords[ i ][ j ].word; break; }
                  gap.setAttribute( 'placeholder', placeholder );
                  placeholder.length <= 0 ? gap.size = gap.value.length : gap.size = placeholder.length;
                }
                gap.parentNode.classList.add( event_data.correct ? 'correct' : ( event_data.nearly ? 'nearly' : 'wrong' ) );

                // set detail informations for current gap result
                results.details.push( event_data );

              } );

              // restore original keywords information data
              keywords.map( keyword => keyword.map( keyword => delete keyword.used ) );

              // no evaluation results? => abort
              if ( results.details.length === 0 ) return;

              // has logger instance? => log 'feedback' event
              self.logger && self.logger.log( 'feedback', $.clone( results ) );

              // has individual 'feedback' callback? => perform it
              self.onfeedback && self.onfeedback( self, $.clone( results ) );

              // change buttons
              updateButtons( true );

              // render feedback for results
              renderProgressBar( results.correct );

              function renderProgressBar( correct ) {
                $.setContent( main_elem.querySelector( '#conclusion' ), $.html( my.html.feedback, { points: correct + '/' + keywords.length } ) );
                const goal = correct * main_elem.querySelector( '#feedback' ).offsetWidth / keywords.length; //parseInt( self.element.querySelector( '#progress-bar' ).style.width, 10);
                let width = 1;
                let id = setInterval(frame, 10);

                function frame() {
                  if ( width >= goal ) {
                    clearInterval( id );
                  } else {
                    width++;
                    main_elem.querySelector( '#progress-bar' ).style.width = width + 'px';
                  }
                }

              }

            }

            /** removes the feedback and enables the input fields */
            function retry() {

              // clear conclusion area
              $.setContent( main_elem.querySelector( '#conclusion' ), '' );

              // iterate over all gap input fields
              [ ...self.element.querySelectorAll( '.gap' ) ].map( gap => {

                // remove visual feedback
                gap.classList.remove( 'correct', 'nearly', 'wrong' );
                const input = gap.querySelector( 'input' );
                input.disabled = false;

              } );

              // has logger instance? => log 'retry' event
              self.logger && self.logger.log( 'retry' );

              // change buttons
              updateButtons( false );

            }

            /**
             * (re)renders the buttons
             * @param {boolean} evaluated - fill-in-the-blank text is evaluated
             */
            function updateButtons( evaluated ) {

              // no visual feedback? => abort
              if ( !my.feedback ) return;

              // the fill-in-the-blank text is not evaluated? => render 'submit' button
              if ( !evaluated )
                renderButton( submit_elem, my.captions.submit, evaluate );
              // evaluated and retry is allowed? => render 'retry' button
              else if ( my.retry && !my.solutions )
                renderButton( submit_elem, my.captions.retry, retry );
              // evaluated without retry? => disable 'submit' button
              else
                submit_elem.querySelector( 'button' ).disabled = true;

            }

            /** renders a single button */
            function renderButton( element, caption, click ) {

              $.setContent( element, $.html( my.html.button, {
                caption: caption,
                click: click
              } ) );

            }

            /** finishes the fill-in-the-blank text */
            function onFinish() {

              // no finish button? => abort
              if ( !self.onfinish ) return;

              // has user instance? => login user (if not already logged in)
              if ( self.user ) self.user.login( proceed ); else proceed();

              function proceed() {

                // no evaluation results? => evaluate fill-in-the-blank text
                results.details.length === 0 && evaluate();

                // make sure that user could not use 'finish' button again
                $.removeElement( finish_elem );
                $.removeElement(  timer_elem );

                // finalize result data
                if ( self.user ) results.user = self.user.data().name;

                // has logger instance? => log 'finish' event
                self.logger && self.logger.log( 'finish', $.clone( results ) );

                // perform 'finish' actions and provide result data
                $.onFinish( self, results );

              }

            }

          } );

        }

      };

      /**
       * returns the current result data
       * @returns {Object} current result data
       */
      this.getValue = () => results;

    }

  };

  function p(){window.ccm[v].component(component)}const f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{const n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{const e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}