#!/usr/bin/env node
//上面一行必须要加上不加上找不到node环境可能
const program = require('commander');
const create = require('../lib/create');
// 给你一把"螺丝刀"——recast
const recast = require("recast");

// 你的"机器"——一段代码
// 我们使用了很奇怪格式的代码，想测试是否能维持代码结构
const code =
  `
  function add(a, b) {
    return a +
      // 有什么奇怪的东西混进来了
      b
  }
  `
// 用螺丝刀解析机器
const ast = recast.parse(code);

// ast可以处理很巨大的代码文件
// 但我们现在只需要代码块的第一个body，即add函数
const add  = ast.program.body[0]

console.log(add,'adddd')

console.log(add.params[0], 'params')
program
    .version('0.0.1')
    .command('create <name>')
    .description('create a new vue3 init project')
    .action(name => {
        create(name)
    })

program.parse()