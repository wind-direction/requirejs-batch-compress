'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * File : Split.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Todo : 拆分模块
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * author: wind.direction.work@gmail.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by wind on 17/5/11.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Split = function () {
    function Split(PAGES) {
        _classCallCheck(this, Split);

        this.PAGES = PAGES;
        this.getAllModules = this.getAllModules.bind(this);
        this.MODULES = [];
    }

    /**
     * 获取本项目中所有的入口模块
     * @param ROOT_PATH
     * @param DEEP
     * @param parentIsEnd
     * @param parentName
     * @returns {Array}
     */


    _createClass(Split, [{
        key: 'getAllModules',
        value: function getAllModules() {
            var ROOT_PATH = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.PAGES;
            var DEEP = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var parentIsEnd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            var parentName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

            var modules = this.MODULES,
                _o_ = this.getAllModules,
                paths = _fs2.default.readdirSync(ROOT_PATH),
                last = paths.length - 1;
            paths.sort(function (pre, aft) {
                var preCode = pre.indexOf('.js'),
                    aftCode = aft.indexOf('.js');
                return aftCode - preCode;
            });
            // 遍历
            paths.forEach(function (path_item, stepIndex) {
                var isLastNode = stepIndex === last,
                    sub_path_item_str = ROOT_PATH + '/' + path_item,
                    stat = _fs2.default.lstatSync(sub_path_item_str),
                    pathArr = sub_path_item_str.split('/'),
                    realParentModule = pathArr[pathArr.indexOf('pages') + 1];
                if (stat.isFile()) {
                    modules.push({
                        name: path_item,
                        moduleName: path_item.substr(0, path_item.indexOf('.js')),
                        type: 'file_node', // 文件
                        deep: DEEP,
                        path: sub_path_item_str,
                        isEnd: isLastNode,
                        parentIsEnd: parentIsEnd,
                        realParentModule: realParentModule,
                        parentName: parentName
                    });
                } else {
                    // 判断是否有这个key
                    modules.push({
                        name: path_item,
                        type: 'dir_node', // 文件夹
                        deep: DEEP,
                        isEnd: isLastNode,
                        parentIsEnd: parentIsEnd,
                        realParentModule: realParentModule,
                        parentName: parentName
                    });
                    // 递归探索
                    return _o_(sub_path_item_str, DEEP + 1, isLastNode, path_item);
                }
            });
            // 返回
            return modules;
        }
    }]);

    return Split;
}();

exports.default = Split;