/**
 * Created by wind on 17/5/17.
 */
import yargs from 'yargs';

// 设置命令行参数
yargs
  .usage('Usage: $0 <command> [options]')
  .command('r-bc', '批量压缩多页面的代码')
  .example('$0 r-bc -r ./root/path -e ./enter/path -d ./dist/path -c ./config/file/path', '批量压缩多页面的代码')
  .alias('r', 'root')
  .describe('r', '根目录---即 require.config({baseUrl: "xxx" })的目录')
  .alias('e', 'enter')
  .describe('e', '入口文件夹，即多个页面的入口JS所在的文件夹')
  .alias('o', 'out')
  .describe('o', '压缩之后的输出目录')
  .alias('c', 'config')
  .describe('c', '公共配置文件')
  .demandOption(['r','e','o','c'])
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2017');

export default yargs.argv;
