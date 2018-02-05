/**
 * Created by wind on 17/5/16.
 */
requirejs.config({
  baseUrl : './',
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
    }
  }
});
require(['jquery','bootstrap'], function($,bootstrap){
  var pageInstance = (function(){
    var $node = $('#page-wrapper');

    var bindEvent = function(){
      $node.on('click', 'button[name="submit"]', function(){
        var args = {
          username: $node.find(':text[name="username"]'),
          passwd : $node.find('input[name="password"]')
        };
        alert(JSON.stringify(args, null, '  '));
      });
    }

    return {
      init : function(){
        bindEvent();
      }
    }
  })();

  //启动页面
  pageInstance.init();
});