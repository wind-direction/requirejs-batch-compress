'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * File : Single.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Todo : 处理单个文件
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * author: wind.direction.work@gmail.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by wind on 17/5/11.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Single = function () {
    function Single(module, dist_path, root, configFile) {
        _classCallCheck(this, Single);

        this.module = module;
        this.DIST_PATH = dist_path;
        this.ROOT_PATH = root;
        this.baseConfig = require(configFile).default;
        this.init = this.init.bind(this);
        this.setConfigFile = this.setConfigFile.bind(this);
    }

    /**
     * 生成配置文件
     */


    _createClass(Single, [{
        key: 'setConfigFile',
        value: function setConfigFile() {
            // 定义配置项
            var configItem = Object.assign({}, this.baseConfig);
            // 可以通过父级节点，在paths中增加别名来进行路径的缩短
            configItem['baseUrl'] = this.ROOT_PATH;
            configItem['name'] = this.module.path;
            configItem['out'] = this.DIST_PATH + '/' + this.module.moduleName + '.min.js';
            this.module.configFile = this.DIST_PATH + '/build.' + this.module.moduleName + '.config.js';
            // 生成文件
            _shelljs2.default.touch(this.module.configFile);
            _shelljs2.default.ShellString('(' + JSON.stringify(configItem, null, '  ') + ')').to(this.module.configFile);
        }
    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            var module = this.module;
            var _that_ = this;
            // 返回异步执行
            return new Promise(function (resolve, reject) {
                var beginTime = new Date();
                // 生成配置文件
                _that_.setConfigFile();
                // 生成子进程
                var child = _shelljs2.default.exec('r.js -o ' + _this.module.configFile, { silent: true, async: true });
                var processId = child.pid;
                // 定义错误时退出
                child.stderr.on('data', function (data) {
                    reject(data);
                });
                // 结束时
                child.on('exit', function () {
                    // 删除文件
                    _shelljs2.default.rm('-f', _that_.module.configFile);
                    var endTime = new Date();
                    module.pid = processId;
                    module.beginTime = (0, _dateformat2.default)(beginTime, "yyyy-mm-dd HH:MM:ss");
                    module.endTime = (0, _dateformat2.default)(endTime, "yyyy-mm-dd HH:MM:ss");
                    module.execTime = endTime.getTime() - beginTime.getTime();
                    resolve(module);
                });
            });
        }
    }]);

    return Single;
}();

exports.default = Single;