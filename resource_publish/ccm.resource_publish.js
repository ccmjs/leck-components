/**
 * @overview Publish a resource
 * @author Leon Eck <leon.eck@smail.inf.h-brs.de> 2018
 * @license The MIT License (MIT)
 */

{

  var component = {

    /**
     * unique component name
     * @type {string}
     */
    name: 'resource_publish',

    /**
     * recommended used framework version
     * @type {string}
     */
    ccm: 'https://ccmjs.github.io/leck-components/js/ccm-18.0.5.js',

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
              <div class="row top-buffer">
                <div class="col-xs-12">
                  <h1>Publish app</h1>
                </div>
              </div>
              <div class="row top-buffer">
                <div id="publishToGithubArea" class="col-xs-12" style="display: none;">
                  <div class="panel panel-primary">
                    <div class="panel-heading">
                      <h3 class="panel-title">Information about publishing an app</h3>
                    </div>
                    <div class="panel-body">
                      <p>
                        We use a <a href="https://github.com/ccmjs/dms-data" target="_blank" rel="noopener">GitHub repository</a> to store published apps. This means, that you need to have an account on <a href="https://github.com" target="_blank" rel="noopener">github.com</a> (Click <a href="https://github.com/join" target="_blank" rel="noopener">here</a> to create one). When you click the button below it will take you to our repository and create a new issue with your request to publish a new app. We will review this request and add the app if there are no conflicts or concerns. Otherwise we will get back to you in the newly created issue to resolve any problems there may be.
                      </p>
                      <a id="publishRequestGithubButton" class="btn btn-success" href="" target="_blank" rel="noopener" role="button">Create publish request on GitHub</a>
                      <a id="sendEmailRequestLink" href="" style="margin-left: 20px;">If you don't have a GitHub account click here to send us your request as an email</a>
                    </div>
                  </div>
                </div>
              </div>
              <div id="metadataFileURLArea" class="row top-buffer">
                <div class="col-xs-12">
                  <form>
                    <div class="form-group">
                      <label for="metadataFileURLInput">If you already have a metadata file for the app insert a link to that file here</label>
                      <input type="text" class="form-control" id="metadataFileURLInput" placeholder="https://ccmjs.github.io/ccm-app/metadata/2fa738e7-8f4b-42e7-9819-5e34e78127c9.json">
                    </div>
                    <button id="submitMetadataURLButton" type="button" class="btn btn-primary">Submit</button>
                  </form>
                </div>
              </div>
              <div class="row top-buffer">
                <div class="col-xs-12">
                  <button id="displayMetadataGeneratorButton" type="button" class="btn btn-warning">I don't have metadata for the app yet</button>
                </div>
              </div>
              <div  class="row top-buffer">
                <div id="metadataGeneratorArea" class="col-xs-12" style="display: none;">
                  Generator
                </div>
              </div>
              <div class="row top-buffer" style="margin-bottom: 20px;">
                <div id="metadataFileURLAfterGeneratorArea" class="col-xs-12" style="display: none;">
                  <form>
                    <div class="form-group">
                      <label for="metadataFileURLAfterGeneratorInput">After you saved the metadata in a file somewhere online, insert the url here</label>
                      <input type="text" class="form-control" id="metadataFileURLAfterGeneratorInput" placeholder="https://ccmjs.github.io/ccm-app/metadata/2fa738e7-8f4b-42e7-9819-5e34e78127c9.json">
                    </div>
                    <button id="submitMetadataURLAfterGeneratorButton" type="button" class="btn btn-primary">Submit</button>
                  </form>
                </div>
              </div>
              `
            }
          ]
        }
      },
      css: [ 'ccm.load', 'https://ccmjs.github.io/leck-components/css/bootstrap.min.css', 'https://ccmjs.github.io/leck-components/css/default.css' ],
      metadata_generator: [ "ccm.instance", "https://ccmjs.github.io/ccm-metadata_generator/dist/ccm.metadata_generator-0.3.0.min.js" ]
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
       * shortcut to help functions
       * @type {Object.<string,function>}
       */
      let $;

      /**
       * is called once after the initialization and is then deleted
       */
      this.ready = async () => {
        // set shortcut to help functions
        $ = self.ccm.helper;

      };

      /**
       * starts the instance
       */
      this.start = async () => {

        const mainElement = this.ccm.helper.html(this.html.main, {
        });
        this.element.appendChild(mainElement);
        
        mainElement.querySelector('#submitMetadataURLButton').addEventListener('click', function (event) {
          event.preventDefault();

          const metadataURL = mainElement.querySelector('#metadataFileURLInput').value;
          if (metadataURL === '') {
            alert('Please insert a url');
            return;
          }

          publishMetadata(metadataURL);
        });

        mainElement.querySelector('#submitMetadataURLAfterGeneratorButton').addEventListener('click', function (event) {
          event.preventDefault();

          const metadataURL = mainElement.querySelector('#metadataFileURLAfterGeneratorInput').value;
          if (metadataURL === '') {
            alert('Please insert a url');
            return;
          }

          publishMetadata(metadataURL);
        });

        mainElement.querySelector('#displayMetadataGeneratorButton').addEventListener('click', function (event) {
          event.preventDefault();

          mainElement.querySelector('#metadataFileURLArea').style.display = 'none';
          mainElement.querySelector('#displayMetadataGeneratorButton').style.display = 'none';
          mainElement.querySelector('#metadataGeneratorArea').style.display = 'block';
          mainElement.querySelector('#metadataFileURLAfterGeneratorArea').style.display = 'block';

          self.metadata_generator.start();

          $.setContent(mainElement.querySelector('#metadataGeneratorArea'), self.metadata_generator.root);
        });

        function publishMetadata(metadataURL) {
          mainElement.querySelector('#metadataFileURLArea').style.display = 'none';
          mainElement.querySelector('#displayMetadataGeneratorButton').style.display = 'none';
          mainElement.querySelector('#metadataGeneratorArea').style.display = 'none';
          mainElement.querySelector('#metadataFileURLAfterGeneratorArea').style.display = 'none';

          const metadataURLURIComponent = encodeURIComponent(metadataURL);

          mainElement.querySelector('#publishRequestGithubButton').href = `https://github.com/ccmjs/dms-data/issues/new?title=Request%20to%20publish%20an%20app&body=Metadata%20file%3A%20%5B${metadataURLURIComponent}%5D(${metadataURLURIComponent})&labels=publish+request`;

          mainElement.querySelector('#sendEmailRequestLink').href = `mailto:developer@ccmjs.eu?subject=Request%20to%20publish%20an%20app%20on%20dms&body=Metadata%20file%3A%20${metadataURLURIComponent}`;

          mainElement.querySelector('#publishToGithubArea').style.display = 'block';
        }

      };

    }
  };

  function p(){window.ccm[v].component(component)}var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

}
