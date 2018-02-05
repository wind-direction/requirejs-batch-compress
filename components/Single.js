/**
 * File : Single.js
 * Todo : 处理单个文件
 * author: wind.direction.work@gmail.com
 * Created by wind on 17/5/11.
 */
import shell from 'shelljs';
import dateFormat from 'dateformat';

class Single {

    constructor(module, dist_path, root, configFile) {
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
    setConfigFile() {
        // 定义配置项
        let configItem = Object.assign({}, this.baseConfig);
        // 可以通过父级节点，在paths中增加别名来进行路径的缩短
        configItem['baseUrl'] = this.ROOT_PATH;
        configItem['name'] = this.module.path;
        configItem['out'] = this.DIST_PATH + '/' + this.module.moduleName + '.min.js';
        this.module.configFile =  `${this.DIST_PATH}/build.${this.module.moduleName}.config.js`;
        // 生成文件
        shell.touch(this.module.configFile);
        shell.ShellString('('+JSON.stringify(configItem, null, '  ')+')').to(this.module.configFile);
    }

    init() {
        let module = this.module;
        let _that_ = this;
        // 返回异步执行
        return new Promise( (resolve, reject) => {
            let beginTime = new Date();
            // 生成配置文件
            _that_.setConfigFile();
            // 生成子进程
            let child = shell.exec(`r.js -o ${this.module.configFile}`,{silent:true, async:true});
            let processId = child.pid;
            // 定义错误时退出
            child.stderr.on('data', (data) => { reject(data); });
            // 结束时
            child.on('exit', () => {
                // 删除文件
                shell.rm('-f', _that_.module.configFile);
                let endTime = new Date();
                module.pid = processId;
                module.beginTime = dateFormat(beginTime,"yyyy-mm-dd HH:MM:ss");
                module.endTime = dateFormat(endTime,"yyyy-mm-dd HH:MM:ss");
                module.execTime = endTime.getTime() - beginTime.getTime();
                resolve(module);
            });
        });
    }
}

export default Single;