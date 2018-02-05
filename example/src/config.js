/**
 * Created by wind on 17/5/16.
 */

let baseConfig = {
  map: {
    '*' : {
      'css': 'node_modules/require-css/css.min'
    }
  },
  generateSourceMaps: true,
  paths : {
    /**
     * 基础库
     */
    'css'                   : 'node_modules/require-css/css.min',
    'jquery'                : 'node_modules/jquery/dist/jquery',
    'bootstrap'             : 'node_modules/bootstrap/dist/js/bootstrap'
  },
  shim: {
    /**
     * 单独库
     */
    'jquery' : { exports : '$'},
    'bootstrap': {
      deps: [
        'jquery',
        'css!node_modules/bootstrap/dist/css/bootstrap.css'
      ]
    },
    'select2' : {
      deps : [
        'jquery',
        'css!node_modules/select2/dist/css/select2.css'
      ]
    }
  },
  optimizeCss: "standard.keepLines",
  urlArgs: "v=" +  (new Date()).getTime()
};

module.exports = {
  "default" : baseConfig
}
