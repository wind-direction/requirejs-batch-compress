/**
 * File : Split.js
 * Todo : 拆分模块
 * author: wind.direction.work@gmail.com
 * Created by wind on 17/5/11.
 */
import fs from 'fs';

class Split {
    constructor(PAGES) {
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
    getAllModules(ROOT_PATH = this.PAGES, DEEP = 0, parentIsEnd = true, parentName = '') {
        let modules = this.MODULES,
            _o_ = this.getAllModules,
            paths = fs.readdirSync(ROOT_PATH),
            last = paths.length - 1;
        paths.sort( (pre, aft) => {
            let preCode = pre.indexOf('.js'),
                aftCode = aft.indexOf('.js');
            return aftCode - preCode;
        });
        // 遍历
        paths.forEach( (path_item, stepIndex) => {
            let isLastNode = stepIndex === last,
                sub_path_item_str = ROOT_PATH + '/' + path_item,
                stat = fs.lstatSync(sub_path_item_str),
                pathArr = sub_path_item_str.split('/'),
                realParentModule = pathArr[pathArr.indexOf('pages') + 1];
            if(stat.isFile()){
                modules.push({
                    name: path_item,
                    moduleName: path_item.substr(0, path_item.indexOf('.js')),
                    type: 'file_node',   // 文件
                    deep: DEEP,
                    path: sub_path_item_str,
                    isEnd: isLastNode,
                    parentIsEnd: parentIsEnd,
                    realParentModule: realParentModule,
                    parentName: parentName
                });
            }else {
                // 判断是否有这个key
                modules.push({
                    name: path_item,
                    type: 'dir_node',    // 文件夹
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
}

export default Split;