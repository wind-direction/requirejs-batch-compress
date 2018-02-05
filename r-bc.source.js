#! /usr/bin/env node
/**
 * File : index.js
 * Todo : 压缩打包的脚本
 * author: wind.direction.work@gmail.com
 * Created by wind on 17/5/11.
 */

import fs from 'fs';
import path from 'path';

import color from 'colors/safe';
import { sprintf } from 'sprintf-js';
import shell from 'shelljs';

import Argv from './components/Argv';
import Split from './components/Split';
import Single from './components/Single';

let ROOT = '';
let PAGES_PATH = '';
let DIST_PATH = '';
let CONFIG_FILE = '';

class Build {
    constructor() {
        this.beginTime = (new Date()).getTime();
        this.SplitInstance = new Split(PAGES_PATH);
        this.batchOperate = this.batchOperate.bind(this);
        // 判断是否有dist目录,没有则创建
        if(this.fsExistsSync(DIST_PATH) === false){
          console.log( color.yellow.bold('没有压缩目录,创建[dist]目录...'));
          shell.exec(`mkdir ${DIST_PATH} && chmod -R 755 ${DIST_PATH}`,{silent:true, async:true});
        }
    }

    /**
     * 判断文件(夹)是否存在
     * @param path
     * @returns {boolean}
     */
    fsExistsSync(path) {
        try{
            fs.accessSync(path,fs.F_OK);
        }catch(e){
            return false;
        }
        return true;
    }

    /**
     * 列出所有需要压缩的入口模块
     * @param modules
     */
    printModuleTree(modules) {
        modules.forEach( (item) => {
            let connectStr = item.isEnd ? '└──' : '├──',
                appendStr = item.deep ? (item.parentIsEnd ? '    ': '│  ') : '',
                preAppendStr = item.deep > 1 ? Array(item.deep - 1).fill('│  ').join('') : '';
            console.log( color.green(`${preAppendStr}${appendStr}${connectStr}${item.name}`) );
        });
    }

    /**
     * 获取固定宽度的内容
     * @param str
     * @param length
     * @returns {string}
     */
    setTdStr(str, length = 30) {
        let preAppendStr = str.length < length ? Array(length - str.length).fill(' ').join('') : '';
        return `${preAppendStr}${str}`;
    }

    /**
     * 绘制一行
     * @param obj
     * @returns {*}
     */
    setTr(obj) {
        let _that_ = this;
        let arr = Object.values(obj).map( (str, index) => {
            return [0,1,5].indexOf(index) > -1 ? _that_.setTdStr(str, 10) : _that_.setTdStr(str);
        } );
        return color.green( sprintf('│%s│%s│%s│%s│%s│', arr[0], arr[1], arr[2], arr[3], arr[4] ) ) + color.red(arr[5]) + color.green('│');
    }

    /**
     * 绘制分割线
     * @param position
     * @returns {string}
     */
    setLine(position = 'middle') {
        let pre = position === 'middle' ? '├' : ( position === 'top' ? '┌': '└');
        let aft = position === 'middle' ? '┤' : ( position === 'top' ? '┐': '┘');
        let con = position === 'middle' ? '┼' : ( position === 'top' ? '┬': '┴');
        let mid = Array(30).fill('┈').join('');
        let idStr = Array(10).fill('┈').join('');
        return `${pre}${idStr}${con}${idStr}${con}${mid}${con}${mid}${con}${mid}${con}${idStr}${aft}`;
    }


    /**
     * 批量处理模块
     * @param modules
     * @param position
     */
    batchOperate(modules, position = 0){
        let single_page = modules.slice(position, position + 10),
            promises = [],
            _that_ = this;
        // 绘制表头
        console.log( color.cyan(`处理模块[${position}~${position + single_page.length}]:`) );
        console.log(color.green( this.setLine('top') ));
        console.log( color.green( this.setTr({ no: 'No.',pid: 'Process-ID', name: 'Module', begin: 'Start-Time', end: 'End-Time',time: 'Build-Time' }) ) );
        // 整理数据，排除目录文件
        single_page.forEach( (info) => {
            if(info.type === 'dir_node') return true;
            let singleInstance = new Single(info, DIST_PATH, ROOT, CONFIG_FILE);
            promises.push( singleInstance.init() );
        });
        // 当全部处理结束之后
        Promise.all(promises).then( (results) => {
            let last = results.length - 1;
            results.forEach( (v, k) => {
                console.log(color.green( this.setLine('middle') ));
                console.log( this.setTr({ no:  `${position + k}`,pid: `${v.pid}`, name: v.name, begin: v.beginTime, end: v.endTime, time: `[${v.execTime}]ms`}));
                if(k === last){
                    console.log(color.green( this.setLine('bottom') ));
                }
            });
            position += single_page.length;
            if(position === modules.length){
                _that_.end();
            }else{
                _that_.batchOperate(modules, position);
            }
        }, (errInfo) => {
            console.log(errInfo);
        });
    }

    /**
     * 开始处理
     */
    init() {
        console.log( color.cyan.bold('解析模块如下:') );
        const MODULES = this.SplitInstance.getAllModules();
        this.printModuleTree(MODULES);
        // 处理模块
        console.log( color.cyan.bold('开始批量处理模块:') );
        this.batchOperate(MODULES);
    }

    end(){
        let endTime = (new Date()).getTime(),
            execTime = endTime - this.beginTime,
            micSec = execTime%1000,
            sec = ((execTime - micSec)/1000)%60,
            min = Math.floor(execTime/60000);
        console.log( color.cyan.bold('压缩结束,共耗时:') + color.red.bold(`[${min}分${sec}秒${micSec}毫秒]`) );
    }
}

// 判断是否有参数
if(Argv.root === false) { console.log( color.red.bold('缺失参数root') ) }
else if(Argv.enter === false) { console.log( color.red.bold('缺失参数enter') ) }
else if(Argv.out === false) { console.log( color.red.bold('缺失参数out') ) }
else if(Argv.config === false) { console.log( color.red.bold('却是参数config'));}
else{
  ROOT = path.resolve(Argv.root);
  PAGES_PATH = path.resolve(Argv.enter);
  DIST_PATH = path.resolve(Argv.out);
  CONFIG_FILE = path.resolve(Argv.config);
  // 启动
  let startInstance = new Build();

  startInstance.init();
}