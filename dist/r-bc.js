#! /usr/bin/env node
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * File : index.js
 * Todo : 压缩打包的脚本
 * author: wind.direction.work@gmail.com
 * Created by wind on 17/5/11.
 */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _sprintfJs = require('sprintf-js');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _Argv = require('./components/Argv');

var _Argv2 = _interopRequireDefault(_Argv);

var _Split = require('./components/Split');

var _Split2 = _interopRequireDefault(_Split);

var _Single = require('./components/Single');

var _Single2 = _interopRequireDefault(_Single);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ROOT = '';
var PAGES_PATH = '';
var DIST_PATH = '';
var CONFIG_FILE = '';

var Build = function () {
    function Build() {
        _classCallCheck(this, Build);

        this.beginTime = new Date().getTime();
        this.SplitInstance = new _Split2.default(PAGES_PATH);
        this.batchOperate = this.batchOperate.bind(this);
        // 判断是否有dist目录,没有则创建
        if (this.fsExistsSync(DIST_PATH) === false) {
            console.log(_safe2.default.yellow.bold('没有压缩目录,创建[dist]目录...'));
            _shelljs2.default.exec('mkdir ' + DIST_PATH + ' && chmod -R 755 ' + DIST_PATH, { silent: true, async: true });
        }
    }

    /**
     * 判断文件(夹)是否存在
     * @param path
     * @returns {boolean}
     */


    _createClass(Build, [{
        key: 'fsExistsSync',
        value: function fsExistsSync(path) {
            try {
                _fs2.default.accessSync(path, _fs2.default.F_OK);
            } catch (e) {
                return false;
            }
            return true;
        }

        /**
         * 列出所有需要压缩的入口模块
         * @param modules
         */

    }, {
        key: 'printModuleTree',
        value: function printModuleTree(modules) {
            modules.forEach(function (item) {
                var connectStr = item.isEnd ? '└──' : '├──',
                    appendStr = item.deep ? item.parentIsEnd ? '    ' : '│  ' : '',
                    preAppendStr = item.deep > 1 ? Array(item.deep - 1).fill('│  ').join('') : '';
                console.log(_safe2.default.green('' + preAppendStr + appendStr + connectStr + item.name));
            });
        }

        /**
         * 获取固定宽度的内容
         * @param str
         * @param length
         * @returns {string}
         */

    }, {
        key: 'setTdStr',
        value: function setTdStr(str) {
            var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;

            var preAppendStr = str.length < length ? Array(length - str.length).fill(' ').join('') : '';
            return '' + preAppendStr + str;
        }

        /**
         * 绘制一行
         * @param obj
         * @returns {*}
         */

    }, {
        key: 'setTr',
        value: function setTr(obj) {
            var _that_ = this;
            var arr = Object.values(obj).map(function (str, index) {
                return [0, 1, 5].indexOf(index) > -1 ? _that_.setTdStr(str, 10) : _that_.setTdStr(str);
            });
            return _safe2.default.green((0, _sprintfJs.sprintf)('│%s│%s│%s│%s│%s│', arr[0], arr[1], arr[2], arr[3], arr[4])) + _safe2.default.red(arr[5]) + _safe2.default.green('│');
        }

        /**
         * 绘制分割线
         * @param position
         * @returns {string}
         */

    }, {
        key: 'setLine',
        value: function setLine() {
            var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'middle';

            var pre = position === 'middle' ? '├' : position === 'top' ? '┌' : '└';
            var aft = position === 'middle' ? '┤' : position === 'top' ? '┐' : '┘';
            var con = position === 'middle' ? '┼' : position === 'top' ? '┬' : '┴';
            var mid = Array(30).fill('┈').join('');
            var idStr = Array(10).fill('┈').join('');
            return '' + pre + idStr + con + idStr + con + mid + con + mid + con + mid + con + idStr + aft;
        }

        /**
         * 批量处理模块
         * @param modules
         * @param position
         */

    }, {
        key: 'batchOperate',
        value: function batchOperate(modules) {
            var _this = this;

            var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var single_page = modules.slice(position, position + 10),
                promises = [],
                _that_ = this;
            // 绘制表头
            console.log(_safe2.default.cyan('\u5904\u7406\u6A21\u5757[' + position + '~' + (position + single_page.length) + ']:'));
            console.log(_safe2.default.green(this.setLine('top')));
            console.log(_safe2.default.green(this.setTr({ no: 'No.', pid: 'Process-ID', name: 'Module', begin: 'Start-Time', end: 'End-Time', time: 'Build-Time' })));
            // 整理数据，排除目录文件
            single_page.forEach(function (info) {
                if (info.type === 'dir_node') return true;
                var singleInstance = new _Single2.default(info, DIST_PATH, ROOT, CONFIG_FILE);
                promises.push(singleInstance.init());
            });
            // 当全部处理结束之后
            Promise.all(promises).then(function (results) {
                var last = results.length - 1;
                results.forEach(function (v, k) {
                    console.log(_safe2.default.green(_this.setLine('middle')));
                    console.log(_this.setTr({ no: '' + (position + k), pid: '' + v.pid, name: v.name, begin: v.beginTime, end: v.endTime, time: '[' + v.execTime + ']ms' }));
                    if (k === last) {
                        console.log(_safe2.default.green(_this.setLine('bottom')));
                    }
                });
                position += single_page.length;
                if (position === modules.length) {
                    _that_.end();
                } else {
                    _that_.batchOperate(modules, position);
                }
            }, function (errInfo) {
                console.log(errInfo);
            });
        }

        /**
         * 开始处理
         */

    }, {
        key: 'init',
        value: function init() {
            console.log(_safe2.default.cyan.bold('解析模块如下:'));
            var MODULES = this.SplitInstance.getAllModules();
            this.printModuleTree(MODULES);
            // 处理模块
            console.log(_safe2.default.cyan.bold('开始批量处理模块:'));
            this.batchOperate(MODULES);
        }
    }, {
        key: 'end',
        value: function end() {
            var endTime = new Date().getTime(),
                execTime = endTime - this.beginTime,
                micSec = execTime % 1000,
                sec = (execTime - micSec) / 1000 % 60,
                min = Math.floor(execTime / 60000);
            console.log(_safe2.default.cyan.bold('压缩结束,共耗时:') + _safe2.default.red.bold('[' + min + '\u5206' + sec + '\u79D2' + micSec + '\u6BEB\u79D2]'));
        }
    }]);

    return Build;
}();

// 判断是否有参数


if (_Argv2.default.root === false) {
    console.log(_safe2.default.red.bold('缺失参数root'));
} else if (_Argv2.default.enter === false) {
    console.log(_safe2.default.red.bold('缺失参数enter'));
} else if (_Argv2.default.out === false) {
    console.log(_safe2.default.red.bold('缺失参数out'));
} else if (_Argv2.default.config === false) {
    console.log(_safe2.default.red.bold('却是参数config'));
} else {
    ROOT = _path2.default.resolve(_Argv2.default.root);
    PAGES_PATH = _path2.default.resolve(_Argv2.default.enter);
    DIST_PATH = _path2.default.resolve(_Argv2.default.out);
    CONFIG_FILE = _path2.default.resolve(_Argv2.default.config);
    // 启动
    var startInstance = new Build();

    startInstance.init();
}
