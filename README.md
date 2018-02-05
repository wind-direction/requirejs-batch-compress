# requirejs-batch-compress
AMD规范requireJS的压缩工具r.js的多页批量压缩工具

## 安装

```bash
npm install
cd /path/to/requirejs-batch-compress/
npm link
```

## demo

```bash
r-bc -r ./example -e ./example/src/page -o ./example/static -c example/src/config.js
```

## 一些注意事项

1. 配置文件指的是r.js搭配使用的配置文件。
2. 如果在页面js中需要使用css!... , text!... 等插件，需要在入口文件处给出这些文件的映射。即requirejs.config({ paths: { css: 'css!插件的路径' })。

## 二次开发

本工具本身是对r.js多页的情况下集中压缩的批量化工具。

使用了babel，es6的特性进行源码的开发。如果需要二次开发，则在开发完毕之后，需要再次使用babel进行编译，生成命令。

### 编译输出

```bash
cd /path/to/requirejs-batch-compress/
# 文件改写
babel r-bc.source.js --out-file dist/r-bc.js
# 对组件进行编译
babel components -d dist/components
# 重新link
npm link
```

### 调试阶段的开发

使用babel-node 进行es6脚本的执行。需要全局安装babel-cli

```bash
babel-node r-bc.source.js  -r ./example -e ./example/src/page -o ./example/static -c example/src/config.js
```
