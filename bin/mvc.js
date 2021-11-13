#!/usr/bin/env node
//上面一行必须要加上不加上找不到node环境可能
const program = require('commander');
const create = require('../lib/create');
program
    .version('0.0.1')
    .command('create <name>')
    .description('create a new vue3 init project')
    .action(name => {
        create(name)
    })

program.parse()